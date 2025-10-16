import { type NextRequest, NextResponse } from "next/server"
import { sql, db } from "@/lib/db"
import { getSessionUser } from "@/lib/simple-auth"
-- Product categories (hierarchical)
CREATE TABLE IF NOT EXISTS product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES product_categories(id) ON DELETE CASCADE,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Many-to-many relationship between products and categories
CREATE TABLE IF NOT EXISTS product_category_relationships (
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES product_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Product variants (for variable products like different sizes, flavors)
CREATE TABLE IF NOT EXISTS product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE,
    name VARCHAR(255),
    
    -- Variant-specific pricing
    price DECIMAL(10,2),
    sale_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    
    -- Variant-specific inventory
    stock_quantity INTEGER DEFAULT 0,
    
    -- Variant attributes (size: large, flavor: chocolate, etc.)
    attributes JSONB NOT NULL, -- {"size": "large", "flavor": "chocolate"}
    
    -- Physical properties
    weight DECIMAL(8,3),
    dimensions JSONB,
    
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- SUBSCRIPTION SYSTEM
-- =============================================

-- Subscription plans (meal plans, service plans, etc.)
CREATE TABLE IF NOT EXISTS subscription_plans (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Billing
    billing_period VARCHAR(20) NOT NULL, -- weekly, monthly, quarterly, yearly
    billing_interval INTEGER DEFAULT 1, -- every X periods
    price DECIMAL(10,2) NOT NULL,
    setup_fee DECIMAL(10,2) DEFAULT 0.00,
    
    -- Trial
    trial_period_days INTEGER DEFAULT 0,
    trial_price DECIMAL(10,2) DEFAULT 0.00,
    
    -- Limits
    max_subscribers INTEGER,
    subscription_length INTEGER, -- total billing cycles
    
    -- Delivery/Service specifics
    delivery_frequency VARCHAR(20), -- weekly, bi-weekly, monthly
    items_per_delivery INTEGER,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- What products are included in each subscription plan
CREATE TABLE IF NOT EXISTS subscription_plan_items (
    id SERIAL PRIMARY KEY,
    plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
    
    quantity INTEGER NOT NULL DEFAULT 1,
    is_optional BOOLEAN DEFAULT FALSE, -- can customer opt out?
    additional_price DECIMAL(10,2) DEFAULT 0.00, -- extra cost for this item
    
    -- Scheduling
    delivery_week INTEGER, -- which week of the cycle (1-4 for monthly)
    delivery_day VARCHAR(20), -- monday, tuesday, etc.
    
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- CUSTOMER MANAGEMENT
-- =============================================

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE, -- reference to users table if you have one
    
    -- Personal info
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    
    -- Preferences
    dietary_preferences TEXT[],
    allergies TEXT[],
    delivery_notes TEXT,
    
    -- Business metrics
    customer_lifetime_value DECIMAL(10,2) DEFAULT 0.00,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0.00,
    average_order_value DECIMAL(10,2) DEFAULT 0.00,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    acquisition_source VARCHAR(50) DEFAULT 'direct',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_order_at TIMESTAMP WITH TIME ZONE
);

-- Customer addresses
CREATE TABLE IF NOT EXISTS customer_addresses (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    
    type VARCHAR(20) DEFAULT 'shipping', -- shipping, billing, both
    
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(100),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(2) NOT NULL DEFAULT 'MA', -- ISO country code
    
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ORDER MANAGEMENT
-- =============================================

-- Main orders table (handles both one-time and subscription orders)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    
    -- Order type
    order_type VARCHAR(20) DEFAULT 'one_time', -- one_time, subscription, subscription_renewal
    subscription_id INTEGER, -- references active_subscriptions.id
    parent_order_id INTEGER REFERENCES orders(id), -- for subscription renewals
    
    -- Pricing
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    shipping_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipped, delivered, cancelled, refunded
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded, partially_refunded
    
    -- Shipping
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(100),
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Addresses (denormalized for historical record)
    billing_address JSONB,
    shipping_address JSONB,
    
    -- Metadata
    notes TEXT,
    admin_notes TEXT,
    custom_fields JSONB,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order items (what was purchased)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    variant_id INTEGER REFERENCES product_variants(id) ON DELETE SET NULL,
    
    -- Product info at time of purchase (for historical accuracy)
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    variant_name VARCHAR(255),
    
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Metadata
    product_data JSONB, -- snapshot of product at time of purchase
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ACTIVE SUBSCRIPTIONS
-- =============================================

CREATE TABLE IF NOT EXISTS active_subscriptions (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES subscription_plans(id) ON DELETE RESTRICT,
    
    -- Subscription details
    status VARCHAR(20) DEFAULT 'active', -- active, paused, cancelled, expired
    
    -- Billing
    billing_period VARCHAR(20) NOT NULL,
    billing_interval INTEGER DEFAULT 1,
    next_billing_date DATE NOT NULL,
    billing_amount DECIMAL(10,2) NOT NULL,
    
    -- Trial
    trial_end_date DATE,
    is_trial BOOLEAN DEFAULT FALSE,
    
    -- Delivery
    next_delivery_date DATE,
    delivery_frequency VARCHAR(20),
    delivery_address_id INTEGER REFERENCES customer_addresses(id),
    
    -- Customizations
    custom_items JSONB, -- customer-specific modifications to plan
    delivery_instructions TEXT,
    
    -- Pause functionality
    paused_at TIMESTAMP WITH TIME ZONE,
    pause_reason TEXT,
    resume_date DATE,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- DELIVERY MANAGEMENT
-- =============================================

CREATE TABLE IF NOT EXISTS deliveries (
    id SERIAL PRIMARY KEY,
    subscription_id INTEGER REFERENCES active_subscriptions(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    
    -- Delivery details
    scheduled_date DATE NOT NULL,
    delivery_window VARCHAR(50), -- "9AM-12PM", "2PM-6PM"
    actual_delivery_date TIMESTAMP WITH TIME ZONE,
    
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_transit, delivered, failed, cancelled
    
    -- Address
    delivery_address JSONB NOT NULL,
    delivery_instructions TEXT,
    
    -- Tracking
    tracking_number VARCHAR(100),
    carrier VARCHAR(50),
    
    -- Items in this delivery
    items JSONB NOT NULL, -- snapshot of what should be delivered
    
    -- Feedback
    delivery_rating INTEGER CHECK (delivery_rating >= 1 AND delivery_rating <= 5),
    delivery_feedback TEXT,
    
    -- Metadata
    driver_notes TEXT,
    admin_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PRICING & PROMOTIONS
-- =============================================

CREATE TABLE IF NOT EXISTS discount_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    
    -- Discount type
    type VARCHAR(20) NOT NULL, -- percentage, fixed_amount, free_shipping
    value DECIMAL(10,2) NOT NULL,
    
    -- Usage limits
    usage_limit INTEGER, -- total uses allowed
    usage_limit_per_customer INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    
    -- Validity
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    
    -- Conditions
    minimum_amount DECIMAL(10,2), -- minimum order value
    applicable_products INTEGER[], -- specific product IDs
    applicable_categories INTEGER[], -- specific category IDs
    first_order_only BOOLEAN DEFAULT FALSE,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Track discount usage
CREATE TABLE IF NOT EXISTS discount_usage (
    id SERIAL PRIMARY KEY,
    discount_code_id INTEGER REFERENCES discount_codes(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
    `

    // Execute the schema
    await sql.query(schemaSQL)

    // Create indexes
    const indexSQL = `
-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Products
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Orders
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(order_type);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON active_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON active_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON active_subscriptions(next_billing_date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_delivery ON active_subscriptions(next_delivery_date);

-- Deliveries
CREATE INDEX IF NOT EXISTS idx_deliveries_scheduled_date ON deliveries(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
    `

    await sql.query(indexSQL)

    // Insert sample data
    const sampleDataSQL = `
-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert product categories
INSERT INTO product_categories (name, slug, description) VALUES
('Meal Plans', 'meal-plans', 'Subscription-based meal delivery plans'),
('Individual Meals', 'individual-meals', 'One-time meal purchases'),
('Snacks & Supplements', 'snacks-supplements', 'Healthy snacks and nutritional supplements'),
('Beverages', 'beverages', 'Healthy drinks and smoothies'),
('Accessories', 'accessories', 'Meal prep containers and accessories')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, product_type, base_price, stock_quantity, nutritional_info, dietary_tags) VALUES
-- Subscription Plans
('Weight Loss Plan', 'weight-loss-plan', 'Balanced meals designed for healthy weight loss', 'subscription', 299.00, 999, '{"calories": 1400, "protein": 120, "carbs": 140, "fat": 45}', ARRAY['low-calorie', 'high-protein']),
('Muscle Building Plan', 'muscle-building-plan', 'High-protein meals for muscle growth', 'subscription', 399.00, 999, '{"calories": 2200, "protein": 180, "carbs": 220, "fat": 80}', ARRAY['high-protein', 'high-calorie']),
('Keto Plan', 'keto-plan', 'Low-carb, high-fat ketogenic meals', 'subscription', 349.00, 999, '{"calories": 1800, "protein": 120, "carbs": 30, "fat": 140}', ARRAY['keto', 'low-carb']),

-- Individual Meals
('Grilled Chicken Bowl', 'grilled-chicken-bowl', 'Grilled chicken with quinoa and vegetables', 'simple', 45.00, 25, '{"calories": 520, "protein": 35, "carbs": 45, "fat": 18}', ARRAY['high-protein', 'gluten-free']),
('Salmon Teriyaki', 'salmon-teriyaki', 'Fresh salmon with teriyaki glaze and rice', 'simple', 55.00, 20, '{"calories": 580, "protein": 40, "carbs": 50, "fat": 22}', ARRAY['high-protein', 'omega-3']),

-- Snacks
('Protein Bar - Chocolate', 'protein-bar-chocolate', 'High-protein chocolate bar', 'simple', 25.00, 100, '{"calories": 250, "protein": 20, "carbs": 25, "fat": 8}', ARRAY['high-protein']),
('Mixed Nuts', 'mixed-nuts', 'Premium mix of almonds, walnuts, and cashews', 'simple', 35.00, 50, '{"calories": 180, "protein": 6, "carbs": 6, "fat": 16}', ARRAY['keto', 'vegan'])
ON CONFLICT (slug) DO NOTHING;

-- Insert subscription plans
INSERT INTO subscription_plans (product_id, name, description, billing_period, price, items_per_delivery) 
SELECT p.id, p.name, p.description, 'monthly', p.base_price, 12
FROM products p 
WHERE p.product_type = 'subscription'
ON CONFLICT DO NOTHING;

-- Insert sample customers
INSERT INTO customers (first_name, last_name, email, phone, status) VALUES
('Ahmed', 'Benali', 'ahmed.benali@email.com', '+212-6-12-34-56-78', 'active'),
('Fatima', 'El Mansouri', 'fatima.elmansouri@email.com', '+212-6-87-65-43-21', 'active'),
('Youssef', 'Alami', 'youssef.alami@email.com', '+212-6-11-22-33-44', 'active')
ON CONFLICT (email) DO NOTHING;

-- Insert sample active subscriptions
INSERT INTO active_subscriptions (customer_id, plan_id, status, billing_period, next_billing_date, billing_amount, next_delivery_date)
SELECT 
    c.id,
    sp.id,
    'active',
    'monthly',
    CURRENT_DATE + INTERVAL '30 days',
    sp.price,
    CURRENT_DATE + INTERVAL '7 days'
FROM customers c
CROSS JOIN subscription_plans sp
WHERE c.email = 'ahmed.benali@email.com' AND sp.name = 'Weight Loss Plan'
LIMIT 1
ON CONFLICT DO NOTHING;
    `

    await sql.query(sampleDataSQL)

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully with complete schema and sample data",
    })
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
