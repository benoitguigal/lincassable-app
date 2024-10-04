alter table "public"."collecte" add column "cyke_id" text;

CREATE UNIQUE INDEX collecte_cyke_id_key ON public.collecte USING btree (cyke_id);

alter table "public"."collecte" add constraint "collecte_cyke_id_key" UNIQUE using index "collecte_cyke_id_key";


