/**
 * AI Mock Provider — 最小化实现
 *
 * 所有演示/Mock 数据已从代码中清除。
 * 此文件仅保留函数签名和基本骨架，方便将来配置真实 AI 时作为参考。
 *
 * 重要：所有函数返回空数据 + 明确提示需配置真实 AI Provider。
 */
import type {
  AIResult,
  RecommendationCandidate,
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

import {
  AI_DISCLAIMER,
  AI_SAFETY_DISCLAIMER,
} from "./types"

// ============================================================
// 通用工具
// ============================================================

function wrapAI<T>(data: T): AIResult<T> {
  return {
    data,
    generatedAt: new Date().toISOString(),
    disclaimer: AI_DISCLAIMER,
    safetyNote: AI_SAFETY_DISCLAIMER,
    model: "mock",
  }
}

export function simulateThinkTime(): Promise<void> {
  return Promise.resolve()
}

// ============================================================
// Module 1: 人才推荐
// ============================================================

export async function recommendCandidates(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  requirements: string[],
  jobId: string
): Promise<AIResult<TalentRecommendation>> {
  return wrapAI({
    jobTitle,
    jobId,
    recommendations: [],
    marketInsight: "AI 推荐引擎未配置。请设置 AI_PROVIDER=openai 并配置 API Key 以启用智能人才推荐。",
    searchKeywords: [],
  })
}

// ============================================================
// Module 2: 邀请文案生成
// ============================================================

export async function generateInvitation(
  candidateName: string,
  candidateTitle: string,
  jobTitle: string,
  companyName: string,
  style: InvitationStyle = "formal"
): Promise<AIResult<InvitationResult>> {
  return wrapAI({
    subject: `${companyName} | ${jobTitle}`,
    body: "AI 邀请文案生成未配置。请配置真实 AI Provider 以自动生成个性化邀请文案。",
    style,
    candidateName,
    jobTitle,
    companyName,
  })
}

// ============================================================
// Module 3: 面试问题生成
// ============================================================

export async function generateInterviewQuestions(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  candidateName: string,
  domain: QuestionDomain = "general"
): Promise<AIResult<InterviewQuestionSet>> {
  return wrapAI({
    jobTitle,
    candidateName,
    domain,
    questions: [
      {
        id: "q_placeholder",
        category: "提示",
        question: "AI 面试问题生成未配置。请设置 AI_PROVIDER 环境变量以启用智能面试问题生成。",
        expectedFocus: "需配置真实 AI Provider",
        difficulty: "basic",
        domain: "general",
      },
    ],
    followUpHints: [],
  })
}

// ============================================================
// Module 4: 评估报告生成
// ============================================================

export async function generateAssessment(
  candidateName: string,
  candidateTitle: string,
  jobTitle: string,
  industry: "wind" | "lithium" | "both"
): Promise<AIResult<AssessmentReport>> {
  return wrapAI({
    candidateName,
    jobTitle,
    overallScore: 0,
    dimensions: [],
    riskFlags: [],
    summary: `AI 评估报告未配置。请配置真实 AI Provider 以自动生成 ${candidateName}（${candidateTitle}）的专业评估报告。`,
    recommendation: "consider",
    recommendationText: "AI 评估服务未启用，无法生成推荐意见。",
  })
}

// ============================================================
// Module 5: 薪酬建议生成
// ============================================================

export async function suggestSalary(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  country: string,
  experienceYears: number,
  currency?: CurrencyCode
): Promise<AIResult<SalarySuggestion>> {
  return wrapAI({
    jobTitle,
    country,
    experienceYears,
    currency: currency || "CNY",
    breakdown: {
      baseMin: 0,
      baseMax: 0,
      bonusMin: 0,
      bonusMax: 0,
      equityMin: 0,
      equityMax: 0,
      benefits: [],
      totalMin: 0,
      totalMax: 0,
      currency: currency || "CNY",
    },
    marketNote: "AI 薪酬建议未配置。请配置真实 AI Provider 以获取基于市场数据的薪酬建议。",
    sourceNote: "AI 服务未启用。",
  })
}

// ============================================================
// Module 6: 风险预警生成
// ============================================================

export async function checkRisks(context: {
  candidateCountry?: string
  candidateActivity?: "low" | "medium" | "high"
  interviewDaysSinceRequest?: number
  offerDaysSinceSent?: number
  alreadyInvited?: boolean
  dataTrustLevel?: number
  authorizationStatus?: string
}): Promise<AIResult<RiskCheckResult>> {
  return wrapAI({
    totalRisks: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    alerts: [],
  })
}

// ============================================================
// Module 7: 候选人摘要生成
// ============================================================

export async function generateCandidateSummary(
  candidateId: string,
  candidateName: string,
  candidateTitle: string,
  candidateCountry: string,
  experienceYears: number,
  profileText: string
): Promise<AIResult<CandidateSummary>> {
  return wrapAI({
    candidateId,
    candidateName,
    oneLinePitch: `${candidateName}（${candidateTitle}）`,
    keyStrengths: [],
    potentialConcerns: [],
    suggestedRoles: [],
    recommendedNextAction: "AI 摘要生成未配置。请配置真实 AI Provider 以自动生成候选人智能摘要。",
  })
}
