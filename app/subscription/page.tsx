"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth"
import { useLanguage } from "@/lib/i18n"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DemoFlowGuide from "@/components/demo/demo-flow-guide"
import {
  Crown, Zap, Check, Clock, AlertTriangle, RefreshCw, Receipt,
  ArrowUpRight, CreditCard, History, Gift, ChevronRight, X, Loader2,
  CheckCircle2, XCircle, Building2, Users, Search, Eye, Send,
  FileText, Phone, MessageSquare, BarChart3
} from "lucide-react"
import type {
  PlanDefinition, UserSubscriptionRecord, UsageLogRecord, OrderRecord,
  BillingCycle, PaymentMethod,
} from "@/lib/saas/types"

// ---- 格式化金额（分 → 元） ----
function formatCNY(cents: number): string {
  return `¥${(cents / 100).toLocaleString("zh-CN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })
}

// ---- 状态 Badge ----
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "使用中", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    expired: { label: "已过期", className: "bg-red-500/10 text-red-400 border-red-500/20" },
    cancelled: { label: "已取消", className: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
    paused: { label: "已暂停", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    trial: { label: "试用中", className: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    paid: { label: "已支付", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    pending: { label: "待支付", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    failed: { label: "支付失败", className: "bg-red-500/10 text-red-400 border-red-500/20" },
    refunded: { label: "已退款", className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  }
  const info = map[status] || { label: status, className: "bg-slate-500/10 text-slate-400" }
  return <Badge className={`text-[10px] border ${info.className}`}>{info.label}</Badge>
}

// ---- 额度进度条 ----
function QuotaBar({ used, total, label, icon: Icon }: {
  used: number; total: number; label: string; icon: React.ElementType
}) {
  const pct = total > 0 ? Math.min(100, (used / total) * 100) : 100
  const isUnlimited = total >= 9999
  const isWarning = !isUnlimited && pct >= 80
  const isCritical = !isUnlimited && pct >= 95

  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon className={`w-4 h-4 flex-shrink-0 ${isCritical ? "text-red-400" : isWarning ? "text-amber-400" : "text-slate-500"}`} />
      <span className="text-xs text-slate-400 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-sky-500"
          }`}
          style={{ width: `${isUnlimited ? 0 : pct}%` }}
        />
      </div>
      <span className={`text-xs w-20 text-right ${isCritical ? "text-red-400" : "text-slate-400"}`}>
        {isUnlimited ? "无限" : `${used}/${total}`}
      </span>
    </div>
  )
}

export default function SubscriptionPage() {
  const { user } = useAuth()
  const { t } = useLanguage()

  // State
  const [currentPlan, setCurrentPlan] = useState<PlanDefinition | null>(null)
  const [subscription, setSubscription] = useState<UserSubscriptionRecord | null>(null)
  const [allPlans, setAllPlans] = useState<PlanDefinition[]>([])
  const [usageLogs, setUsageLogs] = useState<UsageLogRecord[]>([])
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Upgrade modal
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanDefinition | null>(null)
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>("monthly")
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [upgradeMsg, setUpgradeMsg] = useState("")

  // Payment modal
  const [showPayment, setShowPayment] = useState(false)
  const [payingOrderId, setPayingOrderId] = useState("")
  const [payMethod, setPayMethod] = useState<PaymentMethod>("alipay")
  const [payLoading, setPayLoading] = useState(false)
  const [payResult, setPayResult] = useState<{ success: boolean; message: string } | null>(null)

  // Load data
  const loadData = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    setError("")
    try {
      const [subRes, plansRes, logsRes, ordersRes] = await Promise.all([
        fetch(`/api/saas/subscription?userId=${user.id}`).then(r => r.json()),
        fetch("/api/saas/plans").then(r => r.json()),
        fetch(`/api/saas/usage/logs?userId=${user.id}&limit=20`).then(r => r.json()),
        fetch(`/api/saas/orders?userId=${user.id}`).then(r => r.json()),
      ])

      if (subRes.data) {
        setSubscription(subRes.data)
        setCurrentPlan(subRes.data.plan || null)
      }
      if (plansRes.data) setAllPlans(plansRes.data)
      if (logsRes.data) setUsageLogs(logsRes.data)
      if (ordersRes.data) setOrders(ordersRes.data)
    } catch (e: any) {
      setError("加载数据失败：" + e.message)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => { loadData() }, [loadData])

  // Upgrade flow
  function startUpgrade(plan: PlanDefinition) {
    setSelectedPlan(plan)
    setSelectedCycle("monthly")
    setUpgradeMsg("")
    setShowUpgrade(true)
  }

  async function confirmUpgrade() {
    if (!selectedPlan || !user?.id) return
    setUpgradeLoading(true)
    setUpgradeMsg("")
    try {
      const res = await fetch("/api/saas/orders/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          currentPlanId: subscription?.planId || "",
          targetPlanKey: selectedPlan.planKey,
          billingCycle: selectedCycle,
        }),
      }).then(r => r.json())

      if (res.error) {
        setUpgradeMsg(res.error)
      } else {
        setUpgradeMsg("订单已创建，请完成支付")
        setPayingOrderId(res.data.id)
        setShowUpgrade(false)
        setShowPayment(true)
      }
    } catch (e: any) {
      setUpgradeMsg("创建订单失败：" + e.message)
    } finally {
      setUpgradeLoading(false)
    }
  }

  // Simulate payment
  async function simulatePay() {
    if (!payingOrderId) return
    setPayLoading(true)
    setPayResult(null)
    try {
      const res = await fetch("/api/saas/payment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: payingOrderId,
          method: payMethod,
          shouldSucceed: true,
        }),
      }).then(r => r.json())

      if (res.data) {
        setPayResult({ success: res.data.success, message: res.data.message })
        if (res.data.success) {
          setTimeout(() => {
            setShowPayment(false)
            setPayResult(null)
            loadData()
          }, 1500)
        }
      } else {
        setPayResult({ success: false, message: res.error || "支付异常" })
      }
    } catch (e: any) {
      setPayResult({ success: false, message: "支付失败：" + e.message })
    } finally {
      setPayLoading(false)
    }
  }

  // Resource label map
  const resourceLabels: Record<string, string> = {
    search: "人才搜索",
    candidate_view: "查看候选人",
    invitation: "发送邀请",
    ai_report: "AI 评估报告",
    contact_unlock: "解锁联系方式",
    message: "站内信",
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <RefreshCw className="w-6 h-6 text-sky-400 animate-spin" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              订阅管理
            </h1>
            <p className="text-xs text-slate-500 mt-1">管理您的套餐、额度和订单</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
            <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
            刷新
          </Button>
        </div>

        {/* Demo Flow Guide */}
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <DemoFlowGuide />
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> {error}
          </div>
        )}

        {/* Current Plan Card */}
        <Card className="border-white/5 bg-gradient-to-br from-[#0c1830] to-[#0f1f3a]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              当前套餐
              {subscription && <StatusBadge status={subscription.status} />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentPlan ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentPlan.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{currentPlan.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-sky-400">
                      {subscription?.billingCycle === "yearly"
                        ? formatCNY(currentPlan.priceYearly / 12) + "/月"
                        : formatCNY(currentPlan.priceMonthly) + "/月"}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {subscription?.billingCycle === "yearly" ? "年付" : "月付"}
                      {subscription?.autoRenew && " · 自动续费"}
                    </div>
                  </div>
                </div>

                {/* Subscription info */}
                {subscription && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-white/5">
                    <div>
                      <div className="text-[10px] text-slate-500">开始日期</div>
                      <div className="text-xs text-slate-300">{formatDate(subscription.startDate)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">到期日期</div>
                      <div className="text-xs text-slate-300 flex items-center gap-1">
                        {formatDate(subscription.endDate)}
                        {new Date(subscription.endDate) < new Date(Date.now() + 7 * 86400000) && (
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">计费周期</div>
                      <div className="text-xs text-slate-300">
                        {subscription.billingCycle === "yearly" ? "年付" : "月付"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">额度重置</div>
                      <div className="text-xs text-slate-300">
                        {subscription.quotaResetAt ? formatDate(subscription.quotaResetAt) : "—"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quota usage */}
                <div className="pt-3 border-t border-white/5">
                  <h4 className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    本期额度使用
                  </h4>
                  <div className="space-y-0.5">
                    <QuotaBar used={subscription?.searchesUsed || 0} total={currentPlan.entitlements.maxSearches} label="人才搜索" icon={Search} />
                    <QuotaBar used={subscription?.candidateViewsUsed || 0} total={currentPlan.entitlements.maxCandidateViews} label="查看候选人" icon={Eye} />
                    <QuotaBar used={subscription?.invitationsUsed || 0} total={currentPlan.entitlements.maxInvitations} label="发送邀请" icon={Send} />
                    <QuotaBar used={subscription?.aiReportsUsed || 0} total={currentPlan.entitlements.maxAIReports} label="AI 评估报告" icon={FileText} />
                    <QuotaBar used={subscription?.contactUnlocksUsed || 0} total={currentPlan.entitlements.maxContactUnlocks} label="解锁联系方式" icon={Phone} />
                    <QuotaBar used={subscription?.messagesUsed || 0} total={currentPlan.entitlements.maxMessages} label="站内信" icon={MessageSquare} />
                  </div>
                </div>

                {/* Features list */}
                <div className="pt-3 border-t border-white/5">
                  <h4 className="text-xs font-medium text-slate-400 mb-2">套餐权益</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                    {currentPlan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Gift className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">您还没有激活订阅套餐</p>
                <p className="text-slate-600 text-xs mt-1">请选择一个套餐开始使用</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Plans & Upgrade */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              升级套餐
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allPlans
                .filter(p => p.planKey !== "free")
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((plan) => {
                  const isCurrent = currentPlan?.planKey === plan.planKey
                  return (
                    <div
                      key={plan.planKey}
                      className={`relative p-4 rounded-xl border transition-all ${
                        plan.highlighted
                          ? "border-sky-500/30 bg-sky-500/5"
                          : "border-white/5 bg-white/[0.02]"
                      } ${isCurrent ? "ring-1 ring-emerald-500/50" : ""}`}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-[10px] bg-sky-500 text-white font-medium">
                          推荐
                        </div>
                      )}
                      {isCurrent && (
                        <div className="absolute -top-2 left-3 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-medium">
                          当前
                        </div>
                      )}

                      <h3 className="text-sm font-bold text-white">{plan.name}</h3>
                      <div className="mt-2 mb-3">
                        <span className="text-xl font-bold text-white">
                          {formatCNY(plan.priceMonthly)}
                        </span>
                        <span className="text-xs text-slate-500">/月</span>
                        {plan.priceYearly > 0 && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            年付 {formatCNY(plan.priceYearly)}（约 {formatCNY(plan.priceYearly / 12)}/月）
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 mb-4">
                        {plan.features.slice(0, 5).map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Check className="w-3 h-3 text-sky-400 flex-shrink-0" />
                            {f}
                          </div>
                        ))}
                        {plan.features.length > 5 && (
                          <div className="text-[11px] text-slate-600 pl-4">+{plan.features.length - 5} 项功能</div>
                        )}
                      </div>

                      <Button
                        variant={plan.highlighted ? "default" : "outline"}
                        size="sm"
                        className={`w-full ${
                          plan.highlighted
                            ? "bg-sky-600 hover:bg-sky-500 text-white"
                            : ""
                        }`}
                        disabled={isCurrent}
                        onClick={() => startUpgrade(plan)}
                      >
                        {isCurrent ? "当前套餐" : "升级到此套餐"}
                        {!isCurrent && <ArrowUpRight className="w-3 h-3 ml-1" />}
                      </Button>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

        {/* Order History */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-400" />
              订单记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">
                <History className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                暂无订单记录
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/5">
                      <th className="text-left py-2 font-medium">订单号</th>
                      <th className="text-left py-2 font-medium">套餐</th>
                      <th className="text-left py-2 font-medium">类型</th>
                      <th className="text-right py-2 font-medium">金额</th>
                      <th className="text-center py-2 font-medium">状态</th>
                      <th className="text-right py-2 font-medium">时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className="border-b border-white/[0.02] hover:bg-white/[0.02]">
                        <td className="py-2.5 text-slate-300 font-mono text-[10px]">{o.id.slice(0, 16)}...</td>
                        <td className="py-2.5 text-slate-300">{o.plan?.name || "—"}</td>
                        <td className="py-2.5 text-slate-400">
                          {o.type === "new" ? "新购" : o.type === "upgrade" ? "升级" : "续费"}
                        </td>
                        <td className="py-2.5 text-right text-slate-300">{formatCNY(o.finalAmount)}</td>
                        <td className="py-2.5 text-center"><StatusBadge status={o.status} /></td>
                        <td className="py-2.5 text-right text-slate-500">{formatDate(o.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Usage Logs */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              近期使用记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usageLogs.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">暂无使用记录</div>
            ) : (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {usageLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between py-1.5 text-xs border-b border-white/[0.02]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">{resourceLabels[log.resource] || log.resource}</span>
                      <span className="text-[10px] text-slate-600">{log.action === "consume" ? "消耗" : "退还"} x{log.quantity}</span>
                    </div>
                    <span className="text-slate-600">{formatDate(log.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Invoice Info */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-400" />
              发票信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-[10px] text-slate-500">发票抬头</div>
                <div className="text-sm text-slate-300">{orders.find(o => o.invoiceTitle)?.invoiceTitle || "—"}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">税号</div>
                <div className="text-sm text-slate-300">{orders.find(o => o.invoiceTaxId)?.invoiceTaxId || "—"}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">发票接收邮箱</div>
                <div className="text-sm text-slate-300">{orders.find(o => o.invoiceEmail)?.invoiceEmail || "—"}</div>
              </div>
            </div>
            <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-400/80">
                当前为演示模式，发票信息为示例数据。实际使用时，发票将在支付成功后自动发送至指定邮箱。
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Modal */}
        {showUpgrade && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowUpgrade(false)}>
            <div className="bg-[#0c1830] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">升级套餐</h3>
                <button onClick={() => setShowUpgrade(false)} className="text-slate-500 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-slate-500">当前套餐</div>
                    <div className="text-sm text-slate-300">{currentPlan?.name || "免费版"}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                  <div>
                    <div className="text-xs text-sky-400 text-right">升级到</div>
                    <div className="text-sm text-white font-medium">{selectedPlan.name}</div>
                  </div>
                </div>
              </div>

              {/* Billing cycle */}
              <div className="flex gap-2 mb-4">
                {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => {
                  const price = cycle === "yearly" ? selectedPlan.priceYearly : selectedPlan.priceMonthly
                  return (
                    <button
                      key={cycle}
                      onClick={() => setSelectedCycle(cycle)}
                      className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                        selectedCycle === cycle
                          ? "border-sky-500/30 bg-sky-500/10 text-white"
                          : "border-white/5 text-slate-400 hover:border-white/10"
                      }`}
                    >
                      <div className="text-sm font-medium">{cycle === "monthly" ? "月付" : "年付"}</div>
                      <div className="text-lg font-bold mt-1">{formatCNY(price)}</div>
                      <div className="text-[10px] text-slate-500">
                        {cycle === "yearly" ? `约 ${formatCNY(price / 12)}/月` : "按月计费"}
                      </div>
                    </button>
                  )
                })}
              </div>

              {upgradeMsg && (
                <div className={`p-2 rounded-lg text-xs mb-3 ${
                  upgradeMsg.includes("失败") ? "bg-red-500/10 text-red-400" : "bg-sky-500/10 text-sky-400"
                }`}>
                  {upgradeMsg}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowUpgrade(false)}>
                  取消
                </Button>
                <Button
                  className="flex-1 bg-sky-600 hover:bg-sky-500"
                  onClick={confirmUpgrade}
                  disabled={upgradeLoading}
                >
                  {upgradeLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "确认升级"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => !payLoading && setShowPayment(false)}>
            <div className="bg-[#0c1830] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-400" />
                模拟支付
              </h3>
              <p className="text-xs text-slate-500 mb-4">演示模式 — 选择支付方式后模拟支付流程</p>

              {!payResult ? (
                <>
                  {/* Payment method selector */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {([
                      { value: "alipay" as PaymentMethod, label: "支付宝" },
                      { value: "wechat_pay" as PaymentMethod, label: "微信支付" },
                      { value: "stripe" as PaymentMethod, label: "Stripe" },
                      { value: "paddle" as PaymentMethod, label: "Paddle" },
                    ]).map((pm) => (
                      <button
                        key={pm.value}
                        onClick={() => setPayMethod(pm.value)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          payMethod === pm.value
                            ? "border-sky-500/30 bg-sky-500/10 text-white"
                            : "border-white/5 text-slate-400 hover:border-white/10"
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>

                  {/* Order summary */}
                  <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 mb-4 text-xs">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">订单号</span>
                      <span className="text-slate-300 font-mono">{payingOrderId.slice(0, 20)}...</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">支付方式</span>
                      <span className="text-slate-300">
                        {payMethod === "alipay" ? "支付宝" : payMethod === "wechat_pay" ? "微信支付" : payMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowPayment(false)} disabled={payLoading}>
                      取消
                    </Button>
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500"
                      onClick={simulatePay}
                      disabled={payLoading}
                    >
                      {payLoading ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-1" /> 处理中...</>
                      ) : (
                        "确认支付"
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  {payResult.success ? (
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  )}
                  <p className={`text-lg font-bold ${payResult.success ? "text-emerald-400" : "text-red-400"}`}>
                    {payResult.success ? "支付成功！" : "支付失败"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">{payResult.message}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
