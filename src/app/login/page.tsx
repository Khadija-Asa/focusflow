import { auth, signIn } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LoginBackground } from "@/components/login/LoginBackground"
import { LoginCard } from "@/components/login/LoginCard"

export default async function LoginPage() {
  const session = await auth()

  if (session) {
    redirect("/")
  }

  const action = async () => {
    "use server"
    await signIn("github", { redirectTo: "/" })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f0f0f] overflow-hidden">
      <LoginBackground />
      <LoginCard action={action} />
    </div>
  )
}
