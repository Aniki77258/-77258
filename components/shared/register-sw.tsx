"use client"

// 注册 Service Worker — 仅在生产环境且浏览器支持时启用
export default function RegisterSW() {
  if (typeof window === "undefined") return null
  if (process.env.NODE_ENV === "development") return null

  const register = async () => {
    if (!("serviceWorker" in navigator)) return
    try {
      await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      })
    } catch {
      // Service Worker 注册失败为可预期行为，静默忽略
    }
  }

  if (document.readyState === "complete") {
    register()
  } else {
    window.addEventListener("load", register)
  }

  return null
}
