"use client"

import { Calendar, UserCheck, MessageSquare, FileCheck2, TrendingUp, AlertTriangle, Award, Globe } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export interface ActivityItem {
  id: string
  type: "candidate_new" | "interview_done" | "offer_sent" | "invite_accepted" | "assessment_completed" | "risk_alert" | "talent_discovered" | "deal_closed"
  title: string
  description: string
  timestamp: string
  actor?: string
  meta?: string
}

const ACTIVITY_ICONS = {
  candidate_new: UserCheck,
  interview_done: Calendar,
  offer_sent: Award,
  invite_accepted: MessageSquare,
  assessment_completed: FileCheck2,
  risk_alert: AlertTriangle,
  talent_discovered: Globe,
  deal_closed: TrendingUp,
}

const ACTIVITY_COLORS = {
  candidate_new: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  interview_done: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  offer_sent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  invite_accepted: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  assessment_completed: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  risk_alert: "text-red-400 bg-red-500/10 border-red-500/20",
  talent_discovered: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  deal_closed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
}

export const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: "act1",
    type: "talent_discovered",
    title: "发现高潜力人才",
    description: "AI 雷达在 MIT 发现固态电池领域研究员 — Dr. Emily Zhang，匹配度 94%",
    timestamp: "2026-05-31T08:30:00Z",
    actor: "AI 雷达",
    meta: "匹配度 94%"
  },
  {
    id: "act2",
    type: "offer_sent",
    title: "Offer 已发送",
    description: "向候选人 Dr. Thomas Müller (海上风电高级工程师) 发送正式 Offer",
    timestamp: "2026-05-31T07:45:00Z",
    actor: "HR 王芳",
    meta: "年薪 ¥850K"
  },
  {
    id: "act3",
    type: "interview_done",
    title: "面试完成",
    description: "John Smith — 储能系统架构师的第三轮技术面试已完成，评分 88/100",
    timestamp: "2026-05-30T18:20:00Z",
    actor: "CTO 陈总",
    meta: "评分 88"
  },
  {
    id: "act4",
    type: "assessment_completed",
    title: "AI 评估完成",
    description: "候选人 Maria Garcia (BMS 算法专家) 的 AI 综合评估已完成",
    timestamp: "2026-05-30T16:10:00Z",
    actor: "AI 评估引擎",
    meta: "综合分 91"
  },
  {
    id: "act5",
    type: "invite_accepted",
    title: "邀请已接受",
    description: "丹麦 DTU 风能研究所的 Lars Jensen 接受了面试邀请",
    timestamp: "2026-05-30T14:55:00Z",
    actor: "系统",
    meta: "DTU"
  },
  {
    id: "act6",
    type: "risk_alert",
    title: "候选人流失风险",
    description: "3 位谈判中候选人超过 48h 未回复，建议立即跟进",
    timestamp: "2026-05-30T12:30:00Z",
    actor: "预警系统",
  },
  {
    id: "act7",
    type: "candidate_new",
    title: "新候选人入库",
    description: "47 位锂电领域新候选人已通过 AI 初筛，来自中国、日本、韩国",
    timestamp: "2026-05-30T10:15:00Z",
    actor: "系统",
    meta: "+47人"
  },
  {
    id: "act8",
    type: "deal_closed",
    title: "交易关闭",
    description: "风力涡轮机叶片设计专家 — Anna Lindström 正式入职 Ørsted 丹麦总部",
    timestamp: "2026-05-29T20:00:00Z",
    actor: "猎头 李华",
    meta: "佣金 ¥120K"
  },
]

function formatTimeAgo(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const date = new Date(iso)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

function formatTimeAgoZh(iso: string): string {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}分钟前`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}天前`
  const date = new Date(iso)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

export function ActivityFeed({
  activities = DEFAULT_ACTIVITIES,
  language = "zh",
  className = "",
}: {
  activities?: ActivityItem[]
  language?: string
  className?: string
}) {
  const noActivitiesLabel = language === "zh" ? "暂无动态" : "No activities yet"
  const feedTitle = language === "zh" ? "实时动态" : "Activity Feed"

  return (
    <Card className={`border-[#1a2a44] bg-[#0c1830] rounded-xl ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {feedTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="max-h-[520px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">{noActivitiesLabel}</div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[17px] top-2 bottom-2 w-px bg-[#1a2a44]" />

            <div className="space-y-0">
              {activities.map((item, i) => {
                const Icon = ACTIVITY_ICONS[item.type]
                const colorClass = ACTIVITY_COLORS[item.type]
                const timeAgo = language === "zh" ? formatTimeAgoZh(item.timestamp) : formatTimeAgo(item.timestamp)

                return (
                  <div key={item.id} className="relative pl-10 py-2.5 group">
                    {/* Timeline dot */}
                    <div className={`absolute left-[10px] top-3 w-[15px] h-[15px] rounded-full border-2 flex items-center justify-center ${colorClass}`}>
                      <Icon className="h-[7px] w-[7px]" />
                    </div>

                    {/* Connection line to previous */}
                    {i > 0 && (
                      <div className="absolute left-[17px] top-0 h-3 w-px bg-[#1a2a44]" />
                    )}

                    <div className="rounded-lg bg-[#060d1a] border border-[#1a2a44] p-3 hover:border-sky-500/20 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-white truncate">{item.title}</h4>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
                          {item.actor && (
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-[10px] text-slate-500">{item.actor}</span>
                              {item.meta && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                  {item.meta}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-600 shrink-0 mt-0.5">{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
