import { Clock, Star, Award, Truck } from "lucide-react"

const stats = [
  { icon: Clock, value: "30min", label: "Delivery Time" },
  { icon: Star, value: "4.9", label: "Customer Rating", fill: true },
  { icon: Award, value: "1000+", label: "Happy Customers" },
  { icon: Truck, value: "Free", label: "Delivery" },
]

export function TrustBar() {
  return (
    <section className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 py-8 border-b border-fitnest-green/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {stats.map(({ icon: Icon, value, label, fill }) => (
            <div key={label} className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Icon className={`h-5 w-5 ${fill ? 'fill-white' : ''}`} />
                <p className="text-2xl md:text-3xl font-bold">{value}</p>
              </div>
              <p className="text-xs md:text-sm text-white/90">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
