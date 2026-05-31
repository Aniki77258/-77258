"use client"

import { usePathname } from "next/navigation"
import { AppLayout } from "@/components/shared/app-sidebar"
import { AISafetyNote } from "@/components/shared/ai-disclaimer"
import {
  BotMessageSquare,
  Target,
  FileText,
  MessageSquare,
  FileCheck2,
  DollarSign,
  AlertTriangle,
} from "lucide-react"

const navItems = [
  {
    label: "AI 助手",
    href: "/ai",
    icon: BotMessageSquare,
    exact: true,
  },
  {
    label: "人才推荐",
    href: "/ai/recommend",
    icon: Target,
  },
  {
    label: "邀请文案",
    href: "/ai/invitation-text",
    icon: FileText,
  },
  {
    label: "面试问题",
    href: "/ai/interview-questions",
    icon: MessageSquare,
  },
  {
    label: "评估报告",
    href: "/ai/assessment",
    icon: FileCheck2,
  },
  {
    label: "薪酬建议",
    href: "/ai/salary",
    icon: DollarSign,
  },
  {
    label: "风险预警",
    href: "/ai/risks",
    icon: AlertTriangle,
  },
]

export default function AILayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AppLayout>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* AI Sub-navigation */}
        <aside className="hidden lg:flex w-52 shrink-0 flex-col border-r border-[#1a2a44] bg-[#0a1125] py-4 px-2">
          <div className="px-3 mb-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
              AI 辅助工具
            </p>
          </div>
          <nav className="flex-1 space-y-0.5">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href)

              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </a>
              )
            })}
          </nav>
          <div className="px-3 pt-3 mt-3 border-t border-[#1a2a44]">
            <AISafetyNote />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </AppLayout>
  )
}
