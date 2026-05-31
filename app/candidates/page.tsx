"use client"

import { useEffect, useState } from "react"
import {
  Search, Globe, Zap, Battery, Filter, ChevronRight,
  Star, MapPin, Clock, ExternalLink, RefreshCw, AlertCircle,
  Users, Building2, TrendingUp, Calendar, FileCheck2, BarChart3,
  Bell, LogOut, Database
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ComplianceNotice } from "@/components/shared/compliance-notice"
import type { CandidateRecord } from "@/lib/services/data-service"

const NAV_ITEMS = [
  { icon: BarChart3, label: "CEO 操作仓", href: "/dashboard" },
  { icon: Search, label: "人才搜索", href: "/candidates", active: true },
  { icon: Users, label: "候选人管理", href: "/candidates" },
  { icon: Calendar, label: "人才邀请", href: "/invitations" },
  { icon: Calendar, label: "人才面试", href: "/interviews" },
  { icon: FileCheck2, label: "人才评估", href: "/assessments" },
  { icon: TrendingUp, label: "人才谈判", href: "/negotiations" },
  { icon: FileCheck2, label: "人才录取", href: "/offers" },
  { icon: Building2, label: "企业管理", href: "/companies" },
  { icon: Search, label: "职位管理", href: "/jobs" },
  { icon: Users, label: "系统设置", href: "/settings" },
]

const MOCK_CANDIDATES: CandidateRecord[] = [
  {
    id: "mock_001", name: "李晓风", email: "l***@mit.edu",
    title: "风机载荷仿真专家", summary: "MIT 博士，10+年风机载荷仿真经验",
    country: "美国", city: "波士顿", industry: "wind", experienceYears: 12,
    currentCompany: "GE Renewable Energy", currentPosition: "Senior Principal Engineer",
    education: [], skills: ["风机载荷仿真", "CFD计算", "海上风电", "Python"],
    languages: [], certificates: [], publications: [], patents: [],
    githubUrl: "https://github.com/lixf-wind", linkedinUrl: "https://linkedin.com/in/lixf-wind",
    scholarUrl: null, availability: "1month", expectedSalary: "$180K-$220K",
    willingRelocate: true, verified: true, score: 96, rank: 1, source: "openalex",
    createdAt: "", updatedAt: "",
  },
  {
    id: "mock_002", name: "张伟", email: "z***@tsinghua.edu.cn",
    title: "固态电池电解质研发负责人", summary: "清华大学博士，8年固态电池研发经验",
    country: "中国", city: "北京", industry: "lithium", experienceYears: 8,
    currentCompany: "宁德时代", currentPosition: "高级研发经理",
    education: [], skills: ["固态电解质", "锂电池", "BMS算法"],
    languages: [], certificates: [], publications: [], patents: [],
    githubUrl: null, linkedinUrl: "https://linkedin.com/in/zhangwei-battery",
    scholarUrl: null, availability: "3months", expectedSalary: "¥800K-¥1.2M",
    willingRelocate: false, verified: true, score: 92, rank: 3, source: "manual",
    createdAt: "", updatedAt: "",
  },
  {
    id: "mock_003", name: "M. Schmidt", email: "s***@tum.de",
    title: "海上风电基础设计专家", summary: "TUM博士，15年海上风电基础设计经验",
    country: "德国", city: "慕尼黑", industry: "wind", experienceYears: 15,
    currentCompany: "Siemens Gamesa", currentPosition: "Chief Engineer",
    education: [], skills: ["海上风电基础", "漂浮式", "ABAQUS"],
    languages: [], certificates: [], publications: [], patents: [],
    githubUrl: "https://github.com/mschmidt-offshore", linkedinUrl: null,
    scholarUrl: null, availability: "immediate", expectedSalary: "€150K-€180K",
    willingRelocate: true, verified: true, score: 94, rank: 2, source: "openalex",
    createdAt: "", updatedAt: "",
  },
  {
    id: "mock_004", name: "田中一郎", email: "t***@kyoto-u.ac.jp",
    title: "BMS 电池管理系统首席架构师", summary: "京都大学博士，12年BMS研发经验",
    country: "日本", city: "京都", industry: "lithium", experienceYears: 12,
    currentCompany: "Panasonic", currentPosition: "BMS Chief Architect",
    education: [], skills: ["BMS架构", "嵌入式C", "ISO26262"],
    languages: [], certificates: [], publications: [], patents: [],
    githubUrl: null, linkedinUrl: "https://linkedin.com/in/tanaka-bms",
    scholarUrl: null, availability: "1month", expectedSalary: "¥15M-¥20M",
    willingRelocate: true, verified: true, score: 90, rank: 4, source: "manual",
    createdAt: "", updatedAt: "",
  },
  {
    id: "mock_005", name: "E. Johnson", email: "j***@nrel.gov",
    title: "风储协同控制专家", summary: "Stanford博士，8年风储协同控制经验",
    country: "美国", city: "丹佛", industry: "both", experienceYears: 8,
    currentCompany: "NREL", currentPosition: "Senior Research Engineer",
    education: [], skills: ["风储协同", "电网集成", "Python"],
    languages: [], certificates: [], publications: [], patents: [],
    githubUrl: "https://github.com/ejohnson-windstorage", linkedinUrl: "https://linkedin.com/in/ejohnson-nrel",
    scholarUrl: null, availability: "1month", expectedSalary: "$160K-$200K",
    willingRelocate: true, verified: true, score: 88, rank: 5, source: "openalex",
    createdAt: "", updatedAt: "",
  },
]

function getScoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400"
  if (score >= 75) return "text-sky-400"
  if (score >= 60) return "text-amber-400"
  return "text-red-400"
}

function getAvailabilityLabel(avail: string | null | undefined): string {
  const map: Record<string, string> = { immediate: "立即到岗", "1month": "1个月内", "3months": "3个月内", not_looking: "暂不考虑" }
  return map[avail || ""] || avail || "未知"
}

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateRecord[]>([])
  const [dataSource, setDataSource] = useState<"db" | "mock">("mock")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [keyword, setKeyword] = useState("")
  const [industry, setIndustry] = useState("")
  const [total, setTotal] = useState(0)

  const fetchCandidates = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (keyword) params.set("keyword", keyword)
      if (industry) params.set("industry", industry)
      params.set("pageSize", "200")

      const res = await fetch(`/api/candidates?${params.toString()}`)
      const json = await res.json()
      if (json.data && json.data.length > 0) {
        setCandidates(json.data)
        setDataSource(json.source || "mock")
        setTotal(json.total || json.data.length)
      } else {
        setCandidates(MOCK_CANDIDATES)
        setDataSource("mock")
        setTotal(MOCK_CANDIDATES.length)
      }
    } catch (err: any) {
      setError(err.message)
      setCandidates(MOCK_CANDIDATES)
      setDataSource("mock")
      setTotal(MOCK_CANDIDATES.length)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCandidates() }, [])

  return (
    <main className="min-h-screen bg-[#060d1a] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-[#1a2a44] bg-[#060d1a]/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/30">
              <Zap className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-base font-bold text-white">全球风能锂电人才搜索雷达</span>
            <Badge variant="outline" className="ml-2 border-sky-500/30 text-sky-400 text-xs">人才搜索</Badge>
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
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">人才搜索</h1>
                <p className="text-sm text-slate-500 mt-1">
                  共 {total} 位候选人
                  <span className={`ml-2 text-xs ${dataSource === "db" ? "text-emerald-400" : "text-amber-400"}`}>
                    ● {dataSource === "db" ? "数据库" : "示例数据"}
                  </span>
                </p>
              </div>
              {error && (
                <button onClick={fetchCandidates} className="flex items-center gap-1 px-3 py-1.5 border border-red-500/30 bg-red-500/5 text-red-400 text-xs rounded-lg hover:bg-red-500/10">
                  <RefreshCw className="h-3 w-3" />重新加载
                </button>
              )}
            </div>

            {/* 搜索栏 */}
            <div className="flex gap-3 mt-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text" placeholder="搜索候选人、技能、公司..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchCandidates()}
                  className="w-full h-10 pl-10 pr-4 bg-[#0c1830] border border-[#1a2a44] rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50"
                />
              </div>
              <select
                value={industry}
                onChange={(e) => { setIndustry(e.target.value) }}
                className="h-10 px-3 bg-[#0c1830] border border-[#1a2a44] rounded-lg text-white text-sm focus:outline-none focus:border-sky-500/50"
              >
                <option value="">全部行业</option>
                <option value="wind">风能</option>
                <option value="lithium">锂电</option>
                <option value="both">风能+锂电</option>
              </select>
              <button onClick={fetchCandidates} className="h-10 px-6 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg transition">
                搜索
              </button>
            </div>
          </div>

          {/* Compliance Notice */}
          <div className="mb-4">
            <ComplianceNotice compact />
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 text-sky-400 animate-spin" />
            </div>
          )}

          {/* Error fallback notice */}
          {error && !loading && (
            <div className="p-4 mb-4 border border-red-500/20 bg-red-500/5 rounded-xl text-center">
              <AlertCircle className="h-4 w-4 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-red-400">数据库连接失败，已回退至示例数据</p>
              <p className="text-xs text-slate-500 mt-1">请运行 npm run db:setup 初始化数据库</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && candidates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-12 w-12 text-slate-600 mb-4" />
              <p className="text-slate-400 text-lg">未找到匹配的候选人</p>
              <p className="text-slate-600 text-sm mt-1">尝试使用不同的搜索条件</p>
            </div>
          )}

          {/* Candidates list */}
          {!loading && candidates.length > 0 && (
            <div className="space-y-3">
              {candidates.map((c) => (
                <a key={c.id} href={`/candidates/${c.id}`} className="block">
                  <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl hover:border-sky-500/30 hover:bg-[#0e1a38] transition group">
                    <div className="flex items-start gap-4">
                      {/* Score indicator */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                        <span className={`text-sm font-bold ${getScoreColor(c.score)}`}>{c.score}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium group-hover:text-sky-400 transition">{c.name}</h3>
                          {c.verified && <Badge className="text-[9px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">已认证</Badge>}
                          {c.industry === "wind" && <Badge variant="outline" className="text-[9px] border-sky-500/30 text-sky-400">风能</Badge>}
                          {c.industry === "lithium" && <Badge variant="outline" className="text-[9px] border-emerald-500/30 text-emerald-400">锂电</Badge>}
                          {c.industry === "both" && <Badge variant="outline" className="text-[9px] border-purple-500/30 text-purple-400">风+锂</Badge>}
                        </div>
                        <p className="text-slate-400 text-sm mt-0.5">{c.title}</p>
                        <p className="text-slate-600 text-xs mt-1 line-clamp-1">{c.summary}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.country} {c.city}</span>
                          <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{c.currentCompany || "保密"}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{getAvailabilityLabel(c.availability)}</span>
                        </div>
                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {c.skills.slice(0, 4).map((s) => (
                            <Badge key={s} variant="outline" className="text-[9px] border-slate-700 text-slate-400">{s}</Badge>
                          ))}
                          {c.skills.length > 4 && <span className="text-[9px] text-slate-600">+{c.skills.length - 4}</span>}
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-sky-400 transition flex-shrink-0 mt-2" />
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 mb-8 border-t border-[#1a2a44]">
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/dashboard"}>
              返回控制台
            </Button>
            <Button size="sm" onClick={() => window.location.href = "/invitations"} className="bg-gradient-to-r from-sky-500 to-blue-600">
              下一步：发起人才邀请 <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <footer className="border-t border-[#1a2a44] pt-4 mt-8 text-center">
            <p className="text-[11px] text-slate-600">© 2026 全球风能锂电人才搜索雷达 · {dataSource === "db" ? "数据库驱动" : "示例数据平台"}</p>
          </footer>
        </div>
      </div>
    </main>
  )
}
