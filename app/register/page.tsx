"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useLanguage } from "@/lib/i18n"
import type { UserRole } from "@/lib/auth-utils"
import { COUNTRIES, INDUSTRIES as ALL_INDUSTRIES } from "@/lib/countries"
import { Button } from "@/components/ui/button"
import { EnergyBadge } from "@/components/tech/energy-badge"
import {
  UserPlus, Building2, Users, UserSearch, GraduationCap,
  ArrowLeft, Check, Radar, Shield, Search, Send, Video,
  FileCheck2, TrendingUp, UserCheck, ChevronRight
} from "lucide-react"

export default function RegisterPage() {
  const { t, language, toggleLanguage } = useLanguage()
  const { register } = useAuth()
  const router = useRouter()
  const isZh = language === 'zh'

  const ROLES: { value: UserRole; icon: typeof Building2; color: string; bg: string; title: string; desc: string; features: string[] }[] = [
    {
      value: "company", icon: Building2, color: "text-[#38bdf8]", bg: "bg-[#38bdf8]/10",
      title: isZh ? "企业用户" : "Company User",
      desc: isZh ? "招聘风能锂电高端人才" : "Recruit top clean energy talent",
      features: [
        isZh ? "发布招聘岗位" : "Post job openings",
        isZh ? "AI 人才搜索与匹配" : "AI talent search & matching",
        isZh ? "全流程招聘管理" : "Full recruitment pipeline",
        isZh ? "候选人评估与对比" : "Candidate evaluation & comparison",
      ]
    },
    {
      value: "candidate", icon: Users, color: "text-[#4ade80]", bg: "bg-[#4ade80]/10",
      title: isZh ? "候选人" : "Candidate",
      desc: isZh ? "展示专业履历，接收 Offer" : "Showcase skills, receive offers",
      features: [
        isZh ? "创建专业人才画像" : "Create professional talent profile",
        isZh ? "接收企业邀请和 Offer" : "Receive invitations & offers",
        isZh ? "数据授权与隐私控制" : "Data authorization & privacy control",
        isZh ? "AI 薪酬分析与建议" : "AI salary analysis & suggestions",
      ]
    },
    {
      value: "candidate" as UserRole, icon: UserSearch, color: "text-[#a78bfa]", bg: "bg-[#a78bfa]/10",
      title: isZh ? "猎头顾问" : "Headhunter",
      desc: isZh ? "获取高匹配候选人推荐" : "Access high-match candidates",
      features: [
        isZh ? "批量候选人搜索" : "Bulk candidate search",
        isZh ? "AI 匹配推荐" : "AI match recommendations",
        isZh ? "邀请与沟通工具" : "Invitation & communication tools",
        isZh ? "业绩追踪面板" : "Performance tracking dashboard",
      ]
    },
    {
      value: "candidate" as UserRole, icon: GraduationCap, color: "text-[#22d3ee]", bg: "bg-[#22d3ee]/10",
      title: isZh ? "行业专家" : "Industry Expert",
      desc: isZh ? "参与技术评估与咨询" : "Technical evaluation & consulting",
      features: [
        isZh ? "候选人技术评估" : "Candidate technical assessment",
        isZh ? "行业趋势分析" : "Industry trend analysis",
        isZh ? "专家网络连接" : "Expert network connection",
        isZh ? "咨询项目对接" : "Consulting project matching",
      ]
    },
  ]

  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [country, setCountry] = useState("CN")
  const [industry, setIndustry] = useState("wind_storage")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validateStep1(): boolean {
    setError("")
    return true
  }

  function validateStep2(): boolean {
    if (!name.trim()) { setError(isZh ? '请输入姓名/企业名称' : 'Please enter your name/company name'); return false }
    if (!email.trim()) { setError(isZh ? '请输入邮箱地址' : 'Please enter email address'); return false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(isZh ? '请输入有效的邮箱地址' : 'Please enter a valid email'); return false }
    if (password.length < 6) { setError(isZh ? '密码至少需要 6 位字符' : 'Password must be at least 6 characters'); return false }
    if (password !== confirmPassword) { setError(isZh ? '两次输入的密码不一致' : 'Passwords do not match'); return false }
    setError("")
    return true
  }

  function nextStep() {
    if (validateStep1()) setStep(2)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateStep2()) return
    setIsLoading(true)
    const result = await register({
      name: ROLES[selectedRole].value === "company" && companyName ? `${name} (${companyName})` : name,
      email, password,
      role: ROLES[selectedRole].value,
      country, industry,
    })
    setIsLoading(false)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => router.push("/dashboard"), 1500)
    } else {
      setError(result.message)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-deep-space flex items-center justify-center px-4">
        <div className="glass-card text-center !p-10 max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-[#4ade80]/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-[#4ade80]" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t('auth.registerSuccess')}</h2>
          <p className="text-slate-400 text-sm">
            {isZh ? '正在跳转到控制台...' : 'Redirecting to dashboard...'}
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-deep-space">
      {/* Ambient glow */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(circle, #38bdf8, transparent 70%)" }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-[0.03] pointer-events-none"
        style={{ background: "radial-gradient(circle, #4ade80, transparent 70%)" }} />

      <div className="relative z-10 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-6">
          {/* Language */}
          <div className="flex justify-end">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>
          </div>

          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#4ade80] to-[#0ea5e9] mb-4">
              <Radar className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{t('auth.register')}</h1>
            <p className="text-slate-400 text-sm mt-2">
              {isZh ? '加入全球风能锂电人才搜索雷达' : 'Join Global Wind & Lithium Talent Radar'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 px-4">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? "bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] text-white" : "bg-white/5 border border-white/10 text-slate-600"
                }`}>{s}</div>
                <span className={`text-xs ${step >= s ? "text-slate-300" : "text-slate-600"}`}>
                  {s === 1 ? (isZh ? "选择角色" : "Select Role") : (isZh ? "填写信息" : "Fill Info")}
                </span>
                {s < 2 && <div className={`flex-1 h-0.5 rounded-full ${step >= s + 1 ? "bg-[#38bdf8]/50" : "bg-white/5"}`} />}
              </div>
            ))}
          </div>

          <div className="glass-card glow-border">
            {/* Error */}
            {error && (
              <div className="mx-6 mt-6 bg-[#f87171]/10 border border-[#f87171]/30 text-[#f87171] text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f87171] mt-1.5 flex-shrink-0" />
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="p-6 space-y-3">
                <p className="text-white/80 text-sm font-medium mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#38bdf8]" />
                  {t('auth.selectRole')}
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {ROLES.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedRole(i)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        selectedRole === i
                          ? "border-[#38bdf8]/40 bg-[#38bdf8]/5"
                          : "border-white/5 hover:border-white/10 bg-transparent"
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg inline-flex mb-3 ${selectedRole === i ? r.bg + " " + r.color : "bg-white/5 text-slate-500"}`}>
                        <r.icon className="w-5 h-5" />
                      </div>
                      <h3 className={`font-semibold text-sm ${selectedRole === i ? "text-white" : "text-slate-300"}`}>
                        {r.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 mb-3">{r.desc}</p>
                      <ul className="space-y-1">
                        {r.features.map((f, j) => (
                          <li key={j} className="text-[10px] text-slate-600 flex items-start gap-1.5">
                            <Check className="w-3 h-3 text-slate-700 flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5">{isZh ? '所在国家' : 'Country'}</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-white text-sm bg-[#0a1628] border border-white/10 focus:outline-none focus:border-[#38bdf8]/50 transition-all"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-[#0a1628]">
                          {c.flag} {isZh ? c.nameZh : c.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5">{isZh ? '所属行业' : 'Industry'}</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-white text-sm bg-[#0a1628] border border-white/10 focus:outline-none focus:border-[#38bdf8]/50 transition-all"
                    >
                      {ALL_INDUSTRIES.map((ind) => (
                        <option key={ind.value} value={ind.value} className="bg-[#0a1628]">
                          {isZh ? ind.labelZh : ind.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button onClick={nextStep} className="btn-energy w-full !py-2.5 mt-4">
                  {isZh ? '下一步' : 'Next'} <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1.5 font-medium">
                      {ROLES[selectedRole].value === "company" ? (isZh ? '企业名称' : 'Company Name') : t('auth.name')}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={ROLES[selectedRole].value === "company"
                        ? (isZh ? '请输入企业全称' : 'Enter full company name')
                        : (isZh ? '请输入您的真实姓名' : 'Enter your full name')}
                      className="input-tech"
                      disabled={isLoading}
                    />
                  </div>
                  {ROLES[selectedRole].value === "company" && (
                    <div>
                      <label className="block text-white/70 text-sm mb-1.5 font-medium">
                        {isZh ? '企业简称 (选填)' : 'Short Name (optional)'}
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={isZh ? '如：中光伏' : 'e.g. CNPV'}
                        className="input-tech"
                        disabled={isLoading}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-white/70 text-sm mb-1.5 font-medium">{t('auth.email')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@company.com"
                      className="input-tech"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1.5 font-medium">{t('auth.password')}</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isZh ? '至少 6 位字符' : 'At least 6 characters'}
                      className="input-tech"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1.5 font-medium">
                      {isZh ? '确认密码' : 'Confirm Password'}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={isZh ? '再次输入密码' : 'Re-enter password'}
                      className="input-tech"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Agreement */}
                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-4 h-4 rounded border border-[#38bdf8]/30 bg-[#38bdf8]/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#38bdf8]" />
                      </div>
                    </div>
                    <span>
                      {isZh ? '注册即表示您同意我们的' : 'By registering, you agree to our'}{' '}
                      <a href="/privacy" className="text-[#38bdf8] hover:underline">{isZh ? '隐私政策' : 'Privacy Policy'}</a>{' '}
                      {isZh ? '和' : 'and'}{' '}
                      <a href="/terms" className="text-[#38bdf8] hover:underline">{isZh ? '用户协议' : 'Terms of Service'}</a>
                    </span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> {isZh ? '上一步' : 'Back'}
                    </Button>
                    <button
                      type="submit"
                      className="btn-energy-green flex-1 !py-2.5"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {isZh ? '注册中...' : 'Registering...'}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          {isZh ? '完成注册' : 'Complete Registration'}
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-slate-500 text-sm">
            {t('auth.hasAccount')}{" "}
            <a href="/login" className="text-[#38bdf8] hover:text-[#22d3ee] hover:underline transition-colors font-medium">
              {t('auth.loginNow')}
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
