"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"

interface Meal {
  id: number
  name: string
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  imageUrl: string
  tags: string[]
  mealType: string
  dietaryInfo: string[]
}

interface MealDetailProps {
  meal: Meal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToMeals?: () => void
}

export function MealDetail({ meal, open, onOpenChange, onAddToMeals }: MealDetailProps) {
  if (!meal) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{meal.name}</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-4">
            <img src={meal.imageUrl || "/placeholder.svg"} alt={meal.name} className="h-full w-full object-cover" />
          </div>

          <p className="text-gray-700 mb-4">{meal.description}</p>

          <div className="grid grid-cols-4 gap-2 mb-6">
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-sm text-gray-500">Calories</div>
              <div className="font-medium">{meal.calories}</div>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-sm text-gray-500">Protein</div>
              <div className="font-medium">{meal.protein}g</div>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-sm text-gray-500">Carbs</div>
              <div className="font-medium">{meal.carbs}g</div>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <div className="text-sm text-gray-500">Fat</div>
              <div className="font-medium">{meal.fat}g</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Meal Type</h3>
              <Badge className="capitalize">{meal.mealType}</Badge>
            </div>

            <div>
              <h3 className="font-medium mb-2">Dietary Information</h3>
              <div className="flex flex-wrap gap-2">
                {meal.dietaryInfo.map((info) => (
                  <Badge key={info} variant="outline" className="capitalize">
                    {info.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {meal.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {tag.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={onAddToMeals}>
            Add to My Meals
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
