alter type "public"."app_permission" rename to "app_permission__old_version_to_be_dropped";

create type "public"."app_permission" as enum ('point_de_collecte.select', 'point_de_collecte.insert', 'point_de_collecte.update', 'point_de_collecte.delete', 'tournee.select', 'tournee.insert', 'tournee.update', 'tournee.delete', 'collecte.select', 'collecte.insert', 'collecte.update', 'collecte.delete', 'transporteur.select', 'transporteur.insert', 'transporteur.update', 'transporteur.delete', 'transporteur_users.select', 'transporteur_users.update', 'transporteur_users.insert', 'transporteur_users.delete', 'zone_de_collecte.select', 'zone_de_collecte.update', 'zone_de_collecte.insert', 'zone_de_collecte.delete', 'prevision.select');

alter table "public"."role_permissions" alter column permission type "public"."app_permission" using permission::text::"public"."app_permission";

drop type "public"."app_permission__old_version_to_be_dropped";

create policy "Allow select for authorized"
on "public"."prevision"
as permissive
for select
to authenticated
using (( SELECT authorize('prevision.select'::app_permission) AS authorize));


CREATE TRIGGER "taux-de-remplissage-insert" AFTER INSERT ON public.remplissage_contenants FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://tnlgdonwteekffzmibnz.supabase.co/functions/v1/send_discord_message_taux_de_remplissage_insert', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubGdkb253dGVla2Zmem1pYm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUxNzA4MDAsImV4cCI6MjAyMDc0NjgwMH0.smztsSY5CxT6EQxOBvfyRiDNVNmU2mltThtymTxV_Lg"}', '{}', '5000');

CREATE TRIGGER "tournee-updated" AFTER UPDATE ON public.tournee FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://tnlgdonwteekffzmibnz.supabase.co/functions/v1/send_discord_message_tournee_update', 'POST', '{"Content-type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRubGdkb253dGVla2Zmem1pYm56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUxNzA4MDAsImV4cCI6MjAyMDc0NjgwMH0.smztsSY5CxT6EQxOBvfyRiDNVNmU2mltThtymTxV_Lg"}', '{}', '5000');


