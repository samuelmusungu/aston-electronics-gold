-- Harden policies highlighted in the launch report.
-- Apply after migrating the project to the owner's Supabase account.

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users view own roles" ON public.user_roles;

CREATE POLICY "Users view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

CREATE POLICY "Customers create own orders"
ON public.orders
FOR INSERT
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers create items for their own orders"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.orders
    WHERE orders.id = order_items.order_id
      AND (
        orders.user_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin')
      )
  )
);

DROP POLICY IF EXISTS "Admins manage product images" ON storage.objects;
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;

UPDATE storage.buckets
SET public = false
WHERE id = 'product-images';

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
WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id
  FROM auth.users
  WHERE lower(email) = 'musungusam2000@gmail.com'
  LIMIT 1;

  IF admin_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
