import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ClipboardList, Settings, UtensilsCrossed, Sparkles, ChevronRight, ArrowRight } from "lucide-react"

const steps = [
  {
    number: 1,
    title: "Choose Your Plan",
    description: "Select a meal plan that fits your goals and dietary preferences",
    color: "from-fitnest-green to-fitnest-green/80",
    bgColor: "from-fitnest-green/10 to-fitnest-green/5",
    icon: ClipboardList,
  },
  {
    number: 2,
    title: "Customize & Order",
    description: "Personalize your meals and schedule your delivery times",
    color: "from-fitnest-orange to-orange-500",
    bgColor: "from-fitnest-orange/10 to-orange-500/5",
    icon: Settings,
  },
  {
    number: 3,
    title: "Enjoy Your Meals",
    description: "Receive fresh, ready-to-eat meals delivered to your doorstep",
    color: "from-fitnest-green to-emerald-600",
    bgColor: "from-fitnest-green/10 to-emerald-600/5",
    icon: UtensilsCrossed,
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(79,209,197,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,141,109,0.05)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-fitnest-orange/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-fitnest-orange" />
            <span className="text-sm font-semibold text-fitnest-orange">Simple Process</span>
          </div>
          <h2 className="mb-4 text-3xl md:text-5xl font-bold text-gray-900">
            How It <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Get started with Fitnest in three simple steps and transform your nutrition journey.
          </p>
        </div>
        
        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto mb-12">
          {steps.map(({ number, title, description, color, bgColor, icon: Icon }, index) => (
            <div key={number} className="relative group">
              {/* Card */}
              <div className="relative bg-white rounded-3xl p-8 text-center space-y-4 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                {/* Decorative Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bgColor} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Number Badge */}
                <div className="relative inline-flex items-center justify-center mb-2">
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-full blur-2xl opacity-30 group-hover:opacity-50 group-hover:scale-125 transition-all duration-500`} />
                  <div className={`relative h-16 w-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    {number}
                  </div>
                </div>

                {/* Icon */}
                <div className="relative flex justify-center mb-2">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${bgColor} group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="h-8 w-8 text-gray-700" strokeWidth={2} />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-fitnest-green transition-colors">
                    {title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Bottom Accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl`} />
              </div>

              {/* Connector Arrow - Hidden on mobile, not shown for last item */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-16 left-[60%] w-[80%] items-center justify-center">
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-fitnest-green/30 via-fitnest-orange/30 to-transparent" />
                  <ArrowRight className="h-5 w-5 text-fitnest-orange/50 -ml-2" strokeWidth={2.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/how-it-works">
            <Button 
              variant="outline"
              size="lg"
              className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-fitnest-orange hover:text-fitnest-orange transition-all shadow-md hover:shadow-lg px-8 py-6 rounded-xl font-semibold group/cta"
            >
              <span>Learn More About Our Process</span>
              <ChevronRight className="ml-2 h-5 w-5 group-hover/cta:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
