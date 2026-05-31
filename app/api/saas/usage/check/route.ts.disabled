// POST /api/saas/usage/check — 检查额度是否充足

import { NextRequest, NextResponse } from "next/server"
import { checkUsage } from "@/lib/services/subscription-service"
import type { UsageResource } from "@/lib/saas/types"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, resource, quantity } = body

    if (!userId || !resource) {
      return NextResponse.json({ error: "缺少 userId 或 resource 参数" }, { status: 400 })
    }

    const validResources: UsageResource[] = [
      "search", "candidate_view", "invitation", "ai_report", "contact_unlock", "message"
    ]
    if (!validResources.includes(resource as UsageResource)) {
      return NextResponse.json({ error: `无效的资源类型: ${resource}` }, { status: 400 })
    }

    const result = await checkUsage(userId, resource as UsageResource, quantity || 1)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "额度检查失败" }, { status: 500 })
  }
}
