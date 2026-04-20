import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const workSession = await prisma.workSession.create({
    data: {
      userId: session.user.id,
    },
  })

  return NextResponse.json(workSession)
}