CREATE OR REPLACE FUNCTION remplissage_contenants_trigger()
  RETURNS TRIGGER
  SECURITY DEFINER
  LANGUAGE 'plpgsql'
  AS $$
DECLARE
  supabase_url text;
  supabase_api_key text;
  request_id bigint;
BEGIN
  -- Get the webhook URL and token from vault
  SELECT
    decrypted_secret INTO supabase_url
  FROM
    vault.decrypted_secrets
  WHERE
    name = 'supabase_url'
  LIMIT 1;
  SELECT
    decrypted_secret INTO supabase_api_key
  FROM
    vault.decrypted_secrets
  WHERE
    name = 'supabase_api_key'
  LIMIT 1;
  -- Send the webhook request
  SELECT
    http_post INTO request_id
  FROM
    net.http_post(supabase_url || '/functions/v1/remplissage_contenants_trigger', jsonb_build_object('old_record', OLD, 'record', NEW, 'type', TG_OP, 'table', TG_TABLE_NAME, 'schema', TG_TABLE_SCHEMA), '{}', jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || supabase_api_key), '5000' -- timeout in ms
);
  -- Insert the request ID into the Supabase hooks table
  INSERT INTO supabase_functions.hooks(hook_table_id, hook_name, request_id)
    VALUES (tg_relid, tg_name, request_id);
  RETURN new;
END;
$$;

CREATE TRIGGER "remplissage_contenants_trigger"
  AFTER INSERT ON "public"."remplissage_contenants"
  FOR EACH ROW
  EXECUTE FUNCTION remplissage_contenants_trigger();

