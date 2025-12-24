"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Calendar, UtensilsCrossed, Clock } from "lucide-react"
import { MealPlan, OrderPreferences, Meal, MenuBuildData } from "./types"

interface PendingOrderSummaryProps {
  step: 2 | 3 | 4
  selectedPlan: MealPlan
  preferences?: OrderPreferences
  menuData?: MenuBuildData
  meals?: Meal[]
}

export function PendingOrderSummary({
  step,
  selectedPlan,
  preferences,
  menuData,
  meals,
}: PendingOrderSummaryProps) {
  
  // Helper to get meal by ID
  const getMealById = (id: string | undefined) => {
    if (!id || !meals) return null
    return meals.find(m => String(m.id) === String(id))
  }

  // Calculate total price
  const calculateTotal = () => {
    if (!preferences) return 0
    let total = 0
    preferences.selectedMeals.forEach(mealType => {
      const priceKey = `${mealType}_price_per_day` as keyof MealPlan
      total += (selectedPlan[priceKey] as number) * preferences.deliveryDays.length
    })
    total += selectedPlan.snack_price_per_day * preferences.snacksPerDay * preferences.deliveryDays.length
    return total
  }

  return (
    <Card className="sticky top-4 shadow-lg border-2 border-gray-100">
      <CardHeader className="bg-gradient-to-r from-fitnest-green/5 to-fitnest-orange/5 border-b">
        <CardTitle className="text-lg flex items-center gap-2">
          <Check className="h-5 w-5 text-fitnest-green" />
          Résumé de Commande en Attente
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        
        {/* Step 2, 3, 4: Show Selected Plan */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-fitnest-green" />
            Plan Sélectionné
          </h4>
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <p className="font-bold text-fitnest-green">{selectedPlan.name}</p>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
              {selectedPlan.description}
            </p>
          </div>
        </div>

        {/* Step 3, 4: Show Preferences */}
        {(step === 3 || step === 4) && preferences && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">Vos Préférences</h4>
              
              {/* Selected Meals */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Repas par Jour :</p>
                <div className="flex flex-wrap gap-1">
                  {preferences.selectedMeals.map(meal => {
                    const price = selectedPlan[`${meal}_price_per_day` as keyof MealPlan] as number
                    return (
                      <Badge 
                        key={meal} 
                        variant="secondary" 
                        className="bg-fitnest-green/10 text-fitnest-green text-xs capitalize"
                      >
                        {meal} ({price} MAD/jour)
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Snacks */}
              {preferences.snacksPerDay > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 font-medium">Snacks :</p>
                  <Badge variant="outline" className="text-xs">
                    {preferences.snacksPerDay} snack{preferences.snacksPerDay > 1 ? 's' : ''} par jour
                    {' '}({selectedPlan.snack_price_per_day * preferences.snacksPerDay} MAD/jour)
                  </Badge>
                </div>
              )}

              {/* Duration */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Durée :
                </p>
                <Badge variant="outline" className="text-xs">
                  {preferences.duration} semaine{preferences.duration > 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Delivery Days */}
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Jours de Livraison :
                </p>
                <div className="bg-gray-50 rounded p-2 space-y-1">
                  <p className="text-xs font-semibold text-fitnest-green">
                    {preferences.deliveryDays.length} jour{preferences.deliveryDays.length > 1 ? 's' : ''} sélectionné{preferences.deliveryDays.length > 1 ? 's' : ''}
                  </p>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {preferences.deliveryDays
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map((day, idx) => (
                        <span key={idx} className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200">
                          {format(day, 'MMM d')}
                        </span>
                      ))
                    }
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 4: Show Selected Meals */}
        {step === 4 && menuData && meals && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Sélections de Menu</h4>
              <div className="bg-gray-50 rounded p-2 max-h-48 overflow-y-auto space-y-2">
                {Object.entries(menuData.selections).map(([dateStr, dayMeals]) => {
                  const date = new Date(dateStr)
                  const mealCount = Object.keys(dayMeals).length
                  
                  return (
                    <div key={dateStr} className="bg-white rounded border border-gray-200 p-2">
                      <p className="text-[10px] font-semibold text-gray-700 mb-1">
                        {format(date, 'EEE, MMM d')}
                      </p>
                      <div className="space-y-1">
                        {Object.entries(dayMeals).map(([mealType, mealId]) => {
                          const meal = getMealById(mealId as string)
                          if (!meal) return null
                          return (
                            <div key={mealType} className="flex items-start gap-1">
                              <Badge variant="outline" className="text-[9px] px-1 py-0 capitalize shrink-0">
                                {mealType}
                              </Badge>
                              <p className="text-[10px] text-gray-600 line-clamp-1 flex-1">
                                {meal.name}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {/* Price Summary (Steps 3 & 4) */}
        {(step === 3 || step === 4) && preferences && (
          <>
            <Separator />
            <div className="bg-gradient-to-br from-fitnest-green/10 to-fitnest-orange/5 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">Total Estimé :</span>
                <span className="text-lg font-bold text-fitnest-green">
                  {calculateTotal().toFixed(2)} MAD
                </span>
              </div>
              <p className="text-[10px] text-gray-500">
                Pour {preferences.deliveryDays.length} jour{preferences.deliveryDays.length > 1 ? 's' : ''}
              </p>
            </div>
          </>
        )}

      </CardContent>
    </Card>
  )
}

