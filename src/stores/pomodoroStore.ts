import { create } from "zustand"

type PomodoroStore = {
  activeTaskId: string | null
  secondsLeft: number
  isRunning: boolean
  start: (taskId: string, durationMinutes: number) => void
  tick: () => void
  stop: () => void
  complete: () => void
}

export const usePomodoroStore = create<PomodoroStore>((set) => ({
  activeTaskId: null,
  secondsLeft: 0,
  isRunning: false,

  start: (taskId, durationMinutes) =>
    set({
      activeTaskId: taskId,
      secondsLeft: durationMinutes * 60,
      isRunning: true,
    }),

  tick: () =>
    set((state) => ({
      secondsLeft: state.secondsLeft - 1,
    })),

  stop: () =>
    set({
      activeTaskId: null,
      secondsLeft: 0,
      isRunning: false,
    }),

  complete: () =>
    set({
      activeTaskId: null,
      secondsLeft: 0,
      isRunning: false,
    }),
}))