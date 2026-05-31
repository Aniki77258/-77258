"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import {
  Factory, Battery, Leaf, Wind, TrendingUp,
  CheckCircle, Award, Calendar, MapPin,
  ArrowRight, Building2, Users, Zap,
  ChevronRight, Star, BarChart3, Globe,
} from "lucide-react"
import Link from "next/link"

// ============================================================
// Mock Case Study Data — 所有案例均为虚构示例
// ============================================================

const CASE_STUDIES = [
  {
    id: "case-wind-001",
    companyType: "wind",
    companyNameZh: "示例企业 A · 中国海上风电领军企业",
    companyNameEn: "Demo Enterprise A · Leading Chinese Offshore Wind",
    industry: "海上风电 · Offshore Wind",
    location: "🇨🇳 中国 · 江苏省",
    challengeZh: "海上风电项目快速扩张，急需 15 名高级空气动力学工程师和叶片设计专家，传统猎头周期长达 6 个月，无法满足项目进度。",
    challengeEn: "Rapid offshore wind project expansion requiring 15 senior aerodynamic engineers & blade design experts. Traditional headhunters take 6+ months, failing project timelines.",
    solutionZh: "使用全球人才雷达扫描 8 个欧洲海上风电强国，通过「技能-项目经验-英语能力」三维匹配，2 周内锁定 23 名高匹配候选人。",
    solutionEn: "Used Global Talent Radar to scan 8 European offshore wind countries. 3D matching (skill-projexp-English) locked 23 high-match candidates within 2 weeks.",
    resultZh: "最终入职 12 名专家，平均招聘周期从 5.2 个月缩短至 1.8 个月，项目提前 3 个月并网。",
    resultEn: "12 experts onboarded. Avg recruitment cycle: 5.2 → 1.8 months. Project grid connection 3 months ahead of schedule.",
    metrics: [
      { labelZh: "招聘周期缩短", labelEn: "Time-to-Hire Reduced", value: "65%", color: "emerald" },
      { labelZh: "候选人匹配度", labelEn: "Candidate Match Score", value: "94%", color: "blue" },
      { labelZh: "项目提前并网", labelEn: "Early Grid Connection", value: "3月", color: "purple" },
    ],
    tags: ["风能叶片", "海上风电", "空气动力学", "欧洲人才", "Wind Blade", "Offshore Wind"],
    disclaimer: true,
  },
  {
    id: "case-lithium-001",
    companyType: "lithium",
    companyNameZh: "示例企业 B · 全球 Top 5 锂电制造商",
    companyNameEn: "Demo Enterprise B · Global Top 5 Li-battery Manufacturer",
    industry: "锂电储能 · Li-battery ESS",
    location: "🇩🇪 德国 · 图林根州",
    challengeZh: "欧洲本土化工厂建设，需招聘 42 名锂电 PACK 工艺工程师和 BMS 软件架构师，本地人才市场供给严重不足。",
    challengeEn: "European localization factory construction requiring 42 Li-battery PACK process engineers & BMS software architects. Local talent supply severely insufficient.",
    solutionZh: "通过平台 AI 评估报告批量筛选亚太地区锂电人才，视频面试跨时区排程功能减少 80% 沟通成本，薪酬谈判模块提供中德两地对标数据。",
    solutionEn: "Batch AI assessment reports for APAC Li-battery talent. Video interview cross-timezone scheduling reduced communication cost by 80%. Compensation module provided CN-DE benchmarking data.",
    resultZh: "6 个月内完成 38 名核心岗位入职，其中 60% 为跨语言/跨文化候选人，工厂如期投产。",
    resultEn: "38 core positions filled within 6 months, 60% cross-language/cross-culture candidates. Factory launched on schedule.",
    metrics: [
      { labelZh: "核心岗位填充率", labelEn: "Core Positions Filled", value: "90%", color: "emerald" },
      { labelZh: "跨文化入职成功率", labelEn: "Cross-Culture Onboard Success", value: "95%", color: "blue" },
      { labelZh: "沟通成本降低", labelEn: "Comm. Cost Reduced", value: "80%", color: "purple" },
    ],
    tags: ["锂电 PACK", "BMS", "欧洲本地化", "跨文化招聘", "Li PACK", "BMS", "Cross-culture"],
    disclaimer: true,
  },
  {
    id: "case-ess-001",
    companyType: "ess",
    companyNameZh: "示例企业 C · 北美储能系统集成商",
    companyNameEn: "Demo Enterprise C · North American ESS Integrator",
    industry: "储能系统 · Energy Storage System",
    location: "🇺🇸 美国 · 德克萨斯州",
    challengeZh: "美国大储市场爆发，需在 4 个月内招募 18 名系统架构师和现场调试工程师，传统招聘渠道响应极慢。",
    challengeEn: "US utility-scale storage market booming. Need 18 system architects & field commissioning engineers within 4 months. Traditional channels too slow.",
    solutionZh: "使用人才地图热力图定位德州本地+加州迁移人才，AI 评估报告的「项目经验匹配度」维度精准识别有大型储能项目交付经验的候选人。",
    solutionEn: "Used talent map heatmap to locate Texas local + California relocatable talent. AI assessment 'project experience match' dimension precisely identified candidates with large-scale ESS delivery experience.",
    resultZh: "18 名岗位全部在 3.5 个月内关闭，其中 14 名候选人计分卡评分超过 90 分，客户项目交付零延误。",
    resultEn: "All 18 positions closed within 3.5 months. 14 candidates scored 90+ on assessment scorecard. Zero project delivery delay.",
    metrics: [
      { labelZh: "岗位关闭周期", labelEn: "Position Close Cycle", value: "3.5月", color: "emerald" },
      { labelZh: "高评分候选人占比", labelEn: "High-Score Candidate %", value: "78%", color: "blue" },
      { labelZh: "项目交付零延误", labelEn: "Zero Project Delay", value: "100%", color: "purple" },
    ],
    tags: ["储能系统", "大储", "系统架构", "现场调试", "ESS", "BESS", "Commissioning"],
    disclaimer: true,
  },
]

const MORE_CASES = [
  {
    icon: Wind, color: "blue",
    titleZh: "欧洲风电运维人才批量招募",
    titleEn: "European Wind O&M Talent Batch Recruitment",
    descZh: "某欧洲风电运营商 3 个月内招募 52 名运维工程师，覆盖 4 个国家",
    descEn: "A European wind operator recruited 52 O&M engineers across 4 countries within 3 months",
    tag: "示例",
  },
  {
    icon: Battery, color: "green",
    titleZh: "锂电研发团队海外专家引进",
    titleEn: "Li-battery R&D Team Overseas Expert Intro",
    descZh: "某中国锂电研发机构引进 8 名海外固态电池专家，平台匹配准确率 92%",
    descEn: "A Chinese Li-battery R&D institute hired 8 overseas solid-state battery experts, 92% match accuracy",
    tag: "示例",
  },
  {
    icon: Leaf, color: "emerald",
    titleZh: "澳洲储能系统集成项目交付团队组建",
    titleEn: "Australian ESS System Integration Project Team Build",
    descZh: "澳洲某储能集成商 5 个月组建 30 人交付团队，覆盖工程/采购/项目管理",
    descEn: "Australian ESS integrator built 30-person delivery team in 5 months, covering eng/procurement/PM",
    tag: "示例",
  },
]

// ============================================================
// 子组件
// ============================================================

function CaseCard({ study, lang }: { study: typeof CASE_STUDIES[0], lang: 'zh' | 'en' }) {
  const gradientMap: Record<string, string> = {
    wind: "from-blue-600/20 to-cyan-600/10 border-blue-500/20 hover:border-blue-400/40",
    lithium: "from-green-600/20 to-emerald-600/10 border-green-500/20 hover:border-green-400/40",
    ess: "from-purple-600/20 to-violet-600/10 border-purple-500/20 hover:border-purple-400/40",
  }
  const iconMap: Record<string, typeof Wind> = { wind: Factory, lithium: Battery, ess: Leaf }

  const Icon = iconMap[study.companyType] || Factory

  return (
    <div className={`relative bg-gradient-to-br ${gradientMap[study.companyType]} border rounded-2xl p-8 transition-all group`}>
      {/* 示例标注 */}
      {study.disclaimer && (
        <div className="absolute top-4 right-4 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400 font-medium">
          {lang === 'zh' ? '示例案例' : 'Demo Case'}
        </div>
      )}

      {/* 企业信息 */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-2xl bg-${study.companyType === 'wind' ? 'blue' : study.companyType === 'lithium' ? 'green' : 'purple'}-500/20 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${study.companyType === 'wind' ? 'blue' : study.companyType === 'lithium' ? 'green' : 'purple'}-400`} />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">
            {lang === 'zh' ? study.companyNameZh : study.companyNameEn}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>{study.industry}</span>
            <span>·</span>
            <span>{study.location}</span>
          </div>
        </div>
      </div>

      {/* 挑战 → 方案 → 结果 */}
      <div className="space-y-4 mb-6">
        <div className="bg-slate-900/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">Challenge</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === 'zh' ? study.challengeZh : study.challengeEn}
          </p>
        </div>
        <div className="flex justify-center">
          <ArrowRight className="w-5 h-5 text-slate-600" />
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Solution</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === 'zh' ? study.solutionZh : study.solutionEn}
          </p>
        </div>
        <div className="flex justify-center">
          <ArrowRight className="w-5 h-5 text-slate-600" />
        </div>
        <div className="bg-slate-900/60 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Result</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            {lang === 'zh' ? study.resultZh : study.resultEn}
          </p>
        </div>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {study.metrics.map((m, i) => (
          <div key={i} className="bg-slate-900/80 rounded-lg p-3 text-center">
            <div className={`text-xl font-black text-${m.color}-400`}>{m.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{lang === 'zh' ? m.labelZh : m.labelEn}</div>
          </div>
        ))}
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-2">
        {study.tags.map((tag, i) => (
          <span key={i} className="px-2 py-0.5 bg-slate-800/80 border border-slate-700/50 rounded-full text-xs text-slate-400">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function MoreCaseCard({ study, lang }: { study: typeof MORE_CASES[0], lang: 'zh' | 'en' }) {
  const Icon = study.icon
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all group cursor-default">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl bg-${study.color}-500/20 flex items-center justify-center`}>
          <Icon className={`w-5 h-5 text-${study.color}-400`} />
        </div>
        <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400">
          {lang === 'zh' ? '示例' : 'Demo'}
        </span>
      </div>
      <h4 className="text-white font-bold mb-2 leading-snug">{lang === 'zh' ? study.titleZh : study.titleEn}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{lang === 'zh' ? study.descZh : study.descEn}</p>
    </div>
  )
}

// ============================================================
// 主页面
// ============================================================

export default function CaseStudiesPage() {
  const { t, tk, language } = useLanguage()
  const lang = language as 'zh' | 'en'
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? CASE_STUDIES : CASE_STUDIES.filter(s => s.companyType === filter)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-purple-900/20" />
        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
            <BarChart3 className="w-4 h-4" />
            {lang === 'zh' ? '案例展示 · 示例数据' : 'Case Studies · Demo Data'}
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            {lang === 'zh' ? (
              <>客户成功<span className="text-blue-400">示例案例</span></>
            ) : (
              <>Customer Success <span className="text-blue-400">Demo Cases</span></>
            )}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            {lang === 'zh'
              ? '以下案例均为虚构示例，用于展示平台在各场景下的应用效果。不构成任何客户背书或真实业绩承诺。'
              : 'All cases below are fictional demonstrations showcasing platform application scenarios. Not real client endorsements or performance commitments.'}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/demo">
              <Button size="lg" className="text-base px-8 py-6 bg-blue-600 hover:bg-blue-700">
                {lang === 'zh' ? '查看产品演示' : 'View Product Demo'} <ArrowRight className="w-5 h-5 ml-2" />
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

      {/* ─── 筛选器 ─── */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {[
            { key: 'all', zh: '全部案例', en: 'All Cases' },
            { key: 'wind', zh: '🌬️ 风能', en: '🌬️ Wind' },
            { key: 'lithium', zh: '🔋 锂电', en: '🔋 Lithium' },
            { key: 'ess', zh: '🔋 储能', en: '🔋 ESS' },
          ].map(opt => (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === opt.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800/80 text-slate-400 border border-slate-700/50 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              {lang === 'zh' ? opt.zh : opt.en}
            </button>
          ))}
        </div>
      </section>

      {/* ─── 核心案例 ─── */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-10 text-center">
          {lang === 'zh' ? '核心案例详情' : 'Core Case Details'}
        </h2>
        <div className="space-y-10">
          {filtered.map((study, i) => (
            <div key={study.id}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-black text-slate-800">0{i + 1}</span>
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs text-slate-600 font-mono">{study.id}</span>
              </div>
              <CaseCard study={study} lang={lang} />
            </div>
          ))}
        </div>
      </section>

      {/* ─── 更多案例 ─── */}
      <section className="bg-slate-800/20 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            {lang === 'zh' ? '更多示例案例' : 'More Demo Cases'}
          </h2>
          <p className="text-slate-400 text-center mb-10 max-w-2xl mx-auto">
            {lang === 'zh'
              ? '以下为平台可支持的更多应用场景示例，所有数据均为虚构演示'
              : 'More demo scenarios the platform can support. All data are fictional demonstrations.'}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MORE_CASES.map((study, i) => (
              <MoreCaseCard key={i} study={study} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 方法论说明 ─── */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">
                {lang === 'zh' ? '案例方法论说明' : 'Case Methodology Disclaimer'}
              </h3>
            </div>
            <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
              <p>
                {lang === 'zh'
                  ? '本页面展示的所有案例均为虚构示例（Fictional Demo Cases），由平台产品团队基于行业公开数据和合理假设构建，用于展示产品在各应用场景下的功能与价值。'
                  : 'All cases displayed on this page are fictional demo cases constructed by the product team based on public industry data and reasonable assumptions, used to showcase product features and value across application scenarios.'}
              </p>
              <p>
                {lang === 'zh'
                  ? '示例案例不代表任何真实企业、真实个人或真实招聘结果。案例中的企业名称、人才数据、时间周期和量化结果均为演示目的而设计，不构成业绩承诺、不代表平台当前或未来的真实服务能力。'
                  : 'Demo cases do not represent any real enterprise, real individual, or real recruitment outcome. Enterprise names, talent data, time cycles, and quantitative results in cases are designed for demonstration purposes only, not performance commitments.'}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { zh: '虚构企业名称', en: 'Fictional enterprise names' },
                  { zh: '非真实招聘数据', en: 'Not real recruitment data' },
                  { zh: '不构成业绩承诺', en: 'Not performance commitment' },
                  { zh: '仅用于功能展示', en: 'For feature demonstration only' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500/60" />
                    {lang === 'zh' ? item.zh : item.en}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-slate-800/30 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {lang === 'zh' ? '想看看您的企业适合哪种方案？' : 'Want to see which solution fits your enterprise?'}
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            {lang === 'zh'
              ? '注册账号，体验完整 6 大模块，或预约专属演示'
              : 'Register to experience all 6 core modules, or book a dedicated demo'}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 py-6 bg-blue-600 hover:bg-blue-700">
                {lang === 'zh' ? '免费注册体验' : 'Register Free'} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 border-slate-600 text-slate-300 hover:bg-slate-800">
                {lang === 'zh' ? '返回产品演示' : 'Back to Demo'} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GTR</span>
            </div>
            <span className="text-slate-400 text-sm">Global Wind & Lithium Talent Radar</span>
          </div>
          <p className="text-slate-600 text-xs">
            © 2026 GTR · {lang === 'zh' ? '示例展示页面 · 不构成客户背书' : 'Demo showcase · Not client endorsement'}
          </p>
        </div>
      </footer>
    </div>
  )
}
