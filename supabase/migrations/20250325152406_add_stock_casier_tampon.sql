alter table
  "public"."point_de_collecte"
add
  column "stock_casiers_33_tampon" smallint not null default '0' :: smallint;

alter table
  "public"."point_de_collecte"
add
  column "stock_casiers_75_tampon" smallint not null default '0' :: smallint;

alter table
  "public"."point_de_collecte"
alter column
  "stock_casiers_75"
set
  default '0' :: smallint;

alter table
  "public"."point_de_collecte"
alter column
  "stock_paloxs"
set
  default '0' :: smallint;