"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useLanguage } from "@/lib/i18n"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, LogIn, UserPlus, Users, Building2, Shield, Rocket } from "lucide-react"

const DEMO_ACCOUNTS = [
  { roleKey: "auth.enterpriseHR", email: "hr@demo-solar.cn", password: "company123", icon: Building2, color: "text-blue-400", desc: "张明辉 - 光伏科技集团HR" },
  { roleKey: "auth.candidate", email: "lixiaofeng@demo-tech.org", password: "candidate123", icon: Users, color: "text-emerald-400", desc: "李晓风 - 风电工程师" },
  { roleKey: "auth.admin", email: "admin@globaltalentradar.com", password: "admin123", icon: Shield, color: "text-amber-400", desc: "系统管理员" },
]

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
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
  const redirectTo = searchParams.get("redirect") || "/dashboard"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [demoInitMsg, setDemoInitMsg] = useState("")
  const [demoInitLoading, setDemoInitLoading] = useState(false)

  async function initDemoData() {
    setDemoInitLoading(true)
    setDemoInitMsg("")
    try {
      const res = await fetch("/api/demo/init", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) })
      const data = await res.json()
      if (data.success) {
        setDemoInitMsg(data.message)
      } else {
        setDemoInitMsg("初始化失败: " + (data.message || "未知错误"))
      }
    } catch (e: any) {
      setDemoInitMsg("网络错误: " + (e.message || ""))
    } finally {
      setDemoInitLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError(language === 'zh' ? '请输入邮箱和密码' : 'Please enter email and password')
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
      setError((language === 'zh' ? '登录失败: ' : 'Login failed: ') + msg)
    } finally {
      setIsLoading(false)
    }
  }

  function fillDemoAccount(acc: typeof DEMO_ACCOUNTS[number]) {
    setEmail(acc.email)
    setPassword(acc.password)
    setError("")
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

        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 mb-4">
            <LogIn className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">{t('home.title')}</h1>
          <p className="text-slate-400 text-sm mt-2">{t('home.subtitle')}</p>
        </div>

        {/* Login Form */}
        <Card className="bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">{t('auth.login')}</CardTitle>
            <CardDescription>
              {language === 'zh' ? '使用您的账号登录平台' : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-white/80 text-sm mb-1.5 font-medium">{t('auth.email')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
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
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all pr-11"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium py-2.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t('common.loading')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4" />
                    {t('auth.loginButton')}
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-white/5 pt-4">
            <p className="text-slate-400 text-sm">
              {t('auth.noAccount')}{" "}
              <a href="/register" className="text-sky-400 hover:text-sky-300 hover:underline transition-colors">
                {t('auth.registerNow')} <UserPlus className="w-3 h-3 inline" />
              </a>
            </p>
          </CardFooter>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {t('auth.demoAccounts')} ({language === 'zh' ? '点击快速填充' : 'Click to fill'})
            </CardTitle>
            <CardDescription>
              {language === 'zh'
                ? 'Demo 演示专用账号，可直接登录体验完整招聘流程'
                : 'Demo accounts for testing the full recruitment workflow'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                onClick={() => fillDemoAccount(acc)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all text-left group"
              >
                <div className={`${acc.color} bg-white/5 p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                  <acc.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{t(acc.roleKey)}</p>
                  <p className="text-slate-400 text-xs truncate">{acc.email}</p>
                </div>
                <div className="text-slate-500 text-xs font-mono bg-white/5 px-2 py-1 rounded">
                  {acc.password}
                </div>
              </button>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t border-white/5 pt-4">
            <Button
              onClick={initDemoData}
              disabled={demoInitLoading}
              variant="outline"
              className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300"
            >
              {demoInitLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                  {language === 'zh' ? '初始化中...' : 'Initializing...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  {language === 'zh' ? '一键初始化演示数据' : 'Initialize Demo Data'}
                </span>
              )}
            </Button>
            {demoInitMsg && (
              <p className="text-xs text-emerald-400 text-center px-2">{demoInitMsg}</p>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
