// prisma/seed.js — 全球风能锂电人才搜索雷达 最小种子数据
// 仅包含系统必需的测试账号，不含任何演示数据
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  console.log("=== 初始化系统账号 ===\n")

  // ============================================================
  // 1. 管理员账号
  // ============================================================
  await prisma.user.upsert({
    where: { email: "admin@globaltalentradar.com" },
    update: {},
    create: {
      id: "u_admin_001",
      name: "系统管理员",
      email: "admin@globaltalentradar.com",
      password: "admin123",
      role: "admin",
      country: "中国",
    },
  })
  console.log("   ✓ 管理员账号: admin@globaltalentradar.com / admin123")

  // ============================================================
  // 2. 老板账号
  // ============================================================
  await prisma.user.upsert({
    where: { email: "boss@globaltalentradar.com" },
    update: {},
    create: {
      id: "u_boss_001",
      name: "老板",
      email: "boss@globaltalentradar.com",
      password: "boss123",
      role: "admin",
      country: "中国",
    },
  })
  console.log("   ✓ 老板账号: boss@globaltalentradar.com / boss123")

  // ============================================================
  // 汇总
  // ============================================================
  const userCount = await prisma.user.count()
  const candidateCount = await prisma.candidate.count()
  const companyCount = await prisma.company.count()
  const jobCount = await prisma.job.count()

  console.log("\n=== 种子数据初始化完成 ===")
  console.log(`  Users:      ${userCount}`)
  console.log(`  Candidates: ${candidateCount}`)
  console.log(`  Companies:  ${companyCount}`)
  console.log(`  Jobs:       ${jobCount}`)
  console.log("\n  系统仅包含管理员和老板测试账号。")
  console.log("  所有业务数据（候选人、企业、职位、面试、评估等）需通过系统界面手动录入。")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
