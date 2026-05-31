/**
 * AI Mock Engine — 全球风能锂电人才搜索雷达
 *
 * 设计原则：
 *   1. 所有函数返回 { data, generatedAt, disclaimer, model: "mock" }
 *   2. mock 数据基于风能/锂电领域真实知识构造
 *   3. 函数签名设计为可替换 — 后续只需实现同一接口的真实 AI 版本
 *   4. 每个输出都标注"AI 生成建议，仅供参考"
 *
 * 替换为真实 AI 的步骤：
 *   1. 安装 openai / anthropic SDK
 *   2. 创建 lib/aiReal.ts 实现相同接口
 *   3. 在 lib/ai.ts 中根据环境变量选择引擎
 */

// ============================================================
// Types
// ============================================================

export const AI_DISCLAIMER =
  "AI 生成建议，仅供参考。请结合实际情况做出最终判断，不得将 AI 输出作为唯一决策依据。"

export const AI_SAFETY_DISCLAIMER =
  "提示：AI 辅助工具不得基于种族、性别、年龄、宗教、国籍等受保护特征做出招聘决策。所有敏感决策必须经过人工确认。"

export interface AIResult<T> {
  data: T
  generatedAt: string
  disclaimer: string
  safetyNote: string
  model: "mock" // future: "gpt-4" | "claude-3" | "gemini-pro"
}

export type InvitationStyle = "formal" | "concise" | "international" | "headhunter"
export type QuestionDomain = "general" | "wind" | "lithium" | "management" | "technical"
export type CurrencyCode = "USD" | "EUR" | "CNY" | "SGD" | "JPY"
export type RiskLevel = "low" | "medium" | "high" | "critical"

// ---- Module 1: Talent Recommendation ----

export interface RecommendationCandidate {
  id: string
  name: string
  title: string
  country: string
  matchScore: number // 0-100
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

// ---- Module 2: Invitation Text ----

export interface InvitationResult {
  subject: string
  body: string
  style: InvitationStyle
  candidateName: string
  jobTitle: string
  companyName: string
}

// ---- Module 3: Interview Questions ----

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

// ---- Module 4: Assessment Report ----

export interface AssessmentDimension {
  name: string
  score: number // 0-100
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
  recommendation: "strong_hire" | "hire" | "consider" | "not_recommend"
  recommendationText: string
}

// ---- Module 5: Salary Suggestion ----

export interface SalaryBreakdown {
  baseMin: number
  baseMax: number
  bonusMin: number
  bonusMax: number
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

// ---- Module 6: Risk Alert ----

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
// Helpers
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

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/** Simulate AI processing delay (200-600ms) */
export function simulateThinkTime(): Promise<void> {
  return new Promise((r) => setTimeout(r, randomInRange(200, 600)))
}

// ============================================================
// Module 1: AI 人才推荐
// ============================================================

const MOCK_RECOMMENDATIONS: Record<string, RecommendationCandidate[]> = {
  // Wind domain candidates
  wind: [
    {
      id: "c_wind_001",
      name: "Dr. Michael Andersen",
      title: "Senior Blade Aerodynamicist",
      country: "丹麦",
      matchScore: 96,
      highlights: [
        "前 Vestas 首席气动工程师，主导 V164 叶片设计",
        "10 篇 SCI 顶刊叶片气动论文，h-index 34",
        "持有 3 项叶片后缘锯齿降噪专利",
      ],
      riskFlags: ["需确认与 Vestas 的竞业限制条款", "当前薪酬预期较高"],
      reason:
        "候选人拥有 15 年风电叶片气动设计经验，与贵司大型海上风电叶片项目高度匹配。其 V164 项目经验可直接应用于下一代 15MW+ 叶片开发。",
    },
    {
      id: "c_wind_002",
      name: "陈风电",
      title: "Wind Farm Digital Twin Lead",
      country: "中国",
      matchScore: 92,
      highlights: [
        "主导国家电投海上风电场数字孪生平台开发",
        "SCADA 数据 + 物理模型混合驱动，故障预测准确率 87%",
        "开源项目 wind-twin-sim GitHub 2.3k stars",
      ],
      riskFlags: ["当前项目与远景能源有合作，需确认排他条款"],
      reason:
        "候选人在风电场数字孪生领域处于国内领先地位，其混合驱动模型可帮助贵司实现预测性维护，降低 O&M 成本 15-20%。",
    },
    {
      id: "c_wind_003",
      name: "Sarah Mueller",
      title: "Offshore Wind Structural Engineer",
      country: "德国",
      matchScore: 88,
      highlights: [
        "Siemens Gamesa 海上风机基础结构团队核心成员",
        "参与 3 个北海海上风电项目桩基设计",
        "熟悉 DNV-ST-0126 / IEC 61400-3 标准",
      ],
      riskFlags: ["语言沟通需确认（德语为主，英语流利）"],
      reason:
        "具备欧洲北海海上风电项目实战经验，对单桩和导管架基础设计有深入理解，适合贵司海外海上风电项目扩展需求。",
    },
  ],
  // Lithium domain candidates
  lithium: [
    {
      id: "c_li_001",
      name: "王储能",
      title: "Battery Materials Scientist",
      country: "中国",
      matchScore: 94,
      highlights: [
        "清华博士，固态电解质材料研究方向",
        "Nature Energy 一作，高镍正极界面稳定性研究",
        "宁德时代 CATL 实习经验，参与 4680 大圆柱电池项目",
      ],
      riskFlags: ["博士尚未答辩，入职时间需协调", "研究方向偏学术，产业化经验有限"],
      reason:
        "候选人在固态电解质和正极材料领域有深厚学术积累，Nature Energy 发表经历表明研究能力顶级，适合贵司前沿电池材料研发岗位。",
    },
    {
      id: "c_li_002",
      name: "张 BMS",
      title: "BMS Algorithm Architect",
      country: "中国",
      matchScore: 91,
      highlights: [
        "华为数字能源 BMS 算法团队技术负责人",
        "主导自研 SOC/SOH 联合估计算法，精度 ±2% 以内",
        "5 年车规级 BMS 量产经验，出货超 50 万套",
      ],
      riskFlags: ["华为竞业限制需仔细审查"],
      reason:
        "候选人具备量产级 BMS 算法架构能力，SOC 估计精度达到行业领先水平。其大规模量产经验可加速贵司储能 BMS 产品落地。",
    },
    {
      id: "c_li_003",
      name: "Dr. James Chen",
      title: "Lithium Extraction Process Engineer",
      country: "澳大利亚",
      matchScore: 85,
      highlights: [
        "Allkem（前 Orocobre）盐湖提锂工艺专家",
        "主导 DLE（直接锂提取）中试线建设",
        "熟悉盐湖卤水提锂全流程，锂回收率 >85%",
      ],
      riskFlags: ["当前在澳洲，relocation 意愿待确认"],
      reason:
        "候选人在盐湖提锂领域具有稀缺的 DLE 工程化经验，其技术能力可帮助贵司优化锂资源提取效率，降低生产成本。",
    },
  ],
}

export function aiRecommendCandidates(
  jobTitle: string,
  jobIndustry: "wind" | "lithium" | "both",
  jobRequirements: string[],
  jobId: string
): AIResult<TalentRecommendation> {
  const industryKey = jobIndustry === "both" ? "wind" : jobIndustry
  const recs = MOCK_RECOMMENDATIONS[industryKey] || []

  // Adjust match scores based on job requirements keyword matching
  const adjusted = recs.map((r) => {
    let bonus = 0
    for (const req of jobRequirements) {
      const lowerReq = req.toLowerCase()
      if (r.highlights.some((h) => h.toLowerCase().includes(lowerReq.slice(0, 5))))
        bonus += 3
      if (r.reason.toLowerCase().includes(lowerReq.slice(0, 5))) bonus += 2
    }
    return { ...r, matchScore: Math.min(100, r.matchScore + bonus) }
  })

  const marketInsights: Record<string, string> = {
    wind: "全球风电人才市场洞察：海上风电和数字孪生方向人才紧缺，欧洲和亚太地区竞争激烈。建议关注具有跨领域经验（气动+结构+控制）的复合型人才。",
    lithium: "全球锂电人才市场洞察：固态电池和 BMS 算法方向人才溢价显著，中国在电芯制造端人才储备全球领先，但高端材料研发人才仍集中在日韩和北美。",
    both: "风储协同方向人才极度稀缺，兼具风电和储能经验的候选人不足全球 200 人。建议优先从风电预测+储能调度交叉领域寻找。",
  }

  return wrapAI({
    jobTitle,
    jobId,
    recommendations: adjusted,
    marketInsight: marketInsights[industryKey] || marketInsights.wind,
    searchKeywords:
      industryKey === "wind"
        ? ["风力发电", "叶片气动", "风场数字孪生", "海上风电", "风机控制", "SCADA", "IEC 61400"]
        : ["锂电池", "固态电池", "BMS", "正极材料", "电解液", "电芯设计", "电池回收"],
  })
}

// ============================================================
// Module 2: AI 邀请文案生成
// ============================================================

const INVITATION_TEMPLATES: Record<
  InvitationStyle,
  (candidateName: string, jobTitle: string, companyName: string) => InvitationResult
> = {
  formal: (name, title, company) => ({
    subject: `诚邀您了解 ${company} ${title} 职位机会`,
    body: `尊敬的 ${name}，

${company} 正在寻找 ${title} 领域的优秀人才，我们在仔细研究您的专业背景后，认为您的经验与我们的需求高度匹配。

【关于我们】
${company} 是风能/锂电领域的领先企业，致力于推动全球能源转型。我们为员工提供国际化的工作平台、有竞争力的薪酬福利体系，以及持续成长的职业发展空间。

【岗位亮点】
- 参与行业前沿技术研发项目
- 与全球顶尖工程师团队协作
- 灵活的远程办公政策
- 完善的职业发展双通道

如果您对这个机会感兴趣，我们很乐意安排一次非正式的交流，深入了解彼此的期望。

期待您的回复。

此致
敬礼
${company} 招聘团队`,
    style: "formal",
    candidateName: name,
    jobTitle: title,
    companyName: company,
  }),

  concise: (name, title, company) => ({
    subject: `${company} | ${title} 机会`,
    body: `Hi ${name}，

看到你的背景很适合我们 ${title} 岗位。

${company} 正在组建核心团队，你的经验（技术深度 + 行业积累）正是我们需要的。

聊聊？15 分钟语音也行。

— ${company} HR`,
    style: "concise",
    candidateName: name,
    jobTitle: title,
    companyName: company,
  }),

  international: (name, title, company) => ({
    subject: `Exciting ${title} Opportunity at ${company}`,
    body: `Dear ${name},

I hope this message finds you well. I came across your impressive profile in the wind/lithium energy sector, and I believe your expertise aligns remarkably well with an opportunity at ${company}.

**About ${company}:**
We are at the forefront of the global energy transition, developing cutting-edge solutions in renewable energy and energy storage. Our international team spans 15+ countries, and we are actively expanding our R&D capabilities.

**The Role — ${title}:**
- Lead innovative projects with global impact
- Collaborate with world-class engineers and researchers
- Competitive compensation with equity participation
- Flexible work arrangements with relocation support

**Why You:**
Your track record in [specific domain] and your contributions to [specific achievement] demonstrate exactly the kind of expertise we value.

Would you be open to a brief exploratory conversation? We can accommodate any time zone.

Looking forward to hearing from you.

Best regards,
${company} Talent Acquisition Team`,
    style: "international",
    candidateName: name,
    jobTitle: title,
    companyName: company,
  }),

  headhunter: (name, title, company) => ({
    subject: `[保密] ${company} 核心岗位 | ${title}`,
    body: `${name}，有个机会想和你私下聊聊。

**一句话：** ${company} 在招 ${title}，团队核心岗，预算有弹性。

**为什么找你：**
你的履历在这个方向上属于 top 5%，尤其是 [关键技术/项目] 这块，市场上能做的人不多。我们看了你的 [achievement]，非常impressive。

**一些关键信息：**
📌 汇报对象：CTO/VP 级别
📌 团队规模：初期 5-8 人，12 个月内扩到 20+
📌 薪酬：Base 面议 + 年度奖金 + 期权/股权
📌 地点：可 remote 或 relocation 支持
📌 阶段：公司处于快速扩张期，现在进时机很好

**流程：**
1. 我先和你通个 10 分钟电话，确认意向
2. 如果感兴趣，安排和 CTO 交流（技术面，非面试性质）
3. 后续流程从简，尊重你的时间

这个信息暂时保密，方便的时候回我即可。不方便也没关系，我们保持联系。

Cheers`,
    style: "headhunter",
    candidateName: name,
    jobTitle: title,
    companyName: company,
  }),
}

export function aiGenerateInvitation(
  candidateName: string,
  candidateTitle: string,
  jobTitle: string,
  companyName: string,
  style: InvitationStyle = "formal"
): AIResult<InvitationResult> {
  const generator =
    INVITATION_TEMPLATES[style] || INVITATION_TEMPLATES.formal
  return wrapAI(generator(candidateName, jobTitle, companyName))
}

// ============================================================
// Module 3: AI 面试问题生成
// ============================================================

function generateWindQuestions(jobTitle: string): InterviewQuestion[] {
  return [
    {
      id: "q_w_1",
      category: "空气动力学",
      question: "请解释风力机叶片在低风速和高风速工况下的气动特性差异，以及您如何通过叶片设计优化功率曲线？",
      expectedFocus: "Betz 极限、翼型选型、失速控制、涡流发生器应用",
      difficulty: "advanced",
      domain: "wind",
    },
    {
      id: "q_w_2",
      category: "结构力学",
      question: "在海上风电叶片设计中，您如何平衡轻量化需求与极限载荷下的结构安全性？请结合实际项目经验。",
      expectedFocus: "碳纤维/玻纤复合材料、疲劳寿命、极限载荷工况、DNV 认证",
      difficulty: "advanced",
      domain: "wind",
    },
    {
      id: "q_w_3",
      category: "控制系统",
      question: "描述一个您处理过的风机控制系统故障案例，您是如何诊断和解决的？",
      expectedFocus: "变桨/偏航控制、PLC 编程、SCADA 数据分析、故障树分析",
      difficulty: "intermediate",
      domain: "wind",
    },
    {
      id: "q_w_4",
      category: "数字孪生",
      question: "您认为数字孪生在风电场运维中的最大价值是什么？请描述您构建数字孪生模型的方法论。",
      expectedFocus: "物理模型 vs 数据驱动、模型校准、预测性维护 ROI",
      difficulty: "intermediate",
      domain: "wind",
    },
    {
      id: "q_w_5",
      category: "行业认知",
      question: "您如何看待未来 5 年漂浮式海上风电的技术挑战和商业化前景？",
      expectedFocus: "浮式基础、动态电缆、运维策略、度电成本",
      difficulty: "basic",
      domain: "wind",
    },
  ]
}

function generateLithiumQuestions(jobTitle: string): InterviewQuestion[] {
  return [
    {
      id: "q_l_1",
      category: "电池材料",
      question: "请比较三元正极和磷酸铁锂正极在安全性、能量密度、循环寿命方面的差异，您倾向哪种技术路线？为什么？",
      expectedFocus: "NCM/NCA vs LFP、热失控机理、包覆改性策略",
      difficulty: "intermediate",
      domain: "lithium",
    },
    {
      id: "q_l_2",
      category: "电芯设计",
      question: "在大圆柱电池设计中，全极耳（tabless）结构相比传统多极耳有什么优势？设计难点是什么？",
      expectedFocus: "电流密度分布、热管理、制造工艺、内阻优化",
      difficulty: "advanced",
      domain: "lithium",
    },
    {
      id: "q_l_3",
      category: "BMS 算法",
      question: "描述一种您实现过的 SOC 估计算法（卡尔曼滤波/神经网络/等效电路模型），如何验证其精度？",
      expectedFocus: "EKF/AEKF/DKF、OCV-SOC 曲线、HPPC 测试、老化补偿",
      difficulty: "advanced",
      domain: "lithium",
    },
    {
      id: "q_l_4",
      category: "制造工艺",
      question: "在锂电制造中，涂布工序的哪些参数对电芯一致性影响最大？您如何处理涂布缺陷？",
      expectedFocus: "面密度控制、浆料流变性、干燥温度曲线、在线检测",
      difficulty: "intermediate",
      domain: "lithium",
    },
    {
      id: "q_l_5",
      category: "行业认知",
      question: "您认为钠离子电池在未来储能市场中的应用前景如何？与锂电相比，优劣势各是什么？",
      expectedFocus: "资源禀赋、能量密度、低温性能、产业成熟度",
      difficulty: "basic",
      domain: "lithium",
    },
  ]
}

function generateManagementQuestions(level: string): InterviewQuestion[] {
  return [
    {
      id: "q_m_1",
      category: "团队管理",
      question: "请分享一个您带领跨学科团队（如机械+电气+软件）完成复杂项目的案例。您如何协调不同背景的团队成员？",
      expectedFocus: "项目规划、冲突解决、资源分配、跨部门沟通",
      difficulty: "intermediate",
      domain: "management",
    },
    {
      id: "q_m_2",
      category: "技术决策",
      question: "当团队面临两种技术方案选择（自研 vs 外购），您的决策框架是什么？请举例说明。",
      expectedFocus: "成本分析、技术风险、长期战略、供应链依赖",
      difficulty: "intermediate",
      domain: "management",
    },
    {
      id: "q_m_3",
      category: "人才培养",
      question: "您如何识别和培养团队中的高潜人才？能否分享一个成功培养案例？",
      expectedFocus: "导师机制、技能矩阵、轮岗计划、反馈文化",
      difficulty: "basic",
      domain: "management",
    },
  ]
}

export function aiGenerateInterviewQuestions(
  jobTitle: string,
  jobIndustry: "wind" | "lithium" | "both",
  candidateName: string,
  domain: QuestionDomain = "general"
): AIResult<InterviewQuestionSet> {
  let questions: InterviewQuestion[] = []

  if (domain === "general" || domain === "technical") {
    if (jobIndustry === "wind" || jobIndustry === "both") {
      questions = questions.concat(generateWindQuestions(jobTitle))
    }
    if (jobIndustry === "lithium" || jobIndustry === "both") {
      questions = questions.concat(generateLithiumQuestions(jobTitle))
    }
  }

  if (domain === "wind") {
    questions = generateWindQuestions(jobTitle)
  }
  if (domain === "lithium") {
    questions = generateLithiumQuestions(jobTitle)
  }
  if (domain === "management") {
    const hasManager = /经理|总监|主管|CTO|VP|Head|Director|Manager|Lead/i.test(jobTitle)
    const level = hasManager ? "senior" : "mid"
    questions = generateManagementQuestions(level)
  }

  if (questions.length === 0) {
    // Fallback: generic energy tech questions
    questions = [
      {
        id: "q_g_1",
        category: "技术基础",
        question: "请介绍您最擅长的技术领域，以及您在该领域的核心能力。",
        expectedFocus: "技术深度、项目经验、学习能力",
        difficulty: "basic",
        domain: "general",
      },
      {
        id: "q_g_2",
        category: "项目经验",
        question: "请分享一个您主导的最具挑战性的技术项目，您是如何克服难点的？",
        expectedFocus: "问题解决能力、创新思维、团队协作",
        difficulty: "intermediate",
        domain: "general",
      },
    ]
  }

  const followUpHints = [
    "追问候选人提到的具体项目细节，了解其在项目中的实际角色和贡献",
    "让候选人用 3 分钟向非技术人员解释一个复杂的技术概念，考察沟通能力",
    "询问候选人对行业趋势的看法，判断其视野和前瞻性",
    "了解候选人的职业规划，评估与岗位的长期匹配度",
  ]

  return wrapAI({
    jobTitle,
    candidateName,
    domain,
    questions,
    followUpHints,
  })
}

// ============================================================
// Module 4: AI 评估报告
// ============================================================

export function aiGenerateAssessment(
  candidateName: string,
  candidateTitle: string,
  jobTitle: string,
  industry: "wind" | "lithium" | "both"
): AIResult<AssessmentReport> {
  const dimensions: AssessmentDimension[] = [
    {
      name: "技术能力",
      score: randomInRange(78, 95),
      comment: `候选人在${industry === "wind" ? "风电" : "锂电"}核心技术领域表现出色，具备独立解决复杂技术问题的能力。`,
      strengths: ["技术深度扎实，覆盖核心技术栈", "有量产/工程化经验", "能独立设计方案架构"],
      weaknesses: ["过于专注单一领域，跨领域知识广度待扩展"],
    },
    {
      name: "管理能力",
      score: randomInRange(55, 85),
      comment: "具备基本的团队协调能力，但在大规模团队管理和资源调配方面经验有限。",
      strengths: ["能带领 3-5 人小团队完成项目", "技术决策思路清晰"],
      weaknesses: ["缺乏 20+ 人团队管理经验", "跨部门协调能力需加强"],
    },
    {
      name: "国际化能力",
      score: randomInRange(60, 90),
      comment: "英语沟通流利，有跨国项目协作经验，适应跨文化工作环境。",
      strengths: ["英语工作流利", "有海外项目/学习经历", "跨文化敏感度高"],
      weaknesses: ["非英语母语，复杂汇报场景需准备时间"],
    },
    {
      name: "行业认知",
      score: randomInRange(75, 92),
      comment: `对${industry === "wind" ? "风电" : "锂电"}行业发展趋势有深刻理解，能洞察技术路线走向。`,
      strengths: ["关注行业前沿动态", "有独立的技术判断力", "人脉广泛"],
      weaknesses: ["对上下游产业链了解不够全面"],
    },
    {
      name: "创新潜力",
      score: randomInRange(70, 90),
      comment: "在过往项目中展现出较强的创新意识和问题解决能力，有专利/论文产出。",
      strengths: ["有创新成果产出（专利/论文）", "善于跳出框架思考"],
      weaknesses: ["部分想法偏学术，工程化可行性待验证"],
    },
  ]

  const overall = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length
  )

  let recommendation: AssessmentReport["recommendation"]
  let recommendationText: string
  if (overall >= 88) {
    recommendation = "strong_hire"
    recommendationText = `强烈推荐录用。${candidateName} 的综合素质与 ${jobTitle} 岗位高度匹配，技术能力突出，行业认知深刻，建议尽快发出 Offer。`
  } else if (overall >= 75) {
    recommendation = "hire"
    recommendationText = `推荐录用。${candidateName} 具备胜任 ${jobTitle} 的核心能力，在个别维度（如管理能力）可入职后培养。建议进入 Offer 流程。`
  } else if (overall >= 60) {
    recommendation = "consider"
    recommendationText = `可考虑录用。${candidateName} 部分能力达标，但在关键维度上存在差距。建议安排加面或从备选池中选择更优候选人。`
  } else {
    recommendation = "not_recommend"
    recommendationText = `暂不推荐录用。${candidateName} 当前能力与 ${jobTitle} 岗位要求存在较大差距。可考虑推荐其他匹配度更高的岗位。`
  }

  return wrapAI({
    candidateName,
    jobTitle,
    overallScore: overall,
    dimensions,
    riskFlags: [
      "候选人当前薪酬预期可能高于岗位预算",
      "需确认前雇主竞业限制条款",
      "入职时间需进一步协商",
    ],
    summary: `${candidateName}（${candidateTitle}）整体面试表现 ${
      overall >= 80 ? "优秀" : "良好"
    }，在技术能力和行业认知方面表现突出，${overall >= 80 ? "是" : "可以作为"} ${jobTitle} 岗位的${
      overall >= 85 ? "首选" : "候选"
    }人选。建议${
      overall >= 80 ? "尽快推进 Offer 流程" : "结合其他候选人综合评估"
    }。`,
    recommendation,
    recommendationText,
  })
}

// ============================================================
// Module 5: AI 薪酬建议
// ============================================================

const SALARY_BASELINES: Record<
  string,
  Record<string, { baseMin: number; baseMax: number; bonusPct: number }>
> = {
  wind: {
    中国: { baseMin: 300000, baseMax: 800000, bonusPct: 20 },
    丹麦: { baseMin: 750000, baseMax: 1400000, bonusPct: 15 },
    德国: { baseMin: 80000, baseMax: 140000, bonusPct: 15 },
    美国: { baseMin: 120000, baseMax: 220000, bonusPct: 20 },
    新加坡: { baseMin: 100000, baseMax: 180000, bonusPct: 18 },
  },
  lithium: {
    中国: { baseMin: 350000, baseMax: 1000000, bonusPct: 25 },
    韩国: { baseMin: 70000, baseMax: 130000, bonusPct: 20 },
    日本: { baseMin: 8000000, baseMax: 15000000, bonusPct: 20 },
    美国: { baseMin: 130000, baseMax: 250000, bonusPct: 25 },
    德国: { baseMin: 85000, baseMax: 150000, bonusPct: 18 },
  },
  both: {
    中国: { baseMin: 400000, baseMax: 1200000, bonusPct: 25 },
    美国: { baseMin: 140000, baseMax: 260000, bonusPct: 25 },
    德国: { baseMin: 90000, baseMax: 160000, bonusPct: 20 },
  },
}

const CURRENCY_MAP: Record<string, CurrencyCode> = {
  中国: "CNY",
  丹麦: "EUR",
  德国: "EUR",
  美国: "USD",
  新加坡: "SGD",
  韩国: "USD",
  日本: "JPY",
}

const BENEFITS_BY_COUNTRY: Record<string, string[]> = {
  中国: ["五险一金", "补充商业保险", "带薪年假 15-20 天", "股票期权", "人才公寓/住房补贴"],
  丹麦: ["Pension Scheme (10%+)", "6 Weeks Paid Vacation", "Flexible Work", "Stock Options", "Relocation Package"],
  德国: ["30 Days Vacation", "Company Pension", "Flexible Hours", "Stock Options", "Relocation Support"],
  美国: ["401(k) Match 4-6%", "Health Insurance (PPO)", "Unlimited PTO", "Stock Options / RSU", "Relocation Bonus"],
  新加坡: ["CPF Contribution", "Health Insurance", "21 Days Annual Leave", "Stock Options", "Housing Allowance"],
}

export function aiSalarySuggestion(
  jobTitle: string,
  industry: "wind" | "lithium" | "both",
  country: string,
  experienceYears: number,
  currency?: CurrencyCode
): AIResult<SalarySuggestion> {
  const industryBaseline = SALARY_BASELINES[industry] || SALARY_BASELINES.wind
  const countryData = industryBaseline[country] || industryBaseline["中国"]
  const usedCurrency = currency || CURRENCY_MAP[country] || "CNY"

  // Scale by experience
  let expMultiplier = 1.0
  if (experienceYears < 3) expMultiplier = 0.7
  else if (experienceYears < 5) expMultiplier = 0.85
  else if (experienceYears < 8) expMultiplier = 1.0
  else if (experienceYears < 12) expMultiplier = 1.2
  else if (experienceYears < 20) expMultiplier = 1.5
  else expMultiplier = 1.8

  // Adjust for currency conversion (rough, illustrative only)
  let currencyMultiplier = 1.0
  if (usedCurrency !== (CURRENCY_MAP[country] || "CNY")) {
    currencyMultiplier = usedCurrency === "USD" ? 1.0 : usedCurrency === "EUR" ? 0.92 : usedCurrency === "SGD" ? 1.35 : 1.0
  }

  const baseMin = Math.round(countryData.baseMin * expMultiplier * currencyMultiplier)
  const baseMax = Math.round(countryData.baseMax * expMultiplier * currencyMultiplier)
  const bonusMin = Math.round(baseMin * countryData.bonusPct / 100)
  const bonusMax = Math.round(baseMax * countryData.bonusPct / 100)
  const equityMin = Math.round(baseMin * 0.3)
  const equityMax = Math.round(baseMax * 0.5)
  const benefits = BENEFITS_BY_COUNTRY[country] || BENEFITS_BY_COUNTRY["中国"]

  return wrapAI({
    jobTitle,
    country,
    experienceYears,
    currency: usedCurrency,
    breakdown: {
      baseMin,
      baseMax,
      bonusMin,
      bonusMax,
      equityMin,
      equityMax,
      benefits,
      totalMin: baseMin + bonusMin + equityMin,
      totalMax: baseMax + bonusMax + equityMax,
      currency: usedCurrency,
    },
    marketNote: `以上数据基于 ${country} 市场 ${industry === "wind" ? "风电" : industry === "lithium" ? "锂电" : "风储"} 行业${experienceYears}年经验工程师的历史薪酬分布，仅供参考。实际薪酬会因公司体量、候选人具体技能组合、谈判情况等因素显著变化。`,
    sourceNote: "示例建议 — 非真实市场薪酬数据。请参考 Glassdoor / Levels.fyi / 脉脉 等渠道获取最新行情。",
  })
}

// ============================================================
// Module 6: AI 风险预警
// ============================================================

export function aiRiskCheck(context: {
  candidateCountry?: string
  candidateActivity?: "low" | "medium" | "high"
  interviewDaysSinceRequest?: number
  offerDaysSinceSent?: number
  alreadyInvited?: boolean
  dataTrustLevel?: number
  authorizationStatus?: string
}): AIResult<RiskCheckResult> {
  const alerts: RiskAlert[] = []

  // Data trust level
  const trust = context.dataTrustLevel ?? 70
  if (trust < 40) {
    alerts.push({
      id: "risk_trust_low",
      type: "data_trust",
      level: "critical",
      title: "数据可信度过低",
      description: `候选人数据可信度仅为 ${trust}%，数据源可能存在信息缺失或未验证情况。`,
      suggestion: "建议通过 LinkedIn 或直接联系候选人确认关键信息后再做决策。",
      relatedEntityType: "candidate",
    })
  } else if (trust < 60) {
    alerts.push({
      id: "risk_trust_medium",
      type: "data_trust",
      level: "medium",
      title: "数据可信度偏低",
      description: `候选人数据可信度为 ${trust}%，部分信息未经验证。`,
      suggestion: "建议在面试中重点核实教育背景和工作经历。",
    })
  }

  // Authorization status
  if (context.authorizationStatus === "expired" || context.authorizationStatus === "revoked") {
    alerts.push({
      id: "risk_auth_bad",
      type: "authorization",
      level: "critical",
      title: "授权状态异常",
      description: `候选人数据授权状态为「${context.authorizationStatus}」，继续使用其数据可能违反隐私条款。`,
      suggestion: "请立即暂停该候选人的数据处理，并联系法务团队确认合规方案。",
    })
  } else if (!context.authorizationStatus || context.authorizationStatus === "unknown") {
    alerts.push({
      id: "risk_auth_unknown",
      type: "authorization",
      level: "high",
      title: "授权状态未知",
      description: "该候选人数据的授权状态无法确认，存在合规风险。",
      suggestion: "建议在 72 小时内确认候选人的数据使用授权状态。",
    })
  }

  // Candidate activity / response rate
  if (context.candidateActivity === "low") {
    alerts.push({
      id: "risk_response_low",
      type: "engagement",
      level: "high",
      title: "候选人回复率低",
      description: "该候选人在过去 30 天内对平台邀请的回复率低于 20%，可能已不活跃或不感兴趣。",
      suggestion: "考虑通过多渠道（邮件+LinkedIn+电话）尝试联系，或转向备选候选人。",
    })
  }

  // Interview overdue
  const daysSinceInterview = context.interviewDaysSinceRequest ?? -1
  if (daysSinceInterview > 7) {
    alerts.push({
      id: "risk_interview_overdue",
      type: "process",
      level: "high",
      title: "面试超时未反馈",
      description: `面试请求已发送 ${daysSinceInterview} 天，双方均未确认或反馈，流程可能停滞。`,
      suggestion: "建议 HR 立即跟进候选人，或与面试官确认安排。超过 14 天未反馈建议自动撤销请求。",
    })
  } else if (daysSinceInterview > 3) {
    alerts.push({
      id: "risk_interview_pending",
      type: "process",
      level: "medium",
      title: "面试反馈待跟进",
      description: `面试请求已发出 ${daysSinceInterview} 天，建议在 48 小时内跟进。`,
      suggestion: "发送友好提醒给候选人和面试官确认时间安排。",
    })
  }

  // Offer overdue
  const daysSinceOffer = context.offerDaysSinceSent ?? -1
  if (daysSinceOffer > 5) {
    alerts.push({
      id: "risk_offer_overdue",
      type: "process",
      level: "critical",
      title: "Offer 审批/回复超时",
      description: `Offer 已发出 ${daysSinceOffer} 天未收到候选人确认或拒绝，存在候选人流失或被竞对截胡的风险。`,
      suggestion: "建议立即电话联系候选人确认意向，必要时设置 Offer 截止日期。",
    })
  }

  // Duplicate invitation
  if (context.alreadyInvited) {
    alerts.push({
      id: "risk_duplicate",
      type: "operation",
      level: "medium",
      title: "重复邀请风险",
      description: "该候选人已在 90 天内收到过同一岗位或类似岗位的邀请，重复发送可能影响品牌形象。",
      suggestion: "确认候选人之前拒绝的原因是否已变化，如无变化建议转向其他候选人。",
    })
  }

  // Country-specific compliance (GDPR/PIPL)
  if (context.candidateCountry && ["德国", "法国", "意大利", "西班牙", "荷兰"].includes(context.candidateCountry)) {
    alerts.push({
      id: "risk_gdpr",
      type: "compliance",
      level: "low",
      title: "GDPR 合规提示",
      description: `候选人位于 ${context.candidateCountry}（欧盟/EEA），其数据处理受 GDPR 约束。请确保数据采集、存储和处理合规。`,
      suggestion: "确认候选人已签署 GDPR 同意书，数据存储在欧洲境内或等效合规区域。",
    })
  }

  return wrapAI({
    totalRisks: alerts.length,
    critical: alerts.filter((a) => a.level === "critical").length,
    high: alerts.filter((a) => a.level === "high").length,
    medium: alerts.filter((a) => a.level === "medium").length,
    low: alerts.filter((a) => a.level === "low").length,
    alerts,
  })
}

// ============================================================
// Unified AI service — single entry point for future replacement
// ============================================================

export const aiService = {
  recommendCandidates: aiRecommendCandidates,
  generateInvitation: aiGenerateInvitation,
  generateQuestions: aiGenerateInterviewQuestions,
  generateAssessment: aiGenerateAssessment,
  suggestSalary: aiSalarySuggestion,
  checkRisks: aiRiskCheck,
  // Utility
  simulateThinkTime,
  AI_DISCLAIMER,
  AI_SAFETY_DISCLAIMER,
}

export default aiService
