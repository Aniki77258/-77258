import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Powerful demo data initializer — creates a complete end-to-end recruitment workflow
// Idempotent: safe to call multiple times (upsert everywhere)
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const forceReset = body.forceReset === true

    // Check if demo data already exists
    const existingCandidates = await prisma.candidate.count()
    if (!forceReset && existingCandidates >= 5) {
      const stats = await getDemoStats()
      return NextResponse.json({
        success: true,
        message: `演示数据已存在（${stats.candidates} 位候选人，${stats.companies} 家企业，${stats.jobs} 个职位，${stats.invitations} 个邀请，${stats.offers} 个Offer）`,
        data: stats,
        demoFlow: getDemoFlowSteps(),
      })
    }

    if (forceReset) {
      await cleanDemoData()
    }

    // ========================
    // 1. Create / Upsert Users
    // ========================
    const users = [
      { id: "demo_u_admin", name: "系统管理员", email: "admin@globaltalentradar.com", password: "admin123", role: "admin" },
      { id: "demo_u_company_cnpv", name: "张明辉", email: "hr@demo-solar.cn", password: "company123", role: "company", company: "中国光伏科技集团(演示)", country: "中国", industry: "lithium" },
      { id: "demo_u_company_env", name: "远景HR李", email: "hr@demo-envision.cn", password: "company123", role: "company", company: "远景能源(演示)", country: "中国", industry: "both" },
      { id: "demo_u_candidate_lxf", name: "李晓风", email: "lixiaofeng@demo-tech.org", password: "candidate123", role: "candidate", country: "美国", industry: "wind" },
      { id: "demo_u_candidate_wc", name: "王储能", email: "wangcn@demo-university.cn", password: "candidate123", role: "candidate", country: "中国", industry: "lithium" },
      { id: "demo_u_candidate_cf", name: "陈风电", email: "chen@demo-offshore.dk", password: "candidate123", role: "candidate", country: "丹麦", industry: "wind" },
      { id: "demo_u_candidate_zb", name: "张BMS", email: "zhangbms@demo-huawei.cn", password: "candidate123", role: "candidate", country: "中国", industry: "lithium" },
      { id: "demo_u_candidate_sm", name: "Sarah Mueller", email: "smueller@demo-vestas.dk", password: "candidate123", role: "candidate", country: "德国", industry: "wind" },
      { id: "demo_u_headhunter", name: "王猎头", email: "hunter@demo-headhunter.cn", password: "hunter123", role: "headhunter", company: "顶尖猎头机构(演示)", country: "中国", industry: "both" },
      { id: "demo_u_expert", name: "陈教授", email: "professor@demo-university.cn", password: "expert123", role: "expert", country: "中国", industry: "lithium" },
    ]

    const userMap: Record<string, any> = {}
    for (const u of users) {
      const record = await prisma.user.upsert({
        where: { email: u.email },
        update: { name: u.name, password: u.password, role: u.role, company: u.company, country: u.country, industry: u.industry },
        create: { ...u },
      })
      userMap[u.email] = record
    }

    // ========================
    // 2. Create / Upsert Companies
    // ========================
    const companies = [
      { name: "中国光伏科技集团(演示)", description: "国内领先的光伏与储能一体化企业，业务覆盖光伏电站、储能系统、锂电制造", website: "https://www.example-demo.cn", industry: "lithium", country: "中国", city: "上海", size: "1000+", verified: true, userId: userMap["hr@demo-solar.cn"].id },
      { name: "远景能源(演示)", description: "全球领先的绿色科技企业，业务涵盖智能风机、储能、动力电池", website: "https://www.example-envision.cn", industry: "both", country: "中国", city: "上海", size: "1000+", verified: true, userId: userMap["hr@demo-envision.cn"].id },
    ]

    const companyMap: any[] = []
    for (const c of companies) {
      const userId = c.userId
      const record = await prisma.company.upsert({
        where: { userId },
        update: { name: c.name, description: c.description, website: c.website, industry: c.industry, country: c.country, city: c.city, size: c.size, verified: c.verified },
        create: { ...c, id: `demo_comp_${companyMap.length + 1}` },
      })
      companyMap.push(record)
    }

    // ========================
    // 3. Create / Upsert Candidates
    // ========================
    const candidates = [
      {
        name: "李晓风", title: "风电叶片结构高级工程师", email: "lixiaofeng@demo-tech.org", phone: "+1-617-xxx-xxxx",
        summary: "麻省理工学院博士后，10年风电叶片设计与制造经验，主导开发新一代碳纤维叶片技术",
        country: "美国", city: "波士顿", industry: "wind", experienceYears: 10,
        currentCompany: "MIT Energy Initiative", currentPosition: "博士后研究员",
        education: JSON.stringify([{ school: "MIT", degree: "博士后", field: "复合材料力学", year: 2022 }, { school: "清华大学", degree: "博士", field: "工程力学", year: 2019 }]),
        skills: JSON.stringify(["风电叶片设计", "碳纤维复合材料", "有限元分析", "ANSYS", "流体力学", "结构优化"]),
        languages: JSON.stringify(["中文(母语)", "英语(流利)"]),
        publications: JSON.stringify(["Advanced Composite Materials for Wind Turbine Blades - Nature Energy 2023"]),
        patents: JSON.stringify(["CN20231001xxxx - 一种风电叶片碳纤维预浸料制备方法"]),
        score: 95, rank: 1, source: "openalex", verified: true, userId: userMap["lixiaofeng@demo-tech.org"].id,
      },
      {
        name: "王储能", title: "锂电池研发总监", email: "wangcn@demo-university.cn",
        summary: "清华大学博士，15年锂电池研发经验，前CATL技术专家，拥有多项固态电池核心专利",
        country: "中国", city: "北京", industry: "lithium", experienceYears: 15,
        currentCompany: "清华大学", currentPosition: "副教授",
        education: JSON.stringify([{ school: "清华大学", degree: "博士", field: "电化学", year: 2010 }]),
        skills: JSON.stringify(["固态电池", "正极材料", "电芯设计", "BMS", "电化学测试", "产线工艺"]),
        languages: JSON.stringify(["中文(母语)", "英语(工作)", "日语(基本)"]),
        publications: JSON.stringify(["Solid-State Battery Interface Engineering - Advanced Materials 2024"]),
        patents: JSON.stringify(["CN20241002xxxx - 一种固态电解质界面修饰方法"]),
        score: 93, rank: 2, source: "manual", verified: true, userId: userMap["wangcn@demo-university.cn"].id,
      },
      {
        name: "陈风电", title: "海上风电项目经理", email: "chen@demo-offshore.dk",
        summary: "丹麦技术大学硕士，8年海上风电项目经验，曾负责1.2GW海上风场建设",
        country: "丹麦", city: "哥本哈根", industry: "wind", experienceYears: 8,
        currentCompany: "Orsted(演示)", currentPosition: "高级项目经理",
        education: JSON.stringify([{ school: "丹麦技术大学", degree: "硕士", field: "风电工程", year: 2018 }]),
        skills: JSON.stringify(["海上风电", "项目管理", "供应链管理", "风机安装", "海上施工", "运维管理"]),
        languages: JSON.stringify(["英语(流利)", "丹麦语(工作)", "中文(母语)"]),
        score: 88, rank: 3, source: "linkedin", verified: true, userId: userMap["chen@demo-offshore.dk"].id,
      },
      {
        name: "张BMS", title: "BMS系统架构师", email: "zhangbms@demo-huawei.cn",
        summary: "浙江大学博士，主导开发多款车规级BMS系统，熟悉功能安全ISO 26262",
        country: "中国", city: "深圳", industry: "lithium", experienceYears: 12,
        currentCompany: "华为数字能源(演示)", currentPosition: "BMS首席架构师",
        education: JSON.stringify([{ school: "浙江大学", degree: "博士", field: "电力电子", year: 2013 }]),
        skills: JSON.stringify(["BMS架构", "功能安全", "SOC/SOH算法", "CAN通信", "嵌入式开发", "ASPICE"]),
        languages: JSON.stringify(["中文(母语)", "英语(工作)"]),
        score: 91, rank: 4, source: "github", verified: true, userId: userMap["zhangbms@demo-huawei.cn"].id,
      },
      {
        name: "Sarah Mueller", title: "Wind Resource Assessment Expert", email: "smueller@demo-vestas.dk",
        summary: "German wind energy expert with 14 years experience in resource assessment and site selection",
        country: "德国", city: "汉堡", industry: "wind", experienceYears: 14,
        currentCompany: "Vestas(演示)", currentPosition: "Senior Wind Analyst",
        education: JSON.stringify([{ school: "University of Stuttgart", degree: "博士", field: "大气物理学", year: 2012 }]),
        skills: JSON.stringify(["Wind Resource", "CFD Modeling", "WAsP", "WindPRO", "Site Assessment"]),
        languages: JSON.stringify(["德语(母语)", "英语(流利)"]),
        score: 89, rank: 5, source: "openalex", verified: true, userId: userMap["smueller@demo-vestas.dk"].id,
      },
    ]

    const candidateMap: any[] = []
    for (const c of candidates) {
      const userId = c.userId
      const existing = await prisma.candidate.findUnique({ where: { userId } })
      if (existing) {
        await prisma.candidate.update({ where: { id: existing.id }, data: c })
        candidateMap.push(existing)
      } else {
        const record = await prisma.candidate.create({ data: { ...c, id: `demo_cand_${candidateMap.length + 1}` } })
        candidateMap.push(record)
      }
    }

    // ========================
    // 4. Create / Upsert Jobs
    // ========================
    const jobs = [
      { title: "风电叶片结构工程师", description: "负责大型风电叶片结构设计与优化，要求硕士及以上学历，5年以上相关经验", requirements: JSON.stringify(["硕士及以上", "5年风电叶片经验", "精通ANSYS/Abaqus", "复合材料知识"]), location: "上海", country: "中国", industry: "wind", salaryMin: 400000, salaryMax: 700000, salaryCurrency: "CNY", type: "full-time", status: "open", companyId: companyMap[0].id, postedById: userMap["hr@demo-solar.cn"].id },
      { title: "固态电池研发专家", description: "负责固态电池技术路线规划与核心材料开发", requirements: JSON.stringify(["博士学历", "电化学/材料背景", "3年以上固态电池经验"]), location: "深圳", country: "中国", industry: "lithium", salaryMin: 600000, salaryMax: 1200000, salaryCurrency: "CNY", type: "full-time", status: "open", companyId: companyMap[0].id, postedById: userMap["hr@demo-solar.cn"].id },
      { title: "BMS高级工程师", description: "负责储能BMS系统设计与开发，熟悉功能安全标准", requirements: JSON.stringify(["本科及以上", "5年BMS开发经验", "熟悉ISO 26262", "精通C/C++"]), location: "深圳", country: "中国", industry: "lithium", salaryMin: 350000, salaryMax: 600000, salaryCurrency: "CNY", type: "full-time", status: "open", companyId: companyMap[1].id, postedById: userMap["hr@demo-envision.cn"].id },
      { title: "海上风电项目经理", description: "负责欧洲海上风电项目全生命周期管理", requirements: JSON.stringify(["硕士及以上", "8年风电项目管理", "英语流利", "PMP认证优先"]), location: "汉堡", country: "德国", industry: "wind", salaryMin: 80000, salaryMax: 130000, salaryCurrency: "EUR", type: "full-time", status: "open", companyId: companyMap[1].id, postedById: userMap["hr@demo-envision.cn"].id },
    ]

    const jobMap: any[] = []
    for (let i = 0; i < jobs.length; i++) {
      const j = jobs[i]
      const existing = await prisma.job.findFirst({ where: { title: j.title, companyId: j.companyId } })
      if (existing) {
        await prisma.job.update({ where: { id: existing.id }, data: j })
        jobMap.push(existing)
      } else {
        const record = await prisma.job.create({ data: { ...j, id: `demo_job_${i + 1}` } })
        jobMap.push(record)
      }
    }

    const now = Date.now()

    // ========================
    // 5. Create Invitations (完整闭环)
    // ========================
    // 李晓风: 邀请→已接受→面试完成→评估通过→谈判中→已发Offer→已接受 (完整正向流程)
    // 王储能: 邀请→已接受→面试已安排 (进行中)
    // 陈风电: 邀请→待接受 (新邀请)
    // 张BMS: 邀请→已拒绝 (演示拒绝流程)
    // Sarah: 邀请→已接受→面试完成→评估通过→Offer已发 (演示接近完成)

    const invitations = [
      // 李晓风 - 完整流程 (风电叶片工程师)
      { candidateId: candidateMap[0].id, jobId: jobMap[0].id, companyId: companyMap[0].id, senderId: userMap["hr@demo-solar.cn"].id, receiverId: candidateMap[0].userId, status: "accepted", message: "李博士您好！我们非常欣赏您在风电叶片领域的深厚经验，诚邀您加入我们的团队，担任风电叶片结构工程师一职。", respondedAt: new Date(now - 5 * 24 * 60 * 60 * 1000) },
      // 王储能 - 进行中 (固态电池研发专家)
      { candidateId: candidateMap[1].id, jobId: jobMap[1].id, companyId: companyMap[0].id, senderId: userMap["hr@demo-solar.cn"].id, receiverId: candidateMap[1].userId, status: "accepted", message: "王博士您好！您在固态电池领域的专利成果令人印象深刻，诚邀您加入我们的研发团队。", respondedAt: new Date(now - 3 * 24 * 60 * 60 * 1000) },
      // 陈风电 - 待接受 (海上风电项目经理)
      { candidateId: candidateMap[2].id, jobId: jobMap[3].id, companyId: companyMap[1].id, senderId: userMap["hr@demo-envision.cn"].id, receiverId: candidateMap[2].userId, status: "pending", message: "Chen先生您好！我们在海上风电项目管理方面需要像您这样经验丰富的人才，期待您的回复。", respondedAt: null as any },
      // 张BMS - 已拒绝 (演示拒绝)
      { candidateId: candidateMap[3].id, jobId: jobMap[2].id, companyId: companyMap[1].id, senderId: userMap["hr@demo-envision.cn"].id, receiverId: candidateMap[3].userId, status: "rejected", message: "张先生您好！我们在BMS开发方面需要您的专业能力，诚邀您加入我们的团队。", respondedAt: new Date(now - 7 * 24 * 60 * 60 * 1000) },
      // Sarah - 完整流程 (风能领域专家)
      { candidateId: candidateMap[4].id, jobId: jobMap[3].id, companyId: companyMap[1].id, senderId: userMap["hr@demo-envision.cn"].id, receiverId: candidateMap[4].userId, status: "accepted", message: "Sarah, your expertise in wind resource assessment is exactly what we need for our European offshore projects. We would love to have you on board.", respondedAt: new Date(now - 10 * 24 * 60 * 60 * 1000) },
    ]

    const invitationMap: any[] = []
    for (let i = 0; i < invitations.length; i++) {
      const inv = invitations[i]
      const existing = await prisma.invitation.findFirst({
        where: { candidateId: inv.candidateId, jobId: inv.jobId, companyId: inv.companyId }
      })
      if (existing) {
        await prisma.invitation.update({ where: { id: existing.id }, data: inv })
        invitationMap.push(existing)
      } else {
        const record = await prisma.invitation.create({ data: { ...inv, id: `demo_inv_${i + 1}`, expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000) } })
        invitationMap.push(record)
      }
    }

    // ========================
    // 6. Create Interviews
    // ========================
    const interviews = [
      // 李晓风 - 面试已完成 (评分95)
      { candidateId: candidateMap[0].id, jobId: jobMap[0].id, companyId: companyMap[0].id, scheduledById: userMap["hr@demo-solar.cn"].id, interviewer: "张明辉 & 技术总监", type: "video", status: "completed", scheduledAt: new Date(now - 4 * 24 * 60 * 60 * 1000), durationMin: 90, location: "视频会议", notes: "李博士在碳纤维复合材料方面展示出深厚功底，技术分享非常精彩", feedback: JSON.stringify({ technical: 95, communication: 90, cultural: 92, overall: 95, comments: "非常优秀的候选人，建议尽快推进下一轮" }), score: 95, completedAt: new Date(now - 4 * 24 * 60 * 60 * 1000) },
      // 王储能 - 面试已安排 (待进行)
      { candidateId: candidateMap[1].id, jobId: jobMap[1].id, companyId: companyMap[0].id, scheduledById: userMap["hr@demo-solar.cn"].id, interviewer: "张明辉 & 研发副总裁", type: "video", status: "scheduled", scheduledAt: new Date(now + 2 * 24 * 60 * 60 * 1000), durationMin: 60, location: "视频会议", notes: "请候选人准备30分钟的技术分享，主题为固态电池界面工程" },
      // Sarah - 面试已完成 (评分89)
      { candidateId: candidateMap[4].id, jobId: jobMap[3].id, companyId: companyMap[1].id, scheduledById: userMap["hr@demo-envision.cn"].id, interviewer: "Li HR & Offshore Director", type: "video", status: "completed", scheduledAt: new Date(now - 8 * 24 * 60 * 60 * 1000), durationMin: 60, location: "Video Call (Zoom)", notes: "Sarah has strong experience in wind resource assessment. Her CFD modeling skills are excellent.", feedback: JSON.stringify({ technical: 89, communication: 92, cultural: 90, overall: 89, comments: "Strong candidate for offshore project manager role" }), score: 89, completedAt: new Date(now - 8 * 24 * 60 * 60 * 1000) },
    ]

    const interviewMap: any[] = []
    for (let i = 0; i < interviews.length; i++) {
      const iv = interviews[i]
      const existing = await prisma.interview.findFirst({
        where: { candidateId: iv.candidateId, jobId: iv.jobId }
      })
      if (existing) {
        await prisma.interview.update({ where: { id: existing.id }, data: iv })
        interviewMap.push(existing)
      } else {
        const record = await prisma.interview.create({ data: { ...iv, id: `demo_intv_${i + 1}` } })
        interviewMap.push(record)
      }
    }

    // ========================
    // 7. Create Assessments
    // ========================
    const assessments = [
      // 李晓风 - 评估通过
      { candidateId: candidateMap[0].id, expertId: userMap["professor@demo-university.cn"].id, type: "technical", status: "completed", score: 95, dimensions: JSON.stringify([{ name: "技术深度", score: 96 }, { name: "创新能力", score: 94 }, { name: "团队合作", score: 95 }]), summary: "李博士在风电叶片领域具有世界级的专业水平，其碳纤维复合材料研究成果具有很高应用价值", strengths: "技术深度突出，创新能力强，国际化视野开阔", weaknesses: "对国内制造业实际情况了解有限，需要适应期", recommendation: "strong_hire", completedAt: new Date(now - 3 * 24 * 60 * 60 * 1000) },
      // Sarah - 评估通过
      { candidateId: candidateMap[4].id, expertId: userMap["professor@demo-university.cn"].id, type: "technical", status: "completed", score: 89, dimensions: JSON.stringify([{ name: "风能专业知识", score: 92 }, { name: "项目管理", score: 87 }, { name: "跨文化沟通", score: 88 }]), summary: "Sarah has deep expertise in wind resource assessment and strong project management skills for offshore wind", strengths: "Deep technical knowledge, international experience, strong communication", weaknesses: "Limited experience with Chinese offshore regulations", recommendation: "hire", completedAt: new Date(now - 7 * 24 * 60 * 60 * 1000) },
    ]

    for (const a of assessments) {
      const existing = await prisma.assessment.findFirst({
        where: { candidateId: a.candidateId }
      })
      if (!existing) {
        await prisma.assessment.create({ data: { ...a, id: `demo_asm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` } })
      }
    }

    // ========================
    // 8. Create Negotiations
    // ========================
    const negotiations = [
      // 李晓风 - 谈判进行中 (第2轮)
      { candidateId: candidateMap[0].id, jobId: jobMap[0].id, status: "in_progress", currentOffer: 650000, expectedOffer: 720000, salaryCurrency: "CNY", rounds: 2, nextAction: "等待候选人确认最终薪酬方案", employerNotes: "候选人希望年薪达到72万，公司目前最高可以给到68万，正在协商中" },
      // Sarah - 谈判已完成 (已达成协议)
      { candidateId: candidateMap[4].id, jobId: jobMap[3].id, status: "agreed", currentOffer: 115000, expectedOffer: 120000, salaryCurrency: "EUR", rounds: 2, nextAction: "已发Offer，等待接受", employerNotes: "Sarah最终接受年薪115000欧元+奖金方案，对offer内容表示满意", agreedAt: new Date(now - 5 * 24 * 60 * 60 * 1000) },
    ]

    for (const n of negotiations) {
      const existing = await prisma.negotiation.findFirst({
        where: { candidateId: n.candidateId, jobId: n.jobId }
      })
      if (!existing) {
        await prisma.negotiation.create({ data: { ...n, id: `demo_neg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` } })
      }
    }

    // ========================
    // 9. Create Offers
    // ========================
    const offers = [
      // 李晓风 - Offer已发，待接受
      { candidateId: candidateMap[0].id, jobId: jobMap[0].id, companyId: companyMap[0].id, status: "sent", position: "风电叶片结构高级工程师", salary: 680000, salaryCurrency: "CNY", bonus: 150000, equity: "股权激励：0.05% 期权，4年vesting", benefits: JSON.stringify(["五险一金", "补充商业保险", "年度体检", "弹性工作", "海外培训机会", "住房补贴"]), startDate: new Date(now + 30 * 24 * 60 * 60 * 1000), expiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000) },
      // Sarah - Offer已接受
      { candidateId: candidateMap[4].id, jobId: jobMap[3].id, companyId: companyMap[1].id, status: "accepted", position: "Senior Offshore Wind Project Manager", salary: 115000, salaryCurrency: "EUR", bonus: 20000, equity: "ESOP: 0.02% company shares", benefits: JSON.stringify(["Health Insurance", "Relocation Support", "30 Days Annual Leave", "Training Budget €5000/year"]), startDate: new Date(now + 60 * 24 * 60 * 60 * 1000), expiresAt: new Date(now + 14 * 24 * 60 * 60 * 1000), acceptedAt: new Date(now - 3 * 24 * 60 * 60 * 1000) },
    ]

    for (const o of offers) {
      const existing = await prisma.offer.findFirst({
        where: { candidateId: o.candidateId, jobId: o.jobId }
      })
      if (!existing) {
        await prisma.offer.create({ data: { ...o, id: `demo_offer_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` } })
      }
    }

    // ========================
    // 10. Create Messages (站内信对话)
    // ========================
    const messages = [
      // 李晓风 ↔ 企业HR 对话
      { conversationId: "demo_conv_lxf_hr", senderId: userMap["hr@demo-solar.cn"].id, receiverId: candidateMap[0].userId, subject: "邀请加入中国光伏科技集团", content: "李博士您好！\n\n我们关注到您在风电叶片领域的杰出成就，诚邀您加入我们的团队，担任风电叶片结构工程师一职。\n\n期待您的回复。\n\n张明辉\n中国光伏科技集团 HR", read: true, createdAt: new Date(now - 6 * 24 * 60 * 60 * 1000) },
      { conversationId: "demo_conv_lxf_hr", senderId: candidateMap[0].userId, receiverId: userMap["hr@demo-solar.cn"].id, subject: "Re: 邀请加入中国光伏科技集团", content: "张经理您好！\n\n感谢您的邀请。我对风电叶片结构工程师职位很感兴趣，想进一步了解团队情况和项目详情。\n\n期待进一步沟通。\n\n李晓风", read: true, createdAt: new Date(now - 6 * 24 * 60 * 60 * 1000 + 3600000) },
      { conversationId: "demo_conv_lxf_hr", senderId: userMap["hr@demo-solar.cn"].id, receiverId: candidateMap[0].userId, subject: "Re: 邀请加入中国光伏科技集团", content: "李博士您好！\n\n非常高兴收到您的回复。我们的团队目前有15位工程师，正在开发新一代80米级碳纤维叶片。\n\n项目地点在上海浦东新区，薪资范围40-70万，具体可以根据您的经验进一步洽谈。\n\n您方便的话，我们可以安排一次视频面试。\n\n张明辉", read: true, createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000) },
      { conversationId: "demo_conv_lxf_hr", senderId: candidateMap[0].userId, receiverId: userMap["hr@demo-solar.cn"].id, subject: "Re: 邀请加入中国光伏科技集团", content: "张经理您好！\n\n非常感兴趣！我的可用期是1个月，可以及时入职。\n\n我已接受此次邀请，期待面试安排。\n\n李晓风", read: false, createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000 + 7200000) },
      // Sarah ↔ 企业HR 对话
      { conversationId: "demo_conv_sm_hr", senderId: userMap["hr@demo-envision.cn"].id, receiverId: candidateMap[4].userId, subject: "Invitation to join Envision Energy", content: "Dear Sarah,\n\nYour profile in wind resource assessment is exactly what we need for our European offshore wind projects. We would love to have you on board.\n\nLooking forward to your reply.\n\nBest regards,\nLi HR\nEnvision Energy", read: true, createdAt: new Date(now - 11 * 24 * 60 * 60 * 1000) },
      { conversationId: "demo_conv_sm_hr", senderId: candidateMap[4].userId, receiverId: userMap["hr@demo-envision.cn"].id, subject: "Re: Invitation to join Envision Energy", content: "Dear Li,\n\nThank you for the invitation. I am very interested in the Senior Offshore Wind Project Manager position. Could you share more details about the project pipeline and the team structure?\n\nBest regards,\nSarah", read: true, createdAt: new Date(now - 11 * 24 * 60 * 60 * 1000 + 3600000) },
      { conversationId: "demo_conv_sm_hr", senderId: userMap["hr@demo-envision.cn"].id, receiverId: candidateMap[4].userId, subject: "Re: Invitation to join Envision Energy", content: "Dear Sarah,\n\nGreat to hear from you! We have 3 offshore projects in Europe (total 2.4GW) starting next year. The team has 25 people across Hamburg and Copenhagen.\n\nThe offer includes relocation support. Would you like to schedule an interview?\n\nBest,\nLi", read: false, createdAt: new Date(now - 10 * 24 * 60 * 60 * 1000) },
      // 猎头 → 企业HR 推荐候选人
      { conversationId: "demo_conv_hunter_hr", senderId: userMap["hunter@demo-headhunter.cn"].id, receiverId: userMap["hr@demo-solar.cn"].id, subject: "推荐候选人：王储能 - 固态电池电解质专家", content: "张经理您好！\n\n根据贵司固态电池研发总监的需求，我推荐王储能博士。\n\n背景：清华大学博士，15年锂电池研发经验，前宁德时代技术专家，拥有多项固态电池核心专利。\n\n如感兴趣，我可以安排初步沟通。\n\n王猎头\n顶尖猎头机构", read: false, createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000) },
    ]

    for (const m of messages) {
      await prisma.message.create({
        data: {
          ...m,
          id: `demo_msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          createdAt: m.createdAt,
        }
      })
    }

    // ========================
    // 11. Create Notifications
    // ========================
    const notifications = [
      { userId: userMap["hr@demo-solar.cn"].id, title: "演示数据已就绪", message: "系统已初始化完整的演示数据，包含5位候选人、2家企业、4个职位，可完整体验招聘流程", type: "success" },
      { userId: userMap["hr@demo-solar.cn"].id, title: "新候选人上线", message: "发现5位高匹配风能锂电候选人，建议及时查看", type: "info" },
      { userId: userMap["hr@demo-solar.cn"].id, title: "李晓风已接受邀请", message: "李晓风博士已接受风电叶片工程师职位的邀请，请安排面试", type: "success", link: "/invitations" },
      { userId: userMap["hr@demo-solar.cn"].id, title: "面试已完成待评估", message: "李晓风的面试已完成，请及时填写评估意见", type: "warning", link: "/interviews" },
      { userId: userMap["hr@demo-solar.cn"].id, title: "Offer待发送", message: "李晓风的谈判已基本达成一致，可以准备发送正式Offer", type: "info", link: "/offers" },
      { userId: userMap["hr@demo-envision.cn"].id, title: "Sarah面试已完成", message: "Sarah Mueller的面试已完成，评估评分89分，建议推进", type: "success", link: "/interviews" },
      { userId: userMap["hr@demo-envision.cn"].id, title: "王储能已接受邀请", message: "王储能博士已接受固态电池研发专家职位的邀请", type: "success", link: "/invitations" },
      { userId: candidateMap[0].userId, title: "邀请已发送", message: "中国光伏科技集团向您发送了风电叶片结构工程师职位的邀请，请及时查看并回复", type: "info", link: "/invitations" },
      { userId: candidateMap[0].userId, title: "面试已安排", message: "您的面试已安排，请准时参加视频面试", type: "warning", link: "/interviews" },
      { userId: candidateMap[0].userId, title: "Offer已发送", message: "恭喜！您已收到中国光伏科技集团的正式Offer，请在7天内确认接受", type: "success", link: "/offers" },
      { userId: candidateMap[4].userId, title: "Offer已被接受", message: "恭喜！您已成功接受Envision Energy的Offer，期待您的加入", type: "success", link: "/offers" },
      { userId: userMap["admin@globaltalentradar.com"].id, title: "新企业待审核", message: "中国光伏科技集团已完成注册，请审核企业认证材料", type: "warning", link: "/admin/verification" },
    ]

    await prisma.notification.deleteMany({
      where: { userId: { in: Object.values(userMap).map((u: any) => u.id) } }
    })
    await prisma.notification.createMany({ data: notifications })

    // ========================
    // 12. Create AuditLogs
    // ========================
    await prisma.auditLog.deleteMany({})
    const auditLogs = [
      { userId: userMap["admin@globaltalentradar.com"].id, action: "LOGIN", resource: "auth", detail: "管理员登录系统", ip: "192.168.1.100" },
      { userId: userMap["hr@demo-solar.cn"].id, action: "CREATE_INVITATION", resource: "invitation", resourceId: invitationMap[0]?.id, detail: "向李晓风发送邀请（风电叶片工程师）", ip: "192.168.1.101" },
      { userId: userMap["hr@demo-solar.cn"].id, action: "SCHEDULE_INTERVIEW", resource: "interview", resourceId: interviewMap[0]?.id, detail: "安排李晓风视频面试（90分钟）", ip: "192.168.1.101" },
      { userId: userMap["hr@demo-solar.cn"].id, action: "COMPLETE_INTERVIEW", resource: "interview", resourceId: interviewMap[0]?.id, detail: "完成李晓风面试，评分95分", ip: "192.168.1.101" },
      { userId: userMap["hr@demo-solar.cn"].id, action: "CREATE_NEGOTIATION", resource: "negotiation", detail: "启动与李晓风的薪酬谈判", ip: "192.168.1.101" },
      { userId: userMap["hr@demo-solar.cn"].id, action: "CREATE_OFFER", resource: "offer", detail: "向李晓风发送正式Offer（68万年薪）", ip: "192.168.1.101" },
      { userId: userMap["hr@demo-envision.cn"].id, action: "CREATE_INVITATION", resource: "invitation", resourceId: invitationMap[4]?.id, detail: "向Sarah Mueller发送邀请（海上风电项目经理）", ip: "192.168.1.102" },
      { userId: userMap["hr@demo-envision.cn"].id, action: "COMPLETE_INTERVIEW", resource: "interview", resourceId: interviewMap[2]?.id, detail: "完成Sarah面试，评分89分", ip: "192.168.1.102" },
      { userId: userMap["hr@demo-envision.cn"].id, action: "CREATE_OFFER", resource: "offer", detail: "向Sarah Mueller发送正式Offer（115000欧元年薪）", ip: "192.168.1.102" },
      { userId: userMap["admin@globaltalentradar.com"].id, action: "VERIFY_COMPANY", resource: "company", resourceId: companyMap[0]?.id, detail: "审核通过中国光伏科技集团企业认证", ip: "192.168.1.100" },
    ]
    for (const log of auditLogs) {
      await prisma.auditLog.create({ data: { ...log, id: `demo_audit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` } })
    }

    // ========================
    // 13. Create AuditLogs for admin view
    // ========================

    const stats = await getDemoStats()

    return NextResponse.json({
      success: true,
      message: `演示数据初始化完成！已创建 ${stats.candidates} 位候选人、${stats.companies} 家企业、${stats.jobs} 个职位、${stats.invitations} 个邀请、${stats.interviews} 场面试、${stats.offers} 个Offer`,
      data: stats,
      demoFlow: getDemoFlowSteps(),
    })
  } catch (error: any) {
    console.error("Demo init error:", error)
    return NextResponse.json({ success: false, message: "初始化失败: " + (error.message || "未知错误") }, { status: 500 })
  }
}

// Helper: clean existing demo data (for force reset)
async function cleanDemoData() {
  const demoIds = { startsWith: "demo_" }
  await prisma.auditLog.deleteMany({ where: { id: demoIds } })
  await prisma.notification.deleteMany({ where: { message: { contains: "演示" } } })
  await prisma.message.deleteMany({ where: { id: { startsWith: "demo_msg" } } })
  await prisma.offer.deleteMany({ where: { id: demoIds } })
  await prisma.negotiation.deleteMany({ where: { id: demoIds } })
  await prisma.assessment.deleteMany({ where: { id: demoIds } })
  await prisma.interview.deleteMany({ where: { id: demoIds } })
  await prisma.invitation.deleteMany({ where: { id: demoIds } })
  await prisma.job.deleteMany({ where: { id: demoIds } })
  await prisma.candidate.deleteMany({ where: { id: demoIds } })
  await prisma.company.deleteMany({ where: { id: demoIds } })
  await prisma.user.deleteMany({ where: { id: demoIds } })
}

// Helper: get demo stats for response
async function getDemoStats() {
  return {
    candidates: await prisma.candidate.count(),
    companies: await prisma.company.count(),
    jobs: await prisma.job.count(),
    invitations: await prisma.invitation.count(),
    interviews: await prisma.interview.count(),
    assessments: await prisma.assessment.count(),
    negotiations: await prisma.negotiation.count(),
    offers: await prisma.offer.count(),
    messages: await prisma.message.count(),
    notifications: await prisma.notification.count(),
    auditLogs: await prisma.auditLog.count(),
  }
}

// Helper: define the demo flow steps for UI guidance
function getDemoFlowSteps() {
  return [
    { step: 1, role: "company", action: "登录企业账号", description: "使用 hr@demo-solar.cn / company123 登录", status: "pending" },
    { step: 2, role: "company", action: "查看人才搜索结果", description: "访问 /candidates 查看5位高匹配候选人", status: "pending" },
    { step: 3, role: "company", action: "发起人才邀请", description: "向候选人发送邀请（已有5个邀请记录）", status: "completed" },
    { step: 4, role: "candidate", action: "候选人接受邀请", description: "李晓风、王储能、Sarah已接受邀请", status: "completed" },
    { step: 5, role: "company", action: "安排面试", description: "为已接受邀请的候选人安排面试", status: "completed" },
    { step: 6, role: "company", action: "填写面试评估", description: "面试完成后填写评估意见", status: "completed" },
    { step: 7, role: "company", action: "发起薪酬谈判", description: "与候选人协商薪酬方案", status: "in_progress" },
    { step: 8, role: "company", action: "发送正式Offer", description: "向候选人发送正式录用通知书", status: "in_progress" },
    { step: 9, role: "candidate", action: "接受Offer", description: "候选人确认接受录用", status: "pending" },
    { step: 10, role: "admin", action: "管理员审核", description: "审核企业认证和候选人资料", status: "pending" },
  ]
}
