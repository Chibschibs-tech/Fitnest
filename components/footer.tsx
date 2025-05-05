import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="https://obtmksfewry4ishp.public.blob.vercel-storage.com/Logo/Logo-Fitnest-white-NwDGrdKRIJziMZXVVN9cKNeWBx1ENP.png"
                alt="Fitnest.ma Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-gray-300 mb-4">
              Healthy, delicious meals delivered to your door. Custom meal plans designed for your fitness goals.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/meal-plans" className="text-gray-300 hover:text-logo-green">
                  Meal Plans
                </Link>
              </li>
              <li>
                <Link href="/meals" className="text-gray-300 hover:text-logo-green">
                  Meals
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-300 hover:text-logo-green">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/order" className="text-gray-300 hover:text-logo-green">
                  Order Now
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-logo-green">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-logo-green">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-logo-green">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-300 hover:text-logo-green">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-logo-green">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-300 mb-2">Email: info@fitnest.ma</p>
            <p className="text-gray-300 mb-2">Phone: +212 522 123 456</p>
            <p className="text-gray-300">Address: 123 Nutrition St, Casablanca, Morocco</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Fitnest.ma. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// Also export as default for compatibility
export default Footer
