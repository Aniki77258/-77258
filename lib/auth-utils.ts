// Mock JWT utilities — no external dependency needed
// Uses TextEncoder/TextDecoder for Unicode-safe base64url encoding
// (btoa/atob only support Latin1, crash on Chinese characters like "系统管理员")

const STORAGE_KEY = "gtr_token"
const MOCK_SECRET = "gtr_mock_secret_2026"

export type UserRole = "visitor" | "candidate" | "company" | "headhunter" | "expert" | "admin"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  company?: string
  country?: string
  industry?: string
}

export interface AuthTokenPayload {
  sub: string
  name: string
  email: string
  role: UserRole
  exp: number
}

// Unicode-safe base64url encode (supports Chinese/emoji/etc.)
function base64urlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str)
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("")
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

// Unicode-safe base64url decode (supports Chinese/emoji/etc.)
function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export function mockSignToken(payload: Omit<AuthTokenPayload, "exp">, expiresInHours = 24): string {
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = { ...payload, exp: now + expiresInHours * 3600 }
  const header = { alg: "HS256", typ: "JWT" }
  const h = base64urlEncode(JSON.stringify(header))
  const p = base64urlEncode(JSON.stringify(fullPayload))
  // Mock signature (not real HMAC — this is for demo only)
  const sig = base64urlEncode(`${MOCK_SECRET}:${h}.${p}`)
  return `${h}.${p}.${sig}`
}

export function mockVerifyToken(token: string): AuthTokenPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null
    const payload: AuthTokenPayload = JSON.parse(base64urlDecode(parts[1]))
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) return null
    return payload
  } catch {
    return null
  }
}

// Storage helpers
export function saveToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, token)
  // Also set as cookie for middleware authentication
  document.cookie = `wlr_token=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax`
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEY)
}

export function removeToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
  // Clear the auth cookie as well
  document.cookie = "wlr_token=; path=/; max-age=0"
}

// Mock user database — Map for O(1) lookup + size cap (prevents HMR memory leak)
const MOCK_USER_MAP = new Map<string, AuthUser & { password: string }>()
const MAX_MOCK_USERS = 500

// Seed built-in users (idempotent — safe for HMR)
function seedMockUsers() {
  const builtins: (AuthUser & { password: string })[] = [
    {
      id: "u_admin_001",
      name: "系统管理员",
      email: "admin",
      password: "123456",
      role: "admin",
    },
    {
      id: "u_boss_001",
      name: "老板",
      email: "boss",
      password: "123456",
      role: "admin",
    },
    {
      id: "u_company_001",
      name: "张明辉",
      email: "hr@demo-solar.cn",
      password: "company123",
      role: "company",
      company: "光伏科技集团(演示)",
      country: "中国",
      industry: "lithium",
    },
    {
      id: "u_candidate_001",
      name: "李晓风",
      email: "lixiaofeng@demo-tech.org",
      password: "candidate123",
      role: "candidate",
      country: "美国",
      industry: "wind",
    },
    {
      id: "u_headhunter_001",
      name: "王猎头",
      email: "hunter@demo-headhunter.cn",
      password: "hunter123",
      role: "headhunter",
      company: "顶尖猎头机构",
      country: "中国",
      industry: "both",
    },
    {
      id: "u_expert_001",
      name: "陈教授",
      email: "professor@demo-university.cn",
      password: "expert123",
      role: "expert",
      country: "中国",
      industry: "lithium",
    },
  ]
  for (const u of builtins) {
    if (!MOCK_USER_MAP.has(u.id)) MOCK_USER_MAP.set(u.id, u)
  }
}
seedMockUsers()

export function mockLogin(email: string, password: string): { user: AuthUser; token: string } | null {
  for (const u of MOCK_USER_MAP.values()) {
    if (u.email === email && u.password === password) {
      const { password: _, ...user } = u
      const token = mockSignToken({ sub: user.id, name: user.name, email: user.email, role: user.role })
      return { user, token }
    }
  }
  return null
}

export function mockRegister(data: {
  name: string
  email: string
  password: string
  role: UserRole
  country: string
  industry: string
}): { user: AuthUser; token: string } | null {
  for (const u of MOCK_USER_MAP.values()) {
    if (u.email === data.email) return null
  }
  if (MOCK_USER_MAP.size >= MAX_MOCK_USERS) return null
  const id = `u_${data.role}_${Date.now()}`
  const newUser = {
    id,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
    country: data.country,
    industry: data.industry,
  }
  MOCK_USER_MAP.set(id, newUser)
  const { password: _, ...user } = newUser
  const token = mockSignToken({ sub: user.id, name: user.name, email: user.email, role: user.role })
  return { user, token }
}

export function getUserById(id: string): AuthUser | null {
  const found = MOCK_USER_MAP.get(id)
  if (!found) return null
  const { password: _, ...user } = found
  return user
}

// Role-based permission helpers
export function canAccessDashboard(role: UserRole): boolean {
  return role !== "visitor"
}

export function canViewCandidateContact(role: UserRole): boolean {
  return ["company", "headhunter", "admin"].includes(role)
}

export function canManageOwnProfile(role: UserRole): boolean {
  return role === "candidate"
}

export function canViewExpertEvaluations(role: UserRole): boolean {
  return ["expert", "admin"].includes(role)
}

export function canAccessAdminPanel(role: UserRole): boolean {
  return role === "admin"
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    visitor: "游客",
    candidate: "候选人",
    company: "企业用户",
    headhunter: "猎头",
    expert: "行业专家",
    admin: "管理员",
  }
  return labels[role]
}

export function getRoleBadgeVariant(role: UserRole): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
    visitor: "outline",
    candidate: "secondary",
    company: "default",
    headhunter: "default",
    expert: "secondary",
    admin: "destructive",
  }
  return variants[role]
}
