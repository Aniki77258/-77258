"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { useLanguage } from "@/lib/i18n"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, User, Shield, Bell, Lock, Save, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const [activeTab, setActiveTab] = useState<"profile" | "privacy" | "notifications">("profile")
  const [saved, setSaved] = useState(false)

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [hideContact, setHideContact] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" /> {t('settings.title')}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{t('settings.subtitle')}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: "profile" as const, label: t('settings.tabProfile'), icon: User },
            { key: "privacy" as const, label: t('settings.tabPrivacy'), icon: Shield },
            { key: "notifications" as const, label: t('settings.tabNotifications'), icon: Bell },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "text-slate-400 border border-white/5 hover:border-white/10"
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {saved && (
          <div className="px-4 py-3 rounded-lg text-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {t('settings.saved')}
          </div>
        )}

        {activeTab === "profile" && (
          <>
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">{t('settings.tabProfile')}</CardTitle>
                <CardDescription>{t('settings.profileDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-1.5">{t('settings.name')}</label>
                  <input value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-1.5">{t('settings.email')}</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-1.5">{t('settings.phone')}</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t('settings.phonePlaceholder')}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-sky-500/50" />
                </div>
                <div>
                  <label className="block text-white/80 text-sm mb-1.5">{t('settings.bio')}</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder={t('settings.bioPlaceholder')}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none" />
                </div>
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <h3 className="text-sm font-semibold text-white mb-3">{t('settings.language')}</h3>
              <div className="flex gap-2">
                <button onClick={() => setLanguage('zh')}
                  className={`px-4 py-2 rounded text-sm ${language === 'zh' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
                  {t('settings.languageZh')}
                </button>
                <button onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded text-sm ${language === 'en' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
                  {t('settings.languageEn')}
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "privacy" && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5" /> {t('settings.tabPrivacy')}
              </CardTitle>
              <CardDescription>{t('settings.privacyDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{t('settings.publicProfile')}</p>
                  <p className="text-slate-500 text-xs">{t('settings.publicProfileDesc')}</p>
                </div>
                <button onClick={() => setIsPublic(!isPublic)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${isPublic ? "bg-sky-500" : "bg-slate-700"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${isPublic ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{t('settings.hideContact')}</p>
                  <p className="text-slate-500 text-xs">{t('settings.hideContactDesc')}</p>
                </div>
                <button onClick={() => setHideContact(!hideContact)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${hideContact ? "bg-sky-500" : "bg-slate-700"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${hideContact ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "notifications" && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" /> {t('settings.tabNotifications')}
              </CardTitle>
              <CardDescription>{t('settings.notificationsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[t('settings.notifInvite'), t('settings.notifInterview'), t('settings.notifOffer'), t('settings.notifSystem')].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white text-sm">{item}</span>
                  <button className={`w-11 h-6 rounded-full transition-colors relative bg-sky-500`}>
                    <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform translate-x-5" />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
          <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
            {t('settings.cancel')}
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-sky-500 to-blue-600">
            <Save className="w-4 h-4 mr-1" /> {t('settings.save')}
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
