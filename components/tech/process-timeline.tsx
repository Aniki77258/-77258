"use client"

import { cn } from "@/lib/utils"
import { Check, Clock, Loader2 } from "lucide-react"

export interface TimelineStep {
  key: string
  label: string
  status: "completed" | "current" | "pending" | "cancelled"
  date?: string
  description?: string
}

interface ProcessTimelineProps {
  steps: TimelineStep[]
  className?: string
}

const statusConfig = {
  completed: {
    dotClass: "bg-[#4ade80] border-[#4ade80]",
    lineClass: "bg-[#4ade80]/50",
    textClass: "text-[#4ade80]",
    icon: Check,
  },
  current: {
    dotClass: "bg-[#38bdf8] border-[#38bdf8] energy-pulse",
    lineClass: "bg-gradient-to-b from-[#38bdf8]/50 to-transparent",
    textClass: "text-[#38bdf8]",
    icon: Loader2,
  },
  pending: {
    dotClass: "bg-transparent border-[#334155]",
    lineClass: "bg-[#1e293b]",
    textClass: "text-slate-600",
    icon: Clock,
  },
  cancelled: {
    dotClass: "bg-transparent border-[#f87171]/50",
    lineClass: "bg-[#f87171]/20",
    textClass: "text-[#f87171]/50 line-through",
    icon: Clock,
  },
}

export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {steps.map((step, i) => {
        const config = statusConfig[step.status]
        const Icon = config.icon
        const isLast = i === steps.length - 1

        return (
          <div key={step.key} className="flex gap-3">
            {/* Timeline dot + line */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                config.dotClass
              )}>
                <Icon className={cn("w-3 h-3", step.status === "current" && "animate-spin")} />
              </div>
              {!isLast && <div className={cn("w-0.5 flex-1 min-h-[24px]", config.lineClass)} />}
            </div>

            {/* Content */}
            <div className={cn("pb-4", isLast && "pb-0")}>
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-medium", config.textClass)}>{step.label}</span>
                {step.date && (
                  <span className="text-[10px] text-slate-600">{step.date}</span>
                )}
              </div>
              {step.description && (
                <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
