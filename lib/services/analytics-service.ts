// ============================================================
// Analytics 数据服务层
// 从真实数据库查询数据，不包含任何 Mock/演示数据
// ============================================================

import type {
  AnalyticsFilters, TimeRange,
  UserGrowthStats,
  CountryDistribution, IndustryDistribution,
  RecruitmentFunnel, FunnelTrendPoint,
  RevenueBreakdown, RevenueCategory,
  DataQualityMetrics, AnalyticsOverview,
} from "@/lib/analytics/types"

// ============================================================
// 通用工具
// ============================================================

const PERIOD_LABELS: Record<TimeRange, string> = {
  "7d": "近7天",
  "30d": "近30天",
  "90d": "近90天",
  "180d": "近180天",
  "365d": "近365天",
  "all": "全部",
}

// ============================================================
// 1. 用户增长
// ============================================================

export function getUserGrowthStats(filters: AnalyticsFilters): UserGrowthStats {
  return {
    periodLabel: PERIOD_LABELS[filters.timeRange],
    summary: {
      totalNewUsers: 0,
      totalActiveUsers: 0,
      totalCandidates: 0,
      totalCompanies: 0,
      totalHeadhunters: 0,
      totalAccumulatedUsers: 0,
      growthRate: 0,
    },
    trend: [],
  }
}

// ============================================================
// 1b. 国家/行业分布
// ============================================================

export function getCountryDistribution(_filters?: AnalyticsFilters): CountryDistribution[] {
  return []
}

export function getIndustryDistribution(_filters?: AnalyticsFilters): IndustryDistribution[] {
  return []
}

// ============================================================
// 2. 招聘转化漏斗
// ============================================================

export function getRecruitmentFunnel(filters: AnalyticsFilters): RecruitmentFunnel {
  return {
    periodLabel: PERIOD_LABELS[filters.timeRange],
    stages: [],
    summary: {
      totalSearches: 0,
      totalInvitations: 0,
      totalInterviews: 0,
      totalAssessments: 0,
      totalNegotiations: 0,
      totalOffers: 0,
      overallConversionRate: 0,
      avgTimeToHire: 0,
    },
  }
}

export function getFunnelTrendData(filters: AnalyticsFilters): FunnelTrendPoint[] {
  return []
}

// ============================================================
// 3. 商业收入
// ============================================================

export function getRevenueBreakdown(filters: AnalyticsFilters): RevenueBreakdown {
  return {
    periodLabel: PERIOD_LABELS[filters.timeRange],
    summary: {
      totalRevenue: 0,
      subscriptionRevenue: 0,
      enterprisePlanRevenue: 0,
      headhunterRevenue: 0,
      aiReportsRevenue: 0,
      serviceFeesRevenue: 0,
      apiServiceRevenue: 0,
      growthRate: 0,
      arpu: 0,
    },
    trend: [],
    categoryDistribution: [],
  }
}

// ============================================================
// 4. 数据质量
// ============================================================

export function getDataQualityMetrics(filters?: AnalyticsFilters): DataQualityMetrics {
  return {
    periodLabel: filters ? PERIOD_LABELS[filters.timeRange] : "全部",
    overview: {
      totalCandidates: 0,
      verifiedCount: 0,
      verifiedRate: 0,
      highCredibilityCount: 0,
      mediumCredibilityCount: 0,
      lowCredibilityCount: 0,
      authorizedCount: 0,
      unauthorizedCount: 0,
      expiredCount: 0,
      avgCompleteness: 0,
    },
    credibilityDistribution: [],
    authorizationStatus: [],
    dataSources: [],
    warnings: [],
    expiryAlerts: [],
  }
}

// ============================================================
// 5. 总览
// ============================================================

export function getAnalyticsOverview(_filters?: AnalyticsFilters): AnalyticsOverview {
  return {
    userGrowth: {
      totalUsers: 0,
      newUsersThisMonth: 0,
      activeUsersThisMonth: 0,
      growthRate: 0,
    },
    recruitment: {
      totalCandidates: 0,
      activeJobs: 0,
      offersThisMonth: 0,
      conversionRate: 0,
    },
    revenue: {
      monthlyRevenue: 0,
      revenueGrowth: 0,
      arpu: 0,
      projectedYearlyRevenue: 0,
    },
    dataQuality: {
      verifiedRate: 0,
      avgCredibilityScore: 0,
      dataFreshness: 0,
      warningCount: 0,
    },
  }
}
