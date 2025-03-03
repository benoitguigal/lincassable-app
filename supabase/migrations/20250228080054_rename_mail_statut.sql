ALTER TABLE
    "public"."mail_statut" RENAME TO mail;

ALTER TABLE
    "public"."mail" RENAME COLUMN email TO "to";

alter table
    "public"."mail"
add
    column "corps" text;

alter table
    "public"."mail"
add
    column "sujet" text;

alter table
    "public"."mail"
add
    column "point_de_collecte_id" bigint;

alter table
    "public"."mail"
add
    constraint "mail_point_de_collecte_id_fkey" FOREIGN KEY (point_de_collecte_id) REFERENCES point_de_collecte(id) ON
UPDATE
    CASCADE ON
DELETE
SET
    NULL not valid;

alter table
    "public"."mail" validate constraint "mail_point_de_collecte_id_fkey";

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
    'prevision.select',
    'mailing.select',
    'mailing.insert',
    'mailing.update',
    'mailing.delete',
    'mail_template.select',
    'mail_statut.select',
    'mail_statut.insert',
    'mail_statut.update'
);

alter table
    "public"."role_permissions"
alter column
    permission type "public"."app_permission" using permission :: text :: "public"."app_permission";

drop type "public"."app_permission__old_version_to_be_dropped";

create policy "Allow update for authorized" on "public"."mail" as permissive for
update
    to authenticated using (
        (
            SELECT
                authorize_user('mail_statut.update' :: text) AS authorize
        )
    );