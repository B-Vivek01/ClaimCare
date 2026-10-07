begin;
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create table public.records (
  collection text not null,
  id text not null,
  owner_id uuid not null references public.profiles(id),
  data jsonb not null,
  revision integer not null default 1 check (revision > 0),
  updated_at timestamptz not null default now(),
  primary key (collection, id),
  check (data->>'id' = id)
);
create index records_owner_module on public.records(owner_id, collection);
create index records_module_updated on public.records(collection, updated_at desc);
alter table public.profiles enable row level security;
alter table public.records enable row level security;

create function public.current_role() returns text language sql stable security definer set search_path = '' as $$
  select case when coalesce(data->>'disabled', 'false') = 'true' or data->>'status' = 'Disabled' then 'disabled' else coalesce(data->>'role', 'customer') end
  from public.profiles where id = auth.uid();
$$;
create function public.is_staff() returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(public.current_role() in ('admin', 'operations'), false);
$$;
create policy profile_read on public.profiles for select to authenticated using (id = auth.uid() or public.is_staff());
create policy record_read on public.records for select to authenticated using (
  public.current_role() <> 'disabled' and (owner_id = auth.uid() or public.is_staff())
  and (collection <> 'claim_internal' or public.is_staff())
  and (collection not in ('workflow_rules', 'communication_templates', 'broadcasts', 'reports') or public.is_staff())
);

create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, data) values (new.id, jsonb_build_object(
    'uid', new.id, 'email', new.email, 'name', coalesce(new.raw_user_meta_data->>'name', ''),
    'mobile', coalesce(new.raw_user_meta_data->>'mobile', ''), 'role', 'customer',
    'acceptTerms', coalesce((new.raw_user_meta_data->>'acceptTerms')::boolean, false),
    'acceptPrivacy', coalesce((new.raw_user_meta_data->>'acceptPrivacy')::boolean, false), 'createdAt', now()
  ));
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create function public.update_profile(target_id uuid, changes jsonb) returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or public.current_role() = 'disabled' then raise exception 'Sign in with an active account.'; end if;
  if public.current_role() <> 'admin' then
    if target_id <> auth.uid() or changes ?| array['uid','role','disabled','status','emailVerified','mobileVerified','email','identityStatus'] then
      raise exception 'This profile change is not permitted.';
    end if;
  end if;
  update public.profiles set data = data || changes, updated_at = now() where id = target_id;
  if not found then raise exception 'Profile not found.'; end if;
end;
$$;

create function public.mutate_records(module_name text, mutations jsonb) returns void language plpgsql security definer set search_path = '' as $$
declare
  mutation jsonb; existing public.records; payload jsonb; actor_role text; owner uuid; expected integer;
begin
  actor_role := public.current_role();
  if auth.uid() is null or actor_role is null or actor_role = 'disabled' then raise exception 'Sign in with an active account.'; end if;
  if module_name not in ('claims','policies','documents','claim_internal','addresses','emergency_contacts','notifications','reminders','conversations','work_items','workflow_rules','communication_templates','broadcasts','reports','invoices','refunds') then raise exception 'Unsupported module.'; end if;
  if module_name in ('claim_internal','work_items','workflow_rules','communication_templates','broadcasts','reports','invoices') and not public.is_staff() then raise exception 'Staff access required.'; end if;
  if jsonb_typeof(mutations) <> 'array' or jsonb_array_length(mutations) > 100 then raise exception 'Invalid batch.'; end if;
  for mutation in select value from jsonb_array_elements(mutations) loop
    expected := (mutation->>'expected_revision')::integer;
    select * into existing from public.records where collection = module_name and id = mutation->>'id' for update;
    if found then
      if existing.owner_id <> auth.uid() and not public.is_staff() then raise exception 'Access denied.'; end if;
      if expected <> existing.revision then raise exception 'Record changed in another session. Reload and retry.'; end if;
    elsif expected <> 0 then raise exception 'Record no longer exists.';
    end if;
    if mutation->>'action' = 'delete' then
      if module_name in ('claims','policies') then raise exception 'Archive claims and policies instead of deleting them.'; end if;
      delete from public.records where collection = module_name and id = mutation->>'id';
      continue;
    elsif mutation->>'action' <> 'write' then raise exception 'Invalid action.';
    end if;
    payload := mutation->'data';
    owner := coalesce(existing.owner_id, case when public.is_staff() then (payload->>'ownerId')::uuid else auth.uid() end);
    if payload->>'id' <> mutation->>'id' or (payload->>'ownerId')::uuid <> owner then raise exception 'Record ownership cannot change.'; end if;
    if module_name = 'claims' then
      if payload ? 'internalNotes' and jsonb_array_length(payload->'internalNotes') > 0 then raise exception 'Store internal notes separately.'; end if;
      if existing.id is null and (payload->>'status' not in ('Draft','Submitted') or payload->>'assignedSpecialist' is not null) then raise exception 'Invalid initial claim state.'; end if;
      if existing.id is not null and not public.is_staff() then
        if (payload - array['messages','tags','incidentDate','incidentType','incidentLocation','incidentDescription','notes','policyNumber','category','template','wizardStep','status','progress','timeline','statusHistory','expectedNextStep','closure','archived','revision','updatedAt'])
          is distinct from (existing.data - array['messages','tags','incidentDate','incidentType','incidentLocation','incidentDescription','notes','policyNumber','category','template','wizardStep','status','progress','timeline','statusHistory','expectedNextStep','closure','archived','revision','updatedAt']) then raise exception 'Only staff can change assignment or priority.'; end if;
        if payload->>'status' is distinct from existing.data->>'status' and not (
          (existing.data->>'status' = 'Draft' and payload->>'status' = 'Submitted') or
          (existing.data->>'status' in ('Closed','Rejected') and payload->>'status' = 'Reopen Requested')) then raise exception 'Claim status change requires staff.'; end if;
      end if;
    end if;
    if module_name = 'documents' and not public.is_staff() then
      if (payload->>'reviewStatus' <> 'Pending' and payload->>'reviewStatus' is distinct from existing.data->>'reviewStatus')
        or payload->>'scanStatus' <> 'Not scanned' then raise exception 'Document review requires staff.'; end if;
    end if;
    if module_name = 'invoices' then
      if coalesce((payload->>'total')::numeric, 0) <= 0 or payload->>'status' not in ('Pending','Cancelled') then raise exception 'Invalid invoice.'; end if;
    end if;
    if module_name = 'refunds' then
      if payload->>'status' <> 'Pending' or coalesce((payload->>'amount')::numeric, 0) <= 0 then raise exception 'Invalid refund request.'; end if;
      if not exists(select 1 from public.records where collection='payments' and id=payload->>'paymentId' and owner_id=owner and (data->>'total')::numeric >= (payload->>'amount')::numeric) then raise exception 'Refund does not match a verified payment.'; end if;
    end if;
    payload := payload || jsonb_build_object('ownerId', owner, 'revision', expected + 1, 'updatedAt', now());
    if existing.id is null then
      insert into public.records(collection,id,owner_id,data,revision) values(module_name,mutation->>'id',owner,payload,expected + 1);
    else
      update public.records set data = payload, revision = expected + 1, updated_at = now() where collection = module_name and id = existing.id;
    end if;
  end loop;
end;
$$;
revoke all on function public.handle_new_user() from public;
revoke all on function public.current_role() from public;
revoke all on function public.is_staff() from public;
revoke all on function public.update_profile(uuid,jsonb) from public;
revoke all on function public.mutate_records(text,jsonb) from public;
grant execute on function public.current_role(), public.is_staff(), public.update_profile(uuid,jsonb), public.mutate_records(text,jsonb) to authenticated;
grant select on public.profiles, public.records to authenticated;
revoke insert, update, delete on public.profiles, public.records from anon, authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values ('documents','documents',false,10485760,array['application/pdf','image/jpeg','image/png','image/webp','text/plain']) on conflict(id) do nothing;
create policy document_upload on storage.objects for insert to authenticated with check (
  bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text and public.current_role() <> 'disabled'
);
create policy document_read on storage.objects for select to authenticated using (
  bucket_id = 'documents' and public.current_role() <> 'disabled' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff())
);
commit;

