"use client"

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  addDays,
  addWeeks,
  startOfDay,
  isFriday,
  isSaturday,
  isSunday,
  nextMonday,
  format,
  isSameWeek,
  getISOWeek,
  startOfWeek,
} from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'

// Mock data for meals, replace with actual data fetching
const sampleMeals = [
  { id: 'meal-1', name: 'Grilled Chicken Salad' },
  { id: 'meal-2', name: 'Salmon with Quinoa' },
  { id: 'meal-3', name: 'Vegan Lentil Soup' },
  { id: 'meal-4', name: 'Beef Stir-fry' },
]

const sampleSnacks = [
  { id: 'snack-1', name: 'Protein Bar' },
  { id: 'snack-2', name: 'Apple Slices with Peanut Butter' },
  { id: 'snack-3', name: 'Greek Yogurt' },
]

type MealPlanType = 'weight-loss' | 'muscle-gain' | 'keto'
type Duration = 1 | 2 | 4 // in weeks

interface OrderState {
  planType: MealPlanType
  mealsPerDay: number
  snacksPerDay: number
  duration: Duration
  deliveryDays: Date[]
  menu: Record<string, { meals: string[]; snacks: string[] }>
}

export default function OrderProcess() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [orderState, setOrderState] = useState<OrderState>({
    planType: 'weight-loss',
    mealsPerDay: 2,
    snacksPerDay: 1,
    duration: 1,
    deliveryDays: [],
    menu: {},
  })
  const [error, setError] = useState<string | null>(null)

  const now = useMemo(() => new Date(), [])

  const calendarStartDate = useMemo(() => {
    const today = startOfDay(now)
    const minDate = addDays(today, 2)
    if (isFriday(today) || isSaturday(today) || isSunday(today)) {
      const nextMon = nextMonday(today)
      return nextMon > minDate ? nextMon : minDate
    }
    return minDate
  }, [now])

  const calendarEndDate = useMemo(() => {
    // addWeeks is exclusive of the last day, so we don't need to subtract
    return addWeeks(calendarStartDate, orderState.duration)
  }, [calendarStartDate, orderState.duration])

  const isDateDisabled = (date: Date) => {
    return date < calendarStartDate || date >= calendarEndDate
  }

  const handleDaySelect = (day: Date | undefined) => {
    if (!day || isDateDisabled(day)) return

    const newDeliveryDays = orderState.deliveryDays.some(
      (d) => d.getTime() === day.getTime()
    )
      ? orderState.deliveryDays.filter((d) => d.getTime() !== day.getTime())
      : [...orderState.deliveryDays, day]

    setOrderState((prev) => ({
      ...prev,
      deliveryDays: newDeliveryDays.sort((a, b) => a.getTime() - b.getTime()),
    }))
    setError(null)
  }

  const validateStep1 = () => {
    const weeksToValidate: Date[] = []
    for (let i = 0; i < orderState.duration; i++) {
      weeksToValidate.push(
        startOfWeek(addWeeks(calendarStartDate, i), { weekStartsOn: 1 })
      )
    }

    for (const weekStart of weeksToValidate) {
      const daysInWeek = orderState.deliveryDays.filter((day) =>
        isSameWeek(day, weekStart, { weekStartsOn: 1 })
      )
      if (daysInWeek.length < 2) {
        setError(
          `Please select at least 2 delivery days for the week of ${format(
            weekStart,
            'MMM do'
          )}.`
        )
        return false
      }
    }

    if (orderState.deliveryDays.length === 0) {
      setError('Please select your delivery days.')
      return false
    }

    setError(null)
    return true
  }

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        // Initialize menu for step 2
        const initialMenu: OrderState['menu'] = {}
        orderState.deliveryDays.forEach((day) => {
          initialMenu[format(day, 'yyyy-MM-dd')] = { meals: [], snacks: [] }
        })
        setOrderState((prev) => ({ ...prev, menu: initialMenu }))
        setStep(2)
      }
    } else if (step === 2) {
      // Add validation for step 2 if needed
      // For now, just navigate
      router.push('/checkout')
    }
  }

  const handlePrevStep = () => {
    setStep((prev) => prev - 1)
  }

  const handleMealSelection = (date: string, mealId: string) => {
    setOrderState((prev) => {
      const currentMeals = prev.menu[date]?.meals || []
      const newMeals = currentMeals.includes(mealId)
        ? currentMeals.filter((id) => id !== mealId)
        : [...currentMeals, mealId].slice(0, prev.mealsPerDay)
      return {
        ...prev,
        menu: {
          ...prev.menu,
          [date]: { ...prev.menu[date], meals: newMeals },
        },
      }
    })
  }

  const handleSnackSelection = (date: string, snackId: string) => {
    setOrderState((prev) => {
      const currentSnacks = prev.menu[date]?.snacks || []
      const newSnacks = currentSnacks.includes(snackId)
        ? currentSnacks.filter((id) => id !== snackId)
        : [...currentSnacks, snackId].slice(0, prev.snacksPerDay)
      return {
        ...prev,
        menu: {
          ...prev.menu,
          [date]: { ...prev.menu[date], snacks: newSnacks },
        },
      }
    })
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Step {step}:{' '}
            {step === 1 ? 'Customize Your Plan' : 'Build Your Menu'}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1
              ? 'Select your preferences to create the perfect meal plan.'
              : 'Choose your meals and snacks for each delivery day.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-8">
              {/* Plan Type */}
              <div>
                <Label className="text-lg font-semibold">Plan Type</Label>
                <RadioGroup
                  value={orderState.planType}
                  onValueChange={(value: MealPlanType) =>
                    setOrderState((prev) => ({ ...prev, planType: value }))
                  }
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  {['weight-loss', 'muscle-gain', 'keto'].map((plan) => (
                    <div key={plan}>
                      <RadioGroupItem
                        value={plan}
                        id={plan}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={plan}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary capitalize cursor-pointer"
                      >
                        {plan.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Meals and Snacks */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Label
                    htmlFor="meals-per-day"
                    className="text-lg font-semibold"
                  >
                    Meals per day
                  </Label>
                  <Select
                    value={String(orderState.mealsPerDay)}
                    onValueChange={(value) =>
                      setOrderState((prev) => ({
                        ...prev,
                        mealsPerDay: Number(value),
                      }))
                    }
                  >
                    <SelectTrigger id="meals-per-day">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="snacks-per-day"
                    className="text-lg font-semibold"
                  >
                    Snacks per day
                  </Label>
                  <Select
                    value={String(orderState.snacksPerDay)}
                    onValueChange={(value) =>
                      setOrderState((prev) => ({
                        ...prev,
                        snacksPerDay: Number(value),
                      }))
                    }
                  >
                    <SelectTrigger id="snacks-per-day">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Duration */}
              <div>
                <Label className="text-lg font-semibold">
                  Subscription Duration
                </Label>
                <RadioGroup
                  value={String(orderState.duration)}
                  onValueChange={(value) =>
                    setOrderState((prev) => ({
                      ...prev,
                      duration: Number(value) as Duration,
                      deliveryDays: [],
                    }))
                  }
                  className="grid grid-cols-3 gap-4 mt-2"
                >
                  {[
                    { value: 1, label: '1 Week' },
                    { value: 2, label: '2 Weeks' },
                    { value: 4, label: '1 Month' },
                  ].map((item) => (
                    <div key={item.value}>
                      <RadioGroupItem
                        value={String(item.value)}
                        id={`duration-${item.value}`}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`duration-${item.value}`}
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Delivery Days Calendar */}
              <div>
                <Label className="text-lg font-semibold">
                  Select Delivery Days
                </Label>
                <p className="text-sm text-muted-foreground">
                  Choose at least 2 delivery days per week.
                </p>
                <div className="flex justify-center mt-4">
                  <Calendar
                    mode="multiple"
                    selected={orderState.deliveryDays}
                    onSelect={handleDaySelect}
                    disabled={isDateDisabled}
                    fromMonth={calendarStartDate}
                    toMonth={calendarEndDate}
                    numberOfMonths={orderState.duration === 4 ? 2 : 1}
                    className="rounded-md border"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {step === 2 && (
            <Accordion
              type="single"
              collapsible
              className="w-full"
              defaultValue={
                orderState.deliveryDays.length > 0
                  ? format(orderState.deliveryDays[0], 'yyyy-MM-dd')
                  : undefined
              }
            >
              {orderState.deliveryDays.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd')
                const dayMenu = orderState.menu[dateStr]
                const isComplete =
                  dayMenu.meals.length === orderState.mealsPerDay &&
                  dayMenu.snacks.length === orderState.snacksPerDay
                return (
                  <AccordionItem value={dateStr} key={dateStr}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full pr-4">
                        <span>{format(day, 'EEEE, MMMM do')}</span>
                        {isComplete && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Meals ({dayMenu.meals.length}/
                            {orderState.mealsPerDay})
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sampleMeals.map((meal) => (
                              <Button
                                key={meal.id}
                                variant={
                                  dayMenu.meals.includes(meal.id)
                                    ? 'default'
                                    : 'outline'
                                }
                                onClick={() =>
                                  handleMealSelection(dateStr, meal.id)
                                }
                              >
                                {meal.name}
                              </Button>
                            ))}
                          </div>
                        </div>
                        {orderState.snacksPerDay > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">
                              Snacks ({dayMenu.snacks.length}/
                              {orderState.snacksPerDay})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {sampleSnacks.map((snack) => (
                                <Button
                                  key={snack.id}
                                  variant={
                                    dayMenu.snacks.includes(snack.id)
                                      ? 'default'
                                      : 'outline'
                                  }
                                  onClick={() =>
                                    handleSnackSelection(dateStr, snack.id)
                                  }
                                >
                                  {snack.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={step === 1}
          >
            Previous
          </Button>
          <Button onClick={handleNextStep}>
            {step === 1 ? 'Next: Build Menu' : 'Proceed to Checkout'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
