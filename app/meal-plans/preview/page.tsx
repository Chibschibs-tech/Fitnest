import { getMealPreferencesFromCookie } from "@/app/meal-customization/actions"
import { MealPlanPreview } from "@/components/meal-plan-preview"

export async function generateMetadata() {
  const preferences = await getMealPreferencesFromCookie()
  return {
    title: preferences ? "Meal Plan Preview" : "No Meal Plan",
  }
}

export default async function Page() {
  const preferences = await getMealPreferencesFromCookie()

  if (!preferences) {
    return (
      <div className="container mx-auto px-4 py-12 md:px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">No Meal Plan Found</h1>
        <p className="text-gray-600 mb-8">You haven't customized a meal plan yet. Please go back and create one.</p>
        <a
          href="/meal-customization"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          Create Meal Plan
        </a>
      </div>
    )
  }

  return <MealPlanPreview preferences={preferences} />
}
