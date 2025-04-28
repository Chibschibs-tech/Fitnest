import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { neon } from "@neondatabase/serverless"

// Create a SQL client with proper error handling
const sql = neon(process.env.DATABASE_URL || "")

// Define the handler with comprehensive error handling
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            return null
          }

          // Query the database with proper error handling
          let users = []
          try {
            users = await sql`
              SELECT * FROM users WHERE email = ${credentials.email} LIMIT 1
            `
          } catch (dbError) {
            console.error("Database query error:", dbError)
            return null
          }

          // Check if user exists
          if (!users || users.length === 0) {
            return null
          }

          const user = users[0]

          // Compare passwords with error handling
          let passwordMatch = false
          try {
            passwordMatch = await compare(credentials.password, user.password)
          } catch (pwError) {
            console.error("Password comparison error:", pwError)
            return null
          }

          if (!passwordMatch) {
            return null
          }

          // Return user data
          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role || "user",
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login?error=AuthError",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
