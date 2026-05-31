import { NextRequest, NextResponse } from "next/server"
import { getCandidateById, updateCandidate } from "@/lib/services/data-service"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await getCandidateById(params.id)
  if (!result.data) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 })
  }
  return NextResponse.json(result)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const result = await updateCandidate(params.id, body)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
