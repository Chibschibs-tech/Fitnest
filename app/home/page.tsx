import { getMealPlans, getProducts } from "@/lib/api/home"
import { HeroSection } from "@/components/home/HeroSection"
import { TrustBar } from "@/components/home/TrustBar"
import { MealPlansSection } from "@/components/home/MealPlansSection"
import { HowItWorksSection } from "@/components/home/HowItWorksSection"
import { FeaturesSection } from "@/components/home/FeaturesSection"
import { TestimonialsSection } from "@/components/home/TestimonialsSection"
import { ExpressShopSection } from "@/components/home/ExpressShopSection"
import { CTASection } from "@/components/home/CTASection"

export default async function Home() {
  // Fetch data for the page
  const [allMealPlans, allProducts] = await Promise.all([
    getMealPlans(),
    getProducts(),
  ])
  
  // Limit to first 4 items for home page
  const mealPlans = allMealPlans.slice(0, 4)
  const products = allProducts.slice(0, 4)

  return (
    <div className="flex flex-col">
      <HeroSection />
      <TrustBar />
      <MealPlansSection mealPlans={mealPlans} />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <ExpressShopSection products={products} />
      <CTASection />
    </div>
  )
}
