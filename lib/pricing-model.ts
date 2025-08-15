// Fitnest.ma Pricing Model
// Based on: Meal combinations + Snacks + Days + Plan type + Volume discounts + Duration discounts

export interface PricingConfig {
  basePrices: {
    mainMeal: number
    breakfast: number
    snack: number
  }
  planMultipliers: {
    [planId: string]: number
  }
  volumeDiscounts: {
    days: { min: number; max: number; discount: number }[]
    totalItems: { min: number; max: number; discount: number }[]
    duration: { min: number; max: number; discount: number }[]
  }
  seasonalDiscounts?: {
    [period: string]: number
  }
}

export const pricingConfig: PricingConfig = {
  // Base prices per item (MAD)
  basePrices: {
    mainMeal: 40, // Lunch or Dinner
    breakfast: 30, // Breakfast (simpler prep)
    snack: 15, // Snack
  },

  // Plan-based multipliers (nutrition complexity)
  planMultipliers: {
    "weight-loss": 1.0, // Base pricing
    "stay-fit": 0.95, // 5% discount (easier to prepare)
    "muscle-gain": 1.15, // 15% premium (more protein/portions)
    keto: 1.1, // 10% premium (specialized ingredients)
  },

  // Volume discounts
  volumeDiscounts: {
    // Days per week discount
    days: [
      { min: 3, max: 4, discount: 0 }, // 3-4 days: no discount
      { min: 5, max: 6, discount: 0.05 }, // 5-6 days: 5% discount
      { min: 7, max: 7, discount: 0.1 }, // 7 days: 10% discount
    ],

    // Total items per week discount
    totalItems: [
      { min: 6, max: 13, discount: 0 }, // 6-13 items: no discount
      { min: 14, max: 20, discount: 0.05 }, // 14-20 items: 5% discount
      { min: 21, max: 35, discount: 0.1 }, // 21-35 items: 10% discount
      { min: 36, max: 999, discount: 0.15 }, // 36+ items: 15% discount
    ],

    // Subscription duration discounts
    duration: [
      { min: 1, max: 1, discount: 0 }, // 1 week: no discount
      { min: 2, max: 2, discount: 0.05 }, // 2 weeks: 5% discount
      { min: 4, max: 4, discount: 0.1 }, // 1 month (4 weeks): 10% discount
    ],
  },

  // Seasonal/promotional discounts (can be updated)
  seasonalDiscounts: {
    "new-customer": 0.2, // 20% off first order
    ramadan: 0.15, // 15% off during Ramadan
    summer: 0.1, // 10% off summer months
    "bulk-order": 0.25, // 25% off orders over 1000 MAD
  },
}

export interface MealSelection {
  planId: string
  mainMeals: number // 1 or 2 main meals per day
  breakfast: boolean // true/false
  snacks: number // 0, 1, or 2 snacks per day
  selectedDays: Date[] // Array of selected delivery days
  subscriptionWeeks: number // 1, 2, or 4 weeks
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

export function calculatePrice(selection: MealSelection, seasonalDiscountCode?: string): PriceBreakdown {
  const config = pricingConfig
  const planMultiplier = config.planMultipliers[selection.planId] || 1.0

  // Calculate base daily prices
  const dailyMainMealPrice = config.basePrices.mainMeal * planMultiplier * selection.mainMeals
  const dailyBreakfastPrice = selection.breakfast ? config.basePrices.breakfast * planMultiplier : 0
  const dailySnackPrice = config.basePrices.snack * selection.snacks
  const dailyTotal = dailyMainMealPrice + dailyBreakfastPrice + dailySnackPrice

  // Calculate weekly totals
  const daysCount = selection.selectedDays.length
  const mainMealsTotal = dailyMainMealPrice * daysCount
  const breakfastTotal = dailyBreakfastPrice * daysCount
  const snacksTotal = dailySnackPrice * daysCount
  const weeklySubtotal = dailyTotal * daysCount

  // Calculate subscription totals
  const totalWeeks = selection.subscriptionWeeks
  const subscriptionSubtotal = weeklySubtotal * totalWeeks

  // Calculate total items for volume discount (per week)
  const totalItemsPerWeek = (selection.mainMeals + (selection.breakfast ? 1 : 0) + selection.snacks) * daysCount

  // Apply discounts
  let totalDiscount = 0

  // 1. Days discount (per week)
  const daysDiscount =
    config.volumeDiscounts.days.find((tier) => daysCount >= tier.min && daysCount <= tier.max)?.discount || 0

  // 2. Volume discount (based on total items per week)
  const volumeDiscount =
    config.volumeDiscounts.totalItems.find((tier) => totalItemsPerWeek >= tier.min && totalItemsPerWeek <= tier.max)
      ?.discount || 0

  // 3. Duration discount (based on subscription length)
  const durationDiscount =
    config.volumeDiscounts.duration.find((tier) => totalWeeks >= tier.min && totalWeeks <= tier.max)?.discount || 0

  // 4. Seasonal discount
  const seasonalDiscount = seasonalDiscountCode ? config.seasonalDiscounts?.[seasonalDiscountCode] || 0 : 0

  // Apply discounts - Duration discount stacks with the best of (days/volume)
  const bestWeeklyDiscount = Math.max(daysDiscount, volumeDiscount)
  const weeklyDiscountAmount = weeklySubtotal * bestWeeklyDiscount
  const durationDiscountAmount = subscriptionSubtotal * durationDiscount
  const seasonalDiscountAmount = subscriptionSubtotal * seasonalDiscount

  // Total discount = weekly discount applied to all weeks + duration discount + seasonal
  totalDiscount = weeklyDiscountAmount * totalWeeks + durationDiscountAmount + seasonalDiscountAmount

  const finalTotal = subscriptionSubtotal - totalDiscount

  return {
    dailyBreakdown: {
      mainMeals: dailyMainMealPrice,
      breakfast: dailyBreakfastPrice,
      snacks: dailySnackPrice,
      dailyTotal: dailyTotal,
    },
    weeklyTotals: {
      mainMealsTotal,
      breakfastTotal,
      snacksTotal,
      subtotal: weeklySubtotal,
    },
    subscriptionTotals: {
      weeklySubtotal,
      totalWeeks,
      subscriptionSubtotal,
    },
    discounts: {
      daysDiscount: weeklyDiscountAmount,
      volumeDiscount: weeklyDiscountAmount, // Same as days discount (best one wins)
      durationDiscount: durationDiscountAmount,
      seasonalDiscount: seasonalDiscountAmount,
      totalDiscount,
    },
    finalTotal: Math.round(finalTotal * 100) / 100,
    pricePerDay: Math.round((finalTotal / (daysCount * totalWeeks)) * 100) / 100,
    pricePerWeek: Math.round((finalTotal / totalWeeks) * 100) / 100,
    totalItems: totalItemsPerWeek * totalWeeks,
    totalWeeks,
  }
}

// Validation function
export function validateMealSelection(selection: MealSelection): string[] {
  const errors: string[] = []

  // Must select minimum 2 meals
  const totalMealsPerDay = selection.mainMeals + (selection.breakfast ? 1 : 0)
  if (totalMealsPerDay < 2) {
    errors.push("Must select at least 2 meals per day")
  }

  // Valid main meal combinations
  if (selection.mainMeals < 1 || selection.mainMeals > 2) {
    errors.push("Must select 1 or 2 main meals")
  }

  // Valid snack range
  if (selection.snacks < 0 || selection.snacks > 2) {
    errors.push("Can select 0, 1, or 2 snacks")
  }

  // Minimum days
  if (selection.selectedDays.length < 3) {
    errors.push("Must select at least 3 delivery days")
  }

  // Maximum days
  if (selection.selectedDays.length > 7) {
    errors.push("Cannot select more than 7 days per week")
  }

  // Valid subscription duration
  const validDurations = [1, 2, 4]
  if (!validDurations.includes(selection.subscriptionWeeks)) {
    errors.push("Subscription duration must be 1 week, 2 weeks, or 1 month (4 weeks)")
  }

  return errors
}

// Helper function to get all valid meal combinations
export function getValidMealCombinations(): Array<{
  id: string
  label: string
  mainMeals: number
  breakfast: boolean
  description: string
}> {
  return [
    {
      id: "1main-1breakfast",
      label: "1 Main Meal + Breakfast",
      mainMeals: 1,
      breakfast: true,
      description: "Choose lunch OR dinner + breakfast",
    },
    {
      id: "2main",
      label: "2 Main Meals",
      mainMeals: 2,
      breakfast: false,
      description: "Lunch + dinner",
    },
    {
      id: "2main-1breakfast",
      label: "All Meals",
      mainMeals: 2,
      breakfast: true,
      description: "Breakfast + lunch + dinner",
    },
  ]
}

// Helper function to get subscription duration options
export function getSubscriptionDurationOptions(): Array<{
  weeks: number
  label: string
  description: string
  discount: number
}> {
  return [
    {
      weeks: 1,
      label: "1 Week",
      description: "Try it out",
      discount: 0,
    },
    {
      weeks: 2,
      label: "2 Weeks",
      description: "Build the habit",
      discount: 0.05,
    },
    {
      weeks: 4,
      label: "1 Month",
      description: "Most popular",
      discount: 0.1,
    },
  ]
}
