import { NextRequest, NextResponse } from "next/server"
import {
  generateInterviewQuestions,
  simulateThinkTime,
  type QuestionDomain,
} from "@/lib/ai/provider"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jobTitle, jobIndustry, candidateName, domain } = body

    if (!jobTitle || !jobIndustry || !candidateName) {
      return NextResponse.json(
        { error: "缺少必要参数: jobTitle, jobIndustry, candidateName" },
        { status: 400 }
      )
    }

    const validDomains: QuestionDomain[] = [
      "general",
      "wind",
      "lithium",
      "management",
      "technical",
    ]
    const domainParam: QuestionDomain = validDomains.includes(domain) ? domain : "general"

    await simulateThinkTime()
    const result = await generateInterviewQuestions(jobTitle, jobIndustry, candidateName, domainParam)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "AI 面试问题生成失败", detail: String(error) },
      { status: 500 }
    )
  }
}
