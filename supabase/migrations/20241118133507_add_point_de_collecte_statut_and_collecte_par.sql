create type "public"."point_de_collecte_statut" as enum ('archive', 'actif');

alter table "public"."point_de_collecte" add column "collecte_par_id" bigint;

alter table "public"."point_de_collecte" add column "statut" point_de_collecte_statut not null default 'actif'::point_de_collecte_statut;

alter table "public"."point_de_collecte" add constraint "point_de_collecte_collecte_par_id_fkey" FOREIGN KEY (collecte_par_id) REFERENCES point_de_collecte(id) ON DELETE SET NULL not valid;

alter table "public"."point_de_collecte" validate constraint "point_de_collecte_collecte_par_id_fkey";


