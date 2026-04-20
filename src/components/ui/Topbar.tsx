import { auth, signOut } from "@/lib/auth"

export async function Topbar() {
  const session = await auth()

  return (
    <header className="h-14 bg-[#161616] border-b border-[#2a2a2a] flex items-center justify-between px-4 md:px-5 flex-shrink-0">
      <span className="text-sm font-medium text-white">
        Focus<span className="text-accent">Flow</span>
      </span>

      <div className="flex items-center gap-5">
        <span className="hidden sm:block text-xs text-neutral-500 bg-[#1e1e1e] border border-[#2a2a2a] rounded-full px-3 py-1">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </span>

        <div className="flex items-center gap-5">
          
          <span className="hidden sm:block text-xs text-neutral-400">
            {session?.user?.name}
          </span>
          
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
            className="flex items-center"
          >
            <button
              type="submit"
              className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}