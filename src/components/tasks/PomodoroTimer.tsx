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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 5v3.5l2 1.5" />
    </svg>
  )
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
        <div className="flex items-center gap-1.5 bg-accent/10 border border-accent-border rounded-lg px-2.5 py-1.5">
          <ClockIcon className="w-3.5 h-3.5 text-accent animate-pulse" />
          <span className="text-sm font-semibold text-accent tabular-nums tracking-tight">
            {formatTime(secondsLeft)}
          </span>
        </div>
        <button
          onClick={stop}
          className="text-[11px] px-2 py-1.5 rounded-lg border border-[#3a3a3a] text-neutral-500 hover:text-red-400 hover:border-red-400/30 transition-colors"
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
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors",
        sessionStatus !== "active" || isOtherTask
          ? "border-[#222] text-neutral-700 cursor-not-allowed"
          : "border-[#2a2a2a] text-neutral-400 hover:text-accent hover:border-accent-border hover:bg-accent-dim"
      )}
    >
      <ClockIcon className="w-3.5 h-3.5" />
      <span className="text-xs font-medium">{duration} min</span>
    </button>
  )
}
