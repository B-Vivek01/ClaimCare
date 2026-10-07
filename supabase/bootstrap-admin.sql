-- Run separately in the Supabase SQL Editor for this project's owner.
-- This bootstraps one known registered account only when no administrator exists.
update public.profiles
set data = data || '{"role":"admin","status":"Active","disabled":false}'::jsonb,
    updated_at = now()
where id = (select id from auth.users where email = 'vivekbandaru555@gmail.com')
  and not exists(select 1 from public.profiles where data->>'role'='admin')
returning id, data->>'email' as email, data->>'role' as role;

-- If no row is returned, an administrator already exists or this email has
-- no registered profile. Check Authentication > Users rather than rerunning setup.sql.
