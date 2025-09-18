"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { PremiumCard } from "@/components/ui/premium-card"
import { motion } from "framer-motion"

interface AQITrendChartProps {
  data: Array<{
    timestamp: string
    aqi: number
    pm25: number
    pm10: number
  }>
  className?: string
}

export function AQITrendChart({ data, className }: AQITrendChartProps) {
  const chartData = data
    .slice(-24) // Last 24 hours
    .map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      aqi: Math.round(item.aqi),
      pm25: item.pm25?.toFixed(1),
      pm10: item.pm10?.toFixed(1),
    }))
    .reverse()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg border border-border/50">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey.toUpperCase()}: ${entry.value}${entry.dataKey === "aqi" ? "" : " μg/m³"}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <PremiumCard title="24-Hour AQI Trend" description="Air quality index over the last 24 hours" glass>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0 0)" />
              <XAxis dataKey="time" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="aqi"
                stroke="oklch(0.7 0.15 280)"
                strokeWidth={3}
                dot={{ fill: "oklch(0.7 0.15 280)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "oklch(0.7 0.15 280)", strokeWidth: 2 }}
                name="AQI"
              />
              <Line
                type="monotone"
                dataKey="pm25"
                stroke="oklch(0.65 0.2 200)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.65 0.2 200)", strokeWidth: 2, r: 3 }}
                name="PM2.5"
              />
              <Line
                type="monotone"
                dataKey="pm10"
                stroke="oklch(0.75 0.15 140)"
                strokeWidth={2}
                dot={{ fill: "oklch(0.75 0.15 140)", strokeWidth: 2, r: 3 }}
                name="PM10"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </PremiumCard>
    </motion.div>
  )
}
