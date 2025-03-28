create extension if not exists "pg_cron" with schema "extensions";


create table "public"."prevision" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "point_de_collecte_id" bigint not null,
    "date_derniere_collecte" date,
    "date_avant_derniere_collecte" date,
    "nb_bouteilles_derniere_collecte" bigint,
    "nb_bouteilles_avant_derniere_collecte" bigint,
    "capacite" bigint,
    "date_dernier_formulaire_remplissage" date,
    "nb_bouteilles_dernier_formulaire_remplissage" bigint,
    "date_estimation_prochaine_collecte" date,
    "nb_jours_avant_estimation_prochaine_collecte" bigint
);


alter table "public"."prevision" enable row level security;

CREATE UNIQUE INDEX prevision_pkey ON public.prevision USING btree (id);

CREATE UNIQUE INDEX prevision_point_de_collecte_id_key ON public.prevision USING btree (point_de_collecte_id);

alter table "public"."prevision" add constraint "prevision_pkey" PRIMARY KEY using index "prevision_pkey";

alter table "public"."prevision" add constraint "prevision_point_de_collecte_id_fkey" FOREIGN KEY (point_de_collecte_id) REFERENCES point_de_collecte(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."prevision" validate constraint "prevision_point_de_collecte_id_fkey";

alter table "public"."prevision" add constraint "prevision_point_de_collecte_id_key" UNIQUE using index "prevision_point_de_collecte_id_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_prevision()
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
AS $function$WITH
  recent_collectes AS (
    SELECT
      "public"."collecte"."point_de_collecte_id" AS "point_de_collecte_id",
      "public"."collecte"."collecte_nb_bouteilles" AS "collecte_nb_bouteilles",
      "Tournee"."date" AS "date",
      ROW_NUMBER() OVER (
        PARTITION BY
          point_de_collecte_id
        ORDER BY
          "Tournee"."date" DESC
      ) AS rn
    FROM
      "public"."collecte"
      LEFT JOIN "public"."tournee" AS "Tournee" ON "public"."collecte"."tournee_id" = "Tournee"."id"
  ),
  latest_two_collectes AS (
    -- Filtrer pour ne garder que les deux dernières collectes
    SELECT
      *
    FROM
      recent_collectes
    WHERE
      rn <= 2
  ),
  aggregated_data AS (
    -- Agréger les informations des deux dernières collectes
    SELECT
      pc.id AS point_de_collecte_id,
      CASE
        WHEN pc.contenant_collecte_type = CAST('palox' AS "contenant_collecte_type") THEN 550
        ELSE 12 * pc.stock_contenants
      END AS capacite,
      MAX(
        CASE
          WHEN rn = 1 THEN c.date
        END
      ) AS derniere_collecte_date,
      MAX(
        CASE
          WHEN rn = 2 THEN c.date
        END
      ) AS avant_derniere_collecte_date,
      MAX(
        CASE
          WHEN rn = 1 THEN c.collecte_nb_bouteilles
        END
      ) AS derniere_collecte_nb_bouteilles,
      MAX(
        CASE
          WHEN rn = 2 THEN c.collecte_nb_bouteilles
        END
      ) AS avant_derniere_collecte_nb_bouteilles
    FROM
      point_de_collecte pc
      LEFT JOIN latest_two_collectes c ON pc.id = c.point_de_collecte_id
    WHERE
      pc.statut = 'actif'::point_de_collecte_statut
    GROUP BY
      pc.id,
      capacite
  ),
  estimation AS (
    -- Calculer la date estimée de la prochaine collecte
    SELECT
      point_de_collecte_id,
      derniere_collecte_date,
      avant_derniere_collecte_date,
      derniere_collecte_nb_bouteilles,
      avant_derniere_collecte_nb_bouteilles,
      capacite,
      CASE
        WHEN avant_derniere_collecte_date IS NOT NULL THEN derniere_collecte_date + (
          derniere_collecte_date - avant_derniere_collecte_date
        ) * capacite / NULLIF(derniere_collecte_nb_bouteilles::int, 0)
        ELSE NULL
      END AS prochaine_collecte_estimee,
      CASE
        WHEN avant_derniere_collecte_date IS NOT NULL THEN extract(
          day
          from
            derniere_collecte_date + (
              derniere_collecte_date - avant_derniere_collecte_date
            ) * capacite / NULLIF(derniere_collecte_nb_bouteilles::int, 0) - NOW()
        )
        ELSE NULL
      END AS prochaine_collecte_jours
    FROM
      aggregated_data
  )
INSERT INTO
  prevision (
    point_de_collecte_id,
    date_derniere_collecte,
    date_avant_derniere_collecte,
    nb_bouteilles_derniere_collecte,
    nb_bouteilles_avant_derniere_collecte,
    capacite,
    date_estimation_prochaine_collecte,
    nb_jours_avant_estimation_prochaine_collecte
  )
SELECT
  e.point_de_collecte_id,
  e.derniere_collecte_date,
  e.avant_derniere_collecte_date,
  e.derniere_collecte_nb_bouteilles,
  e.avant_derniere_collecte_nb_bouteilles,
  e.capacite,
  e.prochaine_collecte_estimee,
  e.prochaine_collecte_jours
FROM
  estimation e
ON CONFLICT (point_de_collecte_id) DO
UPDATE
SET
  date_derniere_collecte = excluded.date_derniere_collecte,
  date_avant_derniere_collecte = excluded.date_avant_derniere_collecte,
  nb_bouteilles_derniere_collecte = excluded.nb_bouteilles_derniere_collecte,
  nb_bouteilles_avant_derniere_collecte = excluded.nb_bouteilles_avant_derniere_collecte,
  capacite = excluded.capacite,
  date_estimation_prochaine_collecte = excluded.date_estimation_prochaine_collecte,
  nb_jours_avant_estimation_prochaine_collecte = excluded.nb_jours_avant_estimation_prochaine_collecte;$function$
;

grant delete on table "public"."prevision" to "anon";

grant insert on table "public"."prevision" to "anon";

grant references on table "public"."prevision" to "anon";

grant select on table "public"."prevision" to "anon";

grant trigger on table "public"."prevision" to "anon";

grant truncate on table "public"."prevision" to "anon";

grant update on table "public"."prevision" to "anon";

grant delete on table "public"."prevision" to "authenticated";

grant insert on table "public"."prevision" to "authenticated";

grant references on table "public"."prevision" to "authenticated";

grant select on table "public"."prevision" to "authenticated";

grant trigger on table "public"."prevision" to "authenticated";

grant truncate on table "public"."prevision" to "authenticated";

grant update on table "public"."prevision" to "authenticated";

grant delete on table "public"."prevision" to "service_role";

grant insert on table "public"."prevision" to "service_role";

grant references on table "public"."prevision" to "service_role";

grant select on table "public"."prevision" to "service_role";

grant trigger on table "public"."prevision" to "service_role";

grant truncate on table "public"."prevision" to "service_role";

grant update on table "public"."prevision" to "service_role";


