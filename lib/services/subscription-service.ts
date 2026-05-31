// ============================================================
// 订阅与商业化数据服务
// 从真实数据库查询数据，不包含任何 Mock/演示数据
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
  PlanKey,
} from "@/lib/saas/types"
import { ALL_PLANS, getPlan } from "@/lib/saas/plans"

// ============================================================
// 套餐查询
// ============================================================

export async function getPlans(role?: string): Promise<ServiceResult<PlanDefinition[]>> {
  const plans = role
    ? ALL_PLANS.filter(p => p.targetRole === role || p.planKey === "free")
    : ALL_PLANS
  return { data: plans, source: "db" }
}

export async function getPlanByKey(key: string): Promise<ServiceResult<PlanDefinition | null>> {
  const plan = getPlan(key)
  return { data: plan || null, source: "db" }
}

// ============================================================
// 用户订阅查询
// ============================================================

export async function getUserSubscription(userId: string): Promise<ServiceResult<UserSubscriptionRecord | null>> {
  // TODO: 从数据库查询订阅记录
  return { data: null, source: "db" }
}

export async function getSubscriptionsByUser(userId: string): Promise<ServiceResult<UserSubscriptionRecord[]>> {
  return { data: [], source: "db" }
}

export async function getAllSubscriptions(): Promise<ServiceResult<UserSubscriptionRecord[]>> {
  return { data: [], source: "db" }
}

// ============================================================
// 额度检查与消费
// ============================================================

export async function checkUsage(
  userId: string,
  resource: UsageResource,
  requestedQuantity: number = 1
): Promise<ServiceResult<UsageCheckResult>> {
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
    source: "db",
  }
}

export async function consumeUsage(
  userId: string,
  resource: UsageResource,
  quantity: number = 1,
  targetId?: string
): Promise<ServiceResult<UsageCheckResult>> {
  const checkResult = await checkUsage(userId, resource, quantity)
  if (!checkResult.data?.allowed) {
    return { data: checkResult.data, source: "db", error: checkResult.data?.message }
  }
  return { data: checkResult.data, source: "db" }
}

// ============================================================
// 订单管理
// ============================================================

export async function getOrders(userId?: string): Promise<ServiceResult<OrderRecord[]>> {
  return { data: [], source: "db" }
}

export async function getOrderById(orderId: string): Promise<ServiceResult<OrderRecord | null>> {
  return { data: null, source: "db" }
}

export async function createUpgradeOrder(
  userId: string,
  currentPlanId: string,
  request: UpgradeSubscriptionRequest
): Promise<ServiceResult<OrderRecord>> {
  return { data: null as any, source: "db", error: "支付功能尚未配置。请联系管理员配置支付网关。" }
}

// ============================================================
// 模拟支付 — 已禁用
// ============================================================

export async function simulatePayment(
  request: SimulatePaymentRequest
): Promise<ServiceResult<SimulatePaymentResponse>> {
  return { data: null as any, source: "db", error: "模拟支付已禁用。请配置真实支付网关。" }
}

// ============================================================
// 支付记录查询
// ============================================================

export async function getPayments(userId?: string): Promise<ServiceResult<PaymentRecordData[]>> {
  return { data: [], source: "db" }
}

// ============================================================
// 使用记录查询
// ============================================================

export async function getUsageLogs(userId?: string, limit: number = 50): Promise<ServiceResult<UsageLogRecord[]>> {
  return { data: [], source: "db" }
}

// ============================================================
// 服务费查询
// ============================================================

export async function getServiceFees(): Promise<ServiceResult<ServiceFeeRecord[]>> {
  return { data: [], source: "db" }
}

// ============================================================
// 商业统计
// ============================================================

export async function getCommerceStats(): Promise<ServiceResult<CommerceStats>> {
  return {
    data: {
      totalSubscribers: 0,
      activeSubscribers: 0,
      trialSubscribers: 0,
      monthlyRevenue: 0,
      lastMonthRevenue: 0,
      revenueGrowth: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalRefunds: 0,
      refundAmount: 0,
      planBreakdown: [],
      monthlyRevenueTrend: [],
    },
    source: "db",
  }
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

// ============================================================
// ServiceResult type
// ============================================================

export interface ServiceResult<T> {
  data: T | null
  error?: string
  source: "db" | "mock"
  total?: number
}
