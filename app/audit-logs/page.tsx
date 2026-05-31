"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { History, Search, Clock, User } from "lucide-react"

interface AuditLogItem {
  id: string
  userId?: string
  action: string
  resource: string
  resourceId?: string
  detail?: string
  ip?: string
  createdAt: string
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    setLoading(true)
    try {
      const res = await fetch("/api/audit-logs?pageSize=50")
      const data = await res.json()
      if (data.success) setLogs(data.data || [])
      else setLogs(getMockLogs())
    } catch { setLogs(getMockLogs()) }
    finally { setLoading(false) }
  }

  const actionLabel = (action: string) => {
    const map: Record<string, string> = {
      create: "创建", update: "更新", delete: "删除", view: "查看", export: "导出", login: "登录", logout: "登出"
    }
    return map[action] || action
  }

  const actionColor = (action: string): "default" | "success" | "destructive" | "warning" | "outline" => {
    const map: Record<string, "default" | "success" | "destructive" | "warning" | "outline"> = {
      create: "success", update: "default", delete: "destructive", view: "outline", login: "warning", logout: "outline"
    }
    return map[action] || "outline"
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-slate-400" /> 审计日志
          </h1>
          <p className="text-slate-400 text-sm mt-1">查看系统操作记录和数据变更历史</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div key={log.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-sky-500/20 transition-all"
              >
                <Badge variant={actionColor(log.action)} className="flex-shrink-0">
                  {actionLabel(log.action)}
                </Badge>
                <div className="flex-1 min-w-0">
                  <span className="text-white text-sm font-medium">{log.resource}</span>
                  {log.detail && <span className="text-slate-400 text-sm ml-2">- {log.detail}</span>}
                </div>
                <div className="flex items-center gap-3 text-slate-500 text-xs flex-shrink-0">
                  {log.ip && <span className="flex items-center gap-1"><User className="w-3 h-3" />{log.ip}</span>}
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(log.createdAt).toLocaleString("zh-CN")}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/admin/stats"}>
            返回运营数据
          </Button>
          <Button size="sm" onClick={() => window.location.href = "/dashboard"} className="bg-gradient-to-r from-sky-500 to-blue-600">
            返回控制台
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

function getMockLogs(): AuditLogItem[] {
  return [
    { id: "log-1", userId: "u_company_001", action: "login", resource: "session", detail: "企业用户-张明辉 登录系统", ip: "192.168.1.100", createdAt: "2026-05-30T08:00:00Z" },
    { id: "log-2", userId: "u_company_001", action: "view", resource: "candidate", resourceId: "c1", detail: "查看候选人-李晓风 详情", ip: "192.168.1.100", createdAt: "2026-05-30T08:05:00Z" },
    { id: "log-3", userId: "u_company_001", action: "create", resource: "invitation", detail: "向候选人-李晓风 发起邀请", ip: "192.168.1.100", createdAt: "2026-05-30T08:10:00Z" },
    { id: "log-4", userId: "u_candidate_001", action: "login", resource: "session", detail: "候选人-李晓风 登录系统", ip: "73.xxx.xxx.xxx", createdAt: "2026-05-30T09:00:00Z" },
    { id: "log-5", userId: "u_candidate_001", action: "update", resource: "invitation", resourceId: "inv-1", detail: "接受中国光伏科技集团的邀请", ip: "73.xxx.xxx.xxx", createdAt: "2026-05-30T09:15:00Z" },
    { id: "log-6", userId: "u_company_001", action: "create", resource: "interview", detail: "安排与李晓风 的视频面试", ip: "192.168.1.100", createdAt: "2026-05-30T10:00:00Z" },
    { id: "log-7", userId: "u_admin_001", action: "update", resource: "company", resourceId: "comp-1", detail: "通过中国光伏科技集团 的企业认证", ip: "10.0.0.1", createdAt: "2026-05-30T11:00:00Z" },
    { id: "log-8", userId: "u_company_001", action: "create", resource: "offer", detail: "向李晓风 发送Offer", ip: "192.168.1.100", createdAt: "2026-05-30T14:00:00Z" },
    { id: "log-9", userId: "u_candidate_001", action: "update", resource: "offer", resourceId: "off-1", detail: "接受Offer，确认入职", ip: "73.xxx.xxx.xxx", createdAt: "2026-05-30T15:00:00Z" },
    { id: "log-10", userId: "u_admin_001", action: "view", resource: "dashboard", detail: "查看平台运营数据", ip: "10.0.0.1", createdAt: "2026-05-30T16:00:00Z" },
  ]
}
