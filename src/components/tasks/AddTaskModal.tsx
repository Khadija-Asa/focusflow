"use client"

import { useState } from "react"
import { useTaskStore } from "@/stores/taskStore"
import clsx from "clsx"

const TAGS = ["dev", "design", "urgent", "autre"] as const

type Props = {
  onClose: () => void
}

export function AddTaskModal({ onClose }: Props) {
  const { addTask } = useTaskStore()
  const [title, setTitle] = useState("")
  const [estimatedMin, setEstimatedMin] = useState("")
  const [tag, setTag] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return
    setLoading(true)
    await addTask(title.trim(), estimatedMin ? Number(estimatedMin) : undefined, tag ?? undefined)
    setLoading(false)
    onClose()
  }

  return (
    <div
      className="absolute inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#161616] border border-[#2a2a2a] rounded-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-base font-medium mb-4">
          Nouvelle tâche
        </h2>

        <input
          autoFocus
          type="text"
          placeholder="Nom de la tâche..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-[#444] mb-3"
        />

        <input
          type="number"
          placeholder="Durée estimée (minutes)"
          value={estimatedMin}
          onChange={(e) => setEstimatedMin(e.target.value)}
          className="w-full bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 outline-none focus:border-[#444] mb-3"
        />

        <div className="flex gap-2 mb-5">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(tag === t ? null : t)}
              className={clsx(
                "text-xs px-3 py-1.5 rounded-full border transition-colors",
                tag === t
                  ? "bg-accent-dim border-accent-border text-accent"
                  : "bg-[#1e1e1e] border-[#2a2a2a] text-neutral-500 hover:border-[#444]"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#2a2a2a] text-neutral-500 text-sm hover:border-[#444] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || loading}
            className="flex-1 py-2.5 rounded-xl bg-accent text-[#0a1a0a] text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-40"
          >
            {loading ? "Ajout..." : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  )
}