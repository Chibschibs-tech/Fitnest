import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/Logo/fitnest-logo-dark.png"
                alt="Fitnest.ma Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-600 mb-4">
              Healthy, delicious meals delivered to your door. Custom meal plans designed for your fitness goals.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/meal-plans" className="text-gray-600 hover:text-green-600">
                  Meal Plans
                </a>
              </li>
              <li>
                <a href="/meals" className="text-gray-600 hover:text-green-600">
                  Meals
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-gray-600 hover:text-green-600">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/order" className="text-gray-600 hover:text-green-600">
                  Order Now
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-600 hover:text-green-600">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-green-600">
                  Contact
                </a>
              </li>
              <li>
                <a href="/careers" className="text-gray-600 hover:text-green-600">
                  Careers
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-600 hover:text-green-600">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-600 mb-2">Email: info@fitnest.ma</p>
            <p className="text-gray-600 mb-2">Phone: +212 522 123 456</p>
            <p className="text-gray-600">Address: 123 Nutrition St, Casablanca, Morocco</p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Fitnest.ma. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Also export as default for compatibility
export default Footer
