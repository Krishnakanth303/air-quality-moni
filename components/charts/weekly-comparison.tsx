"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { PremiumCard } from "@/components/ui/premium-card"
import { motion } from "framer-motion"

interface WeeklyComparisonProps {
  data: Array<{
    timestamp: string
    aqi: number
  }>
  className?: string
}

export function WeeklyComparison({ data, className }: WeeklyComparisonProps) {
  // Group data by day and calculate daily averages
  const dailyData = data.reduce((acc: any, item) => {
    const date = new Date(item.timestamp).toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    })

    if (!acc[date]) {
      acc[date] = { date, values: [], total: 0, count: 0 }
    }

    acc[date].values.push(item.aqi)
    acc[date].total += item.aqi
    acc[date].count += 1

    return acc
  }, {})

  const chartData = Object.values(dailyData)
    .map((day: any) => ({
      date: day.date,
      average: Math.round(day.total / day.count),
      min: Math.min(...day.values),
      max: Math.max(...day.values),
    }))
    .slice(-7) // Last 7 days

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg border border-border/50">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-green-400">{`Min: ${payload[0]?.payload?.min}`}</p>
          <p className="text-sm text-blue-400">{`Avg: ${payload[0]?.value}`}</p>
          <p className="text-sm text-red-400">{`Max: ${payload[0]?.payload?.max}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className={className}
    >
      <PremiumCard title="7-Day AQI Trend" description="Daily average air quality over the past week" glass>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.7 0.15 280)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="oklch(0.7 0.15 280)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0 0)" />
              <XAxis dataKey="date" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="average"
                stroke="oklch(0.7 0.15 280)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#aqiGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </PremiumCard>
    </motion.div>
  )
}
