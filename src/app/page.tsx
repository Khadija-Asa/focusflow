import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Topbar } from "@/components/ui/Topbar"
import { Sidebar } from "@/components/session/Sidebar"

export default async function HomePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f]">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <p className="text-neutral-600 text-sm">Zone principale — bientôt prêt</p>
        </main>
      </div>
    </div>
  )
}
