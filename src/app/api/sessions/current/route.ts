import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { startOfDay } from "date-fns"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ session: null }, { status: 401 })
  }

  const workSession = await prisma.workSession.findFirst({
    where: {
      userId: session.user.id,
      endedAt: null,
      startedAt: { gte: startOfDay(new Date()) },
    },
    orderBy: { startedAt: "desc" },
  })

  if (!workSession) {
    return NextResponse.json({ session: null })
  }

  const elapsed = Math.floor(
    (Date.now() - new Date(workSession.startedAt).getTime()) / 1000
  )

  return NextResponse.json({ session: { id: workSession.id, elapsed } })
}
