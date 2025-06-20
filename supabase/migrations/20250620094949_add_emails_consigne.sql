alter table
  "public"."point_de_collecte"
add
  column "emails_consigne" text;

update
  "public"."point_de_collecte"
set
  "emails_consigne" = "emails";

alter table
  "public"."point_de_collecte"
alter column
  "emails_consigne"
set
  not null;