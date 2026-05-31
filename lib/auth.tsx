"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { AuthUser, UserRole } from "@/lib/auth-utils"
import { getToken, removeToken, mockVerifyToken, mockLogin, mockRegister, getUserById } from "@/lib/auth-utils"

interface AuthContextType {
  user: AuthUser | null
  role: UserRole | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (data: {
    name: string; email: string; password: string
    role: UserRole; country: string; industry: string
  }) => Promise<{ success: boolean; message: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const role = user?.role ?? null

  // Load user from token on mount
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    const payload = mockVerifyToken(token)
    if (payload) {
      const u = getUserById(payload.sub)
      if (u) setUser(u)
      else removeToken()
    } else {
      removeToken()
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = mockLogin(email, password)
      if (!result) return { success: false, message: "邮箱或密码错误" }
      const { user: u, token } = result
      const { saveToken } = await import("@/lib/auth-utils")
      saveToken(token)
      setUser(u)
      return { success: true, message: "登录成功" }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      return { success: false, message: "登录异常: " + msg }
    }
  }, [])

  const register = useCallback(async (data: {
    name: string; email: string; password: string
    role: UserRole; country: string; industry: string
  }) => {
    const result = mockRegister(data)
    if (!result) return { success: false, message: "该邮箱已被注册" }
    const { user: u, token } = result
    const { saveToken } = await import("@/lib/auth-utils")
    saveToken(token)
    setUser(u)
    return { success: true, message: "注册成功" }
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export function useRequireAuth(requiredRole?: UserRole | UserRole[]) {
  const { user, role, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push("/login?redirect=" + encodeURIComponent(window.location.pathname))
      return
    }
    if (requiredRole) {
      const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      if (!allowed.includes(role!)) {
        router.push("/unauthorized")
        return
      }
    }
  }, [loading, user, role, requiredRole, router])

  return { user, role, loading }
}
