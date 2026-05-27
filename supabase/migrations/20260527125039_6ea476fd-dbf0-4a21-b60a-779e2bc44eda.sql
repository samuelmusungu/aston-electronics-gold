
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins manage product images" ON storage.objects FOR ALL USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
