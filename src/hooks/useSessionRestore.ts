"use client"

import { useEffect } from "react"
import { useSessionStore } from "@/stores/sessionStore"

export function useSessionRestore() {
  const { status, restore } = useSessionStore()

  useEffect(() => {
    if (status !== "idle") return

    fetch("/api/sessions/current")
      .then((r) => r.json())
      .then((data) => {
        if (data.session) {
          restore(data.session.id, data.session.elapsed)
        }
      })
      .catch(() => {})
  }, [])
}
