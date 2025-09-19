"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Clock, TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts"

interface TimelineData {
  timestamp: string
  aqi: number
  pm25?: number
  pm10?: number
}

interface AirQualityTimelineProps {
  data: TimelineData[]
  className?: string
}

function getAQICategory(aqi: number): { category: string; color: string } {
  if (aqi <= 50) return { category: "Good", color: "#00E400" }
  if (aqi <= 100) return { category: "Moderate", color: "#FFFF00" }
  if (aqi <= 150) return { category: "Unhealthy for Sensitive", color: "#FF7E00" }
  if (aqi <= 200) return { category: "Unhealthy", color: "#FF0000" }
  if (aqi <= 300) return { category: "Very Unhealthy", color: "#8F3F97" }
  return { category: "Hazardous", color: "#7E0023" }
}

function getTimeOfDay(hour: number): string {
  if (hour >= 5 && hour < 12) return "Morning"
  if (hour >= 12 && hour < 17) return "Afternoon"
  if (hour >= 17 && hour < 21) return "Evening"
  return "Night"
}

export function AirQualityTimeline({ data, className = "" }: AirQualityTimelineProps) {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h")
  const [selectedMetric, setSelectedMetric] = useState<"aqi" | "pm25" | "pm10">("aqi")

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return []

    const now = new Date()
    let filteredData = [...data]

    // Filter by time range
    switch (timeRange) {
      case "24h":
        filteredData = data.slice(-24)
        break
      case "7d":
        filteredData = data.slice(-168) // 7 days * 24 hours
        break
      case "30d":
        filteredData = data.slice(-720) // 30 days * 24 hours
        break
    }

    return filteredData.map((item, index) => {
      const date = new Date(item.timestamp)
      const hour = date.getHours()
      
      return {
        ...item,
        time: timeRange === "24h" 
          ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : timeRange === "7d"
          ? date.toLocaleDateString([], { weekday: 'short', hour: '2-digit' })
          : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        timeOfDay: getTimeOfDay(hour),
        category: getAQICategory(item.aqi).category,
        color: getAQICategory(item.aqi).color,
        index
      }
    })
  }, [data, timeRange])

  const timelineStats = useMemo(() => {
    if (processedData.length === 0) return null

    const values = processedData.map(d => d[selectedMetric]).filter(v => v !== undefined) as number[]
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length
    const max = Math.max(...values)
    const min = Math.min(...values)
    const trend = values.length > 1 ? values[values.length - 1] - values[0] : 0

    // Time of day analysis
    const timeOfDayStats = processedData.reduce((acc, item) => {
      const timeOfDay = item.timeOfDay
      if (!acc[timeOfDay]) {
        acc[timeOfDay] = { total: 0, count: 0, values: [] }
      }
      acc[timeOfDay].total += item[selectedMetric] || 0
      acc[timeOfDay].count += 1
      acc[timeOfDay].values.push(item[selectedMetric] || 0)
      return acc
    }, {} as Record<string, { total: number; count: number; values: number[] }>)

    const timeOfDayAverages = Object.entries(timeOfDayStats).map(([time, stats]) => ({
      time,
      average: stats.total / stats.count,
      max: Math.max(...stats.values),
      min: Math.min(...stats.values)
    }))

    return {
      average: avg,
      maximum: max,
      minimum: min,
      trend,
      timeOfDayAverages
    }
  }, [processedData, selectedMetric])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass p-3 rounded-lg border border-border/50">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            {selectedMetric.toUpperCase()}: {payload[0].value?.toFixed(1)}
            {selectedMetric !== "aqi" ? " μg/m³" : ""}
          </p>
          <p className="text-sm text-muted-foreground">
            Category: {data.category}
          </p>
          <p className="text-sm text-muted-foreground">
            Time of Day: {data.timeOfDay}
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
      transition={{ duration: 0.6 }}
      className={className}
    >
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Air Quality Timeline Analysis
            </div>
            <div className="flex gap-2">
              <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aqi">AQI</SelectItem>
                  <SelectItem value="pm25">PM2.5</SelectItem>
                  <SelectItem value="pm10">PM10</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24H</SelectItem>
                  <SelectItem value="7d">7D</SelectItem>
                  <SelectItem value="30d">30D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timeline Chart */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.2 0 0)" />
                <XAxis 
                  dataKey="time" 
                  stroke="oklch(0.65 0 0)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Reference lines for AQI categories */}
                {selectedMetric === "aqi" && (
                  <>
                    <ReferenceLine y={50} stroke="#00E400" strokeDasharray="5 5" strokeOpacity={0.5} />
                    <ReferenceLine y={100} stroke="#FFFF00" strokeDasharray="5 5" strokeOpacity={0.5} />
                    <ReferenceLine y={150} stroke="#FF7E00" strokeDasharray="5 5" strokeOpacity={0.5} />
                    <ReferenceLine y={200} stroke="#FF0000" strokeDasharray="5 5" strokeOpacity={0.5} />
                  </>
                )}
                
                <Line
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="oklch(0.7 0.15 280)"
                  strokeWidth={3}
                  dot={{ fill: "oklch(0.7 0.15 280)", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "oklch(0.7 0.15 280)", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Statistics */}
          {timelineStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className="text-lg font-bold text-blue-500">
                  {timelineStats.average.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Average</div>
              </div>
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className="text-lg font-bold text-red-500">
                  {timelineStats.maximum.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Peak</div>
              </div>
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className="text-lg font-bold text-green-500">
                  {timelineStats.minimum.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Lowest</div>
              </div>
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className={`text-lg font-bold flex items-center justify-center gap-1 ${
                  timelineStats.trend > 0 ? 'text-red-500' : timelineStats.trend < 0 ? 'text-green-500' : 'text-gray-500'
                }`}>
                  {timelineStats.trend > 0 ? <TrendingUp className="h-4 w-4" /> : 
                   timelineStats.trend < 0 ? <TrendingDown className="h-4 w-4" /> : 
                   <div className="h-4 w-4" />}
                  {Math.abs(timelineStats.trend).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Trend</div>
              </div>
            </div>
          )}

          {/* Time of Day Analysis */}
          {timelineStats && timelineStats.timeOfDayAverages.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Time of Day Patterns
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timelineStats.timeOfDayAverages.map((timeData) => (
                  <div key={timeData.time} className="p-3 border border-border/50 rounded-lg">
                    <div className="text-center">
                      <div className="font-medium text-sm mb-1">{timeData.time}</div>
                      <div className="text-lg font-bold">{timeData.average.toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">
                        {timeData.min.toFixed(1)} - {timeData.max.toFixed(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <h4 className="font-medium mb-2">Timeline Insights</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {timelineStats && (
                <>
                  <p>
                    • {selectedMetric.toUpperCase()} levels have {
                      timelineStats.trend > 5 ? "increased significantly" :
                      timelineStats.trend > 0 ? "slightly increased" :
                      timelineStats.trend < -5 ? "decreased significantly" :
                      timelineStats.trend < 0 ? "slightly decreased" :
                      "remained stable"
                    } over the selected period.
                  </p>
                  <p>
                    • Peak pollution typically occurs during {
                      timelineStats.timeOfDayAverages.length > 0 
                        ? timelineStats.timeOfDayAverages.reduce((max, curr) => 
                            curr.average > max.average ? curr : max
                          ).time.toLowerCase()
                        : "peak hours"
                    }.
                  </p>
                  <p>
                    • The variation between minimum and maximum levels is {
                      (timelineStats.maximum - timelineStats.minimum).toFixed(1)
                    } {selectedMetric !== "aqi" ? "μg/m³" : "AQI points"}.
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}