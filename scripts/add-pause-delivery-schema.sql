-- Add pause-related columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pause_count INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paused_at TIMESTAMP NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pause_duration_days INTEGER NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS original_end_date DATE NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS extended_end_date DATE NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_frequency VARCHAR(20) DEFAULT 'weekly';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_days TEXT DEFAULT 'monday,tuesday,wednesday,thursday,friday';

-- Create deliveries table for tracking individual deliveries
CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, delivered, skipped, paused
  delivered_at TIMESTAMP NULL,
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_scheduled_date ON deliveries(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
