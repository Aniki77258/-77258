"use client"

import { useLanguage } from "@/lib/i18n"
import { Globe } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { t, tk, language, toggleLanguage } = useLanguage()
  const nav = tk('nav')
  const home = tk('home')

  const modules = [
    { title: home.moduleTalentSearch, desc: home.moduleTalentSearchDesc },
    { title: home.moduleInterview, desc: home.moduleInterviewDesc },
    { title: home.moduleAssessment, desc: home.moduleAssessmentDesc },
    { title: home.moduleNegotiation, desc: home.moduleNegotiationDesc },
    { title: home.moduleOffer, desc: home.moduleOfferDesc },
    { title: home.moduleAnalytics, desc: home.moduleAnalyticsDesc },
  ]

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GTR</span>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">{home.title}</span>
            <span className="text-white font-bold text-lg sm:hidden">GTR</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 mr-2">
              <Globe className="w-4 h-4 text-slate-500" />
              <button
                onClick={() => toggleLanguage()}
                className="px-2 py-1 text-xs rounded border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-colors"
              >
                {language === 'zh' ? 'EN' : '中文'}
              </button>
            </div>
            <Link href="/login" className="px-4 py-2 text-white hover:bg-white/10 rounded text-sm transition-colors">
              {t('auth.login')}
            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm transition-colors">
              {t('auth.register')}
            </Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          {home.heroTitle.split('全球')?.[0]}
          {home.heroTitle.includes('全球') && <span className="text-blue-400">Global</span>}
          {home.heroTitle.includes('全球') ? '' : <span className="text-blue-400"> {home.heroTitle}</span>}
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          {home.heroSubtitle}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-lg rounded-lg text-white transition-colors">
            {home.getStarted}
          </button>
          <button className="px-8 py-3 border border-white/30 hover:bg-white/10 text-lg rounded-lg text-white transition-colors">
            {home.learnMore}
          </button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          {language === 'zh' ? '六大核心模块' : 'Six Core Modules'}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-lg hover:bg-white/10 transition group">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <span className="text-blue-400 font-bold text-sm">{i + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{mod.title}</h3>
              <p className="text-blue-200 text-sm">{mod.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 mt-20 py-8 text-center text-blue-300 text-sm">
        {home.footer}
      </footer>
    </main>
  )
}
