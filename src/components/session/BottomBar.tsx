"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSessionStore } from "@/stores/sessionStore"
import { useCallback } from "react"

const NAV_ITEMS = [
  {
    label: "Aujourd'hui",
    href: "/",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="14" height="13" rx="2" />
        <path d="M3 9h14M7 3v4M13 3v4" />
      </svg>
    ),
  },
  {
    label: "Semaine",
    href: "/semaine",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 14l4-5 3 3 4-6 3 4" />
      </svg>
    ),
  },
  {
    label: "Historique",
    href: "/historique",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7" />
        <path d="M10 6v4.5l3 2" />
      </svg>
    ),
  },
]

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":")
}

export function BottomBar() {
  const { status, elapsed, start, end, workSessionId } = useSessionStore()
  const pathname = usePathname()

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
    <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#1e1e1e] flex flex-col">

      {/* session bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2.5">
          <AnimatePresence mode="wait">
            {status === "active" ? (
              <motion.div
                key="active-dot"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-accent"
              />
            ) : (
              <div key="idle-dot" className="w-1.5 h-1.5 rounded-full bg-[#333]" />
            )}
          </AnimatePresence>
          <span className="text-white text-xs tabular-nums font-medium">
            {formatTime(elapsed)}
          </span>
          <span className="text-neutral-600 text-[11px]">
            {status === "active" ? "En cours" : status === "ended" ? "Terminée" : "Aucune session"}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.button
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={handleStart}
              className="bg-accent text-[#0a1a0a] text-[11px] font-medium px-3.5 py-1.5 rounded-lg"
            >
              Démarrer
            </motion.button>
          )}
          {status === "active" && (
            <motion.button
              key="end"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={handleEnd}
              className="border border-[#3a3a3a] text-neutral-500 text-[11px] px-3.5 py-1.5 rounded-lg"
            >
              Terminer
            </motion.button>
          )}
          {status === "ended" && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5"
            >
              <div className="w-4 h-4 rounded-full bg-accent/10 border border-accent-border flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-accent" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 6l3 3 5-5" />
                </svg>
              </div>
              <span className="text-accent text-[11px] font-medium">Bonne journée !</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* navigation */}
      <div className="flex items-center justify-around px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
                active ? "text-accent" : "text-neutral-600 hover:text-neutral-400"
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <motion.div
                  layoutId="bottombar-active"
                  className="absolute bottom-1.5 w-1 h-1 rounded-full bg-accent"
                  transition={{ duration: 0.2 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
