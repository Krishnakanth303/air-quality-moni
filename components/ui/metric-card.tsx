"use client"

import type React from "react"

import { PremiumCard } from "./premium-card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function MetricCard({ title, value, unit, trend, trendValue, description, icon, className }: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-400" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-400" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <PremiumCard className={cn("glass", className)} glass>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="text-primary">{icon}</div>}
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight">{value}</span>
            {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
          </div>

          {(trend || trendValue) && (
            <div className="flex items-center gap-1 text-sm">
              {trend && getTrendIcon()}
              {trendValue && (
                <span
                  className={cn(
                    "font-medium",
                    trend === "up" && "text-red-400",
                    trend === "down" && "text-green-400",
                    trend === "neutral" && "text-muted-foreground",
                  )}
                >
                  {trendValue}
                </span>
              )}
            </div>
          )}
        </div>

        {description && <p className="text-xs text-muted-foreground text-pretty">{description}</p>}
      </div>
    </PremiumCard>
  )
}
