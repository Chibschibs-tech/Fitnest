import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import Providers from "@/components/providers"

export const metadata: Metadata = {
  title: "NextAuth Example",
  description: "A complete authentication example with NextAuth.js",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
