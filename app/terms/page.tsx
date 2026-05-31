"use client"

import { TechShell, PageHeader } from "@/components/tech/tech-shell"
import { TechCard } from "@/components/tech/tech-card"

export default function TermsPage() {
  return (
    <TechShell showGrid showGlow>
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <PageHeader title="用户协议" description="使用平台前请仔细阅读以下条款" />
        <TechCard>
          <div className="prose prose-invert max-w-none text-sm text-slate-300 space-y-4">
            <h2 className="text-white text-lg font-semibold">1. 服务说明</h2>
            <p>全球风能锂电人才搜索雷达（以下简称"本平台"）是一个 AI 驱动的全球新能源人才搜索与招聘管理平台，旨在连接风能、锂电、储能行业的高端人才与企业机会。</p>

            <h2 className="text-white text-lg font-semibold">2. 用户责任</h2>
            <p>用户应提供真实、准确的注册信息。用户不得利用平台进行违法活动，包括但不限于：发布虚假招聘信息、滥用候选人数据、基于受保护特征进行歧视性筛选、未经授权爬取平台数据。</p>

            <h2 className="text-white text-lg font-semibold">3. 反歧视条款</h2>
            <p>本平台严禁基于性别、年龄、种族、宗教、婚育状况、残障、国籍或任何其他受法律保护的特征对候选人进行筛选或排序。国家/地区筛选仅可用于工作地点匹配、时区协调和跨境招聘合规管理。</p>

            <h2 className="text-white text-lg font-semibold">4. 知识产权</h2>
            <p>平台的名称、logo、设计元素、代码均为平台所有。用户上传的内容（如岗位描述、候选人履历）的知识产权归用户所有，但平台有权在提供服务所需的范围内使用。</p>

            <h2 className="text-white text-lg font-semibold">5. 服务变更与终止</h2>
            <p>我们保留在必要时修改或终止服务的权利。重大变更将提前 30 天通知用户。用户可随时停止使用本平台并删除账户。</p>

            <h2 className="text-white text-lg font-semibold">6. 免责声明</h2>
            <p>平台提供的 AI 分析和建议仅供参考，不构成招聘决策依据。平台对候选人数据的准确性不做绝对保证，建议用户通过官方渠道进行二次核验。</p>

            <h2 className="text-white text-lg font-semibold">7. 适用法律</h2>
            <p>本协议适用中华人民共和国法律。因本协议产生的争议，双方应友好协商解决。</p>
          </div>
        </TechCard>
      </div>
    </TechShell>
  )
}
