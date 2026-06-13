import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "./lib/db"

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
    // ── Sync user to DB on sign-in ──────────────────
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const dbUser = await prisma.users.upsert({
            where: { email: profile.email },
            update: {
              name: profile.name ?? undefined,
              image: (profile as any)?.picture ?? undefined,
              updated_at: new Date(),
            } as any,
            create: {
              email: profile.email,
              name: profile.name ?? undefined,
              image: (profile as any)?.picture ?? undefined,
            } as any,
          })
          // Store the DB user id (cuid) on the token for later use
          ;(globalThis as any).__auth_db_user_id = dbUser.id
          console.log("[NextAuth] Synced user to DB:", dbUser.id, dbUser.email)
        } catch (err) {
          console.error("[NextAuth] Failed to sync user to DB:", err)
          // Don't block login — continue without DB record
        }
      }
      return true
    },

    async jwt({ token, account, profile }) {
      // If this is a fresh sign-in, look up the DB user id we just stored (or find by email)
      if (account?.provider === "google" && profile?.email) {
        try {
          const dbUser = await prisma.users.findUnique({ where: { email: profile.email } })
          if (dbUser) {
            token.dbUserId = dbUser.id
          }
        } catch {}
      }
      // Preserve dbUserId across subsequent token refreshes
      if (!token.dbUserId && token.email) {
        try {
          const dbUser = await prisma.users.findUnique({ where: { email: token.email } })
          if (dbUser) {
            token.dbUserId = dbUser.id
          }
        } catch {}
      }
      return token
    },

    async session({ token, session }) {
      if (session.user) {
        // Use the DB user id (cuid) as the primary identifier — this matches the users table
        if ((token as any).dbUserId) {
          session.user.id = (token as any).dbUserId
        } else if (token.sub) {
          session.user.id = token.sub
        }
        if (token.email) session.user.email = token.email
        session.user.name = token.name
        session.user.image = token.picture
      }
      return session
    },
  },
})
