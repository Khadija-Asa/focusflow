import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { startOfDay, endOfDay, subDays } from "date-fns"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const today = new Date()
  const yesterday = subDays(today, 1)

  const [todayTasks, yesterdayUnfinished] = await Promise.all([
    prisma.task.findMany({
      where: {
        userId: session.user.id,
        scheduledFor: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      include: { pomodoros: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.task.findMany({
      where: {
        userId: session.user.id,
        completed: false,
        scheduledFor: {
          gte: startOfDay(yesterday),
          lte: endOfDay(yesterday),
        },
      },
      include: { pomodoros: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  return NextResponse.json({ todayTasks, yesterdayUnfinished })
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { title, estimatedMin, tag } = await req.json()

  const task = await prisma.task.create({
    data: {
      title,
      estimatedMin: estimatedMin ?? null,
      tag: tag ?? null,
      scheduledFor: new Date(),
      userId: session.user.id,
    },
    include: { pomodoros: true },
  })

  return NextResponse.json(task)
}