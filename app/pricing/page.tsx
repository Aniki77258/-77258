"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n"
import { formatCurrency, CURRENCY_LIST, CurrencyCode, convertCurrency } from "@/lib/format-currency"
import { Check, Zap } from "lucide-react"
import Link from "next/link"

interface PricingPlan {
  key: string
  priceCNY: { monthly: number; yearly: number }
  features: string[]
  highlighted?: boolean
}

export default function PricingPage() {
  const { t, language, toggleLanguage } = useLanguage()
  const [currency, setCurrency] = useState<CurrencyCode>("CNY")
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")

  const plans: PricingPlan[] = [
    {
      key: "planBasic",
      priceCNY: { monthly: 2999, yearly: 29990 },
      features: [
        language === 'zh' ? '5 个活跃岗位发布' : '5 active job postings',
        language === 'zh' ? '每月 100 次人才搜索' : '100 talent searches/month',
        language === 'zh' ? '基础 AI 匹配' : 'Basic AI matching',
        language === 'zh' ? '邮件通知' : 'Email notifications',
        language === 'zh' ? '标准支持' : 'Standard support',
      ],
    },
    {
      key: "planPro",
      priceCNY: { monthly: 9999, yearly: 99990 },
      highlighted: true,
      features: [
        language === 'zh' ? '30 个活跃岗位发布' : '30 active job postings',
        language === 'zh' ? '无限人才搜索' : 'Unlimited talent searches',
        language === 'zh' ? '高级 AI 匹配 + 评估' : 'Advanced AI matching & assessment',
        language === 'zh' ? '多时区面试安排' : 'Multi-timezone interview scheduling',
        language === 'zh' ? '薪酬谈判工具' : 'Compensation negotiation tools',
        language === 'zh' ? '优先邮件 + 电话支持' : 'Priority email & phone support',
        language === 'zh' ? 'API 接口接入' : 'API access',
      ],
    },
    {
      key: "planEnterprise",
      priceCNY: { monthly: 29999, yearly: 299990 },
      features: [
        language === 'zh' ? '无限岗位发布' : 'Unlimited job postings',
        language === 'zh' ? '无限人才搜索' : 'Unlimited talent searches',
        language === 'zh' ? '全功能 AI 助手' : 'Full AI assistant suite',
        language === 'zh' ? '专属客户经理' : 'Dedicated account manager',
        language === 'zh' ? '定制化报表' : 'Custom analytics reports',
        language === 'zh' ? 'SSO + 企业集成' : 'SSO + enterprise integration',
        language === 'zh' ? '白标方案可选' : 'White-label option available',
        language === 'zh' ? '24/7 专属支持' : '24/7 dedicated support',
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <span className="text-white font-bold text-lg">{t('home.title')}</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-xs rounded border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-colors"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>
            <Link href="/login" className="px-4 py-2 text-white hover:bg-white/10 rounded text-sm">{t('auth.login')}</Link>
            <Link href="/register" className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded text-white text-sm">{t('auth.register')}</Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{t('pricing.title')}</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('pricing.subtitle')}</p>
        </div>

        {/* Currency + Billing Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{t('pricing.currency')}:</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-white text-sm"
            >
              {CURRENCY_LIST.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-800">
                  {c.symbol} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded text-sm transition-colors ${
                billingCycle === "monthly" ? "bg-sky-500/20 text-sky-400" : "text-slate-400"
              }`}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded text-sm transition-colors ${
                billingCycle === "yearly" ? "bg-sky-500/20 text-sky-400" : "text-slate-400"
              }`}
            >
              {t('pricing.yearly')}
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const priceInCNY = billingCycle === "monthly" ? plan.priceCNY.monthly : plan.priceCNY.yearly
            const displayPrice = convertCurrency(priceInCNY, "CNY", currency)
            const periodLabel = billingCycle === "monthly" ? t('pricing.perMonth') : "/yr"

            return (
              <div
                key={plan.key}
                className={`relative p-6 rounded-xl border transition-all ${
                  plan.highlighted
                    ? "border-sky-500/30 bg-sky-500/5 ring-1 ring-sky-500/20"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-sky-500 text-white text-xs rounded-full font-medium">
                      {language === 'zh' ? '推荐' : 'Popular'}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-white mb-2">{t(`pricing.${plan.key}`)}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {formatCurrency(displayPrice, currency)}
                  </span>
                  <span className="text-slate-400 text-sm">{periodLabel}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/register"
                  className={`block w-full text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-sky-500 hover:bg-sky-600 text-white"
                      : "border border-white/20 hover:bg-white/5 text-white"
                  }`}
                >
                  {t('home.getStarted')}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Enterprise Contact */}
        <div className="text-center mt-12 p-6 rounded-xl bg-white/[0.02] border border-white/5 max-w-xl mx-auto">
          <p className="text-slate-400 text-sm mb-3">
            {language === 'zh'
              ? '需要定制方案？联系我们的企业销售团队获取专属报价。'
              : 'Need a custom plan? Contact our enterprise sales team for a tailored quote.'}
          </p>
          <button className="px-6 py-2 border border-white/20 rounded-lg text-white text-sm hover:bg-white/5 transition-colors">
            {t('pricing.contactSales')}
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-slate-600 mt-8">
          {t('pricing.exchangeRateNote')}
        </p>
      </div>

      <footer className="border-t border-white/10 py-8 text-center text-slate-500 text-xs">
        {t('home.footer')}
      </footer>
    </main>
  )
}
