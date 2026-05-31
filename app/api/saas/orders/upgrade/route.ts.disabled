// POST /api/saas/orders/upgrade — 创建升级订单

import { NextRequest, NextResponse } from "next/server"
import { createUpgradeOrder } from "@/lib/services/subscription-service"
import type { UpgradeSubscriptionRequest, BillingCycle } from "@/lib/saas/types"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userId, currentPlanId, targetPlanKey, billingCycle } = body

    if (!userId || !targetPlanKey || !billingCycle) {
      return NextResponse.json(
        { error: "缺少必填参数：userId, targetPlanKey, billingCycle" },
        { status: 400 }
      )
    }

    const validCycles: BillingCycle[] = ["monthly", "yearly"]
    if (!validCycles.includes(billingCycle as BillingCycle)) {
      return NextResponse.json({ error: "无效的计费周期" }, { status: 400 })
    }

    const request: UpgradeSubscriptionRequest = {
      targetPlanKey,
      billingCycle: billingCycle as BillingCycle,
    }

    const result = await createUpgradeOrder(userId, currentPlanId || "", request)
    if (result.error) {
      return NextResponse.json(result, { status: 400 })
    }
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "创建订单失败" }, { status: 500 })
  }
}
