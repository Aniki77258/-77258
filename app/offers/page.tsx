"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useLanguage } from "@/lib/i18n"
import { formatCurrency, CURRENCY_LIST, CurrencyCode } from "@/lib/format-currency"
import { AppLayout } from "@/components/shared/app-sidebar"
import { ProgressStepper, type Step } from "@/components/shared/progress-stepper"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, DollarSign, Gift, Calendar, Clock, Check, X, ArrowRight, User, Briefcase, Award, Download } from "lucide-react"

const FLOW_STEPS: Step[] = [
  { key: "search", label: "搜索人才" },
  { key: "invite", label: "发起邀请" },
  { key: "interview", label: "安排面试" },
  { key: "assess", label: "查看评估" },
  { key: "negotiate", label: "薪资谈判" },
  { key: "offer", label: "发放Offer" },
]

interface OfferItem {
  id: string
  candidate?: { name: string; title?: string }
  job?: { title: string }
  status: string
  position: string
  salary?: number
  salaryCurrency?: string
  bonus?: number
  equity?: string
  benefits?: string
  startDate?: string
  message?: string
  expiresAt?: string
  acceptedAt?: string
  declinedReason?: string
  createdAt: string
}

export default function OffersPage() {
  const { user } = useAuth()
  const { t, language, locale } = useLanguage()
  const [offers, setOffers] = useState<OfferItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState("")
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("CNY")
  const isCandidate = user?.role === "candidate"

  useEffect(() => { fetchOffers() }, [user])

  async function fetchOffers() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (user?.role === "candidate") params.set("candidateId", user.id)
      const res = await fetch(`/api/offers?${params}`)
      const data = await res.json()
      if (data.success) setOffers(data.data || [])
      else setOffers(getMockOffers())
    } catch { setOffers(getMockOffers()) }
    finally { setLoading(false) }
  }

  async function handleAction(id: string, action: "accept" | "decline") {
    try {
      const res = await fetch("/api/offers", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: action === "accept" ? "accepted" : "declined" })
      })
      const data = await res.json()
      setActionMsg(data.success
        ? (action === "accept"
          ? (language === 'zh' ? "恭喜！Offer 已接受" : "Congratulations! Offer accepted")
          : (language === 'zh' ? "Offer 已拒绝" : "Offer declined"))
        : (language === 'zh' ? "操作失败" : "Action failed"))
      fetchOffers()
    } catch {
      setOffers(prev => prev.map(o => o.id === id ? { ...o, status: action === "accept" ? "accepted" : "declined" } : o))
      setActionMsg(action === "accept"
        ? (language === 'zh' ? "恭喜！Offer 已接受(演示模式)" : "Accepted (demo mode)")
        : (language === 'zh' ? "Offer 已拒绝(演示模式)" : "Declined (demo mode)"))
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "success" | "destructive" | "warning" | "outline" }> = {
      draft: { label: t('offers.statusDraft'), variant: "outline" },
      sent: { label: t('offers.statusSent'), variant: "warning" },
      accepted: { label: t('offers.statusAccepted'), variant: "success" },
      declined: { label: t('offers.statusRejected'), variant: "destructive" },
      expired: { label: t('offers.statusExpired'), variant: "outline" },
    }
    const s = map[status] || { label: status, variant: "outline" as const }
    return <Badge variant={s.variant}>{s.label}</Badge>
  }

  const titleText = t('offers.title')
  const subtitleText = isCandidate
    ? (language === 'zh' ? "查看和管理您的 Offer" : "View and manage your offers")
    : (language === 'zh' ? "创建、发送和管理 Offer" : "Create, send, and manage offers")

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{titleText}</h1>
          <p className="text-slate-400 text-sm mt-1">{subtitleText}</p>
        </div>

        {/* Currency Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{t('currency.label')}:</span>
          <select
            value={displayCurrency}
            onChange={(e) => setDisplayCurrency(e.target.value as CurrencyCode)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-white text-sm"
          >
            {CURRENCY_LIST.map(c => (
              <option key={c.code} value={c.code} className="bg-slate-800">{c.symbol} {c.code}</option>
            ))}
          </select>
          <span className="text-[10px] text-slate-600 ml-2">{t('offers.exchangeRateNote')}</span>
        </div>

        <ProgressStepper steps={FLOW_STEPS} currentStep="offer" />

        {actionMsg && (
          <div className={`px-4 py-3 rounded-lg text-sm ${
            actionMsg.includes("接受") || actionMsg.includes("Accepted")
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
          }`}>{actionMsg}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : offers.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">{t('common.noData')}</p>
              <p className="text-slate-500 text-sm mt-1">
                {language === 'zh' ? "谈判达成一致后，将自动生成 Offer" : "Offer will be generated after negotiation agreement"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <Card key={offer.id} className={`bg-white/5 border transition-all ${
                offer.status === "accepted" ? "border-emerald-500/30 bg-emerald-500/5" :
                offer.status === "declined" ? "border-red-500/20 bg-red-500/5" :
                "border-white/10 hover:border-sky-500/20"
              }`}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium text-lg">{offer.candidate?.name || (language === 'zh' ? "候选人" : "Candidate")}</span>
                        {statusBadge(offer.status)}
                        {offer.status === "accepted" && <Award className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                        <Briefcase className="w-3 h-3" /> {offer.position || offer.job?.title || (language === 'zh' ? "职位" : "Position")}
                      </div>
                    </div>
                    {offer.acceptedAt && (
                      <div className="text-emerald-400 text-xs text-right">
                        <p>{language === 'zh' ? "入职确认" : "Confirmed"}</p>
                        <p>{new Date(offer.acceptedAt).toLocaleDateString(locale)}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <DollarSign className="w-4 h-4 text-sky-400 mx-auto mb-1" />
                      <p className="text-sky-400 font-bold text-sm">{formatCurrency(offer.salary || 0, displayCurrency, true)}</p>
                      <p className="text-slate-500 text-xs">{t('negotiations.baseSalary')}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Gift className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                      <p className="text-amber-400 font-bold text-sm">{offer.bonus ? formatCurrency(offer.bonus, displayCurrency, true) : "-"}</p>
                      <p className="text-slate-500 text-xs">{t('negotiations.bonus')}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Award className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                      <p className="text-purple-400 font-bold text-sm">{offer.equity || "-"}</p>
                      <p className="text-slate-500 text-xs">{t('negotiations.equity')}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center">
                      <Calendar className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <p className="text-emerald-400 font-bold text-sm">
                        {offer.startDate ? new Date(offer.startDate).toLocaleDateString(locale) : (language === 'zh' ? "待确认" : "TBD")}
                      </p>
                      <p className="text-slate-500 text-xs">{language === 'zh' ? "预计入职" : "Start Date"}</p>
                    </div>
                  </div>

                  {offer.benefits && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1">{t('negotiations.benefits')}</p>
                      <p className="text-slate-300 text-sm">{offer.benefits}</p>
                    </div>
                  )}

                  {offer.message && (
                    <div className="bg-sky-500/5 border border-sky-500/10 rounded-lg p-3 italic">
                      <p className="text-slate-300 text-sm">&ldquo;{offer.message}&rdquo;</p>
                    </div>
                  )}

                  {offer.expiresAt && offer.status === "sent" && (
                    <div className="flex items-center gap-2 text-amber-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {language === 'zh' ? "回复截止：" : "Reply by: "}
                      {new Date(offer.expiresAt).toLocaleDateString(locale)}
                    </div>
                  )}

                  {offer.declinedReason && (
                    <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-2">
                      <p className="text-red-400 text-xs">
                        {language === 'zh' ? "拒绝原因：" : "Reason: "}{offer.declinedReason}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {offer.status === "sent" && (
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      {isCandidate ? (
                        <>
                          <Button size="sm" onClick={() => handleAction(offer.id, "accept")}
                            className="flex-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
                            <Check className="w-3 h-3 mr-1" /> {language === 'zh' ? "接受 Offer" : "Accept Offer"}
                          </Button>
                          <Button size="sm" onClick={() => handleAction(offer.id, "decline")}
                            className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
                            <X className="w-3 h-3 mr-1" /> {t('admin.reject')}
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" className="bg-sky-500/20 text-sky-400 border border-sky-500/30">
                          <Download className="w-3 h-3 mr-1" /> {language === 'zh' ? "下载PDF" : "Download PDF"}
                        </Button>
                      )}
                    </div>
                  )}

                  {offer.status === "accepted" && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-center">
                      <Award className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-emerald-400 font-bold text-lg">
                        {language === 'zh' ? "招聘流程已完成！" : "Recruitment Complete!"}
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        {language === 'zh' ? "候选人已接受 Offer，预计 " : "Candidate accepted. Estimated start: "}
                        {offer.startDate ? new Date(offer.startDate).toLocaleDateString(locale) : (language === 'zh' ? "尽快" : "ASAP")}
                        {language === 'zh' ? " 入职" : ""}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/negotiations"}>
            {language === 'zh' ? "返回薪资谈判" : "Back to Negotiations"}
          </Button>
          <Button size="sm" onClick={() => window.location.href = "/dashboard"} className="bg-gradient-to-r from-sky-500 to-blue-600">
            {language === 'zh' ? "返回控制台" : "Back to Dashboard"} <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

function getMockOffers(): OfferItem[] {
  return [
    { id: "off-mock-1", candidate: { name: "李晓风", title: "风电叶片结构高级工程师" }, job: { title: "风电叶片结构工程师" }, status: "sent", position: "高级风电叶片工程师", salary: 600000, salaryCurrency: "CNY", bonus: 200000, equity: "0.8%期权(4年归属)", benefits: "五险一金 + 补充医疗保险 + 30天年假 + 弹性工作制 + 国际会议全额支持 + 人才公寓", startDate: "2026-08-01T00:00:00Z", expiresAt: "2026-06-15T00:00:00Z", message: "我们非常期待您加入我们的团队！您的专业能力将为公司在风电叶片领域的创新带来巨大价值。", createdAt: "2026-05-30" },
    { id: "off-mock-2", candidate: { name: "王储能", title: "锂电池研发总监" }, job: { title: "固态电池研发专家" }, status: "sent", position: "固态电池研发总监", salary: 1000000, salaryCurrency: "CNY", bonus: 300000, equity: "1%期权(4年归属)", benefits: "五险一金 + 高端医疗保险 + 租房补贴 + 购车补贴 + 带薪学术假 + 实验室建设预算2000万", startDate: "2026-09-01T00:00:00Z", expiresAt: "2026-06-20T00:00:00Z", message: "公司将为您提供完善的研发环境和资源支持，期待您在固态电池领域继续引领创新。", createdAt: "2026-05-30" }
  ]
}
