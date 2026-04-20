import { Task, WorkSession } from "@/types"
import { formatDuration, intervalToDuration } from "date-fns"
import { fr } from "date-fns/locale"

type SummaryInput = {
  workSession: WorkSession
  tasks: Task[]
}

export function generateSummary({ workSession, tasks }: SummaryInput): string {
  const completed = tasks.filter((t) => t.completed)
  const missed = tasks.filter((t) => !t.completed)
  const totalPomodoros = tasks.reduce((acc, t) => acc + t.pomodoros.length, 0)
  const completionRate = tasks.length > 0
    ? Math.round((completed.length / tasks.length) * 100)
    : 0

  const duration = workSession.endedAt
    ? intervalToDuration({
        start: workSession.startedAt,
        end: workSession.endedAt,
      })
    : null

  const durationText = duration
    ? formatDuration(duration, { locale: fr, delimiter: " et " })
    : "quelques minutes"

  const lines: string[] = []

  lines.push(`Journée terminée — voici ton bilan.\n`)

  if (duration) {
    lines.push(`⏱ Durée totale : ${durationText}`)
  }

  lines.push(`✅ Tâches complétées : ${completed.length} sur ${tasks.length} (${completionRate}%)`)

  if (totalPomodoros > 0) {
    lines.push(`🍅 Sessions focus : ${totalPomodoros} pomodoro${totalPomodoros > 1 ? "s" : ""}`)
  }

  if (completed.length > 0) {
    lines.push(`\nCe que tu as accompli :`)
    completed.forEach((t) => {
      lines.push(`  · ${t.title}`)
    })
  }

  if (missed.length > 0) {
    lines.push(`\nTâches non terminées :`)
    missed.forEach((t) => {
      lines.push(`  · ${t.title}`)
    })
  }

  return lines.join("\n")
}