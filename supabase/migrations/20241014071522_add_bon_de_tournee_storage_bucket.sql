-- Use Postgres to create a bucket.
insert into
  storage.buckets (id, name, public, allowed_mime_types)
values
  (
    'bon-de-tournee',
    'bon-de-tournee',
    true,
    '{"application/pdf","image/*"}'
  );

CREATE POLICY "Allow authenticated to read bon de tournee bucket" ON storage.objects FOR
SELECT
  TO "authenticated" USING ((bucket_id = 'bon-de-tournee'));

CREATE POLICY "Allow authenticated to update bon de tournee bucket" ON storage.objects FOR
UPDATE
  TO "authenticated" USING ((bucket_id = 'bon-de-tournee'));

CREATE POLICY "Allow authenticated to create bon de tournee bucket" ON storage.objects FOR
INSERT
  TO "authenticated" WITH CHECK ((bucket_id = 'bon-de-tournee'));

CREATE POLICY "Allow authenticated to delete bon de tournee bucket" ON storage.objects FOR DELETE TO "authenticated" USING ((bucket_id = 'bon-de-tournee'));