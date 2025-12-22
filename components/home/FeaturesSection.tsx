const features = [
  {
    title: "Health First",
    description: "Every meal is designed by nutritionists to fuel your body and promote long-term well-being with balanced macros.",
    color: "fitnest-green",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    ),
  },
  {
    title: "Simple & Convenient",
    description: "No meal prep, no grocery shopping. Fresh meals delivered to your door, ready to eat in minutes.",
    color: "fitnest-orange",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
  },
  {
    title: "Lifestyle Transformation",
    description: "More than just meals - we support your entire wellness journey with expert guidance and education.",
    color: "fitnest-green",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    ),
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4 text-4xl md:text-5xl font-bold">Why Choose Fitnest</h2>
          <p className="text-lg text-gray-600">
            Join thousands of satisfied customers who have transformed their lifestyle
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map(({ title, description, color, icon }, index) => (
            <div 
              key={title}
              className={`group rounded-2xl p-8 text-center shadow-lg bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-${color} to-${color}/80 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {icon}
                </svg>
              </div>
              <h3 className="mb-3 text-2xl font-bold">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
