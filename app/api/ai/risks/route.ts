import { NextRequest, NextResponse } from "next/server"
import { checkRisks, simulateThinkTime } from "@/lib/ai/provider"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    await simulateThinkTime()
    const result = await checkRisks({
      candidateCountry: body.candidateCountry,
      candidateActivity: body.candidateActivity,
      interviewDaysSinceRequest: body.interviewDaysSinceRequest,
      offerDaysSinceSent: body.offerDaysSinceSent,
      alreadyInvited: body.alreadyInvited,
      dataTrustLevel: body.dataTrustLevel,
      authorizationStatus: body.authorizationStatus,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "AI 风险检查失败", detail: String(error) },
      { status: 500 }
    )
  }
}
