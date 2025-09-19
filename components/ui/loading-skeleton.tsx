"use client"

import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-shimmer"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("glass p-6 space-y-4 animate-pulse", className)}>
      <div className="h-6 bg-muted rounded animate-shimmer w-1/3" />
      <div className="h-8 bg-muted rounded animate-shimmer w-1/2" />
      <LoadingSkeleton lines={2} />
    </div>
  )
}

export function MetricCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("glass p-4 space-y-3 animate-pulse", className)}>
      <div className="flex items-center justify-between">
        <div className="h-4 bg-muted rounded w-16" />
        <div className="h-5 w-5 bg-muted rounded" />
      </div>
      <div className="h-8 bg-muted rounded w-20" />
      <div className="h-3 bg-muted rounded w-24" />
    </div>
  )
}
