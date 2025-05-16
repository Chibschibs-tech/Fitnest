import Link from "next/link"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold">Fitnest.ma</h3>
            <p className="text-sm text-gray-600">
              Healthy, delicious meals delivered to your door. Custom meal plans for your fitness goals.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/meal-plans" className="text-gray-600 hover:text-green-600">
                  Meal Plans
                </Link>
              </li>
              <li>
                <Link href="/meals" className="text-gray-600 hover:text-green-600">
                  Individual Meals
                </Link>
              </li>
              <li>
                <Link href="/express-shop" className="text-gray-600 hover:text-green-600">
                  Express Shop
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-green-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-green-600">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-green-600">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 hover:text-green-600">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase text-gray-500">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-green-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-green-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-green-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-green-600">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} Fitnest.ma. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Also export as named export for compatibility
export { Footer }
