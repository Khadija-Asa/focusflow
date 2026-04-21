"use client"

import { useSessionStore } from "@/stores/sessionStore"
import { TaskList } from "@/components/tasks/TaskList"
import { SummaryPanel } from "@/components/summary/SummaryPanel"
import { PageBackground } from "@/components/ui/PageBackground"
import { usePomodoro } from "@/hooks/usePomodoro"
import { useSessionRestore } from "@/hooks/useSessionRestore"

export function MainContent() {
  const { status } = useSessionStore()
  usePomodoro()
  useSessionRestore()

  return (
    <div className="relative h-full">
      <PageBackground />
      <div className="relative z-10 h-full">
        {status === "ended" ? <SummaryPanel /> : <TaskList />}
      </div>
    </div>
  )
}
