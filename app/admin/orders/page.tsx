"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DemoFlowGuide from "@/components/demo/demo-flow-guide"
import {
  Receipt, RefreshCw, ArrowLeft, CreditCard, CheckCircle2, XCircle,
  AlertTriangle, RotateCcw, ExternalLink,
} from "lucide-react"
import type { OrderRecord, PaymentRecordData } from "@/lib/saas/types"

function formatCNY(cents: number): string {
  return `¥${(cents / 100).toLocaleString("zh-CN", { minimumFractionDigits: 2 })}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("zh-CN", {
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit"
  })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: "使用中", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    pending: { label: "待支付", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    paid: { label: "已支付", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    failed: { label: "失败", className: "bg-red-500/10 text-red-400 border-red-500/20" },
    refunded: { label: "已退款", className: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    cancelled: { label: "已取消", className: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
    success: { label: "支付成功", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    processing: { label: "处理中", className: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  }
  const info = map[status] || { label: status, className: "bg-slate-500/10 text-slate-400" }
  return <Badge className={`text-[10px] border ${info.className}`}>{info.label}</Badge>
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [payments, setPayments] = useState<PaymentRecordData[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null)

  async function loadData() {
    setLoading(true)
    try {
      const [ordersR, paymentsR] = await Promise.all([
        fetch("/api/saas/orders").then(r => r.json()),
        fetch("/api/saas/payment/records").then(r => r.json()),
      ])
      if (ordersR.data) setOrders(ordersR.data)
      if (paymentsR.data) setPayments(paymentsR.data)
    } catch (e) {
      console.error("Load orders error:", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const filteredOrders = filter === "all"
    ? orders
    : orders.filter(o => o.status === filter)

  const statusCounts = {
    all: orders.length,
    paid: orders.filter(o => o.status === "paid").length,
    pending: orders.filter(o => o.status === "pending").length,
    failed: orders.filter(o => o.status === "failed").length,
    refunded: orders.filter(o => o.status === "refunded").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  }

  const orderPayments = (orderId: string) => payments.filter(p => p.orderId === orderId)

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = "/admin/commerce"}>
              <ArrowLeft className="w-4 h-4 mr-1" /> 返回
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-400" />
                订单管理
              </h1>
              <p className="text-xs text-slate-500 mt-1">查看和管理所有用户订单</p>
            </div>
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

        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {([
            { key: "all", label: "全部", count: statusCounts.all, className: "bg-slate-500/10 text-slate-400" },
            { key: "paid", label: "已支付", count: statusCounts.paid, className: "bg-emerald-500/10 text-emerald-400" },
            { key: "pending", label: "待支付", count: statusCounts.pending, className: "bg-amber-500/10 text-amber-400" },
            { key: "failed", label: "失败", count: statusCounts.failed, className: "bg-red-500/10 text-red-400" },
            { key: "refunded", label: "已退款", count: statusCounts.refunded, className: "bg-purple-500/10 text-purple-400" },
            { key: "cancelled", label: "已取消", count: statusCounts.cancelled, className: "bg-slate-500/10 text-slate-400" },
          ] as const).map(({ key, label, count, className }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                filter === key
                  ? `${className} border-current/20 font-medium`
                  : "border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <Card className="border-white/5">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-white/5 bg-white/[0.01]">
                    <th className="text-left py-3 px-4 font-medium">订单号</th>
                    <th className="text-left py-3 px-4 font-medium">套餐</th>
                    <th className="text-left py-3 px-4 font-medium">类型</th>
                    <th className="text-right py-3 px-4 font-medium">原价</th>
                    <th className="text-right py-3 px-4 font-medium">折扣</th>
                    <th className="text-right py-3 px-4 font-medium">实付</th>
                    <th className="text-center py-3 px-4 font-medium">支付方式</th>
                    <th className="text-center py-3 px-4 font-medium">状态</th>
                    <th className="text-right py-3 px-4 font-medium">时间</th>
                    <th className="text-center py-3 px-4 font-medium">详情</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="border-b border-white/[0.02] hover:bg-white/[0.02]">
                      <td className="py-3 px-4 text-slate-300 font-mono text-[10px]">{o.id.slice(0, 18)}...</td>
                      <td className="py-3 px-4 text-slate-300">{o.plan?.name || "—"}</td>
                      <td className="py-3 px-4 text-slate-400">
                        {o.type === "new" ? "新购" : o.type === "upgrade" ? "升级" : "续费"}
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400">{formatCNY(o.amount)}</td>
                      <td className="py-3 px-4 text-right">
                        {o.discountAmount > 0 ? (
                          <span className="text-emerald-400">-{formatCNY(o.discountAmount)}</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-white font-medium">{formatCNY(o.finalAmount)}</td>
                      <td className="py-3 px-4 text-center text-slate-400 text-[10px]">
                        {o.paymentMethod === "alipay" ? "支付宝" :
                         o.paymentMethod === "wechat_pay" ? "微信" :
                         o.paymentMethod?.toUpperCase() || "—"}
                      </td>
                      <td className="py-3 px-4 text-center"><StatusBadge status={o.status} /></td>
                      <td className="py-3 px-4 text-right text-slate-500">{formatDate(o.createdAt)}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="text-sky-400 hover:text-sky-300 text-[10px]"
                        >
                          查看
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-slate-500 text-sm">暂无订单</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelectedOrder(null)}>
            <div className="bg-[#0c1830] border border-white/10 rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-400" />
                订单详情
              </h3>
              <p className="text-xs text-slate-500 mb-4 font-mono">{selectedOrder.id}</p>

              <div className="space-y-3">
                {/* Basic info */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5">
                  <div>
                    <div className="text-[10px] text-slate-500">套餐</div>
                    <div className="text-sm text-white">{selectedOrder.plan?.name || "—"}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">类型</div>
                    <div className="text-sm text-slate-300">
                      {selectedOrder.type === "new" ? "新购" : selectedOrder.type === "upgrade" ? "升级" : "续费"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">计费周期</div>
                    <div className="text-sm text-slate-300">
                      {selectedOrder.billingCycle === "yearly" ? "年付" : "月付"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500">状态</div>
                    <div><StatusBadge status={selectedOrder.status} /></div>
                  </div>
                </div>

                {/* Amount */}
                <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">原价</span>
                    <span className="text-slate-300">{formatCNY(selectedOrder.amount)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-400">折扣 ({selectedOrder.discountCode || "—"})</span>
                      <span className="text-emerald-400">-{formatCNY(selectedOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold pt-1 border-t border-white/5">
                    <span className="text-white">实付金额</span>
                    <span className="text-sky-400">{formatCNY(selectedOrder.finalAmount)}</span>
                  </div>
                </div>

                {/* Payment info */}
                {(selectedOrder.paymentRefId || selectedOrder.paidAt) && (
                  <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 space-y-1.5">
                    <div className="text-[10px] text-slate-500 mb-1">支付信息</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">支付方式</span>
                      <span className="text-slate-300">
                        {selectedOrder.paymentMethod === "alipay" ? "支付宝" :
                         selectedOrder.paymentMethod === "wechat_pay" ? "微信支付" :
                         selectedOrder.paymentMethod?.toUpperCase() || "—"}
                      </span>
                    </div>
                    {selectedOrder.paymentRefId && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">交易号</span>
                        <span className="text-slate-300 font-mono text-[10px]">{selectedOrder.paymentRefId}</span>
                      </div>
                    )}
                    {selectedOrder.paidAt && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">支付时间</span>
                        <span className="text-slate-300">{formatDate(selectedOrder.paidAt)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Refund info */}
                {selectedOrder.status === "refunded" && (
                  <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10 space-y-1.5">
                    <div className="text-[10px] text-red-400 mb-1">退款信息</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">退款金额</span>
                      <span className="text-red-400">{selectedOrder.refundAmount ? formatCNY(selectedOrder.refundAmount) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">退款时间</span>
                      <span className="text-slate-300">{selectedOrder.refundedAt ? formatDate(selectedOrder.refundedAt) : "—"}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">退款原因</span>
                      <span className="text-slate-300">{selectedOrder.refundReason || "—"}</span>
                    </div>
                  </div>
                )}

                {/* Invoice info */}
                {selectedOrder.invoiceTitle && (
                  <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 space-y-1.5">
                    <div className="text-[10px] text-slate-500 mb-1">发票信息</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">抬头</span>
                      <span className="text-slate-300">{selectedOrder.invoiceTitle}</span>
                    </div>
                    {selectedOrder.invoiceTaxId && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">税号</span>
                        <span className="text-slate-300">{selectedOrder.invoiceTaxId}</span>
                      </div>
                    )}
                    {selectedOrder.invoiceEmail && (
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">接收邮箱</span>
                        <span className="text-slate-300">{selectedOrder.invoiceEmail}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Related payments */}
                {orderPayments(selectedOrder.id).length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-500">支付记录</div>
                    {orderPayments(selectedOrder.id).map((p) => (
                      <div key={p.id} className="p-2 bg-white/[0.02] rounded border border-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {p.status === "success" ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> :
                           p.status === "failed" ? <XCircle className="w-3 h-3 text-red-400" /> :
                           p.status === "refunded" ? <RotateCcw className="w-3 h-3 text-purple-400" /> :
                           <CreditCard className="w-3 h-3 text-slate-400" />}
                          <span className="text-slate-300">
                            {p.method === "alipay" ? "支付宝" : p.method === "wechat_pay" ? "微信" : p.method.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">{formatCNY(p.amount)}</span>
                          <StatusBadge status={p.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>关闭</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
