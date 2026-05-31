"use client"

import { TechShell, PageHeader } from "@/components/tech/tech-shell"
import { TechCard } from "@/components/tech/tech-card"
import { ComplianceNotice } from "@/components/tech/compliance-notice"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <TechShell showGrid showGlow>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <PageHeader
          title="隐私政策"
          description="我们如何收集、使用和保护您的个人数据"
        />
        <TechCard>
          <div className="prose prose-invert max-w-none text-sm text-slate-300 space-y-4">
            <h2 className="text-white text-lg font-semibold">1. 信息收集</h2>
            <p>我们收集的信息包括您主动提供的注册信息（姓名、邮箱、所在国家、行业）以及平台使用过程中产生的行为数据（搜索记录、浏览偏好）。所有候选人公开数据均来自授权的公开渠道（学术论文、专利数据库、技术社区等）。</p>

            <h2 className="text-white text-lg font-semibold">2. 信息使用</h2>
            <p>您的个人信息仅用于提供和改善平台服务，包括：人才搜索与匹配、招聘流程管理、AI 分析建议、平台功能优化。我们不会将您的个人信息出售给第三方。</p>

            <h2 className="text-white text-lg font-semibold">3. 数据存储与安全</h2>
            <p>您的数据存储在加密服务器上，传输过程使用 TLS 加密。我们采取行业标准的安全措施保护您的数据免受未经授权的访问、修改或披露。</p>

            <h2 className="text-white text-lg font-semibold">4. 数据控制权</h2>
            <p>您对自己的数据拥有完全控制权。您可以随时查看、修改、导出或删除您的数据。删除请求将在 7 个工作日内完成处理。</p>

            <h2 className="text-white text-lg font-semibold">5. Cookie 政策</h2>
            <p>我们使用必要的 Cookie 来维持平台运行（如登录状态保持）。我们不会使用追踪性 Cookie 进行广告投放或用户行为分析。</p>

            <h2 className="text-white text-lg font-semibold">6. 跨境数据传输</h2>
            <p>作为全球平台，您的数据可能在您所在国家/地区以外的服务器上处理。我们遵守 GDPR、CCPA 和 PIPL 等国际数据保护法规。</p>

            <h2 className="text-white text-lg font-semibold">7. 联系方式</h2>
            <p>如有隐私相关问题，请联系：privacy@windlithium-radar.com</p>
          </div>
        </TechCard>
      </div>
    </TechShell>
  )
}
