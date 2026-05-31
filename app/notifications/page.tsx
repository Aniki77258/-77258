"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell, BellOff, Check, Trash2, Filter, RefreshCw, ChevronRight,
  Users, Calendar, ClipboardCheck, Handshake, FileText, Shield,
  AlertTriangle, Settings, Send, X, Eye, EyeOff, Zap
} from "lucide-react"
import { executeAllDemoTriggers, TRIGGER_SCENARIOS } from "@/lib/notification-triggers"

// ============================================================
// Types
// ============================================================
interface NotificationItem {
  id: string
  userId: string
  title: string
  message: string
  type: string
  read: boolean
  link?: string | null
  createdAt: string
}

const NOTIFICATION_TYPES = [
  { value: "", label: "全部", icon: Bell, color: "text-slate-300" },
  { value: "system", label: "系统", icon: Settings, color: "text-purple-400" },
  { value: "invitation", label: "邀请", icon: Send, color: "text-blue-400" },
  { value: "interview", label: "面试", icon: Calendar, color: "text-cyan-400" },
  { value: "assessment", label: "评估", icon: ClipboardCheck, color: "text-green-400" },
  { value: "negotiation", label: "谈判", icon: Handshake, color: "text-yellow-400" },
  { value: "offer", label: "Offer", icon: FileText, color: "text-orange-400" },
  { value: "review", label: "审核", icon: Shield, color: "text-indigo-400" },
  { value: "risk_alert", label: "风险", icon: AlertTriangle, color: "text-red-400" },
] as const

// ============================================================
// Mock Data
// ============================================================
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1", userId: "u_company_001",
    title: "候选人已接受邀请",
    message: "李晓风（MIT博士，风机载荷仿真专家）已接受您的招聘邀请。请前往面试管理安排面试时间。",
    type: "invitation", read: false,
    link: "/interviews", createdAt: "2026-05-30T14:30:00.000Z",
  },
  {
    id: "n2", userId: "u_company_001",
    title: "面试即将开始",
    message: "与张伟（固态电池电解质研发负责人）的技术面试将于明天 14:00 开始，请提前准备。",
    type: "interview", read: false,
    link: "/interviews", createdAt: "2026-05-30T10:00:00.000Z",
  },
  {
    id: "n3", userId: "u_company_001",
    title: "人才评估报告已生成",
    message: "M. Schmidt（海上风电基础设计专家）的技术评估报告已完成，综合评分 94 分，强烈推荐。",
    type: "assessment", read: true,
    link: "/assessments", createdAt: "2026-05-29T16:00:00.000Z",
  },
  {
    id: "n4", userId: "u_company_001",
    title: "薪资谈判更新",
    message: "李晓风对薪酬方案提出了新的期望：base ¥900K、bonus 20%、equity 0.5%。请前往谈判页面查看。",
    type: "negotiation", read: false,
    link: "/negotiations", createdAt: "2026-05-29T11:00:00.000Z",
  },
  {
    id: "n5", userId: "u_company_001",
    title: "Offer 已生成",
    message: "为田中一郎（BMS首席架构师）的 Offer 已生成，状态为草稿。请确认后发送给候选人。",
    type: "offer", read: true,
    link: "/offers", createdAt: "2026-05-29T09:00:00.000Z",
  },
  {
    id: "n6", userId: "u_company_001",
    title: "企业认证审核通过",
    message: "贵司「中国光伏科技集团」的企业认证已通过审核。现在可以使用平台的完整功能。",
    type: "review", read: true,
    link: "/companies", createdAt: "2026-05-28T17:00:00.000Z",
  },
  {
    id: "n7", userId: "u_company_001",
    title: "候选人风险预警",
    message: "候选人 E. Johnson（风储协同控制专家）背景调查发现一处数据不一致，建议进一步核实。风险等级：中",
    type: "risk_alert", read: false,
    link: "/candidates/mock_005", createdAt: "2026-05-30T08:00:00.000Z",
  },
  {
    id: "n8", userId: "u_company_001",
    title: "系统维护通知",
    message: "平台将于 2026-06-02 凌晨 2:00-4:00 进行系统升级，期间部分功能可能无法使用。",
    type: "system", read: false,
    link: null, createdAt: "2026-05-30T06:00:00.000Z",
  },
  {
    id: "n9", userId: "u_company_001",
    title: "面试反馈已收到",
    message: "面试官已完成对李晓风技术面试的评价，面试评分 92 分，反馈意见已生成。请查看评估报告。",
    type: "interview", read: true,
    link: "/assessments", createdAt: "2026-05-27T15:00:00.000Z",
  },
  {
    id: "n10", userId: "u_company_001",
    title: "Offer 被接受",
    message: "M. Schmidt 已接受贵司发出的海上风电基础设计专家 Offer。请准备入职手续。",
    type: "offer", read: true,
    link: "/offers", createdAt: "2026-05-26T10:00:00.000Z",
  },
  {
    id: "n11", userId: "u_company_001",
    title: "新候选人入库",
    message: "系统自动发现 12 位风能领域高潜力候选人，AI 评分均在 85 以上。请前往人才搜索查看。",
    type: "system", read: true,
    link: "/candidates", createdAt: "2026-05-25T08:00:00.000Z",
  },
  {
    id: "n12", userId: "u_company_001",
    title: "审核驳回通知",
    message: "您提交的职位「风力发电机叶片设计师」因薪资范围不合理被驳回，请修改后重新提交。",
    type: "review", read: true,
    link: "/jobs", createdAt: "2026-05-24T14:00:00.000Z",
  },
]

// ============================================================
// Helpers
// ============================================================
function getTimeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return "刚刚"
  if (diffMin < 60) return `${diffMin} 分钟前`
  if (diffHour < 24) return `${diffHour} 小时前`
  if (diffDay < 7) return `${diffDay} 天前`
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("zh-CN", {
    month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
  })
}

function getTypeConfig(type: string) {
  return NOTIFICATION_TYPES.find((t) => t.value === type) || NOTIFICATION_TYPES[0]
}

// ============================================================
// Component
// ============================================================
export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState("")
  const [showRead, setShowRead] = useState(true)
  const [triggerResults, setTriggerResults] = useState<{ scenario: string; result: { success: boolean; message: string } }[] | null>(null)
  const [triggerRunning, setTriggerRunning] = useState(false)

  // Load mock data
  useEffect(() => {
    setNotifications(MOCK_NOTIFICATIONS)
    setLoading(false)
  }, [])

  // Filtered list
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter && n.type !== activeFilter) return false
    if (!showRead && n.read) return false
    return true
  })

  // Stats
  const unreadCount = notifications.filter((n) => !n.read).length
  const totalCount = notifications.length

  // Actions
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const toggleRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)))
  }, [])

  const runTriggerDemo = useCallback(async () => {
    setTriggerRunning(true)
    setTriggerResults(null)
    await new Promise((resolve) => setTimeout(resolve, 600))
    const results = executeAllDemoTriggers()

    // Add trigger results as new notifications
    const newNotifs: NotificationItem[] = results.map((r, i) => ({
      id: `trigger_${Date.now()}_${i}`,
      userId: "u_company_001",
      title: r.scenario,
      message: r.result.message,
      type: r.scenario === "发送邀请" || r.scenario === "候选人接受邀请" ? "invitation"
        : r.scenario === "创建面试" || r.scenario === "面试完成" ? "interview"
        : r.scenario === "生成Offer" ? "offer"
        : r.scenario === "审核驳回" ? "review"
        : r.scenario === "风险预警" ? "risk_alert"
        : "assessment",
      read: false,
      link: null,
      createdAt: new Date(Date.now() + i * 1000).toISOString(),
    }))

    setNotifications((prev) => [...newNotifs, ...prev])
    setTriggerResults(results.map((r) => ({ scenario: r.scenario, result: { success: r.result.success, message: r.result.message } })))
    setTriggerRunning(false)
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-sky-400" />
            <h1 className="text-xl font-bold text-white">通知中心</h1>
            {unreadCount > 0 && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {unreadCount} 条未读
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRead(!showRead)}
              className="text-slate-400 hover:text-white"
            >
              {showRead ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {showRead ? "隐藏已读" : "显示已读"}
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-sky-400 hover:text-sky-300"
              >
                <Check className="w-4 h-4 mr-1" />
                全部已读
              </Button>
            )}
          </div>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {NOTIFICATION_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setActiveFilter(type.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeFilter === type.value
                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                  : "bg-white/5 text-slate-400 border border-transparent hover:bg-white/10 hover:text-slate-300"
              }`}
            >
              <type.icon className="w-3 h-3" />
              {type.label}
              {type.value === "" && ` (${totalCount})`}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>共 {filteredNotifications.length} 条通知</span>
          <span>|</span>
          <span>{unreadCount} 条未读</span>
          <span>|</span>
          <span>{notifications.filter((n) => n.read).length} 条已读</span>
        </div>

        {/* Notification List */}
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <BellOff className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm">暂无通知</p>
            <p className="text-xs mt-1">筛选条件：{activeFilter ? getTypeConfig(activeFilter).label : "全部"} | {showRead ? "含已读" : "仅未读"}</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredNotifications.map((notif) => {
              const typeConfig = getTypeConfig(notif.type)
              return (
                <div
                  key={notif.id}
                  className={`group flex items-start gap-3 p-3.5 rounded-lg transition-all cursor-pointer border ${
                    notif.read
                      ? "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                      : "bg-sky-500/5 border-sky-500/10 hover:bg-sky-500/10"
                  }`}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  {/* Indicator dot */}
                  <div className="mt-1 flex-shrink-0">
                    {notif.read ? (
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
                    )}
                  </div>

                  {/* Icon */}
                  <typeConfig.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${typeConfig.color}`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${notif.read ? "text-slate-300" : "text-white"}`}>
                        {notif.title}
                      </span>
                      <Badge className={`text-[10px] px-1.5 py-0 ${typeConfig.color.replace("text-", "bg-").replace("400", "500/20")} ${typeConfig.color} border-0`}>
                        {typeConfig.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notif.message}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-slate-600">{formatTime(notif.createdAt)}</span>
                      {!notif.read && <span className="text-[10px] text-sky-500/60">{getTimeAgo(notif.createdAt)}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleRead(notif.id) }}
                      className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-300"
                      title={notif.read ? "标记未读" : "标记已读"}
                    >
                      {notif.read ? <EyeOff className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id) }}
                      className="p-1 rounded hover:bg-red-500/10 text-slate-500 hover:text-red-400"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {notif.link && (
                      <a
                        href={notif.link}
                        onClick={(e) => e.stopPropagation()}
                        className="p-1 rounded hover:bg-white/10 text-slate-500 hover:text-sky-400"
                        title="查看详情"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Trigger Demo Section */}
        <div className="p-5 rounded-xl bg-[#0a1120] border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-semibold text-white">通知触发场景演示</h3>
            </div>
            <Button
              onClick={runTriggerDemo}
              disabled={triggerRunning}
              size="sm"
              className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs border border-yellow-500/30"
            >
              {triggerRunning ? (
                <><RefreshCw className="w-3 h-3 mr-1 animate-spin" />模拟触发中...</>
              ) : (
                <><Zap className="w-3 h-3 mr-1" />一键触发全部场景</>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {TRIGGER_SCENARIOS.map((s) => (
              <div
                key={s.id}
                className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs"
              >
                <span className="text-base mr-1">{s.icon}</span>
                <span className="text-slate-400">{s.label}</span>
              </div>
            ))}
          </div>

          {triggerResults && (
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {triggerResults.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 p-2 rounded text-xs ${
                    r.result.success
                      ? "bg-green-500/5 border border-green-500/10"
                      : "bg-red-500/5 border border-red-500/10"
                  }`}
                >
                  <Check className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300">{r.result.message}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-slate-600">
            点击按钮模拟业务流程中的通知触发，新通知将出现在上方通知列表中
          </p>
        </div>

        {/* Hint */}
        <div className="text-center text-[10px] text-slate-600 pt-4 pb-8">
          通知数据为演示用 Mock 数据 • 操作仅影响当前会话
        </div>
      </div>
    </AppLayout>
  )
}
