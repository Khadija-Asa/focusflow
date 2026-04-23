import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: "https://github.com/login/oauth/authorize?prompt=login&scope=read:user+user:email",
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 48 * 60 * 60, // 48 heures
    updateAge: 60 * 60,   // rafraîchit le token toutes les heures si actif
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})