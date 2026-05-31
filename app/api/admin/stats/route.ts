import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

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
  // Mock mode: no database configured
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ data: MOCK_ADMIN_STATS, error: null })
  }

  try {
    const [
      totalUsers, totalCandidates, totalCompanies, totalJobs,
      totalInvitations, activeInterviews, openJobs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.candidate.count(),
      prisma.company.count(),
      prisma.job.count(),
      prisma.invitation.count(),
      prisma.interview.count({ where: { status: { in: ["scheduled", "confirmed"] } } }),
      prisma.job.count({ where: { status: "open" } }),
    ])

    return NextResponse.json({
      data: {
        totalUsers,
        totalCandidates,
        totalCompanies,
        totalJobs,
        totalInvitations,
        activeInterviews,
        openJobs,
        source: "db",
      },
      error: null,
    })
  } catch (err: any) {
    return NextResponse.json({
      data: { ...MOCK_ADMIN_STATS, source: "mock" },
      error: null,
    })
  }
}
