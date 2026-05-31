/**
 * AI Prompt 模板管理
 *
 * 设计原则：
 *   1. 每个 AI 功能使用独立 prompt 模板，便于单独调整
 *   2. 所有 prompt 必须包含合规约束（不得基于受保护特征做决策）
 *   3. 所有 prompt 要求输出标注"AI 生成，仅供参考"
 *   4. Prompt 使用 {{variable}} 占位符，由 Provider 替换
 *   5. 真实 AI Provider 调用时将 template 转换为对应模型的消息格式
 *
 * 未来扩展：
 *   - 可以为不同模型维护不同版本的 prompt（OpenAI vs Claude 格式差异）
 *   - 可以支持 prompt 版本管理和 A/B 测试
 */

// ============================================================
// Prompt 模板类型
// ============================================================

export interface PromptVars {
  [key: string]: string | number | string[]
}

export interface PromptTemplate {
  /** 模板唯一标识 */
  id: string
  /** 适用 AI 功能模块 */
  module:
    | "recommend"
    | "invitation"
    | "interview"
    | "assessment"
    | "salary"
    | "risk"
    | "summary"
  /** 模板名称（用于管理界面） */
  name: string
  /** 模板版本 */
  version: string
  /** 系统提示词（system message）*/
  systemPrompt: string
  /** 用户提示词模板（含 {{variable}} 占位符）*/
  userPromptTemplate: string
  /** 输出格式要求（JSON schema 描述或结构化要求）*/
  outputFormat: string
  /** 合规约束（每个 prompt 都必须包含） */
  complianceConstraints: string[]
  /** 模型特定提示（如 Claude 的 <instructions> 格式）*/
  modelNotes?: string
}

// ============================================================
// 占位符替换工具
// ============================================================

function renderTemplate(template: string, vars: PromptVars): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = vars[key]
    if (value === undefined) return `{{${key}}}`
    if (Array.isArray(value)) return value.join("、")
    return String(value)
  })
}

export function buildPrompt(
  template: PromptTemplate,
  vars: PromptVars
): { system: string; user: string } {
  return {
    system: renderTemplate(template.systemPrompt, vars),
    user: renderTemplate(template.userPromptTemplate, vars),
  }
}

// ============================================================
// 通用合规约束（所有模板都必须包含）
// ============================================================

const COMPLIANCE_BLOCK = `
【合规约束 — 必须遵守】
1. 不得基于种族、性别、年龄、宗教、国籍、残疾状况、婚姻状况等受保护特征做出任何评价或推荐。
2. 输出内容仅作为招聘辅助参考，不得作为唯一决策依据。
3. 涉及薪酬、录用、拒绝的关键决策必须经过人工确认。
4. 在输出末尾必须附上免责声明："AI 生成建议，仅供参考。"
5. 如对候选人数据来源有疑问，应在输出中标注"建议进一步核实"。
`.trim()

// ============================================================
// Module 1 — 人才推荐 Prompt
// ============================================================

export const PROMPT_RECOMMEND: PromptTemplate = {
  id: "rec-wind-lithium-v1",
  module: "recommend",
  name: "风能锂电人才推荐",
  version: "1.0.0",

  systemPrompt: `
你是一位专注于全球风能和锂电领域的人才搜索专家。
你的任务：根据职位需求，从候选人才库中推荐最匹配的候选人，并给出匹配理由。

领域背景：
- 风能：叶片气动、结构设计、控制系统、SCADA、数字孪生、海上风电、风场运维
- 锂电：电芯设计、BMS算法、正极/负极/电解液材料、PACK、储能系统、电池回收
- 风储协同：风光储一体化、能量管理、电网调度

评分标准：
- 90-100：顶尖匹配，直接推进面试
- 75-89 ：高度匹配，建议邀请
- 60-74 ：基本匹配，可考虑备份
- <60   ：不匹配，不推荐

${COMPLIANCE_BLOCK}
`.trim(),

  userPromptTemplate: `
【职位信息】
职位名称：{{jobTitle}}
所属行业：{{industry}}
核心要求：{{requirements}}

【候选人列表】
{{candidateList}}

请根据以上信息，推荐最匹配的 3-5 位候选人，对每位候选人输出：
1. 匹配分数（0-100）
2. 核心亮点（3条）
3. 潜在风险标签（如有）
4. 推荐理由（2-3句话）

同时输出：
- 行业人才市场洞察（1段话）
- 建议搜索关键词（5-8个）
`.trim(),

  outputFormat: `
输出严格使用 JSON 格式：
{
  "recommendations": [
    {
      "id": "...",
      "name": "...",
      "title": "...",
      "country": "...",
      "matchScore": 0-100,
      "highlights": ["...", "...", "..."],
      "riskFlags": ["...", "..."],
      "reason": "..."
    }
  ],
  "marketInsight": "...",
  "searchKeywords": ["...", "...", "..."]
}
`.trim(),

  complianceConstraints: [
    "不得基于受保护特征筛选或排序候选人",
    "匹配分数必须有客观依据，不得主观臆断",
    "输出须标注'AI 生成建议，仅供参考'",
  ],
}

// ============================================================
// Module 2 — 邀请文案生成 Prompt
// ============================================================

export const PROMPT_INVITATION: PromptTemplate = {
  id: "invite-template-v1",
  module: "invitation",
  name: "邀请文案生成",
  version: "1.0.0",

  systemPrompt: `
你是一位专业的招聘文案撰写专家，擅长为风能/锂电领域的技术人才撰写有吸引力的邀请消息。

文案风格说明：
- formal：正式商务风格，适合首次接触、企业官方渠道
- concise：简洁直接风格，适合技术人员快速阅读
- international：英文国际化风格，适合海外候选人
- headhunter：猎头风格，有冲击力，突出机会价值

注意事项：
- 文案中不得包含任何歧视性语言
- 不得承诺无法保证的薪酬或职位
- 必须包含退出/拒绝的友好提示
- 文案长度控制在 200-400 字（英文 150-250 词）

${COMPLIANCE_BLOCK}
`.trim(),

  userPromptTemplate: `
【候选人信息】
姓名：{{candidateName}}
当前职位：{{candidateTitle}}

【职位信息】
职位名称：{{jobTitle}}
公司名称：{{companyName}}

【文案风格】
{{style}}

请生成：
1. 邮件主题（subject）
2. 邮件正文（body）

要求：正文体现对候选人背景的具体了解，而非模板化表述。
`.trim(),

  outputFormat: `
输出严格使用 JSON 格式：
{
  "subject": "...",
  "body": "...",
  "style": "{{style}}",
  "candidateName": "{{candidateName}}",
  "jobTitle": "{{jobTitle}}",
  "companyName": "{{companyName}}"
}
`.trim(),

  complianceConstraints: [
    "文案不得包含年龄、性别、婚姻状况等无关信息要求",
    "不得做出无法兑现的承诺",
    "必须提供拒绝/退出途径",
  ],
}

// ============================================================
// Module 3 — 面试问题生成 Prompt
// ============================================================

export const PROMPT_INTERVIEW: PromptTemplate = {
  id: "interview-q-v1",
  module: "interview",
  name: "面试问题生成",
  version: "1.0.0",

  systemPrompt: `
你是一位资深的技术面试官，擅长为风能/锂电领域岗位设计高质量的面试问题。

问题设计原则：
- 由浅入深，覆盖基础知识 → 实践经验 → 系统设计 → 行业视野
- 问题必须有明确的考察焦点（expectedFocus）
- 避免询问与工作能力无关的私人问题
- 不得询问年龄、婚育、宗教信仰等受保护特征相关问题

领域知识覆盖：
- 风能：空气动力学、结构力学、控制系统、SCADA、海上风电、数字孪生
- 锂电：电化学、电芯设计、BMS、材料科学、制造工艺、储能系统
- 管理：团队协调、技术决策、跨文化沟通、项目管理

${COMPLIANCE_BLOCK}
`.trim(),

  userPromptTemplate: `
【面试信息】
职位：{{jobTitle}}
候选人：{{candidateName}}
技术领域：{{domain}}

请生成 5 道面试问题，覆盖：
1. 基础知识（1题）
2. 实践经验（2题）
3. 系统设计/架构思维（1题）
4. 行业认知/前瞻性（1题）

每题包含：
- 问题内容
- 考察焦点（expectedFocus）
- 难度等级（basic / intermediate / advanced）
`.trim(),

  outputFormat: `
输出严格使用 JSON 格式：
{
  "questions": [
    {
      "id": "q_1",
      "category": "...",
      "question": "...",
      "expectedFocus": "...",
      "difficulty": "basic|intermediate|advanced",
      "domain": "{{domain}}"
    }
  ],
  "followUpHints": ["...", "...", "..."]
}
`.trim(),

  complianceConstraints: [
    "问题不得涉及受保护特征",
    "问题必须聚焦工作能力和岗位需求",
    "评估标准须在面试前明确并告知候选人",
  ],
}

// ============================================================
// Module 4 — 评估报告生成 Prompt
// ============================================================

export const PROMPT_ASSESSMENT: PromptTemplate = {
  id: "assess-report-v1",
  module: "assessment",
  name: "面试评估报告生成",
  version: "1.0.0",

  systemPrompt: `
你是一位专业的人才评估专家，负责根据面试表现生成结构化评估报告。

评估维度（5个，每个 0-100 分）：
1. 技术能力：专业知识深度、技术广度、工程实践能力
2. 管理能力：团队协调、项目管理、跨部门沟通（如不适用，给出合理分数）
3. 国际化能力：英语/外语沟通、跨文化协作、国际项目经验
4. 行业认知：对行业趋势的理解、技术路线判断、竞争格局认知
5. 创新潜力：创新思维、专利/论文产出、解决复杂问题的能力

评分原则：
- 必须有具体依据，不能泛泛而谈
- 须同时列出 strengths 和 weaknesses
- 综合分数 >= 85：强烈推荐；75-84：推荐；60-74：可考虑；<60：不推荐

${COMPLIANCE_BLOCK}
`.trim(),

  userPromptTemplate: `
【候选人】{{candidateName}}（{{candidateTitle}}）
【应聘职位】{{jobTitle}}
【所属行业】{{industry}}

【面试记录摘要】
{{interviewNotes}}

请根据以上信息生成完整的评估报告，包含 5 个维度的详细评分和综合建议。
`.trim(),

  outputFormat: `
输出严格使用 JSON 格式：
{
  "overallScore": 0-100,
  "dimensions": [
    {
      "name": "技术能力",
      "score": 0-100,
      "comment": "...",
      "strengths": ["...", "..."],
      "weaknesses": ["...", "..."]
    }
    // ... 共5个维度
  ],
  "riskFlags": ["...", "..."],
  "summary": "...",
  "recommendation": "strong_hire|hire|consider|not_recommend",
  "recommendationText": "..."
}
`.trim(),

  complianceConstraints: [
    "评估不得基于受保护特征",
    "评分维度须在面试前明示候选人",
    "评估报告须经人工审核后生效",
  ],
}

// ============================================================
// Module 5 — 薪酬建议生成 Prompt
// ============================================================

export const PROMPT_SALARY: PromptTemplate = {
  id: "salary-suggest-v1",
  module: "salary",
  name: "薪酬建议生成",
  version: "1.0.0",

  systemPrompt: `
你是一位专业的薪酬福利顾问，擅长为风能/锂电行业提供有竞争力的薪酬建议。

薪酬结构说明：
- Base：基本工资（年化）
- Bonus：年度奖金（通常为 Base 的 10%-30%）
- Equity：股票/期权（视公司阶段而定）
- Benefits：福利（五险一金/401k/商业保险/假期等）

注意：
- 输出为市场参考区间，非精确报价
- 不同国家/地区的福利体系差异很大，须单独说明
- 薪酬建议不得基于性别、年龄等受保护特征做差异化

${COMPLIANCE_BLOCK}
`.trim(),

  userPromptTemplate: `
【职位】{{jobTitle}}
【行业】{{industry}}
【国家/地区】{{country}}
【候选人经验年限】{{experienceYears}} 年
【期望货币】{{currency}}

请提供该职位在当地市场的薪酬参考区间，包括 Base / Bonus / Equity 范围和典型福利清单。
`.trim(),

  outputFormat: `
输出严格使用 JSON 格式：
{
  "breakdown": {
    "baseMin": 0,
    "baseMax": 0,
    "bonusMin": 0,
    "bonusMax": 0,
    "equityMin": 0,
    "equityMax": 0,
    "benefits": ["...", "..."],
    "totalMin": 0,
    "totalMax": 0,
    "currency": "{{currency}}"
  },
  "marketNote": "...",
  "sourceNote": "..."
}
`.trim(),

  complianceConstraints: [
    "薪酬建议不得因受保护特征而差异化",
    "须标注'此为市场参考，实际薪酬须人工确认'",
    "不得承诺具体薪酬数字",
  ],
}

// ============================================================
// Module 6 — 风险预警 Prompt
// ============================================================

export const PROMPT_RISK: PromptTemplate = {
  id: "risk-check-v1",
  module: "risk",
  name: "风险预警分析",
  version: "1.0.0",

  systemPrompt: `
你是一位招聘合规风险分析专家，负责识别招聘流程中的各类风险信号。

风险类型：
- data_trust：候选人数据可信度低（信息缺失/矛盾）
- authorization：数据授权状态异常（过期/撤销/未知）
- engagement：候选人参与度低（长期不回复）
- process：流程超时（面试/Offer 反馈超时）
- operation：操作风险（重复邀请、信息未核实）
- compliance：合规风险（GDPR/PIPL 约束）

风险等级：
- critical：须立即处理，否则可能造成合规或品牌损失
- high：建议 48 小时内处理
- medium：建议一周内处理
- low： informational，无需紧急处理

${COMPLIANCE_BLOCK}
`.trim(),

  userPromptTemplate: `
【风险分析上下文】
候选人国家：{{candidateCountry}}
候选人活跃度：{{candidateActivity}}
面试请求发出至今：{{interviewDaysSinceRequest}} 天
Offer 发出至今：{{offerDaysSinceSent}} 天
是否已发送过邀请：{{alreadyInvited}}
数据可信度：{{dataTrustLevel}}%
授权状态：{{authorizationStatus}}

请根据以上信息，识别所有潜在风险，输出结构化风险预警列表。
`.trim(),

  outputFormat: `
输出严格使用 JSON 格式：
{
  "alerts": [
    {
      "id": "risk_...",
      "type": "...",
      "level": "critical|high|medium|low",
      "title": "...",
      "description": "...",
      "suggestion": "...",
      "relatedEntityType": "candidate|company|job",
      "relatedEntityId": "..."
    }
  ]
}
`.trim(),

  complianceConstraints: [
    "风险分析不得基于受保护特征",
    "须明确区分'已确认风险'和'待核实风险'",
    "高风险项须提供具体处置建议",
  ],
}

// ============================================================
// Module 7 — 候选人摘要生成 Prompt
// ============================================================

export const PROMPT_SUMMARY: PromptTemplate = {
  id: "candidate-summary-v1",
  module: "summary",
  name: "候选人摘要生成",
  version: "1.0.0",

  systemPrompt: `
你是一位专业的候选人档案摘要专家，负责将候选人的多源信息（简历、论文、专利、项目经历）整理为结构化摘要，帮助招聘人员快速判断匹配度。

摘要要求：
- 一句话亮点（oneLinePitch）：15-25 字，突出最核心价值
- 关键优势（3-5 条）：具体、可验证
- 潜在顾虑（2-3 条）：须有依据，不得臆测
- 建议适配角色：基于候选人能力的具体岗位建议
- 建议下一步行动：明确、可操作

${COMPLIANCE_BLOCK}
`.trim(),

  userPromptTemplate: `
【候选人档案】
姓名：{{candidateName}}
当前职位：{{candidateTitle}}
国家：{{candidateCountry}}
经验年限：{{experienceYears}} 年

【详细信息】
{{candidateProfile}}

请生成该候选人的结构化摘要。
`.trim(),

  outputFormat: `
输出严格使用 JSON 格式：
{
  "oneLinePitch": "...",
  "keyStrengths": ["...", "...", "..."],
  "potentialConcerns": ["...", "..."],
  "suggestedRoles": ["...", "..."],
  "recommendedNextAction": "..."
}
`.trim(),

  complianceConstraints: [
    "摘要须基于可验证信息，不得臆测",
    "潜在顾虑须有依据，不得基于偏见",
    "摘要仅供内部参考，不得用于对外评价",
  ],
}

// ============================================================
// 导出所有模板（按模块索引）
// ============================================================

export const PROMPTS_BY_MODULE: Record<string, PromptTemplate[]> = {
  recommend: [PROMPT_RECOMMEND],
  invitation: [PROMPT_INVITATION],
  interview: [PROMPT_INTERVIEW],
  assessment: [PROMPT_ASSESSMENT],
  salary: [PROMPT_SALARY],
  risk: [PROMPT_RISK],
  summary: [PROMPT_SUMMARY],
}

/** 获取指定模块的默认（最新版本）prompt 模板 */
export function getDefaultPrompt(module: PromptTemplate["module"]): PromptTemplate {
  const templates = PROMPTS_BY_MODULE[module]
  if (!templates || templates.length === 0) {
    throw new Error(`No prompt template found for module: ${module}`)
  }
  // 返回版本号最高的模板
  return templates.sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }))[0]
}
