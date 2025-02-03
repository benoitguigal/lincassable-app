alter type "public"."app_permission" rename to "app_permission__old_version_to_be_dropped";

create type "public"."app_permission" as enum ('point_de_collecte.select', 'point_de_collecte.insert', 'point_de_collecte.update', 'point_de_collecte.delete', 'tournee.select', 'tournee.insert', 'tournee.update', 'tournee.delete', 'collecte.select', 'collecte.insert', 'collecte.update', 'collecte.delete', 'transporteur.select', 'transporteur.insert', 'transporteur.update', 'transporteur.delete', 'transporteur_users.select', 'transporteur_users.update', 'transporteur_users.insert', 'transporteur_users.delete', 'zone_de_collecte.select', 'zone_de_collecte.update', 'zone_de_collecte.insert', 'zone_de_collecte.delete', 'prevision.select', 'mailing.select', 'mailing.insert', 'mailing.update', 'mailing.delete', 'mail_template.select', 'mail_statut.select', 'mail_statut.insert');

create table "public"."mail_statut" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "mailing_id" bigint not null,
    "email" text not null,
    "statut" text not null
);


alter table "public"."mail_statut" enable row level security;

alter table "public"."role_permissions" alter column permission type "public"."app_permission" using permission::text::"public"."app_permission";

drop type "public"."app_permission__old_version_to_be_dropped";

CREATE UNIQUE INDEX mail_statut_pkey ON public.mail_statut USING btree (id);

alter table "public"."mail_statut" add constraint "mail_statut_pkey" PRIMARY KEY using index "mail_statut_pkey";

alter table "public"."mail_statut" add constraint "mail_statut_mailing_id_fkey" FOREIGN KEY (mailing_id) REFERENCES mailing(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."mail_statut" validate constraint "mail_statut_mailing_id_fkey";

grant delete on table "public"."mail_statut" to "anon";

grant insert on table "public"."mail_statut" to "anon";

grant references on table "public"."mail_statut" to "anon";

grant select on table "public"."mail_statut" to "anon";

grant trigger on table "public"."mail_statut" to "anon";

grant truncate on table "public"."mail_statut" to "anon";

grant update on table "public"."mail_statut" to "anon";

grant delete on table "public"."mail_statut" to "authenticated";

grant insert on table "public"."mail_statut" to "authenticated";

grant references on table "public"."mail_statut" to "authenticated";

grant select on table "public"."mail_statut" to "authenticated";

grant trigger on table "public"."mail_statut" to "authenticated";

grant truncate on table "public"."mail_statut" to "authenticated";

grant update on table "public"."mail_statut" to "authenticated";

grant delete on table "public"."mail_statut" to "service_role";

grant insert on table "public"."mail_statut" to "service_role";

grant references on table "public"."mail_statut" to "service_role";

grant select on table "public"."mail_statut" to "service_role";

grant trigger on table "public"."mail_statut" to "service_role";

grant truncate on table "public"."mail_statut" to "service_role";

grant update on table "public"."mail_statut" to "service_role";

create policy "Allow insert for authorized"
on "public"."mail_statut"
as permissive
for insert
to authenticated
with check (( SELECT authorize_user('mail_statut.insert'::text) AS authorize));


create policy "Allow select for authorized"
on "public"."mail_statut"
as permissive
for select
to authenticated
using (( SELECT authorize_user('mail_statut.select'::text) AS authorize));



