alter type "public"."type_de_vehicule" rename to "type_de_vehicule__old_version_to_be_dropped";

create type "public"."type_de_vehicule" as enum ('12 T', '19 T', 'VL', 'velo');

alter table "public"."tournee" alter column type_de_vehicule type "public"."type_de_vehicule" using type_de_vehicule::text::"public"."type_de_vehicule";

drop type "public"."type_de_vehicule__old_version_to_be_dropped";


