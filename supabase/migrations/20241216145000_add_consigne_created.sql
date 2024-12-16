alter table
  "public"."consigne"
add
  column "created_at" timestamp without time zone not null default now();