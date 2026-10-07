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
