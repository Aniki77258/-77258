"use client"

import { cn } from "@/lib/utils"

interface TalentPoint {
  id: string
  x: number // 0-100 percentage
  y: number // 0-100 percentage
  size?: number
  type: "wind" | "lithium" | "storage"
  label: string
  count: number
}

interface GlobalRadarMapProps {
  className?: string
  points?: TalentPoint[]
  showScan?: boolean
  showConnections?: boolean
  compact?: boolean
}

const DEFAULT_POINTS: TalentPoint[] = [
  { id: "cn-beijing", x: 72, y: 32, type: "wind", label: "中国·北京", count: 3850 },
  { id: "cn-shanghai", x: 74, y: 40, type: "lithium", label: "中国·上海", count: 2960 },
  { id: "cn-shenzhen", x: 71, y: 48, type: "lithium", label: "中国·深圳", count: 1840 },
  { id: "us-sf", x: 8, y: 32, type: "storage", label: "美国·硅谷", count: 2150 },
  { id: "us-boston", x: 18, y: 28, type: "wind", label: "美国·波士顿", count: 1420 },
  { id: "de-munich", x: 48, y: 25, type: "wind", label: "德国·慕尼黑", count: 1680 },
  { id: "de-berlin", x: 47, y: 22, type: "storage", label: "德国·柏林", count: 1230 },
  { id: "dk-copenhagen", x: 49, y: 18, type: "wind", label: "丹麦·哥本哈根", count: 1980 },
  { id: "jp-tokyo", x: 82, y: 38, type: "lithium", label: "日本·东京", count: 1320 },
  { id: "kr-seoul", x: 79, y: 35, type: "lithium", label: "韩国·首尔", count: 1150 },
  { id: "uk-london", x: 44, y: 22, type: "wind", label: "英国·伦敦", count: 980 },
  { id: "fr-paris", x: 45, y: 28, type: "storage", label: "法国·巴黎", count: 760 },
  { id: "in-bangalore", x: 64, y: 52, type: "lithium", label: "印度·班加罗尔", count: 890 },
  { id: "br-saopaulo", x: 32, y: 68, type: "wind", label: "巴西·圣保罗", count: 650 },
  { id: "au-sydney", x: 85, y: 72, type: "storage", label: "澳洲·悉尼", count: 580 },
  { id: "se-stockholm", x: 50, y: 15, type: "wind", label: "瑞典·斯德哥尔摩", count: 720 },
  { id: "ca-toronto", x: 20, y: 26, type: "wind", label: "加拿大·多伦多", count: 680 },
  { id: "nl-amsterdam", x: 46, y: 24, type: "storage", label: "荷兰·阿姆斯特丹", count: 540 },
  { id: "sg-singapore", x: 72, y: 56, type: "lithium", label: "新加坡", count: 470 },
  { id: "no-oslo", x: 48, y: 13, type: "wind", label: "挪威·奥斯陆", count: 420 },
]

const typeColors = {
  wind: { fill: "#38bdf8", glow: "rgba(56,189,248,0.4)" },
  lithium: { fill: "#4ade80", glow: "rgba(74,222,128,0.4)" },
  storage: { fill: "#a78bfa", glow: "rgba(167,139,250,0.4)" },
}

const typeLabel = { wind: "风能", lithium: "锂电", storage: "储能" }

export function GlobalRadarMap({
  className, points = DEFAULT_POINTS, showScan = true, showConnections = true, compact = false
}: GlobalRadarMapProps) {
  const maxCount = Math.max(...points.map(p => p.count), 1)

  return (
    <div className={cn("relative w-full", compact ? "aspect-[1.8]" : "aspect-[2]", className)}>
      {/* Background grid */}
      <svg viewBox="0 0 200 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(56,189,248,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <filter id="pointGlow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* World outline - simplified */}
        <rect x="0" y="0" width="200" height="100" fill="url(#radarGlow)" />

        {/* Lat/Lon grid lines */}
        {Array.from({ length: 5 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={20 + i * 15} x2="200" y2={20 + i * 15}
            stroke="rgba(56,189,248,0.04)" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`v${i}`} x1={15 + i * 28} y1="0" x2={15 + i * 28} y2="100"
            stroke="rgba(56,189,248,0.04)" strokeWidth="0.5" />
        ))}

        {/* Simplified continent outlines */}
        <path d="M16,28 L28,24 L32,28 L30,34 L24,38 L16,36 Z" fill="rgba(56,189,248,0.03)" stroke="rgba(56,189,248,0.08)" strokeWidth="0.5" />
        <path d="M44,20 L52,16 L56,20 L54,26 L48,30 L44,26 Z" fill="rgba(74,222,128,0.03)" stroke="rgba(74,222,128,0.08)" strokeWidth="0.5" />
        <path d="M66,28 L80,24 L84,32 L80,40 L72,44 L66,36 Z" fill="rgba(56,189,248,0.03)" stroke="rgba(56,189,248,0.08)" strokeWidth="0.5" />
        <path d="M28,62 L44,58 L48,68 L40,76 L28,72 Z" fill="rgba(74,222,128,0.03)" stroke="rgba(74,222,128,0.08)" strokeWidth="0.5" />
        <path d="M56,66 L70,62 L74,72 L62,78 L56,72 Z" fill="rgba(167,139,250,0.03)" stroke="rgba(167,139,250,0.08)" strokeWidth="0.5" />

        {/* Connection lines */}
        {showConnections && points.slice(0, 10).map((p, i) => {
          const next = points[(i + 1) % 10]
          return (
            <line
              key={`conn-${i}`}
              x1={p.x * 2} y1={p.y * 2}
              x2={next.x * 2} y2={next.y * 2}
              stroke="rgba(56,189,248,0.08)"
              strokeWidth="0.3"
              strokeDasharray="2 4"
            />
          )
        })}

        {/* Talent points */}
        {points.map((point) => {
          const size = Math.max(1.5, (point.count / maxCount) * (compact ? 4 : 5) + 1)
          return (
            <g key={point.id} filter="url(#pointGlow)">
              <circle
                cx={point.x * 2}
                cy={point.y * 2}
                r={size}
                fill={typeColors[point.type].fill}
                opacity="0.9"
                className="blink"
                style={{ animationDelay: `${Math.random() * 2}s` }}
              />
              <circle
                cx={point.x * 2}
                cy={point.y * 2}
                r={size + 3}
                fill="none"
                stroke={typeColors[point.type].glow}
                strokeWidth="0.5"
                opacity="0.4"
              >
                <animate attributeName="r" from={size + 2} to={size + 6} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          )
        })}

        {/* Radar scan line */}
        {showScan && (
          <line
            x1="100" y1="50"
            x2="180" y2="50"
            stroke="rgba(56,189,248,0.15)"
            strokeWidth="1"
            className="scan-rotate"
            style={{ transformOrigin: "100px 50px" }}
          />
        )}
      </svg>

      {/* Legend */}
      {!compact && (
        <div className="absolute bottom-2 left-2 flex gap-3 text-[10px]">
          {(["wind", "lithium", "storage"] as const).map(t => (
            <span key={t} className="flex items-center gap-1 text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[t].fill }} />
              {typeLabel[t]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
