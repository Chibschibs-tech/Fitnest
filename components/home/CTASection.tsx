import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Check, Star, Shield, Zap } from "lucide-react"

const benefits = [
  { text: "Sans engagement", icon: Shield },
  { text: "Résiliation à tout moment", icon: Check },
  { text: "Livraison gratuite", icon: Zap },
]

export function CTASection() {
  return (
    <section className="relative bg-gradient-to-br from-fitnest-green via-fitnest-green to-fitnest-green/90 py-20 md:py-28 text-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-fitnest-orange rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptMCAxMGMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6TTI2IDE2YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptMCAxMGMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-in fade-in duration-700">
              Prêt à transformer votre <span className="text-fitnest-orange">mode de vie ?</span>
            </h2>
            
            {/* Subheading */}
            <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Rejoignez plus de <strong>1 000 clients satisfaits</strong> qui ont transformé leur quotidien grâce à une alimentation saine.
              <br className="hidden md:block" />
              Commencez dès aujourd'hui votre parcours bien-être avec des repas préparés par des chefs, livrés directement chez vous.
            </p>
          </div>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 py-6">
            {benefits.map(({ text, icon: Icon }) => (
              <div 
                key={text}
                className="group flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/20 hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <div className="bg-fitnest-orange/90 rounded-full p-1">
                  <Icon className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-sm md:text-base font-semibold">{text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/order">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-fitnest-orange to-orange-500 text-white hover:from-orange-500 hover:to-fitnest-orange hover:scale-105 transition-all shadow-2xl hover:shadow-fitnest-orange/50 px-10 py-7 text-base md:text-lg font-semibold rounded-xl group/btn w-full sm:w-auto"
                aria-label="Get started with Fitnest meal plans"
              >
                <span>Commencez maintenant</span>
                <ChevronRight className="ml-2 h-5 w-5 md:h-6 md:w-6 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/meal-plans">
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/15 backdrop-blur-md text-white border-2 border-white/40 hover:bg-white hover:text-fitnest-green hover:scale-105 transition-all px-10 py-7 text-base md:text-lg font-semibold rounded-xl shadow-lg group/btn w-full sm:w-auto"
                aria-label="Browse all meal plans"
              >
                <span>Découvrez Nos Meal Plans</span>
                <ChevronRight className="ml-2 h-5 w-5 md:h-6 md:w-6 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicator */}
          <div className="pt-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20 shadow-lg">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-fitnest-orange text-fitnest-orange" />
                ))}
              </div>
              <span className="text-sm md:text-base font-semibold">
                Noté 4.9/5 par plus de 1000+ clients
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
