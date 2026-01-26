"use client"

import { useState, useEffect, useContext } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Search, Package, Calendar, Utensils, CreditCard, Eye, RefreshCw, ShoppingBag, Filter, TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthContext } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export function OrdersContent() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [mealPlans, setMealPlans] = useState<Map<string, any>>(new Map())

  // Fetch meal plans on mount
  useEffect(() => {
    async function fetchMealPlans() {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const response = await fetch(`${API_URL}/meal-plans?status=active`, {
          headers: {
            'Accept': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          const plansArray = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []
          
          // Create a map of meal plan ID to meal plan object
          const plansMap = new Map()
          plansArray.forEach((plan: any) => {
            plansMap.set(plan.id, plan)
          })
          setMealPlans(plansMap)
          console.log("Meal plans loaded:", plansMap.size)
        }
      } catch (error) {
        console.error("Error fetching meal plans:", error)
      }
    }

    fetchMealPlans()
  }, [])

  // Redirect to home if not authenticated after auth check completes
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/home")
    }
  }, [authLoading, user, router])

  useEffect(() => {
    if (!user) return // Don't fetch orders if no user

    async function fetchOrders() {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('authToken')
        if (!token) {
          console.log("No auth token found")
          setOrders([])
          setIsLoading(false)
          return
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

        const response = await fetch(`${API_URL}/orders/my`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("API Error:", errorText) // Debug log
          throw new Error(`Failed to load orders: ${response.status}`)
        }

        const data = await response.json()
        console.log("Raw orders data:", data) // Debug log

        // Handle both array and object responses
        let ordersArray = []
        if (Array.isArray(data)) {
          ordersArray = data
        } else if (data.data && Array.isArray(data.data)) {
          ordersArray = data.data
        } else if (data.orders && Array.isArray(data.orders)) {
          ordersArray = data.orders
        } else {
          console.log("Unexpected data format:", data)
          ordersArray = []
        }

        // Transform the database orders to match the expected format
        const transformedOrders = ordersArray.map((order: any) => {
          // Map status from API format to internal format
          let mappedStatus = "active"
          const apiStatus = order.status?.toLowerCase()
          if (apiStatus === "confirmed" || apiStatus === "pending" || apiStatus === "processing") {
            mappedStatus = "active"
          } else if (apiStatus === "completed" || apiStatus === "delivered") {
            mappedStatus = "completed"
          } else if (apiStatus === "cancelled" || apiStatus === "canceled") {
            mappedStatus = "cancelled"
          }

          // Count total meals from menu_selections
          const mealsCount = order.menu_selections?.reduce((count: number, day: any) => {
            let dayMeals = 0
            if (day.breakfast) dayMeals++
            if (day.lunch) dayMeals++
            if (day.dinner) dayMeals++
            if (day.snacks) dayMeals += Array.isArray(day.snacks) ? day.snacks.length : 1
            return count + dayMeals
          }, 0) || 0

          return {
            id: order.id,
            orderNumber: order.order_number || `FN${String(order.id).substring(0, 8)}`,
            date: order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : "Date inconnue",
            createdAt: order.created_at,
            status: mappedStatus,
            mealPlanId: order.meal_plan_id,
            mealPlan: order.meal_plan_id ? `Plan ${order.meal_plan_id.substring(0, 8)}...` : "Plan inconnu",
            totalAmount: order.total ? order.total.toFixed(2) : "0.00",
            deliveryDays: order.delivery_days || [],
            mealsCount: mealsCount,
          }
        })

        console.log("Transformed orders:", transformedOrders) // Debug log
        setOrders(transformedOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      } catch (error) {
        console.error("Detailed error loading orders:", error)
        // Don't set error state, just show empty orders
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  // Filter orders by search and status
  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchLower) ||
      order.mealPlan?.toLowerCase().includes(searchLower) ||
      String(order.id).toLowerCase().includes(searchLower)
    
    const matchesTab = 
      activeTab === "all" || 
      order.status === activeTab

    return matchesSearch && matchesTab
  })

  // Calculate stats
  const stats = {
    total: orders.length,
    active: orders.filter(o => o.status === "active").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
      case "completed":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0"
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "completed":
        return "Terminée"
      case "cancelled":
        return "Annulée"
      default:
        return status
    }
  }

  const getMealPlanName = (mealPlanId: string) => {
    const plan = mealPlans.get(mealPlanId)
    return plan?.name || "Plan inconnu"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-fitnest-green/20 to-green-100 flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-fitnest-green" />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="h-6 w-6 bg-fitnest-green rounded-full animate-ping opacity-75" />
              </div>
            </div>
            <p className="text-lg font-semibold text-gray-700">Chargement de vos commandes...</p>
            <p className="text-sm text-gray-500">Veuillez patienter un instant</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-700">
                <XCircle className="h-5 w-5" />
                <p className="font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // This check is redundant now since we redirect in useEffect, but keep for safety
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="mb-10 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                <span className="bg-gradient-to-r from-fitnest-green to-green-600 bg-clip-text text-transparent">
                  Mes Commandes
                </span>
              </h1>
              <p className="text-lg text-gray-600">Suivez et gérez toutes vos commandes de plans repas</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="lg"
                className="rounded-xl border-2 hover:border-fitnest-green hover:text-fitnest-green transition-all duration-300"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Link href="/meal-plans">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-fitnest-green to-green-600 hover:from-green-600 hover:to-fitnest-green text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Nouvelle Commande
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="rounded-2xl border-2 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Commandes</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-1">Actives</p>
                    <p className="text-3xl font-bold text-green-900">{stats.active}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 mb-1">Terminées</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.completed}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-2 hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700 mb-1">Annulées</p>
                    <p className="text-3xl font-bold text-red-900">{stats.cancelled}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 rounded-2xl border-2 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Rechercher par numéro de commande, plan repas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-2 focus:border-fitnest-green transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="h-4 w-4" />
                <span className="font-medium">{filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} trouvée{filteredOrders.length > 1 ? 's' : ''}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Status Filter */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 h-14 rounded-2xl p-2 bg-gray-100">
            <TabsTrigger 
              value="all" 
              className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md font-semibold text-base"
            >
              Toutes
            </TabsTrigger>
            <TabsTrigger 
              value="active"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-base"
            >
              Actives
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-base"
            >
              Terminées
            </TabsTrigger>
            <TabsTrigger 
              value="cancelled"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-rose-500 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-base"
            >
              Annulées
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredOrders.map((order, index) => (
                  <Card 
                    key={order.id}
                    className="rounded-3xl border-2 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group animate-in fade-in-up duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b-2">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-fitnest-green to-green-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Package className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold text-gray-900">
                                #{order.orderNumber}
                              </h3>
                              <Badge className={`${getStatusColor(order.status)} px-3 py-1 text-sm font-bold shadow-md flex items-center gap-1.5`}>
                                {getStatusIcon(order.status)}
                                {getStatusLabel(order.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Commandé le {order.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Link href={`/orders/${order.id}`}>
                            <Button 
                              variant="outline" 
                              className="rounded-xl border-2 hover:border-fitnest-green hover:bg-fitnest-green hover:text-white transition-all duration-300"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir Détails
                            </Button>
                          </Link>
                          {order.status === "completed" && (
                            <Button 
                              className="bg-gradient-to-r from-fitnest-green to-green-600 hover:from-green-600 hover:to-fitnest-green text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Recommander
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
                          <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                            <Utensils className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Plan Repas</p>
                            <p className="font-bold text-gray-900">{getMealPlanName(order.mealPlanId)}</p>
                            {order.mealsCount > 0 && (
                              <p className="text-xs text-gray-600 mt-1">{order.mealsCount} repas</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50">
                          <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                            <CreditCard className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Montant Total</p>
                            <p className="font-bold text-2xl text-gray-900">{order.totalAmount} <span className="text-sm">MAD</span></p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50">
                          <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                            <Calendar className="h-5 w-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide mb-1">Livraisons</p>
                            <p className="font-bold text-gray-900">
                              {order.deliveryDays && order.deliveryDays.length > 0 
                                ? `${order.deliveryDays.length} programmée${order.deliveryDays.length > 1 ? 's' : ''}` 
                                : "Aucune livraison"}
                            </p>
                            {order.deliveryDays && order.deliveryDays.length > 0 && (
                              <p className="text-xs text-gray-600 mt-1">
                                Prochaine: {format(new Date(order.deliveryDays[0]), 'dd MMM')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="rounded-3xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white">
                <CardContent className="py-16 text-center">
                  <div className="mx-auto mb-6 h-24 w-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {searchQuery || activeTab !== "all" 
                      ? "Aucune commande trouvée" 
                      : "Aucune commande pour le moment"}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                    {searchQuery 
                      ? "Essayez d'ajuster vos termes de recherche ou filtres"
                      : activeTab !== "all"
                        ? `Vous n'avez aucune commande ${activeTab === "active" ? "active" : activeTab === "completed" ? "terminée" : "annulée"} pour le moment`
                        : "Commencez votre parcours fitness en commandant votre premier plan repas dès aujourd'hui !"}
                  </p>
                  <div className="flex gap-4 justify-center">
                    {(searchQuery || activeTab !== "all") && (
                      <Button 
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setSearchQuery("")
                          setActiveTab("all")
                        }}
                        className="rounded-xl border-2"
                      >
                        Effacer les Filtres
                      </Button>
                    )}
                    <Link href="/meal-plans">
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-fitnest-green to-green-600 hover:from-green-600 hover:to-fitnest-green text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                      >
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        <span>Parcourir les Plans Repas</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
