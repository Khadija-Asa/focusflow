"use client"

import { useEffect } from "react"
import { useSessionStore } from "@/stores/sessionStore"

export function useSessionTimer() {
  const { status, tick } = useSessionStore()

  useEffect(() => {
    if (status !== "active") return

    const interval = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [status, tick])
}