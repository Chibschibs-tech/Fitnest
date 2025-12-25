import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock, Sparkles, Send } from "lucide-react"

export const metadata: Metadata = {
  title: "Nous Contacter | Fitnest",
  description:
    "Contactez Fitnest pour toute question, commentaire ou assistance concernant notre service de livraison de repas préparés.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12 animate-in fade-in duration-500">
        <div className="inline-flex items-center gap-2 bg-fitnest-green/10 rounded-full px-4 py-2 mb-4">
          <Sparkles className="h-4 w-4 text-fitnest-green" />
          <span className="text-sm font-semibold text-fitnest-green">Restons en Contact</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900">
          Contactez{" "}
          <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
            Fitnest
          </span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-medium">
          Des questions ? Nous serions ravis de vous entendre. Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.
        </p>
      </div>

      <div className="max-w-5xl mx-auto mt-12 grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Informations de Contact</h2>
          
          <div className="space-y-4">
            {/* Email */}
            <div className="group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-fitnest-green hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-fitnest-green/10 to-green-50 rounded-xl group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-fitnest-green" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Email</h3>
                  <a href="mailto:contact@fitnest.ma" className="text-fitnest-green font-semibold hover:text-green-700">
                    contact@fitnest.ma
                  </a>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-fitnest-green hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-fitnest-green/10 to-green-50 rounded-xl group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-fitnest-green" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Téléphone</h3>
                  <a href="tel:+212522123456" className="text-fitnest-green font-semibold hover:text-green-700">
                    +212 522 123 456
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-fitnest-green hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-fitnest-green/10 to-green-50 rounded-xl group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-fitnest-green" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Adresse</h3>
                  <p className="text-gray-700 font-medium">123 Nutrition St, Casablanca, Morocco</p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="group p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-fitnest-green hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-fitnest-green/10 to-green-50 rounded-xl group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6 text-fitnest-green" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Horaires d'Ouverture</h3>
                  <div className="space-y-1 text-gray-700 font-medium">
                    <p>Lundi - Vendredi : 9h00 - 18h00</p>
                    <p>Samedi : 10h00 - 16h00</p>
                    <p>Dimanche : Fermé</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <form className="bg-white p-8 rounded-3xl shadow-xl border-2 border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un Message</h2>
            
            <div className="mb-5">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fitnest-green focus:border-fitnest-green transition-all"
                placeholder="Votre nom"
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fitnest-green focus:border-fitnest-green transition-all"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                Sujet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fitnest-green focus:border-fitnest-green transition-all"
                placeholder="De quoi s'agit-il ?"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fitnest-green focus:border-fitnest-green transition-all resize-none"
                placeholder="Dites-nous en plus..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-fitnest-green to-fitnest-green/90 hover:from-fitnest-green/90 hover:to-fitnest-green text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>Envoyer le Message</span>
              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-fitnest-orange/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-fitnest-orange" />
            <span className="text-sm font-semibold text-fitnest-orange">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Questions{" "}
            <span className="bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">
              Fréquentes
            </span>
          </h2>
        </div>

        <div className="space-y-6">
          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-fitnest-green transition-colors">
              Dans quelles zones livrez-vous ?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Nous livrons actuellement la ville de Casablanca. Nous élargissons constamment nos zones de livraison, alors n'hésitez pas à revenir si votre zone n'est pas encore couverte.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-fitnest-green transition-colors">
              Combien de temps à l'avance dois-je passer ma commande ?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Pour un service optimal, nous vous recommandons de passer vos commandes au moins 24 heures à l'avance. Cela permet à nos chefs de préparer vos repas frais et garantit une livraison ponctuelle.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-fitnest-green transition-colors">
              Puis-je personnaliser mon meal plan ?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Nous proposons des options de personnalisation pour tous nos meal plans. Vous pouvez spécifier vos préférences alimentaires, allergies et même exclure certains ingrédients lors de votre commande.
            </p>
          </div>

          <div className="group bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100 hover:border-fitnest-green hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-fitnest-green transition-colors">
              Combien de temps les repas restent-ils frais ?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Nos repas sont préparés frais et se conservent généralement 3 à 4 jours au réfrigérateur. Chaque contenant est étiqueté avec une date limite de consommation pour votre commodité.
            </p>
          </div>
        </div>
      </div>
      </div>
    </main>
  )
}
