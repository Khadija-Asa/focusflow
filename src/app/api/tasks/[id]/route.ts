import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const { completed, scheduledFor, title, estimatedMin, tag } = body

  const task = await prisma.task.update({
    where: { id, userId: session.user.id },
    data: {
      ...(completed !== undefined && { completed, completedAt: completed ? new Date() : null }),
      ...(scheduledFor !== undefined && { scheduledFor: new Date(scheduledFor) }),
      ...(title !== undefined && { title }),
      ...(estimatedMin !== undefined && { estimatedMin }),
      ...(tag !== undefined && { tag }),
    },
    include: { pomodoros: true },
  })

  return NextResponse.json(task)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { id } = await params

  await prisma.task.delete({
    where: { id, userId: session.user.id },
  })

  return NextResponse.json({ success: true })
}
