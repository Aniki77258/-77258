"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search, RefreshCw, Zap, Clock, Trash2,
  Bell, LogOut, ChevronRight, Globe, Award,
  AlertTriangle, Send, Building2, Users,
  MapPin, BookOpen, Languages, Briefcase,
  Scale, Plus, Check,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { ComplianceNotice } from "@/components/shared/compliance-notice"

// ============================================================
// 类型定义
// ============================================================

interface SearchRecord {
  id: string
  query: string
  industry: string
  resultsCount: number
  source?: "real" | "local"
  createdAt: string
}

interface TalentResult {
  id: string
  name: string
  title: string
  country: string
  matchScore: number
  highlights: string[]
  riskFlags: string[]
  reason: string
}

interface SearchResponse {
  success: boolean
  searchId?: string
  source?: "real" | "local"
  data: {
    jobTitle: string
    jobId: string
    recommendations: TalentResult[]
    marketInsight: string
    searchKeywords: string[]
  }
  disclaimer: string
  safetyNote: string
  model: string
}

// ============================================================
// 工具
// ============================================================

function formatDate(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" }) + " " +
      d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  } catch {
    return iso
  }
}

function industryLabel(i: string): string {
  return i === "wind" ? "风能" : i === "lithium" ? "锂电" : "风能+锂电"
}

function industryColor(i: string): string {
  return i === "wind" ? "text-purple-400 bg-purple-500/10" : i === "lithium" ? "text-green-400 bg-green-500/10" : "text-sky-400 bg-sky-500/10"
}

function scoreColor(s: number): string {
  if (s >= 85) return "text-green-400"
  if (s >= 70) return "text-yellow-400"
  return "text-red-400"
}

const COUNTRY_FLAGS: Record<string, string> = {
  "中国": "🇨🇳", "德国": "🇩🇪", "丹麦": "🇩🇰", "英国": "🇬🇧",
  "西班牙": "🇪🇸", "日本": "🇯🇵", "韩国": "🇰🇷", "瑞典": "🇸🇪",
  "美国": "🇺🇸", "法国": "🇫🇷", "意大利": "🇮🇹",
}

// ============================================================
// 对比列表管理（localStorage）
// ============================================================

const COMPARE_KEY = "wlr_compare_list"

function loadCompareList(): TalentResult[] {
  try {
    const raw = localStorage.getItem(COMPARE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCompareList(list: TalentResult[]) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(list.slice(0, 4)))
}

// ============================================================
// 主页面
// ============================================================

export default function SearchesPage() {
  const { user, logout } = useAuth()

  // 搜索状态
  const [query, setQuery] = useState("")
  const [industry, setIndustry] = useState<"wind" | "lithium" | "both">("both")
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<TalentResult[] | null>(null)
  const [marketInsight, setMarketInsight] = useState("")
  const [disclaimer, setDisclaimer] = useState("")
  const [activeQuery, setActiveQuery] = useState("")
  const [dataSource, setDataSource] = useState<"real" | "local" | null>(null)

  // 历史记录
  const [history, setHistory] = useState<SearchRecord[]>([])
  const [error, setError] = useState("")

  // 对比列表
  const [compareList, setCompareList] = useState<TalentResult[]>(loadCompareList)

  // 同步到 localStorage
  useEffect(() => {
    saveCompareList(compareList)
  }, [compareList])

  // 加载历史记录
  useEffect(() => {
    fetch("/api/searches")
      .then(r => r.json())
      .then(d => { if (d.searches) setHistory(d.searches) })
      .catch(() => {})
  }, [])

  // 执行搜索
  const doSearch = useCallback(async (q: string, ind: string) => {
    if (!q.trim()) return
    setSearching(true)
    setError("")
    setActiveQuery(q)
    try {
      const res = await fetch("/api/searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, industry: ind }),
      })
      const data: SearchResponse = await res.json()
      if (!res.ok) throw new Error((data as any).error || "搜索失败")
      setResults(data.data.recommendations)
      setMarketInsight(data.data.marketInsight)
      setDisclaimer(data.disclaimer)
      setDataSource(data.source || "local")
      // 刷新历史
      fetch("/api/searches")
        .then(r => r.json())
        .then(d => { if (d.searches) setHistory(d.searches) })
        .catch(() => {})
    } catch (err: any) {
      setError(err.message || "搜索请求失败")
      setResults(null)
    } finally {
      setSearching(false)
    }
  }, [])

  // 表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    doSearch(query, industry)
  }

  // 点击历史记录
  const handleHistoryClick = (r: SearchRecord) => {
    setQuery(r.query)
    setIndustry(r.industry as any)
    doSearch(r.query, r.industry)
  }

  // 删除历史记录
  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setHistory(prev => prev.filter(h => h.id !== id))
  }

  // 加入/移除对比
  const toggleCompare = (t: TalentResult) => {
    setCompareList(prev => {
      const exists = prev.find(item => item.id === t.id)
      if (exists) {
        return prev.filter(item => item.id !== t.id)
      } else {
        if (prev.length >= 4) {
          alert("最多对比 4 位人才，请先移除部分人才")
          return prev
        }
        return [...prev, t]
      }
    })
  }

  const isInCompare = (id: string) => compareList.some(item => item.id === id)

  // 前往对比页面
  const goToCompare = () => {
    window.location.href = "/compare"
  }

  return (
    <main className="min-h-screen bg-[#060b14] text-slate-100">
      {/* ========== Header ========== */}
      <header className="sticky top-0 z-50 border-b border-[#1a2a44] bg-[#060b14]/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/30">
              <Zap className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-base font-bold text-white hidden sm:inline">全球风能锂电人才搜索雷达</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-sky-500/30 text-sky-400">搜索</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-xs text-slate-400 hover:text-white transition">首页</a>
            <button className="text-slate-400 hover:text-white"><Bell className="h-4 w-4" /></button>
            <button
              onClick={() => { logout(); window.location.href = "/" }}
              className="text-slate-500 hover:text-red-400 transition"
              title="退出登录"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        {/* ========== 搜索栏 ========== */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="搜索全球风能/锂电人才... 例如：solid state battery, wind turbine control, BMS architecture"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#1a2a44] bg-[#0c1830] text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 text-sm transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value as any)}
                className="px-3 py-3 rounded-xl border border-[#1a2a44] bg-[#0c1830] text-white text-sm focus:outline-none focus:border-sky-500/50 appearance-none cursor-pointer"
              >
                <option value="both">全部领域</option>
                <option value="wind">🌬️ 风能</option>
                <option value="lithium">🔋 锂电</option>
              </select>
              <button
                type="submit"
                disabled={searching || !query.trim()}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm flex items-center gap-2 transition-all"
              >
                {searching ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                搜索
              </button>
            </div>
          </div>
        </form>

        {/* ========== 错误提示 ========== */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ========== 搜索结果 ========== */}
        {results !== null && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">
                搜索结果：
                <span className="text-sky-400">"{activeQuery}"</span>
                <span className="text-slate-500 text-sm font-normal ml-2">
                  共 {results.length} 位候选人
                </span>
                {/* 数据来源标签 */}
                {dataSource && (
                  <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${
                    dataSource === "real"
                      ? "bg-green-500/10 text-green-400 border border-green-500/30"
                      : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                  }`}>
                    {dataSource === "real" ? "🟢 真实数据（arXiv/Crossref）" : "🟡 本地模拟数据"}
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                {compareList.length >= 2 && (
                  <button
                    onClick={goToCompare}
                    className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-all flex items-center gap-1"
                  >
                    <Scale className="h-3 w-3" />
                    对比 ({compareList.length})
                  </button>
                )}
                <button
                  onClick={() => setResults(null)}
                  className="text-xs text-slate-500 hover:text-slate-300 transition"
                >
                  清除结果
                </button>
              </div>
            </div>

            {/* 市场洞察 */}
            {marketInsight && (
              <div className="mb-4 p-3 rounded-lg bg-sky-500/5 border border-sky-500/20 text-slate-400 text-xs leading-relaxed">
                💡 {marketInsight}
              </div>
            )}

            {/* 人才卡片网格 */}
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-slate-500 text-sm mb-1">未找到匹配的候选人</p>
                <p className="text-slate-600 text-xs">尝试用英文关键词或切换行业领域</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {results.map((t) => (
                  <div
                    key={t.id}
                    className="group border border-[#1a2a44] bg-[#0c1830] rounded-xl p-4 hover:border-sky-500/40 hover:bg-[#0e1c38] transition-all"
                  >
                    {/* 头部：姓名 + 匹配分 */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold text-sm flex items-center gap-1.5">
                          {COUNTRY_FLAGS[t.country] || "🌍"}
                          {t.name}
                          {/* 真实数据标记 */}
                          {t.id.startsWith("real_") && (
                            <span className="text-[9px] px-1 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">
                              真实
                            </span>
                          )}
                        </h3>
                        <p className="text-slate-400 text-xs mt-0.5">{t.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-600" />
                          <span className="text-[11px] text-slate-500">{t.country}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-xl font-bold ${scoreColor(t.matchScore)}`}>
                          {t.matchScore}
                        </div>
                        <div className="text-[10px] text-slate-600">匹配分</div>
                      </div>
                    </div>

                    {/* 亮点 */}
                    {t.highlights.length > 0 && (
                      <div className="mb-2">
                        {t.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400 mb-0.5">
                            <Award className="h-3 w-3 text-yellow-500/70 flex-shrink-0 mt-0.5" />
                            <span className="leading-tight">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 匹配原因 */}
                    <p className="text-[11px] text-slate-600 mb-2 leading-tight">{t.reason}</p>

                    {/* 风险标记 */}
                    {t.riskFlags.length > 0 && (
                      <div className="mb-2">
                        {t.riskFlags.map((f, i) => (
                          <div key={i} className="flex items-center gap-1 text-[11px] text-amber-400/70">
                            <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex gap-2 mt-1">
                      <button
                        className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                          isInCompare(t.id)
                            ? "border-purple-500/50 bg-purple-500/10 text-purple-300"
                            : "border-sky-500/30 text-sky-400 hover:bg-sky-500/10"
                        }`}
                        onClick={() => toggleCompare(t)}
                      >
                        {isInCompare(t.id) ? (
                          <>
                            <Check className="h-3 w-3" />
                            已加入对比
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3" />
                            加入对比
                          </>
                        )}
                      </button>
                      <button
                        className="flex-1 py-2 rounded-lg border border-sky-500/30 text-sky-400 text-xs font-medium hover:bg-sky-500/10 transition-all flex items-center justify-center gap-1.5"
                        onClick={() => alert(`邀请功能：将向 ${t.name} 发送邀请邮件`)}
                      >
                        <Send className="h-3 w-3" />
                        发送邀请
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 合规声明 */}
            {disclaimer && (
              <div className="mt-4">
                <ComplianceNotice compact disclaimer={disclaimer} />
              </div>
            )}
          </section>
        )}

        {/* ========== 搜索历史（仅在无搜索结果时显示）========== */}
        {results === null && (
          <section>
            <h2 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              最近搜索
            </h2>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-10 w-10 text-slate-700 mb-3" />
                <p className="text-slate-500 text-sm">暂无搜索记录</p>
                <p className="text-slate-600 text-xs mt-1">在上方输入关键词开始搜索风能/锂电人才</p>
              </div>
            ) : (
              <div className="space-y-1">
                {history.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleHistoryClick(s)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border border-[#1a2a44] bg-[#0c1830] hover:border-sky-500/30 hover:bg-[#0e1c38] cursor-pointer transition-all group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                      <Search className="h-3.5 w-3.5 text-sky-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{s.query}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${industryColor(s.industry)}`}>
                          {industryLabel(s.industry)}
                        </span>
                        {s.source && (
                          <span className={`text-[10px] ${
                            s.source === "real" ? "text-green-500/70" : "text-yellow-500/70"
                          }`}>
                            {s.source === "real" ? "真实数据" : "本地数据"}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />{formatDate(s.createdAt)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-sky-400 font-medium flex-shrink-0">
                      {s.resultsCount} 结果
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-sky-400 transition flex-shrink-0" />
                    <button
                      onClick={(e) => handleDeleteHistory(s.id, e)}
                      className="p-1 text-slate-700 hover:text-red-400 transition flex-shrink-0 opacity-0 group-hover:opacity-100"
                      title="删除"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ========== 底部 ========== */}
        <footer className="border-t border-[#1a2a44] pt-4 mt-8 text-center">
          <p className="text-[11px] text-slate-600">
            © 2026 全球风能锂电人才搜索雷达 · AI 辅助搜索 · 真实数据来自 arXiv / Crossref 学术数据库
          </p>
        </footer>
      </div>

      {/* ========== 对比悬浮栏 ========== */}
      {compareList.length >= 2 && (
        <div className="fixed bottom-0 inset-x-0 z-50 border-t border-purple-500/30 bg-[#0c1830]/95 backdrop-blur px-4 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-2 overflow-x-auto">
            <Scale className="h-4 w-4 text-purple-400 flex-shrink-0" />
            <span className="text-xs text-purple-300 font-medium flex-shrink-0">对比列表：</span>
            {compareList.map(item => (
              <span
                key={item.id}
                className="text-[11px] px-2 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 flex items-center gap-1 flex-shrink-0"
              >
                {COUNTRY_FLAGS[item.country] || "🌍"} {item.name}
                <button
                  onClick={() => toggleCompare(item)}
                  className="ml-1 text-purple-400 hover:text-red-400 transition"
                >×</button>
              </span>
            ))}
          </div>
          <button
            onClick={goToCompare}
            className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-white text-xs font-bold flex items-center gap-1.5 flex-shrink-0 ml-4 transition-all"
          >
            <Scale className="h-3 w-3" />
            开始对比
          </button>
        </div>
      )}
    </main>
  )
}
