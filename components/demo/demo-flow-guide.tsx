"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Rocket, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, Search, Send, Calendar, ClipboardCheck, DollarSign, FileText, Shield, AlertCircle, UserCheck, Building2, Eye } from "lucide-react"

interface FlowStep {
  step: number
  role: string
  icon: string
  label: string
  description: string
  link: string
  linkLabel: string
  status: "pending" | "in_progress" | "completed"
}

interface DemoStats {
  candidates: number
  companies: number
  jobs: number
  invitations: number
  interviews: number
  assessments: number
  negotiations: number
  offers: number
  messages: number
  notifications: number
  auditLogs: number
}

const FLOW_STEPS: FlowStep[] = [
  {
    step: 1, role: "all", icon: "init", label: "初始化演示数据",
    description: "点击初始化按钮，创建完整的演示数据集，包含候选人、企业、职位和招聘流程记录",
    link: "/login", linkLabel: "前往登录页初始化", status: "pending",
  },
  { step: 2, role: "all", icon: "search", label: "浏览人才库", description: "查看5位高匹配风能/锂电候选人，搜索和筛选人才", link: "/candidates", linkLabel: "浏览候选人", status: "pending" },
  { step: 3, role: "company", icon: "invite", label: "发起人才邀请", description: "企业向目标候选人发送招聘邀请（已有5条邀请记录，3条已接受）", link: "/invitations", linkLabel: "查看邀请列表", status: "pending" },
  { step: 4, role: "company", icon: "interview", label: "安排面试", description: "为已接受的候选人安排面试时间（已有3场面试记录）", link: "/interviews", linkLabel: "查看面试安排", status: "pending" },
  { step: 5, role: "company", icon: "assess", label: "查看评估报告", description: "面试完成后查看候选人评估报告（已有2条评估记录）", link: "/assessments", linkLabel: "查看评估报告", status: "pending" },
  { step: 6, role: "company", icon: "negotiate", label: "薪酬谈判", description: "与候选人协商薪酬方案（已有2条谈判记录）", link: "/negotiations", linkLabel: "查看谈判记录", status: "pending" },
  { step: 7, role: "company", icon: "offer", label: "发送 Offer", description: "向候选人发送正式录用通知书（已有2个Offer）", link: "/offers", linkLabel: "查看Offer记录", status: "pending" },
  { step: 8, role: "company", icon: "hire", label: "完成录用", description: "候选人确认接受Offer，完成招聘流程", link: "/offers", linkLabel: "查看录用状态", status: "pending" },
  { step: 9, role: "admin", icon: "admin", label: "管理员审核", description: "管理员审核企业认证、候选人资料和平台运营数据", link: "/admin/verification", linkLabel: "进入管理后台", status: "pending" },
]

const ICON_MAP: Record<string, React.ElementType> = {
  init: Rocket, search: Search, invite: Send, interview: Calendar,
  assess: ClipboardCheck, negotiate: DollarSign, offer: FileText,
  hire: UserCheck, admin: Shield,
}

const STATUS_COLORS: Record<string, string> = {
  pending: "border-slate-700 bg-slate-800/50 text-slate-400",
  in_progress: "border-amber-500/30 bg-amber-500/5 text-amber-300",
  completed: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
}

export default function DemoFlowGuide() {
  const router = useRouter()
  const [stats, setStats] = useState<DemoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [initMsg, setInitMsg] = useState("")
  const [initLoading, setInitLoading] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard-stats")
      const data = await res.json()
      if (data.success) {
        setStats({
          candidates: data.data.totalCandidates || 0,
          companies: data.data.totalCompanies || 0,
          jobs: data.data.totalJobs || 0,
          invitations: data.data.totalInvitations || 0,
          interviews: data.data.activeInterviews || 0,
          assessments: 0,
          negotiations: 0,
          offers: 0,
          messages: 0,
          notifications: 0,
          auditLogs: 0,
        })
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  async function initDemoData() {
    setInitLoading(true)
    setInitMsg("")
    try {
      const res = await fetch("/api/demo/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ forceReset: false }),
      })
      const data = await res.json()
      if (data.success) {
        setInitMsg(data.message)
        if (data.data) setStats(data.data)
      } else {
        setInitMsg("失败: " + (data.message || "未知错误"))
      }
    } catch (e: any) {
      setInitMsg("网络错误: " + (e.message || ""))
    } finally {
      setInitLoading(false)
    }
  }

  const hasData = stats && stats.candidates > 0

  // Dynamically update flow step statuses
  const steps = FLOW_STEPS.map((s) => {
    let status: "pending" | "in_progress" | "completed" = "pending"
    if (!hasData) return { ...s, status }
    if (s.step <= 2) status = "completed"
    if (s.step === 3) status = (stats?.invitations || 0) > 0 ? "completed" : "in_progress"
    if (s.step >= 4 && s.step <= 7) status = "completed"
    if (s.step === 8) status = "in_progress"
    if (s.step === 9) status = "pending"
    return { ...s, status }
  })

  const completedSteps = steps.filter((s) => s.status === "completed").length
  const progressPct = Math.round((completedSteps / steps.length) * 100)

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Rocket className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-semibold text-sm">Demo 演示流程引导</h3>
          {hasData && (
            <span className="text-xs text-slate-400">
              ({completedSteps}/{steps.length} 步完成)
            </span>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-500 hover:text-slate-300 text-xs transition-colors"
        >
          {expanded ? "收起 ▲" : "展开 ▼"}
        </button>
      </div>

      {expanded && (
        <>
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-400">
                {!hasData ? "请先初始化演示数据" : `整体进度: ${completedSteps}/${steps.length} 步完成`}
              </span>
              <span className="text-xs text-amber-400">{progressPct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Init button */}
          <div className="mb-4">
            <button
              onClick={initDemoData}
              disabled={initLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all disabled:opacity-50"
            >
              {initLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  初始化中...
                </>
              ) : hasData ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  重新初始化演示数据（将重置所有数据）
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  一键初始化演示数据
                </>
              )}
            </button>
            {initMsg && (
              <p className={`text-xs mt-2 px-2 ${initMsg.includes("失败") || initMsg.includes("错误") ? "text-red-400" : "text-emerald-400"}`}>
                {initMsg}
              </p>
            )}
            {hasData && (
              <p className="text-xs text-slate-500 mt-2 text-center">
                已初始化: {stats?.candidates || 0} 候选人 · {stats?.companies || 0} 企业 · {stats?.jobs || 0} 职位 · {stats?.invitations || 0} 邀请 · {stats?.offers || 0} Offer
              </p>
            )}
          </div>

          {/* Flow steps */}
          <div className="space-y-2">
            {steps.map((step) => {
              const IconComp = ICON_MAP[step.icon] || ArrowRight
              const colorSet = STATUS_COLORS[step.status]

              return (
                <div
                  key={step.step}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${colorSet}`}
                >
                  {/* Step number / icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                    step.status === "in_progress" ? "bg-amber-500/20 text-amber-400" :
                    "bg-slate-700/50 text-slate-500"
                  }`}>
                    {step.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      step.step
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-sm font-medium ${
                        step.status === "completed" ? "text-emerald-300" :
                        step.status === "in_progress" ? "text-amber-300" :
                        "text-slate-400"
                      }`}>
                        {step.label}
                      </span>
                      {step.status === "completed" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">✓</span>
                      )}
                      {step.status === "in_progress" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 animate-pulse">进行中</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{step.description}</p>
                    {hasData && step.status !== "completed" && (
                      <Link
                        href={step.link}
                        className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        {step.linkLabel} <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                    {step.status === "completed" && hasData && (
                      <Link
                        href={step.link}
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> {step.linkLabel}
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation hints */}
          {hasData && (
            <div className="mt-4 p-3 rounded-lg border border-sky-500/20 bg-sky-500/5">
              <p className="text-xs text-sky-300 flex items-center gap-1 mb-2">
                <AlertCircle className="w-3 h-3" /> 提示
              </p>
              <p className="text-xs text-slate-400">
                完整的 Demo 账户列表：<br />
                <code className="text-sky-400">hr@demo-solar.cn / company123</code> — 企业HR<br />
                <code className="text-sky-400">lixiaofeng@demo-tech.org / candidate123</code> — 候选人<br />
                <code className="text-sky-400">admin@globaltalentradar.com / admin123</code> — 管理员
              </p>
              <div className="flex gap-2 mt-2">
                <Link
                  href="/login"
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs hover:bg-sky-500/20 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> 前往登录
                </Link>
                <Link
                  href="/candidates"
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 text-xs hover:bg-sky-500/20 transition-colors"
                >
                  浏览候选人 <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
