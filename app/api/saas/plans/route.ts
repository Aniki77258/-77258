// GET /api/saas/plans — 获取所有套餐
// GET /api/saas/plans?role=company — 按角色过滤

import { NextRequest, NextResponse } from "next/server"
import { getPlans, getPlanByKey } from "@/lib/services/subscription-service"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get("key")
    const role = searchParams.get("role")

    if (key) {
      const result = await getPlanByKey(key)
      return NextResponse.json(result)
    }

    const result = await getPlans(role || undefined)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "加载套餐失败" }, { status: 500 })
  }
}
