// ============================================================
// SaaS 商业化类型定义
// ============================================================

// ----- 订阅套餐计划 -----
export type PlanTier = "free" | "basic" | "pro" | "ultimate" | "headhunter" | "api"
export type PlanKey =
  | "free"
  | "enterprise_basic"
  | "enterprise_pro"
  | "enterprise_ultimate"
  | "headhunter"
  | "api_data"
export type TargetRole = "company" | "headhunter"
export type BillingCycle = "monthly" | "yearly"

export interface PlanEntitlements {
  maxSearches: number
  maxCandidateViews: number
  maxInvitations: number
  maxAIReports: number
  maxContactUnlocks: number
  maxTeamMembers: number
  maxJobPosts: number
  maxMessages: number
  hasAdvancedSearch: boolean
  hasApiAccess: boolean
  hasDedicatedSupport: boolean
  hasCustomReports: boolean
  hasPriorityVerify: boolean
}

export interface PlanDefinition {
  planKey: PlanKey
  name: string
  nameEn: string
  tier: PlanTier
  targetRole: TargetRole
  priceMonthly: number    // CNY 分
  priceYearly: number     // CNY 分
  currency: string
  isActive: boolean
  sortOrder: number
  entitlements: PlanEntitlements
  description: string     // 中文描述
  descriptionEn: string   // 英文描述
  features: string[]     // 功能亮点（中文）
  featuresEn: string[]   // 功能亮点（英文）
  highlighted?: boolean  // 是否推荐套餐
}

// ----- 用户订阅 -----
export type SubscriptionStatus = "active" | "expired" | "cancelled" | "paused" | "trial"

export interface UserSubscriptionRecord {
  id: string
  userId: string
  planId: string
  status: SubscriptionStatus
  billingCycle: BillingCycle
  startDate: string
  endDate: string
  autoRenew: boolean
  trialEndsAt?: string

  // 使用记录
  searchesUsed: number
  candidateViewsUsed: number
  invitationsUsed: number
  aiReportsUsed: number
  contactUnlocksUsed: number
  messagesUsed: number

  quotaResetAt?: string
  createdAt: string
  updatedAt: string

  // 关联（展开后）
  plan?: PlanDefinition
  userName?: string
  userEmail?: string
}

// ----- 额度使用日志 -----
export type UsageResource =
  | "search"
  | "candidate_view"
  | "invitation"
  | "ai_report"
  | "contact_unlock"
  | "message"
export type UsageAction = "consume" | "refund"

export interface UsageLogRecord {
  id: string
  userId: string
  subscriptionId?: string
  resource: UsageResource
  action: UsageAction
  quantity: number
  targetId?: string
  metadata?: string
  createdAt: string
}

// ----- 订单 -----
export type OrderType = "new" | "upgrade" | "renewal"
export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled"
export type PaymentMethod = "stripe" | "paddle" | "alipay" | "wechat_pay" | "mock"

export interface OrderRecord {
  id: string
  userId: string
  planId: string
  subscriptionId?: string
  type: OrderType
  billingCycle: BillingCycle
  amount: number
  currency: string
  discountCode?: string
  discountAmount: number
  finalAmount: number
  status: OrderStatus
  paymentMethod?: PaymentMethod

  paidAt?: string
  paymentRefId?: string
  refundedAt?: string
  refundAmount?: number
  refundReason?: string

  // 发票
  invoiceTitle?: string
  invoiceTaxId?: string
  invoiceEmail?: string
  invoiceSentAt?: string

  metadata?: string
  createdAt: string
  updatedAt: string

  // 关联
  plan?: PlanDefinition
  userName?: string
  userEmail?: string
}

// ----- 支付记录 -----
export type PaymentStatus = "pending" | "processing" | "success" | "failed" | "refunded"

export interface PaymentRecordData {
  id: string
  orderId: string
  userId: string
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  currency: string
  gatewayRefId?: string
  gatewayResponse?: string
  errorMessage?: string
  paidAt?: string
  createdAt: string
}

// ----- 模拟支付请求 -----
export interface SimulatePaymentRequest {
  orderId: string
  method: PaymentMethod
  shouldSucceed?: boolean
}

export interface SimulatePaymentResponse {
  success: boolean
  message: string
  paymentId?: string
  orderId: string
  method: PaymentMethod
  status: PaymentStatus
  errorMessage?: string
}

// ----- 订阅升级请求 -----
export interface UpgradeSubscriptionRequest {
  targetPlanKey: PlanKey
  billingCycle: BillingCycle
}

export interface CheckUsageRequest {
  resource: UsageResource
  quantity?: number
}

export interface UsageCheckResult {
  allowed: boolean
  resource: UsageResource
  requested: number
  used: number
  limit: number
  remaining: number
  message: string
}

// ----- 商业统计 -----
export interface CommerceStats {
  totalSubscribers: number
  activeSubscribers: number
  trialSubscribers: number
  monthlyRevenue: number           // 本月收入（CNY 分）
  lastMonthRevenue: number         // 上月收入
  revenueGrowth: number            // 收入增长率
  totalOrders: number
  pendingOrders: number
  totalRefunds: number
  refundAmount: number

  // 分套餐统计
  planBreakdown: PlanBreakdown[]
  // 月度收入趋势
  monthlyRevenueTrend: MonthlyRevenuePoint[]
}

export interface PlanBreakdown {
  planKey: PlanKey
  planName: string
  subscriberCount: number
  revenue: number
}

export interface MonthlyRevenuePoint {
  month: string       // "2026-01"
  amount: number      // CNY 分
  orderCount: number
  newSubscribers: number
}

// ----- 服务费状态（猎头合作场景）-----
export type ServiceFeeStatus = "pending" | "invoiced" | "paid" | "overdue" | "cancelled"

export interface ServiceFeeRecord {
  id: string
  candidateName: string
  companyName: string
  position: string
  annualSalary: number         // CNY 分
  feeRate: number              // 服务费率 20%
  feeAmount: number            // 服务费金额
  status: ServiceFeeStatus
  invoicedAt?: string
  paidAt?: string
  dueDate: string
  createdAt: string
}
