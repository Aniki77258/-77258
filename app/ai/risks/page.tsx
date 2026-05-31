"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIDisclaimer, AIGeneratedBadge } from "@/components/shared/ai-disclaimer"
import {
  AlertTriangle, Sparkles, Loader2, Shield, Info,
  Timer, FileWarning, Send, Ban, Users,
} from "lucide-react"
import type { RiskCheckResult, RiskAlert, RiskLevel } from "@/lib/ai/types"

const levelConfig: Record<RiskLevel, { color: string; bg: string; border: string; label: string; icon: any }> = {
  critical: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", label: "严重", icon: Ban },
  high: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", label: "高", icon: AlertTriangle },
  medium: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30", label: "中", icon: Timer },
  low: { color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20", label: "低", icon: Info },
}

const typeIcons: Record<string, any> = {
  data_trust: FileWarning,
  authorization: Shield,
  engagement: Users,
  process: Timer,
  operation: Send,
  compliance: Shield,
}

export default function AIRisksPage() {
  const [candidateCountry, setCandidateCountry] = useState("")
  const [candidateActivity, setCandidateActivity] = useState<string>("")
  const [dataTrustLevel, setDataTrustLevel] = useState(70)
  const [interviewDays, setInterviewDays] = useState(0)
  const [offerDays, setOfferDays] = useState(0)
  const [alreadyInvited, setAlreadyInvited] = useState(false)
  const [authStatus, setAuthStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RiskCheckResult | null>(null)

  async function handleCheck() {
    setLoading(true)
    const res = await fetch("/api/ai/risks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidateCountry: candidateCountry || undefined,
        candidateActivity: candidateActivity || undefined,
        dataTrustLevel,
        interviewDaysSinceRequest: interviewDays || undefined,
        offerDaysSinceSent: offerDays || undefined,
        alreadyInvited,
        authorizationStatus: authStatus || undefined,
      }),
    })
    const json = await res.json()
    setResult(json.data)
    setLoading(false)
  }

  const PRESET_SCENARIOS = [
    { label: "高风险候选", data: { dataTrustLevel: 30, authStatus: "expired", interviewDays: 10, offerDays: 8, alreadyInvited: true } },
    { label: "正常流程", data: { dataTrustLevel: 75, interviewDays: 2, offerDays: 0 } },
    { label: "合规风险", data: { candidateCountry: "德国", dataTrustLevel: 55, authStatus: "unknown" } },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-red-400" /> AI 风险预警
        </h1>
        <p className="mt-1 text-sm text-slate-400">自动检测数据可信度、合规风险、流程异常等 6 类风险</p>
      </div>

      <AIDisclaimer />

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 self-center mr-1">快速场景：</span>
        {PRESET_SCENARIOS.map((p) => (
          <button key={p.label}
            onClick={() => {
              setDataTrustLevel(p.data.dataTrustLevel ?? 70)
              setAuthStatus(p.data.authStatus ?? "")
              setInterviewDays(p.data.interviewDays ?? 0)
              setOfferDays(p.data.offerDays ?? 0)
              setAlreadyInvited(p.data.alreadyInvited ?? false)
              if (p.data.candidateCountry) setCandidateCountry(p.data.candidateCountry)
            }}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:border-red-500/40 hover:bg-red-500/10 transition">
            {p.label}
          </button>
        ))}
      </div>

      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-white/80 text-sm mb-1">候选人国家</label>
              <input type="text" value={candidateCountry} onChange={(e) => setCandidateCountry(e.target.value)}
                placeholder="如: 德国 / 留空跳过"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-red-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">数据可信度 (0-100)</label>
              <input type="number" value={dataTrustLevel} onChange={(e) => setDataTrustLevel(Number(e.target.value))}
                min={0} max={100}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">授权状态</label>
              <select value={authStatus} onChange={(e) => setAuthStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50">
                <option value="" className="bg-[#0a1120]">正常（跳过）</option>
                <option value="expired" className="bg-[#0a1120]">已过期</option>
                <option value="revoked" className="bg-[#0a1120]">已撤销</option>
                <option value="unknown" className="bg-[#0a1120]">未知</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">候选人活跃度</label>
              <select value={candidateActivity} onChange={(e) => setCandidateActivity(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50">
                <option value="" className="bg-[#0a1120]">正常（跳过）</option>
                <option value="high" className="bg-[#0a1120]">高</option>
                <option value="medium" className="bg-[#0a1120]">中</option>
                <option value="low" className="bg-[#0a1120]">低</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">面试等待天数</label>
              <input type="number" value={interviewDays} onChange={(e) => setInterviewDays(Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">Offer 等待天数</label>
              <input type="number" value={offerDays} onChange={(e) => setOfferDays(Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50" />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
            <input type="checkbox" checked={alreadyInvited} onChange={(e) => setAlreadyInvited(e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-red-500" />
            90 天内已发送过邀请
          </label>

          <Button onClick={handleCheck} disabled={loading}
            className="bg-gradient-to-r from-red-500 to-orange-600 text-white">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <AlertTriangle className="h-4 w-4 mr-2" />}
            {loading ? "AI 正在扫描风险…" : "执行风险检查"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Summary */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-slate-400">风险概览</p>
                  <p className="text-3xl font-bold text-white mt-1">{result.totalRisks}</p>
                  <p className="text-xs text-slate-500">共发现 {result.totalRisks} 项风险</p>
                </div>
                <div className="flex gap-4">
                  <RiskBadge level="critical" count={result.critical} />
                  <RiskBadge level="high" count={result.high} />
                  <RiskBadge level="medium" count={result.medium} />
                  <RiskBadge level="low" count={result.low} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {result.alerts.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" /> 风险详情 <AIGeneratedBadge />
              </h3>
              {result.alerts.map((alert: RiskAlert) => {
                const lc = levelConfig[alert.level]
                const Icon = typeIcons[alert.type] || AlertTriangle
                return (
                  <Card key={alert.id} className={`border ${lc.border} bg-white/[0.03]`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${lc.bg} ${lc.border}`}>
                          <Icon className={`h-4 w-4 ${lc.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-white font-medium text-sm">{alert.title}</span>
                            <Badge variant="outline" className={`text-[10px] ${lc.border} ${lc.color}`}>
                              {lc.label}风险
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{alert.description}</p>
                          <div className="rounded bg-white/5 border border-white/5 px-3 py-1.5">
                            <p className="text-xs text-emerald-400/80">
                              <span className="font-medium">建议：</span>{alert.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="border-emerald-500/20 bg-emerald-500/[0.03]">
              <CardContent className="p-5 text-center">
                <Shield className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-emerald-400 font-medium">未发现风险</p>
                <p className="text-slate-400 text-xs mt-1">当前流程状态正常，无需关注</p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

function RiskBadge({ level, count }: { level: RiskLevel; count: number }) {
  const lc = levelConfig[level]
  return (
    <div className="text-center">
      <span className={`text-lg font-bold ${lc.color} block`}>{count}</span>
      <span className="text-[10px] text-slate-500">{lc.label}</span>
    </div>
  )
}
