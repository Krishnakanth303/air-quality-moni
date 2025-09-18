"use client"

import { useState } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { PremiumCard } from "@/components/ui/premium-card"
import { AQIBadge } from "@/components/ui/aqi-badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface LocationComparisonProps {
  currentLocationId: number
  className?: string
}

export function LocationComparison({ currentLocationId, className }: LocationComparisonProps) {
  const [compareLocationId, setCompareLocationId] = useState<number | null>(null)

  const { data: locations } = useSWR("/api/air-quality", fetcher)
  const { data: compareData } = useSWR(
    compareLocationId ? `/api/air-quality?locationId=${compareLocationId}&limit=1` : null,
    fetcher,
  )

  const currentLocation = locations?.find((loc: any) => loc.id === currentLocationId)
  const compareLocation = locations?.find((loc: any) => loc.id === compareLocationId)
  const currentData = currentLocation?.latest
  const compareLatest = compareData?.[0]

  const getComparison = (current: number, compare: number) => {
    const diff = current - compare
    const percentage = Math.abs(Math.round((diff / compare) * 100))

    if (Math.abs(diff) < 5) {
      return { trend: "neutral", icon: Minus, text: "Similar", color: "text-muted-foreground" }
    } else if (diff > 0) {
      return { trend: "worse", icon: TrendingUp, text: `${percentage}% worse`, color: "text-red-400" }
    } else {
      return { trend: "better", icon: TrendingDown, text: `${percentage}% better`, color: "text-green-400" }
    }
  }

  const availableLocations = locations?.filter((loc: any) => loc.id !== currentLocationId) || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <PremiumCard title="Location Comparison" description="Compare air quality across different locations" glass>
        <div className="space-y-6">
          {/* Location Selector */}
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <Select
              value={compareLocationId?.toString() || ""}
              onValueChange={(value) => setCompareLocationId(Number.parseInt(value))}
            >
              <SelectTrigger className="flex-1 glass">
                <SelectValue placeholder="Select location to compare" />
              </SelectTrigger>
              <SelectContent>
                {availableLocations.map((location: any) => (
                  <SelectItem key={location.id} value={location.id.toString()}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comparison Results */}
          {compareLocationId && currentData && compareLatest && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Current Location */}
              <div className="p-4 rounded-lg bg-accent/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{currentLocation?.name}</h4>
                  <Badge variant="outline">Current</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{Math.round(currentData.aqi)}</div>
                  <AQIBadge aqi={currentData.aqi} size="sm" />
                </div>
              </div>

              {/* Comparison Location */}
              <div className="p-4 rounded-lg bg-accent/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{compareLocation?.name}</h4>
                  <Badge variant="secondary">Compare</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{Math.round(compareLatest.aqi)}</div>
                  <AQIBadge aqi={compareLatest.aqi} size="sm" />
                </div>
              </div>

              {/* Comparison Summary */}
              <div className="p-4 rounded-lg border border-border/50">
                <h4 className="font-medium mb-3">Comparison Summary</h4>
                <div className="space-y-3">
                  {/* Overall AQI */}
                  {(() => {
                    const comparison = getComparison(currentData.aqi, compareLatest.aqi)
                    return (
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Air Quality</span>
                        <div className="flex items-center gap-2">
                          <comparison.icon className={`h-4 w-4 ${comparison.color}`} />
                          <span className={`text-sm font-medium ${comparison.color}`}>{comparison.text}</span>
                        </div>
                      </div>
                    )
                  })()}

                  {/* PM2.5 Comparison */}
                  {currentData.pm25 &&
                    compareLatest.pm25 &&
                    (() => {
                      const comparison = getComparison(currentData.pm25, compareLatest.pm25)
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">PM2.5 Levels</span>
                          <div className="flex items-center gap-2">
                            <comparison.icon className={`h-4 w-4 ${comparison.color}`} />
                            <span className={`text-sm font-medium ${comparison.color}`}>{comparison.text}</span>
                          </div>
                        </div>
                      )
                    })()}

                  {/* PM10 Comparison */}
                  {currentData.pm10 &&
                    compareLatest.pm10 &&
                    (() => {
                      const comparison = getComparison(currentData.pm10, compareLatest.pm10)
                      return (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">PM10 Levels</span>
                          <div className="flex items-center gap-2">
                            <comparison.icon className={`h-4 w-4 ${comparison.color}`} />
                            <span className={`text-sm font-medium ${comparison.color}`}>{comparison.text}</span>
                          </div>
                        </div>
                      )
                    })()}
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="font-medium mb-2">Recommendation</h4>
                <p className="text-sm text-muted-foreground">
                  {currentData.aqi < compareLatest.aqi
                    ? `${currentLocation?.name} has better air quality. Consider staying in this area.`
                    : currentData.aqi > compareLatest.aqi
                      ? `${compareLocation?.name} has better air quality. Consider relocating activities there.`
                      : "Both locations have similar air quality levels."}
                </p>
              </div>
            </motion.div>
          )}

          {!compareLocationId && (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-medium mb-2">Select a Location</h3>
              <p className="text-sm text-muted-foreground">Choose a location to compare air quality data</p>
            </div>
          )}
        </div>
      </PremiumCard>
    </motion.div>
  )
}
