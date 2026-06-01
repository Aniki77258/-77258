/**
 * AI Mock Provider — 使用本地人才数据库 + 模板化输出
 *
 * 使用 talentDatabase.ts 中 20 位真实风能/锂电人才数据进行搜索匹配。
 * 其他 AI 功能（邀请/面试/评估/薪酬/风险/摘要）使用规则引擎生成可用输出。
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
  AssessmentDimension,
  SalarySuggestion,
  RiskCheckResult,
  RiskAlert,
  CandidateSummary,
  CurrencyCode,
} from "./types"

import {
  AI_DISCLAIMER,
  AI_SAFETY_DISCLAIMER,
} from "./types"

import { searchTalent, TALENT_DATABASE } from "./talentDatabase"

// ============================================================
// 通用工具
// ============================================================

function wrapAI<T>(data: T): AIResult<T> {
  return {
    data,
    generatedAt: new Date().toISOString(),
    disclaimer: AI_DISCLAIMER,
    safetyNote: AI_SAFETY_DISCLAIMER,
    model: "mock+v2",
  }
}

export function simulateThinkTime(): Promise<void> {
  return new Promise(r => setTimeout(r, 300 + Math.random() * 500))
}

// ============================================================
// Module 1: 人才推荐 — 核心搜索功能 ⭐
// ============================================================

export async function recommendCandidates(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  requirements: string[],
  jobId: string
): Promise<AIResult<TalentRecommendation>> {
  await simulateThinkTime()

  // 构建搜索查询：职位 + 所有需求关键词
  const queryParts = [jobTitle, ...requirements]
  const query = queryParts.filter(Boolean).join(" ")

  // 搜索人才库
  const profiles = searchTalent(query, industry)

  // 转换为 RecommendationCandidate 格式
  const recommendations: RecommendationCandidate[] = profiles.map((p, i) => ({
    id: p.id,
    name: p.name,
    title: p.title,
    country: p.country,
    matchScore: Math.min(98 - i * 3, 95), // 递减打分
    highlights: p.highlights.slice(0, 3),
    riskFlags: p.riskFlags,
    reason: `${p.experienceYears}年经验 · ${p.company} · ${p.skills.slice(0, 3).join(" / ")}`,
  }))

  // 市场洞察
  const industryText = industry === "wind" ? "风能" : industry === "lithium" ? "锂电" : "风能/锂电"
  const marketInsight = recommendations.length > 0
    ? `在${industryText}人才库中共匹配到 ${recommendations.length} 位候选人。其中海外人才 ${profiles.filter(p => p.country !== "中国").length} 位，博士 ${profiles.filter(p => p.education.includes("博士")).length} 位。建议优先联系匹配度 >85 的候选人进行初步沟通。`
    : `当前${industryText}人才库中未找到完全匹配的候选人。建议尝试更宽泛的关键词或跨行业搜索。`

  // 提取搜索关键词用于 UI 展示
  const searchKeywords = [...new Set(
    queryParts.filter(Boolean).flatMap(q =>
      q.split(/[\s,，+]+/).filter(k => k.length > 0)
    )
  )]

  return wrapAI({
    jobTitle,
    jobId,
    recommendations,
    marketInsight,
    searchKeywords,
  })
}

// ============================================================
// Module 2: 邀请文案生成 — 模板引擎
// ============================================================

const INVITATION_TEMPLATES: Record<InvitationStyle, (name: string, title: string, job: string, company: string) => string> = {
  formal: (name, _title, job, company) =>
    `尊敬的 ${name}：\n\n您好！\n\n我们是 ${company} 的人才招聘团队。我们正在寻找 ${job} 方向的顶尖人才，您在行业内的专业背景引起了我们的高度关注。\n\n我们非常希望能与您深入交流，探讨合作可能性。如果您方便，我们可以安排一次电话或视频沟通。\n\n期待您的回复。\n\n此致\n敬礼\n${company} 招聘团队`,
  
  concise: (name, title, job, company) =>
    `${name}，您好！\n\n${company} 正在招募 ${job}。注意到您在 ${title} 方向的专业背景，诚邀您聊聊。\n\n期待您的回复！\n\n${company} HR`,

  international: (name, _title, job, company) =>
    `Dear ${name},\n\nGreetings from ${company}!\n\nWe are currently expanding our ${job} team and your expertise has come to our attention through industry networks.\n\nWe would love to schedule a brief call to explore potential opportunities together. Please let us know your availability.\n\nBest regards,\n${company} Talent Acquisition`,

  headhunter: (name, title, job, company) =>
    `${name}：\n\n我代表 ${company} 与您取得联系。我们正在寻找 ${job} 领域的关键人才，您在 ${title} 方面的履历非常亮眼。\n\n这个职位有很强的战略意义，薪酬包和市场定位都是一流的。如果您有兴趣了解更多，我们可以在严格保密的前提下沟通。\n\n期待您的回音。\n\n${company} 人才引进`,
}

export async function generateInvitation(
  candidateName: string,
  candidateTitle: string,
  jobTitle: string,
  companyName: string,
  style: InvitationStyle = "formal"
): Promise<AIResult<InvitationResult>> {
  await simulateThinkTime()

  const template = INVITATION_TEMPLATES[style] || INVITATION_TEMPLATES.formal
  const body = template(candidateName, candidateTitle, jobTitle, companyName)

  return wrapAI({
    subject: `[${companyName}] ${jobTitle} — 诚邀交流`,
    body,
    style,
    candidateName,
    jobTitle,
    companyName,
  })
}

// ============================================================
// Module 3: 面试问题生成 — 领域题库
// ============================================================

const INTERVIEW_QUESTION_BANK: Record<string, { question: string; focus: string; difficulty: "basic" | "intermediate" | "advanced" }[]> = {
  wind: [
    { question: "请描述风机叶片气动设计的主要优化目标以及 CFD 仿真在其中的作用。", focus: "叶片气动设计认知", difficulty: "intermediate" },
    { question: "海上风电基础结构中，单桩与导管架分别适用于什么水深和地质条件？", focus: "基础选型", difficulty: "intermediate" },
    { question: "风机控制系统如何通过独立变桨来降低极限载荷？请从控制策略角度解释。", focus: "控制策略深解", difficulty: "advanced" },
    { question: "风电场微观选址中，尾流模型的选择如何影响能源产量评估？", focus: "微观选址", difficulty: "intermediate" },
    { question: "请解释疲劳分析中 S-N 曲线的应用以及风电结构设计中的安全系数选取原则。", focus: "疲劳分析", difficulty: "advanced" },
  ],
  lithium: [
    { question: "固态电池中硫化物电解质与氧化物电解质的优劣比较是什么？", focus: "固态电池材料", difficulty: "intermediate" },
    { question: "BMS 中 SOC 估算的常用算法有哪些？各自的误差来源是什么？", focus: "BMS SOC算法", difficulty: "intermediate" },
    { question: "电池 Pack 热管理中，液冷与风冷的适用场景和设计要点？", focus: "热管理设计", difficulty: "intermediate" },
    { question: "锂金属负极的枝晶生长机理及当前主流抑制策略？", focus: "锂金属负极", difficulty: "advanced" },
    { question: "储能系统并网需要满足哪些关键技术指标（以中国标准为例）？", focus: "储能并网标准", difficulty: "basic" },
  ],
  management: [
    { question: "请分享一次你带领技术团队解决重大技术难题的经历和你的管理方式。", focus: "领导力与协调", difficulty: "intermediate" },
    { question: "面对紧张的研发周期和有限的资源，你如何做优先级决策？", focus: "资源管理", difficulty: "intermediate" },
  ],
  general: [
    { question: "请简要介绍你的专业背景和核心研究方向。", focus: "个人定位", difficulty: "basic" },
    { question: "你对我们公司目前的技术方向有什么了解？", focus: "行业认知", difficulty: "basic" },
  ],
}

export async function generateInterviewQuestions(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  candidateName: string,
  domain: QuestionDomain = "general"
): Promise<AIResult<InterviewQuestionSet>> {
  await simulateThinkTime()

  const bankKeys = domain === "general"
    ? ["general"]
    : domain === "wind"
      ? ["wind"]
      : domain === "lithium"
        ? ["lithium"]
        : ["general", "management"]
  
  const questions = bankKeys.flatMap((key, idx) =>
    (INTERVIEW_QUESTION_BANK[key] || INTERVIEW_QUESTION_BANK.general).map((q, qi) => ({
      id: `q_${key}_${qi}`,
      category: key === "wind" ? "风能技术" : key === "lithium" ? "锂电技术" : key === "management" ? "管理能力" : "通用",
      question: q.question,
      expectedFocus: q.focus,
      difficulty: q.difficulty,
      domain: key as QuestionDomain,
    }))
  ).slice(0, 8)

  return wrapAI({
    jobTitle,
    candidateName,
    domain,
    questions,
    followUpHints: [
      "请候选人针对回答提供具体案例而非理论阐述",
      "关注候选人对行业标准的理解深度",
      "追问技术方案中的 trade-off 决策过程",
    ],
  })
}

// ============================================================
// Module 4: 评估报告 — 规则引擎
// ============================================================

export async function generateAssessment(
  candidateName: string,
  candidateTitle: string,
  jobTitle: string,
  industry: "wind" | "lithium" | "both"
): Promise<AIResult<AssessmentReport>> {
  await simulateThinkTime()

  // 从人才库查找匹配
  const profile = TALENT_DATABASE.find(p => p.name === candidateName)
  const expYears = profile?.experienceYears || 8

  const technicalScore = Math.min(60 + expYears * 2.5, 95)
  const industryScore = Math.min(55 + expYears * 2, 92)
  const communicationScore = profile?.languages.length
    ? Math.min(65 + profile.languages.length * 10, 95)
    : 70

  const dimensions: AssessmentDimension[] = [
    {
      name: "技术能力",
      score: Math.round(technicalScore),
      comment: `${expYears}年行业经验，在 ${candidateTitle} 方向积累了扎实的技术功底。`,
      strengths: profile?.highlights?.slice(0, 2) || ["丰富行业经验"],
      weaknesses: [],
    },
    {
      name: "行业匹配度",
      score: Math.round(industryScore),
      comment: `与 ${jobTitle} 岗位高度相关，行业背景吻合度良好。`,
      strengths: [`${profile?.company || "知名企业"} 工作经历`],
      weaknesses: [],
    },
    {
      name: "沟通与协作",
      score: Math.round(communicationScore),
      comment: `语言能力：${profile?.languages.join(" / ") || "未获取"}`,
      strengths: [],
      weaknesses: (profile?.languages.length || 0) <= 1 ? ["建议评估英语沟通能力"] : [],
    },
    {
      name: "发展潜力",
      score: 78,
      comment: "论文和专利产出表明该候选人有较强的科研创新能力。",
      strengths: [`${profile?.publications || 0} 篇论文，${profile?.patents || 0} 项专利`],
      weaknesses: [],
    },
  ]

  const overallScore = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length)
  const riskFlags = profile?.riskFlags || []

  return wrapAI({
    candidateName,
    jobTitle,
    overallScore,
    dimensions,
    riskFlags,
    summary: `${candidateName}（${candidateTitle}）综合评分为 ${overallScore} 分，技术能力和行业匹配度表现突出。${riskFlags.length > 0 ? `需要注意的是：${riskFlags.join("；")}` : "暂无显著风险信号。"}`,
    recommendation: overallScore >= 80 ? "hire" : "consider",
    recommendationText: overallScore >= 80
      ? "推荐进入下一轮面试，建议重点关注技术方案深度和团队协作能力。"
      : "建议安排初步沟通后决定是否进入正式面试流程。",
  })
}

// ============================================================
// Module 5: 薪酬建议 — 行业基准数据
// ============================================================

const SALARY_BENCHMARK: Record<string, { baseRange: [number, number]; bonusPct: number; benefits: string[] }> = {
  "中国": { baseRange: [350000, 850000], bonusPct: 20, benefits: ["五险一金", "年终奖金", "股权激励（视级别）", "住房补贴"] },
  "德国": { baseRange: [80000, 150000], bonusPct: 15, benefits: ["30天年假", "医疗保险", "养老金计划", "公司配车/交通补贴"] },
  "丹麦": { baseRange: [750000, 1200000], bonusPct: 12, benefits: ["6周带薪年假", "全民医保", "养老金", "灵活工作制"] },
  "韩国": { baseRange: [80000000, 150000000], bonusPct: 25, benefits: ["四大保险", "退职金", "股权", "住房贷款支持"] },
  "日本": { baseRange: [8000000, 15000000], bonusPct: 20, benefits: ["社会保険", "退職金", "住宅手当", "通勤手当"] },
  "瑞典": { baseRange: [700000, 1100000], bonusPct: 10, benefits: ["5周假期", "父母假", "养老金", "健身补贴"] },
  "美国": { baseRange: [120000, 220000], bonusPct: 20, benefits: ["401k", "健康保险", "股权", "远程办公"] },
  "英国": { baseRange: [70000, 130000], bonusPct: 15, benefits: ["NHS", "养老金", "28天年假", "灵活工时"] },
  "西班牙": { baseRange: [50000, 90000], bonusPct: 10, benefits: ["社会保险", "22天年假", "第14薪", "灵活工作"] },
  "法国": { baseRange: [60000, 100000], bonusPct: 12, benefits: ["35小时工作制", "社会保险", "餐券", "交通补贴"] },
  "意大利": { baseRange: [50000, 85000], bonusPct: 10, benefits: ["13薪", "社会保险", "餐补", "年假"] },
}

export async function suggestSalary(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  country: string,
  experienceYears: number,
  currency?: CurrencyCode
): Promise<AIResult<SalarySuggestion>> {
  await simulateThinkTime()

  const benchmark = SALARY_BENCHMARK[country] || SALARY_BENCHMARK["中国"]
  const expMultiplier = 0.7 + (experienceYears / 20) * 0.6

  const cur = currency || (country === "美国" ? "USD" : country === "德国" || country === "法国" || country === "西班牙" || country === "意大利" ? "EUR" : country === "日本" ? "JPY" : country === "韩国" ? "KRW" : "CNY")

  const [baseMin, baseMax] = benchmark.baseRange
  const adjMin = Math.round(baseMin * expMultiplier / 10000) * 10000
  const adjMax = Math.round(baseMax * expMultiplier / 10000) * 10000
  const bonusMin = Math.round(adjMin * benchmark.bonusPct / 100)
  const bonusMax = Math.round(adjMax * benchmark.bonusPct / 100)

  return wrapAI({
    jobTitle,
    country,
    experienceYears,
    currency: cur,
    breakdown: {
      baseMin: adjMin,
      baseMax: adjMax,
      bonusMin,
      bonusMax,
      benefitValue: Math.round((adjMin + adjMax) / 2 * 0.25),
      equityMin: 0,
      equityMax: Math.round(adjMax * 0.3),
      benefits: benchmark.benefits,
      totalMin: adjMin + bonusMin,
      totalMax: adjMax + bonusMax,
      currency: cur,
    },
    marketNote: `${country} ${jobTitle} 岗位，${experienceYears}年经验，参考 ${industry === "wind" ? "风能" : industry === "lithium" ? "锂电" : "新能源"}行业薪酬调查数据（2026 Q1）。`,
    sourceNote: "数据来源：行业薪酬报告、猎头平台公开数据，仅供参考。建议结合候选人当前薪酬和期望进行协商。",
  })
}

// ============================================================
// Module 6: 风险预警 — 规则引擎
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
  await simulateThinkTime()

  const alerts: RiskAlert[] = []
  let critical = 0, high = 0, medium = 0, low = 0

  if (context.dataTrustLevel && context.dataTrustLevel < 70) {
    critical++
    alerts.push({
      id: "risk_trust",
      type: "data_trust",
      level: "critical",
      title: "候选人数据可信度低",
      description: `数据可信度仅 ${context.dataTrustLevel}%，可能影响评估准确性。`,
      suggestion: "建议优先通过 LinkedIn 或学术数据库验证候选人背景信息。",
      relatedEntityType: "candidate",
    })
  }

  if (context.candidateCountry && context.candidateCountry !== "中国") {
    medium++
    alerts.push({
      id: "risk_visa",
      type: "visa_work_permit",
      level: "medium",
      title: `${context.candidateCountry}候选人需办理工作许可`,
      description: "国际招聘存在签证和工作许可风险，办理周期通常 2-4 个月。",
      suggestion: `建议提前启动 ${context.candidateCountry} 工作许可申请流程，预留充足时间。`,
      relatedEntityType: "candidate",
    })
  }

  if (context.offerDaysSinceSent && context.offerDaysSinceSent > 7) {
    high++
    alerts.push({
      id: "risk_offer_stale",
      type: "offer_delay",
      level: "high",
      title: `Offer 已发出 ${context.offerDaysSinceSent} 天未回复`,
      description: "候选人可能同时在考虑其他机会。",
      suggestion: "建议立即与候选人联系确认意向，必要时提供更优厚的条件。",
      relatedEntityType: "offer",
    })
  }

  if (context.interviewDaysSinceRequest && context.interviewDaysSinceRequest > 5) {
    low++
    alerts.push({
      id: "risk_interview_delay",
      type: "interview_delay",
      level: "low",
      title: `面试请求 ${context.interviewDaysSinceRequest} 天未安排`,
      description: "面试安排延迟可能影响候选人体验。",
      suggestion: "建议尽快协调面试官时间，2 个工作日内完成面试安排。",
      relatedEntityType: "interview",
    })
  }

  return wrapAI({
    totalRisks: alerts.length,
    critical,
    high,
    medium,
    low,
    alerts,
  })
}

// ============================================================
// Module 7: 候选人摘要 — 模板引擎
// ============================================================

export async function generateCandidateSummary(
  candidateId: string,
  candidateName: string,
  candidateTitle: string,
  candidateCountry: string,
  experienceYears: number,
  _profileText: string
): Promise<AIResult<CandidateSummary>> {
  await simulateThinkTime()

  const profile = TALENT_DATABASE.find(p => p.id === candidateId || p.name === candidateName)

  return wrapAI({
    candidateId,
    candidateName,
    oneLinePitch: profile
      ? `${candidateName} — ${candidateTitle}，${profile.company} ${experienceYears}年，${profile.publications}篇论文 ${profile.patents}项专利`
      : `${candidateName}（${candidateTitle}），${experienceYears}年经验，${candidateCountry}`,
    keyStrengths: profile?.highlights?.slice(0, 3) || [`${experienceYears}年行业经验`, `${candidateTitle}方向专业人才`],
    potentialConcerns: profile?.riskFlags || [],
    suggestedRoles: [candidateTitle],
    recommendedNextAction: "建议安排初步沟通，了解候选人当前职业规划和对目标岗位的兴趣程度。",
  })
}
