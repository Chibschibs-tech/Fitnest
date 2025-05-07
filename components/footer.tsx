import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"
import { siteConfig } from "@/lib/constants"
import { NewsletterForm } from "./newsletter-form"

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Fitnest</h3>
            <p className="text-sm">
              Your ultimate fitness companion. We provide personalized meal plans, nutritional guidance, and expert
              support to help you achieve your health goals.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/" className="hover:text-gray-300">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gray-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/meal-plans" className="hover:text-gray-300">
                  Meal Plans
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-gray-300">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gray-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <Youtube className="h-6 w-6" />
              </a>
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Subscribe to Newsletter</h3>
            <p className="text-sm mb-4">Stay up to date with our latest news and offers.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm">&copy; {new Date().getFullYear()} Fitnest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
