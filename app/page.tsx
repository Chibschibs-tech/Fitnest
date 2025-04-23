import Link from "next/link"
import { ArrowRight, Leaf, Utensils, Calendar, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-green-100 -z-10" />
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium mb-2">
                <Leaf className="h-4 w-4 mr-1" />
                <span>Healthy Meal Plans</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                Delicious & Nutritious <span className="text-green-600">Meal Plans</span> Delivered
              </h1>
              <p className="text-gray-600 md:text-xl">
                Customized meal plans designed by nutrition experts, prepared by chefs, and delivered to your door.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  View Menu
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/vibrant-meal-prep.png"
                  alt="Healthy meal preparation"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Utensils className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Fresh Ingredients</p>
                    <p className="text-sm text-gray-500">Locally sourced</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Weekly Plans</p>
                    <p className="text-sm text-gray-500">Flexible options</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Getting started with Fitnest.ma is simple. Choose your plan, customize your meals, and enjoy healthy
              eating without the hassle.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShoppingBag className="h-10 w-10 text-green-600" />,
                title: "Choose Your Plan",
                description: "Select from our variety of meal plans designed to meet your nutritional goals.",
              },
              {
                icon: <Utensils className="h-10 w-10 text-green-600" />,
                title: "Customize Your Meals",
                description: "Personalize your weekly menu based on your preferences and dietary requirements.",
              },
              {
                icon: <Calendar className="h-10 w-10 text-green-600" />,
                title: "Enjoy Regular Deliveries",
                description: "Receive fresh, chef-prepared meals delivered to your doorstep on your schedule.",
              },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
                <div className="bg-green-100 p-4 rounded-full mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Meal Plans */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Meal Plans</h2>
              <p className="text-gray-600">Discover our most popular meal plans designed for your lifestyle</p>
            </div>
            <Link
              href="/meal-plans"
              className="mt-4 md:mt-0 inline-flex items-center text-green-600 font-medium hover:text-green-700"
            >
              View All Plans
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Weight Loss",
                calories: "1200-1500",
                price: "349",
                image: "/grilled-chicken-vegetable-medley.png",
              },
              {
                title: "Balanced Nutrition",
                calories: "1800-2000",
                price: "399",
                image: "/rainbow-grain-bowl.png",
              },
              {
                title: "Muscle Gain",
                calories: "2500-2800",
                price: "449",
                image: "/chicken-quinoa-power-bowl.png",
              },
            ].map((plan, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-md transition-transform hover:scale-105"
              >
                <div className="h-48 overflow-hidden">
                  <img src={plan.image || "/placeholder.svg"} alt={plan.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">{plan.calories} calories</span>
                    <span className="text-green-600 font-bold">{plan.price} MAD/week</span>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Select Plan</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say about Fitnest.ma.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Fitnest.ma has completely transformed my eating habits. The meals are delicious and I've lost 5kg in just 2 months!",
                name: "Sara L.",
                role: "Weight Loss Plan",
              },
              {
                quote:
                  "As a busy professional, I don't have time to cook. Fitnest.ma delivers healthy meals that keep me energized throughout the day.",
                name: "Karim M.",
                role: "Balanced Nutrition Plan",
              },
              {
                quote:
                  "The quality and variety of meals is impressive. My fitness goals are finally within reach thanks to Fitnest.ma.",
                name: "Leila B.",
                role: "Muscle Gain Plan",
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex flex-col h-full">
                  <div className="mb-4 text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 flex-grow mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Healthy Journey?</h2>
              <p className="text-green-100 mb-6">
                Join thousands of satisfied customers who have transformed their eating habits with Fitnest.ma.
              </p>
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                Get Started Today
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500 p-4 rounded-lg">
                <h3 className="font-bold text-2xl mb-1">100+</h3>
                <p className="text-green-100">Meal Options</p>
              </div>
              <div className="bg-green-500 p-4 rounded-lg">
                <h3 className="font-bold text-2xl mb-1">5000+</h3>
                <p className="text-green-100">Happy Customers</p>
              </div>
              <div className="bg-green-500 p-4 rounded-lg">
                <h3 className="font-bold text-2xl mb-1">7</h3>
                <p className="text-green-100">Days a Week</p>
              </div>
              <div className="bg-green-500 p-4 rounded-lg">
                <h3 className="font-bold text-2xl mb-1">100%</h3>
                <p className="text-green-100">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
