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
