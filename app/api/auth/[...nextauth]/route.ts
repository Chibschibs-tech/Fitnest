import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db, users } from "@/lib/db"
import { eq } from "drizzle-orm"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user by email
          const user = await db.select().from(users).where(eq(users.email, credentials.email)).limit(1)

          if (user.length === 0) {
            console.log("User not found:", credentials.email)
            return null
          }

          // Compare passwords
          const passwordMatch = await compare(credentials.password, user[0].password)

          if (!passwordMatch) {
            console.log("Password doesn't match for user:", credentials.email)
            return null
          }

          // Return user data
          return {
            id: String(user[0].id),
            name: user[0].name,
            email: user[0].email,
            role: user[0].role,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  // Configure JWT
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Customize pages
  pages: {
    signIn: "/login",
    // signOut: '/auth/signout',
    // error: '/auth/error',
    // newUser: '/auth/new-user'
  },
  // Callbacks
  callbacks: {
    // Add custom properties to the JWT token
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    // Add custom properties to the session
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  // Enable debug messages in the console if you are having problems
  debug: true, // Set to true to help diagnose the issue
})

export { handler as GET, handler as POST }
