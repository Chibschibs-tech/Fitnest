import Link from "next/link"
import { CheckCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrderConfirmationPage() {
  // In a real application, you would fetch the order details from the server
  const orderNumber = "FN" + Math.floor(10000 + Math.random() * 90000)
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 2)

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 max-w-3xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-gray-600">Thank you for your order. We're preparing your customized meal plan.</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
          <CardDescription>Your order has been successfully placed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Order Number</div>
              <div className="font-medium">{orderNumber}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Order Date</div>
              <div className="font-medium">{new Date().toLocaleDateString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">First Delivery Date</div>
              <div className="font-medium">{deliveryDate.toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Delivery Time</div>
              <div className="font-medium">Morning (8AM - 12PM)</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500">Delivery Address</div>
            <div className="font-medium">123 Example Street, Casablanca, Morocco</div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span>Weight Loss Plan (5 days)</span>
              <span>349 MAD</span>
            </div>
            <div className="flex justify-between mb-2 text-sm text-gray-500">
              <span>Customization</span>
              <span>+50 MAD</span>
            </div>
            <div className="flex justify-between mb-2 text-sm text-gray-500">
              <span>Delivery Fee</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>399 MAD</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8 bg-green-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Calendar className="h-6 w-6 text-green-600 mt-1" />
            <div>
              <h3 className="font-medium mb-1">What's Next?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Your first delivery is scheduled for {deliveryDate.toLocaleDateString()}. Here's what to expect:
              </p>
              <ol className="space-y-2 text-sm text-gray-600 list-decimal pl-4">
                <li>You'll receive a confirmation email with your order details.</li>
                <li>Our chefs will prepare your meals fresh according to your preferences.</li>
                <li>You'll get a text message on the delivery day with tracking information.</li>
                <li>Enjoy your delicious, nutritious meals!</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Thank you for choosing Fitnest.ma!</h2>
        <p className="text-gray-600">
          If you have any questions about your order, please contact our customer support.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link href="/dashboard">
            <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">Go to My Account</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
