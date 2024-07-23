CREATE OR REPLACE FUNCTION public.authorize(requested_permission app_permission)
  RETURNS boolean
  AS $$
DECLARE
  bind_permissions int;
  user_role public.app_role;
BEGIN
  -- Fetch user role once and store it to reduce number of calls
  SELECT
    (auth.jwt() ->> 'user_role')::public.app_role INTO user_role;
  SELECT
    count(*) INTO bind_permissions
  FROM
    public.role_permissions
  WHERE
    role_permissions.permission = requested_permission
    AND role_permissions.role = user_role;
  RETURN bind_permissions > 0;
END;
$$
LANGUAGE plpgsql
STABLE
SECURITY DEFINER SET search_path = '';

