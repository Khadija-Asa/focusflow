"use client"

import { useEffect } from "react"
import { usePomodoroStore } from "@/stores/pomodoroStore"
import { useSessionStore } from "@/stores/sessionStore"
import { useTaskStore } from "@/stores/taskStore"

export function usePomodoro() {
  const { isRunning, activeTaskId, secondsLeft, tick, complete } = usePomodoroStore()
  const { workSessionId } = useSessionStore()
  const { fetchTasks } = useTaskStore()

  useEffect(() => {
    if (!isRunning) return

    if (secondsLeft <= 0) {
      const save = async () => {
        if (!activeTaskId || !workSessionId) return

        await fetch("/api/pomodoros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ taskId: activeTaskId, workSessionId }),
        })

        complete()
        fetchTasks()
      }

      save()
      return
    }

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, secondsLeft, activeTaskId, workSessionId, tick, complete, fetchTasks])
}