"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { MapPin, Thermometer, Wind, Eye, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Location {
  id: number
  name: string
  latitude: number
  longitude: number
  latest?: {
    aqi: number
    pm25?: number
    pm10?: number
    o3?: number
    no2?: number
    timestamp: string
  }
}

interface AirQualityHeatmapProps {
  locations: Location[]
  className?: string
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "bg-green-500"
  if (aqi <= 100) return "bg-yellow-500"
  if (aqi <= 150) return "bg-orange-500"
  if (aqi <= 200) return "bg-red-500"
  if (aqi <= 300) return "bg-purple-500"
  return "bg-red-900"
}

function getAQIIntensity(aqi: number): number {
  return Math.min(aqi / 300, 1)
}

export function AirQualityHeatmap({ locations, className = "" }: AirQualityHeatmapProps) {
  const [selectedMetric, setSelectedMetric] = useState<"aqi" | "pm25" | "pm10">("aqi")
  const [hoveredLocation, setHoveredLocation] = useState<number | null>(null)

  const sortedLocations = useMemo(() => {
    return [...locations]
      .filter(loc => loc.latest)
      .sort((a, b) => {
        const valueA = a.latest?.[selectedMetric] || 0
        const valueB = b.latest?.[selectedMetric] || 0
        return valueB - valueA
      })
  }, [locations, selectedMetric])

  const maxValue = useMemo(() => {
    return Math.max(...sortedLocations.map(loc => loc.latest?.[selectedMetric] || 0))
  }, [sortedLocations, selectedMetric])

  const getMetricColor = (value: number) => {
    const intensity = value / maxValue
    if (selectedMetric === "aqi") return getAQIColor(value)
    
    // For PM2.5 and PM10
    if (intensity <= 0.3) return "bg-green-500"
    if (intensity <= 0.6) return "bg-yellow-500"
    if (intensity <= 0.8) return "bg-orange-500"
    return "bg-red-500"
  }

  const getMetricUnit = () => {
    switch (selectedMetric) {
      case "aqi": return ""
      case "pm25":
      case "pm10": return "μg/m³"
      default: return ""
    }
  }

  return (
    <Card className={`glass ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Bengaluru Air Quality Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metric Selection */}
        <Tabs value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="aqi">AQI</TabsTrigger>
            <TabsTrigger value="pm25">PM2.5</TabsTrigger>
            <TabsTrigger value="pm10">PM10</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedMetric} className="mt-6">
            {/* Heatmap Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {sortedLocations.map((location, index) => {
                const value = location.latest?.[selectedMetric] || 0
                const intensity = value / maxValue
                
                return (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                    onMouseEnter={() => setHoveredLocation(location.id)}
                    onMouseLeave={() => setHoveredLocation(null)}
                  >
                    <div
                      className={`
                        relative p-4 rounded-lg border cursor-pointer transition-all duration-300
                        ${getMetricColor(value)} bg-opacity-20 hover:bg-opacity-30
                        ${hoveredLocation === location.id ? 'scale-105 shadow-lg' : ''}
                      `}
                      style={{
                        boxShadow: hoveredLocation === location.id 
                          ? `0 0 20px ${getMetricColor(value).replace('bg-', 'rgba(')}`
                          : undefined
                      }}
                    >
                      <div className="text-center space-y-2">
                        <h3 className="font-medium text-sm truncate">{location.name}</h3>
                        <div className="text-2xl font-bold">
                          {Math.round(value)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getMetricUnit()}
                        </div>
                      </div>
                      
                      {/* Intensity Bar */}
                      <div className="absolute bottom-1 left-1 right-1 h-1 bg-black/20 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getMetricColor(value)} transition-all duration-500`}
                          style={{ width: `${intensity * 100}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 p-4 bg-accent/30 rounded-lg">
              <h4 className="font-medium mb-3">Legend</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMetric === "aqi" ? (
                  <>
                    <Badge className="bg-green-500 text-white">0-50 Good</Badge>
                    <Badge className="bg-yellow-500 text-white">51-100 Moderate</Badge>
                    <Badge className="bg-orange-500 text-white">101-150 Unhealthy for Sensitive</Badge>
                    <Badge className="bg-red-500 text-white">151-200 Unhealthy</Badge>
                    <Badge className="bg-purple-500 text-white">201-300 Very Unhealthy</Badge>
                    <Badge className="bg-red-900 text-white">300+ Hazardous</Badge>
                  </>
                ) : (
                  <>
                    <Badge className="bg-green-500 text-white">Low</Badge>
                    <Badge className="bg-yellow-500 text-white">Moderate</Badge>
                    <Badge className="bg-orange-500 text-white">High</Badge>
                    <Badge className="bg-red-500 text-white">Very High</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className="text-lg font-bold text-green-500">
                  {sortedLocations.filter(loc => (loc.latest?.[selectedMetric] || 0) <= (selectedMetric === "aqi" ? 50 : maxValue * 0.3)).length}
                </div>
                <div className="text-xs text-muted-foreground">Good Areas</div>
              </div>
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className="text-lg font-bold text-orange-500">
                  {sortedLocations.filter(loc => {
                    const val = loc.latest?.[selectedMetric] || 0
                    return selectedMetric === "aqi" ? (val > 100 && val <= 200) : (val > maxValue * 0.6)
                  }).length}
                </div>
                <div className="text-xs text-muted-foreground">Unhealthy Areas</div>
              </div>
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className="text-lg font-bold text-blue-500">
                  {Math.round(sortedLocations.reduce((sum, loc) => sum + (loc.latest?.[selectedMetric] || 0), 0) / sortedLocations.length)}
                </div>
                <div className="text-xs text-muted-foreground">City Average</div>
              </div>
              <div className="text-center p-3 bg-accent/20 rounded-lg">
                <div className="text-lg font-bold text-purple-500">
                  {Math.round(maxValue)}
                </div>
                <div className="text-xs text-muted-foreground">Highest Reading</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}