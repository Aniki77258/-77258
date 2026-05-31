"use client"

import { cn } from "@/lib/utils"
import { Search, Users, Mail, Calendar, FileCheck2, TrendingUp, CheckCircle2 } from "lucide-react"

type EmptyScene = "search" | "candidates" | "invitations" | "interviews" | "evaluations" | "negotiations" | "offers" | "generic"

interface EmptyTechStateProps {
  scene?: EmptyScene
  title?: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}

const sceneConfig: Record<EmptyScene, { icon: React.ElementType; defaultTitle: string; defaultDesc: string }> = {
  search: { icon: Search, defaultTitle: "暂无搜索结果", defaultDesc: "尝试调整筛选条件或扩大搜索范围，AI 将为您推荐最匹配的候选人" },
  candidates: { icon: Users, defaultTitle: "暂无候选人在库", defaultDesc: "启动 AI 人才雷达扫描全球风能锂电领域，发现潜在候选人" },
  invitations: { icon: Mail, defaultTitle: "暂无邀请记录", defaultDesc: "从搜索结果中选择匹配的候选人，发出专业邀请信" },
  interviews: { icon: Calendar, defaultTitle: "暂无面试安排", defaultDesc: "收到候选人回复后，安排面试时间并发送确认通知" },
  evaluations: { icon: FileCheck2, defaultTitle: "暂无评估记录", defaultDesc: "面试完成后，创建 AI 辅助评估报告" },
  negotiations: { icon: TrendingUp, defaultTitle: "暂无谈判记录", defaultDesc: "评估通过后，发起薪酬谈判流程" },
  offers: { icon: CheckCircle2, defaultTitle: "暂无 Offer 记录", defaultDesc: "谈判达成一致后，创建并发送正式 Offer" },
  generic: { icon: Search, defaultTitle: "暂无数据", defaultDesc: "当前没有任何数据，请稍后再试" },
}

export function EmptyTechState({
  scene = "generic", title, description, action, className
}: EmptyTechStateProps) {
  const config = sceneConfig[scene]
  const Icon = config.icon

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {/* Tech circle */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full border border-[#38bdf8]/10 flex items-center justify-center bg-[#0a1628]">
          <Icon className="w-8 h-8 text-[#38bdf8]/30" />
        </div>
        {/* Radar rings */}
        <div className="absolute inset-0 rounded-full border border-[#38bdf8]/5 animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute inset-[-8px] rounded-full border border-[#38bdf8]/3 animate-ping" style={{ animationDuration: "4s", animationDelay: "1s" }} />
      </div>

      <h3 className="text-base font-semibold text-white mb-2">{title || config.defaultTitle}</h3>
      <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-6">
        {description || config.defaultDesc}
      </p>

      {action && (
        <button
          onClick={action.onClick}
          className="btn-energy"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
