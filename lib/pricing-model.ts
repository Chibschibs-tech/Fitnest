// Fitnest.ma Pricing System Implementation
// Based on the comprehensive pricing documentation

export interface PricingConfig {
  basePrices: {
    mainMeal: number
    breakfast: number
    snack: number
  }
  planMultipliers: Record<string, number>
  daysDiscounts: Record<string, number>
  volumeDiscounts: Record<string, number>
  durationDiscounts: Record<string, number>
}

export interface MealSelection {
  planId: string
  mainMeals: number
  breakfasts: number
  snacks: number
  daysPerWeek: number
  subscriptionDuration: string
  promoCode?: string
}

export interface PricingResult {
  dailyCost: number
  weeklyCost: number
  subscriptionCost: number
  appliedDiscounts: {
    weekly: { type: string; rate: number; amount: number }
    duration: { rate: number; amount: number }
  }
  totalSavings: number
  breakdown: {
    adjustedPrices: {
      mainMeal: number
      breakfast: number
      snack: number
    }
    weeklySubtotal: number
    totalItems: number
  }
}

// Default pricing configuration
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  basePrices: {
    mainMeal: 40, // MAD per main meal
    breakfast: 30, // MAD per breakfast
    snack: 15, // MAD per snack
  },
  planMultipliers: {
    "stay-fit": 0.95, // 5% discount
    "weight-loss": 1.0, // Base price
    "muscle-gain": 1.15, // 15% premium
    keto: 1.1, // 10% premium
  },
  daysDiscounts: {
    "3-4": 0, // 0% for 3-4 days
    "5-6": 0.05, // 5% for 5-6 days
    "7": 0.1, // 10% for 7 days
  },
  volumeDiscounts: {
    "6-13": 0, // 0% for 6-13 items
    "14-20": 0.05, // 5% for 14-20 items
    "21-35": 0.1, // 10% for 21-35 items
    "36+": 0.15, // 15% for 36+ items
  },
  durationDiscounts: {
    "1-week": 0, // 0% for 1 week
    "2-weeks": 0.05, // 5% for 2 weeks
    "1-month": 0.1, // 10% for 1 month
  },
}

// Validation functions
export function validateMealSelection(selection: MealSelection): string[] {
  const errors: string[] = []

  // Check minimum meal requirement (at least 2 meals)
  const totalMeals = selection.mainMeals + selection.breakfasts
  if (totalMeals < 2) {
    errors.push("Must select at least 2 meals per day")
  }

  // Check valid meal combinations
  const validCombinations = [
    { mainMeals: 1, breakfasts: 1 }, // 1 main + 1 breakfast
    { mainMeals: 2, breakfasts: 0 }, // 2 main meals
    { mainMeals: 2, breakfasts: 1 }, // 2 main + 1 breakfast
  ]

  const isValidCombination = validCombinations.some(
    (combo) => combo.mainMeals === selection.mainMeals && combo.breakfasts === selection.breakfasts,
  )

  if (!isValidCombination) {
    errors.push("Invalid meal combination. Choose: 1 main + 1 breakfast, 2 main meals, or 2 main + 1 breakfast")
  }

  // Check minimum days
  if (selection.daysPerWeek < 3) {
    errors.push("Must select at least 3 days per week")
  }

  if (selection.daysPerWeek > 7) {
    errors.push("Cannot select more than 7 days per week")
  }

  // Check valid plan
  if (!DEFAULT_PRICING_CONFIG.planMultipliers[selection.planId]) {
    errors.push("Invalid meal plan selected")
  }

  // Check valid duration
  const validDurations = ["1-week", "2-weeks", "1-month"]
  if (!validDurations.includes(selection.subscriptionDuration)) {
    errors.push("Invalid subscription duration")
  }

  return errors
}

// Calculate adjusted meal prices based on plan
export function calculateAdjustedPrices(planId: string, config: PricingConfig = DEFAULT_PRICING_CONFIG) {
  const multiplier = config.planMultipliers[planId] || 1.0

  return {
    mainMeal: config.basePrices.mainMeal * multiplier,
    breakfast: config.basePrices.breakfast * multiplier,
    snack: config.basePrices.snack, // Snacks don't get plan multipliers
  }
}

// Calculate daily cost
export function calculateDailyCost(selection: MealSelection, config: PricingConfig = DEFAULT_PRICING_CONFIG): number {
  const adjustedPrices = calculateAdjustedPrices(selection.planId, config)

  return (
    selection.mainMeals * adjustedPrices.mainMeal +
    selection.breakfasts * adjustedPrices.breakfast +
    selection.snacks * adjustedPrices.snack
  )
}

// Get days-based discount
export function getDaysDiscount(daysPerWeek: number, config: PricingConfig = DEFAULT_PRICING_CONFIG): number {
  if (daysPerWeek >= 7) return config.daysDiscounts["7"]
  if (daysPerWeek >= 5) return config.daysDiscounts["5-6"]
  return config.daysDiscounts["3-4"]
}

// Get volume-based discount
export function getVolumeDiscount(totalItems: number, config: PricingConfig = DEFAULT_PRICING_CONFIG): number {
  if (totalItems >= 36) return config.volumeDiscounts["36+"]
  if (totalItems >= 21) return config.volumeDiscounts["21-35"]
  if (totalItems >= 14) return config.volumeDiscounts["14-20"]
  return config.volumeDiscounts["6-13"]
}

// Get duration-based discount
export function getDurationDiscount(duration: string, config: PricingConfig = DEFAULT_PRICING_CONFIG): number {
  return config.durationDiscounts[duration] || 0
}

// Get promotional discount (placeholder for future implementation)
export function getPromotionalDiscount(promoCode?: string): number {
  if (!promoCode) return 0

  // Placeholder promotional discounts
  const promoCodes: Record<string, number> = {
    RAMADAN2024: 0.15,
    NEWCUSTOMER: 0.2,
    SUMMER2024: 0.1,
  }

  return promoCodes[promoCode.toUpperCase()] || 0
}

// Calculate best weekly discount (excluding duration)
export function getBestWeeklyDiscount(
  daysPerWeek: number,
  totalItems: number,
  promoCode?: string,
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
): { type: string; rate: number } {
  const daysDiscount = getDaysDiscount(daysPerWeek, config)
  const volumeDiscount = getVolumeDiscount(totalItems, config)
  const promoDiscount = getPromotionalDiscount(promoCode)

  // Find the best discount
  const discounts = [
    { type: "days", rate: daysDiscount },
    { type: "volume", rate: volumeDiscount },
    { type: "promotional", rate: promoDiscount },
  ]

  return discounts.reduce((best, current) => (current.rate > best.rate ? current : best))
}

// Main pricing calculation function
export function calculateFinalPrice(
  selection: MealSelection,
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
): PricingResult {
  // Validate input
  const errors = validateMealSelection(selection)
  if (errors.length > 0) {
    throw new Error(`Invalid selection: ${errors.join(", ")}`)
  }

  // Calculate base costs
  const adjustedPrices = calculateAdjustedPrices(selection.planId, config)
  const dailyCost = calculateDailyCost(selection, config)
  const weeklySubtotal = dailyCost * selection.daysPerWeek

  // Calculate total items per week
  const totalItems = (selection.mainMeals + selection.breakfasts + selection.snacks) * selection.daysPerWeek

  // Get best weekly discount
  const bestWeeklyDiscount = getBestWeeklyDiscount(selection.daysPerWeek, totalItems, selection.promoCode, config)

  // Apply weekly discount
  const weeklyDiscountAmount = weeklySubtotal * bestWeeklyDiscount.rate
  const weeklyCost = weeklySubtotal - weeklyDiscountAmount

  // Calculate subscription cost
  const numberOfWeeks =
    selection.subscriptionDuration === "1-week" ? 1 : selection.subscriptionDuration === "2-weeks" ? 2 : 4
  const subscriptionSubtotal = weeklyCost * numberOfWeeks

  // Apply duration discount
  const durationDiscountRate = getDurationDiscount(selection.subscriptionDuration, config)
  const durationDiscountAmount = subscriptionSubtotal * durationDiscountRate
  const subscriptionCost = subscriptionSubtotal - durationDiscountAmount

  // Calculate total savings
  const originalCost = weeklySubtotal * numberOfWeeks
  const totalSavings = originalCost - subscriptionCost

  return {
    dailyCost: Math.round(dailyCost * 100) / 100,
    weeklyCost: Math.round(weeklyCost * 100) / 100,
    subscriptionCost: Math.round(subscriptionCost * 100) / 100,
    appliedDiscounts: {
      weekly: {
        type: bestWeeklyDiscount.type,
        rate: bestWeeklyDiscount.rate,
        amount: Math.round(weeklyDiscountAmount * numberOfWeeks * 100) / 100,
      },
      duration: {
        rate: durationDiscountRate,
        amount: Math.round(durationDiscountAmount * 100) / 100,
      },
    },
    totalSavings: Math.round(totalSavings * 100) / 100,
    breakdown: {
      adjustedPrices,
      weeklySubtotal: Math.round(weeklySubtotal * 100) / 100,
      totalItems,
    },
  }
}

// Helper function to format price for display
export function formatPrice(amount: number, currency = "MAD"): string {
  return `${amount.toFixed(2)} ${currency}`
}

// Helper function to get plan display name
export function getPlanDisplayName(planId: string): string {
  const names: Record<string, string> = {
    "stay-fit": "Stay Fit",
    "weight-loss": "Weight Loss",
    "muscle-gain": "Muscle Gain",
    keto: "Keto",
  }
  return names[planId] || planId
}

// Helper function to get duration display name
export function getDurationDisplayName(duration: string): string {
  const names: Record<string, string> = {
    "1-week": "1 Week",
    "2-weeks": "2 Weeks",
    "1-month": "1 Month",
  }
  return names[duration] || duration
}
