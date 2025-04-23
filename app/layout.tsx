import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import Providers from "@/components/providers"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Fitnest.ma - Healthy Meal Delivery",
  description: "Delicious and nutritious meal plans delivered to your door. Eat healthy without the hassle.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
