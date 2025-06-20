create type "public"."destinataire_type" as enum ('emails', 'emails_consigne');

alter table "public"."mail_template" add column "destinataire_type" destinataire_type not null default 'emails'::destinataire_type;


