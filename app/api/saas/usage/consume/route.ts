// POST /api/saas/usage/consume — 消费额度

import { NextRequest, NextResponse } from "next/server"
import { consumeUsage } from "@/lib/services/subscription-service"
import type { UsageResource } from "@/lib/saas/types"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, resource, quantity, targetId } = body

    if (!userId || !resource) {
      return NextResponse.json({ error: "缺少 userId 或 resource 参数" }, { status: 400 })
    }

    const result = await consumeUsage(
      userId,
      resource as UsageResource,
      quantity || 1,
      targetId
    )
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "额度消费失败" }, { status: 500 })
  }
}
