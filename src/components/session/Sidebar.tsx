"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSessionStore } from "@/stores/sessionStore"
import { useSessionTimer } from "@/hooks/useSessionTimer"
import { useCallback } from "react"

const NAV_ITEMS = [
  { label: "Aujourd'hui", href: "/" },
  { label: "Semaine", href: "/semaine" },
  { label: "Historique", href: "/historique" },
]

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":")
}

export function Sidebar() {
  const { status, elapsed, start, end, workSessionId } = useSessionStore()
  const pathname = usePathname()
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
      <motion.div
        animate={
          status === "active"
            ? {
                boxShadow: [
                  "0 0 0px rgba(74,222,128,0)",
                  "0 0 12px rgba(74,222,128,0.12)",
                  "0 0 0px rgba(74,222,128,0)",
                ],
              }
            : { boxShadow: "0 0 0px rgba(74,222,128,0)" }
        }
        transition={
          status === "active"
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
        className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-xl p-6 mb-5"
      >
        <div className="flex items-center gap-2 mb-2">
          {status === "active" && (
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0"
            />
          )}
          <p className="text-[10px] text-accent uppercase tracking-widest">
            {status === "active" ? "Session en cours" : "Aucune session"}
          </p>
        </div>
        <p className="text-2xl mt-2 font-medium text-white tracking-tight tabular-nums">
          {formatTime(elapsed)}
        </p>
        <p className="text-xs text-neutral-600 mt-1">
          {status === "active" ? "En cours..." : "Lance ta journée"}
        </p>
      </motion.div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[#1e1e1e] text-white"
                  : "text-neutral-600 hover:text-neutral-400"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  active ? "bg-accent" : "bg-[#333]"
                }`}
              />
              {item.label}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[#1e1e1e] rounded-lg -z-10"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.button
              key="start"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={handleStart}
              className="w-full py-2.5 bg-accent text-[#0a1a0a] text-sm font-medium rounded-xl hover:bg-accent/90 transition-colors"
            >
              Démarrer la session
            </motion.button>
          )}
          {status === "active" && (
            <motion.button
              key="end"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              onClick={handleEnd}
              className="w-full py-2.5 bg-transparent border border-[#3a3a3a] text-neutral-500 text-sm rounded-xl hover:border-[#555] transition-colors"
            >
              Terminer la session
            </motion.button>
          )}
          {status === "ended" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-xl px-4 py-4 flex flex-col items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
                className="w-8 h-8 rounded-full bg-accent/10 border border-accent-border flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-accent" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 8l4 4 8-8" />
                </svg>
              </motion.div>
              <p className="text-sm font-medium text-white">Bonne journée !</p>
              <p className="text-[10px] text-neutral-600 text-center">Session terminée avec succès</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-[#1a1a1a]">
          <Link href="/compte" className="text-[10px] text-neutral-700 hover:text-neutral-500 transition-colors">
            Mon compte
          </Link>
          <span className="text-neutral-800 text-[10px]">·</span>
          <Link href="/mentions-legales" className="text-[10px] text-neutral-700 hover:text-neutral-500 transition-colors">
            Mentions légales
          </Link>
          <span className="text-neutral-800 text-[10px]">·</span>
          <Link href="/confidentialite" className="text-[10px] text-neutral-700 hover:text-neutral-500 transition-colors">
            Confidentialité
          </Link>
        </div>
      </div>
    </aside>
  )
}
