"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { AppLayout } from "@/components/shared/app-sidebar"
import { ProgressStepper, type Step } from "@/components/shared/progress-stepper"
import { DemoGuide } from "@/components/shared/demo-guide"
import DemoFlowGuide from "@/components/demo/demo-flow-guide"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Clock, Check, X, Mail, User, Briefcase, Building2, ArrowRight } from "lucide-react"

const FLOW_STEPS: Step[] = [
  { key: "search", label: "搜索人才", href: "/candidates" },
  { key: "invite", label: "发起邀请", href: "/invitations" },
  { key: "interview", label: "安排面试", href: "/interviews" },
  { key: "assess", label: "查看评估", href: "/assessments" },
  { key: "negotiate", label: "薪资谈判", href: "/negotiations" },
  { key: "offer", label: "发放Offer", href: "/offers" },
]

interface Invitation {
  id: string
  candidateName?: string
  candidate?: { name: string; title?: string }
  jobTitle?: string
  job?: { title: string }
  company?: { name: string }
  status: string
  message?: string
  createdAt: string
}

export default function InvitationsPage() {
  const { user } = useAuth()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionMsg, setActionMsg] = useState("")

  const isCandidate = user?.role === "candidate"
  const currentStep = isCandidate ? "invite" : "invite"

  useEffect(() => {
    fetchInvitations()
  }, [user])

  async function fetchInvitations() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (user?.role === "candidate") {
        params.set("candidateId", user.id)
      } else {
        params.set("companyId", user?.id || "")
      }
      const res = await fetch(`/api/invitations?${params}`)
      const data = await res.json()
      if (data.success) {
        setInvitations(data.data || [])
      } else {
        setInvitations(getMockInvitations())
      }
    } catch {
      setInvitations(getMockInvitations())
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setActionMsg("")
    try {
      const res = await fetch("/api/invitations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      })
      const data = await res.json()
      if (data.success) {
        setActionMsg(newStatus === "accepted" ? "已接受邀请" : "已拒绝邀请")
        fetchInvitations()
      } else {
        setActionMsg("操作失败")
      }
    } catch {
      // Mock: update locally
      setInvitations(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv))
      setActionMsg(newStatus === "accepted" ? "已接受邀请(演示模式)" : "已拒绝邀请(演示模式)")
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; variant: "default" | "success" | "destructive" | "warning" | "outline" }> = {
      pending: { label: "待处理", variant: "warning" },
      accepted: { label: "已接受", variant: "success" },
      declined: { label: "已拒绝", variant: "destructive" },
      expired: { label: "已过期", variant: "outline" },
    }
    const s = map[status] || { label: status, variant: "outline" as const }
    return <Badge variant={s.variant}>{s.label}</Badge>
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">人才邀请</h1>
            <p className="text-slate-400 text-sm mt-1">
              {isCandidate ? "查看企业发给您的邀请" : "管理您发出的候选人邀请"}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <DemoFlowGuide />
        </div>

        <ProgressStepper steps={FLOW_STEPS} currentStep={currentStep} />

        {actionMsg && (
          <div className={`px-4 py-3 rounded-lg text-sm ${
            actionMsg.includes("接受") ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
            actionMsg.includes("拒绝") ? "bg-red-500/10 text-red-400 border border-red-500/20" :
            "bg-sky-500/10 text-sky-400 border border-sky-500/20"
          }`}>
            {actionMsg}
          </div>
        )}

        <DemoGuide
          title={isCandidate ? "查看企业发给您的人才邀请" : "向优秀候选人发起人才邀请"}
          description={isCandidate ? "在这里可以查看、接受或拒绝来自企业的邀请。接受后流程将进入面试阶段。" : "找到心仪的候选人后，点击发起邀请，撰写一段真诚的邀请语，等待候选人回复。"}
          nextLabel={isCandidate ? "查看面试安排" : "安排面试"}
          nextHref="/interviews"
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : invitations.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <Mail className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">暂无邀请记录</p>
              <p className="text-slate-500 text-sm mt-1">
                {isCandidate ? "当企业向您发起邀请时，会出现在这里" : "前往人才搜索页面，找到合适的候选人并发起邀请"}
              </p>
              {!isCandidate && (
                <Button className="mt-4" size="sm" onClick={() => window.location.href = "/candidates"}>
                  去搜索人才 <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {invitations.map((inv) => (
              <Card key={inv.id} className="bg-white/5 border-white/10 hover:border-sky-500/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-medium">
                          {inv.candidate?.name || inv.candidateName || "候选人"}
                        </span>
                        {statusBadge(inv.status)}
                      </div>
                      <div className="flex items-center gap-4 text-slate-400 text-xs">
                        {inv.job?.title || inv.jobTitle ? (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {inv.job?.title || inv.jobTitle}
                          </span>
                        ) : null}
                        {inv.company?.name ? (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {inv.company?.name}
                          </span>
                        ) : null}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(inv.createdAt).toLocaleDateString("zh-CN")}
                        </span>
                      </div>
                      {inv.message && (
                        <p className="text-slate-300 text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                          "{inv.message}"
                        </p>
                      )}
                    </div>
                    {isCandidate && inv.status === "pending" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" onClick={() => handleStatusChange(inv.id, "accepted")}
                          className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
                          <Check className="w-3 h-3 mr-1" /> 接受
                        </Button>
                        <Button size="sm" onClick={() => handleStatusChange(inv.id, "declined")}
                          className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
                          <X className="w-3 h-3 mr-1" /> 拒绝
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Next step navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/candidates"}>
            返回人才搜索
          </Button>
          <Button size="sm" onClick={() => window.location.href = "/interviews"} className="bg-gradient-to-r from-sky-500 to-blue-600">
            下一步：面试管理 <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

function getMockInvitations(): Invitation[] {
  return [
    { id: "inv-mock-1", candidate: { name: "李晓风", title: "风电叶片结构高级工程师" }, job: { title: "风电叶片结构工程师" }, company: { name: "中国光伏科技集团" }, status: "pending", message: "我们非常欣赏您在风电叶片领域的深厚经验，诚邀您加入我们的团队。", createdAt: "2026-05-28T10:00:00Z" },
    { id: "inv-mock-2", candidate: { name: "王储能", title: "锂电池研发总监" }, job: { title: "固态电池研发专家" }, company: { name: "中国光伏科技集团" }, status: "pending", message: "您的固态电池研究成果令人印象深刻，期待与您深入交流。", createdAt: "2026-05-27T14:00:00Z" },
  ]
}
