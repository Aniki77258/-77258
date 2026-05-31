// ============================================================
// i18n React Context — Language Provider + useLanguage Hook
// ============================================================

'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { Language, TranslationDict } from './types'
import { translations } from './translations'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string, fallback?: string) => string
  /** Get a nested translation object. E.g., tk('nav') returns all nav translations */
  tk: <K extends keyof TranslationDict>(section: K) => TranslationDict[K]
  /** Format relative time */
  formatRelativeTime: (dateStr: string) => string
  /** Get locale string for date formatting */
  locale: string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'gtr-language'

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'zh'
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
    // Detect browser language
    const navLang = navigator.language.toLowerCase()
    if (navLang.startsWith('en')) return 'en'
  } catch {}
  return 'zh'
}

// Deep getter for nested object paths like "nav.dashboard" or "notifications.types.all"
function deepGet(obj: any, path: string): any {
  const keys = path.split('.')
  let current = obj
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined
    current = current[key]
  }
  return current
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try { localStorage.setItem(STORAGE_KEY, lang) } catch {}
    // Update document lang attribute
    document.documentElement.lang = lang === 'en' ? 'en-US' : 'zh-CN'
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'zh' ? 'en' : 'zh')
  }, [language, setLanguage])

  const dict = translations[language]

  const t = useCallback((key: string, fallback?: string): string => {
    const value = deepGet(dict, key)
    if (typeof value === 'string') return value
    if (fallback !== undefined) return fallback
    // Return the key itself as fallback
    return key
  }, [dict])

  const tk = useCallback(<K extends keyof TranslationDict>(section: K): TranslationDict[K] => {
    return dict[section]
  }, [dict])

  const formatRelativeTime = useCallback((dateStr: string): string => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    const diffHour = Math.floor(diffMs / 3600000)
    const diffDay = Math.floor(diffMs / 86400000)

    const d = dict.common
    if (diffMin < 1) return d.justNow
    if (diffMin < 60) return `${diffMin} ${d.minutesAgo}`
    if (diffHour < 24) return `${diffHour} ${d.hoursAgo}`
    if (diffDay < 7) return `${diffDay} ${d.daysAgo}`

    // Check if today
    const todayStr = now.toDateString()
    const dateDayStr = date.toDateString()
    if (dateDayStr === todayStr) return d.today

    // Check if yesterday
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === yesterday.toDateString()) return d.yesterday

    // Otherwise return formatted date
    const localeStr = language === 'zh' ? 'zh-CN' : 'en-US'
    return date.toLocaleDateString(localeStr, { month: 'short', day: 'numeric' })
  }, [language, dict])

  const value = useMemo(() => ({
    language,
    setLanguage,
    toggleLanguage,
    t,
    tk,
    formatRelativeTime,
    locale: language === 'zh' ? 'zh-CN' : 'en-US',
  }), [language, setLanguage, toggleLanguage, t, tk, formatRelativeTime])

  // Prevent hydration mismatch by rendering children only after mount
  // but still provide context during SSR with default language
  if (!mounted) {
    return (
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return ctx
}

// ============================================================
// Language Switcher Component
// ============================================================

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={() => setLanguage('zh')}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          language === 'zh'
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            : 'text-slate-500 hover:text-slate-300 border border-transparent'
        }`}
        title="中文"
      >
        中
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 text-xs rounded transition-colors ${
          language === 'en'
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
            : 'text-slate-500 hover:text-slate-300 border border-transparent'
        }`}
        title="English"
      >
        EN
      </button>
    </div>
  )
}
