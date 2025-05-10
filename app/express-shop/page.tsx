import type { Metadata } from "next"
import { ExpressShopContent } from "./express-shop-content"

export const metadata: Metadata = {
  title: "Express Shop | Fitnest.ma",
  description: "Browse our selection of healthy snacks, protein bars, and more for quick delivery.",
}

export default function ExpressShopPage() {
  return <ExpressShopContent />
}
