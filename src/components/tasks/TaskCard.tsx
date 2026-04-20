"use client"

import { Task } from "@/types"
import { useTaskStore } from "@/stores/taskStore"
import clsx from "clsx"

const TAG_STYLES: Record<string, string> = {
  design: "bg-[#1a1a2e] text-[#7c7cff] border-[#2a2a4a]",
  dev: "bg-[#1a2a1a] text-accent border-accent-border",
  urgent: "bg-[#2a1a1a] text-red-400 border-[#4a2d2d]",
  autre: "bg-[#1e1e1e] text-neutral-500 border-[#2a2a2a]",
}

type TaskCardProps = {
  task: Task
  variant?: "today" | "yesterday"
}

export function TaskCard({ task, variant = "today" }: TaskCardProps) {
  const { completeTask, moveToToday, dismissYesterday, deleteTask } = useTaskStore()

  return (
    <div
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl border transition-opacity",
        variant === "today"
          ? "bg-[#161616] border-[#222]"
          : "bg-[#1a1510] border-[#3a2d1a]",
        task.completed && "opacity-40"
      )}
    >
      <button
        onClick={() => completeTask(task.id, !task.completed)}
        className={clsx(
          "w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-colors",
          task.completed
            ? "bg-accent border-accent"
            : variant === "today"
            ? "border-[#333] hover:border-accent"
            : "border-[#3a2d1a] hover:border-accent"
        )}
      >
        {task.completed && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#0a1a0a]" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={clsx(
            "text-sm truncate",
            task.completed
              ? "line-through text-neutral-600"
              : variant === "today"
              ? "text-neutral-200"
              : "text-[#c0a878]"
          )}
        >
          {task.title}
        </p>
        {task.estimatedMin && (
          <p className="text-xs text-neutral-600 mt-0.5">
            ~{task.estimatedMin} min
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {task.pomodoros.length > 0 && (
          <div className="flex gap-1">
            {task.pomodoros.map((p) => (
              <div
                key={p.id}
                className={clsx(
                  "w-1.5 h-1.5 rounded-full",
                  p.completed ? "bg-accent" : "bg-[#2a2a2a]"
                )}
              />
            ))}
          </div>
        )}

        {task.tag && (
          <span
            className={clsx(
              "text-[10px] px-2 py-0.5 rounded-full border",
              TAG_STYLES[task.tag] ?? TAG_STYLES.autre
            )}
          >
            {task.tag}
          </span>
        )}

        {variant === "yesterday" && (
          <div className="flex gap-1 ml-1">
            <button
              onClick={() => moveToToday(task.id)}
              className="text-[10px] px-2 py-1 rounded-md border border-[#2a2a2a] text-neutral-500 hover:text-accent hover:border-accent-border hover:bg-accent-dim transition-colors"
            >
              + Aujourd'hui
            </button>
            <button
              onClick={() => dismissYesterday(task.id)}
              className="text-[10px] px-2 py-1 rounded-md border border-[#2a2a2a] text-neutral-600 hover:text-neutral-400 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {variant === "today" && (
        <button
          onClick={() => deleteTask(task.id)}
          className="text-neutral-700 hover:text-red-400 transition-colors ml-1 text-xs"
        >
          ✕
        </button>
      )}
    </div>
  )
}