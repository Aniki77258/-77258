"use client"

import { cn } from "@/lib/utils"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface MetricGlowCardProps {
  label: string
  value: string
  delta?: string
  trend?: "up" | "down" | "flat"
  sub?: string
  icon?: React.ReactNode
  glowColor?: "blue" | "green" | "purple" | "cyan"
  className?: string
}

const glowMap = {
  blue: "hover:border-[#38bdf8]/30 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)]",
  green: "hover:border-[#4ade80]/30 hover:shadow-[0_0_20px_rgba(74,222,128,0.1)]",
  purple: "hover:border-[#a78bfa]/30 hover:shadow-[0_0_20px_rgba(167,139,250,0.1)]",
  cyan: "hover:border-[#22d3ee]/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]",
}

const valueGlow = {
  blue: "text-[#38bdf8] num-glow",
  green: "text-[#4ade80]",
  purple: "text-[#a78bfa]",
  cyan: "text-[#22d3ee]",
}

export function MetricGlowCard({
  label, value, delta, trend, sub, icon, glowColor = "blue", className
}: MetricGlowCardProps) {
  return (
    <div
      className={cn(
        "glass-card group",
        glowMap[glowColor],
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider line-clamp-1">
          {label}
        </p>
        {icon && <div className="text-slate-500 group-hover:text-[#38bdf8] transition-colors">{icon}</div>}
      </div>
      <p className={cn("text-2xl md:text-3xl font-bold tracking-tight", valueGlow[glowColor])}>
        {value}
      </p>
      {(delta || sub) && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {delta && trend && (
            <span className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold",
              trend === "up" ? "text-[#4ade80]" : trend === "down" ? "text-[#f87171]" : "text-slate-500"
            )}>
              {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {delta}
            </span>
          )}
          {sub && (
            <span className="badge-tech-muted text-[9px]">{sub}</span>
          )}
        </div>
      )}
    </div>
  )
}
