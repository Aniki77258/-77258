// GET /api/saas/stats — 获取商业统计数据（admin）

import { NextRequest, NextResponse } from "next/server"
import { getCommerceStats } from "@/lib/services/subscription-service"

export async function GET(_req: NextRequest) {
  try {
    const result = await getCommerceStats()
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "查询商业统计失败" }, { status: 500 })
  }
}
