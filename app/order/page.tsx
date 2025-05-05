import { OrderProcess } from "./order-process"

// Force dynamic rendering to avoid prerendering issues
export const dynamic = "force-dynamic"

export default function OrderPage() {
  return <OrderProcess />
}
