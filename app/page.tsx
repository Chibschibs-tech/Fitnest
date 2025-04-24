import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Healthy Meals <span className="text-green-600">Delivered</span> to Your Door
              </h1>
              <p className="text-xl mb-8 text-gray-600 max-w-lg mx-auto md:mx-0">
                Delicious and nutritious meal plans tailored to your goals. No shopping, no cooking, just eat and
                thrive.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/meal-plans">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium w-full sm:w-auto">
                    View Meal Plans
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="outline" className="px-6 py-3 rounded-lg font-medium w-full sm:w-auto">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img src="/vibrant-meal-prep.png" alt="Healthy meal preparation" className="rounded-lg shadow-xl" />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">100% Fresh Ingredients</p>
                    <p className="text-sm text-gray-500">Locally sourced when possible</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How Fitnest.ma Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Plan</h3>
              <p className="text-gray-600">
                Select from our variety of meal plans designed to meet your nutritional goals.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customize Your Meals</h3>
              <p className="text-gray-600">Tailor your meals to your preferences and dietary requirements.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Fresh Deliveries</h3>
              <p className="text-gray-600">
                Receive your freshly prepared meals directly to your door on your schedule.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/how-it-works">
              <Button variant="outline" className="px-6 py-3 rounded-lg font-medium">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Meal Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Weight Loss",
                description: "Calorie-controlled meals to help you lose weight while staying satisfied.",
                price: "349",
                image: "/vibrant-weight-loss-meal.png",
              },
              {
                title: "Balanced Nutrition",
                description: "Well-rounded meals with perfect macronutrient balance for overall health.",
                price: "399",
                image: "/vibrant-nutrition-plate.png",
              },
              {
                title: "Muscle Gain",
                description: "High-protein meals designed to support muscle growth and recovery.",
                price: "449",
                image: "/hearty-muscle-meal.png",
              },
              {
                title: "Keto",
                description: "Low-carb, high-fat meals to help maintain ketosis and burn fat.",
                price: "429",
                image: "/colorful-keto-plate.png",
              },
            ].map((plan, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={plan.image || "/placeholder.svg"} alt={plan.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">
                      {plan.price} <span className="text-sm font-normal">MAD/week</span>
                    </span>
                    <Link href="/meal-plans">
                      <Button className="bg-green-600 hover:bg-green-700">View Plan</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/meal-plans">
              <Button className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium">
                View All Meal Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
            Don't just take our word for it. Here's what our satisfied customers have to say about Fitnest.ma.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Fitnest.ma has completely transformed my eating habits. The meals are delicious and I've lost 5kg in
                just 2 months!"
              </p>
              <div>
                <p className="font-semibold">Sara L.</p>
                <p className="text-sm text-gray-500">Weight Loss Plan</p>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "As a busy professional, I don't have time to cook. Fitnest.ma delivers healthy meals that keep me
                energized throughout the day."
              </p>
              <div>
                <p className="font-semibold">Karim M.</p>
                <p className="text-sm text-gray-500">Balanced Nutrition Plan</p>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex text-yellow-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The quality and variety of meals is impressive. My fitness goals are finally within reach thanks to
                Fitnest.ma."
              </p>
              <div>
                <p className="font-semibold">Leila B.</p>
                <p className="text-sm text-gray-500">Muscle Gain Plan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Healthy Journey?</h2>
              <p className="text-lg mb-8">
                Join thousands of satisfied customers who have transformed their eating habits with Fitnest.ma.
              </p>
              <Link href="/order">
                <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                  Get Started Today
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-500/30 p-6 rounded-lg text-center">
                <p className="text-3xl font-bold mb-1">100+</p>
                <p>Meal Options</p>
              </div>
              <div className="bg-green-500/30 p-6 rounded-lg text-center">
                <p className="text-3xl font-bold mb-1">5000+</p>
                <p>Happy Customers</p>
              </div>
              <div className="bg-green-500/30 p-6 rounded-lg text-center">
                <p className="text-3xl font-bold mb-1">7</p>
                <p>Days a Week</p>
              </div>
              <div className="bg-green-500/30 p-6 rounded-lg text-center">
                <p className="text-3xl font-bold mb-1">100%</p>
                <p>Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
