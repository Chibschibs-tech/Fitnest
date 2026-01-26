"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { 
  CheckCircle2, 
  Package, 
  Home, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Confetti effect
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      // Since particles fall down, start a bit higher than random
      if (typeof window !== 'undefined' && (window as any).confetti) {
        (window as any).confetti(
          Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
          })
        );
        (window as any).confetti(
          Object.assign({}, defaults, { 
            particleCount, 
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
          })
        );
      }
    }, 250)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Fetch order details
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('authToken')
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
        const response = await fetch(`${API_BASE}/orders/${orderId}`, {
          cache: 'no-store',
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        })

        if (response.ok) {
          const data = await response.json()
          setOrderDetails(data.data || data)
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (orderId) {
      fetchOrderDetails()
    } else {
      setIsLoading(false)
    }
  }, [orderId])

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="rounded-3xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 shadow-xl">
          <CardContent className="pt-8 pb-8 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">⚠️</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Order Not Found</h3>
              <p className="text-red-600 font-medium">No order ID found. Please check your email for order confirmation.</p>
            </div>
            <Button 
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-fitnest-green to-green-600 hover:from-green-600 hover:to-fitnest-green text-white font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <Home className="h-5 w-5 mr-2" />
              <span>Go Home</span>
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      {/* Success Header */}
      <div className="text-center mb-10 animate-in fade-in duration-500">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="rounded-full bg-green-100 p-8 animate-in zoom-in duration-300 shadow-xl">
              <CheckCircle2 className="h-24 w-24 text-fitnest-green" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="h-8 w-8 bg-fitnest-green rounded-full animate-ping opacity-75" />
              <div className="absolute top-0 right-0 h-8 w-8 bg-fitnest-green rounded-full" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-fitnest-green to-green-600 bg-clip-text text-transparent">
            Order Confirmed!
          </span>
          <span className="ml-3">🎉</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Thank you for your order! We've sent a <span className="font-semibold text-fitnest-green">confirmation email</span> with all the details.
        </p>
      </div>

      {/* Order ID Badge */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 mb-10 text-center shadow-xl">
        <p className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Order Number</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-fitnest-green to-green-600 bg-clip-text text-transparent font-mono">
            #{orderDetails?.order_number}
          </p>
          <Badge className="bg-gradient-to-r from-fitnest-green to-green-600 hover:from-green-600 hover:to-fitnest-green text-white border-0 px-4 py-2 text-sm font-bold shadow-lg">
            {orderDetails?.status.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mt-4 font-medium">
          💾 Please save this number for your records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* What's Next */}
          <Card className="rounded-3xl border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-fitnest-green/10 to-green-100 rounded-xl">
                  <Package className="h-6 w-6 text-fitnest-green" />
                </div>
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="group flex gap-5 p-4 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Meal Preparation</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Our <span className="font-semibold text-fitnest-green">expert chefs</span> will start preparing your customized meals with fresh, high-quality ingredients.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-fitnest-orange" />
              </div>

              <div className="group flex gap-5 p-4 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-amber-50 transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-fitnest-orange to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-2 text-gray-900">Delivery</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Your meals will be delivered <span className="font-semibold text-fitnest-orange">fresh</span> on your selected dates. You'll receive a notification before each delivery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Schedule */}
          {orderDetails?.delivery_days && orderDetails.delivery_days.length > 0 && (
            <Card className="rounded-3xl border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-fitnest-green/10 to-green-100 rounded-xl">
                    <Calendar className="h-6 w-6 text-fitnest-green" />
                  </div>
                  Delivery Schedule
                </CardTitle>
                <CardDescription className="text-base">
                  Your meals will be delivered on these dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {orderDetails.delivery_days.map((day: string, index: number) => (
                    <div 
                      key={day}
                      className="group flex items-center gap-4 p-4 rounded-2xl border-2 bg-gradient-to-br from-white to-gray-50 hover:from-fitnest-green/5 hover:to-green-50 hover:border-fitnest-green/30 hover:shadow-md transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fitnest-green to-green-600 text-white flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base text-gray-900 group-hover:text-fitnest-green transition-colors">
                          {format(new Date(day), 'EEEE')}
                        </p>
                        <p className="text-sm text-gray-600 font-medium">
                          {format(new Date(day), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact & Address */}
          {orderDetails && (
            <Card className="rounded-3xl border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact */}
                  <div className="space-y-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                    <h4 className="font-bold text-base flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      Contact Details
                    </h4>
                    <div className="space-y-3 text-sm pl-2">
                      <p className="text-gray-900 font-semibold">{orderDetails.client_info.name}</p>
                      <p className="text-gray-700 break-all">{orderDetails.client_info.email}</p>
                      <p className="text-gray-700 flex items-center gap-2 font-medium">
                        <Phone className="h-4 w-4 text-blue-600" />
                        {orderDetails.client_info.phone}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-4 p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                    <h4 className="font-bold text-base flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <MapPin className="h-5 w-5 text-fitnest-green" />
                      </div>
                      Delivery Address
                    </h4>
                    <div className="space-y-1 text-sm text-gray-700 pl-2 leading-relaxed">
                      <p className="font-semibold">{orderDetails.delivery_address?.street}</p>
                      <p>{orderDetails.delivery_address?.city}, {orderDetails.delivery_address?.state}</p>
                      <p>{orderDetails.delivery_address?.zip_code}, {orderDetails.delivery_address?.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Help Card */}
          <Card className="rounded-3xl border-2 border-blue-200 bg-blue-50/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <span>💬</span>
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 font-medium leading-relaxed">
                Our support team is here to help you with any questions.
              </p>
              <div className="space-y-3">
                <a 
                  href="mailto:support@fitness.ma" 
                  className="group flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                    support@fitness.ma
                  </span>
                </a>
                <a 
                  href="tel:+212123456789" 
                  className="group flex items-center gap-3 p-3 rounded-xl bg-white border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                    +212 123 456 789
                  </span>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Continue Shopping */}
          <Card className="rounded-3xl border-2 border-fitnest-green bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="pt-8">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-fitnest-green to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-bold text-xl text-gray-900">Want More?</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Explore our other meal plans and customize your nutrition journey.
                </p>
                <Button 
                  className="w-full bg-gradient-to-r from-fitnest-green to-green-600 hover:from-green-600 hover:to-fitnest-green text-white font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group border-0"
                  onClick={() => router.push('/meal-plans')}
                >
                  <span>Browse Meal Plans</span>
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="rounded-3xl border-2 shadow-xl">
          <CardContent className="pt-12 pb-12 text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-fitnest-green/20 to-green-100 rounded-2xl flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-fitnest-green border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-gray-700 font-semibold text-lg">Loading order details...</p>
            <p className="text-sm text-gray-500">Please wait while we fetch your order information</p>
          </CardContent>
        </Card>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
