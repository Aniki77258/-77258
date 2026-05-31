"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AIDisclaimer, AIGeneratedBadge } from "@/components/shared/ai-disclaimer"
import { DollarSign, Sparkles, Loader2, Info } from "lucide-react"

const CURRENCIES = [
  { code: "CNY", symbol: "¥", label: "人民币" },
  { code: "USD", symbol: "$", label: "美元" },
  { code: "EUR", symbol: "€", label: "欧元" },
  { code: "SGD", symbol: "S$", label: "新加坡元" },
]

const PRESET_COUNTRIES = ["中国", "美国", "德国", "丹麦", "新加坡", "韩国", "日本", "澳大利亚"]

function formatMoney(amount: number, currency: string): string {
  const symbols: Record<string, string> = { CNY: "¥", USD: "$", EUR: "€", SGD: "S$", JPY: "¥" }
  const sym = symbols[currency] || currency + " "
  if (amount >= 1000000) return `${sym}${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `${sym}${(amount / 1000).toFixed(0)}K`
  return `${sym}${amount.toLocaleString()}`
}

export default function AISalaryPage() {
  const [jobTitle, setJobTitle] = useState("")
  const [industry, setIndustry] = useState<"wind" | "lithium" | "both">("wind")
  const [country, setCountry] = useState("中国")
  const [experienceYears, setExperienceYears] = useState(5)
  const [currency, setCurrency] = useState("CNY")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleGenerate() {
    if (!jobTitle) return
    setLoading(true)
    const res = await fetch("/api/ai/salary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTitle, industry, country, experienceYears, currency }),
    })
    const json = await res.json()
    setResult(json)
    setLoading(false)
  }

  const b = result?.data?.breakdown

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-amber-400" /> AI 薪酬建议
        </h1>
        <p className="mt-1 text-sm text-slate-400">根据岗位、地区、经验生成示例薪酬区间 · 标注为示例建议</p>
      </div>

      <AIDisclaimer />

      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-white/80 text-sm mb-1">岗位名称</label>
              <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                placeholder="如: BMS Algorithm Architect"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">行业方向</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value as any)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                <option value="wind" className="bg-[#0a1120]">风能</option>
                <option value="lithium" className="bg-[#0a1120]">锂电</option>
                <option value="both" className="bg-[#0a1120]">风储协同</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">国家/地区</label>
              <select value={country} onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                {PRESET_COUNTRIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0a1120]">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">工作年限</label>
              <input type="number" value={experienceYears} onChange={(e) => setExperienceYears(Number(e.target.value))}
                min={0} max={40}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
            </div>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-white/80 text-sm mb-2">显示货币</label>
            <div className="flex flex-wrap gap-2">
              {CURRENCIES.map((c) => (
                <button key={c.code}
                  onClick={() => setCurrency(c.code)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition ${
                    currency === c.code
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                  }`}>
                  {c.symbol} {c.label}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading || !jobTitle}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? "AI 正在分析薪酬…" : "生成薪酬建议"}
          </Button>
        </CardContent>
      </Card>

      {result && b && (
        <>
          {/* Salary Breakdown */}
          <Card className="border-amber-500/20 bg-white/[0.03]">
            <CardHeader>
              <CardTitle className="text-white text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-400" />
                薪酬区间
                <AIGeneratedBadge />
                <span className="text-xs text-slate-500 font-normal ml-1">
                  · {result.data.country} · {result.data.experienceYears} 年经验
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Total */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-center">
                <p className="text-xs text-amber-400/70 mb-1">年度总薪酬（含奖金+股权）</p>
                <p className="text-3xl font-bold text-amber-400">
                  {formatMoney(b.totalMin, b.currency)} - {formatMoney(b.totalMax, b.currency)}
                </p>
              </div>

              {/* Breakdown grid */}
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] text-slate-500 mb-1">基本薪资</p>
                  <p className="text-white font-semibold text-lg">
                    {formatMoney(b.baseMin, b.currency)} - {formatMoney(b.baseMax, b.currency)}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] text-slate-500 mb-1">年度奖金</p>
                  <p className="text-white font-semibold text-lg">
                    {formatMoney(b.bonusMin, b.currency)} - {formatMoney(b.bonusMax, b.currency)}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] text-slate-500 mb-1">股权/期权</p>
                  <p className="text-white font-semibold text-lg">
                    {formatMoney(b.equityMin!, b.currency)} - {formatMoney(b.equityMax!, b.currency)}
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-slate-500 mb-2">福利待遇</p>
                <div className="flex flex-wrap gap-1.5">
                  {b.benefits.map((ben: string) => (
                    <span key={ben} className="px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                      {ben}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Note */}
          <Card className="border-red-500/20 bg-red-500/[0.03]">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                <div className="text-xs space-y-2">
                  <p className="text-red-400 font-medium">⚠️ 示例数据声明</p>
                  <p className="text-slate-400">{result.data.marketNote}</p>
                  <p className="text-amber-400/80">{result.data.sourceNote}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
