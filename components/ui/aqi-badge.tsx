"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AQIBadgeProps {
  aqi: number
  className?: string
  size?: "sm" | "md" | "lg"
}

export function AQIBadge({ aqi, className, size = "md" }: AQIBadgeProps) {
  const getAQIInfo = (aqi: number) => {
    if (aqi <= 50) return { category: "Good", color: "aqi-good", bgColor: "bg-aqi-good" }
    if (aqi <= 100) return { category: "Moderate", color: "aqi-moderate", bgColor: "bg-aqi-moderate" }
    if (aqi <= 150)
      return {
        category: "Unhealthy for Sensitive",
        color: "aqi-unhealthy-sensitive",
        bgColor: "bg-aqi-unhealthy-sensitive",
      }
    if (aqi <= 200) return { category: "Unhealthy", color: "aqi-unhealthy", bgColor: "bg-aqi-unhealthy" }
    if (aqi <= 300) return { category: "Very Unhealthy", color: "aqi-very-unhealthy", bgColor: "bg-aqi-very-unhealthy" }
    return { category: "Hazardous", color: "aqi-hazardous", bgColor: "bg-aqi-hazardous" }
  }

  const { category, bgColor } = getAQIInfo(aqi)

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  }

  return (
    <Badge className={cn(bgColor, "text-white font-semibold border-0", sizeClasses[size], className)}>
      {aqi} - {category}
    </Badge>
  )
}
