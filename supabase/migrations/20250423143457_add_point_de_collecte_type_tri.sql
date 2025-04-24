alter type "public"."point_de_collecte_type" rename to "point_de_collecte_type__old_version_to_be_dropped";

create type "public"."point_de_collecte_type" as enum ('Magasin', 'Producteur', 'Massification', 'Tri');

alter table "public"."point_de_collecte" alter column type type "public"."point_de_collecte_type" using type::text::"public"."point_de_collecte_type";

drop type "public"."point_de_collecte_type__old_version_to_be_dropped";


