/**
 * OpenAI Provider — 仅预留结构，不写真实 API 调用
 *
 * 设计说明：
 *   1. 此文件仅定义 OpenAI Provider 的结构和接口，不发起真实 API 请求
 *   2. API Key 必须从环境变量读取，代码中不硬编码任何密钥
 *   3. 所有函数签名与 mockProvider.ts 完全一致
 *   4. 当前所有函数均抛出"未实现"错误，强制使用 Mock 兜底
 *   5. 未来启用时，取消对应函数的注释并实现即可
 *
 * 启用步骤（未来）：
 *   a. 在 .env 中设置 AI_PROVIDER=openai
 *   b. 在 .env 中填写 OPENAI_API_KEY=sk-...
 *   c. 取消下方对应函数的注释，填入真实 API 调用逻辑
 *   d. 真实调用失败时自动 fallback 到 mockProvider（由 provider.ts 控制）
 *
 * 安全规范：
 *   - 禁止在代码中硬编码 API Key / Secret
 *   - 禁止将 API Key 写入日志、错误信息或前端代码
 *   - 所有 API 调用失败时必须 fallback，不得导致页面崩溃
 */

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
  OpenAIConfig,
} from "./types"

import {
  AI_DISCLAIMER,
  AI_SAFETY_DISCLAIMER,
} from "./types"

// ============================================================
// 配置读取（仅从环境变量，不硬编码）
// ============================================================

function getConfig(): OpenAIConfig | null {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey === "sk-PLACEHOLDER" || apiKey === "") {
    return null // 无有效 Key，调用方会 fallback 到 mock
  }
  return {
    provider: "openai",
    enabled: true,
    timeoutMs: 15000,
    fallbackToMock: true,
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
    model: process.env.OPENAI_MODEL_NAME || "gpt-4o-mini",
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || "0.3"),
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || "2048", 10),
  }
}

// ============================================================
// 通用：将 types.ts 中的 PromptTemplate 转换为 OpenAI 消息格式
// ============================================================
// （预留，未来实现真实调用时使用）

/*
import OpenAI from "openai" // 未来取消注释

async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  config: OpenAIConfig
): Promise<string> {
  const client = new OpenAI({
    apiKey: config.apiKey,
    baseURL: config.baseURL,
    timeout: config.timeoutMs,
  })

  const response = await client.chat.completions.create({
    model: config.model,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    response_format: { type: "json_object" }, // 要求 JSON 输出
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  })

  return response.choices[0]?.message?.content || "{}"
}

async function safeJsonParse<T>(raw: string): Promise<T> {
  try {
    return JSON.parse(raw) as T
  } catch {
    // 如果 AI 返回的不是合法 JSON，尝试提取 ```json ... ``` 块
    const match = raw.match(/```json\s*([\s\S]*?)\s*```/)
    if (match) return JSON.parse(match[1]) as T
    throw new Error("AI 返回内容无法解析为 JSON")
  }
}
*/

// ============================================================
// Module 1: 人才推荐（预留，当前抛出"未实现"）
// ============================================================

export async function recommendCandidates(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  requirements: string[],
  jobId: string
): Promise<AIResult<TalentRecommendation>> {
  // eslint-disable-next-line no-console
  console.warn(
    "[OpenAI Provider] recommendCandidates: 真实 AI 调用尚未启用，请确认 OPENAI_API_KEY 已配置。"
  )
  throw new Error("OPENAI_PROVIDER_NOT_IMPLEMENTED")
}

// ============================================================
// Module 2: 邀请文案生成（预留）
// ============================================================

export async function generateInvitation(
  candidateName: string,
  candidateTitle: string,
  jobTitle: string,
  companyName: string,
  style: InvitationStyle
): Promise<AIResult<InvitationResult>> {
  console.warn(
    "[OpenAI Provider] generateInvitation: 真实 AI 调用尚未启用，请确认 OPENAI_API_KEY 已配置。"
  )
  throw new Error("OPENAI_PROVIDER_NOT_IMPLEMENTED")
}

// ============================================================
// Module 3: 面试问题生成（预留）
// ============================================================

export async function generateInterviewQuestions(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  candidateName: string,
  domain: QuestionDomain
): Promise<AIResult<InterviewQuestionSet>> {
  console.warn(
    "[OpenAI Provider] generateInterviewQuestions: 真实 AI 调用尚未启用。"
  )
  throw new Error("OPENAI_PROVIDER_NOT_IMPLEMENTED")
}

// ============================================================
// Module 4: 评估报告生成（预留）
// ============================================================

export async function generateAssessment(
  candidateName: string,
  candidateTitle: string,
  jobTitle: string,
  industry: "wind" | "lithium" | "both"
): Promise<AIResult<AssessmentReport>> {
  console.warn(
    "[OpenAI Provider] generateAssessment: 真实 AI 调用尚未启用。"
  )
  throw new Error("OPENAI_PROVIDER_NOT_IMPLEMENTED")
}

// ============================================================
// Module 5: 薪酬建议生成（预留）
// ============================================================

export async function suggestSalary(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  country: string,
  experienceYears: number,
  currency?: CurrencyCode
): Promise<AIResult<SalarySuggestion>> {
  console.warn(
    "[OpenAI Provider] suggestSalary: 真实 AI 调用尚未启用。"
  )
  throw new Error("OPENAI_PROVIDER_NOT_IMPLEMENTED")
}

// ============================================================
// Module 6: 风险预警生成（预留）
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
  console.warn(
    "[OpenAI Provider] checkRisks: 真实 AI 调用尚未启用。"
  )
  throw new Error("OPENAI_PROVIDER_NOT_IMPLEMENTED")
}

// ============================================================
// Module 7: 候选人摘要生成（预留）
// ============================================================

export async function generateCandidateSummary(
  candidateId: string,
  candidateName: string,
  candidateTitle: string,
  candidateCountry: string,
  experienceYears: number,
  profileText: string
): Promise<AIResult<CandidateSummary>> {
  console.warn(
    "[OpenAI Provider] generateCandidateSummary: 真实 AI 调用尚未启用。"
  )
  throw new Error("OPENAI_PROVIDER_NOT_IMPLEMENTED")
}

// ============================================================
// 导出（与 mockProvider 完全相同的导出名，确保 provider.ts 可无缝切换）
// ============================================================

export {
  getConfig as getOpenAIConfig,
}
