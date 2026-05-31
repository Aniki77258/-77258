import { NextRequest, NextResponse } from "next/server"
import { getConversations, sendMessage } from "@/lib/services/data-service"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") || "u_company_001"
  const result = await getConversations(userId)
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { conversationId, senderId, receiverId, subject, content } = body

    if (!conversationId || !senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: "conversationId, senderId, receiverId, content are required" },
        { status: 400 }
      )
    }

    const result = await sendMessage({ conversationId, senderId, receiverId, subject: subject || "", content })
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json(result, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
