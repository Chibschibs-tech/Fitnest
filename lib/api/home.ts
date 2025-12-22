// Types for API data
export interface MealPlan {
  id: string
  name: string
  description: string
  calories: string
  breakfast_price_per_day: number
  lunch_price_per_day: number
  dinner_price_per_day: number
  snack_price_per_day: number
  features: string[]
  image: string
  color?: string
}

export interface Product {
  id: string
  name: string
  description: string
  image: string
  category: {
    name: string
  }
  price: {
    base: number
    discount: number
  }
  quantity: number
  stock_quantity: number
}

// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'

// Fetch meal plans from API
export async function getMealPlans(): Promise<MealPlan[]> {
  try {
    const response = await fetch(`${API_BASE}/meal-plans?status=active`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Handle different API response structures
    return Array.isArray(data.data) ? data.data : data
  } catch (error) {
    console.error('Failed to fetch meal plans:', error)
    return []
  }
}

// Fetch products from API
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE}/products?status=active`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Handle different API response structures
    return Array.isArray(data.data) ? data.data : data
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return []
  }
}
