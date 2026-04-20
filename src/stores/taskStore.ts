import { create } from "zustand"
import { Task } from "@/types"

type TaskStore = {
  todayTasks: Task[]
  yesterdayTasks: Task[]
  isLoading: boolean
  fetchTasks: () => Promise<void>
  addTask: (title: string, estimatedMin?: number, tag?: string) => Promise<void>
  completeTask: (id: string) => Promise<void>
  moveToToday: (id: string) => Promise<void>
  dismissYesterday: (id: string) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  todayTasks: [],
  yesterdayTasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true })
    const res = await fetch("/api/tasks")
    const data = await res.json()
    set({
      todayTasks: data.todayTasks,
      yesterdayTasks: data.yesterdayUnfinished,
      isLoading: false,
    })
  },

  addTask: async (title, estimatedMin, tag) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, estimatedMin, tag }),
    })
    const newTask = await res.json()
    set((state) => ({
      todayTasks: [...state.todayTasks, newTask],
    }))
  },

  completeTask: async (id) => {
    set((state) => ({
      todayTasks: state.todayTasks.map((t) =>
        t.id === id ? { ...t, completed: true } : t
      ),
    }))
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    })
  },

  moveToToday: async (id) => {
    const task = get().yesterdayTasks.find((t) => t.id === id)
    if (!task) return
    set((state) => ({
      yesterdayTasks: state.yesterdayTasks.filter((t) => t.id !== id),
      todayTasks: [...state.todayTasks, { ...task, scheduledFor: new Date() }],
    }))
    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledFor: new Date() }),
    })
  },

  dismissYesterday: (id) => {
    set((state) => ({
      yesterdayTasks: state.yesterdayTasks.filter((t) => t.id !== id),
    }))
  },
}))