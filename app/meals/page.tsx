import { UtensilsCrossed } from "lucide-react"
import { getMeals } from "@/lib/api/home"
import { MealsClient } from "./components/meals-client"

export default async function MealsPage() {
  // Fetch meals data server-side (no CORS issues)
  const meals = await getMeals()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 md:px-6">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-fitnest-orange/10 rounded-full px-4 py-2 mb-4">
            <UtensilsCrossed className="h-4 w-4 text-fitnest-orange" />
            <span className="text-sm font-semibold text-fitnest-orange">Notre Menu</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
            Explorez Nos{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Recettes
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
            Découvrez notre sélection de repas nutritifs, préparés par nos chefs pour accompagner vos objectifs santé et fitness.
          </p>
        </div>

        {/* Client-side interactive component */}
        <MealsClient initialMeals={meals} />
      </div>
    </div>
  )
}
