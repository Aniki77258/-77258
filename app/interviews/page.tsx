"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/lib/auth"
import { useLanguage } from "@/lib/i18n"
import { TIMEZONES, convertTime, getDefaultTimezone } from "@/lib/timezone"
import { COUNTRIES } from "@/lib/countries"
import { AppLayout } from "@/components/shared/app-sidebar"
import { ProgressStepper, type Step } from "@/components/shared/progress-stepper"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Video, Phone, Building2, User, Briefcase, Check, X, ArrowRight, Plus, Filter, Trash2, ExternalLink } from "lucide-react"

interface InterviewItem {
  id: string
  candidate?: { name: string; title?: string }
  job?: { title: string }
  company?: { name: string }
  type: string
  status: string
  interviewer?: string
  scheduledAt?: string
  durationMin?: number
  location?: string
  notes?: string
  feedback?: string
  score?: number
}

export default function InterviewsPage() {
  const { user } = useAuth()
  const { t, language, locale } = useLanguage()
  const [interviews, setInterviews] = useState<InterviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState("")
  const [candidateTimezone, setCandidateTimezone] = useState(getDefaultTimezone())
  const [companyTimezone, setCompanyTimezone] = useState("Asia/Shanghai")
  const [showTimezoneConverter, setShowTimezoneConverter] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const isCandidate = user?.role === "candidate"

  // Create form state
  const [newInterview, setNewInterview] = useState({
    candidateId: "", jobId: "", companyId: "", type: "video",
    interviewer: "", scheduledAt: "", durationMin: 60, location: "", notes: ""
  })

  const FLOW_STEPS: Step[] = useMemo(() => [
    { key: "search", label: t("candidates.title", "搜索人才") },
    { key: "invite", label: t("nav.invitations", "发起邀请") },
    { key: "interview", label: t("nav.interviews", "安排面试") },
    { key: "assess", label: t("nav.assessments", "查看评估") },
    { key: "negotiate", label: t("nav.negotiations", "薪资谈判") },
    { key: "offer", label: t("nav.offers", "发放Offer") },
  ], [t])

  useEffect(() => { fetchInterviews() }, [user, statusFilter])

  async function fetchInterviews() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (user?.role === "candidate") params.set("candidateId", user.id)
      else if (user?.id) params.set("companyId", user.id)
      if (statusFilter) params.set("status", statusFilter)
      params.set("pageSize", "200")
      const res = await fetch(`/api/interviews?${params}`)
      const data = await res.json()
      if (data.success || data.data) setInterviews(data.data || [])
      else setInterviews(getMockInterviews())
    } catch { setInterviews(getMockInterviews()) }
    finally { setLoading(false) }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const res = await fetch("/api/interviews", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      })
      const data = await res.json()
      if (data.success || data.data) {
        const messages: Record<string, string> = {
          confirmed: t("interviews.statusConfirmed", "面试已确认"),
          completed: t("interviews.statusCompleted", "面试已完成"),
          cancelled: t("interviews.statusCancelled", "已取消"),
        }
        setActionMsg(messages[newStatus] || t("common.submit", "操作成功"))
      } else {
        setActionMsg(t("common.submit", "操作失败"))
      }
      fetchInterviews()
    } catch {
      setInterviews(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i))
      setActionMsg(t("misc.initSuccess", "状态已更新(演示模式)"))
    }
  }

  async function handleCreateInterview() {
    if (!user?.id) return
    try {
      const body = {
        ...newInterview,
        candidateId: newInterview.candidateId || user.id,
        scheduledById: user.id,
        companyId: newInterview.companyId || user.id,
        scheduledAt: newInterview.scheduledAt ? new Date(newInterview.scheduledAt).toISOString() : null,
        durationMin: Number(newInterview.durationMin),
      }
      const res = await fetch("/api/interviews", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.data) {
        setActionMsg(t("common.submit", "面试创建成功"))
        setShowCreateForm(false)
        setNewInterview({ candidateId: "", jobId: "", companyId: "", type: "video", interviewer: "", scheduledAt: "", durationMin: 60, location: "", notes: "" })
        fetchInterviews()
      } else {
        setActionMsg(data.error || t("common.submit", "创建失败"))
      }
    } catch (err: any) {
      setActionMsg(err.message)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("common.delete", "确定删除此面试？"))) return
    try {
      await fetch(`/api/interviews?id=${id}`, { method: "DELETE" })
      setActionMsg(t("common.delete", "已删除"))
      fetchInterviews()
    } catch {
      setActionMsg(t("common.submit", "操作失败"))
    }
  }

  const typeIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = { video: Video, phone: Phone, onsite: MapPin, technical: Briefcase }
    const Icon = icons[type] || Calendar
    return <Icon className="w-4 h-4" />
  }

  const typeLabel = (type: string) => {
    const typeKeys: Record<string, string> = {
      video: "interviews.typeOnline",
      phone: "interviews.typeOnline",
      onsite: "interviews.typeOnsite",
      technical: "interviews.typeTechnical",
    }
    const fallbacks: Record<string, string> = { video: "视频面试", phone: "电话面试", onsite: "现场面试", technical: "技术面试" }
    return typeKeys[type] ? t(typeKeys[type], fallbacks[type]) : type
  }

  const statusBadge = (status: string) => {
    const statusKeyMap: Record<string, string> = {
      scheduled: "interviews.statusPending",
      confirmed: "interviews.statusConfirmed",
      completed: "interviews.statusCompleted",
      cancelled: "interviews.statusCancelled",
      no_show: "interviews.statusCancelled",
    }
    const fallbacks: Record<string, string> = {
      scheduled: "待确认",
      confirmed: "已确认",
      completed: "已完成",
      cancelled: "已取消",
      no_show: "未出席",
    }
    const variants: Record<string, "default" | "success" | "destructive" | "warning" | "outline"> = {
      scheduled: "warning",
      confirmed: "default",
      completed: "success",
      cancelled: "destructive",
      no_show: "destructive",
    }
    const label = statusKeyMap[status] ? t(statusKeyMap[status], fallbacks[status]) : status
    const variant = variants[status] || "outline"
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{t("interviews.title", "面试管理")}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {isCandidate
                ? (language === "zh" ? "查看您的面试安排" : "View your interview schedule")
                : (language === "zh" ? "管理与候选人的面试日程" : "Manage interview schedules with candidates")}
            </p>
          </div>
        </div>

        <ProgressStepper steps={FLOW_STEPS} currentStep="interview" />

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
                <option value="scheduled">{t("interviews.statusPending", "待确认")}</option>
                <option value="confirmed">{t("interviews.statusConfirmed", "已确认")}</option>
                <option value="completed">{t("interviews.statusCompleted", "已完成")}</option>
                <option value="cancelled">{t("interviews.statusCancelled", "已取消")}</option>
              </select>
            </div>
            <Button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-sky-600 hover:bg-sky-700 ml-auto">
              <Plus className="w-4 h-4 mr-1" /> {language === "zh" ? "安排面试" : "Schedule Interview"}
            </Button>
          </div>
        )}

        {/* Create Interview Form */}
        {!isCandidate && showCreateForm && (
          <Card className="bg-white/5 border-sky-500/20">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white">{language === "zh" ? "安排新面试" : "Schedule New Interview"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{language === "zh" ? "候选人ID" : "Candidate ID"}</label>
                  <input
                    value={newInterview.candidateId}
                    onChange={(e) => setNewInterview({ ...newInterview, candidateId: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                    placeholder="cuid..."
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{t("interviews.interviewer", "面试官")}</label>
                  <input
                    value={newInterview.interviewer}
                    onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{language === "zh" ? "面试类型" : "Type"}</label>
                  <select
                    value={newInterview.type}
                    onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                  >
                    <option value="video">{typeLabel("video")}</option>
                    <option value="phone">{typeLabel("phone")}</option>
                    <option value="onsite">{typeLabel("onsite")}</option>
                    <option value="technical">{typeLabel("technical")}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{language === "zh" ? "时长(分钟)" : "Duration (min)"}</label>
                  <input
                    type="number"
                    value={newInterview.durationMin}
                    onChange={(e) => setNewInterview({ ...newInterview, durationMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{language === "zh" ? "面试时间" : "Scheduled At"}</label>
                  <input
                    type="datetime-local"
                    value={newInterview.scheduledAt}
                    onChange={(e) => setNewInterview({ ...newInterview, scheduledAt: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{t("interviews.location", "地点")}</label>
                  <input
                    value={newInterview.location}
                    onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-400 mb-1 block">{language === "zh" ? "备注" : "Notes"}</label>
                  <textarea
                    value={newInterview.notes}
                    onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateInterview} className="bg-sky-600 hover:bg-sky-700">
                  <Check className="w-3 h-3 mr-1" /> {t("common.submit", "创建")}
                </Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  <X className="w-3 h-3 mr-1" /> {t("common.cancel", "取消")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timezone Conversion Section */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <button
            onClick={() => setShowTimezoneConverter(!showTimezoneConverter)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="text-sm font-semibold text-white">{t("interviews.timeConversion", "时区换算")}</h3>
            <span className="text-xs text-slate-500">{showTimezoneConverter ? "▲" : "▼"}</span>
          </button>
          {showTimezoneConverter && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{t("interviews.candidateTimezone", "候选人所在地时区")}</label>
                  <select
                    value={candidateTimezone}
                    onChange={(e) => setCandidateTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">{t("interviews.companyTimezone", "企业所在地时区")}</label>
                  <select
                    value={companyTimezone}
                    onChange={(e) => setCompanyTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm"
                  >
                    {TIMEZONES.map(tz => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="p-3 rounded bg-white/[0.03] border border-white/5">
                <p className="text-xs text-slate-500 mb-1">{t("interviews.localTime", "当前时间转换")}:</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-sky-400">
                    {candidateTimezone}: {new Date().toLocaleTimeString('en-US', { timeZone: candidateTimezone, hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-slate-500">→</span>
                  <span className="text-emerald-400">
                    {companyTimezone}: {new Date().toLocaleTimeString('en-US', { timeZone: companyTimezone, hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : interviews.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">{t("common.noData", "暂无面试安排")}</p>
              <p className="text-slate-500 text-sm mt-1">{language === "zh" ? "当候选人接受邀请后，可以在这里安排面试" : "Once a candidate accepts the invitation, you can schedule interviews here"}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {interviews.map((inv) => (
              <Card key={inv.id} className="bg-white/5 border-white/10 group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2 cursor-pointer" onClick={() => window.location.href = `/interviews/${inv.id}`}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium group-hover:text-sky-400 transition">{inv.candidate?.name || t("candidates.title", "候选人")}</span>
                        {statusBadge(inv.status)}
                      </div>
                      <div className="flex flex-wrap gap-3 text-slate-400 text-xs">
                        {inv.job?.title && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {inv.job.title}</span>}
                        {inv.company?.name && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {inv.company.name}</span>}
                        {inv.interviewer && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {t("interviews.interviewer", "面试官")}: {inv.interviewer}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center gap-1 text-sky-400">
                          {typeIcon(inv.type)} {typeLabel(inv.type)}
                        </span>
                        {inv.scheduledAt && (
                          <span className="flex items-center gap-1 text-slate-300">
                            <Calendar className="w-3 h-3" />{" "}
                            {new Date(inv.scheduledAt).toLocaleString(locale)}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" /> {inv.durationMin || 60} {language === "zh" ? "分钟" : "minutes"}
                        </span>
                      </div>
                      {inv.location && (
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                          <MapPin className="w-3 h-3" /> {t("interviews.location", "地点")}: {inv.location}
                        </div>
                      )}
                      {inv.notes && <p className="text-slate-400 text-xs bg-white/5 p-2 rounded line-clamp-2">{inv.notes}</p>}
                      {inv.score != null && (
                        <p className="text-sm">
                          <span className="text-slate-400">{t("assessments.score", "评分")}：</span>
                          <span className="text-amber-400 font-bold">{inv.score}/100</span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0 flex-col items-end">
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.location.href = `/interviews/${inv.id}`}
                          className="p-1.5 rounded hover:bg-sky-500/10 text-slate-500 hover:text-sky-400 transition"
                          title={language === "zh" ? "查看详情" : "View Details"}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        {!isCandidate && (
                          <button
                            onClick={() => handleDelete(inv.id)}
                            className="p-1.5 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition"
                            title={t("common.delete", "删除")}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="flex gap-1">
                        {!isCandidate && inv.status === "scheduled" && (
                          <>
                            <Button size="sm" onClick={() => handleStatusChange(inv.id, "completed")} className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 h-7 text-xs">
                              <Check className="w-3 h-3 mr-1" /> {t("interviews.statusCompleted", "标记完成")}
                            </Button>
                            <Button size="sm" onClick={() => handleStatusChange(inv.id, "cancelled")} className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 h-7 text-xs">
                              <X className="w-3 h-3 mr-1" /> {t("common.cancel", "取消")}
                            </Button>
                          </>
                        )}
                        {isCandidate && inv.status === "scheduled" && (
                          <Button size="sm" onClick={() => handleStatusChange(inv.id, "confirmed")} className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 h-7 text-xs">
                            <Check className="w-3 h-3 mr-1" /> {t("common.confirm", "确认参加")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/invitations"}>
            {t("common.back", "返回邀请管理")}
          </Button>
          <Button size="sm" onClick={() => window.location.href = "/assessments"} className="bg-gradient-to-r from-sky-500 to-blue-600">
            {t("misc.demoGuide", "下一步：查看评估")} <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

function getMockInterviews(): InterviewItem[] {
  return [
    { id: "int-mock-1", candidate: { name: "王储能", title: "锂电池研发总监" }, job: { title: "固态电池研发专家" }, company: { name: "中国光伏科技集团" }, type: "video", status: "scheduled", interviewer: "张明辉", scheduledAt: new Date(Date.now() + 7*86400000).toISOString(), durationMin: 60, notes: "请候选人准备30分钟的技术分享" },
    { id: "int-mock-2", candidate: { name: "李晓风", title: "风电叶片结构高级工程师" }, job: { title: "风电叶片结构工程师" }, company: { name: "中国光伏科技集团" }, type: "technical", status: "scheduled", interviewer: "技术总监", scheduledAt: new Date(Date.now() + 10*86400000).toISOString(), durationMin: 90 }
  ]
}
