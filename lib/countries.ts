// ============================================================
// Country/Region Data — 国家/地区数据
// ============================================================

export interface CountryInfo {
  code: string        // ISO 3166-1 alpha-2
  nameZh: string
  nameEn: string
  region: string      // continent/region
  flag: string        // emoji flag
}

/**
 * Major countries/regions relevant to global wind & lithium talent recruitment.
 * Covering wind energy hubs (Europe, Americas, China) and lithium battery centers (Asia-Pacific).
 */
export const COUNTRIES: CountryInfo[] = [
  // Asia-Pacific — 锂电/风能核心区域
  { code: 'CN', nameZh: '中国', nameEn: 'China', region: 'Asia-Pacific', flag: '🇨🇳' },
  { code: 'JP', nameZh: '日本', nameEn: 'Japan', region: 'Asia-Pacific', flag: '🇯🇵' },
  { code: 'KR', nameZh: '韩国', nameEn: 'South Korea', region: 'Asia-Pacific', flag: '🇰🇷' },
  { code: 'SG', nameZh: '新加坡', nameEn: 'Singapore', region: 'Asia-Pacific', flag: '🇸🇬' },
  { code: 'IN', nameZh: '印度', nameEn: 'India', region: 'Asia-Pacific', flag: '🇮🇳' },
  { code: 'AU', nameZh: '澳大利亚', nameEn: 'Australia', region: 'Asia-Pacific', flag: '🇦🇺' },
  { code: 'TW', nameZh: '中国台湾', nameEn: 'Taiwan, China', region: 'Asia-Pacific', flag: '🇨🇳' },
  { code: 'HK', nameZh: '中国香港', nameEn: 'Hong Kong, China', region: 'Asia-Pacific', flag: '🇨🇳' },

  // Europe — 海上风电核心区域
  { code: 'DE', nameZh: '德国', nameEn: 'Germany', region: 'Europe', flag: '🇩🇪' },
  { code: 'DK', nameZh: '丹麦', nameEn: 'Denmark', region: 'Europe', flag: '🇩🇰' },
  { code: 'UK', nameZh: '英国', nameEn: 'United Kingdom', region: 'Europe', flag: '🇬🇧' },
  { code: 'FR', nameZh: '法国', nameEn: 'France', region: 'Europe', flag: '🇫🇷' },
  { code: 'ES', nameZh: '西班牙', nameEn: 'Spain', region: 'Europe', flag: '🇪🇸' },
  { code: 'NL', nameZh: '荷兰', nameEn: 'Netherlands', region: 'Europe', flag: '🇳🇱' },
  { code: 'SE', nameZh: '瑞典', nameEn: 'Sweden', region: 'Europe', flag: '🇸🇪' },
  { code: 'NO', nameZh: '挪威', nameEn: 'Norway', region: 'Europe', flag: '🇳🇴' },
  { code: 'IT', nameZh: '意大利', nameEn: 'Italy', region: 'Europe', flag: '🇮🇹' },
  { code: 'PT', nameZh: '葡萄牙', nameEn: 'Portugal', region: 'Europe', flag: '🇵🇹' },

  // Americas — 风电/锂电新兴市场
  { code: 'US', nameZh: '美国', nameEn: 'United States', region: 'Americas', flag: '🇺🇸' },
  { code: 'CA', nameZh: '加拿大', nameEn: 'Canada', region: 'Americas', flag: '🇨🇦' },
  { code: 'BR', nameZh: '巴西', nameEn: 'Brazil', region: 'Americas', flag: '🇧🇷' },
  { code: 'MX', nameZh: '墨西哥', nameEn: 'Mexico', region: 'Americas', flag: '🇲🇽' },
  { code: 'CL', nameZh: '智利', nameEn: 'Chile', region: 'Americas', flag: '🇨🇱' },

  // Middle East / Africa
  { code: 'AE', nameZh: '阿联酋', nameEn: 'United Arab Emirates', region: 'Middle East', flag: '🇦🇪' },
  { code: 'SA', nameZh: '沙特阿拉伯', nameEn: 'Saudi Arabia', region: 'Middle East', flag: '🇸🇦' },
  { code: 'ZA', nameZh: '南非', nameEn: 'South Africa', region: 'Africa', flag: '🇿🇦' },
  { code: 'MA', nameZh: '摩洛哥', nameEn: 'Morocco', region: 'Africa', flag: '🇲🇦' },
]

export function getCountryName(code: string, lang: 'zh' | 'en' = 'zh'): string {
  const country = COUNTRIES.find(c => c.code === code)
  if (!country) return code
  return lang === 'zh' ? country.nameZh : country.nameEn
}

export function getCountryFlag(code: string): string {
  const country = COUNTRIES.find(c => c.code === code)
  return country?.flag || '🏳️'
}

export function findCountry(code: string): CountryInfo | undefined {
  return COUNTRIES.find(c => c.code === code)
}

export const REGIONS = ['Asia-Pacific', 'Europe', 'Americas', 'Middle East', 'Africa'] as const

// ============================================================
// Work Arrangement Types
// ============================================================

export type WorkArrangement = 'remote' | 'hybrid' | 'onsite'

export const WORK_ARRANGEMENTS: { value: WorkArrangement; labelZh: string; labelEn: string }[] = [
  { value: 'remote', labelZh: '远程办公', labelEn: 'Remote' },
  { value: 'hybrid', labelZh: '混合办公', labelEn: 'Hybrid' },
  { value: 'onsite', labelZh: '现场办公', labelEn: 'Onsite' },
]

export function getWorkArrangementLabel(value: WorkArrangement, lang: 'zh' | 'en' = 'zh'): string {
  const arr = WORK_ARRANGEMENTS.find(a => a.value === value)
  return arr ? (lang === 'zh' ? arr.labelZh : arr.labelEn) : value
}

// ============================================================
// Visa Status
// ============================================================

export type VisaStatus = 'supported' | 'not_supported' | 'unknown'

export const VISA_STATUSES: { value: VisaStatus; labelZh: string; labelEn: string }[] = [
  { value: 'supported', labelZh: '支持签证', labelEn: 'Visa Supported' },
  { value: 'not_supported', labelZh: '暂不支持签证', labelEn: 'Visa Not Supported' },
  { value: 'unknown', labelZh: '签证状态未知', labelEn: 'Visa Status Unknown' },
]

export function getVisaStatusLabel(status: VisaStatus, lang: 'zh' | 'en' = 'zh'): string {
  const s = VISA_STATUSES.find(v => v.value === status)
  return s ? (lang === 'zh' ? s.labelZh : s.labelEn) : status
}

// ============================================================
// Industry selection (for register / jobs)
// ============================================================

export const INDUSTRIES = [
  { value: 'wind_energy', labelZh: '风能', labelEn: 'Wind Energy' },
  { value: 'lithium_battery', labelZh: '锂电', labelEn: 'Lithium Battery' },
  { value: 'wind_storage', labelZh: '风储协同', labelEn: 'Wind-Storage Integration' },
  { value: 'energy_storage', labelZh: '储能', labelEn: 'Energy Storage' },
  { value: 'bms', labelZh: 'BMS/电池管理', labelEn: 'BMS' },
  { value: 'offshore_wind', labelZh: '海上风电', labelEn: 'Offshore Wind' },
  { value: 'solar', labelZh: '光伏', labelEn: 'Solar' },
  { value: 'other_renewable', labelZh: '其他新能源', labelEn: 'Other Renewable' },
]

export function getIndustryLabel(value: string, lang: 'zh' | 'en' = 'zh'): string {
  const ind = INDUSTRIES.find(i => i.value === value)
  return ind ? (lang === 'zh' ? ind.labelZh : ind.labelEn) : value
}
