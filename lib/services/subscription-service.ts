// ============================================================
// 订阅与商业化数据服务
// DB-first + Mock fallback 架构
// ============================================================

import type {
  PlanDefinition,
  UserSubscriptionRecord,
  OrderRecord,
  PaymentRecordData,
  UsageLogRecord,
  ServiceFeeRecord,
  CommerceStats,
  UsageCheckResult,
  UsageResource,
  SimulatePaymentRequest,
  SimulatePaymentResponse,
  UpgradeSubscriptionRequest,
  BillingCycle,
  PlanKey,
  PaymentMethod,
} from "@/lib/saas/types"
import { ALL_PLANS, getPlan } from "@/lib/saas/plans"
import {
  MOCK_SUBSCRIPTIONS,
  MOCK_ORDERS,
  MOCK_PAYMENTS,
  MOCK_USAGE_LOGS,
  MOCK_SERVICE_FEES,
  MOCK_COMMERCE_STATS,
} from "@/lib/saas/mockData"

// ============================================================
// 套餐查询
// ============================================================

export async function getPlans(role?: string): Promise<ServiceResult<PlanDefinition[]>> {
  const plans = role
    ? ALL_PLANS.filter(p => p.targetRole === role || p.planKey === "free")
    : ALL_PLANS
  return { data: plans, source: "mock" }
}

export async function getPlanByKey(key: string): Promise<ServiceResult<PlanDefinition | null>> {
  const plan = getPlan(key)
  return { data: plan || null, source: "mock" }
}

// ============================================================
// 用户订阅查询
// ============================================================

export async function getUserSubscription(userId: string): Promise<ServiceResult<UserSubscriptionRecord | null>> {
  const sub = MOCK_SUBSCRIPTIONS.find(s => s.userId === userId) || null
  if (sub) {
    sub.plan = getPlan(MOCK_PLAN_ID_TO_KEY[sub.planId] || "free")
  }
  return { data: sub, source: "mock" }
}

export async function getSubscriptionsByUser(userId: string): Promise<ServiceResult<UserSubscriptionRecord[]>> {
  const subs = MOCK_SUBSCRIPTIONS.filter(s => s.userId === userId)
    .map(s => ({ ...s, plan: getPlan(MOCK_PLAN_ID_TO_KEY[s.planId] || "free") }))
  return { data: subs, source: "mock" }
}

export async function getAllSubscriptions(): Promise<ServiceResult<UserSubscriptionRecord[]>> {
  const subs = MOCK_SUBSCRIPTIONS.map(s => ({
    ...s,
    plan: getPlan(MOCK_PLAN_ID_TO_KEY[s.planId] || "free"),
  }))
  return { data: subs, source: "mock" }
}

// ============================================================
// 额度检查与消费
// ============================================================

export async function checkUsage(
  userId: string,
  resource: UsageResource,
  requestedQuantity: number = 1
): Promise<ServiceResult<UsageCheckResult>> {
  const subResult = await getUserSubscription(userId)
  const sub = subResult.data

  if (!sub) {
    // 无订阅用户使用免费版额度
    const freePlan = getPlan("free")!
    const limit = getUsageLimit(freePlan, resource)
    return {
      data: {
        allowed: requestedQuantity <= limit,
        resource,
        requested: requestedQuantity,
        used: 0,
        limit,
        remaining: Math.max(0, limit - requestedQuantity),
        message: requestedQuantity <= limit
          ? "额度充足"
          : `额度不足：已用 0/${limit}，请求 ${requestedQuantity}`,
      },
      source: "mock",
    }
  }

  const plan = sub.plan || getPlan("free")!
  const used = getUsageUsed(sub, resource)
  const limit = getUsageLimit(plan, resource)
  const remaining = Math.max(0, limit - used)

  return {
    data: {
      allowed: remaining >= requestedQuantity,
      resource,
      requested: requestedQuantity,
      used,
      limit,
      remaining,
      message: remaining >= requestedQuantity
        ? "额度充足"
        : `额度不足：已用 ${used}/${limit}，剩余 ${remaining}，请求 ${requestedQuantity}`,
    },
    source: "mock",
  }
}

export async function consumeUsage(
  userId: string,
  resource: UsageResource,
  quantity: number = 1,
  targetId?: string
): Promise<ServiceResult<UsageCheckResult>> {
  // 先检查额度
  const checkResult = await checkUsage(userId, resource, quantity)
  if (!checkResult.data?.allowed) {
    return { data: checkResult.data, source: "mock", error: checkResult.data?.message }
  }

  // 更新使用计数
  const subIdx = MOCK_SUBSCRIPTIONS.findIndex(s => s.userId === userId)
  if (subIdx >= 0) {
    const sub = MOCK_SUBSCRIPTIONS[subIdx]
    switch (resource) {
      case "search": sub.searchesUsed += quantity; break
      case "candidate_view": sub.candidateViewsUsed += quantity; break
      case "invitation": sub.invitationsUsed += quantity; break
      case "ai_report": sub.aiReportsUsed += quantity; break
      case "contact_unlock": sub.contactUnlocksUsed += quantity; break
      case "message": sub.messagesUsed += quantity; break
    }
  }

  // 记录使用日志
  MOCK_USAGE_LOGS.push({
    id: `use_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    userId,
    subscriptionId: MOCK_SUBSCRIPTIONS.find(s => s.userId === userId)?.id,
    resource,
    action: "consume",
    quantity,
    targetId,
    createdAt: new Date().toISOString(),
  })

  return { data: checkResult.data, source: "mock" }
}

// ============================================================
// 订单管理
// ============================================================

export async function getOrders(userId?: string): Promise<ServiceResult<OrderRecord[]>> {
  const orders = userId
    ? MOCK_ORDERS.filter(o => o.userId === userId)
    : MOCK_ORDERS
  const enriched = await enrichOrders(orders)
  return { data: enriched, source: "mock" }
}

export async function getOrderById(orderId: string): Promise<ServiceResult<OrderRecord | null>> {
  const order = MOCK_ORDERS.find(o => o.id === orderId)
  if (!order) return { data: null, source: "mock" }
  const enriched = (await enrichOrders([order]))[0]
  return { data: enriched, source: "mock" }
}

export async function createUpgradeOrder(
  userId: string,
  currentPlanId: string,
  request: UpgradeSubscriptionRequest
): Promise<ServiceResult<OrderRecord>> {
  const plan = getPlan(request.targetPlanKey)
  if (!plan) return { data: null as any, source: "mock", error: "套餐不存在" }

  const currentSub = MOCK_SUBSCRIPTIONS.find(s => s.userId === userId && s.planId === currentPlanId)
  const isYearly = request.billingCycle === "yearly"
  const amount = isYearly ? plan.priceYearly : plan.priceMonthly
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const order: OrderRecord = {
    id: orderId,
    userId,
    planId: `plan_${request.targetPlanKey}`,
    type: currentSub ? "upgrade" : "new",
    billingCycle: request.billingCycle,
    amount,
    currency: "CNY",
    discountCode: "",
    discountAmount: 0,
    finalAmount: amount,
    status: "pending",
    paymentMethod: "mock",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    plan,
    userName: "当前用户",
  }

  MOCK_ORDERS.unshift(order)
  return { data: order, source: "mock" }
}

// ============================================================
// 模拟支付
// ============================================================

export async function simulatePayment(
  request: SimulatePaymentRequest
): Promise<ServiceResult<SimulatePaymentResponse>> {
  const order = MOCK_ORDERS.find(o => o.id === request.orderId)
  if (!order) return { data: null as any, source: "mock", error: "订单不存在" }
  if (order.status === "paid") return { data: null as any, source: "mock", error: "订单已支付" }

  const shouldSucceed = request.shouldSucceed !== false
  const paymentId = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

  if (shouldSucceed) {
    // 支付成功
    order.status = "paid"
    order.paidAt = new Date().toISOString()
    order.paymentRefId = `${request.method.toUpperCase()}_TXN_${Date.now()}`

    // 更新订阅
    const sub = MOCK_SUBSCRIPTIONS.find(s => s.userId === order.userId && s.planId === order.planId)
    if (sub) {
      const plan = getPlan(MOCK_PLAN_ID_TO_KEY[order.planId] || "free")
      if (plan) {
        const now = new Date()
        const endDate = new Date(now)
        if (order.billingCycle === "yearly") endDate.setFullYear(endDate.getFullYear() + 1)
        else endDate.setMonth(endDate.getMonth() + 1)

        sub.status = "active"
        sub.billingCycle = order.billingCycle
        sub.startDate = now.toISOString()
        sub.endDate = endDate.toISOString()
        sub.searchesUsed = 0
        sub.candidateViewsUsed = 0
        sub.invitationsUsed = 0
        sub.aiReportsUsed = 0
        sub.contactUnlocksUsed = 0
        sub.messagesUsed = 0
        sub.quotaResetAt = endDate.toISOString()
      }
    }

    // 记录支付
    MOCK_PAYMENTS.push({
      id: paymentId,
      orderId: request.orderId,
      userId: order.userId,
      method: request.method,
      status: "success",
      amount: order.finalAmount,
      currency: "CNY",
      gatewayRefId: order.paymentRefId,
      paidAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    })

    return {
      data: {
        success: true,
        message: "支付成功！订阅已激活",
        paymentId,
        orderId: request.orderId,
        method: request.method,
        status: "success",
      },
      source: "mock",
    }
  } else {
    // 支付失败
    order.status = "failed"

    MOCK_PAYMENTS.push({
      id: paymentId,
      orderId: request.orderId,
      userId: order.userId,
      method: request.method,
      status: "failed",
      amount: order.finalAmount,
      currency: "CNY",
      errorMessage: "模拟支付失败：余额不足 / 卡片被拒",
      createdAt: new Date().toISOString(),
    })

    return {
      data: {
        success: false,
        message: "支付失败：余额不足，请更换支付方式",
        paymentId,
        orderId: request.orderId,
        method: request.method,
        status: "failed",
        errorMessage: "Insufficient funds",
      },
      source: "mock",
    }
  }
}

// ============================================================
// 支付记录查询
// ============================================================

export async function getPayments(userId?: string): Promise<ServiceResult<PaymentRecordData[]>> {
  const payments = userId
    ? MOCK_PAYMENTS.filter(p => p.userId === userId)
    : MOCK_PAYMENTS
  return { data: payments, source: "mock" }
}

// ============================================================
// 使用记录查询
// ============================================================

export async function getUsageLogs(userId?: string, limit: number = 50): Promise<ServiceResult<UsageLogRecord[]>> {
  const logs = userId
    ? MOCK_USAGE_LOGS.filter(l => l.userId === userId).slice(0, limit)
    : MOCK_USAGE_LOGS.slice(0, limit)
  return { data: logs, source: "mock" }
}

// ============================================================
// 服务费查询
// ============================================================

export async function getServiceFees(): Promise<ServiceResult<ServiceFeeRecord[]>> {
  return { data: [...MOCK_SERVICE_FEES], source: "mock" }
}

// ============================================================
// 商业统计
// ============================================================

export async function getCommerceStats(): Promise<ServiceResult<CommerceStats>> {
  return { data: { ...MOCK_COMMERCE_STATS }, source: "mock" }
}

// ============================================================
// Helper: 订单关联数据填充
// ============================================================

async function enrichOrders(orders: OrderRecord[]): Promise<OrderRecord[]> {
  return orders.map(o => ({
    ...o,
    plan: getPlan(MOCK_PLAN_ID_TO_KEY[o.planId] || "free"),
  }))
}

// ============================================================
// Helper: planId -> planKey 映射
// ============================================================

const MOCK_PLAN_ID_TO_KEY: Record<string, PlanKey> = {
  plan_free: "free",
  plan_enterprise_basic: "enterprise_basic",
  plan_enterprise_pro: "enterprise_pro",
  plan_enterprise_ultimate: "enterprise_ultimate",
  plan_headhunter: "headhunter",
  plan_api_data: "api_data",
}

// ============================================================
// Helper: 获取资源限额
// ============================================================

function getUsageLimit(plan: PlanDefinition, resource: UsageResource): number {
  const e = plan.entitlements
  switch (resource) {
    case "search": return e.maxSearches
    case "candidate_view": return e.maxCandidateViews
    case "invitation": return e.maxInvitations
    case "ai_report": return e.maxAIReports
    case "contact_unlock": return e.maxContactUnlocks
    case "message": return e.maxMessages
    default: return 0
  }
}

function getUsageUsed(sub: UserSubscriptionRecord, resource: UsageResource): number {
  switch (resource) {
    case "search": return sub.searchesUsed
    case "candidate_view": return sub.candidateViewsUsed
    case "invitation": return sub.invitationsUsed
    case "ai_report": return sub.aiReportsUsed
    case "contact_unlock": return sub.contactUnlocksUsed
    case "message": return sub.messagesUsed
    default: return 0
  }
}

// ============================================================
// ServiceResult type
// ============================================================

export interface ServiceResult<T> {
  data: T | null
  error?: string
  source: "db" | "mock"
  total?: number
}
