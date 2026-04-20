"use client"

import { useSessionStore } from "@/stores/sessionStore"
import { useSessionTimer } from "@/hooks/useSessionTimer"
import { useCallback } from "react"

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":")
}

export function Sidebar() {
  const { status, elapsed, start, end, workSessionId } = useSessionStore()
  useSessionTimer()

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
    <aside className="w-90 bg-[#111] border-r border-[#1e1e1e] flex flex-col p-4 flex-shrink-0">
      <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-xl p-6 mb-5">
        <p className="text-[10px] text-accent uppercase tracking-widest mb-2">
          {status === "active" ? "Session en cours" : "Aucune session"}
        </p>
        <p className="text-2xl mt-4 font-medium text-white tracking-tight tabular-nums">
          {formatTime(elapsed)}
        </p>
        <p className="text-xs text-neutral-600 mt-1">
          {status === "active" ? "En cours..." : "Lance ta journée"}
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {[
          { label: "Aujourd'hui", active: true },
          { label: "Semaine", active: false },
          { label: "Statistiques", active: false },
          { label: "Historique", active: false },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
              item.active
                ? "bg-[#1e1e1e] text-white"
                : "text-neutral-600 hover:text-neutral-400"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                item.active ? "bg-accent" : "bg-[#333]"
              }`}
            />
            {item.label}
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        {status === "idle" && (
          <button
            onClick={handleStart}
            className="w-full py-2.5 bg-accent text-[#0a1a0a] text-sm font-medium rounded-xl hover:bg-accent/90 transition-colors"
          >
            Démarrer la session
          </button>
        )}
        {status === "active" && (
          <button
            onClick={handleEnd}
            className="w-full py-2.5 bg-transparent border border-[#3a3a3a] text-neutral-500 text-sm rounded-xl hover:border-[#555] transition-colors"
          >
            Terminer la session
          </button>
        )}
        {status === "ended" && (
          <p className="text-center text-xs text-accent">
            Bonne journée !
          </p>
        )}
      </div>
    </aside>
  )
}