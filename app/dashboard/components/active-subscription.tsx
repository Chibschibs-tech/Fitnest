"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check, CreditCard, Pause, RefreshCw } from "lucide-react"
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

export default function ActiveSubscription() {
  const [isPaused, setIsPaused] = useState(false)
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [pauseDuration, setPauseDuration] = useState("1-week")

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
    features: ["Customizable meals", "Nutritionist support", "Weekly menu rotation", "Pause or cancel anytime"],
  }

  const handlePauseSubscription = () => {
    setIsPaused(true)
    setShowPauseDialog(false)
  }

  const handleResumeSubscription = () => {
    setIsPaused(false)
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
        </div>
      </div>

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
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <Button variant="outline">View Plan Details</Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Calendar className="mr-2 h-4 w-4" />
            Change Plan
          </Button>
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
