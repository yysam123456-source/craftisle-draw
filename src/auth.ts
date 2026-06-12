import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { getUserById } from "@/lib/user"

function isValidDatabaseUrl(): boolean {
  const url = process.env.DATABASE_URL
  if (!url || url.length < 20) return false
  if (url.includes("placeholder") || url.includes("localhost")) return false
  return /^(postgresql|postgres|mysql|mongodb)\+?\:\/\/[^@]+@/.test(url)
}

const hasValidDb = isValidDatabaseUrl()

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || "fallback-secret-for-dev-only",
  trustHost: true,

  // ✅ 与主站共享 cookie 域，实现 SSO
  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: ".craftisle.com",
        secure: true,
      },
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        domain: ".craftisle.com",
        secure: true,
      },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: ".craftisle.com",
        secure: true,
      },
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        const email = credentials.email as string
        if (!hasValidDb) {
          return { id: "local-" + email, email, name: email.split("@")[0] }
        }
        try {
          let user = await prisma.user.findUnique({ where: { email } })
          if (!user) {
            user = await prisma.user.create({
              data: { email, name: email.split("@")[0] },
            })
          }
          return { id: user.id, email: user.email, name: user.name, image: user.image }
        } catch (e) {
          if (process.env.NODE_ENV !== "production") console.error("authorize error:", e)
          return { id: "local-" + email, email, name: email.split("@")[0] }
        }
      },
    }),
  ],

  ...(hasValidDb ? { adapter: PrismaAdapter(prisma) } : {}),

  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) session.user.id = token.sub
        if (token.email) session.user.email = token.email
        if (token.role) (session.user as any).role = token.role
        session.user.name = token.name
        session.user.image = token.picture
      }
      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token
      if (!hasValidDb) return token
      try {
        const dbUser = await getUserById(token.sub)
        if (dbUser) {
          token.name = dbUser.name
          token.email = dbUser.email
          token.picture = dbUser.image
          token.role = (dbUser as any).role
        }
      } catch (e) {}
      return token
    },
  },
})
