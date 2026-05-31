"use client"

import Link from "next/link"
import { Zap, Shield } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export default function PrivacyPage() {
  const { language } = useLanguage()
  const isZh = language === 'zh'

  const sections = isZh ? [
    { title: "1. 数据收集", content: "我们仅收集为您提供服务所必需的最少数据，包括账户信息、使用记录和偏好设置。我们不会收集或存储任何敏感个人信息。" },
    { title: "2. 数据使用", content: "您的数据仅用于改善服务体验、提供个性化推荐和确保平台安全。我们绝不会将您的数据出售给第三方。" },
    { title: "3. 数据安全", content: "采用 AES-256 加密、TLS 1.3 传输加密，以及企业级访问控制，确保您的数据安全。" },
    { title: "4. Cookie 政策", content: "我们使用必要的 Cookie 来维持平台功能，您可以在浏览器设置中管理 Cookie 偏好。" },
    { title: "5. 用户权利", content: "您有权访问、更正、删除您的个人数据。如需行使这些权利，请联系我们的数据保护团队。" },
    { title: "6. 联系我们", content: "如有隐私相关问题，请发送邮件至 privacy@globaltalentradar.com" },
  ] : [
    { title: "1. Data Collection", content: "We only collect the minimum data necessary to provide our services, including account information, usage records, and preferences. We do not collect or store any sensitive personal information." },
    { title: "2. Data Usage", content: "Your data is used solely to improve service experience, provide personalized recommendations, and ensure platform security. We never sell your data to third parties." },
    { title: "3. Data Security", content: "We use AES-256 encryption, TLS 1.3 transport encryption, and enterprise-grade access control to ensure your data security." },
    { title: "4. Cookie Policy", content: "We use essential cookies to maintain platform functionality. You can manage cookie preferences in your browser settings." },
    { title: "5. User Rights", content: "You have the right to access, correct, and delete your personal data. To exercise these rights, please contact our data protection team." },
    { title: "6. Contact Us", content: "For privacy-related questions, please email privacy@globaltalentradar.com" },
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
            <Link href="/terms" className="text-slate-400 hover:text-white text-sm">{isZh ? "用户协议" : "Terms"}</Link>
            <Link href="/login" className="px-4 py-2 text-white hover:bg-white/10 rounded text-sm">{isZh ? "登录" : "Login"}</Link>
          </div>
        </div>
      </nav>

      <section className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <Shield className="w-12 h-12 text-sky-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">{isZh ? "隐私政策" : "Privacy Policy"}</h1>
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
