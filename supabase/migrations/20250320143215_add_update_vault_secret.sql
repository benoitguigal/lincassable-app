CREATE OR REPLACE FUNCTION update_vault_secret(secret_name text, secret_value text)
  RETURNS VOID
  AS $$
DECLARE
  secret_id uuid;
  -- Adapte le type si ce n'est pas un UUID
BEGIN
  -- Récupération de l'ID du secret correspondant au nom donné
  SELECT
    id INTO secret_id
  FROM
    vault.decrypted_secrets
  WHERE
    name = secret_name
  LIMIT 1;
  -- Vérification si un secret correspondant a été trouvé
  IF secret_id IS NOT NULL THEN
    -- Mise à jour du secret
    PERFORM
      vault.update_secret(secret_id, secret_value);
  ELSE
    RAISE NOTICE 'Aucun secret trouvé pour le nom : %', secret_name;
  END IF;
END;
$$
LANGUAGE plpgsql;

