import { NextRequest, NextResponse } from "next/server"
import {
  generateInvitation,
  simulateThinkTime,
  type InvitationStyle,
} from "@/lib/ai/provider"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { candidateName, candidateTitle, jobTitle, companyName, style } = body

    if (!candidateName || !jobTitle || !companyName) {
      return NextResponse.json(
        { error: "缺少必要参数: candidateName, jobTitle, companyName" },
        { status: 400 }
      )
    }

    const validStyles: InvitationStyle[] = ["formal", "concise", "international", "headhunter"]
    const styleParam: InvitationStyle = validStyles.includes(style) ? style : "formal"

    await simulateThinkTime()
    const result = await generateInvitation(candidateName, candidateTitle, jobTitle, companyName, styleParam)

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "AI 邀请文案生成失败", detail: String(error) },
      { status: 500 }
    )
  }
}
