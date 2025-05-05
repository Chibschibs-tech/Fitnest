import { redirect } from "next/navigation"

export default function OrderPage() {
  // Redirect to the meals page
  redirect("/meals")
}
