import Link from "next/link"
import Image from "next/image"
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  ArrowRight
} from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-200" role="contentinfo">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-10 lg:gap-8">
          {/* Brand & About Section */}
          <div className="lg:col-span-4">
            <Link 
              href="/home"
              className="inline-block mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md transition-transform hover:scale-105"
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
            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-sm">
              Healthy, delicious meals delivered to your door. Custom meal plans designed for your fitness goals and lifestyle.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="mailto:contact@fitnest.ma" 
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-fitnest-green transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                aria-label="Email us at contact@fitnest.ma"
              >
                <Mail className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>contact@fitnest.ma</span>
              </a>
              <a 
                href="tel:+212600000000" 
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-fitnest-green transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                aria-label="Call us at +212 600 000 000"
              >
                <Phone className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>+212 600 000 000</span>
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>Casablanca, Morocco</span>
              </div>
            </div>
          </div>

          {/* Quick Links - Products */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/meal-plans" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-colors inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                >
                  <span>Meal Plans</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/meals" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-colors inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                >
                  <span>Individual Meals</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/express-shop" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-colors inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                >
                  <span>Express Shop</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links - Company */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-colors inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                >
                  <span>About Us</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/how-it-works" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-colors inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                >
                  <span>How It Works</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-colors inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                >
                  <span>Blog</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-colors inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                >
                  <span>Careers</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links - Support */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/contact" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-colors inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                >
                  <span>Contact Us</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-colors inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                >
                  <span>FAQ</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-colors inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                >
                  <span>Terms of Service</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-sm text-gray-600 hover:text-fitnest-green transition-colors inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2 rounded-md"
                >
                  <span>Privacy Policy</span>
                  <ArrowRight className="h-3 w-3 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Social Media & Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Social Media Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Follow us:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://facebook.com/fitnest.ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-600 hover:bg-fitnest-green hover:text-white transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com/fitnest.ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-600 hover:bg-fitnest-green hover:text-white transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com/fitnest_ma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-100 text-gray-600 hover:bg-fitnest-green hover:text-white transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fitnest-green focus-visible:ring-offset-2"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-600">
              <p>&copy; {currentYear} <span className="font-medium text-gray-900">Fitnest.ma</span>. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Also export as named export for compatibility
export { Footer }
