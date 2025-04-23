import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { neon } from "@neondatabase/serverless"

// Create a direct SQL client
const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL || "")

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            return null
          }

          // Use direct SQL query
          const users = await sql`
            SELECT * FROM users WHERE email = ${credentials.email} LIMIT 1
          `

          const user = users[0]

          if (!user) {
            console.log("User not found")
            return null
          }

          const passwordMatch = await compare(credentials.password, user.password)

          if (!passwordMatch) {
            console.log("Password doesn't match")
            return null
          }

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/api/auth/error", // Add this line to specify the error page
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
