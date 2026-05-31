# -*- coding: utf-8 -*-
import os

BASE = "D:/WORKBUDDY工作文件夹/2026-05-29-01-08-25/global-talent-radar/app"

# 1. /about page
about_page = '''"use client"

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
'''

# 2. /talent-map page
talent_map_page = '''"use client"

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
'''

# 3. /privacy page
privacy_page = '''"use client"

import Link from "next/link"
import { Zap, Shield } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export default function PrivacyPage() {
  const { language } = useLanguage()
  const isZh = language === 'zh'

  const sections = isZh ? [
    { title: "1. 数据收集", content: "我们仅收集为您提供服务所必需的最少数据，包括账户信息、使用记录和偏好设置。我们不会收集或存储任何敏感个人信息。" },
    { title: "2. 数据使用", content: "您的数据仅用于改善服务体验、提供个性化推荐和确保平台安全。我们绝不会将您的数据出售给第三方。" },
    { title: "3. 数据安全", content: "采用 AES-256 加密、TLS 1.3 传输加密，以及企业级访问控制，确保您的数据安全。" },
    { title: "4. Cookie 政策", content: "我们使用必要的 Cookie 来维持平台功能，您可以在浏览器设置中管理 Cookie 偏好。" },
    { title: "5. 用户权利", content: "您有权访问、更正、删除您的个人数据。如需行使这些权利，请联系我们的数据保护团队。" },
    { title: "6. 联系我们", content: "如有隐私相关问题，请发送邮件至 privacy@globaltalentradar.com" },
  ] : [
    { title: "1. Data Collection", content: "We only collect the minimum data necessary to provide our services, including account information, usage records, and preferences. We do not collect or store any sensitive personal information." },
    { title: "2. Data Usage", content: "Your data is used solely to improve service experience, provide personalized recommendations, and ensure platform security. We never sell your data to third parties." },
    { title: "3. Data Security", content: "We use AES-256 encryption, TLS 1.3 transport encryption, and enterprise-grade access control to ensure your data security." },
    { title: "4. Cookie Policy", content: "We use essential cookies to maintain platform functionality. You can manage cookie preferences in your browser settings." },
    { title: "5. User Rights", content: "You have the right to access, correct, and delete your personal data. To exercise these rights, please contact our data protection team." },
    { title: "6. Contact Us", content: "For privacy-related questions, please email privacy@globaltalentradar.com" },
  ]

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <span className="text-white font-bold text-lg">WLR Talent Radar</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/terms" className="text-slate-400 hover:text-white text-sm">{isZh ? "用户协议" : "Terms"}</Link>
            <Link href="/login" className="px-4 py-2 text-white hover:bg-white/10 rounded text-sm">{isZh ? "登录" : "Login"}</Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <Shield className="w-12 h-12 text-sky-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">{isZh ? "隐私政策" : "Privacy Policy"}</h1>
          <p className="text-slate-400">{isZh ? "最后更新：2026年5月" : "Last updated: May 2026"}</p>
        </div>

        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">{s.title}</h2>
              <p className="text-slate-400 leading-relaxed">{s.content}</p>
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
'''

# 4. /terms page
terms_page = '''"use client"

import Link from "next/link"
import { Zap, FileText } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export default function TermsPage() {
  const { language } = useLanguage()
  const isZh = language === 'zh'

  const sections = isZh ? [
    { title: "1. 服务说明", content: "WLR 人才雷达是一个面向全球风能、锂电与储能领域的人才搜索与招聘服务平台。我们提供人才搜索、AI 匹配、面试安排、薪酬谈判等全流程招聘服务。" },
    { title: "2. 用户责任", content: "用户应保证提供的信息真实、准确、完整。禁止发布虚假信息、侵犯他人权益的内容或进行任何违法活动。" },
    { title: "3. 知识产权", content: "平台的所有技术、算法、界面设计均为 WLR 所有。用户上传的内容知识产权归用户所有，但授予平台必要的使用许可。" },
    { title: "4. 服务变更", content: "我们保留随时修改或中断服务的权利，重要变更将提前通知用户。" },
    { title: "5. 责任限制", content: "在法律允许的最大范围内，WLR 对因使用或无法使用服务而造成的任何间接、附带损失不承担责任。" },
    { title: "6. 争议解决", content: "本协议适用中华人民共和国法律。如发生争议，双方应友好协商解决；协商不成的，提交上海仲裁委员会仲裁。" },
  ] : [
    { title: "1. Service Description", content: "WLR Talent Radar is a global talent search and recruitment platform for wind energy, lithium battery, and energy storage industries. We provide full-cycle recruitment services." },
    { title: "2. User Responsibilities", content: "Users must ensure all provided information is true, accurate, and complete. False information and illegal activities are prohibited." },
    { title: "3. Intellectual Property", content: "All technology, algorithms, and designs are owned by WLR. User-uploaded content remains the user's property, with necessary licenses granted to the platform." },
    { title: "4. Service Changes", content: "We reserve the right to modify or discontinue services, with advance notice for material changes." },
    { title: "5. Liability Limitation", content: "To the maximum extent permitted by law, WLR is not liable for any indirect or incidental damages." },
    { title: "6. Dispute Resolution", content: "This agreement is governed by the laws of the People's Republic of China. Disputes shall be submitted to Shanghai Arbitration Commission." },
  ]

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <span className="text-white font-bold text-lg">WLR Talent Radar</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="text-slate-400 hover:text-white text-sm">{isZh ? "隐私政策" : "Privacy"}</Link>
            <Link href="/login" className="px-4 py-2 text-white hover:bg-white/10 rounded text-sm">{isZh ? "登录" : "Login"}</Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <FileText className="w-12 h-12 text-sky-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">{isZh ? "用户协议" : "Terms of Service"}</h1>
          <p className="text-slate-400">{isZh ? "最后更新：2026年5月" : "Last updated: May 2026"}</p>
        </div>

        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">{s.title}</h2>
              <p className="text-slate-400 leading-relaxed">{s.content}</p>
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
'''

# 5. /search page (redirect to /searches)
search_page = '''"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SearchRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/searches")
  }, [router])
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
    </main>
  )
}
'''

# 6. /evaluations page (redirect to /assessments)
evaluations_page = '''"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EvaluationsRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/assessments")
  }, [router])
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
    </main>
  )
}
'''

# 7. /jobs/manage page
jobs_manage_page = '''"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n"
import { Zap, Plus, Search, Briefcase, MapPin, DollarSign, Calendar, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface Job {
  id: string
  title: string
  department: string
  location: string
  salary: string
  status: "active" | "paused" | "closed"
  applicants: number
  postedAt: string
}

const MOCK_JOBS: Job[] = [
  { id: "J-001", title: "Senior Wind Turbine Engineer", department: "Wind Energy R&D", location: "Copenhagen, Denmark", salary: "$120k - $160k", status: "active", applicants: 23, postedAt: "2026-05-15" },
  { id: "J-002", title: "Battery Management System Lead", department: "Battery Technology", location: "Shanghai, China", salary: "¥80万 - ¥120万/年", status: "active", applicants: 18, postedAt: "2026-05-10" },
  { id: "J-003", title: "Energy Storage Solutions Architect", department: "Energy Storage", location: "Austin, USA", salary: "$140k - $190k", status: "active", applicants: 12, postedAt: "2026-05-08" },
  { id: "J-004", title: "Offshore Wind Project Manager", department: "Offshore Wind", location: "Oslo, Norway", salary: "€100k - €140k", status: "paused", applicants: 7, postedAt: "2026-04-20" },
  { id: "J-005", title: "Solid-State Battery Researcher", department: "Battery R&D", location: "Tokyo, Japan", salary: "¥1000万 - ¥1500万/年", status: "active", applicants: 31, postedAt: "2026-05-20" },
]

export default function JobsManagePage() {
  const { t, language } = useLanguage()
  const isZh = language === 'zh'
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = MOCK_JOBS.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === "all" || j.status === statusFilter
    return matchSearch && matchStatus
  })

  const statusLabel = (s: string) => {
    if (!isZh) return s.charAt(0).toUpperCase() + s.slice(1)
    return { active: "招聘中", paused: "已暂停", closed: "已关闭" }[s] || s
  }

  const statusColor = (s: string) => {
    return { active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", paused: "bg-amber-500/10 text-amber-400 border-amber-500/20", closed: "bg-slate-500/10 text-slate-400 border-slate-500/20" }[s] || ""
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <span className="text-white font-bold text-lg">{t('home.title')}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm">{t('nav.dashboard')}</Link>
            <Link href="/searches" className="text-slate-400 hover:text-white text-sm">{t('nav.search')}</Link>
            <Link href="/settings" className="text-slate-400 hover:text-white text-sm">{t('nav.settings')}</Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-sky-400" />
              {isZh ? "职位管理" : "Job Management"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{isZh ? "管理所有发布的职位需求" : "Manage all published job postings"}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-white text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            {isZh ? "发布新职位" : "Post New Job"}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isZh ? "搜索职位或部门..." : "Search jobs or departments..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            <option value="all">{isZh ? "全部状态" : "All Statuses"}</option>
            <option value="active">{isZh ? "招聘中" : "Active"}</option>
            <option value="paused">{isZh ? "已暂停" : "Paused"}</option>
            <option value="closed">{isZh ? "已关闭" : "Closed"}</option>
          </select>
        </div>

        {/* Jobs table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "职位" : "Job"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "部门" : "Department"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "地点" : "Location"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "薪资" : "Salary"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "状态" : "Status"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "申请" : "Applicants"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "发布日期" : "Posted"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{job.title}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{job.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{job.department}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {job.location}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-slate-500" />
                      {job.salary}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(job.status)}`}>
                        {statusLabel(job.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{job.applicants}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{job.postedAt}</td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{isZh ? "暂无匹配的职位" : "No matching jobs found"}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
'''

# 8. /admin root page
admin_page = '''"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Zap, BarChart3, Users, Briefcase, FileText, Settings, Shield } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

const ADMIN_SECTIONS = [
  { href: "/admin/analytics", label: "Analytics", labelZh: "数据分析", icon: BarChart3, desc: "Platform usage and performance metrics" },
  { href: "/admin/candidates", label: "Candidates", labelZh: "候选人管理", icon: Users, desc: "Review and manage candidate profiles" },
  { href: "/admin/commerce", label: "Commerce", labelZh: "商业化", icon: Briefcase, desc: "Subscription plans and billing" },
  { href: "/admin/orders", label: "Orders", labelZh: "订单管理", icon: FileText, desc: "View and process customer orders" },
  { href: "/admin/reports", label: "Reports", labelZh: "报表中心", icon: FileText, desc: "Generate and export reports" },
  { href: "/admin/stats", label: "Stats", labelZh: "统计概览", icon: BarChart3, desc: "Real-time platform statistics" },
  { href: "/admin/verification", label: "Verification", labelZh: "认证审核", icon: Shield, desc: "Verify enterprise accounts" },
]

export default function AdminPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { language } = useLanguage()
  const isZh = language === 'zh'

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.replace("/dashboard")
    }
  }, [user, router])

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <span className="text-white font-bold text-lg">WLR Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm">Dashboard</Link>
            <Link href="/settings" className="text-slate-400 hover:text-white text-sm">
              <Settings className="w-4 h-4 inline" />
            </Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">{isZh ? "管理员控制台" : "Admin Console"}</h1>
          <p className="text-slate-400">
            {isZh ? "管理平台的各项功能和数据" : "Manage platform features and data"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {ADMIN_SECTIONS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-sky-500/30 hover:bg-white/[0.07] transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                  <s.icon className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{isZh ? s.labelZh : s.label}</h3>
                  <p className="text-slate-400 text-sm">{s.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
'''

files = {
    "about/page.tsx": about_page,
    "talent-map/page.tsx": talent_map_page,
    "privacy/page.tsx": privacy_page,
    "terms/page.tsx": terms_page,
    "search/page.tsx": search_page,
    "evaluations/page.tsx": evaluations_page,
    "jobs/manage/page.tsx": jobs_manage_page,
    "admin/page.tsx": admin_page,
}

for path, content in files.items():
    full_path = os.path.join(BASE, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created: {full_path}")

print("\\nAll 8 missing pages created successfully!")
