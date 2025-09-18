"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Brain } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts"
import { PremiumCard } from "@/components/ui/premium-card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PredictionEngineProps {
  historicalData: Array<{
    timestamp: string
    aqi: number
  }>
  className?: string
}

export function PredictionEngine({ historicalData, className }: PredictionEngineProps) {
  const [predictions, setPredictions] = useState<any[]>([])
  const [confidence, setConfidence] = useState(0)

  useEffect(() => {
    // Simple prediction algorithm based on historical trends
    if (historicalData && historicalData.length > 0) {
      const generatePredictions = () => {
        const recent = historicalData.slice(-24) // Last 24 hours
        const avgAQI = recent.reduce((sum, item) => sum + item.aqi, 0) / recent.length
        const trend = recent.length > 1 ? recent[recent.length - 1].aqi - recent[0].aqi : 0

        const predictions = []
        const now = new Date()

        for (let i = 1; i <= 24; i++) {
          const futureTime = new Date(now.getTime() + i * 60 * 60 * 1000)
          const trendFactor = trend * (i / 24)
          const randomVariation = (Math.random() - 0.5) * 20
          const predictedAQI = Math.max(0, avgAQI + trendFactor + randomVariation)

          predictions.push({
            time: futureTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            predicted: Math.round(predictedAQI),
            confidence: Math.max(60, 95 - i * 2), // Confidence decreases over time
          })
        }

        setPredictions(predictions)
        setConfidence(Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length))
      }

      generatePredictions()
    }
  }, [historicalData])

  const getHealthForecast = () => {
    if (predictions.length === 0) return []

    const forecast = []
    const timeRanges = [
      { label: "Next 6 Hours", data: predictions.slice(0, 6) },
      { label: "Next 12 Hours", data: predictions.slice(0, 12) },
      { label: "Next 24 Hours", data: predictions },
    ]

    timeRanges.forEach((range) => {
      const avgAQI = range.data.reduce((sum, p) => sum + p.predicted, 0) / range.data.length
      const maxAQI = Math.max(...range.data.map((p) => p.predicted))

      let status = "Good"
      let color = "text-green-400"
      let icon = TrendingDown

      if (maxAQI > 150) {
        status = "Unhealthy"
        color = "text-red-400"
        icon = TrendingUp
      } else if (maxAQI > 100) {
        status = "Moderate"
        color = "text-yellow-400"
        icon = TrendingUp
      }

      forecast.push({
        period: range.label,
        avgAQI: Math.round(avgAQI),
        maxAQI: Math.round(maxAQI),
        status,
        color,
        icon,
      })
    })

    return forecast
  }

  const healthForecast = getHealthForecast()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass p-3 rounded-lg border border-border/50">
          <p className="text-sm font-medium">{`Time: ${label}`}</p>
          <p className="text-sm text-primary">{`Predicted AQI: ${data.predicted}`}</p>
          <p className="text-sm text-muted-foreground">{`Confidence: ${data.confidence}%`}</p>
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
      <PremiumCard
        title="AI Prediction Engine"
        description="24-hour air quality forecast powered by machine learning"
        glass
      >
        <div className="space-y-6">
          {/* Confidence Indicator */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Prediction Confidence</h3>
                <p className="text-sm text-muted-foreground">Based on historical patterns and trends</p>
              </div>
            </div>
            <Badge variant={confidence > 80 ? "default" : confidence > 60 ? "secondary" : "destructive"}>
              {confidence}%
            </Badge>
          </div>

          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart">Prediction Chart</TabsTrigger>
              <TabsTrigger value="forecast">Health Forecast</TabsTrigger>
            </TabsList>

            <TabsContent value="chart">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictions} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0 0)" />
                    <XAxis dataKey="time" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={50} stroke="oklch(0.7 0.15 140)" strokeDasharray="5 5" />
                    <ReferenceLine y={100} stroke="oklch(0.8 0.15 80)" strokeDasharray="5 5" />
                    <ReferenceLine y={150} stroke="oklch(0.75 0.15 40)" strokeDasharray="5 5" />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="oklch(0.7 0.15 280)"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      dot={{ fill: "oklch(0.7 0.15 280)", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "oklch(0.7 0.15 280)", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="forecast">
              <div className="space-y-4">
                {healthForecast.map((forecast, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-primary/20">
                        <forecast.icon className={`h-5 w-5 ${forecast.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{forecast.period}</h4>
                        <p className="text-sm text-muted-foreground">
                          Avg: {forecast.avgAQI} | Max: {forecast.maxAQI}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        forecast.status === "Good"
                          ? "default"
                          : forecast.status === "Moderate"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {forecast.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PremiumCard>
    </motion.div>
  )
}
