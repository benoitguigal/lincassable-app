alter table
  "public"."tournee"
alter column
  "statut" drop default;

alter type "public"."statut_tournee" rename to "statut_tournee__old_version_to_be_dropped";

create type "public"."statut_tournee" as enum (
  'En cours de préparation',
  'En attente de validation par le transporteur',
  'Validé par le transporteur',
  'Réalisé',
  'Clôturé'
);

alter table
  "public"."tournee"
alter column
  statut type "public"."statut_tournee" using statut :: text :: "public"."statut_tournee";

alter table
  "public"."tournee"
alter column
  "statut"
set
  default 'En cours de préparation' :: statut_tournee;

drop type "public"."statut_tournee__old_version_to_be_dropped";

update
  "public"."tournee"
set
  statut = 'Clôturé'
where
  "bon_de_tournee" is not null;

update
  "public"."tournee"
set
  statut = 'Réalisé'
where
  "bon_de_tournee" is null
  and "date" < current_date;