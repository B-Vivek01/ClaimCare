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
