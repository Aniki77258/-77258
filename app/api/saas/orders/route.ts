// GET /api/saas/orders?userId=xxx — 获取订单列表
// GET /api/saas/orders?id=xxx — 获取单个订单

import { NextRequest, NextResponse } from "next/server"
import { getOrders, getOrderById } from "@/lib/services/subscription-service"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")

    if (id) {
      const result = await getOrderById(id)
      return NextResponse.json(result)
    }

    const result = await getOrders(userId || undefined)
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "查询订单失败" }, { status: 500 })
  }
}
