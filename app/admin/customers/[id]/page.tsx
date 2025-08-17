import { Suspense } from "react"
import CustomerDetailContent from "./customer-detail-content"

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div>Loading customer details...</div>}>
      <CustomerDetailContent customerId={params.id} />
    </Suspense>
  )
}
