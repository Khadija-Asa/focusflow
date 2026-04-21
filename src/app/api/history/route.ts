import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { startOfDay } from "date-fns"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    include: { pomodoros: true },
    orderBy: { scheduledFor: "desc" },
  })

  const grouped: Record<string, typeof tasks> = {}
  for (const task of tasks) {
    const key = startOfDay(task.scheduledFor).toISOString().slice(0, 10)
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(task)
  }

  return NextResponse.json(grouped)
}
