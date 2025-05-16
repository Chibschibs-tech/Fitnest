import { ExpressShopContent } from "./express-shop-content"

// Force dynamic rendering to avoid prerendering issues with useSession
export const dynamic = "force-dynamic"

export default function ExpressShop() {
  return <ExpressShopContent />
}
