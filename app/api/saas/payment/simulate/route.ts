// POST /api/saas/payment/simulate — 模拟支付

import { NextRequest, NextResponse } from "next/server"
import { simulatePayment } from "@/lib/services/subscription-service"
import type { SimulatePaymentRequest, PaymentMethod } from "@/lib/saas/types"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderId, method, shouldSucceed } = body

    if (!orderId || !method) {
      return NextResponse.json({ error: "缺少必填参数：orderId, method" }, { status: 400 })
    }

    const validMethods: PaymentMethod[] = ["stripe", "paddle", "alipay", "wechat_pay", "mock"]
    if (!validMethods.includes(method as PaymentMethod)) {
      return NextResponse.json({ error: "不支持的支付方式" }, { status: 400 })
    }

    const request: SimulatePaymentRequest = {
      orderId,
      method: method as PaymentMethod,
      shouldSucceed: shouldSucceed !== false,
    }

    const result = await simulatePayment(request)
    if (result.error) {
      return NextResponse.json(result, { status: 400 })
    }
    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "模拟支付失败" }, { status: 500 })
  }
}
