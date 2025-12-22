import Link from "next/link"
import { Button } from "@/components/ui/button"

const steps = [
  {
    number: 1,
    title: "Choose Your Plan",
    description: "Select a meal plan that fits your goals and dietary preferences",
    color: "fitnest-green",
  },
  {
    number: 2,
    title: "Customize & Order",
    description: "Personalize your meals and schedule your delivery times",
    color: "fitnest-orange",
  },
  {
    number: 3,
    title: "Enjoy Your Meals",
    description: "Receive fresh, ready-to-eat meals delivered to your doorstep",
    color: "fitnest-green",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4 text-4xl md:text-5xl font-bold">How It Works</h2>
          <p className="text-lg text-gray-600">
            Get started with Fitnest in three simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {steps.map(({ number, title, description, color }, index) => (
            <div key={number} className="relative group">
              <div className="text-center space-y-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className={`absolute inset-0 bg-${color}/20 rounded-full blur-xl group-hover:bg-${color}/30 transition-all`} />
                  <div className={`relative h-20 w-20 rounded-full bg-gradient-to-br from-${color} to-${color}/80 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                    {number}
                  </div>
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
              {/* Connector Line - Hidden on mobile, not shown for last item */}
              {index < steps.length - 1 && (
                <div className={`hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-${color}/30 to-transparent`} />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/how-it-works">
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-fitnest-green text-fitnest-green hover:bg-fitnest-green hover:text-white transition-all px-8"
            >
              Learn More About Our Process
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
