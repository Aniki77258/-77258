// ============================================================
// SaaS 套餐定义 — 6 种订阅计划
// 所有金额为示例数据，不接入真实支付
// ============================================================

import type { PlanDefinition } from "./types"

export const ALL_PLANS: PlanDefinition[] = [
  // ========================================
  // 1. 免费版
  // ========================================
  {
    planKey: "free",
    name: "免费版",
    nameEn: "Free",
    tier: "free",
    targetRole: "company",
    priceMonthly: 0,
    priceYearly: 0,
    currency: "CNY",
    isActive: true,
    sortOrder: 0,
    entitlements: {
      maxSearches: 10,
      maxCandidateViews: 3,
      maxInvitations: 1,
      maxAIReports: 0,
      maxContactUnlocks: 0,
      maxTeamMembers: 1,
      maxJobPosts: 1,
      maxMessages: 10,
      hasAdvancedSearch: false,
      hasApiAccess: false,
      hasDedicatedSupport: false,
      hasCustomReports: false,
      hasPriorityVerify: false,
    },
    description: "适合个人或小团队初步探索全球风能锂电人才市场",
    descriptionEn: "For individuals and small teams exploring the wind & lithium talent market",
    features: [
      "基础人才搜索",
      "每月 10 次搜索",
      "查看 3 位候选人详情",
      "发布 1 个岗位",
      "发送 1 次邀请",
    ],
    featuresEn: [
      "Basic talent search",
      "10 searches/month",
      "View 3 candidate profiles",
      "Post 1 job",
      "Send 1 invitation",
    ],
  },

  // ========================================
  // 2. 企业基础版
  // ========================================
  {
    planKey: "enterprise_basic",
    name: "企业基础版",
    nameEn: "Enterprise Basic",
    tier: "basic",
    targetRole: "company",
    priceMonthly: 299900,      // ¥2,999/月
    priceYearly: 2999000,      // ¥29,990/年（约 ¥2,499/月）
    currency: "CNY",
    isActive: true,
    sortOrder: 1,
    entitlements: {
      maxSearches: 100,
      maxCandidateViews: 50,
      maxInvitations: 20,
      maxAIReports: 10,
      maxContactUnlocks: 10,
      maxTeamMembers: 3,
      maxJobPosts: 5,
      maxMessages: 100,
      hasAdvancedSearch: true,
      hasApiAccess: false,
      hasDedicatedSupport: false,
      hasCustomReports: false,
      hasPriorityVerify: false,
    },
    description: "适合中小型新能源企业，满足日常招聘需求",
    descriptionEn: "For small to medium renewable energy companies with regular hiring needs",
    features: [
      "高级人才搜索（多维度筛选）",
      "每月 100 次搜索",
      "查看 50 位候选人详情",
      "发布 5 个岗位",
      "发送 20 次邀请",
      "10 份 AI 评估报告",
      "10 次联系方式解锁",
      "3 个团队成员席位",
    ],
    featuresEn: [
      "Advanced talent search",
      "100 searches/month",
      "View 50 candidate profiles",
      "Post 5 jobs",
      "Send 20 invitations",
      "10 AI assessment reports",
      "10 contact unlocks",
      "3 team member seats",
    ],
  },

  // ========================================
  // 3. 企业专业版
  // ========================================
  {
    planKey: "enterprise_pro",
    name: "企业专业版",
    nameEn: "Enterprise Pro",
    tier: "pro",
    targetRole: "company",
    priceMonthly: 999900,      // ¥9,999/月
    priceYearly: 9999000,      // ¥99,990/年（约 ¥8,333/月）
    currency: "CNY",
    isActive: true,
    sortOrder: 2,
    highlighted: true,          // 推荐套餐
    entitlements: {
      maxSearches: 500,
      maxCandidateViews: 200,
      maxInvitations: 100,
      maxAIReports: 50,
      maxContactUnlocks: 50,
      maxTeamMembers: 10,
      maxJobPosts: 20,
      maxMessages: 500,
      hasAdvancedSearch: true,
      hasApiAccess: false,
      hasDedicatedSupport: true,
      hasCustomReports: true,
      hasPriorityVerify: true,
    },
    description: "适合快速发展的中型新能源企业，高频招聘与深度评估",
    descriptionEn: "For growing mid-size renewable energy companies with high-frequency hiring needs",
    features: [
      "全部高级功能",
      "每月 500 次搜索",
      "查看 200 位候选人详情",
      "发布 20 个岗位",
      "发送 100 次邀请",
      "50 份 AI 评估报告",
      "50 次联系方式解锁",
      "10 个团队成员席位",
      "专属客户支持",
      "自定义数据报告",
      "优先企业审核",
    ],
    featuresEn: [
      "All advanced features",
      "500 searches/month",
      "View 200 candidate profiles",
      "Post 20 jobs",
      "Send 100 invitations",
      "50 AI assessment reports",
      "50 contact unlocks",
      "10 team member seats",
      "Dedicated support",
      "Custom data reports",
      "Priority verification",
    ],
  },

  // ========================================
  // 4. 企业旗舰版
  // ========================================
  {
    planKey: "enterprise_ultimate",
    name: "企业旗舰版",
    nameEn: "Enterprise Ultimate",
    tier: "ultimate",
    targetRole: "company",
    priceMonthly: 2999900,     // ¥29,999/月
    priceYearly: 29999000,     // ¥299,990/年（约 ¥25,000/月）
    currency: "CNY",
    isActive: true,
    sortOrder: 3,
    entitlements: {
      maxSearches: 9999,       // 无限（用大数表示）
      maxCandidateViews: 9999,
      maxInvitations: 9999,
      maxAIReports: 200,
      maxContactUnlocks: 200,
      maxTeamMembers: 50,
      maxJobPosts: 100,
      maxMessages: 9999,
      hasAdvancedSearch: true,
      hasApiAccess: true,
      hasDedicatedSupport: true,
      hasCustomReports: true,
      hasPriorityVerify: true,
    },
    description: "适合大型跨国能源集团，无限额度、API 数据接入与专属服务",
    descriptionEn: "For large multinational energy groups with unlimited quotas, API access, and dedicated service",
    features: [
      "无限次搜索",
      "无限候选人详情查看",
      "无限邀请发送",
      "发布 100 个岗位",
      "200 份 AI 评估报告",
      "200 次联系方式解锁",
      "50 个团队成员席位",
      "API 数据服务接入",
      "专属客户成功经理",
      "自定义数据报告",
      "优先企业审核",
      "专属培训与 onboarding",
    ],
    featuresEn: [
      "Unlimited searches",
      "Unlimited candidate views",
      "Unlimited invitations",
      "Post 100 jobs",
      "200 AI assessment reports",
      "200 contact unlocks",
      "50 team member seats",
      "API data service access",
      "Dedicated success manager",
      "Custom data reports",
      "Priority verification",
      "Dedicated training & onboarding",
    ],
  },

  // ========================================
  // 5. 猎头会员版
  // ========================================
  {
    planKey: "headhunter",
    name: "猎头会员版",
    nameEn: "Headhunter Pro",
    tier: "headhunter",
    targetRole: "headhunter",
    priceMonthly: 499900,      // ¥4,999/月
    priceYearly: 4999000,      // ¥49,990/年（约 ¥4,166/月）
    currency: "CNY",
    isActive: true,
    sortOrder: 4,
    entitlements: {
      maxSearches: 300,
      maxCandidateViews: 100,
      maxInvitations: 50,
      maxAIReports: 30,
      maxContactUnlocks: 30,
      maxTeamMembers: 1,
      maxJobPosts: 0,          // 猎头不发布岗位
      maxMessages: 200,
      hasAdvancedSearch: true,
      hasApiAccess: false,
      hasDedicatedSupport: false,
      hasCustomReports: false,
      hasPriorityVerify: false,
    },
    description: "适合专业猎头顾问，高效挖掘风能锂电领域高端人才",
    descriptionEn: "For professional headhunters searching top talent in wind & lithium sectors",
    features: [
      "高级人才搜索",
      "每月 300 次搜索",
      "查看 100 位候选人详情",
      "发送 50 次邀请",
      "30 份 AI 评估报告",
      "30 次联系方式解锁",
      "服务费跟踪（20% 年薪）",
    ],
    featuresEn: [
      "Advanced talent search",
      "300 searches/month",
      "View 100 candidate profiles",
      "Send 50 invitations",
      "30 AI assessment reports",
      "30 contact unlocks",
      "Service fee tracking (20% annual)",
    ],
  },

  // ========================================
  // 6. API 数据服务版
  // ========================================
  {
    planKey: "api_data",
    name: "API 数据服务版",
    nameEn: "API Data Service",
    tier: "api",
    targetRole: "company",
    priceMonthly: 1999900,     // ¥19,999/月
    priceYearly: 19999000,     // ¥199,990/年（约 ¥16,666/月）
    currency: "CNY",
    isActive: true,
    sortOrder: 5,
    entitlements: {
      maxSearches: 9999,
      maxCandidateViews: 9999,
      maxInvitations: 0,       // API 版不做邀请
      maxAIReports: 0,
      maxContactUnlocks: 0,
      maxTeamMembers: 5,
      maxJobPosts: 0,
      maxMessages: 100,
      hasAdvancedSearch: true,
      hasApiAccess: true,
      hasDedicatedSupport: true,
      hasCustomReports: true,
      hasPriorityVerify: false,
    },
    description: "适合需要将人才数据集成到自有系统的企业，支持 REST API 全量调用",
    descriptionEn: "For enterprises needing to integrate talent data into their own systems via REST API",
    features: [
      "完整 REST API 访问",
      "无限 API 调用次数",
      "人才数据实时同步",
      "自定义数据导出",
      "5 个 API Key 管理席位",
      "专线技术支持",
      "SLA 99.9%",
    ],
    featuresEn: [
      "Full REST API access",
      "Unlimited API calls",
      "Real-time data sync",
      "Custom data export",
      "5 API key management seats",
      "Dedicated technical support",
      "SLA 99.9%",
    ],
  },
]

// ---- 获取单个套餐 ----
export function getPlan(key: string): PlanDefinition | undefined {
  return ALL_PLANS.find(p => p.planKey === key)
}

// ---- 按角色获取套餐 ----
export function getPlansByRole(role: string): PlanDefinition[] {
  switch (role) {
    case "headhunter":
      return ALL_PLANS.filter(p => p.targetRole === "headhunter" || p.planKey === "free")
    default:
      return ALL_PLANS.filter(p => p.targetRole === "company" || p.planKey === "free")
  }
}
