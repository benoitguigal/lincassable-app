alter table "public"."collecte" add column "collecte_casier_33_plein_nb_palette" bigint not null default '0'::bigint;

alter table "public"."collecte" add column "collecte_casier_33_plein_palette_type" palette_type;

alter table "public"."collecte" add column "collecte_nb_casier_33_plein" bigint not null default '0'::bigint;

alter table "public"."collecte" add column "livraison_casier_33_vide_nb_palette" bigint not null default '0'::bigint;

alter table "public"."collecte" add column "livraison_casier_33_vide_palette_type" palette_type;

alter table "public"."collecte" add column "livraison_nb_casier_33_vide" bigint not null default '0'::bigint;


