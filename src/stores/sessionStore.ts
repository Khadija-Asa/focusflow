import { create } from "zustand"
import { SessionStatus } from "@/types"

type SessionStore = {
  status: SessionStatus
  startedAt: Date | null
  elapsed: number
  workSessionId: string | null
  start: (workSessionId: string) => void
  end: () => void
  tick: () => void
  reset: () => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  status: "idle",
  startedAt: null,
  elapsed: 0,
  workSessionId: null,

  start: (workSessionId) =>
    set({
      status: "active",
      startedAt: new Date(),
      elapsed: 0,
      workSessionId,
    }),

  end: () =>
    set({
      status: "ended",
      startedAt: null,
      elapsed: 0,
    }),

  tick: () =>
    set((state) => ({
      elapsed: state.elapsed + 1,
    })),

  reset: () =>
    set({
      status: "idle",
      startedAt: null,
      elapsed: 0,
      workSessionId: null,
    }),

}))