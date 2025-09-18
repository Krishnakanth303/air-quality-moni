"use client"

import { motion } from "framer-motion"
import { Lightbulb, Cast as Mask, Home, Car, Leaf, Wind } from "lucide-react"
import { PremiumCard } from "@/components/ui/premium-card"

interface HealthTipsProps {
  aqi: number
  className?: string
}

export function HealthTips({ aqi, className }: HealthTipsProps) {
  const getTips = (aqi: number) => {
    const baseTips = [
      {
        icon: Home,
        title: "Indoor Air Quality",
        tip: "Use air purifiers with HEPA filters to improve indoor air quality",
        priority: "high",
      },
      {
        icon: Leaf,
        title: "Natural Solutions",
        tip: "Add air-purifying plants like spider plants and peace lilies to your home",
        priority: "medium",
      },
    ]

    if (aqi > 100) {
      baseTips.unshift(
        {
          icon: Mask,
          title: "Protective Gear",
          tip: "Wear N95 or KN95 masks when going outdoors",
          priority: "high",
        },
        {
          icon: Car,
          title: "Transportation",
          tip: "Use air recirculation mode in your car and avoid busy roads",
          priority: "high",
        },
      )
    }

    if (aqi > 150) {
      baseTips.unshift({
        icon: Wind,
        title: "Stay Indoors",
        tip: "Limit outdoor activities and keep windows closed",
        priority: "critical",
      })
    }

    return baseTips
  }

  const tips = getTips(aqi)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-400"
      case "high":
        return "text-orange-400"
      case "medium":
        return "text-yellow-400"
      default:
        return "text-blue-400"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={className}
    >
      <PremiumCard title="Health Tips" description="Practical advice to protect your health" glass>
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-start gap-4 p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
            >
              <div className="p-2 rounded-full bg-primary/20">
                <tip.icon className={`h-5 w-5 ${getPriorityColor(tip.priority)}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.tip}</p>
              </div>
              <div className="flex items-center gap-1">
                <Lightbulb className={`h-4 w-4 ${getPriorityColor(tip.priority)}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </PremiumCard>
    </motion.div>
  )
}
