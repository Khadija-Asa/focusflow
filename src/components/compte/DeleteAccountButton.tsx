"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export function DeleteAccountButton() {
  const [step, setStep] = useState<"idle" | "confirm" | "loading">("idle")
  const [input, setInput] = useState("")
  const router = useRouter()

  const handleDelete = async () => {
    if (input !== "SUPPRIMER") return
    setStep("loading")

    await fetch("/api/account", { method: "DELETE" })
    router.push("/login")
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {step === "idle" && (
          <motion.button
            key="trigger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStep("confirm")}
            className="text-sm text-red-500/70 hover:text-red-400 border border-red-900/30 hover:border-red-500/40 rounded-xl px-4 py-2.5 transition-colors"
          >
            Supprimer mon compte
          </motion.button>
        )}

        {(step === "confirm" || step === "loading") && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-[#1a0f0f] border border-red-900/40 rounded-xl p-4 flex flex-col gap-3"
          >
            <div>
              <p className="text-sm text-white font-medium mb-1">
                Cette action est irréversible
              </p>
              <p className="text-xs text-neutral-500">
                Toutes tes données seront supprimées définitivement : sessions, tâches, pomodoros.
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-600 mb-1.5">
                Tape <span className="text-red-400 font-mono">SUPPRIMER</span> pour confirmer
              </p>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="SUPPRIMER"
                className="w-full bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-700 outline-none focus:border-red-900/60 font-mono"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setStep("idle"); setInput("") }}
                disabled={step === "loading"}
                className="flex-1 py-2 rounded-lg border border-[#2a2a2a] text-neutral-500 text-xs hover:border-[#444] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={input !== "SUPPRIMER" || step === "loading"}
                className="flex-1 py-2 rounded-lg bg-red-900/40 border border-red-900/50 text-red-400 text-xs hover:bg-red-900/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {step === "loading" ? "Suppression..." : "Confirmer"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
