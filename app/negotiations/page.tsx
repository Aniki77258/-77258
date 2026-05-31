"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { useLanguage } from "@/lib/i18n"
import { formatCurrency, formatSalaryRange, CURRENCY_LIST, CurrencyCode, convertCurrency } from "@/lib/format-currency"
import { AppLayout } from "@/components/shared/app-sidebar"
import { ProgressStepper, type Step } from "@/components/shared/progress-stepper"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Handshake, DollarSign, Gift, Briefcase, ArrowRight, MessageSquare, TrendingUp, User, Check, X } from "lucide-react"

const FLOW_STEPS: Step[] = [
  { key: "search", label: "搜索人才" },
  { key: "invite", label: "发起邀请" },
  { key: "interview", label: "安排面试" },
  { key: "assess", label: "查看评估" },
  { key: "negotiate", label: "薪资谈判" },
  { key: "offer", label: "发放Offer" },
]

interface NegotiationItem {
  id: string
  candidate?: { name: string; title?: string }
  job?: { title: string }
  status: string
  currentOffer?: number
  expectedOffer?: number
  salaryCurrency?: string
  bonusOffer?: number
  equityOffer?: string
  benefitsOffer?: string
  candidateNotes?: string
  employerNotes?: string
  rounds?: number
  nextAction?: string
}

export default function NegotiationsPage() {
  const { user } = useAuth()
  const { t, language } = useLanguage()
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("CNY")
  const [negotiations, setNegotiations] = useState<NegotiationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState("")

  useEffect(() => { fetchNegotiations() }, [user])

  async function fetchNegotiations() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (user?.role === "candidate") params.set("candidateId", user.id)
      const res = await fetch(`/api/negotiations?${params}`)
      const data = await res.json()
      if (data.success) setNegotiations(data.data || [])
      else setNegotiations(getMockNegotiations())
    } catch { setNegotiations(getMockNegotiations()) }
    finally { setLoading(false) }
  }

  async function handleAction(id: string, action: "agree" | "reject") {
    try {
      const res = await fetch("/api/negotiations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: action === "agree" ? "agreed" : "rejected" })
      })
      const data = await res.json()
      setActionMsg(data.success ? (action === "agree" ? "已接受薪资方案" : "谈判已结束") : "操作失败")
      fetchNegotiations()
    } catch {
      setNegotiations(prev => prev.map(n => n.id === id ? { ...n, status: action === "agree" ? "agreed" : "rejected" } : n))
      setActionMsg(`状态已更新(演示模式)`)
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "success" | "destructive" | "warning" | "outline" }> = {
      in_progress: { label: t("negotiations.statusNegotiating"), variant: "warning" },
      agreed: { label: t("negotiations.statusAgreed"), variant: "success" },
      rejected: { label: t("negotiations.statusRejected"), variant: "destructive" },
      stalled: { label: t("negotiations.statusOnHold"), variant: "outline" },
    }
    const s = map[status] || { label: status, variant: "outline" as const }
    return <Badge variant={s.variant}>{s.label}</Badge>
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("negotiations.title")}</h1>
          <p className="text-slate-400 text-sm mt-1">{t("negotiations.description")}</p>
        </div>

        <ProgressStepper steps={FLOW_STEPS} currentStep="negotiate" />

        {actionMsg && (
          <div className={`px-4 py-3 rounded-lg text-sm ${
            actionMsg.includes("接受") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
          }`}>{actionMsg}</div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-slate-400">{t("currency.label")}:</span>
          <select value={displayCurrency} onChange={(e) => setDisplayCurrency(e.target.value as CurrencyCode)}
            className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-xs">
            {CURRENCY_LIST.map(c => (
              <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : negotiations.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <Handshake className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">{t("common.noData")}</p>
              <p className="text-slate-500 text-sm mt-1">{t("negotiations.emptyHint")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {negotiations.map((n) => (
              <Card key={n.id} className="bg-white/5 border-white/10">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-lg">{n.candidate?.name || t("common.candidate")}</span>
                        {statusBadge(n.status)}
                      </div>
                      {n.candidate?.title && <p className="text-slate-400 text-sm">{n.candidate.title}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs">{t("negotiations.rounds")}</p>
                      <p className="text-white font-bold text-lg">{language === 'zh' ? `第${n.rounds || 1}轮` : `Round ${n.rounds || 1}`}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" /> {t("negotiations.currentOffer")}
                      </p>
                      <p className="text-sky-400 font-bold">{formatCurrency(n.currentOffer || 0, displayCurrency, true)}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {t("negotiations.expectedSalary")}
                      </p>
                      <p className="text-amber-400 font-bold">{formatCurrency(n.expectedOffer || 0, displayCurrency, true)}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1 flex items-center gap-1">
                        <Gift className="w-3 h-3" /> {t("negotiations.bonus")}
                      </p>
                      <p className="text-emerald-400 font-bold">{formatCurrency(n.bonusOffer || 0, displayCurrency, true)}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1">{t("negotiations.equity")}</p>
                      <p className="text-purple-400 font-bold">{n.equityOffer || "-"}</p>
                    </div>
                  </div>

                  {n.benefitsOffer && (
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-slate-500 text-xs mb-1">{t("negotiations.benefits")}</p>
                      <p className="text-slate-300 text-sm">{n.benefitsOffer}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {n.employerNotes && (
                      <div className="bg-sky-500/5 border border-sky-500/10 rounded-lg p-3">
                        <p className="text-sky-400 text-xs font-medium mb-1">{t("negotiations.employerNotes")}</p>
                        <p className="text-slate-300 text-sm">{n.employerNotes}</p>
                      </div>
                    )}
                    {n.candidateNotes && (
                      <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">
                        <p className="text-purple-400 text-xs font-medium mb-1">{t("negotiations.candidateNotes")}</p>
                        <p className="text-slate-300 text-sm">{n.candidateNotes}</p>
                      </div>
                    )}
                  </div>

                  {n.nextAction && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                      <p className="text-amber-400 text-xs font-medium flex items-center gap-1 mb-1">
                        <MessageSquare className="w-3 h-3" /> {t("negotiations.nextAction")}
                      </p>
                      <p className="text-slate-300 text-sm">{n.nextAction}</p>
                    </div>
                  )}

                  {n.status === "in_progress" && (
                    <div className="flex gap-2 pt-2 border-t border-white/5">
                      <Button size="sm" onClick={() => handleAction(n.id, "agree")}
                        className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
                        <Check className="w-3 h-3 mr-1" /> {t("negotiations.agreeAction")}
                      </Button>
                      <Button size="sm" onClick={() => handleAction(n.id, "reject")}
                        className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
                        <X className="w-3 h-3 mr-1" /> {t("negotiations.rejectAction")}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/assessments"}>
            {t("common.backToAssessments")}
          </Button>
          <Button size="sm" onClick={() => window.location.href = "/offers"} className="bg-gradient-to-r from-sky-500 to-blue-600">
            {t("negotiations.nextStepCreateOffer")} <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <p className="text-[10px] text-slate-600 mt-4">{t("negotiations.exchangeRateNote")}</p>
      </div>
    </AppLayout>
  )
}

function getMockNegotiations(): NegotiationItem[] {
  return [
    { id: "neg-mock-1", candidate: { name: "李晓风", title: "风电叶片结构高级工程师" }, status: "in_progress", currentOffer: 550000, expectedOffer: 650000, salaryCurrency: "CNY", bonusOffer: 150000, equityOffer: "0.5%期权(4年归属)", benefitsOffer: "五险一金、补充商业保险、弹性工作制、30天年假、国际会议支持", candidateNotes: "希望base薪资能到65万，对标行业头部企业标准", employerNotes: "55万是我们的首选方案，但可以配合奖金和股权达成package 80万+", rounds: 1, nextAction: "企业准备第二轮方案：Base 60万 + 奖金20万 + 0.8%期权" },
    { id: "neg-mock-2", candidate: { name: "王储能", title: "锂电池研发总监" }, status: "in_progress", currentOffer: 800000, expectedOffer: 1000000, salaryCurrency: "CNY", bonusOffer: 300000, equityOffer: "1%期权(4年归属)", benefitsOffer: "五险一金、高端商业保险、租房补贴5000/月、购车补贴", employerNotes: "CTO级别候选人，可接受100万base", rounds: 2, nextAction: "等待候选人确认最终方案" }
  ]
}
