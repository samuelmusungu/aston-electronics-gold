-- Copy this into Supabase SQL Editor and click Run.
-- It restores the previous catalog from the old Aston shop into your new Supabase project.

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
    ('cases', 'Spigen Tough Armor - iPhone 15', 'spigen-tough-iphone-15', 'Military-grade drop protection with kickstand. Sleek matte finish.', 2500.00, 3200.00, 25, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/case-iphone.jpg', 'Spigen', true),
    ('cases', 'Silicone Case - Samsung A54', 'silicone-samsung-a54', 'Soft-touch silicone with microfiber lining.', 850.00, 1200.00, 40, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/case-samsung.jpg', 'Generic', false),
    ('cases', 'Clear Bumper Case - Tecno Camon 20', 'clear-tecno-camon20', 'Crystal-clear shock-absorbent corners.', 600.00, NULL, 60, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/case-tecno.jpg', 'Generic', false),
    ('chargers', '20W USB-C Fast Charger', 'usb-c-20w-charger', 'Type-C PD fast charger compatible with iPhone and Android.', 1200.00, 1800.00, 50, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/charger-20w.jpg', 'Anker', true),
    ('chargers', 'Braided Type-C Cable 1.5m', 'type-c-cable-1-5m', 'Tangle-free braided nylon. 3A fast charge.', 450.00, 700.00, 100, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/cable-typec.jpg', 'Generic', false),
    ('chargers', 'Lightning Cable 1m - MFi', 'lightning-cable-1m', 'Apple MFi-certified for iPhone and iPad.', 950.00, NULL, 35, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/cable-lightning.jpg', 'Generic', false),
    ('power-banks', 'Oraimo 20000mAh Power Bank', 'oraimo-20000mah', 'Two-way fast charge. USB-C in/out + dual USB-A.', 3500.00, 4500.00, 20, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/powerbank-20k.jpg', 'Oraimo', true),
    ('power-banks', '10000mAh Slim Power Bank', 'slim-10000mah', 'Pocket-sized 10000mAh with LED display.', 1900.00, 2400.00, 30, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/powerbank-10k.jpg', 'Generic', false),
    ('audio', 'Oraimo FreePods 4 TWS', 'oraimo-freepods-4', 'ENC noise cancelling, 35hr playtime.', 2800.00, 3500.00, 40, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/earbuds-oraimo.jpg', 'Oraimo', true),
    ('audio', 'Wired Earphones with Mic', 'wired-earphones-mic', 'Comfortable in-ear with inline mic and controls.', 350.00, 500.00, 80, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/earphones-wired.jpg', 'Generic', false),
    ('audio', 'JBL Tune 510BT Headphones', 'jbl-tune-510bt', '40hr playtime, JBL Pure Bass sound.', 5500.00, 7000.00, 12, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/headphones-jbl.jpg', 'JBL', true),
    ('screen-protectors', 'Tempered Glass - iPhone 15', 'tempered-glass-iphone-15', '9H hardness, full coverage with installation kit.', 500.00, 800.00, 100, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/glass-iphone.jpg', 'Generic', false),
    ('screen-protectors', 'Tempered Glass - Samsung A-series', 'tempered-glass-samsung-a', '9H hardness with oleophobic coating.', 400.00, 600.00, 100, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/glass-samsung.jpg', 'Generic', false),
    ('holders', 'Magnetic Car Mount', 'magnetic-car-mount', 'Strong magnet, vent-clip. Universal fit.', 700.00, 1000.00, 50, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/holder-car.jpg', 'Generic', false),
    ('speakers', 'Oraimo SoundGo 2 Speaker', 'oraimo-soundgo-2', 'Portable Bluetooth speaker, 12hr playtime.', 2200.00, 2800.00, 25, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/speaker-oraimo.jpg', 'Oraimo', true),
    ('watch-straps', 'Apple Watch Sport Strap 42-45mm', 'apple-watch-strap', 'Soft silicone, fits Series 4-9.', 800.00, 1200.00, 60, 'https://qvixzjldqzdsoljxoede.supabase.co/storage/v1/object/public/product-images/strap-apple.jpg', 'Generic', false)
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
