alter table
  "public"."collecte"
add
  column "date" date;

set
  check_function_bodies = off;

CREATE
OR REPLACE FUNCTION public.update_collecte_date_on_insert() RETURNS trigger LANGUAGE plpgsql AS $ function $ BEGIN -- Met à jour la date de la collecte avec la date de la tournée correspondante
UPDATE
  "collecte"
SET
  "date" = (
    SELECT
      "date"
    FROM
      "tournee"
    WHERE
      "id" = NEW."tournee_id"
  )
WHERE
  "id" = NEW."id";

RETURN NEW;

END;

$ function $;

CREATE
OR REPLACE FUNCTION public.update_collectes_on_tournee_date_change() RETURNS trigger LANGUAGE plpgsql AS $ function $ BEGIN -- Met à jour toutes les collectes associées à la tournée dont la date a changé
UPDATE
  "collecte"
SET
  "date" = NEW."date"
WHERE
  "tournee_id" = OLD."id";

RETURN NEW;

END;

$ function $;

CREATE TRIGGER trigger_update_collecte_date_on_insert
AFTER
INSERT
  ON public.collecte FOR EACH ROW EXECUTE FUNCTION update_collecte_date_on_insert();

CREATE TRIGGER trigger_update_collectes_on_tournee_date_change
AFTER
UPDATE
  ON public.tournee FOR EACH ROW EXECUTE FUNCTION update_collectes_on_tournee_date_change();

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