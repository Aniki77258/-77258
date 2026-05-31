"use client"

import { useState } from "react"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Check, X, Eye, Clock, Flag } from "lucide-react"

interface Report {
  id: string
  type: string
  reportedName: string
  reportedBy: string
  reason: string
  status: "pending" | "resolved" | "dismissed"
  createdAt: string
}

const mockReports: Report[] = [
  { id: "r1", type: "虚假信息", reportedName: "候选人-张某某", reportedBy: "远景能源HR", reason: "候选人的论文发表记录疑似与实际不符，请求核实", status: "pending", createdAt: "2026-05-29T10:00:00Z" },
  { id: "r2", type: "企业欺诈", reportedName: "某新能源公司", reportedBy: "匿名用户", reason: "该公司发布的职位薪资与实际不符，面试时大幅降低薪资承诺", status: "pending", createdAt: "2026-05-28T15:00:00Z" },
  { id: "r3", type: "骚扰行为", reportedName: "候选人-李某某", reportedBy: "中国光伏科技HR", reason: "候选人持续发送不恰当信息", status: "resolved", createdAt: "2026-05-20T09:00:00Z" },
]

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [actionMsg, setActionMsg] = useState("")

  function handleResolve(id: string, action: "resolved" | "dismissed") {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: action } : r))
    setActionMsg(action === "resolved" ? "举报已处理" : "举报已驳回")
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" /> 举报处理
          </h1>
          <p className="text-slate-400 text-sm mt-1">处理用户举报的虚假信息和违规行为</p>
        </div>

        {actionMsg && (
          <div className="px-4 py-3 rounded-lg text-sm bg-sky-500/10 text-sky-400 border border-sky-500/20">{actionMsg}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-red-500/5 border-red-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-red-400 text-3xl font-bold">{reports.filter(r => r.status === "pending").length}</p>
              <p className="text-slate-400 text-sm">待处理举报</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-500/5 border-emerald-500/20">
            <CardContent className="p-4 text-center">
              <p className="text-emerald-400 text-3xl font-bold">{reports.filter(r => r.status === "resolved").length}</p>
              <p className="text-slate-400 text-sm">已处理</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-white text-3xl font-bold">{reports.length}</p>
              <p className="text-slate-400 text-sm">总计</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id} className={`bg-white/5 border ${
              report.status === "pending" ? "border-red-500/20" :
              report.status === "resolved" ? "border-emerald-500/20" : "border-white/10"
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={report.type === "虚假信息" ? "destructive" : "warning"}>{report.type}</Badge>
                      <Badge variant={
                        report.status === "pending" ? "warning" :
                        report.status === "resolved" ? "success" : "outline"
                      }>
                        {report.status === "pending" ? "待处理" : report.status === "resolved" ? "已处理" : "已驳回"}
                      </Badge>
                    </div>
                    <p className="text-white font-medium">被举报：{report.reportedName}</p>
                    <p className="text-slate-400 text-sm">举报人：{report.reportedBy}</p>
                    <div className="bg-white/5 rounded-lg p-3">
                      <p className="text-slate-300 text-sm flex items-start gap-2">
                        <Flag className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        {report.reason}
                      </p>
                    </div>
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(report.createdAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                  {report.status === "pending" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <Button size="sm" onClick={() => handleResolve(report.id, "resolved")}
                        className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <Check className="w-3 h-3 mr-1" /> 处理
                      </Button>
                      <Button size="sm" onClick={() => handleResolve(report.id, "dismissed")}
                        className="bg-slate-500/20 text-slate-400 border border-slate-500/30">
                        <X className="w-3 h-3 mr-1" /> 驳回
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/admin/candidates"}>
            返回候选人审核
          </Button>
          <Button size="sm" onClick={() => window.location.href = "/admin/stats"} className="bg-gradient-to-r from-sky-500 to-blue-600">
            查看运营数据
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
