import MealCustomizationClient from "./client-page"
import { MealPreferencesBridge } from "@/components/meal-preferences-bridge"

export default function MealCustomizationPage() {
  return (
    <>
      <MealPreferencesBridge />
      <MealCustomizationClient />
    </>
  )
}
