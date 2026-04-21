"use client"

import { useSessionStore } from "@/stores/sessionStore"
import { useCallback } from "react"

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":")
}

export function BottomBar() {
  const { status, elapsed, start, end, workSessionId } = useSessionStore()

  const handleStart = useCallback(async () => {
    const res = await fetch("/api/sessions/start", { method: "POST" })
    const data = await res.json()
    start(data.id)
  }, [start])

  const handleEnd = useCallback(async () => {
    if (!workSessionId) return
    await fetch("/api/sessions/end", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workSessionId }),
    })
    end()
  }, [workSessionId, end])

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#1e1e1e] px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div
          className={`w-2 h-2 rounded-full ${
            status === "active" ? "bg-accent animate-pulse" : "bg-[#333]"
          }`}
        />
        <span className="text-white text-sm tabular-nums font-medium">
          {formatTime(elapsed)}
        </span>
        <span className="text-neutral-600 text-xs">
          {status === "active" ? "En cours" : "Aucune session"}
        </span>
      </div>

      {status === "idle" && (
        <button
          onClick={handleStart}
          className="bg-accent text-[#0a1a0a] text-xs font-medium px-4 py-2 rounded-xl hover:bg-accent/90 transition-colors"
        >
          Travail commencé
        </button>
      )}
      {status === "active" && (
        <button
          onClick={handleEnd}
          className="border border-[#3a3a3a] text-neutral-500 text-xs px-4 py-2 rounded-xl hover:border-[#555] transition-colors"
        >
          Travail terminé
        </button>
      )}
      {status === "ended" && (
        <span className="text-accent text-xs">Bonne journée !</span>
      )}
    </div>
  )
}