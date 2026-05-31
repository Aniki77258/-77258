"use client"

import { useLanguage } from "@/lib/i18n"
import { Shield, AlertTriangle } from "lucide-react"

export function ComplianceNotice({ compact = false }: { compact?: boolean }) {
  const { t, language } = useLanguage()

  if (compact) {
    return (
      <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-400/70">
        <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <span>{t('compliance.notice')}</span>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-amber-500/10">
        <Shield className="w-4 h-4 text-amber-400" />
        <h4 className="text-sm font-semibold text-amber-300">{t('compliance.title')}</h4>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400/60 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-400/70 leading-relaxed">{t('compliance.notice')}</p>
        </div>
        <div className="flex gap-3 text-[10px]">
          <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300/80 border border-amber-500/20">
            {t('compliance.usageDisclaimer')}
          </span>
          <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-300/80 border border-amber-500/20">
            {t('compliance.discriminationWarning')}
          </span>
        </div>
      </div>
    </div>
  )
}
