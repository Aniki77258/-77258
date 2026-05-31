// ============================================================
// Unified Currency Formatting — 统一货币格式化
// ============================================================

export type CurrencyCode = 'CNY' | 'USD' | 'EUR' | 'SGD'

export interface CurrencyInfo {
  code: CurrencyCode
  symbol: string
  label: string
  locale: string
  /** Exchange rate relative to CNY (示例数据，仅用于展示) */
  rateToCNY: number
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  CNY: {
    code: 'CNY',
    symbol: '¥',
    label: '人民币 (CNY)',
    locale: 'zh-CN',
    rateToCNY: 1,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: '美元 (USD)',
    locale: 'en-US',
    rateToCNY: 7.25,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: '欧元 (EUR)',
    locale: 'de-DE',
    rateToCNY: 7.85,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    label: '新加坡元 (SGD)',
    locale: 'en-SG',
    rateToCNY: 5.40,
  },
}

export const CURRENCY_LIST = Object.values(CURRENCIES)

/**
 * Convert an amount from one currency to another using example rates.
 * 重要: 汇率为示例数据，仅供展示，非真实市场汇率。
 */
export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount
  const amountInCNY = amount * CURRENCIES[from].rateToCNY
  return amountInCNY / CURRENCIES[to].rateToCNY
}

/**
 * Format a number as currency string with proper locale.
 * @param amount - The amount in the target currency
 * @param currency - Target currency code
 * @param compact - Use compact notation for large numbers (e.g., 50K instead of 50,000)
 */
export function formatCurrency(amount: number, currency: CurrencyCode, compact: boolean = false): string {
  const info = CURRENCIES[currency]
  const absAmount = Math.abs(amount)

  if (compact && absAmount >= 10000) {
    // For Chinese salaries, use 万 (wan) similar to original behavior
    if (currency === 'CNY') {
      const wan = amount / 10000
      if (wan >= 100) return `${info.symbol}${Math.round(wan)}万/年`
      return `${info.symbol}${wan.toFixed(1)}万/年`
    }
    // For others, use K format
    const k = amount / 1000
    if (k >= 1000) {
      const m = amount / 1000000
      return `${info.symbol}${m.toFixed(1)}M/yr`
    }
    return `${info.symbol}${Math.round(k)}K/yr`
  }

  try {
    return new Intl.NumberFormat(info.locale, {
      style: 'currency',
      currency: info.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${info.symbol}${amount.toLocaleString()}`
  }
}

/**
 * Format a salary range for display
 */
export function formatSalaryRange(
  min: number,
  max: number,
  currency: CurrencyCode,
  compact: boolean = true
): string {
  if (compact) {
    const minStr = formatCurrency(min, currency, true).replace(/\/年$/, '').replace(/\/yr$/, '')
    const maxStr = formatCurrency(max, currency, true).replace(/\/年$/, '').replace(/\/yr$/, '')
    return `${minStr} - ${maxStr}`
  }
  return `${formatCurrency(min, currency, false)} - ${formatCurrency(max, currency, false)}`
}

/**
 * Get exchange rate disclaimer text
 */
export function getExchangeRateDisclaimer(): string {
  return '⚠️ * 汇率为示例数据，仅供展示参考，实际汇率请以交易当日市场汇率为准。\n⚠️ * Exchange rates are for demonstration only. Actual rates subject to market conditions on transaction date.'
}
