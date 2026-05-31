"use client"

import { useState, useEffect, useMemo } from "react"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n"
import {
  BarChart3, Users, TrendingUp, Search, Send, Calendar, ClipboardCheck,
  Handshake, FileText, CheckCircle2, AlertTriangle, FileWarning,
  Globe, Factory, DollarSign, TrendingDown, PieChart, ChevronDown,
  RefreshCw, ArrowUpRight, ArrowDownRight, Activity, ShieldCheck,
  Database, Clock, AlertOctagon, Eye, Info,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, FunnelChart, Funnel, LabelList, ReferenceLine,
} from "recharts"
import type {
  AnalyticsOverview, UserGrowthStats, GrowthDataPoint,
  CountryDistribution, IndustryDistribution,
  RecruitmentFunnel, FunnelStage, FunnelTrendPoint,
  RevenueBreakdown, RevenueDataPoint,
  DataQualityMetrics, DataQualityWarning, DataExpiryAlert,
  TimeRange,
} from "@/lib/analytics/types"

// ---- helpers ----
function formatCNY(cents: number): string {
  if (cents >= 100000000) return `¥${(cents / 100000000).toFixed(2)} 亿`
  if (cents >= 10000) return `¥${(cents / 10000).toFixed(1)} 万`
  return `¥${(cents / 100).toLocaleString("zh-CN")}`
}

function formatShort(num: number): string {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return String(num)
}

const TIME_RANGES: { key: TimeRange; label: string }[] = [
  { key: "7d", label: "近7天" },
  { key: "30d", label: "近30天" },
  { key: "90d", label: "近90天" },
  { key: "180d", label: "近180天" },
  { key: "365d", label: "近365天" },
  { key: "all", label: "全部" },
]

const COUNTRIES = [
  { key: "", label: "全部国家" },
  { key: "CN", label: "中国" },
  { key: "US", label: "美国" },
  { key: "DE", label: "德国" },
  { key: "DK", label: "丹麦" },
  { key: "JP", label: "日本" },
  { key: "KR", label: "韩国" },
  { key: "GB", label: "英国" },
  { key: "IN", label: "印度" },
]

const INDUSTRIES = [
  { key: "", label: "全部行业" },
  { key: "wind_energy", label: "风能" },
  { key: "lithium", label: "锂电池" },
  { key: "energy_storage", label: "储能系统" },
  { key: "wind_storage", label: "风储协同" },
  { key: "bms", label: "BMS/EMS" },
  { key: "power_electronics", label: "电力电子" },
]

const PIE_COLORS = ["#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#f43f5e"]

// ============================================================
// Custom Tooltip
// ============================================================
function CustomTooltip({ active, payload, label, valueFormatter }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-white/10 rounded-lg p-3 text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {valueFormatter ? valueFormatter(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

// ============================================================
// Section 1: 用户增长
// ============================================================
function UserGrowthSection({
  timeRange, setTimeRange, country, setCountry, industry, setIndustry, t,
}: {
  timeRange: TimeRange; setTimeRange: (v: TimeRange) => void
  country: string; setCountry: (v: string) => void
  industry: string; setIndustry: (v: string) => void
  t: (key: string) => string
}) {
  const [data, setData] = useState<UserGrowthStats | null>(null)
  const [countries, setCountries] = useState<CountryDistribution[]>([])
  const [industries, setIndustries] = useState<IndustryDistribution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/analytics/growth?timeRange=${timeRange}&country=${country}&industry=${industry}`).then(r => r.json()),
      fetch("/api/analytics/countries").then(r => r.json()),
      fetch("/api/analytics/industries").then(r => r.json()),
    ]).then(([g, c, i]) => {
      setData(g.data)
      setCountries(c.data || [])
      setIndustries(i.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [timeRange, country, industry])

  const chartData = useMemo(() => {
    if (!data?.trend) return []
    return data.trend.map((p: GrowthDataPoint) => ({
      date: p.date.slice(2), // "26-01"
      newUsers: p.newUsers,
      activeUsers: p.activeUsers,
      newCandidates: p.newCandidates,
      newCompanies: p.newCompanies,
    }))
  }, [data])

  if (loading || !data) return <div className="text-slate-500 text-sm py-8 text-center">加载中...</div>

  return (
    <div className="space-y-6">
      {/* 筛选器 */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1">
          {TIME_RANGES.map(r => (
            <button
              key={r.key}
              onClick={() => setTimeRange(r.key)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                timeRange === r.key
                  ? "bg-sky-500/20 border-sky-500/30 text-sky-400"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="bg-slate-800 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500/50"
        >
          {COUNTRIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <select
          value={industry}
          onChange={e => setIndustry(e.target.value)}
          className="bg-slate-800 border border-white/10 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500/50"
        >
          {INDUSTRIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
      </div>

      {/* 指标卡 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "新增用户", value: data.summary.totalNewUsers, icon: Users, color: "sky" },
          { label: "活跃用户", value: data.summary.totalActiveUsers, icon: Activity, color: "emerald" },
          { label: "新增候选人", value: data.summary.totalCandidates, icon: Eye, color: "purple" },
          { label: "新增企业", value: data.summary.totalCompanies, icon: Factory, color: "amber" },
          { label: "累计用户", value: data.summary.totalAccumulatedUsers, icon: TrendingUp, color: "pink" },
        ].map((c, i) => (
          <Card key={i} className="bg-[#0a1120] border-white/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-500 text-xs">{c.label}</span>
                <c.icon className={`w-4 h-4 text-${c.color}-400`} />
              </div>
              <p className="text-2xl font-bold text-white">{formatShort(c.value)}</p>
              {i === 0 && (
                <p className={`text-xs mt-1 ${data.summary.growthRate >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {data.summary.growthRate >= 0 ? "↑" : "↓"} {Math.abs(data.summary.growthRate)}%
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 增长趋势图 */}
      <Card className="bg-[#0a1120] border-white/5">
        <CardHeader>
          <CardTitle className="text-white text-base">用户增长趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip valueFormatter={(v: number) => formatShort(v)} />} />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
              <Area type="monotone" dataKey="newUsers" name="新增用户" stroke="#0ea5e9" fill="url(#grad1)" strokeWidth={2} />
              <Area type="monotone" dataKey="activeUsers" name="活跃用户" stroke="#8b5cf6" fill="url(#grad2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 国家/行业分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0a1120] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-400" /> 国家/地区分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {countries.slice(0, 8).map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-slate-500 text-xs w-12 truncate">{c.countryCode}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{c.country}</span>
                      <span className="text-slate-400">{c.userCount} ({c.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${c.percentage}%` }} />
                    </div>
                  </div>
                  <span className={`text-xs ${c.growthRate >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {c.growthRate >= 0 ? "+" : ""}{c.growthRate}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1120] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Factory className="w-4 h-4 text-amber-400" /> 行业分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {industries.map((ind, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{ind.industry}</span>
                      <span className="text-slate-400">{ind.userCount} ({ind.percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${ind.percentage}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    </div>
                  </div>
                  <span className={`text-xs ${ind.growthRate >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {ind.growthRate >= 0 ? "+" : ""}{ind.growthRate}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============================================================
// Section 2: 招聘转化
// ============================================================
function RecruitmentFunnelSection({
  timeRange, setTimeRange, t,
}: {
  timeRange: TimeRange; setTimeRange: (v: TimeRange) => void
  t: (key: string) => string
}) {
  const [funnel, setFunnel] = useState<RecruitmentFunnel | null>(null)
  const [trend, setTrend] = useState<FunnelTrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/analytics/funnel?timeRange=${timeRange}`).then(r => r.json()),
      fetch(`/api/analytics/funnel-trend?timeRange=${timeRange}`).then(r => r.json()),
    ]).then(([f, tr]) => {
      setFunnel(f.data)
      setTrend(tr.data || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [timeRange])

  const funnelChartData = useMemo(() => {
    if (!funnel?.stages) return []
    return funnel.stages.map(s => ({
      name: s.label,
      value: s.count,
      rate: s.rate,
    }))
  }, [funnel])

  const trendChartData = useMemo(() => {
    if (!trend.length) return []
    const dates = [...new Set(trend.map(p => p.date))]
    return dates.map(date => {
      const row: any = { date: date.slice(2) }
      const stages = ["search", "view", "invitation", "interview", "offer"]
      stages.forEach(stage => {
        const pt = trend.find(p => p.date === date && p.stage === stage)
        if (pt) row[stage] = pt.count
      })
      return row
    })
  }, [trend])

  if (loading) return <div className="text-slate-500 text-sm py-8 text-center">加载中...</div>
  if (!funnel) return null

  return (
    <div className="space-y-6">
      {/* 筛选器 */}
      <div className="flex gap-1">
        {TIME_RANGES.filter(r => r.key !== "7d").map(r => (
          <button
            key={r.key}
            onClick={() => setTimeRange(r.key)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
              timeRange === r.key
                ? "bg-sky-500/20 border-sky-500/30 text-sky-400"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* 顶部指标卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "总搜索次数", value: funnel.summary.totalSearches, color: "sky" },
          { label: "发出邀请", value: funnel.summary.totalInvitations, color: "purple" },
          { label: "安排面试", value: funnel.summary.totalInterviews, color: "emerald" },
          { label: "接受Offer", value: funnel.summary.totalOffers, color: "amber" },
        ].map((c, i) => (
          <Card key={i} className="bg-[#0a1120] border-white/5">
            <CardContent className="p-4">
              <span className="text-slate-500 text-xs">{c.label}</span>
              <p className={`text-2xl font-bold text-${c.color}-400 mt-1`}>{c.value.toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 转化漏斗 + 趋势 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 漏斗图用自定义条形图模拟 */}
        <Card className="bg-[#0a1120] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base">招聘转化漏斗</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {funnel.stages.map((s, i) => {
                const max = funnel.stages[0]?.count || 1
                const widthPct = (s.count / max) * 100
                const colors = ["sky", "blue", "violet", "emerald", "amber", "pink", "rose", "red"]
                const color = colors[i % colors.length]
                return (
                  <div key={i} className="flex items-center gap-3 py-2">
                    <div className="w-20 text-xs text-slate-400 text-right pr-2">{s.label}</div>
                    <div className="flex-1">
                      <div className="w-full bg-slate-800/50 rounded h-8 relative">
                        <div
                          className={`bg-${color}-500/30 border border-${color}-500/30 h-8 rounded flex items-center px-3`}
                          style={{ width: `${Math.max(widthPct, 2)}%` }}
                        >
                          <span className="text-xs text-white font-medium">{s.count.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-xs text-right">
                      <span className="text-emerald-400">{s.cumulativeRate}%</span>
                      {s.change !== 0 && (
                        <span className={`ml-1 ${s.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {s.change >= 0 ? "↑" : "↓"}{Math.abs(s.change)}%
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
              <div className="flex justify-between text-xs text-slate-500 mt-2 px-20">
                <span>阶段</span>
                <span>累计转化率 / 环比</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 趋势折线图 */}
        <Card className="bg-[#0a1120] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base">关键阶段趋势</CardTitle>
          </CardHeader>
          <CardContent>
            {trendChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip valueFormatter={(v: number) => v.toLocaleString()} />} />
                  <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
                  <Line type="monotone" dataKey="search" name="搜索" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="view" name="查看" stroke="#6366f1" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="invitation" name="邀请" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="interview" name="面试" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="offer" name="Offer" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-slate-500 text-sm py-8 text-center">暂无趋势数据</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 转化率明细表 */}
      <Card className="bg-[#0a1120] border-white/5">
        <CardHeader>
          <CardTitle className="text-white text-base">转化率明细</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-500 font-medium pb-3">阶段</th>
                  <th className="text-right text-slate-500 font-medium pb-3">数量</th>
                  <th className="text-right text-slate-500 font-medium pb-3">本阶段转化率</th>
                  <th className="text-right text-slate-500 font-medium pb-3">累计转化率</th>
                  <th className="text-right text-slate-500 font-medium pb-3">环比变化</th>
                </tr>
              </thead>
              <tbody>
                {funnel.stages.map((s, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="py-3 text-white">{s.label}</td>
                    <td className="py-3 text-right text-slate-300">{s.count.toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <span className={s.rate >= 50 ? "text-emerald-400" : s.rate >= 30 ? "text-amber-400" : "text-red-400"}>
                        {s.rate}%
                      </span>
                    </td>
                    <td className="py-3 text-right text-sky-400 font-medium">{s.cumulativeRate}%</td>
                    <td className={`py-3 text-right text-xs ${s.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {s.change >= 0 ? "↑" : "↓"}{Math.abs(s.change)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 bg-sky-500/5 border border-sky-500/10 rounded-lg">
            <p className="text-xs text-sky-400">
              平均招聘周期：<span className="font-bold">{funnel.summary.avgTimeToHire} 天</span>
              {"  |  整体转化率（Offer/搜索）："}
              <span className="font-bold text-emerald-400">{funnel.summary.overallConversionRate}%</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ============================================================
// Section 3: 商业收入
// ============================================================
function RevenueSection({
  timeRange, setTimeRange, t,
}: {
  timeRange: TimeRange; setTimeRange: (v: TimeRange) => void
  t: (key: string) => string
}) {
  const [data, setData] = useState<RevenueBreakdown | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/analytics/revenue?timeRange=${timeRange}`)
      .then(r => r.json())
      .then(res => { setData(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [timeRange])

  const stackedData = useMemo(() => {
    if (!data?.trend) return []
    return data.trend.map((p: RevenueDataPoint) => ({
      date: p.date.slice(2),
      "企业套餐": Math.round(p.enterprisePlan / 100),
      "订阅收入": Math.round(p.subscription / 100),
      "服务费": Math.round(p.serviceFees / 100),
      "猎头会员": Math.round(p.headhunter / 100),
      "AI报告": Math.round(p.aiReports / 100),
      "API服务": Math.round(p.apiService / 100),
    }))
  }, [data])

  if (loading) return <div className="text-slate-500 text-sm py-8 text-center">加载中...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      {/* 筛选器 */}
      <div className="flex gap-1">
        {TIME_RANGES.filter(r => r.key !== "7d" && r.key !== "30d").map(r => (
          <button
            key={r.key}
            onClick={() => setTimeRange(r.key)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
              timeRange === r.key
                ? "bg-sky-500/20 border-sky-500/30 text-sky-400"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* 收入指标卡 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: "总收入", value: data.summary.totalRevenue, color: "sky", isMain: true },
          { label: "企业套餐", value: data.summary.enterprisePlanRevenue, color: "blue" },
          { label: "订阅收入", value: data.summary.subscriptionRevenue, color: "violet" },
          { label: "服务费", value: data.summary.serviceFeesRevenue, color: "emerald" },
          { label: "ARPU", value: data.summary.arpu, color: "amber", isArpu: true },
        ].map((c, i) => (
          <Card key={i} className={`bg-[#0a1120] border-white/5 ${c.isMain ? "ring-1 ring-sky-500/20" : ""}`}>
            <CardContent className="p-4">
              <span className="text-slate-500 text-xs">{c.label}</span>
              <p className={`text-2xl font-bold mt-1 ${c.isArpu ? "text-amber-400" : "text-white"}`}>
                {c.isArpu ? `¥${c.value}` : formatCNY(c.value)}
              </p>
              {i === 0 && (
                <p className={`text-xs mt-1 ${data.summary.growthRate >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {data.summary.growthRate >= 0 ? "↑" : "↓"} {Math.abs(data.summary.growthRate)}%
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 收入趋势（堆叠面积图） */}
      <Card className="bg-[#0a1120] border-white/5">
        <CardHeader>
          <CardTitle className="text-white text-base">收入趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={stackedData}>
              <defs>
                {["#0ea5e9", "#6366f1", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"].map((c, i) => (
                  <linearGradient key={c} id={`revGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}万`} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
              <Area type="monotone" dataKey="企业套餐" stackId="1" stroke="#0ea5e9" fill="url(#revGrad0)" strokeWidth={1} />
              <Area type="monotone" dataKey="订阅收入" stackId="1" stroke="#6366f1" fill="url(#revGrad1)" strokeWidth={1} />
              <Area type="monotone" dataKey="服务费" stackId="1" stroke="#10b981" fill="url(#revGrad2)" strokeWidth={1} />
              <Area type="monotone" dataKey="猎头会员" stackId="1" stroke="#f59e0b" fill="url(#revGrad3)" strokeWidth={1} />
              <Area type="monotone" dataKey="AI报告" stackId="1" stroke="#ec4899" fill="url(#revGrad4)" strokeWidth={1} />
              <Area type="monotone" dataKey="API服务" stackId="1" stroke="#8b5cf6" fill="url(#revGrad5)" strokeWidth={1} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 收入构成饼图 + 明细表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0a1120] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base">收入构成</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RePieChart>
                <Pie
                  data={data.categoryDistribution}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={90}
                  dataKey="amount" nameKey="label"
                >
                  {data.categoryDistribution.map((_: any, i: number) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCNY(v)} />
                <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1120] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base">收入明细</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.categoryDistribution.map((cat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">{cat.label}</span>
                      <span className="text-white font-medium">{formatCNY(cat.amount)}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{cat.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============================================================
// Section 4: 数据质量
// ============================================================
function DataQualitySection({
  t, language,
}: {
  t: (key: string) => string
  language: string
}) {
  const [data, setData] = useState<DataQualityMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch("/api/analytics/data-quality")
      .then(r => r.json())
      .then(res => { setData(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-slate-500 text-sm py-8 text-center">加载中...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      {/* 质量指标卡 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "已认证比例", value: `${data.overview.verifiedRate}%`, color: "emerald" },
          { label: "高可信度", value: `${data.overview.highCredibilityCount}人`, color: "sky" },
          { label: "数据完整度", value: `${data.overview.avgCompleteness}%`, color: "purple" },
          { label: "预警数量", value: `${data.overview.expiredCount}`, color: "amber", isWarning: true },
        ].map((c, i) => (
          <Card key={i} className="bg-[#0a1120] border-white/5">
            <CardContent className="p-4">
              <span className="text-slate-500 text-xs">{c.label}</span>
              <p className={`text-2xl font-bold mt-1 ${c.isWarning ? "text-amber-400" : `text-${c.color}-400`}`}>{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 可信度分布 + 授权状态 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#0a1120] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" /> 数据可信度分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.credibilityDistribution.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{d.label}</span>
                    <span className="text-slate-400">{d.count}人 ({d.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        i === 0 ? "bg-emerald-500" : i === 1 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1120] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> 授权状态分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.authorizationStatus.map((d, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{d.label}</span>
                    <span className="text-slate-400">{d.count}人 ({d.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        i === 0 ? "bg-emerald-500" : i === 1 ? "bg-sky-500" : i === 2 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 数据来源可信度 */}
      <Card className="bg-[#0a1120] border-white/5">
        <CardHeader>
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" /> 数据来源可信度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-slate-500 font-medium pb-3">数据来源</th>
                  <th className="text-right text-slate-500 font-medium pb-3">候选人数量</th>
                  <th className="text-right text-slate-500 font-medium pb-3">可信度评分</th>
                  <th className="text-right text-slate-500 font-medium pb-3">认证比例</th>
                  <th className="text-right text-slate-500 font-medium pb-3">质量评级</th>
                </tr>
              </thead>
              <tbody>
                {data.dataSources.map((src, i) => {
                  let rating = "优秀"
                  let ratingColor = "text-emerald-400"
                  if (src.trustScore < 60) { rating = "较差"; ratingColor = "text-red-400" }
                  else if (src.trustScore < 75) { rating = "一般"; ratingColor = "text-amber-400" }
                  else if (src.trustScore < 85) { rating = "良好"; ratingColor = "text-sky-400" }
                  return (
                    <tr key={i} className="border-b border-white/5 last:border-0">
                      <td className="py-3 text-white">{src.label}</td>
                      <td className="py-3 text-right text-slate-300">{src.count}</td>
                      <td className="py-3 text-right">
                        <span className={src.trustScore >= 80 ? "text-emerald-400" : src.trustScore >= 60 ? "text-amber-400" : "text-red-400"}>
                          {src.trustScore}分
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-300">{src.verifiedRate}%</td>
                      <td className={`py-3 text-right text-xs font-medium ${ratingColor}`}>{rating}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 数据预警 + 过期提醒 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 预警列表 */}
        <Card className="bg-[#0a1120] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              数据质量预警
              <Badge className="ml-2 text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20">
                {data.warnings.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.warnings.map((w: DataQualityWarning) => {
                const severityColor = w.severity === "critical" ? "border-red-500/30 bg-red-500/5" : w.severity === "warning" ? "border-amber-500/30 bg-amber-500/5" : "border-sky-500/30 bg-sky-500/5"
                const severityLabel = w.severity === "critical" ? "严重" : w.severity === "warning" ? "警告" : "提示"
                const severityTextColor = w.severity === "critical" ? "text-red-400" : w.severity === "warning" ? "text-amber-400" : "text-sky-400"
                return (
                  <div key={w.id} className={`p-3 rounded-lg border ${severityColor}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-white font-medium">{language === "zh" ? w.title : w.title}</p>
                      <Badge className={`text-[10px] border ${severityColor} ${severityTextColor}`}>{severityLabel}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{w.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-500">影响 {w.affectedCount} 条数据</span>
                      <Button size="sm" variant="ghost" className="text-[10px] h-6 text-sky-400 hover:text-sky-300">
                        {w.suggestedAction}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 过期提醒 */}
        <Card className="bg-[#0a1120] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-400" />
              数据过期提醒
              <Badge className="ml-2 text-[10px] bg-red-500/10 text-red-400 border-red-500/20">
                {data.expiryAlerts.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.expiryAlerts
                .sort((a: DataExpiryAlert, b: DataExpiryAlert) => a.daysUntilExpiry - b.daysUntilExpiry)
                .map((alert: DataExpiryAlert) => {
                  const isCritical = alert.daysUntilExpiry <= 7
                  const isWarning = alert.daysUntilExpiry <= 30
                  return (
                    <div key={alert.id} className={`p-3 rounded-lg border ${
                      isCritical ? "border-red-500/30 bg-red-500/5" : isWarning ? "border-amber-500/30 bg-amber-500/5" : "border-white/5 bg-white/5"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-white">{alert.candidateName}</p>
                          <p className="text-xs text-slate-500 mt-0.5">过期字段：{alert.field}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`text-[10px] ${
                            isCritical ? "bg-red-500/10 text-red-400 border-red-500/20" : isWarning ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                          }`}>
                            {alert.daysUntilExpiry <= 0 ? "已过期" : `${alert.daysUntilExpiry}天后过期`}
                          </Badge>
                          <p className="text-[10px] text-slate-500 mt-1">{alert.expiresAt}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ============================================================
// Main Page
// ============================================================
export default function AdminAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"growth" | "funnel" | "revenue" | "quality">("growth")
  const [timeRange, setTimeRange] = useState<TimeRange>("90d")
  const [country, setCountry] = useState("")
  const [industry, setIndustry] = useState("")
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [loading, setLoading] = useState(true)

  const { t, language } = useLanguage()

  useEffect(() => {
    setLoading(true)
    fetch(`/api/analytics/overview?timeRange=${timeRange}`)
      .then(r => r.json())
      .then(res => { setOverview(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [timeRange])

  const tabs = [
    { key: "growth" as const, label: "用户增长", icon: Users },
    { key: "funnel" as const, label: "招聘转化", icon: Send },
    { key: "revenue" as const, label: "商业收入", icon: DollarSign },
    { key: "quality" as const, label: "数据质量", icon: ShieldCheck },
  ]

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-7 h-7 text-sky-400" />
              运营数据分析
            </h1>
            <p className="text-slate-500 text-sm mt-1">平台增长、招聘转化和商业收入情况 — 所有数据均为示例数据</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/20">
              ⚠️ 示例数据
            </Badge>
            <Button variant="ghost" size="sm" className="text-xs text-slate-400" onClick={() => window.location.reload()}>
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> 刷新
            </Button>
          </div>
        </div>

        {/* 总览指标卡 */}
        {overview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "累计用户", value: overview.userGrowth.totalUsers, sub: `+${overview.userGrowth.newUsersThisMonth} 本月`, color: "sky" },
              { label: "活跃用户", value: overview.userGrowth.activeUsersThisMonth, sub: `增长率 ${overview.userGrowth.growthRate}%`, color: "emerald" },
              { label: "候选人", value: overview.recruitment.totalCandidates, sub: `${overview.recruitment.offersThisMonth} 个 Offer 本月`, color: "purple" },
              { label: "月收入", value: formatCNY(overview.revenue.monthlyRevenue), sub: `ARPU ¥${overview.revenue.arpu}`, color: "amber" },
            ].map((c, i) => (
              <Card key={i} className="bg-[#0a1120] border-white/5">
                <CardContent className="p-4">
                  <span className="text-slate-500 text-xs">{c.label}</span>
                  <p className={`text-xl font-bold text-${c.color}-400 mt-1`}>{typeof c.value === "string" ? c.value : c.value.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{c.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tab 切换 */}
        <div className="flex gap-1 border-b border-white/5 pb-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "border-sky-500 text-sky-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 内容 */}
        <div className="min-h-[500px]">
          {activeTab === "growth" && (
            <UserGrowthSection
              timeRange={timeRange} setTimeRange={setTimeRange}
              country={country} setCountry={setCountry}
              industry={industry} setIndustry={setIndustry}
              t={t}
            />
          )}
          {activeTab === "funnel" && (
            <RecruitmentFunnelSection timeRange={timeRange} setTimeRange={setTimeRange} t={t} />
          )}
          {activeTab === "revenue" && (
            <RevenueSection timeRange={timeRange} setTimeRange={setTimeRange} t={t} />
          )}
          {activeTab === "quality" && (
            <DataQualitySection t={t} language={language} />
          )}
        </div>

        {/* 示例数据提示 */}
        <div className="mt-6 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">运营数据分析演示说明</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-1 ml-6 list-disc">
            <li>顶部总览卡片展示核心指标（用户数、活跃度、收入）</li>
            <li>切换「用户增长 / 招聘转化 / 商业收入 / 数据质量」Tab 查看不同维度</li>
            <li>用户增长支持时间范围 + 国家 + 行业三级筛选</li>
            <li>招聘转化展示完整漏斗 + 各阶段趋势折线图</li>
            <li>商业收入展示堆叠趋势图 + 收入构成饼图</li>
            <li>数据质量展示可信度分布 + 预警 + 过期提醒</li>
            <li>所有数据均为 Mock 示例，不接入真实埋点服务</li>
          </ul>
          <p className="text-xs text-slate-500 mt-2">后续可接入 Google Analytics 4 / Mixpanel / Amplitude 等分析工具，当前预留了数据结构接口。</p>
        </div>
      </div>
    </AppLayout>
  )
}
