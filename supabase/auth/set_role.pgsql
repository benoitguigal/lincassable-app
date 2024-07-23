DECLARE claims jsonb;

user_role public.app_role;

trans_id bigint;

BEGIN
  -- Fetch the user role in the user_roles table
  SELECT
    ROLE INTO user_role
  FROM
    public.user_roles
  WHERE
    user_id =(event ->> 'user_id')::uuid;

claims := event -> 'claims';

IF user_role IS NOT NULL THEN
  -- Set the claim
  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));

ELSE
  claims := jsonb_set(claims, '{user_role}', 'null');

END IF;

IF user_role = 'transporteur' THEN
  SELECT
    transporteur_id INTO trans_id
  FROM
    public.transporteur_users
  WHERE
    user_id =(event ->> 'user_id')::uuid
  LIMIT 1;

IF trans_id IS NOT NULL THEN
  claims := jsonb_set(claims, '{transporteur_id}', to_jsonb(trans_id));

ELSE
  claims := jsonb_set(claims, '{transporteur_id}', 'null');

END IF;

--claims := jsonb_set(claims, '{transporteur_id}', to_jsonb(1));
ELSE
  claims := jsonb_set(claims, '{transporteur_id}', 'null');

END IF;

-- Update the 'claims' object in the original event
event := jsonb_set(event, '{claims}', claims);

-- Return the modified or original event
RETURN event;

END;

-- grant usage on schema public to supabase_auth_admin;
-- grant execute
--   on function public.set_role_and_permissions
--   to supabase_auth_admin;
-- revoke execute
--   on function public.set_role_and_permissions
--   from authenticated, anon, public;
-- grant all
--   on table public.user_roles
-- to supabase_auth_admin;
-- revoke all
--   on table public.user_roles
--   from authenticated, anon, public;
-- grant all
--   on table public.role_permissions
-- to supabase_auth_admin;
-- revoke all
--   on table public.role_permissions
--   from authenticated, anon, public;
-- grant all
--   on table public.transporteur_users
-- to supabase_auth_admin;
-- create policy "Allow auth admin to read user roles" ON public.user_roles
-- as permissive for select
-- to supabase_auth_admin
-- using (true)
-- create policy "Allow auth admin to read user permissions" ON public.role_permissions as permissive for
-- select
-- to supabase_auth_admin using (true)
-- create policy "Allow auth admin to read transporteur users" ON public.transporteur_users as permissive for
-- select
-- to supabase_auth_admin using (true)
