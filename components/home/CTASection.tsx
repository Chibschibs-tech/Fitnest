import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Check } from "lucide-react"

const benefits = [
  "No commitment",
  "Cancel anytime",
  "Free delivery",
]

export function CTASection() {
  return (
    <section className="relative bg-gradient-to-br from-fitnest-green via-fitnest-green to-fitnest-green/90 py-24 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fitnest-orange rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Ready to Transform Your Lifestyle?
          </h2>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join 1000+ happy customers who have transformed their lives through healthy eating. Start your wellness journey today with chef-prepared meals delivered to your door.
          </p>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 py-6">
            {benefits.map((benefit) => (
              <div 
                key={benefit}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
              >
                <Check className="h-5 w-5 text-fitnest-orange" />
                <span className="text-sm md:text-base font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/order">
              <Button 
                size="lg"
                className="bg-fitnest-orange text-white hover:bg-fitnest-orange/90 hover:scale-105 transition-all shadow-2xl hover:shadow-fitnest-orange/50 px-10 py-7 text-lg font-semibold"
                aria-label="Get started with Fitnest meal plans"
              >
                Get Started Today
                <ChevronRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/meal-plans">
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-fitnest-green transition-all px-10 py-7 text-lg font-semibold"
                aria-label="Browse all meal plans"
              >
                Browse Meal Plans
              </Button>
            </Link>
          </div>

          {/* Trust Indicator */}
          <p className="text-sm md:text-base text-white/80 pt-6">
            🌟 Rated 4.9/5 by over 1000+ customers
          </p>
        </div>
      </div>
    </section>
  )
}
