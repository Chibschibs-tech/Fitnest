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
  Download,
  Share2,
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
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fitness.ma/api'
        const response = await fetch(`${API_BASE}/orders/${orderId}`, {
          cache: 'no-store',
          headers: { 'Accept': 'application/json' },
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
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border-red-200">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600">No order ID found. Please check your email for order confirmation.</p>
            <Button 
              onClick={() => router.push('/')}
              className="mt-4"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      {/* Success Header */}
      <div className="text-center mb-8 animate-in fade-in duration-500">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="rounded-full bg-green-100 p-8 animate-in zoom-in duration-300">
              <CheckCircle2 className="h-20 w-20 text-green-600" />
            </div>
            <div className="absolute -top-1 -right-1">
              <div className="h-6 w-6 bg-green-600 rounded-full animate-ping" />
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Order Confirmed! 🎉
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Thank you for your order! We've sent a confirmation email with all the details.
        </p>
      </div>

      {/* Order ID Badge */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-8 text-center">
        <p className="text-sm text-gray-600 mb-2">Order Number</p>
        <div className="flex items-center justify-center gap-3">
          <p className="text-3xl font-bold text-gray-900 font-mono">
            #{orderDetails.order_number}
          </p>
          <Badge className="bg-green-600 hover:bg-green-700">{orderDetails.status.toUpperCase()}</Badge>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Please save this number for your records
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* What's Next */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-fitnest-green" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Meal Preparation</h4>
                  <p className="text-sm text-gray-600">
                    Our chefs will start preparing your customized meals with fresh, high-quality ingredients.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Delivery</h4>
                  <p className="text-sm text-gray-600">
                    Your meals will be delivered fresh on your selected dates. You'll receive a notification before each delivery.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Schedule */}
          {orderDetails?.delivery_days && orderDetails.delivery_days.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-fitnest-green" />
                  Delivery Schedule
                </CardTitle>
                <CardDescription>
                  Your meals will be delivered on these dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {orderDetails.delivery_days.map((day: string, index: number) => (
                    <div 
                      key={day}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-fitnest-green text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {format(new Date(day), 'EEEE')}
                        </p>
                        <p className="text-xs text-gray-600">
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
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      Contact Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">{orderDetails.client_info.name}</p>
                      <p className="text-gray-600">{orderDetails.client_info.email}</p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {orderDetails.client_info.phone}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      Delivery Address
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{orderDetails.delivery_address?.street}</p>
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
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-gray-700">
                Our support team is here to help you with any questions.
              </p>
              <div className="space-y-2">
                <a 
                  href="mailto:support@fitness.ma" 
                  className="flex items-center gap-2 text-fitnest-green hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  support@fitness.ma
                </a>
                <a 
                  href="tel:+212123456789" 
                  className="flex items-center gap-2 text-fitnest-green hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  +212 123 456 789
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Continue Shopping */}
          <Card className="border-fitnest-green bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <Package className="h-10 w-10 text-fitnest-green mx-auto" />
                <h4 className="font-semibold">Want More?</h4>
                <p className="text-sm text-gray-600">
                  Explore our other meal plans and customize your nutrition journey.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-fitnest-green text-fitnest-green hover:bg-fitnest-green hover:text-white"
                  onClick={() => router.push('/meal-plans')}
                >
                  Browse Meal Plans
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">Loading order details...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
