"use client"

import { useEffect, useRef } from "react"

/**
 * 科技感动态背景：网格 + 粒子 + 扫描线
 * 渲染到 canvas 上，固定在页面最底层
 */
export function TechBackground({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = []

    const resize = () => {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // 初始化粒子
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        o: Math.random() * 0.5 + 0.1,
      })
    }

    let frame = 0
    const draw = () => {
      frame++
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      const w = canvas!.width
      const h = canvas!.height

      // 1. 网格
      ctx!.strokeStyle = "rgba(56, 189, 248, 0.04)"
      ctx!.lineWidth = 0.5
      const gridSize = 60
      for (let x = 0; x < w; x += gridSize) {
        ctx!.beginPath()
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x, h)
        ctx!.stroke()
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx!.beginPath()
        ctx!.moveTo(0, y)
        ctx!.lineTo(w, y)
        ctx!.stroke()
      }

      // 2. 扫描线
      const scanY = (frame * 0.8) % (h + 200) - 100
      const scanGrad = ctx!.createLinearGradient(0, scanY - 80, 0, scanY + 80)
      scanGrad.addColorStop(0, "rgba(56, 189, 248, 0)")
      scanGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.05)")
      scanGrad.addColorStop(1, "rgba(56, 189, 248, 0)")
      ctx!.fillStyle = scanGrad
      ctx!.fillRect(0, scanY - 80, w, 160)

      // 3. 粒子
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(56, 189, 248, ${p.o})`
        ctx!.fill()
      })

      // 4. 粒子连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.strokeStyle = `rgba(56, 189, 248, ${0.08 * (1 - dist / 120)})`
            ctx!.lineWidth = 0.5
            ctx!.stroke()
          }
        }
      }

      // 5. 底部辉光
      const bottomGlow = ctx!.createRadialGradient(w / 2, h, 0, w / 2, h, h * 0.6)
      bottomGlow.addColorStop(0, "rgba(56, 189, 248, 0.03)")
      bottomGlow.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx!.fillStyle = bottomGlow
      ctx!.fillRect(0, 0, w, h)

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full -z-10 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}

/**
 * 数据流动画 SVG 装饰（用于卡片角落）
 */
export function DataFlowCorner({ color = "#38bdf8" }: { color?: string }) {
  return (
    <svg className="absolute w-6 h-6 opacity-40" viewBox="0 0 24 24" fill="none">
      <path d="M0 0 L8 0 M0 0 L0 8" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <circle cx="8" cy="0" r="1.5" fill={color}>
        <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="0" cy="8" r="1.5" fill={color}>
        <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

/**
 * 脉冲圆环动画（用于指标卡片图标）
 */
export function PulseRing({ color = "#38bdf8", size = 40 }: { color?: string; size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="1" opacity="0.3">
          <animate attributeName="r" values="12;18;12" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="20" cy="20" r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" />
      </svg>
    </div>
  )
}
