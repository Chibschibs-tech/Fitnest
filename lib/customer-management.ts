import { sql, db } from "@/lib/db"

const sql = neon(process.env.DATABASE_URL!)

export interface Customer {
  id: number
  user_id: number
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  customer_since: Date
  total_orders: number
  total_spent: number
  last_order_date?: Date
  status: "active" | "inactive" | "suspended"
  acquisition_source: string
  notes?: string
}

export interface CustomerStats {
  totalCustomers: number
  activeCustomers: number
  newThisMonth: number
  totalRevenue: number
  avgOrderValue: number
  topSpenders: Customer[]
}

// Create customers table if it doesn't exist
export async function initCustomersTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        postal_code VARCHAR(20),
        customer_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_orders INTEGER DEFAULT 0,
        total_spent DECIMAL(10,2) DEFAULT 0.00,
        last_order_date TIMESTAMP,
        status VARCHAR(20) DEFAULT 'active',
        acquisition_source VARCHAR(50) DEFAULT 'direct',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create index for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
      CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
      CREATE INDEX IF NOT EXISTS idx_customers_city ON customers(city);
    `

    console.log("Customers table initialized successfully")
    return true
  } catch (error) {
    console.error("Error initializing customers table:", error)
    return false
  }
}

// Create a customer profile when a user registers
export async function createCustomerProfile(
  userId: number,
  additionalData?: {
    phone?: string
    address?: string
    city?: string
    postal_code?: string
    acquisition_source?: string
  },
) {
  try {
    const result = await sql`
      INSERT INTO customers (
        user_id, 
        phone, 
        address, 
        city, 
        postal_code, 
        acquisition_source
      )
      VALUES (
        ${userId},
        ${additionalData?.phone || null},
        ${additionalData?.address || null},
        ${additionalData?.city || null},
        ${additionalData?.postal_code || null},
        ${additionalData?.acquisition_source || "direct"}
      )
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error("Error creating customer profile:", error)
    return null
  }
}

// Get customer with user details
export async function getCustomerById(customerId: number) {
  try {
    const result = await sql`
      SELECT 
        c.*,
        u.name,
        u.email,
        u.created_at as user_created_at
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ${customerId}
    `

    return result[0] || null
  } catch (error) {
    console.error("Error getting customer:", error)
    return null
  }
}

// Get all customers with stats
export async function getAllCustomers(filters?: {
  status?: string
  city?: string
  search?: string
  limit?: number
  offset?: number
}) {
  try {
    let whereClause = "WHERE u.role != 'admin'"
    const params: any[] = []

    if (filters?.status) {
      whereClause += ` AND c.status = $${params.length + 1}`
      params.push(filters.status)
    }

    if (filters?.city) {
      whereClause += ` AND c.city = $${params.length + 1}`
      params.push(filters.city)
    }

    if (filters?.search) {
      whereClause += ` AND (u.name ILIKE $${params.length + 1} OR u.email ILIKE $${params.length + 1})`
      params.push(`%${filters.search}%`)
    }

    const limitClause = filters?.limit ? `LIMIT ${filters.limit}` : ""
    const offsetClause = filters?.offset ? `OFFSET ${filters.offset}` : ""

    const customers = await sql`
      SELECT 
        c.id,
        c.user_id,
        u.name,
        u.email,
        c.phone,
        c.address,
        c.city,
        c.postal_code,
        c.customer_since,
        c.total_orders,
        c.total_spent,
        c.last_order_date,
        c.status,
        c.acquisition_source,
        c.notes,
        u.created_at as user_created_at
      FROM customers c
      JOIN users u ON c.user_id = u.id
      ${whereClause}
      ORDER BY c.customer_since DESC
      ${limitClause} ${offsetClause}
    `

    return customers
  } catch (error) {
    console.error("Error getting customers:", error)
    return []
  }
}

// Update customer stats when an order is placed
export async function updateCustomerStats(userId: number, orderTotal: number) {
  try {
    await sql`
      UPDATE customers 
      SET 
        total_orders = total_orders + 1,
        total_spent = total_spent + ${orderTotal},
        last_order_date = CURRENT_TIMESTAMP,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
    `

    return true
  } catch (error) {
    console.error("Error updating customer stats:", error)
    return false
  }
}

// Get customer statistics
export async function getCustomerStats(): Promise<CustomerStats> {
  try {
    const [totalStats] = await sql`
      SELECT 
        COUNT(*) as total_customers,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_customers,
        COUNT(CASE WHEN customer_since >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as new_this_month,
        COALESCE(SUM(total_spent), 0) as total_revenue,
        COALESCE(AVG(CASE WHEN total_orders > 0 THEN total_spent / total_orders END), 0) as avg_order_value
      FROM customers
    `

    const topSpenders = await sql`
      SELECT 
        c.id,
        c.user_id,
        u.name,
        u.email,
        c.total_spent,
        c.total_orders,
        c.status
      FROM customers c
      JOIN users u ON c.user_id = u.id
      WHERE c.total_spent > 0
      ORDER BY c.total_spent DESC
      LIMIT 10
    `

    return {
      totalCustomers: Number.parseInt(totalStats.total_customers),
      activeCustomers: Number.parseInt(totalStats.active_customers),
      newThisMonth: Number.parseInt(totalStats.new_this_month),
      totalRevenue: Number.parseFloat(totalStats.total_revenue),
      avgOrderValue: Number.parseFloat(totalStats.avg_order_value),
      topSpenders: topSpenders as Customer[],
    }
  } catch (error) {
    console.error("Error getting customer stats:", error)
    return {
      totalCustomers: 0,
      activeCustomers: 0,
      newThisMonth: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      topSpenders: [],
    }
  }
}
