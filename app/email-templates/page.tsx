"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/lib/auth"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EMAIL_TEMPLATES } from "@/lib/services/data-service"
import type { EmailTemplateRecord } from "@/lib/services/data-service"
import {
  Mail, Send, Copy, Check, X, Eye, ChevronLeft, AlertTriangle, Loader2,
  FileText, Calendar, Shield, FileCheck, FileX, Clock
} from "lucide-react"

// ============================================================
// Template icon & color mapping
// ============================================================
const TEMPLATE_META: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  invitation: { icon: Send, color: "text-blue-400", bgColor: "bg-blue-500/10" },
  interview_confirm: { icon: Calendar, color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
  interview_reschedule: { icon: Clock, color: "text-yellow-400", bgColor: "bg-yellow-500/10" },
  offer: { icon: FileText, color: "text-orange-400", bgColor: "bg-orange-500/10" },
  review_pass: { icon: FileCheck, color: "text-green-400", bgColor: "bg-green-500/10" },
  review_reject: { icon: FileX, color: "text-red-400", bgColor: "bg-red-500/10" },
}

// ============================================================
// Mock render: replace {{variables}} with demo values
// ============================================================
const DEMO_VALUES: Record<string, string> = {
  candidateName: "李晓风",
  companyName: "中国光伏科技集团",
  jobTitle: "海上风电高级工程师",
  industryField: "海上风电与载荷仿真",
  highlightArea: "风机载荷仿真与CFD计算",
  personalizedMessage: "您的博士研究成果在风机气动弹性耦合领域产生了重要影响，我们相信您的加入将为团队带来巨大的技术提升。",
  location: "上海 / 远程",
  salaryRange: "¥600K-¥900K / 年",
  jobType: "全职",
  expiryDate: "2026-06-15",
  senderName: "王经理",
  contactEmail: "hr@cnpv.com",
  interviewType: "技术面试",
  interviewDate: "2026-06-05",
  interviewTime: "14:00-15:00",
  durationMinutes: "60",
  locationType: "视频面试",
  isOnline: "true",
  meetingLink: "https://teams.microsoft.com/l/meetup/xxxxx",
  interviewerName: "陈博士",
  interviewerTitle: "首席工程师 / 前Siemens Gamesa技术总监",
  interviewAgenda: "1. 自我介绍（5分钟）\n2. 风机载荷仿真技术深度讨论（25分钟）\n3. 项目案例分享（15分钟）\n4. 团队协作与领导力考察（10分钟）\n5. Q&A（5分钟）",
  preparationMinutes: "10",
  originalDate: "2026-06-02",
  originalTime: "10:00",
  newDate: "2026-06-05",
  newTime: "14:00",
  rescheduleReason: "面试官因紧急项目评审需要调整时间，对此表示诚挚歉意",
  reportTo: "技术副总裁",
  startDate: "2026-08-01",
  baseSalary: "¥750,000 / 年",
  bonus: "绩效奖金（目标20%，最高可达30%）",
  equity: "0.5% 期权（4年归属，1年cliff）",
  benefits: "五险一金、补充商业保险、年度体检、弹性工作制、远程办公支持、培训基金¥20K/年、专利奖金¥50K/项",
  requiredDocuments: "• 身份证/护照复印件\n• 最高学历学位证书\n• 离职证明（如适用）\n• 近期体检报告\n• 银行卡信息（用于薪酬发放）",
  recipientName: "王经理",
  reviewType: "企业认证审核",
  submittedAt: "2026-05-28 09:30",
  reviewedAt: "2026-05-29 16:00",
  reviewComment: "提交材料齐全，企业资质认证通过。贵司在光伏与储能领域的技术实力和行业地位获得了审核委员会的一致认可。",
  grantedAccess: "• 发布和管理职位信息\n• 搜索和筛选全球风能锂电人才库\n• 向候选人发送招聘邀请\n• 管理面试、评估和Offer流程\n• 使用AI招聘助手功能",
  rejectReason: "营业执照经营范围与申报行业（风能装备制造）不匹配，且缺少相关资质证书。",
  nextSteps: "1. 请核实营业执照经营范围是否涵盖风能装备制造\n2. 补充提交相关行业资质证书（如ISO 9001、风电设备制造许可等）\n3. 修改后重新提交审核\n4. 如有疑问，请联系平台客服：support@globaltalentradar.com",
}

function renderTemplate(template: string): string {
  let rendered = template
  for (const [key, value] of Object.entries(DEMO_VALUES)) {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, "g"), value)
    rendered = rendered.replace(new RegExp(`{{#if ${key}}}`, "g"), "")
    rendered = rendered.replace(new RegExp(`{{/if}}`, "g"), "")
  }
  return rendered
}

// ============================================================
// Component
// ============================================================
export default function EmailTemplatesPage() {
  const { user } = useAuth()
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateRecord | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [sendResult, setSendResult] = useState<{ templateId: string; success: boolean; message: string } | null>(null)

  const handleCopy = useCallback((templateId: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(templateId)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const handleMockSend = useCallback(async (template: EmailTemplateRecord) => {
    setSendingId(template.id)
    setSendResult(null)

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSendingId(null)
    setSendResult({
      templateId: template.id,
      success: true,
      message: `邮件「${template.subject.replace(/{{.+?}}/g, (m) => DEMO_VALUES[m.slice(2, -2)] || m)}」已模拟发送成功（Mock — 未接入真实邮件服务）`,
    })

    setTimeout(() => setSendResult(null), 4000)
  }, [])

  // Template preview modal
  if (selectedTemplate) {
    const meta = TEMPLATE_META[selectedTemplate.name] || TEMPLATE_META.invitation
    const renderedSubject = selectedTemplate.subject.replace(/{{.+?}}/g, (m) => DEMO_VALUES[m.slice(2, -2)] || m)
    const renderedBody = renderTemplate(selectedTemplate.bodyTemplate)

    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Back button */}
          <button
            onClick={() => setSelectedTemplate(null)}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            返回模板列表
          </button>

          {/* Template Header */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.bgColor}`}>
              <meta.icon className={`w-5 h-5 ${meta.color}`} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{selectedTemplate.label}</h1>
              <p className="text-xs text-slate-500">{selectedTemplate.description}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleMockSend(selectedTemplate)}
              disabled={sendingId === selectedTemplate.id}
              className="bg-sky-500 hover:bg-sky-600 text-white text-xs"
            >
              {sendingId === selectedTemplate.id ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  模拟发送中...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 mr-1" />
                  模拟发送
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(selectedTemplate.id, renderedBody)}
              className="text-slate-400 hover:text-white text-xs"
            >
              {copiedId === selectedTemplate.id ? (
                <><Check className="w-3.5 h-3.5 mr-1" />已复制</>
              ) : (
                <><Copy className="w-3.5 h-3.5 mr-1" />复制正文</>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTemplate(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5 mr-1" />关闭
            </Button>
          </div>

          {/* Send Result */}
          {sendResult && sendResult.templateId === selectedTemplate.id && (
            <div className={`p-3 rounded-lg text-xs border ${
              sendResult.success
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
              {sendResult.message}
            </div>
          )}

          {/* Email Preview */}
          <Card className="bg-[#0a1120] border-white/5 overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400" />
                邮件预览
              </CardTitle>
              <CardDescription className="text-[10px]">以下为模板填充 Demo 数据后的效果预览</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">主题</span>
                <p className="text-sm text-white mt-1 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                  {renderedSubject}
                </p>
              </div>

              {/* Variables */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">模板变量 ({selectedTemplate.variables.length})</span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {selectedTemplate.variables.map((v) => (
                    <span key={v} className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded">
                      {`{{${v}}}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">正文</span>
                <div className="mt-1 bg-white/[0.02] border border-white/5 rounded-lg p-4 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto font-mono text-xs">
                  {renderedBody}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    )
  }

  // Template list view
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Mail className="w-6 h-6 text-sky-400" />
          <div>
            <h1 className="text-xl font-bold text-white">邮件模板</h1>
            <p className="text-xs text-slate-500">招聘流程邮件模板管理与预览 — 共 {EMAIL_TEMPLATES.length} 个模板</p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/15">
          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-500/80">
            <p className="font-medium mb-0.5">Mock 模式说明</p>
            <p>当前邮件系统为模板预览模式，未接入真实邮件服务。点击「发送」仅记录操作日志，不会实际发送邮件。</p>
            <p className="mt-1">后续可通过替换 <code className="bg-yellow-500/10 px-1 rounded">lib/services/data-service.ts</code> 中的 <code className="bg-yellow-500/10 px-1 rounded">sendEmail</code> 函数接入 Resend、SendGrid 或 SMTP 服务。</p>
          </div>
        </div>

        {/* Template Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EMAIL_TEMPLATES.map((tpl) => {
            const meta = TEMPLATE_META[tpl.name] || TEMPLATE_META.invitation
            return (
              <Card
                key={tpl.id}
                className="bg-[#0a1120] border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                onClick={() => setSelectedTemplate(tpl)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${meta.bgColor}`}>
                        <meta.icon className={`w-4 h-4 ${meta.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-sm text-white">{tpl.label}</CardTitle>
                        <CardDescription className="text-[10px] mt-0.5">{tpl.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Subject preview */}
                  <div className="bg-white/[0.03] rounded-lg px-3 py-2 text-[11px] text-slate-400 truncate border border-white/5">
                    {tpl.subject.replace(/{{.+?}}/g, (m) => DEMO_VALUES[m.slice(2, -2)] || m)}
                  </div>

                  {/* Variables count */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-600">
                      {tpl.variables.length} 个变量
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedTemplate(tpl)
                      }}
                      className="text-[10px] text-sky-400 hover:text-sky-300 p-0 h-auto"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      预览与发送
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Integration Guide */}
        <Card className="bg-[#0a1120] border-white/5">
          <CardHeader>
            <CardTitle className="text-sm text-white">邮件服务接入指南</CardTitle>
            <CardDescription className="text-[10px]">替换 Mock 层接入真实邮件服务</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
                <p className="font-medium text-slate-300 mb-1">方案一：Resend（推荐，最简单的 API）</p>
                <code className="text-[10px] text-purple-400 whitespace-pre-wrap">
                  npm install resend{'\n'}
                  // lib/services/email-real.ts{'\n'}
                  // import {'{'} Resend {'}'} from 'resend'{'\n'}
                  // const resend = new Resend(process.env.RESEND_API_KEY){'\n'}
                  // await resend.emails.send({'{}'} from, to, subject, html {'}'})
                </code>
              </div>
              <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
                <p className="font-medium text-slate-300 mb-1">方案二：SendGrid</p>
                <code className="text-[10px] text-purple-400 whitespace-pre-wrap">
                  npm install @sendgrid/mail{'\n'}
                  // sgMail.setApiKey(process.env.SENDGRID_API_KEY){'\n'}
                  // await sgMail.send({'{}'} to, from, subject, html {'}'})
                </code>
              </div>
              <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5">
                <p className="font-medium text-slate-300 mb-1">方案三：自建 SMTP（Nodemailer）</p>
                <code className="text-[10px] text-purple-400 whitespace-pre-wrap">
                  npm install nodemailer{'\n'}
                  // const transporter = nodemailer.createTransport({'{}'} host, port, auth {'}'}){'\n'}
                  // await transporter.sendMail({'{}'} from, to, subject, html {'}'})
                </code>
              </div>
              <p className="text-[10px] text-slate-600 mt-2">
                接入方式：创建 <code className="bg-slate-800 px-1 rounded">lib/services/email-real.ts</code> 实现相同接口，
                替换 <code className="bg-slate-800 px-1 rounded">data-service.ts</code> 中的 <code className="bg-slate-800 px-1 rounded">sendEmail</code> 函数引用。
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-[10px] text-slate-600 pb-8">
          邮件模板预览 • 未接入真实邮件服务
        </div>
      </div>
    </AppLayout>
  )
}
