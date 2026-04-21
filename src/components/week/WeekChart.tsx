"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PageBackground } from "@/components/ui/PageBackground"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

type DayData = {
  date: string
  label: string
  tasksCompleted: number
  tasksTotal: number
  pomodoros: number
}

export function WeekChart() {
  const [data, setData] = useState<DayData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/week")
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
  }, [])

  const totalCompleted = data.reduce((acc, d) => acc + d.tasksCompleted, 0)
  const totalPomodoros = data.reduce((acc, d) => acc + d.pomodoros, 0)
  const totalTasks = data.reduce((acc, d) => acc + d.tasksTotal, 0)

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-8 w-48 bg-[#161616] rounded-lg animate-pulse" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[#161616] rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-72 bg-[#161616] rounded-xl animate-pulse" />
      </div>
    )
  }

  const isEmpty = totalTasks === 0 && totalPomodoros === 0

  return (
    <div className="relative">
      <PageBackground />
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative z-10"
    >
      <h2 className="text-white text-base font-medium mb-5">Cette semaine</h2>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          {
            value: `${totalCompleted}/${totalTasks}`,
            label: "tâches",
            icon: (
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8l4 4 8-8" />
              </svg>
            ),
          },
          {
            value: totalPomodoros,
            label: "pomodoros",
            icon: (
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="8" r="6" />
                <path d="M8 5v3.5l2 1.5" />
              </svg>
            ),
          },
          {
            value: `${totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0}%`,
            label: "complétion",
            icon: (
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12 L5 7 L8 10 L11 5 L14 8" />
              </svg>
            ),
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, borderColor: "#2d4a2d" }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
            className="relative bg-[#161616] border border-[#222] rounded-xl p-3.5 cursor-default overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-accent/50">{stat.icon}</span>
            </div>
            <p className="text-xl font-semibold text-white tabular-nums">{stat.value}</p>
            <p className="text-[10px] text-neutral-600 mt-0.5 uppercase tracking-wide">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="bg-[#161616] border border-[#222] rounded-xl p-4"
      >
        {isEmpty ? (
          <div className="h-[280px] flex flex-col items-center justify-center gap-2">
            <svg className="w-8 h-8 text-neutral-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18l4-6 3 4 4-8 5 10" />
            </svg>
            <p className="text-sm text-neutral-600">Aucune activité cette semaine</p>
            <p className="text-xs text-neutral-700">Lance une session pour commencer à tracker</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#666", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "12px",
                }}
                cursor={{ fill: "#ffffff08" }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px", color: "#666" }}
                iconType="circle"
                iconSize={8}
              />
              <Bar dataKey="tasksCompleted" name="Tâches complétées" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pomodoros" name="Pomodoros" fill="#166534" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </motion.div>
    </div>
  )
}
