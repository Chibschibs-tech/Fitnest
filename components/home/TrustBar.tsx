import { Clock, Star, Award, Truck } from "lucide-react"

const stats = [
  { 
    icon: Clock, 
    value: "30min", 
    label: "Fast Delivery",
    description: "Average delivery time"
  },
  { 
    icon: Star, 
    value: "4.9", 
    label: "Top Rated", 
    fill: true,
    description: "Customer satisfaction"
  },
  { 
    icon: Award, 
    value: "1000+", 
    label: "Happy Customers",
    description: "And growing daily"
  },
  { 
    icon: Truck, 
    value: "Free", 
    label: "Delivery",
    description: "On all orders"
  },
]

export function TrustBar() {
  return (
    <section className="relative bg-gradient-to-br from-fitnest-green via-fitnest-green to-fitnest-green/90 py-12 md:py-16 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptMCAxMGMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6TTI2IDE2YzAtMS4xLS45LTItMi0ycy0yIC45LTIgMiAuOSAyIDIgMiAyLS45IDItMnptMCAxMGMwLTEuMS0uOS0yLTItMnMtMiAuOS0yIDIgLjkgMiAyIDIgMi0uOSAyLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map(({ icon: Icon, value, label, description, fill }, index) => (
            <div 
              key={label} 
              className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon Container */}
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-white/15 backdrop-blur-md rounded-2xl p-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon 
                      className={`h-6 w-6 md:h-7 md:w-7 text-white ${fill ? 'fill-white' : ''}`} 
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-1">
                <p className="text-3xl md:text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                  {value}
                </p>
                <p className="text-sm md:text-base font-semibold text-white">
                  {label}
                </p>
                <p className="text-xs text-white/80">
                  {description}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
