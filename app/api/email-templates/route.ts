import { NextRequest, NextResponse } from "next/server"
import { getEmailTemplates, getEmailTemplateByName } from "@/lib/services/data-service"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get("name")

  if (name) {
    const result = getEmailTemplateByName(name)
    return NextResponse.json(result)
  }

  const result = getEmailTemplates()
  return NextResponse.json(result)
}
