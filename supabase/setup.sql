-- NEW EMPTY PROJECTS ONLY. Existing projects: apply only unapplied numbered migrations.
-- Migration: 001_core.sql
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


-- Migration: 002_payments.sql
begin;
create table public.payment_orders (
  id text primary key,
  invoice_id text not null unique,
  owner_id uuid not null references public.profiles(id),
  amount integer not null check(amount > 0),
  currency text not null default 'INR',
  payment_id text unique,
  status text not null default 'created',
  created_at timestamptz not null default now()
);
alter table public.payment_orders enable row level security;
create policy payment_order_read on public.payment_orders for select to authenticated using (public.current_role() <> 'disabled' and (owner_id=auth.uid() or public.is_staff()));
grant select on public.payment_orders to authenticated;
grant all on public.payment_orders, public.records to service_role;
create function public.lock_invoice_amount() returns trigger language plpgsql set search_path = '' as $$
begin
  if old.collection='invoices' and exists(select 1 from public.payment_orders where invoice_id=old.id)
    and (new.data->'total' is distinct from old.data->'total' or new.owner_id <> old.owner_id) then raise exception 'Invoice amount is locked after checkout begins.'; end if;
  return new;
end;
$$;
create trigger lock_invoice_after_checkout before update on public.records for each row execute function public.lock_invoice_amount();
create function public.finalize_payment(order_id text, provider_payment_id text, payment_method text) returns void language plpgsql security definer set search_path = '' as $$
declare purchase public.payment_orders; invoice public.records; payload jsonb;
begin
  select * into purchase from public.payment_orders where id=order_id for update;
  if not found then raise exception 'Order not found.'; end if;
  if purchase.status='captured' then
    if purchase.payment_id <> provider_payment_id then raise exception 'Order already paid.'; end if;
    return;
  end if;
  select * into invoice from public.records where collection='invoices' and id=purchase.invoice_id for update;
  if not found then raise exception 'Invoice not found.'; end if;
  payload := jsonb_build_object('id',provider_payment_id,'ownerId',purchase.owner_id,'invoiceId',purchase.invoice_id,'transactionId',provider_payment_id,
    'customer',invoice.data->>'customer','policyId',invoice.data->>'policyId','amount',invoice.data->'amount','tax',invoice.data->'tax',
    'total',purchase.amount / 100.0,'method',payment_method,'status','Success','date',now(),'testMode',true,'revision',1);
  insert into public.records(collection,id,owner_id,data) values ('payments',provider_payment_id,purchase.owner_id,payload);
  update public.records set data=data || '{"status":"Paid"}'::jsonb, revision=revision+1, updated_at=now() where collection='invoices' and id=purchase.invoice_id;
  update public.payment_orders set status='captured',payment_id=provider_payment_id where id=order_id;
end;
$$;
revoke all on function public.finalize_payment(text,text,text) from public;
grant execute on function public.finalize_payment(text,text,text) to service_role;
commit;

-- Migration: 003_events.sql
begin;
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  module text not null,
  record_id text not null,
  action text not null,
  created_at timestamptz not null default now()
);
alter table public.audit_events enable row level security;
create policy audit_staff_read on public.audit_events for select to authenticated using(public.is_staff());
grant select on public.audit_events to authenticated;
create function public.record_event() returns trigger language plpgsql security definer set search_path = '' as $$
declare event_id text; notification jsonb; old_status text;
begin
  insert into public.audit_events(actor_id,module,record_id,action) values(auth.uid(),coalesce(new.collection,old.collection),coalesce(new.id,old.id),TG_OP);
  if TG_OP='DELETE' then return old; end if;
  old_status := case when TG_OP='INSERT' then null else old.data->>'status' end;
  if new.collection='claims' and new.data->>'status' <> 'Draft' and (TG_OP='INSERT' or new.data->>'status' is distinct from old_status) then
    event_id := 'NOT-' || gen_random_uuid()::text;
    notification := jsonb_build_object('id',event_id,'ownerId',new.owner_id,'title','Claim status updated','message','Your claim is now ' || (new.data->>'status'),
      'type','Claim','channel','In-App','status','Unread','target','/claims/' || new.id,'createdAt',now());
    insert into public.records(collection,id,owner_id,data) values('notifications',event_id,new.owner_id,notification);
    if TG_OP='INSERT' or old_status='Draft' then
      insert into public.records(collection,id,owner_id,data) values('work_items',new.id,new.owner_id,jsonb_build_object(
        'id',new.id,'ownerId',new.owner_id,'customer',new.data->>'customerName','type',new.data->>'category','status',new.data->>'status',
        'priority',new.data->>'priority','team',coalesce(new.data->>'category','General') || ' Claims','assignedTo','Unassigned',
        'createdAt',now(),'slaHours',48,'elapsedHours',0,'escalation',false)) on conflict(collection,id) do nothing;
    end if;
  end if;
  return new;
end;
$$;
create trigger record_audit_and_notify after insert or update or delete on public.records for each row execute function public.record_event();
create function public.profile_event() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_events(actor_id,module,record_id,action) values(auth.uid(),'profiles',new.id::text,TG_OP);
  return new;
end;
$$;
create trigger profile_audit after update on public.profiles for each row execute function public.profile_event();
revoke all on function public.record_event(), public.profile_event() from public;
commit;

-- Migration: 004_support.sql
begin;
create table public.support_requests(id text primary key,data jsonb not null,created_at timestamptz not null default now());
create function public.submit_support_request(details jsonb) returns text language plpgsql security definer set search_path = '' as $$
declare ticket text; email text;
begin
  email := lower(trim(details->>'email'));
  if email is null or email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or length(email)>254
    or length(trim(coalesce(details->>'name',''))) not between 1 and 150
    or length(trim(coalesce(details->>'subject',''))) not between 1 and 200
    or length(trim(coalesce(details->>'message',''))) not between 10 and 5000 then raise exception 'Enter valid contact details and a message between 10 and 5000 characters.'; end if;
  perform pg_advisory_xact_lock(hashtext(email));
  if (select count(*) from public.support_requests where data->>'email'=email and created_at > now()-interval '1 hour') >= 5 then raise exception 'Too many contact requests. Please try later.'; end if;
  ticket := 'SUP-' || gen_random_uuid()::text;
  insert into public.support_requests(id,data) values(ticket,details || jsonb_build_object('email',email,'status','Open','createdAt',now()));
  return ticket;
end;
$$;
alter table public.support_requests enable row level security;
create policy support_staff_read on public.support_requests for select to authenticated using(public.is_staff());
grant select on public.support_requests to authenticated;
revoke all on function public.submit_support_request(jsonb) from public;
grant execute on function public.submit_support_request(jsonb) to anon,authenticated;
commit;

-- Migration: 005_identity.sql
begin;
create function public.sync_auth_identity() returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set data = data || jsonb_build_object('email',new.email,'emailVerified',new.email_confirmed_at is not null)
    || case when new.phone_confirmed_at is not null then jsonb_build_object('mobile',new.phone,'mobileVerified',true) else '{}'::jsonb end,
    updated_at=now() where id=new.id;
  return new;
end;
$$;
create trigger sync_identity_from_auth after update of email,phone,email_confirmed_at,phone_confirmed_at on auth.users for each row execute function public.sync_auth_identity();
create function public.request_identity_review() returns void language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or public.current_role()='disabled' then raise exception 'Sign in with an active account.'; end if;
  if not exists(select 1 from public.records where collection='documents' and owner_id=auth.uid() and data->>'category'='Identity') then raise exception 'Upload an identity document before requesting review.'; end if;
  update public.profiles set data=data || '{"identityStatus":"pending"}'::jsonb,updated_at=now() where id=auth.uid();
end;
$$;
revoke all on function public.sync_auth_identity(),public.request_identity_review() from public;
grant execute on function public.request_identity_review() to authenticated;
commit;

-- Migration: 006_validation.sql
begin;
create function public.validate_record() returns trigger language plpgsql security definer set search_path='' as $$
declare field text;
begin
  if new.collection='claims' then
    if coalesce(new.data->>'status','') not in ('Draft','Submitted','Under Review','In Review','Escalated','Approved','Rejected','Closed','Reopen Requested') then raise exception 'Invalid claim status.'; end if;
    if new.data->>'status'='Submitted' and (TG_OP='INSERT' or old.data->>'status'='Draft') then
      foreach field in array array['policyNumber','category','incidentDate','incidentType','incidentLocation','incidentDescription'] loop
        if length(trim(coalesce(new.data->>field,'')))=0 then raise exception 'Complete all required claim information before submitting.'; end if;
      end loop;
      if (new.data->>'incidentDate')::date > (now() at time zone 'Asia/Kolkata')::date then raise exception 'Incident date cannot be in the future.'; end if;
    end if;
    if TG_OP='UPDATE' and not public.is_staff() then
      if old.data->>'status'<>'Draft' then
        foreach field in array array['policyNumber','category','incidentDate','incidentType','incidentLocation','incidentDescription'] loop
          if new.data->field is distinct from old.data->field then raise exception 'Submitted incident details require a staff correction.'; end if;
        end loop;
      end if;
      if new.data->'closure' is distinct from old.data->'closure' then raise exception 'Closure review requires staff.'; end if;
    end if;
    if new.data->>'status'='Closed' and coalesce(new.data#>>'{closure,checklistCompleted}','false')<>'true' then raise exception 'Complete the closure checklist first.'; end if;
    if coalesce(new.data->>'archived','false')='true' and new.data->>'status' not in ('Closed','Rejected') then raise exception 'Only completed claims can be archived.'; end if;
  end if;
  if new.collection='documents' then
    if new.data->>'scanStatus' is distinct from 'Not scanned' then raise exception 'A scanning service has not been configured.'; end if;
    if new.data->>'reviewStatus' not in ('Pending','Accepted','Rejected') then raise exception 'Invalid document review status.'; end if;
    if new.data->>'claimId' is not null and not exists(select 1 from public.records where collection='claims' and id=new.data->>'claimId' and owner_id=new.owner_id) then raise exception 'Document must belong to a claim owned by this customer.'; end if;
    if split_part(coalesce(new.data->>'storagePath',''), '/',1)<>new.owner_id::text then raise exception 'Invalid document storage owner.'; end if;
    if new.data->>'reviewStatus'='Rejected' and length(trim(coalesce(new.data->>'reviewReason','')))=0 then raise exception 'Explain why this document was rejected.'; end if;
  end if;
  return new;
end;
$$;
create trigger validate_record_write before insert or update on public.records for each row execute function public.validate_record();
revoke all on function public.validate_record() from public;
commit;

-- Migration: 007_profile_guards.sql
begin;
create function public.validate_profile() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if coalesce(new.data->>'role','customer') not in ('customer','operations','admin') then raise exception 'Invalid account role.'; end if;
  if new.data->>'uid' is distinct from new.id::text then raise exception 'Account identifier cannot change.'; end if;
  if old.data->>'role'='admin' and auth.uid()=new.id and
    (new.data->>'role'<>'admin' or coalesce(new.data->>'disabled','false')='true' or new.data->>'status'='Disabled') then
    raise exception 'An administrator cannot remove their own access.';
  end if;
  return new;
end;
$$;
create trigger validate_profile_update before update on public.profiles for each row execute function public.validate_profile();
revoke all on function public.validate_profile() from public;
commit;

-- Migration: 008_staff_reviews.sql
begin;
alter table public.support_requests add column revision integer not null default 1;
alter table public.support_requests add column updated_at timestamptz not null default now();

create function public.update_support_request(ticket_id text, ticket_status text, internal_note text, expected_revision integer)
returns void language plpgsql security definer set search_path='' as $$
begin
  if not public.is_staff() then raise exception 'Staff access required.'; end if;
  if ticket_status is null or ticket_status not in ('Open','In Progress','Closed') or internal_note is null or length(internal_note)>5000 then raise exception 'Invalid support update.'; end if;
  update public.support_requests
  set data=data || jsonb_build_object('status',ticket_status,'internalNote',internal_note,'updatedBy',auth.uid()),
      revision=revision+1, updated_at=now()
  where id=ticket_id and revision=expected_revision;
  if not found then raise exception 'Ticket changed or no longer exists. Reload and retry.'; end if;
  insert into public.audit_events(actor_id,module,record_id,action) values(auth.uid(),'support_requests',ticket_id,'UPDATE');
end;
$$;

create function public.review_identity(target_id uuid, document_id text, document_revision integer, decision text, reason text)
returns void language plpgsql security definer set search_path='' as $$
declare target public.profiles; identity_document public.records; event_id text;
begin
  if not public.is_staff() then raise exception 'Staff access required.'; end if;
  if decision is null or decision not in ('verified','rejected') or reason is null or length(reason)>2000 or (decision='rejected' and length(trim(reason))=0) then raise exception 'Enter a valid identity decision and rejection reason.'; end if;
  select * into target from public.profiles where id=target_id for update;
  if not found or target.data->>'identityStatus' is distinct from 'pending' then raise exception 'Identity request is not pending.'; end if;
  select * into identity_document from public.records where collection='documents' and id=document_id and owner_id=target_id and data->>'category'='Identity' for update;
  if not found or coalesce(identity_document.data->>'fileType','') not in ('application/pdf','image/jpeg','image/png','image/webp') then raise exception 'Select a valid identity document owned by this customer.'; end if;
  if document_revision is null or identity_document.revision<>document_revision then raise exception 'Document changed. Inspect the current version before reviewing.'; end if;
  if not exists(select 1 from storage.objects where bucket_id='documents' and name=identity_document.data->>'storagePath') then raise exception 'The identity file is missing.'; end if;
  update public.records set data=data || jsonb_build_object('reviewStatus',case when decision='verified' then 'Accepted' else 'Rejected' end,
      'reviewReason',reason,'reviewedBy',auth.uid(),'reviewedAt',now(),'revision',revision+1,'updatedAt',now()),revision=revision+1,updated_at=now()
    where collection='documents' and id=document_id;
  update public.profiles set data=data || jsonb_build_object('identityStatus',decision,'identityReviewReason',reason,'identityReviewedBy',auth.uid(),'identityReviewedAt',now()),updated_at=now() where id=target_id;
  event_id:='NOT-' || gen_random_uuid()::text;
  insert into public.records(collection,id,owner_id,data) values('notifications',event_id,target_id,jsonb_build_object(
    'id',event_id,'ownerId',target_id,'title','Identity review completed','message','Your identity request was ' || decision || case when length(reason)>0 then ': ' || reason else '' end,
    'type','Account','channel','In-App','status','Unread','target','/profile/identity-verification','createdAt',now()));
end;
$$;
revoke all on function public.update_support_request(text,text,text,integer),public.review_identity(uuid,text,integer,text,text) from public;
grant execute on function public.update_support_request(text,text,text,integer),public.review_identity(uuid,text,integer,text,text) to authenticated;
create or replace function public.validate_profile() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if coalesce(new.data->>'role','') not in ('customer','operations','admin') then raise exception 'Invalid account role.'; end if;
  if new.data->>'uid' is distinct from new.id::text then raise exception 'Account identifier cannot change.'; end if;
  if old.data->>'role'='admin' and auth.uid()=new.id and
    (new.data->>'role'<>'admin' or coalesce(new.data->>'disabled','false')='true' or new.data->>'status'='Disabled') then
    raise exception 'An administrator cannot remove their own access.';
  end if;
  return new;
end;
$$;
commit;

-- Migration: 009_claim_progress.sql
begin;
create function public.claim_progress() returns trigger language plpgsql security definer set search_path='' as $$
declare state text; progress integer; next_step text;
begin
  if new.collection<>'claims' then return new; end if;
  state:=new.data->>'status';
  if TG_OP='UPDATE' and old.data->>'status' in ('Closed','Rejected') and state is distinct from old.data->>'status' and state is distinct from 'Reopen Requested' then
    raise exception 'Request reopening before changing a completed claim status.';
  end if;
  progress:=case state when 'Draft' then 0 when 'Submitted' then 25 when 'Under Review' then 50 when 'In Review' then 50 when 'Escalated' then 60 when 'Approved' then 75 when 'Rejected' then 100 when 'Closed' then 100 when 'Reopen Requested' then 25 end;
  next_step:=case state when 'Draft' then 'Complete the claim information.' when 'Submitted' then 'Claim submitted. Wait for review.'
    when 'Under Review' then 'A specialist is reviewing this claim.' when 'In Review' then 'A specialist is reviewing this claim.'
    when 'Escalated' then 'An escalated review is pending.' when 'Approved' then 'Complete the closure review.'
    when 'Rejected' then 'Contact support if you want to request reopening.' when 'Closed' then 'Claim review is complete.'
    when 'Reopen Requested' then 'Wait for staff to review the reopen request.' end;
  new.data:=new.data || jsonb_build_object('progress',progress,'expectedNextStep',next_step);
  return new;
end;
$$;
create trigger claim_progress_write before insert or update on public.records for each row execute function public.claim_progress();
revoke all on function public.claim_progress() from public;
-- Refresh existing records so their displayed progress agrees with their status.
update public.records set data=data where collection='claims';
commit;

-- Migration: 010_document_notifications.sql
begin;
create function public.document_review_notification() returns trigger
language plpgsql security definer set search_path = '' as $$
declare notification_id text;
begin
  if new.collection <> 'documents' or new.data->>'reviewStatus' not in ('Accepted','Rejected') then return new; end if;
  if new.data->>'reviewStatus' is not distinct from old.data->>'reviewStatus' then return new; end if;
  notification_id := 'NOT-' || gen_random_uuid()::text;
  insert into public.records(collection,id,owner_id,data)
  values('notifications',notification_id,new.owner_id,jsonb_build_object(
    'id',notification_id,'ownerId',new.owner_id,'title','Document review updated',
    'message',coalesce(new.data->>'name','Your document') || ': ' || (new.data->>'reviewStatus') ||
      case when nullif(new.data->>'reviewReason','') is null then '' else '. ' || (new.data->>'reviewReason') end,
    'type','Document','channel','In-App','status','Unread','target','/documents/' || new.id,'createdAt',now()));
  return new;
end;
$$;
create trigger document_review_notify after update on public.records
for each row execute function public.document_review_notification();
revoke all on function public.document_review_notification() from public;
commit;

