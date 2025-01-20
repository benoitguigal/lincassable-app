alter type "public"."app_permission" rename to "app_permission__old_version_to_be_dropped";

create type "public"."app_permission" as enum (
  'point_de_collecte.select',
  'point_de_collecte.insert',
  'point_de_collecte.update',
  'point_de_collecte.delete',
  'tournee.select',
  'tournee.insert',
  'tournee.update',
  'tournee.delete',
  'collecte.select',
  'collecte.insert',
  'collecte.update',
  'collecte.delete',
  'transporteur.select',
  'transporteur.insert',
  'transporteur.update',
  'transporteur.delete',
  'transporteur_users.select',
  'transporteur_users.update',
  'transporteur_users.insert',
  'transporteur_users.delete',
  'zone_de_collecte.select',
  'zone_de_collecte.update',
  'zone_de_collecte.insert',
  'zone_de_collecte.delete',
  'prevision.select'
);

alter table
  "public"."role_permissions"
alter column
  permission type "public"."app_permission" using permission :: text :: "public"."app_permission";

drop type "public"."app_permission__old_version_to_be_dropped";

create policy "Allow select for authorized" on "public"."prevision" as permissive for
select
  to authenticated using (
    (
      SELECT
        authorize('prevision.select' :: app_permission) AS authorize
    )
  );