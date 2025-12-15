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
    meals: any
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
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
    status: 'active' | 'inactive'
    updated_at: string
    created_at: string
  }
  
  export interface MealSelections {
    [dayISO: string]: {
      [mealType: string]: string // meal ID
    }
  }
  
  export interface MenuBuildData {
    selections: MealSelections
  }