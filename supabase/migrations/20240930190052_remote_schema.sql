SET
    statement_timeout = 0;

SET
    lock_timeout = 0;

SET
    idle_in_transaction_session_timeout = 0;

SET
    client_encoding = 'UTF8';

SET
    standard_conforming_strings = on;

SELECT
    pg_catalog.set_config('search_path', '', false);

SET
    check_function_bodies = false;

SET
    xmloption = content;

SET
    client_min_messages = warning;

SET
    row_security = off;

CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."app_permission" AS ENUM (
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
    'zone_de_collecte.delete'
);

ALTER TYPE "public"."app_permission" OWNER TO "postgres";

CREATE TYPE "public"."app_role" AS ENUM ('staff', 'transporteur');

ALTER TYPE "public"."app_role" OWNER TO "postgres";

CREATE TYPE "public"."contenant_collecte_type" AS ENUM ('casier_x12', 'palox');

ALTER TYPE "public"."contenant_collecte_type" OWNER TO "postgres";

CREATE TYPE "public"."point_de_collecte_type" AS ENUM (
    'Magasin',
    'Producteur',
    'Massification'
);

ALTER TYPE "public"."point_de_collecte_type" OWNER TO "postgres";

CREATE TYPE "public"."statut_tournee" AS ENUM ('En attente de validation', 'Validé');

ALTER TYPE "public"."statut_tournee" OWNER TO "postgres";

COMMENT ON TYPE "public"."statut_tournee" IS 'Statut d''une tournée';

CREATE
OR REPLACE FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") RETURNS boolean LANGUAGE "plpgsql" STABLE SECURITY DEFINER
SET
    "search_path" TO '' AS $$
declare
    bind_permissions int;

user_role public .app_role;

begin
    -- Fetch user role once and store it to reduce number of calls
    select
        (auth.jwt() ->> 'user_role') :: public .app_role into user_role;

select
    count(*) into bind_permissions
from
    public .role_permissions
where
    role_permissions.permission = requested_permission
    and role_permissions.role = user_role;

return bind_permissions > 0;

end;

$$;

ALTER FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") OWNER TO "postgres";

CREATE
OR REPLACE FUNCTION "public"."authorize_transporteur"("transporteur" bigint) RETURNS boolean LANGUAGE "plpgsql" SECURITY DEFINER AS $$DECLARE trans_id bigint;

user_role public .app_role;

BEGIN
    -- Fetch user role once and store it to reduce number of calls
    SELECT
        (auth.jwt() ->> 'user_role') :: public .app_role INTO user_role;

IF user_role = 'transporteur' THEN
SELECT
    (auth.jwt() ->> 'transporteur_id') INTO trans_id;

RETURN transporteur = trans_id;

END IF;

RETURN TRUE;

END;

$$;

ALTER FUNCTION "public"."authorize_transporteur"("transporteur" bigint) OWNER TO "postgres";

CREATE
OR REPLACE FUNCTION "public"."set_role"("event" "jsonb") RETURNS "jsonb" LANGUAGE "plpgsql" STABLE AS $$DECLARE claims jsonb;

user_role public .app_role;

trans_id bigint;

BEGIN
    -- Fetch the user role in the user_roles table
    SELECT
        ROLE INTO user_role
    FROM
        public .user_roles
    WHERE
        user_id =(event ->> 'user_id') :: uuid;

claims := event -> 'claims';

IF user_role IS NOT NULL THEN -- Set the claim
claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));

ELSE claims := jsonb_set(claims, '{user_role}', 'null');

END IF;

IF user_role = 'transporteur' THEN
SELECT
    transporteur_id INTO trans_id
FROM
    public .transporteur_users
WHERE
    user_id =(event ->> 'user_id') :: uuid
LIMIT
    1;

IF trans_id IS NOT NULL THEN claims := jsonb_set(claims, '{transporteur_id}', to_jsonb(trans_id));

ELSE claims := jsonb_set(claims, '{transporteur_id}', 'null');

END IF;

ELSE claims := jsonb_set(claims, '{transporteur_id}', 'null');

END IF;

-- Update the 'claims' object in the original event
event := jsonb_set(event, '{claims}', claims);

-- Return the modified or original event
RETURN event;

END;

$$;

ALTER FUNCTION "public"."set_role"("event" "jsonb") OWNER TO "postgres";

SET
    default_tablespace = '';

SET
    default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."transporteur" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "nom" "text" NOT NULL,
    "entrepot_id" bigint
);

ALTER TABLE
    "public"."transporteur" OWNER TO "postgres";

ALTER TABLE
    "public"."transporteur"
ALTER COLUMN
    "id"
ADD
    GENERATED BY DEFAULT AS IDENTITY (
        SEQUENCE NAME "public"."Transporteur_id_seq"
        START WITH
            1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
    );

CREATE TABLE IF NOT EXISTS "public"."collecte" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "point_de_collecte_id" bigint NOT NULL,
    "tournee_id" bigint,
    "collecte_nb_casier_75_plein" bigint DEFAULT '0' :: bigint NOT NULL,
    "livraison_nb_casier_75_vide" bigint DEFAULT '0' :: bigint NOT NULL,
    "collecte_nb_palox_plein" bigint DEFAULT '0' :: bigint NOT NULL,
    "livraison_nb_palox_vide" bigint DEFAULT '0' :: bigint NOT NULL,
    "collecte_nb_palette_bouteille" bigint DEFAULT '0' :: bigint NOT NULL,
    "livraison_nb_palette_bouteille" bigint DEFAULT '0' :: bigint NOT NULL,
    "collecte_nb_bouteilles" bigint DEFAULT '0' :: bigint NOT NULL
);

ALTER TABLE
    "public"."collecte" OWNER TO "postgres";

ALTER TABLE
    "public"."collecte"
ALTER COLUMN
    "id"
ADD
    GENERATED BY DEFAULT AS IDENTITY (
        SEQUENCE NAME "public"."collecte_id_seq"
        START WITH
            1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
    );

CREATE TABLE IF NOT EXISTS "public"."point_de_collecte" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "nom" "text" NOT NULL,
    "adresse" "text" NOT NULL,
    "type" "public"."point_de_collecte_type" NOT NULL,
    "setup_date" "date",
    "horaires" "text",
    "info" "text",
    "latitude" double precision,
    "longitude" double precision,
    "emails" "text" [ ] DEFAULT '{}' :: "text" [ ] NOT NULL,
    "contacts" "text" [ ] DEFAULT '{}' :: "text" [ ] NOT NULL,
    "telephones" "text" [ ] DEFAULT '{}' :: "text" [ ] NOT NULL,
    "contenant_collecte_type" "public"."contenant_collecte_type" DEFAULT 'casier_x12' :: "public"."contenant_collecte_type",
    "stock_contenants" smallint,
    "zone_de_collecte_id" bigint
);

ALTER TABLE
    "public"."point_de_collecte" OWNER TO "postgres";

ALTER TABLE
    "public"."point_de_collecte"
ALTER COLUMN
    "id"
ADD
    GENERATED BY DEFAULT AS IDENTITY (
        SEQUENCE NAME "public"."point_de_collecte_id_seq"
        START WITH
            1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
    );

CREATE TABLE IF NOT EXISTS "public"."remplissage_contenants" (
    "id" bigint NOT NULL,
    "date" "date" DEFAULT "now"() NOT NULL,
    "nb_casiers_plein" smallint,
    "nb_casiers_total" smallint,
    "point_de_collecte_id" bigint NOT NULL,
    "remplissage_palox" smallint
);

ALTER TABLE
    "public"."remplissage_contenants" OWNER TO "postgres";

COMMENT ON TABLE "public"."remplissage_contenants" IS 'Taux de remplissage des casiers et paloxs en points de collecte';

ALTER TABLE
    "public"."remplissage_contenants"
ALTER COLUMN
    "id"
ADD
    GENERATED BY DEFAULT AS IDENTITY (
        SEQUENCE NAME "public"."remplissage_casiers_id_seq"
        START WITH
            1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
    );

CREATE TABLE IF NOT EXISTS "public"."role_permissions" (
    "id" bigint NOT NULL,
    "role" "public"."app_role" NOT NULL,
    "permission" "public"."app_permission" NOT NULL
);

ALTER TABLE
    "public"."role_permissions" OWNER TO "postgres";

COMMENT ON TABLE "public"."role_permissions" IS 'Application permissions for each role';

ALTER TABLE
    "public"."role_permissions"
ALTER COLUMN
    "id"
ADD
    GENERATED BY DEFAULT AS IDENTITY (
        SEQUENCE NAME "public"."role_permissions_id_seq"
        START WITH
            1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
    );

CREATE TABLE IF NOT EXISTS "public"."tournee" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "date" "date" NOT NULL,
    "point_de_massification_id" bigint NOT NULL,
    "transporteur_id" bigint NOT NULL,
    "zone_de_collecte_id" bigint NOT NULL,
    "statut" "public"."statut_tournee" DEFAULT 'En attente de validation' :: "public"."statut_tournee" NOT NULL,
    "prix" real
);

ALTER TABLE
    "public"."tournee" OWNER TO "postgres";

ALTER TABLE
    "public"."tournee"
ALTER COLUMN
    "id"
ADD
    GENERATED BY DEFAULT AS IDENTITY (
        SEQUENCE NAME "public"."tournee_id_seq"
        START WITH
            1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
    );

CREATE TABLE IF NOT EXISTS "public"."transporteur_users" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "transporteur_id" bigint NOT NULL,
    "user_id" "uuid"
);

ALTER TABLE
    "public"."transporteur_users" OWNER TO "postgres";

COMMENT ON TABLE "public"."transporteur_users" IS 'Liste des utilisateurs appartenant à un transporteur';

ALTER TABLE
    "public"."transporteur_users"
ALTER COLUMN
    "id"
ADD
    GENERATED BY DEFAULT AS IDENTITY (
        SEQUENCE NAME "public"."transporter_users_id_seq"
        START WITH
            1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
    );

CREATE TABLE IF NOT EXISTS "public"."user_roles" (
    "id" bigint NOT NULL,
    "role" "public"."app_role",
    "user_id" "uuid" NOT NULL
);

ALTER TABLE
    "public"."user_roles" OWNER TO "postgres";

COMMENT ON TABLE "public"."user_roles" IS 'Application role for users';

ALTER TABLE
    "public"."user_roles"
ALTER COLUMN
    "id"
ADD
    GENERATED BY DEFAULT AS IDENTITY (
        SEQUENCE NAME "public"."user_roles_id_seq"
        START WITH
            1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
    );

CREATE TABLE IF NOT EXISTS "public"."zone_de_collecte" (
    "id" bigint NOT NULL,
    "nom" "text" NOT NULL
);

ALTER TABLE
    "public"."zone_de_collecte" OWNER TO "postgres";

ALTER TABLE
    "public"."zone_de_collecte"
ALTER COLUMN
    "id"
ADD
    GENERATED BY DEFAULT AS IDENTITY (
        SEQUENCE NAME "public"."zone_de_collecte_id_seq"
        START WITH
            1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1
    );

ALTER TABLE
    ONLY "public"."transporteur"
ADD
    CONSTRAINT "Transporteur_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."collecte"
ADD
    CONSTRAINT "collecte_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."point_de_collecte"
ADD
    CONSTRAINT "point_de_collecte_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."remplissage_contenants"
ADD
    CONSTRAINT "remplissage_casiers_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."role_permissions"
ADD
    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."tournee"
ADD
    CONSTRAINT "tournee_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."transporteur_users"
ADD
    CONSTRAINT "transporter_users_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."user_roles"
ADD
    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."zone_de_collecte"
ADD
    CONSTRAINT "zone_de_collecte_pkey" PRIMARY KEY ("id");

ALTER TABLE
    ONLY "public"."transporteur"
ADD
    CONSTRAINT "Transporteur_entrepot_id_fkey" FOREIGN KEY ("entrepot_id") REFERENCES "public"."point_de_collecte"("id");

ALTER TABLE
    ONLY "public"."collecte"
ADD
    CONSTRAINT "collecte_point_de_collecte_id_fkey" FOREIGN KEY ("point_de_collecte_id") REFERENCES "public"."point_de_collecte"("id") ON
DELETE
    RESTRICT;

ALTER TABLE
    ONLY "public"."collecte"
ADD
    CONSTRAINT "collecte_tournee_id_fkey" FOREIGN KEY ("tournee_id") REFERENCES "public"."tournee"("id") ON
DELETE
    CASCADE;

ALTER TABLE
    ONLY "public"."point_de_collecte"
ADD
    CONSTRAINT "point_de_collecte_zone_de_collecte_id_fkey" FOREIGN KEY ("zone_de_collecte_id") REFERENCES "public"."zone_de_collecte"("id") ON
DELETE
SET
    NULL;

ALTER TABLE
    ONLY "public"."remplissage_contenants"
ADD
    CONSTRAINT "remplissage_casiers_point_de_collecte_id_fkey" FOREIGN KEY ("point_de_collecte_id") REFERENCES "public"."point_de_collecte"("id") ON
DELETE
    CASCADE;

ALTER TABLE
    ONLY "public"."tournee"
ADD
    CONSTRAINT "tournee_point_de_massification_id_fkey" FOREIGN KEY ("point_de_massification_id") REFERENCES "public"."point_de_collecte"("id") ON
DELETE
    RESTRICT;

ALTER TABLE
    ONLY "public"."tournee"
ADD
    CONSTRAINT "tournee_transporteur_id_fkey" FOREIGN KEY ("transporteur_id") REFERENCES "public"."transporteur"("id");

ALTER TABLE
    ONLY "public"."tournee"
ADD
    CONSTRAINT "tournee_zone_de_collecte_id_fkey" FOREIGN KEY ("zone_de_collecte_id") REFERENCES "public"."zone_de_collecte"("id") ON
DELETE
SET
    NULL;

ALTER TABLE
    ONLY "public"."transporteur_users"
ADD
    CONSTRAINT "transporter_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON
DELETE
    CASCADE;

ALTER TABLE
    ONLY "public"."transporteur_users"
ADD
    CONSTRAINT "transporteur_users_transporteur_id_fkey" FOREIGN KEY ("transporteur_id") REFERENCES "public"."transporteur"("id");

ALTER TABLE
    ONLY "public"."user_roles"
ADD
    CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON
DELETE
    CASCADE;

CREATE POLICY "Allow auth admin to read transporteur users" ON "public"."transporteur_users" FOR
SELECT
    TO "supabase_auth_admin" USING (true);

CREATE POLICY "Allow auth admin to read user roles" ON "public"."role_permissions" FOR
SELECT
    TO "supabase_auth_admin" USING (true);

CREATE POLICY "Allow auth admin to read user roles" ON "public"."user_roles" FOR
SELECT
    TO "supabase_auth_admin" USING (true);

CREATE POLICY "Allow delete for authorized" ON "public"."collecte" FOR
DELETE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"('collecte.delete' :: "public"."app_permission") AS "authorize"
        )
    );

CREATE POLICY "Allow delete for authorized" ON "public"."point_de_collecte" FOR
DELETE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"(
                    'point_de_collecte.delete' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

CREATE POLICY "Allow delete for authorized" ON "public"."tournee" FOR
DELETE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"('tournee.delete' :: "public"."app_permission") AS "authorize"
        )
    );

CREATE POLICY "Allow delete for authorized" ON "public"."transporteur" FOR
DELETE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"('transporteur.delete' :: "public"."app_permission") AS "authorize"
        )
    );

CREATE POLICY "Allow delete for authorized" ON "public"."transporteur_users" FOR
DELETE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"(
                    'transporteur_users.delete' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

CREATE POLICY "Allow delete for authorized" ON "public"."zone_de_collecte" FOR
DELETE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"(
                    'zone_de_collecte.delete' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

CREATE POLICY "Allow insert for authorized" ON "public"."collecte" FOR
INSERT
    TO "authenticated" WITH CHECK (
        (
            SELECT
                "public"."authorize"('collecte.insert' :: "public"."app_permission") AS "authorize"
        )
    );

CREATE POLICY "Allow insert for authorized" ON "public"."point_de_collecte" FOR
INSERT
    TO "authenticated" WITH CHECK (
        (
            SELECT
                "public"."authorize"(
                    'point_de_collecte.insert' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

CREATE POLICY "Allow insert for authorized" ON "public"."tournee" FOR
INSERT
    TO "authenticated" WITH CHECK (
        (
            SELECT
                "public"."authorize"('tournee.insert' :: "public"."app_permission") AS "authorize"
        )
    );

CREATE POLICY "Allow insert for authorized" ON "public"."transporteur" FOR
INSERT
    TO "authenticated" WITH CHECK (
        (
            SELECT
                "public"."authorize"('transporteur.insert' :: "public"."app_permission") AS "authorize"
        )
    );

CREATE POLICY "Allow insert for authorized" ON "public"."transporteur_users" FOR
INSERT
    TO "authenticated" WITH CHECK (
        (
            SELECT
                "public"."authorize"(
                    'transporteur_users.insert' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

CREATE POLICY "Allow insert for authorized" ON "public"."zone_de_collecte" FOR
INSERT
    TO "authenticated" WITH CHECK (
        (
            SELECT
                "public"."authorize"(
                    'zone_de_collecte.insert' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

CREATE POLICY "Allow insert for everyone" ON "public"."remplissage_contenants" FOR
INSERT
    TO "authenticated",
    "anon" WITH CHECK (true);

CREATE POLICY "Allow read for authorized" ON "public"."collecte" FOR
SELECT
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"('collecte.select' :: "public"."app_permission") AS "authorize"
        )
    );

CREATE POLICY "Allow read for authorized" ON "public"."point_de_collecte" FOR
SELECT
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"(
                    'point_de_collecte.select' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

CREATE POLICY "Allow read for authorized" ON "public"."transporteur" FOR
SELECT
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"('transporteur.select' :: "public"."app_permission") AS "authorize"
        )
    );

CREATE POLICY "Allow read for authorized" ON "public"."transporteur_users" FOR
SELECT
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"(
                    'transporteur_users.select' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

CREATE POLICY "Allow read for authorized" ON "public"."zone_de_collecte" FOR
SELECT
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"(
                    'zone_de_collecte.select' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

CREATE POLICY "Allow read for everyone" ON "public"."remplissage_contenants" FOR
SELECT
    TO "authenticated",
    "anon" USING (true);

CREATE POLICY "Allow select for authorized" ON "public"."tournee" FOR
SELECT
    TO "authenticated" USING (
        (
            (
                SELECT
                    "public"."authorize"('tournee.select' :: "public"."app_permission") AS "authorize"
            )
            AND "public"."authorize_transporteur"("transporteur_id")
        )
    );

CREATE POLICY "Allow update for authorized" ON "public"."collecte" FOR
UPDATE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"('collecte.update' :: "public"."app_permission") AS "authorize"
        )
    );

CREATE POLICY "Allow update for authorized" ON "public"."point_de_collecte" FOR
UPDATE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"(
                    'point_de_collecte.update' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

CREATE POLICY "Allow update for authorized" ON "public"."tournee" FOR
UPDATE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"('tournee.update' :: "public"."app_permission") AS "authorize"
        )
    );

CREATE POLICY "Allow update for authorized" ON "public"."transporteur" FOR
UPDATE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"('transporteur.update' :: "public"."app_permission") AS "authorize"
        )
    );

CREATE POLICY "Allow update for authorized" ON "public"."transporteur_users" FOR
UPDATE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"(
                    'transporteur_users.update' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

CREATE POLICY "Allow update for authorized" ON "public"."zone_de_collecte" FOR
UPDATE
    TO "authenticated" USING (
        (
            SELECT
                "public"."authorize"(
                    'zone_de_collecte.update' :: "public"."app_permission"
                ) AS "authorize"
        )
    );

ALTER TABLE
    "public"."collecte" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."point_de_collecte" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."remplissage_contenants" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."role_permissions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."tournee" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."transporteur" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."transporteur_users" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."user_roles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE
    "public"."zone_de_collecte" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "anon";

GRANT USAGE ON SCHEMA "public" TO "authenticated";

GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT USAGE ON SCHEMA "public" TO "supabase_auth_admin";

GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "anon";

GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "authenticated";

GRANT ALL ON FUNCTION "public"."authorize"("requested_permission" "public"."app_permission") TO "service_role";

GRANT ALL ON FUNCTION "public"."authorize_transporteur"("transporteur" bigint) TO "anon";

GRANT ALL ON FUNCTION "public"."authorize_transporteur"("transporteur" bigint) TO "authenticated";

GRANT ALL ON FUNCTION "public"."authorize_transporteur"("transporteur" bigint) TO "service_role";

GRANT ALL ON FUNCTION "public"."set_role"("event" "jsonb") TO "anon";

GRANT ALL ON FUNCTION "public"."set_role"("event" "jsonb") TO "authenticated";

GRANT ALL ON FUNCTION "public"."set_role"("event" "jsonb") TO "service_role";

GRANT ALL ON TABLE "public"."transporteur" TO "anon";

GRANT ALL ON TABLE "public"."transporteur" TO "authenticated";

GRANT ALL ON TABLE "public"."transporteur" TO "service_role";

GRANT ALL ON SEQUENCE "public"."Transporteur_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."Transporteur_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."Transporteur_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."collecte" TO "anon";

GRANT ALL ON TABLE "public"."collecte" TO "authenticated";

GRANT ALL ON TABLE "public"."collecte" TO "service_role";

GRANT ALL ON SEQUENCE "public"."collecte_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."collecte_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."collecte_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."point_de_collecte" TO "anon";

GRANT ALL ON TABLE "public"."point_de_collecte" TO "authenticated";

GRANT ALL ON TABLE "public"."point_de_collecte" TO "service_role";

GRANT ALL ON SEQUENCE "public"."point_de_collecte_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."point_de_collecte_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."point_de_collecte_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."remplissage_contenants" TO "anon";

GRANT ALL ON TABLE "public"."remplissage_contenants" TO "authenticated";

GRANT ALL ON TABLE "public"."remplissage_contenants" TO "service_role";

GRANT ALL ON SEQUENCE "public"."remplissage_casiers_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."remplissage_casiers_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."remplissage_casiers_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."role_permissions" TO "service_role";

GRANT ALL ON TABLE "public"."role_permissions" TO "supabase_auth_admin";

GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."role_permissions_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."tournee" TO "anon";

GRANT ALL ON TABLE "public"."tournee" TO "authenticated";

GRANT ALL ON TABLE "public"."tournee" TO "service_role";

GRANT ALL ON SEQUENCE "public"."tournee_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."tournee_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."tournee_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."transporteur_users" TO "anon";

GRANT ALL ON TABLE "public"."transporteur_users" TO "authenticated";

GRANT ALL ON TABLE "public"."transporteur_users" TO "service_role";

GRANT ALL ON TABLE "public"."transporteur_users" TO "supabase_auth_admin";

GRANT ALL ON SEQUENCE "public"."transporter_users_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."transporter_users_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."transporter_users_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."user_roles" TO "service_role";

GRANT ALL ON TABLE "public"."user_roles" TO "supabase_auth_admin";

GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."user_roles_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."zone_de_collecte" TO "anon";

GRANT ALL ON TABLE "public"."zone_de_collecte" TO "authenticated";

GRANT ALL ON TABLE "public"."zone_de_collecte" TO "service_role";

GRANT ALL ON SEQUENCE "public"."zone_de_collecte_id_seq" TO "anon";

GRANT ALL ON SEQUENCE "public"."zone_de_collecte_id_seq" TO "authenticated";

GRANT ALL ON SEQUENCE "public"."zone_de_collecte_id_seq" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";

RESET ALL;