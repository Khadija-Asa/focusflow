"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTaskStore } from "@/stores/taskStore"
import { TaskCard } from "./TaskCard"
import { AddTaskModal } from "./AddTaskModal"

export function TaskList() {
  const { todayTasks, yesterdayTasks, fetchTasks, isLoading } = useTaskStore()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const completed = todayTasks.filter((t) => t.completed).length
  const activeTasks = todayTasks.filter((t) => !t.completed)
  const completedTasks = todayTasks.filter((t) => t.completed)
  const total = todayTasks.length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="relative h-full">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-5 flex items-center justify-between"
      >
        <h2 className="text-white text-base font-medium">Tâches du jour</h2>
        <motion.button
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs text-accent bg-accent-dim border border-accent-border rounded-lg px-3 py-1.5 hover:bg-accent/10 transition-colors"
        >
          + Ajouter
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-3 gap-2 mb-5 text-center">
        {[
          { value: `${completed}/${total}`, label: "tâches" },
          { value: todayTasks.reduce((acc, t) => acc + t.pomodoros.length, 0), label: "pomodoros" },
          { value: `${completionRate}%`, label: "complétion" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.07, duration: 0.3 }}
            className="bg-[#161616] border border-[#222] rounded-xl p-3"
          >
            <p className="text-lg font-medium text-white">{stat.value}</p>
            <p className="text-[10px] text-neutral-600 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 bg-[#161616] border border-[#222] rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {activeTasks.length === 0 && completedTasks.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-neutral-600 text-sm py-4 text-center"
            >
              Aucune tâche pour aujourd'hui — commence par en ajouter une
            </motion.p>
          )}

          <AnimatePresence mode="popLayout">
            {activeTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} variant="today" index={i} />
            ))}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {completedTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <p className="text-[10px] text-neutral-600 uppercase tracking-wider mb-2">
                  Complétées
                </p>
                <div className="flex flex-col gap-2">
                  {completedTasks.map((task, i) => (
                    <TaskCard key={task.id} task={task} variant="today" index={i} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {yesterdayTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-3 bg-red-400 rounded" />
              <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
                Non réalisées hier
              </p>
            </div>
            <span className="text-[11px] text-red-400 bg-[#2a1a1a] border border-[#4a2d2d] rounded-full px-2 py-0.5">
              {yesterdayTasks.length} tâche{yesterdayTasks.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {yesterdayTasks.map((task, i) => (
              <TaskCard key={task.id} task={task} variant="yesterday" index={i} />
            ))}
          </div>
        </motion.div>
      )}

      {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
