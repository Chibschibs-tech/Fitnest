import { Heart, CheckCircle, TrendingUp, Sparkles } from "lucide-react"

const features = [
  {
    title: "Health First",
    description: "Every meal is designed by nutritionists to fuel your body and promote long-term well-being with balanced macros.",
    color: "from-fitnest-green to-fitnest-green/80",
    icon: Heart,
    iconBg: "from-fitnest-green/10 to-fitnest-green/5",
  },
  {
    title: "Simple & Convenient",
    description: "No meal prep, no grocery shopping. Fresh meals delivered to your door, ready to eat in minutes.",
    color: "from-fitnest-orange to-orange-500",
    icon: CheckCircle,
    iconBg: "from-fitnest-orange/10 to-orange-500/5",
  },
  {
    title: "Lifestyle Transformation",
    description: "More than just meals - we support your entire wellness journey with expert guidance and education.",
    color: "from-fitnest-green to-emerald-600",
    icon: TrendingUp,
    iconBg: "from-fitnest-green/10 to-emerald-600/5",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-fitnest-green/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-fitnest-green" />
            <span className="text-sm font-semibold text-fitnest-green">Why Choose Us</span>
          </div>
          <h2 className="mb-4 text-3xl md:text-5xl font-bold text-gray-900">
            The <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">Fitnest</span> Difference
          </h2>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Join thousands of satisfied customers who have transformed their lifestyle with our science-backed approach.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map(({ title, description, color, icon: Icon, iconBg }, index) => (
            <article
              key={title}
              className={`group relative rounded-3xl p-8 text-center shadow-md bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden ${
                index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Decorative Background Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${iconBg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`} />
              
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <Icon className="h-10 w-10" strokeWidth={2} />
                </div>
                
                {/* Decorative Ring */}
                <div className={`absolute inset-0 mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${color} opacity-20 blur-xl group-hover:scale-125 transition-transform duration-500`} />
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="mb-4 text-2xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Bottom Decorative Element */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fitnest-green/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
