import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Global error storage (in memory, accessible within the same serverless instance)
declare global {
  var __nextauth_errors: string[]
}
globalThis.__nextauth_errors = []

export const { handlers, auth, signIn, signOut } = NextAuth({
  logger: {
    error(code, ...message) {
      globalThis.__nextauth_errors = globalThis.__nextauth_errors || []
      globalThis.__nextauth_errors.push(`[${code}] ${String(message)}`)
      console.error("[NextAuth]", code, ...message)
    },
    warn(code, ...message) {
      console.warn("[NextAuth]", code, ...message)
    },
    debug(code, ...message) {
      console.log("[NextAuth]", code, ...message)
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || "fallback-secret-for-dev-only",
  trustHost: true,

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub
        if (token.email) session.user.email = token.email
        session.user.name = token.name
        session.user.image = token.picture
      }
      return session
    },
  },
})
