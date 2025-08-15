"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { calculatePrice, type MealSelection, pricingConfig } from "@/lib/pricing-model"

export default function PricingDemo() {
  const [selectedDays, setSelectedDays] = useState(3)

  // Fixed customer selection: Muscle Gain, 2 main + breakfast + 1 snack
  const baseSelection: Omit<MealSelection, "selectedDays"> = {
    planId: "muscle-gain",
    mainMeals: 2,
    breakfast: true,
    snacks: 1,
  }

  const createSelection = (days: number): MealSelection => ({
    ...baseSelection,
    selectedDays: Array.from({ length: days }, (_, i) => new Date(`2024-01-0${i + 1}`)),
  })

  const dayOptions = [3, 4, 5, 6, 7]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Pricing Logic Demo</h1>
          <p className="text-gray-600">Muscle Gain Plan: 2 Main Meals + Breakfast + 1 Snack per day</p>
        </div>

        {/* Base Pricing Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Base Pricing Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Standard Prices</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Main Meal (base):</span>
                    <span>{pricingConfig.basePrices.mainMeal} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breakfast (base):</span>
                    <span>{pricingConfig.basePrices.breakfast} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Snack:</span>
                    <span>{pricingConfig.basePrices.snack} MAD</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Muscle Gain Prices (15% premium)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Main Meal:</span>
                    <span className="font-medium text-fitnest-orange">
                      {pricingConfig.basePrices.mainMeal * pricingConfig.planMultipliers["muscle-gain"]} MAD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breakfast:</span>
                    <span className="font-medium text-fitnest-orange">
                      {pricingConfig.basePrices.breakfast * pricingConfig.planMultipliers["muscle-gain"]} MAD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Snack:</span>
                    <span>{pricingConfig.basePrices.snack} MAD</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Number of Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {dayOptions.map((days) => (
                <Button
                  key={days}
                  variant={selectedDays === days ? "default" : "outline"}
                  onClick={() => setSelectedDays(days)}
                  className="relative"
                >
                  {days} Day{days > 1 ? "s" : ""}
                  {days >= 5 && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {days === 5 || days === 6 ? "5%" : "10%"} OFF
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Calculation */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Breakdown for {selectedDays} Days</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const selection = createSelection(selectedDays)
              const pricing = calculatePrice(selection)

              // Calculate daily breakdown
              const mainMealPrice = pricingConfig.basePrices.mainMeal * pricingConfig.planMultipliers["muscle-gain"]
              const breakfastPrice = pricingConfig.basePrices.breakfast * pricingConfig.planMultipliers["muscle-gain"]
              const snackPrice = pricingConfig.basePrices.snack
              const dailyTotal = mainMealPrice * 2 + breakfastPrice + snackPrice

              // Determine which discount applies
              const daysDiscount =
                pricingConfig.volumeDiscounts.days.find((tier) => selectedDays >= tier.min && selectedDays <= tier.max)
                  ?.discount || 0

              const volumeDiscount =
                pricingConfig.volumeDiscounts.totalItems.find(
                  (tier) => pricing.totalItems >= tier.min && pricing.totalItems <= tier.max,
                )?.discount || 0

              const appliedDiscount = Math.max(daysDiscount, volumeDiscount)

              return (
                <div className="space-y-6">
                  {/* Daily Breakdown */}
                  <div>
                    <h3 className="font-semibold mb-3">Daily Meal Cost</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>2 Main Meals:</span>
                        <span>
                          2 × {mainMealPrice} = {(mainMealPrice * 2).toFixed(2)} MAD
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>1 Breakfast:</span>
                        <span>
                          1 × {breakfastPrice} = {breakfastPrice.toFixed(2)} MAD
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>1 Snack:</span>
                        <span>
                          1 × {snackPrice} = {snackPrice} MAD
                        </span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Daily Total:</span>
                        <span>{dailyTotal.toFixed(2)} MAD</span>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Calculation */}
                  <div>
                    <h3 className="font-semibold mb-3">Weekly Calculation</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal ({selectedDays} days):</span>
                        <span>
                          {selectedDays} × {dailyTotal.toFixed(2)} = {pricing.weeklyTotals.subtotal} MAD
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Total items:</span>
                        <span>
                          {pricing.totalItems} items ({selectedDays} days × 4 items/day)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Discount Logic */}
                  <div>
                    <h3 className="font-semibold mb-3">Discount Analysis</h3>
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Days-based discount ({selectedDays} days):</span>
                        <span className={daysDiscount > 0 ? "text-green-600 font-medium" : "text-gray-500"}>
                          {daysDiscount * 100}%
                          {daysDiscount > 0 && ` (-${(pricing.weeklyTotals.subtotal * daysDiscount).toFixed(2)} MAD)`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Volume-based discount ({pricing.totalItems} items):</span>
                        <span className={volumeDiscount > 0 ? "text-green-600 font-medium" : "text-gray-500"}>
                          {volumeDiscount * 100}%
                          {volumeDiscount > 0 &&
                            ` (-${(pricing.weeklyTotals.subtotal * volumeDiscount).toFixed(2)} MAD)`}
                        </span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-2">
                        <span>Applied discount (best one):</span>
                        <span className="text-green-600">
                          {appliedDiscount * 100}% (-{pricing.discounts.totalDiscount.toFixed(2)} MAD)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Final Total */}
                  <div className="bg-fitnest-green/10 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Final Total:</span>
                      <span className="text-2xl font-bold text-fitnest-green">{pricing.finalTotal} MAD</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Price per day:</span>
                      <span>{pricing.pricePerDay} MAD</span>
                    </div>
                  </div>

                  {/* Savings Comparison */}
                  {selectedDays > 3 && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">💰 Savings vs 3 Days</h4>
                      {(() => {
                        const threeDaySelection = createSelection(3)
                        const threeDayPricing = calculatePrice(threeDaySelection)
                        const threeDayPerDay = threeDayPricing.pricePerDay
                        const currentPerDay = pricing.pricePerDay
                        const savingsPerDay = threeDayPerDay - currentPerDay
                        const totalSavings = savingsPerDay * selectedDays

                        return (
                          <div className="text-sm space-y-1">
                            <div>3 days: {threeDayPerDay} MAD per day</div>
                            <div>
                              {selectedDays} days: {currentPerDay} MAD per day
                            </div>
                            <div className="font-medium text-green-600">
                              You save {savingsPerDay.toFixed(2)} MAD per day = {totalSavings.toFixed(2)} MAD total!
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                  )}
                </div>
              )
            })()}
          </CardContent>
        </Card>

        {/* Discount Tiers Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Discount Tiers Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Days-Based Discounts</h3>
                <div className="space-y-2">
                  {pricingConfig.volumeDiscounts.days.map((tier, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {tier.min}-{tier.max} days:
                      </span>
                      <span className={tier.discount > 0 ? "text-green-600 font-medium" : "text-gray-500"}>
                        {tier.discount * 100}% off
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Volume-Based Discounts</h3>
                <div className="space-y-2">
                  {pricingConfig.volumeDiscounts.totalItems.map((tier, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {tier.min}-{tier.max === 999 ? "∞" : tier.max} items:
                      </span>
                      <span className={tier.discount > 0 ? "text-green-600 font-medium" : "text-gray-500"}>
                        {tier.discount * 100}% off
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Only the best discount is applied. The system automatically chooses between
                days-based and volume-based discounts to give you the maximum savings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
