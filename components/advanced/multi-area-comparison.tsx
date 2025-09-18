"use client"

import { useState, useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { BarChart3, Plus, X, TrendingUp, TrendingDown, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { AQIBadge } from "@/components/ui/aqi-badge"

interface Location {
  id: number
  name: string
  latest?: {
    aqi: number
    pm25?: number
    pm10?: number
    o3?: number
    no2?: number
    so2?: number
    co?: number
    timestamp: string
  }
}

interface MultiAreaComparisonProps {
  locations: Location[]
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

function getComparisonInsight(selectedAreas: Location[]): string {
  if (selectedAreas.length < 2) return ""
  
  const aqiValues = selectedAreas.map(area => area.latest?.aqi || 0)
  const minAqi = Math.min(...aqiValues)
  const maxAqi = Math.max(...aqiValues)
  const avgAqi = aqiValues.reduce((sum, aqi) => sum + aqi, 0) / aqiValues.length
  
  const bestArea = selectedAreas.find(area => (area.latest?.aqi || 0) === minAqi)
  const worstArea = selectedAreas.find(area => (area.latest?.aqi || 0) === maxAqi)
  
  const difference = maxAqi - minAqi
  
  if (difference > 100) {
    return `Major air quality difference: ${worstArea?.name} has significantly worse air quality than ${bestArea?.name} (${difference.toFixed(0)} AQI points difference)`
  } else if (difference > 50) {
    return `Moderate air quality variation: ${bestArea?.name} has better air quality than ${worstArea?.name} by ${difference.toFixed(0)} AQI points`
  } else {
    return `Similar air quality across selected areas with average AQI of ${avgAqi.toFixed(0)}`
  }
}

export function MultiAreaComparison({ locations, className = "" }: MultiAreaComparisonProps) {
  const [selectedAreas, setSelectedAreas] = useState<Location[]>([])
  const [comparisonMetric, setComparisonMetric] = useState<"aqi" | "pm25" | "pm10">("aqi")

  const availableLocations = useMemo(() => {
    return locations.filter(loc => !selectedAreas.some(selected => selected.id === loc.id))
  }, [locations, selectedAreas])

  const addArea = (locationId: number) => {
    const location = locations.find(loc => loc.id === locationId)
    if (location && selectedAreas.length < 6) {
      setSelectedAreas(prev => [...prev, location])
    }
  }

  const removeArea = (locationId: number) => {
    setSelectedAreas(prev => prev.filter(area => area.id !== locationId))
  }

  const comparisonData = useMemo(() => {
    return selectedAreas.map(area => ({
      name: area.name,
      aqi: area.latest?.aqi || 0,
      pm25: area.latest?.pm25 || 0,
      pm10: area.latest?.pm10 || 0,
      o3: area.latest?.o3 || 0,
      no2: area.latest?.no2 || 0,
    })).sort((a, b) => b[comparisonMetric] - a[comparisonMetric])
  }, [selectedAreas, comparisonMetric])

  const insight = useMemo(() => getComparisonInsight(selectedAreas), [selectedAreas])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Multi-Area Comparison
          </div>
          <Badge variant="outline">
            {selectedAreas.length}/6 Areas Selected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Area Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Selected Areas for Comparison</h3>
            {availableLocations.length > 0 && selectedAreas.length < 6 && (
              <Select onValueChange={(value) => addArea(Number(value))}>
                <SelectTrigger className="w-48">
                  <Plus className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Add area" />
                </SelectTrigger>
                <SelectContent>
                  {availableLocations.map(location => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>{location.name}</span>
                        {location.latest && (
                          <Badge variant="outline" className="ml-2">
                            AQI {Math.round(location.latest.aqi)}
                          </Badge>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Selected Areas Display */}
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {selectedAreas.map((area) => (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <Badge variant="secondary" className="flex items-center gap-2 py-2 px-3">
                    <span>{area.name}</span>
                    {area.latest && (
                      <AQIBadge aqi={area.latest.aqi} size="sm" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeArea(area.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {selectedAreas.length >= 2 && (
          <>
            {/* Comparison Chart Controls */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Comparison Metrics</h3>
              <Select value={comparisonMetric} onValueChange={(value: "aqi" | "pm25" | "pm10") => setComparisonMetric(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aqi">AQI</SelectItem>
                  <SelectItem value="pm25">PM2.5</SelectItem>
                  <SelectItem value="pm10">PM10</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Comparison Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <div className="space-y-1 mt-2">
                              <p className="text-sm">AQI: <span className="font-semibold">{data.aqi.toFixed(1)}</span></p>
                              <p className="text-sm">PM2.5: <span className="font-semibold">{data.pm25.toFixed(1)} μg/m³</span></p>
                              <p className="text-sm">PM10: <span className="font-semibold">{data.pm10.toFixed(1)} μg/m³</span></p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey={comparisonMetric}
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name={comparisonMetric.toUpperCase()}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Comparison Insights */}
            {insight && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-accent/50 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <Activity className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm mb-1">Comparison Insights</h4>
                    <p className="text-sm text-muted-foreground">{insight}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedAreas.length > 0 && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">
                      {Math.min(...selectedAreas.map(a => a.latest?.aqi || 0)).toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Best AQI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {Math.max(...selectedAreas.map(a => a.latest?.aqi || 0)).toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Worst AQI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {(selectedAreas.reduce((sum, a) => sum + (a.latest?.aqi || 0), 0) / selectedAreas.length).toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Average AQI</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {(Math.max(...selectedAreas.map(a => a.latest?.aqi || 0)) - Math.min(...selectedAreas.map(a => a.latest?.aqi || 0))).toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">AQI Range</div>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {selectedAreas.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">Select areas to start comparing</p>
            <p className="text-sm">Add 2-6 areas to see detailed comparisons and insights</p>
          </div>
        )}

        {selectedAreas.length === 1 && (
          <div className="text-center py-4 text-muted-foreground">
            <p>Add one more area to start comparing</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}