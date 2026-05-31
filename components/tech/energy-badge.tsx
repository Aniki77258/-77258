"use client"

import { cn } from "@/lib/utils"

type EnergyVariant = "verified" | "pending" | "authorized" | "masked" | "high-risk" | "demo" | "blue" | "green" | "purple" | "cyan" | "red" | "amber" | "muted"

interface EnergyBadgeProps {
  variant?: EnergyVariant
  children: React.ReactNode
  className?: string
  pulse?: boolean
}

const variantMap: Record<EnergyVariant, string> = {
  verified: "energy-badge-verified",
  pending: "energy-badge-pending",
  authorized: "energy-badge-authorized",
  masked: "energy-badge-masked",
  "high-risk": "energy-badge-high-risk",
  demo: "energy-badge-demo",
  blue: "badge-tech-blue",
  green: "badge-tech-green",
  purple: "badge-tech-purple",
  cyan: "badge-tech-cyan",
  red: "badge-tech-red",
  amber: "badge-tech-amber",
  muted: "badge-tech-muted",
}

export function EnergyBadge({ variant = "blue", children, className, pulse }: EnergyBadgeProps) {
  return (
    <span className={cn(variantMap[variant], pulse && "energy-pulse", className)}>
      {pulse && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  )
}
