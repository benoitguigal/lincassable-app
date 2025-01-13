drop policy "Allow insert for everyone" on "public"."remplissage_contenants";

drop policy "Allow read for everyone" on "public"."remplissage_contenants";

revoke delete on table "public"."role_permissions"
from
  "anon";

revoke
insert
  on table "public"."role_permissions"
from
  "anon";

revoke references on table "public"."role_permissions"
from
  "anon";

revoke
select
  on table "public"."role_permissions"
from
  "anon";

revoke trigger on table "public"."role_permissions"
from
  "anon";

revoke truncate on table "public"."role_permissions"
from
  "anon";

revoke
update
  on table "public"."role_permissions"
from
  "anon";

revoke delete on table "public"."role_permissions"
from
  "authenticated";

revoke
insert
  on table "public"."role_permissions"
from
  "authenticated";

revoke references on table "public"."role_permissions"
from
  "authenticated";

revoke
select
  on table "public"."role_permissions"
from
  "authenticated";

revoke trigger on table "public"."role_permissions"
from
  "authenticated";

revoke truncate on table "public"."role_permissions"
from
  "authenticated";

revoke
update
  on table "public"."role_permissions"
from
  "authenticated";

revoke delete on table "public"."user_roles"
from
  "anon";

revoke
insert
  on table "public"."user_roles"
from
  "anon";

revoke references on table "public"."user_roles"
from
  "anon";

revoke
select
  on table "public"."user_roles"
from
  "anon";

revoke trigger on table "public"."user_roles"
from
  "anon";

revoke truncate on table "public"."user_roles"
from
  "anon";

revoke
update
  on table "public"."user_roles"
from
  "anon";

revoke delete on table "public"."user_roles"
from
  "authenticated";

revoke
insert
  on table "public"."user_roles"
from
  "authenticated";

revoke references on table "public"."user_roles"
from
  "authenticated";

revoke
select
  on table "public"."user_roles"
from
  "authenticated";

revoke trigger on table "public"."user_roles"
from
  "authenticated";

revoke truncate on table "public"."user_roles"
from
  "authenticated";

revoke
update
  on table "public"."user_roles"
from
  "authenticated";

drop function if exists "public"."update_prevision"();

create policy "Allow insert for everyone" on "public"."remplissage_contenants" as permissive for
insert
  to anon,
  authenticated with check (true);

create policy "Allow read for everyone" on "public"."remplissage_contenants" as permissive for
select
  to anon,
  authenticated using (true);