"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n"
import {
  TrendingUp, Globe, Shield, Zap, DollarSign, Users,
  Building2, Target, Award, CheckCircle, ChevronRight,
  Mail, Phone, MapPin, Linkedin, Calendar, BarChart3,
  Lightbulb, Factory, Battery, Leaf, ArrowRight, Star,
  Database, FileText, Send,
} from "lucide-react"
import Link from "next/link"

// ============================================================
// Mock Data — 融资展示数据
// ============================================================

const MARKET_DATA = {
  tam: { value: "8,500", unitZh: "亿美元", unitEn: "USD B", labelZh: "全球新能源人才服务市场", labelEn: "Global New Energy Talent Service Market" },
  growth: { value: "23.5", unitZh: "% CAGR", unitEn: "% CAGR", labelZh: "2025-2030 预测增长率", labelEn: "2025-2030 Projected CAGR" },
  talentShortage: { value: "120", unitZh: "万人才缺口", unitEn: "M talent shortage", labelZh: "全球风能锂电人才缺口", labelEn: "Global Wind & Li Battery Talent Gap" },
  digitalRate: { value: "18", unitZh: "% 数字化率", unitEn: "% digitalization", labelZh: "中小新能源企业招聘数字化率", labelEn: "SME recruitment digitalization rate" },
}

const PAIN_POINTS = [
  { icon: "🔍", zh: "全球人才分布分散，缺乏精准搜索工具", en: "Global talent scattered, lack of precision search tools" },
  { icon: "🌍", zh: "跨时区、跨语言招聘流程管理困难", en: "Cross-timezone, cross-language recruitment hard to manage" },
  { icon: "📊", zh: "人才评估依赖主观判断，缺乏数据支撑", en: "Talent assessment relies on subjective judgment, lacks data" },
  { icon: "💰", zh: "高端人才薪酬谈判缺乏市场对标数据", en: "Executive compensation negotiation lacks market benchmark data" },
  { icon: "⚖️", zh: "GDPR/PIPL 合规要求复杂，数据使用风险高", en: "GDPR/PIPL compliance complex, high data usage risk" },
]

const SOLUTION_MODULES = [
  { step: "01", zh: "全球人才雷达", en: "Global Talent Radar", descZh: "索引 12,000+ 风能锂电领域学者/工程师，多维度可搜索", descEn: "Index 12,000+ wind & Li battery researchers/engineers, multi-dimension searchable" },
  { step: "02", zh: "智能匹配引擎", en: "AI Matching Engine", descZh: "IEEE 论文级算法，技能-经验-地域三维评分", descEn: "IEEE paper-grade algorithm, skill-exp-location 3D scoring" },
  { step: "03", zh: "端到端招聘流", en: "End-to-End Recruitment", descZh: "邀请→面试→评估→谈判→Offer 全流程数字化", descEn: "Invite→Interview→Assess→Negotiate→Offer full digital flow" },
  { step: "04", zh: "合规数据引擎", en: "Compliance Data Engine", descZh: "GDPR/PIPL 双合规，数据来源可追溯", descEn: "GDPR/PIPL dual compliance, data source traceability" },
]

const BIZ_MODEL = [
  { typeZh: "订阅服务", typeEn: "Subscription SaaS", share: 45, arr: "$2.8M", growth: "+320% YoY", descZh: "企业/猎头按月/年订阅，含额度管理", descEn: "Enterprise/Headhunter monthly/yearly subscription with quota" },
  { typeZh: "AI 报告", typeEn: "AI Report Service", share: 25, arr: "$1.6M", growth: "+180% YoY", descZh: "深度人才评估报告，按份计费", descEn: "Deep talent assessment report, pay-per-report" },
  { typeZh: "数据 API", typeEn: "Data API Access", share: 20, arr: "$1.2M", growth: "+450% YoY", descZh: "企业集成人才数据 API，按调用量计费", descEn: "Enterprise talent data API integration, pay-per-call" },
  { typeZh: "咨询服务", typeEn: "Consulting Service", share: 10, arr: "$0.6M", growth: "+90% YoY", descZh: "高端人才猎头 + 薪酬谈判咨询", descEn: "Executive search + compensation consulting" },
]

const COMPETITIVE_TABLE = {
  headers: { zh: ["维度", "全球风能锂电人才雷达", "传统猎头", "LinkedIn Talent Hub", "通用招聘平台"], en: ["Dimension", "GTR Platform", "Traditional Agency", "LinkedIn Talent Hub", "General ATS"] },
  rows: [
    { zh: "行业深度", en: "Industry Depth", gtr: "⭐⭐⭐⭐⭐", agency: "⭐⭐⭐", linkedin: "⭐⭐", ats: "⭐" },
    { zh: "学术人才覆盖", en: "Academic Talent Coverage", gtr: "⭐⭐⭐⭐⭐", agency: "⭐⭐", linkedin: "⭐⭐", ats: "⭐" },
    { zh: "AI 评估深度", en: "AI Assessment Depth", gtr: "⭐⭐⭐⭐⭐", agency: "⭐", linkedin: "⭐⭐", ats: "⭐" },
    { zh: "跨时区协同", en: "Cross-Timezone", gtr: "⭐⭐⭐⭐", agency: "⭐⭐", linkedin: "⭐⭐⭐", ats: "⭐⭐" },
    { zh: "合规能力", en: "Compliance", gtr: "⭐⭐⭐⭐⭐", agency: "⭐⭐", linkedin: "⭐⭐⭐", ats: "⭐⭐" },
    { zh: "价格透明度", en: "Pricing Transparency", gtr: "⭐⭐⭐⭐⭐", agency: "⭐", linkedin: "⭐⭐⭐", ats: "⭐⭐⭐⭐" },
  ],
}

const TEAM_PLACEHOLDER = [
  { roleZh: "CEO & 联合创始人", roleEn: "CEO & Co-Founder", placeholder: true },
  { roleZh: "CTO & 联合创始人", roleEn: "CTO & Co-Founder", placeholder: true },
  { roleZh: "CPO & 新能源行业顾问", roleEn: "CPO & New Energy Advisor", placeholder: true },
  { roleZh: "首席合规官 CCO", roleEn: "Chief Compliance Officer", placeholder: true },
]

// ============================================================
// 子组件
// ============================================================

function SectionHeading({ number, titleZh, titleEn, subtitleZh, subtitleEn, lang }: {
  number: string, titleZh: string, titleEn: string, subtitleZh?: string, subtitleEn?: string, lang: 'zh' | 'en'
}) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl font-black text-blue-500/20">{number}</span>
        <div className="h-px flex-1 bg-slate-700/50" />
      </div>
      <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{lang === 'zh' ? titleZh : titleEn}</h2>
      {subtitleZh && subtitleEn && (
        <p className="text-slate-400 text-lg">{lang === 'zh' ? subtitleZh : subtitleEn}</p>
      )}
    </div>
  )
}

function MetricCard({ value, unit, labelZh, labelEn, lang, color = "blue" }: {
  value: string, unit: string, labelZh: string, labelEn: string, lang: 'zh' | 'en', color?: string
}) {
  return (
    <div className={`bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 text-center hover:border-${color}-500/30 transition-colors`}>
      <div className={`text-4xl font-black text-${color}-400 mb-1`}>{value}</div>
      <div className={`text-sm text-${color}-300 mb-3`}>{unit}</div>
      <div className="text-slate-400 text-sm">{lang === 'zh' ? labelZh : labelEn}</div>
    </div>
  )
}

// ============================================================
// 主页面
// ============================================================

export default function PitchPage() {
  const { t, tk, language } = useLanguage()
  const lang = language as 'zh' | 'en'
  const [contactSent, setContactSent] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-purple-900/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139,92,246,0.08) 0%, transparent 50%)'
        }} />
        <div className="relative container mx-auto px-4 py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-8">
            <TrendingUp className="w-4 h-4" />
            {lang === 'zh' ? '融资展示 · Investment Pitch' : 'Investment Pitch Deck'}
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            {lang === 'zh' ? (
              <>
                全球 <span className="text-blue-400">风能锂电</span><br />人才搜索雷达
              </>
            ) : (
              <>
                Global <span className="text-blue-400">Wind & Lithium</span><br />Talent Radar
              </>
            )}
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-4 leading-relaxed">
            {lang === 'zh'
              ? '为风能与锂电行业提供精准人才匹配、智能评估与全球化招聘解决方案的 SaaS 平台'
              : 'A SaaS platform providing precision talent matching, intelligent assessment, and global recruitment solutions for the wind & lithium battery industry'}
          </p>
          <p className="text-slate-500 text-sm mb-10">
            {lang === 'zh' ? 'Green Energy Talent Intelligence Platform · 示例数据展示 · 非真实财务数据' : 'Demo data showcase · Not real financial data'}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/demo">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition-colors">
                {lang === 'zh' ? '查看产品演示' : 'View Product Demo'} <ArrowRight className="w-4 h-4 inline ml-2" />
              </button>
            </Link>
            <a href="#contact">
              <button className="px-8 py-3 border border-slate-600 hover:bg-slate-800 rounded-xl text-slate-300 font-medium transition-colors">
                {lang === 'zh' ? '联系我们' : 'Contact Us'} <Mail className="w-4 h-4 inline ml-2" />
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ─── 01 市场机会 ─── */}
      <section className="container mx-auto px-4 py-24" id="market">
        <SectionHeading number="01" titleZh="市场机会" titleEn="Market Opportunity" subtitleZh="全球新能源转型加速，风能锂电人才成为稀缺战略资源" subtitleEn="Global new energy transition accelerating, wind & Li battery talent becoming scarce strategic resource" lang={lang} />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard value={MARKET_DATA.tam.value} unit={lang === 'zh' ? MARKET_DATA.tam.unitZh : MARKET_DATA.tam.unitEn} labelZh={MARKET_DATA.tam.labelZh} labelEn={MARKET_DATA.tam.labelEn} lang={lang} color="blue" />
          <MetricCard value={MARKET_DATA.growth.value} unit={lang === 'zh' ? MARKET_DATA.growth.unitZh : MARKET_DATA.growth.unitEn} labelZh={MARKET_DATA.growth.labelZh} labelEn={MARKET_DATA.growth.labelEn} lang={lang} color="emerald" />
          <MetricCard value={MARKET_DATA.talentShortage.value} unit={lang === 'zh' ? MARKET_DATA.talentShortage.unitZh : MARKET_DATA.talentShortage.unitEn} labelZh={MARKET_DATA.talentShortage.labelZh} labelEn={MARKET_DATA.talentShortage.labelEn} lang={lang} color="amber" />
          <MetricCard value={MARKET_DATA.digitalRate.value} unit={lang === 'zh' ? MARKET_DATA.digitalRate.unitZh : MARKET_DATA.digitalRate.unitEn} labelZh={MARKET_DATA.digitalRate.labelZh} labelEn={MARKET_DATA.digitalRate.labelEn} lang={lang} color="purple" />
        </div>
        {/* 市场 TAM/SAM/SOM 可视化 */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8">
          <h4 className="text-white font-bold mb-6">{lang === 'zh' ? '市场分层（示例估算）' : 'Market Segmentation (Demo Estimation)'}</h4>
          <div className="space-y-5">
            {[
              { labelZh: 'TAM（全球新能源人才服务）', labelEn: 'TAM (Global New Energy Talent Service)', value: 8500, max: 8500, color: 'blue', unit: '$B' },
              { labelZh: 'SAM（风能+锂电专项服务）', labelEn: 'SAM (Wind + Li Battery Dedicated)', value: 2100, max: 8500, color: 'emerald', unit: '$B' },
              { labelZh: 'SOM（可获取市场·5年目标）', labelEn: 'SOM (Serviceable Obtainable · 5yr target)', value: 85, max: 8500, color: 'purple', unit: '$M' },
            ].map((row, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-300">{lang === 'zh' ? row.labelZh : row.labelEn}</span>
                  <span className={`text-sm font-bold text-${row.color}-400`}>{row.value}{row.unit}</span>
                </div>
                <div className="w-full h-4 bg-slate-900/80 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-${row.color}-500 transition-all`} style={{ width: `${(row.value / row.max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">{lang === 'zh' ? '以上为示例估算数据，真实市场数据以第三方研报为准' : 'Demo estimation data above. Real market data subject to 3rd-party research reports.'}</p>
        </div>
      </section>

      {/* ─── 02 行业痛点 ─── */}
      <section className="bg-slate-800/20 py-24" id="painpoints">
        <div className="container mx-auto px-4">
          <SectionHeading number="02" titleZh="行业痛点" titleEn="Industry Pain Points" subtitleZh="传统招聘方式无法解决新能源行业的特殊挑战" subtitleEn="Traditional recruitment cannot solve new energy industry's unique challenges" lang={lang} />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PAIN_POINTS.map((p, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-red-500/20 transition-colors">
                <div className="text-3xl mb-4">{p.icon}</div>
                <p className="text-slate-200 leading-relaxed">{lang === 'zh' ? p.zh : p.en}</p>
              </div>
            ))}
            {/* 补充痛点卡片 */}
            {[
              { icon: "🔒", zh: "企业数据孤岛，历史招聘数据无法复用", en: "Enterprise data silos, historical recruitment data not reusable" },
              { icon: "⏳", zh: "高端人才平均招聘周期 6-9 个月", en: "Executive talent average recruitment cycle 6-9 months" },
              { icon: "📉", zh: "Offer 接受率低于 55%，招聘 ROI 低", en: "Offer acceptance rate below 55%, low recruitment ROI" },
            ].map((p, i) => (
              <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-amber-500/20 transition-colors">
                <div className="text-3xl mb-4">{p.icon}</div>
                <p className="text-slate-200 leading-relaxed">{lang === 'zh' ? p.zh : p.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 03 解决方案 ─── */}
      <section className="container mx-auto px-4 py-24" id="solution">
        <SectionHeading number="03" titleZh="解决方案" titleEn="Our Solution" subtitleZh="四大核心模块构建端到端新能源招聘引擎" subtitleEn="Four core modules building end-to-end new energy recruitment engine" lang={lang} />
        <div className="space-y-6">
          {SOLUTION_MODULES.map((mod, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 flex items-start gap-6 hover:border-blue-500/20 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-2xl font-black text-blue-400/40 shrink-0 group-hover:bg-blue-500/20 transition-colors">
                {mod.step}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{lang === 'zh' ? mod.zh : mod.en}</h3>
                <p className="text-slate-400 leading-relaxed">{lang === 'zh' ? mod.descZh : mod.descEn}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition-colors shrink-0 mt-2" />
            </div>
          ))}
        </div>
      </section>

      {/* ─── 04 产品架构 ─── */}
      <section className="bg-slate-800/20 py-24" id="architecture">
        <div className="container mx-auto px-4">
          <SectionHeading number="04" titleZh="产品架构" titleEn="Product Architecture" subtitleZh="三层架构 · 数据合规 · AI 驱动" subtitleEn="Three-layer architecture · Data compliance · AI-driven" lang={lang} />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { layer: "1", titleZh: "数据采集层", titleEn: "Data Acquisition Layer", itemsZh: ["公开学术数据库（IEEE/Google Scholar/ORCID）", "开源代码库（GitHub/GitLab）", "专业技术社区（Stack Overflow/Reddit）", "合规公开职业资料"], itemsEn: ["Public academic DB (IEEE/Google Scholar/ORCID)", "Open-source repos (GitHub/GitLab)", "Professional communities (Stack Overflow/Reddit)", "Compliant public professional profiles"], color: "blue" },
              { layer: "2", titleZh: "智能处理层", titleEn: "AI Processing Layer", itemsZh: ["NLP 简历解析 + 技能图谱构建", "多维匹配算法（技能×经验×地域）", "AI 评估报告生成（技术/行为/文化）", "跨时区自动排程引擎"], itemsEn: ["NLP resume parsing + skill graph", "Multi-dim matching (skill×exp×location)", "AI assessment report generation", "Cross-timezone auto-scheduling engine"], color: "purple" },
              { layer: "3", titleZh: "应用服务层", titleEn: "Application Service Layer", itemsZh: ["SaaS 订阅管理 + 额度控制", "招聘全流程跟踪（漏斗可视化）", "多币种薪酬谈判辅助", "GDPR/PIPL 合规审计日志"], itemsEn: ["SaaS subscription + quota management", "Full recruitment funnel visualization", "Multi-currency compensation negotiation", "GDPR/PIPL compliance audit logs"], color: "emerald" },
            ].map((layer, i) => (
              <div key={i} className={`bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-${layer.color}-500/30 transition-colors`}>
                <div className={`w-10 h-10 rounded-xl bg-${layer.color}-500/20 flex items-center justify-center text-${layer.color}-400 font-black mb-4`}>L{layer.layer}</div>
                <h3 className="text-lg font-bold text-white mb-4">{lang === 'zh' ? layer.titleZh : layer.titleEn}</h3>
                <ul className="space-y-2">
                  {(lang === 'zh' ? layer.itemsZh : layer.itemsEn).map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-400">
                      <ChevronRight className={`w-4 h-4 text-${layer.color}-400 shrink-0 mt-0.5`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 05 商业模式 ─── */}
      <section className="container mx-auto px-4 py-24" id="business">
        <SectionHeading number="05" titleZh="商业模式" titleEn="Business Model" subtitleZh="多元化收入结构 · 高毛利 SaaS · 可预测收入" subtitleEn="Diversified revenue · High-margin SaaS · Predictable revenue" lang={lang} />
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {BIZ_MODEL.map((bm, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">{lang === 'zh' ? bm.typeZh : bm.typeEn}</h3>
                <span className="text-xs text-slate-500">{bm.share}% {lang === 'zh' ? '营收占比' : 'revenue share'}</span>
              </div>
              <div className="flex items-end gap-4 mb-3">
                <span className="text-3xl font-black text-blue-400">{bm.arr}</span>
                <span className="text-sm text-emerald-400 mb-1">{bm.growth}</span>
              </div>
              <p className="text-sm text-slate-400">{lang === 'zh' ? bm.descZh : bm.descEn}</p>
              <div className="mt-4 w-full h-2 bg-slate-900/80 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${bm.share}%` }} />
              </div>
            </div>
          ))}
        </div>
        {/* 收入模型说明 */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-8">
          <h4 className="text-white font-bold mb-4">{lang === 'zh' ? '收入增长路径（示例预测）' : 'Revenue Growth Path (Demo Projection)'}</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { year: '2026', arr: '$2.1M', customers: '120', labelZh: '启动年', labelEn: 'Launch' },
              { year: '2027', arr: '$6.8M', customers: '380', labelZh: '产品验证', labelEn: 'Product Validation' },
              { year: '2028', arr: '$18.5M', customers: '950', labelZh: '市场扩张', labelEn: 'Market Expansion' },
              { year: '2029', arr: '$42.0M', customers: '2,100', labelZh: '国际化', labelEn: 'International' },
              { year: '2030', arr: '$85.0M', customers: '4,500', labelZh: '行业标杆', labelEn: 'Industry Leader' },
            ].map((row, i) => (
              <div key={i} className="bg-slate-900/60 rounded-xl p-4 text-center">
                <div className="text-xs text-slate-500 mb-1">{lang === 'zh' ? row.labelZh : row.labelEn}</div>
                <div className="text-lg font-black text-blue-400">{row.year}</div>
                <div className="text-sm text-white font-bold">{row.arr}</div>
                <div className="text-xs text-slate-500">{row.customers} {lang === 'zh' ? '客户' : 'customers'}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-4">{lang === 'zh' ? '以上为示例预测数据，不构成任何财务承诺或投资建议' : 'Demo projection data above. Not financial advice or investment commitment.'}</p>
        </div>
      </section>

      {/* ─── 06 竞争优势 ─── */}
      <section className="bg-slate-800/20 py-24" id="competitive">
        <div className="container mx-auto px-4">
          <SectionHeading number="06" titleZh="竞争优势" titleEn="Competitive Advantage" subtitleZh="与主流竞品的多维度对比" subtitleEn="Multi-dimensional comparison vs. main competitors" lang={lang} />
          <div className="overflow-x-auto">
            <table className="w-full min-w-2xl">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {(lang === 'zh' ? COMPETITIVE_TABLE.headers.zh : COMPETITIVE_TABLE.headers.en).map((h, i) => (
                    <th key={i} className={`px-4 py-3 text-left text-sm font-bold ${i === 0 ? 'text-slate-300' : i === 1 ? 'text-blue-400' : 'text-slate-500'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPETITIVE_TABLE.rows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-300">{lang === 'zh' ? row.zh : row.en}</td>
                    <td className="px-4 py-3 text-sm text-blue-400 font-medium">{row.gtr}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{row.agency}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{row.linkedin}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{row.ats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── 07 增长路径 ─── */}
      <section className="container mx-auto px-4 py-24" id="growth">
        <SectionHeading number="07" titleZh="增长路径" titleEn="Growth Roadmap" subtitleZh="三阶段扩张战略 · 2026-2030" subtitleEn="Three-phase expansion strategy · 2026-2030" lang={lang} />
        <div className="space-y-8">
          {[
            {
              phase: "Phase 1", periodZh: "2026-2027", periodEn: "2026-2027",
              titleZh: "产品验证 · 中欧市场", titleEn: "Product Validation · CN & EU",
              goalsZh: ["完成 MVP，获取 120 家付费企业客户", "建立风能领域人才数据库（5,000+ 条目）", "实现月度 ARR $175K", "通过 GDPR/PIPL 合规认证"],
              goalsEn: ["Complete MVP, acquire 120 paid enterprise customers", "Build wind energy talent DB (5,000+ entries)", "Achieve monthly ARR $175K", "Pass GDPR/PIPL compliance certification"],
              color: "blue",
            },
            {
              phase: "Phase 2", periodZh: "2027-2028", periodEn: "2027-2028",
              titleZh: "市场扩张 · 北美+东南亚", titleEn: "Market Expansion · North America + SEA",
              goalsZh: ["扩展锂电领域人才覆盖（7,000+ 条目）", "进入美国、越南、泰国市场", "推出 AI 评估报告付费服务", "ARR 突破 $18.5M"],
              goalsEn: ["Expand Li-battery talent coverage (7,000+ entries)", "Enter US, Vietnam, Thailand markets", "Launch AI assessment report paid service", "ARR exceed $18.5M"],
              color: "emerald",
            },
            {
              phase: "Phase 3", periodZh: "2029-2030", periodEn: "2029-2030",
              titleZh: "行业标杆 · 全球布局", titleEn: "Industry Leader · Global Presence",
              goalsZh: ["覆盖 42 个国家/地区", "推出数据 API 服务（B端集成）", "ARR 突破 $85M，筹备 IPO", "建立新能源人才标准委员会"],
              goalsEn: ["Cover 42 countries/regions", "Launch Data API service (B-end integration)", "ARR exceed $85M, prepare for IPO", "Establish New Energy Talent Standard Committee"],
              color: "purple",
            },
          ].map((phase, i) => (
            <div key={i} className={`bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:border-${phase.color}-500/30 transition-colors`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-${phase.color}-500/20 flex items-center justify-center text-${phase.color}-400 font-black text-lg`}>{phase.phase.split(' ')[1]}</div>
                <div>
                  <h3 className="text-xl font-bold text-white">{lang === 'zh' ? phase.titleZh : phase.titleEn}</h3>
                  <span className="text-xs text-slate-500">{lang === 'zh' ? phase.periodZh : phase.periodEn}</span>
                </div>
              </div>
              <ul className="space-y-2">
                {(lang === 'zh' ? phase.goalsZh : phase.goalsEn).map((g, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className={`w-4 h-4 text-${phase.color}-400 shrink-0 mt-0.5`} />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 08 合规能力 ─── */}
      <section className="bg-slate-800/20 py-24" id="compliance">
        <div className="container mx-auto px-4">
          <SectionHeading number="08" titleZh="合规能力" titleEn="Compliance & Trust" subtitleZh="数据合规是平台的核心竞争力" subtitleEn="Data compliance is our core competitive advantage" lang={lang} />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, titleZh: "GDPR 合规", titleEn: "GDPR Compliant", descZh: "欧盟通用数据保护条例全面合规，数据主体权利保障，BCR 跨境传输机制", descEn: "EU GDPR full compliance, data subject rights protection, BCR cross-border transfer mechanism", color: "blue" },
              { icon: Shield, titleZh: "PIPL 合规", titleEn: "PIPL Compliant", descZh: "中华人民共和国个人信息保护法合规，本地化存储，单独同意机制", descEn: "China PIPL compliance, localized storage, separate consent mechanism", color: "red" },
              { icon: Database, titleZh: "数据来源可追溯", titleEn: "Data Source Traceability", descZh: "所有人才数据标注来源（学术库/公开资料），支持数据删除请求", descEn: "All talent data tagged with source (academic DB/public profiles), supports data deletion requests", color: "emerald" },
              { icon: FileText, titleZh: "审计日志", titleEn: "Audit Logging", descZh: "所有数据访问操作留痕，支持监管审计，SOC 2 Type II 准备中", descEn: "All data access operations logged, supports regulatory audit, SOC 2 Type II in preparation", color: "amber" },
              { icon: Users, titleZh: "学者授权机制", titleEn: "Researcher Authorization", descZh: "学术人才可选授权等级（公开/有限/私密），尊重学者个人信息权益", descEn: "Academic talents can choose authorization level (public/limited/private), respecting researcher privacy rights", color: "purple" },
              { icon: Globe, titleZh: "跨境数据传输", titleEn: "Cross-Border Data Transfer", descZh: "标准合同条款（SCC）+ 充分性认定，合法跨境数据传输框架", descEn: "Standard Contractual Clauses (SCC) + adequacy decision, legal cross-border data transfer framework", color: "cyan" },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-colors">
                  <Icon className={`w-8 h-8 text-${item.color}-400 mb-4`} />
                  <h3 className="text-lg font-bold text-white mb-2">{lang === 'zh' ? item.titleZh : item.titleEn}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{lang === 'zh' ? item.descZh : item.descEn}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 09 团队 ─── */}
      <section className="container mx-auto px-4 py-24" id="team">
        <SectionHeading number="09" titleZh="核心团队" titleEn="Core Team" subtitleZh="行业专家 + 技术 leader + 合规专家" subtitleEn="Industry experts + Tech leaders + Compliance specialists" lang={lang} />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {TEAM_PLACEHOLDER.map((m, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 text-center hover:border-blue-500/30 transition-colors">
              <div className="w-20 h-20 rounded-full bg-slate-700 mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-white font-bold mb-1">{lang === 'zh' ? m.roleZh : m.roleEn}</h3>
              <p className="text-xs text-slate-500 mb-3">{lang === 'zh' ? '（招募中）' : '(Hiring)'}</p>
              <div className="flex justify-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-xs">{lang === 'zh' ? '待定' : 'TBD'}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm">{lang === 'zh' ? '团队信息更新中，欢迎优秀人才加入' : 'Team info updating, talented individuals welcome to join'}</p>
      </section>

      {/* ─── 10 联系我们 ─── */}
      <section className="bg-slate-800/20 py-24" id="contact">
        <div className="container mx-auto px-4 max-w-2xl">
          <SectionHeading number="10" titleZh="联系我们" titleEn="Contact Us" subtitleZh="投资咨询 · 合作洽谈 · 产品演示预约" subtitleEn="Investment inquiry · Partnership · Product demo booking" lang={lang} />
          {contactSent ? (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-12 text-center">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{lang === 'zh' ? '发送成功！' : 'Message Sent!'}</h3>
              <p className="text-slate-400">{lang === 'zh' ? '我们会在 24 小时内回复您' : 'We will respond within 24 hours'}</p>
            </div>
          ) : (
            <form
              className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 space-y-5"
              onSubmit={e => { e.preventDefault(); setContactSent(true); setTimeout(() => setContactSent(false), 4000) }}
            >
              <div className="grid md:grid-cols-2 gap-5">
                <input required placeholder={lang === 'zh' ? '姓名 *' : 'Name *'} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" />
                <input required type="email" placeholder="Email *" className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" />
              </div>
              <input required placeholder={lang === 'zh' ? '公司/机构 *' : 'Company/Institution *'} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none" />
              <select required className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none">
                <option value="">{lang === 'zh' ? '咨询类型' : 'Inquiry Type'}</option>
                <option value="invest">{lang === 'zh' ? '投资咨询' : 'Investment Inquiry'}</option>
                <option value="partner">{lang === 'zh' ? '合作洽谈' : 'Partnership'}</option>
                <option value="demo">{lang === 'zh' ? '产品演示' : 'Product Demo'}</option>
                <option value="talent">{lang === 'zh' ? '人才招聘' : 'Talent Recruitment'}</option>
              </select>
              <textarea rows={4} placeholder={lang === 'zh' ? '留言（选填）' : 'Message (optional)'} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none resize-none" />
              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                {lang === 'zh' ? '发送消息' : 'Send Message'} <Send className="w-4 h-4 inline ml-2" />
              </button>
              <p className="text-xs text-slate-500 text-center">{lang === 'zh' ? '所有咨询将在 24 小时内回复' : 'All inquiries will be answered within 24 hours'}</p>
            </form>
          )}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-800 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">GTR</span></div>
            <span className="text-slate-400 text-sm">Global Wind & Lithium Talent Radar</span>
          </div>
          <p className="text-slate-600 text-xs">{lang === 'zh' ? '© 2026 全球风能锂电人才搜索雷达 · 示例展示页面 · 不构成投资要约' : '© 2026 Global Wind & Lithium Talent Radar · Demo page · Not an investment offer'}</p>
        </div>
      </footer>
    </div>
  )
}
