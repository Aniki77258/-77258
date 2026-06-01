import { NextRequest, NextResponse } from "next/server"
import {
  recommendCandidates,
  simulateThinkTime,
} from "@/lib/ai/provider"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jobTitle, jobIndustry, jobRequirements, jobId } = body

    if (!jobTitle || !jobIndustry || !jobId) {
      return NextResponse.json(
        { error: "缺少必要参数: jobTitle, jobIndustry, jobId" },
        { status: 400 }
      )
    }

    await simulateThinkTime()
    const result = await recommendCandidates(
      jobTitle,
      jobIndustry,
      jobRequirements || [],
      jobId
    )

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "AI 推荐生成失败", detail: String(error) },
      { status: 500 }
    )
  }
}
