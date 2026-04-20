"use client"

import { useSessionStore } from "@/stores/sessionStore"
import { TaskList } from "@/components/tasks/TaskList"
import { SummaryPanel } from "@/components/summary/SummaryPanel"

export function MainContent() {
  const { status } = useSessionStore()

  if (status === "ended") {
    return <SummaryPanel />
  }

  return <TaskList />
}