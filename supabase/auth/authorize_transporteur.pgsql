DECLARE trans_id bigint;

user_role public.app_role;

BEGIN
  -- Fetch user role once and store it to reduce number of calls
  SELECT
    (auth.jwt() ->> 'user_role')::public.app_role INTO user_role;

IF user_role = 'transporteur' THEN
  SELECT
    (auth.jwt() ->> 'transporteur_id') INTO trans_id;

RETURN transporteur = trans_id;

END IF;

RETURN TRUE;

END;

