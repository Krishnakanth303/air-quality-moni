"use client"

import { useMemo } from "react"
import { TrendingUp, TrendingDown, MapPin, Clock, AlertTriangle, Info, Zap, Wind } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"

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
    so2?: number
    co?: number
    timestamp: string
  }
}

interface AreaInsightsProps {
  location: Location
  allLocations: Location[]
  className?: string
}

// Area-specific insights based on Bengaluru local knowledge
const areaCharacteristics = {
  "Whitefield": {
    type: "Tech Hub",
    insights: "Major IT corridor with high traffic during office hours. Air quality tends to be worse during peak commuting times.",
    peakPollutionHours: "8-10 AM, 6-8 PM",
    mainConcerns: ["Traffic emissions", "Construction dust"]
  },
  "Electronic City": {
    type: "Tech Hub", 
    insights: "Large IT and electronics manufacturing hub. Industrial activities can impact air quality, especially during dry seasons.",
    peakPollutionHours: "7-9 AM, 5-7 PM",
    mainConcerns: ["Industrial emissions", "Heavy traffic"]
  },
  "Koramangala": {
    type: "Commercial-Residential",
    insights: "Dense urban area with mixed commercial and residential use. High traffic density throughout the day.",
    peakPollutionHours: "9-11 AM, 7-9 PM",
    mainConcerns: ["Vehicle emissions", "Urban dust"]
  },
  "MG Road": {
    type: "Central Commercial",
    insights: "Heart of Bangalore's commercial district. Heavy traffic and commercial activities contribute to pollution.",
    peakPollutionHours: "10 AM-8 PM",
    mainConcerns: ["Traffic congestion", "Commercial activities"]
  },
  "Jayanagar": {
    type: "Residential",
    insights: "Established residential area with moderate traffic. Generally better air quality compared to commercial zones.",
    peakPollutionHours: "8-9 AM, 6-7 PM",
    mainConcerns: ["Local traffic", "Dust particles"]
  }
}

function getAreaCharacteristics(areaName: string) {
  return areaCharacteristics[areaName as keyof typeof areaCharacteristics] || {
    type: "Mixed",
    insights: "Typical Bengaluru area with mixed residential and commercial activities.",
    peakPollutionHours: "8-10 AM, 6-8 PM",
    mainConcerns: ["Traffic emissions", "Urban dust"]
  }
}

function getAQIRecommendations(aqi: number): { 
  level: string; 
  color: string; 
  activities: string[]; 
  precautions: string[] 
} {
  if (aqi <= 50) {
    return {
      level: "Good",
      color: "text-green-500",
      activities: ["Outdoor sports", "Jogging", "Cycling", "Children's outdoor play"],
      precautions: ["No special precautions needed"]
    }
  } else if (aqi <= 100) {
    return {
      level: "Moderate", 
      color: "text-yellow-500",
      activities: ["Light outdoor activities", "Walking", "Outdoor dining"],
      precautions: ["Sensitive individuals should monitor symptoms"]
    }
  } else if (aqi <= 150) {
    return {
      level: "Unhealthy for Sensitive Groups",
      color: "text-orange-500",
      activities: ["Indoor activities preferred", "Limited outdoor exercise"],
      precautions: ["Wear masks outdoors", "Close windows", "Use air purifiers"]
    }
  } else if (aqi <= 200) {
    return {
      level: "Unhealthy",
      color: "text-red-500", 
      activities: ["Stay indoors", "Avoid outdoor exercise"],
      precautions: ["N95 masks mandatory", "Keep windows closed", "Air purifiers recommended"]
    }
  } else {
    return {
      level: "Very Unhealthy/Hazardous",
      color: "text-purple-500",
      activities: ["Emergency measures", "Stay indoors"],
      precautions: ["Avoid all outdoor activities", "Seek medical attention if symptoms persist"]
    }
  }
}

function getRanking(location: Location, allLocations: Location[]): number {
  const sortedByAQI = allLocations
    .filter(loc => loc.latest?.aqi)
    .sort((a, b) => (a.latest?.aqi || 0) - (b.latest?.aqi || 0))
  
  return sortedByAQI.findIndex(loc => loc.id === location.id) + 1
}

export function AreaInsights({ location, allLocations, className = "" }: AreaInsightsProps) {
  // Safety guards for missing data
  if (!location || !location.name) {
    return <div className={className}>No location data available</div>
  }
  
  const aqi = location.latest?.aqi || 0
  const characteristics = getAreaCharacteristics(location.name)
  const recommendations = getAQIRecommendations(aqi)
  const ranking = getRanking(location, allLocations)
  const totalAreas = allLocations.filter(loc => loc.latest?.aqi).length

  const pollutantLevels = useMemo(() => {
    const latest = location.latest
    if (!latest) return []

    return [
      { name: "PM2.5", value: latest.pm25 || 0, max: 60, unit: "μg/m³", safe: 15 },
      { name: "PM10", value: latest.pm10 || 0, max: 100, unit: "μg/m³", safe: 50 },
      { name: "O₃", value: latest.o3 || 0, max: 200, unit: "μg/m³", safe: 100 },
      { name: "NO₂", value: latest.no2 || 0, max: 100, unit: "μg/m³", safe: 40 },
    ].map(pollutant => ({
      ...pollutant,
      percentage: Math.min((pollutant.value / pollutant.max) * 100, 100),
      status: pollutant.value <= pollutant.safe ? "safe" : pollutant.value <= pollutant.max ? "moderate" : "high"
    }))
  }, [location.latest])

  const averageAQI = useMemo(() => {
    const validAQIs = allLocations
      .map(loc => loc.latest?.aqi || 0)
      .filter(aqi => aqi > 0)
    return validAQIs.reduce((sum, aqi) => sum + aqi, 0) / validAQIs.length
  }, [allLocations])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Area Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {location.name} Insights
            </div>
            <Badge variant="outline">
              {characteristics.type}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{characteristics.insights}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Peak Pollution Hours
              </h4>
              <p className="text-sm text-muted-foreground">{characteristics.peakPollutionHours}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Main Concerns
              </h4>
              <div className="flex flex-wrap gap-1">
                {characteristics.mainConcerns.map((concern, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {concern}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status & Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Current Air Quality Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${recommendations.color}`}>
                {Math.round(aqi)}
              </div>
              <div className="text-xs text-muted-foreground">AQI Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                #{ranking}
              </div>
              <div className="text-xs text-muted-foreground">of {totalAreas} areas</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${aqi <= averageAQI ? 'text-green-500' : 'text-orange-500'}`}>
                {aqi <= averageAQI ? (
                  <TrendingUp className="h-8 w-8 mx-auto" />
                ) : (
                  <TrendingDown className="h-8 w-8 mx-auto" />
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                vs City Avg ({Math.round(averageAQI)})
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500">
                {recommendations.level.split(' ')[0]}
              </div>
              <div className="text-xs text-muted-foreground">Air Quality</div>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Air quality is <strong>{recommendations.level.toLowerCase()}</strong> in {location.name}. 
              {aqi <= averageAQI 
                ? ` This is better than the city average of ${Math.round(averageAQI)}.`
                : ` This is above the city average of ${Math.round(averageAQI)}.`
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Pollutant Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-primary" />
            Pollutant Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {pollutantLevels.map((pollutant, index) => (
            <motion.div
              key={pollutant.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{pollutant.name}</span>
                <span className="text-muted-foreground">
                  {pollutant.value.toFixed(1)} {pollutant.unit}
                </span>
              </div>
              <div className="relative">
                <Progress 
                  value={pollutant.percentage} 
                  className="h-2"
                />
                <div className={`absolute right-0 top-0 h-2 w-1 rounded ${
                  pollutant.status === 'safe' ? 'bg-green-500' :
                  pollutant.status === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>
              <div className="text-xs text-muted-foreground">
                Safe level: ≤{pollutant.safe} {pollutant.unit} | 
                Status: <span className={
                  pollutant.status === 'safe' ? 'text-green-500' :
                  pollutant.status === 'moderate' ? 'text-yellow-500' : 'text-red-500'
                }>
                  {pollutant.status.toUpperCase()}
                </span>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Recommendations for {location.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-3 text-green-600">✓ Recommended Activities</h4>
              <ul className="space-y-2">
                {recommendations.activities.map((activity, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">•</span>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3 text-orange-600">⚠ Health Precautions</h4>
              <ul className="space-y-2">
                {recommendations.precautions.map((precaution, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    {precaution}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}