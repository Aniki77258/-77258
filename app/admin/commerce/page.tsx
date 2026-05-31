"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DemoFlowGuide from "@/components/demo/demo-flow-guide"
import {
  DollarSign, TrendingUp, Users, ShoppingCart, RotateCcw, AlertTriangle,
  Crown, Receipt, CreditCard, RefreshCw, ArrowUpRight, BarChart3,
  PieChart, TrendingDown, FileText, Clock, CheckCircle2
} from "lucide-react"
import type {
  CommerceStats, OrderRecord, PaymentRecordData, UserSubscriptionRecord,
  ServiceFeeRecord,
} from "@/lib/saas/types"

function formatCNY(cents: number): string {
  if (cents >= 100000000) return `¥${(cents / 100000000).toFixed(2)} 亿`
  if (cents >= 10000) return `¥${(cents / 10000).toFixed(1)} 万`
  return `¥${(cents / 100).toLocaleString("zh-CN")}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "使用中", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    expired: { label: "已过期", className: "bg-red-500/10 text-red-400 border-red-500/20" },
    cancelled: { label: "已取消", className: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
    pending: { label: "待支付", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    paid: { label: "已支付", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    failed: { label: "失败", className: "bg-red-500/10 text-red-400 border-red-500/20" },
    refunded: { label: "已退款", className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    invoiced: { label: "已开票", className: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    overdue: { label: "已逾期", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  }
  const info = map[status] || { label: status, className: "bg-slate-500/10 text-slate-400" }
  return <Badge className={`text-[10px] border ${info.className}`}>{info.label}</Badge>
}

export default function AdminCommercePage() {
  const [stats, setStats] = useState<CommerceStats | null>(null)
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [subscriptions, setSubscriptions] = useState<UserSubscriptionRecord[]>([])
  const [serviceFees, setServiceFees] = useState<ServiceFeeRecord[]>([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    setLoading(true)
    try {
      const [statsR, ordersR, subsR, feesR] = await Promise.all([
        fetch("/api/saas/stats").then(r => r.json()),
        fetch("/api/saas/orders").then(r => r.json()),
        fetch("/api/saas/subscription?all=true").then(r => r.json()),
        fetch("/api/saas/service-fees").then(r => r.json()),
      ])
      if (statsR.data) setStats(statsR.data)
      if (ordersR.data) setOrders(ordersR.data)
      if (subsR.data) setSubscriptions(subsR.data)
      if (feesR.data) setServiceFees(feesR.data)
    } catch (e) {
      console.error("Load commerce data error:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-400" />
              商业化后台
            </h1>
            <p className="text-xs text-slate-500 mt-1">订阅收入、订单管理、服务费追踪</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
            刷新
          </Button>
        </div>

        {/* Demo Flow Guide */}
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <DemoFlowGuide />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-white/5 bg-gradient-to-br from-[#0c1830] to-[#122040]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500">本月收入</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {stats ? formatCNY(stats.monthlyRevenue) : "—"}
                  </div>
                  {stats && (
                    <div className={`text-[10px] flex items-center gap-1 mt-0.5 ${stats.revenueGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {stats.revenueGrowth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(stats.revenueGrowth).toFixed(1)}% vs 上月
                    </div>
                  )}
                </div>
                <DollarSign className="w-8 h-8 text-emerald-500/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-gradient-to-br from-[#0c1830] to-[#122040]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500">订阅用户</div>
                  <div className="text-xl font-bold text-sky-400 mt-1">
                    {stats ? stats.activeSubscribers : "—"}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    共 {stats?.totalSubscribers || 0} 人
                  </div>
                </div>
                <Users className="w-8 h-8 text-sky-500/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-gradient-to-br from-[#0c1830] to-[#122040]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500">总订单</div>
                  <div className="text-xl font-bold text-amber-400 mt-1">
                    {stats ? stats.totalOrders : "—"}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    待处理 {stats?.pendingOrders || 0} 笔
                  </div>
                </div>
                <ShoppingCart className="w-8 h-8 text-amber-500/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-gradient-to-br from-[#0c1830] to-[#122040]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500">退款</div>
                  <div className="text-xl font-bold text-red-400 mt-1">
                    {stats ? stats.totalRefunds : "—"} 笔
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {stats ? formatCNY(stats.refundAmount) : "—"}
                  </div>
                </div>
                <RotateCcw className="w-8 h-8 text-red-500/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart + Plan Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <Card className="border-white/5 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                月度收入趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.monthlyRevenueTrend ? (
                <div className="space-y-3">
                  {/* Simple bar chart */}
                  <div className="flex items-end gap-2 h-40">
                    {stats.monthlyRevenueTrend.map((point) => {
                      const maxAmount = Math.max(...stats.monthlyRevenueTrend.map(p => p.amount))
                      const height = maxAmount > 0 ? (point.amount / maxAmount) * 100 : 0
                      return (
                        <div key={point.month} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] text-slate-400">
                            {formatCNY(point.amount)}
                          </span>
                          <div className="w-full bg-sky-500/80 rounded-t hover:bg-sky-400 transition-colors relative group"
                            style={{ height: `${Math.max(height, 4)}%` }}>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white bg-slate-800 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              {point.orderCount} 笔订单 · +{point.newSubscribers} 用户
                            </div>
                          </div>
                          <span className="text-[9px] text-slate-600">{point.month.slice(5)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">暂无数据</div>
              )}
            </CardContent>
          </Card>

          {/* Plan Breakdown */}
          <Card className="border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <PieChart className="w-4 h-4 text-amber-400" />
                套餐分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.planBreakdown ? (
                <div className="space-y-2">
                  {stats.planBreakdown.map((pb) => (
                    <div key={pb.planKey} className="flex items-center justify-between py-1.5 border-b border-white/[0.02]">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          pb.planKey === "enterprise_ultimate" ? "bg-purple-500" :
                          pb.planKey === "enterprise_pro" ? "bg-sky-500" :
                          pb.planKey === "api_data" ? "bg-emerald-500" :
                          pb.planKey === "headhunter" ? "bg-amber-500" :
                          pb.planKey === "enterprise_basic" ? "bg-blue-500" : "bg-slate-500"
                        }`} />
                        <span className="text-xs text-slate-300">{pb.planName}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-white">{pb.subscriberCount} 人</div>
                        <div className="text-[10px] text-slate-500">{formatCNY(pb.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">暂无数据</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="border-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <Receipt className="w-4 h-4 text-slate-400" />
              订单列表
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => window.location.href = "/admin/orders"}>
              全部订单 <ArrowUpRight className="w-3 h-3 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-white/5">
                    <th className="text-left py-2 font-medium w-28">订单号</th>
                    <th className="text-left py-2 font-medium">套餐</th>
                    <th className="text-left py-2 font-medium">用户</th>
                    <th className="text-right py-2 font-medium">金额</th>
                    <th className="text-center py-2 font-medium">支付方式</th>
                    <th className="text-center py-2 font-medium">状态</th>
                    <th className="text-right py-2 font-medium">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="border-b border-white/[0.02] hover:bg-white/[0.02]">
                      <td className="py-2.5 text-slate-300 font-mono text-[10px]">{o.id.slice(0, 14)}...</td>
                      <td className="py-2.5 text-slate-300">{o.plan?.name || "—"}</td>
                      <td className="py-2.5 text-slate-400">{o.userName || o.userId.slice(0, 10)}</td>
                      <td className="py-2.5 text-right text-slate-300">{formatCNY(o.finalAmount)}</td>
                      <td className="py-2.5 text-center text-slate-400 text-[10px]">
                        {o.paymentMethod === "alipay" ? "支付宝" :
                         o.paymentMethod === "wechat_pay" ? "微信" :
                         o.paymentMethod?.toUpperCase() || "—"}
                      </td>
                      <td className="py-2.5 text-center"><StatusBadge status={o.status} /></td>
                      <td className="py-2.5 text-right text-slate-500">{formatDate(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Service Fees */}
        <Card className="border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-amber-400" />
              猎头服务费
              <span className="text-[10px] text-slate-500 font-normal ml-1">（年薪 20%）</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-white/5">
                    <th className="text-left py-2 font-medium">候选人</th>
                    <th className="text-left py-2 font-medium">企业</th>
                    <th className="text-left py-2 font-medium">职位</th>
                    <th className="text-right py-2 font-medium">年薪</th>
                    <th className="text-right py-2 font-medium">费率</th>
                    <th className="text-right py-2 font-medium">服务费</th>
                    <th className="text-center py-2 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceFees.map((sf) => (
                    <tr key={sf.id} className="border-b border-white/[0.02] hover:bg-white/[0.02]">
                      <td className="py-2.5 text-slate-300">{sf.candidateName}</td>
                      <td className="py-2.5 text-slate-400">{sf.companyName}</td>
                      <td className="py-2.5 text-slate-400">{sf.position}</td>
                      <td className="py-2.5 text-right text-slate-300">{formatCNY(sf.annualSalary)}</td>
                      <td className="py-2.5 text-right text-slate-400">{sf.feeRate}%</td>
                      <td className="py-2.5 text-right text-amber-400 font-medium">{formatCNY(sf.feeAmount)}</td>
                      <td className="py-2.5 text-center"><StatusBadge status={sf.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-4 p-3 bg-white/[0.02] rounded-lg border border-white/5 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                服务费合计（已完成 + 已开票）
              </div>
              <div className="text-sm font-bold text-amber-400">
                {formatCNY(
                  serviceFees
                    .filter(f => f.status === "paid" || f.status === "invoiced")
                    .reduce((sum, f) => sum + f.feeAmount, 0)
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-400/80">
            <strong>演示模式</strong> — 所有金额、订单和统计数据均为示例数据。不接入真实支付系统，不生成真实发票。
            实际上线时，需接入 Stripe / Paddle / 支付宝 / 微信支付等真实支付网关，并实现发票系统对接。
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
