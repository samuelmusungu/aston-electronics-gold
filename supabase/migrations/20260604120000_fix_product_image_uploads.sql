-- Keep product uploads publicly readable for storefront cards and product pages.
-- Admins can upload/manage files, while anonymous visitors can read image objects.

UPDATE storage.buckets
SET public = true
WHERE id = 'product-images';

DROP POLICY IF EXISTS "Public read product image files" ON storage.objects;
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins manage product images" ON storage.objects;

CREATE POLICY "Public read product image files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'product-images'
  AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'avif')
);

CREATE POLICY "Admins manage product images"
ON storage.objects
FOR ALL
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (
  bucket_id = 'product-images'
  AND public.has_role(auth.uid(), 'admin')
  AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'avif')
);
