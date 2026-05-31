"use client"

import { cn } from "@/lib/utils"

interface TechCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean
  scan?: boolean
  padding?: "default" | "sm" | "none"
  children: React.ReactNode
}

const paddingMap = { default: "p-6", sm: "p-4", none: "p-0" }

export function TechCard({
  className, glow = false, scan = false, padding = "default", children, ...props
}: TechCardProps) {
  return (
    <div
      className={cn(
        "glass-card",
        glow && "glow-border",
        scan && "scan-line",
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function TechCardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props}>
      {children}
    </div>
  )
}

export function TechCardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-white tracking-tight", className)} {...props}>
      {children}
    </h3>
  )
}

export function TechCardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-slate-400", className)} {...props}>
      {children}
    </p>
  )
}
