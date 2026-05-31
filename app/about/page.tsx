"use client"

import Link from "next/link"
import { Zap, Globe, Users, Brain, Shield, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export default function AboutPage() {
  const { t, language } = useLanguage()
  const isZh = language === 'zh'

  const features = [
    { icon: Globe, title: isZh ? "全球覆盖" : "Global Coverage", desc: isZh ? "覆盖 50+ 国家/地区的顶尖人才" : "Top talent across 50+ countries" },
    { icon: Brain, title: isZh ? "AI 驱动" : "AI Powered", desc: isZh ? "智能匹配与自动化评估" : "Smart matching & automated assessment" },
    { icon: Shield, title: isZh ? "数据安全" : "Data Security", desc: isZh ? "企业级数据加密与合规" : "Enterprise-grade encryption & compliance" },
    { icon: TrendingUp, title: isZh ? "精准推荐" : "Precision", desc: isZh ? "91.2% 推荐准确率" : "91.2% recommendation accuracy" },
  ]

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <span className="text-white font-bold text-lg">{t('home.title')}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-slate-400 hover:text-white text-sm">{t('nav.pricing')}</Link>
            <Link href="/login" className="px-4 py-2 text-white hover:bg-white/10 rounded text-sm">{t('auth.login')}</Link>
            <Link href="/register" className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded text-white text-sm">{t('auth.register')}</Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm mb-6">
          <Users className="w-4 h-4" />
          {isZh ? "全球顶尖人才搜索平台" : "Global Top Talent Search Platform"}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          {isZh ? "连接全球风能与锂电人才" : "Connecting Global Wind & Lithium Talent"}
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
          {isZh
            ? "WLR 人才雷达是全球领先的风能、锂电与储能领域专业人才搜索平台，运用 AI 技术为全球企业提供精准的人才匹配服务。"
            : "WLR Talent Radar is the world's leading professional talent search platform for wind energy, lithium batteries, and energy storage."}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-sky-500/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-sky-500/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">{isZh ? "我们的使命" : "Our Mission"}</h2>
          <p className="text-slate-400">
            {isZh
              ? "通过技术驱动，缩短全球顶尖新能源人才与理想岗位之间的距离，为碳中和目标贡献力量。"
              : "Using technology to bridge the gap between top global renewable energy talent and their ideal positions."}
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 WLR Talent Radar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
