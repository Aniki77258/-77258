import { NextResponse } from "next/server"

const MOCK_ADMIN_STATS = {
  totalUsers: 11,
  totalCandidates: 5,
  totalCompanies: 2,
  totalJobs: 4,
  totalInvitations: 5,
  activeInterviews: 3,
  openJobs: 4,
  source: "mock",
}

export async function GET() {
  // Always return mock data (no database in Vercel deployment)
  return NextResponse.json({ data: { ...MOCK_ADMIN_STATS, source: "mock" }, error: null })
}
