import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { startOfDay, endOfDay, subDays } from "date-fns"

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i))

  const results = await Promise.all(
    days.map(async (day) => {
      const [tasks, pomodoros] = await Promise.all([
        prisma.task.findMany({
          where: {
            userId: session.user.id,
            scheduledFor: { gte: startOfDay(day), lte: endOfDay(day) },
          },
        }),
        prisma.pomodoro.findMany({
          where: {
            workSession: { userId: session.user.id },
            startedAt: { gte: startOfDay(day), lte: endOfDay(day) },
            completed: true,
          },
        }),
      ])

      return {
        date: day.toISOString().slice(0, 10),
        label: DAY_LABELS[day.getDay()],
        tasksCompleted: tasks.filter((t) => t.completed).length,
        tasksTotal: tasks.length,
        pomodoros: pomodoros.length,
      }
    })
  )

  return NextResponse.json(results)
}
