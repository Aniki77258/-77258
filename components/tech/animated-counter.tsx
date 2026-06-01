"use client"

import { useEffect, useRef, useState } from "react"

/**
 * 数字跳动动画组件
 * 从 0 动画增长到目标值，带科技感格式化
 */
export function AnimatedCounter({
  value,
  duration = 1600,
  className = "",
}: {
  value: number
  duration?: number
  className?: string
}) {
  const [display, setDisplay] = useState("0")
  const ref = useRef<{ start: number; end: number; startTime: number | null }>({
    start: 0,
    end: value,
    startTime: null,
  })

  useEffect(() => {
    ref.current.end = value
    ref.current.startTime = null

    let animId: number
    const step = (timestamp: number) => {
      if (!ref.current.startTime) ref.current.startTime = timestamp
      const elapsed = timestamp - ref.current.startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const current = Math.floor(ref.current.start + (ref.current.end - ref.current.start) * eased)
      setDisplay(current.toLocaleString())
      if (progress < 1) {
        animId = requestAnimationFrame(step)
      }
    }
    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [value, duration])

  return (
    <span className={`tabular-nums ${className}`}>
      {display}
    </span>
  )
}

/**
 * 带后缀的数字跳动
 */
export function AnimatedValue({
  value,
  suffix = "",
  prefix = "",
  duration = 1600,
  className = "",
}: {
  value: number
  suffix?: string
  prefix?: string
  duration?: number
  className?: string
}) {
  const [display, setDisplay] = useState("0")

  useEffect(() => {
    const end = value
    let startTime: number | null = null
    let animId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const current = Math.floor(end * eased)
      setDisplay(current.toLocaleString())
      if (progress < 1) {
        animId = requestAnimationFrame(step)
      } else {
        setDisplay(end.toLocaleString())
      }
    }
    animId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animId)
  }, [value, duration])

  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}{display}{suffix}
    </span>
  )
}
