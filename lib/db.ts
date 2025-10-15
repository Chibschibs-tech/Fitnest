import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { pgTable, serial, text, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core"

// --- Lazy Neon init: évite l'appel au build ---
let _neon: ReturnType<typeof neon> | null = null
function getNeon() {
  if (_neon) return _neon
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is missing")
  _neon = neon(url)
  return _neon
}

// Exporte un tag `sql` compatible (avec .array / .transaction)
export const sql: any = ((...args: any[]) => getNeon()(...args)) as any
sql.array = (...args: any[]) => getNeon().array(...args)
sql.transaction = (...args: any[]) => getNeon().transaction?.(...args)

// Drizzle reçoit la fonction, pas d'appel DB au top-level
export const db = drizzle(sql)


// Define the schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"),
  acquisitionSource: text("acquisition_source").default("direct"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  weeklyPrice: decimal("weekly_price", { precision: 10, scale: 2 }).notNull(),
  type: text("type").notNull(),
  caloriesMin: integer("calories_min"),
  caloriesMax: integer("calories_max"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  calories: integer("calories"),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fat: integer("fat"),
  imageUrl: text("image_url"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  category: text("category"),
  tags: text("tags"),
  nutritionalInfo: jsonb("nutritional_info"),
  stock: integer("stock").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  pushNotifications: boolean("push_notifications").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const mealPreferences = pgTable("meal_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  dietaryRestrictions: text("dietary_restrictions"),
  allergies: text("allergies"),
  preferredCuisines: text("preferred_cuisines"),
  dislikedIngredients: text("disliked_ingredients"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  mealPlanPreference: text("meal_plan_preference"),
  city: text("city"),
  notifications: boolean("notifications").default(true),
  createdAt: timestamp("created_at").defaultNow(),
})
