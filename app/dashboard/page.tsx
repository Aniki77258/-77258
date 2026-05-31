"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users, Building2, TrendingUp, Calendar, FileCheck2, BarChart3,
  Globe, Zap, Battery, UserCheck, AlertTriangle, BotMessageSquare,
  ArrowUpRight, ArrowDownRight, Minus, Search, Bell, LogOut, RefreshCw, Database,
  Target, Activity, Layers, Filter, Eye, ChevronRight, Send
} from "lucide-react"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { ProgressStepper, type Step } from "@/components/shared/progress-stepper"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts"
import type { DashboardStats } from "@/lib/services/data-service"
import { useLanguage } from "@/lib/i18n"
import { useAuth } from "@/lib/auth"
import { WorldHeatmap } from "@/components/dashboard/world-heatmap"
import { ActivityFeed, DEFAULT_ACTIVITIES } from "@/components/dashboard/activity-feed"
import { TechCard } from "@/components/tech/tech-card"
import { MetricGlowCard } from "@/components/tech/metric-glow-card"
import { GlobalRadarMap } from "@/components/tech/global-radar-map"
import { AIInsightPanel } from "@/components/tech/ai-insight-panel"
import { EnergyBadge } from "@/components/tech/energy-badge"

const FLOW_STEPS: Step[] = [
  { key: "dashboard", label: "控制台" },
  { key: "search", label: "搜索人才" },
  { key: "invite", label: "发起邀请" },
  { key: "interview", label: "安排面试" },
  { key: "assess", label: "查看评估" },
  { key: "negotiate", label: "薪资谈判" },
  { key: "offer", label: "发放Offer" },
]

const DEFAULT_STATS: DashboardStats = {
  totalCandidates: 28453,
  totalCompanies: 1204,
  totalJobs: 3412,
  activeInterviews: 456,
  totalInvitations: 18290,
  matchAccuracy: 72.5,
  newCandidatesToday: 347,
  verifiedCandidates: 9871,
  activeHeadhunters: 586,
  conversionRate: 34.2,
  offerConversionRate: 21.7,
  riskAlerts: 395,
  avgCandidateScore: 68,
}

// Funnel data (stage labels — kept as data, not translated)
const funnelData = [
  { stage: "搜索", count: 28453, pct: 100, icon: Search },
  { stage: "已邀请", count: 18290, pct: 64.3, icon: Send },
  { stage: "已回复", count: 8920, pct: 31.4, icon: Bell },
  { stage: "已面试", count: 4560, pct: 16.0, icon: Calendar },
  { stage: "已评估", count: 2890, pct: 10.2, icon: FileCheck2 },
  { stage: "谈判中", count: 1240, pct: 4.4, icon: TrendingUp },
  { stage: "已录取", count: 623, pct: 2.2, icon: UserCheck },
]

const trendData = [
  { month: "2025-06", total: 18200, wind: 7200, lithium: 8900, companies: 820 },
  { month: "2025-07", total: 19400, wind: 7800, lithium: 9500, companies: 890 },
  { month: "2025-08", total: 20800, wind: 8400, lithium: 10200, companies: 940 },
  { month: "2025-09", total: 22100, wind: 8900, lithium: 10900, companies: 990 },
  { month: "2025-10", total: 23800, wind: 9500, lithium: 11800, companies: 1040 },
  { month: "2025-11", total: 25100, wind: 10100, lithium: 12400, companies: 1100 },
  { month: "2025-12", total: 26700, wind: 10700, lithium: 13200, companies: 1150 },
  { month: "2026-01", total: 28453, wind: 11480, lithium: 14020, companies: 1204 },
]

// Skill radar data
const skillRadarData = [
  { skill: "风机载荷仿真", value: 98, fullMark: 100 },
  { skill: "BMS电池管理", value: 93, fullMark: 100 },
  { skill: "储能系统集成", value: 91, fullMark: 100 },
  { skill: "叶片复合材料", value: 95, fullMark: 100 },
  { skill: "SCADA控制", value: 88, fullMark: 100 },
  { skill: "固态电池", value: 86, fullMark: 100 },
  { skill: "海上风电基础", value: 84, fullMark: 100 },
  { skill: "电芯热管理", value: 82, fullMark: 100 },
]

const hotCountries = [
  { rank: 1, country: "中国", candidates: 8650, growth: "+15.2%", tag: "风能领先" },
  { rank: 2, country: "美国", candidates: 7230, growth: "+11.8%", tag: "锂电领先" },
  { rank: 3, country: "德国", candidates: 4890, growth: "+8.4%", tag: "储能领先" },
  { rank: 4, country: "丹麦", candidates: 3210, growth: "+6.1%", tag: "风能强" },
  { rank: 5, country: "日本", candidates: 2980, growth: "+9.7%", tag: "锂电强" },
]

const hotSkills = [
  { skill: "风机载荷仿真", demand: 98, trend: "up" as const },
  { skill: "叶片复合材料设计", demand: 95, trend: "up" as const },
  { skill: "BMS 电池管理算法", demand: 93, trend: "up" as const },
  { skill: "储能系统集成", demand: 91, trend: "up" as const },
  { skill: "SCADA 风场控制", demand: 88, trend: "flat" as const },
  { skill: "固态电池电解质研发", demand: 86, trend: "up" as const },
  { skill: "海上风电基础设计", demand: 84, trend: "up" as const },
  { skill: "电芯热管理仿真", demand: 82, trend: "flat" as const },
]

const riskItems = [
  { level: "high" as const, title: "候选人授权即将过期 (3日内)", count: 47, action: "立即续签" },
  { level: "medium" as const, title: "面试超时未反馈 (>48h)", count: 23, action: "催办猎头" },
  { level: "high" as const, title: "数据可信度偏低 (<60分)", count: 312, action: "重新核验" },
  { level: "low" as const, title: "Offer 审批超时 (>72h)", count: 8, action: "升级审批" },
  { level: "medium" as const, title: "邀请回复率下降 (>10pp)", count: 5, action: "优化话术" },
]

const aiSuggestions = [
  { icon: Globe, title: "推荐优先开发的人才市场", desc: "巴西风电人才市场近期增长 +42%，建议优先接入巴西圣保罗大学人才库", priority: "high" as const },
  { icon: Search, title: "推荐重点招聘岗位", desc: "海上风电高级工程师当前匹配度 >85% 的候选人仅 23 人，建议扩大搜索半径至全球", priority: "high" as const },
  { icon: BotMessageSquare, title: "推荐优化邀请话术", desc: "德语区候选人回复率低于均值 18pp，建议使用本地化话术模板", priority: "medium" as const },
  { icon: TrendingUp, title: "推荐提升转化率措施", desc: "已录取候选人中 67% 来自「内推+猎头」双通道，建议加大双通道投入", priority: "medium" as const },
]

function formatNum(n: number, wanLabel: string): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + wanLabel
  return n.toLocaleString()
}

export default function DashboardPage() {
  const { t, language } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS)
  const [dataSource, setDataSource] = useState<"db" | "mock">("mock")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/dashboard")
    }
  }, [authLoading, user, router])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/dashboard-stats")
      const json = await res.json()
      if (json.data) {
        setStats({ ...DEFAULT_STATS, ...json.data })
        setDataSource(json.source || "mock")
      }
    } catch (err: any) {
      setError(err.message)
      setStats(DEFAULT_STATS)
      setDataSource("mock")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const wanLabel = t('dashboard.wan')
  const dataSourceLabel = dataSource === "db" ? t('dashboard.dbRealtime') : t('dashboard.demoData')

  const coreMetrics = [
    { label: t('dashboard.totalCandidates'), value: formatNum(stats.totalCandidates, wanLabel), delta: "+12.3%", trend: "up" as const, sub: dataSourceLabel },
    { label: t('dashboard.newToday'), value: stats.newCandidatesToday.toLocaleString(), delta: "+8.1%", trend: "up" as const, sub: dataSourceLabel },
    { label: t('dashboard.verifiedCandidates'), value: formatNum(stats.verifiedCandidates, wanLabel), delta: "+5.7%", trend: "up" as const, sub: dataSourceLabel },
    { label: t('dashboard.totalCompanies'), value: formatNum(stats.totalCompanies, wanLabel), delta: "+3.2%", trend: "up" as const, sub: dataSourceLabel },
    { label: t('dashboard.activeHeadhunters'), value: formatNum(stats.activeHeadhunters, wanLabel), delta: "-2.1%", trend: "down" as const, sub: dataSourceLabel },
    { label: t('dashboard.activeJobs'), value: formatNum(stats.totalJobs, wanLabel), delta: "+18.6%", trend: "up" as const, sub: dataSourceLabel },
    { label: t('dashboard.invitationConversion'), value: stats.conversionRate + "%", delta: "+1.8pp", trend: "up" as const, sub: dataSourceLabel },
    { label: t('dashboard.offerConversion'), value: stats.offerConversionRate + "%", delta: "-0.5pp", trend: "down" as const, sub: dataSourceLabel },
  ]

  // Funnel gradient colors
  const funnelColors = [
    "from-sky-500 to-sky-400",
    "from-blue-500 to-blue-400",
    "from-indigo-500 to-indigo-400",
    "from-violet-500 to-violet-400",
    "from-purple-500 to-purple-400",
    "from-fuchsia-500 to-fuchsia-400",
    "from-emerald-500 to-emerald-400",
  ]

  return (
    <AppLayout>
      <div className="bg-deep-space p-4 md:p-6 space-y-6">

        {/* Page title */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{t('dashboard.ceoDashboard')}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {language === 'zh' ? '全球风能锂电人才搜索雷达 · 数据驾驶舱' : 'Global Wind & Lithium Talent Radar · Data Cockpit'}
              <span className={`ml-2 inline-flex items-center gap-1 text-xs ${dataSource === "db" ? "text-emerald-400" : "text-amber-400"}`}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
                {dataSourceLabel}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {error && (
              <button
                onClick={fetchStats}
                className="flex items-center gap-1 px-3 py-1.5 border border-red-500/30 bg-red-500/5 text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition"
              >
                <RefreshCw className="h-3 w-3" />
                {t('dashboard.reload')}
              </button>
            )}
          </div>
        </div>

        {/* Progress Stepper */}
        <ProgressStepper steps={FLOW_STEPS} currentStep="dashboard" />

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 text-sky-400 mx-auto animate-spin" />
              <p className="mt-3 text-sm text-slate-500">{t('dashboard.loading')}</p>
            </div>
          </div>
        )}

        {/* ============ 1. Core metrics ============ */}
        {!loading && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{t('dashboard.coreMetrics')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
              {coreMetrics.map((m) => (
                <MetricGlowCard
                  key={m.label}
                  label={m.label}
                  value={m.value}
                  delta={m.delta}
                  trend={m.trend}
                  sub={m.sub}
                  glowColor="blue"
                />
              ))}
            </div>
          </section>
        )}

        {/* ============ 2. World Heatmap + Funnel ============ */}
        {!loading && (
          <section className="grid lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Globe className="h-3.5 w-3.5" />
                {t('dashboard.globalTalentRadar')}
              </h2>
              <TechCard className="rounded-xl overflow-hidden" padding="sm">
                <div className="p-3">
                  <WorldHeatmap className="w-full" />
                </div>
                <div className="px-4 pb-3">
                  <div className="flex justify-center gap-6 text-[10px] text-slate-400 border-t border-[#1a2a44] pt-3">
                    <span><span className="inline-block w-2 h-2 rounded-full bg-sky-400 mr-1"></span>{language === 'zh' ? '热点越大 = 人才越多' : 'Larger = More Talent'}</span>
                    <span><span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1"></span>{language === 'zh' ? '连线 = 人才流动网络' : 'Lines = Flow Network'}</span>
                    <span><span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70 mr-1"></span>{language === 'zh' ? '白点 = 核心枢纽' : 'White = Core Hub'}</span>
                  </div>
                </div>
              </TechCard>
            </div>

            {/* Enhanced Recruitment Funnel */}
            <div className="lg:col-span-2">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" />
                {t('dashboard.recruitmentFunnel')}
              </h2>
              <TechCard className="rounded-xl h-full" padding="sm">
                <div className="space-y-3">
                  {funnelData.map((f, i) => {
                    const Icon = f.icon
                    const isLast = i === funnelData.length - 1
                    const dropRate = i > 0 ? `-${((1 - f.pct / funnelData[i - 1].pct) * 100).toFixed(1)}%` : ""
                    return (
                      <div key={f.stage} className="group">
                        <div className="flex justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <Icon className="h-3 w-3 text-slate-500 group-hover:text-sky-400 transition-colors" />
                            <span className="text-slate-400 group-hover:text-slate-300 transition-colors">{f.stage}</span>
                            {dropRate && (
                              <span className="text-[9px] text-red-400/60">{dropRate}</span>
                            )}
                          </div>
                          <span className="text-white font-medium tabular-nums">{f.count.toLocaleString()}</span>
                        </div>
                        <div className="h-3 rounded-full bg-[#060d1a] overflow-hidden relative">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${funnelColors[i]} transition-all duration-700 ease-out group-hover:brightness-125`}
                            style={{ width: `${Math.max(f.pct, 2)}%` }}
                          />
                          {/* Shine effect */}
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ width: `${Math.max(f.pct, 2)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-0.5">
                          <span className="text-[10px] text-slate-600">{f.pct}%</span>
                          {i === funnelData.length - 1 && (
                            <span className="text-[10px] text-emerald-400/70 font-medium">
                              {(f.count / funnelData[0].count * 100).toFixed(1)}% {language === 'zh' ? '终面率' : 'closing'}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TechCard>
            </div>
          </section>
        )}

        {/* ============ 3. Skill Radar + Activity Feed ============ */}
        {!loading && (
          <section className="grid lg:grid-cols-5 gap-6">
            {/* Skill Radar Chart */}
            <div className="lg:col-span-3">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Target className="h-3.5 w-3.5" />
                {t('dashboard.skillDistribution')}
              </h2>
              <TechCard className="rounded-xl" padding="sm">
                <h3 className="text-sm font-medium text-white mb-1">{t('dashboard.skillRadar')}</h3>
                <p className="text-[10px] text-slate-500 mb-2">
                  {language === 'zh' ? '基于 28,453 名候选人技能标签分析 — 数值 = 人才需求强度 (满分 100)' : 'Based on 28,453 candidate skill tags — Value = talent demand intensity (max 100)'}
                </p>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart cx="50%" cy="50%" outerRadius="78%" data={skillRadarData}>
                    <PolarGrid stroke="#1a2a44" strokeWidth={0.5} />
                    <PolarAngleAxis
                      dataKey="skill"
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      tickLine={false}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fontSize: 8, fill: "#475569" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Radar
                      name={language === 'zh' ? '人才需求' : 'Demand'}
                      dataKey="value"
                      stroke="#0ea5e9"
                      fill="#0ea5e9"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <Radar
                      name={language === 'zh' ? '平均供给' : 'Avg Supply'}
                      dataKey="fullMark"
                      stroke="#475569"
                      fill="transparent"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-500/40"></span>
                    {language === 'zh' ? '人才需求强度' : 'Demand Intensity'}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className="w-2.5 h-2.5 border border-dashed border-slate-500 rounded-sm"></span>
                    {language === 'zh' ? '满分参考线' : 'Max Reference'}
                  </div>
                </div>
              </TechCard>
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-2">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Activity className="h-3.5 w-3.5" />
                {t('dashboard.activityFeed')}
              </h2>
              <ActivityFeed activities={DEFAULT_ACTIVITIES} language={language} />
            </div>
          </section>
        )}

        {/* ============ 4. Trend Charts ============ */}
        {!loading && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{t('dashboard.trendCharts')}</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              <TechCard className="rounded-xl" padding="sm">
                <h3 className="text-sm font-medium text-white mb-3">{t('dashboard.globalTalentGrowth')}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                    <Tooltip contentStyle={{ background: "#0c1830", border: "#1a2a44", fontSize: 11, color: "#e2e8f0" }} />
                    <Area type="monotone" dataKey="total" stroke="#0ea5e9" fill="url(#gradTotal)" strokeWidth={2} name={language === 'zh' ? '总数' : 'Total'} />
                    <Area type="monotone" dataKey="wind" stroke="#6366f1" fill="transparent" strokeWidth={1.5} name={language === 'zh' ? '风能' : 'Wind'} />
                    <Area type="monotone" dataKey="lithium" stroke="#22c55e" fill="transparent" strokeWidth={1.5} name={language === 'zh' ? '锂电' : 'Lithium'} />
                  </AreaChart>
                </ResponsiveContainer>
              </TechCard>
              <TechCard className="rounded-xl" padding="sm">
                <h3 className="text-sm font-medium text-white mb-3">{t('dashboard.companyActivity')}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={trendData}>
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                    <Tooltip contentStyle={{ background: "#0c1830", border: "#1a2a44", fontSize: 11, color: "#e2e8f0" }} />
                    <Bar dataKey="companies" fill="#0ea5e9" radius={[4, 4, 0, 0]} name={language === 'zh' ? '入驻企业' : 'Companies'} />
                  </BarChart>
                </ResponsiveContainer>
              </TechCard>
            </div>
          </section>
        )}

        {/* ============ 5. Leaderboards ============ */}
        {!loading && (
          <>
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{t('dashboard.leaderboards')}</h2>
              <div className="grid lg:grid-cols-3 gap-6">
                <TechCard className="rounded-xl" padding="sm">
                  <h3 className="text-sm font-medium text-white mb-3">{t('dashboard.hotCountries')}</h3>
                  <div className="space-y-2">
                    {hotCountries.map((c) => (
                      <div key={c.country} className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                          c.rank <= 3 ? "bg-sky-500/20 text-sky-400" : "bg-slate-800 text-slate-500"
                        }`}>{c.rank}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white font-medium">{c.country}</span>
                            <Badge variant="outline" className="text-[9px] border-sky-500/30 text-sky-400">{c.tag}</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-slate-500">{c.candidates.toLocaleString()} {language === 'zh' ? '人' : ''}</span>
                            <span className="text-[10px] text-emerald-400">{c.growth}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TechCard>

                <TechCard className="rounded-xl" padding="sm">
                  <h3 className="text-sm font-medium text-white mb-3">{t('dashboard.hotSkills')}</h3>
                  <div className="space-y-2.5">
                    {hotSkills.map((s) => (
                      <div key={s.skill}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">{s.skill}</span>
                          <div className="flex items-center gap-1">
                            {s.trend === "up" ? <ArrowUpRight className="h-3 w-3 text-emerald-400" /> : s.trend === "flat" ? <Minus className="h-3 w-3 text-slate-500" /> : null}
                            <span className="text-slate-400">{s.demand}</span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#060d1a]">
                          <div className="h-full rounded-full bg-sky-500/70" style={{ width: `${s.demand}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </TechCard>

                <TechCard className="rounded-xl" padding="sm">
                  <h3 className="text-sm font-medium text-white mb-3">{t('dashboard.avgCandidateScore')}</h3>
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative">
                      <svg className="w-28 h-28" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="#1a2a44" strokeWidth="8" />
                        <circle
                          cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGrad)"
                          strokeWidth="8" strokeLinecap="round"
                          strokeDasharray={`${(stats.avgCandidateScore / 100) * 315} 315`}
                          transform="rotate(-90 60 60)"
                        />
                        <defs>
                          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-3xl font-bold text-white">{stats.avgCandidateScore}</span>
                          <span className="text-xs text-slate-500 block">/ 100</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      {dataSource === "db" ? t('dashboard.dbRealtime') : t('dashboard.aiRadarScore')}
                    </p>
                  </div>
                </TechCard>
              </div>
            </section>

            {/* ============ 6. Risk alerts ============ */}
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{t('dashboard.riskAlerts')}</h2>
              <div className="grid lg:grid-cols-2 gap-4">
                {riskItems.map((r) => (
                  <div key={r.title} className={`glass-card p-4 rounded-xl ${
                    r.level === "high" ? "border-[#f87171]/30 bg-[#f87171]/5" :
                    r.level === "medium" ? "border-[#fbbf24]/30 bg-[#fbbf24]/5" :
                    "glass"
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
                        r.level === "high" ? "text-red-400" : r.level === "medium" ? "text-amber-400" : "text-slate-500"
                      }`} />
                      <div className="flex-1">
                        <p className="text-xs text-white font-medium">{r.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="outline" className={`text-[9px] ${
                            r.level === "high" ? "border-red-500/30 text-red-400" : r.level === "medium" ? "border-amber-500/30 text-amber-400" : "border-slate-700 text-slate-500"
                          }`}>{r.level === "high" ? (language === 'zh' ? '高风险' : 'High') : r.level === "medium" ? (language === 'zh' ? '中风险' : 'Medium') : (language === 'zh' ? '低风险' : 'Low')}</Badge>
                          <span className="text-xs text-slate-400">{language === 'zh' ? `涉及 ${r.count} 条` : `${r.count} items`}</span>
                        </div>
                        <button className={`mt-2 text-[11px] font-medium transition ${
                          r.level === "high" ? "text-red-400 hover:text-red-300" : r.level === "medium" ? "text-amber-400 hover:text-amber-300" : "text-sky-400 hover:text-sky-300"
                        }`}>{r.action} →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ============ 7. AI Suggestions ============ */}
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{t('dashboard.aiInsights')}</h2>
              <AIInsightPanel insights={aiSuggestions.map(s => ({
                title: s.title,
                description: s.desc,
                priority: s.priority,
                action: language === 'zh' ? '查看分析' : 'View Analysis',
              }))} />
            </section>
          </>
        )}

        {/* Error fallback */}
        {error && (
          <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-center">
            <p className="text-sm text-red-400">{t('dashboard.loadError')}: {error}</p>
            <p className="text-xs text-slate-500 mt-1">{t('dashboard.fallbackDemo')}</p>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-[#1a2a44] pt-4 pb-8 text-center">
          <p className="text-[11px] text-slate-600">
            © 2026 {language === 'zh' ? '全球风能锂电人才搜索雷达' : 'Global Wind & Lithium Talent Radar'} · {dataSource === "db" ? (language === 'zh' ? '数据库驱动' : 'Database Driven') : (language === 'zh' ? '示例数据平台' : 'Demo Data Platform')}
          </p>
        </footer>
      </div>
    </AppLayout>
  )
}
