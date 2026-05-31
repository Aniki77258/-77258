"use client"

import { Check, ChevronRight } from "lucide-react"

export interface Step {
  key: string
  label: string
  href?: string
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: string
  className?: string
}

export function ProgressStepper({ steps, currentStep, className = "" }: ProgressStepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep)

  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white text-sm font-medium">流程进度</span>
        <span className="text-slate-400 text-xs">
          {currentIndex + 1} / {steps.length}
        </span>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {steps.map((step, i) => {
          const isCompleted = i < currentIndex
          const isCurrent = i === currentIndex
          const isFuture = i > currentIndex

          return (
            <div key={step.key} className="flex items-center gap-1.5 flex-shrink-0">
              {i > 0 && (
                <ChevronRight className={`w-3 h-3 flex-shrink-0 ${isCompleted ? "text-emerald-500" : "text-slate-600"}`} />
              )}
              <div
                className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  isCompleted
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : isCurrent
                    ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    : "bg-white/5 text-slate-500 border border-white/5"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span className={`w-3 h-3 rounded-full flex items-center justify-center text-[10px] ${
                    isCurrent ? "bg-sky-500/30" : "bg-slate-700"
                  }`}>
                    {i + 1}
                  </span>
                )}
                <span className="whitespace-nowrap">{step.label}</span>
              </div>
            </div>
          )
        })}
      </div>
      {/* Progress bar */}
      <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
