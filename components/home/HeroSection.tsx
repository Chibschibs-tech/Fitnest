import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronRight, Star, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50 z-[1]" />
      
      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Fitnest.ma - Healthy meal delivery service in Morocco"
        fill
        className="object-cover object-center"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Hero Badge */}
          <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-2xl border border-white/50 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 text-fitnest-orange fill-fitnest-orange" />
              ))}
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <span className="text-sm font-bold text-gray-900">Trusted by 1000+ Happy Customers</span>
          </div>
          
          {/* Hero Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-2xl animate-in fade-in duration-700">
              Fresh, Healthy Meals
              <br />
              <span className="bg-gradient-to-r from-fitnest-orange via-orange-400 to-fitnest-orange bg-clip-text text-transparent drop-shadow-none">
                Delivered to Your Door
              </span>
            </h1>
          </div>
          
          {/* Hero Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
            Chef-prepared nutrition designed for your fitness goals. 
            <br className="hidden sm:block" />
            No prep, no hassle, just <span className="text-fitnest-orange font-bold">results</span>.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-6">
            <Link href="/meal-plans" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="bg-gradient-to-br from-fitnest-orange via-orange-400 to-orange-500 text-white hover:from-orange-500 hover:via-orange-400 hover:to-fitnest-orange hover:scale-105 transition-all duration-300 w-full sm:w-auto text-base font-bold px-8 py-6 sm:px-10 sm:py-7 shadow-2xl hover:shadow-orange-500/50 rounded-xl group relative overflow-hidden"
                aria-label="View our meal plans"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="mr-2 h-5 w-5 relative z-10" />
                <span className="relative z-10">View Meal Plans</span>
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </Button>
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto">
              <Button 
                size="lg"
                variant="outline"
                className="bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-fitnest-green border-2 border-white/60 hover:border-white hover:scale-105 transition-all duration-300 w-full sm:w-auto text-base font-bold px-8 py-6 sm:px-10 sm:py-7 shadow-2xl hover:shadow-white/50 rounded-xl group relative overflow-hidden"
                aria-label="Learn how our service works"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">How It Works</span>
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8">
            <div className="inline-flex flex-wrap justify-center items-center gap-4 md:gap-6 bg-white/15 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30 shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="bg-fitnest-green rounded-full p-2 shadow-lg">
                <Sparkles className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-white">Fresh Daily</span>
            </div>
            <div className="h-6 w-px bg-white/40" />
            <div className="flex items-center gap-2">
              <div className="bg-fitnest-orange rounded-full p-2 shadow-lg">
                <ChevronRight className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-white">Free Delivery</span>
            </div>
            <div className="h-6 w-px bg-white/40" />
            <div className="flex items-center gap-2">
              <div className="bg-fitnest-green rounded-full p-2 shadow-lg">
                <Star className="h-4 w-4 text-white fill-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-white">No Commitment</span>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
