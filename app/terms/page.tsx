"use client"

import Link from "next/link"
import { Zap, FileText } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export default function TermsPage() {
  const { language } = useLanguage()
  const isZh = language === 'zh'

  const sections = isZh ? [
    { title: "1. 服务说明", content: "WLR 人才雷达是一个面向全球风能、锂电与储能领域的人才搜索与招聘服务平台。我们提供人才搜索、AI 匹配、面试安排、薪酬谈判等全流程招聘服务。" },
    { title: "2. 用户责任", content: "用户应保证提供的信息真实、准确、完整。禁止发布虚假信息、侵犯他人权益的内容或进行任何违法活动。" },
    { title: "3. 知识产权", content: "平台的所有技术、算法、界面设计均为 WLR 所有。用户上传的内容知识产权归用户所有，但授予平台必要的使用许可。" },
    { title: "4. 服务变更", content: "我们保留随时修改或中断服务的权利，重要变更将提前通知用户。" },
    { title: "5. 责任限制", content: "在法律允许的最大范围内，WLR 对因使用或无法使用服务而造成的任何间接、附带损失不承担责任。" },
    { title: "6. 争议解决", content: "本协议适用中华人民共和国法律。如发生争议，双方应友好协商解决；协商不成的，提交上海仲裁委员会仲裁。" },
  ] : [
    { title: "1. Service Description", content: "WLR Talent Radar is a global talent search and recruitment platform for wind energy, lithium battery, and energy storage industries. We provide full-cycle recruitment services." },
    { title: "2. User Responsibilities", content: "Users must ensure all provided information is true, accurate, and complete. False information and illegal activities are prohibited." },
    { title: "3. Intellectual Property", content: "All technology, algorithms, and designs are owned by WLR. User-uploaded content remains the user's property, with necessary licenses granted to the platform." },
    { title: "4. Service Changes", content: "We reserve the right to modify or discontinue services, with advance notice for material changes." },
    { title: "5. Liability Limitation", content: "To the maximum extent permitted by law, WLR is not liable for any indirect or incidental damages." },
    { title: "6. Dispute Resolution", content: "This agreement is governed by the laws of the People's Republic of China. Disputes shall be submitted to Shanghai Arbitration Commission." },
  ]

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-white/10 bg-black/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-sky-400" />
            <span className="text-white font-bold text-lg">WLR Talent Radar</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="text-slate-400 hover:text-white text-sm">{isZh ? "隐私政策" : "Privacy"}</Link>
            <Link href="/login" className="px-4 py-2 text-white hover:bg-white/10 rounded text-sm">{isZh ? "登录" : "Login"}</Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <FileText className="w-12 h-12 text-sky-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">{isZh ? "用户协议" : "Terms of Service"}</h1>
          <p className="text-slate-400">{isZh ? "最后更新：2026年5月" : "Last updated: May 2026"}</p>
        </div>

        <div className="space-y-6">
          {sections.map((s) => (
            <div key={s.title} className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-3">{s.title}</h2>
              <p className="text-slate-400 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 WLR Talent Radar. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
