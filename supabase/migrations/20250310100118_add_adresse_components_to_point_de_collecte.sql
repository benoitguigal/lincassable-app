alter table
  "public"."point_de_collecte"
add
  column "adresse_code_postal" text;

alter table
  "public"."point_de_collecte"
add
  column "adresse_numero" text;

alter table
  "public"."point_de_collecte"
add
  column "adresse_rue" text;

alter table
  "public"."point_de_collecte"
add
  column "adresse_ville" text;