import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { neon } from "@neondatabase/serverless"

// Create a direct SQL client with better error handling
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

          // Use direct SQL query with better error handling
          const users = await sql`
            SELECT * FROM users WHERE email = ${credentials.email} LIMIT 1
          `.catch((err) => {
            console.error("Database query error:", err)
            throw new Error("Database connection failed")
          })

          const user = users[0]

          if (!user) {
            console.log(`User not found for email: ${credentials.email}`)
            return null
          }

          const passwordMatch = await compare(credentials.password, user.password)

          if (!passwordMatch) {
            console.log(`Password doesn't match for user: ${user.email}`)
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
          throw new Error("Authentication failed")
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
    error: "/api/auth/error",
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
  logger: {
    error(code, metadata) {
      console.error(`NextAuth error: ${code}`, metadata)
    },
    warn(code) {
      console.warn(`NextAuth warning: ${code}`)
    },
  },
})

export { handler as GET, handler as POST }
