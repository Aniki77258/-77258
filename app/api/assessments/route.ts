import { NextRequest, NextResponse } from "next/server"
import { getAssessments, createAssessment } from "@/lib/services/data-service"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const params = {
    candidateId: searchParams.get("candidateId") || undefined,
    status: searchParams.get("status") || undefined,
    page: parseInt(searchParams.get("page") || "1"),
    pageSize: parseInt(searchParams.get("pageSize") || "20"),
  }
  const result = await getAssessments(params)
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await createAssessment(body)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json(result, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
