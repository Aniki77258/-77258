"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EvaluationsRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/assessments")
  }, [router])
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
    </main>
  )
}
