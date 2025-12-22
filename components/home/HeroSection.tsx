import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Star } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[calc(100vh-73px)] flex items-end bg-gray-100">
      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1]" />
      <Image
        src="https://obtmksfewry4ishp.public.blob.vercel-storage.com/hero%20banner"
        alt="Fitnest.ma - Healthy meal delivery service in Morocco"
        fill
        className="object-cover object-center"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      <div className="relative z-10 container mx-auto px-4 pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <Star className="h-4 w-4 text-fitnest-orange fill-fitnest-orange" />
            <span className="text-sm font-medium text-gray-900">Trusted by 1000+ Happy Customers</span>
          </div>
          
          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-2xl">
            Fresh, Healthy Meals<br />Delivered to Your Door
          </h1>
          
          {/* Hero Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Chef-prepared nutrition designed for your fitness goals. No prep, no hassle, just results.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-0 sm:flex-row sm:space-x-4 pt-4">
            <Link href="/meal-plans" className="w-full sm:w-auto">
              <Button 
                className="bg-fitnest-orange text-white hover:bg-fitnest-orange/90 hover:scale-105 transition-all duration-200 w-full sm:w-auto text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-6 shadow-xl hover:shadow-2xl"
                aria-label="View our meal plans"
              >
                View Meal Plans
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto">
              <Button 
                variant="outline"
                className="bg-white/95 backdrop-blur-sm text-fitnest-green hover:bg-white border-2 border-white hover:scale-105 transition-all duration-200 w-full sm:w-auto text-sm sm:text-base px-6 py-2 sm:px-8 sm:py-6 shadow-xl"
                aria-label="Learn how our service works"
              >
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
