import type React from "react"
import type { Metadata } from "next"
import { ClientLayout } from "./client-layout"

// Metadata needs to be in a separate file for client components
const metadata: Metadata = {
  title: "Fitnest.ma",
  description: "Healthy meal delivery service",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export { metadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}


import './globals.css'