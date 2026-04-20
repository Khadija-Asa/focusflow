import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { generateSummary } from "@/lib/summary"
import { startOfDay, endOfDay } from "date-fns"

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { workSessionId } = await req.json()

  const workSession = await prisma.workSession.findUnique({
    where: { id: workSessionId, userId: session.user.id },
    include: { pomodoros: true },
  })

  if (!workSession) {
    return NextResponse.json({ error: "Session introuvable" }, { status: 404 })
  }

  const today = new Date()

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      scheduledFor: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    },
    include: { pomodoros: true },
  })

  const summary = generateSummary({
    workSession: workSession as any,
    tasks: tasks as any,
  })

  return NextResponse.json({ summary })
}