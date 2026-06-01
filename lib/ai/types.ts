/**
 * AI 服务抽象层 — 类型定义
 *
 * 设计目标：
 *   1. 所有 AI 功能通过统一接口调用，可无缝切换 Mock / OpenAI / Claude / Gemini
 *   2. 每个 AI 输出都携带 disclaimer 和 safetyNote，满足合规要求
 *   3. 所有函数签名在 mock 和真实 provider 之间保持一致
 *
 * 切换 Provider 示例：
 *   // .env
 *   AI_PROVIDER=mock        // 默认，无需任何 API Key
 *   AI_PROVIDER=openai     // 需要 OPENAI_API_KEY
 *   AI_PROVIDER=claude     // 需要 ANTHROPIC_API_KEY（预留）
 */

// ============================================================
// 通用 AI 返回包装
// ============================================================

/**
 * 所有 AI 输出的统一包装结构
 * model 字段在 mock 模式下为 "mock"，真实 AI 下为具体模型名
 */
export interface AIResult<T> {
  data: T
  generatedAt: string
  /** 必须展示给用户的免责声明 */
  disclaimer: string
  /** 必须展示给用户的合规安全提示 */
  safetyNote: string
  /** 当前使用的模型标识；页面可根据此字段决定是否显示"AI 生成"水印 */
  model: string
}

// ============================================================
// 枚举类型
// ============================================================

export type InvitationStyle = "formal" | "concise" | "international" | "headhunter"
export type QuestionDomain = "general" | "wind" | "lithium" | "management" | "technical"
export type CurrencyCode = "USD" | "EUR" | "CNY" | "SGD" | "JPY" | "KRW"
export type RiskLevel = "low" | "medium" | "high" | "critical"
export type OfferRecommendation = "strong_hire" | "hire" | "consider" | "not_recommend"

// ============================================================
// Module 1 — 人才推荐
// ============================================================

export interface RecommendationCandidate {
  id: string
  name: string
  title: string
  country: string
  matchScore: number        // 0–100
  highlights: string[]
  riskFlags: string[]
  reason: string
}

export interface TalentRecommendation {
  jobTitle: string
  jobId: string
  recommendations: RecommendationCandidate[]
  marketInsight: string
  searchKeywords: string[]
}

// ============================================================
// Module 2 — 邀请文案生成
// ============================================================

export interface InvitationResult {
  subject: string
  body: string
  style: InvitationStyle
  candidateName: string
  jobTitle: string
  companyName: string
}

// ============================================================
// Module 3 — 面试问题生成
// ============================================================

export interface InterviewQuestion {
  id: string
  category: string
  question: string
  expectedFocus: string
  difficulty: "basic" | "intermediate" | "advanced"
  domain: QuestionDomain
}

export interface InterviewQuestionSet {
  jobTitle: string
  candidateName: string
  domain: QuestionDomain
  questions: InterviewQuestion[]
  followUpHints: string[]
}

// ============================================================
// Module 4 — 评估报告生成
// ============================================================

export interface AssessmentDimension {
  name: string
  score: number          // 0–100
  comment: string
  strengths: string[]
  weaknesses: string[]
}

export interface AssessmentReport {
  candidateName: string
  jobTitle: string
  overallScore: number
  dimensions: AssessmentDimension[]
  riskFlags: string[]
  summary: string
  recommendation: OfferRecommendation
  recommendationText: string
}

// ============================================================
// Module 5 — 薪酬建议生成
// ============================================================

export interface SalaryBreakdown {
  baseMin: number
  baseMax: number
  bonusMin: number
  bonusMax: number
  benefitValue?: number
  equityMin?: number
  equityMax?: number
  benefits: string[]
  totalMin: number
  totalMax: number
  currency: CurrencyCode
}

export interface SalarySuggestion {
  jobTitle: string
  country: string
  experienceYears: number
  currency: CurrencyCode
  breakdown: SalaryBreakdown
  marketNote: string
  sourceNote: string
}

// ============================================================
// Module 6 — 风险预警生成
// ============================================================

export interface RiskAlert {
  id: string
  type: string
  level: RiskLevel
  title: string
  description: string
  suggestion: string
  relatedEntityType?: string
  relatedEntityId?: string
}

export interface RiskCheckResult {
  totalRisks: number
  critical: number
  high: number
  medium: number
  low: number
  alerts: RiskAlert[]
}

// ============================================================
// Module 7 — 候选人摘要生成
// ============================================================

export interface CandidateSummary {
  candidateId: string
  candidateName: string
  oneLinePitch: string      // 一句话亮点
  keyStrengths: string[]
  potentialConcerns: string[]
  suggestedRoles: string[]
  recommendedNextAction: string
}

// ============================================================
// Provider 配置类型
// ============================================================

export interface AIProviderConfig {
  provider: "mock" | "openai" | "claude" | "gemini"
  /** 是否启用（关闭时所有 AI 调用返回 fallback） */
  enabled: boolean
  /** 请求超时 ms */
  timeoutMs: number
  /** 失败时是否使用 mock 兜底 */
  fallbackToMock: boolean
}

export interface OpenAIConfig extends AIProviderConfig {
  provider: "openai"
  apiKey: string          // 从环境变量读取，代码中不硬编码
  baseURL?: string        // 支持自定义端点（Azure / 代理）
  model: string
  temperature: number
  maxTokens: number
}

export interface ClaudeConfig extends AIProviderConfig {
  provider: "claude"
  apiKey: string
  baseURL?: string
  model: string
  temperature: number
  maxTokens: number
}

// ============================================================
// 合规常量（所有 Provider 实现都必须附加到输出中）
// ============================================================

export const AI_DISCLAIMER =
  "AI 生成建议，仅供参考。请结合实际情况做出最终判断，不得将 AI 输出作为唯一决策依据。"

export const AI_SAFETY_DISCLAIMER =
  "提示：AI 辅助工具不得基于种族、性别、年龄、宗教、国籍、残疾状况等受保护特征做出招聘决策。所有涉及录用的关键决策必须经过人工确认。"

export const COMPLIANCE_REQUIREMENTS = {
  noProtectedCharacteristics:
    "AI 输出不得包含基于受保护特征的评价、推荐或筛选建议。",
  humanInTheLoop:
    "涉及薪酬 Offer、录用决策的关键步骤必须有人类招聘负责人审核确认。",
  dataPrivacy:
    "AI 处理候选人数据前须确保已获得候选人授权，遵守 GDPR / PIPL 等相关法规。",
  auditLog:
    "所有 AI 辅助决策建议须记录日志，包括输入摘要、输出摘要、操作人、时间戳。",
} as const
