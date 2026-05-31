"use client"

import { cn } from "@/lib/utils"
import { BotMessageSquare, AlertTriangle, ArrowRight } from "lucide-react"

export interface AIInsight {
  title: string
  description: string
  priority: "high" | "medium" | "low"
  action?: string
}

interface AIInsightPanelProps {
  insights: AIInsight[]
  className?: string
  title?: string
}

const priorityConfig = {
  high: { color: "text-[#f87171]", bg: "bg-[#f87171]/10", border: "border-[#f87171]/20", dot: "bg-[#f87171]" },
  medium: { color: "text-[#fbbf24]", bg: "bg-[#fbbf24]/10", border: "border-[#fbbf24]/20", dot: "bg-[#fbbf24]" },
  low: { color: "text-[#4ade80]", bg: "bg-[#4ade80]/10", border: "border-[#4ade80]/20", dot: "bg-[#4ade80]" },
}

const priorityLabel = { high: "高优先", medium: "中优先", low: "低优先" }

export function AIInsightPanel({ insights, className, title = "AI 决策建议中心" }: AIInsightPanelProps) {
  return (
    <div className={cn("glass-card glow-border", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22d3ee]/20 to-[#38bdf8]/20 flex items-center justify-center">
          <BotMessageSquare className="w-4 h-4 text-[#22d3ee]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-[10px] text-slate-500">AI 仅供参考，最终决策请由人工复核</p>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        {insights.map((insight, i) => {
          const cfg = priorityConfig[insight.priority]
          return (
            <div
              key={i}
              className={cn("p-3 rounded-lg border transition-all hover:border-opacity-40", cfg.bg, cfg.border)}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <div className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xs font-semibold text-white">{insight.title}</h4>
                    <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full border", cfg.color, cfg.border)}>
                      {priorityLabel[insight.priority]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
                  {insight.action && (
                    <button className="mt-2 text-[10px] text-[#38bdf8] hover:text-[#22d3ee] flex items-center gap-1 transition-colors">
                      <ArrowRight className="w-3 h-3" />
                      {insight.action}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-start gap-1.5">
        <AlertTriangle className="w-3 h-3 text-[#fbbf24] flex-shrink-0 mt-0.5" />
        <p className="text-[9px] text-slate-600 leading-relaxed">
          AI 生成建议基于历史示例数据训练，不构成招聘决策依据。所有候选人信息建议通过官方渠道核实。
        </p>
      </div>
    </div>
  )
}
