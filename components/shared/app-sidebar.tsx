"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useLanguage, LanguageSwitcher } from "@/lib/i18n"
import { getRoleLabel } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard, Search, Users, Building2, Briefcase,
  Send, Calendar, ClipboardCheck, Handshake, FileText,
  Bell, MessageSquare, Shield, Settings, LogOut, Menu, X,
  ChevronLeft, Zap, History, UserCheck, AlertTriangle, BarChart3,
  BotMessageSquare, Mail, Globe, Crown, DollarSign, Receipt
} from "lucide-react"
import PwaInstallBanner from "./pwa-install-banner"
import RegisterSW from "./register-sw"
import MobileBottomNav from "./mobile-bottom-nav"

interface NavItemDef {
  labelKey: string
  href: string
  icon: React.ElementType
  roles?: string[]
  badge?: string
}

const NAV_DEFS: Record<string, NavItemDef[]> = {
  company: [
    { labelKey: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
    { labelKey: "nav.talentSearch", href: "/candidates", icon: Search },
    { labelKey: "nav.invitations", href: "/invitations", icon: Send },
    { labelKey: "nav.interviews", href: "/interviews", icon: Calendar },
    { labelKey: "nav.assessments", href: "/assessments", icon: ClipboardCheck },
    { labelKey: "nav.negotiations", href: "/negotiations", icon: Handshake },
    { labelKey: "nav.offers", href: "/offers", icon: FileText },
    { labelKey: "nav.companies", href: "/companies", icon: Building2 },
    { labelKey: "nav.jobs", href: "/jobs", icon: Briefcase },
    { labelKey: "nav.notifications", href: "/notifications", icon: Bell },
    { labelKey: "nav.messages", href: "/messages", icon: MessageSquare },
    { labelKey: "nav.aiAssistant", href: "/ai", icon: BotMessageSquare },
    { labelKey: "nav.emailTemplates", href: "/email-templates", icon: Mail },
    { labelKey: "nav.subscription", href: "/subscription", icon: Crown },
    { labelKey: "nav.settings", href: "/settings", icon: Settings },
  ],
  candidate: [
    { labelKey: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
    { labelKey: "nav.invitations", href: "/invitations", icon: Send },
    { labelKey: "nav.interviews", href: "/interviews", icon: Calendar },
    { labelKey: "nav.assessments", href: "/assessments", icon: ClipboardCheck },
    { labelKey: "nav.negotiations", href: "/negotiations", icon: Handshake },
    { labelKey: "nav.offers", href: "/offers", icon: FileText },
    { labelKey: "nav.jobs", href: "/jobs", icon: Briefcase },
    { labelKey: "nav.companies", href: "/companies", icon: Building2 },
    { labelKey: "nav.notifications", href: "/notifications", icon: Bell },
    { labelKey: "nav.messages", href: "/messages", icon: MessageSquare },
    { labelKey: "nav.settings", href: "/settings", icon: Settings },
  ],
  admin: [
    { labelKey: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
    { labelKey: "nav.verification", href: "/admin/verification", icon: Shield },
    { labelKey: "admin.candidates", href: "/admin/candidates", icon: UserCheck },
    { labelKey: "admin.reports", href: "/admin/reports", icon: AlertTriangle },
    { labelKey: "admin.stats", href: "/admin/stats", icon: BarChart3 },
    { labelKey: "admin.commerce", href: "/admin/commerce", icon: DollarSign },
    { labelKey: "admin.orders", href: "/admin/orders", icon: Receipt },
    { labelKey: "nav.auditLogs", href: "/audit-logs", icon: History },
    { labelKey: "nav.candidates", href: "/candidates", icon: Users },
    { labelKey: "nav.companies", href: "/companies", icon: Building2 },
    { labelKey: "nav.jobs", href: "/jobs", icon: Briefcase },
    { labelKey: "nav.settings", href: "/settings", icon: Settings },
  ],
}

function getNavDefKey(role: string | null): string {
  if (role === "admin") return "admin"
  if (role === "candidate") return "candidate"
  return "company"
}

export function AppSidebar() {
  const { user, role, logout } = useAuth()
  const { t, language, toggleLanguage } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const localRole = role // for consistency
  const navDefKey = getNavDefKey(role)
  const navDefs = NAV_DEFS[navDefKey]

  function handleLogout() {
    logout()
    router.push("/login")
  }

  const sidebarContent = (
    <div className={`h-full flex flex-col bg-[#0a1120] border-r border-white/5 transition-all duration-300 ${collapsed ? "w-[60px]" : "w-[240px]"}`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-white/5">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 flex-1 min-w-0">
            <Zap className="w-5 h-5 text-sky-400 flex-shrink-0" />
            <span className="font-bold text-white text-sm truncate">全球风能锂电人才搜索雷达</span>
          </Link>
        )}
        {collapsed && <Zap className="w-5 h-5 text-sky-400 mx-auto" />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-500 hover:text-slate-300 p-1 rounded"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-slate-500 text-xs">{getRoleLabel(user.role)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Language Switcher */}
      {!collapsed && (
        <div className="px-4 py-2 border-b border-white/5">
          <LanguageSwitcher />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navDefs.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const label = t(item.labelKey)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-0.5 ${
                isActive
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              title={collapsed ? label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{label}</span>
                  {item.badge && (
                    <span className="text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full"
          title={collapsed ? t('nav.logout') : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-lg bg-slate-800 border border-white/10 text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed left-0 top-0 h-full z-50">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => { RegisterSW() }, [])
  return (
    <div className="flex h-screen bg-[#060d1a]">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <PwaInstallBanner />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  )
}
