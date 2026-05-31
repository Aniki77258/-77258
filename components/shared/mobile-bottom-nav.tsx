"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { useLanguage } from "@/lib/i18n"
import {
  LayoutDashboard, Search, Send, Calendar, ClipboardCheck,
  Handshake, FileText, Bell, MessageSquare, Settings, Menu,
} from "lucide-react"

interface MobileBottomNavItem {
  href: string
  icon: React.ElementType
  labelKey: string
  badge?: number
}

export default function MobileBottomNav() {
  const { user, role } = useAuth()
  const { t } = useLanguage()
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  if (!user) return null

  // 根据角色生成导航项
  const navItems: MobileBottomNavItem[] = (() => {
    if (role === "admin") {
      return [
        { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
        { href: "/candidates", icon: Search, labelKey: "nav.talentSearch" },
        { href: "/admin/verification", icon: ClipboardCheck, labelKey: "nav.verification" },
        { href: "/admin/stats", icon: FileText, labelKey: "admin.stats" },
      ]
    }
    if (role === "candidate") {
      return [
        { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
        { href: "/invitations", icon: Send, labelKey: "nav.invitations" },
        { href: "/interviews", icon: Calendar, labelKey: "nav.interviews" },
        { href: "/offers", icon: FileText, labelKey: "nav.offers" },
      ]
    }
    // company
    return [
      { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
      { href: "/candidates", icon: Search, labelKey: "nav.talentSearch" },
      { href: "/invitations", icon: Send, labelKey: "nav.invitations" },
      { href: "/interviews", icon: Calendar, labelKey: "nav.interviews" },
    ]
  })()

  const moreItems: MobileBottomNavItem[] = (() => {
    if (role === "admin") {
      return [
        { href: "/notifications", icon: Bell, labelKey: "nav.notifications" },
        { href: "/messages", icon: MessageSquare, labelKey: "nav.messages" },
        { href: "/settings", icon: Settings, labelKey: "nav.settings" },
      ]
    }
    return [
      { href: "/notifications", icon: Bell, labelKey: "nav.notifications" },
      { href: "/messages", icon: MessageSquare, labelKey: "nav.messages" },
      { href: "/settings", icon: Settings, labelKey: "nav.settings" },
    ]
  })()

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/")

  return (
    <>
      {/* 移动端底部导航 — 仅在 sm 以下显示 */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a1120]/95 backdrop-blur-md border-t border-white/5 safe-bottom">
        <div className="flex items-center justify-around h-14 px-1">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0 flex-1 ${
                  active ? "text-sky-400" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] truncate w-full text-center">
                  {t(item.labelKey)}
                </span>
              </Link>
            )
          })}

          {/* 更多按钮 */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-all flex-1 ${
              moreOpen ? "text-sky-400" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px]">{t("nav.more") || "更多"}</span>
          </button>
        </div>
      </nav>

      {/* 更多菜单抽屉 */}
      {moreOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setMoreOpen(false)}
          />
          <div className="sm:hidden fixed bottom-14 left-0 right-0 z-50 bg-[#1e293b] border-t border-white/5 rounded-t-2xl p-4 safe-bottom drawer-open">
            <div className="w-12 h-1 bg-slate-600 rounded-full mx-auto mb-4" />
            <p className="text-xs text-slate-500 mb-3 px-2">{t("nav.moreMenu") || "更多功能"}</p>
            <div className="grid grid-cols-4 gap-2">
              {moreItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${
                      active ? "bg-sky-500/10 text-sky-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[11px] text-center leading-tight">{t(item.labelKey)}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}
