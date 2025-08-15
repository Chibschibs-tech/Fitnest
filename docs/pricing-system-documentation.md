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

---

## 1. Business Model Overview

Fitnest.ma operates a **subscription-based meal delivery service** with the following key characteristics:

- **Meal Plans**: 4 different nutrition-focused plans (Weight Loss, Stay Fit, Muscle Gain, Keto)
- **Flexible Selection**: Customers choose specific meals, days, and subscription duration
- **Delivery Schedule**: Minimum 3 days per week, maximum 7 days per week
- **Subscription Duration**: 1 week, 2 weeks, or 1 month (4 weeks)

### Revenue Model
- **Primary Revenue**: Subscription fees based on meal selections
- **Pricing Strategy**: Volume discounts to encourage larger orders and longer commitments
- **Target Market**: Health-conscious individuals seeking convenient, nutritious meals

---

## 2. Meal Structure & Constraints

### 2.1 Meal Types
The system recognizes three distinct meal types:

1. **Main Meals**: What customers see as "lunch" and "dinner"
   - Technically identical in preparation and cost
   - Both classified as "main meals" in the system
   - Higher complexity and cost than breakfast

2. **Breakfast**: 
   - Simpler preparation than main meals
   - Lower base cost
   - Optional addition to main meals

3. **Snacks**:
   - Add-on items
   - Fixed price regardless of plan
   - Optional (0, 1, or 2 per day)

### 2.2 Valid Meal Combinations
Customers **must select minimum 2 meals per day**. Valid combinations are:

| Combination ID | Description | Main Meals | Breakfast | Total Meals |
|----------------|-------------|------------|-----------|-------------|
| `1main-1breakfast` | 1 Main + Breakfast | 1 | ✓ | 2 |
| `2main` | Lunch + Dinner | 2 | ✗ | 2 |
| `2main-1breakfast` | All Meals | 2 | ✓ | 3 |

### 2.3 Snack Options
For each valid meal combination, customers can add:
- **0 snacks**: No additional cost
- **1 snack**: +15 MAD per day
- **2 snacks**: +30 MAD per day (2 × 15 MAD)

### 2.4 Total Possible Configurations
\`\`\`
3 meal combinations × 3 snack options = 9 possible daily configurations

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

### 2.5 Delivery Constraints
- **Minimum**: 3 days per week
- **Maximum**: 7 days per week
- **Selection**: Customer chooses specific days (Monday-Sunday)

---

## 3. Base Pricing Structure

### 3.1 Standard Base Prices (MAD)
\`\`\`
Main Meal (lunch/dinner): 40 MAD
Breakfast: 30 MAD
Snack: 15 MAD
\`\`\`

### 3.2 Plan-Based Multipliers
Each meal plan has a different multiplier applied to main meals and breakfast (snacks remain fixed):

| Plan | Multiplier | Reasoning | Main Meal Price | Breakfast Price |
|------|------------|-----------|-----------------|-----------------|
| **Stay Fit** | 0.95 (5% discount) | Easier preparation | 38 MAD | 28.5 MAD |
| **Weight Loss** | 1.0 (base) | Standard complexity | 40 MAD | 30 MAD |
| **Keto** | 1.1 (10% premium) | Specialized ingredients | 44 MAD | 33 MAD |
| **Muscle Gain** | 1.15 (15% premium) | More protein, larger portions | 46 MAD | 34.5 MAD |

### 3.3 Daily Cost Calculation Formula
\`\`\`
Daily Cost = (Main Meals × Main Meal Price) + (Breakfast × Breakfast Price) + (Snacks × 15)

Where:
- Main Meal Price = 40 × Plan Multiplier
- Breakfast Price = 30 × Plan Multiplier (if selected)
- Snacks = 0, 1, or 2
\`\`\`

---

## 4. Discount System

The system applies **four types of discounts** with specific stacking rules:

### 4.1 Days-Based Discounts (Weekly)
Encourages customers to order more days per week:

| Days per Week | Discount | Reasoning |
|---------------|----------|-----------|
| 3-4 days | 0% | Minimum viable order |
| 5-6 days | 5% | Regular customer |
| 7 days | 10% | Full week commitment |

### 4.2 Volume-Based Discounts (Weekly)
Based on total items per week (meals + snacks):

| Total Items per Week | Discount | Example |
|---------------------|----------|---------|
| 6-13 items | 0% | 3 days × 2 meals = 6 items |
| 14-20 items | 5% | 5 days × 3 meals + 1 snack = 20 items |
| 21-35 items | 10% | 7 days × 3 meals = 21 items |
| 36+ items | 15% | 7 days × 4 meals + 2 snacks = 42 items |

### 4.3 Duration-Based Discounts (Subscription)
Rewards longer subscription commitments:

| Subscription Duration | Discount | Target Customer |
|----------------------|----------|-----------------|
| 1 week | 0% | Trial customers |
| 2 weeks | 5% | Habit building |
| 1 month (4 weeks) | 10% | Committed customers |

### 4.4 Seasonal/Promotional Discounts
Configurable promotional codes:

| Code | Discount | Usage |
|------|----------|-------|
| `new-customer` | 20% | First-time customers |
| `ramadan` | 15% | Religious holidays |
| `summer` | 10% | Seasonal promotions |
| `bulk-order` | 25% | Orders over 1000 MAD |

### 4.5 Discount Stacking Rules

**Rule 1: Weekly Discounts (Days vs Volume)**
- Calculate both days-based and volume-based discounts
- Apply the **higher** of the two (no stacking)
- This ensures customers always get the best weekly deal

**Rule 2: Duration Discounts**
- Duration discounts **stack** with weekly discounts
- Applied to the total subscription amount

**Rule 3: Seasonal Discounts**
- Seasonal discounts **stack** with all other discounts
- Applied to the final subscription amount

**Calculation Order:**
1. Calculate weekly subtotal
2. Apply best weekly discount (days OR volume)
3. Multiply by number of weeks
4. Apply duration discount
5. Apply seasonal discount (if any)

---

## 5. Calculation Logic

### 5.1 Step-by-Step Calculation Process

\`\`\`
Step 1: Calculate Daily Base Cost
- Main meals cost = Main meal count × (40 × Plan multiplier)
- Breakfast cost = Breakfast selected × (30 × Plan multiplier)
- Snacks cost = Snack count × 15
- Daily total = Main meals cost + Breakfast cost + Snacks cost

Step 2: Calculate Weekly Cost
- Weekly subtotal = Daily total × Selected days count

Step 3: Calculate Weekly Discounts
- Days discount = Weekly subtotal × Days discount rate
- Volume discount = Weekly subtotal × Volume discount rate
- Applied weekly discount = MAX(Days discount, Volume discount)

Step 4: Calculate Subscription Cost
- Subscription subtotal = Weekly subtotal × Subscription weeks
- Weekly discount total = Applied weekly discount × Subscription weeks

Step 5: Calculate Duration Discount
- Duration discount = Subscription subtotal × Duration discount rate

Step 6: Calculate Seasonal Discount (if applicable)
- Seasonal discount = Subscription subtotal × Seasonal discount rate

Step 7: Calculate Final Total
- Total discount = Weekly discount total + Duration discount + Seasonal discount
- Final total = Subscription subtotal - Total discount
\`\`\`

### 5.2 Key Metrics Calculated
- **Final Total**: Total amount customer pays
- **Price per Week**: Final total ÷ Number of weeks
- **Price per Day**: Final total ÷ (Days per week × Number of weeks)
- **Total Items**: (Meals + Snacks) per day × Days per week × Number of weeks

---

## 6. Practical Examples

### 6.1 Example 1: Budget Customer
**Selection:**
- Plan: Stay Fit
- Meals: 1 Main + 1 Breakfast
- Snacks: 0
- Days: 3 per week
- Duration: 1 week

**Calculation:**
\`\`\`
Daily cost: (1 × 38) + (1 × 28.5) + (0 × 15) = 66.5 MAD
Weekly subtotal: 66.5 × 3 = 199.5 MAD
Weekly discount: 0% (3 days, 6 items)
Duration discount: 0% (1 week)
Final total: 199.5 MAD
Price per day: 66.5 MAD
\`\`\`

### 6.2 Example 2: Popular Customer
**Selection:**
- Plan: Weight Loss
- Meals: 2 Main + 0 Breakfast
- Snacks: 1
- Days: 5 per week
- Duration: 2 weeks

**Calculation:**
\`\`\`
Daily cost: (2 × 40) + (0 × 30) + (1 × 15) = 95 MAD
Weekly subtotal: 95 × 5 = 475 MAD
Weekly discount: 5% (5 days OR 15 items) = 23.75 MAD
Subscription subtotal: 475 × 2 = 950 MAD
Weekly discount total: 23.75 × 2 = 47.5 MAD
Duration discount: 950 × 5% = 47.5 MAD
Total discount: 47.5 + 47.5 = 95 MAD
Final total: 950 - 95 = 855 MAD
Price per week: 427.5 MAD
Price per day: 85.5 MAD
\`\`\`

### 6.3 Example 3: Premium Customer
**Selection:**
- Plan: Muscle Gain
- Meals: 2 Main + 1 Breakfast
- Snacks: 2
- Days: 7 per week
- Duration: 1 month (4 weeks)

**Calculation:**
\`\`\`
Daily cost: (2 × 46) + (1 × 34.5) + (2 × 15) = 156.5 MAD
Weekly subtotal: 156.5 × 7 = 1,095.5 MAD
Weekly discount: 10% (7 days AND 35 items both = 10%) = 109.55 MAD
Subscription subtotal: 1,095.5 × 4 = 4,382 MAD
Weekly discount total: 109.55 × 4 = 438.2 MAD
Duration discount: 4,382 × 10% = 438.2 MAD
Total discount: 438.2 + 438.2 = 876.4 MAD
Final total: 4,382 - 876.4 = 3,505.6 MAD
Price per week: 876.4 MAD
Price per day: 125.2 MAD
\`\`\`

---

## 7. Implementation Details

### 7.1 Data Structures

**MealSelection Interface:**
\`\`\`typescript
interface MealSelection {
  planId: string              // "weight-loss", "stay-fit", "muscle-gain", "keto"
  mainMeals: number          // 1 or 2
  breakfast: boolean         // true/false
  snacks: number            // 0, 1, or 2
  selectedDays: Date[]      // Array of delivery dates
  subscriptionWeeks: number // 1, 2, or 4
}
\`\`\`

**PriceBreakdown Interface:**
\`\`\`typescript
interface PriceBreakdown {
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
\`\`\`

### 7.2 Key Functions

**calculatePrice(selection, seasonalCode?):**
- Main pricing calculation function
- Returns complete price breakdown
- Handles all discount logic

**validateMealSelection(selection):**
- Validates customer selections
- Returns array of error messages
- Ensures business rules compliance

### 7.3 Configuration Management

All pricing parameters are centralized in `pricingConfig`:
- Easy to update prices
- Modify discount tiers
- Add/remove seasonal promotions
- Change plan multipliers

---

## 8. Edge Cases & Validation

### 8.1 Validation Rules

**Meal Selection Validation:**
- Minimum 2 meals per day (main + breakfast OR 2 main meals)
- Main meals: 1 or 2 only
- Snacks: 0, 1, or 2 only
- Days: 3-7 per week
- Duration: 1, 2, or 4 weeks only

**Business Logic Validation:**
- Prevent invalid meal combinations
- Ensure minimum order values
- Validate delivery day selections
- Check subscription duration limits

### 8.2 Edge Cases Handled

**Rounding:**
- All final prices rounded to 2 decimal places
- Consistent rounding throughout calculations

**Discount Conflicts:**
- Days vs Volume: Always apply the better discount
- Multiple seasonal codes: Only one can be applied
- Zero discounts: Handle gracefully without errors

**Boundary Conditions:**
- Exactly 3 days (minimum)
- Exactly 7 days (maximum)
- Transition points between discount tiers
- Single week vs multi-week subscriptions

### 8.3 Error Handling

**Invalid Selections:**
- Return clear error messages
- Prevent calculation with invalid data
- Guide users to valid combinations

**System Errors:**
- Graceful fallback to base pricing
- Log calculation errors for debugging
- Maintain service availability

---

## 9. Business Impact & Metrics

### 9.1 Key Performance Indicators

**Revenue Metrics:**
- Average Order Value (AOV)
- Customer Lifetime Value (CLV)
- Subscription retention rates
- Discount utilization rates

**Customer Behavior:**
- Most popular meal combinations
- Average subscription duration
- Days per week distribution
- Plan preference by customer segment

### 9.2 Pricing Strategy Benefits

**Volume Incentives:**
- Encourages larger orders (higher AOV)
- Improves operational efficiency
- Increases customer satisfaction

**Commitment Rewards:**
- Longer subscriptions improve cash flow
- Reduces customer acquisition costs
- Builds customer loyalty

**Plan Differentiation:**
- Premium plans generate higher margins
- Specialized offerings command premium pricing
- Clear value proposition for each segment

---

## 10. Future Considerations

### 10.1 Potential Enhancements

**Dynamic Pricing:**
- Demand-based pricing by day/time
- Seasonal ingredient cost adjustments
- Geographic pricing variations

**Advanced Discounts:**
- Loyalty program integration
- Referral bonuses
- Corporate/bulk discounts

**Personalization:**
- Individual customer pricing
- Usage-based discounts
- Predictive pricing models

### 10.2 Scalability Considerations

**Technical:**
- Caching of price calculations
- Database optimization for pricing queries
- API rate limiting for pricing endpoints

**Business:**
- Multi-region pricing support
- Currency conversion handling
- Tax calculation integration

---

This documentation provides a complete understanding of the Fitnest.ma pricing system. For technical implementation details, refer to the `lib/pricing-model.ts` file. For business questions, contact the product team.
