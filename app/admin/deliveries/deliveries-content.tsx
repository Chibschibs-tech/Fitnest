"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Truck, Calendar, MapPin, Clock, Info } from "lucide-react"

export function DeliveriesContent() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Delivery Management</h1>
        <p className="text-gray-600">Plan and manage meal deliveries</p>
      </div>

      {/* Coming Soon Alert */}
      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Coming Soon:</strong> This delivery management system is currently under development. It will include
          route planning, delivery scheduling, driver assignment, and real-time tracking features.
        </AlertDescription>
      </Alert>

      {/* Placeholder Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Deliveries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Routes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Planned Features</CardTitle>
          <CardDescription>The delivery management system will include the following features:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Truck className="h-4 w-4 mr-2 text-green-600" />
                Route Optimization
              </h4>
              <p className="text-sm text-gray-600">
                Automatically optimize delivery routes for efficiency and cost reduction.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                Delivery Scheduling
              </h4>
              <p className="text-sm text-gray-600">
                Schedule deliveries based on customer preferences and availability.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-purple-600" />
                Real-time Tracking
              </h4>
              <p className="text-sm text-gray-600">Track deliveries in real-time and provide updates to customers.</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-600" />
                Driver Management
              </h4>
              <p className="text-sm text-gray-600">Assign drivers to routes and manage delivery team schedules.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
