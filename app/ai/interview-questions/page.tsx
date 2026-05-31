"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AIDisclaimer, AIGeneratedBadge } from "@/components/shared/ai-disclaimer"
import { MessageSquare, Sparkles, Lightbulb, Loader2, Copy, Check } from "lucide-react"

const DOMAINS = [
  { key: "general", label: "综合", desc: "通用技术问题", color: "text-slate-400" },
  { key: "wind", label: "风能领域", desc: "叶/控制/数字孪生", color: "text-sky-400" },
  { key: "lithium", label: "锂电领域", desc: "材料/BMS/电芯", color: "text-emerald-400" },
  { key: "management", label: "管理能力", desc: "团队/决策/培养", color: "text-amber-400" },
  { key: "technical", label: "技术深度", desc: "架构/算法/前沿", color: "text-purple-400" },
] as const

export default function AIInterviewQuestionsPage() {
  const [jobTitle, setJobTitle] = useState("")
  const [industry, setIndustry] = useState<"wind" | "lithium" | "both">("wind")
  const [candidateName, setCandidateName] = useState("")
  const [domain, setDomain] = useState<string>("general")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!jobTitle || !candidateName) return
    setLoading(true)
    const res = await fetch("/api/ai/interview-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, jobIndustry: industry, candidateName, domain }),
    })
    const json = await res.json()
    setResult(json)
    setCopied(false)
    setLoading(false)
  }

  function handleCopyAll() {
    if (!result) return
    const text = result.data.questions.map((q: any) => `${q.category}: ${q.question}`).join("\n\n")
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const difficultyColor: Record<string, string> = {
    basic: "border-emerald-500/30 text-emerald-400",
    intermediate: "border-amber-500/30 text-amber-400",
    advanced: "border-red-500/30 text-red-400",
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-purple-400" /> AI 面试问题生成
        </h1>
        <p className="mt-1 text-sm text-slate-400">根据岗位和候选人背景智能生成专业面试问题</p>
      </div>

      <AIDisclaimer />

      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="block text-white/80 text-sm mb-1">候选人姓名</label>
              <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)}
                placeholder="如: 陈风电"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">岗位名称</label>
              <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                placeholder="如: Wind Farm Digital Twin Lead"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">行业方向</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value as any)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                <option value="wind" className="bg-[#0a1120]">风能</option>
                <option value="lithium" className="bg-[#0a1120]">锂电</option>
                <option value="both" className="bg-[#0a1120]">风储协同</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">问题领域</label>
            <div className="flex flex-wrap gap-2">
              {DOMAINS.map((d) => (
                <button key={d.key}
                  onClick={() => setDomain(d.key)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${
                    domain === d.key
                      ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                  }`}>
                  {d.label} <span className="text-[10px] opacity-60">· {d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading || !jobTitle || !candidateName}
            className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? "AI 正在生成问题…" : "生成面试问题"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Questions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-purple-400" />
                面试问题 ({result.data.questions.length} 题)
                <AIGeneratedBadge />
              </h3>
              <Button variant="outline" size="sm" onClick={handleCopyAll}
                className={copied ? "border-emerald-500/30 text-emerald-400" : "border-white/10 text-slate-300"}>
                {copied ? <><Check className="h-3 w-3 mr-1" /> 已复制</> : <><Copy className="h-3 w-3 mr-1" /> 复制全部</>}
              </Button>
            </div>
            {result.data.questions.map((q: any, i: number) => (
              <Card key={q.id} className="border-white/10 bg-white/[0.03] hover:border-purple-500/20 transition">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-purple-400 font-mono text-sm shrink-0 mt-0.5">Q{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm leading-relaxed">{q.question}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px] border-purple-500/20 text-purple-400">
                          {q.category}
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] ${difficultyColor[q.difficulty] || "border-white/20 text-slate-400"}`}>
                          {q.difficulty === "basic" ? "基础" : q.difficulty === "intermediate" ? "进阶" : "高级"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">
                        <span className="text-amber-400/80">考核重点：</span>{q.expectedFocus}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Follow-up Hints */}
          <Card className="border-amber-500/20 bg-amber-500/[0.03]">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400 mt-0.5" />
                <div>
                  <p className="text-amber-400 text-sm font-medium">追问建议</p>
                  <ul className="mt-2 space-y-1">
                    {result.data.followUpHints.map((h: string, i: number) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-1.5">
                        <span className="text-amber-400/60">▸</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
