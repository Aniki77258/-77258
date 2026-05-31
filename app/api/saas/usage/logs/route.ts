// GET /api/saas/usage/logs?userId=xxx — 获取额度使用记录

import { NextRequest, NextResponse } from "next/server"
import { getUsageLogs } from "@/lib/services/subscription-service"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    const limit = parseInt(searchParams.get("limit") || "50")

    const result = await getUsageLogs(userId || undefined, limit)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "查询使用记录失败" }, { status: 500 })
  }
}
