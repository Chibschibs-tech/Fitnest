import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("Creating pricing tables...")

    // Execute the SQL script to create tables and seed data
    await sql`
      -- Drop existing tables if they exist
      DROP TABLE IF EXISTS discount_rules CASCADE;
      DROP TABLE IF EXISTS meal_type_prices CASCADE;

      -- Create meal_type_prices table
      CREATE TABLE meal_type_prices (
        id SERIAL PRIMARY KEY,
        plan_name TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        base_price_mad NUMERIC(10,2) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(plan_name, meal_type)
      );

      -- Create discount_rules table
      CREATE TABLE discount_rules (
        id SERIAL PRIMARY KEY,
        discount_type TEXT NOT NULL,
        condition_value INT NOT NULL,
        discount_percentage NUMERIC(5,4) NOT NULL,
        stackable BOOLEAN DEFAULT true,
        is_active BOOLEAN DEFAULT true,
        valid_from TIMESTAMP NULL,
        valid_to TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `

    // Insert seed data for meal prices
    await sql`
      INSERT INTO meal_type_prices (plan_name, meal_type, base_price_mad) VALUES
      ('Weight Loss', 'Breakfast', 45.00),
      ('Weight Loss', 'Lunch', 55.00),
      ('Weight Loss', 'Dinner', 50.00),
      ('Stay Fit', 'Breakfast', 50.00),
      ('Stay Fit', 'Lunch', 60.00),
      ('Stay Fit', 'Dinner', 55.00),
      ('Muscle Gain', 'Breakfast', 55.00),
      ('Muscle Gain', 'Lunch', 70.00),
      ('Muscle Gain', 'Dinner', 65.00);
    `

    // Insert seed data for discount rules
    await sql`
      INSERT INTO discount_rules (discount_type, condition_value, discount_percentage, stackable) VALUES
      ('days_per_week', 5, 0.0300, true),
      ('days_per_week', 6, 0.0500, true),
      ('days_per_week', 7, 0.0700, true),
      ('duration_weeks', 2, 0.0500, true),
      ('duration_weeks', 4, 0.1000, true),
      ('duration_weeks', 8, 0.1500, true),
      ('duration_weeks', 12, 0.2000, true);
    `

    // Create indexes
    await sql`
      CREATE INDEX idx_meal_type_prices_plan ON meal_type_prices(plan_name);
      CREATE INDEX idx_meal_type_prices_active ON meal_type_prices(is_active);
      CREATE INDEX idx_discount_rules_type ON discount_rules(discount_type);
      CREATE INDEX idx_discount_rules_active ON discount_rules(is_active);
      CREATE INDEX idx_discount_rules_dates ON discount_rules(valid_from, valid_to);
    `

    // Create update function and triggers
    await sql`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      CREATE TRIGGER update_meal_type_prices_updated_at 
          BEFORE UPDATE ON meal_type_prices 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      CREATE TRIGGER update_discount_rules_updated_at 
          BEFORE UPDATE ON discount_rules 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    `

    console.log("Pricing tables created successfully")

    return NextResponse.json({
      message: "Pricing tables created successfully",
      details: {
        mealPricesCreated: 9,
        discountRulesCreated: 7,
        indexesCreated: 5,
        triggersCreated: 2,
      },
    })
  } catch (error) {
    console.error("Error creating pricing tables:", error)
    return NextResponse.json(
      {
        error: "Failed to create pricing tables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
