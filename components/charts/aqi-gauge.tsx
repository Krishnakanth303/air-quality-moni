"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { PremiumCard } from "@/components/ui/premium-card"
import { motion } from "framer-motion"

interface AQIGaugeProps {
  aqi: number
  className?: string
}

export function AQIGauge({ aqi, className }: AQIGaugeProps) {
  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "oklch(0.7 0.15 140)"
    if (aqi <= 100) return "oklch(0.8 0.15 80)"
    if (aqi <= 150) return "oklch(0.75 0.15 40)"
    if (aqi <= 200) return "oklch(0.65 0.2 25)"
    if (aqi <= 300) return "oklch(0.55 0.15 320)"
    return "oklch(0.4 0.15 350)"
  }

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return "Good"
    if (aqi <= 100) return "Moderate"
    if (aqi <= 150) return "Unhealthy for Sensitive Groups"
    if (aqi <= 200) return "Unhealthy"
    if (aqi <= 300) return "Very Unhealthy"
    return "Hazardous"
  }

  const data = [
    { name: "AQI", value: aqi, color: getAQIColor(aqi) },
    { name: "Remaining", value: Math.max(0, 500 - aqi), color: "oklch(0.15 0 0)" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={className}
    >
      <PremiumCard title="AQI Gauge" description="Current air quality index visualization" glass>
        <div className="relative h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold" style={{ color: getAQIColor(aqi) }}>
              {Math.round(aqi)}
            </div>
            <div className="text-sm text-muted-foreground text-center">{getAQICategory(aqi)}</div>
          </div>
        </div>
      </PremiumCard>
    </motion.div>
  )
}
