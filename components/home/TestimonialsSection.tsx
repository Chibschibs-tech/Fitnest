import { Star } from "lucide-react"

const testimonials = [
  {
    quote: "Fitnest has completely changed my relationship with food. The meals are delicious and I've lost 8kg in 3 months!",
    author: "Sarah M.",
    plan: "Weight Loss Plan",
    initial: "S",
    color: "fitnest-green",
  },
  {
    quote: "As a busy professional, Fitnest saves me hours each week. The muscle gain plan is perfect for my fitness goals.",
    author: "Karim B.",
    plan: "Muscle Gain Plan",
    initial: "K",
    color: "fitnest-orange",
  },
  {
    quote: "The variety and quality of meals exceeded my expectations. Delivery is always on time and customer service is excellent.",
    author: "Leila A.",
    plan: "Stay Fit Plan",
    initial: "L",
    color: "fitnest-green",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4 text-4xl md:text-5xl font-bold">What Our Customers Say</h2>
          <p className="text-lg text-gray-600">
            Real stories from real people achieving their health goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map(({ quote, author, plan, initial, color }) => (
            <div 
              key={author}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-fitnest-orange text-fitnest-orange" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                &ldquo;{quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br from-${color} to-${color}/80 flex items-center justify-center text-white font-bold text-lg`}>
                  {initial}
                </div>
                <div>
                  <p className="font-bold">{author}</p>
                  <p className="text-sm text-gray-500">{plan}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
