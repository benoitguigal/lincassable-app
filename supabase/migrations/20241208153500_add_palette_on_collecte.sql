create type "public"."palette_type" as enum ('Europe', 'VMF');

alter table
  "public"."collecte"
add
  column "collecte_casier_75_plein_nb_palette" bigint not null default '0' :: bigint;

alter table
  "public"."collecte"
add
  column "collecte_casier_75_plein_palette_type" palette_type;

alter table
  "public"."collecte"
add
  column "collecte_nb_fut_vide" bigint not null default '0' :: bigint;

alter table
  "public"."collecte"
add
  column "collecte_fut_nb_palette" bigint not null default '0' :: bigint;

alter table
  "public"."collecte"
add
  column "collecte_fut_palette_type" palette_type;

alter table
  "public"."collecte"
add
  column "collecte_nb_palette_vide" bigint not null default '0' :: bigint;

alter table
  "public"."collecte"
add
  column "collecte_palette_vide_type" palette_type;

alter table
  "public"."collecte"
add
  column "livraison_casier_75_vide_nb_palette" bigint not null default '0' :: bigint;

alter table
  "public"."collecte"
add
  column "livraison_casier_75_vide_palette_type" palette_type;

alter table
  "public"."collecte"
add
  column "livraison_nb_fut_vide" bigint not null default '0' :: bigint;

alter table
  "public"."collecte"
add
  column "livraison_fut_nb_palette" bigint not null default '0' :: bigint;

alter table
  "public"."collecte"
add
  column "livraison_fut_palette_type" palette_type;

alter table
  "public"."collecte"
add
  column "livraison_nb_palette_vide" bigint not null default '0' :: bigint;

alter table
  "public"."collecte"
add
  column "livraison_palette_vide_type" palette_type;