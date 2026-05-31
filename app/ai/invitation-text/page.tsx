"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AIDisclaimer, AIGeneratedBadge } from "@/components/shared/ai-disclaimer"
import { FileText, Sparkles, Copy, Check, Edit3, Loader2, Type } from "lucide-react"

const STYLES = [
  { key: "formal", label: "正式风格", icon: "📋", desc: "适合大型企业和正式岗位" },
  { key: "concise", label: "简洁风格", icon: "✉️", desc: "适合创业公司或快速沟通" },
  { key: "international", label: "国际风格", icon: "🌍", desc: "中英双语，适合海外候选人" },
  { key: "headhunter", label: "猎头风格", icon: "🎯", desc: "直接高效，适合被动候选人" },
] as const

export default function AIInvitationTextPage() {
  const [candidateName, setCandidateName] = useState("")
  const [candidateTitle, setCandidateTitle] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [style, setStyle] = useState<string>("formal")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ data: { subject: string; body: string } } | null>(null)
  const [editing, setEditing] = useState(false)
  const [editedBody, setEditedBody] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleGenerate() {
    if (!candidateName || !jobTitle || !companyName) return
    setLoading(true)
    const res = await fetch("/api/ai/invitation-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateName, candidateTitle, jobTitle, companyName, style }),
    })
    const json = await res.json()
    setResult(json)
    setEditedBody(json.data.body)
    setEditing(false)
    setCopied(false)
    setLoading(false)
  }

  function handleCopy() {
    if (result) {
      navigator.clipboard.writeText(result.data.body)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-emerald-400" /> AI 邀请文案生成
        </h1>
        <p className="mt-1 text-sm text-slate-400">智能生成候选人邀请文案 · 支持 4 种风格 · 可编辑后再发送</p>
      </div>

      <AIDisclaimer />

      {/* Input */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-emerald-400" /> 文案参数
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="block text-white/80 text-sm mb-1">候选人姓名</label>
              <input type="text" value={candidateName} onChange={(e) => setCandidateName(e.target.value)}
                placeholder="如: Dr. Michael Andersen"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">候选人职位</label>
              <input type="text" value={candidateTitle} onChange={(e) => setCandidateTitle(e.target.value)}
                placeholder="如: Senior Blade Aerodynamicist"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">招聘岗位</label>
              <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                placeholder="如: Blade Design Team Lead"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">公司名称</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                placeholder="如: 远景能源"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>
          </div>

          {/* Style selection */}
          <div>
            <label className="block text-white/80 text-sm mb-2">文案风格</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {STYLES.map((s) => (
                <button key={s.key}
                  onClick={() => setStyle(s.key)}
                  className={`p-3 rounded-lg border text-left transition ${
                    style === s.key
                      ? "border-emerald-500/50 bg-emerald-500/10 text-white"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                  }`}
                >
                  <div className="text-lg mb-1">{s.icon}</div>
                  <div className="text-xs font-medium">{s.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading || !candidateName || !jobTitle || !companyName}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {loading ? "AI 正在撰写…" : "生成邀请文案"}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card className="border-emerald-500/20 bg-white/[0.03]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Type className="h-4 w-4 text-emerald-400" />
              生成的文案
              <AIGeneratedBadge />
              <span className="text-xs text-slate-500 font-normal ml-1">
                · {STYLES.find((s) => s.key === style)?.label}
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              {!editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}
                  className="border-white/10 text-slate-300 hover:text-white">
                  <Edit3 className="h-3 w-3 mr-1" /> 编辑
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleCopy}
                className={copied ? "border-emerald-500/30 text-emerald-400" : "border-white/10 text-slate-300 hover:text-white"}>
                {copied ? <><Check className="h-3 w-3 mr-1" /> 已复制</> : <><Copy className="h-3 w-3 mr-1" /> 复制</>}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Subject */}
            <div className="mb-3">
              <p className="text-[11px] text-slate-500 mb-1">邮件主题</p>
              <p className="text-white text-sm font-medium bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                {result.data.subject}
              </p>
            </div>
            {/* Body */}
            <div>
              <p className="text-[11px] text-slate-500 mb-1">邮件正文</p>
              {editing ? (
                <textarea
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  rows={14}
                  className="w-full px-3 py-2 bg-white/5 border border-emerald-500/30 rounded-lg text-white text-sm focus:outline-none font-mono resize-y"
                />
              ) : (
                <pre className="text-white text-sm whitespace-pre-wrap font-sans bg-white/5 rounded-lg px-3 py-2 border border-white/5 leading-relaxed max-h-96 overflow-y-auto">
                  {editedBody}
                </pre>
              )}
              {editing && (
                <div className="flex items-center gap-2 mt-2">
                  <Button size="sm" onClick={() => { setResult({ data: { ...result.data, body: editedBody } }); setEditing(false) }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    保存修改
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setEditedBody(result.data.body); setEditing(false) }}
                    className="text-slate-400">
                    取消
                  </Button>
                </div>
              )}
            </div>
            <p className="mt-3 text-[11px] text-amber-400/80">
              ⚠️ 文案不会自动发送 — 请审核后手动操作
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
