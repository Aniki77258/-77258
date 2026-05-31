// prisma/seed.js — 全球风能锂电人才搜索雷达 种子数据
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  console.log("=== 开始播种种子数据 ===\n")

  // ============================================================
  // 1. 创建用户
  // ============================================================
  console.log("1. 创建用户...")

  const admin = await prisma.user.upsert({
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

  const companyUser1 = await prisma.user.upsert({
    where: { email: "hr@demo-solar.cn" },
    update: {},
    create: {
      id: "u_company_001",
      name: "张明辉",
      email: "hr@demo-solar.cn",
      password: "company123",
      role: "company",
      company: "光伏科技集团(演示)",
      country: "中国",
      industry: "lithium",
    },
  })

  const companyUser2 = await prisma.user.upsert({
    where: { email: "hr@demo-windpower.cn" },
    update: {},
    create: {
      id: "u_company_002",
      name: "李风电",
      email: "hr@demo-windpower.cn",
      password: "company123",
      role: "company",
      company: "金风新能源技术(演示)",
      country: "中国",
      industry: "wind",
    },
  })

  const candidateUser1 = await prisma.user.upsert({
    where: { email: "lixiaofeng@demo-tech.org" },
    update: {},
    create: {
      id: "u_candidate_001",
      name: "李晓风",
      email: "lixiaofeng@demo-tech.org",
      password: "candidate123",
      role: "candidate",
      country: "美国",
      industry: "wind",
    },
  })

  const candidateUser2 = await prisma.user.upsert({
    where: { email: "zhangwei@demo-university.cn" },
    update: {},
    create: {
      id: "u_candidate_002",
      name: "张伟",
      email: "zhangwei@demo-university.cn",
      password: "candidate123",
      role: "candidate",
      country: "中国",
      industry: "lithium",
    },
  })

  const headhunter = await prisma.user.upsert({
    where: { email: "hunter@demo-headhunter.cn" },
    update: {},
    create: {
      id: "u_headhunter_001",
      name: "王猎头",
      email: "hunter@demo-headhunter.cn",
      password: "hunter123",
      role: "headhunter",
      company: "顶尖猎头机构",
      country: "中国",
      industry: "both",
    },
  })

  const expert = await prisma.user.upsert({
    where: { email: "professor@demo-university.cn" },
    update: {},
    create: {
      id: "u_expert_001",
      name: "陈教授",
      email: "professor@demo-university.cn",
      password: "expert123",
      role: "expert",
      country: "中国",
      industry: "lithium",
    },
  })

  // Extra candidates
  for (let i = 3; i <= 8; i++) {
    const names = [
      "M. Schmidt", "田中一郎", "A. Kumar", "王芳", "P. Nielsen",
      "E. Johnson",
    ]
    const emails = [
      "schmidt@demo-eu-uni.edu", "tanaka@demo-jp-uni.ac.jp", "kumar@demo-in-uni.ac.in",
      "wangfang@demo-university.cn", "nielsen@demo-eu-uni.edu", "johnson@demo-research-lab.org",
    ]
    const countries = ["德国", "日本", "印度", "中国", "丹麦", "美国"]
    const industries = ["wind", "lithium", "lithium", "both", "wind", "wind"]
    const idx = i - 3

    await prisma.user.upsert({
      where: { email: emails[idx] },
      update: {},
      create: {
        id: `u_candidate_00${i}`,
        name: names[idx],
        email: emails[idx],
        password: "candidate123",
        role: "candidate",
        country: countries[idx],
        industry: industries[idx],
      },
    })
  }

  console.log("   ✓ 用户创建完成 (11 users)")

  // ============================================================
  // 2. 创建候选人档案
  // ============================================================
  console.log("2. 创建候选人档案...")

  const candidates = [
    {
      userId: "u_candidate_001",
      name: "李晓风",
      email: "lixiaofeng@demo-tech.org",
      phone: "+1-617-555-0101",
      title: "风机载荷仿真专家",
      summary: "MIT 博士，10+年风机载荷仿真经验，发表SCI论文30+篇",
      country: "美国",
      city: "波士顿",
      industry: "wind",
      experienceYears: 12,
      currentCompany: "Global Wind Technologies(演示)",
      currentPosition: "Senior Principal Engineer",
      education: JSON.stringify([
        { degree: "博士", school: "MIT", major: "航空航天工程", year: 2014 },
        { degree: "硕士", school: "清华大学", major: "工程力学", year: 2010 },
      ]),
      skills: JSON.stringify([
        "风机载荷仿真", "CFD计算", "气动弹性分析", "MATLAB", "ANSYS",
        "海上风电", "IEC标准", "Python",
      ]),
      languages: JSON.stringify(["中文(母语)", "英语(流利)", "德语(基础)"]),
      publications: JSON.stringify([
        { title: "Aeroelastic analysis of 15MW offshore wind turbine blades", year: 2023, journal: "Renewable Energy" },
        { title: "Wind turbine load prediction using ML", year: 2022, journal: "Wind Energy" },
      ]),
      githubUrl: "https://github.com/lixf-wind",
      linkedinUrl: "https://linkedin.com/in/lixf-wind",
      scholarUrl: "https://scholar.google.com/citations?user=lixf",
      availability: "1month",
      expectedSalary: "$180K-$220K",
      willingRelocate: true,
      verified: true,
      score: 96,
      rank: 1,
      source: "openalex",
    },
    {
      userId: "u_candidate_002",
      name: "张伟",
      email: "zhangwei@demo-university.cn",
      phone: "+86-138-0000-0002",
      title: "固态电池电解质研发负责人",
      summary: "清华大学博士，8年固态电池研发经验，多项核心专利",
      country: "中国",
      city: "北京",
      industry: "lithium",
      experienceYears: 8,
      currentCompany: "锂能科技(演示)",
      currentPosition: "高级研发经理",
      education: JSON.stringify([
        { degree: "博士", school: "清华大学", major: "材料科学与工程", year: 2018 },
      ]),
      skills: JSON.stringify([
        "固态电解质", "锂电池", "电化学", "SEM/TEM", "XRD",
        "EIS测试", "BMS算法", "Python",
      ]),
      languages: JSON.stringify(["中文(母语)", "英语(流利)"]),
      publications: JSON.stringify([
        { title: "LLZO solid electrolyte interface engineering", year: 2024, journal: "Nature Energy" },
      ]),
      patents: JSON.stringify(["固态电解质制备方法 CN2024XXXXX", "锂金属负极保护层 CN2024XXXXX"]),
      linkedinUrl: "https://linkedin.com/in/zhangwei-battery",
      availability: "3months",
      expectedSalary: "¥800K-¥1.2M",
      willingRelocate: false,
      verified: true,
      score: 92,
      rank: 3,
      source: "manual",
    },
    {
      userId: "u_candidate_003",
      name: "M. Schmidt",
      email: "schmidt@demo-eu-uni.edu",
      phone: "+49-89-555-0103",
      title: "海上风电基础设计专家",
      summary: "慕尼黑工业大学博士，15年海上风电基础设计经验",
      country: "德国",
      city: "慕尼黑",
      industry: "wind",
      experienceYears: 15,
      currentCompany: "Siemens Wind(演示)",
      currentPosition: "Chief Engineer - Foundations",
      education: JSON.stringify([
        { degree: "博士", school: "TUM", major: "土木工程", year: 2011 },
      ]),
      skills: JSON.stringify([
        "海上风电基础", "单桩设计", "导管架", "漂浮式", "FEM",
        "地质勘察", "DNV标准", "ABAQUS",
      ]),
      languages: JSON.stringify(["德语(母语)", "英语(流利)", "中文(基础)"]),
      publications: JSON.stringify([
        { title: "Monopile foundation optimization for deep water", year: 2023, journal: "Marine Structures" },
      ]),
      githubUrl: "https://github.com/mschmidt-offshore",
      availability: "immediate",
      expectedSalary: "€150K-€180K",
      willingRelocate: true,
      verified: true,
      score: 94,
      rank: 2,
      source: "openalex",
    },
    {
      userId: "u_candidate_004",
      name: "田中一郎",
      email: "tanaka@demo-jp-uni.ac.jp",
      phone: "+81-75-555-0104",
      title: "BMS 电池管理系统首席架构师",
      summary: "京都大学博士，12年BMS研发经验，松下/Panasonic背景",
      country: "日本",
      city: "京都",
      industry: "lithium",
      experienceYears: 12,
      currentCompany: "Panasonic Energy",
      currentPosition: "BMS Chief Architect",
      education: JSON.stringify([
        { degree: "博士", school: "京都大学", major: "电气工程", year: 2014 },
      ]),
      skills: JSON.stringify([
        "BMS架构", "SOC/SOH估算", "卡尔曼滤波", "嵌入式C", "CAN总线",
        "功能安全", "ISO26262", "Python",
      ]),
      languages: JSON.stringify(["日语(母语)", "英语(流利)"]),
      linkedinUrl: "https://linkedin.com/in/tanaka-bms",
      availability: "1month",
      expectedSalary: "¥15M-¥20M",
      willingRelocate: true,
      verified: true,
      score: 90,
      rank: 4,
      source: "manual",
    },
    {
      userId: "u_candidate_005",
      name: "A. Kumar",
      email: "kumar@iitd.ac.in",
      phone: "+91-11-555-0105",
      title: "储能系统集成总监",
      summary: "IIT Delhi 博士，10年储能系统设计与集成经验",
      country: "印度",
      city: "新德里",
      industry: "lithium",
      experienceYears: 10,
      currentCompany: "Tata Power",
      currentPosition: "Director - Energy Storage",
      education: JSON.stringify([
        { degree: "博士", school: "IIT Delhi", major: "电力系统", year: 2016 },
      ]),
      skills: JSON.stringify([
        "储能系统集成", "BESS", "PCS", "EMS", "电力市场",
        "光伏+储能", "微电网", "MATLAB/Simulink",
      ]),
      languages: JSON.stringify(["印地语(母语)", "英语(流利)"]),
      availability: "3months",
      expectedSalary: "$120K-$160K",
      willingRelocate: true,
      verified: false,
      score: 87,
      rank: 5,
      source: "linkedin",
    },
    {
      userId: "u_candidate_006",
      name: "王芳",
      email: "wangfang@sjtu.edu.cn",
      phone: "+86-139-0000-0006",
      title: "叶片复合材料设计高工",
      summary: "上海交通大学博士，9年风电叶片复合材料研发经验",
      country: "中国",
      city: "上海",
      industry: "wind",
      experienceYears: 9,
      currentCompany: "中材科技",
      currentPosition: "叶片材料技术总监",
      education: JSON.stringify([
        { degree: "博士", school: "上海交通大学", major: "复合材料", year: 2017 },
      ]),
      skills: JSON.stringify([
        "复合材料", "叶片设计", "玻璃纤维", "碳纤维", "真空灌注",
        "疲劳测试", "有限元分析", "CATIA",
      ]),
      languages: JSON.stringify(["中文(母语)", "英语(工作)"]),
      availability: "1month",
      expectedSalary: "¥600K-¥900K",
      willingRelocate: false,
      verified: true,
      score: 89,
      rank: 6,
      source: "manual",
    },
    {
      userId: "u_candidate_007",
      name: "P. Nielsen",
      email: "nielsen@dtu.dk",
      phone: "+45-45-555-0107",
      title: "风资源评估与微观选址专家",
      summary: "DTU 博士，12年风资源评估与风场微观选址经验",
      country: "丹麦",
      city: "哥本哈根",
      industry: "wind",
      experienceYears: 12,
      currentCompany: "Vestas",
      currentPosition: "Senior Wind Resource Analyst",
      education: JSON.stringify([
        { degree: "博士", school: "DTU", major: "大气科学", year: 2014 },
      ]),
      skills: JSON.stringify([
        "风资源评估", "微观选址", "WAsP", "WindPRO", "CFD",
        "激光雷达", "测风塔", "Python", "R",
      ]),
      languages: JSON.stringify(["丹麦语(母语)", "英语(流利)", "德语(基础)"]),
      availability: "immediate",
      expectedSalary: "DKK 900K-1.1M",
      willingRelocate: true,
      verified: true,
      score: 91,
      rank: 7,
      source: "openalex",
    },
    {
      userId: "u_candidate_008",
      name: "E. Johnson",
      email: "johnson@nrel.gov",
      phone: "+1-303-555-0108",
      title: "风储协同控制专家",
      summary: "NREL 资深研究员，8年风储协同控制与电网集成经验",
      country: "美国",
      city: "丹佛",
      industry: "both",
      experienceYears: 8,
      currentCompany: "NREL",
      currentPosition: "Senior Research Engineer",
      education: JSON.stringify([
        { degree: "博士", school: "Stanford", major: "电力电子", year: 2018 },
      ]),
      skills: JSON.stringify([
        "风储协同", "电网集成", "PSCAD", "DIgSILENT", "RTDS",
        "储能控制", "IEEE标准", "Python", "C++",
      ]),
      languages: JSON.stringify(["英语(母语)", "西班牙语(基础)"]),
      githubUrl: "https://github.com/ejohnson-windstorage",
      linkedinUrl: "https://linkedin.com/in/ejohnson-nrel",
      availability: "1month",
      expectedSalary: "$160K-$200K",
      willingRelocate: true,
      verified: true,
      score: 88,
      rank: 8,
      source: "openalex",
    },
  ]

  for (const c of candidates) {
    await prisma.candidate.upsert({
      where: { userId: c.userId },
      update: {},
      create: c,
    })
  }
  console.log("   ✓ 候选人档案创建完成 (8 candidates)")

  // ============================================================
  // 3. 创建企业档案
  // ============================================================
  console.log("3. 创建企业档案...")

  const company1 = await prisma.company.upsert({
    where: { userId: "u_company_001" },
    update: {},
    create: {
      userId: "u_company_001",
      name: "中国光伏科技集团",
      description: "全球领先的光伏与储能解决方案提供商，年营收超500亿",
      website: "https://www.cnpv.com",
      industry: "lithium",
      country: "中国",
      city: "北京",
      size: "1000+",
      verified: true,
    },
  })

  const company2 = await prisma.company.upsert({
    where: { userId: "u_company_002" },
    update: {},
    create: {
      userId: "u_company_002",
      name: "金风科技",
      description: "全球风电整机龙头企业，累计装机容量超100GW",
      website: "https://www.goldwind.com",
      industry: "wind",
      country: "中国",
      city: "乌鲁木齐",
      size: "1000+",
      verified: true,
    },
  })
  console.log("   ✓ 企业档案创建完成 (2 companies)")

  // ============================================================
  // 4. 创建职位
  // ============================================================
  console.log("4. 创建职位...")

  const jobs = [
    {
      title: "海上风电高级工程师",
      description: "负责海上风电场基础结构设计与优化，参与漂浮式风电项目",
      requirements: JSON.stringify(["10年以上经验", "DNV/API标准", "FEM经验"]),
      location: "上海/远程",
      country: "中国",
      industry: "wind",
      salaryMin: 600000,
      salaryMax: 900000,
      companyId: company2.id,
      postedById: "u_company_002",
    },
    {
      title: "固态电池研发总监",
      description: "领导固态电池电解质材料研发团队，推动下一代电池技术产业化",
      requirements: JSON.stringify(["博士学历", "8年以上经验", "固态电解质专利优先"]),
      location: "北京",
      country: "中国",
      industry: "lithium",
      salaryMin: 800000,
      salaryMax: 1500000,
      companyId: company1.id,
      postedById: "u_company_001",
    },
    {
      title: "BMS 系统架构师",
      description: "设计新一代电池管理系统架构，支持800V高压平台",
      requirements: JSON.stringify(["5年以上BMS经验", "ISO26262", "嵌入式开发"]),
      location: "深圳",
      country: "中国",
      industry: "lithium",
      salaryMin: 500000,
      salaryMax: 800000,
      companyId: company1.id,
      postedById: "u_company_001",
    },
    {
      title: "风资源评估工程师",
      description: "负责风电场风资源评估与微观选址，支持全球项目开发",
      requirements: JSON.stringify(["3年以上经验", "WAsP/WindPRO", "Python"]),
      location: "北京/哥本哈根",
      country: "中国",
      industry: "wind",
      salaryMin: 300000,
      salaryMax: 500000,
      companyId: company2.id,
      postedById: "u_company_002",
    },
  ]

  for (const j of jobs) {
    await prisma.job.create({ data: j })
  }
  console.log("   ✓ 职位创建完成 (4 jobs)")

  // ============================================================
  // 5. 创建通知
  // ============================================================
  console.log("5. 创建通知...")

  const notifications = [
    {
      userId: "u_admin_001",
      title: "系统初始化完成",
      message: "全球风能锂电人才搜索雷达已成功部署，数据库种子数据已加载",
      type: "success",
      read: false,
    },
    {
      userId: "u_admin_001",
      title: "新候选人注册",
      message: "有3位新候选人完成注册，来自德国、日本和印度",
      type: "info",
      read: false,
    },
    {
      userId: "u_company_001",
      title: "候选人匹配提醒",
      message: "固态电池研发总监职位匹配到2位高价值候选人",
      type: "info",
      read: false,
      link: "/candidates?job=固态电池",
    },
  ]

  for (const n of notifications) {
    await prisma.notification.create({ data: n })
  }
  console.log("   ✓ 通知创建完成 (3 notifications)")

  // ============================================================
  // 汇总
  // ============================================================
  const userCount = await prisma.user.count()
  const candidateCount = await prisma.candidate.count()
  const companyCount = await prisma.company.count()
  const jobCount = await prisma.job.count()
  const notificationCount = await prisma.notification.count()

  console.log("\n=== 种子数据播种完成 ===")
  console.log(`  Users:         ${userCount}`)
  console.log(`  Candidates:    ${candidateCount}`)
  console.log(`  Companies:     ${companyCount}`)
  console.log(`  Jobs:          ${jobCount}`)
  console.log(`  Notifications: ${notificationCount}`)
  console.log("\n测试账号：")
  console.log("  admin@globaltalentradar.com / admin123 (管理员)")
  console.log("  lixf@mit.edu / candidate123 (候选人)")
  console.log("  hr@cnpv.com / company123 (企业用户)")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
