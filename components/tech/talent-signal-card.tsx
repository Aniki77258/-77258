"use client"

import { cn } from "@/lib/utils"
import { EnergyBadge } from "./energy-badge"

interface TalentSignalCardProps {
  name: string
  title: string
  country: string
  industry: "wind" | "lithium" | "storage"
  skills: string[]
  matchScore: number
  credibilityScore: number
  verificationStatus: "verified" | "pending" | "unverified"
  authorizationStatus: "authorized" | "pending" | "expired"
  aiReason?: string
  riskLevel?: "low" | "medium" | "high"
  isDemo?: boolean
  className?: string
  onView?: () => void
  onInvite?: () => void
}

const industryBadge = { wind: "blue" as const, lithium: "green" as const, storage: "purple" as const }
const industryLabel = { wind: "风能", lithium: "锂电", storage: "储能" }

export function TalentSignalCard({
  name, title, country, industry, skills, matchScore, credibilityScore,
  verificationStatus, authorizationStatus, aiReason, riskLevel, isDemo = true,
  className, onView, onInvite
}: TalentSignalCardProps) {
  const verLabel = verificationStatus === "verified" ? "已核验" : verificationStatus === "pending" ? "核验中" : "未核验"
  const authLabel = authorizationStatus === "authorized" ? "已授权" : authorizationStatus === "pending" ? "待授权" : "已过期"

  const verVariant = verificationStatus === "verified" ? "verified" as const : verificationStatus === "pending" ? "pending" as const : "red" as const
  const authVariant = authorizationStatus === "authorized" ? "authorized" as const : authorizationStatus === "pending" ? "amber" as const : "red" as const

  const ringColor = matchScore >= 85 ? "bg-gradient-to-br from-[#38bdf8] to-[#22d3ee]" :
    matchScore >= 70 ? "bg-gradient-to-br from-[#38bdf8] to-[#a78bfa]" :
    "bg-gradient-to-br from-[#94a3b8] to-[#64748b]"

  return (
    <div className={cn(
      "glass-card scan-line group cursor-pointer",
      className
    )}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-3">
        {/* Match ring */}
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#0a1628] border border-white/5">
            <svg className="w-14 h-14 absolute inset-0 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="17" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2.5" />
              <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${matchScore * 1.07} 107`}
                className={matchScore >= 85 ? "text-[#22d3ee]" : matchScore >= 70 ? "text-[#38bdf8]" : "text-[#94a3b8]"}
              />
            </svg>
            <span className="relative text-sm font-bold text-white">{matchScore}%</span>
          </div>
          <p className="text-center text-[9px] text-slate-500 mt-1">匹配度</p>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm">{name}</h3>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{title}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <EnergyBadge variant={industryBadge[industry]}>{industryLabel[industry]}</EnergyBadge>
            <EnergyBadge variant={verVariant}>{verLabel}</EnergyBadge>
            <EnergyBadge variant={authVariant}>{authLabel}</EnergyBadge>
            <EnergyBadge variant="muted">{country}</EnergyBadge>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {skills.slice(0, 4).map(s => (
          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[#0a1628] border border-white/5 text-slate-400">
            {s}
          </span>
        ))}
        {skills.length > 4 && (
          <span className="text-[10px] text-slate-600">+{skills.length - 4}</span>
        )}
      </div>

      {/* Credibility bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-slate-500">数据可信度</span>
          <span className={cn("font-semibold", credibilityScore >= 80 ? "text-[#4ade80]" : credibilityScore >= 60 ? "text-[#fbbf24]" : "text-[#f87171]")}>
            {credibilityScore}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[#0a1628] overflow-hidden">
          <div className={cn("h-full rounded-full transition-all", credibilityScore >= 80 ? "progress-flow-green" : credibilityScore >= 60 ? "progress-flow" : "bg-[#f87171]")}
            style={{ width: `${credibilityScore}%` }} />
        </div>
      </div>

      {/* AI Reason */}
      {aiReason && (
        <div className="mb-3 p-2.5 rounded-lg bg-[#0a1628]/50 border border-[#38bdf8]/10">
          <p className="text-[10px] text-slate-500 flex items-center gap-1 mb-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
            AI 推荐理由
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">{aiReason}</p>
        </div>
      )}

      {/* Risk */}
      {riskLevel && riskLevel !== "low" && (
        <div className={cn(
          "text-[10px] px-2 py-1.5 rounded-md mb-3 flex items-center gap-1",
          riskLevel === "high" ? "bg-[#f87171]/10 border border-[#f87171]/20 text-[#f87171]" : "bg-[#fbbf24]/10 border border-[#fbbf24]/20 text-[#fbbf24]"
        )}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-current" />
          {riskLevel === "high" ? "高风险候选人，建议人工复核" : "中风险候选人，注意核验"}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 py-2 rounded-lg text-xs font-medium text-[#38bdf8] border border-[#38bdf8]/20 hover:bg-[#38bdf8]/10 hover:border-[#38bdf8]/40 transition-all"
        >
          查看详情
        </button>
        <button
          onClick={onInvite}
          className="flex-1 py-2 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all"
        >
          发起邀请
        </button>
      </div>

      {/* Demo badge */}
      {isDemo && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <EnergyBadge variant="demo">示例数据</EnergyBadge>
        </div>
      )}
    </div>
  )
}
