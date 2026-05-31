"use client"

import { cn } from "@/lib/utils"

interface TechShellProps {
  children: React.ReactNode
  className?: string
  showGrid?: boolean
  showGlow?: boolean
}

export function TechShell({ children, className, showGrid = true, showGlow = true }: TechShellProps) {
  return (
    <div className={cn(
      "relative min-h-screen",
      showGrid && "bg-deep-space",
      className
    )}>
      {/* Ambient glow orbs */}
      {showGlow && (
        <>
          {/* Top-left aurora glow */}
          <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-[0.04] pointer-events-none"
            style={{ background: "radial-gradient(circle, #38bdf8, transparent 70%)" }} />
          {/* Top-right wind glow */}
          <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-[0.03] pointer-events-none"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent 70%)" }} />
          {/* Bottom lithium glow */}
          <div className="fixed bottom-[-20%] left-[30%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-[0.03] pointer-events-none"
            style={{ background: "radial-gradient(circle, #4ade80, transparent 70%)" }} />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between flex-wrap gap-3", className)}>
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
