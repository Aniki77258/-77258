import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/services/data-service"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { templateName, senderId, receiverId, receiverEmail, subject, body: emailBody, metadata } = body

    if (!templateName || !senderId || !receiverId || !receiverEmail || !subject || !emailBody) {
      return NextResponse.json(
        { error: "templateName, senderId, receiverId, receiverEmail, subject, body are required" },
        { status: 400 }
      )
    }

    // Simulate a short delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    const result = await sendEmail({
      templateName,
      senderId,
      receiverId,
      receiverEmail,
      subject,
      body: emailBody,
      metadata: metadata || {},
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, data: result.data, message: "邮件已模拟发送成功（Mock — 未接入真实邮件服务）" },
      { status: 201 }
    )
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
