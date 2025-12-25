import { getMealPlans } from "@/lib/api/home"
import { OrderFlow } from "@/components/order/orderFlow"
import type { MealPlan } from "@/components/order/types"

export default async function OrderPage() {
  // Fetch meal plans server-side to avoid CORS
  const mealPlans = await getMealPlans() as MealPlan[]
  
  return <OrderFlow initialMealPlans={mealPlans} />
}
