import Link from "next/link"
import Image from "next/image"
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight,
  Heart
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 border-t border-gray-200 overflow-hidden" role="contentinfo">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(79,209,197,0.05)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,141,109,0.05)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-10 lg:gap-10">
          {/* Brand & About Section */}
          <div className="lg:col-span-4">
            <Link 
              href="/home"
              className="inline-block mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg transition-transform hover:scale-105 duration-300"
              aria-label="Fitnest.ma Home"
            >
              <Image
                src="https://obtmksfewry4ishp.public.blob.vercel-storage.com/Logo/Logo-Fitnest-Vert-v412yUnhxctld0VkvDHD8wXh8H2GMQ.png"
                alt="Fitnest.ma"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-sm font-medium">
              Healthy, delicious meals delivered to your door. Custom meal plans designed for your fitness goals and lifestyle.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="mailto:contact@fitnest.ma" 
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg p-2 -ml-2 hover:bg-white"
                aria-label="Email us at contact@fitnest.ma"
              >
                <div className="bg-fitnest-green/10 rounded-lg p-2 group-hover:bg-fitnest-green group-hover:scale-110 transition-all duration-300">
                  <Mail className="h-4 w-4 text-fitnest-green group-hover:text-white" />
                </div>
                <span className="font-medium">contact@fitnest.ma</span>
              </a>
              <a 
                href="tel:+212600000000" 
                className="flex items-center gap-3 text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg p-2 -ml-2 hover:bg-white"
                aria-label="Call us at +212 600 000 000"
              >
                <div className="bg-fitnest-orange/10 rounded-lg p-2 group-hover:bg-fitnest-orange group-hover:scale-110 transition-all duration-300">
                  <Phone className="h-4 w-4 text-fitnest-orange group-hover:text-white" />
                </div>
                <span className="font-medium">+212 600 000 000</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-600 p-2 -ml-2">
                <div className="bg-fitnest-green/10 rounded-lg p-2">
                  <MapPin className="h-4 w-4 text-fitnest-green" />
                </div>
                <span className="font-medium mt-1">Casablanca, Morocco</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Products */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent mb-5">
              Products
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/meal-plans" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg font-medium hover:translate-x-1"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>Meal Plans</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/meals" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg font-medium hover:translate-x-1"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>Individual Meals</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/express-shop" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg font-medium hover:translate-x-1"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>Express Shop</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links - Company */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent mb-5">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg font-medium hover:translate-x-1"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/how-it-works" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg font-medium hover:translate-x-1"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>How It Works</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg font-medium hover:translate-x-1"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg font-medium hover:translate-x-1"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>Careers</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links - Support */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent mb-5">
              Support
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/contact" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg font-medium hover:translate-x-1"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg font-medium hover:translate-x-1"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg font-medium hover:translate-x-1"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-all duration-300 inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-lg font-medium hover:translate-x-1"
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Social Media & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Social Media Links */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <span className="text-sm font-bold text-gray-900">Follow us:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com/fitnest.ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center h-10 w-10 rounded-xl bg-white border-2 border-gray-200 text-gray-600 hover:border-fitnest-green hover:text-white transition-all duration-300 hover:scale-110 hover:-rotate-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 shadow-sm hover:shadow-md overflow-hidden"
                  aria-label="Follow us on Facebook"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-fitnest-green to-fitnest-green/80 scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <Facebook className="h-4 w-4 relative z-10" />
                </a>
                <a
                  href="https://instagram.com/fitnest.ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center h-10 w-10 rounded-xl bg-white border-2 border-gray-200 text-gray-600 hover:border-fitnest-orange hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-orange focus-visible:ring-offset-2 shadow-sm hover:shadow-md overflow-hidden"
                  aria-label="Follow us on Instagram"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-fitnest-orange to-orange-500 scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <Instagram className="h-4 w-4 relative z-10" />
                </a>
                <a
                  href="https://twitter.com/fitnest_ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center h-10 w-10 rounded-xl bg-white border-2 border-gray-200 text-gray-600 hover:border-fitnest-green hover:text-white transition-all duration-300 hover:scale-110 hover:-rotate-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 shadow-sm hover:shadow-md overflow-hidden"
                  aria-label="Follow us on Twitter"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-fitnest-green to-emerald-600 scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <Twitter className="h-4 w-4 relative z-10" />
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-600 font-medium">
              <p className="flex items-center gap-1.5">
                &copy; {currentYear} 
                <span className="font-bold bg-gradient-to-r from-fitnest-green to-fitnest-orange bg-clip-text text-transparent">Fitnest.ma</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 inline animate-pulse" /> in Morocco
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Also export as named export for compatibility
export { Footer }
