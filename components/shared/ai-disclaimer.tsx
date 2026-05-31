"use client"

import { AlertTriangle, Shield, Info } from "lucide-react"

export function AIDisclaimer({ className }: { className?: string }) {
  return (
    <div className={`rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 ${className || ""}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
        <div className="space-y-2 text-sm text-amber-300/80">
          <p className="font-medium text-amber-400">AI 生成建议，仅供参考</p>
          <p>
            以下内容由 AI 自动生成，不构成专业建议。请结合实际情况做出最终判断，不得将 AI 输出作为唯一决策依据。
          </p>
        </div>
      </div>
    </div>
  )
}

export function AISafetyNote() {
  return (
    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
      <div className="flex items-start gap-2">
        <Shield className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
        <div className="text-xs text-red-300/70 space-y-1">
          <p className="font-medium text-red-400">AI 安全使用提示</p>
          <p>
            1. 不得基于受保护特征（种族、性别、年龄、宗教、国籍等）做招聘决策
          </p>
          <p>2. 不得使用 AI 自动拒绝候选人</p>
          <p>3. 敏感决策必须经过人工确认</p>
        </div>
      </div>
    </div>
  )
}

export function AIGeneratedBadge({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/25">
      <Info className="h-3 w-3" />
      {label || "AI 生成"}
    </span>
  )
}
