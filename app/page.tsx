"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/i18n"
import { TechShell } from "@/components/tech/tech-shell"
import { TechCard, TechCardTitle, TechCardDescription } from "@/components/tech/tech-card"
import { MetricGlowCard } from "@/components/tech/metric-glow-card"
import { GlobalRadarMap } from "@/components/tech/global-radar-map"
import { EnergyBadge } from "@/components/tech/energy-badge"
import { ComplianceNotice } from "@/components/tech/compliance-notice"
import {
  Search, Send, Video, FileCheck2, TrendingUp, UserCheck,
  Building2, Users, UserSearch, Globe, Shield, Zap,
  ArrowRight, Radar, Battery, Wind, ChevronRight, Sparkles
} from "lucide-react"

export default function HomePage() {
  const { t, language, toggleLanguage } = useLanguage()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const isZh = language === 'zh'

  const handleSearch = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = searchQuery.trim()
    if (trimmed) {
      router.push(`/searches?q=${encodeURIComponent(trimmed)}`)
    } else {
      router.push("/searches")
    }
  }, [searchQuery, router])

  // Six module energy pods
  const modules = [
    { key: "search", icon: Search, title: isZh ? "人才搜索" : "Radar Search", desc: isZh ? "AI 驱动的全球风能锂电人才精准搜索" : "AI-powered global wind & lithium talent search", color: "from-[#38bdf8] to-[#0ea5e9]", badge: "blue" as const, link: "/search" },
    { key: "invite", icon: Send, title: isZh ? "人才邀请" : "Signal Invite", desc: isZh ? "智能生成个性化邀请文案，提升回复率" : "AI-generated personalized invitation messages", color: "from-[#22d3ee] to-[#06b6d4]", badge: "cyan" as const, link: "/invitations" },
    { key: "interview", icon: Video, title: isZh ? "人才面试" : "Virtual Interview", desc: isZh ? "多时区协调、AI 面试问题生成" : "Multi-timezone scheduling with AI question generation", color: "from-[#a78bfa] to-[#7c3aed]", badge: "purple" as const, link: "/interviews" },
    { key: "evaluate", icon: FileCheck2, title: isZh ? "人才评估" : "AI Evaluation", desc: isZh ? "技术能力、管理能力、国际化能力多维评估" : "Multi-dimensional skill assessment with AI scoring", color: "from-[#c084fc] to-[#9333ea]", badge: "purple" as const, link: "/evaluations" },
    { key: "negotiate", icon: TrendingUp, title: isZh ? "人才谈判" : "Smart Negotiation", desc: isZh ? "AI 薪酬分析、多币种智能谈判" : "AI salary benchmarking & smart negotiation", color: "from-[#4ade80] to-[#16a34a]", badge: "green" as const, link: "/negotiations" },
    { key: "offer", icon: UserCheck, title: isZh ? "人才录取" : "Talent Onboarding", desc: isZh ? "Offer 管理、背调、入职全流程闭环" : "Offer management, background checks, onboarding", color: "from-[#34d399] to-[#059669]", badge: "green" as const, link: "/offers" },
  ]

  // Public demo stats
  const publicStats = [
    { label: isZh ? "全球候选人" : "Global Candidates", value: "28,453", delta: "+12.3%", icon: <Users className="w-4 h-4" />, glow: "blue" as const },
    { label: isZh ? "合作企业" : "Partner Companies", value: "1,204", delta: "+3.2%", icon: <Building2 className="w-4 h-4" />, glow: "cyan" as const },
    { label: isZh ? "活跃猎头" : "Active Headhunters", value: "586", delta: "+8.1%", icon: <UserSearch className="w-4 h-4" />, glow: "purple" as const },
    { label: isZh ? "认证候选人" : "Verified Candidates", value: "9,871", delta: "+5.7%", icon: <Shield className="w-4 h-4" />, glow: "green" as const },
  ]

  return (
    <TechShell showGrid showGlow>
      {/* ========== Navigation ========== */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#060b14]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] flex items-center justify-center">
              <Radar className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-sm hidden sm:inline">
              {isZh ? "全球风能锂电人才搜索雷达" : "Global Wind & Lithium Talent Radar"}
            </span>
          </a>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-6">
            {modules.slice(0, 3).map(m => (
              <a key={m.key} href={m.link} className="text-xs text-slate-400 hover:text-white transition-colors">
                {m.title}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>
            <a href="/login" className="px-4 py-1.5 text-xs rounded-lg border border-white/10 text-slate-300 hover:text-white hover:border-white/30 transition-all">
              {isZh ? "登录" : "Login"}
            </a>
            <a href="/register" className="btn-energy text-xs !py-1.5 !px-4">
              {isZh ? "免费注册" : "Sign Up Free"}
            </a>
          </div>
        </div>
      </nav>

      {/* ========== Hero Section ========== */}
      <section className="relative pt-16 pb-8 md:pt-24 md:pb-12 px-4 overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#38bdf8]/30 particle"
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                '--dx': `${(Math.random() - 0.5) * 60}px`,
                '--dy': `${(Math.random() - 0.5) * 60}px`,
                '--duration': `${2 + Math.random() * 4}s`,
                '--delay': `${Math.random() * 3}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#38bdf8]/20 bg-[#38bdf8]/5 text-[#38bdf8] text-xs mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {isZh ? "AI 驱动的全球新能源人才搜索平台" : "AI-Powered Global Clean Energy Talent Platform"}
            <EnergyBadge variant="demo">示例数据</EnergyBadge>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
            {isZh ? "全球风能锂电" : "Global Wind & Lithium"}
            <br />
            <span className="bg-gradient-to-r from-[#38bdf8] via-[#22d3ee] to-[#4ade80] bg-clip-text text-transparent">
              {isZh ? "人才搜索雷达" : "Talent Radar"}
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            {isZh
              ? "连接全球风能、锂电、储能行业高端人才与企业机会。从搜索到录取，AI 驱动的全流程智能闭环。"
              : "Connecting top talent with opportunities in wind energy, lithium battery, and energy storage. AI-powered end-to-end recruitment intelligence."}
          </p>

          <p className="text-sm text-slate-600 mb-8 max-w-xl mx-auto">
            {isZh ? "Search, Verify, Invite, Evaluate, Negotiate, Hire — 让全球新能源人才流动更高效、更可信。" : "Search, Verify, Invite, Evaluate, Negotiate, Hire — Making global clean energy talent flow smarter."}
          </p>

          {/* CTA */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <a href="/searches" className="btn-energy text-base !px-8 !py-3">
              <Search className="w-4 h-4 mr-2 inline" />
              {isZh ? "立即搜索人才" : "Search Talent Now"}
            </a>
            <a href="/register" className="btn-energy-green text-base !px-8 !py-3">
              {isZh ? "免费注册" : "Sign Up Free"}
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </a>
            <a href="/login" className="px-8 py-3 rounded-lg text-base font-medium border border-white/15 text-white hover:border-white/30 hover:bg-white/5 transition-all">
              {isZh ? "登录平台" : "Login"}
            </a>
          </div>

          {/* Hero visual - Global Radar */}
          <div className="max-w-3xl mx-auto">
            <TechCard glow padding="sm" className="!bg-[#0a1628]/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#38bdf8]" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    {isZh ? "全球人才雷达" : "Global Talent Radar"}
                  </span>
                </div>
                <span className="text-[9px] text-slate-600">
                  {isZh ? "示例数据 · 实时更新" : "Demo Data · Realtime"}
                </span>
              </div>
              <GlobalRadarMap compact />
            </TechCard>
          </div>
        </div>
      </section>

      {/* ========== User Entry Portals ========== */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-xl font-bold text-white mb-8">
            {isZh ? "选择您的角色" : "Choose Your Role"}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Building2, title: isZh ? "企业用户" : "Enterprise", desc: isZh ? "发布招聘岗位，搜索全球风能锂电人才，管理招聘全流程" : "Post jobs, search global talent, manage full recruitment pipeline", color: "text-[#38bdf8]", bg: "bg-[#38bdf8]/10", link: "/register?role=company" },
              { icon: Users, title: isZh ? "候选人" : "Candidate", desc: isZh ? "展示专业履历，接收企业邀请和 Offer，掌控数据授权" : "Showcase your profile, receive invitations, control data authorization", color: "text-[#4ade80]", bg: "bg-[#4ade80]/10", link: "/register?role=candidate" },
              { icon: UserSearch, title: isZh ? "猎头顾问" : "Headhunter", desc: isZh ? "获取高匹配候选人推荐，使用 AI 工具提升交付效率" : "Access high-match candidates, leverage AI tools for faster delivery", color: "text-[#a78bfa]", bg: "bg-[#a78bfa]/10", link: "/register?role=headhunter" },
            ].map((portal, i) => (
              <a key={i} href={portal.link} className="glass-card group text-center !p-6 cursor-pointer">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${portal.bg}`}>
                  <portal.icon className={`w-7 h-7 ${portal.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{portal.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{portal.desc}</p>
                <span className="text-xs text-[#38bdf8] group-hover:text-[#22d3ee] transition-colors inline-flex items-center gap-1">
                  {isZh ? "立即加入" : "Join Now"}
                  <ChevronRight className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Public Stats ========== */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-2">
              {isZh ? "全球人才信号正在汇聚" : "Global Talent Signals Converging"}
            </h2>
            <p className="text-sm text-slate-500">
              {isZh ? "用数据和 AI 重构新能源高端人才招聘" : "Reinventing clean energy talent recruitment with data and AI"}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {publicStats.map((s, i) => (
              <MetricGlowCard key={i} {...s} />
            ))}
          </div>
          <p className="text-center text-[10px] text-slate-600 mt-4">
            {isZh ? "* 以上数据为平台公开示例数据，用于展示平台能力，不代表真实数据" : "* Above data is public demo data for platform capability demonstration"}
          </p>
        </div>
      </section>

      {/* ========== Six Module Energy Pods ========== */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#38bdf8]/15 bg-[#38bdf8]/5 text-[#38bdf8] text-xs mb-4">
              <Zap className="w-3.5 h-3.5" />
              {isZh ? "六大核心模块" : "Six Core Modules"}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isZh ? "从搜索到录取，全流程智能闭环" : "End-to-End Intelligent Recruitment Pipeline"}
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              {isZh ? "六个能量舱覆盖人才招聘全生命周期，AI 驱动每个环节提效" : "Six energy pods covering the full recruitment lifecycle, AI-powered efficiency at every step"}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => (
              <a key={mod.key} href={mod.link} className="glass-card group glow-border scan-line !p-5 cursor-pointer">
                <div className={cn(
                  "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                  mod.color
                )}>
                  <mod.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-white">{mod.title}</h3>
                  <EnergyBadge variant={mod.badge}>
                    {isZh ? "模块 " : "Module "}{i + 1}
                  </EnergyBadge>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{mod.desc}</p>
                <span className="text-xs text-[#38bdf8] group-hover:text-[#22d3ee] transition-colors inline-flex items-center gap-1">
                  {isZh ? "进入模块" : "Enter Module"}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Key Visual Elements ========== */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Wind Energy */}
            <TechCard glow className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#38bdf8]/10 flex items-center justify-center">
                <Wind className="w-8 h-8 text-[#38bdf8]" />
              </div>
              <h3 className="font-semibold text-white mb-2">{isZh ? "风能人才网络" : "Wind Energy Network"}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isZh ? "覆盖风机设计、叶片材料、塔筒结构、SCADA 控制、海上风电等风能全链条人才" : "Covering wind turbine design, blade materials, tower structures, SCADA control, offshore wind full-chain talent"}
              </p>
            </TechCard>

            {/* Lithium Battery */}
            <TechCard glow className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#4ade80]/10 flex items-center justify-center">
                <Battery className="w-8 h-8 text-[#4ade80]" />
              </div>
              <h3 className="font-semibold text-white mb-2">{isZh ? "锂电人才矩阵" : "Lithium Battery Matrix"}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isZh ? "覆盖电芯研发、BMS 管理、正极/负极材料、固态电池、热管理等锂电核心领域人才" : "Covering cell R&D, BMS management, cathode/anode materials, solid-state batteries, thermal management talent"}
              </p>
            </TechCard>

            {/* Storage */}
            <TechCard glow className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#a78bfa]/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-[#a78bfa]" />
              </div>
              <h3 className="font-semibold text-white mb-2">{isZh ? "储能系统集群" : "Energy Storage Cluster"}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isZh ? "覆盖储能系统集成、PCS 变流器、EMS 能量管理、电网接入等储能全场景人才" : "Covering energy storage system integration, PCS converters, EMS, grid connection full-scenario talent"}
              </p>
            </TechCard>
          </div>
        </div>
      </section>

      {/* ========== AI Search Quick Entry ========== */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <TechCard glow className="text-center !p-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#22d3ee]/20 to-[#38bdf8]/20 flex items-center justify-center">
              <Search className="w-7 h-7 text-[#22d3ee]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {isZh ? "立刻搜索全球新能源人才" : "Search Global Clean Energy Talent Now"}
            </h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              {isZh ? "输入技能关键词、行业领域或地理位置，AI 将扫描全球人才数据库" : "Enter skills, industry, or location — AI will scan the global talent database"}
            </p>
            <form onSubmit={handleSearch} className="flex max-w-md mx-auto gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isZh ? "例如：风机载荷仿真、BMS 电池管理..." : "e.g. Turbine Load Simulation, BMS..."}
                className="input-tech flex-1"
              />
              <button type="submit" onClick={handleSearch} className="btn-energy whitespace-nowrap flex items-center gap-1.5">
                <Search className="w-4 h-4" />
                {isZh ? "搜索" : "Search"}
              </button>
            </form>
            <p className="text-[10px] text-slate-600 mt-3">
              {isZh ? "需要登录以查看完整候选人资料" : "Login required for full candidate profiles"}
            </p>
          </TechCard>
        </div>
      </section>

      {/* ========== Data Trust & Compliance ========== */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#4ade80]/15 bg-[#4ade80]/5 text-[#4ade80] text-xs mb-4">
              <Shield className="w-3.5 h-3.5" />
              {isZh ? "数据可信平台" : "Trusted Data Platform"}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isZh ? "数据真实 · 隐私保护 · 合规运营" : "Data Integrity · Privacy · Compliance"}
            </h2>
          </div>
          <ComplianceNotice variant="full" />
        </div>
      </section>

      {/* ========== CTA Bottom ========== */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <TechCard glow className="!p-10">
            <h2 className="text-2xl font-bold text-white mb-3">
              {isZh ? "准备好连接全球新能源人才了吗？" : "Ready to Connect with Global Clean Energy Talent?"}
            </h2>
            <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
              {isZh ? "加入 1,200+ 企业信赖的全球风能锂电人才搜索雷达，开启 AI 驱动的智能招聘之旅。" : "Join 1,200+ companies trusting Global Wind & Lithium Talent Radar for AI-powered recruitment."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/register" className="btn-energy text-base !px-8 !py-3">
                {isZh ? "免费注册" : "Sign Up Free"}
              </a>
              <a href="/pricing" className="px-8 py-3 rounded-lg text-base font-medium border border-white/15 text-white hover:border-white/30 hover:bg-white/5 transition-all">
                {isZh ? "查看定价方案" : "View Pricing"}
              </a>
            </div>
          </TechCard>
        </div>
      </section>

      {/* ========== Footer ========== */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-[#38bdf8]" />
            <span className="text-xs text-slate-500">
              {isZh ? "全球风能锂电人才搜索雷达 © 2026" : "Global Wind & Lithium Talent Radar © 2026"}
            </span>
          </div>
          <div className="flex gap-4 text-xs text-slate-600">
            <a href="/privacy" className="hover:text-slate-400 transition-colors">{isZh ? "隐私政策" : "Privacy"}</a>
            <a href="/terms" className="hover:text-slate-400 transition-colors">{isZh ? "用户协议" : "Terms"}</a>
            <a href="/data-trust" className="hover:text-slate-400 transition-colors">{isZh ? "数据真实性中心" : "Data Trust"}</a>
            <a href="/about" className="hover:text-slate-400 transition-colors">{isZh ? "关于我们" : "About"}</a>
          </div>
        </div>
      </footer>
    </TechShell>
  )
}

// Helper for cn
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}
