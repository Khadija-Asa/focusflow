import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id

  const [githubAccount, user] = await Promise.all([
    prisma.account.findFirst({ where: { userId, provider: "github" } }),
    prisma.user.findUnique({ where: { id: userId }, select: { email: true } }),
  ])

  // Révoque l'autorisation GitHub — force le re-consentement à la prochaine connexion
  if (githubAccount?.access_token) {
    const basicAuth = Buffer.from(
      `${process.env.GITHUB_ID}:${process.env.GITHUB_SECRET}`
    ).toString("base64")

    // Vérifie que le token est toujours valide avant de tenter la révocation
    const checkRes = await fetch(
      `https://api.github.com/applications/${process.env.GITHUB_ID}/token`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({ access_token: githubAccount.access_token }),
      }
    )

    if (checkRes.ok) {
      const revokeRes = await fetch(
        `https://api.github.com/applications/${process.env.GITHUB_ID}/grant`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json",
          },
          body: JSON.stringify({ access_token: githubAccount.access_token }),
        }
      )
      if (!revokeRes.ok) {
        console.error("[account/DELETE] GitHub grant revocation failed:", revokeRes.status, await revokeRes.text())
      }
    } else {
      console.warn("[account/DELETE] GitHub token is invalid (status", checkRes.status, ") — skipping revocation")
    }
  } else {
    console.warn("[account/DELETE] No GitHub access_token found for user", userId)
  }

  await prisma.$transaction([
    prisma.pomodoro.deleteMany({ where: { workSession: { userId } } }),
    prisma.task.deleteMany({ where: { userId } }),
    prisma.workSession.deleteMany({ where: { userId } }),
    prisma.account.deleteMany({ where: { userId } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ])

  return NextResponse.json({ success: true, githubEmail: user?.email ?? null })
}
