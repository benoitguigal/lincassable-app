alter table
  "public"."point_de_collecte"
alter column
  "contenant_collecte_type" drop default;

alter type "public"."contenant_collecte_type" rename to "contenant_collecte_type__old_version_to_be_dropped";

create type "public"."contenant_collecte_type" as enum ('casier_x12', 'palox', 'casier_x24');

alter table
  "public"."point_de_collecte"
alter column
  contenant_collecte_type type "public"."contenant_collecte_type" using contenant_collecte_type :: text :: "public"."contenant_collecte_type";

alter table
  "public"."point_de_collecte"
alter column
  "contenant_collecte_type"
set
  default 'casier_x12' :: contenant_collecte_type;

drop type "public"."contenant_collecte_type__old_version_to_be_dropped";

alter table
  "public"."point_de_collecte"
add
  column "stock_casiers_33" smallint not null default '0' :: smallint;

UPDATE
  "public"."point_de_collecte"
set
  "stock_casiers_75" = 0
where
  "stock_casiers_75" is null;

UPDATE
  "public"."point_de_collecte"
set
  "stock_paloxs" = 0
where
  "stock_paloxs" is null;

alter table
  "public"."point_de_collecte"
alter column
  "stock_casiers_75"
set
  not null;

alter table
  "public"."point_de_collecte"
alter column
  "stock_paloxs"
set
  not null;