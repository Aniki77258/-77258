import { NextRequest, NextResponse } from "next/server"
import { generateAssessment, simulateThinkTime } from "@/lib/ai/provider"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { candidateName, candidateTitle, jobTitle, industry } = body

    if (!candidateName || !jobTitle || !industry) {
      return NextResponse.json(
        { error: "缺少必要参数: candidateName, jobTitle, industry" },
        { status: 400 }
      )
    }

    if (!["wind", "lithium", "both"].includes(industry)) {
      return NextResponse.json(
        { error: "industry 必须是 wind, lithium 或 both" },
        { status: 400 }
      )
    }

    await simulateThinkTime()
    const result = await generateAssessment(
      candidateName,
      candidateTitle || "",
      jobTitle,
      industry
    )

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "AI 评估报告生成失败", detail: String(error) },
      { status: 500 }
    )
  }
}
