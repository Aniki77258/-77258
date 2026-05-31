import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
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
      data: {
        totalUsers: 11, totalCandidates: 8, totalCompanies: 2, totalJobs: 4,
        totalInvitations: 0, activeInterviews: 0, openJobs: 4, source: "mock",
      },
      error: null,
    })
  }
}
