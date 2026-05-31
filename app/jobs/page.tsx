"use client"

import { useEffect, useState } from "react"
import {
  Briefcase, MapPin, Building2, RefreshCw, AlertCircle, Zap, Database,
  BarChart3, Users, Search, TrendingUp, Calendar, FileCheck2,
  Bell, LogOut, DollarSign, Clock, Filter
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { JobRecord } from "@/lib/services/data-service"

const NAV_ITEMS = [
  { icon: BarChart3, label: "CEO 操作仓", href: "/dashboard" },
  { icon: Search, label: "人才搜索", href: "/candidates" },
  { icon: Building2, label: "企业管理", href: "/companies" },
  { icon: Briefcase, label: "职位管理", href: "/jobs", active: true },
]

function formatSalary(min: number | null | undefined, max: number | null | undefined, currency: string): string {
  if (!min && !max) return "薪资面议"
  const curr = currency === "CNY" ? "¥" : currency
  const fmt = (v: number) => {
    if (v >= 10000) return (v / 10000).toFixed(0) + "万"
    return v.toLocaleString()
  }
  if (min && max) return `${curr}${fmt(min)}-${fmt(max)}`
  if (min) return `${curr}${fmt(min)}起`
  return `${curr}${fmt(max!)}以内`
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"db" | "mock">("mock")

  const fetchJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/jobs?status=open&pageSize=50")
      const json = await res.json()
      if (json.data && json.data.length > 0) {
        setJobs(json.data)
        setDataSource(json.source || "mock")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  return (
    <main className="min-h-screen bg-[#060d1a] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-[#1a2a44] bg-[#060d1a]/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/30">
              <Zap className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-base font-bold text-white">全球风能锂电人才搜索雷达</span>
            <Badge variant="outline" className="ml-2 border-sky-500/30 text-sky-400 text-xs">职位管理</Badge>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white"><Bell className="h-4 w-4" /></button>
            <button className="text-slate-500 hover:text-red-400"><LogOut className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden lg:flex w-56 flex-col border-r border-[#1a2a44] bg-[#0a1120] min-h-[calc(100vh-3.5rem)] py-4 px-3">
          <nav className="flex-1 space-y-1">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                item.active ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}>
                <item.icon className="h-4 w-4 shrink-0" />{item.label}
              </a>
            ))}
          </nav>
          <div className="border-t border-[#1a2a44] pt-3 mt-3">
            <div className="flex items-center gap-1 px-3">
              <Database className={`h-3 w-3 ${dataSource === "db" ? "text-emerald-400" : "text-amber-400"}`} />
              <span className={`text-[10px] font-medium ${dataSource === "db" ? "text-emerald-400" : "text-amber-400"}`}>
                {dataSource === "db" ? "● 数据库" : "● 示例数据"}
              </span>
            </div>
          </div>
        </aside>

        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">职位管理</h1>
              <p className="text-sm text-slate-500 mt-1">
                共 {jobs.length} 个开放职位
                <span className={`ml-2 text-xs ${dataSource === "db" ? "text-emerald-400" : "text-amber-400"}`}>
                  ● {dataSource === "db" ? "数据库" : "示例数据"}
                </span>
              </p>
            </div>
            {error && (
              <button onClick={fetchJobs} className="flex items-center gap-1 px-3 py-1.5 border border-red-500/30 bg-red-500/5 text-red-400 text-xs rounded-lg">
                <RefreshCw className="h-3 w-3" />重新加载
              </button>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 text-sky-400 animate-spin" />
            </div>
          )}

          {error && !loading && (
            <div className="p-4 mb-4 border border-red-500/20 bg-red-500/5 rounded-xl text-center">
              <AlertCircle className="h-4 w-4 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-red-400">数据加载失败</p>
              <button onClick={fetchJobs} className="mt-2 text-xs text-sky-400 hover:text-sky-300">重试</button>
            </div>
          )}

          {!loading && jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Briefcase className="h-12 w-12 text-slate-600 mb-4" />
              <p className="text-slate-400">暂无开放职位</p>
            </div>
          )}

          {!loading && jobs.length > 0 && (
            <div className="space-y-3">
              {jobs.map((j) => (
                <Card key={j.id} className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl hover:border-sky-500/30 transition group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-medium group-hover:text-sky-400 transition">{j.title}</h3>
                        <Badge variant="outline" className={`text-[9px] ${
                          j.status === "open" ? "border-emerald-500/30 text-emerald-400" : "border-slate-700 text-slate-500"
                        }`}>{j.status === "open" ? "招聘中" : j.status}</Badge>
                        {j.industry === "wind" && <Badge variant="outline" className="text-[9px] border-sky-500/30 text-sky-400">风能</Badge>}
                        {j.industry === "lithium" && <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400">锂电</Badge>}
                      </div>
                      {j.description && <p className="text-slate-500 text-xs mt-1 line-clamp-1">{j.description}</p>}
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{j.companyName || "未知企业"}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{j.location || j.country || "不限"}</span>
                        <span className="flex items-center gap-1 text-emerald-400"><DollarSign className="h-3 w-3" />{formatSalary(j.salaryMin, j.salaryMax, j.salaryCurrency)}</span>
                      </div>
                      {j.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {j.requirements.map((r: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-[9px] border-slate-700 text-slate-500">{r}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <footer className="border-t border-[#1a2a44] pt-4 mt-8 text-center">
            <p className="text-[11px] text-slate-600">© 2026 全球风能锂电人才搜索雷达 · {dataSource === "db" ? "数据库驱动" : "示例数据平台"}</p>
          </footer>
        </div>
      </div>
    </main>
  )
}
