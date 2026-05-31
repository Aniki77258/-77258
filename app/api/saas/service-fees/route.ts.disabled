// GET /api/saas/service-fees — 获取服务费列表（猎头场景）

import { NextRequest, NextResponse } from "next/server"
import { getServiceFees } from "@/lib/services/subscription-service"

export async function GET(_req: NextRequest) {
  try {
    const result = await getServiceFees()
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "查询服务费失败" }, { status: 500 })
  }
}
