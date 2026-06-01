import { NextRequest, NextResponse } from "next/server"
import { getJobs, createJob } from "@/lib/services/data-service"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const params = {
    keyword: searchParams.get("keyword") || undefined,
    industry: searchParams.get("industry") || undefined,
    country: searchParams.get("country") || undefined,
    status: searchParams.get("status") || undefined,
    companyId: searchParams.get("companyId") || undefined,
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("pageSize") || "20"),
  }
  const result = await getJobs(params)
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await createJob(body)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json(result, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
