export type SessionStatus = "idle" | "active" | "ended"

export type WorkSession = {
  id: string
  startedAt: Date
  endedAt: Date | null
  userId: string
  pomodoros: Pomodoro[]
}

export type Pomodoro = {
  id: string
  startedAt: Date
  endedAt: Date | null
  completed: boolean
  taskId: string
  workSessionId: string
}

export type Task = {
  id: string
  title: string
  completed: boolean
  scheduledFor: Date
  completedAt: Date | null
  estimatedMin: number | null
  tag: string | null
  createdAt: Date
  userId: string
  workSessionId: string | null
  pomodoros: Pomodoro[]
}
