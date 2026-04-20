"use client"

import { SessionStatus } from "@/types"

type SidebarProps = {
  status: SessionStatus
}

export function Sidebar({ status }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#111] border-r border-[#1e1e1e] flex flex-col p-4 flex-shrink-0">
      <div className="bg-[#1a2a1a] border border-[#2d4a2d] rounded-xl p-3 mb-4">
        <p className="text-[10px] text-accent uppercase tracking-widest mb-1">
          {status === "active" ? "Session en cours" : "Aucune session"}
        </p>
        <p className="text-2xl font-medium text-white tracking-tight tabular-nums">
          00:00:00
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

      <div className="mt-auto">
        {status === "idle" && (
          <button className="w-full py-2.5 bg-accent text-[#0a1a0a] text-sm font-medium rounded-xl hover:bg-accent/90 transition-colors">
            Travail commencé
          </button>
        )}
        {status === "active" && (
          <button className="w-full py-2.5 bg-transparent border border-[#3a3a3a] text-neutral-500 text-sm rounded-xl hover:border-[#555] transition-colors">
            Travail terminé
          </button>
        )}
      </div>
    </aside>
  )
}