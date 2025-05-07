import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="container mx-auto px-4">
        {/* First row: 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="https://obtmksfewry4ishp.public.blob.vercel-storage.com/Logo/Logo-Fitnest-white-NwDGrdKRIJziMZXVVN9cKNeWBx1ENP.png"
                alt="Fitnest Logo"
                width={600}
                height={250}
                className="h-48 w-auto mb-2"
              />
            </Link>
          </div>

          {/* Quick Links column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/meal-plans" className="text-gray-300 hover:text-white">
                  Meal Plans
                </Link>
              </li>
              <li>
                <Link href="/meals" className="text-gray-300 hover:text-white">
                  Meals
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-gray-300 hover:text-white">
                  Order Now
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 mb-2">Email: contact@fitnest.ma</p>
            <p className="text-gray-300 mb-2">Phone: +212 522 123 456</p>
            <p className="text-gray-300">Address: 123 Nutrition St, Casablanca, Morocco</p>
          </div>
        </div>

        {/* Second row: 2 columns with specific positioning */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Empty column (under Logo) */}
          <div className="hidden md:block"></div>

          {/* Paragraph spanning 2 columns (under Quick Links and Company) */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-gray-300 mb-4">
              Healthy, delicious meals delivered to your door. Custom meal plans designed for your fitness goals.
            </p>
          </div>

          {/* Follow us section (under Contact) */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Follow us</h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/fitnest.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://facebook.com/fitnest.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://youtube.com/fitnest.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-youtube"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
                <span className="sr-only">YouTube</span>
              </a>
              <a
                href="https://tiktok.com/@fitnest.ma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-music"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
                <span className="sr-only">TikTok</span>
              </a>
              <a
                href="https://linkedin.com/company/fitnest-ma"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Fitnest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Also export as default for compatibility
export default Footer
