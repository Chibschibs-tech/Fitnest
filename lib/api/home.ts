// Types for API data
export interface MealPlan {
  id: string
  name: string
  description: string
  calories?: string
  breakfast_price_per_day: number
  lunch_price_per_day: number
  dinner_price_per_day: number
  snack_price_per_day: number
  features?: string[]
  image: string
  color?: string
  sku: string
  status: string
  created_at: string
  updated_at: string
  meals: any
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

export interface Meal {
  id: string
  name: string
  description: string
  image: string
  sku: string
  calories: number
  protein: number
  carbohydrates: number
  fats: number
  status: "active" | "inactive"
  updated_at: string
  created_at: string
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
    const plans = Array.isArray(data.data) ? data.data : data
    
    // Ensure all required fields are present
    return plans.map((plan: any) => ({
      id: plan.id || '',
      name: plan.name || '',
      description: plan.description || '',
      calories: plan.calories || '',
      breakfast_price_per_day: Number(plan.breakfast_price_per_day) || 0,
      lunch_price_per_day: Number(plan.lunch_price_per_day) || 0,
      dinner_price_per_day: Number(plan.dinner_price_per_day) || 0,
      snack_price_per_day: Number(plan.snack_price_per_day) || 0,
      features: plan.features || [],
      image: plan.image || '/placeholder.svg',
      color: plan.color,
      sku: plan.sku || '',
      status: plan.status || 'active',
      created_at: plan.created_at || new Date().toISOString(),
      updated_at: plan.updated_at || new Date().toISOString(),
      meals: plan.meals || {},
    }))
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

// Fetch meals from API
export async function getMeals(): Promise<Meal[]> {
  try {
    const response = await fetch(`${API_BASE}/meals?status=active`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Handle different API response structures
    return Array.isArray(data.data) ? data.data : data
  } catch (error) {
    console.error('Failed to fetch meals:', error)
    return []
  }
}
