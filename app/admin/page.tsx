import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  Users,
  ShoppingBag,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Utensils,
} from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>Download Report</Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="meals">Meal Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,500 MAD</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+48</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Meals Delivered</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+720</div>
                  <p className="text-xs text-muted-foreground">+19% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Retention</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Weekly Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center text-gray-400">
                    [Order Chart Visualization]
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Last 5 orders placed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: "#4532",
                        customer: "Sara Lahrichi",
                        plan: "Weight Loss",
                        status: "Delivered",
                        date: "2 hours ago",
                      },
                      {
                        id: "#4531",
                        customer: "Karim Mansouri",
                        plan: "Muscle Gain",
                        status: "Processing",
                        date: "5 hours ago",
                      },
                      {
                        id: "#4530",
                        customer: "Leila Bennani",
                        plan: "Balanced",
                        status: "Delivered",
                        date: "1 day ago",
                      },
                      { id: "#4529", customer: "Omar Alaoui", plan: "Keto", status: "Delivered", date: "1 day ago" },
                      {
                        id: "#4528",
                        customer: "Yasmine Tazi",
                        plan: "Weight Loss",
                        status: "Delivered",
                        date: "2 days ago",
                      },
                    ].map((order) => (
                      <div key={order.id} className="flex items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{order.customer}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.plan} Plan - {order.id}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          {order.status === "Delivered" ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle2 className="mr-1 h-4 w-4" />
                              {order.status}
                            </span>
                          ) : (
                            <span className="flex items-center text-orange-500">
                              <Clock className="mr-1 h-4 w-4" />
                              {order.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Meal Plans</CardTitle>
                  <CardDescription>Most subscribed plans this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Weight Loss", percentage: 38 },
                      { name: "Balanced Nutrition", percentage: 27 },
                      { name: "Muscle Gain", percentage: 21 },
                      { name: "Keto", percentage: 14 },
                    ].map((plan) => (
                      <div key={plan.name} className="flex items-center">
                        <div className="w-full">
                          <p className="text-sm font-medium leading-none mb-1">{plan.name}</p>
                          <div className="h-2 w-full rounded-full bg-gray-100">
                            <div className="h-2 rounded-full bg-green-600" style={{ width: `${plan.percentage}%` }} />
                          </div>
                        </div>
                        <span className="ml-2 text-sm font-medium">{plan.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Delivery Schedule</CardTitle>
                  <CardDescription>Upcoming deliveries for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "08:00 - 10:00", count: 12, area: "Maarif" },
                      { time: "10:00 - 12:00", count: 18, area: "Anfa" },
                      { time: "12:00 - 14:00", count: 8, area: "Gauthier" },
                      { time: "14:00 - 16:00", count: 15, area: "Ain Diab" },
                    ].map((slot, index) => (
                      <div key={index} className="flex items-center">
                        <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{slot.time}</p>
                          <p className="text-sm text-muted-foreground">
                            {slot.count} deliveries in {slot.area}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>Current stock levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { item: "Chicken Breast", status: "In Stock", quantity: "15 kg" },
                      { item: "Quinoa", status: "In Stock", quantity: "8 kg" },
                      { item: "Sweet Potatoes", status: "Low Stock", quantity: "3 kg" },
                      { item: "Avocados", status: "Out of Stock", quantity: "0 kg" },
                      { item: "Salmon", status: "In Stock", quantity: "10 kg" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <Utensils className="h-4 w-4 text-muted-foreground mr-2" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{item.item}</p>
                          <p className="text-sm text-muted-foreground">{item.quantity}</p>
                        </div>
                        <div className="ml-auto">
                          {item.status === "In Stock" ? (
                            <span className="text-green-600 text-sm font-medium">{item.status}</span>
                          ) : item.status === "Low Stock" ? (
                            <span className="text-orange-500 text-sm font-medium">{item.status}</span>
                          ) : (
                            <span className="text-red-600 text-sm font-medium">{item.status}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Manage and track customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 border-b px-4 py-3 font-medium">
                    <div>Order ID</div>
                    <div>Customer</div>
                    <div>Plan</div>
                    <div>Date</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {[
                    {
                      id: "#4532",
                      customer: "Sara Lahrichi",
                      plan: "Weight Loss",
                      date: "2023-04-22",
                      status: "Delivered",
                    },
                    {
                      id: "#4531",
                      customer: "Karim Mansouri",
                      plan: "Muscle Gain",
                      date: "2023-04-22",
                      status: "Processing",
                    },
                    {
                      id: "#4530",
                      customer: "Leila Bennani",
                      plan: "Balanced",
                      date: "2023-04-21",
                      status: "Delivered",
                    },
                    { id: "#4529", customer: "Omar Alaoui", plan: "Keto", date: "2023-04-21", status: "Delivered" },
                    {
                      id: "#4528",
                      customer: "Yasmine Tazi",
                      plan: "Weight Loss",
                      date: "2023-04-20",
                      status: "Delivered",
                    },
                    {
                      id: "#4527",
                      customer: "Mehdi Benjelloun",
                      plan: "Muscle Gain",
                      date: "2023-04-20",
                      status: "Cancelled",
                    },
                    {
                      id: "#4526",
                      customer: "Fatima Zahra",
                      plan: "Balanced",
                      date: "2023-04-19",
                      status: "Delivered",
                    },
                    { id: "#4525", customer: "Hassan Berrada", plan: "Keto", date: "2023-04-19", status: "Delivered" },
                  ].map((order) => (
                    <div key={order.id} className="grid grid-cols-6 items-center px-4 py-3 border-b last:border-0">
                      <div>{order.id}</div>
                      <div>{order.customer}</div>
                      <div>{order.plan}</div>
                      <div>{order.date}</div>
                      <div>
                        {order.status === "Delivered" ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {order.status}
                          </span>
                        ) : order.status === "Processing" ? (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            <Clock className="mr-1 h-3 w-3" />
                            {order.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            <XCircle className="mr-1 h-3 w-3" />
                            {order.status}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>View and manage customer information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
                    <div>Name</div>
                    <div>Email</div>
                    <div>Plan</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {[
                    { name: "Sara Lahrichi", email: "sara@example.com", plan: "Weight Loss", status: "Active" },
                    { name: "Karim Mansouri", email: "karim@example.com", plan: "Muscle Gain", status: "Active" },
                    { name: "Leila Bennani", email: "leila@example.com", plan: "Balanced", status: "Active" },
                    { name: "Omar Alaoui", email: "omar@example.com", plan: "Keto", status: "Active" },
                    { name: "Yasmine Tazi", email: "yasmine@example.com", plan: "Weight Loss", status: "Active" },
                    { name: "Mehdi Benjelloun", email: "mehdi@example.com", plan: "Muscle Gain", status: "Inactive" },
                    { name: "Fatima Zahra", email: "fatima@example.com", plan: "Balanced", status: "Active" },
                    { name: "Hassan Berrada", email: "hassan@example.com", plan: "Keto", status: "Active" },
                  ].map((customer, index) => (
                    <div key={index} className="grid grid-cols-5 items-center px-4 py-3 border-b last:border-0">
                      <div>{customer.name}</div>
                      <div>{customer.email}</div>
                      <div>{customer.plan}</div>
                      <div>
                        {customer.status === "Active" ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {customer.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            {customer.status}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Meal Plan Management</CardTitle>
                <CardDescription>Manage meal plans and menus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 border-b px-4 py-3 font-medium">
                    <div>Plan Name</div>
                    <div>Calories</div>
                    <div>Price</div>
                    <div>Status</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {[
                    { name: "Weight Loss", calories: "1200-1500", price: "349 MAD", status: "Active" },
                    { name: "Balanced Nutrition", calories: "1800-2000", price: "399 MAD", status: "Active" },
                    { name: "Muscle Gain", calories: "2500-2800", price: "449 MAD", status: "Active" },
                    { name: "Keto", calories: "1600-1800", price: "429 MAD", status: "Active" },
                    { name: "Vegetarian", calories: "1600-1800", price: "379 MAD", status: "Coming Soon" },
                    { name: "Vegan", calories: "1600-1800", price: "399 MAD", status: "Coming Soon" },
                  ].map((plan, index) => (
                    <div key={index} className="grid grid-cols-5 items-center px-4 py-3 border-b last:border-0">
                      <div>{plan.name}</div>
                      <div>{plan.calories}</div>
                      <div>{plan.price}</div>
                      <div>
                        {plan.status === "Active" ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {plan.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {plan.status}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
