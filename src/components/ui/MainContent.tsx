"use client"

import { useSessionStore } from "@/stores/sessionStore"
import { useTaskStore } from "@/stores/taskStore"
import { TaskList } from "@/components/tasks/TaskList"
import { SummaryPanel } from "@/components/summary/SummaryPanel"
import { usePomodoro } from "@/hooks/usePomodoro"

export function MainContent() {
  const { status } = useSessionStore()
  usePomodoro()

  if (status === "ended") {
    return <SummaryPanel />
  }

  return <TaskList />
}