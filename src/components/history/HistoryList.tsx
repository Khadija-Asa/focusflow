"use client"

import { useEffect, useState } from "react"

type Pomodoro = { id: string; completed: boolean }
type Task = {
  id: string
  title: string
  completed: boolean
  tag: string | null
  pomodoros: Pomodoro[]
  scheduledFor: string
}

const TAG_COLORS: Record<string, string> = {
  dev: "bg-blue-900/40 text-blue-400 border-blue-800",
  design: "bg-purple-900/40 text-purple-400 border-purple-800",
  urgent: "bg-red-900/40 text-red-400 border-red-800",
  autre: "bg-neutral-800 text-neutral-400 border-neutral-700",
}

const MONTH_LABELS = [
  "jan", "fév", "mar", "avr", "mai", "jun",
  "jul", "aoû", "sep", "oct", "nov", "déc",
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate()} ${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`
}

export function HistoryList() {
  const [grouped, setGrouped] = useState<Record<string, Task[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((d) => {
        setGrouped(d)
        setLoading(false)
      })
  }, [])

  const days = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1))

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[#161616] rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (days.length === 0) {
    return (
      <p className="text-neutral-600 text-sm py-8 text-center">
        Aucun historique pour le moment
      </p>
    )
  }

  return (
    <div>
      <h2 className="text-white text-base font-medium mb-5">Historique complet</h2>
      <div className="flex flex-col gap-6">
        {days.map((day) => {
          const tasks = grouped[day]
          const completed = tasks.filter((t) => t.completed).length
          const pomodoros = tasks.reduce((acc, t) => acc + t.pomodoros.length, 0)

          return (
            <div key={day}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-0.5 h-3 bg-accent rounded" />
                  <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                    {formatDate(day)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-neutral-600">
                  <span>{completed}/{tasks.length} tâches</span>
                  {pomodoros > 0 && <span>{pomodoros} 🍅</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 bg-[#161616] border border-[#222] rounded-xl px-3 py-2.5"
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center ${
                        task.completed
                          ? "bg-accent border-accent"
                          : "border-[#444]"
                      }`}
                    >
                      {task.completed && (
                        <svg
                          className="w-2 h-2 text-[#0a1a0a]"
                          fill="none"
                          viewBox="0 0 12 12"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2 6l3 3 5-5"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-sm flex-1 ${
                        task.completed
                          ? "line-through text-neutral-600"
                          : "text-neutral-300"
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2">
                      {task.pomodoros.length > 0 && (
                        <span className="text-[11px] text-neutral-600">
                          {task.pomodoros.length} 🍅
                        </span>
                      )}
                      {task.tag && (
                        <span
                          className={`text-[10px] border rounded-full px-2 py-0.5 ${
                            TAG_COLORS[task.tag] ?? TAG_COLORS.autre
                          }`}
                        >
                          {task.tag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
