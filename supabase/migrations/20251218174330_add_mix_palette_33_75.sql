alter table
  "public"."collecte"
add
  column "collecte_casier_palette_mix_75_33" boolean not null default false;

alter table
  "public"."collecte"
add
  column "livraison_casier_palette_mix_75_33" boolean not null default false;