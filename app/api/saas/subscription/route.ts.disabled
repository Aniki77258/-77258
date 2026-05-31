// GET /api/saas/subscription?userId=xxx — 获取用户当前订阅
// GET /api/saas/subscription?all=true — 获取所有订阅（admin）

import { NextRequest, NextResponse } from "next/server"
import { getUserSubscription, getAllSubscriptions } from "@/lib/services/subscription-service"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const all = searchParams.get("all")

    if (all === "true") {
      const result = await getAllSubscriptions()
      return NextResponse.json(result)
    }

    if (!userId) {
      return NextResponse.json({ error: "缺少 userId 参数" }, { status: 400 })
    }

    const result = await getUserSubscription(userId)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "查询订阅失败" }, { status: 500 })
  }
}
