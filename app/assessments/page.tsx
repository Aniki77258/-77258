"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { AppLayout } from "@/components/shared/app-sidebar"
import { ProgressStepper, type Step } from "@/components/shared/progress-stepper"
import { DemoGuide } from "@/components/shared/demo-guide"
import DemoFlowGuide from "@/components/demo/demo-flow-guide"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck, Star, User, ThumbsUp, ThumbsDown, Minus, ArrowRight, TrendingUp, Target, Brain } from "lucide-react"

const FLOW_STEPS: Step[] = [
  { key: "search", label: "搜索人才" },
  { key: "invite", label: "发起邀请" },
  { key: "interview", label: "安排面试" },
  { key: "assess", label: "查看评估" },
  { key: "negotiate", label: "薪资谈判" },
  { key: "offer", label: "发放Offer" },
]

interface AssessmentItem {
  id: string
  candidate?: { name: string; title?: string }
  type: string
  status: string
  score?: number
  summary?: string
  strengths?: string
  weaknesses?: string
  recommendation?: string
  dimensions?: string
  createdAt: string
}

export default function AssessmentsPage() {
  const { user } = useAuth()
  const [assessments, setAssessments] = useState<AssessmentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAssessments() }, [user])

  async function fetchAssessments() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (user?.role === "candidate") params.set("candidateId", user.id)
      const res = await fetch(`/api/assessments?${params}`)
      const data = await res.json()
      if (data.success) setAssessments(data.data || [])
      else setAssessments(getMockAssessments())
    } catch { setAssessments(getMockAssessments()) }
    finally { setLoading(false) }
  }

  const recIcon = (rec: string) => {
    if (!rec) return <Minus className="w-4 h-4 text-slate-500" />
    if (rec.includes("strong") || rec.includes("大力")) return <ThumbsUp className="w-4 h-4 text-emerald-400" />
    if (rec.includes("recommend") || rec.includes("推荐")) return <ThumbsUp className="w-4 h-4 text-sky-400" />
    if (rec.includes("not")) return <ThumbsDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-slate-500" />
  }
  const recLabel = (rec: string) => {
    const map: Record<string, string> = {
      strongly_recommend: "强烈推荐", recommend: "推荐", neutral: "中立", not_recommend: "不推荐"
    }
    return map[rec] || rec || "待评估"
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">人才评估</h1>
          <p className="text-slate-400 text-sm mt-1">查看候选人的综合能力评估报告</p>
        </div>

        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <DemoFlowGuide />
        </div>

        <ProgressStepper steps={FLOW_STEPS} currentStep="assess" />

        <DemoGuide
          title="面试后生成多维度评估报告"
          description="基于面试表现、技术测试、背景调研等多维度数据，生成结构化的候选人评估报告，辅助招聘决策。"
          nextLabel="发起薪资谈判"
          nextHref="/negotiations"
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : assessments.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <ClipboardCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">暂无评估报告</p>
              <p className="text-slate-500 text-sm mt-1">完成面试后将生成绩效评估报告</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assessments.map((a) => (
              <Card key={a.id} className="bg-white/5 border-white/10">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-lg">{a.candidate?.name || "候选人"}</span>
                        <Badge variant={a.status === "completed" ? "success" : "warning"}>
                          {a.status === "completed" ? "已完成" : "进行中"}
                        </Badge>
                      </div>
                      {a.candidate?.title && <p className="text-slate-400 text-sm">{a.candidate.title}</p>}
                    </div>
                    {a.score != null && (
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-400">{a.score}</div>
                        <div className="text-slate-500 text-xs">综合评分</div>
                      </div>
                    )}
                  </div>

                  {a.summary && (
                    <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                      <p className="text-white/80 text-sm flex items-start gap-2">
                        <Brain className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                        {a.summary}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {a.strengths && (
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                        <p className="text-emerald-400 text-xs font-medium flex items-center gap-1 mb-1">
                          <TrendingUp className="w-3 h-3" /> 优势
                        </p>
                        <p className="text-slate-300 text-sm">{a.strengths}</p>
                      </div>
                    )}
                    {a.weaknesses && (
                      <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
                        <p className="text-amber-400 text-xs font-medium flex items-center gap-1 mb-1">
                          <Target className="w-3 h-3" /> 待提升
                        </p>
                        <p className="text-slate-300 text-sm">{a.weaknesses}</p>
                      </div>
                    )}
                  </div>

                  {a.recommendation && (
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      {recIcon(a.recommendation)}
                      <span className="text-sm text-white/80">建议：</span>
                      <Badge variant={a.recommendation.includes("strong") ? "success" : a.recommendation.includes("not") ? "destructive" : "default"}>
                        {recLabel(a.recommendation)}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/interviews"}>
            返回面试管理
          </Button>
          <Button size="sm" onClick={() => window.location.href = "/negotiations"} className="bg-gradient-to-r from-sky-500 to-blue-600">
            下一步：薪资谈判 <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

function getMockAssessments(): AssessmentItem[] {
  return [
    { id: "as-mock-1", candidate: { name: "李晓风", title: "风电叶片结构高级工程师" }, type: "technical", status: "completed", score: 92, summary: "该候选人在风电叶片复合材料领域具有世界级水平，尤其在碳纤维预浸料工艺方面有原创性贡献。沟通能力强，适合担任技术负责人角色。", strengths: "碳纤维复合材料专家，MIT博士后背景，拥有核心专利", weaknesses: "产业落地经验偏学术，需要适应国内制造业节奏", recommendation: "strongly_recommend", createdAt: "2026-05-29" },
    { id: "as-mock-2", candidate: { name: "王储能", title: "锂电池研发总监" }, type: "expert_review", status: "completed", score: 88, summary: "固态电池领域的资深专家，对界面工程有深刻理解。团队管理经验丰富，适合带领研发团队。", strengths: "固态电池核心技术掌握，15年研发经验，CATL背景", weaknesses: "对储能系统级集成经验相对较少", recommendation: "recommend", createdAt: "2026-05-28" }
  ]
}
