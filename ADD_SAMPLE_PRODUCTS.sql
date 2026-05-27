-- Copy this into Supabase SQL Editor and click Run.
-- It adds starter products so the shop page is no longer empty.
-- Replace these later with the real Aston Electronics inventory and prices.

INSERT INTO public.products (
  category_id,
  name,
  slug,
  description,
  price_kes,
  compare_at_price_kes,
  stock,
  image_url,
  brand,
  featured
)
SELECT
  c.id,
  p.name,
  p.slug,
  p.description,
  p.price_kes,
  p.compare_at_price_kes,
  p.stock,
  p.image_url,
  p.brand,
  p.featured
FROM (
  VALUES
    ('chargers', 'Oraimo 20W Fast Charger', 'oraimo-20w-fast-charger', 'Compact fast charger for Android and iPhone-compatible USB-C cables.', 1800, 2200, 15, NULL, 'Oraimo', true),
    ('chargers', 'Type-C Fast Charging Cable', 'type-c-fast-charging-cable', 'Durable 1 meter Type-C cable for charging and data transfer.', 650, 850, 30, NULL, 'Aston Select', true),
    ('power-banks', '10000mAh Slim Power Bank', '10000mah-slim-power-bank', 'Portable backup power for phones, earbuds and small USB devices.', 2800, 3500, 12, NULL, 'Aston Select', true),
    ('audio', 'Wireless Bluetooth Earbuds', 'wireless-bluetooth-earbuds', 'Lightweight earbuds with charging case and clear call quality.', 2500, 3200, 10, NULL, 'Aston Select', true),
    ('screen-protectors', 'Tempered Glass Screen Protector', 'tempered-glass-screen-protector', 'Clear toughened glass protector for everyday scratch protection.', 500, 700, 40, NULL, 'Aston Select', false),
    ('cases', 'Shockproof Phone Case', 'shockproof-phone-case', 'Protective case with raised edges and a firm anti-slip grip.', 900, 1200, 25, NULL, 'Aston Select', false),
    ('speakers', 'Portable Bluetooth Speaker', 'portable-bluetooth-speaker', 'Compact rechargeable speaker for music, calls and outdoor use.', 3200, 3900, 8, NULL, 'Aston Select', true),
    ('holders', 'Car Phone Holder', 'car-phone-holder', 'Adjustable dashboard phone holder for secure hands-free navigation.', 1200, 1500, 18, NULL, 'Aston Select', false)
) AS p(category_slug, name, slug, description, price_kes, compare_at_price_kes, stock, image_url, brand, featured)
JOIN public.categories c ON c.slug = p.category_slug
ON CONFLICT (slug) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_kes = EXCLUDED.price_kes,
  compare_at_price_kes = EXCLUDED.compare_at_price_kes,
  stock = EXCLUDED.stock,
  image_url = EXCLUDED.image_url,
  brand = EXCLUDED.brand,
  featured = EXCLUDED.featured;
