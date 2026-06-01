import { NextRequest, NextResponse } from "next/server"
import { getAuditLogs } from "@/lib/services/data-service"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const params = {
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("pageSize") || "50"),
  }
  const result = await getAuditLogs(params)
  return NextResponse.json(result)
}
