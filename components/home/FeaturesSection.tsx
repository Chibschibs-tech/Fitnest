import { Heart, CheckCircle, TrendingUp, Sparkles, Check } from "lucide-react"

const features = [
  {
    title: "La santé avant tout",
    description: "Des repas élaborés par des nutritionnistes pour équilibre optimal des macronutriments.",
    color: "from-fitnest-green to-fitnest-green/80",
    icon: Heart,
    iconBg: "bg-fitnest-green/10",
    iconColor: "text-fitnest-green",
    highlights: [
      "Conçu par des nutritionnistes",
      "Macros équilibrés",
      "Bien-être durable"
    ]
  },
  {
    title: "Simple et pratique",
    description: "Zéro préparation, zéro courses. Des repas frais livrés à domicile, prêts à déguster en quelques minutes.",
    color: "from-fitnest-orange to-orange-500",
    icon: CheckCircle,
    iconBg: "bg-fitnest-orange/10",
    iconColor: "text-fitnest-orange",
    highlights: [
      "Zéro préparation",
      "Prêts en quelques minutes",
      "Livraison à domicile"
    ]
  },
  {
    title: "Transformation du mode de vie",
    description: "Bien plus que des repas : un accompagnement complet pour votre bien-être.",
    color: "from-fitnest-green to-emerald-600",
    icon: TrendingUp,
    iconBg: "bg-emerald-600/10",
    iconColor: "text-emerald-600",
    highlights: [
      "Bien-être global",
      "Conseils d'experts",
      "Contenus pédagogiques"
    ]
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(79,209,197,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,141,109,0.08)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-fitnest-green/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-fitnest-green" />
            <span className="text-sm font-semibold text-fitnest-green">Pourquoi Nous Choisir</span>
          </div>
          <h2 className="mb-4 text-3xl md:text-5xl font-bold text-gray-900">
            La <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">Fitnest</span> Différemment
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Rejoignez des milliers de clients satisfaits ayant transformé leur mode de vie grâce à une approche scientifiquement éprouvée.
          </p>
        </div>
        
        {/* Features - List Style Layout */}
        <div className="max-w-5xl mx-auto space-y-4 md:space-y-5">
          {features.map(({ title, description, icon: Icon, iconBg, iconColor, highlights }, index) => (
            <article
              key={title}
              className="group relative bg-gray-50 hover:bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-fitnest-green/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Icon Section */}
                <div className="flex-shrink-0">
                  <div className={`relative ${iconBg} rounded-xl p-3 md:p-4 w-fit mx-auto md:mx-0 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className={`h-8 w-8 md:h-10 md:w-10 ${iconColor}`} strokeWidth={2} />
                    
                    {/* Decorative corner accent */}
                    <div className={`absolute -top-1 -right-1 w-3 h-3 ${iconBg} border-2 border-white rounded-full`} />
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 space-y-3">
                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors text-center md:text-left">
                    {title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed text-center md:text-left">
                    {description}
                  </p>

                  {/* Highlights - Checkmark List */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-gradient-to-br from-fitnest-green to-fitnest-green/80 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-gray-700 font-medium text-xs md:text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Number Badge */}
                <div className="hidden lg:flex flex-shrink-0 items-start">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xl font-bold text-gray-400 group-hover:bg-gradient-to-br group-hover:from-fitnest-green group-hover:to-fitnest-green/80 group-hover:text-white transition-all duration-500">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fitnest-green via-fitnest-orange to-fitnest-green opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-xl md:rounded-b-2xl" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
