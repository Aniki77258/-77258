"use client"

import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AIDisclaimer } from "@/components/shared/ai-disclaimer"
import {
  BotMessageSquare, Target, FileText, MessageSquare,
  FileCheck2, DollarSign, AlertTriangle, ArrowRight, Sparkles,
} from "lucide-react"

const aiFeatures = [
  {
    title: "AI 人才推荐",
    description: "根据岗位要求智能匹配候选人，输出推荐理由和风险提示",
    icon: Target,
    href: "/ai/recommend",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
  },
  {
    title: "AI 邀请文案",
    description: "根据候选人背景智能生成邀请文案，支持 4 种风格",
    icon: FileText,
    href: "/ai/invitation-text",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    title: "AI 面试问题",
    description: "根据岗位和候选人经历生成专业面试问题",
    icon: MessageSquare,
    href: "/ai/interview-questions",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    title: "AI 评估报告",
    description: "根据面试反馈生成多维度评估报告和推荐结论",
    icon: FileCheck2,
    href: "/ai/assessment",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  {
    title: "AI 薪酬建议",
    description: "根据岗位、地区、经验生成示例薪酬区间（多币种）",
    icon: DollarSign,
    href: "/ai/salary",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    title: "AI 风险预警",
    description: "自动检测数据可信度、合规风险、流程异常等 6 类风险",
    icon: AlertTriangle,
    href: "/ai/risks",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
]

export default function AIPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BotMessageSquare className="h-6 w-6 text-amber-400" />
          AI 招聘助手
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          智能辅助招聘流程的每一步 — 从人才搜索到 Offer 发放
        </p>
      </div>

      <AIDisclaimer />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {aiFeatures.map((feature) => (
          <Card
            key={feature.href}
            className={`border-white/10 bg-white/5 hover:bg-white/[0.07] transition cursor-pointer ${feature.border} hover:border-opacity-50`}
            onClick={() => router.push(feature.href)}
          >
            <CardHeader className="pb-3">
              <div className={`w-9 h-9 rounded-lg ${feature.bg} border ${feature.border} flex items-center justify-center mb-2`}>
                <feature.icon className={`h-4 w-4 ${feature.color}`} />
              </div>
              <CardTitle className="text-white text-base">{feature.title}</CardTitle>
              <CardDescription className="text-slate-400 text-xs">{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <a href={feature.href}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium ${feature.color} hover:bg-white/5 transition`}>
                <span>开始使用</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h3 className="text-white font-semibold text-sm">AI 功能使用说明</h3>
        </div>
        <ul className="space-y-2 text-xs text-slate-400">
          <li>• 所有 AI 功能均为 mock 数据，不调用外部 API，无需联网</li>
          <li>• 每个模块支持参数定制，模拟真实 AI 交互体验</li>
          <li>• AI 输出均标注「AI 生成建议，仅供参考」</li>
          <li>• 代码架构支持随时替换 mock 引擎为真实 AI SDK（OpenAI / Claude 等）</li>
          <li>• 替换真实 AI 只需实现相同接口并在 <code className="text-amber-400 bg-amber-500/10 px-1 rounded">lib/ai.ts</code> 中切换</li>
        </ul>
      </div>
    </div>
  )
}
