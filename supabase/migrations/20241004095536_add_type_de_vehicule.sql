create type "public"."type_de_vehicule" as enum ('12 T', '19 T', 'VL');

alter table "public"."tournee" add column "type_de_vehicule" type_de_vehicule;


