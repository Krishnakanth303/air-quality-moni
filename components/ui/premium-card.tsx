"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface PremiumCardProps {
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  glass?: boolean
  animated?: boolean
  gradient?: boolean
}

export function PremiumCard({
  children,
  className,
  title,
  description,
  glass = false,
  animated = true,
  gradient = false,
}: PremiumCardProps) {
  const cardClasses = cn("relative overflow-hidden", glass && "glass", gradient && "gradient-accent", className)

  const CardComponent = animated ? motion.div : "div"
  const cardProps = animated
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        whileHover: { y: -5, transition: { duration: 0.2 } },
      }
    : {}

  return (
    <CardComponent {...cardProps}>
      <Card className={cardClasses}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle className="text-balance">{title}</CardTitle>}
            {description && <CardDescription className="text-pretty">{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </CardComponent>
  )
}
