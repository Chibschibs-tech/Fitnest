import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { OrderDetailContent } from "./order-detail-content"

export const dynamic = "force-dynamic"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login?redirect=/dashboard/orders/" + params.id)
  }

  return <OrderDetailContent orderId={params.id} />
}
