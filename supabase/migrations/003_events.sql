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
