import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { neon } from "@neondatabase/serverless"

// Create a SQL client with proper error handling
const createSqlClient = () => {
  try {
    return neon(process.env.DATABASE_URL || "")
  } catch (error) {
    console.error("Failed to create SQL client:", error)
    throw new Error("Database connection failed")
  }
}

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
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            return null
          }

          const sql = createSqlClient()

          let users = []
          try {
            users = await sql`
              SELECT * FROM users WHERE email = ${credentials.email} LIMIT 1
            `
          } catch (dbError) {
            console.error("Database query error:", dbError)
            return null
          }

          if (!users || users.length === 0) {
            return null
          }

          const user = users[0]

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
    signOut: "/api/auth/signout",
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
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
