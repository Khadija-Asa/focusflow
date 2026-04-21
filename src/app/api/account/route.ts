import { auth, signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const userId = session.user.id

  await prisma.$transaction([
    prisma.pomodoro.deleteMany({
      where: { workSession: { userId } },
    }),
    prisma.task.deleteMany({ where: { userId } }),
    prisma.workSession.deleteMany({ where: { userId } }),
    prisma.account.deleteMany({ where: { userId } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
  ])

  return NextResponse.json({ success: true })
}
