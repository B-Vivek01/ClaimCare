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
