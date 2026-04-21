"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PageBackground } from "@/components/ui/PageBackground"

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
  dev: "bg-[#1a2a1a] text-accent border-accent-border",
  design: "bg-[#1a1a2e] text-[#7c7cff] border-[#2a2a4a]",
  urgent: "bg-[#2a1a1a] text-red-400 border-[#4a2d2d]",
  autre: "bg-[#1e1e1e] text-neutral-500 border-[#2a2a2a]",
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
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-neutral-600 text-sm py-8 text-center"
      >
        Aucun historique pour le moment
      </motion.p>
    )
  }

  return (
    <div className="relative">
      <PageBackground />
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative z-10"
    >
      <h2 className="text-white text-base font-medium mb-5">Historique complet</h2>
      <div className="flex flex-col gap-6">
        {days.map((day, dayIndex) => {
          const tasks = grouped[day]
          const completed = tasks.filter((t) => t.completed).length
          const pomodoros = tasks.reduce((acc, t) => acc + t.pomodoros.length, 0)

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.06, duration: 0.3 }}
            >
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
                {tasks.map((task, taskIndex) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: dayIndex * 0.06 + taskIndex * 0.03,
                      duration: 0.22,
                    }}
                    className="flex items-center gap-3 bg-[#161616] border border-[#222] rounded-xl px-3 py-2.5"
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors ${
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
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
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
    </div>
  )
}
