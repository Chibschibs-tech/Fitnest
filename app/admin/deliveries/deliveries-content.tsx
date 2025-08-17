"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, MapPin, Clock, Users, Calendar, Route } from "lucide-react"

export function DeliveriesContent() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Delivery Management</h1>
        <p className="text-gray-600">Plan and manage meal deliveries across Morocco</p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="mb-8 border-dashed border-2 border-gray-300">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Delivery Management Coming Soon</CardTitle>
          <CardDescription className="text-lg">
            Advanced delivery planning and management features are in development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              This section will include comprehensive delivery management tools to optimize your operations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Planned Features */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Route className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Route Optimization</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Automatically optimize delivery routes to minimize travel time and fuel costs across Casablanca, Rabat,
              and other cities.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <CardTitle className="text-lg">Delivery Scheduling</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Schedule deliveries based on customer preferences, subscription timing, and delivery capacity.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg">Real-time Tracking</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Track delivery progress in real-time and provide customers with accurate delivery estimates.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Driver Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Manage delivery drivers, assign routes, and track performance metrics.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Time Slot Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Offer customers flexible delivery time slots and manage capacity for each time window.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg">Fleet Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Monitor vehicle status, maintenance schedules, and optimize fleet utilization.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Development Timeline */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Development Roadmap</CardTitle>
          <CardDescription>Planned features and timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div>
                <p className="font-medium">Phase 1: Basic Delivery Tracking</p>
                <p className="text-sm text-gray-600">Manual delivery assignment and status updates</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-medium">Phase 2: Route Optimization</p>
                <p className="text-sm text-gray-600">Automated route planning and optimization</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <div>
                <p className="font-medium">Phase 3: Real-time Tracking</p>
                <p className="text-sm text-gray-600">GPS tracking and customer notifications</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
