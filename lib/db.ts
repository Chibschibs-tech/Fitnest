import { drizzle } from "drizzle-orm/neon-serverless"
import { pgTable, serial, text, timestamp, integer, boolean, pgEnum, date, unique, jsonb } from "drizzle-orm/pg-core"
import { neon } from "@neondatabase/serverless"

// Helper function to get the database URL with fallbacks
function getDatabaseUrl(): string {
  // Try different environment variables in order of preference
  const dbUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL

  if (!dbUrl) {
    throw new Error("No database URL found in environment variables")
  }

  return dbUrl
}

// Create a reusable SQL client
export function createDbClient() {
  try {
    const dbUrl = getDatabaseUrl()
    return neon(dbUrl)
  } catch (error) {
    console.error("Failed to create database client:", error)
    throw error
  }
}

// Export a singleton instance for reuse
export const sql = createDbClient()

// Create the drizzle instance that other parts of the codebase expect
export const db = drizzle(sql)

// Helper function to safely execute database queries with error handling
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const dbClient = createDbClient()
    return await dbClient(query, params)
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Create the schema
export const userRoleEnum = pgEnum("user_role", ["admin", "customer"])

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("customer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const planTypeEnum = pgEnum("plan_type", [
  "weight_loss",
  "balanced",
  "muscle_gain",
  "keto",
  "vegetarian",
  "vegan",
])

export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: planTypeEnum("type").notNull(),
  caloriesMin: integer("calories_min").notNull(),
  caloriesMax: integer("calories_max").notNull(),
  price5Days: integer("price_5_days").notNull(),
  price7Days: integer("price_7_days").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// New enum for order types
export const orderTypeEnum = pgEnum("order_type", ["meal_plan", "express_shop", "mixed"])

export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "delivered", "cancelled"])

// Updated orders table with orderType field
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planId: integer("plan_id"), // Now optional since express orders won't have a plan
  status: orderStatusEnum("status").default("pending").notNull(),
  orderType: orderTypeEnum("order_type").default("meal_plan").notNull(), // New field
  totalAmount: integer("total_amount").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  deliveryDate: timestamp("delivery_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Make sure the meals table has all the fields we need
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(),
  carbs: integer("carbs").notNull(),
  fat: integer("fat").notNull(),
  imageUrl: text("image_url"),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  tags: text("tags").notNull(), // Store as JSON string
  dietaryInfo: text("dietary_info").notNull(), // Store as JSON string
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const planMeals = pgTable("plan_meals", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id").notNull(),
  mealId: integer("meal_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 1-7 for Monday-Sunday
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// New tables for the express shop

// Products table for express shop items - UPDATED with column names without underscores
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents/dirhams
  salePrice: integer("saleprice"), // Changed to match database column name
  imageUrl: text("imageurl"), // Changed to match database column name
  category: text("category").notNull(), // protein_bars, granola, energy_balls, etc.
  tags: text("tags"), // Store as JSON string
  nutritionalInfo: jsonb("nutritionalinfo"), // Changed to match database column name
  stock: integer("stock").notNull().default(0),
  isActive: boolean("isactive").default(true).notNull(), // Changed to match database column name
  createdAt: timestamp("createdat").defaultNow().notNull(),
  updatedAt: timestamp("updatedat").defaultNow().notNull(),
})

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Order items table for express shop orders
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: integer("price_at_purchase").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Existing tables from the migration

export const mealPreferences = pgTable(
  "meal_preferences",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    planType: planTypeEnum("plan_type").notNull(),
    calorieTarget: integer("calorie_target").notNull(),
    mealsPerDay: integer("meals_per_day").notNull(),
    daysPerWeek: integer("days_per_week").notNull(),
    dietaryPreferences: text("dietary_preferences").notNull(), // Store as JSON string
    allergies: text("allergies").notNull(), // Store as JSON string
    excludedIngredients: text("excluded_ingredients").notNull(), // Store as JSON string
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdUnique: unique().on(table.userId),
    }
  },
)

export const deliverySlots = pgTable("delivery_slots", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  deliveryDate: date("delivery_date").notNull(),
  timeSlot: text("time_slot").notNull(),
  status: text("status").default("scheduled").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  paymentType: text("payment_type").notNull(),
  cardLastFour: text("card_last_four"),
  cardExpiry: text("card_expiry"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  orderId: integer("order_id"),
  amount: integer("amount").notNull(),
  paymentMethodId: integer("payment_method_id"),
  status: text("status").notNull(),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const notificationPreferences = pgTable(
  "notification_preferences",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    emailOrderUpdates: boolean("email_order_updates").default(true).notNull(),
    emailMenuUpdates: boolean("email_menu_updates").default(true).notNull(),
    emailPromotions: boolean("email_promotions").default(false).notNull(),
    smsDeliveryUpdates: boolean("sms_delivery_updates").default(true).notNull(),
    smsReminders: boolean("sms_reminders").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdUnique: unique().on(table.userId),
    }
  },
)

// Add a helper function to check database connectivity
export async function checkDatabaseConnection() {
  try {
    const dbClient = createDbClient()
    const result = await dbClient`SELECT NOW()`
    return {
      connected: true,
      serverTime: result[0]?.now,
    }
  } catch (error) {
    console.error("Database connection check failed:", error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
