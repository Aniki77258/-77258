"use client"

import { useState, useEffect } from "react"
import {
  Search, RefreshCw, Zap, Database, FileText, Clock, Trash2,
  BarChart3, Users, Building2, TrendingUp, Calendar, FileCheck2,
  Bell, LogOut, ChevronRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ComplianceNotice } from "@/components/shared/compliance-notice"

interface SearchRecord {
  id: string
  keyword: string
  filters: string
  results: number
  createdAt: string
}

const MOCK_SEARCHES: SearchRecord[] = [
  { id: "1", keyword: "风机载荷仿真 + 海外经验", filters: "industry:wind, country:美国", results: 47, createdAt: "2026-05-28 14:30" },
  { id: "2", keyword: "固态电池 + 博士", filters: "industry:lithium, experienceYears:8+", results: 23, createdAt: "2026-05-27 09:15" },
  { id: "3", keyword: "海上风电基础设计", filters: "industry:wind, country:德国", results: 18, createdAt: "2026-05-25 16:45" },
  { id: "4", keyword: "BMS架构师 + 日语", filters: "industry:lithium, country:日本", results: 12, createdAt: "2026-05-24 11:00" },
  { id: "5", keyword: "储能系统集成 总监", filters: "industry:lithium, experienceYears:10+", results: 31, createdAt: "2026-05-22 08:30" },
]

export default function SearchesPage() {
  const [searches, setSearches] = useState(MOCK_SEARCHES)
  const [loading] = useState(false)

  return (
    <main className="min-h-screen bg-[#060d1a] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-[#1a2a44] bg-[#060d1a]/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/30">
              <Zap className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-base font-bold text-white">全球风能锂电人才搜索雷达</span>
            <Badge variant="outline" className="ml-2 border-sky-500/30 text-sky-400 text-xs">搜索记录</Badge>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white"><Bell className="h-4 w-4" /></button>
            <button className="text-slate-500 hover:text-red-400"><LogOut className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">搜索记录</h1>
            <p className="text-sm text-slate-500 mt-1">最近的人才搜索记录</p>
          </div>
        </div>

        {/* Compliance Notice */}
        <div className="mb-4">
          <ComplianceNotice compact />
        </div>

        {searches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-12 w-12 text-slate-600 mb-4" />
            <p className="text-slate-400">暂无搜索记录</p>
          </div>
        ) : (
          <div className="space-y-2">
            {searches.map((s) => (
              <Card key={s.id} className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl hover:border-sky-500/30 transition">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-sky-500/10 flex items-center justify-center">
                    <Search className="h-3.5 w-3.5 text-sky-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{s.keyword}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1"><FileText className="h-3 w-3" />{s.filters}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" />{s.createdAt}</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-sky-500/30 text-sky-400 text-xs">{s.results} 结果</Badge>
                  <button className="p-1 text-slate-600 hover:text-red-400 transition">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <footer className="border-t border-[#1a2a44] pt-4 mt-8 text-center">
          <p className="text-[11px] text-slate-600">© 2026 全球风能锂电人才搜索雷达</p>
        </footer>
      </div>
    </main>
  )
}
