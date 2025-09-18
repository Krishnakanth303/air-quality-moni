"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Shield, AlertTriangle, CheckCircle, XCircle, Info, Users, Home, Car } from "lucide-react"
import { PremiumCard } from "@/components/ui/premium-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface HealthRecommendationsProps {
  aqi: number
  pollutants: {
    pm25: number
    pm10: number
    o3: number
    no2: number
    so2: number
    co: number
  }
  className?: string
}

export function HealthRecommendations({ aqi, pollutants, className }: HealthRecommendationsProps) {
  const [recommendation, setRecommendation] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await fetch(`/api/health-recommendations?aqi=${Math.round(aqi)}`)
        const data = await response.json()
        setRecommendation(data)
      } catch (error) {
        console.error("Failed to fetch health recommendation:", error)
      } finally {
        setLoading(false)
      }
    }

    if (aqi) {
      fetchRecommendation()
    }
  }, [aqi])

  const getHealthImpact = (aqi: number) => {
    if (aqi <= 50) return { level: "Low", icon: CheckCircle, color: "text-green-400" }
    if (aqi <= 100) return { level: "Moderate", icon: Info, color: "text-yellow-400" }
    if (aqi <= 150) return { level: "High", icon: AlertTriangle, color: "text-orange-400" }
    if (aqi <= 200) return { level: "Very High", icon: XCircle, color: "text-red-400" }
    return { level: "Extreme", icon: XCircle, color: "text-red-600" }
  }

  const getActivityRecommendations = (aqi: number) => {
    if (aqi <= 50) {
      return {
        outdoor: { safe: true, message: "Perfect for all outdoor activities" },
        exercise: { safe: true, message: "Ideal conditions for exercise" },
        windows: { safe: true, message: "Safe to keep windows open" },
        sensitive: { safe: true, message: "No special precautions needed" },
      }
    } else if (aqi <= 100) {
      return {
        outdoor: { safe: true, message: "Good for most outdoor activities" },
        exercise: { safe: true, message: "Exercise is generally safe" },
        windows: { safe: true, message: "Windows can remain open" },
        sensitive: { safe: false, message: "Sensitive individuals should monitor symptoms" },
      }
    } else if (aqi <= 150) {
      return {
        outdoor: { safe: false, message: "Limit prolonged outdoor activities" },
        exercise: { safe: false, message: "Reduce intense outdoor exercise" },
        windows: { safe: false, message: "Consider closing windows" },
        sensitive: { safe: false, message: "Sensitive groups should stay indoors" },
      }
    } else if (aqi <= 200) {
      return {
        outdoor: { safe: false, message: "Avoid outdoor activities" },
        exercise: { safe: false, message: "Avoid outdoor exercise" },
        windows: { safe: false, message: "Keep windows closed" },
        sensitive: { safe: false, message: "Everyone should limit outdoor exposure" },
      }
    } else {
      return {
        outdoor: { safe: false, message: "Stay indoors" },
        exercise: { safe: false, message: "Avoid all outdoor exercise" },
        windows: { safe: false, message: "Keep windows closed, use air purifiers" },
        sensitive: { safe: false, message: "Health alert - stay indoors" },
      }
    }
  }

  const getPollutantRisks = (pollutants: any) => {
    const risks = []

    if (pollutants.pm25 > 35) {
      risks.push({
        pollutant: "PM2.5",
        level: "High",
        risk: "Respiratory and cardiovascular issues",
        action: "Use N95 masks outdoors, consider air purifiers",
      })
    }

    if (pollutants.pm10 > 150) {
      risks.push({
        pollutant: "PM10",
        level: "High",
        risk: "Eye and throat irritation",
        action: "Limit outdoor activities, protect eyes",
      })
    }

    if (pollutants.o3 > 160) {
      risks.push({
        pollutant: "Ozone",
        level: "High",
        risk: "Breathing difficulties, chest pain",
        action: "Avoid outdoor exercise, especially in afternoon",
      })
    }

    if (pollutants.no2 > 100) {
      risks.push({
        pollutant: "NO₂",
        level: "High",
        risk: "Respiratory inflammation",
        action: "Avoid busy roads, use alternative routes",
      })
    }

    return risks
  }

  const healthImpact = getHealthImpact(aqi)
  const activities = getActivityRecommendations(aqi)
  const pollutantRisks = getPollutantRisks(pollutants)

  if (loading) {
    return (
      <div className={className}>
        <PremiumCard className="glass animate-pulse">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </PremiumCard>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <PremiumCard title="Health Recommendations" description="Personalized advice based on current air quality" glass>
        <div className="space-y-6">
          {/* Health Impact Overview */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/50">
            <div className="p-2 rounded-full bg-primary/20">
              <healthImpact.icon className={`h-6 w-6 ${healthImpact.color}`} />
            </div>
            <div>
              <h3 className="font-semibold">Health Impact: {healthImpact.level}</h3>
              <p className="text-sm text-muted-foreground">{recommendation?.message || "Loading recommendations..."}</p>
            </div>
          </div>

          {/* Detailed Recommendations */}
          <Tabs defaultValue="activities" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="groups">Risk Groups</TabsTrigger>
              <TabsTrigger value="pollutants">Pollutants</TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Outdoor Activities</h4>
                      <p className="text-sm text-muted-foreground">{activities.outdoor.message}</p>
                      <Badge variant={activities.outdoor.safe ? "default" : "destructive"} className="mt-1">
                        {activities.outdoor.safe ? "Safe" : "Caution"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Exercise</h4>
                      <p className="text-sm text-muted-foreground">{activities.exercise.message}</p>
                      <Badge variant={activities.exercise.safe ? "default" : "destructive"} className="mt-1">
                        {activities.exercise.safe ? "Safe" : "Avoid"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Indoor Air</h4>
                      <p className="text-sm text-muted-foreground">{activities.windows.message}</p>
                      <Badge variant={activities.windows.safe ? "default" : "destructive"} className="mt-1">
                        {activities.windows.safe ? "Open OK" : "Keep Closed"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-medium">Sensitive Groups</h4>
                      <p className="text-sm text-muted-foreground">{activities.sensitive.message}</p>
                      <Badge variant={activities.sensitive.safe ? "default" : "destructive"} className="mt-1">
                        {activities.sensitive.safe ? "Normal" : "Extra Care"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="groups" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-5 w-5 text-orange-400" />
                    <h4 className="font-medium">Children &amp; Elderly</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">More vulnerable to air pollution effects</p>
                  <ul className="text-sm space-y-1">
                    <li>• Limit outdoor playtime when AQI &gt; 100</li>
                    <li>• Watch for breathing difficulties</li>
                    <li>• Consider indoor activities</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Heart className="h-5 w-5 text-red-400" />
                    <h4 className="font-medium">Heart &amp; Lung Conditions</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">People with asthma, COPD, or heart disease</p>
                  <ul className="text-sm space-y-1">
                    <li>• Keep rescue medications handy</li>
                    <li>• Avoid outdoor exercise when AQI &gt; 100</li>
                    <li>• Consider air purifiers at home</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-blue-400" />
                    <h4 className="font-medium">Healthy Adults</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Generally less affected but should still be cautious
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>• Reduce intense outdoor exercise when AQI &gt; 150</li>
                    <li>• Consider masks during high pollution</li>
                    <li>• Stay hydrated and monitor symptoms</li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pollutants" className="space-y-4">
              {pollutantRisks.length > 0 ? (
                <div className="space-y-3">
                  {pollutantRisks.map((risk, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{risk.pollutant}</h4>
                        <Badge variant="destructive">{risk.level} Risk</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{risk.risk}</p>
                      <p className="text-sm font-medium">{risk.action}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <h3 className="font-medium mb-2">All Pollutants Within Safe Levels</h3>
                  <p className="text-sm text-muted-foreground">
                    Current pollutant levels are not posing significant health risks
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" className="glass bg-transparent">
              Set Health Alerts
            </Button>
            <Button className="gradient-primary text-white">Get Detailed Report</Button>
          </div>
        </div>
      </PremiumCard>
    </motion.div>
  )
}
