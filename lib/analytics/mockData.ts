// ============================================================
// Analytics Mock 数据 — 运营分析所有示例数据
// 所有数据标注为示例数据，不接入真实埋点
// ============================================================

import type {
  GrowthDataPoint, CountryDistribution, IndustryDistribution,
  FunnelStage, RecruitmentFunnel, FunnelTrendPoint,
  RevenueDataPoint, RevenueCategory,
  DataQualityMetrics, DataQualityWarning, DataExpiryAlert, AnalyticsOverview,
  TimeRange,
} from "./types"

// ====================================================================
// 1. 用户增长 Mock 数据 — 12 个月趋势
// ====================================================================

export const MOCK_GROWTH_TREND_12M: GrowthDataPoint[] = [
  { date: "2025-06", newUsers: 24, activeUsers: 18, newCandidates: 15, newCompanies: 5, newHeadhunters: 4, totalUsers: 24 },
  { date: "2025-07", newUsers: 31, activeUsers: 25, newCandidates: 20, newCompanies: 6, newHeadhunters: 5, totalUsers: 55 },
  { date: "2025-08", newUsers: 38, activeUsers: 32, newCandidates: 24, newCompanies: 7, newHeadhunters: 7, totalUsers: 93 },
  { date: "2025-09", newUsers: 45, activeUsers: 40, newCandidates: 28, newCompanies: 9, newHeadhunters: 8, totalUsers: 138 },
  { date: "2025-10", newUsers: 52, activeUsers: 48, newCandidates: 35, newCompanies: 10, newHeadhunters: 7, totalUsers: 190 },
  { date: "2025-11", newUsers: 68, activeUsers: 62, newCandidates: 45, newCompanies: 12, newHeadhunters: 11, totalUsers: 258 },
  { date: "2025-12", newUsers: 55, activeUsers: 80, newCandidates: 32, newCompanies: 14, newHeadhunters: 9, totalUsers: 313 },
  { date: "2026-01", newUsers: 82, activeUsers: 95, newCandidates: 52, newCompanies: 16, newHeadhunters: 14, totalUsers: 395 },
  { date: "2026-02", newUsers: 76, activeUsers: 110, newCandidates: 48, newCompanies: 13, newHeadhunters: 15, totalUsers: 471 },
  { date: "2026-03", newUsers: 94, activeUsers: 135, newCandidates: 62, newCompanies: 18, newHeadhunters: 14, totalUsers: 565 },
  { date: "2026-04", newUsers: 108, activeUsers: 160, newCandidates: 75, newCompanies: 20, newHeadhunters: 13, totalUsers: 673 },
  { date: "2026-05", newUsers: 125, activeUsers: 195, newCandidates: 85, newCompanies: 24, newHeadhunters: 16, totalUsers: 798 },
]

// 国家/地区分布
export const MOCK_COUNTRY_DISTRIBUTION: CountryDistribution[] = [
  { country: "中国", countryCode: "CN", region: "亚太", userCount: 245, candidateCount: 158, companyCount: 52, percentage: 30.7, growthRate: 18.5 },
  { country: "美国", countryCode: "US", region: "北美", userCount: 128, candidateCount: 82, companyCount: 28, percentage: 16.0, growthRate: 12.3 },
  { country: "德国", countryCode: "DE", region: "欧洲", userCount: 96, candidateCount: 68, companyCount: 18, percentage: 12.0, growthRate: 22.1 },
  { country: "丹麦", countryCode: "DK", region: "欧洲", userCount: 58, candidateCount: 42, companyCount: 10, percentage: 7.3, growthRate: 15.8 },
  { country: "日本", countryCode: "JP", region: "亚太", userCount: 52, candidateCount: 28, companyCount: 15, percentage: 6.5, growthRate: 8.2 },
  { country: "韩国", countryCode: "KR", region: "亚太", userCount: 45, candidateCount: 24, companyCount: 12, percentage: 5.6, growthRate: 25.4 },
  { country: "英国", countryCode: "GB", region: "欧洲", userCount: 38, candidateCount: 22, companyCount: 10, percentage: 4.8, growthRate: 10.5 },
  { country: "印度", countryCode: "IN", region: "亚太", userCount: 35, candidateCount: 28, companyCount: 4, percentage: 4.4, growthRate: 35.2 },
  { country: "瑞典", countryCode: "SE", region: "欧洲", userCount: 28, candidateCount: 18, companyCount: 6, percentage: 3.5, growthRate: 8.9 },
  { country: "巴西", countryCode: "BR", region: "南美", userCount: 22, candidateCount: 16, companyCount: 4, percentage: 2.8, growthRate: 42.1 },
  { country: "澳大利亚", countryCode: "AU", region: "亚太", userCount: 18, candidateCount: 12, companyCount: 4, percentage: 2.3, growthRate: 14.3 },
  { country: "荷兰", countryCode: "NL", region: "欧洲", userCount: 15, candidateCount: 10, companyCount: 3, percentage: 1.9, growthRate: 11.2 },
  { country: "新加坡", countryCode: "SG", region: "亚太", userCount: 12, candidateCount: 8, companyCount: 3, percentage: 1.5, growthRate: 20.0 },
  { country: "挪威", countryCode: "NO", region: "欧洲", userCount: 6, candidateCount: 4, companyCount: 1, percentage: 0.8, growthRate: 16.7 },
]

// 行业分布
export const MOCK_INDUSTRY_DISTRIBUTION: IndustryDistribution[] = [
  { industry: "风能", industryKey: "wind_energy", userCount: 285, candidateCount: 195, companyCount: 52, percentage: 35.7, growthRate: 22.5 },
  { industry: "锂电池", industryKey: "lithium", userCount: 245, candidateCount: 162, companyCount: 45, percentage: 30.7, growthRate: 28.1 },
  { industry: "储能系统", industryKey: "energy_storage", userCount: 128, candidateCount: 82, companyCount: 28, percentage: 16.0, growthRate: 35.4 },
  { industry: "风储协同", industryKey: "wind_storage", userCount: 68, candidateCount: 45, companyCount: 15, percentage: 8.5, growthRate: 45.2 },
  { industry: "BMS/EMS", industryKey: "bms", userCount: 42, candidateCount: 28, companyCount: 10, percentage: 5.3, growthRate: 18.6 },
  { industry: "电力电子", industryKey: "power_electronics", userCount: 30, candidateCount: 22, companyCount: 5, percentage: 3.8, growthRate: 15.0 },
]

// ====================================================================
// 2. 招聘转化漏斗 Mock 数据
// ====================================================================

export const MOCK_RECRUITMENT_FUNNEL: FunnelStage[] = [
  { stage: "search", label: "搜索", count: 12450, rate: 100, cumulativeRate: 100, previousCount: 10800, change: 15.3 },
  { stage: "view", label: "查看候选人", count: 4320, rate: 34.7, cumulativeRate: 34.7, previousCount: 3850, change: 12.2 },
  { stage: "invitation", label: "发送邀请", count: 1520, rate: 35.2, cumulativeRate: 12.2, previousCount: 1280, change: 18.8 },
  { stage: "reply", label: "候选人回复", count: 988, rate: 65.0, cumulativeRate: 7.9, previousCount: 845, change: 16.9 },
  { stage: "interview", label: "安排面试", count: 580, rate: 58.7, cumulativeRate: 4.7, previousCount: 495, change: 17.2 },
  { stage: "assessment", label: "完成评估", count: 395, rate: 68.1, cumulativeRate: 3.2, previousCount: 342, change: 15.5 },
  { stage: "negotiation", label: "进入谈判", count: 185, rate: 46.8, cumulativeRate: 1.5, previousCount: 158, change: 17.1 },
  { stage: "offer", label: "接受Offer", count: 142, rate: 76.8, cumulativeRate: 1.1, previousCount: 118, change: 20.3 },
]

// 漏斗各阶段月度趋势（6个月）
export const MOCK_FUNNEL_TREND_6M: FunnelTrendPoint[] = [
  // December 2025
  { date: "2025-12", stage: "search", count: 1800, rate: 100 },
  { date: "2025-12", stage: "view", count: 620, rate: 34.4 },
  { date: "2025-12", stage: "invitation", count: 210, rate: 33.9 },
  { date: "2025-12", stage: "interview", count: 85, rate: 40.5 },
  { date: "2025-12", stage: "offer", count: 18, rate: 21.2 },
  // January 2026
  { date: "2026-01", stage: "search", count: 2100, rate: 100 },
  { date: "2026-01", stage: "view", count: 720, rate: 34.3 },
  { date: "2026-01", stage: "invitation", count: 250, rate: 34.7 },
  { date: "2026-01", stage: "interview", count: 98, rate: 39.2 },
  { date: "2026-01", stage: "offer", count: 22, rate: 22.4 },
  // February 2026
  { date: "2026-02", stage: "search", count: 1950, rate: 100 },
  { date: "2026-02", stage: "view", count: 680, rate: 34.9 },
  { date: "2026-02", stage: "invitation", count: 235, rate: 34.6 },
  { date: "2026-02", stage: "interview", count: 92, rate: 39.1 },
  { date: "2026-02", stage: "offer", count: 20, rate: 21.7 },
  // March 2026
  { date: "2026-03", stage: "search", count: 2350, rate: 100 },
  { date: "2026-03", stage: "view", count: 820, rate: 34.9 },
  { date: "2026-03", stage: "invitation", count: 285, rate: 34.8 },
  { date: "2026-03", stage: "interview", count: 110, rate: 38.6 },
  { date: "2026-03", stage: "offer", count: 26, rate: 23.6 },
  // April 2026
  { date: "2026-04", stage: "search", count: 2200, rate: 100 },
  { date: "2026-04", stage: "view", count: 760, rate: 34.5 },
  { date: "2026-04", stage: "invitation", count: 270, rate: 35.5 },
  { date: "2026-04", stage: "interview", count: 105, rate: 38.9 },
  { date: "2026-04", stage: "offer", count: 28, rate: 26.7 },
  // May 2026
  { date: "2026-05", stage: "search", count: 2250, rate: 100 },
  { date: "2026-05", stage: "view", count: 780, rate: 34.7 },
  { date: "2026-05", stage: "invitation", count: 270, rate: 34.6 },
  { date: "2026-05", stage: "interview", count: 108, rate: 40.0 },
  { date: "2026-05", stage: "offer", count: 28, rate: 25.9 },
]

// ====================================================================
// 3. 商业收入 Mock 数据 — 12 个月
// ====================================================================

export const MOCK_REVENUE_TREND_12M: RevenueDataPoint[] = [
  { date: "2025-06", subscription: 299900, enterprisePlan: 199900, headhunter: 49900, aiReports: 25000, serviceFees: 80000, apiService: 0, total: 654700 },
  { date: "2025-07", subscription: 349900, enterprisePlan: 249900, headhunter: 49900, aiReports: 32000, serviceFees: 95000, apiService: 0, total: 776700 },
  { date: "2025-08", subscription: 449900, enterprisePlan: 349900, headhunter: 49900, aiReports: 38000, serviceFees: 120000, apiService: 0, total: 1007700 },
  { date: "2025-09", subscription: 549850, enterprisePlan: 449850, headhunter: 49900, aiReports: 45000, serviceFees: 150000, apiService: 0, total: 1244600 },
  { date: "2025-10", subscription: 699800, enterprisePlan: 599800, headhunter: 49900, aiReports: 52000, serviceFees: 180000, apiService: 0, total: 1581500 },
  { date: "2025-11", subscription: 899700, enterprisePlan: 799700, headhunter: 49900, aiReports: 62000, serviceFees: 220000, apiService: 99900, total: 2131200 },
  { date: "2025-12", subscription: 999700, enterprisePlan: 899700, headhunter: 49900, aiReports: 65000, serviceFees: 250000, apiService: 99900, total: 2364200 },
  { date: "2026-01", subscription: 1199700, enterprisePlan: 999700, headhunter: 99900, aiReports: 78000, serviceFees: 320000, apiService: 199900, total: 2897200 },
  { date: "2026-02", subscription: 1299700, enterprisePlan: 1099700, headhunter: 99900, aiReports: 85000, serviceFees: 380000, apiService: 199900, total: 3164200 },
  { date: "2026-03", subscription: 1449600, enterprisePlan: 1249600, headhunter: 99900, aiReports: 96000, serviceFees: 420000, apiService: 199900, total: 3515000 },
  { date: "2026-04", subscription: 1599500, enterprisePlan: 1399500, headhunter: 99900, aiReports: 108000, serviceFees: 480000, apiService: 199900, total: 3886800 },
  { date: "2026-05", subscription: 1749500, enterprisePlan: 1549500, headhunter: 99900, aiReports: 125000, serviceFees: 530000, apiService: 199900, total: 4253800 },
]

// ====================================================================
// 4. 数据质量 Mock 数据
// ====================================================================

export const MOCK_DATA_QUALITY: DataQualityMetrics = {
  periodLabel: "截至 2026-05",
  overview: {
    totalCandidates: 1245,
    verifiedCount: 856,
    verifiedRate: 68.8,
    highCredibilityCount: 680,
    mediumCredibilityCount: 385,
    lowCredibilityCount: 180,
    authorizedCount: 892,
    unauthorizedCount: 353,
    expiredCount: 45,
    avgCompleteness: 82.5,
  },
  credibilityDistribution: [
    { level: "high", label: "高可信度 (≥80分)", count: 680, percentage: 54.6 },
    { level: "medium", label: "中等可信度 (50-79分)", count: 385, percentage: 30.9 },
    { level: "low", label: "低可信度 (<50分)", count: 180, percentage: 14.5 },
  ],
  authorizationStatus: [
    { status: "authorized", label: "已授权", count: 892, percentage: 71.6 },
    { status: "pending", label: "待授权", count: 208, percentage: 16.7 },
    { status: "unauthorized", label: "未授权", count: 100, percentage: 8.0 },
    { status: "expired", label: "已过期", count: 45, percentage: 3.6 },
  ],
  dataSources: [
    { source: "linkedin", label: "LinkedIn", count: 385, trustScore: 78, verifiedRate: 72 },
    { source: "researchgate", label: "ResearchGate", count: 220, trustScore: 85, verifiedRate: 80 },
    { source: "google_scholar", label: "Google Scholar", count: 185, trustScore: 82, verifiedRate: 75 },
    { source: "company_website", label: "企业官网", count: 142, trustScore: 70, verifiedRate: 68 },
    { source: "patent_db", label: "专利数据库", count: 95, trustScore: 90, verifiedRate: 88 },
    { source: "conference", label: "学术会议", count: 88, trustScore: 75, verifiedRate: 65 },
    { source: "github", label: "GitHub", count: 65, trustScore: 65, verifiedRate: 55 },
    { source: "manual_submit", label: "自主注册", count: 55, trustScore: 50, verifiedRate: 45 },
    { source: "third_party", label: "第三方数据商", count: 10, trustScore: 40, verifiedRate: 30 },
  ],
  warnings: [
    {
      id: "warn_001", type: "low_credibility",
      severity: "warning",
      title: "低可信度候选人数据",
      description: "180 名候选人的数据源可信度评分低于 50 分，可能存在信息不准确风险",
      affectedCount: 180,
      suggestedAction: "建议手动验证或要求候选人补充认证材料",
      detectedAt: "2026-05-28T10:00:00Z",
    },
    {
      id: "warn_002", type: "incomplete",
      severity: "warning",
      title: "数据完整度不足",
      description: "218 名候选人缺少核心技术栈、论文或专利等关键信息",
      affectedCount: 218,
      suggestedAction: "发送信息补全通知，引导候选人完善个人资料",
      detectedAt: "2026-05-28T10:00:00Z",
    },
    {
      id: "warn_003", type: "outdated",
      severity: "critical",
      title: "数据过期风险",
      description: "45 名候选人的认证信息超过 12 个月未更新，需提醒更新",
      affectedCount: 45,
      suggestedAction: "自动发送数据更新提醒邮件，逾期未更新则标记为待验证",
      detectedAt: "2026-05-30T08:00:00Z",
    },
    {
      id: "warn_004", type: "unauthorized",
      severity: "warning",
      title: "未授权数据使用风险",
      description: "100 名候选人未签署数据授权协议，其数据可能面临合规风险",
      affectedCount: 100,
      suggestedAction: "暂停向企业展示未授权候选人，发送授权协议签署链接",
      detectedAt: "2026-05-29T14:00:00Z",
    },
    {
      id: "warn_005", type: "duplicate",
      severity: "info",
      title: "疑似重复候选人记录",
      description: "AI 检测到 38 组疑似重复的候选人档案，建议合并",
      affectedCount: 76,
      suggestedAction: "人工审核确认后执行合并操作",
      detectedAt: "2026-05-30T06:00:00Z",
    },
  ],
  expiryAlerts: [
    {
      id: "exp_001", candidateName: "Dr. James Wilson",
      field: "专业认证 (NACE CP)", updatedAt: "2025-03-15", expiresAt: "2026-06-15",
      daysUntilExpiry: 16, severity: "warning",
    },
    {
      id: "exp_002", candidateName: "张小明",
      field: "学历认证", updatedAt: "2024-12-01", expiresAt: "2026-05-31",
      daysUntilExpiry: 1, severity: "critical",
    },
    {
      id: "exp_003", candidateName: "Anna Schneider",
      field: "语言能力认证", updatedAt: "2025-06-01", expiresAt: "2026-06-01",
      daysUntilExpiry: 2, severity: "critical",
    },
    {
      id: "exp_004", candidateName: "Raj Patel",
      field: "工作经历验证", updatedAt: "2025-08-20", expiresAt: "2026-08-20",
      daysUntilExpiry: 82, severity: "info",
    },
    {
      id: "exp_005", candidateName: "Sophie Laurent",
      field: "专利有效性", updatedAt: "2025-10-01", expiresAt: "2026-07-15",
      daysUntilExpiry: 46, severity: "warning",
    },
  ],
}

// ====================================================================
// 5. 总览数据
// ====================================================================

export const MOCK_ANALYTICS_OVERVIEW: AnalyticsOverview = {
  userGrowth: {
    totalUsers: 798,
    newUsersThisMonth: 125,
    activeUsersThisMonth: 195,
    growthRate: 18.6,
  },
  recruitment: {
    totalCandidates: 1245,
    activeJobs: 86,
    offersThisMonth: 28,
    conversionRate: 1.1,
  },
  revenue: {
    monthlyRevenue: 4253800,
    revenueGrowth: 9.4,
    arpu: 5330,
    projectedYearlyRevenue: 48700000,
  },
  dataQuality: {
    verifiedRate: 68.8,
    avgCredibilityScore: 72.5,
    dataFreshness: 91.2,
    warningCount: 5,
  },
}

// ====================================================================
// 6. 根据时间范围获取数据的辅助函数
// ====================================================================

export function getGrowthData(timeRange: TimeRange, _country?: string, _industry?: string): GrowthDataPoint[] {
  const monthsMap: Record<TimeRange, number> = {
    "7d": 1, "30d": 1, "90d": 3, "180d": 6, "365d": 12, "all": 12,
  }
  const months = monthsMap[timeRange]
  return MOCK_GROWTH_TREND_12M.slice(-months)
}

export function getRevenueData(timeRange: TimeRange): RevenueDataPoint[] {
  const monthsMap: Record<TimeRange, number> = {
    "7d": 1, "30d": 1, "90d": 3, "180d": 6, "365d": 12, "all": 12,
  }
  const months = monthsMap[timeRange]
  return MOCK_REVENUE_TREND_12M.slice(-months)
}

export function getFunnelTrend(timeRange: TimeRange): FunnelTrendPoint[] {
  const monthsMap: Record<TimeRange, number> = {
    "7d": 1, "30d": 1, "90d": 2, "180d": 4, "365d": 6, "all": 6,
  }
  const months = monthsMap[timeRange]
  const availableDates = [...new Set(MOCK_FUNNEL_TREND_6M.map(p => p.date))].slice(-months)
  return MOCK_FUNNEL_TREND_6M.filter(p => availableDates.includes(p.date))
}
