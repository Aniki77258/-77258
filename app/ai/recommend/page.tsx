"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIDisclaimer, AIGeneratedBadge } from "@/components/shared/ai-disclaimer"
import { Target, Sparkles, AlertTriangle, Star, Lightbulb, Globe, Loader2 } from "lucide-react"

interface Recommendation {
  id: string; name: string; title: string; country: string
  matchScore: number; highlights: string[]; riskFlags: string[]; reason: string
}

const PRESET_JOBS = [
  { title: "Senior Blade Aerodynamicist (风能)", industry: "wind" as const, reqs: ["叶片气动设计", "CFD 仿真", "15MW+"] },
  { title: "BMS Algorithm Architect (锂电)", industry: "lithium" as const, reqs: ["BMS 算法", "SOC 估计", "卡尔曼滤波"] },
  { title: "Energy Storage System Engineer (风储)", industry: "both" as const, reqs: ["储能系统", "风储协同", "电网调度"] },
]

export default function AIRecommendPage() {
  const [jobTitle, setJobTitle] = useState("")
  const [industry, setIndustry] = useState<"wind" | "lithium" | "both">("wind")
  const [requirements, setRequirements] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ data: any } | null>(null)

  async function handleGenerate() {
    if (!jobTitle) return
    setLoading(true)
    const res = await fetch("/api/ai/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobTitle,
        jobIndustry: industry,
        jobRequirements: requirements.split(",").map((s) => s.trim()).filter(Boolean),
        jobId: "ai_rec_" + Date.now(),
      }),
    })
    const json = await res.json()
    setResult(json)
    setLoading(false)
  }

  function applyPreset(p: typeof PRESET_JOBS[number]) {
    setJobTitle(p.title)
    setIndustry(p.industry)
    setRequirements(p.reqs.join(", "))
  }

  const recs: Recommendation[] = result?.data?.recommendations || []
  const marketInsight = result?.data?.marketInsight || ""
  const keywords = result?.data?.searchKeywords || []

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Target className="h-6 w-6 text-sky-400" /> AI 人才推荐
        </h1>
        <p className="mt-1 text-sm text-slate-400">根据岗位要求智能匹配全球风能/锂电候选人</p>
      </div>

      <AIDisclaimer />

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-slate-500 self-center mr-1">快速填充：</span>
        {PRESET_JOBS.map((p) => (
          <button
            key={p.title}
            onClick={() => applyPreset(p)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:border-sky-500/40 hover:bg-sky-500/10 transition"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Input */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white text-base">岗位信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-white/80 text-sm mb-1">岗位名称</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="如: Senior Blade Aerodynamicist"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">行业方向</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as any)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              >
                <option value="wind" className="bg-[#0a1120]">风能</option>
                <option value="lithium" className="bg-[#0a1120]">锂电</option>
                <option value="both" className="bg-[#0a1120]">风储协同</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-white/80 text-sm mb-1">岗位要求（逗号分隔）</label>
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="叶片气动设计, CFD 仿真, 15MW+, 海上风电经验"
              rows={2}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading || !jobTitle}
            className="bg-gradient-to-r from-sky-500 to-blue-600 text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? "AI 正在分析人才库…" : "生成推荐"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <>
          {/* Market Insight */}
          <Card className="border-emerald-500/20 bg-emerald-500/[0.03]">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-emerald-400 text-sm font-medium flex items-center gap-2">
                    市场洞察 <AIGeneratedBadge />
                  </p>
                  <p className="text-slate-400 text-sm mt-1">{marketInsight}</p>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {keywords.map((kw: string) => (
                        <Badge key={kw} variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-400">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-sky-400" />
              推荐候选人 ({recs.length})
              <AIGeneratedBadge />
            </h3>
            {recs.map((r, i) => (
              <Card key={r.id} className="border-white/10 bg-white/[0.03] hover:border-sky-500/20 transition">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold">{r.name}</span>
                        <span className="text-slate-500 text-xs">#{i + 1}</span>
                      </div>
                      <p className="text-slate-400 text-sm mt-0.5">
                        {r.title} · {r.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-500">匹配度</span>
                      <span className={`text-lg font-bold ${r.matchScore >= 90 ? "text-emerald-400" : r.matchScore >= 80 ? "text-sky-400" : "text-amber-400"}`}>
                        {r.matchScore}%
                      </span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="mt-3 space-y-1">
                    {r.highlights.map((h: string, j: number) => (
                      <div key={j} className="flex items-start gap-1.5 text-xs text-slate-300">
                        <Lightbulb className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>

                  {/* Risk Flags */}
                  {r.riskFlags.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {r.riskFlags.map((f: string, j: number) => (
                        <div key={j} className="flex items-start gap-1.5 text-xs text-amber-400/80">
                          <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reason */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-xs text-slate-500 leading-relaxed">
                      <span className="text-amber-400 font-medium">AI 推荐理由：</span>
                      {r.reason}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
