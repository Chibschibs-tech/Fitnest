import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// Basic product type
export type Product = {
  id: number
  name: string
  description: string
  price: number
  salePrice?: number
  imageUrl?: string
  category: string
}

// Basic cart item type
export type CartItem = {
  id: number
  productId: number
  quantity: number
  product?: Product
}

// Get authenticated user ID
export async function getAuthenticatedUserId(): Promise<string> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Not authenticated")
  }

  return session.user.id as string
}

// Get products
export async function getProducts(): Promise<Product[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const products = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        saleprice as "salePrice", 
        imageurl as "imageUrl", 
        category
      FROM products
      LIMIT 20
    `

    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const products = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        saleprice as "salePrice", 
        imageurl as "imageUrl", 
        category
      FROM products
      WHERE id = ${id}
    `

    return products[0] || null
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

// Ensure products exist
export async function ensureProductsExist(): Promise<void> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

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
        CREATE TABLE products (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          saleprice DECIMAL(10, 2),
          imageurl VARCHAR(255),
          category VARCHAR(50),
          tags VARCHAR(255),
          stock INTEGER DEFAULT 0
        )
      `
    }

    // Check if products exist
    const productCount = await sql`SELECT COUNT(*) as count FROM products`

    if (productCount[0].count === 0) {
      // Seed products
      await sql`
        INSERT INTO products (name, description, price, category, imageurl, stock)
        VALUES 
          ('Protein Bar', 'Delicious protein bar with 20g of protein', 15.99, 'snacks', '/protein-bar.png', 100),
          ('Energy Drink', 'Natural energy drink with vitamins', 12.99, 'drinks', '/vibrant-energy-drink.png', 50),
          ('Protein Powder', 'Whey protein powder for muscle recovery', 49.99, 'supplements', '/protein-powder-assortment.png', 30),
          ('Healthy Snack Box', 'Assortment of healthy snacks', 29.99, 'snacks', '/placeholder-s2uzc.png', 20)
      `
    }
  } catch (error) {
    console.error("Error ensuring products exist:", error)
  }
}

// Ensure cart table exists
export async function ensureCartTable(): Promise<void> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if cart_items table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `

    const cartTableExists = tables.some((t) => t.table_name === "cart_items")

    if (!cartTableExists) {
      // Create cart_items table
      await sql`
        CREATE TABLE cart_items (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          product_id INTEGER NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
    }
  } catch (error) {
    console.error("Error ensuring cart table exists:", error)
  }
}

// Get cart items
export async function getCartItems(userId: string): Promise<CartItem[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Ensure cart table exists
    await ensureCartTable()

    // Get cart items with product details
    const cartItems = await sql`
      SELECT 
        ci.id,
        ci.product_id as "productId",
        ci.quantity,
        p.id as "product_id",
        p.name as "product_name",
        p.description as "product_description",
        p.price as "product_price",
        p.saleprice as "product_salePrice",
        p.imageurl as "product_imageUrl",
        p.category as "product_category"
      FROM cart_items ci
      LEFT JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ${userId}
    `

    // Transform the result
    return cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: {
        id: item.product_id,
        name: item.product_name,
        description: item.product_description,
        price: item.product_price,
        salePrice: item.product_salePrice,
        imageUrl: item.product_imageUrl,
        category: item.product_category,
      },
    }))
  } catch (error) {
    console.error("Error fetching cart items:", error)
    return []
  }
}

// Add to cart
export async function addToCart(
  userId: string,
  productId: number,
  quantity: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Ensure cart table exists
    await ensureCartTable()

    // Check if product exists
    const product = await sql`SELECT id FROM products WHERE id = ${productId}`

    if (product.length === 0) {
      return { success: false, message: "Product not found" }
    }

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT id, quantity FROM cart_items 
      WHERE user_id = ${userId} AND product_id = ${productId}
    `

    if (existingItem.length > 0) {
      // Update existing cart item
      const newQuantity = existingItem[0].quantity + quantity

      await sql`
        UPDATE cart_items 
        SET quantity = ${newQuantity}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existingItem[0].id}
      `

      return { success: true, message: "Cart updated successfully" }
    } else {
      // Add new item to cart
      await sql`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (${userId}, ${productId}, ${quantity})
      `

      return { success: true, message: "Item added to cart successfully" }
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return { success: false, message: "Failed to add item to cart" }
  }
}

// Get cart count
export async function getCartCount(userId: string): Promise<number> {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Ensure cart table exists
    await ensureCartTable()

    // Get cart count
    const result = await sql`
      SELECT SUM(quantity) as count
      FROM cart_items
      WHERE user_id = ${userId}
    `

    return Number(result[0]?.count || 0)
  } catch (error) {
    console.error("Error fetching cart count:", error)
    return 0
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
