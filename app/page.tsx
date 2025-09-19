"use client"

import { useState } from "react"
import useSWR from "swr"
import { motion } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Wind, Thermometer, Eye, Activity, MapPin, RefreshCw, AlertTriangle, Leaf, Cloud } from "lucide-react"

import { PremiumCard } from "@/components/ui/premium-card"
import { MetricCard } from "@/components/ui/metric-card"
import { AQIBadge } from "@/components/ui/aqi-badge"
import { Button } from "@/components/ui/button"
import { CardSkeleton, LoadingSkeleton } from "@/components/ui/loading-skeleton"
import { LoadingSpinner, PageLoader } from "@/components/ui/loading-spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { AQITrendChart } from "@/components/charts/aqi-trend-chart"
import { PollutantBreakdown } from "@/components/charts/pollutant-breakdown"
import { AQIGauge } from "@/components/charts/aqi-gauge"
import { WeeklyComparison } from "@/components/charts/weekly-comparison"

import { HealthRecommendations } from "@/components/health/health-recommendations"
import { HealthTips } from "@/components/health/health-tips"

import { PredictionEngine } from "@/components/advanced/prediction-engine"
import { RealTimeAlerts } from "@/components/advanced/real-time-alerts"
import { LocationComparison } from "@/components/advanced/location-comparison"
import { EnhancedAreaSelector } from "@/components/advanced/enhanced-area-selector"
import { MultiAreaComparison } from "@/components/advanced/multi-area-comparison"
import { AreaInsights } from "@/components/advanced/area-insights"
import { AirQualityHeatmap } from "@/components/advanced/air-quality-heatmap"
import { WeatherIntegration } from "@/components/advanced/weather-integration"
import { AirQualityTimeline } from "@/components/advanced/air-quality-timeline"

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }
  return res.json().then(data => {
    if (data.error) {
      throw new Error(data.error)
    }
    return data
  })
})

export default function AirQualityDashboard() {
  const searchParams = useSearchParams()
  const [selectedLocation, setSelectedLocation] = useState<number>(1)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "advanced" | "analytics">("overview")
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const { data: locations, error: locationsError } = useSWR("/api/air-quality", fetcher)
  const {
    data: airQualityData,
    error: dataError,
    mutate,
  } = useSWR(selectedLocation ? `/api/air-quality?locationId=${selectedLocation}&limit=24` : null, fetcher)
  const { data: weeklyData } = useSWR(
    selectedLocation ? `/api/air-quality?locationId=${selectedLocation}&limit=168` : null,
    fetcher,
  )

  const currentLocation = locations?.find((loc: any) => loc.id === selectedLocation)
  const latestData = currentLocation?.latest

  // Handle initial loading
  React.useEffect(() => {
    if (locations && airQualityData) {
      const timer = setTimeout(() => setIsInitialLoading(false), 500)
      return () => clearTimeout(timer)
    }
  }, [locations, airQualityData])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetch("/api/air-quality", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationId: selectedLocation }),
      })
      mutate()
    } catch (error) {
      console.error("Failed to refresh data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "history":
        setActiveTab("analytics")
        break
      case "alerts":
        // Scroll to alerts section
        document.getElementById("alerts-section")?.scrollIntoView({ behavior: "smooth" })
        break
      case "recommendations":
        // Scroll to health recommendations
        document.getElementById("health-section")?.scrollIntoView({ behavior: "smooth" })
        break
    }
  }

  if (isInitialLoading) {
    return <PageLoader />
  }

  if (locationsError || dataError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <PremiumCard className="max-w-md">
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-xl font-semibold">Unable to load data</h2>
            <p className="text-muted-foreground">Please check your connection and try again.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </PremiumCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-primary/20 animate-pulse-glow">
                <Wind className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-balance">Air Quality Monitor</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Real-time air quality monitoring with advanced analytics and health recommendations for 30+ Bengaluru areas
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Enhanced Area Selection */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant={activeTab === "overview" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("overview")}
                  >
                    Overview
                  </Button>
                  <Button
                    variant={activeTab === "advanced" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("advanced")}
                  >
                    Advanced
                  </Button>
                  <Button
                    variant={activeTab === "analytics" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("analytics")}
                  >
                    Analytics
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="glass">
                  {isRefreshing ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh Data
                </Button>
              </div>
            </div>
            
            {activeTab === "advanced" ? (
              <EnhancedAreaSelector
                locations={locations || []}
                selectedLocation={selectedLocation}
                onLocationSelect={setSelectedLocation}
              />
            ) : (
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <Select
                  value={selectedLocation?.toString()}
                  onValueChange={(value) => setSelectedLocation(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-64 glass">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations?.map((location: any) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Current AQI Status */}
          {latestData ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <PremiumCard className="text-center glass-strong" glass>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2">Current Air Quality</h2>
                    <p className="text-muted-foreground">{currentLocation?.name}</p>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="text-6xl font-bold animate-float">{Math.round(latestData.aqi)}</div>
                      <div className="absolute -inset-4 rounded-full bg-primary/20 animate-pulse-glow" />
                    </div>
                  </div>

                  <AQIBadge aqi={latestData.aqi} size="lg" />

                  <p className="text-sm text-muted-foreground">
                    Last updated: {new Date(latestData.timestamp).toLocaleString()}
                  </p>
                </div>
              </PremiumCard>
            </motion.div>
          ) : (
            <CardSkeleton />
          )}

          {/* Tab Content */}
          {activeTab === "overview" && latestData && locations && (
            <>
              {/* Health Recommendations */}
              <div id="health-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <HealthRecommendations
                  aqi={latestData.aqi}
                  pollutants={{
                    pm25: latestData.pm25 || 0,
                    pm10: latestData.pm10 || 0,
                    o3: latestData.o3 || 0,
                    no2: latestData.no2 || 0,
                    so2: latestData.so2 || 0,
                    co: latestData.co || 0,
                  }}
                  className="lg:col-span-2"
                />
                <HealthTips aqi={latestData.aqi} />
              </div>

              {/* Data Visualization Charts */}
              {airQualityData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AQIGauge aqi={latestData.aqi} className="xl:col-span-1" />
                  <PollutantBreakdown
                    data={{
                      pm25: latestData.pm25 || 0,
                      pm10: latestData.pm10 || 0,
                      o3: latestData.o3 || 0,
                      no2: latestData.no2 || 0,
                      so2: latestData.so2 || 0,
                      co: latestData.co || 0,
                    }}
                    className="xl:col-span-2"
                  />
                  <AQITrendChart data={airQualityData} className="lg:col-span-2" />
                  {weeklyData && <WeeklyComparison data={weeklyData} className="lg:col-span-1" />}
                </div>
              )}
            </>
          )}

          {activeTab === "advanced" && latestData && locations && (
            <>
              {/* Advanced Features */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MultiAreaComparison locations={locations} className="lg:col-span-2" />
                <AreaInsights 
                  location={currentLocation} 
                  allLocations={locations}
                  className="lg:col-span-2"
                />
              </div>

              {/* Heatmap and Weather Integration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AirQualityHeatmap locations={locations} />
                <WeatherIntegration 
                  locationName={currentLocation?.name || ""}
                  aqi={latestData.aqi}
                />
              </div>

              {/* Prediction and Alerts */}
              {airQualityData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <PredictionEngine historicalData={airQualityData} className="xl:col-span-2" />
                  <div id="alerts-section">
                    <RealTimeAlerts currentAQI={latestData.aqi} />
                  </div>
                  <LocationComparison currentLocationId={selectedLocation} className="lg:col-span-2 xl:col-span-1" />
                </div>
              )}
            </>
          )}

          {activeTab === "analytics" && airQualityData && (
            <>
              {/* Timeline Analysis */}
              <AirQualityTimeline data={airQualityData} />
              
              {/* Additional Analytics */}
              {weeklyData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <WeeklyComparison data={weeklyData} />
                  <AQITrendChart data={airQualityData} />
                </div>
              )}
            </>
          )}

          {/* Pollutant Metrics Grid */}
          {latestData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <MetricCard
                title="PM2.5"
                value={latestData.pm25?.toFixed(1) || "N/A"}
                unit="μg/m³"
                description="Fine particulate matter"
                icon={<Cloud className="h-5 w-5" />}
                trend={latestData.pm25 > 35 ? "up" : latestData.pm25 < 12 ? "down" : "neutral"}
              />
              <MetricCard
                title="PM10"
                value={latestData.pm10?.toFixed(1) || "N/A"}
                unit="μg/m³"
                description="Coarse particulate matter"
                icon={<Wind className="h-5 w-5" />}
                trend={latestData.pm10 > 150 ? "up" : latestData.pm10 < 50 ? "down" : "neutral"}
              />
              <MetricCard
                title="Ozone (O₃)"
                value={latestData.o3?.toFixed(1) || "N/A"}
                unit="μg/m³"
                description="Ground-level ozone"
                icon={<Eye className="h-5 w-5" />}
                trend={latestData.o3 > 160 ? "up" : latestData.o3 < 100 ? "down" : "neutral"}
              />
              <MetricCard
                title="NO₂"
                value={latestData.no2?.toFixed(1) || "N/A"}
                unit="μg/m³"
                description="Nitrogen dioxide"
                icon={<Activity className="h-5 w-5" />}
                trend={latestData.no2 > 100 ? "up" : latestData.no2 < 40 ? "down" : "neutral"}
              />
              <MetricCard
                title="SO₂"
                value={latestData.so2?.toFixed(1) || "N/A"}
                unit="μg/m³"
                description="Sulfur dioxide"
                icon={<Thermometer className="h-5 w-5" />}
                trend={latestData.so2 > 80 ? "up" : latestData.so2 < 20 ? "down" : "neutral"}
              />
              <MetricCard
                title="CO"
                value={latestData.co?.toFixed(1) || "N/A"}
                unit="mg/m³"
                description="Carbon monoxide"
                icon={<Leaf className="h-5 w-5" />}
                trend={latestData.co > 10 ? "up" : latestData.co < 4 ? "down" : "neutral"}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <PremiumCard className="glass" glass>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">Manage your air quality monitoring</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="glass bg-transparent"
                  onClick={() => handleQuickAction("history")}
                >
                  View History
                </Button>
                <Button 
                  variant="outline" 
                  className="glass bg-transparent"
                  onClick={() => handleQuickAction("alerts")}
                >
                  Set Alerts
                </Button>
                <Button 
                  className="gradient-primary text-white"
                  onClick={() => handleQuickAction("recommendations")}
                >
                  Get Recommendations
                </Button>
              </div>
            </div>
          </PremiumCard>
        </div>
      </section>
    </div>
  )
}
