"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIDisclaimer, AIGeneratedBadge } from "@/components/shared/ai-disclaimer"
import { FileCheck2, Sparkles, Star, AlertTriangle, Loader2, TrendingUp } from "lucide-react"

export default function AIAssessmentPage() {
  const [candidateName, setCandidateName] = useState("")
  const [candidateTitle, setCandidateTitle] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [industry, setIndustry] = useState<"wind" | "lithium" | "both">("wind")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleGenerate() {
    if (!candidateName || !jobTitle) return
    setLoading(true)
    const res = await fetch("/api/ai/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateName, candidateTitle, jobTitle, industry }),
    })
    const json = await res.json()
    setResult(json)
    setLoading(false)
  }

  const recColor: Record<string, string> = {
    strong_hire: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    hire: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    consider: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    not_recommend: "text-red-400 bg-red-500/10 border-red-500/30",
  }

  const recLabel: Record<string, string> = {
    strong_hire: "强烈推荐录用",
    hire: "推荐录用",
    consider: "可考虑",
    not_recommend: "暂不推荐",
  }

  const scoreColor = (s: number) =>
    s >= 85 ? "text-emerald-400" : s >= 70 ? "text-sky-400" : s >= 55 ? "text-amber-400" : "text-red-400"

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileCheck2 className="h-6 w-6 text-rose-400" /> AI 评估报告
        </h1>
        <p className="mt-1 text-sm text-slate-400">根据面试反馈生成多维度评估报告和推荐结论</p>
      </div>

      <AIDisclaimer />

      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-white/80 text-sm mb-1">候选人姓名</label>
              <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)}
                placeholder="如: Dr. Michael Andersen"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">候选人职位</label>
              <input type="text" value={candidateTitle} onChange={(e) => setCandidateTitle(e.target.value)}
                placeholder="如: Senior Blade Aerodynamicist"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">招聘岗位</label>
              <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                placeholder="如: Blade Design Team Lead"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-rose-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">行业方向</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value as any)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50">
                <option value="wind" className="bg-[#0a1120]">风能</option>
                <option value="lithium" className="bg-[#0a1120]">锂电</option>
                <option value="both" className="bg-[#0a1120]">风储协同</option>
              </select>
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={loading || !candidateName || !jobTitle}
            className="bg-gradient-to-r from-rose-500 to-pink-600 text-white">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? "AI 正在生成评估…" : "生成评估报告"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Overall Score & Recommendation */}
          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="p-5">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">综合评分</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl font-bold ${scoreColor(result.data.overallScore)}`}>
                      {result.data.overallScore}
                    </span>
                    <span className="text-slate-500 text-sm">/ 100</span>
                  </div>
                </div>
                <div className={`px-4 py-3 rounded-xl border ${recColor[result.data.recommendation]}`}>
                  <p className="text-lg font-bold">{recLabel[result.data.recommendation]}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">{result.data.summary}</p>
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-white text-sm">{result.data.recommendationText}</p>
              </div>
            </CardContent>
          </Card>

          {/* Dimensions */}
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-rose-400" />
              维度评估
              <AIGeneratedBadge />
            </h3>
            <div className="space-y-3">
              {result.data.dimensions.map((d: any) => (
                <Card key={d.name} className="border-white/10 bg-white/[0.03]">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">{d.name}</span>
                      <span className={`text-lg font-bold ${scoreColor(d.score)}`}>{d.score}</span>
                    </div>
                    {/* Score bar */}
                    <div className="w-full bg-white/5 rounded-full h-2 mb-2">
                      <div className={`h-2 rounded-full transition-all ${scoreColor(d.score).replace("text-", "bg-")}`}
                        style={{ width: `${d.score}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{d.comment}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <p className="text-emerald-400/80 font-medium">优势</p>
                        {d.strengths.map((s: string, i: number) => (
                          <p key={i} className="text-slate-300 flex items-start gap-1">
                            <Star className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" /> {s}
                          </p>
                        ))}
                      </div>
                      <div className="space-y-1">
                        <p className="text-amber-400/80 font-medium">待提升</p>
                        {d.weaknesses.map((s: string, i: number) => (
                          <p key={i} className="text-slate-400 flex items-start gap-1">
                            <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" /> {s}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Risk Flags */}
          <Card className="border-amber-500/20 bg-amber-500/[0.03]">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                风险提示
                <AIGeneratedBadge />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1.5">
                {result.data.riskFlags.map((r: string, i: number) => (
                  <li key={i} className="text-xs text-amber-400/80 flex items-start gap-1.5">
                    <span className="text-amber-400">⚠</span> {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
