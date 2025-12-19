-- Add the column 'contenant_collecte_types' as an array of the enum type
ALTER TABLE
  "public"."point_de_collecte"
ADD
  COLUMN "contenant_collecte_types" "public"."contenant_collecte_type" [ ] NOT NULL DEFAULT ARRAY [ ] :: "public"."contenant_collecte_type" [ ];

-- Met à jour la colonne 'contenant_collecte_types' avec un tableau contenant la valeur de 'contenant_collecte_type'
UPDATE
  "public"."point_de_collecte"
SET
  "contenant_collecte_types" = ARRAY [ "contenant_collecte_type" ];