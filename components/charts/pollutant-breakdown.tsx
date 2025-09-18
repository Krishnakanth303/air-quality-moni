"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { PremiumCard } from "@/components/ui/premium-card"
import { motion } from "framer-motion"

interface PollutantBreakdownProps {
  data: {
    pm25: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
  }
  className?: string
}

export function PollutantBreakdown({ data, className }: PollutantBreakdownProps) {
  const chartData = [
    { name: "PM2.5", value: data.pm25, unit: "μg/m³", color: "oklch(0.65 0.2 25)" },
    { name: "PM10", value: data.pm10, unit: "μg/m³", color: "oklch(0.75 0.15 40)" },
    { name: "O₃", value: data.o3, unit: "μg/m³", color: "oklch(0.8 0.15 80)" },
    { name: "NO₂", value: data.no2, unit: "μg/m³", color: "oklch(0.7 0.15 140)" },
    { name: "SO₂", value: data.so2, unit: "μg/m³", color: "oklch(0.65 0.2 200)" },
    { name: "CO", value: data.co, unit: "mg/m³", color: "oklch(0.7 0.15 280)" },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass p-3 rounded-lg border border-border/50">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm" style={{ color: data.color }}>
            {`${data.value?.toFixed(1)} ${data.unit}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={className}
    >
      <PremiumCard title="Current Pollutant Levels" description="Breakdown of individual pollutants" glass>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0 0)" />
              <XAxis dataKey="name" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </PremiumCard>
    </motion.div>
  )
}
