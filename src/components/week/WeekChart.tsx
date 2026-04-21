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

      <div className="grid grid-cols-3 gap-2 mb-6 text-center">
        {[
          { value: `${totalCompleted}/${totalTasks}`, label: "tâches" },
          { value: totalPomodoros, label: "pomodoros" },
          {
            value: `${totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0}%`,
            label: "complétion",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
            className="bg-[#161616] border border-[#222] rounded-xl p-3"
          >
            <p className="text-lg font-medium text-white">{stat.value}</p>
            <p className="text-[10px] text-neutral-600 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        className="bg-[#161616] border border-[#222] rounded-xl p-4"
      >
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
            <Bar
              dataKey="tasksCompleted"
              name="Tâches complétées"
              fill="#4ade80"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pomodoros"
              name="Pomodoros"
              fill="#166534"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
    </div>
  )
}
