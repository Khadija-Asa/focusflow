import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Topbar } from "@/components/ui/Topbar"
import { Sidebar } from "@/components/session/Sidebar"
import { BottomBar } from "@/components/session/BottomBar"
import { DeleteAccountButton } from "@/components/compte/DeleteAccountButton"

export const metadata: Metadata = { title: "Mon compte — FocusFlow" }

export default async function ComptePage() {
  const session = await auth()

  if (!session) redirect("/login")

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f]">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 max-w-xl">
          <h2 className="text-white text-base font-medium mb-6">Mon compte</h2>

          <div className="bg-[#161616] border border-[#222] rounded-2xl p-5 mb-4">
            <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-3">Profil</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-dim border border-accent-border flex items-center justify-center text-sm font-semibold text-accent">
                {session.user?.name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <p className="text-sm text-white">{session.user?.name}</p>
                <p className="text-xs text-neutral-600">{session.user?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#161616] border border-[#222] rounded-2xl p-5">
            <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-1">Zone de danger</p>
            <p className="text-xs text-neutral-600 mb-4">
              La suppression est définitive. Toutes tes données seront effacées conformément au RGPD.
            </p>
            <DeleteAccountButton />
          </div>
        </main>
      </div>
      <div className="md:hidden">
        <BottomBar />
      </div>
    </div>
  )
}
