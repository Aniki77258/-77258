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
  ArrowLeft, Calendar, Clock, MapPin, Video, Phone, Building2,
  User, Briefcase, Star, FileText, Edit3, Trash2, Check, X,
  RefreshCw, AlertCircle
} from "lucide-react"

interface InterviewDetail {
  id: string
  candidateId: string
  jobId?: string | null
  companyId?: string | null
  scheduledById: string
  interviewer?: string | null
  type: string
  status: string
  scheduledAt?: string | null
  durationMin: number
  location?: string | null
  notes?: string | null
  feedback?: any
  score?: number | null
  completedAt?: string | null
  createdAt: string
  candidate?: { name: string; title?: string; email?: string }
  job?: { title: string }
  company?: { name: string }
}

export default function InterviewDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const { t, language, locale } = useLanguage()
  const { user } = useAuth()
  const [interview, setInterview] = useState<InterviewDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionMsg, setActionMsg] = useState("")
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackScore, setFeedbackScore] = useState<number>(0)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const isCandidate = user?.role === "candidate"

  const FLOW_STEPS: Step[] = [
    { key: "search", label: t("candidates.title", "搜索人才") },
    { key: "invite", label: t("nav.invitations", "发起邀请") },
    { key: "interview", label: t("nav.interviews", "安排面试") },
    { key: "assess", label: t("nav.assessments", "查看评估") },
    { key: "negotiate", label: t("nav.negotiations", "薪资谈判") },
    { key: "offer", label: t("nav.offers", "发放Offer") },
  ]

  const fetchDetail = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/interviews?pageSize=200`)
      const json = await res.json()
      if (json.data) {
        const found = json.data.find((i: any) => i.id === id)
        if (found) {
          // Also fetch candidate info
          try {
            const cRes = await fetch(`/api/candidates/${found.candidateId}`)
            const cJson = await cRes.json()
            if (cJson.data) {
              found.candidate = { name: cJson.data.name, title: cJson.data.title, email: cJson.data.email }
            }
          } catch {}
          setInterview(found)
        } else {
          setError("Interview not found")
        }
      } else {
        setError("Failed to load interview")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (id) fetchDetail() }, [id])

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch("/api/interviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      })
      const data = await res.json()
      if (data.data) {
        setInterview((prev: any) => prev ? { ...prev, status: newStatus } : prev)
        setActionMsg(t("common.submit", "Status updated"))
      }
    } catch {
      setActionMsg(t("common.submit", "Updated (demo mode)"))
    }
  }

  const handleSubmitFeedback = async () => {
    try {
      const res = await fetch("/api/interviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: "completed",
          feedback: JSON.stringify({ summary: feedbackText, overallScore: feedbackScore }),
          score: feedbackScore,
          completedAt: new Date().toISOString(),
        })
      })
      const data = await res.json()
      if (data.data) {
        setInterview((prev: any) => prev ? { ...prev, status: "completed", score: feedbackScore, feedback: { summary: feedbackText, overallScore: feedbackScore } } : prev)
        setActionMsg(t("interviews.statusCompleted", "Feedback submitted"))
        setShowFeedbackForm(false)
      }
    } catch {
      setActionMsg(t("common.submit", "Submitted (demo mode)"))
    }
  }

  const handleDelete = async () => {
    if (!confirm(language === "zh" ? "确定删除此面试记录？" : "Confirm delete this interview?")) return
    try {
      await fetch(`/api/interviews?id=${id}`, { method: "DELETE" })
      router.push("/interviews")
    } catch {
      router.push("/interviews")
    }
  }

  const typeIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = { video: Video, phone: Phone, onsite: MapPin, technical: Briefcase }
    const Icon = icons[type] || Calendar
    return <Icon className="w-4 h-4" />
  }

  const typeLabel = (type: string) => {
    const map: Record<string, string> = { video: "视频面试", phone: "电话面试", onsite: "现场面试", technical: "技术面试" }
    return map[type] || type
  }

  const statusVariant = (status: string): "default" | "success" | "destructive" | "warning" | "outline" => {
    const m: Record<string, any> = { scheduled: "warning", confirmed: "default", completed: "success", cancelled: "destructive" }
    return m[status] || "outline"
  }

  const statusLabel = (status: string) => {
    const m: Record<string, string> = { scheduled: "待确认", confirmed: "已确认", completed: "已完成", cancelled: "已取消" }
    return m[status] || status
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

  if (error || !interview) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center p-4">
          <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
          <h1 className="text-white text-xl font-bold mb-2">{language === "zh" ? "面试不存在" : "Interview Not Found"}</h1>
          <p className="text-slate-500 text-sm mb-4">{error}</p>
          <Button onClick={() => router.push("/interviews")} className="bg-sky-600">
            {t("common.back", "返回面试列表")}
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        <button onClick={() => router.push("/interviews")} className="inline-flex items-center gap-1 text-slate-500 hover:text-white text-sm">
          <ArrowLeft className="h-3.5 w-3.5" /> {t("common.back", "返回面试列表")}
        </button>

        <ProgressStepper steps={FLOW_STEPS} currentStep="interview" />

        {actionMsg && (
          <div className="px-4 py-3 rounded-lg text-sm bg-sky-500/10 text-sky-400 border border-sky-500/20">{actionMsg}</div>
        )}

        {/* Header Card */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold text-white">
                    {interview.candidate?.name || t("candidates.title", "候选人")}
                  </h1>
                  <Badge variant={statusVariant(interview.status)}>{statusLabel(interview.status)}</Badge>
                  <Badge variant="outline" className="border-sky-500/30 text-sky-400">{typeLabel(interview.type)}</Badge>
                </div>
                {interview.candidate?.title && (
                  <p className="text-slate-400 text-sm">{interview.candidate.title}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  {interview.job?.title && (
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {interview.job.title}</span>
                  )}
                  {interview.company?.name && (
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {interview.company.name}</span>
                  )}
                  {interview.interviewer && (
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {t("interviews.interviewer", "面试官")}: {interview.interviewer}</span>
                  )}
                </div>
              </div>
              {interview.score != null && (
                <div className="text-center flex-shrink-0">
                  <div className="text-3xl font-bold text-amber-400">{interview.score}</div>
                  <div className="text-xs text-slate-500">{t("assessments.score", "评分")}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detail Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white">{language === "zh" ? "面试信息" : "Interview Info"}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {typeIcon(interview.type)}
                  <span className="text-sky-400">{typeLabel(interview.type)}</span>
                </div>
                {interview.scheduledAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-300">{new Date(interview.scheduledAt).toLocaleString(locale)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-300">{interview.durationMin} {language === "zh" ? "分钟" : "minutes"}</span>
                </div>
                {interview.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-300">{interview.location}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white">{language === "zh" ? "面试备注" : "Notes"}</h3>
              {interview.notes ? (
                <p className="text-sm text-slate-300 bg-white/5 p-3 rounded">{interview.notes}</p>
              ) : (
                <p className="text-sm text-slate-500">{language === "zh" ? "暂无备注" : "No notes"}</p>
              )}
              {interview.completedAt && (
                <p className="text-xs text-slate-500">
                  {language === "zh" ? "完成时间" : "Completed"}: {new Date(interview.completedAt).toLocaleString(locale)}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Feedback Section */}
        {interview.feedback && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                {language === "zh" ? "面试反馈" : "Feedback"}
              </h3>
              {typeof interview.feedback === "string" ? (
                <p className="text-sm text-slate-300">{interview.feedback}</p>
              ) : (
                <div className="space-y-2">
                  {interview.feedback?.summary && (
                    <p className="text-sm text-slate-300 bg-white/5 p-3 rounded">{interview.feedback.summary}</p>
                  )}
                  {interview.feedback?.strengths && (
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded p-3">
                      <p className="text-xs text-emerald-400 font-medium mb-1">{language === "zh" ? "优势" : "Strengths"}</p>
                      <p className="text-sm text-slate-300">{interview.feedback.strengths}</p>
                    </div>
                  )}
                  {interview.feedback?.weaknesses && (
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded p-3">
                      <p className="text-xs text-amber-400 font-medium mb-1">{language === "zh" ? "待提升" : "Weaknesses"}</p>
                      <p className="text-sm text-slate-300">{interview.feedback.weaknesses}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Feedback Form */}
        {!isCandidate && interview.status !== "completed" && interview.status !== "cancelled" && (
          <>
            {!showFeedbackForm ? (
              <Button
                onClick={() => setShowFeedbackForm(true)}
                className="w-full bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {language === "zh" ? "填写面试反馈" : "Submit Feedback"}
              </Button>
            ) : (
              <Card className="bg-white/5 border-purple-500/20">
                <CardContent className="p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-white">{language === "zh" ? "面试反馈" : "Interview Feedback"}</h3>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">{t("assessments.score", "评分")} (0-100)</label>
                    <input
                      type="number" min="0" max="100"
                      value={feedbackScore}
                      onChange={(e) => setFeedbackScore(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">{language === "zh" ? "反馈内容" : "Feedback"}</label>
                    <textarea
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm resize-none"
                      placeholder={language === "zh" ? "请输入面试评价..." : "Enter feedback..."}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSubmitFeedback} className="bg-purple-600 hover:bg-purple-700">
                      <Check className="w-3 h-3 mr-1" /> {t("common.submit", "提交")}
                    </Button>
                    <Button variant="outline" onClick={() => setShowFeedbackForm(false)}>
                      <X className="w-3 h-3 mr-1" /> {t("common.cancel", "取消")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
          {!isCandidate && interview.status === "scheduled" && (
            <>
              <Button onClick={() => handleStatusChange("confirmed")} className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
                <Check className="w-3 h-3 mr-1" /> {t("interviews.statusConfirmed", "确认面试")}
              </Button>
              <Button onClick={() => handleStatusChange("cancelled")} className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
                <X className="w-3 h-3 mr-1" /> {t("common.cancel", "取消面试")}
              </Button>
            </>
          )}
          {isCandidate && interview.status === "scheduled" && (
            <Button onClick={() => handleStatusChange("confirmed")} className="bg-emerald-500/20 text-emerald-400">
              <Check className="w-3 h-3 mr-1" /> {t("common.confirm", "确认参加")}
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
