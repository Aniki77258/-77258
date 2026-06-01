import { NextResponse } from "next/server"
import { getDashboardStats } from "@/lib/services/data-service"

export async function GET() {
  const result = await getDashboardStats()
  return NextResponse.json(result)
}
