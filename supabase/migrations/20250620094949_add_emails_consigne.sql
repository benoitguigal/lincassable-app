alter table
  "public"."point_de_collecte"
add
  column "emails_consigne" "text" [ ] DEFAULT '{}' :: "text" [ ] NOT NULL;

update
  "public"."point_de_collecte"
set
  "emails_consigne" = "emails";