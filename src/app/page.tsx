import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <div className="text-center">
        <h1 className="text-white text-2xl mb-2">Dashboard — bientôt prêt</h1>
        <p className="text-neutral-500 text-sm">
          Connecté en tant que {session.user?.name}
        </p>
      </div>
    </div>
  )
}
