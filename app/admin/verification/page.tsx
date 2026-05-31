"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/shared/app-sidebar"
import { DemoInitButton } from "@/components/shared/demo-guide"
import DemoFlowGuide from "@/components/demo/demo-flow-guide"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Check, X, Building2, Clock, Search, Eye } from "lucide-react"

interface CompanyVerification {
  id: string
  name: string
  industry?: string
  country?: string
  city?: string
  size?: string
  website?: string
  verified: boolean
  createdAt: string
}

export default function AdminVerificationPage() {
  const [companies, setCompanies] = useState<CompanyVerification[]>([])
  const [loading, setLoading] = useState(true)
  const [actionMsg, setActionMsg] = useState("")
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("pending")

  useEffect(() => {
    fetchCompanies()
  }, [])

  async function fetchCompanies() {
    setLoading(true)
    try {
      const res = await fetch("/api/companies?pageSize=50")
      const data = await res.json()
      if (data.success) setCompanies(data.data || [])
      else setCompanies(getMockCompanies())
    } catch { setCompanies(getMockCompanies()) }
    finally { setLoading(false) }
  }

  async function handleVerify(id: string, verified: boolean) {
    try {
      const res = await fetch(`/api/candidates`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, verified })
      })
      const data = await res.json()
      setActionMsg(data.success ? (verified ? "已通过认证" : "已取消认证") : "操作失败")
      fetchCompanies()
    } catch {
      setCompanies(prev => prev.map(c => c.id === id ? { ...c, verified } : c))
      setActionMsg(`已更新认证状态(演示模式)`)
    }
  }

  const filtered = companies.filter(c => {
    if (filter === "pending") return !c.verified
    if (filter === "verified") return c.verified
    return true
  })

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-400" /> 企业认证审核
            </h1>
            <p className="text-slate-400 text-sm mt-1">审核企业注册信息，通过/拒绝认证申请</p>
          </div>
          <DemoInitButton />
        </div>

        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
          <DemoFlowGuide />
        </div>

        <div className="flex gap-2">
          {[
            { key: "pending" as const, label: "待审核", count: companies.filter(c => !c.verified).length },
            { key: "verified" as const, label: "已认证", count: companies.filter(c => c.verified).length },
            { key: "all" as const, label: "全部", count: companies.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === tab.key ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "text-slate-400 border border-white/5 hover:border-white/10"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {actionMsg && (
          <div className="px-4 py-3 rounded-lg text-sm bg-sky-500/10 text-sky-400 border border-sky-500/20">{actionMsg}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">暂无待审核企业</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((company) => (
              <Card key={company.id} className={`bg-white/5 border ${company.verified ? "border-emerald-500/20" : "border-white/10"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        <span className="text-white font-medium">{company.name}</span>
                        <Badge variant={company.verified ? "success" : "warning"}>
                          {company.verified ? "已认证" : "待审核"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-slate-400 text-xs">
                        {company.industry && <span>行业：{company.industry === "wind" ? "风能" : company.industry === "lithium" ? "锂电" : "风能+锂电"}</span>}
                        {company.country && <span>国家：{company.country}</span>}
                        {company.city && <span>城市：{company.city}</span>}
                        {company.size && <span>规模：{company.size}</span>}
                        {company.website && <span>网站：{company.website}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Clock className="w-3 h-3" />
                        注册时间：{new Date(company.createdAt).toLocaleDateString("zh-CN")}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" onClick={() => window.open(`/companies`, "_blank")}
                        className="bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10">
                        <Eye className="w-3 h-3 mr-1" /> 查看
                      </Button>
                      {!company.verified ? (
                        <Button size="sm" onClick={() => handleVerify(company.id, true)}
                          className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30">
                          <Check className="w-3 h-3 mr-1" /> 通过
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => handleVerify(company.id, false)}
                          className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30">
                          <X className="w-3 h-3 mr-1" /> 撤销
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/admin/stats"}>
            查看运营数据
          </Button>
          <Button size="sm" onClick={() => window.location.href = "/admin/candidates"} className="bg-gradient-to-r from-sky-500 to-blue-600">
            审核候选人资料
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}

function getMockCompanies(): CompanyVerification[] {
  return [
    { id: "comp-1", name: "中国光伏科技集团", industry: "lithium", country: "中国", city: "上海", size: "1000+", website: "https://www.cnpv.com", verified: true, createdAt: "2026-05-01" },
    { id: "comp-2", name: "远景能源", industry: "both", country: "中国", city: "上海", size: "1000+", website: "https://www.envision-energy.com", verified: true, createdAt: "2026-05-05" },
    { id: "comp-3", name: "新风力科技", industry: "wind", country: "中国", city: "无锡", size: "201-500", website: "https://www.newwind.com", verified: false, createdAt: "2026-05-28" },
    { id: "comp-4", name: "GreenVolt GmbH", industry: "lithium", country: "德国", city: "慕尼黑", size: "51-200", website: "https://www.greenvolt.de", verified: false, createdAt: "2026-05-29" },
  ]
}
