alter table
  "public"."collecte"
add
  column "point_de_massification_id" bigint;

alter table
  "public"."collecte"
add
  constraint "collecte_point_de_massification_id_fkey" FOREIGN KEY (point_de_massification_id) REFERENCES point_de_collecte(id) ON
DELETE
  RESTRICT not valid;

alter table
  "public"."collecte" validate constraint "collecte_point_de_massification_id_fkey";

-- Copie les informations des tournées dans les collectes
UPDATE
  collecte
SET
  point_de_massification_id = tournee.point_de_massification_id
FROM
  tournee
WHERE
  collecte.tournee_id = tournee.id;