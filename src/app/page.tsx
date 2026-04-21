import type { Metadata } from "next"
import { auth } from "@/lib/auth"

export const metadata: Metadata = { title: "Aujourd'hui — FocusFlow" }
import { redirect } from "next/navigation"
import { Topbar } from "@/components/ui/Topbar"
import { Sidebar } from "@/components/session/Sidebar"
import { MainContent } from "@/components/ui/MainContent"
import { BottomBar } from "@/components/session/BottomBar"

export default async function HomePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f]">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          <MainContent />
        </main>
      </div>
      <div className="md:hidden">
        <BottomBar />
      </div>
    </div>
  )
}
