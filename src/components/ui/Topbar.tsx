import { auth, signOut } from "@/lib/auth"

export async function Topbar() {
  const session = await auth()

  return (
    <header className="h-14 bg-[#161616] border-b border-[#2a2a2a] flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-white">
          Focus<span className="text-accent">Flow</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral-500 bg-[#1e1e1e] border border-[#2a2a2a] rounded-full px-3 py-1">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </span>

        <div className="flex items-center gap-2">
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt={session.user.name ?? "avatar"}
              className="w-7 h-7 rounded-full"
            />
          )}
          <span className="text-xs text-neutral-400">
            {session?.user?.name}
          </span>
        </div>

        <form
          action={async () => {
            "use server"
            await signOut({ redirectTo: "/login" })
          }}
        >
          <button
            type="submit"
            className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
          >
            Déconnexion
          </button>
        </form>
      </div>
    </header>
  )
}