import type { Metadata } from "next"
import Image from "next/image"
import { Sparkles, Heart, Target, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "A Propos | Fitnest",
  description:
    "Découvrez Fitnest, le premier service de livraison de repas préparés au Maroc, dédié à vous aider à atteindre vos objectifs de santé et de fitness.",
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
            <span className="text-sm font-semibold text-fitnest-green">Notre Histoire</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            À Propos de{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Fitnest
            </span>
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium">
              Fitnest est la première marque de bien-être au Maroc, dédiée à vous aider à atteindre vos objectifs santé grâce à des repas délicieux et équilibrés, livrés directement chez vous.
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
                Notre{" "}
                <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
                  Vision
                </span>
              </h2>
            </div>
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                FitNest aspire à devenir la marque de bien-être de référence au Maroc, redéfinissant la façon dont les gens mangent, bougent et vivent.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Nous envisageons un avenir où une vie saine est accessible, agréable et profondément ancrée dans la culture locale — de ce que les gens mangent quotidiennement à la façon dont ils prennent soin de leur corps. Grâce à une nutrition personnalisée, à l'éducation et à des pratiques alimentaires durables, FitNest aspire à transformer les habitudes à long terme et à devenir un symbole de bien-être et de transformation positive.
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
                Notre{" "}
                <span className="bg-gradient-to-r from-fitnest-orange to-orange-600 bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
            </div>
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                Rendre une alimentation saine simple, agréable et partie intégrante de la vie quotidienne.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                Nous livrons des repas personnalisés et riches en nutriments directement à votre porte et accompagnons nos clients avec des outils et du contenu qui les aident à développer des routines plus saines. En mettant l'accent sur la fraîcheur, la transparence et le bien-être à long terme, FitNest permet aux individus de prendre en main leur santé — un repas, une habitude à la fois.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Nos{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Valeurs
            </span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 text-3xl">💚</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors">
                Santé
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Nous plaçons la santé au cœur de chaque produit et service. Chaque repas, ingrédient et expérience est conçu pour alimenter le corps et promouvoir un bien-être durable.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 text-3xl">🔥</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors">
                Lifestyle
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Nous croyons qu'une vie saine ne se limite pas à bien manger — c'est un état d'esprit. FitNest promeut une transformation complète du mode de vie grâce à des routines équilibrées, au mouvement, à la pleine conscience et à l'éducation.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 text-3xl">🌱</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors">
                Simplicité
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Nous éliminons les obstacles aux habitudes saines. Des repas personnalisés à la livraison fluide en passant par des conseils clairs, nous rendons la nutrition et le bien-être plus faciles pour tous.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 text-3xl">📚</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors">
                Éducation
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              La connaissance stimule le changement. Grâce à un contenu clair, des conseils d'experts et des astuces pratiques, nous aidons notre communauté à faire de meilleurs choix et à développer des habitudes durables.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 text-3xl">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-fitnest-green transition-colors">
                Durabilité
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Nous nous soucions de l'avenir. Notre engagement envers des emballages écologiques, un approvisionnement local et des solutions agricoles autosuffisantes reflète notre responsabilité envers les gens et la planète.
            </p>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-fitnest-green/10 rounded-full px-4 py-2 mb-4">
            <Users className="h-4 w-4 text-fitnest-green" />
            <span className="text-sm font-semibold text-fitnest-green">Rencontrez l'Équipe</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Notre{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Équipe
            </span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="group text-center bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Image src="/professional-chef-portrait.png" alt="Executive Chef" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Karim Benali</h3>
            <p className="text-fitnest-green font-semibold">Chef Exécutif</p>
          </div>
          <div className="group text-center bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Image src="/placeholder.svg?key=c89xy" alt="Head Nutritionist" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Leila Tazi</h3>
            <p className="text-fitnest-green font-semibold">Nutritionniste en Chef</p>
          </div>
          <div className="group text-center bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative w-48 h-48 mx-auto mb-6 rounded-2xl overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
              <Image src="/placeholder.svg?key=dukkd" alt="Founder & CEO" fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Omar Alaoui</h3>
            <p className="text-fitnest-green font-semibold">Fondateur et PDG</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-fitnest-green/10 to-green-50 rounded-3xl p-8 md:p-12 border-2 border-fitnest-green/20 shadow-xl">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Rejoignez Notre{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Mission
            </span>
          </h2>
        </div>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed font-medium mb-8">
            Que vous cherchiez à perdre du poids, à développer votre masse musculaire ou simplement à maintenir un mode de vie sain, Fitnest est là pour accompagner votre parcours avec des repas délicieux et nutritifs livrés directement chez vous.
          </p>
          <Link href="/order">
            <button className="bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 group">
              <span>Commencez Votre Parcours Aujourd'hui</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>
      </div>
    </main>
  )
}
