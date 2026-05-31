"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useLanguage } from "@/lib/i18n"
import type { UserRole } from "@/lib/auth-utils"
import { COUNTRIES, INDUSTRIES as ALL_INDUSTRIES } from "@/lib/countries"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Building2, Users, ArrowLeft, Check } from "lucide-react"

export default function RegisterPage() {
  const { t, language, toggleLanguage } = useLanguage()
  const { register } = useAuth()
  const router = useRouter()

  const ROLES: { value: UserRole; icon: typeof Building2; descKey: string }[] = [
    { value: "company", icon: Building2, descKey: "register.companyDesc" },
    { value: "candidate", icon: Users, descKey: "register.candidateDesc" },
  ]

  const [step, setStep] = useState(1)
  const [role, setRole] = useState<UserRole>("company")
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

  const roleLabel = (r: UserRole) => {
    if (r === 'company') return language === 'zh' ? '企业用户' : 'Company User'
    return language === 'zh' ? '候选人' : 'Candidate'
  }
  const roleDesc = (r: UserRole) => {
    if (r === 'company') return language === 'zh' ? '发布招聘岗位，搜索全球风能锂电人才' : 'Post jobs, search global wind & lithium talent'
    return language === 'zh' ? '展示专业履历，接收企业邀请和 Offer' : 'Showcase your profile, receive invitations and offers'
  }

  function validateStep1(): boolean {
    if (!role) { setError(language === 'zh' ? '请选择账号类型' : 'Please select account type'); return false }
    setError("")
    return true
  }

  function validateStep2(): boolean {
    if (!name.trim()) { setError(language === 'zh' ? '请输入姓名/企业名称' : 'Please enter your name/company name'); return false }
    if (!email.trim()) { setError(language === 'zh' ? '请输入邮箱地址' : 'Please enter email address'); return false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(language === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email'); return false }
    if (password.length < 6) { setError(language === 'zh' ? '密码至少需要 6 位字符' : 'Password must be at least 6 characters'); return false }
    if (password !== confirmPassword) { setError(language === 'zh' ? '两次输入的密码不一致' : 'Passwords do not match'); return false }
    setError("")
    return true
  }

  function nextStep() {
    if (step === 1 && validateStep1()) setStep(2)
  }

  function prevStep() {
    setStep(1)
    setError("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateStep2()) return
    setIsLoading(true)
    const result = await register({
      name: role === "company" && companyName ? `${name} (${companyName})` : name,
      email,
      password,
      role,
      country,
      industry,
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
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/5 border border-white/10 text-center p-10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{t('auth.registerSuccess')}</h2>
          <p className="text-slate-400 text-sm">
            {language === 'zh' ? '正在跳转到控制台...' : 'Redirecting to dashboard...'}
          </p>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Language Switcher */}
        <div className="flex justify-end">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 text-xs rounded border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-colors"
          >
            {language === 'zh' ? '🌐 English' : '🌐 中文'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('auth.register')}</h1>
          <p className="text-slate-400 text-sm mt-2">
            {language === 'zh' ? '加入全球风能锂电人才搜索雷达' : 'Join Global Wind & Lithium Talent Radar'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 px-4">
          <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 1 ? "bg-emerald-500" : "bg-white/10"}`} />
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 1 ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-500"}`}>1</div>
          <div className="text-xs text-slate-500 mx-1">{t('auth.step1')}</div>
          <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 2 ? "bg-emerald-500" : "bg-white/10"}`} />
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= 2 ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-500"}`}>2</div>
          <div className="text-xs text-slate-500 mx-1">{t('auth.step2')}</div>
          <div className={`flex-1 h-1.5 rounded-full transition-colors ${step >= 2 ? "bg-emerald-500" : "bg-white/10"}`} />
        </div>

        <Card className="bg-white/5 border border-white/10">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <p className="text-white/80 text-sm font-medium mb-3">{t('auth.selectRole')}</p>
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                        role === r.value
                          ? "border-emerald-500/50 bg-emerald-500/10"
                          : "border-white/10 hover:border-white/20 bg-white/5"
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg ${role === r.value ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-400"}`}>
                        <r.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className={`font-medium ${role === r.value ? "text-emerald-400" : "text-white"}`}>
                          {roleLabel(r.value)}
                        </p>
                        <p className="text-slate-500 text-xs mt-0.5">{roleDesc(r.value)}</p>
                      </div>
                      {role === r.value && <Check className="w-5 h-5 text-emerald-400 ml-auto" />}
                    </button>
                  ))}

                  <div className="space-y-3 mt-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-1.5">
                        {language === 'zh' ? '所在国家' : 'Country'}
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code} className="bg-slate-800">
                            {c.flag} {language === 'zh' ? c.nameZh : c.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm mb-1.5">
                        {language === 'zh' ? '所属行业' : 'Industry'}
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      >
                        {ALL_INDUSTRIES.map((ind) => (
                          <option key={ind.value} value={ind.value} className="bg-slate-800">
                            {language === 'zh' ? ind.labelZh : ind.labelEn}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-1.5 font-medium">
                      {role === "company" ? (language === 'zh' ? '企业名称' : 'Company Name') : t('auth.name')}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={role === "company"
                        ? (language === 'zh' ? '请输入企业全称' : 'Enter full company name')
                        : (language === 'zh' ? '请输入您的真实姓名' : 'Enter your full name')}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                  {role === "company" && (
                    <div>
                      <label className="block text-white/80 text-sm mb-1.5 font-medium">
                        {language === 'zh' ? '企业简称 (选填)' : 'Short Name (optional)'}
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder={language === 'zh' ? '如：中光伏' : 'e.g. CNPV'}
                        className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        disabled={isLoading}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-white/80 text-sm mb-1.5 font-medium">{t('auth.email')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@company.com"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-1.5 font-medium">{t('auth.password')}</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={language === 'zh' ? '至少 6 位字符' : 'At least 6 characters'}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm mb-1.5 font-medium">
                      {language === 'zh' ? '确认密码' : 'Confirm Password'}
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={language === 'zh' ? '再次输入密码' : 'Re-enter password'}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex gap-3 border-t border-white/5 pt-4">
            {step === 2 && (
              <Button variant="outline" onClick={prevStep} disabled={isLoading} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> {language === 'zh' ? '上一步' : 'Back'}
              </Button>
            )}
            {step === 1 ? (
              <Button onClick={nextStep} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
                {language === 'zh' ? '下一步' : 'Next'}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {language === 'zh' ? '注册中...' : 'Registering...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    {language === 'zh' ? '完成注册' : 'Complete Registration'}
                  </span>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>

        <p className="text-center text-slate-500 text-sm">
          {t('auth.hasAccount')}{" "}
          <a href="/login" className="text-sky-400 hover:text-sky-300 hover:underline transition-colors">
            {t('auth.loginNow')}
          </a>
        </p>
      </div>
    </main>
  )
}
