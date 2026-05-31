"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useAuth } from "@/lib/auth"
import { AppLayout } from "@/components/shared/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MessageSquare, Send, Search, ArrowLeft, User, Building2,
  Shield, Users, Clock, CheckCheck, MessageCircle
} from "lucide-react"

// ============================================================
// Types
// ============================================================
interface MessageItem {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  senderName: string
  receiverName: string
  subject: string
  content: string
  read: boolean
  createdAt: string
}

interface ConversationItem {
  conversationId: string
  participants: { id: string; name: string; role: string }[]
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

// ============================================================
// Mock Data
// ============================================================
const MOCK_MESSAGES: MessageItem[] = [
  {
    id: "msg_001", conversationId: "conv_hr_lixf",
    senderId: "u_company_001", receiverId: "u_candidate_001",
    senderName: "王经理", receiverName: "李晓风",
    subject: "邀请加入中国光伏科技集团",
    content: "李晓风先生，您好！\n\n我们关注到您在风机载荷仿真领域的杰出成就，诚邀您加入中国光伏科技集团，担任海上风电高级工程师一职。\n\n期待您的回复。\n\n王经理\n中国光伏科技集团 HR",
    read: true, createdAt: "2026-05-28T09:00:00.000Z",
  },
  {
    id: "msg_002", conversationId: "conv_hr_lixf",
    senderId: "u_candidate_001", receiverId: "u_company_001",
    senderName: "李晓风", receiverName: "王经理",
    subject: "Re: 邀请加入中国光伏科技集团",
    content: "王经理，您好！\n\n感谢您的邀请。我对海上风电高级工程师职位很感兴趣，想进一步了解项目详情和团队情况。\n\n期待进一步沟通。\n\n李晓风",
    read: false, createdAt: "2026-05-29T10:30:00.000Z",
  },
  {
    id: "msg_003", conversationId: "conv_hunter_zhang",
    senderId: "u_headhunter_001", receiverId: "u_company_001",
    senderName: "猎头顾问-陈", receiverName: "王经理",
    subject: "推荐候选人：张伟 - 固态电池电解质专家",
    content: "王经理，您好！\n\n根据贵司固态电池研发总监的需求，我推荐张伟博士。\n\n背景：清华大学博士，8年固态电池研发经验，宁德时代背景，多项核心专利。\n\n如感兴趣，我可以安排初步沟通。\n\n陈顾问",
    read: false, createdAt: "2026-05-29T14:00:00.000Z",
  },
  {
    id: "msg_004", conversationId: "conv_admin_notice",
    senderId: "u_admin_001", receiverId: "u_company_001",
    senderName: "平台管理员", receiverName: "王经理",
    subject: "企业认证审核通过通知",
    content: "尊敬的王经理：\n\n贵司「中国光伏科技集团」的认证审核已通过。现在您可以使用平台的完整功能，包括人才搜索、邀请发送、面试管理等。\n\n如有任何问题，请联系平台客服。\n\n全球风能锂电人才搜索雷达 管理团队",
    read: false, createdAt: "2026-05-28T16:00:00.000Z",
  },
  {
    id: "msg_005", conversationId: "conv_hr_lixf",
    senderId: "u_company_001", receiverId: "u_candidate_001",
    senderName: "王经理", receiverName: "李晓风",
    subject: "Re: 邀请加入中国光伏科技集团",
    content: "李晓风先生，您好！\n\n很高兴收到您的回复。\n\n我们的海上风电项目是与金风科技合作的国家重点研发计划，团队目前有15位工程师，由前Siemens Gamesa首席工程师带队。\n\n薪资方面我们可以提供具有竞争力的方案，具体可以在面试后进一步沟通。\n\n如果方便的话，我们可以先安排一次视频面试？\n\n期待您的回复。\n\n王经理",
    read: false, createdAt: "2026-05-30T08:00:00.000Z",
  },
  {
    id: "msg_006", conversationId: "conv_hr_schmidt",
    senderId: "u_company_001", receiverId: "u_candidate_003",
    senderName: "王经理", receiverName: "M. Schmidt",
    subject: "Interview Confirmation - Offshore Wind Foundation Engineer",
    content: "Dear Dr. Schmidt,\n\nThank you for your interest in the Offshore Wind Foundation Engineer position at CNPV Group.\n\nWe would like to schedule a technical interview with our Chief Engineer. The proposed time is:\n\n- Date: June 5, 2026\n- Time: 15:00 CET / 21:00 CST\n- Duration: 60 minutes\n- Format: Video call via Teams\n\nPlease confirm your availability at your earliest convenience.\n\nBest regards,\nWang (HR Manager)\nCNPV Group",
    read: true, createdAt: "2026-05-27T11:00:00.000Z",
  },
]

// ============================================================
// Helpers
// ============================================================
function getTimeLabel(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDay = Math.floor((now.getTime() - date.getTime()) / 86400000)

  const time = date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  if (diffDay === 0) return `今天 ${time}`
  if (diffDay === 1) return `昨天 ${time}`
  return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" }) + " " + time
}

function getRoleIcon(role: string) {
  if (role === "company") return Building2
  if (role === "candidate") return User
  if (role === "headhunter") return Users
  if (role === "admin") return Shield
  return User
}

function getRoleColor(role: string): string {
  if (role === "company") return "text-cyan-400 bg-cyan-500/10"
  if (role === "candidate") return "text-purple-400 bg-purple-500/10"
  if (role === "headhunter") return "text-green-400 bg-green-500/10"
  if (role === "admin") return "text-red-400 bg-red-500/10"
  return "text-slate-400 bg-slate-500/10"
}

function buildConversations(messages: MessageItem[], currentUserId: string): ConversationItem[] {
  const convMap = new Map<string, ConversationItem>()

  for (const msg of messages) {
    if (!convMap.has(msg.conversationId)) {
      const otherUser = msg.senderId === currentUserId
        ? { id: msg.receiverId, name: msg.receiverName, role: msg.receiverId.startsWith("u_candidate") ? "candidate" : msg.receiverId.startsWith("u_headhunter") ? "headhunter" : msg.receiverId.startsWith("u_admin") ? "admin" : "company" }
        : { id: msg.senderId, name: msg.senderName, role: msg.senderId.startsWith("u_candidate") ? "candidate" : msg.senderId.startsWith("u_headhunter") ? "headhunter" : msg.senderId.startsWith("u_admin") ? "admin" : "company" }

      convMap.set(msg.conversationId, {
        conversationId: msg.conversationId,
        participants: [
          { id: currentUserId, name: "我", role: "self" },
          otherUser,
        ],
        lastMessage: msg.content,
        lastMessageAt: msg.createdAt,
        unreadCount: 0,
      })
    }

    const conv = convMap.get(msg.conversationId)!
    if (msg.createdAt > conv.lastMessageAt) {
      conv.lastMessage = msg.content
      conv.lastMessageAt = msg.createdAt
    }
    if (!msg.read && msg.receiverId === currentUserId) {
      conv.unreadCount++
    }
  }

  return Array.from(convMap.values()).sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
}

// ============================================================
// Component
// ============================================================
export default function MessagesPage() {
  const { user } = useAuth()
  const currentUserId = "u_company_001" // Mock: enterprise HR
  const [messages, setMessages] = useState<MessageItem[]>(MOCK_MESSAGES)
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  const [activeConv, setActiveConv] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileList, setShowMobileList] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setConversations(buildConversations(messages, currentUserId))
  }, [messages])

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !activeConv) {
      setActiveConv(conversations[0].conversationId)
    }
  }, [conversations, activeConv])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeConv])

  // Mark messages in active conversation as read
  useEffect(() => {
    if (activeConv) {
      setMessages((prev) =>
        prev.map((m) =>
          m.conversationId === activeConv && !m.read ? { ...m, read: true } : m
        )
      )
    }
  }, [activeConv])

  const activeMessages = messages
    .filter((m) => m.conversationId === activeConv)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

  const activeConversation = conversations.find((c) => c.conversationId === activeConv)
  const otherParticipant = activeConversation?.participants.find((p) => p.role !== "self")

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true
    const other = c.participants.find((p) => p.role !== "self")
    return other?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleSendReply = useCallback(() => {
    if (!replyText.trim() || !activeConv || !otherParticipant) return

    const newMsg: MessageItem = {
      id: `msg_new_${Date.now()}`,
      conversationId: activeConv,
      senderId: currentUserId,
      receiverId: otherParticipant.id,
      senderName: "王经理",
      receiverName: otherParticipant.name,
      subject: "回复",
      content: replyText.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMsg])
    setReplyText("")
  }, [replyText, activeConv, otherParticipant, currentUserId])

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-0px)] bg-[#060d1a]">
        {/* ========== Conversation List ========== */}
        <div
          className={`${
            showMobileList ? "flex" : "hidden"
          } lg:flex flex-col w-full lg:w-80 flex-shrink-0 border-r border-white/5 bg-[#0a1120]`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-white/5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-sky-400" />
              <h2 className="text-white font-semibold text-sm">站内信</h2>
              {totalUnread > 0 && (
                <Badge className="bg-red-500/20 text-red-400 text-[10px] px-1.5 py-0 border-0">
                  {totalUnread}
                </Badge>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索会话..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/30"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <MessageCircle className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-xs">暂无会话</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const other = conv.participants.find((p) => p.role !== "self")
                const RoleIcon = getRoleIcon(other?.role || "")
                const isActive = activeConv === conv.conversationId

                return (
                  <div
                    key={conv.conversationId}
                    onClick={() => {
                      setActiveConv(conv.conversationId)
                      setShowMobileList(false)
                    }}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-white/[0.03] transition-all ${
                      isActive
                        ? "bg-sky-500/10 border-l-2 border-l-sky-400"
                        : "hover:bg-white/[0.03] border-l-2 border-l-transparent"
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getRoleColor(other?.role || "")}`}>
                      <RoleIcon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-medium truncate ${conv.unreadCount > 0 ? "text-white" : "text-slate-300"}`}>
                          {other?.name || "未知"}
                        </span>
                        <span className="text-[10px] text-slate-600 flex-shrink-0 ml-2">
                          {getTimeLabel(conv.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className={`text-[11px] truncate ${conv.unreadCount > 0 ? "text-slate-300" : "text-slate-500"}`}>
                          {conv.lastMessage.replace(/\n/g, " ").substring(0, 50)}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-sky-500 text-[9px] font-bold text-white flex items-center justify-center ml-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      {/* Role tag */}
                      <span className={`inline-block text-[9px] px-1.5 py-0 rounded mt-1 ${getRoleColor(other?.role || "")}`}>
                        {other?.role === "company" ? "企业" : other?.role === "candidate" ? "候选人" : other?.role === "headhunter" ? "猎头" : other?.role === "admin" ? "平台" : "用户"}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ========== Message Detail ========== */}
        <div
          className={`${
            !showMobileList ? "flex" : "hidden"
          } lg:flex flex-col flex-1 min-w-0`}
        >
          {activeConversation && otherParticipant ? (
            <>
              {/* Conversation Header */}
              <div className="flex items-center gap-3 px-4 h-14 border-b border-white/5 bg-[#0a1120]">
                <button
                  className="lg:hidden p-1.5 rounded hover:bg-white/10 text-slate-400"
                  onClick={() => setShowMobileList(true)}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                {(() => {
                  const RoleIcon = getRoleIcon(otherParticipant.role)
                  return (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRoleColor(otherParticipant.role)}`}>
                      <RoleIcon className="w-4 h-4" />
                    </div>
                  )
                })()}
                <div>
                  <p className="text-sm font-medium text-white">{otherParticipant.name}</p>
                  <p className="text-[10px] text-slate-500">
                    {otherParticipant.role === "company" ? "企业HR" : otherParticipant.role === "candidate" ? "候选人" : otherParticipant.role === "headhunter" ? "猎头顾问" : otherParticipant.role === "admin" ? "平台管理员" : "用户"}
                  </p>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {activeMessages.map((msg) => {
                  const isMine = msg.senderId === currentUserId
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${isMine ? "order-1" : ""}`}>
                        {/* Bubble */}
                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                            isMine
                              ? "bg-sky-500/20 border border-sky-500/20 text-slate-200 rounded-br-md"
                              : "bg-white/[0.05] border border-white/10 text-slate-300 rounded-bl-md"
                          }`}
                        >
                          {msg.content}
                        </div>
                        {/* Time & Status */}
                        <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                          <span className="text-[10px] text-slate-600">{getTimeLabel(msg.createdAt)}</span>
                          {isMine && (
                            msg.read ? (
                              <CheckCheck className="w-3 h-3 text-sky-500/60" />
                            ) : (
                              <CheckCheck className="w-3 h-3 text-slate-600" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Box */}
              <div className="p-4 border-t border-white/5 bg-[#0a1120]">
                <div className="flex items-end gap-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendReply()
                      }
                    }}
                    placeholder={`回复 ${otherParticipant.name}...`}
                    rows={2}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/30 resize-none"
                  />
                  <Button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2.5 rounded-xl disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-slate-600 mt-2">
                  按 Enter 发送，Shift+Enter 换行 • 消息为模拟数据，不真实发送
                </p>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
              <MessageCircle className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-sm">选择一个会话开始沟通</p>
              <p className="text-xs mt-1">支持候选人与企业、猎头与企业、管理员通知等消息类型</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
