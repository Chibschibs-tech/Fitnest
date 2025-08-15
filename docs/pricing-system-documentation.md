# Fitnest.ma Pricing System Documentation

## Table of Contents
1. [Business Model Overview](#business-model-overview)
2. [Meal Structure & Constraints](#meal-structure--constraints)
3. [Base Pricing Structure](#base-pricing-structure)
4. [Discount System](#discount-system)
5. [Calculation Logic](#calculation-logic)
6. [Practical Examples](#practical-examples)
7. [Implementation Details](#implementation-details)
8. [Edge Cases & Validation](#edge-cases--validation)
9. [Business Impact & Metrics](#business-impact--metrics)
10. [Future Considerations](#future-considerations)

---

## Business Model Overview

Fitnest.ma is a meal delivery service that provides customized meal plans for fitness goals. Customers select:
- A meal plan type (Weight Loss, Stay Fit, Muscle Gain, Keto)
- Meal combinations per day
- Number of delivery days per week (minimum 3)
- Subscription duration (1 week, 2 weeks, 1 month)

### Revenue Model
- **Primary**: Subscription-based meal delivery
- **Secondary**: Express shop products (protein bars, supplements)
- **Pricing Strategy**: Volume discounts to encourage larger orders and longer commitments

---

## Meal Structure & Constraints

### Meal Types
1. **Main Meals**: What customers see as "lunch" and "dinner" (same preparation cost)
2. **Breakfast**: Different preparation/cost from main meals
3. **Snacks**: Optional add-ons

### Valid Meal Combinations (Minimum 2 meals required)
1. **1 Main Meal + 1 Breakfast**
2. **2 Main Meals** (lunch + dinner)
3. **2 Main Meals + 1 Breakfast** (all three)

### Snack Options
- 0 snacks per day
- 1 snack per day
- 2 snacks per day

### Total Daily Configurations
\`\`\`
Meal Combinations × Snack Options = 9 possible daily configurations

1. 1 Main + 1 Breakfast + 0 snacks
2. 1 Main + 1 Breakfast + 1 snack
3. 1 Main + 1 Breakfast + 2 snacks
4. 2 Main Meals + 0 snacks
5. 2 Main Meals + 1 snack
6. 2 Main Meals + 2 snacks
7. 2 Main + 1 Breakfast + 0 snacks
8. 2 Main + 1 Breakfast + 1 snack
9. 2 Main + 1 Breakfast + 2 snacks
\`\`\`

### Delivery Constraints
- **Minimum**: 3 days per week
- **Maximum**: 7 days per week
- Customer selects specific days (Monday-Sunday)

---

## Base Pricing Structure

### Base Meal Prices (in MAD)
\`\`\`typescript
const basePrices = {
  mainMeal: 40,    // MAD per main meal (lunch or dinner)
  breakfast: 30,   // MAD per breakfast
  snack: 15        // MAD per snack (no plan multiplier)
}
\`\`\`

### Plan Multipliers
Different meal plans have different costs based on complexity and ingredients:

\`\`\`typescript
const planMultipliers = {
  "stay-fit": 0.95,      // 5% discount (simpler preparation)
  "weight-loss": 1.0,    // Base price (standard)
  "muscle-gain": 1.15,   // 15% premium (more protein, larger portions)
  "keto": 1.10          // 10% premium (specialized ingredients)
}
\`\`\`

### Adjusted Meal Prices Formula
\`\`\`
Adjusted Price = Base Price × Plan Multiplier

Examples:
- Stay Fit Main Meal: 40 × 0.95 = 38 MAD
- Muscle Gain Breakfast: 30 × 1.15 = 34.5 MAD
- Keto Main Meal: 40 × 1.10 = 44 MAD
\`\`\`

---

## Discount System

The system applies **4 types of discounts** but uses the **best discount only** (no stacking):

### 1. Days-Based Discounts
Encourages customers to order more days per week:
\`\`\`typescript
const daysDiscounts = {
  "3-4 days": 0%,     // No discount
  "5-6 days": 5%,     // 5% off total
  "7 days": 10%       // 10% off total
}
\`\`\`

### 2. Volume-Based Discounts
Based on total items per week (meals + snacks):
\`\`\`typescript
const volumeDiscounts = {
  "6-13 items": 0%,    // No discount
  "14-20 items": 5%,   // 5% off total
  "21-35 items": 10%,  // 10% off total
  "36+ items": 15%     // 15% off total
}
\`\`\`

### 3. Duration-Based Discounts
Rewards longer subscription commitments:
\`\`\`typescript
const durationDiscounts = {
  "1 week": 0%,        // No discount
  "2 weeks": 5%,       // 5% off total subscription
  "1 month": 10%       // 10% off total subscription
}
\`\`\`

### 4. Promotional Discounts
Flexible system for marketing campaigns:
\`\`\`typescript
const promotionalDiscounts = {
  "RAMADAN2024": 15%,
  "NEWCUSTOMER": 20%,
  "SUMMER2024": 10%
}
\`\`\`

### Discount Priority Logic
1. Calculate all applicable discounts
2. Apply the **highest discount only**
3. Duration discounts **stack** with other discounts (applied after)

---

## Calculation Logic

### Step-by-Step Price Calculation

#### Step 1: Calculate Adjusted Meal Prices
\`\`\`typescript
const adjustedMainMeal = basePrices.mainMeal * planMultipliers[planId]
const adjustedBreakfast = basePrices.breakfast * planMultipliers[planId]
const snackPrice = basePrices.snack // No multiplier for snacks
\`\`\`

#### Step 2: Calculate Daily Cost
\`\`\`typescript
const dailyCost = 
  (numberOfMainMeals * adjustedMainMeal) +
  (numberOfBreakfasts * adjustedBreakfast) +
  (numberOfSnacks * snackPrice)
\`\`\`

#### Step 3: Calculate Weekly Subtotal
\`\`\`typescript
const weeklySubtotal = dailyCost * numberOfDaysPerWeek
\`\`\`

#### Step 4: Calculate Total Items
\`\`\`typescript
const totalItemsPerWeek = 
  (numberOfMainMeals + numberOfBreakfasts + numberOfSnacks) * numberOfDaysPerWeek
\`\`\`

#### Step 5: Determine Best Weekly Discount
\`\`\`typescript
const daysDiscount = getDaysDiscount(numberOfDaysPerWeek)
const volumeDiscount = getVolumeDiscount(totalItemsPerWeek)
const promoDiscount = getPromoDiscount(promoCode)

const bestWeeklyDiscount = Math.max(daysDiscount, volumeDiscount, promoDiscount)
\`\`\`

#### Step 6: Apply Weekly Discount
\`\`\`typescript
const weeklyDiscountAmount = weeklySubtotal * bestWeeklyDiscount
const weeklyTotal = weeklySubtotal - weeklyDiscountAmount
\`\`\`

#### Step 7: Calculate Subscription Total
\`\`\`typescript
const subscriptionSubtotal = weeklyTotal * numberOfWeeks
\`\`\`

#### Step 8: Apply Duration Discount
\`\`\`typescript
const durationDiscount = getDurationDiscount(subscriptionDuration)
const durationDiscountAmount = subscriptionSubtotal * durationDiscount
const finalTotal = subscriptionSubtotal - durationDiscountAmount
\`\`\`

---

## Practical Examples

### Example 1: Budget Customer
**Selection:**
- Plan: Stay Fit (0.95 multiplier)
- Meals: 1 main + 1 breakfast + 0 snacks
- Days: 3 days per week
- Duration: 1 week

**Calculation:**
\`\`\`
Adjusted Prices:
- Main Meal: 40 × 0.95 = 38 MAD
- Breakfast: 30 × 0.95 = 28.5 MAD

Daily Cost: 38 + 28.5 = 66.5 MAD
Weekly Subtotal: 66.5 × 3 = 199.5 MAD
Total Items: 2 × 3 = 6 items

Discounts:
- Days: 0% (3 days)
- Volume: 0% (6 items)
- Duration: 0% (1 week)

Final Total: 199.5 MAD
Cost per day: 66.5 MAD
\`\`\`

### Example 2: Popular Customer
**Selection:**
- Plan: Weight Loss (1.0 multiplier)
- Meals: 2 main + 0 breakfast + 1 snack
- Days: 5 days per week
- Duration: 2 weeks

**Calculation:**
\`\`\`
Adjusted Prices:
- Main Meal: 40 × 1.0 = 40 MAD
- Snack: 15 MAD

Daily Cost: (40 × 2) + 15 = 95 MAD
Weekly Subtotal: 95 × 5 = 475 MAD
Total Items: 3 × 5 = 15 items

Weekly Discounts:
- Days: 5% (5 days)
- Volume: 5% (15 items)
- Best: 5%

Weekly Total: 475 - (475 × 0.05) = 451.25 MAD
Subscription Subtotal: 451.25 × 2 = 902.5 MAD

Duration Discount: 5% (2 weeks)
Duration Discount Amount: 902.5 × 0.05 = 45.13 MAD

Final Total: 902.5 - 45.13 = 857.37 MAD
Cost per week: 428.69 MAD
Cost per day: 85.74 MAD
\`\`\`

### Example 3: Premium Customer
**Selection:**
- Plan: Muscle Gain (1.15 multiplier)
- Meals: 2 main + 1 breakfast + 2 snacks
- Days: 7 days per week
- Duration: 1 month (4 weeks)

**Calculation:**
\`\`\`
Adjusted Prices:
- Main Meal: 40 × 1.15 = 46 MAD
- Breakfast: 30 × 1.15 = 34.5 MAD
- Snack: 15 MAD

Daily Cost: (46 × 2) + 34.5 + (15 × 2) = 156.5 MAD
Weekly Subtotal: 156.5 × 7 = 1,095.5 MAD
Total Items: 5 × 7 = 35 items

Weekly Discounts:
- Days: 10% (7 days)
- Volume: 10% (35 items)
- Best: 10%

Weekly Total: 1,095.5 - (1,095.5 × 0.10) = 985.95 MAD
Subscription Subtotal: 985.95 × 4 = 3,943.8 MAD

Duration Discount: 10% (1 month)
Duration Discount Amount: 3,943.8 × 0.10 = 394.38 MAD

Final Total: 3,943.8 - 394.38 = 3,549.42 MAD
Cost per week: 887.36 MAD
Cost per day: 126.77 MAD
\`\`\`

---

## Implementation Details

### Core Interfaces

\`\`\`typescript
interface PricingConfig {
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

interface MealSelection {
  planId: string
  mainMeals: number
  breakfasts: number
  snacks: number
  daysPerWeek: number
  subscriptionDuration: string
  promoCode?: string
}

interface PricingResult {
  dailyCost: number
  weeklyCost: number
  subscriptionCost: number
  appliedDiscounts: {
    weekly: { type: string; rate: number; amount: number }
    duration: { rate: number; amount: number }
  }
  totalSavings: number
}
\`\`\`

### Key Functions

\`\`\`typescript
function calculateMealPrice(planId: string, mealType: string): number
function calculateDailyCost(selection: MealSelection): number
function getBestWeeklyDiscount(days: number, items: number, promoCode?: string): number
function calculateFinalPrice(selection: MealSelection): PricingResult
\`\`\`

---

## Edge Cases & Validation

### Input Validation
1. **Minimum meal requirement**: Must select at least 2 meals
2. **Minimum days**: Must select at least 3 days per week
3. **Valid combinations**: Only allow valid meal combinations
4. **Plan validation**: Ensure selected plan exists
5. **Duration validation**: Only allow 1 week, 2 weeks, 1 month

### Error Handling
1. **Invalid plan**: Default to "weight-loss" plan
2. **Invalid meal combination**: Show error message
3. **Calculation errors**: Return base price without discounts
4. **Database errors**: Log error, continue with cached prices

### Business Rules
1. **Snacks don't get plan multipliers**: Always base price
2. **Discounts don't stack**: Best discount wins (except duration)
3. **Minimum order value**: No minimum currently, but can be added
4. **Maximum discount**: Cap at 25% total discount

---

## Business Impact & Metrics

### Key Performance Indicators (KPIs)

#### Revenue Metrics
- **Average Order Value (AOV)**: Target increase through volume discounts
- **Customer Lifetime Value (CLV)**: Improved through duration discounts
- **Monthly Recurring Revenue (MRR)**: Stabilized through subscriptions

#### Customer Behavior
- **Days per week**: Track average to optimize discount thresholds
- **Subscription duration**: Monitor to adjust duration discounts
- **Plan distribution**: Understand which plans are most popular

#### Discount Effectiveness
- **Discount utilization rate**: % of orders using discounts
- **Average discount amount**: Monitor discount impact on margins
- **Conversion rate by discount**: Which discounts drive most conversions

### Expected Business Outcomes

#### Short-term (1-3 months)
- Increase average order size by 20-30%
- Improve customer retention through duration discounts
- Reduce customer acquisition cost through referral incentives

#### Medium-term (3-6 months)
- Establish predictable revenue through subscription model
- Optimize discount thresholds based on customer behavior
- Introduce seasonal and promotional campaigns

#### Long-term (6+ months)
- Achieve 70%+ subscription revenue vs one-time orders
- Implement dynamic pricing based on demand
- Expand to corporate and bulk order discounts

---

## Future Considerations

### Potential Enhancements

#### Dynamic Pricing
- **Demand-based**: Higher prices during peak periods
- **Inventory-based**: Discounts for overstocked ingredients
- **Geographic**: Different pricing for different delivery zones

#### Advanced Discounts
- **Loyalty tiers**: Progressive discounts for long-term customers
- **Referral bonuses**: Discounts for bringing new customers
- **Corporate packages**: Bulk pricing for office orders

#### Personalization
- **AI-driven pricing**: Personalized discounts based on behavior
- **Dietary preferences**: Premium pricing for specialized diets
- **Seasonal adjustments**: Automatic price adjustments for seasonal ingredients

#### Technical Improvements
- **A/B testing**: Test different discount structures
- **Real-time pricing**: Update prices based on costs and demand
- **Advanced analytics**: Better insights into pricing effectiveness

### Scalability Considerations

#### Database Optimization
- Index pricing tables for fast lookups
- Cache frequently accessed pricing data
- Implement pricing history for analytics

#### API Design
- Versioned pricing APIs for backward compatibility
- Rate limiting for pricing calculations
- Webhook notifications for price changes

#### Integration Points
- Payment gateway integration for subscription billing
- Inventory system integration for cost-based pricing
- CRM integration for personalized pricing

---

## Conclusion

This pricing system provides a flexible, scalable foundation for Fitnest.ma's meal delivery business. The multi-tiered discount structure encourages larger orders and longer commitments while maintaining transparency for customers.

The system is designed to:
- **Maximize revenue** through volume and duration incentives
- **Improve customer retention** through subscription benefits
- **Maintain flexibility** for future enhancements and promotions
- **Provide clear value** to customers at every tier

Regular monitoring and optimization of discount thresholds will ensure the pricing remains competitive while supporting business growth objectives.
