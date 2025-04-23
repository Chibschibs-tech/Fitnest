import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// TEMPORARY CONFIGURATION FOR TESTING ONLY
// REMOVE THIS AND RESTORE THE ORIGINAL CODE AFTER TESTING
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Accept any credentials for testing
        console.log("Login attempt with:", credentials?.email)

        // Return a mock user
        return {
          id: "1",
          name: "Test User",
          email: credentials?.email || "test@example.com",
          role: "customer",
        }
      },
    }),
  ],
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
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  // For debugging
  debug: true,
})

export { handler as GET, handler as POST }
