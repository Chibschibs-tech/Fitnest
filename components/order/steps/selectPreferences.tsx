"use client"

import { useState, useEffect } from "react"
import { Check, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { MealPlan, OrderPreferences } from "../types"
import { MEAL_TYPES, SNACK_OPTIONS, DURATION_OPTIONS } from "../constants"
import { getAvailableDateRange } from "../utils/dates"
import { DeliveryCalendar } from "../deliveryCalendar"

interface SelectPreferencesProps {
  selectedPlan: MealPlan
  onNext: (preferences: OrderPreferences) => void
  onBack: () => void
}

export function SelectPreferences({ selectedPlan, onNext, onBack }: SelectPreferencesProps) {
  const [selectedMeals, setSelectedMeals] = useState<string[]>(['lunch', 'dinner'])
  const [snacksPerDay, setSnacksPerDay] = useState<number>(0)
  const [duration, setDuration] = useState<1 | 2 | 4>(1)
  const [deliveryDays, setDeliveryDays] = useState<Date[]>([])
  const [errors, setErrors] = useState<string[]>([])

  // Reset delivery days when duration changes
  useEffect(() => {
    setDeliveryDays([])
  }, [duration])

  const toggleMeal = (mealId: string) => {
    setSelectedMeals(prev => {
      if (prev.includes(mealId)) {
        // Don't allow deselecting if it would leave less than 2
        if (prev.length <= 2) return prev
        return prev.filter(id => id !== mealId)
      }
      return [...prev, mealId]
    })
  }

  const validateAndContinue = () => {
    const newErrors: string[] = []

    if (selectedMeals.length < 2) {
      newErrors.push('Veuillez sélectionner au moins 2 repas par jour')
    }

    const minDays = 3
    if (deliveryDays.length < minDays) {
      newErrors.push(`Veuillez sélectionner au moins ${minDays} jours de livraison`)
    }

    setErrors(newErrors)

    if (newErrors.length === 0) {
      onNext({
        selectedMeals,
        snacksPerDay,
        duration,
        deliveryDays,
      })
    }
  }

  const { start: availableStart, end: availableEnd } = getAvailableDateRange(duration)
  const canContinue = selectedMeals.length >= 2 && deliveryDays.length >= 3

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personnalisez votre Plan</CardTitle>
        <CardDescription>
          Configurez vos préférences de repas et votre calendrier de livraison pour {selectedPlan.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Meal Selection */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">
              Sélectionnez vos Repas <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Choisissez au moins 2 repas par jour
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MEAL_TYPES.map((meal) => {
              const isSelected = selectedMeals.includes(meal.id)
              const price = selectedPlan[`${meal.id}_price_per_day` as keyof MealPlan] as number

              return (
                <button
                  key={meal.id}
                  onClick={() => toggleMeal(meal.id)}
                  className={cn(
                    "group relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300",
                    "hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-fitnest-green",
                    isSelected 
                      ? "border-fitnest-green bg-gradient-to-br from-fitnest-green/10 to-fitnest-orange/5 shadow-md" 
                      : "border-gray-200 hover:border-fitnest-green/50 bg-white"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 h-7 w-7 bg-gradient-to-br from-fitnest-green to-fitnest-green/80 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-300">
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    </div>
                  )}
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-fitnest-green transition-colors">{meal.label}</h3>
                  <p className="text-sm text-gray-600 mb-3 text-center">{meal.description}</p>
                  <div className="mt-auto px-4 py-2 bg-fitnest-green/10 rounded-full">
                    <p className="text-sm font-bold text-fitnest-green">
                      {price.toFixed(2)} MAD/jour
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Snacks Selection */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Snacks par Jour</Label>
            <p className="text-sm text-gray-600 mt-1">
              Ajoutez des snacks sains à votre plan (optionnel)
            </p>
          </div>

          <RadioGroup
            value={String(snacksPerDay)}
            onValueChange={(value) => setSnacksPerDay(Number(value))}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {SNACK_OPTIONS.map((option) => {
              const price = option.value * (selectedPlan.snack_price_per_day || 0)

              return (
                <div key={option.value} className="relative">
                  <RadioGroupItem
                    value={String(option.value)}
                    id={`snack-${option.value}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`snack-${option.value}`}
                    className={cn(
                      "flex flex-col items-center p-6 rounded-lg border-2 transition-all cursor-pointer",
                      "hover:shadow-md peer-focus:ring-2 peer-focus:ring-fitnest-green",
                      "peer-data-[state=checked]:border-fitnest-green peer-data-[state=checked]:bg-fitnest-green/5"
                    )}
                  >
                    <h3 className="font-semibold text-lg mb-1">{option.label}</h3>
                    <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                    {option.value > 0 && (
                      <p className="text-sm font-medium text-fitnest-green">
                        +{price.toFixed(2)} MAD/jour
                      </p>
                    )}
                    {option.value === 0 && (
                      <p className="text-sm text-gray-500">Gratuit</p>
                    )}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>

        {/* Duration Selection */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">
              Durée d'Abonnement <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Pour combien de temps souhaitez-vous vous abonner ?
            </p>
          </div>

          <RadioGroup
            value={String(duration)}
            onValueChange={(value) => setDuration(Number(value) as 1 | 2 | 4)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {DURATION_OPTIONS.map((option) => (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={String(option.value)}
                  id={`duration-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`duration-${option.value}`}
                  className={cn(
                    "flex flex-col items-center p-6 rounded-lg border-2 transition-all cursor-pointer",
                    "hover:shadow-md peer-focus:ring-2 peer-focus:ring-fitnest-green",
                    "peer-data-[state=checked]:border-fitnest-green peer-data-[state=checked]:bg-fitnest-green/5"
                  )}
                >
                  <h3 className="font-semibold text-lg mb-1">{option.label}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Delivery Days Calendar */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">
              Sélectionnez les Jours de Livraison <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Choisissez quels jours vous souhaitez recevoir vos repas (la livraison commence 48 heures à partir de maintenant)
            </p>
          </div>

          <DeliveryCalendar
            availableStart={availableStart}
            availableEnd={availableEnd}
            selectedDays={deliveryDays}
            onDaysChange={setDeliveryDays}
            minDays={3}
          />
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t-2">
          <Button
            variant="outline"
            onClick={onBack}
            size="lg"
            className="font-bold px-8 py-6 rounded-xl border-2 hover:bg-gray-50"
          >
            <span>Retour</span>
          </Button>
          <Button
            onClick={validateAndContinue}
            disabled={!canContinue}
            className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold px-10 py-7 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group disabled:opacity-50"
            size="lg"
          >
            <span>Continuer vers le Menu</span>
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
