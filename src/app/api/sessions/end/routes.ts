import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { workSessionId } = await req.json()

  const workSession = await prisma.workSession.update({
    where: { id: workSessionId },
    data: { endedAt: new Date() },
    include: {
      tasks: true,
      pomodoros: true,
    },
  })

  return NextResponse.json(workSession)
}