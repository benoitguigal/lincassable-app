alter table
  "public"."point_de_collecte"
add
  column "stock_casiers_75" smallint;

alter table
  "public"."point_de_collecte"
add
  column "stock_paloxs" smallint;

UPDATE
  "public"."point_de_collecte"
SET
  stock_casiers_75 = stock_contenants
where
  contenant_collecte_type = 'casier_x12' :: contenant_collecte_type;

UPDATE
  "public"."point_de_collecte"
SET
  stock_paloxs = stock_contenants
where
  contenant_collecte_type = 'palox' :: contenant_collecte_type;