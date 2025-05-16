import Link from "next/link"
import { CartIcon } from "./cart-icon"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold text-green-600">Fitnest.ma</span>
        </Link>

        <nav className="hidden space-x-6 md:flex">
          <Link href="/meal-plans" className="text-gray-600 hover:text-green-600">
            Meal Plans
          </Link>
          <Link href="/meals" className="text-gray-600 hover:text-green-600">
            Meals
          </Link>
          <Link href="/express-shop" className="text-gray-600 hover:text-green-600">
            Express Shop
          </Link>
          <Link href="/how-it-works" className="text-gray-600 hover:text-green-600">
            How It Works
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <CartIcon />
          <Link
            href="/login"
            className="hidden rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 md:block"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
