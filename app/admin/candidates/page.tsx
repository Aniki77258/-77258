"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/shared/app-sidebar"
import DemoFlowGuide from "@/components/demo/demo-flow-guide"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Check, X, Users, Star, Eye, Search, Filter } from "lucide-react"

interface CandidateReview {
  id: string
  name: string
  title?: string
  country?: string
  industry?: string
  verified: boolean
  score: number
  experienceYears: number
  source?: string
  createdAt: string
}

export default function AdminCandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateReview[]>([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("pending")

  useEffect(() => { fetchCandidates() }, [])

  async function fetchCandidates() {
    setLoading(true)
    try {
      const res = await fetch("/api/candidates?pageSize=50")
      const data = await res.json()
      if (data.success) setCandidates(data.data || [])
      else setCandidates(getMockCandidates())
    } catch { setCandidates(getMockCandidates()) }
    finally { setLoading(false) }
  }

  async function handleVerify(id: string, verified: boolean) {
    try {
      const res = await fetch("/api/candidates", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, verified })
      })
      const data = await res.json()
      setActionMsg(data.success ? (verified ? "已通过审核" : "已取消认证") : "操作失败")
      fetchCandidates()
    } catch {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, verified } : c))
      setActionMsg(`已更新审核状态(演示模式)`)
    }
  }

  const filtered = candidates.filter(c => {
    if (filter === "pending") return !c.verified
    if (filter === "verified") return c.verified
    return true
  })

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-400" /> 候选人资料审核
          </h1>
          <p className="text-slate-400 text-sm mt-1">审核候选人提交的资料完整性和真实性</p>
        </div>

        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <DemoFlowGuide />
        </div>

        <div className="flex gap-2">
          {[
            { key: "pending" as const, label: "待审核", count: candidates.filter(c => !c.verified).length },
            { key: "verified" as const, label: "已审核", count: candidates.filter(c => c.verified).length },
            { key: "all" as const, label: "全部", count: candidates.length },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "text-slate-400 border border-white/5"
              }`}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {actionMsg && (
          <div className="px-4 py-3 rounded-lg text-sm bg-sky-500/10 text-sky-400 border border-sky-500/20">{actionMsg}</div>
        )}

        <Card className="bg-white/5 border-white/10">
          <CardContent className="py-8 text-center">
            <UserCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-white font-medium text-lg">系统自动校验 + 人工审核</p>
            <p className="text-slate-400 text-sm mt-1">
              系统会对候选人提交的公开数据进行交叉验证（论文、专利、GitHub、LinkedIn），管理员负责最终审核。
            </p>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((c) => (
              <Card key={c.id} className={`bg-white/5 border ${c.verified ? "border-emerald-500/20" : "border-white/10"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium">{c.name}</span>
                        <Badge variant={c.verified ? "success" : "warning"}>
                          {c.verified ? "已审核" : "待审核"}
                        </Badge>
                        {c.score >= 90 && <Badge variant="default"><Star className="w-3 h-3 mr-0.5 inline" />高评分</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-3 text-slate-400 text-xs mt-1">
                        {c.title && <span>{c.title}</span>}
                        {c.country && <span>📍{c.country}</span>}
                        {c.industry && <span>
                          {c.industry === "wind" ? "🌬️风能" : c.industry === "lithium" ? "🔋锂电" : "🌬️🔋风能+锂电"}
                        </span>}
                        <span>经验：{c.experienceYears}年</span>
                        <span>评分：{c.score}</span>
                        {c.source && <span>来源：{c.source}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" onClick={() => window.open(`/candidates/${c.id}`, "_blank")}
                        className="bg-white/5 text-slate-300 border border-white/10">
                        <Eye className="w-3 h-3 mr-1" /> 查看
                      </Button>
                      {!c.verified ? (
                        <Button size="sm" onClick={() => handleVerify(c.id, true)}
                          className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          <Check className="w-3 h-3 mr-1" /> 通过
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleVerify(c.id, false)}
                          className="bg-red-500/20 text-red-400 border border-red-500/30">
                          <X className="w-3 h-3 mr-1" /> 撤销
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/admin/verification"}>
            返回企业审核
          </Button>
          <Button size="sm" onClick={() => window.location.href = "/admin/reports"} className="bg-gradient-to-r from-sky-500 to-blue-600">
            处理举报
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

function getMockCandidates(): CandidateReview[] {
  return [
    { id: "c1", name: "李晓风", title: "风电叶片结构高级工程师", country: "美国", industry: "wind", verified: true, score: 95, experienceYears: 10, source: "openalex", createdAt: "2026-05-10" },
    { id: "c2", name: "王储能", title: "锂电池研发总监", country: "中国", industry: "lithium", verified: true, score: 93, experienceYears: 15, source: "manual", createdAt: "2026-05-11" },
    { id: "c3", name: "新候选人A", title: "储能系统工程师", country: "日本", industry: "lithium", verified: false, score: 75, experienceYears: 5, source: "linkedin", createdAt: "2026-05-28" },
  ]
}
