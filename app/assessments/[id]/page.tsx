"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n"
import { useAuth } from "@/lib/auth"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProgressStepper, type Step } from "@/components/shared/progress-stepper"
import {
  ArrowLeft, Star, Brain, TrendingUp, Target, ThumbsUp, ThumbsDown,
  Minus, User, ClipboardCheck, RefreshCw, AlertCircle, Trash2, Calendar
} from "lucide-react"

interface AssessmentDetail {
  id: string
  candidateId: string
  expertId?: string | null
  type: string
  status: string
  score?: number | null
  dimensions: any[]
  summary?: string | null
  strengths?: string | null
  weaknesses?: string | null
  recommendation?: string | null
  completedAt?: string | null
  createdAt: string
  candidate?: { name: string; title?: string }
}

export default function AssessmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { t, language } = useLanguage()
  const { user } = useAuth()
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isCandidate = user?.role === "candidate"

  const FLOW_STEPS: Step[] = [
    { key: "search", label: language === "zh" ? "搜索人才" : "Search" },
    { key: "invite", label: language === "zh" ? "发起邀请" : "Invite" },
    { key: "interview", label: language === "zh" ? "安排面试" : "Interview" },
    { key: "assess", label: language === "zh" ? "查看评估" : "Assess" },
    { key: "negotiate", label: language === "zh" ? "薪资谈判" : "Negotiate" },
    { key: "offer", label: language === "zh" ? "发放Offer" : "Offer" },
  ]

  const fetchDetail = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/assessments?pageSize=200`)
      const json = await res.json()
      if (json.data) {
        const found = json.data.find((a: any) => a.id === id)
        if (found) {
          try {
            const cRes = await fetch(`/api/candidates/${found.candidateId}`)
            const cJson = await cRes.json()
            if (cJson.data) {
              found.candidate = { name: cJson.data.name, title: cJson.data.title }
            }
          } catch {}
          setAssessment(found)
        } else {
          setError("Assessment not found")
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (id) fetchDetail() }, [id])

  const handleDelete = async () => {
    if (!confirm(language === "zh" ? "确定删除此评估报告？" : "Confirm delete this assessment?")) return
    try {
      await fetch(`/api/assessments?id=${id}`, { method: "DELETE" })
      router.push("/assessments")
    } catch {
      router.push("/assessments")
    }
  }

  const recIcon = (rec: string) => {
    if (!rec) return <Minus className="w-4 h-4 text-slate-500" />
    if (rec.includes("strong")) return <ThumbsUp className="w-4 h-4 text-emerald-400" />
    if (rec.includes("recommend") && !rec.includes("not")) return <ThumbsUp className="w-4 h-4 text-sky-400" />
    if (rec.includes("not")) return <ThumbsDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-slate-500" />
  }

  const recLabel = (rec: string) => {
    const m: Record<string, string> = {
      strongly_recommend: language === "zh" ? "强烈推荐" : "Strongly Recommend",
      recommend: language === "zh" ? "推荐" : "Recommend",
      neutral: language === "zh" ? "中立" : "Neutral",
      not_recommend: language === "zh" ? "不推荐" : "Not Recommend",
    }
    return m[rec] || rec || (language === "zh" ? "待评估" : "Pending")
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 text-sky-400 animate-spin" />
        </div>
      </AppLayout>
    )
  }

  if (error || !assessment) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center p-4">
          <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
          <h1 className="text-white text-xl font-bold mb-2">{language === "zh" ? "评估不存在" : "Assessment Not Found"}</h1>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <Button onClick={() => router.push("/assessments")} className="bg-sky-600">
            {t("common.back", "返回评估列表")}
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        <button onClick={() => router.push("/assessments")} className="inline-flex items-center gap-1 text-slate-500 hover:text-white text-sm">
          <ArrowLeft className="h-3.5 w-3.5" /> {t("common.back", "返回评估列表")}
        </button>

        <ProgressStepper steps={FLOW_STEPS} currentStep="assess" />

        {/* Header Card */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h1 className="text-xl font-bold text-white">
                    {assessment.candidate?.name || t("candidates.title", "候选人")}
                  </h1>
                  <Badge variant={assessment.status === "completed" ? "success" : "warning"}>
                    {assessment.status === "completed"
                      ? (language === "zh" ? "已完成" : "Completed")
                      : assessment.status === "in_progress"
                        ? (language === "zh" ? "评估中" : "In Progress")
                        : (language === "zh" ? "待评估" : "Pending")}
                  </Badge>
                </div>
                {assessment.candidate?.title && (
                  <p className="text-slate-400 text-sm">{assessment.candidate.title}</p>
                )}
              </div>
              {assessment.score != null && (
                <div className="text-center flex-shrink-0">
                  <div className="text-4xl font-bold text-amber-400">{assessment.score}</div>
                  <div className="text-xs text-slate-500">{language === "zh" ? "综合评分" : "Overall Score"}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Summary */}
        {assessment.summary && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                {language === "zh" ? "AI 综合评估摘要" : "AI Assessment Summary"}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">{assessment.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Dimensions */}
        {assessment.dimensions && assessment.dimensions.length > 0 && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-400" />
                {language === "zh" ? "评估维度" : "Assessment Dimensions"}
              </h3>
              <div className="space-y-4">
                {assessment.dimensions.map((dim: any, i: number) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{dim.name}</span>
                      <span className="text-sm font-medium text-sky-400">
                        {dim.score != null ? `${dim.score}/100` : (language === "zh" ? "待评分" : "Pending")}
                      </span>
                    </div>
                    {dim.score != null && (
                      <div className="h-2 rounded-full bg-[#1a2a44] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            dim.score >= 85 ? "bg-emerald-500/70" : dim.score >= 70 ? "bg-sky-500/70" : "bg-amber-500/70"
                          }`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-1">{dim.comment || ""}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-4">
          {assessment.strengths && (
            <Card className="bg-emerald-500/5 border-emerald-500/10">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  {language === "zh" ? "优势" : "Strengths"}
                </h3>
                <p className="text-sm text-slate-300">{assessment.strengths}</p>
              </CardContent>
            </Card>
          )}
          {assessment.weaknesses && (
            <Card className="bg-amber-500/5 border-amber-500/10">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-amber-400 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {language === "zh" ? "待提升" : "Areas for Improvement"}
                </h3>
                <p className="text-sm text-slate-300">{assessment.weaknesses}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recommendation */}
        {assessment.recommendation && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {recIcon(assessment.recommendation)}
                <div>
                  <span className="text-sm text-slate-400">{language === "zh" ? "建议" : "Recommendation"}: </span>
                  <Badge
                    variant={
                      assessment.recommendation.includes("strong") ? "success"
                      : assessment.recommendation.includes("not") ? "destructive"
                      : "default"
                    }
                    className="ml-1"
                  >
                    {recLabel(assessment.recommendation)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meta info */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {language === "zh" ? "创建" : "Created"}: {new Date(assessment.createdAt).toLocaleString()}
              </span>
              {assessment.completedAt && (
                <span className="flex items-center gap-1">
                  <ClipboardCheck className="w-3 h-3" />
                  {language === "zh" ? "完成" : "Completed"}: {new Date(assessment.completedAt).toLocaleString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-white/5">
          {!isCandidate && (
            <Button
              onClick={() => router.push(`/ai/assessment?candidateId=${assessment.candidateId}`)}
              className="bg-sky-600 hover:bg-sky-700"
            >
              <Brain className="w-4 h-4 mr-1" />
              {language === "zh" ? "AI 重新评估" : "AI Re-assess"}
            </Button>
          )}
          <Button variant="outline" onClick={handleDelete} className="text-red-400 border-red-500/30 hover:bg-red-500/10">
            <Trash2 className="w-3 h-3 mr-1" /> {t("common.delete", "删除")}
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
