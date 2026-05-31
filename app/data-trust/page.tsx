"use client"

import { TechShell, PageHeader } from "@/components/tech/tech-shell"
import { ComplianceNotice } from "@/components/tech/compliance-notice"

export default function DataTrustPage() {
  return (
    <TechShell showGrid showGlow>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <PageHeader
          title="数据真实性中心"
          description="我们如何确保平台数据的可信、透明和合规"
        />
        <div className="mt-8">
          <ComplianceNotice variant="full" />
        </div>
      </div>
    </TechShell>
  )
}
