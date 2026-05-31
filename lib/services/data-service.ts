// Unified Data Service Layer
// DB-first with Mock fallback for development
// All pages should use this layer instead of direct Prisma queries

import prisma from "@/lib/prisma"

// ============================================================
// Types
// ============================================================

export interface ServiceResult<T> {
  data: T | null
  error: string | null
  source: "db" | "mock"
  total?: number
}

export interface DashboardStats {
  totalCandidates: number
  totalCompanies: number
  totalJobs: number
  activeInterviews: number
  totalInvitations: number
  matchAccuracy: number
  newCandidatesToday: number
  verifiedCandidates: number
  activeHeadhunters: number
  conversionRate: number
  offerConversionRate: number
  riskAlerts: number
  avgCandidateScore: number
}

export interface CandidateRecord {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  title?: string | null
  summary?: string | null
  country?: string | null
  city?: string | null
  industry?: string | null
  experienceYears: number
  currentCompany?: string | null
  currentPosition?: string | null
  education: any[]
  skills: string[]
  languages: string[]
  certificates: string[]
  publications: any[]
  patents: string[]
  githubUrl?: string | null
  linkedinUrl?: string | null
  scholarUrl?: string | null
  availability?: string | null
  expectedSalary?: string | null
  willingRelocate: boolean
  verified: boolean
  score: number
  rank: number
  source?: string | null
  lastActiveAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface CompanyRecord {
  id: string
  name: string
  logo?: string | null
  description?: string | null
  website?: string | null
  industry?: string | null
  country?: string | null
  city?: string | null
  size?: string | null
  verified: boolean
  createdAt: string
  updatedAt: string
}

export interface JobRecord {
  id: string
  title: string
  description?: string | null
  requirements: string[]
  location?: string | null
  country?: string | null
  industry?: string | null
  salaryMin?: number | null
  salaryMax?: number | null
  salaryCurrency: string
  type: string
  status: string
  companyId: string
  companyName?: string
  createdAt: string
  updatedAt: string
}

export interface InvitationRecord {
  id: string
  candidateId: string
  jobId?: string | null
  companyId?: string | null
  senderId: string
  receiverId: string
  status: string
  message?: string | null
  expiresAt?: string | null
  createdAt: string
}

export interface InterviewRecord {
  id: string
  candidateId: string
  jobId?: string | null
  companyId?: string | null
  scheduledById: string
  interviewer?: string | null
  type: string
  status: string
  scheduledAt?: string | null
  durationMin: number
  location?: string | null
  notes?: string | null
  feedback: any
  score?: number | null
  createdAt: string
}

export interface AssessmentRecord {
  id: string
  candidateId: string
  expertId?: string | null
  type: string
  status: string
  score?: number | null
  dimensions: any[]
  summary?: string | null
  strengths?: string | null
  weaknesses?: string | null
  recommendation?: string | null
  createdAt: string
}

export interface NegotiationRecord {
  id: string
  candidateId: string
  jobId?: string | null
  status: string
  currentOffer?: number | null
  expectedOffer?: number | null
  salaryCurrency: string
  rounds: number
  nextAction?: string | null
  createdAt: string
}

export interface OfferRecord {
  id: string
  candidateId: string
  jobId?: string | null
  companyId?: string | null
  status: string
  position: string
  salary: number
  salaryCurrency: string
  bonus?: number | null
  equity?: string | null
  benefits: any[]
  startDate?: string | null
  expiresAt?: string | null
  createdAt: string
}

export interface NotificationRecord {
  id: string
  userId: string
  title: string
  message: string
  type: string
  read: boolean
  link?: string | null
  createdAt: string
}

export interface AuditLogRecord {
  id: string
  userId?: string | null
  action: string
  resource: string
  resourceId?: string | null
  detail?: string | null
  ip?: string | null
  createdAt: string
  userName?: string | null
}

export interface MessageRecord {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  senderName?: string
  receiverName?: string
  subject: string
  content: string
  read: boolean
  createdAt: string
}

export interface ConversationRecord {
  conversationId: string
  participants: { id: string; name: string; role: string }[]
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

export interface EmailTemplateRecord {
  id: string
  name: string
  label: string
  description: string
  subject: string
  bodyTemplate: string
  variables: string[]
  category: string
}

export interface EmailLogRecord {
  id: string
  templateName: string
  senderId: string
  receiverId: string
  receiverEmail: string
  subject: string
  body: string
  status: string
  metadata: any
  createdAt: string
}

// ============================================================
// Helpers
// ============================================================

function isServerSide(): boolean {
  return typeof window === "undefined"
}

function safeJsonParse<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

function sanitizeCandidateEmail(email: string | null | undefined): string | null {
  if (!email) return null
  // Mask emails when returning to client (non-admin, non-company)
  if (email.includes("@")) {
    const [local, domain] = email.split("@")
    if (local.length <= 2) return `***@${domain}`
    return `${local[0]}***@${domain}`
  }
  return email
}

// ============================================================
// Candidates
// ============================================================

// Mock candidate data for fallback
const MOCK_CANDIDATES: CandidateRecord[] = [
  {
    id: "mock_001",
    name: "李晓风",
    email: "l***@mit.edu",
    title: "风机载荷仿真专家",
    summary: "MIT 博士，10+年风机载荷仿真经验，发表SCI论文30+篇",
    country: "美国",
    city: "波士顿",
    industry: "wind",
    experienceYears: 12,
    currentCompany: "GE Renewable Energy",
    currentPosition: "Senior Principal Engineer",
    education: [{ degree: "博士", school: "MIT", major: "航空航天工程" }],
    skills: ["风机载荷仿真", "CFD计算", "海上风电", "Python"],
    languages: ["中文(母语)", "英语(流利)"],
    certificates: [],
    publications: [],
    patents: [],
    githubUrl: "https://github.com/lixf-wind",
    linkedinUrl: "https://linkedin.com/in/lixf-wind",
    scholarUrl: null,
    availability: "1month",
    expectedSalary: "$180K-$220K",
    willingRelocate: true,
    verified: true,
    score: 96,
    rank: 1,
    source: "openalex",
    createdAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "mock_002",
    name: "张伟",
    email: "z***@tsinghua.edu.cn",
    title: "固态电池电解质研发负责人",
    summary: "清华大学博士，8年固态电池研发经验，多项核心专利",
    country: "中国",
    city: "北京",
    industry: "lithium",
    experienceYears: 8,
    currentCompany: "宁德时代",
    currentPosition: "高级研发经理",
    education: [{ degree: "博士", school: "清华大学", major: "材料科学与工程" }],
    skills: ["固态电解质", "锂电池", "电化学", "BMS算法"],
    languages: ["中文(母语)", "英语(流利)"],
    certificates: [],
    publications: [],
    patents: ["固态电解质制备方法 CN2024XXXXX"],
    githubUrl: null,
    linkedinUrl: "https://linkedin.com/in/zhangwei-battery",
    scholarUrl: null,
    availability: "3months",
    expectedSalary: "¥800K-¥1.2M",
    willingRelocate: false,
    verified: true,
    score: 92,
    rank: 3,
    source: "manual",
    createdAt: "2026-02-20T00:00:00.000Z",
    updatedAt: "2026-05-10T00:00:00.000Z",
  },
  {
    id: "mock_003",
    name: "M. Schmidt",
    email: "s***@tum.de",
    title: "海上风电基础设计专家",
    summary: "慕尼黑工业大学博士，15年海上风电基础设计经验",
    country: "德国",
    city: "慕尼黑",
    industry: "wind",
    experienceYears: 15,
    currentCompany: "Siemens Gamesa",
    currentPosition: "Chief Engineer - Foundations",
    education: [{ degree: "博士", school: "TUM", major: "土木工程" }],
    skills: ["海上风电基础", "单桩设计", "漂浮式", "ABAQUS"],
    languages: ["德语(母语)", "英语(流利)"],
    certificates: [],
    publications: [],
    patents: [],
    githubUrl: "https://github.com/mschmidt-offshore",
    linkedinUrl: null,
    scholarUrl: null,
    availability: "immediate",
    expectedSalary: "€150K-€180K",
    willingRelocate: true,
    verified: true,
    score: 94,
    rank: 2,
    source: "openalex",
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-04-28T00:00:00.000Z",
  },
  {
    id: "mock_004",
    name: "田中一郎",
    email: "t***@kyoto-u.ac.jp",
    title: "BMS 电池管理系统首席架构师",
    summary: "京都大学博士，12年BMS研发经验，松下背景",
    country: "日本",
    city: "京都",
    industry: "lithium",
    experienceYears: 12,
    currentCompany: "Panasonic Energy",
    currentPosition: "BMS Chief Architect",
    education: [{ degree: "博士", school: "京都大学", major: "电气工程" }],
    skills: ["BMS架构", "SOC/SOH估算", "嵌入式C", "ISO26262"],
    languages: ["日语(母语)", "英语(流利)"],
    certificates: [],
    publications: [],
    patents: [],
    githubUrl: null,
    linkedinUrl: "https://linkedin.com/in/tanaka-bms",
    scholarUrl: null,
    availability: "1month",
    expectedSalary: "¥15M-¥20M",
    willingRelocate: true,
    verified: true,
    score: 90,
    rank: 4,
    source: "manual",
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-05-05T00:00:00.000Z",
  },
  {
    id: "mock_005",
    name: "E. Johnson",
    email: "j***@nrel.gov",
    title: "风储协同控制专家",
    summary: "Stanford博士，8年风储协同控制与电网集成经验",
    country: "美国",
    city: "丹佛",
    industry: "both",
    experienceYears: 8,
    currentCompany: "NREL",
    currentPosition: "Senior Research Engineer",
    education: [{ degree: "博士", school: "Stanford", major: "电力电子" }],
    skills: ["风储协同", "电网集成", "PSCAD", "Python"],
    languages: ["英语(母语)"],
    certificates: [],
    publications: [],
    patents: [],
    githubUrl: "https://github.com/ejohnson-windstorage",
    linkedinUrl: "https://linkedin.com/in/ejohnson-nrel",
    scholarUrl: null,
    availability: "1month",
    expectedSalary: "$160K-$200K",
    willingRelocate: true,
    verified: true,
    score: 88,
    rank: 5,
    source: "openalex",
    createdAt: "2026-02-10T00:00:00.000Z",
    updatedAt: "2026-05-08T00:00:00.000Z",
  },
]

function dbToFrontendCandidate(record: any): CandidateRecord {
  return {
    id: record.id,
    name: record.name,
    email: record.email ? sanitizeCandidateEmail(record.email) : null,
    phone: record.phone,
    title: record.title,
    summary: record.summary,
    country: record.country,
    city: record.city,
    industry: record.industry,
    experienceYears: record.experienceYears,
    currentCompany: record.currentCompany,
    currentPosition: record.currentPosition,
    education: safeJsonParse(record.education, []),
    skills: safeJsonParse(record.skills, []),
    languages: safeJsonParse(record.languages, []),
    certificates: safeJsonParse(record.certificates, []),
    publications: safeJsonParse(record.publications, []),
    patents: safeJsonParse(record.patents, []),
    githubUrl: record.githubUrl,
    linkedinUrl: record.linkedinUrl,
    scholarUrl: record.scholarUrl,
    availability: record.availability,
    expectedSalary: record.expectedSalary,
    willingRelocate: record.willingRelocate,
    verified: record.verified,
    score: record.score,
    rank: record.rank,
    source: record.source,
    lastActiveAt: record.lastActiveAt?.toISOString?.() ?? null,
    createdAt: record.createdAt?.toISOString?.() ?? new Date().toISOString(),
    updatedAt: record.updatedAt?.toISOString?.() ?? new Date().toISOString(),
  }
}

export async function getCandidates(params?: {
  keyword?: string
  country?: string
  industry?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  pageSize?: number
}): Promise<ServiceResult<CandidateRecord[]>> {
  try {
    if (!isServerSide()) {
      // Client-side: use API fetch
      return { data: MOCK_CANDIDATES, error: null, source: "mock", total: MOCK_CANDIDATES.length }
    }

    const { keyword, country, industry, sortBy = "score", sortOrder = "desc", page = 1, pageSize = 20 } = params || {}

    const where: any = {}

    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { title: { contains: keyword } },
        { skills: { contains: keyword } },
        { summary: { contains: keyword } },
        { currentCompany: { contains: keyword } },
      ]
    }
    if (country) where.country = country
    if (industry) where.industry = industry

    const total = await prisma.candidate.count({ where })
    const records = await prisma.candidate.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    const data = records.map(dbToFrontendCandidate)
    return { data, error: null, source: "db", total }
  } catch (err: any) {
    console.error("[DataService] getCandidates error:", err.message)
    // Fallback to mock
    const { keyword, country, industry } = params || {}
    let filtered = [...MOCK_CANDIDATES]
    if (keyword) {
      const kw = keyword.toLowerCase()
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(kw) ||
          (c.title || "").toLowerCase().includes(kw) ||
          c.skills.some((s) => s.toLowerCase().includes(kw))
      )
    }
    if (country) filtered = filtered.filter((c) => c.country === country)
    if (industry) filtered = filtered.filter((c) => c.industry === industry)
    return { data: filtered, error: null, source: "mock", total: filtered.length }
  }
}

export async function getCandidateById(id: string): Promise<ServiceResult<CandidateRecord>> {
  try {
    if (!isServerSide()) {
      const found = MOCK_CANDIDATES.find((c) => c.id === id) || null
      return { data: found, error: found ? null : "Candidate not found", source: "mock" }
    }

    const record = await prisma.candidate.findUnique({ where: { id } })
    if (!record) return { data: null, error: "Candidate not found", source: "db" }
    return { data: dbToFrontendCandidate(record), error: null, source: "db" }
  } catch (err: any) {
    console.error("[DataService] getCandidateById error:", err.message)
    const found = MOCK_CANDIDATES.find((c) => c.id === id) || null
    return { data: found, error: found ? null : "Candidate not found", source: "mock" }
  }
}

export async function createCandidate(data: any): Promise<ServiceResult<CandidateRecord>> {
  try {
    if (!isServerSide()) {
      const mock: CandidateRecord = { id: `mock_${Date.now()}`, ...data, education: [], skills: data.skills || [], languages: [], certificates: [], publications: [], patents: [], verified: false, score: 0, rank: 999, experienceYears: data.experienceYears || 0, willingRelocate: data.willingRelocate || false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      MOCK_CANDIDATES.unshift(mock)
      return { data: mock, error: null, source: "mock" }
    }

    const record = await prisma.candidate.create({ data })
    return { data: dbToFrontendCandidate(record), error: null, source: "db" }
  } catch (err: any) {
    console.error("[DataService] createCandidate error:", err.message)
    return { data: null, error: err.message, source: "mock" }
  }
}

export async function updateCandidate(id: string, data: any): Promise<ServiceResult<CandidateRecord>> {
  try {
    if (!isServerSide()) {
      const idx = MOCK_CANDIDATES.findIndex((c) => c.id === id)
      if (idx === -1) return { data: null, error: "Not found", source: "mock" }
      MOCK_CANDIDATES[idx] = { ...MOCK_CANDIDATES[idx], ...data, updatedAt: new Date().toISOString() }
      return { data: MOCK_CANDIDATES[idx], error: null, source: "mock" }
    }

    const record = await prisma.candidate.update({ where: { id }, data })
    return { data: dbToFrontendCandidate(record), error: null, source: "db" }
  } catch (err: any) {
    console.error("[DataService] updateCandidate error:", err.message)
    return { data: null, error: err.message, source: "mock" }
  }
}

// ============================================================
// Companies
// ============================================================

const MOCK_COMPANIES: CompanyRecord[] = [
  { id: "mock_comp_001", name: "金风科技", description: "全球风电整机龙头企业", website: "https://www.goldwind.com", industry: "wind", country: "中国", city: "乌鲁木齐", size: "1000+", verified: true, createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2026-05-01T00:00:00.000Z" },
  { id: "mock_comp_002", name: "中国光伏科技集团", description: "全球领先的光伏与储能解决方案提供商", website: "https://www.cnpv.com", industry: "lithium", country: "中国", city: "北京", size: "1000+", verified: true, createdAt: "2025-01-01T00:00:00.000Z", updatedAt: "2026-05-01T00:00:00.000Z" },
  { id: "mock_comp_003", name: "Vestas", description: "全球最大风机制造商", website: "https://www.vestas.com", industry: "wind", country: "丹麦", city: "奥胡斯", size: "1000+", verified: true, createdAt: "2024-06-01T00:00:00.000Z", updatedAt: "2026-04-01T00:00:00.000Z" },
  { id: "mock_comp_004", name: "宁德时代", description: "全球领先的锂离子电池研发制造公司", website: "https://www.catl.com", industry: "lithium", country: "中国", city: "宁德", size: "1000+", verified: true, createdAt: "2024-03-01T00:00:00.000Z", updatedAt: "2026-05-01T00:00:00.000Z" },
  { id: "mock_comp_005", name: "Siemens Gamesa", description: "全球领先的风力涡轮机制造商", website: "https://www.siemensgamesa.com", industry: "wind", country: "西班牙", city: "萨穆迪奥", size: "1000+", verified: true, createdAt: "2024-01-01T00:00:00.000Z", updatedAt: "2026-04-15T00:00:00.000Z" },
]

export async function getCompanies(params?: {
  keyword?: string
  industry?: string
  country?: string
  page?: number
  pageSize?: number
}): Promise<ServiceResult<CompanyRecord[]>> {
  try {
    if (!isServerSide()) {
      return { data: MOCK_COMPANIES, error: null, source: "mock", total: MOCK_COMPANIES.length }
    }

    const { keyword, industry, country, page = 1, pageSize = 20 } = params || {}
    const where: any = {}
    if (keyword) where.name = { contains: keyword }
    if (industry) where.industry = industry
    if (country) where.country = country

    const total = await prisma.company.count({ where })
    const records = await prisma.company.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    })

    const data: CompanyRecord[] = records.map((r: any) => ({
      id: r.id,
      name: r.name,
      logo: r.logo,
      description: r.description,
      website: r.website,
      industry: r.industry,
      country: r.country,
      city: r.city,
      size: r.size,
      verified: r.verified,
      createdAt: r.createdAt?.toISOString?.() ?? "",
      updatedAt: r.updatedAt?.toISOString?.() ?? "",
    }))
    return { data, error: null, source: "db", total }
  } catch (err: any) {
    console.error("[DataService] getCompanies error:", err.message)
    return { data: MOCK_COMPANIES, error: null, source: "mock", total: MOCK_COMPANIES.length }
  }
}

export async function getCompanyById(id: string): Promise<ServiceResult<CompanyRecord>> {
  try {
    if (!isServerSide()) {
      const found = MOCK_COMPANIES.find((c) => c.id === id) || null
      return { data: found, error: found ? null : "Company not found", source: "mock" }
    }

    const record = await prisma.company.findUnique({ where: { id } })
    if (!record) return { data: null, error: "Company not found", source: "db" }
    return {
      data: {
        id: record.id,
        name: record.name,
        logo: record.logo,
        description: record.description,
        website: record.website,
        industry: record.industry,
        country: record.country,
        city: record.city,
        size: record.size,
        verified: record.verified,
        createdAt: record.createdAt?.toISOString?.() ?? "",
        updatedAt: record.updatedAt?.toISOString?.() ?? "",
      },
      error: null,
      source: "db",
    }
  } catch (err: any) {
    console.error("[DataService] getCompanyById error:", err.message)
    const found = MOCK_COMPANIES.find((c) => c.id === id) || null
    return { data: found, error: found ? null : "Company not found", source: "mock" }
  }
}

export async function createCompany(data: any): Promise<ServiceResult<CompanyRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.company.create({ data })
    return {
      data: {
        id: record.id, name: record.name, logo: record.logo, description: record.description,
        website: record.website, industry: record.industry, country: record.country,
        city: record.city, size: record.size, verified: record.verified,
        createdAt: record.createdAt.toISOString(), updatedAt: record.updatedAt.toISOString(),
      },
      error: null,
      source: "db",
    }
  } catch (err: any) {
    console.error("[DataService] createCompany error:", err.message)
    return { data: null, error: err.message, source: "mock" }
  }
}

// ============================================================
// Jobs
// ============================================================

const MOCK_JOBS: JobRecord[] = [
  { id: "mock_job_001", title: "海上风电高级工程师", description: "负责海上风电场基础结构设计与优化", requirements: ["10年以上经验", "DNV/API标准"], location: "上海/远程", country: "中国", industry: "wind", salaryMin: 600000, salaryMax: 900000, salaryCurrency: "CNY", type: "full-time", status: "open", companyId: "mock_comp_001", companyName: "金风科技", createdAt: "2026-04-01T00:00:00.000Z", updatedAt: "2026-05-01T00:00:00.000Z" },
  { id: "mock_job_002", title: "固态电池研发总监", description: "领导固态电池电解质材料研发团队", requirements: ["博士学历", "8年以上经验"], location: "北京", country: "中国", industry: "lithium", salaryMin: 800000, salaryMax: 1500000, salaryCurrency: "CNY", type: "full-time", status: "open", companyId: "mock_comp_002", companyName: "中国光伏科技集团", createdAt: "2026-03-15T00:00:00.000Z", updatedAt: "2026-05-01T00:00:00.000Z" },
  { id: "mock_job_003", title: "BMS 系统架构师", description: "设计新一代电池管理系统架构", requirements: ["5年以上BMS经验", "ISO26262"], location: "深圳", country: "中国", industry: "lithium", salaryMin: 500000, salaryMax: 800000, salaryCurrency: "CNY", type: "full-time", status: "open", companyId: "mock_comp_004", companyName: "宁德时代", createdAt: "2026-04-10T00:00:00.000Z", updatedAt: "2026-05-01T00:00:00.000Z" },
  { id: "mock_job_004", title: "风资源评估工程师", description: "负责风电场风资源评估与微观选址", requirements: ["3年以上经验", "WAsP/WindPRO"], location: "北京/哥本哈根", country: "中国", industry: "wind", salaryMin: 300000, salaryMax: 500000, salaryCurrency: "CNY", type: "full-time", status: "open", companyId: "mock_comp_003", companyName: "Vestas", createdAt: "2026-04-20T00:00:00.000Z", updatedAt: "2026-05-01T00:00:00.000Z" },
  { id: "mock_job_005", title: "储能系统集成工程师", description: "负责大型储能系统设计与集成调试", requirements: ["5年以上经验", "BESS/PCS"], location: "北京", country: "中国", industry: "lithium", salaryMin: 400000, salaryMax: 700000, salaryCurrency: "CNY", type: "full-time", status: "open", companyId: "mock_comp_002", companyName: "中国光伏科技集团", createdAt: "2026-05-01T00:00:00.000Z", updatedAt: "2026-05-01T00:00:00.000Z" },
]

export async function getJobs(params?: {
  keyword?: string
  industry?: string
  country?: string
  status?: string
  companyId?: string
  page?: number
  pageSize?: number
}): Promise<ServiceResult<JobRecord[]>> {
  try {
    if (!isServerSide()) {
      return { data: MOCK_JOBS, error: null, source: "mock", total: MOCK_JOBS.length }
    }

    const { keyword, industry, country, status, companyId, page = 1, pageSize = 20 } = params || {}
    const where: any = {}
    if (keyword) where.title = { contains: keyword }
    if (industry) where.industry = industry
    if (country) where.country = country
    if (status) where.status = status
    if (companyId) where.companyId = companyId

    const total = await prisma.job.count({ where })
    const records = await prisma.job.findMany({
      where,
      include: { company: { select: { name: true } } },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    })

    const data: JobRecord[] = records.map((r: any) => ({
      id: r.id, title: r.title, description: r.description,
      requirements: safeJsonParse(r.requirements, []),
      location: r.location, country: r.country, industry: r.industry,
      salaryMin: r.salaryMin, salaryMax: r.salaryMax, salaryCurrency: r.salaryCurrency,
      type: r.type, status: r.status, companyId: r.companyId,
      companyName: r.company?.name || null,
      createdAt: r.createdAt?.toISOString?.() ?? "",
      updatedAt: r.updatedAt?.toISOString?.() ?? "",
    }))
    return { data, error: null, source: "db", total }
  } catch (err: any) {
    console.error("[DataService] getJobs error:", err.message)
    return { data: MOCK_JOBS, error: null, source: "mock", total: MOCK_JOBS.length }
  }
}

export async function getJobById(id: string): Promise<ServiceResult<JobRecord>> {
  try {
    if (!isServerSide()) {
      const found = MOCK_JOBS.find((j) => j.id === id) || null
      return { data: found, error: found ? null : "Job not found", source: "mock" }
    }
    const record = await prisma.job.findUnique({ where: { id }, include: { company: { select: { name: true } } } })
    if (!record) return { data: null, error: "Job not found", source: "db" }
    return {
      data: {
        id: record.id, title: record.title, description: record.description,
        requirements: safeJsonParse(record.requirements, []),
        location: record.location, country: record.country, industry: record.industry,
        salaryMin: record.salaryMin, salaryMax: record.salaryMax, salaryCurrency: record.salaryCurrency,
        type: record.type, status: record.status, companyId: record.companyId,
        companyName: (record as any).company?.name || null,
        createdAt: record.createdAt.toISOString(), updatedAt: record.updatedAt.toISOString(),
      },
      error: null, source: "db",
    }
  } catch (err: any) {
    console.error("[DataService] getJobById error:", err.message)
    const found = MOCK_JOBS.find((j) => j.id === id) || null
    return { data: found, error: found ? null : "Job not found", source: "mock" }
  }
}

export async function createJob(data: any): Promise<ServiceResult<JobRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.job.create({ data })
    return {
      data: {
        id: record.id, title: record.title, description: record.description,
        requirements: safeJsonParse(record.requirements, []),
        location: record.location, country: record.country, industry: record.industry,
        salaryMin: record.salaryMin, salaryMax: record.salaryMax, salaryCurrency: record.salaryCurrency,
        type: record.type, status: record.status, companyId: record.companyId,
        createdAt: record.createdAt.toISOString(), updatedAt: record.updatedAt.toISOString(),
      },
      error: null, source: "db",
    }
  } catch (err: any) {
    console.error("[DataService] createJob error:", err.message)
    return { data: null, error: err.message, source: "mock" }
  }
}

// ============================================================
// Dashboard Stats
// ============================================================

const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalCandidates: 28453,
  totalCompanies: 1204,
  totalJobs: 3412,
  activeInterviews: 456,
  totalInvitations: 18290,
  matchAccuracy: 72.5,
  newCandidatesToday: 347,
  verifiedCandidates: 9871,
  activeHeadhunters: 586,
  conversionRate: 34.2,
  offerConversionRate: 21.7,
  riskAlerts: 395,
  avgCandidateScore: 68,
}

export async function getDashboardStats(): Promise<ServiceResult<DashboardStats>> {
  try {
    if (!isServerSide()) {
      return { data: MOCK_DASHBOARD_STATS, error: null, source: "mock" }
    }

    const [
      totalCandidates, totalCompanies, totalJobs, activeInterviews,
      totalInvitations, verifiedCandidates,
    ] = await Promise.all([
      prisma.candidate.count(),
      prisma.company.count(),
      prisma.job.count(),
      prisma.interview.count({ where: { status: { in: ["scheduled", "confirmed"] } } }),
      prisma.invitation.count(),
      prisma.candidate.count({ where: { verified: true } }),
    ])

    const stats: DashboardStats = {
      totalCandidates,
      totalCompanies,
      totalJobs,
      activeInterviews,
      totalInvitations,
      matchAccuracy: 72.5,
      newCandidatesToday: 0,
      verifiedCandidates,
      activeHeadhunters: 0,
      conversionRate: 34.2,
      offerConversionRate: 21.7,
      riskAlerts: 0,
      avgCandidateScore: 68,
    }

    // New candidates today
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    stats.newCandidatesToday = await prisma.candidate.count({
      where: { createdAt: { gte: todayStart } },
    })

    // Avg score
    const avgResult = await prisma.candidate.aggregate({ _avg: { score: true } })
    if (avgResult._avg.score) stats.avgCandidateScore = Math.round(avgResult._avg.score)

    return { data: stats, error: null, source: "db" }
  } catch (err: any) {
    console.error("[DataService] getDashboardStats error:", err.message)
    return { data: MOCK_DASHBOARD_STATS, error: null, source: "mock" }
  }
}

// ============================================================
// Invitations
// ============================================================

export async function getInvitations(params?: {
  candidateId?: string
  companyId?: string
  status?: string
  page?: number
  pageSize?: number
}): Promise<ServiceResult<InvitationRecord[]>> {
  try {
    if (!isServerSide()) return { data: [], error: null, source: "mock", total: 0 }
    const { candidateId, companyId, status, page = 1, pageSize = 20 } = params || {}
    const where: any = {}
    if (candidateId) where.candidateId = candidateId
    if (companyId) where.companyId = companyId
    if (status) where.status = status

    const total = await prisma.invitation.count({ where })
    const records = await prisma.invitation.findMany({
      where, skip: (page - 1) * pageSize, take: pageSize,
      orderBy: { createdAt: "desc" },
    })
    return {
      data: records.map((r: any) => ({ ...r, createdAt: r.createdAt?.toISOString?.() ?? "", expiresAt: r.expiresAt?.toISOString?.() ?? null, respondedAt: r.respondedAt?.toISOString?.() ?? null })),
      error: null, source: "db", total,
    }
  } catch (err: any) {
    console.error("[DataService] getInvitations error:", err.message)
    return { data: [], error: null, source: "mock", total: 0 }
  }
}

export async function createInvitation(data: any): Promise<ServiceResult<InvitationRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.invitation.create({ data })
    return { data: { ...record, createdAt: record.createdAt.toISOString(), expiresAt: record.expiresAt?.toISOString?.() ?? null, respondedAt: null } as any, error: null, source: "db" }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

export async function updateInvitation(id: string, data: any): Promise<ServiceResult<InvitationRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.invitation.update({ where: { id }, data })
    return { data: { ...record, createdAt: record.createdAt.toISOString(), expiresAt: record.expiresAt?.toISOString?.() ?? null, respondedAt: record.respondedAt?.toISOString?.() ?? null } as any, error: null, source: "db" }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

// ============================================================
// Interviews
// ============================================================

export async function getInterviews(params?: {
  candidateId?: string
  companyId?: string
  status?: string
  page?: number
  pageSize?: number
}): Promise<ServiceResult<InterviewRecord[]>> {
  try {
    if (!isServerSide()) return { data: [], error: null, source: "mock", total: 0 }
    const { candidateId, companyId, status, page = 1, pageSize = 20 } = params || {}
    const where: any = {}
    if (candidateId) where.candidateId = candidateId
    if (companyId) where.companyId = companyId
    if (status) where.status = status

    const total = await prisma.interview.count({ where })
    const records = await prisma.interview.findMany({
      where, skip: (page - 1) * pageSize, take: pageSize,
      orderBy: { createdAt: "desc" },
    })
    return {
      data: records.map((r: any) => ({
        ...r,
        feedback: safeJsonParse(r.feedback, null),
        createdAt: r.createdAt?.toISOString?.() ?? "",
        scheduledAt: r.scheduledAt?.toISOString?.() ?? null,
        completedAt: r.completedAt?.toISOString?.() ?? null,
      })),
      error: null, source: "db", total,
    }
  } catch (err: any) {
    console.error("[DataService] getInterviews error:", err.message)
    return { data: [], error: null, source: "mock", total: 0 }
  }
}

export async function createInterview(data: any): Promise<ServiceResult<InterviewRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.interview.create({ data })
    return {
      data: { ...record, feedback: safeJsonParse(record.feedback, null), createdAt: record.createdAt.toISOString(), scheduledAt: record.scheduledAt?.toISOString?.() ?? null, completedAt: null } as any,
      error: null, source: "db",
    }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

export async function updateInterview(id: string, data: any): Promise<ServiceResult<InterviewRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.interview.update({ where: { id }, data })
    return {
      data: { ...record, feedback: safeJsonParse(record.feedback, null), createdAt: record.createdAt.toISOString(), scheduledAt: record.scheduledAt?.toISOString?.() ?? null, completedAt: record.completedAt?.toISOString?.() ?? null } as any,
      error: null, source: "db",
    }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

// ============================================================
// Assessments
// ============================================================

export async function getAssessments(params?: {
  candidateId?: string
  status?: string
  page?: number
  pageSize?: number
}): Promise<ServiceResult<AssessmentRecord[]>> {
  try {
    if (!isServerSide()) return { data: [], error: null, source: "mock", total: 0 }
    const { candidateId, status, page = 1, pageSize = 20 } = params || {}
    const where: any = {}
    if (candidateId) where.candidateId = candidateId
    if (status) where.status = status

    const total = await prisma.assessment.count({ where })
    const records = await prisma.assessment.findMany({
      where, skip: (page - 1) * pageSize, take: pageSize,
      orderBy: { createdAt: "desc" },
    })
    return {
      data: records.map((r: any) => ({
        ...r,
        dimensions: safeJsonParse(r.dimensions, []),
        createdAt: r.createdAt?.toISOString?.() ?? "",
        completedAt: r.completedAt?.toISOString?.() ?? null,
      })),
      error: null, source: "db", total,
    }
  } catch (err: any) {
    console.error("[DataService] getAssessments error:", err.message)
    return { data: [], error: null, source: "mock", total: 0 }
  }
}

export async function createAssessment(data: any): Promise<ServiceResult<AssessmentRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.assessment.create({ data })
    return {
      data: { ...record, dimensions: safeJsonParse(record.dimensions, []), createdAt: record.createdAt.toISOString(), completedAt: null } as any,
      error: null, source: "db",
    }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

// ============================================================
// Negotiations
// ============================================================

export async function getNegotiations(params?: {
  candidateId?: string
  status?: string
  page?: number
  pageSize?: number
}): Promise<ServiceResult<NegotiationRecord[]>> {
  try {
    if (!isServerSide()) return { data: [], error: null, source: "mock", total: 0 }
    const { candidateId, status, page = 1, pageSize = 20 } = params || {}
    const where: any = {}
    if (candidateId) where.candidateId = candidateId
    if (status) where.status = status

    const total = await prisma.negotiation.count({ where })
    const records = await prisma.negotiation.findMany({
      where, skip: (page - 1) * pageSize, take: pageSize,
      orderBy: { createdAt: "desc" },
    })
    return {
      data: records.map((r: any) => ({ ...r, createdAt: r.createdAt?.toISOString?.() ?? "", agreedAt: r.agreedAt?.toISOString?.() ?? null })),
      error: null, source: "db", total,
    }
  } catch (err: any) {
    console.error("[DataService] getNegotiations error:", err.message)
    return { data: [], error: null, source: "mock", total: 0 }
  }
}

export async function createNegotiation(data: any): Promise<ServiceResult<NegotiationRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.negotiation.create({ data })
    return {
      data: { ...record, createdAt: record.createdAt.toISOString(), agreedAt: null } as any,
      error: null, source: "db",
    }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

// ============================================================
// Offers
// ============================================================

export async function getOffers(params?: {
  candidateId?: string
  status?: string
  page?: number
  pageSize?: number
}): Promise<ServiceResult<OfferRecord[]>> {
  try {
    if (!isServerSide()) return { data: [], error: null, source: "mock", total: 0 }
    const { candidateId, status, page = 1, pageSize = 20 } = params || {}
    const where: any = {}
    if (candidateId) where.candidateId = candidateId
    if (status) where.status = status

    const total = await prisma.offer.count({ where })
    const records = await prisma.offer.findMany({
      where, skip: (page - 1) * pageSize, take: pageSize,
      orderBy: { createdAt: "desc" },
    })
    return {
      data: records.map((r: any) => ({
        ...r,
        benefits: safeJsonParse(r.benefits, []),
        createdAt: r.createdAt?.toISOString?.() ?? "",
        startDate: r.startDate?.toISOString?.() ?? null,
        expiresAt: r.expiresAt?.toISOString?.() ?? null,
        acceptedAt: r.acceptedAt?.toISOString?.() ?? null,
        declinedAt: r.declinedAt?.toISOString?.() ?? null,
      })),
      error: null, source: "db", total,
    }
  } catch (err: any) {
    console.error("[DataService] getOffers error:", err.message)
    return { data: [], error: null, source: "mock", total: 0 }
  }
}

export async function createOffer(data: any): Promise<ServiceResult<OfferRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.offer.create({ data })
    return {
      data: { ...record, benefits: safeJsonParse(record.benefits, []), createdAt: record.createdAt.toISOString(), startDate: null, expiresAt: null, acceptedAt: null, declinedAt: null } as any,
      error: null, source: "db",
    }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

export async function updateOffer(id: string, data: any): Promise<ServiceResult<OfferRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.offer.update({ where: { id }, data })
    return {
      data: { ...record, benefits: safeJsonParse(record.benefits, []), createdAt: record.createdAt.toISOString(), startDate: record.startDate?.toISOString?.() ?? null, expiresAt: record.expiresAt?.toISOString?.() ?? null, acceptedAt: record.acceptedAt?.toISOString?.() ?? null, declinedAt: record.declinedAt?.toISOString?.() ?? null } as any,
      error: null, source: "db",
    }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

// ============================================================
// Notifications
// ============================================================

export async function getNotifications(userId: string): Promise<ServiceResult<NotificationRecord[]>> {
  try {
    if (!isServerSide()) return { data: [], error: null, source: "mock", total: 0 }
    const records = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return {
      data: records.map((r: any) => ({ ...r, createdAt: r.createdAt?.toISOString?.() ?? "" })),
      error: null, source: "db", total: records.length,
    }
  } catch (err: any) {
    console.error("[DataService] getNotifications error:", err.message)
    return { data: [], error: null, source: "mock", total: 0 }
  }
}

export async function createNotification(data: any): Promise<ServiceResult<NotificationRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.notification.create({ data })
    return { data: { ...record, createdAt: record.createdAt.toISOString() } as any, error: null, source: "db" }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

export async function markNotificationRead(id: string): Promise<ServiceResult<NotificationRecord>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    const record = await prisma.notification.update({ where: { id }, data: { read: true } })
    return { data: { ...record, createdAt: record.createdAt.toISOString() } as any, error: null, source: "db" }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

export async function markAllNotificationsRead(userId: string): Promise<ServiceResult<{ count: number }>> {
  try {
    if (!isServerSide()) return { data: { count: 0 }, error: null, source: "mock" }
    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
    return { data: { count: result.count }, error: null, source: "db" }
  } catch (err: any) {
    return { data: { count: 0 }, error: err.message, source: "mock" }
  }
}

export async function deleteNotification(id: string): Promise<ServiceResult<{ id: string }>> {
  try {
    if (!isServerSide()) return { data: null, error: "Server-side only", source: "mock" }
    await prisma.notification.delete({ where: { id } })
    return { data: { id }, error: null, source: "db" }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

export async function getUnreadNotificationCount(userId: string): Promise<ServiceResult<{ count: number }>> {
  try {
    if (!isServerSide()) return { data: { count: 0 }, error: null, source: "mock" }
    const count = await prisma.notification.count({ where: { userId, read: false } })
    return { data: { count }, error: null, source: "db" }
  } catch (err: any) {
    return { data: { count: 0 }, error: null, source: "mock" }
  }
}

// ============================================================
// Messages — 站内信
// ============================================================

const MOCK_MESSAGES: MessageRecord[] = [
  { id: "msg_001", conversationId: "conv_hr_lixf", senderId: "u_company_001", receiverId: "u_candidate_001", senderName: "王经理", receiverName: "李晓风", subject: "邀请加入中国光伏科技集团", content: "李晓风先生，您好！\n\n我们关注到您在风机载荷仿真领域的杰出成就，诚邀您加入中国光伏科技集团，担任海上风电高级工程师一职。\n\n期待您的回复。\n\n王经理\n中国光伏科技集团 HR", read: true, createdAt: "2026-05-28T09:00:00.000Z" },
  { id: "msg_002", conversationId: "conv_hr_lixf", senderId: "u_candidate_001", receiverId: "u_company_001", senderName: "李晓风", receiverName: "王经理", subject: "Re: 邀请加入中国光伏科技集团", content: "王经理，您好！\n\n感谢您的邀请。我对海上风电高级工程师职位很感兴趣，想进一步了解项目详情和团队情况。\n\n期待进一步沟通。\n\n李晓风", read: false, createdAt: "2026-05-29T10:30:00.000Z" },
  { id: "msg_003", conversationId: "conv_hunter_zhang", senderId: "u_headhunter_001", receiverId: "u_company_001", senderName: "猎头顾问-陈", receiverName: "王经理", subject: "推荐候选人：张伟 - 固态电池电解质专家", content: "王经理，您好！\n\n根据贵司固态电池研发总监的需求，我推荐张伟博士。\n\n背景：清华大学博士，8年固态电池研发经验，宁德时代背景，多项核心专利。\n\n如感兴趣，我可以安排初步沟通。\n\n陈顾问", read: false, createdAt: "2026-05-29T14:00:00.000Z" },
  { id: "msg_004", conversationId: "conv_admin_notice", senderId: "u_admin_001", receiverId: "u_company_001", senderName: "平台管理员", receiverName: "王经理", subject: "企业认证审核通过通知", content: "尊敬的王经理：\n\n贵司「中国光伏科技集团」的认证审核已通过。现在您可以使用平台的完整功能，包括人才搜索、邀请发送、面试管理等。\n\n如有任何问题，请联系平台客服。\n\n全球风能锂电人才搜索雷达 管理团队", read: false, createdAt: "2026-05-28T16:00:00.000Z" },
]

export async function getConversations(userId: string): Promise<ServiceResult<ConversationRecord[]>> {
  try {
    if (!isServerSide()) {
      // Mock conversations from MOCK_MESSAGES
      const userMsgs = MOCK_MESSAGES.filter(m => m.senderId === userId || m.receiverId === userId)
      const convMap = new Map<string, ConversationRecord>()
      for (const msg of userMsgs) {
        if (!convMap.has(msg.conversationId)) {
          const otherPerson = msg.senderId === userId
            ? { id: msg.receiverId, name: msg.receiverName || "Unknown", role: msg.receiverId.startsWith("u_candidate") ? "candidate" : msg.receiverId.startsWith("u_headhunter") ? "headhunter" : "company" }
            : { id: msg.senderId, name: msg.senderName || "Unknown", role: msg.senderId.startsWith("u_candidate") ? "candidate" : msg.senderId.startsWith("u_headhunter") ? "headhunter" : msg.senderId.startsWith("u_admin") ? "admin" : "company" }
          convMap.set(msg.conversationId, {
            conversationId: msg.conversationId,
            participants: [
              { id: userId, name: "我", role: "self" },
              otherPerson,
            ],
            lastMessage: msg.content.substring(0, 80) + (msg.content.length > 80 ? "..." : ""),
            lastMessageAt: msg.createdAt,
            unreadCount: 0,
          })
        }
        const conv = convMap.get(msg.conversationId)!
        if (msg.createdAt > conv.lastMessageAt) {
          conv.lastMessage = msg.content.substring(0, 80) + (msg.content.length > 80 ? "..." : "")
          conv.lastMessageAt = msg.createdAt
        }
        if (!msg.read && msg.receiverId === userId) conv.unreadCount++
      }
      return { data: Array.from(convMap.values()).sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt)), error: null, source: "mock" }
    }

    // DB: Get all messages for user, aggregate into conversations
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: "desc" },
      include: { sender: { select: { id: true, name: true, role: true } }, receiver: { select: { id: true, name: true, role: true } } },
    })

    const convMap = new Map<string, ConversationRecord>()
    for (const msg of messages) {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender
      if (!convMap.has(msg.conversationId)) {
        convMap.set(msg.conversationId, {
          conversationId: msg.conversationId,
          participants: [
            { id: userId, name: "我", role: "self" },
            { id: otherUser.id, name: otherUser.name, role: otherUser.role || "unknown" },
          ],
          lastMessage: msg.content.substring(0, 80),
          lastMessageAt: msg.createdAt.toISOString(),
          unreadCount: 0,
        })
      }
      const conv = convMap.get(msg.conversationId)!
      if (msg.createdAt.toISOString() > conv.lastMessageAt) {
        conv.lastMessage = msg.content.substring(0, 80)
        conv.lastMessageAt = msg.createdAt.toISOString()
      }
      if (!msg.read && msg.receiverId === userId) conv.unreadCount++
    }
    return { data: Array.from(convMap.values()).sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt)), error: null, source: "db" }
  } catch (err: any) {
    console.error("[DataService] getConversations error:", err.message)
    return { data: [], error: null, source: "mock", total: 0 }
  }
}

export async function getMessages(conversationId: string): Promise<ServiceResult<MessageRecord[]>> {
  try {
    if (!isServerSide()) {
      const msgs = MOCK_MESSAGES.filter(m => m.conversationId === conversationId).sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      return { data: msgs, error: null, source: "mock", total: msgs.length }
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: { sender: { select: { id: true, name: true, role: true } }, receiver: { select: { id: true, name: true, role: true } } },
    })

    return {
      data: messages.map((m: any) => ({
        id: m.id, conversationId: m.conversationId, senderId: m.senderId,
        receiverId: m.receiverId, senderName: m.sender.name, receiverName: m.receiver.name,
        subject: m.subject, content: m.content, read: m.read,
        createdAt: m.createdAt.toISOString(),
      })),
      error: null, source: "db", total: messages.length,
    }
  } catch (err: any) {
    console.error("[DataService] getMessages error:", err.message)
    const msgs = MOCK_MESSAGES.filter(m => m.conversationId === conversationId)
    return { data: msgs, error: null, source: "mock", total: msgs.length }
  }
}

export async function sendMessage(data: {
  conversationId: string
  senderId: string
  receiverId: string
  subject: string
  content: string
}): Promise<ServiceResult<MessageRecord>> {
  try {
    if (!isServerSide()) {
      const mock: MessageRecord = {
        id: `msg_mock_${Date.now()}`,
        ...data,
        senderName: data.senderId === "u_company_001" ? "王经理" : "李晓风",
        receiverName: data.receiverId === "u_company_001" ? "王经理" : "李晓风",
        read: false,
        createdAt: new Date().toISOString(),
      }
      return { data: mock, error: null, source: "mock" }
    }
    const record = await prisma.message.create({ data })
    return {
      data: { id: record.id, conversationId: record.conversationId, senderId: record.senderId, receiverId: record.receiverId, subject: record.subject, content: record.content, read: record.read, createdAt: record.createdAt.toISOString() },
      error: null, source: "db",
    }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

export async function markMessageRead(id: string): Promise<ServiceResult<MessageRecord>> {
  try {
    if (!isServerSide()) {
      const msg = MOCK_MESSAGES.find(m => m.id === id)
      if (msg) msg.read = true
      return { data: msg || null, error: null, source: "mock" }
    }
    const record = await prisma.message.update({ where: { id }, data: { read: true } })
    return { data: { id: record.id, conversationId: record.conversationId, senderId: record.senderId, receiverId: record.receiverId, subject: record.subject, content: record.content, read: true, createdAt: record.createdAt.toISOString() }, error: null, source: "db" }
  } catch (err: any) {
    return { data: null, error: err.message, source: "mock" }
  }
}

// ============================================================
// Email Templates — 邮件模板 (固定6种，无需DB)
// ============================================================

export const EMAIL_TEMPLATES: EmailTemplateRecord[] = [
  {
    id: "tpl_invitation",
    name: "invitation",
    label: "邀请邮件模板",
    description: "向候选人发送招聘邀请的标准邮件模板",
    subject: "诚挚邀请您加入 {{companyName}} — {{jobTitle}}",
    bodyTemplate: `尊敬的 {{candidateName}}：

您好！

我们是 {{companyName}} 人才招聘团队。我们关注到您在 {{industryField}} 领域的杰出成就，特别是您在 {{highlightArea}} 方面的专业能力，令我们印象深刻。

目前，我们正在寻找一位 {{jobTitle}}，我们认为您的背景和经验与此职位高度匹配。

{{personalizedMessage}}

【职位信息】
• 职位名称：{{jobTitle}}
• 工作地点：{{location}}
• 薪资范围：{{salaryRange}}
• 职位类型：{{jobType}}

如您对这个机会感兴趣，请在 {{expiryDate}} 前回复此邮件或通过平台确认。

期待与您的进一步交流！

此致
敬礼

{{senderName}}
{{companyName}} 人才招聘团队
{{contactEmail}}`,
    variables: ["candidateName", "companyName", "jobTitle", "industryField", "highlightArea", "personalizedMessage", "location", "salaryRange", "jobType", "expiryDate", "senderName", "contactEmail"],
    category: "recruitment",
  },
  {
    id: "tpl_interview_confirm",
    name: "interview_confirm",
    label: "面试确认邮件模板",
    description: "确认面试安排并发送详细信息的邮件模板",
    subject: "面试确认：{{jobTitle}} 岗位 — {{interviewDate}}",
    bodyTemplate: `尊敬的 {{candidateName}}：

您好！感谢您对 {{companyName}} {{jobTitle}} 岗位的关注。

我们很高兴通知您，您的面试已确认安排如下：

【面试信息】
• 面试岗位：{{jobTitle}}
• 面试类型：{{interviewType}}
• 面试时间：{{interviewDate}} {{interviewTime}}
• 预计时长：{{durationMinutes}} 分钟
• 面试方式：{{locationType}}
{{#if isOnline}}
• 会议链接：{{meetingLink}}
{{/if}}
• 面试地点：{{location}}

【面试官】
{{interviewerName}}
{{interviewerTitle}}

【面试流程】
{{interviewAgenda}}

【注意事项】
• 请提前 {{preparationMinutes}} 分钟检查设备/到达面试地点
• 请准备好相关身份证明文件
• 如有时间冲突，请至少提前24小时通过平台申请改期

如需改期或有任何疑问，请通过平台或回复此邮件联系我们。

祝您面试顺利！

{{senderName}}
{{companyName}} 招聘团队`,
    variables: ["candidateName", "companyName", "jobTitle", "interviewType", "interviewDate", "interviewTime", "durationMinutes", "locationType", "isOnline", "meetingLink", "location", "interviewerName", "interviewerTitle", "interviewAgenda", "preparationMinutes", "senderName"],
    category: "interview",
  },
  {
    id: "tpl_interview_reschedule",
    name: "interview_reschedule",
    label: "面试改期邮件模板",
    description: "通知面试时间变更的邮件模板",
    subject: "面试时间变更通知：{{jobTitle}} 岗位",
    bodyTemplate: `尊敬的 {{candidateName}}：

您好！关于 {{jobTitle}} 岗位的面试，原定时间需要调整，特此通知。

【变更详情】
• 原定时间：{{originalDate}} {{originalTime}}
• 新时间：{{newDate}} {{newTime}}
• 变更原因：{{rescheduleReason}}

其他面试信息（{{interviewType}}、{{locationType}}、面试官等）保持不变。

如新时间不便，请通过平台重新选择合适时间，或回复此邮件沟通。

给您带来的不便，深表歉意。

{{senderName}}
{{companyName}} 招聘团队`,
    variables: ["candidateName", "jobTitle", "originalDate", "originalTime", "newDate", "newTime", "rescheduleReason", "interviewType", "locationType", "senderName", "companyName"],
    category: "interview",
  },
  {
    id: "tpl_offer",
    name: "offer",
    label: "Offer 发送邮件模板",
    description: "发送正式录用通知书的邮件模板",
    subject: "录用通知书 — {{companyName}} {{jobTitle}}",
    bodyTemplate: `尊敬的 {{candidateName}}：

您好！经过面试与综合评估，我们很高兴通知您，您已被 {{companyName}} 正式录用！

【录用信息】
• 录用岗位：{{jobTitle}}
• 工作地点：{{location}}
• 入职日期：{{startDate}}
• 汇报对象：{{reportTo}}

【薪酬福利】
• 基本年薪：{{baseSalary}}
• 绩效奖金：{{bonus}}
• 股权激励：{{equity}}
• 其他福利：{{benefits}}

【入职材料】
请于入职前准备以下材料：
{{requiredDocuments}}

完整的录用通知书（含详细条款）已附在平台 Offer 中，请在 {{expiryDate}} 前通过平台确认接受。

如有任何疑问，欢迎随时与我们沟通。

期待您加入 {{companyName}}！

{{senderName}}
{{companyName}} 人力资源部`,
    variables: ["candidateName", "companyName", "jobTitle", "location", "startDate", "reportTo", "baseSalary", "bonus", "equity", "benefits", "requiredDocuments", "expiryDate", "senderName"],
    category: "offer",
  },
  {
    id: "tpl_review_pass",
    name: "review_pass",
    label: "审核通过邮件模板",
    description: "通知审核通过的邮件模板（企业认证、候选人验证等）",
    subject: "审核通过通知 — {{reviewType}}",
    bodyTemplate: `尊敬的 {{recipientName}}：

您好！您提交的 {{reviewType}} 审核已通过。

【审核详情】
• 审核类型：{{reviewType}}
• 提交时间：{{submittedAt}}
• 审核时间：{{reviewedAt}}
• 审核结果：✅ 通过
• 审核意见：{{reviewComment}}

{{#if grantedAccess}}
现在您可以：
{{grantedAccess}}
{{/if}}

如有疑问，请联系平台客服。

全球风能锂电人才搜索雷达 管理团队`,
    variables: ["recipientName", "reviewType", "submittedAt", "reviewedAt", "reviewComment", "grantedAccess"],
    category: "review",
  },
  {
    id: "tpl_review_reject",
    name: "review_reject",
    label: "审核驳回邮件模板",
    description: "通知审核驳回及原因的邮件模板",
    subject: "审核结果通知 — {{reviewType}}",
    bodyTemplate: `尊敬的 {{recipientName}}：

您好！您提交的 {{reviewType}} 审核已完成，但未通过本次审核。

【审核详情】
• 审核类型：{{reviewType}}
• 提交时间：{{submittedAt}}
• 审核时间：{{reviewedAt}}
• 审核结果：❌ 未通过
• 驳回原因：{{rejectReason}}

【后续步骤】
{{nextSteps}}

如有异议，您可以在修改后重新提交审核，或联系平台客服进一步沟通。

全球风能锂电人才搜索雷达 管理团队`,
    variables: ["recipientName", "reviewType", "submittedAt", "reviewedAt", "rejectReason", "nextSteps"],
    category: "review",
  },
]

export function getEmailTemplates(): ServiceResult<EmailTemplateRecord[]> {
  return { data: EMAIL_TEMPLATES, error: null, source: "mock", total: EMAIL_TEMPLATES.length }
}

export function getEmailTemplateByName(name: string): ServiceResult<EmailTemplateRecord | null> {
  const tpl = EMAIL_TEMPLATES.find(t => t.name === name) || null
  return { data: tpl, error: tpl ? null : "Template not found", source: "mock" }
}

// ============================================================
// Email Send (Mock)
// ============================================================

export async function sendEmail(data: {
  templateName: string
  senderId: string
  receiverId: string
  receiverEmail: string
  subject: string
  body: string
  metadata?: any
}): Promise<ServiceResult<EmailLogRecord>> {
  try {
    // Mock delay simulating email sending
    if (!isServerSide()) {
      const record: EmailLogRecord = {
        id: `email_mock_${Date.now()}`,
        ...data,
        status: "sent",
        metadata: data.metadata || null,
        createdAt: new Date().toISOString(),
      }
      return { data: record, error: null, source: "mock" }
    }

    const record = await prisma.emailLog.create({
      data: {
        templateName: data.templateName,
        senderId: data.senderId,
        receiverId: data.receiverId,
        receiverEmail: data.receiverEmail,
        subject: data.subject,
        body: data.body,
        status: "sent",
        metadata: data.metadata ? JSON.stringify(data.metadata) : null,
      },
    })

    return {
      data: {
        ...record,
        metadata: safeJsonParse(record.metadata, null),
        createdAt: record.createdAt.toISOString(),
      } as any,
      error: null, source: "db",
    }
  } catch (err: any) {
    console.error("[DataService] sendEmail error:", err.message)
    return { data: null, error: err.message, source: "mock" }
  }
}

export async function getEmailLogs(params?: {
  senderId?: string
  receiverId?: string
  page?: number
  pageSize?: number
}): Promise<ServiceResult<EmailLogRecord[]>> {
  try {
    if (!isServerSide()) return { data: [], error: null, source: "mock", total: 0 }
    const { senderId, receiverId, page = 1, pageSize = 20 } = params || {}
    const where: any = {}
    if (senderId) where.senderId = senderId
    if (receiverId) where.receiverId = receiverId

    const total = await prisma.emailLog.count({ where })
    const records = await prisma.emailLog.findMany({
      where, skip: (page - 1) * pageSize, take: pageSize,
      orderBy: { createdAt: "desc" },
    })
    return {
      data: records.map((r: any) => ({ ...r, metadata: safeJsonParse(r.metadata, null), createdAt: r.createdAt?.toISOString?.() ?? "" })),
      error: null, source: "db", total,
    }
  } catch (err: any) {
    return { data: [], error: null, source: "mock", total: 0 }
  }
}

// ============================================================
// Audit Logs
// ============================================================

export async function createAuditLog(data: {
  userId?: string
  action: string
  resource: string
  resourceId?: string
  detail?: string
  ip?: string
}): Promise<void> {
  try {
    if (!isServerSide()) return
    await prisma.auditLog.create({ data })
  } catch (err: any) {
    console.error("[DataService] createAuditLog error:", err.message)
  }
}

export async function getAuditLogs(params?: {
  page?: number
  pageSize?: number
}): Promise<ServiceResult<AuditLogRecord[]>> {
  try {
    if (!isServerSide()) return { data: [], error: null, source: "mock", total: 0 }
    const { page = 1, pageSize = 50 } = params || {}
    const total = await prisma.auditLog.count()
    const records = await prisma.auditLog.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    })
    return {
      data: records.map((r: any) => ({
        ...r,
        userName: r.user?.name || null,
        createdAt: r.createdAt?.toISOString?.() ?? "",
      })),
      error: null, source: "db", total,
    }
  } catch (err: any) {
    console.error("[DataService] getAuditLogs error:", err.message)
    return { data: [], error: null, source: "mock", total: 0 }
  }
}

// ============================================================
// Seed from mock (import mock candidates into DB)
// ============================================================

export async function seedCandidatesFromMock(): Promise<{ count: number }> {
  try {
    if (!isServerSide()) return { count: 0 }
    let count = 0
    for (const mc of MOCK_CANDIDATES) {
      const existing = await prisma.candidate.findFirst({ where: { name: mc.name } })
      if (!existing) {
        await prisma.candidate.create({
          data: {
            userId: `seed_${mc.id}`,
            name: mc.name,
            title: mc.title,
            summary: mc.summary,
            country: mc.country,
            city: mc.city,
            industry: mc.industry,
            experienceYears: mc.experienceYears,
            currentCompany: mc.currentCompany,
            currentPosition: mc.currentPosition,
            education: JSON.stringify(mc.education),
            skills: JSON.stringify(mc.skills),
            languages: JSON.stringify(mc.languages),
            availability: mc.availability,
            expectedSalary: mc.expectedSalary,
            willingRelocate: mc.willingRelocate,
            verified: mc.verified,
            score: mc.score,
            rank: mc.rank,
            source: mc.source,
            githubUrl: mc.githubUrl,
            linkedinUrl: mc.linkedinUrl,
          },
        })
        count++
      }
    }
    return { count }
  } catch (err: any) {
    console.error("[DataService] seedCandidatesFromMock error:", err.message)
    return { count: 0 }
  }
}
