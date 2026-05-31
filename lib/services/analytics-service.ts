// ============================================================
// Analytics 数据服务层
// 所有数据为 Mock 示例数据
// 结构预留后续接入 GA4 / Mixpanel / Amplitude / 自定义埋点
// ============================================================

import type {
  AnalyticsFilters, TimeRange,
  GrowthDataPoint, UserGrowthStats,
  CountryDistribution, IndustryDistribution,
  FunnelStage, RecruitmentFunnel, FunnelTrendPoint,
  RevenueDataPoint, RevenueBreakdown, RevenueCategory,
  DataQualityMetrics, AnalyticsOverview,
} from "@/lib/analytics/types"
import {
  MOCK_GROWTH_TREND_12M, MOCK_COUNTRY_DISTRIBUTION,
  MOCK_INDUSTRY_DISTRIBUTION,
  MOCK_RECRUITMENT_FUNNEL, MOCK_FUNNEL_TREND_6M,
  MOCK_REVENUE_TREND_12M, MOCK_DATA_QUALITY,
  MOCK_ANALYTICS_OVERVIEW,
  getGrowthData, getRevenueData, getFunnelTrend,
} from "@/lib/analytics/mockData"

// ============================================================
// 1. 用户增长
// ============================================================

const PERIOD_LABELS: Record<TimeRange, string> = {
  "7d": "近7天",
  "30d": "近30天",
  "90d": "近90天",
  "180d": "近180天",
  "365d": "近365天",
  "all": "全部",
}

export function getUserGrowthStats(filters: AnalyticsFilters): UserGrowthStats {
  const trend = getGrowthData(filters.timeRange, filters.country, filters.industry)
  if (trend.length === 0) {
    return {
      periodLabel: PERIOD_LABELS[filters.timeRange],
      summary: { totalNewUsers: 0, totalActiveUsers: 0, totalCandidates: 0, totalCompanies: 0, totalHeadhunters: 0, totalAccumulatedUsers: 0, growthRate: 0 },
      trend: [],
    }
  }

  const last = trend[trend.length - 1]
  const totalNewUsers = trend.reduce((s, p) => s + p.newUsers, 0)
  const totalCandidates = trend.reduce((s, p) => s + p.newCandidates, 0)
  const totalCompanies = trend.reduce((s, p) => s + p.newCompanies, 0)
  const totalHeadhunters = trend.reduce((s, p) => s + p.newHeadhunters, 0)
  const prevNewUsers = trend.length >= 2 ? trend.slice(0, -1).reduce((s, p) => s + p.newUsers, 0) / (trend.length - 1) : totalNewUsers
  const growthRate = prevNewUsers > 0 ? ((last.newUsers - prevNewUsers) / prevNewUsers) * 100 : 0

  return {
    periodLabel: PERIOD_LABELS[filters.timeRange],
    summary: {
      totalNewUsers,
      totalActiveUsers: last.activeUsers,
      totalCandidates,
      totalCompanies,
      totalHeadhunters,
      totalAccumulatedUsers: last.totalUsers,
      growthRate: Math.round(growthRate * 10) / 10,
    },
    trend,
  }
}

// ============================================================
// 1b. 国家/行业分布
// ============================================================

export function getCountryDistribution(_filters?: AnalyticsFilters): CountryDistribution[] {
  // 模拟筛选：预留接口
  return MOCK_COUNTRY_DISTRIBUTION
}

export function getIndustryDistribution(_filters?: AnalyticsFilters): IndustryDistribution[] {
  return MOCK_INDUSTRY_DISTRIBUTION
}

// ============================================================
// 2. 招聘转化漏斗
// ============================================================

export function getRecruitmentFunnel(filters: AnalyticsFilters): RecruitmentFunnel {
  // 漏斗阶段数据（简单版本直接返回）
  const tr = MOCK_RECRUITMENT_FUNNEL

  return {
    periodLabel: PERIOD_LABELS[filters.timeRange],
    stages: tr,
    summary: {
      totalSearches: tr[0]?.count ?? 0,
      totalInvitations: tr[2]?.count ?? 0,
      totalInterviews: tr[4]?.count ?? 0,
      totalAssessments: tr[5]?.count ?? 0,
      totalNegotiations: tr[6]?.count ?? 0,
      totalOffers: tr[7]?.count ?? 0,
      overallConversionRate: tr[7]?.cumulativeRate ?? 0,
      avgTimeToHire: 42, // 天（示例数据）
    },
  }
}

export function getFunnelTrendData(filters: AnalyticsFilters): FunnelTrendPoint[] {
  return getFunnelTrend(filters.timeRange)
}

// ============================================================
// 3. 商业收入
// ============================================================

const CATEGORY_LABELS: Record<RevenueCategory, string> = {
  subscription: "订阅收入",
  enterprise_plan: "企业套餐",
  headhunter: "猎头会员",
  ai_reports: "AI 报告",
  service_fees: "服务费",
  api_service: "API 服务",
}

export function getRevenueBreakdown(filters: AnalyticsFilters): RevenueBreakdown {
  const trend = getRevenueData(filters.timeRange)
  if (trend.length === 0) {
    return {
      periodLabel: PERIOD_LABELS[filters.timeRange],
      summary: { totalRevenue: 0, subscriptionRevenue: 0, enterprisePlanRevenue: 0, headhunterRevenue: 0, aiReportsRevenue: 0, serviceFeesRevenue: 0, apiServiceRevenue: 0, growthRate: 0, arpu: 0 },
      trend: [],
      categoryDistribution: [],
    }
  }

  const last = trend[trend.length - 1]
  const totalSub = trend.reduce((s, p) => s + p.subscription, 0)
  const totalEnt = trend.reduce((s, p) => s + p.enterprisePlan, 0)
  const totalHh = trend.reduce((s, p) => s + p.headhunter, 0)
  const totalAi = trend.reduce((s, p) => s + p.aiReports, 0)
  const totalSf = trend.reduce((s, p) => s + p.serviceFees, 0)
  const totalApi = trend.reduce((s, p) => s + p.apiService, 0)
  const totalRevenue = totalSub + totalEnt + totalHh + totalAi + totalSf + totalApi

  // 增长率
  const prev = trend.length >= 2 ? trend[trend.length - 2] : null
  const growthRate = prev && prev.total > 0 ? ((last.total - prev.total) / prev.total) * 100 : 0

  // ARPU（以当前累计用户数估算）
  const arpu = 5330 // 示例数据

  const categoryDistribution = [
    { category: "enterprise_plan" as RevenueCategory, label: CATEGORY_LABELS.enterprise_plan, amount: totalEnt, percentage: totalRevenue > 0 ? (totalEnt / totalRevenue) * 100 : 0 },
    { category: "subscription" as RevenueCategory, label: CATEGORY_LABELS.subscription, amount: totalSub, percentage: totalRevenue > 0 ? (totalSub / totalRevenue) * 100 : 0 },
    { category: "service_fees" as RevenueCategory, label: CATEGORY_LABELS.service_fees, amount: totalSf, percentage: totalRevenue > 0 ? (totalSf / totalRevenue) * 100 : 0 },
    { category: "ai_reports" as RevenueCategory, label: CATEGORY_LABELS.ai_reports, amount: totalAi, percentage: totalRevenue > 0 ? (totalAi / totalRevenue) * 100 : 0 },
    { category: "api_service" as RevenueCategory, label: CATEGORY_LABELS.api_service, amount: totalApi, percentage: totalRevenue > 0 ? (totalApi / totalRevenue) * 100 : 0 },
    { category: "headhunter" as RevenueCategory, label: CATEGORY_LABELS.headhunter, amount: totalHh, percentage: totalRevenue > 0 ? (totalHh / totalRevenue) * 100 : 0 },
  ].sort((a, b) => b.amount - a.amount) as { category: RevenueCategory; label: string; amount: number; percentage: number }[]

  return {
    periodLabel: PERIOD_LABELS[filters.timeRange],
    summary: {
      totalRevenue,
      subscriptionRevenue: totalSub,
      enterprisePlanRevenue: totalEnt,
      headhunterRevenue: totalHh,
      aiReportsRevenue: totalAi,
      serviceFeesRevenue: totalSf,
      apiServiceRevenue: totalApi,
      growthRate: Math.round(growthRate * 10) / 10,
      arpu,
    },
    trend,
    categoryDistribution,
  }
}

// ============================================================
// 4. 数据质量
// ============================================================

export function getDataQualityMetrics(_filters?: AnalyticsFilters): DataQualityMetrics {
  return MOCK_DATA_QUALITY
}

// ============================================================
// 5. 总览
// ============================================================

export function getAnalyticsOverview(_filters?: AnalyticsFilters): AnalyticsOverview {
  return MOCK_ANALYTICS_OVERVIEW
}
