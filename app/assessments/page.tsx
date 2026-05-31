"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useLanguage } from "@/lib/i18n"
import { AppLayout } from "@/components/shared/app-sidebar"
import { ProgressStepper, type Step } from "@/components/shared/progress-stepper"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck, Star, User, ThumbsUp, ThumbsDown, Minus, ArrowRight, TrendingUp, Target, Brain, Plus, Filter, Check, X, Trash2, ExternalLink } from "lucide-react"

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
  dimensions?: any[]
  createdAt: string
}

export default function AssessmentsPage() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [assessments, setAssessments] = useState<AssessmentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAssessment, setNewAssessment] = useState({ candidateId: "", type: "technical" })
  const isCandidate = user?.role === "candidate"

  const FLOW_STEPS: Step[] = [
    { key: "search", label: t("candidates.title", "搜索人才") },
    { key: "invite", label: t("nav.invitations", "发起邀请") },
    { key: "interview", label: t("nav.interviews", "安排面试") },
    { key: "assess", label: t("nav.assessments", "查看评估") },
    { key: "negotiate", label: t("nav.negotiations", "薪资谈判") },
    { key: "offer", label: t("nav.offers", "发放Offer") },
  ]

  useEffect(() => { fetchAssessments() }, [user, statusFilter])

  async function fetchAssessments() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (user?.role === "candidate") params.set("candidateId", user.id)
      if (statusFilter) params.set("status", statusFilter)
      params.set("pageSize", "200")
      const res = await fetch(`/api/assessments?${params}`)
      const data = await res.json()
      if (data.data) setAssessments(data.data || [])
      else setAssessments(getMockAssessments())
    } catch { setAssessments(getMockAssessments()) }
    finally { setLoading(false) }
  }

  async function handleCreateAssessment() {
    try {
      const res = await fetch("/api/assessments", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId: newAssessment.candidateId, type: newAssessment.type, status: "pending" }),
      })
      const data = await res.json()
      if (data.data) {
        setActionMsg(t("common.submit", "评估创建成功"))
        setShowCreateForm(false)
        setNewAssessment({ candidateId: "", type: "technical" })
        fetchAssessments()
      }
    } catch (err: any) {
      setActionMsg(err.message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("common.delete", "确定删除此评估？"))) return
    try {
      await fetch(`/api/assessments?id=${id}`, { method: "DELETE" })
      setActionMsg(t("common.delete", "已删除"))
      fetchAssessments()
    } catch { setActionMsg(t("common.submit", "操作失败")) }
  }

  const recIcon = (rec: string) => {
    if (!rec) return <Minus className="w-4 h-4 text-slate-500" />
    if (rec.includes("strong")) return <ThumbsUp className="w-4 h-4 text-emerald-400" />
    if (rec.includes("recommend") && !rec.includes("not")) return <ThumbsUp className="w-4 h-4 text-sky-400" />
    if (rec.includes("not")) return <ThumbsDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-slate-500" />
  }

  const recLabel = (rec: string) => {
    const map: Record<string, string> = {
      strongly_recommend: t("assessments.stronglyRecommend", "强烈推荐"),
      recommend: t("assessments.recommend", "推荐"),
      neutral: t("assessments.neutral", "中立"),
      not_recommend: t("assessments.notRecommend", "不推荐"),
    }
    return map[rec] || rec || t("assessments.statusPending", "待评估")
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{t("assessments.title", "人才评估")}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {language === "zh" ? "查看候选人的综合能力评估报告" : "View comprehensive candidate assessment reports"}
            </p>
          </div>
        </div>

        <ProgressStepper steps={FLOW_STEPS} currentStep="assess" />

        {actionMsg && (
          <div className="px-4 py-3 rounded-lg text-sm bg-sky-500/10 text-sky-400 border border-sky-500/20">{actionMsg}</div>
        )}

        {/* Filter + Create bar */}
        {!isCandidate && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 bg-white/5 border border-white/10 rounded text-white text-sm"
              >
                <option value="">{t("common.all", "全部状态")}</option>
                <option value="pending">{t("assessments.statusPending", "待评估")}</option>
                <option value="in_progress">{t("assessments.statusInProgress", "评估中")}</option>
                <option value="completed">{t("assessments.statusCompleted", "已完成")}</option>
              </select>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-sky-600 hover:bg-sky-700 ml-auto">
              <Plus className="w-4 h-4 mr-1" /> {language === "zh" ? "新建评估" : "New Assessment"}
            </Button>
          </div>
        )}

        {/* Create Form */}
        {!isCandidate && showCreateForm && (
          <Card className="bg-white/5 border-sky-500/20">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white">{language === "zh" ? "创建新评估" : "Create Assessment"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{language === "zh" ? "候选人ID" : "Candidate ID"}</label>
                  <input
                    value={newAssessment.candidateId}
                    onChange={(e) => setNewAssessment({ ...newAssessment, candidateId: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                    placeholder="cuid..."
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{language === "zh" ? "评估类型" : "Type"}</label>
                  <select
                    value={newAssessment.type}
                    onChange={(e) => setNewAssessment({ ...newAssessment, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                  >
                    <option value="technical">{language === "zh" ? "技术评估" : "Technical"}</option>
                    <option value="expert_review">{language === "zh" ? "专家评审" : "Expert Review"}</option>
                    <option value="behavioral">{language === "zh" ? "行为评估" : "Behavioral"}</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateAssessment} className="bg-sky-600 hover:bg-sky-700">
                  <Check className="w-3 h-3 mr-1" /> {t("common.submit", "创建")}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  <X className="w-3 h-3 mr-1" /> {t("common.cancel", "取消")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : assessments.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <ClipboardCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">{t("common.noData", "暂无评估报告")}</p>
              <p className="text-slate-500 text-sm mt-1">
                {language === "zh" ? "完成面试后将生成绩效评估报告" : "Assessment reports will be generated after interviews"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {assessments.map((a) => (
              <Card key={a.id} className="bg-white/5 border-white/10 group">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => window.location.href = `/assessments/${a.id}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-lg group-hover:text-sky-400 transition">{a.candidate?.name || t("candidates.title", "候选人")}</span>
                        <Badge variant={a.status === "completed" ? "success" : "warning"}>
                          {a.status === "completed" ? t("assessments.statusCompleted", "已完成") : a.status === "in_progress" ? t("assessments.statusInProgress", "评估中") : t("assessments.statusPending", "待评估")}
                        </Badge>
                      </div>
                      {a.candidate?.title && <p className="text-slate-400 text-sm">{a.candidate.title}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.location.href = `/assessments/${a.id}`}
                        className="p-1.5 rounded hover:bg-sky-500/10 text-slate-500 hover:text-sky-400 transition"
                        title={language === "zh" ? "查看详情" : "View Details"}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      {!isCandidate && (
                        <button
                          onClick={() => handleDelete(a.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {a.score != null && (
                        <div className="text-center ml-2">
                          <div className="text-3xl font-bold text-amber-400">{a.score}</div>
                          <div className="text-slate-500 text-xs">{t("assessments.score", "综合评分")}</div>
                        </div>
                      )}
                    </div>
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
                          <TrendingUp className="w-3 h-3" /> {t("assessments.strengths", "优势")}
                        </p>
                        <p className="text-slate-300 text-sm">{a.strengths}</p>
                      </div>
                    )}
                    {a.weaknesses && (
                      <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
                        <p className="text-amber-400 text-xs font-medium flex items-center gap-1 mb-1">
                          <Target className="w-3 h-3" /> {t("assessments.improvements", "待提升")}
                        </p>
                        <p className="text-slate-300 text-sm">{a.weaknesses}</p>
                      </div>
                    )}
                  </div>

                  {a.recommendation && (
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      {recIcon(a.recommendation)}
                      <span className="text-sm text-white/80">{t("assessments.suggestion", "建议")}：</span>
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
            {t("common.back", "返回面试管理")}
          </Button>
          <Button size="sm" onClick={() => window.location.href = "/negotiations"} className="bg-gradient-to-r from-sky-500 to-blue-600">
            {language === "zh" ? "下一步：薪资谈判" : "Next: Negotiations"} <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

function getMockAssessments(): AssessmentItem[] {
  return [
    { id: "as-mock-1", candidate: { name: "李晓风", title: "风电叶片结构高级工程师" }, type: "technical", status: "completed", score: 92, summary: "该候选人在风电叶片复合材料领域具有世界级水平，尤其在碳纤维预浸料工艺方面有原创性贡献。", strengths: "碳纤维复合材料专家，MIT博士后背景", weaknesses: "产业落地经验偏学术", recommendation: "strongly_recommend", createdAt: "2026-05-29" },
    { id: "as-mock-2", candidate: { name: "王储能", title: "锂电池研发总监" }, type: "expert_review", status: "completed", score: 88, summary: "固态电池领域的资深专家，对界面工程有深刻理解。", strengths: "固态电池核心技术掌握，15年经验", weaknesses: "储能系统级集成经验少", recommendation: "recommend", createdAt: "2026-05-28" }
  ]
}
