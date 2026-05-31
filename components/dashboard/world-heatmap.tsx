"use client"

import { useMemo } from "react"

export interface HeatmapPoint {
  id: string
  country: string
  label: string
  cx: number
  cy: number
  value: number
  windPct: number
  lithiumPct: number
  storagePct: number
}

const DEFAULT_POINTS: HeatmapPoint[] = [
  { id: "cn", country: "中国", label: "CN", cx: 680, cy: 255, value: 8650, windPct: 40, lithiumPct: 33, storagePct: 27 },
  { id: "us", country: "美国", label: "US", cx: 150, cy: 200, value: 7230, windPct: 35, lithiumPct: 40, storagePct: 25 },
  { id: "de", country: "德国", label: "DE", cx: 440, cy: 140, value: 4890, windPct: 38, lithiumPct: 30, storagePct: 32 },
  { id: "dk", country: "丹麦", label: "DK", cx: 465, cy: 105, value: 3210, windPct: 60, lithiumPct: 25, storagePct: 15 },
  { id: "jp", country: "日本", label: "JP", cx: 790, cy: 210, value: 2980, windPct: 25, lithiumPct: 50, storagePct: 25 },
  { id: "kr", country: "韩国", label: "KR", cx: 770, cy: 195, value: 2450, windPct: 20, lithiumPct: 55, storagePct: 25 },
  { id: "gb", country: "英国", label: "UK", cx: 410, cy: 120, value: 2870, windPct: 55, lithiumPct: 25, storagePct: 20 },
  { id: "fr", country: "法国", label: "FR", cx: 425, cy: 155, value: 1980, windPct: 30, lithiumPct: 35, storagePct: 35 },
  { id: "in", country: "印度", label: "IN", cx: 630, cy: 280, value: 2150, windPct: 35, lithiumPct: 40, storagePct: 25 },
  { id: "br", country: "巴西", label: "BR", cx: 280, cy: 380, value: 1560, windPct: 50, lithiumPct: 20, storagePct: 30 },
  { id: "au", country: "澳大利亚", label: "AU", cx: 740, cy: 390, value: 1340, windPct: 20, lithiumPct: 45, storagePct: 35 },
  { id: "ca", country: "加拿大", label: "CA", cx: 130, cy: 120, value: 1780, windPct: 40, lithiumPct: 30, storagePct: 30 },
  { id: "se", country: "瑞典", label: "SE", cx: 480, cy: 95, value: 1450, windPct: 45, lithiumPct: 30, storagePct: 25 },
  { id: "nl", country: "荷兰", label: "NL", cx: 435, cy: 130, value: 1680, windPct: 50, lithiumPct: 25, storagePct: 25 },
  { id: "es", country: "西班牙", label: "ES", cx: 415, cy: 175, value: 1320, windPct: 45, lithiumPct: 25, storagePct: 30 },
]

function getRadius(value: number, maxValue: number): number {
  const ratio = value / maxValue
  return 8 + ratio * 18 // 8-26px radius
}

function getOpacity(value: number, maxValue: number): number {
  const ratio = value / maxValue
  return 0.4 + ratio * 0.6 // 0.4-1.0
}

export function WorldHeatmap({ points = DEFAULT_POINTS, className = "" }: { points?: HeatmapPoint[]; className?: string }) {
  const maxValue = useMemo(() => Math.max(...points.map(p => p.value)), [points])
  // viewpoint: 900x450 (2:1 aspect ratio for world map)

  return (
    <svg
      viewBox="0 0 900 450"
      className={className}
      style={{ width: "100%", height: "auto" }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Grid pattern for ocean background */}
        <pattern id="oceanGrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1a2a44" strokeWidth="0.3" opacity="0.4" />
        </pattern>

        {/* Glow filter for heat spots */}
        <filter id="heatGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="heatGlowLarge" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradients */}
        <radialGradient id="hotGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="hotGradEmerald" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#10b981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="connectGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.15" />
        </radialGradient>
      </defs>

      {/* Ocean background */}
      <rect x="0" y="0" width="900" height="450" fill="#060d1a" />
      <rect x="0" y="0" width="900" height="450" fill="url(#oceanGrid)" />

      {/* Simplified continent outlines - stylized */}
      {/* North America */}
      <path d="M50,80 L60,40 L100,30 L160,35 L200,40 L220,60 L240,90 L250,130 L260,160 L250,200 L240,240 L220,280 L200,300 L180,310 L160,300 L140,280 L120,250 L100,200 L80,150 L60,110 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* South America */}
      <path d="M240,290 L260,270 L280,280 L300,300 L310,330 L320,370 L310,410 L300,430 L280,440 L260,430 L240,400 L230,360 L230,320 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* Europe */}
      <path d="M400,70 L420,60 L450,65 L470,70 L490,80 L500,95 L510,110 L500,130 L490,150 L480,170 L460,185 L440,190 L420,180 L410,160 L405,140 L400,120 L395,100 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* Africa */}
      <path d="M420,200 L440,190 L460,200 L480,220 L500,250 L510,280 L510,320 L500,360 L480,380 L460,390 L440,370 L430,340 L420,300 L415,260 L415,230 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* Asia */}
      <path d="M510,100 L540,80 L580,70 L620,60 L660,70 L700,80 L730,100 L750,120 L760,150 L770,180 L770,210 L760,240 L750,270 L730,300 L700,320 L660,340 L620,340 L580,320 L550,300 L530,280 L520,250 L510,220 L510,180 L510,140 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* Australia */}
      <path d="M710,370 L730,360 L750,365 L760,380 L760,400 L750,415 L735,420 L720,415 L710,400 L705,385 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* Scandinavia extra */}
      <path d="M450,50 L460,45 L480,50 L490,60 L485,70 L475,80 L460,75 L455,65 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* UK/Ireland */}
      <path d="M395,95 L405,90 L415,95 L415,105 L410,115 L400,115 L395,110 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* Japan */}
      <path d="M790,155 L798,145 L805,160 L803,180 L798,195 L792,200 L788,190 L786,175 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* Korea */}
      <path d="M765,170 L772,165 L780,175 L778,190 L774,198 L766,195 L762,185 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* India */}
      <path d="M620,270 L630,260 L645,265 L655,280 L655,310 L645,340 L630,355 L620,345 L615,320 L615,290 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* South East Asia islands */}
      <path d="M710,280 L720,270 L735,275 L740,290 L735,300 L720,305 L710,295 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.8" />

      {/* Central America */}
      <path d="M235,270 L245,265 L255,275 L250,290 L240,295 L232,285 Z"
        fill="#0c1830" stroke="#1a2a44" strokeWidth="0.8" opacity="0.6" />

      {/* Connection arcs between major hubs */}
      {points.slice(0, 5).map((p) => {
        // Connect top 5 countries to show network effect
        const others = points.slice(0, 5).filter(o => o.id !== p.id)
        return others.map(o => (
          <line
            key={`${p.id}-${o.id}`}
            x1={p.cx} y1={p.cy}
            x2={o.cx} y2={o.cy}
            stroke="url(#connectGrad)"
            strokeWidth="0.5"
            opacity="0.15"
          />
        ))
      }).flat()}

      {/* Heat spots */}
      {points.map((point) => {
        const r = getRadius(point.value, maxValue)
        const opacity = getOpacity(point.value, maxValue)
        const isTop3 = points.filter(p => p.value > point.value).length < 3

        return (
          <g key={point.id}>
            {/* Outer glow ring */}
            {isTop3 && (
              <circle
                cx={point.cx} cy={point.cy} r={r + 12}
                fill={`rgba(14,165,233,${0.05})`}
                filter="url(#heatGlowLarge)"
                className="animate-pulse"
                style={{ animationDuration: `${2 + Math.random() * 2}s` }}
              />
            )}
            {/* Middle ring */}
            <circle
              cx={point.cx} cy={point.cy} r={r + 4}
              fill={`rgba(14,165,233,${0.08})`}
              filter="url(#heatGlow)"
            />
            {/* Core heat spot */}
            <circle
              cx={point.cx} cy={point.cy} r={r}
              fill={`rgba(14,165,233,${opacity})`}
              filter="url(#heatGlow)"
              stroke="#0ea5e9"
              strokeWidth={isTop3 ? "1.5" : "0.8"}
              strokeOpacity={opacity}
            />
            {/* Inner dot */}
            <circle
              cx={point.cx} cy={point.cy} r={r * 0.45}
              fill="#ffffff"
              opacity={0.7}
            />
            {/* Country label */}
            <text
              x={point.cx}
              y={point.cy - r - 8}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="500"
              fontFamily="system-ui, sans-serif"
            >
              {point.label}
            </text>
            {isTop3 && (
              <text
                x={point.cx}
                y={point.cy + r + 14}
                textAnchor="middle"
                fill="#64748b"
                fontSize="8"
                fontFamily="system-ui, sans-serif"
              >
                {(point.value / 1000).toFixed(1)}K
              </text>
            )}
          </g>
        )
      })}

      {/* Legend */}
      <g transform="translate(15, 415)">
        <rect x="0" y="0" width="280" height="28" rx="6" fill="#0c1830" stroke="#1a2a44" strokeWidth="0.5" />
        <circle cx="18" cy="14" r="4" fill="#0ea5e9" opacity="0.8" />
        <text x="28" y="17" fill="#64748b" fontSize="9" fontFamily="system-ui, sans-serif"> 人才热点</text>
        <circle cx="108" cy="14" r="3" fill="#10b981" opacity="0.8" />
        <text x="115" y="17" fill="#64748b" fontSize="9" fontFamily="system-ui, sans-serif">锂电中心</text>
        <circle cx="195" cy="14" r="5" fill="#0ea5e9" opacity="0.6" stroke="#0ea5e9" strokeWidth="1" />
        <text x="204" y="17" fill="#64748b" fontSize="9" fontFamily="system-ui, sans-serif">超 5K 人才</text>
      </g>
    </svg>
  )
}
