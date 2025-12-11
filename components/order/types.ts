export interface MealPlan {
    id: string
    name: string
    description: string
    image: string
    sku: string
    status: string
    breakfast_price_per_day: number
    lunch_price_per_day: number
    dinner_price_per_day: number
    snack_price_per_day: number
    created_at: string
    updated_at: string
  }
  
  export interface APIResponse<T> {
    success?: boolean
    data?: T
    mealPlans?: T
  }

  export interface OrderPreferences {
    selectedMeals: string[] // ['breakfast', 'lunch', 'dinner']
    snacksPerDay: number // 0, 1, or 2
    duration: 1 | 2 | 4 // weeks
    deliveryDays: Date[]
  }
  
  export interface MealType {
    id: string
    label: string
    description: string
    icon: string
  }