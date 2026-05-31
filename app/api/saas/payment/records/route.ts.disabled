// GET /api/saas/payment/records?userId=xxx — 获取支付记录

import { NextRequest, NextResponse } from "next/server"
import { getPayments } from "@/lib/services/subscription-service"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    const result = await getPayments(userId || undefined)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "查询支付记录失败" }, { status: 500 })
  }
}
