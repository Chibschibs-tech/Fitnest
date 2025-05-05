import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Updated to fill viewport height */}
      <section className="bg-gradient-to-r from-logo-green to-logo-green/80 text-white min-h-[calc(100vh-73px)] flex items-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Healthy Meals <span className="text-white">Delivered</span> To Your Door
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200">
            Custom meal plans designed for your fitness goals. Fresh ingredients, chef-prepared, and delivered to you.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link href="/meal-plans">
              <Button className="bg-gray-800 text-white hover:bg-gray-700">View Meal Plans</Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" className="border-white text-white hover:bg-white/20">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Meal Plans Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center text-3xl font-bold">Our Meal Plans</h2>
          <p className="mb-12 text-center text-gray-600 max-w-2xl mx-auto">
            Choose from our selection of chef-prepared meal plans designed to meet your specific health and fitness
            goals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Weight Loss Plan */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="relative h-48">
                <Image src="/vibrant-weight-loss-meal.png" alt="Weight Loss Meal Plan" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Weight Loss Plan</h3>
                <p className="text-gray-600 mb-4">
                  Calorie-controlled meals designed to help you lose weight while staying satisfied.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-logo-green font-bold">From 350 MAD/week</span>
                  <Link href="/meal-plans/weight-loss">
                    <Button size="sm" className="bg-logo-green hover:bg-logo-green/90 text-white">
                      View Plan
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Muscle Gain Plan */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="relative h-48">
                <Image src="/hearty-muscle-meal.png" alt="Muscle Gain Meal Plan" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Muscle Gain Plan</h3>
                <p className="text-gray-600 mb-4">
                  Protein-rich meals to support muscle growth and recovery after workouts.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-logo-green font-bold">From 400 MAD/week</span>
                  <Link href="/meal-plans/muscle-gain">
                    <Button size="sm" className="bg-logo-green hover:bg-logo-green/90 text-white">
                      View Plan
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Keto Plan */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="relative h-48">
                <Image src="/colorful-keto-plate.png" alt="Keto Meal Plan" fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Keto Plan</h3>
                <p className="text-gray-600 mb-4">
                  Low-carb, high-fat meals designed to help you achieve and maintain ketosis.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-logo-green font-bold">From 380 MAD/week</span>
                  <Link href="/meal-plans/keto">
                    <Button size="sm" className="bg-logo-green hover:bg-logo-green/90 text-white">
                      View Plan
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/meal-plans">
              <Button
                variant="outline"
                className="border-logo-green text-logo-green hover:bg-gray-100 hover:text-logo-green"
              >
                View All Meal Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Fitnest.ma</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg p-6 text-center shadow-lg bg-gray-50">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-logo-green/10 text-logo-green">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Customized Meal Plans</h3>
              <p className="text-gray-600">
                Personalized meal plans tailored to your dietary preferences and fitness goals.
              </p>
            </div>
            <div className="rounded-lg p-6 text-center shadow-lg bg-gray-50">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-logo-green/10 text-logo-green">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fresh & Convenient</h3>
              <p className="text-gray-600">Fresh ingredients, chef-prepared meals delivered right to your doorstep.</p>
            </div>
            <div className="rounded-lg p-6 text-center shadow-lg bg-gray-50">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-logo-green/10 text-logo-green">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Track Your Progress</h3>
              <p className="text-gray-600">
                Monitor your nutrition and fitness progress with our easy-to-use dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">What Our Customers Say</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                  <Image src="/diverse-group-city.png" alt="Customer" width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah M.</h4>
                  <p className="text-sm text-gray-600">Weight Loss Plan</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I've lost 10kg in 3 months with Fitnest.ma's weight loss plan. The meals are delicious and I never feel
                like I'm on a diet!"
              </p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                  <Image src="/contemplative-man.png" alt="Customer" width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-semibold">Ahmed K.</h4>
                  <p className="text-sm text-gray-600">Muscle Gain Plan</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The muscle gain plan has been a game-changer for my fitness journey. High protein, tasty meals that
                help me recover after workouts."
              </p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 flex items-center">
                <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                  <Image src="/contemplative-artist.png" alt="Customer" width={48} height={48} />
                </div>
                <div>
                  <h4 className="font-semibold">Leila T.</h4>
                  <p className="text-sm text-gray-600">Keto Plan</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The keto meals are amazing! I've been on the plan for 2 months and have more energy than ever. The
                variety keeps me from getting bored."
              </p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center text-3xl font-bold">Latest from Our Blog</h2>
          <p className="mb-12 text-center text-gray-600 max-w-2xl mx-auto">
            Expert advice on nutrition, fitness, and healthy living to help you achieve your wellness goals.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg">
              <div className="relative h-48">
                <Image src="/placeholder.svg?key=gzu7y" alt="Meal Prep Tips" fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-logo-green/10 text-logo-green rounded-full">
                    Meal Prep
                  </span>
                  <span className="text-xs text-gray-500">5 min read</span>
                </div>
                <h3 className="text-xl font-bold mb-2">10 Healthy Meal Prep Tips for Busy Professionals</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Learn how to efficiently prepare nutritious meals for the entire week, even with a busy schedule.
                </p>
                <Link href="/blog/healthy-meal-prep">
                  <Button
                    variant="outline"
                    className="w-full border-logo-green text-logo-green hover:bg-logo-green hover:text-white"
                  >
                    Read More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Blog Post 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg">
              <div className="relative h-48">
                <Image src="/placeholder.svg?key=ym4id" alt="Nutrition Myths" fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-logo-green/10 text-logo-green rounded-full">
                    Nutrition
                  </span>
                  <span className="text-xs text-gray-500">7 min read</span>
                </div>
                <h3 className="text-xl font-bold mb-2">5 Common Nutrition Myths Debunked</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Separating fact from fiction: nutrition experts weigh in on popular diet claims and misconceptions.
                </p>
                <Link href="/blog/nutrition-myths">
                  <Button
                    variant="outline"
                    className="w-full border-logo-green text-logo-green hover:bg-logo-green hover:text-white"
                  >
                    Read More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Blog Post 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md transition-transform hover:shadow-lg">
              <div className="relative h-48">
                <Image src="/placeholder.svg?key=btq9k" alt="Weight Loss Plateau" fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold px-2 py-1 bg-logo-green/10 text-logo-green rounded-full">
                    Fitness
                  </span>
                  <span className="text-xs text-gray-500">8 min read</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Breaking Through a Weight Loss Plateau</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  Effective strategies to overcome stalled progress and continue your weight loss journey.
                </p>
                <Link href="/blog/weight-loss-plateau">
                  <Button
                    variant="outline"
                    className="w-full border-logo-green text-logo-green hover:bg-logo-green hover:text-white"
                  >
                    Read More
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-logo-green text-logo-green hover:bg-logo-green hover:text-white"
              >
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-logo-green py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Start Your Fitness Journey?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg">
            Join thousands of satisfied customers who have transformed their eating habits and achieved their fitness
            goals.
          </p>
          <Link href="/register">
            <Button className="bg-gray-800 text-white hover:bg-gray-700">Get Started Today</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
