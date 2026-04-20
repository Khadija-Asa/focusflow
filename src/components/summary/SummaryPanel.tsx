"use client"

import { useEffect, useState } from "react"
import { useSessionStore } from "@/stores/sessionStore"
import { useTaskStore } from "@/stores/taskStore"
import { TypewriterText } from "./TypewriterText"

export function SummaryPanel() {
  const { workSessionId, status } = useSessionStore()
  const { fetchTasks } = useTaskStore()
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (status !== "ended" || !workSessionId) return

    const fetchSummary = async () => {
      setLoading(true)
      const res = await fetch("/api/sessions/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workSessionId }),
      })
      const data = await res.json()
      setSummary(data.summary)
      setLoading(false)
    }

    fetchSummary()
  }, [status, workSessionId])

  if (status !== "ended") return null

  return (
    <div className="h-full flex flex-col">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-white text-base font-medium">
          Bilan de ta journée
        </h2>
        {done && (
          <button
            onClick={() => {
              useSessionStore.getState().reset()
              useTaskStore.getState().fetchTasks()
            }}
            className="text-xs text-accent bg-accent-dim border border-accent-border rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors"
          >
            Nouvelle journée
          </button>
        )}
      </div>

      <div className="bg-[#161616] border border-[#2a2a2a] rounded-2xl p-6 flex-1">
        {loading ? (
          <div className="flex items-center gap-2 text-neutral-600 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Analyse de ta journée...
          </div>
        ) : summary ? (
          <TypewriterText
            text={summary}
            speed={15}
            onComplete={() => setDone(true)}
          />
        ) : null}
      </div>
    </div>
  )
}