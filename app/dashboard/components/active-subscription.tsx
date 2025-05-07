"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check, CreditCard, Pause, RefreshCw, Edit, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { format, addDays } from "date-fns"
import Link from "next/link"

export default function ActiveSubscription() {
  const [isPaused, setIsPaused] = useState(false)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showChangeDialog, setShowChangeDialog] = useState(false)
  const [pauseDuration, setPauseDuration] = useState("1-week")
  const [pauseUntilDate, setPauseUntilDate] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showDeliveryDialog, setShowDeliveryDialog] = useState(false)

  // Sample data - in a real app, this would come from an API
  const subscription = {
    plan: "Weight Loss",
    status: isPaused ? "Paused" : "Active",
    startDate: "April 15, 2023",
    nextBillingDate: "May 15, 2023",
    price: 349,
    frequency: "Weekly",
    deliveryDays: "Monday to Friday",
    mealCount: "3 meals per day",
    mealTypes: ["Lunch", "Dinner", "Snack"],
    deliveryTime: "Morning (8AM - 12PM)",
    deliveryAddress: "Apartment 3B, 123 Maarif Street, Casablanca",
    features: ["Customizable meals", "Nutritionist support", "Weekly menu rotation", "Pause or cancel anytime"],
  }

  const handlePauseSubscription = () => {
    setIsPaused(true)
    setShowPauseDialog(false)

    // Calculate pause until date based on selection
    const today = new Date()
    let daysToAdd = 7

    if (pauseDuration === "2-weeks") daysToAdd = 14
    else if (pauseDuration === "1-month") daysToAdd = 30
    else if (pauseDuration === "custom" && pauseUntilDate) {
      // Use the custom date
      setSuccessMessage(`Your subscription has been paused until ${pauseUntilDate}. You can resume anytime.`)
      setTimeout(() => setSuccessMessage(""), 5000)
      return
    }

    const resumeDate = addDays(today, daysToAdd)
    setSuccessMessage(
      `Your subscription has been paused until ${format(resumeDate, "MMMM d, yyyy")}. You can resume anytime.`,
    )
    setTimeout(() => setSuccessMessage(""), 5000)
  }

  const handleResumeSubscription = () => {
    setIsPaused(false)
    setSuccessMessage("Your subscription has been resumed. Your next delivery is scheduled for tomorrow.")
    setTimeout(() => setSuccessMessage(""), 5000)
  }

  const handleCancelSubscription = () => {
    setShowCancelDialog(false)
    setSuccessMessage(
      "Your subscription has been canceled. You'll continue to receive meals until the end of your current billing period.",
    )
    setTimeout(() => setSuccessMessage(""), 5000)
  }

  const handleUpdateDelivery = () => {
    setShowDeliveryDialog(false)
    setSuccessMessage("Your delivery preferences have been updated successfully.")
    setTimeout(() => setSuccessMessage(""), 5000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between md:flex-row md:items-center">
        <h2 className="text-2xl font-bold tracking-tight">My Subscription</h2>
        <div className="mt-2 flex space-x-2 md:mt-0">
          {isPaused ? (
            <Button onClick={handleResumeSubscription} className="bg-green-600 hover:bg-green-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              Resume Subscription
            </Button>
          ) : (
            <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Pause className="mr-2 h-4 w-4" />
                  Pause Subscription
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Pause Your Subscription</DialogTitle>
                  <DialogDescription>
                    You can pause your subscription and resume it at any time. How long would you like to pause?
                  </DialogDescription>
                </DialogHeader>
                <RadioGroup value={pauseDuration} onValueChange={setPauseDuration} className="mt-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-week" id="1-week" />
                    <Label htmlFor="1-week">1 Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2-weeks" id="2-weeks" />
                    <Label htmlFor="2-weeks">2 Weeks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1-month" id="1-month" />
                    <Label htmlFor="1-month">1 Month</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom Date</Label>
                  </div>
                </RadioGroup>

                {pauseDuration === "custom" && (
                  <div className="mt-4">
                    <Label htmlFor="pause-until">Pause Until</Label>
                    <input
                      type="date"
                      id="pause-until"
                      value={pauseUntilDate}
                      onChange={(e) => setPauseUntilDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                )}

                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setShowPauseDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handlePauseSubscription} className="bg-green-600 hover:bg-green-700">
                    Pause Subscription
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <Button variant="outline">
            <CreditCard className="mr-2 h-4 w-4" />
            Manage Billing
          </Button>

          <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                Cancel Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel Your Subscription</DialogTitle>
                <DialogDescription>
                  We're sorry to see you go. Please let us know why you're canceling so we can improve our service.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <RadioGroup defaultValue="too-expensive">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="too-expensive" id="too-expensive" />
                    <Label htmlFor="too-expensive">Too expensive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dont-like-meals" id="dont-like-meals" />
                    <Label htmlFor="dont-like-meals">Don't like the meals</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery-issues" id="delivery-issues" />
                    <Label htmlFor="delivery-issues">Delivery issues</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="temporary" id="temporary" />
                    <Label htmlFor="temporary">Just taking a break</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other reason</Label>
                  </div>
                </RadioGroup>

                <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Canceling your subscription will stop future deliveries after your current billing period ends.
                  </AlertDescription>
                </Alert>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                  Keep My Subscription
                </Button>
                <Button
                  onClick={handleCancelSubscription}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Cancel Subscription
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{subscription.plan} Plan</CardTitle>
              <CardDescription>Your current meal plan subscription</CardDescription>
            </div>
            <Badge variant={isPaused ? "outline" : "default"} className={isPaused ? "bg-gray-100" : "bg-green-600"}>
              {subscription.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p>{subscription.startDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Next Billing Date</p>
                <p>{subscription.nextBillingDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p>{subscription.price} MAD per week</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Billing Frequency</p>
                <p>{subscription.frequency}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Delivery Days</p>
                <p>{subscription.deliveryDays}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Meals</p>
                <p>{subscription.mealCount}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Features</p>
                <ul className="mt-1 space-y-1">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="mr-2 h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-4">Delivery Settings</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Delivery Schedule</p>
                  <p className="text-sm text-gray-600 mt-1">{subscription.deliveryDays}</p>
                  <p className="text-sm text-gray-600">{subscription.deliveryTime}</p>
                </div>
                <Dialog open={showDeliveryDialog} onOpenChange={setShowDeliveryDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Delivery Settings</DialogTitle>
                      <DialogDescription>Change your delivery schedule and preferences</DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label>Delivery Days</Label>
                        <div className="flex flex-wrap gap-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                            <div
                              key={day}
                              className={`h-10 w-10 rounded-full flex items-center justify-center cursor-pointer
                                ${i < 5 ? "bg-green-500 text-white" : "bg-gray-100 text-gray-700"}`}
                            >
                              {day.charAt(0)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Delivery Time</Label>
                        <RadioGroup defaultValue="morning">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="morning" id="delivery-morning" />
                            <Label htmlFor="delivery-morning">Morning (8AM - 12PM)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="afternoon" id="delivery-afternoon" />
                            <Label htmlFor="delivery-afternoon">Afternoon (12PM - 4PM)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="evening" id="delivery-evening" />
                            <Label htmlFor="delivery-evening">Evening (4PM - 8PM)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="delivery-address">Delivery Address</Label>
                        <textarea
                          id="delivery-address"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-green-500"
                          rows={3}
                          defaultValue={subscription.deliveryAddress}
                        />
                      </div>
                    </div>

                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setShowDeliveryDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateDelivery} className="bg-green-600 hover:bg-green-700">
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Delivery Address</p>
                    <p className="text-sm text-gray-600 mt-1">{subscription.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">Change Plan Details</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Change Your Meal Plan</DialogTitle>
                <DialogDescription>Customize your meal plan to better fit your needs</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="plan-type" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="plan-type">Plan Type</TabsTrigger>
                  <TabsTrigger value="meals">Meals</TabsTrigger>
                  <TabsTrigger value="frequency">Frequency</TabsTrigger>
                </TabsList>

                <TabsContent value="plan-type" className="space-y-4 pt-4">
                  <RadioGroup defaultValue="weight-loss">
                    <div className="flex items-center justify-between space-x-2 border rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weight-loss" id="weight-loss" />
                        <Label htmlFor="weight-loss">Weight Loss</Label>
                      </div>
                      <Badge>Current</Badge>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="balanced" id="balanced" />
                      <Label htmlFor="balanced">Balanced Nutrition</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="muscle-gain" id="muscle-gain" />
                      <Label htmlFor="muscle-gain">Muscle Gain</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-3">
                      <RadioGroupItem value="keto" id="keto" />
                      <Label htmlFor="keto">Keto</Label>
                    </div>
                  </RadioGroup>
                </TabsContent>

                <TabsContent value="meals" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Meals Per Day</Label>
                    <RadioGroup defaultValue="3-meals">
                      <div className="flex items-center justify-between space-x-2 border rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2-meals" id="2-meals" />
                          <Label htmlFor="2-meals">2 Meals</Label>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                      <div className="flex items-center justify-between space-x-2 border rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3-meals" id="3-meals" />
                          <Label htmlFor="3-meals">3 Meals</Label>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value="5-meals" id="5-meals" />
                        <Label htmlFor="5-meals">5 Meals (3 + 2 Snacks)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Label>Meal Types</Label>
                    <div className="space-y-2">
                      {["Breakfast", "Lunch", "Dinner", "Snack"].map((meal, i) => (
                        <div key={meal} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`meal-${meal.toLowerCase()}`}
                            defaultChecked={subscription.mealTypes.includes(meal)}
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <Label htmlFor={`meal-${meal.toLowerCase()}`}>{meal}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="frequency" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Days Per Week</Label>
                    <RadioGroup defaultValue="5-days">
                      <div className="flex items-center justify-between space-x-2 border rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="5-days" id="5-days" />
                          <Label htmlFor="5-days">5 Days (Mon-Fri)</Label>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value="7-days" id="7-days" />
                        <Label htmlFor="7-days">7 Days (Full Week)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Label>Billing Cycle</Label>
                    <RadioGroup defaultValue="weekly">
                      <div className="flex items-center justify-between space-x-2 border rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="weekly" id="weekly" />
                          <Label htmlFor="weekly">Weekly</Label>
                        </div>
                        <Badge>Current</Badge>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-lg p-3">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly (Save 10%)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">New Total:</span>
                  <span className="font-bold text-lg">349 MAD/week</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Changes will take effect on your next billing cycle</p>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setShowChangeDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowChangeDialog(false)
                    setSuccessMessage("Your plan changes will take effect on your next billing cycle.")
                    setTimeout(() => setSuccessMessage(""), 5000)
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Link href="/meal-plans">
            <Button className="bg-green-600 hover:bg-green-700">
              <Calendar className="mr-2 h-4 w-4" />
              Browse All Plans
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Payments</CardTitle>
          <CardDescription>Your scheduled payments for this subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">May 15, 2023</p>
                <p className="text-sm text-gray-500">Weight Loss Plan (5 days)</p>
              </div>
              <p className="font-medium">349 MAD</p>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">May 22, 2023</p>
                <p className="text-sm text-gray-500">Weight Loss Plan (5 days)</p>
              </div>
              <p className="font-medium">349 MAD</p>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="font-medium">May 29, 2023</p>
                <p className="text-sm text-gray-500">Weight Loss Plan (5 days)</p>
              </div>
              <p className="font-medium">349 MAD</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
