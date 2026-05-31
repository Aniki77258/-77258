// ============================================================
// Timezone Utilities — 时区工具
// ============================================================

export interface TimezoneInfo {
  value: string
  label: string
  offset: string
  abbr: string
  region: string
}

/**
 * Major timezones for global wind/lithium talent locations.
 * Covering key regions: Asia-Pacific, Europe, Americas
 */
export const TIMEZONES: TimezoneInfo[] = [
  // Asia-Pacific
  { value: 'Asia/Shanghai', label: '北京/上海 (UTC+8)', offset: '+08:00', abbr: 'CST', region: 'Asia-Pacific' },
  { value: 'Asia/Tokyo', label: '东京 (UTC+9)', offset: '+09:00', abbr: 'JST', region: 'Asia-Pacific' },
  { value: 'Asia/Seoul', label: '首尔 (UTC+9)', offset: '+09:00', abbr: 'KST', region: 'Asia-Pacific' },
  { value: 'Asia/Singapore', label: '新加坡 (UTC+8)', offset: '+08:00', abbr: 'SGT', region: 'Asia-Pacific' },
  { value: 'Asia/Kolkata', label: '印度 (UTC+5:30)', offset: '+05:30', abbr: 'IST', region: 'Asia-Pacific' },
  { value: 'Australia/Sydney', label: '悉尼 (UTC+10)', offset: '+10:00', abbr: 'AEST', region: 'Asia-Pacific' },
  // Europe
  { value: 'Europe/London', label: '伦敦 (UTC+0)', offset: '+00:00', abbr: 'GMT', region: 'Europe' },
  { value: 'Europe/Berlin', label: '柏林 (UTC+1)', offset: '+01:00', abbr: 'CET', region: 'Europe' },
  { value: 'Europe/Paris', label: '巴黎 (UTC+1)', offset: '+01:00', abbr: 'CET', region: 'Europe' },
  { value: 'Europe/Copenhagen', label: '哥本哈根 (UTC+1)', offset: '+01:00', abbr: 'CET', region: 'Europe' },
  { value: 'Europe/Madrid', label: '马德里 (UTC+1)', offset: '+01:00', abbr: 'CET', region: 'Europe' },
  // Americas
  { value: 'America/New_York', label: '纽约 (UTC-5)', offset: '-05:00', abbr: 'EST', region: 'Americas' },
  { value: 'America/Chicago', label: '芝加哥 (UTC-6)', offset: '-06:00', abbr: 'CST', region: 'Americas' },
  { value: 'America/Denver', label: '丹佛 (UTC-7)', offset: '-07:00', abbr: 'MST', region: 'Americas' },
  { value: 'America/Los_Angeles', label: '洛杉矶 (UTC-8)', offset: '-08:00', abbr: 'PST', region: 'Americas' },
  { value: 'America/Sao_Paulo', label: '圣保罗 (UTC-3)', offset: '-03:00', abbr: 'BRT', region: 'Americas' },
  // Middle East / Africa
  { value: 'Asia/Dubai', label: '迪拜 (UTC+4)', offset: '+04:00', abbr: 'GST', region: 'Middle East' },
  { value: 'Africa/Johannesburg', label: '约翰内斯堡 (UTC+2)', offset: '+02:00', abbr: 'SAST', region: 'Africa' },
]

export function findTimezone(value: string): TimezoneInfo | undefined {
  return TIMEZONES.find(tz => tz.value === value)
}

export function getDefaultTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'Asia/Shanghai'
  }
}

/**
 * Convert a date/time from one timezone to another.
 * Uses Intl.DateTimeFormat for conversion.
 */
export function convertTime(
  date: Date | string,
  fromTz: string,
  toTz: string,
  format: 'time' | 'datetime' | 'full' = 'datetime'
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return '—'

  const options: Intl.DateTimeFormatOptions =
    format === 'time'
      ? { timeZone: toTz, hour: '2-digit', minute: '2-digit' }
      : format === 'datetime'
        ? { timeZone: toTz, year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', weekday: 'short' }
        : { timeZone: toTz, year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'long' }

  return new Intl.DateTimeFormat('en-US', options).format(d)
}

/**
 * Get offset string for a timezone at a given time
 */
export function getTimezoneOffset(tz: string, date: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'shortOffset',
    }).formatToParts(date)
    const offsetPart = parts.find(p => p.type === 'timeZoneName')
    return offsetPart?.value || 'UTC'
  } catch {
    return 'UTC'
  }
}

/**
 * Get timezone abbreviation
 */
export function getTimezoneAbbr(tz: string): string {
  const found = TIMEZONES.find(t => t.value === tz)
  return found?.abbr || 'UTC'
}
