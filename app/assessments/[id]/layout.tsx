import type { Metadata } from "next"

export function generateStaticParams() {
  return [{ id: "demo-1" }, { id: "demo-2" }]
}

export const metadata: Metadata = {
  title: "评估详情 - 全球风能锂电人才搜索雷达",
}

export default function AssessmentDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
