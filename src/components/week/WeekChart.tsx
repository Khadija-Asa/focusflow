"use client"

import { useEffect, useState } from "react"
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
        <div className="h-64 bg-[#161616] rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-white text-base font-medium mb-5">Cette semaine</h2>

      <div className="grid grid-cols-3 gap-2 mb-6 text-center">
        <div className="bg-[#161616] border border-[#222] rounded-xl p-3">
          <p className="text-lg font-medium text-white">
            {totalCompleted}/{totalTasks}
          </p>
          <p className="text-[10px] text-neutral-600 mt-0.5">tâches</p>
        </div>
        <div className="bg-[#161616] border border-[#222] rounded-xl p-3">
          <p className="text-lg font-medium text-white">{totalPomodoros}</p>
          <p className="text-[10px] text-neutral-600 mt-0.5">pomodoros</p>
        </div>
        <div className="bg-[#161616] border border-[#222] rounded-xl p-3">
          <p className="text-lg font-medium text-white">
            {totalTasks > 0
              ? Math.round((totalCompleted / totalTasks) * 100)
              : 0}
            %
          </p>
          <p className="text-[10px] text-neutral-600 mt-0.5">complétion</p>
        </div>
      </div>

      <div className="bg-[#161616] border border-[#222] rounded-xl p-4">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} barGap={4} barCategoryGap="30%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#222"
              vertical={false}
            />
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
      </div>
    </div>
  )
}
