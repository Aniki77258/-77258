// ============================================================
// Unified Date/Time Formatting — 统一日期时间格式化
// ============================================================

/**
 * Format a date string or Date object using locale-aware formatting.
 * @param date - ISO date string or Date object
 * @param locale - Locale string (e.g., 'zh-CN', 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 */
export function formatDate(
  date: string | Date,
  locale: string = 'zh-CN',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(locale, options)
}

/**
 * Format date as short format (e.g., 2026-05-30 or 05/30/2026)
 */
export function formatDateShort(date: string | Date, locale: string = 'zh-CN'): string {
  return formatDate(date, locale, { year: 'numeric', month: '2-digit', day: '2-digit' })
}

/**
 * Format date with time (e.g., 2026年5月30日 14:30)
 */
export function formatDateTime(
  date: string | Date,
  locale: string = 'zh-CN',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  })
}

/**
 * Format only the time portion
 */
export function formatTime(
  date: string | Date,
  locale: string = 'zh-CN'
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}

/**
 * Get relative time string (locale-aware)
 */
export function getRelativeTime(date: string | Date, locale: string = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  const isZh = locale.startsWith('zh')
  if (diffMin < 1) return isZh ? '刚刚' : 'Just now'
  if (diffMin < 60) return isZh ? `${diffMin} 分钟前` : `${diffMin} min ago`
  if (diffHour < 24) return isZh ? `${diffHour} 小时前` : `${diffHour} h ago`
  if (diffDay < 7) return isZh ? `${diffDay} 天前` : `${diffDay} d ago`

  return formatDateShort(date, locale)
}

/**
 * Format duration in minutes to human-readable
 */
export function formatDuration(minutes: number, locale: string = 'zh-CN'): string {
  if (minutes < 60) {
    return locale.startsWith('zh') ? `${minutes} 分钟` : `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return locale.startsWith('zh') ? `${hours} 小时` : `${hours} h`
  }
  return locale.startsWith('zh')
    ? `${hours} 小时 ${mins} 分钟`
    : `${hours} h ${mins} min`
}
