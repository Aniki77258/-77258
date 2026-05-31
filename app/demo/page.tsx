"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import {
  Search, Calendar, ClipboardCheck, Handshake, FileText, BarChart3,
  Play, ArrowRight, CheckCircle, Shield, Database, Globe,
  Zap, TrendingUp, Users, Building2, Mail, Phone,
  ChevronRight, Star, Eye, Target, Award, Clock
} from "lucide-react"
import Link from "next/link"

// ============================================================
// Mock Data — 平台核心价值主张 & 演示数据
// ============================================================

const VALUE_POINTS = [
  {
    icon: Search,
    titleZh: "全球人才雷达扫描",
    titleEn: "Global Talent Radar Scan",
    descZh: "覆盖 42 个国家/地区，索引 12,000+ 风能锂电领域高潜人才，日均新增 30+ 份简历",
    descEn: "Covering 42 countries/regions, indexing 12,000+ high-potential wind & lithium talents, 30+ new resumes added daily",
    metric: "12,000+",
    metricLabelZh: "索引人才",
    metricLabelEn: "Talents Indexed",
  },
  {
    icon: Target,
    titleZh: "精准匹配算法",
    titleEn: "Precision Matching Algorithm",
    descZh: "IEEE 论文级匹配模型，技能-经验-地域三维评分，匹配准确率 89.7%",
    descEn: "IEEE paper-grade matching model, skill-experience-location 3D scoring, 89.7% match accuracy",
    metric: "89.7%",
    metricLabelZh: "匹配准确率",
    metricLabelEn: "Match Accuracy",
  },
  {
    icon: Globe,
    titleZh: "跨时区协同",
    titleEn: "Cross-Timezone Collaboration",
    descZh: "自动时区转换、视频面试排程、多语言 Offer 生成，支持中/英/德三语界面",
    descEn: "Auto timezone conversion, video interview scheduling, multi-language Offer generation, CN/EN/DE trilingual UI",
    metric: "18",
    metricLabelZh: "时区自动适配",
    metricLabelEn: "Timezone Auto-Adapt",
  },
  {
    icon: Shield,
    titleZh: "合规与数据可信",
    titleEn: "Compliance & Data Trust",
    descZh: "GDPR/PIPL 双合规框架，学者主页 ORCID 认证，数据来源可追溯",
    descEn: "GDPR/PIPL dual compliance framework, ORCID verification for researchers, data source traceability",
    metric: "100%",
    metricLabelZh: "合规覆盖",
    metricLabelEn: "Compliance Coverage",
  },
]

const MODULE_DEMOS = [
  {
    id: "talent-search",
    step: "01",
    titleZh: "人才搜索",
    titleEn: "Talent Search",
    descZh: "关键词 + 技能 + 国家三维筛选，实时显示匹配度评分，一键发送邀请",
    descEn: "Keyword + skill + country 3D filtering, real-time match score, one-click invitation",
    route: "/candidates",
    color: "blue",
  },
  {
    id: "interview",
    step: "02",
    titleZh: "面试管理",
    titleEn: "Interview Management",
    descZh: "跨时区自动排程，面试类型模板（技术/HR/终面），候选人时区自动转换",
    descEn: "Cross-timezone auto-scheduling, interview type templates, candidate timezone auto-conversion",
    route: "/interviews",
    color: "purple",
  },
  {
    id: "assessment",
    step: "03",
    titleZh: "人才评估",
    titleEn: "Talent Assessment",
    descZh: "AI 多维评估报告，技术能力/领导力/文化匹配三维评分，支持PDF导出",
    descEn: "AI multi-dimensional assessment, technical/leadership/culture 3D scoring, PDF export",
    route: "/assessments",
    color: "green",
  },
  {
    id: "negotiation",
    step: "04",
    titleZh: "薪酬谈判",
    titleEn: "Compensation Negotiation",
    descZh: "Base+Bonus+Equity 三维度谈判策略，中/美/欧/新 四地薪酬对标",
    descEn: "Base+Bonus+Equity 3D negotiation strategy, CN/US/EU/SG compensation benchmarking",
    route: "/negotiations",
    color: "amber",
  },
  {
    id: "offer",
    step: "05",
    titleZh: "Offer 管理",
    titleEn: "Offer Management",
    descZh: "中英双语 Offer 模板，审批流合规审核，接受率实时追踪",
    descEn: "CN/EN bilingual Offer templates, compliance approval workflow, acceptance rate tracking",
    route: "/offers",
    color: "rose",
  },
  {
    id: "analytics",
    step: "06",
    titleZh: "数据分析",
    titleEn: "Data Analytics",
    descZh: "招聘漏斗可视化，渠道效果分析，人才地图热力图，留存率预测",
    descEn: "Recruitment funnel visualization, channel effectiveness, talent map heatmap, retention prediction",
    route: "/admin/analytics",
    color: "cyan",
  },
]

const SEARCH_DEMO_DATA = {
  query: "风能叶片设计 10年+ 欧洲",
  results: [
    { name: "Dr. Anna Kowalski", titleZh: "高级叶片结构工程师", titleEn: "Senior Blade Structural Engineer", country: "🇩🇪 德国", match: 96, exp: "12年", verified: true },
    { name: "Prof. James O'Connor", titleZh: "风能空气动力学首席专家", titleEn: "Chief Wind Aerodynamics Expert", country: "🇮🇪 爱尔兰", match: 94, exp: "18年", verified: true },
    { name: "李晓明", titleZh: "海上风电项目经理", titleEn: "Offshore Wind Project Manager", country: "🇨🇳 中国", match: 91, exp: "10年", verified: true },
    { name: "Dr. Sarah Chen", titleZh: "复合材料研发总监", titleEn: "Composites R&D Director", country: "🇺🇸 美国", match: 89, exp: "14年", verified: false },
  ]
}

const PIPELINE_DEMO = [
  { stage: "搜索", stageEn: "Search", count: 847, rate: null, color: "#3b82f6" },
  { stage: "查看", stageEn: "View", count: 523, rate: "61.7%", color: "#8b5cf6" },
  { stage: "邀请", stageEn: "Invite", count: 198, rate: "37.9%", color: "#10b981" },
  { stage: "面试", stageEn: "Interview", count: 87, rate: "43.9%", color: "#f59e0b" },
  { stage: "评估", stageEn: "Assess", count: 64, rate: "73.6%", color: "#ec4899" },
  { stage: "谈判", stageEn: "Negotiate", count: 41, rate: "64.1%", color: "#06b6d4" },
  { stage: "Offer", stageEn: "Offer", count: 28, rate: "68.3%", color: "#84cc16" },
]

// ============================================================
// 子组件
// ============================================================

function ValueCard({ point, lang }: { point: typeof VALUE_POINTS[0], lang: 'zh' | 'en' }) {
  const Icon = point.icon
  return (
    <div className="relative bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-slate-800/90 transition-all group">
      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
        <Icon className="w-7 h-7 text-blue-400" />
      </div>
      <div className="text-4xl font-black text-blue-400/30 absolute top-6 right-8">
        {point.metric}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">
        {lang === 'zh' ? point.titleZh : point.titleEn}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4">
        {lang === 'zh' ? point.descZh : point.descEn}
      </p>
      <div className="text-xs text-blue-400 font-medium">
        {lang === 'zh' ? point.metricLabelZh : point.metricLabelEn}: {point.metric}
      </div>
    </div>
  )
}

function ModuleCard({ mod, lang }: { mod: typeof MODULE_DEMOS[0], lang: 'zh' | 'en' }) {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30 hover:border-blue-400/60",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30 hover:border-purple-400/60",
    green: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 hover:border-emerald-400/60",
    amber: "from-amber-500/20 to-amber-600/5 border-amber-500/30 hover:border-amber-400/60",
    rose: "from-rose-500/20 to-rose-600/5 border-rose-500/30 hover:border-rose-400/60",
    cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30 hover:border-cyan-400/60",
  }
  return (
    <Link href={mod.route} className={`block relative overflow-hidden bg-gradient-to-br ${colorMap[mod.color]} border rounded-2xl p-6 transition-all group`}>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-5xl font-black text-white/5 absolute right-4 top-2">{mod.step}</span>
        <div className={`w-10 h-10 rounded-xl bg-${mod.color}-500/20 flex items-center justify-center`}>
          <Play className={`w-5 h-5 text-${mod.color}-400`} />
        </div>
        <span className="text-xs font-mono text-slate-500">{mod.id}</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{lang === 'zh' ? mod.titleZh : mod.titleEn}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
        {lang === 'zh' ? mod.descZh : mod.descEn}
      </p>
      <div className="flex items-center text-sm text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        {lang === 'zh' ? '进入演示' : 'Enter Demo'} <ChevronRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  )
}

function SearchDemo({ lang }: { lang: 'zh' | 'en' }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
      {/* 模拟搜索栏 */}
      <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <div className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-300">
              {SEARCH_DEMO_DATA.query}
            </div>
          </div>
          <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors">
            {lang === 'zh' ? '搜索' : 'Search'}
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          {['风能叶片', '欧洲', '10年+', 'PhD'].map(tag => (
            <span key={tag} className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs">{tag}</span>
          ))}
        </div>
      </div>
      {/* 模拟结果列表 */}
      <div className="p-6 space-y-3">
        {SEARCH_DEMO_DATA.results.map((r, i) => (
          <div key={i} className="flex items-center gap-4 bg-slate-900/50 border border-slate-700/30 rounded-xl p-4 hover:border-blue-500/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-blue-400">
              {r.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">{r.name}</span>
                {r.verified && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              </div>
              <div className="text-slate-400 text-xs">{lang === 'zh' ? r.titleZh : r.titleEn} · {r.country} · {r.exp}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                r.match >= 95 ? 'bg-emerald-500/20 text-emerald-400' :
                r.match >= 90 ? 'bg-blue-500/20 text-blue-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {r.match}%
              </div>
              <button className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-medium transition-colors">
                {lang === 'zh' ? '邀请' : 'Invite'}
              </button>
            </div>
          </div>
        ))}
        <div className="text-center pt-2">
          <span className="text-xs text-slate-500">{lang === 'zh' ? '以上为示例数据，登录后查看完整 12,000+ 人才库' : 'Demo data shown. 12,000+ talents available after login.'}</span>
        </div>
      </div>
    </div>
  )
}

function PipelineDemo({ lang }: { lang: 'zh' | 'en' }) {
  const maxCount = Math.max(...PIPELINE_DEMO.map(d => d.count))
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
      <h4 className="text-white font-bold mb-6">{lang === 'zh' ? '招聘转化漏斗（示例数据）' : 'Recruitment Funnel (Demo Data)'}</h4>
      <div className="space-y-3">
        {PIPELINE_DEMO.map((stage, i) => (
          <div key={i} className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-slate-300 font-medium">{lang === 'zh' ? stage.stage : stage.stageEn}</span>
              <div className="flex items-center gap-3">
                {stage.rate && <span className="text-xs text-emerald-400">{stage.rate}</span>}
                <span className="text-sm text-white font-bold w-12 text-right">{stage.count}</span>
              </div>
            </div>
            <div className="w-full h-8 bg-slate-900/80 rounded-lg overflow-hidden">
              <div
                className="h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-3"
                style={{ width: `${(stage.count / maxCount) * 100}%`, backgroundColor: stage.color, opacity: 0.85 }}
              >
                <span className="text-xs font-bold text-white drop-shadow">{stage.count}</span>
              </div>
            </div>
            {i < PIPELINE_DEMO.length - 1 && (
              <div className="flex justify-center my-1">
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// 主页面
// ============================================================

export default function DemoPage() {
  const { t, tk, language } = useLanguage()
  const lang = language as 'zh' | 'en'
  const [showBooking, setShowBooking] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-purple-900/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(59,130,246,0.08) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(139,92,246,0.08) 0%, transparent 50%)'
        }} />
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
            <Eye className="w-4 h-4" />
            {lang === 'zh' ? '产品演示' : 'Product Demo'}
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            {lang === 'zh' ? (
              <>体验 <span className="text-blue-400">全球风能锂电</span> 人才雷达</>
            ) : (
              <>Experience the <span className="text-blue-400">Global Wind & Lithium</span> Talent Radar</>
            )}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            {lang === 'zh'
              ? '6 大核心模块交互演示 · 示例数据驱动 · 可登录体验完整功能'
              : '6 core modules interactive demo · Driven by demo data · Login to experience full features'}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 py-6 bg-blue-600 hover:bg-blue-700">
                {lang === 'zh' ? '立即注册体验' : 'Register to Experience'} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={() => setShowBooking(true)}
            >
              {lang === 'zh' ? '预约专属演示' : 'Book a Demo'} <Mail className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 核心价值 ─── */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-white mb-3">
            {lang === 'zh' ? '平台核心价值' : 'Platform Core Value'}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {lang === 'zh'
              ? '为全球新能源企业提供端到端的人才获取、评估与招聘数字化解决方案'
              : 'End-to-end talent acquisition, assessment, and recruitment digital solution for global new energy enterprises'}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUE_POINTS.map((vp, i) => (
            <ValueCard key={i} point={vp} lang={lang} />
          ))}
        </div>
      </section>

      {/* ─── 六大模块演示入口 ─── */}
      <section className="bg-slate-800/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">
              {lang === 'zh' ? '六大核心模块' : 'Six Core Modules'}
            </h2>
            <p className="text-slate-400">
              {lang === 'zh' ? '点击任意模块进入交互演示' : 'Click any module to enter interactive demo'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULE_DEMOS.map((mod, i) => (
              <ModuleCard key={i} mod={mod} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 人才搜索演示 ─── */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {lang === 'zh' ? '人才搜索演示' : 'Talent Search Demo'}
            </h2>
            <p className="text-slate-400 text-sm">
              {lang === 'zh' ? '示例搜索「风能叶片设计 10年+ 欧洲」' : 'Demo search: "Wind Blade Design 10y+ Europe"'}
            </p>
          </div>
        </div>
        <SearchDemo lang={lang} />
      </section>

      {/* ─── 招聘流程演示 ─── */}
      <section className="bg-slate-800/30 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {lang === 'zh' ? '招聘转化漏斗演示' : 'Recruitment Funnel Demo'}
              </h2>
              <p className="text-slate-400 text-sm">
                {lang === 'zh' ? '示例企业 30 天招聘数据' : 'Demo enterprise 30-day recruitment data'}
              </p>
            </div>
          </div>
          <div className="max-w-3xl">
            <PipelineDemo lang={lang} />
          </div>
          {/* 指标说明 */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {[
              { labelZh: '总搜索量', labelEn: 'Total Searches', value: '847', icon: Search },
              { labelZh: '面试安排', labelEn: 'Interviews Set', value: '87', icon: Calendar },
              { labelZh: 'Offer 发出', labelEn: 'Offers Sent', value: '28', icon: FileText },
              { labelZh: '最终入职', labelEn: 'Final Onboard', value: '19', icon: CheckCircle },
            ].map((s, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
                <s.icon className="w-5 h-5 text-slate-500" />
                <div>
                  <div className="text-lg font-bold text-white">{s.value}</div>
                  <div className="text-xs text-slate-500">{lang === 'zh' ? s.labelZh : s.labelEn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 数据真实性说明 ─── */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">
                {lang === 'zh' ? '数据真实性与合规性说明' : 'Data Authenticity & Compliance Statement'}
              </h2>
            </div>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                {lang === 'zh'
                  ? '本平台演示页面所展示的所有数据均为示例数据（Demo Data），用于展示产品功能与交互流程。示例数据不代表任何真实个人、企业或招聘结果。'
                  : 'All data displayed on this demo page are demo data, used to showcase product features and interaction flows. Demo data does not represent any real individual, enterprise, or recruitment outcome.'}
              </p>
              <p>
                {lang === 'zh'
                  ? '平台正式上线后，所有人才数据将通过公开学术数据库（IEEE Xplore、Google Scholar、ORCID）、开源代码库（GitHub）、职业社交平台（LinkedIn 公开资料）等合法渠道获取，并严格遵守 GDPR 与《中华人民共和国个人信息保护法》（PIPL）之规定。'
                  : 'Upon official launch, all talent data will be sourced from legitimate channels including public academic databases (IEEE Xplore, Google Scholar, ORCID), open-source repositories (GitHub), and professional platforms (public LinkedIn profiles), in strict compliance with GDPR and PIPL.'}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { labelZh: '公开学术数据', labelEn: 'Public Academic Data', ok: true },
                  { labelZh: '开源代码贡献', labelEn: 'Open-Source Contributions', ok: true },
                  { labelZh: 'GDPR 合规', labelEn: 'GDPR Compliant', ok: true },
                  { labelZh: 'PIPL 合规', labelEn: 'PIPL Compliant', ok: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <CheckCircle className={`w-4 h-4 ${item.ok ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={item.ok ? 'text-slate-300' : 'text-slate-600'}>
                      {lang === 'zh' ? item.labelZh : item.labelEn}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 预约演示 CTA ─── */}
      <section className="bg-slate-800/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {lang === 'zh' ? '准备好体验完整功能了吗？' : 'Ready to experience the full platform?'}
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            {lang === 'zh'
              ? '注册即可体验完整 6 大模块，或预约专属演示，由产品团队为您深度讲解'
              : 'Register to experience all 6 modules, or book a dedicated demo with our product team'}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 py-6 bg-blue-600 hover:bg-blue-700">
                {lang === 'zh' ? '免费注册' : 'Register Free'} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/pitch">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 border-slate-600 text-slate-300 hover:bg-slate-800">
                {lang === 'zh' ? '查看融资展示' : 'View Pitch Deck'} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 预约演示弹窗 ─── */}
      {showBooking && (
        <BookingModal lang={lang} onClose={() => setShowBooking(false)} />
      )}
    </div>
  )
}

// ============================================================
// 预约演示弹窗
// ============================================================

function BookingModal({ lang, onClose }: { lang: 'zh' | 'en', onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(onClose, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-8">
        {submitted ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {lang === 'zh' ? '预约成功！' : 'Booking Successful!'}
            </h3>
            <p className="text-slate-400 text-sm">
              {lang === 'zh' ? '我们的团队将在 24 小时内与您联系' : 'Our team will contact you within 24 hours'}
            </p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-white mb-6">
              {lang === 'zh' ? '预约产品演示' : 'Book a Product Demo'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required placeholder={lang === 'zh' ? '姓名 *' : 'Name *'}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                required type="email" placeholder="Email *"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <input
                required placeholder={lang === 'zh' ? '公司名称 *' : 'Company Name *'}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
              />
              <select
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="">{lang === 'zh' ? '您的角色' : 'Your Role'}</option>
                <option value="HR">{lang === 'zh' ? '人力资源/招聘负责人' : 'HR / Talent Acquisition'}</option>
                <option value="CEO">{lang === 'zh' ? 'CEO / 创始人' : 'CEO / Founder'}</option>
                <option value="CTO">{lang === 'zh' ? 'CTO / 技术负责人' : 'CTO / Tech Lead'}</option>
                <option value="Other">{lang === 'zh' ? '其他' : 'Other'}</option>
              </select>
              <textarea
                rows={3}
                placeholder={lang === 'zh' ? '您希望了解的功能（选填）' : 'Features you are interested in (optional)'}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none"
                value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
              />
              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  {lang === 'zh' ? '提交预约' : 'Submit Booking'}
                </Button>
                <Button type="button" variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
                  {lang === 'zh' ? '取消' : 'Cancel'}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
