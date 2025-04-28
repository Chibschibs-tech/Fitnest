import Link from "next/link"
import NavbarAuth from "./navbar-auth"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold text-green-600">Fitnest.ma</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/meal-plans" className="text-sm font-medium transition-colors hover:text-green-600">
              Meal Plans
            </Link>
            <Link href="/meals" className="text-sm font-medium transition-colors hover:text-green-600">
              Meals
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium transition-colors hover:text-green-600">
              How It Works
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <NavbarAuth />
          </nav>
        </div>
      </div>
    </header>
  )
}
