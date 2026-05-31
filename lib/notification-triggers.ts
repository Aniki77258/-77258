// Notification Trigger System
// 在业务流程中自动触发通知
// Mock implementation — 后续可接入真实推送服务

export interface TriggerResult {
  success: boolean
  notificationId: string
  message: string
}

// ============================================================
// Trigger Scenarios
// ============================================================

/**
 * 场景1：发送邀请后通知候选人
 */
export function triggerInvitationSent(params: {
  companyName: string
  candidateName: string
  candidateUserId: string
  jobTitle: string
}): TriggerResult {
  const id = `notif_inv_${Date.now()}`
  return {
    success: true,
    notificationId: id,
    message: `已向 ${params.candidateName} 发送 ${params.jobTitle} 招聘邀请通知`,
  }
}

/**
 * 场景2：候选人接受邀请后通知企业
 */
export function triggerInvitationAccepted(params: {
  companyUserId: string
  candidateName: string
  jobTitle: string
}): TriggerResult {
  const id = `notif_acc_${Date.now()}`
  return {
    success: true,
    notificationId: id,
    message: `${params.candidateName} 已接受 ${params.jobTitle} 的邀请，请安排面试`,
  }
}

/**
 * 场景3：创建面试后通知双方
 */
export function triggerInterviewCreated(params: {
  companyUserId: string
  candidateUserId: string
  candidateName: string
  jobTitle: string
  interviewDate: string
  interviewType: string
}): TriggerResult {
  const id = `notif_intv_${Date.now()}`
  return {
    success: true,
    notificationId: id,
    message: `面试已创建：${params.jobTitle} • ${params.interviewType} • ${params.interviewDate}，已通知双方`,
  }
}

/**
 * 场景4：面试完成后通知评估人
 */
export function triggerInterviewCompleted(params: {
  expertUserId: string
  candidateName: string
  jobTitle: string
  score: number
}): TriggerResult {
  const id = `notif_intvc_${Date.now()}`
  return {
    success: true,
    notificationId: id,
    message: `${params.candidateName} 的 ${params.jobTitle} 面试已完成（评分 ${params.score}），请专家进行评估`,
  }
}

/**
 * 场景5：生成 Offer 后通知候选人
 */
export function triggerOfferGenerated(params: {
  candidateUserId: string
  candidateName: string
  jobTitle: string
  companyName: string
}): TriggerResult {
  const id = `notif_offer_${Date.now()}`
  return {
    success: true,
    notificationId: id,
    message: `${params.companyName} 已生成 ${params.jobTitle} 的 Offer，已通知 ${params.candidateName}`,
  }
}

/**
 * 场景6：审核驳回后通知用户
 */
export function triggerReviewRejected(params: {
  userId: string
  userName: string
  reviewType: string
  reason: string
}): TriggerResult {
  const id = `notif_rej_${Date.now()}`
  return {
    success: true,
    notificationId: id,
    message: `${params.reviewType} 审核已驳回，已通知 ${params.userName}。原因：${params.reason}`,
  }
}

/**
 * 额外场景：风险预警通知
 */
export function triggerRiskAlert(params: {
  userId: string
  candidateName: string
  riskLevel: "low" | "medium" | "high" | "critical"
  description: string
}): TriggerResult {
  const id = `notif_risk_${Date.now()}`
  return {
    success: true,
    notificationId: id,
    message: `风险预警（${params.riskLevel}）：${params.candidateName} — ${params.description}`,
  }
}

/**
 * 额外场景：评估报告生成通知
 */
export function triggerAssessmentCompleted(params: {
  userId: string
  candidateName: string
  score: number
  recommendation: string
}): TriggerResult {
  const id = `notif_asm_${Date.now()}`
  const recLabel = { strongly_recommend: "强烈推荐", recommend: "推荐", neutral: "中性", not_recommend: "不推荐" }
  return {
    success: true,
    notificationId: id,
    message: `${params.candidateName} 的评估报告已生成（综合评分 ${params.score}，${recLabel[params.recommendation as keyof typeof recLabel] || params.recommendation}）`,
  }
}

// ============================================================
// Trigger Map — 所有触发场景的注册表
// ============================================================
export const TRIGGER_SCENARIOS = [
  { id: "invitation_sent", label: "发送邀请 → 通知候选人", icon: "📨" },
  { id: "invitation_accepted", label: "接受邀请 → 通知企业", icon: "✅" },
  { id: "interview_created", label: "创建面试 → 通知双方", icon: "📅" },
  { id: "interview_completed", label: "面试完成 → 通知评估人", icon: "📝" },
  { id: "offer_generated", label: "生成 Offer → 通知候选人", icon: "💼" },
  { id: "review_rejected", label: "审核驳回 → 通知用户", icon: "❌" },
  { id: "risk_alert", label: "风险预警 → 通知企业", icon: "⚠️" },
  { id: "assessment_completed", label: "评估完成 → 通知双方", icon: "📊" },
]

// ============================================================
// Demo: Execute all triggers for demonstration
// ============================================================
export function executeAllDemoTriggers(): { scenario: string; result: TriggerResult }[] {
  return [
    {
      scenario: "发送邀请",
      result: triggerInvitationSent({
        companyName: "中国光伏科技集团",
        candidateName: "李晓风",
        candidateUserId: "u_candidate_001",
        jobTitle: "海上风电高级工程师",
      }),
    },
    {
      scenario: "候选人接受邀请",
      result: triggerInvitationAccepted({
        companyUserId: "u_company_001",
        candidateName: "李晓风",
        jobTitle: "海上风电高级工程师",
      }),
    },
    {
      scenario: "创建面试",
      result: triggerInterviewCreated({
        companyUserId: "u_company_001",
        candidateUserId: "u_candidate_001",
        candidateName: "张伟",
        jobTitle: "固态电池研发总监",
        interviewDate: "2026-06-05 14:00",
        interviewType: "技术面试",
      }),
    },
    {
      scenario: "面试完成",
      result: triggerInterviewCompleted({
        expertUserId: "u_expert_001",
        candidateName: "李晓风",
        jobTitle: "海上风电高级工程师",
        score: 92,
      }),
    },
    {
      scenario: "生成Offer",
      result: triggerOfferGenerated({
        candidateUserId: "u_candidate_003",
        candidateName: "M. Schmidt",
        jobTitle: "海上风电基础设计专家",
        companyName: "中国光伏科技集团",
      }),
    },
    {
      scenario: "审核驳回",
      result: triggerReviewRejected({
        userId: "u_company_001",
        userName: "王经理",
        reviewType: "职位审核",
        reason: "薪资范围不合理，请调整后重新提交",
      }),
    },
    {
      scenario: "风险预警",
      result: triggerRiskAlert({
        userId: "u_company_001",
        candidateName: "E. Johnson",
        riskLevel: "medium",
        description: "背景调查发现数据不一致",
      }),
    },
    {
      scenario: "评估报告完成",
      result: triggerAssessmentCompleted({
        userId: "u_company_001",
        candidateName: "M. Schmidt",
        score: 94,
        recommendation: "strongly_recommend",
      }),
    },
  ]
}
