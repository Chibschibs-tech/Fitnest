import { Star, Quote, Sparkles } from "lucide-react"

const testimonials = [
  {
    quote: "Fitnest a complètement changé ma relation à l'alimentation. Les repas sont délicieux et j'ai perdu 8 kg en 3 mois !",
    author: "Sarah M.",
    plan: "Plan de Perte de Poid",
    initial: "S",
    color: "from-fitnest-green to-fitnest-green/80",
    bgColor: "from-fitnest-green/10 to-fitnest-green/5",
  },
  {
    quote: "En tant que personne très occupé, Le programme prise de masse de Fitnest me fait gagner des heures chaque semaine.",
    author: "Karim B.",
    plan: "Plan de Prise de Masse",
    initial: "K",
    color: "from-fitnest-orange to-orange-500",
    bgColor: "from-fitnest-orange/10 to-orange-500/5",
  },
  {
    quote: "La variété et la qualité des repas ont dépassé mes attentes. La livraison est toujours ponctuelle et le service client est excellent.",
    author: "Leila A.",
    plan: "Plan de Maintien en Forme",
    initial: "L",
    color: "from-fitnest-green to-emerald-600",
    bgColor: "from-fitnest-green/10 to-emerald-600/5",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(79,209,197,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,141,109,0.08)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-fitnest-orange/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-fitnest-orange" />
            <span className="text-sm font-semibold text-fitnest-orange">Témoignages</span>
          </div>
          <h2 className="mb-4 text-3xl md:text-5xl font-bold text-gray-900">
            Ils nous font <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">confiance</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Des parcours authentiques de clients ayant atteint leurs objectifs santé et fitness.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map(({ quote, author, plan, initial, color, bgColor }) => (
            <article
              key={author}
              className="group relative bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Decorative Background Gradient */}
              <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${bgColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`} />
              
              {/* Quote Icon */}
              <div className="relative mb-4">
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${bgColor} group-hover:scale-110 transition-transform duration-500`}>
                  <Quote className="h-6 w-6 text-gray-700" strokeWidth={2} />
                </div>
              </div>

              {/* Star Rating */}
              <div className="relative flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-fitnest-orange text-fitnest-orange" />
                ))}
              </div>

              {/* Quote */}
              <p className="relative text-gray-700 mb-6 leading-relaxed text-base min-h-[120px]">
                &ldquo;{quote}&rdquo;
              </p>

              {/* Author Info */}
              <div className="relative flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="relative">
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-full blur-md opacity-30`} />
                  {/* Avatar */}
                  <div className={`relative h-12 w-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {initial}
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{author}</p>
                  <p className="text-sm text-gray-500">{plan}</p>
                </div>
              </div>

              {/* Bottom Accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl`} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
