import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Create a type-safe interface for product data
export interface Product {
  id: number
  name: string
  description: string
  price: number
  salePrice?: number
  imageUrl?: string
  category: string
  stock: number
  isActive: boolean
}

// Create a type-safe interface for cart item data
export interface CartItem {
  id: number
  userId: string
  productId: number
  quantity: number
  product?: Product
}

// Helper function to get the authenticated user ID
export async function getAuthenticatedUserId(): Promise<string> {
  const session = await getServerSession(authOptions)

  if (!session || !session.user || !session.user.id) {
    throw new Error("Not authenticated")
  }

  return session.user.id
}

// Helper function to ensure the cart_items table exists
export async function ensureCartTable() {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    return true
  } catch (error) {
    console.error("Error creating cart_items table:", error)
    return false
  }
}

// Helper function to get products with consistent column naming
export async function getProducts(limit = 20): Promise<Product[]> {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    const products = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        saleprice as "salePrice", 
        imageurl as "imageUrl", 
        category,
        stock,
        isactive as "isActive"
      FROM products
      WHERE isactive = true
      ORDER BY id
      LIMIT ${limit}
    `

    return products as Product[]
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

// Helper function to get a single product by ID
export async function getProductById(id: string | number): Promise<Product | null> {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    const products = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        saleprice as "salePrice", 
        imageurl as "imageUrl", 
        category,
        stock,
        isactive as "isActive"
      FROM products
      WHERE id = ${id}
    `

    return products.length > 0 ? (products[0] as Product) : null
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error)
    return null
  }
}

// Helper function to get cart items for a user
export async function getCartItems(userId: string): Promise<CartItem[]> {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    // Ensure cart table exists
    await ensureCartTable()

    const cartItems = await sql`
      SELECT 
        ci.id, 
        ci.user_id as "userId", 
        ci.product_id as "productId", 
        ci.quantity
      FROM cart_items ci
      WHERE ci.user_id = ${userId}
    `

    // Get product details for each cart item
    const itemsWithProducts: CartItem[] = []

    for (const item of cartItems) {
      const product = await getProductById(item.productId)

      if (product) {
        itemsWithProducts.push({
          ...item,
          product,
        })
      }
    }

    return itemsWithProducts
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return []
  }
}

// Helper function to add an item to the cart
export async function addToCart(
  userId: string,
  productId: number,
  quantity: number,
): Promise<{ success: boolean; message: string; item?: CartItem }> {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    // Ensure cart table exists
    await ensureCartTable()

    // Check if product exists
    const product = await getProductById(productId)

    if (!product) {
      return { success: false, message: "Product not found" }
    }

    // Check if item already exists in cart
    const existingItems = await sql`
      SELECT id, quantity FROM cart_items 
      WHERE user_id = ${userId} AND product_id = ${productId}
    `

    if (existingItems.length > 0) {
      // Update existing cart item
      const existingItem = existingItems[0]
      const newQuantity = existingItem.quantity + quantity

      await sql`
        UPDATE cart_items 
        SET quantity = ${newQuantity}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existingItem.id}
      `

      return {
        success: true,
        message: "Cart updated successfully",
        item: {
          id: existingItem.id,
          userId,
          productId,
          quantity: newQuantity,
          product,
        },
      }
    } else {
      // Add new item to cart
      const result = await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${userId}, ${productId}, ${quantity})
        RETURNING id
      `

      return {
        success: true,
        message: "Item added to cart successfully",
        item: {
          id: result[0].id,
          userId,
          productId,
          quantity,
          product,
        },
      }
    }
  } catch (error) {
    console.error("Error adding item to cart:", error)
    return { success: false, message: "Failed to add item to cart" }
  }
}

// Helper function to remove an item from the cart
export async function removeFromCart(userId: string, itemId: number): Promise<{ success: boolean; message: string }> {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    // Check if the item exists and belongs to the user
    const existingItems = await sql`
      SELECT id FROM cart_items
      WHERE id = ${itemId} AND user_id = ${userId}
    `

    if (existingItems.length === 0) {
      return { success: false, message: "Cart item not found" }
    }

    // Delete the item
    await sql`
      DELETE FROM cart_items
      WHERE id = ${itemId}
    `

    return { success: true, message: "Item removed from cart" }
  } catch (error) {
    console.error("Error removing item from cart:", error)
    return { success: false, message: "Failed to remove item from cart" }
  }
}

// Helper function to update cart item quantity
export async function updateCartItemQuantity(
  userId: string,
  itemId: number,
  quantity: number,
): Promise<{ success: boolean; message: string }> {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    // Check if the item exists and belongs to the user
    const existingItems = await sql`
      SELECT id FROM cart_items
      WHERE id = ${itemId} AND user_id = ${userId}
    `

    if (existingItems.length === 0) {
      return { success: false, message: "Cart item not found" }
    }

    // Update the item quantity
    await sql`
      UPDATE cart_items
      SET quantity = ${quantity}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${itemId}
    `

    return { success: true, message: "Cart item updated" }
  } catch (error) {
    console.error("Error updating cart item:", error)
    return { success: false, message: "Failed to update cart item" }
  }
}

// Helper function to clear the cart
export async function clearCart(userId: string): Promise<{ success: boolean; message: string }> {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    await sql`
      DELETE FROM cart_items
      WHERE user_id = ${userId}
    `

    return { success: true, message: "Cart cleared" }
  } catch (error) {
    console.error("Error clearing cart:", error)
    return { success: false, message: "Failed to clear cart" }
  }
}

// Helper function to get cart count
export async function getCartCount(userId: string): Promise<number> {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    // Ensure cart table exists
    await ensureCartTable()

    const result = await sql`
      SELECT COUNT(*) as count FROM cart_items
      WHERE user_id = ${userId}
    `

    return result[0].count || 0
  } catch (error) {
    console.error("Error getting cart count:", error)
    return 0
  }
}

// Helper function to ensure products table exists and has data
export async function ensureProductsExist(): Promise<boolean> {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    // Check if products table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const productsTableExists = tables.some((t) => t.table_name === "products")

    if (!productsTableExists) {
      // Create products table
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          price INTEGER NOT NULL,
          saleprice INTEGER,
          imageurl VARCHAR(255),
          category VARCHAR(100) NOT NULL,
          stock INTEGER NOT NULL DEFAULT 0,
          isactive BOOLEAN NOT NULL DEFAULT TRUE,
          createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    }

    // Check if products table has data
    const productCount = await sql`SELECT COUNT(*) as count FROM products`

    if (productCount[0].count === 0) {
      // Seed products table with sample data
      await sql`
        INSERT INTO products (name, description, price, saleprice, imageurl, category, stock, isactive)
        VALUES 
          ('Protein Bar - Chocolate', 'Delicious chocolate protein bar with 20g of protein.', 1500, 1200, '/protein-bar.png', 'protein_bars', 100, TRUE),
          ('Berry Protein Bar', 'Mixed berry protein bar with 18g of protein.', 1500, NULL, '/berry-protein-bar.png', 'protein_bars', 75, TRUE),
          ('Honey Almond Granola', 'Crunchy granola with honey and almonds.', 2000, 1800, '/honey-almond-granola.png', 'granola', 50, TRUE),
          ('Protein Pancake Mix', 'High-protein pancake mix, just add water.', 3500, 3000, '/protein-pancake-mix.png', 'mixes', 30, TRUE),
          ('Energy Balls - Peanut Butter', 'Peanut butter energy balls, perfect pre-workout snack.', 1000, NULL, '/peanut-butter-energy-balls.png', 'energy_balls', 60, TRUE)
      `
    }

    return true
  } catch (error) {
    console.error("Error ensuring products exist:", error)
    return false
  }
}
