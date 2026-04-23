import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id

  // Récupère le token GitHub pour le révoquer
  const githubAccount = await prisma.account.findFirst({
    where: { userId, provider: "github" },
  })

  // Révoque l'autorisation GitHub — force le re-consentement à la prochaine connexion
  if (githubAccount?.access_token) {
    await fetch(
      `https://api.github.com/applications/${process.env.GITHUB_ID}/grant`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.GITHUB_ID}:${process.env.GITHUB_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({ access_token: githubAccount.access_token }),
      }
    )
  }

  await prisma.$transaction([
    prisma.pomodoro.deleteMany({ where: { workSession: { userId } } }),
    prisma.task.deleteMany({ where: { userId } }),
    prisma.workSession.deleteMany({ where: { userId } }),
    prisma.account.deleteMany({ where: { userId } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ])

  return NextResponse.json({ success: true })
}
