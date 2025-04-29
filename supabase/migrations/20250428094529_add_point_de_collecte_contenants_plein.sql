alter table
  "public"."point_de_collecte"
add
  column "stock_casiers_33_plein" smallint;

alter table
  "public"."point_de_collecte"
add
  column "stock_paloxs_plein" smallint;

alter table
  "public"."point_de_collecte" drop column "stock_casiers_75_plein_prevision";