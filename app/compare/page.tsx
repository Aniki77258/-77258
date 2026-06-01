"use client"

import { useEffect, useState } from "react"
import {
  ArrowLeft, Scale, Trash2, Mail, AlertTriangle,
  MapPin, BookOpen, Award, GraduationCap,
} from "lucide-react"
import { useAuth } from "@/lib/auth"
import { ComplianceNotice } from "@/components/shared/compliance-notice"

// ============================================================
// 类型
// ============================================================

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

// ============================================================
// 工具
// ============================================================

const COUNTRY_FLAGS: Record<string, string> = {
  "中国": "🇨🇳", "德国": "🇩🇪", "丹麦": "🇩🇰", "英国": "🇬🇧",
  "西班牙": "🇪🇸", "日本": "🇯🇵", "韩国": "🇰🇷", "瑞典": "🇸🇪",
  "美国": "🇺🇸", "法国": "🇫🇷", "意大利": "🇮🇹",
}

function scoreColor(s: number): string {
  if (s >= 85) return "text-green-400"
  if (s >= 70) return "text-yellow-400"
  return "text-red-400"
}

const COMPARE_KEY = "wlr_compare_list"

// ============================================================
// 主页面
// ============================================================

export default function ComparePage() {
  const { user, logout } = useAuth()
  const [compareList, setCompareList] = useState<TalentResult[]>([])

  // 加载对比列表
  useEffect(() => {
    const raw = localStorage.getItem(COMPARE_KEY)
    if (raw) {
      try {
        setCompareList(JSON.parse(raw))
      } catch {
        localStorage.removeItem(COMPARE_KEY)
      }
    }
  }, [])

  // 移除人才
  const removeFromCompare = (id: string) => {
    const newList = compareList.filter(t => t.id !== id)
    setCompareList(newList)
    localStorage.setItem(COMPARE_KEY, JSON.stringify(newList))
  }

  // 清空全部
  const clearAll = () => {
    setCompareList([])
    localStorage.removeItem(COMPARE_KEY)
  }

  // 发送批量邀请
  const sendBulkInvite = () => {
    const names = compareList.map(t => t.name).join("、")
    alert(`将向以下 ${compareList.length} 位人才发送邀请：\n${names}\n\n（功能演示，实际需接入邮件服务）`)
  }

  return (
    <main className="min-h-screen bg-[#060b14] text-slate-100">
      {/* ========== Header ========== */}
      <header className="sticky top-0 z-50 border-b border-[#1a2a44] bg-[#060b14]/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1a2a44] hover:border-sky-500/30 transition"
            >
              <ArrowLeft className="h-4 w-4 text-slate-400" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 border border-purple-500/30">
              <Scale className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-base font-bold text-white">人才对比</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-purple-500/30 text-purple-400">
              {compareList.length} / 4
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearAll}
              disabled={compareList.length === 0}
              className="text-xs text-slate-500 hover:text-red-400 transition disabled:opacity-30"
            >
              清空全部
            </button>
            <button
              onClick={() => { logout(); window.location.href = "/" }}
              className="text-slate-500 hover:text-red-400 transition"
              title="退出登录"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {compareList.length < 2 ? (
          /* ========== 空状态 ========== */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-20 w-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6">
              <Scale className="h-10 w-10 text-purple-500/50" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">添加至少 2 位人才进行对比</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-md">
              在搜索结果中点击"加入对比"按钮，将人才添加到对比列表。最多可同时对比 4 位人才。
            </p>
            <a
              href="/searches"
              className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-all"
            >
              去搜索人才
            </a>
          </div>
        ) : (
          /* ========== 对比表格 ========== */
          <>
            {/* 操作栏 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">
                人才对比
                <span className="text-slate-500 text-sm font-normal ml-2">
                  {compareList.length} 位候选人
                </span>
              </h2>
              <button
                onClick={sendBulkInvite}
                className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium flex items-center gap-2 transition-all"
              >
                <Mail className="h-4 w-4" />
                批量发送邀请
              </button>
            </div>

            {/* 对比网格 */}
            <div
              className={`grid gap-4 mb-8 ${
                compareList.length === 2 ? "grid-cols-2"
                : compareList.length === 3 ? "grid-cols-3"
                : "grid-cols-4"
              }`}
            >
              {compareList.map((t) => (
                <div
                  key={t.id}
                  className="border border-[#1a2a44] bg-[#0c1830] rounded-xl p-5 relative group"
                >
                  {/* 移除按钮 */}
                  <button
                    onClick={() => removeFromCompare(t.id)}
                    className="absolute top-3 right-3 p-1 rounded-lg bg-red-500/10 text-red-400/50 hover:bg-red-500/20 hover:text-red-400 transition opacity-0 group-hover:opacity-100"
                    title="移出对比"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  {/* 姓名 + 国旗 */}
                  <div className="flex items-center gap-2 mb-1 pr-8">
                    <span className="text-2xl">
                      {COUNTRY_FLAGS[t.country] || "🌍"}
                    </span>
                    <h3 className="text-white font-bold text-base">{t.name}</h3>
                  </div>

                  {/* 职称 */}
                  <p className="text-sky-400 text-xs mb-3">{t.title}</p>

                  {/* 匹配分 */}
                  <div className="mb-4 text-center">
                    <div className={`text-3xl font-bold ${scoreColor(t.matchScore)}`}>
                      {t.matchScore}
                    </div>
                    <div className="text-[10px] text-slate-600">匹配分</div>
                  </div>

                  {/* 基本信息 */}
                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="h-3 w-3 text-slate-600 flex-shrink-0" />
                      <span className="text-slate-300">{t.country}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-400">
                      <BookOpen className="h-3 w-3 text-slate-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 leading-tight">{t.reason}</span>
                    </div>
                  </div>

                  {/* 亮点 */}
                  {t.highlights.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">亮点</div>
                      <div className="space-y-1">
                        {t.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                            <Award className="h-3 w-3 text-yellow-500/60 flex-shrink-0 mt-0.5" />
                            <span className="leading-tight line-clamp-2">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 风险标记 */}
                  {t.riskFlags.length > 0 && (
                    <div className="mb-3">
                      <div className="text-[10px] text-amber-500/70 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        风险提示
                      </div>
                      {t.riskFlags.map((f, i) => (
                        <div key={i} className="text-[11px] text-amber-400/70">{f}</div>
                      ))}
                    </div>
                  )}

                  {/* 操作 */}
                  <button
                    onClick={() => alert(`将向 ${t.name} 发送邀请`)}
                className="w-full mt-3 py-2 rounded-lg border border-sky-500/30 text-sky-400 text-xs font-medium hover:bg-sky-500/10 transition-all flex items-center justify-center gap-1.5"
              >
                <Mail className="h-3 w-3" />
                发送邀请
              </button>
                </div>
              ))}
            </div>

            {/* 并排对比表格 */}
            <div className="border border-[#1a2a44] rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-[#1a2a44] bg-[#0c1830]">
                <h3 className="text-sm font-bold text-white">详细对比</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#1a2a44]">
                      <th className="text-left px-5 py-3 text-slate-500 font-medium">对比项</th>
                      {compareList.map(t => (
                        <th key={t.id} className="text-left px-5 py-3 text-slate-300 font-medium">
                          {COUNTRY_FLAGS[t.country] || "🌍"} {t.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* 匹配分 */}
                    <tr className="border-b border-[#1a2a44]">
                      <td className="px-5 py-3 text-slate-500">匹配分</td>
                      {compareList.map(t => (
                        <td key={t.id} className={`px-5 py-3 font-bold text-lg ${scoreColor(t.matchScore)}`}>
                          {t.matchScore} 分
                        </td>
                      ))}
                    </tr>
                    {/* 国家/地区 */}
                    <tr className="border-b border-[#1a2a44]">
                      <td className="px-5 py-3 text-slate-500">国家/地区</td>
                      {compareList.map(t => (
                        <td key={t.id} className="px-5 py-3 text-slate-300">
                          {COUNTRY_FLAGS[t.country] || "🌍"} {t.country}
                        </td>
                      ))}
                    </tr>
                    {/* 职称 */}
                    <tr className="border-b border-[#1a2a44]">
                      <td className="px-5 py-3 text-slate-500">职称</td>
                      {compareList.map(t => (
                        <td key={t.id} className="px-5 py-3 text-slate-300">{t.title}</td>
                      ))}
                    </tr>
                    {/* 亮点数 */}
                    <tr className="border-b border-[#1a2a44]">
                      <td className="px-5 py-3 text-slate-500">亮点数</td>
                      {compareList.map(t => (
                        <td key={t.id} className="px-5 py-3 text-slate-300">
                          {t.highlights.length} 项
                        </td>
                      ))}
                    </tr>
                    {/* 风险项 */}
                    <tr className="border-b border-[#1a2a44]">
                      <td className="px-5 py-3 text-slate-500">风险项</td>
                      {compareList.map(t => (
                        <td key={t.id} className="px-5 py-3">
                          {t.riskFlags.length === 0 ? (
                            <span className="text-green-400/70">无风险</span>
                          ) : (
                            <span className="text-amber-400/70">{t.riskFlags.length} 项</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    {/* 完整简介 */}
                    <tr>
                      <td className="px-5 py-3 text-slate-500 align-top">简介</td>
                      {compareList.map(t => (
                        <td key={t.id} className="px-5 py-3 text-slate-400 leading-relaxed">
                          {t.reason}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 合规声明 */}
            <div className="mt-6">
              <ComplianceNotice compact />
            </div>
          </>
        )}
      </div>
    </main>
  )
}
