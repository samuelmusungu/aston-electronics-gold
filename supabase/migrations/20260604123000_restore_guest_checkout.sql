-- Keep checkout usable for visitors while preserving admin/customer read controls.

DROP POLICY IF EXISTS "Customers create own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers create items for their own orders" ON public.order_items;

CREATE POLICY "Customers and guests create orders"
ON public.orders
FOR INSERT
WITH CHECK (
  user_id IS NULL
  OR auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Customers and guests create order items"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.orders
    WHERE orders.id = order_items.order_id
      AND (
        orders.user_id IS NULL
        OR orders.user_id = auth.uid()
        OR public.has_role(auth.uid(), 'admin')
      )
  )
);
