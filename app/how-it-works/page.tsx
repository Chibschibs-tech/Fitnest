import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">How Fitnest Works</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                1
              </div>
              Choose Your Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Select from our variety of meal plans designed to meet your specific health and fitness goals.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                2
              </div>
              Customize Your Meals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Personalize your weekly menu based on your dietary preferences, restrictions, and taste preferences.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                3
              </div>
              Receive Fresh Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We prepare and deliver your meals fresh to your doorstep according to your selected schedule.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Commitment to Quality</h2>
        <p className="mb-4">
          At Fitnest, we're committed to providing the highest quality meals made with fresh, locally-sourced
          ingredients. Our professional chefs prepare each meal with care, ensuring both nutritional value and delicious
          taste.
        </p>
        <p>
          All meals are prepared in our state-of-the-art kitchen facility, following strict food safety protocols. We
          use environmentally friendly packaging to minimize our ecological footprint.
        </p>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Your Healthy Journey?</h2>
        <a
          href="/meal-plans"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Explore Our Meal Plans
        </a>
      </div>
    </div>
  )
}
