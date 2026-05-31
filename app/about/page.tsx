"use client"

import { TechShell, PageHeader } from "@/components/tech/tech-shell"
import { TechCard } from "@/components/tech/tech-card"
import { Globe, Radar, Zap, Search, Send, Video, FileCheck2, TrendingUp, UserCheck } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export default function AboutPage() {
  const { language } = useLanguage()
  const isZh = language === 'zh'

  return (
    <TechShell showGrid showGlow>
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] mb-6 shadow-[0_0_40px_rgba(56,189,248,0.2)]">
            <Radar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            {isZh ? "关于全球风能锂电人才搜索雷达" : "About Global Wind & Lithium Talent Radar"}
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {isZh
              ? "一个 AI 驱动的全球新能源人才搜索与招聘管理平台，致力于连接风能、锂电、储能行业的高端人才与企业机会。"
              : "An AI-powered global clean energy talent search and recruitment management platform, connecting top talent with opportunities in wind, lithium, and energy storage."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <TechCard>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#38bdf8]" />
              {isZh ? "我们的使命" : "Our Mission"}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {isZh
                ? "用数据和 AI 重构新能源高端人才招聘。让全球风能与锂电人才流动更高效、更可信。我们相信，清洁能源的未来取决于人才的精准匹配。"
                : "Reinvent clean energy talent recruitment with data and AI. Make global wind and lithium talent flow smarter and more trusted. We believe the future of clean energy depends on precise talent matching."}
            </p>
          </TechCard>

          <TechCard>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#4ade80]" />
              {isZh ? "六大核心能力" : "Six Core Capabilities"}
            </h3>
            <div className="space-y-2 text-sm text-slate-400">
              {[
                { icon: Search, label: isZh ? "AI 人才搜索与匹配" : "AI Talent Search & Matching" },
                { icon: Send, label: isZh ? "智能邀请与沟通" : "Smart Invitation & Communication" },
                { icon: Video, label: isZh ? "全球面试调度" : "Global Interview Scheduling" },
                { icon: FileCheck2, label: isZh ? "多维度人才评估" : "Multi-dimensional Assessment" },
                { icon: TrendingUp, label: isZh ? "AI 薪酬谈判" : "AI Salary Negotiation" },
                { icon: UserCheck, label: isZh ? "Offer 与入职管理" : "Offer & Onboarding Management" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-slate-600" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </TechCard>
        </div>
      </div>
    </TechShell>
  )
}
