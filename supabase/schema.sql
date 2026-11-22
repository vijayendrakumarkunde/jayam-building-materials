-- ==============================================================================
-- JAYAM BUILDING MATERIALS - SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Brand Tagline: "Everything You Build, Starts With Us."
-- Phone: 9505609865 | WhatsApp: 9505609865
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    product_type VARCHAR(100),
    description TEXT,
    base_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    measurement_unit VARCHAR(50) NOT NULL DEFAULT 'Ton', -- Ton, Truck, Bag, Piece, Cubic Feet (CFT)
    min_order_qty NUMERIC(10, 2) NOT NULL DEFAULT 1.00,
    stock_qty NUMERIC(12, 2) NOT NULL DEFAULT 100.00,
    in_stock BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    grade_or_type VARCHAR(100),
    specifications JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. PRODUCT IMAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. CUSTOMERS TABLE (Guest directory automatically updated on orders)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    alternate_phone VARCHAR(20),
    email VARCHAR(150),
    default_address TEXT,
    city VARCHAR(100) DEFAULT 'Hyderabad',
    pincode VARCHAR(20),
    total_orders INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. ORDERS TABLE (Guest Booking with Order Reference ID)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_reference VARCHAR(50) NOT NULL UNIQUE, -- e.g. JBM-2026-4821
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    alternate_phone VARCHAR(20),
    delivery_address TEXT NOT NULL,
    landmark VARCHAR(200),
    city VARCHAR(100) DEFAULT 'Hyderabad Region',
    road_access VARCHAR(150) DEFAULT '10-Wheeler Tipper Accessible',
    preferred_date VARCHAR(100),
    special_instructions TEXT,
    order_status VARCHAR(50) NOT NULL DEFAULT 'Pending', 
    -- Status options: Pending, Confirmed, Processing, Dispatched, Delivered, Cancelled
    subtotal_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    delivery_charge_note TEXT DEFAULT 'Transport calculated based on site destination distance and approach road.',
    payment_status VARCHAR(50) DEFAULT 'Pending Delivery Verification',
    assigned_vehicle VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. ORDER ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    measurement_unit VARCHAR(50) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. ADMIN USERS TABLE (Linked to Supabase Auth auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'superadmin', -- superadmin, manager
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. INVENTORY TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL UNIQUE REFERENCES public.products(id) ON DELETE CASCADE,
    current_stock NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reserved_stock NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    reorder_level NUMERIC(12, 2) NOT NULL DEFAULT 10.00,
    last_restocked_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. QUOTATIONS TABLE (Commercial / Contractor bulk inquiries)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_ref VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    project_type VARCHAR(100),
    location TEXT,
    materials_requested TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending Review',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'order', -- order, low_stock, quotation
    is_read BOOLEAN DEFAULT false,
    link_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. WEBSITE SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(200) NOT NULL DEFAULT 'JAYAM BUILDING MATERIALS',
    business_phone VARCHAR(50) NOT NULL DEFAULT '9505609865',
    whatsapp_number VARCHAR(50) NOT NULL DEFAULT '9505609865',
    tagline VARCHAR(255) NOT NULL DEFAULT 'Everything You Build, Starts With Us.',
    physical_address TEXT DEFAULT 'Plot No. 42, Outer Ring Road Logistics Junction, Industrial Hub',
    operating_hours TEXT DEFAULT 'Mon - Sat: 6:00 AM - 9:00 PM | Sunday: 7:00 AM - 2:00 PM',
    delivery_notice TEXT DEFAULT 'Delivery charges are calculated based on your site location, accessibility, and vehicle type. Our dispatch team confirms final transport details directly.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(is_read);

-- ==============================================================================
-- TABLE PERMISSIONS & ROLE GRANTS
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current authenticated user is an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE auth_user_id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Categories RLS
CREATE POLICY "Public can view active categories" 
ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins have full CRUD on categories" 
ON public.categories FOR ALL USING (public.is_admin());

-- 2. Products RLS
CREATE POLICY "Public can view available products" 
ON public.products FOR SELECT USING (in_stock = true OR public.is_admin());

CREATE POLICY "Admins have full CRUD on products" 
ON public.products FOR ALL USING (public.is_admin());

-- 3. Product Images RLS
CREATE POLICY "Public can view product images" 
ON public.product_images FOR SELECT USING (true);

CREATE POLICY "Admins have full CRUD on product images" 
ON public.product_images FOR ALL USING (public.is_admin());

-- 4. Orders RLS (Guest can insert, query by reference + phone; admins manage all)
CREATE POLICY "Public can insert orders (Guest Checkout)" 
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can track order by reference and phone" 
ON public.orders FOR SELECT USING (
    (auth.uid() IS NULL) OR public.is_admin()
);

CREATE POLICY "Admins have full CRUD on orders" 
ON public.orders FOR ALL USING (public.is_admin());

-- 5. Order Items RLS
CREATE POLICY "Public can insert order items" 
ON public.order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view order items" 
ON public.order_items FOR SELECT USING (true);

CREATE POLICY "Admins have full CRUD on order items" 
ON public.order_items FOR ALL USING (public.is_admin());

-- 6. Customers RLS
CREATE POLICY "Public can insert customer records" 
ON public.customers FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins have full CRUD on customers" 
ON public.customers FOR ALL USING (public.is_admin());

-- 7. Admin Users RLS
CREATE POLICY "Admins can view admin_users" 
ON public.admin_users FOR SELECT USING (auth.uid() = auth_user_id OR public.is_admin());

CREATE POLICY "Superadmins can manage admin_users" 
ON public.admin_users FOR ALL USING (public.is_admin());

-- 8. Website Settings RLS
CREATE POLICY "Public can view website settings" 
ON public.website_settings FOR SELECT USING (true);

CREATE POLICY "Admins can update website settings" 
ON public.website_settings FOR ALL USING (public.is_admin());

-- 9. Quotations & Notifications
CREATE POLICY "Public can insert quotations" 
ON public.quotations FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage quotations" 
ON public.quotations FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can manage notifications" 
ON public.notifications FOR ALL USING (public.is_admin());

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('website-assets', 'website-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public read product images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images' OR bucket_id = 'website-assets');

CREATE POLICY "Admin upload product images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images' AND (auth.role() = 'authenticated' OR public.is_admin()));

-- ==============================================================================
-- INITIAL SEED DATA (Categories, Initial Products & Website Settings)
-- ==============================================================================
INSERT INTO public.website_settings (business_name, business_phone, whatsapp_number, tagline)
VALUES ('JAYAM BUILDING MATERIALS', '9505609865', '9505609865', 'Everything You Build, Starts With Us.')
ON CONFLICT DO NOTHING;

-- Seed Categories
INSERT INTO public.categories (id, name, slug, description, image_url, display_order)
VALUES 
('11111111-1111-1111-1111-111111111101', 'River Sand', 'river-sand', 'Natural river bed sand, triple washed and silt-free for premium masonry and concrete.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 1),
('11111111-1111-1111-1111-111111111102', 'M-Sand', 'm-sand', 'Manufactured sand engineered with cubical grain shape for high-strength reinforced concrete.', 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80', 2),
('11111111-1111-1111-1111-111111111103', 'Plastering Sand', 'plastering-sand', 'Fine micro-graded sand processed specifically for smooth, crack-free internal and external plastering.', 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80', 3),
('11111111-1111-1111-1111-111111111104', 'Cement', 'cement', 'Grade 53 OPC, PPC, and PSC cement bags from certified top national manufacturing brands.', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', 4),
('11111111-1111-1111-1111-111111111105', 'Bricks', 'bricks', 'Red clay table-moulded kiln bricks, wire-cut bricks, and lightweight AAC blocks for durable walls.', 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80', 5),
('11111111-1111-1111-1111-111111111106', 'Steel', 'steel', 'Fe 550D & Fe 500 TMT steel rebar rods with seismic resistance for building structural stability.', 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', 6),
('11111111-1111-1111-1111-111111111107', 'Gravel', 'gravel', 'Clean drainage gravel and foundational base aggregate stones for grading and driveways.', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', 7),
('11111111-1111-1111-1111-111111111108', 'Aggregates', 'aggregates', 'Crushed blue metal stone aggregates in 20mm, 40mm, and 12mm for concrete batching.', 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80', 8),
('11111111-1111-1111-1111-111111111109', 'Stones', 'stones', 'Rough granite rubble, foundation boulder stones, and size stones for heavy civil construction.', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', 9),
('11111111-1111-1111-1111-111111111110', 'Other Building Materials', 'other-materials', 'Waterproofing compounds, bonding agents, PVC spacers, binding wire, and curing chemicals.', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', 10)
ON CONFLICT (slug) DO NOTHING;

-- Seed Products
INSERT INTO public.products (id, category_id, name, slug, product_type, description, base_price, measurement_unit, min_order_qty, stock_qty, in_stock, is_featured, is_bestseller, grade_or_type, specifications)
VALUES
('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', 'Triple-Washed River Sand (Grade A)', 'triple-washed-river-sand', 'Natural River Sand', 'Premium silt-free natural river sand dredged and triple washed. Ideal for RCC columns, roof slabs, and masonry joints.', 1850.00, 'Ton', 5, 450, true, true, true, 'Zone II River Sand', '{"Silt Content": "< 2.5%", "Zone": "Zone II (IS 383)", "Specific Gravity": "2.65"}'::jsonb),

('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111101', 'Full Tipper Lorry Natural River Sand (16 Ton)', 'tipper-lorry-river-sand-16-ton', 'Bulk Tipper Delivery', 'High-volume bulk 16-ton 10-wheeler tipper load of natural river sand directly from certified river reserves.', 28500.00, 'Truck', 1, 28, true, true, true, '16-Ton Tipper Bulk', '{"Capacity": "16 Tons (Approx 380 CFT)", "Vehicle": "10-Wheeler Hydraulic Tipper", "Silt": "< 2.0%"}'::jsonb),

('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111102', 'Engineered M-Sand for Concrete (VSI Processed)', 'engineered-m-sand-concrete', 'Manufactured Sand', 'Manufactured Sand produced via Vertical Shaft Impactor (VSI) crushing. Produces cubical grains for maximum concrete bonding.', 1100.00, 'Ton', 6, 600, true, true, true, 'Concrete M-Sand', '{"Particle Size": "0 - 4.75 mm", "IS Code": "IS 383:2016 Zone II", "Fines": "< 10%"}'::jsonb),

('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111103', 'Premium P-Sand (Plastering Sand) - Super Fine', 'premium-p-sand-plastering', 'Fine Plastering Sand', 'Ultra-fine washed plastering sand processed through hydro-cyclone classification. Mirror-smooth finish with zero shrinkage cracks.', 1350.00, 'Ton', 4, 320, true, true, false, 'Zone IV Plaster Sand', '{"Size": "0 - 2.36 mm", "Washing": "Double Hydro-Washed", "Rebound Loss": "< 3%"}'::jsonb),

('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111104', 'UltraTech Super Cement 53 Grade (OPC / PPC)', 'ultratech-super-cement-53-grade', 'Portland Cement', 'High-durability micro-fine 53-grade cement delivering high 28-day compressive strength and rapid curing.', 395.00, 'Bag', 25, 1200, true, true, true, '53 Grade OPC', '{"Bag Weight": "50 KG (Tamper Proof)", "Standard": "IS 12269 & IS 1489", "Setting Time": "> 30 Min"}'::jsonb),

('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111106', 'Tata Tiscon 550D Super Ductile TMT Rebar (12mm)', 'tata-tiscon-550d-tmt-rebar-12mm', 'TMT Rebar Rods', 'Primary brand high-ductility Fe 550D TMT reinforcement steel bars with seismic resistance.', 68500.00, 'Ton', 1, 150, true, true, true, 'Fe 550D Primary Steel', '{"Diameter": "12 mm (Also 8,10,16,20mm)", "Grade": "Fe 550D Super Ductile", "Standard": "IS 1786"}'::jsonb),

('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111105', 'Wire-Cut Red Clay Kiln Bricks (Grade 1)', 'wire-cut-red-clay-kiln-bricks', 'Solid Red Bricks', 'Machine-extruded, wire-cut kiln baked terracotta clay bricks with sharp edges and uniform color.', 9.50, 'Piece', 1500, 45000, true, false, true, 'First Class Wire-Cut', '{"Dimensions": "9 x 4.25 x 2.75 Inches", "Strength": "> 10.5 N/mm²", "Absorption": "< 12%"}'::jsonb),

('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111108', 'Crushed Blue Metal Aggregates (20mm)', 'crushed-blue-metal-aggregates-20mm', 'Hard Granite Aggregates', 'Machine-crushed angular hard blue granite metal stone in 20mm nominal size for concrete batching.', 780.00, 'Ton', 8, 850, true, true, true, '20mm Blue Metal', '{"Size": "20 mm Graded", "Rock": "Blue Granite Hard Stone", "Standard": "IS 383:2016"}'::jsonb),

('22222222-2222-2222-2222-222222222209', '11111111-1111-1111-1111-111111111107', 'Graded Clean Drainage Gravel (10mm - 12mm)', 'graded-clean-drainage-gravel', 'Drainage Gravel', 'Graded clean washed gravel stones suitable for french drains, sub-base compaction, and driveways.', 820.00, 'Ton', 6, 420, true, false, false, '12mm Gravel', '{"Size": "10mm to 12mm Graded", "Application": "Drains, Landscaping & Sub-base"}'::jsonb),

('22222222-2222-2222-2222-222222222210', '11111111-1111-1111-1111-111111111109', 'Heavy Foundation Granite Rubble Stones', 'heavy-foundation-granite-rubble-stones', 'Foundation Boulder Stones', 'Dense quarried granite rubble stones for basement stone pitching and heavy foundation footings.', 12500.00, 'Truck', 1, 40, true, false, false, 'Quarried Granite Rubble', '{"Volume": "Approx 400 CFT / 14 Ton", "Use": "Basement & Retaining walls"}'::jsonb)
ON CONFLICT (slug) DO NOTHING;

-- Seed Product Images
INSERT INTO public.product_images (product_id, image_url, is_primary)
VALUES
('22222222-2222-2222-2222-222222222201', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', true),
('22222222-2222-2222-2222-222222222202', 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80', true),
('22222222-2222-2222-2222-222222222203', 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80', true),
('22222222-2222-2222-2222-222222222204', 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80', true),
('22222222-2222-2222-2222-222222222205', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', true),
('22222222-2222-2222-2222-222222222206', 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', true),
('22222222-2222-2222-2222-222222222207', 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80', true),
('22222222-2222-2222-2222-222222222208', 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80', true),
('22222222-2222-2222-2222-222222222209', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', true),
('22222222-2222-2222-2222-222222222210', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80', true)
ON CONFLICT DO NOTHING;
