"use client"

import Link from "next/link"
import { Zap, Globe, MapPin } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

const REGIONS = [
  { name: "China", nameZh: "中国", count: 1247, x: 75, y: 35 },
  { name: "Germany", nameZh: "德国", count: 832, x: 52, y: 28 },
  { name: "USA", nameZh: "美国", count: 918, x: 22, y: 32 },
  { name: "Denmark", nameZh: "丹麦", count: 445, x: 50, y: 24 },
  { name: "Netherlands", nameZh: "荷兰", count: 389, x: 49, y: 26 },
  { name: "UK", nameZh: "英国", count: 567, x: 47, y: 26 },
  { name: "Japan", nameZh: "日本", count: 423, x: 85, y: 34 },
  { name: "South Korea", nameZh: "韩国", count: 312, x: 83, y: 35 },
  { name: "Australia", nameZh: "澳大利亚", count: 234, x: 82, y: 65 },
  { name: "Norway", nameZh: "挪威", count: 198, x: 51, y: 20 },
]

export default function TalentMapPage() {
  const { t, language } = useLanguage()
  const isZh = language === 'zh'

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <span className="text-white font-bold text-lg">{t('home.title')}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/about" className="text-slate-400 hover:text-white text-sm">{t('nav.about')}</Link>
            <Link href="/pricing" className="text-slate-400 hover:text-white text-sm">{t('nav.pricing')}</Link>
            <Link href="/login" className="px-4 py-2 text-white hover:bg-white/10 rounded text-sm">{t('auth.login')}</Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
            <Globe className="w-8 h-8 text-sky-400" />
            {isZh ? "全球人才地图" : "Global Talent Map"}
          </h1>
          <p className="text-slate-400">
            {isZh ? "实时展示全球风能与锂电领域人才分布" : "Real-time distribution of wind & lithium talent worldwide"}
          </p>
        </div>

        {/* Map visualization */}
        <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="aspect-[2/1] relative">
            {/* World map dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-4xl">
                <div className="relative w-full pt-[50%]">
                  <svg viewBox="0 0 100 60" className="absolute inset-0 w-full h-full">
                    {/* Simplified world map background */}
                    <rect width="100" height="60" fill="#1e293b" rx="4" />
                    <text x="50" y="30" textAnchor="middle" fill="#475569" fontSize="3">
                      {isZh ? "全球人才分布" : "Global Talent Distribution"}
                    </text>
                    {REGIONS.map((r) => (
                      <g key={r.name}>
                        <circle
                          cx={r.x}
                          cy={r.y}
                          r={Math.max(1.5, Math.min(4, r.count / 200))}
                          fill="rgba(56, 189, 248, 0.8)"
                        />
                        <text x={r.x} y={r.y - 2} textAnchor="middle" fill="#94a3b8" fontSize="1.5">
                          {isZh ? r.nameZh : r.name}
                        </text>
                        <text x={r.x} y={r.y + 3} textAnchor="middle" fill="#38bdf8" fontSize="1.5" fontWeight="bold">
                          {r.count}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: isZh ? "覆盖国家" : "Countries", value: "50+" },
            { label: isZh ? "注册人才" : "Registered Talent", value: "12,847" },
            { label: isZh ? "活跃企业" : "Active Companies", value: "1,200+" },
            { label: isZh ? "成功匹配" : "Successful Matches", value: "4,560" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <p className="text-2xl font-bold text-sky-400 mb-1">{s.value}</p>
              <p className="text-slate-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 WLR Talent Radar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
