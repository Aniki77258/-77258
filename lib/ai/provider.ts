/**
 * AI Provider 统一抽象层
 *
 * 核心职责：
 *   1. 根据环境变量 AI_PROVIDER 选择底层实现（mock / openai / claude）
 *   2. 所有 AI 功能通过此文件统一导出，业务代码只 import 此文件
 *   3. 真实 API 调用失败时自动 fallback 到 mock，保证页面不崩溃
 *   4. 所有输出都注入 disclaimer 和 safetyNote，满足合规要求
 *
 * 环境变量（在 .env / .env.example 中配置）：
 *   AI_PROVIDER        = mock | openai | claude  （默认 mock）
 *   OPENAI_API_KEY     OpenAI API Key（仅 AI_PROVIDER=openai 时需要）
 *   OPENAI_BASE_URL   自定义 OpenAI 兼容端点（可选，支持 Azure / 代理）
 *   OPENAI_MODEL_NAME 使用的模型名（默认 gpt-4o-mini）
 *   OPENAI_TEMPERATURE 生成温度 0-2（默认 0.3）
 *   OPENAI_MAX_TOKENS 最大输出 token（默认 2048）
 *   AI_TIMEOUT_MS      AI 请求超时毫秒（默认 15000）
 *   AI_FALLBACK_MOCK  true/false 失败时是否 fallback 到 mock（默认 true）
 *
 * 未来扩展 Claude / Gemini：
 *   - 创建 lib/ai/claudeProvider.ts，导出同名函数
 *   - 在下方 SWITCH 分支中增加 "claude" 分支
 *   - 无需修改任何业务页面代码
 *
 * 重要：代码中不含任何真实 API Key，所有密钥仅从环境变量读取。
 */

// ===========================================================
// 导入类型（本地使用）
// ===========================================================

import type {
  AIResult,
  TalentRecommendation,
  InvitationResult,
  InvitationStyle,
  InterviewQuestionSet,
  QuestionDomain,
  AssessmentReport,
  SalarySuggestion,
  RiskCheckResult,
  CandidateSummary,
  CurrencyCode,
} from "./types"

// ===========================================================
// 重新导出类型（供 API 路由和页面使用）
// ===========================================================

export type {
  AIResult,
  RecommendationCandidate,
  TalentRecommendation,
  InvitationResult,
  InvitationStyle,
  InterviewQuestionSet,
  QuestionDomain,
  AssessmentReport,
  SalarySuggestion,
  SalaryBreakdown,
  RiskCheckResult,
  RiskAlert,
  RiskLevel,
  CandidateSummary,
  CurrencyCode,
  OfferRecommendation,
  AIProviderConfig,
  OpenAIConfig,
  ClaudeConfig,
} from "./types"

// ===========================================================
// 导入 mockProvider（始终可用，作为 fallback）
// ===========================================================

import {
  recommendCandidates as mockRecommend,
  generateInvitation as mockInvite,
  generateInterviewQuestions as mockQuestions,
  generateAssessment as mockAssess,
  suggestSalary as mockSalary,
  checkRisks as mockRisk,
  generateCandidateSummary as mockSummary,
  simulateThinkTime as mockThinkTime,
} from "./mockProvider"

// ===========================================================
// 导入 openaiProvider（仅当 AI_PROVIDER=openai 时尝试使用）
// ===========================================================

import {
  recommendCandidates as openaiRecommend,
  generateInvitation as openaiInvite,
  generateInterviewQuestions as openaiQuestions,
  generateAssessment as openaiAssess,
  suggestSalary as openaiSalary,
  checkRisks as openaiRisk,
  generateCandidateSummary as openaiSummary,
} from "./openaiProvider"

// ===========================================================
// Provider 选择逻辑
// ===========================================================

type AIFunction<T, A extends any[]> = (...args: A) => Promise<AIResult<T>>

const AI_PROVIDER = (process.env.AI_PROVIDER || "mock").toLowerCase().trim()
const AI_FALLBACK_MOCK = process.env.AI_FALLBACK_MOCK !== "false" // 默认 true

/**
 * 包装器：尝试用真实 AI 调用，失败时 fallback 到 mock
 * 这样即使真实 API 配置错误 / 超时 / 配额用尽，页面也不会崩溃
 */
async function withFallback<T, A extends any[]>(
  realFn: AIFunction<T, A> | undefined,
  mockFn: AIFunction<T, A>,
  fnName: string,
  ...args: A
): Promise<AIResult<T>> {
  // 如果 provider 不是 mock，尝试调用真实 AI
  if (AI_PROVIDER !== "mock" && realFn) {
    try {
      return await realFn(...args)
    } catch (err: any) {
      const msg = `[AI Provider] ${fnName} 真实 AI 调用失败（${err?.message || "未知错误"}）。`
      if (AI_FALLBACK_MOCK) {
        console.warn(msg + " 已自动 fallback 到 Mock 数据。")
        return mockFn(...args)
      }
      console.error(msg + " 且 AI_FALLBACK_MOCK=false，无法返回数据。")
      throw err
    }
  }
  // mock 模式或 realFn 未定义时，直接使用 mock
  return mockFn(...args)
}

// ===========================================================
// 统一导出：业务代码只 import 这些函数
// ===========================================================
// 函数签名与 mockProvider / openaiProvider 完全一致

export async function recommendCandidates(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  requirements: string[],
  jobId: string
): Promise<AIResult<TalentRecommendation>> {
  return withFallback(
    AI_PROVIDER === "openai" ? openaiRecommend : undefined,
    mockRecommend,
    "recommendCandidates",
    jobTitle,
    industry,
    requirements,
    jobId
  )
}

export async function generateInvitation(
  candidateName: string,
  candidateTitle: string,
  jobTitle: string,
  companyName: string,
  style: InvitationStyle = "formal"
): Promise<AIResult<InvitationResult>> {
  return withFallback(
    AI_PROVIDER === "openai" ? openaiInvite : undefined,
    mockInvite,
    "generateInvitation",
    candidateName,
    candidateTitle,
    jobTitle,
    companyName,
    style
  )
}

export async function generateInterviewQuestions(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  candidateName: string,
  domain: QuestionDomain = "general"
): Promise<AIResult<InterviewQuestionSet>> {
  return withFallback(
    AI_PROVIDER === "openai" ? openaiQuestions : undefined,
    mockQuestions,
    "generateInterviewQuestions",
    jobTitle,
    industry,
    candidateName,
    domain
  )
}

export async function generateAssessment(
  candidateName: string,
  candidateTitle: string,
  jobTitle: string,
  industry: "wind" | "lithium" | "both"
): Promise<AIResult<AssessmentReport>> {
  return withFallback(
    AI_PROVIDER === "openai" ? openaiAssess : undefined,
    mockAssess,
    "generateAssessment",
    candidateName,
    candidateTitle,
    jobTitle,
    industry
  )
}

export async function suggestSalary(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  country: string,
  experienceYears: number,
  currency?: CurrencyCode
): Promise<AIResult<SalarySuggestion>> {
  return withFallback(
    AI_PROVIDER === "openai" ? openaiSalary : undefined,
    mockSalary,
    "suggestSalary",
    jobTitle,
    industry,
    country,
    experienceYears,
    currency
  )
}

export async function checkRisks(context: {
  candidateCountry?: string
  candidateActivity?: "low" | "medium" | "high"
  interviewDaysSinceRequest?: number
  offerDaysSinceSent?: number
  alreadyInvited?: boolean
  dataTrustLevel?: number
  authorizationStatus?: string
}): Promise<AIResult<RiskCheckResult>> {
  return withFallback(
    AI_PROVIDER === "openai" ? openaiRisk : undefined,
    mockRisk,
    "checkRisks",
    context
  )
}

export async function generateCandidateSummary(
  candidateId: string,
  candidateName: string,
  candidateTitle: string,
  candidateCountry: string,
  experienceYears: number,
  profileText: string
): Promise<AIResult<CandidateSummary>> {
  return withFallback(
    AI_PROVIDER === "openai" ? openaiSummary : undefined,
    mockSummary,
    "generateCandidateSummary",
    candidateId,
    candidateName,
    candidateTitle,
    candidateCountry,
    experienceYears,
    profileText
  )
}

/** 模拟思考延迟（mock 模式下使用，真实 AI 自带延迟） */
export async function simulateThinkTime(): Promise<void> {
  if (AI_PROVIDER === "mock") {
    return mockThinkTime()
  }
  // 真实 AI 模式下，不额外添加延迟（AI 调用本身已有网络延迟）
  return Promise.resolve()
}

// ===========================================================
// 当前 Provider 信息（供"关于"页面 / 设置页面显示）
// ===========================================================

export function getAIProviderInfo(): {
  provider: string
  model: string
  isMock: boolean
  fallbackEnabled: boolean
} {
  const isMock = AI_PROVIDER === "mock"
  let modelName = "mock"
  if (!isMock) {
    modelName = process.env.OPENAI_MODEL_NAME || "gpt-4o-mini"
  }
  return {
    provider: AI_PROVIDER,
    model: modelName,
    isMock,
    fallbackEnabled: AI_FALLBACK_MOCK,
  }
}
