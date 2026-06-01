"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useLanguage } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { GlobalRadarMap } from "@/components/tech/global-radar-map"
import { EnergyBadge } from "@/components/tech/energy-badge"
import { Eye, EyeOff, LogIn, UserPlus, Radar, Globe } from "lucide-react"

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-deep-space flex items-center justify-center px-4">
        <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const { login } = useAuth()
  const { t, language, toggleLanguage } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isZh = language === 'zh'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError(isZh ? '请输入邮箱和密码' : 'Please enter email and password')
      return
    }
    setIsLoading(true)
    try {
      const result = await login(email, password)
      if (result.success) {
        router.push(redirectTo)
      } else {
        setError(result.message)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setError((isZh ? '登录失败: ' : 'Login failed: ') + msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-deep-space flex">
      {/* Left: Tech Visual */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden items-center justify-center">
        {/* Background glow */}
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-[0.06]"
            style={{ background: "radial-gradient(circle, #38bdf8, transparent 70%)" }} />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-[0.04]"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }} />
        </div>

        <div className="relative z-10 w-full max-w-lg px-12 text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] mb-8 shadow-[0_0_40px_rgba(56,189,248,0.2)]">
            <Radar className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            {isZh ? "全球风能锂电人才搜索雷达" : "Global Wind & Lithium Talent Radar"}
          </h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            {isZh
              ? "AI 驱动的全球新能源人才搜索平台。连接风能、锂电、储能行业高端人才与企业机会。"
              : "AI-powered global clean energy talent platform. Connecting top talent with opportunities in wind, lithium, and energy storage."}
          </p>

          {/* Mini radar visual */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-[#38bdf8]" />
              <span className="text-xs text-slate-400 uppercase tracking-wider">
                {isZh ? "全球人才信号" : "Global Talent Signals"}
              </span>
            </div>
            <GlobalRadarMap compact showConnections={false} />
            <p className="text-[10px] text-slate-600 mt-2">{isZh ? "示例数据展示" : "Demo data display"}</p>
          </div>

          {/* Key metrics preview */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "28K+", label: isZh ? "候选人" : "Candidates", color: "text-[#38bdf8]" },
              { value: "1.2K+", label: isZh ? "企业" : "Companies", color: "text-[#4ade80]" },
              { value: "72%", label: isZh ? "匹配精度" : "Match Accuracy", color: "text-[#a78bfa]" },
            ].map((m, i) => (
              <div key={i} className="text-center">
                <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                <p className="text-[10px] text-slate-500">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Language Switcher */}
          <div className="flex justify-end">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-xs rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/30 transition-all"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>
          </div>

          {/* Mobile Logo (visible only on small screens) */}
          <div className="lg:hidden text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] mb-4">
              <Radar className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">{isZh ? "全球风能锂电人才搜索雷达" : "Global Wind & Lithium Talent Radar"}</h1>
            <p className="text-slate-400 text-xs mt-1">{isZh ? "AI 驱动的人才搜索平台" : "AI-Powered Talent Platform"}</p>
          </div>

          {/* Login Form Card */}
          <div className="glass-card glow-border">
            {/* Header */}
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <LogIn className="w-5 h-5 text-[#38bdf8]" />
                {t('auth.login')}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {isZh ? '使用您的账号登录平台' : 'Sign in to your account'}
              </p>
            </div>

            {/* Form */}
            <div className="px-6 pb-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-[#f87171]/10 border border-[#f87171]/30 text-[#f87171] text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f87171] mt-1.5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-white/80 text-sm mb-1.5 font-medium">{t('auth.email')}</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-tech"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-1.5 font-medium">{t('auth.password')}</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-tech pr-11"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-energy w-full !py-2.5 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('common.loading')}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <LogIn className="w-4 h-4" />
                      {t('auth.loginButton')}
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 pt-2">
              <div className="divider-tech mb-3" />

              {/* Demo account hint */}
              <div className="mb-3 p-3 rounded-lg bg-[#38bdf8]/5 border border-[#38bdf8]/10">
                <p className="text-xs text-slate-400">
                  <span className="text-[#22d3ee] font-semibold">{isZh ? "演示账号" : "Demo Accounts"}:</span>
                  <span className="ml-2">{isZh ? "admin/123456 或 boss/123456" : "admin/123456 or boss/123456"}</span>
                </p>
              </div>

              <p className="text-center text-slate-500 text-sm">
                {t('auth.noAccount')}{" "}
                <a href="/register" className="text-[#38bdf8] hover:text-[#22d3ee] hover:underline transition-colors font-medium">
                  {t('auth.registerNow')} <UserPlus className="w-3 h-3 inline" />
                </a>
              </p>
            </div>
          </div>

          {/* Back to home */}
          <p className="text-center">
            <a href="/" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              {isZh ? "← 返回首页" : "← Back to Home"}
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
