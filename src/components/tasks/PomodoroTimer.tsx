"use client"

import { usePomodoroStore } from "@/stores/pomodoroStore"
import { useSessionStore } from "@/stores/sessionStore"
import clsx from "clsx"

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

type Props = {
  taskId: string
  estimatedMin: number | null
}

export function PomodoroTimer({ taskId, estimatedMin }: Props) {
  const { activeTaskId, secondsLeft, isRunning, start, stop } = usePomodoroStore()
  const { status: sessionStatus, workSessionId } = useSessionStore()

  const isThisTask = activeTaskId === taskId
  const isOtherTask = isRunning && !isThisTask
  const duration = estimatedMin ?? 25

  const handleStart = () => {
    if (!workSessionId) return
    start(taskId, duration)
  }

  if (isThisTask) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-accent tabular-nums">
          {formatTime(secondsLeft)}
        </span>
        <button
          onClick={stop}
          className="text-[10px] px-2 py-1 rounded-md border border-[#3a3a3a] text-neutral-500 hover:text-red-400 hover:border-red-400/30 transition-colors"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleStart}
      disabled={isOtherTask || sessionStatus !== "active"}
      title={
        sessionStatus !== "active"
          ? "Lance d'abord ta session de travail"
          : isOtherTask
          ? "Un timer est déjà en cours"
          : `Lancer ${duration} min`
      }
      className={clsx(
        "text-[10px] px-2 py-1 rounded-md border transition-colors",
        sessionStatus !== "active" || isOtherTask
          ? "border-[#222] text-neutral-700 cursor-not-allowed"
          : "border-[#2a2a2a] text-neutral-500 hover:text-accent hover:border-accent-border hover:bg-accent-dim"
      )}
    >
      ▶ {duration}min
    </button>
  )
}