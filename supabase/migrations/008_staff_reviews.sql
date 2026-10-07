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
