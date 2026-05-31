import { NextRequest, NextResponse } from "next/server"
import { getCountryDistribution } from "@/lib/services/analytics-service"

export async function GET(_req: NextRequest) {
  const data = getCountryDistribution()
  return NextResponse.json({ data, source: "mock", disclaimer: "所有数据为示例数据，不反映真实业务情况" })
}
