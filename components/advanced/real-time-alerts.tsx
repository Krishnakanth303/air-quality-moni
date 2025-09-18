"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, AlertTriangle, CheckCircle, X, Settings, Volume2, VolumeX } from "lucide-react"
import { PremiumCard } from "@/components/ui/premium-card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

interface Alert {
  id: string
  type: "warning" | "danger" | "info"
  title: string
  message: string
  timestamp: Date
  dismissed: boolean
}

interface RealTimeAlertsProps {
  currentAQI: number
  className?: string
}

export function RealTimeAlerts({ currentAQI, className }: RealTimeAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [thresholds, setThresholds] = useState({
    moderate: 100,
    unhealthy: 150,
    dangerous: 200,
  })
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (!alertsEnabled) return

    const checkAlerts = () => {
      const newAlerts: Alert[] = []

      if (currentAQI >= thresholds.dangerous) {
        newAlerts.push({
          id: `danger-${Date.now()}`,
          type: "danger",
          title: "Dangerous Air Quality",
          message: "AQI is extremely high. Stay indoors and avoid all outdoor activities.",
          timestamp: new Date(),
          dismissed: false,
        })
      } else if (currentAQI >= thresholds.unhealthy) {
        newAlerts.push({
          id: `warning-${Date.now()}`,
          type: "warning",
          title: "Unhealthy Air Quality",
          message: "AQI is unhealthy. Limit outdoor exposure and consider wearing masks.",
          timestamp: new Date(),
          dismissed: false,
        })
      } else if (currentAQI >= thresholds.moderate) {
        newAlerts.push({
          id: `info-${Date.now()}`,
          type: "info",
          title: "Moderate Air Quality",
          message: "AQI is moderate. Sensitive individuals should limit prolonged outdoor activities.",
          timestamp: new Date(),
          dismissed: false,
        })
      }

      // Only add new alerts if they don't already exist
      const existingTypes = alerts.map((a) => a.type)
      const filteredNewAlerts = newAlerts.filter((alert) => !existingTypes.includes(alert.type))

      if (filteredNewAlerts.length > 0) {
        setAlerts((prev) => [...prev, ...filteredNewAlerts])

        // Play sound notification
        if (soundEnabled) {
          // In a real app, you'd play an actual sound file
          console.log("🔔 Alert notification sound")
        }
      }
    }

    checkAlerts()
  }, [currentAQI, thresholds, alertsEnabled, soundEnabled, alerts])

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === id ? { ...alert, dismissed: true } : alert)))
  }

  const clearAllAlerts = () => {
    setAlerts([])
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-400" />
      default:
        return <CheckCircle className="h-5 w-5 text-blue-400" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "danger":
        return "border-red-400/50 bg-red-400/10"
      case "warning":
        return "border-orange-400/50 bg-orange-400/10"
      default:
        return "border-blue-400/50 bg-blue-400/10"
    }
  }

  const activeAlerts = alerts.filter((alert) => !alert.dismissed)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      <PremiumCard title="Real-time Alerts" description="Smart notifications for air quality changes" glass>
        <div className="space-y-4">
          {/* Alert Controls */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-accent/30">
            <div className="flex items-center gap-4">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <h4 className="font-medium">Alert System</h4>
                <p className="text-sm text-muted-foreground">
                  {activeAlerts.length} active alert{activeAlerts.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
              {activeAlerts.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAllAlerts}>
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 p-4 rounded-lg border border-border/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Enable Alerts</span>
                  <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sound Notifications</span>
                  <div className="flex items-center gap-2">
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Moderate Alert Threshold</label>
                    <Slider
                      value={[thresholds.moderate]}
                      onValueChange={(value) => setThresholds((prev) => ({ ...prev, moderate: value[0] }))}
                      max={200}
                      min={50}
                      step={10}
                      className="mt-2"
                    />
                    <span className="text-xs text-muted-foreground">AQI: {thresholds.moderate}</span>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Unhealthy Alert Threshold</label>
                    <Slider
                      value={[thresholds.unhealthy]}
                      onValueChange={(value) => setThresholds((prev) => ({ ...prev, unhealthy: value[0] }))}
                      max={250}
                      min={100}
                      step={10}
                      className="mt-2"
                    />
                    <span className="text-xs text-muted-foreground">AQI: {thresholds.unhealthy}</span>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Dangerous Alert Threshold</label>
                    <Slider
                      value={[thresholds.dangerous]}
                      onValueChange={(value) => setThresholds((prev) => ({ ...prev, dangerous: value[0] }))}
                      max={300}
                      min={150}
                      step={10}
                      className="mt-2"
                    />
                    <span className="text-xs text-muted-foreground">AQI: {thresholds.dangerous}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Alerts */}
          <div className="space-y-3">
            <AnimatePresence>
              {activeAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">{alert.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {activeAlerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <h3 className="font-medium mb-2">No Active Alerts</h3>
                <p className="text-sm text-muted-foreground">Air quality is within acceptable levels</p>
              </div>
            )}
          </div>
        </div>
      </PremiumCard>
    </motion.div>
  )
}
