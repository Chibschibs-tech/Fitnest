import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Image from "next/image"

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Fitnest</h3>
            <Image
              src="https://obtmksfewry4ishp.public.blob.vercel-storage.com/Logo/Logo-Fitnest-white-NwDGrdKRIJziMZXVVN9cKNeWBx1ENP.png"
              alt="Fitnest Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
            />
            <p className="text-sm">
              Your ultimate fitness companion. We provide personalized workout plans, nutritional guidance, and expert
              support to help you achieve your health goals.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="text-sm">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-gray-300">
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
                  className="lucide lucide-brand-tiktok"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a href="#" className="hover:text-gray-300">
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
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Subscribe to Newsletter</h3>
            <p className="text-sm mb-4">Stay up to date with our latest news and offers.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white text-black rounded-l py-2 px-4 focus:outline-none"
              />
              <button className="bg-fitnest-yellow text-fitnest-green rounded-r py-2 px-4 hover:bg-yellow-400">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm">&copy; {new Date().getFullYear()} Fitnest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
