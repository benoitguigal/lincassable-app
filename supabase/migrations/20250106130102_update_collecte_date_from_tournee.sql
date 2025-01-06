-- Met à jour le champ "date" de chaque collecte avec la date de la tournée associée
UPDATE
  "collecte"
SET
  "date" = (
    SELECT
      "date"
    FROM
      "tournee"
    WHERE
      "tournee"."id" = "collecte"."tournee_id"
  )
WHERE
  "tournee_id" IS NOT NULL;