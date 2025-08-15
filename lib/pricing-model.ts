// Fitnest.ma Pricing Model - Complete Implementation

export interface MealSelection {
  planId: string // "weight-loss", "stay-fit", "muscle-gain", "keto"
  mainMeals: number // 1 or 2
  breakfast: boolean // true/false
  snacks: number // 0, 1, or 2
  selectedDays: Date[] // Array of delivery dates
  subscriptionWeeks: number // 1, 2, or 4
}

export interface PriceBreakdown {
  dailyBreakdown: {
    mainMeals: number
    breakfast: number
    snacks: number
    dailyTotal: number
  }
  weeklyTotals: {
    mainMealsTotal: number
    breakfastTotal: number
    snacksTotal: number
    subtotal: number
  }
  subscriptionTotals: {
    weeklySubtotal: number
    totalWeeks: number
    subscriptionSubtotal: number
  }
  discounts: {
    daysDiscount: number
    volumeDiscount: number
    appliedWeeklyDiscount: number
    durationDiscount: number
    seasonalDiscount: number
    totalDiscount: number
  }
  finalTotal: number
  pricePerDay: number
  pricePerWeek: number
  totalItems: number
  totalWeeks: number
}

// Pricing Configuration
export const pricingConfig = {
  basePrices: {
    mainMeal: 40, // MAD
    breakfast: 30, // MAD
    snack: 15, // MAD
  },

  planMultipliers: {
    "stay-fit": 0.95, // 5% discount
    "weight-loss": 1.0, // Base price
    keto: 1.1, // 10% premium
    "muscle-gain": 1.15, // 15% premium
  },

  daysDiscounts: {
    3: 0, // 3-4 days: 0%
    4: 0,
    5: 0.05, // 5-6 days: 5%
    6: 0.05,
    7: 0.1, // 7 days: 10%
  },

  volumeDiscounts: [
    { min: 6, max: 13, discount: 0 }, // 0%
    { min: 14, max: 20, discount: 0.05 }, // 5%
    { min: 21, max: 35, discount: 0.1 }, // 10%
    { min: 36, max: 999, discount: 0.15 }, // 15%
  ],

  durationDiscounts: {
    1: 0, // 1 week: 0%
    2: 0.05, // 2 weeks: 5%
    4: 0.1, // 1 month: 10%
  },

  seasonalCodes: {
    "new-customer": 0.2, // 20%
    ramadan: 0.15, // 15%
    summer: 0.1, // 10%
    "bulk-order": 0.25, // 25%
  },
}

// Validation Functions
export function validateMealSelection(selection: MealSelection): string[] {
  const errors: string[] = []

  // Validate plan
  if (!Object.keys(pricingConfig.planMultipliers).includes(selection.planId)) {
    errors.push("Invalid meal plan selected")
  }

  // Validate meal combination (minimum 2 meals)
  const totalMeals = selection.mainMeals + (selection.breakfast ? 1 : 0)
  if (totalMeals < 2) {
    errors.push("Minimum 2 meals required per day")
  }

  // Validate main meals
  if (selection.mainMeals < 1 || selection.mainMeals > 2) {
    errors.push("Main meals must be 1 or 2")
  }

  // Validate snacks
  if (selection.snacks < 0 || selection.snacks > 2) {
    errors.push("Snacks must be 0, 1, or 2")
  }

  // Validate days
  if (selection.selectedDays.length < 3 || selection.selectedDays.length > 7) {
    errors.push("Must select between 3 and 7 days per week")
  }

  // Validate subscription duration
  if (![1, 2, 4].includes(selection.subscriptionWeeks)) {
    errors.push("Subscription duration must be 1, 2, or 4 weeks")
  }

  return errors
}

// Helper Functions
function getVolumeDiscount(totalItems: number): number {
  const tier = pricingConfig.volumeDiscounts.find((tier) => totalItems >= tier.min && totalItems <= tier.max)
  return tier?.discount || 0
}

function getDaysDiscount(daysCount: number): number {
  return pricingConfig.daysDiscounts[daysCount] || 0
}

function getDurationDiscount(weeks: number): number {
  return pricingConfig.durationDiscounts[weeks] || 0
}

// Main Pricing Calculation Function
export function calculatePrice(selection: MealSelection, seasonalCode?: string): PriceBreakdown {
  // Validate selection
  const validationErrors = validateMealSelection(selection)
  if (validationErrors.length > 0) {
    throw new Error(`Invalid selection: ${validationErrors.join(", ")}`)
  }

  const config = pricingConfig
  const planMultiplier = config.planMultipliers[selection.planId] || 1.0

  // Step 1: Calculate daily costs
  const mainMealPrice = config.basePrices.mainMeal * planMultiplier
  const breakfastPrice = config.basePrices.breakfast * planMultiplier
  const snackPrice = config.basePrices.snack

  const dailyMainMealsCost = selection.mainMeals * mainMealPrice
  const dailyBreakfastCost = selection.breakfast ? breakfastPrice : 0
  const dailySnacksCost = selection.snacks * snackPrice
  const dailyTotal = dailyMainMealsCost + dailyBreakfastCost + dailySnacksCost

  // Step 2: Calculate weekly costs
  const daysPerWeek = selection.selectedDays.length
  const weeklyMainMealsTotal = dailyMainMealsCost * daysPerWeek
  const weeklyBreakfastTotal = dailyBreakfastCost * daysPerWeek
  const weeklySnacksTotal = dailySnacksCost * daysPerWeek
  const weeklySubtotal = dailyTotal * daysPerWeek

  // Step 3: Calculate weekly discounts
  const totalItemsPerWeek = (selection.mainMeals + (selection.breakfast ? 1 : 0) + selection.snacks) * daysPerWeek
  const daysDiscount = weeklySubtotal * getDaysDiscount(daysPerWeek)
  const volumeDiscount = weeklySubtotal * getVolumeDiscount(totalItemsPerWeek)
  const appliedWeeklyDiscount = Math.max(daysDiscount, volumeDiscount) // Best discount wins

  // Step 4: Calculate subscription costs
  const subscriptionSubtotal = weeklySubtotal * selection.subscriptionWeeks
  const weeklyDiscountTotal = appliedWeeklyDiscount * selection.subscriptionWeeks

  // Step 5: Calculate duration discount
  const durationDiscount = subscriptionSubtotal * getDurationDiscount(selection.subscriptionWeeks)

  // Step 6: Calculate seasonal discount
  const seasonalDiscountRate = seasonalCode ? config.seasonalCodes[seasonalCode] || 0 : 0
  const seasonalDiscount = subscriptionSubtotal * seasonalDiscountRate

  // Step 7: Calculate final totals
  const totalDiscount = weeklyDiscountTotal + durationDiscount + seasonalDiscount
  const finalTotal = subscriptionSubtotal - totalDiscount

  // Calculate metrics
  const totalItems = totalItemsPerWeek * selection.subscriptionWeeks
  const pricePerWeek = finalTotal / selection.subscriptionWeeks
  const pricePerDay = finalTotal / (daysPerWeek * selection.subscriptionWeeks)

  return {
    dailyBreakdown: {
      mainMeals: Math.round(dailyMainMealsCost * 100) / 100,
      breakfast: Math.round(dailyBreakfastCost * 100) / 100,
      snacks: Math.round(dailySnacksCost * 100) / 100,
      dailyTotal: Math.round(dailyTotal * 100) / 100,
    },
    weeklyTotals: {
      mainMealsTotal: Math.round(weeklyMainMealsTotal * 100) / 100,
      breakfastTotal: Math.round(weeklyBreakfastTotal * 100) / 100,
      snacksTotal: Math.round(weeklySnacksTotal * 100) / 100,
      subtotal: Math.round(weeklySubtotal * 100) / 100,
    },
    subscriptionTotals: {
      weeklySubtotal: Math.round(weeklySubtotal * 100) / 100,
      totalWeeks: selection.subscriptionWeeks,
      subscriptionSubtotal: Math.round(subscriptionSubtotal * 100) / 100,
    },
    discounts: {
      daysDiscount: Math.round(daysDiscount * 100) / 100,
      volumeDiscount: Math.round(volumeDiscount * 100) / 100,
      appliedWeeklyDiscount: Math.round(appliedWeeklyDiscount * 100) / 100,
      durationDiscount: Math.round(durationDiscount * 100) / 100,
      seasonalDiscount: Math.round(seasonalDiscount * 100) / 100,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
    },
    finalTotal: Math.round(finalTotal * 100) / 100,
    pricePerDay: Math.round(pricePerDay * 100) / 100,
    pricePerWeek: Math.round(pricePerWeek * 100) / 100,
    totalItems,
    totalWeeks: selection.subscriptionWeeks,
  }
}

// Utility function for quick price estimates
export function getQuickEstimate(
  planId: string,
  mainMeals: number,
  breakfast: boolean,
  snacks: number,
  days: number,
): number {
  const selection: MealSelection = {
    planId,
    mainMeals,
    breakfast,
    snacks,
    selectedDays: Array(days).fill(new Date()),
    subscriptionWeeks: 1,
  }

  try {
    const breakdown = calculatePrice(selection)
    return breakdown.finalTotal
  } catch {
    return 0
  }
}
