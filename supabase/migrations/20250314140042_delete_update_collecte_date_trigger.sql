drop trigger if exists "trigger_update_collecte_date_on_insert" on "public"."collecte";

drop function if exists "public"."update_collecte_date_on_insert"();

drop function if exists "public"."update_collectes_on_tournee_date_change"();