"use client"

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
