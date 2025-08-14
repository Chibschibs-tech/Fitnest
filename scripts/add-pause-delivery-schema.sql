-- Check if orders table exists and add pause-related columns if needed
DO $$
BEGIN
    -- Check if orders table exists
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
        -- Add pause-related columns if they don't exist
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'pause_count') THEN
            ALTER TABLE orders ADD COLUMN pause_count INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'paused_at') THEN
            ALTER TABLE orders ADD COLUMN paused_at TIMESTAMP NULL;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'pause_duration_days') THEN
            ALTER TABLE orders ADD COLUMN pause_duration_days INTEGER NULL;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'original_end_date') THEN
            ALTER TABLE orders ADD COLUMN original_end_date DATE NULL;
        END IF;
        
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'extended_end_date') THEN
            ALTER TABLE orders ADD COLUMN extended_end_date DATE NULL;
        END IF;
    END IF;
END $$;

-- Create deliveries table if it doesn't exist
CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  scheduled_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  delivered_at TIMESTAMP NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_scheduled_date ON deliveries(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
