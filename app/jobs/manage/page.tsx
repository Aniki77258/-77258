"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/i18n"
import { Zap, Plus, Search, Briefcase, MapPin, DollarSign, Calendar, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface Job {
  id: string
  title: string
  department: string
  location: string
  salary: string
  status: "active" | "paused" | "closed"
  applicants: number
  postedAt: string
}

const MOCK_JOBS: Job[] = [
  { id: "J-001", title: "Senior Wind Turbine Engineer", department: "Wind Energy R&D", location: "Copenhagen, Denmark", salary: "$120k - $160k", status: "active", applicants: 23, postedAt: "2026-05-15" },
  { id: "J-002", title: "Battery Management System Lead", department: "Battery Technology", location: "Shanghai, China", salary: "¥80万 - ¥120万/年", status: "active", applicants: 18, postedAt: "2026-05-10" },
  { id: "J-003", title: "Energy Storage Solutions Architect", department: "Energy Storage", location: "Austin, USA", salary: "$140k - $190k", status: "active", applicants: 12, postedAt: "2026-05-08" },
  { id: "J-004", title: "Offshore Wind Project Manager", department: "Offshore Wind", location: "Oslo, Norway", salary: "€100k - €140k", status: "paused", applicants: 7, postedAt: "2026-04-20" },
  { id: "J-005", title: "Solid-State Battery Researcher", department: "Battery R&D", location: "Tokyo, Japan", salary: "¥1000万 - ¥1500万/年", status: "active", applicants: 31, postedAt: "2026-05-20" },
]

export default function JobsManagePage() {
  const { t, language } = useLanguage()
  const isZh = language === 'zh'
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filtered = MOCK_JOBS.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === "all" || j.status === statusFilter
    return matchSearch && matchStatus
  })

  const statusLabel = (s: string) => {
    if (!isZh) return s.charAt(0).toUpperCase() + s.slice(1)
    return { active: "招聘中", paused: "已暂停", closed: "已关闭" }[s] || s
  }

  const statusColor = (s: string) => {
    return { active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", paused: "bg-amber-500/10 text-amber-400 border-amber-500/20", closed: "bg-slate-500/10 text-slate-400 border-slate-500/20" }[s] || ""
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <span className="text-white font-bold text-lg">{t('home.title')}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm">{t('nav.dashboard')}</Link>
            <Link href="/searches" className="text-slate-400 hover:text-white text-sm">{t('nav.search')}</Link>
            <Link href="/settings" className="text-slate-400 hover:text-white text-sm">{t('nav.settings')}</Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-sky-400" />
              {isZh ? "职位管理" : "Job Management"}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{isZh ? "管理所有发布的职位需求" : "Manage all published job postings"}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-white text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            {isZh ? "发布新职位" : "Post New Job"}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isZh ? "搜索职位或部门..." : "Search jobs or departments..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            <option value="all">{isZh ? "全部状态" : "All Statuses"}</option>
            <option value="active">{isZh ? "招聘中" : "Active"}</option>
            <option value="paused">{isZh ? "已暂停" : "Paused"}</option>
            <option value="closed">{isZh ? "已关闭" : "Closed"}</option>
          </select>
        </div>

        {/* Jobs table */}
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "职位" : "Job"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "部门" : "Department"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "地点" : "Location"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "薪资" : "Salary"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "状态" : "Status"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "申请" : "Applicants"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase">{isZh ? "发布日期" : "Posted"}</th>
                  <th className="px-6 py-3 text-xs font-medium text-slate-400 uppercase"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{job.title}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{job.id}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{job.department}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {job.location}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-slate-500" />
                      {job.salary}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor(job.status)}`}>
                        {statusLabel(job.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{job.applicants}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{job.postedAt}</td>
                    <td className="px-6 py-4">
                      <button className="text-slate-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{isZh ? "暂无匹配的职位" : "No matching jobs found"}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
