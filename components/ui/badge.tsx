import * as React from "react"
import { cn } from "@/lib/utils"

const variantClasses: Record<string, string> = {
  default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
  outline: "border-border text-foreground hover:bg-accent",
  destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
  success: "border-transparent bg-emerald-500 text-white hover:bg-emerald-600",
  warning: "border-transparent bg-amber-500 text-white hover:bg-amber-600",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "destructive" | "success" | "warning"
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = "Badge"
