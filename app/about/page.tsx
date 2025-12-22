import type { Metadata } from "next"
import Image from "next/image"
import { Sparkles, Heart, Target, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About Us | Fitnest",
  description:
    "Learn about Fitnest, Morocco's premier meal prep delivery service dedicated to helping you achieve your health and fitness goals.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <section className="mb-16">
        <div className="text-center mb-12 animate-in fade-in duration-500">
          <div className="inline-flex items-center gap-2 bg-fitnest-green/10 rounded-full px-4 py-2 mb-4">
            <Heart className="h-4 w-4 text-fitnest-green" />
            <span className="text-sm font-semibold text-fitnest-green">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            About{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Fitnest
            </span>
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium">
              Fitnest is Morocco's premier health-focused lifestyle brand dedicated to helping you achieve your wellness
              goals through delicious, nutritionally balanced meals delivered right to your door.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="mb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-100 p-8 md:p-12 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-fitnest-green to-green-600 rounded-2xl shadow-lg mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our{" "}
                <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                  Vision
                </span>
              </h2>
            </div>
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                FitNest aims to become the leading health-focused lifestyle brand in Morocco, redefining how people eat,
                move, and live.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                We envision a future where healthy living is accessible, enjoyable, and deeply rooted in local
                culture—from what people eat daily to how they take care of their bodies. Through personalized nutrition,
                education, and sustainable food practices, FitNest aspires to shift long-term habits and become a symbol
                of well-being and positive transformation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border-2 border-orange-100 p-8 md:p-12 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-fitnest-orange to-orange-600 rounded-2xl shadow-lg mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our{" "}
                <span className="bg-gradient-to-r from-fitnest-orange to-orange-600 bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
            </div>
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                To make healthy eating simple, enjoyable, and part of everyday life.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                We deliver personalized, nutrient-rich meals straight to your door and support our customers with tools
                and content that help them build healthier routines. With a focus on freshness, transparency, and
                long-term wellness, FitNest empowers individuals to take charge of their health—one meal, one habit at a
                time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Values
            </span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 text-3xl">💚</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors">
                Health First
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We put health at the core of every product and service. Every meal, ingredient, and experience is designed
              to fuel the body and promote long-term well-being.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 text-3xl">🔥</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors">
                Lifestyle-Driven
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We believe that healthy living is more than just eating well—it's a mindset. FitNest promotes a full
              lifestyle transformation through balanced routines, movement, mindfulness, and education.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 text-3xl">🌱</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors">
                Simplicity & Convenience
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We remove the barriers to healthy habits. From personalized meals to seamless delivery and clear guidance,
              we make nutrition and wellness easier for everyone.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 text-3xl">📚</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors">
                Empowerment Through Education
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Knowledge drives change. Through clear content, expert insights, and practical tips, we help our community
              make better choices and build sustainable habits.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 text-3xl">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors">
                Sustainability & Responsibility
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We care about the future. Our commitment to eco-friendly packaging, local sourcing, and self-sufficient
              farming solutions reflects our responsibility toward people and the planet.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-fitnest-green/10 rounded-full px-4 py-2 mb-4">
            <Users className="h-4 w-4 text-fitnest-green" />
            <span className="text-sm font-semibold text-fitnest-green">Meet The Team</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Team
            </span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="group text-center bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Image src="/professional-chef-portrait.png" alt="Executive Chef" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Karim Benali</h3>
            <p className="text-fitnest-green font-semibold">Executive Chef</p>
          </div>
          <div className="group text-center bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Image src="/placeholder.svg?key=c89xy" alt="Head Nutritionist" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Leila Tazi</h3>
            <p className="text-fitnest-green font-semibold">Head Nutritionist</p>
          </div>
          <div className="group text-center bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Image src="/placeholder.svg?key=dukkd" alt="Founder & CEO" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Omar Alaoui</h3>
            <p className="text-fitnest-green font-semibold">Founder & CEO</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-fitnest-green/10 to-green-50 rounded-3xl p-8 md:p-12 border-2 border-fitnest-green/20 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join Us on Our{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Mission
            </span>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed font-medium mb-8">
            Whether you're looking to lose weight, build muscle, or simply maintain a healthy lifestyle, Fitnest is here
            to support your journey with delicious, nutritious meals delivered right to your door.
          </p>
          <Link href="/order">
            <button className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group">
              <span>Start Your Journey Today</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>
      </div>
    </main>
  )
}
