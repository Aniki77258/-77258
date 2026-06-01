import { NextRequest, NextResponse } from "next/server"
import {
  suggestSalary,
  simulateThinkTime,
  type CurrencyCode,
} from "@/lib/ai/provider"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jobTitle, industry, country, experienceYears, currency } = body

    if (!jobTitle || !industry || !country || experienceYears === undefined) {
      return NextResponse.json(
        { error: "缺少必要参数: jobTitle, industry, country, experienceYears" },
        { status: 400 }
      )
    }

    const validCurrencies: CurrencyCode[] = ["USD", "EUR", "CNY", "SGD", "JPY"]
    const currencyParam: CurrencyCode | undefined =
      currency && validCurrencies.includes(currency) ? currency : undefined

    await simulateThinkTime()
    const result = await suggestSalary(
      jobTitle,
      industry,
      country,
      experienceYears,
      currencyParam
    )

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: "AI 薪酬建议生成失败", detail: String(error) },
      { status: 500 }
    )
  }
}
