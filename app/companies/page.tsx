"use client"

import { useEffect, useState } from "react"
import {
  Building2, Globe, MapPin, ExternalLink, RefreshCw, AlertCircle,
  BarChart3, Users, Search, TrendingUp, Calendar, FileCheck2,
  Bell, LogOut, Zap, Database, Shield, Battery
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { CompanyRecord } from "@/lib/services/data-service"

const NAV_ITEMS = [
  { icon: BarChart3, label: "CEO 操作仓", href: "/dashboard" },
  { icon: Search, label: "人才搜索", href: "/candidates" },
  { icon: Building2, label: "企业管理", href: "/companies", active: true },
  { icon: Search, label: "职位管理", href: "/jobs" },
]

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"db" | "mock">("mock")

  const fetchCompanies = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/companies?pageSize=50")
      const json = await res.json()
      if (json.data && json.data.length > 0) {
        setCompanies(json.data)
        setDataSource(json.source || "mock")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCompanies() }, [])

  return (
    <main className="min-h-screen bg-[#060d1a] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-[#1a2a44] bg-[#060d1a]/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/30">
              <Zap className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-base font-bold text-white">全球风能锂电人才搜索雷达</span>
            <Badge variant="outline" className="ml-2 border-sky-500/30 text-sky-400 text-xs">企业管理</Badge>
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
              <h1 className="text-2xl font-bold text-white">企业管理</h1>
              <p className="text-sm text-slate-500 mt-1">
                共 {companies.length} 家企业
                <span className={`ml-2 text-xs ${dataSource === "db" ? "text-emerald-400" : "text-amber-400"}`}>
                  ● {dataSource === "db" ? "数据库" : "示例数据"}
                </span>
              </p>
            </div>
            {error && (
              <button onClick={fetchCompanies} className="flex items-center gap-1 px-3 py-1.5 border border-red-500/30 bg-red-500/5 text-red-400 text-xs rounded-lg">
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
              <button onClick={fetchCompanies} className="mt-2 text-xs text-sky-400 hover:text-sky-300">重试</button>
            </div>
          )}

          {!loading && companies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Building2 className="h-12 w-12 text-slate-600 mb-4" />
              <p className="text-slate-400">暂无企业数据</p>
            </div>
          )}

          {!loading && companies.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map((c) => (
                <Card key={c.id} className="border-[#1a2a44] bg-[#0c1830] p-5 rounded-xl hover:border-sky-500/30 transition group">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-sky-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-medium truncate group-hover:text-sky-400 transition">{c.name}</h3>
                        {c.verified && <Shield className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {c.industry === "wind" && <Badge variant="outline" className="text-[9px] border-sky-500/30 text-sky-400">风能</Badge>}
                        {c.industry === "lithium" && <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400">锂电</Badge>}
                        <Badge variant="outline" className="text-[9px] border-slate-700 text-slate-500">{c.size || "未知规模"}</Badge>
                      </div>
                    </div>
                  </div>
                  {c.description && (
                    <p className="text-slate-500 text-xs line-clamp-2 mb-3">{c.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.country} {c.city}</span>
                    {c.website && (
                      <a href={c.website} target="_blank" className="flex items-center gap-1 text-sky-400 hover:text-sky-300 ml-auto">
                        网站 <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
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
