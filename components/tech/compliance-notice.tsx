"use client"

import { cn } from "@/lib/utils"
import { Shield, Database, RefreshCw, Trash2, Globe } from "lucide-react"

interface ComplianceNoticeProps {
  variant?: "full" | "compact"
  className?: string
}

export function ComplianceNotice({ variant = "compact", className }: ComplianceNoticeProps) {
  if (variant === "compact") {
    return (
      <div className={cn("glass-card p-4", className)}>
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-[#4ade80] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-slate-400 leading-relaxed">
              本平台所有候选人数据均已获得授权，联系方式已脱敏处理。AI 分析仅供参考，不构成招聘建议。严禁基于性别、年龄、种族、宗教等受保护特征进行筛选。
            </p>
            <div className="flex gap-3 mt-2">
              <a href="/privacy" className="text-[10px] text-[#38bdf8] hover:underline">隐私政策</a>
              <a href="/terms" className="text-[10px] text-[#38bdf8] hover:underline">用户协议</a>
              <a href="/data-trust" className="text-[10px] text-[#38bdf8] hover:underline">数据真实性中心</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#4ade80]/20 to-[#38bdf8]/20 flex items-center justify-center">
          <Shield className="w-8 h-8 text-[#4ade80]" />
        </div>
        <h2 className="text-xl font-bold text-white">可信数据平台</h2>
        <p className="text-sm text-slate-400 mt-2">我们致力于构建可信、透明、合规的全球新能源人才数据平台</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {[
          {
            icon: Database,
            title: "数据来源说明",
            desc: "候选人数据来源于公开学术论文、专利数据库、技术社区、行业会议等公开可验证渠道。所有数据均标注来源和采集时间，确保可追溯性。",
            color: "text-[#38bdf8]", bg: "bg-[#38bdf8]/10"
          },
          {
            icon: Shield,
            title: "候选人授权机制",
            desc: "每位候选人均需明确授权后方可展示其专业画像。候选人可随时撤回授权、修改信息或删除数据。未经授权的内容不会对外展示。",
            color: "text-[#4ade80]", bg: "bg-[#4ade80]/10"
          },
          {
            icon: Trash2,
            title: "数据删除机制",
            desc: "候选人可通过平台请求删除个人数据，我们将在 7 个工作日内完成删除并确认。所有删除操作均有审计日志记录。",
            color: "text-[#f87171]", bg: "bg-[#f87171]/10"
          },
          {
            icon: RefreshCw,
            title: "数据更正机制",
            desc: "如果发现数据不准确，候选人可提交更正请求。平台将在 3 个工作日内核实并更新，同时标注数据更新时间和更正原因。",
            color: "text-[#a78bfa]", bg: "bg-[#a78bfa]/10"
          },
          {
            icon: Globe,
            title: "跨境数据合规",
            desc: "严格遵守 GDPR、CCPA、PIPL 等国际数据保护法规。跨境数据传输采用加密通道，确保候选人数据在全球范围内的安全与合规。",
            color: "text-[#22d3ee]", bg: "bg-[#22d3ee]/10"
          },
        ].map((item, i) => (
          <div key={i} className="glass-card p-5">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", item.bg)}>
              <item.icon className={cn("w-5 h-5", item.color)} />
            </div>
            <h3 className="font-semibold text-white text-sm mb-2">{item.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Anti-discrimination */}
      <div className="glass-card p-5 border border-[#fbbf24]/20 bg-[#fbbf24]/5">
        <h3 className="font-semibold text-white text-sm mb-2">反歧视招聘声明</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          本平台严格遵守反歧视法律法规。我们不会基于性别、年龄、种族、宗教、婚育状况、残障、国籍或任何其他受法律保护的特征对候选人进行筛选或排序。
          国家/地区筛选仅用于工作地点匹配、时区协调和跨境招聘合规管理，绝不用于歧视性招聘。
        </p>
      </div>
    </div>
  )
}
