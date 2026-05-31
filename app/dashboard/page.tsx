"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users, Building2, TrendingUp, Calendar, FileCheck2, BarChart3,
  Globe, Zap, Battery, UserCheck, AlertTriangle, BotMessageSquare,
  ArrowUpRight, ArrowDownRight, Minus, Search, Bell, LogOut, RefreshCw, Database
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AppLayout } from "@/components/shared/app-sidebar"
import { DemoInitButton, DemoGuide } from "@/components/shared/demo-guide"
import { ProgressStepper, type Step } from "@/components/shared/progress-stepper"
import DemoFlowGuide from "@/components/demo/demo-flow-guide"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import type { DashboardStats } from "@/lib/services/data-service"
import { useLanguage } from "@/lib/i18n"
import { useAuth } from "@/lib/auth"

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

// Data labels (country names) — kept as data, not translated
const regionData = [
  { country: "中国", wind: 3420, lithium: 2890, storage: 1560, exec: 420 },
  { country: "美国", wind: 2870, lithium: 3210, storage: 1890, exec: 510 },
  { country: "德国", wind: 1980, lithium: 1560, storage: 1120, exec: 290 },
  { country: "丹麦", wind: 1650, lithium: 870, storage: 680, exec: 180 },
  { country: "日本", wind: 980, lithium: 2340, storage: 1340, exec: 310 },
]

// Data labels (funnel stages) — kept as data, not translated
const funnelData = [
  { stage: "搜索", count: 28453, pct: 100 },
  { stage: "已邀请", count: 18290, pct: 64.3 },
  { stage: "已回复", count: 8920, pct: 31.4 },
  { stage: "已面试", count: 4560, pct: 16.0 },
  { stage: "已评估", count: 2890, pct: 10.2 },
  { stage: "谈判中", count: 1240, pct: 4.4 },
  { stage: "已录取", count: 623, pct: 2.2 },
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

// i18n wrapper for formatNum — "万" unit is translated
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

  // Auth guard: redirect to login if not authenticated
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

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">

            {/* Page title */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white">{language === 'zh' ? 'CEO 操作仓' : 'CEO Dashboard'}</h1>
                <p className="mt-1 text-sm text-slate-500">
                  {language === 'zh' ? '全球风能锂电人才搜索雷达 · 数据驾驶舱' : 'Global Wind & Lithium Talent Radar · Data Cockpit'}
                  <span className={`ml-2 inline-flex items-center gap-1 text-xs ${dataSource === "db" ? "text-emerald-400" : "text-amber-400"}`}>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-current"></span>
                    {dataSourceLabel}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <DemoInitButton />
                {error && (
                  <button
                    onClick={fetchStats}
                    className="flex items-center gap-1 px-3 py-1.5 border border-red-500/30 bg-red-500/5 text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition"
                  >
                    <RefreshCw className="h-3 w-3" />
                    {language === 'zh' ? '重新加载' : 'Reload'}
                  </button>
                )}
              </div>
            </div>

            {/* Demo Guide */}
            <DemoGuide
              title={language === 'zh' ? '欢迎来到 CEO 操作仓！从这里开始完整的招聘演示流程' : 'Welcome to CEO Dashboard! Start the full recruitment demo here'}
              description={language === 'zh' ? '左侧导航栏包含完整的业务闭环：人才搜索 → 发起邀请 → 安排面试 → 查看评估 → 薪资谈判 → 发放Offer。每个页面都有流程进度指示和下一步按钮引导。' : 'The sidebar contains the full business loop: Talent Search → Send Invitations → Schedule Interviews → View Assessments → Salary Negotiation → Issue Offers. Each page has progress indicators and next-step buttons.'}
            />

            {/* Progress Stepper */}
            <ProgressStepper steps={FLOW_STEPS} currentStep="dashboard" />

            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 text-sky-400 mx-auto animate-spin" />
                  <p className="mt-3 text-sm text-slate-500">{language === 'zh' ? '正在加载数据...' : 'Loading data...'}</p>
                </div>
              </div>
            )}

            {/* 1. Core metrics */}
            {!loading && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{language === 'zh' ? '核心指标' : 'Core Metrics'}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
                  {coreMetrics.map((m) => (
                    <Card key={m.label} className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                      <p className="text-[11px] text-slate-500 mb-1 line-clamp-1">{m.label}</p>
                      <p className="text-xl font-bold text-white">{m.value}</p>
                      <div className="mt-1 flex items-center gap-1">
                        {m.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                        ) : m.trend === "down" ? (
                          <ArrowDownRight className="h-3 w-3 text-red-400" />
                        ) : (
                          <Minus className="h-3 w-3 text-slate-500" />
                        )}
                        <span className={`text-xs ${m.trend === "up" ? "text-emerald-400" : m.trend === "down" ? "text-red-400" : "text-slate-500"}`}>{m.delta}</span>
                      </div>
                      <Badge variant="outline" className={`mt-2 text-[9px] ${dataSource === "db" ? "border-emerald-500/30 text-emerald-400" : "border-slate-700 text-slate-500"}`}>
                        {m.sub}
                      </Badge>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* 2. Global talent radar + recruitment funnel */}
            {!loading && (
              <section className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{language === 'zh' ? '全球人才雷达' : 'Global Talent Radar'}</h2>
                  <Card className="border-[#1a2a44] bg-[#0c1830] rounded-xl overflow-hidden">
                    <div className="relative h-56 bg-[#060d1a] flex items-center justify-center">
                      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(14,165,233,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
                      <div className="relative z-10 text-center">
                        <Globe className="h-12 w-12 text-sky-500/40 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">{language === 'zh' ? '全球人才分布可视化' : 'Global Talent Distribution Visualization'}</p>
                        <div className="mt-3 flex justify-center gap-6 text-xs text-slate-400">
                          <span><span className="inline-block w-2 h-2 rounded-full bg-sky-400 mr-1"></span>{language === 'zh' ? '风能' : 'Wind'} 11,480</span>
                          <span><span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1"></span>{language === 'zh' ? '锂电' : 'Lithium'} 14,020</span>
                          <span><span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-1"></span>{language === 'zh' ? '储能' : 'Storage'} 7,430</span>
                          <span><span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1"></span>{language === 'zh' ? '高管' : 'Exec'} 1,640</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-xs font-semibold text-slate-400 mb-2">{language === 'zh' ? '国家/地区人才分布' : 'Country/Region Talent Distribution'}</h3>
                      <div className="space-y-2">
                        {regionData.map((r) => (
                          <div key={r.country} className="grid grid-cols-5 gap-2 text-xs">
                            <span className="text-slate-300 font-medium">{r.country}</span>
                            <span className="text-sky-400">{r.wind.toLocaleString()}</span>
                            <span className="text-emerald-400">{r.lithium.toLocaleString()}</span>
                            <span className="text-amber-400">{r.storage.toLocaleString()}</span>
                            <span className="text-purple-400">{r.exec.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Recruitment funnel */}
                <div className="lg:col-span-2">
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{language === 'zh' ? '招聘漏斗' : 'Recruitment Funnel'}</h2>
                  <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                    <div className="space-y-2.5">
                      {funnelData.map((f, i) => (
                        <div key={f.stage}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-400">{f.stage}</span>
                            <span className="text-white font-medium">{f.count.toLocaleString()}</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-[#060d1a] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                i === 0 ? "bg-sky-500/80" :
                                i === funnelData.length - 1 ? "bg-emerald-500/80" :
                                "bg-sky-400/60"
                              }`}
                              style={{ width: `${f.pct}%` }}
                            />
                          </div>
                          <div className="text-right text-[10px] text-slate-600">{f.pct}%</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </section>
            )}

            {/* Trend charts */}
            {!loading && (
              <section>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{language === 'zh' ? '趋势图表' : 'Trend Charts'}</h2>
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                    <h3 className="text-sm font-medium text-white mb-3">{language === 'zh' ? '全球人才增长趋势' : 'Global Talent Growth Trend'}</h3>
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
                  </Card>
                  <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                    <h3 className="text-sm font-medium text-white mb-3">{language === 'zh' ? '企业活跃趋势' : 'Company Activity Trend'}</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={trendData}>
                        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#64748b" }} />
                        <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                        <Tooltip contentStyle={{ background: "#0c1830", border: "#1a2a44", fontSize: 11, color: "#e2e8f0" }} />
                        <Bar dataKey="companies" fill="#0ea5e9" radius={[4, 4, 0, 0]} name={language === 'zh' ? '入驻企业' : 'Companies'} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>
              </section>
            )}

            {/* Leaderboards */}
            {!loading && (
              <>
                <section>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{language === 'zh' ? '热门榜单' : 'Leaderboards'}</h2>
                  <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-white mb-3">{language === 'zh' ? '热门国家/地区' : 'Top Countries/Regions'}</h3>
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
                    </Card>

                    <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-white mb-3">{language === 'zh' ? '热门技能' : 'Hot Skills'}</h3>
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
                    </Card>

                    <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-white mb-3">{language === 'zh' ? '平均候选人评分' : 'Avg Candidate Score'}</h3>
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="relative">
                          <svg className="w-28 h-28" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#1a2a44" strokeWidth="8" />
                            <circle
                              cx="60" cy="60" r="50" fill="none" stroke="#0ea5e9"
                              strokeWidth="8" strokeLinecap="round"
                              strokeDasharray={`${(stats.avgCandidateScore / 100) * 315} 315`}
                              transform="rotate(-90 60 60)"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-3xl font-bold text-white">{stats.avgCandidateScore}</span>
                              <span className="text-xs text-slate-500 block">/ 100</span>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">
                          {dataSource === "db" ? (language === 'zh' ? '数据库计算' : 'Database Calculated') : (language === 'zh' ? 'AI 雷达评分' : 'AI Radar Score')}
                        </p>
                      </div>
                    </Card>
                  </div>
                </section>

                {/* Risk alerts & AI suggestions */}
                <section>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{language === 'zh' ? '风险预警' : 'Risk Alerts'}</h2>
                  <div className="grid lg:grid-cols-2 gap-4">
                    {riskItems.map((r) => (
                      <Card key={r.title} className={`border p-4 rounded-xl ${
                        r.level === "high" ? "border-red-500/30 bg-red-500/5" :
                        r.level === "medium" ? "border-amber-500/30 bg-amber-500/5" :
                        "border-slate-700 bg-[#0c1830]"
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
                      </Card>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{language === 'zh' ? 'AI 决策建议' : 'AI Decision Suggestions'}</h2>
                  <div className="grid lg:grid-cols-2 gap-4">
                    {aiSuggestions.map((s) => (
                      <Card key={s.title} className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl hover:border-sky-500/30 transition">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            s.priority === "high" ? "bg-red-500/10 border border-red-500/20" : "bg-sky-500/10 border border-sky-500/20"
                          }`}>
                            <s.icon className={`h-4 w-4 ${s.priority === "high" ? "text-red-400" : "text-sky-400"}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-medium text-white">{s.title}</h3>
                              <Badge variant="outline" className={`text-[9px] ${
                                s.priority === "high" ? "border-red-500/30 text-red-400" : "border-amber-500/30 text-amber-400"
                              }`}>{s.priority === "high" ? (language === 'zh' ? '高优先级' : 'High') : (language === 'zh' ? '中优先级' : 'Medium')}</Badge>
                            </div>
                            <p className="mt-1 text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                            <button className="mt-2 text-[11px] text-sky-400 hover:text-sky-300 transition font-medium">{language === 'zh' ? '查看详细分析' : 'View Analysis'} →</button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              </>
            )}

            {error && (
              <div className="p-4 border border-red-500/20 bg-red-500/5 rounded-xl text-center">
                <p className="text-sm text-red-400">{language === 'zh' ? `数据加载失败: ${error}` : `Data load failed: ${error}`}</p>
                <p className="text-xs text-slate-500 mt-1">{language === 'zh' ? '已回退至示例数据。请确保数据库已初始化 (运行 npm run db:setup)' : 'Fallback to demo data. Ensure database is initialized (run npm run db:setup)'}</p>
              </div>
            )}

            <footer className="border-t border-[#1a2a44] pt-4 pb-8 text-center">
              <p className="text-[11px] text-slate-600">
                © 2026 {language === 'zh' ? '全球风能锂电人才搜索雷达' : 'Global Wind & Lithium Talent Radar'} · {dataSource === "db" ? (language === 'zh' ? '数据库驱动' : 'Database Driven') : (language === 'zh' ? '示例数据平台' : 'Demo Data Platform')}
              </p>
            </footer>
          </div>
    </AppLayout>
  )
}
