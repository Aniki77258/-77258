import { NextRequest, NextResponse } from "next/server"
import { getFunnelTrendData } from "@/lib/services/analytics-service"
import type { TimeRange } from "@/lib/analytics/types"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const timeRange = (searchParams.get("timeRange") || "180d") as TimeRange
  const data = getFunnelTrendData({ timeRange })
  return NextResponse.json({ data, source: "mock", disclaimer: "所有数据为示例数据，不反映真实业务情况" })
}
