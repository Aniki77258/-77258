/**
 * /api/searches — 人才搜索 API（真实数据版）
 *
 * POST — 执行搜索：优先抓取真实学术数据，失败则 fallback 到本地库
 * GET  — 获取搜索历史记录
 *
 * 真实数据源：arXiv API / Crossref API（免费，无需 Key）
 */

import { NextRequest, NextResponse } from "next/server"
import type {
  RecommendationCandidate,
  TalentRecommendation,
  AIResult,
} from "@/lib/ai/types"
import { fetchRealTalent, fetchedToLocalFormat, type FetchedTalent } from "@/lib/ai/realTalentFetcher"
import { searchTalent } from "@/lib/ai/talentDatabase"
import { AI_DISCLAIMER, AI_SAFETY_DISCLAIMER } from "@/lib/ai/types"

// ============================================================
// 内存搜索历史（生产环境应使用数据库）
// ============================================================

const searchHistory: Array<{
  id: string
  query: string
  industry: string
  resultsCount: number
  source: "real" | "local"
  createdAt: string
}> = []

// ============================================================
// 工具函数
// ============================================================

function wrapAI<T>(data: T): AIResult<T> {
  return {
    data,
    generatedAt: new Date().toISOString(),
    disclaimer: AI_DISCLAIMER,
    safetyNote: AI_SAFETY_DISCLAIMER,
    model: "wlr-real-search-v1",
  }
}

/** 计算匹配分：基于关键词叠加 */
function calcMatchScore(
  talent: ReturnType<typeof searchTalent>[number],
  query: string
): number {
  const q = query.toLowerCase()
  let score = 50

  const allText = [
    talent.name,
    talent.title,
    talent.company,
    ...talent.skills,
    ...talent.highlights,
  ].join(" ").toLowerCase()

  // 姓名匹配加权最高
  if (q.includes(talent.name.toLowerCase())) score += 30

  // 技能关键词匹配
  for (const skill of talent.skills) {
    if (q.includes(skill.toLowerCase())) score += 10
  }

  // 公司匹配
  if (q.includes(talent.company.toLowerCase())) score += 8

  // highlights 匹配
  for (const h of talent.highlights) {
    if (q.includes(h.toLowerCase().slice(0, 10))) score += 5
  }

  return Math.min(99, Math.max(55, score + Math.floor(Math.random() * 10)))
}

/** 将真实抓取的人才转为 RecommendationCandidate */
function realToCandidate(
  t: Awaited<ReturnType<typeof fetchRealTalent>>[number],
  query: string,
  idx: number
): RecommendationCandidate {
  // 计算基于关键词的匹配分
  const q = query.toLowerCase()
  let score = 55
  const allText = [t.name, t.title, t.company, ...t.skills, ...t.highlights]
    .join(" ").toLowerCase()
  if (q.split(/\s+/).some(w => w.length > 2 && allText.includes(w))) score += 20
  if (t.papers > 10) score += 10
  if (t.country !== "其他" && !t.country.includes("中国")) score += 5
  score = Math.min(98, Math.max(58, score + Math.floor(Math.random() * 8 - idx * 2)))

  return {
    id: t.id,
    name: t.name,
    title: t.title,
    country: t.country,
    matchScore: score,
    highlights: t.highlights.slice(0, 3),
    riskFlags: t.riskFlags,
    reason: `${t.experienceYears}年经验 · ${t.company} · ${t.skills.slice(0, 2).join(" / ")}${t.paperUrl ? " · [论文链接](" + t.paperUrl + ")" : ""}`,
  }
}

// ============================================================
// POST — 执行搜索
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const query: string = (body.query || "").trim()
    const industry: "wind" | "lithium" | "both" = body.industry || "both"
    const requirements: string[] = body.requirements || []

    if (!query) {
      return NextResponse.json(
        { error: "搜索关键词不能为空" },
        { status: 400 }
      )
    }

    let recommendations: RecommendationCandidate[] = []
    let source: "real" | "local" = "local"
    let marketInsight = ""

    // —— 尝试 1：真实数据抓取 ——
    try {
      const realTalents = await fetchRealTalent(query, industry)
      if (realTalents.length > 0) {
        recommendations = realTalents.map((t, i) =>
          realToCandidate(t, query, i)
        )
        source = "real"
      }
    } catch (realErr) {
      console.warn("[Search API] 真实数据抓取失败，fallback 到本地库:", realErr)
    }

    // —— 尝试 2：本地人才库搜索（fallback）——
    if (recommendations.length === 0) {
      const localProfiles = searchTalent(query, industry)
      recommendations = localProfiles.map((p, i) => ({
        id: p.id,
        name: p.name,
        title: p.title,
        country: p.country,
        matchScore: calcMatchScore(p, query),
        highlights: p.highlights.slice(0, 3),
        riskFlags: p.riskFlags,
        reason: `${p.experienceYears}年经验 · ${p.company} · ${p.skills.slice(0, 3).join(" / ")}`,
      }))
      source = "local"
    }

    // —— 市场洞察 ——
    const industryText =
      industry === "wind" ? "风能"
      : industry === "lithium" ? "锂电"
      : "风能/锂电"
    const overseasCount = recommendations.filter(
      r => r.country && !r.country.includes("中国") && r.country !== "其他"
    ).length
    const avgScore = recommendations.length > 0
      ? Math.round(
          recommendations.reduce((s, r) => s + r.matchScore, 0) /
            recommendations.length
        )
      : 0

    if (recommendations.length > 0) {
      marketInsight = `在${industryText}领域共匹配到 ${recommendations.length} 位人才（数据源：${source === "real" ? "真实学术数据库（arXiv/Crossref）" : "本地人才库"}）。其中海外人才 ${overseasCount} 位，平均匹配度 ${avgScore} 分。建议优先联系匹配度 >80 的候选人进行初步沟通。`
    } else {
      marketInsight = `未找到与"${query}"匹配的人才。建议尝试更宽泛的关键词或切换行业筛选条件。`
    }

    const searchKeywords = [
      ...new Set(
        [query, ...requirements]
          .filter(Boolean)
          .flatMap(q => q.split(/[\s,，+]+/).filter(k => k.length > 1))
      ),
    ]

    // 保存搜索历史
    const searchId = `search_${Date.now()}`
    searchHistory.unshift({
      id: searchId,
      query,
      industry,
      resultsCount: recommendations.length,
      source,
      createdAt: new Date().toISOString(),
    })
    if (searchHistory.length > 50) searchHistory.pop()

    return NextResponse.json({
      success: true,
      searchId,
      source, // 前端可据此展示数据来源标签
      ...wrapAI({
        jobTitle: query,
        jobId: searchId,
        recommendations,
        marketInsight,
        searchKeywords,
      }),
    })
  } catch (err: any) {
    console.error("[Search API] 搜索失败:", err)
    return NextResponse.json(
      { error: err?.message || "搜索请求处理失败" },
      { status: 500 }
    )
  }
}

// ============================================================
// GET — 获取搜索历史
// ============================================================

export async function GET() {
  return NextResponse.json({
    success: true,
    searches: searchHistory,
  })
}
