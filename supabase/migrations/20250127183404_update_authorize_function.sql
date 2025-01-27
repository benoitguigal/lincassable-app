drop policy "Allow delete for authorized" on "public"."collecte";

drop policy "Allow insert for authorized" on "public"."collecte";

drop policy "Allow read for authorized" on "public"."collecte";

drop policy "Allow update for authorized" on "public"."collecte";

drop policy "Allow delete for authorized" on "public"."point_de_collecte";

drop policy "Allow insert for authorized" on "public"."point_de_collecte";

drop policy "Allow read for authorized" on "public"."point_de_collecte";

drop policy "Allow update for authorized" on "public"."point_de_collecte";

drop policy "Allow delete for authorized" on "public"."tournee";

drop policy "Allow insert for authorized" on "public"."tournee";

drop policy "Allow select for authorized" on "public"."tournee";

drop policy "Allow update for authorized" on "public"."tournee";

drop policy "Allow delete for authorized" on "public"."transporteur";

drop policy "Allow insert for authorized" on "public"."transporteur";

drop policy "Allow read for authorized" on "public"."transporteur";

drop policy "Allow update for authorized" on "public"."transporteur";

drop policy "Allow delete for authorized" on "public"."transporteur_users";

drop policy "Allow insert for authorized" on "public"."transporteur_users";

drop policy "Allow read for authorized" on "public"."transporteur_users";

drop policy "Allow update for authorized" on "public"."transporteur_users";

drop policy "Allow delete for authorized" on "public"."zone_de_collecte";

drop policy "Allow insert for authorized" on "public"."zone_de_collecte";

drop policy "Allow read for authorized" on "public"."zone_de_collecte";

drop policy "Allow update for authorized" on "public"."zone_de_collecte";

drop function if exists "public"."authorize"(requested_permission app_permission);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize_user(requested_permission text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  bind_permissions int;
  user_role public.app_role;
begin
  -- Fetch user role once and store it to reduce number of calls
  select (auth.jwt() ->> 'user_role')::public.app_role into user_role;

  select count(*)
  into bind_permissions
  from public.role_permissions
  where role_permissions.permission = requested_permission::app_permission
    and role_permissions.role = user_role;

  return bind_permissions > 0;
end;$function$
;

create policy "Allow delete for authorized"
on "public"."collecte"
as permissive
for delete
to authenticated
using (( SELECT authorize_user('collecte.delete'::text) AS authorize));


create policy "Allow insert for authorized"
on "public"."collecte"
as permissive
for insert
to authenticated
with check (( SELECT authorize_user('collecte.insert'::text) AS authorize));


create policy "Allow read for authorized"
on "public"."collecte"
as permissive
for select
to authenticated
using (( SELECT authorize_user('collecte.select'::text) AS authorize));


create policy "Allow update for authorized"
on "public"."collecte"
as permissive
for update
to authenticated
using (( SELECT authorize_user('collecte.update'::text) AS authorize));


create policy "Allow delete for authorized"
on "public"."point_de_collecte"
as permissive
for delete
to authenticated
using (( SELECT authorize_user('point_de_collecte.delete'::text) AS authorize));


create policy "Allow insert for authorized"
on "public"."point_de_collecte"
as permissive
for insert
to authenticated
with check (( SELECT authorize_user('point_de_collecte.insert'::text) AS authorize));


create policy "Allow read for authorized"
on "public"."point_de_collecte"
as permissive
for select
to authenticated
using (( SELECT authorize_user('point_de_collecte.select'::text) AS authorize));


create policy "Allow update for authorized"
on "public"."point_de_collecte"
as permissive
for update
to authenticated
using (( SELECT authorize_user('point_de_collecte.update'::text) AS authorize));


create policy "Allow delete for authorized"
on "public"."tournee"
as permissive
for delete
to authenticated
using (( SELECT authorize_user('tournee.delete'::text) AS authorize));


create policy "Allow insert for authorized"
on "public"."tournee"
as permissive
for insert
to authenticated
with check (( SELECT authorize_user('tournee.insert'::text) AS authorize));


create policy "Allow select for authorized"
on "public"."tournee"
as permissive
for select
to authenticated
using ((( SELECT authorize_user('tournee.select'::text) AS authorize) AND authorize_transporteur(transporteur_id)));


create policy "Allow update for authorized"
on "public"."tournee"
as permissive
for update
to authenticated
using (( SELECT authorize_user('tournee.update'::text) AS authorize));


create policy "Allow delete for authorized"
on "public"."transporteur"
as permissive
for delete
to authenticated
using (( SELECT authorize_user('transporteur.delete'::text) AS authorize));


create policy "Allow insert for authorized"
on "public"."transporteur"
as permissive
for insert
to authenticated
with check (( SELECT authorize_user('transporteur.insert'::text) AS authorize));


create policy "Allow read for authorized"
on "public"."transporteur"
as permissive
for select
to authenticated
using (( SELECT authorize_user('transporteur.select'::text) AS authorize));


create policy "Allow update for authorized"
on "public"."transporteur"
as permissive
for update
to authenticated
using (( SELECT authorize_user('transporteur.update'::text) AS authorize));


create policy "Allow delete for authorized"
on "public"."transporteur_users"
as permissive
for delete
to authenticated
using (( SELECT authorize_user('transporteur_users.delete'::text) AS authorize));


create policy "Allow insert for authorized"
on "public"."transporteur_users"
as permissive
for insert
to authenticated
with check (( SELECT authorize_user('transporteur_users.insert'::text) AS authorize));


create policy "Allow read for authorized"
on "public"."transporteur_users"
as permissive
for select
to authenticated
using (( SELECT authorize_user('transporteur_users.select'::text) AS authorize));


create policy "Allow update for authorized"
on "public"."transporteur_users"
as permissive
for update
to authenticated
using (( SELECT authorize_user('transporteur_users.update'::text) AS authorize));


create policy "Allow delete for authorized"
on "public"."zone_de_collecte"
as permissive
for delete
to authenticated
using (( SELECT authorize_user('zone_de_collecte.delete'::text) AS authorize));


create policy "Allow insert for authorized"
on "public"."zone_de_collecte"
as permissive
for insert
to authenticated
with check (( SELECT authorize_user('zone_de_collecte.insert'::text) AS authorize));


create policy "Allow read for authorized"
on "public"."zone_de_collecte"
as permissive
for select
to authenticated
using (( SELECT authorize_user('zone_de_collecte.select'::text) AS authorize));


create policy "Allow update for authorized"
on "public"."zone_de_collecte"
as permissive
for update
to authenticated
using (( SELECT authorize_user('zone_de_collecte.update'::text) AS authorize));



