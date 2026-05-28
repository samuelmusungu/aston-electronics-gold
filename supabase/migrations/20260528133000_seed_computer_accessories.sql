-- Seed computer accessories categories and starter products with real web images.

INSERT INTO public.categories (name, slug, icon)
VALUES
  ('Computer Accessories', 'computer-accessories', 'Monitor'),
  ('Keyboards', 'keyboards', 'Keyboard'),
  ('Mice', 'mice', 'Mouse'),
  ('Mouse Pads', 'mouse-pads', 'RectangleHorizontal'),
  ('SD Cards', 'sd-cards', 'Database'),
  ('Flash Disks', 'flash-disks', 'Usb'),
  ('SD Card Readers', 'sd-card-readers', 'CreditCard'),
  ('USB Hubs & Readers', 'usb-readers', 'GitFork'),
  ('Laptop Chargers', 'laptop-chargers', 'Zap'),
  ('Monitors', 'monitors', 'Monitor'),
  ('HDMI Cables', 'hdmi-cables', 'Cable'),
  ('PC Gaming Pads', 'pc-gaming-pads', 'Gamepad2'),
  ('Desktops', 'desktops', 'Cpu'),
  ('Laptop Accessories', 'laptop-accessories', 'Laptop'),
  ('Cables & Adapters', 'cables-adapters', 'Plug')
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    icon = EXCLUDED.icon;

WITH cats AS (
  SELECT id, slug FROM public.categories
)
INSERT INTO public.products (
  category_id,
  name,
  slug,
  brand,
  description,
  price_kes,
  compare_at_price_kes,
  stock,
  image_url,
  featured
)
SELECT
  cats.id,
  p.name,
  p.slug,
  p.brand,
  p.description,
  p.price_kes,
  p.compare_at_price_kes,
  p.stock,
  p.image_url,
  p.featured
FROM cats
JOIN (VALUES
  ('keyboards', 'Logitech-Style Wired Keyboard', 'logitech-style-wired-keyboard', 'Logitech', 'Full-size USB keyboard for office, school and home setups.', 1200, 1500, 18, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Apple_mouse_and_keyboard_%28Unsplash%29.jpg/960px-Apple_mouse_and_keyboard_%28Unsplash%29.jpg', true),
  ('mice', 'Wireless Optical Mouse', 'wireless-optical-mouse', 'Generic', 'Compact wireless mouse with USB receiver for laptops and desktops.', 850, 1100, 24, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/A_black_wireless_computer_mouse.jpg/960px-A_black_wireless_computer_mouse.jpg', true),
  ('mouse-pads', 'Large Gaming Mouse Pad', 'large-gaming-mouse-pad', 'Generic', 'Smooth fabric mouse pad for work desks and gaming setups.', 700, 950, 30, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Logitech_Red_mouse_on_a_mouse_pad.jpg/960px-Logitech_Red_mouse_on_a_mouse_pad.jpg', false),
  ('sd-cards', '64GB microSD Memory Card', '64gb-microsd-memory-card', 'SanDisk', 'microSD card for phones, cameras, dashcams and tablets.', 950, 1200, 20, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/MicroSD_card_2GB_focus-stacked.jpg/960px-MicroSD_card_2GB_focus-stacked.jpg', false),
  ('flash-disks', '64GB USB 3.0 Flash Disk', '64gb-usb-3-flash-disk', 'Kingston', 'Portable USB 3.0 storage for documents, music and backups.', 950, 1300, 28, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Kingston_Technology_DataTraveler_G4_USB_flash_drive_USB_3.0_32_Gb.jpg/960px-Kingston_Technology_DataTraveler_G4_USB_flash_drive_USB_3.0_32_Gb.jpg', true),
  ('sd-card-readers', 'USB SD Card Reader', 'usb-sd-card-reader', 'Generic', 'USB card reader for SD and microSD memory cards.', 650, 850, 16, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/SD_card_reader.jpg/960px-SD_card_reader.jpg', false),
  ('usb-readers', '4-Port USB Hub', '4-port-usb-hub', 'Generic', 'Expand one USB port into four ports for accessories and storage.', 1200, 1500, 14, 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/2023_Hub_USB_2.0.jpg/960px-2023_Hub_USB_2.0.jpg', false),
  ('laptop-chargers', '65W Universal Laptop Charger', '65w-universal-laptop-charger', 'Generic', 'Replacement laptop charger for compatible 65W notebooks.', 2800, 3500, 10, 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Lenovo_65W_20V_AC_adapter_%28FRU_42T5283%29_for_ThinkPad_laptops.jpg/960px-Lenovo_65W_20V_AC_adapter_%28FRU_42T5283%29_for_ThinkPad_laptops.jpg', true),
  ('monitors', '22-inch Full HD Monitor', '22-inch-full-hd-monitor', 'Generic', 'Full HD desktop monitor for office, study and CCTV viewing.', 12500, 14500, 6, 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/EIZO_Foris_FG2421_VGA_computer_monitor_displaying_test_pattern.png/960px-EIZO_Foris_FG2421_VGA_computer_monitor_displaying_test_pattern.png', true),
  ('hdmi-cables', 'High-Speed HDMI Cable 2m', 'high-speed-hdmi-cable-2m', 'Generic', 'HDMI cable for TVs, monitors, decoders, consoles and laptops.', 650, 850, 35, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/HDMI_CableEnd.jpg/960px-HDMI_CableEnd.jpg', false),
  ('pc-gaming-pads', 'USB Game Controller for PC', 'usb-game-controller-pc', 'Generic', 'Plug-and-play USB gamepad for PC gaming and emulators.', 1800, 2300, 12, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Xbox-360-Wireless-Controller-White.jpg/960px-Xbox-360-Wireless-Controller-White.jpg', false),
  ('desktops', 'Refurbished Office Desktop PC', 'refurbished-office-desktop-pc', 'Dell', 'Compact desktop computer for office, cyber cafe and school work.', 18500, 22000, 5, 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HP_SFF_desktop_computer_inside.jpg/960px-HP_SFF_desktop_computer_inside.jpg', true),
  ('laptop-accessories', 'Adjustable Laptop Stand', 'adjustable-laptop-stand', 'Generic', 'Desk laptop stand for better posture and airflow.', 1800, 2400, 15, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Laptop_stand.jpg/960px-Laptop_stand.jpg', false),
  ('cables-adapters', 'HDMI to DVI Display Adapter Cable', 'hdmi-dvi-display-adapter-cable', 'Generic', 'Display adapter cable for connecting laptops, desktops and monitors.', 950, 1250, 18, 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Adapter_cable_hdmi_dvi-d_IMGP1647_smial_wp.jpg/960px-Adapter_cable_hdmi_dvi-d_IMGP1647_smial_wp.jpg', false)
) AS p(category_slug, name, slug, brand, description, price_kes, compare_at_price_kes, stock, image_url, featured)
ON cats.slug = p.category_slug
ON CONFLICT (slug) DO UPDATE
SET category_id = EXCLUDED.category_id,
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    description = EXCLUDED.description,
    price_kes = EXCLUDED.price_kes,
    compare_at_price_kes = EXCLUDED.compare_at_price_kes,
    stock = EXCLUDED.stock,
    image_url = EXCLUDED.image_url,
    featured = EXCLUDED.featured;
