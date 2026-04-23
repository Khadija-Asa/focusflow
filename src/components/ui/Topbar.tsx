import { auth, signOut } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

function getInitials(name?: string | null) {
  if (!name) return "?"
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export async function Topbar() {
  const session = await auth()
  const initials = getInitials(session?.user?.name)

  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <header className="relative h-14 bg-[#111] flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-20">
      {/* gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#2f2f2f] to-transparent" />

      {/* logo */}
      <Link href="/" className="text-sm font-semibold text-white tracking-tight hover:opacity-80 transition-opacity">
        Focus<span className="text-accent">Flow</span>
      </Link>

      {/* date — centre */}
      <div className="hidden md:flex items-center gap-2 text-xs text-neutral-600">
        <div className="w-1 h-1 rounded-full bg-accent/40" />
        <span className="capitalize">{date}</span>
      </div>

      {/* user + logout */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-accent-dim border border-accent-border flex items-center justify-center text-[11px] font-semibold text-accent select-none">
            {initials}
          </div>
          <span className="hidden sm:block text-xs text-neutral-400">
            {session?.user?.name}
          </span>
        </div>

        <div className="w-px h-4 bg-[#2a2a2a]" />

        <form
          action={async () => {
            "use server"
            const s = await auth()
            if (s?.user?.id) {
              const githubAccount = await prisma.account.findFirst({
                where: { userId: s.user.id, provider: "github" },
              })

              await prisma.workSession.updateMany({
                where: { userId: s.user.id, endedAt: null },
                data: { endedAt: new Date() },
              })

              if (githubAccount?.access_token) {
                const basicAuth = Buffer.from(
                  `${process.env.GITHUB_ID}:${process.env.GITHUB_SECRET}`
                ).toString("base64")
                await fetch(
                  `https://api.github.com/applications/${process.env.GITHUB_ID}/grant`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Basic ${basicAuth}`,
                      "Content-Type": "application/json",
                      Accept: "application/vnd.github+json",
                    },
                    body: JSON.stringify({ access_token: githubAccount.access_token }),
                  }
                )
              }
            }
            await signOut({ redirectTo: "/login" })
          }}
          className="flex items-center"
        >
          <button
            type="submit"
            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-400 transition-colors cursor-pointer group"
          >
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
              <path d="M10 11l3-3-3-3" />
              <path d="M13 8H6" />
            </svg>
            <span className="hidden sm:block">Déconnexion</span>
          </button>
        </form>
      </div>
    </header>
  )
}
