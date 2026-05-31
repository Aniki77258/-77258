"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Download, Smartphone } from "lucide-react"

// PWA 安装事件类型声明
declare global {
  interface WindowEventMap {
    beforeinstallprompt: Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> }
  }
  var deferredPrompt: (Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> }) | null
}

let savedPrompt: (Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> }) | null = null

export default function PwaInstallBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // 检测是否已安装（独立模式）
    const standalone = window.matchMedia("(display-mode: standalone)").matches
      || (window.navigator as any).standalone === true
    setIsStandalone(standalone)

    // 检测 iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // 已安装则不显示
    if (standalone) return

    // 用户曾关闭
    const dismissedFlag = localStorage.getItem("pwa-install-dismissed")
    if (dismissedFlag === "true") {
      setDismissed(true)
      return
    }

    // 监听 beforeinstallprompt（Chrome/Edge/三星）
    const handleBeforeInstall = (e: any) => {
      e.preventDefault()
      savedPrompt = e
      setShowBanner(true)
    }
    window.addEventListener("beforeinstallprompt", handleBeforeInstall)

    // iOS 且未安装则显示提示
    if (iOS && !standalone) {
      const shown = sessionStorage.getItem("pwa-ios-shown")
      if (!shown) setShowBanner(true)
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall)
  }, [])

  const handleInstall = useCallback(async () => {
    if (!savedPrompt) {
      // 无 prompt（可能已使用或浏览器不支持）
      alert("请使用 Chrome/Edge 浏览器，点击浏览器地址栏右侧的「安装」按钮，或点击菜单→「安装应用」")
      return
    }
    savedPrompt.prompt()
    const { outcome } = await savedPrompt.userChoice
    if (outcome === "accepted") {
      setShowBanner(false)
    }
    savedPrompt = null
  }, [])

  const handleDismiss = useCallback(() => {
    setShowBanner(false)
    setDismissed(true)
    localStorage.setItem("pwa-install-dismissed", "true")
    sessionStorage.setItem("pwa-ios-shown", "true")
  }, [])

  // 已安装 / 已关闭 / 不显示
  if (isStandalone || dismissed || !showBanner) return null

  return (
    <div className="pwa-install-banner show">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-sky-400" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {isIOS ? "安装到主屏幕" : "安装为桌面应用"}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {isIOS
              ? "点击 Safari 底部分享按钮 → 选择「添加到主屏幕」"
              : "获得更流畅的应用体验，支持离线访问"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {!isIOS && (
          <button
            onClick={handleInstall}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            安装
          </button>
        )}
        <button
          onClick={handleDismiss}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
