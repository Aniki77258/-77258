import { NextRequest, NextResponse } from "next/server"
import { getMessages, markMessageRead } from "@/lib/services/data-service"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const conversationId = params.id
  const result = await getMessages(conversationId)
  return NextResponse.json(result)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { messageId } = body
    if (!messageId) {
      return NextResponse.json({ error: "messageId is required" }, { status: 400 })
    }
    const result = await markMessageRead(messageId)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
