import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

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
export async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    // For guest users, use cart ID from cookie
    const cookieStore = cookies()
    let cartId = cookieStore.get("cartId")?.value

    if (!cartId) {
      cartId = uuidv4()
      // Note: We can't set cookies here since this is a server function
    }

    return cartId
  }

  return session.user.id
}

// Get products
export async function getProducts() {
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
        category,
        tags,
        stock
      FROM products
      WHERE isactive = true
      ORDER BY id ASC
    `

    return products
  } catch (error) {
    console.error("Error getting products:", error)
    return []
  }
}

// Get product by ID
export async function getProductById(id: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const product = await sql`
      SELECT 
        id, 
        name, 
        description, 
        price, 
        saleprice as "salePrice", 
        imageurl as "imageUrl", 
        category,
        tags,
        nutritionalinfo as "nutritionalInfo",
        stock
      FROM products
      WHERE id = ${id} AND isactive = true
    `

    if (product.length === 0) {
      return null
    }

    return product[0]
  } catch (error) {
    console.error("Error getting product:", error)
    return null
  }
}

// Ensure products exist
export async function ensureProductsExist() {
  const sql = neon(process.env.DATABASE_URL!)

  // Check if products table exists
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'products'
  `

  if (tables.length === 0) {
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
        nutritionalinfo JSONB,
        stock INTEGER DEFAULT 0,
        isactive BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Seed products
    await sql`
      INSERT INTO products (name, description, price, saleprice, imageurl, category, stock)
      VALUES 
        ('Protein Bar', 'Delicious protein bar with 20g of protein', 15.99, NULL, '/protein-bar.png', 'snacks', 100),
        ('Berry Protein Bar', 'Berry flavored protein bar with 18g of protein', 16.99, 14.99, '/berry-protein-bar.png', 'snacks', 80),
        ('Chocolate Peanut Butter Protein Bars', 'Rich chocolate and peanut butter protein bars', 39.99, 34.99, '/chocolate-peanut-butter-protein-bars.png', 'snacks', 50),
        ('Protein Bar Variety Pack', 'Try all our delicious protein bar flavors', 45.99, NULL, '/protein-bar-variety-pack.png', 'snacks', 40),
        ('Honey Almond Granola', 'Crunchy granola with honey and almonds', 12.99, NULL, '/honey-almond-granola.png', 'breakfast', 60),
        ('Maple Pecan Granola - Medium Pack', 'Sweet maple granola with pecans', 18.99, 16.99, '/maple-pecan-granola-medium-pack.png', 'breakfast', 45),
        ('Maple Pecan Granola - Large Pack', 'Sweet maple granola with pecans - family size', 29.99, 26.99, '/maple-pecan-granola-large-pack.png', 'breakfast', 30),
        ('Healthy Protein Pancake Mix', 'Make delicious protein-packed pancakes at home', 24.99, NULL, '/healthy-protein-pancake-mix.png', 'breakfast', 25),
        ('Energy Drink', 'Natural energy drink with vitamins', 12.99, NULL, '/vibrant-energy-drink.png', 'drinks', 120),
        ('Protein Powder', 'Whey protein powder for muscle recovery', 49.99, 44.99, '/protein-powder-assortment.png', 'supplements', 35)
    `
  }
}

// Ensure cart table exists
export async function ensureCartTable() {
  const sql = neon(process.env.DATABASE_URL!)

  // Check if cart_items table exists
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'cart_items'
  `

  if (tables.length === 0) {
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
}

// Add item to cart
export async function addToCart(userId: string, productId: number, quantity: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if product exists
    const product = await sql`SELECT id FROM products WHERE id = ${productId}`

    if (product.length === 0) {
      return { success: false, message: "Product not found" }
    }

    // Check if item already exists in cart
    const existingItem = await sql`
      SELECT * FROM cart_items WHERE user_id = ${userId} AND product_id = ${productId}
    `

    if (existingItem.length > 0) {
      // Update quantity if item exists
      await sql`
        UPDATE cart_items 
        SET quantity = quantity + ${quantity}, updated_at = CURRENT_TIMESTAMP 
        WHERE user_id = ${userId} AND product_id = ${productId}
      `
    } else {
      // Add new item to cart
      await sql`
        INSERT INTO cart_items (user_id, product_id, quantity) 
        VALUES (${userId}, ${productId}, ${quantity})
      `
    }

    return { success: true, message: "Item added to cart" }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return { success: false, message: "Failed to add item to cart" }
  }
}

// Get cart items
export async function getCartItems(userId: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Get cart items with product details
    const cartItems = await sql`
      SELECT ci.*, p.name, p.description, p.price, p.saleprice, p.imageurl, p.category
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ${userId}
    `

    // Format the response
    return cartItems.map((item) => ({
      id: item.id,
      userId: item.user_id,
      productId: item.product_id,
      quantity: item.quantity,
      product: {
        id: item.product_id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        salePrice: item.saleprice ? Number(item.saleprice) : undefined,
        imageUrl: item.imageurl,
        category: item.category,
      },
    }))
  } catch (error) {
    console.error("Error getting cart items:", error)
    return []
  }
}

// Remove item from cart
export async function removeFromCart(userId: string, itemId: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if item exists in cart
    const existingItem = await sql`
      SELECT * FROM cart_items WHERE user_id = ${userId} AND id = ${itemId}
    `

    if (existingItem.length === 0) {
      return { success: false, message: "Item not found in cart" }
    }

    // Remove item from cart
    await sql`
      DELETE FROM cart_items WHERE user_id = ${userId} AND id = ${itemId}
    `

    return { success: true, message: "Item removed from cart" }
  } catch (error) {
    console.error("Error removing from cart:", error)
    return { success: false, message: "Failed to remove item from cart" }
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(userId: string, itemId: number, quantity: number) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Check if item exists in cart
    const existingItem = await sql`
      SELECT * FROM cart_items WHERE user_id = ${userId} AND id = ${itemId}
    `

    if (existingItem.length === 0) {
      return { success: false, message: "Item not found in cart" }
    }

    // Update quantity
    await sql`
      UPDATE cart_items 
      SET quantity = ${quantity}, updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ${userId} AND id = ${itemId}
    `

    return { success: true, message: "Cart item updated" }
  } catch (error) {
    console.error("Error updating cart item:", error)
    return { success: false, message: "Failed to update cart item" }
  }
}

// Clear cart
export async function clearCart(userId: string) {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Remove all items from cart
    await sql`
      DELETE FROM cart_items WHERE user_id = ${userId}
    `

    return { success: true, message: "Cart cleared" }
  } catch (error) {
    console.error("Error clearing cart:", error)
    return { success: false, message: "Failed to clear cart" }
  }
}
