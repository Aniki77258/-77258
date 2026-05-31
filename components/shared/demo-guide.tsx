"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowRight, X, Play, RefreshCw, CheckCircle2 } from "lucide-react"

interface DemoGuideProps {
  title: string
  description: string
  nextLabel?: string
  nextHref?: string
  onNext?: () => void
  className?: string
}

export function DemoGuide({ title, description, nextLabel, nextHref, onNext, className = "" }: DemoGuideProps) {
  return (
    <Card className={`bg-amber-500/5 border-amber-500/20 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-amber-300 text-sm flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          演示引导
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
        <p className="text-slate-400 text-xs mb-3">{description}</p>
        {(nextLabel || nextHref) && (
          <Button
            size="sm"
            className="bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 text-xs"
            onClick={() => {
              onNext?.()
              if (nextHref) window.location.href = nextHref
            }}
          >
            {nextLabel || "下一步"} <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

interface DemoInitButtonProps {
  onInitComplete?: () => void
  className?: string
}

export function DemoInitButton({ onInitComplete, className = "" }: DemoInitButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [message, setMessage] = useState("")

  async function initDemo() {
    setIsLoading(true)
    setMessage("正在初始化演示数据...")
    try {
      const res = await fetch("/api/demo/init", { method: "POST" })
      const data = await res.json()
      if (data.success) {
        setIsDone(true)
        setMessage(data.message || "演示数据初始化完成！")
        onInitComplete?.()
      } else {
        setMessage(data.message || "初始化失败")
      }
    } catch {
      setMessage("网络错误，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      {isDone ? (
        <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
          {message}
        </div>
      ) : (
        <Button
          size="sm"
          onClick={initDemo}
          disabled={isLoading}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              {message || "初始化中..."}
            </>
          ) : (
            <>
              <Play className="w-3 h-3 mr-1" />
              初始化演示数据
            </>
          )}
        </Button>
      )}
    </div>
  )
}
