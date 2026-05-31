// ============================================================
// 运营数据分析系统 — 完整类型定义
// 所有数据均为示例数据，预留后续接入真实分析工具的结构
// ============================================================

// ----- 时间范围 -----
export type TimeRange = "7d" | "30d" | "90d" | "180d" | "365d" | "all"

// ----- 筛选条件 -----
export interface AnalyticsFilters {
  timeRange: TimeRange
  country?: string
  region?: string
  industry?: string
}

// ========================================
// 1. 用户增长分析
// ========================================

export interface GrowthDataPoint {
  date: string                    // ISO 日期 "2026-01"
  newUsers: number               // 新增用户
  activeUsers: number            // 月活跃用户
  newCandidates: number          // 新增候选人
  newCompanies: number           // 新增企业
  newHeadhunters: number         // 新增猎头
  totalUsers: number             // 累计用户数
}

export interface UserGrowthStats {
  periodLabel: string            // "近30天" / "近90天" 等
  summary: {
    totalNewUsers: number
    totalActiveUsers: number
    totalCandidates: number
    totalCompanies: number
    totalHeadhunters: number
    totalAccumulatedUsers: number
    growthRate: number           // 环比增长率 %
  }
  trend: GrowthDataPoint[]       // 时间序列数据
}

export interface CountryDistribution {
  country: string                // 国家名称
  countryCode: string            // ISO 3166-1 alpha-2
  region: string                 // 区域：亚太/欧洲/北美/南美/中东/非洲
  userCount: number
  candidateCount: number
  companyCount: number
  percentage: number
  growthRate: number
}

export interface IndustryDistribution {
  industry: string               // 行业名称
  industryKey: string            // 行业标识
  userCount: number
  candidateCount: number
  companyCount: number
  percentage: number
  growthRate: number
}

// ========================================
// 2. 招聘转化漏斗
// ========================================

export interface FunnelStage {
  stage: string                  // 阶段标识
  label: string                  // 阶段名称
  count: number                  // 数量
  rate: number                   // 本阶段转化率 %
  cumulativeRate: number         // 累计转化率 %（相对于搜索）
  previousCount: number          // 上期数量
  change: number                 // 环比变化 %
}

export interface RecruitmentFunnel {
  periodLabel: string
  stages: FunnelStage[]          // 按漏斗顺序排列
  summary: {
    totalSearches: number
    totalInvitations: number
    totalInterviews: number
    totalAssessments: number
    totalNegotiations: number
    totalOffers: number
    overallConversionRate: number // Offer/搜索
    avgTimeToHire: number        // 平均招聘周期（天）
  }
}

export interface FunnelTrendPoint {
  date: string
  stage: string
  count: number
  rate: number
}

// ========================================
// 3. 商业收入分析
// ========================================

export type RevenueCategory =
  | "subscription"
  | "enterprise_plan"
  | "headhunter"
  | "ai_reports"
  | "service_fees"
  | "api_service"

export interface RevenueDataPoint {
  date: string
  subscription: number           // 订阅收入（分）
  enterprisePlan: number         // 企业套餐收入（分）
  headhunter: number             // 猎头会员收入（分）
  aiReports: number              // AI 报告收入（分）
  serviceFees: number            // 服务费收入（分）
  apiService: number             // API 服务收入（分）
  total: number                  // 合计
}

export interface RevenueBreakdown {
  periodLabel: string
  summary: {
    totalRevenue: number
    subscriptionRevenue: number
    enterprisePlanRevenue: number
    headhunterRevenue: number
    aiReportsRevenue: number
    serviceFeesRevenue: number
    apiServiceRevenue: number
    growthRate: number
    arpu: number                 // 每用户平均收入
  }
  trend: RevenueDataPoint[]
  categoryDistribution: {
    category: RevenueCategory
    label: string
    amount: number
    percentage: number
  }[]
}

// ========================================
// 4. 数据质量分析
// ========================================

export interface DataQualityMetrics {
  periodLabel: string
  overview: {
    totalCandidates: number
    verifiedCount: number
    verifiedRate: number         // 已认证比例 %
    highCredibilityCount: number
    mediumCredibilityCount: number
    lowCredibilityCount: number
    authorizedCount: number
    unauthorizedCount: number
    expiredCount: number         // 数据过期数量
    avgCompleteness: number      // 平均数据完整度 %
  }
  credibilityDistribution: {
    level: string                // high / medium / low
    label: string
    count: number
    percentage: number
  }[]
  authorizationStatus: {
    status: string               // authorized / pending / unauthorized / expired
    label: string
    count: number
    percentage: number
  }[]
  dataSources: {
    source: string               // 数据来源
    label: string
    count: number
    trustScore: number           // 可信度评分 0-100
    verifiedRate: number
  }[]
  warnings: DataQualityWarning[]
  expiryAlerts: DataExpiryAlert[]
}

export interface DataQualityWarning {
  id: string
  type: "low_credibility" | "incomplete" | "duplicate" | "outdated" | "unauthorized"
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  affectedCount: number
  suggestedAction: string
  detectedAt: string
}

export interface DataExpiryAlert {
  id: string
  candidateName: string
  field: string                  // 过期字段
  updatedAt: string
  expiresAt: string
  daysUntilExpiry: number
  severity: "critical" | "warning" | "info"
}

// ========================================
// 总览数据
// ========================================

export interface AnalyticsOverview {
  userGrowth: {
    totalUsers: number
    newUsersThisMonth: number
    activeUsersThisMonth: number
    growthRate: number
  }
  recruitment: {
    totalCandidates: number
    activeJobs: number
    offersThisMonth: number
    conversionRate: number
  }
  revenue: {
    monthlyRevenue: number       // 分
    revenueGrowth: number
    arpu: number
    projectedYearlyRevenue: number
  }
  dataQuality: {
    verifiedRate: number
    avgCredibilityScore: number
    dataFreshness: number        // 数据新鲜度 %
    warningCount: number
  }
}

// ========================================
// Mock 标记
// ========================================
export type DataSource = "mock" | "ga4" | "mixpanel" | "amplitude" | "custom"
export const CURRENT_DATA_SOURCE: DataSource = "mock"
