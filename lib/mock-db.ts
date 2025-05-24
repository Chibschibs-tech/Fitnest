// Mock in-memory database for v0 preview compatibility

interface Product {
  id: number
  name: string
  description: string
  price: number
  salePrice?: number
  imageUrl?: string
  category: string
  stock: number
}

interface CartItem {
  id: number
  productId: number
  userId: string
  quantity: number
  createdAt: Date
}

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

// Mock data storage
const products: Product[] = [
  {
    id: 1,
    name: "Protein Power Bowl",
    description: "High-protein bowl with grilled chicken, quinoa, and fresh vegetables",
    price: 89.99,
    salePrice: 79.99,
    imageUrl: "/chicken-quinoa-power-bowl.png",
    category: "protein",
    stock: 50,
  },
  {
    id: 2,
    name: "Healthy Protein Pancake Mix",
    description: "Premium protein pancake mix for fitness enthusiasts",
    price: 45.0,
    imageUrl: "/healthy-protein-pancake-mix.png",
    category: "supplements",
    stock: 30,
  },
  {
    id: 3,
    name: "Chocolate Peanut Butter Protein Bars",
    description: "Delicious protein bars with chocolate and peanut butter flavor",
    price: 35.0,
    salePrice: 29.99,
    imageUrl: "/chocolate-peanut-butter-protein-bars.png",
    category: "snacks",
    stock: 100,
  },
  {
    id: 4,
    name: "Berry Protein Bar Pack",
    description: "Mixed berry flavored protein bars, pack of 12",
    price: 42.0,
    imageUrl: "/berry-protein-bar.png",
    category: "snacks",
    stock: 75,
  },
  {
    id: 5,
    name: "Maple Pecan Granola",
    description: "Artisanal granola with maple syrup and pecans",
    price: 28.5,
    imageUrl: "/maple-pecan-granola-medium-pack.png",
    category: "breakfast",
    stock: 60,
  },
]

let cartItems: CartItem[] = []
const users: User[] = [
  {
    id: "user1",
    email: "demo@fitnest.ma",
    name: "Demo User",
    role: "user",
  },
]

let nextCartId = 1
let nextProductId = 6

// Database operations
export const mockDb = {
  // Products
  async getProducts(): Promise<Product[]> {
    return [...products]
  },

  async getProduct(id: number): Promise<Product | null> {
    return products.find((p) => p.id === id) || null
  },

  async createProduct(product: Omit<Product, "id">): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: nextProductId++,
    }
    products.push(newProduct)
    return newProduct
  },

  // Cart operations
  async getCartItems(userId: string): Promise<(CartItem & { product: Product })[]> {
    const userCartItems = cartItems.filter((item) => item.userId === userId)
    return userCartItems
      .map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.productId)!,
      }))
      .filter((item) => item.product) // Filter out items where product doesn't exist
  },

  async addToCart(userId: string, productId: number, quantity: number): Promise<CartItem> {
    const existingItem = cartItems.find((item) => item.userId === userId && item.productId === productId)

    if (existingItem) {
      existingItem.quantity += quantity
      return existingItem
    } else {
      const newItem: CartItem = {
        id: nextCartId++,
        userId,
        productId,
        quantity,
        createdAt: new Date(),
      }
      cartItems.push(newItem)
      return newItem
    }
  },

  async updateCartItem(itemId: number, quantity: number): Promise<boolean> {
    const itemIndex = cartItems.findIndex((item) => item.id === itemId)
    if (itemIndex === -1) return false

    if (quantity <= 0) {
      cartItems.splice(itemIndex, 1)
    } else {
      cartItems[itemIndex].quantity = quantity
    }
    return true
  },

  async removeCartItem(itemId: number): Promise<boolean> {
    const itemIndex = cartItems.findIndex((item) => item.id === itemId)
    if (itemIndex === -1) return false

    cartItems.splice(itemIndex, 1)
    return true
  },

  async clearCart(userId: string): Promise<boolean> {
    const initialLength = cartItems.length
    cartItems = cartItems.filter((item) => item.userId !== userId)
    return cartItems.length < initialLength
  },

  async getCartCount(userId: string): Promise<number> {
    return cartItems.filter((item) => item.userId === userId).reduce((total, item) => total + item.quantity, 0)
  },

  // Users
  async getUser(id: string): Promise<User | null> {
    return users.find((u) => u.id === id) || null
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return users.find((u) => u.email === email) || null
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    return {
      status: "healthy",
      timestamp: new Date(),
    }
  },
}

// Helper function to get current user (for demo purposes)
export function getCurrentUser(): User {
  return users[0] // Return the demo user
}
