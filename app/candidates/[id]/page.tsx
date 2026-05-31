"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft, MapPin, Building2, Clock, Globe, Star,
  Github, Linkedin, GraduationCap, Award, BookOpen,
  FileCheck2, AlertCircle, RefreshCw, Zap, Battery,
  ExternalLink, ChevronRight, Phone, Mail, Calendar, TrendingUp,
  BarChart3, Users, Search, Bell, LogOut, Database, FileText, PenTool
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { CandidateRecord } from "@/lib/services/data-service"

export default function CandidateDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [candidate, setCandidate] = useState<CandidateRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"db" | "mock">("mock")

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/candidates/${id}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setCandidate(json.data)
          setDataSource(json.source || "mock")
        } else {
          setError(json.error || "Candidate not found")
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060d1a] flex items-center justify-center">
        <RefreshCw className="h-8 w-8 text-sky-400 animate-spin" />
      </div>
    )
  }

  if (error || !candidate) {
    return (
      <div className="min-h-screen bg-[#060d1a] flex flex-col items-center justify-center text-center p-4">
        <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
        <h1 className="text-white text-xl font-bold mb-2">候选人不存在</h1>
        <p className="text-slate-500 text-sm mb-4">{error || "未找到该候选人"}</p>
        <a href="/candidates" className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700">
          返回人才列表
        </a>
      </div>
    )
  }

  const scoreColor = candidate.score >= 90 ? "text-emerald-400" : candidate.score >= 75 ? "text-sky-400" : "text-amber-400"
  const availMap: Record<string, string> = { immediate: "立即到岗", "1month": "1个月内", "3months": "3个月内" }

  return (
    <main className="min-h-screen bg-[#060d1a] text-slate-100">
      <header className="sticky top-0 z-50 border-b border-[#1a2a44] bg-[#060d1a]/90 backdrop-blur">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/30">
              <Zap className="h-4 w-4 text-sky-400" />
            </div>
            <span className="text-base font-bold text-white">全球风能锂电人才搜索雷达</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:text-white"><Bell className="h-4 w-4" /></button>
            <button className="text-slate-500 hover:text-red-400"><LogOut className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {/* Back */}
        <a href="/candidates" className="inline-flex items-center gap-1 text-slate-500 hover:text-white text-sm mb-6 transition">
          <ArrowLeft className="h-3.5 w-3.5" /> 返回人才列表
        </a>

        {/* Header Card */}
        <Card className="border-[#1a2a44] bg-[#0c1830] p-6 rounded-xl mb-6">
          <div className="flex items-start gap-5">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
              <span className={`text-2xl font-bold ${scoreColor}`}>{candidate.score}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-white">{candidate.name}</h1>
                {candidate.verified && <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">已认证</Badge>}
                <Badge variant="outline" className="border-sky-500/30 text-sky-400">
                  {candidate.industry === "wind" ? "风能" : candidate.industry === "lithium" ? "锂电" : "风+锂"}
                </Badge>
                <Badge variant="outline" className={`${dataSource === "db" ? "border-emerald-500/30 text-emerald-400" : "border-amber-500/30 text-amber-400"} text-xs`}>
                  <Database className="h-2.5 w-2.5 mr-1" />{dataSource === "db" ? "数据库" : "示例数据"}
                </Badge>
              </div>
              <p className="text-slate-300 mt-1">{candidate.title}</p>
              <p className="text-slate-500 text-sm mt-2">{candidate.summary}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{candidate.country} {candidate.city}</span>
                <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{candidate.currentCompany || "保密"}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{availMap[candidate.availability || ""] || candidate.availability}</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" />{candidate.experienceYears} 年经验</span>
              </div>
              {/* External links */}
              <div className="flex items-center gap-2 mt-3">
                {candidate.githubUrl && (
                  <a href={candidate.githubUrl} target="_blank" className="p-1.5 bg-slate-800/50 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition" title="GitHub">
                    <Github className="h-3.5 w-3.5" />
                  </a>
                )}
                {candidate.linkedinUrl && (
                  <a href={candidate.linkedinUrl} target="_blank" className="p-1.5 bg-slate-800/50 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition" title="LinkedIn">
                    <Linkedin className="h-3.5 w-3.5" />
                  </a>
                )}
                {candidate.scholarUrl && (
                  <a href={candidate.scholarUrl} target="_blank" className="p-1.5 bg-slate-800/50 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition" title="Google Scholar">
                    <GraduationCap className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <a href={`/invitations/new?candidateId=${candidate.id}`} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm rounded-lg transition">发送邀请</a>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            {candidate.skills.length > 0 && (
              <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><PenTool className="h-4 w-4 text-sky-400" />技能</h2>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((s) => (
                    <Badge key={s} variant="outline" className="border-sky-500/30 text-sky-300 text-xs px-2.5 py-1">{s}</Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Education */}
            {candidate.education.length > 0 && (
              <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><GraduationCap className="h-4 w-4 text-purple-400" />教育背景</h2>
                <div className="space-y-3">
                  {candidate.education.map((edu: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-[#1a2a44] last:border-0 last:pb-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded bg-purple-500/10 flex items-center justify-center">
                        <GraduationCap className="h-3.5 w-3.5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{edu.degree} · {edu.major}</p>
                        <p className="text-slate-400 text-xs">{edu.school} · {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Publications */}
            {candidate.publications.length > 0 && (
              <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-400" />论文发表</h2>
                <div className="space-y-2">
                  {candidate.publications.map((pub: any, i: number) => (
                    <div key={i} className="text-xs">
                      <p className="text-white font-medium">{pub.title}</p>
                      <p className="text-slate-500">{pub.journal} · {pub.year}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Patents */}
            {candidate.patents.length > 0 && (
              <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Award className="h-4 w-4 text-emerald-400" />专利</h2>
                <div className="space-y-1">
                  {candidate.patents.map((p: string, i: number) => (
                    <p key={i} className="text-xs text-slate-400">{p}</p>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contact */}
            <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
              <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Mail className="h-4 w-4 text-sky-400" />联系信息</h2>
              <div className="space-y-2 text-xs">
                {candidate.email && <p className="text-slate-400">{candidate.email}</p>}
                {candidate.phone && <p className="text-slate-400">{candidate.phone}</p>}
                <p className="text-slate-400">📍 {candidate.currentPosition} @ {candidate.currentCompany}</p>
                <p className="text-slate-400">💰 期望薪资: {candidate.expectedSalary || "未公开"}</p>
                <p className={candidate.willingRelocate ? "text-emerald-400" : "text-amber-400"}>
                  {candidate.willingRelocate ? "✓ 愿意搬迁" : "✗ 不愿搬迁"}
                </p>
              </div>
            </Card>

            {/* Languages */}
            {candidate.languages.length > 0 && (
              <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Globe className="h-4 w-4 text-blue-400" />语言能力</h2>
                <div className="flex flex-wrap gap-1">
                  {candidate.languages.map((l: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-[10px] border-slate-700 text-slate-400">{l}</Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Certificates */}
            {candidate.certificates.length > 0 && (
              <Card className="border-[#1a2a44] bg-[#0c1830] p-4 rounded-xl">
                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><FileCheck2 className="h-4 w-4 text-emerald-400" />证书</h2>
                <div className="space-y-1">
                  {candidate.certificates.map((cert: string, i: number) => (
                    <p key={i} className="text-xs text-slate-400">{cert}</p>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        <footer className="border-t border-[#1a2a44] pt-4 mt-8 pb-8 text-center">
          <p className="text-[11px] text-slate-600">© 2026 全球风能锂电人才搜索雷达 · {dataSource === "db" ? "数据库驱动" : "示例数据平台"}</p>
        </footer>
      </div>
    </main>
  )
}
