# 全球风能锂电人才搜索雷达 — 公共互联网全栈平台优化方案

> **文档版本**: v2.0  
> **生成日期**: 2026-05-31  
> **优化专家**: WorkBuddy 公共互联网全栈平台优化专家  
> **目标**: 基于当前项目状态诊断，输出可直接用于开发的完整优化方案

---

## 目录

1. [项目总览](#1-项目总览)
2. [当前状态诊断](#2-当前状态诊断)
3. [平台级 CEO 操作仓首页](#3-平台级-ceo-操作仓首页)
4. [公共互联网访问设计](#4-公共互联网访问设计)
5. [多角色权限系统](#5-多角色权限系统)
6. [六大核心模块设计](#6-六大核心模块设计)
7. [页面架构设计](#7-页面架构设计)
8. [数据真实性与合规机制](#8-数据真实性与合规机制)
9. [数据库设计优化](#9-数据库设计优化)
10. [API 接口设计](#10-api-接口设计)
11. [技术架构建议](#11-技术架构建议)
12. [UI 风格要求](#12-ui-风格要求)
13. [平台商业模式设计](#13-平台商业模式设计)
14. [安全与合规要求](#14-安全与合规要求)
15. [示例数据规则](#15-示例数据规则)
16. [MVP 开发计划](#16-mvp-开发计划)
17. [优化任务优先级矩阵](#17-优化任务优先级矩阵)

---

## 1. 项目总览

### 1.1 基础信息

| 属性 | 值 |
|------|-----|
| **网站名称** | 全球风能锂电人才搜索雷达 (Global Wind & Lithium Talent Radar) |
| **英文名称** | Global Wind & Lithium Talent Radar |
| **平台类型** | 公共互联网 SaaS 平台 |
| **目标用户** | 全球新能源企业、猎头机构、高端候选人、行业专家、平台管理员 |
| **核心行业** | 风能、锂电、储能、电池材料、BMS、电芯制造、风电整机、叶片、电控、海外项目管理 |
| **技术栈** | Next.js 14 + TypeScript + Prisma + Tailwind CSS + shadcn/ui |

### 1.2 平台定位

「全球风能锂电人才搜索雷达」是一个面向全球公共互联网开放的新能源高端人才搜索与招聘管理平台。平台连接全球新能源企业、猎头机构、高端候选人、行业专家和平台运营方，形成一个 **真实、可靠、合规、可搜索、可邀请、可面试、可评估、可谈判、可录取** 的全球新能源人才网络。

**核心差异化**: 
- 聚焦风能+锂电双赛道，不做泛行业招聘
- 数据真实性第一——每条人才记录可溯源、可核验
- AI 驱动的智能匹配与评估，非简单关键词搜索
- 开放公网平台，非企业内部系统

### 1.3 目标用户画像

| 角色 | 典型用户 | 核心需求 |
|------|---------|---------|
| **Visitor (游客)** | 行业观察者、潜在用户 | 了解平台、浏览公开数据、注册 |
| **Candidate (候选人)** | 风能/锂电工程师、研究员、项目经理 | 展示专业能力、接收机会、控制隐私 |
| **Company (企业)** | 风电企业 HR、锂电厂招聘负责人 | 搜索人才、发起邀请、管理招聘流程 |
| **Headhunter (猎头)** | 新能源行业猎头顾问 | 管理人才池、推荐候选人、追踪佣金 |
| **Expert (行业专家)** | 风能/锂电教授、技术顾问 | 参与评估、输出专家意见、建立个人品牌 |
| **Admin (管理员)** | 平台运营团队 | 审核认证、内容风控、数据分析、合规管理 |

### 1.4 核心价值主张

| 价值点 | 面向角色 | 说明 |
|--------|---------|------|
| 精准人才搜索 | 企业/猎头 | AI 驱动的风能锂电专域搜索，非泛化关键词匹配 |
| 数据可信度 | 所有用户 | 每条数据可溯源、可核验、有时间戳 |
| 全流程闭环 | 企业/候选人 | 搜索→邀请→面试→评估→谈判→录取，一站式完成 |
| 隐私可控 | 候选人 | 自主控制数据可见性、联系方式脱敏、可申请删除 |
| AI 辅助决策 | 企业/猎头 | AI 人才推荐、薪酬建议、风险评估、邀请文案生成 |
| 全球化合规 | 所有用户 | 多语言、多币种、多时区、GDPR+PIPL 合规 |

### 1.5 平台商业模式

| 层级 | 模式 | 价格定位 | 核心权益 |
|------|------|---------|---------|
| Free | 免费游客 | ¥0 | 浏览公开数据、查看平台介绍、注册账户 |
| Candidate Free | 候选人免费 | ¥0 | 创建个人主页、接收邀请、管理面试 |
| Enterprise Basic | 企业基础版 | ¥299/月 | 发布 5 个岗位、100 次搜索/月、基础人才联系 |
| Enterprise Pro | 企业专业版 | ¥999/月 | 发布 20 个岗位、500 次搜索/月、AI 评估报告、批量邀请 |
| Enterprise Ultimate | 企业旗舰版 | ¥2,999/月 | 不限岗位、不限搜索、高级 AI、专属客户经理 |
| Headhunter Pro | 猎头专业版 | ¥1,499/月 | 管理 200 候选人、推荐追踪、佣金管理 |
| API Data Service | 数据服务 | 定制报价 | API 接口访问、数据下载、行业分析报告 |

### 1.6 MVP 开发目标

**上线标准**: 一个可公开访问、支持真实注册登录、可执行人才搜索→录取完整流程的平台。

| 指标 | MVP 目标 |
|------|---------|
| 可访问性 | 全球公网可访问 (HTTPS) |
| 用户注册 | 真实邮箱注册 + 验证 |
| 角色支持 | 6 种角色完整支持 |
| 核心流程 | 搜索→邀请→面试→评估→谈判→Offer 完整可走通 |
| 数据真实性 | 数据来源 + 可信度评分机制上线 |
| 安全合规 | API 认证 + RBAC + 审计日志 + 隐私政策 |

---

## 2. 当前状态诊断

### 2.1 已有能力矩阵

| 能力域 | 状态 | 完整度 |
|--------|------|--------|
| 前端页面 | 37+ 页面已创建 | 🟢 85% |
| API 路由 | 38 个端点 | 🟢 80% |
| 数据库模型 | 13 个 Prisma 模型 | 🟢 70% |
| 用户角色 | 6 种角色枚举 | 🟢 80% |
| i18n 国际化 | 中/英 24 个翻译块 | 🟢 90% |
| AI 服务层 | 7 模块 + Mock/真实可切换 | 🟡 60% |
| SaaS 商业化 | 6 种套餐定义 + 订阅模型 | 🟡 50% |
| 合规框架 | AI 免责 + 审计日志 + 隐私页面 | 🟡 40% |
| PWA 支持 | manifest + SW + offline | 🟡 50% |

### 2.2 上线前必须解决的 7 大阻塞项

| # | 问题 | 当前状态 | 目标状态 | 优先级 |
|---|------|---------|---------|--------|
| 1 | **认证系统** | Mock JWT + 内存 Map | NextAuth.js + bcrypt + PostgreSQL | 🔴 P0 |
| 2 | **首页** | 重定向到 /login | 公共 CEO 操作仓落地页 | 🔴 P0 |
| 3 | **API 认证** | 无服务端保护 | JWT Bearer Token 认证中间件 | 🔴 P0 |
| 4 | **支付系统** | simulatePayment 已禁用 | Stripe + 支付宝接入 | 🔴 P0 |
| 5 | **AI Provider** | openaiProvider 全部抛异常 | OpenAI/Claude 真实调用 | 🔴 P0 |
| 6 | **SEO 基础** | 无 sitemap/robots/meta | 完整 SEO 基础设施 | 🔴 P0 |
| 7 | **数据隐私** | 无 Cookie Consent / 数据导出 | GDPR + PIPL 合规弹窗 + 数据可携带 | 🔴 P0 |

### 2.3 架构重组建议

基于"公共互联网平台"定位，当前的 `app/` 目录需要重组：

```
当前问题:                               目标结构:
app/                                    app/
├── page.tsx → redirect /login ❌       ├── (public)/           # 公共访问组
                                          │   ├── page.tsx       # CEO 操作仓公开版
│                                         │   ├── about/
│                                         │   ├── pricing/
│                                         │   ├── jobs/
│                                         │   ├── talent-map/
│                                         │   ├── login/
│                                         │   ├── register/
│                                         │   ├── privacy/
│                                         │   ├── terms/
│                                         │   ├── data-trust/
│                                         │   └── contact-sales/
│                                         ├── (auth)/            # 需登录组
│                                         │   ├── dashboard/
│                                         │   ├── search/
│                                         │   ├── candidates/
│                                         │   ├── invitations/
│                                         │   ├── interviews/
│                                         │   ├── evaluations/
│                                         │   ├── negotiations/
│                                         │   ├── offers/
│                                         │   └── settings/
│                                         └── (admin)/           # 管理员组
│                                             └── admin/
```

---

## 3. 平台级 CEO 操作仓首页

### 3.1 设计原则

首页是 **平台的门面**，必须：
- **公开可访问** — 无需登录即可浏览
- **数据脱敏展示** — 仅展示汇总、聚合、示例数据
- **建立信任** — 展示数据来源、可信度机制、隐私保护说明
- **引导转化** — 从"了解"到"注册"到"付费"的清晰路径
- **SEO 友好** — 完整的 meta、结构化数据、语义化 HTML
- **品牌识别** — 科技感、雷达视觉、新能源行业特色

### 3.2 首页蓝图

```
┌─────────────────────────────────────────────────────────────────┐
│  [Navbar] Logo | 关于 | 定价 | 职位 | 人才地图 | 登录 | 免费注册  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─ Hero Section ─────────────────────────────────────────────┐  │
│  │  全球风能锂电人才搜索雷达                                      │  │
│  │  连接全球 12,000+ 新能源人才 • 覆盖 45 个国家/地区             │  │
│  │  [立即注册] [预约演示]                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─ 核心数据一目了然 (脱敏汇总) ─────────────────────────────────┐ │
│  │  [12,847]    [1,203]     [2,856]     [89.3%]    [67.2%]     │ │
│  │  全球人才     活跃企业     活跃岗位      邀请回复率    Offer转化│ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ 全球人才热力图 (SVG 地图) ───────────────────────────────────┐│
│  │  ┌─────── 交互式世界地图 (15 国热点) ──────────┐  ┌─ 榜单 ─┐ ││
│  │  │                                                │  │ 🇩🇪 德国 │ ││
│  │  │   🌍 ● ● ○ ○                                 │  │ 🇨🇳 中国 │ ││
│  │  │      ● ● ● ○                                 │  │ 🇺🇸 美国 │ ││
│  │  │     ○ ● ● ●                                  │  │ 🇩🇰 丹麦 │ ││
│  │  │                                              │  │ 🇸🇪 瑞典 │ ││
│  │  └──────────────────────────────────────────────┘  └────────┘ ││
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ 风能人才    ────┐ ┌─ 锂电人才    ────┐ ┌─ 储能人才    ────┐  │
│  │  叶片工程师  3,201 │ │  电芯研发   2,845 │ │  系统集成   1,987 │  │
│  │  整机设计    2,103 │ │  BMS 工程师 1,976 │ │  PACK 设计  1,543 │  │
│  │  电控工程师  1,887 │ │  材料科学   1,654 │ │  热管理     1,209 │  │
│  │  海上风电     987  │ │  工艺工程   1,432 │ │  微网控制     876 │  │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘  │
│                                                                   │
│  ┌─ 招聘漏斗 (公开版) ──────────────────────────────────────────┐ │
│  │  🔍 搜索 12,847 → ✉️ 邀请 5,203 → 📋 面试 3,891 →            │ │
│  │  📊 评估 2,104 → 🤝 谈判 1,432 → 📝 Offer 987                │  │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ 技能雷达图 ────────────────────┐ ┌─ 热门岗位 Top 10 ────────┐ │
│  │  [Recharts RadarChart]          │ │ 1. 风电叶片设计工程师     │ │
│  │                                 │ │ 2. BMS 高级开发工程师     │ │
│  │                                 │ │ 3. 储能系统架构师          │ │
│  └─────────────────────────────────┘ └──────────────────────────┘ │
│                                                                   │
│  ┌─ AI 洞察 ────────────────────────────────────────────────────┐│
│  │  📈 风能人才需求同比增长 34%                                    ││
│  │  🔋 锂电固态电池方向人才缺口扩大                                ││
│  │  🌊 海上风电运维人才成为新热点                                  ││
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ 数据可信度 + 隐私保护说明 ──────────────────────────────────┐ │
│  │  ✅ 所有数据标注来源与更新时间                                   │ │
│  │  ✅ 候选人自主授权数据展示                                       │ │
│  │  ✅ 联系方式公网完全脱敏                                         │ │
│  │  ✅ 支持数据更正和删除请求                                       │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─ CTA: 成为风能锂电人才网络的一员 ────────────────────────────┐  │
│  │  [我是候选人 →]  [我是企业 →]  [我是猎头 →]  [我是专家 →]    │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  [Footer] 关于 | 隐私政策 | 服务条款 | 联系我们 | © 2026          │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 首页数据脱敏规则

| 数据类型 | 公开版展示方式 | 登录后展示方式 |
|---------|--------------|--------------|
| 人才总数 | 汇总数字 | 可筛选可排序列表 |
| 候选人姓名 | 仅姓氏 + 首字母 (张**) | 脱敏状态取决于候选人隐私设置 |
| 联系方式 | 完全隐藏 | 需候选人授权后可见 |
| 完整简历 | 仅公开展示的技能标签 | 需候选人授权后可见 |
| 薪资信息 | 薪酬区间 (行业分布) | 仅展示候选人公开范围 |
| Offer 详情 | 不展示 | 仅交易双方可见 |
| 谈判记录 | 不展示 | 仅交易双方可见 |

---

## 4. 公共互联网访问设计

### 4.1 访问权限分层

```
                    ┌──────────────────────────────┐
                    │     公共访问 (无需登录)        │
                    │  /  /about  /pricing  /jobs   │
                    │  /talent-map  /login  /register│
                    │  /privacy  /terms  /data-trust │
                    └──────────────┬───────────────┘
                                   │ 注册/登录
                    ┌──────────────┴───────────────┐
                    │     认证用户 (已登录)          │
                    │  根据角色授权不同功能          │
                    │                               │
                    │  Candidate:                   │
                    │    /dashboard  /search         │
                    │    /candidates/[id]  /interviews│
                    │    /evaluations  /negotiations  │
                    │    /offers  /settings          │
                    │                               │
                    │  Company:                     │
                    │    /dashboard  /search         │
                    │    /invitations  /interviews    │
                    │    /evaluations  /negotiations  │
                    │    /offers  /jobs/manage       │
                    │                               │
                    │  Headhunter:                  │
                    │    /dashboard  /candidates     │
                    │    /invitations  /interviews    │
                    │                               │
                    │  Expert:                      │
                    │    /dashboard  /evaluations    │
                    │    /candidates/[id]            │
                    │                               │
                    │  Admin:                       │
                    │    /admin/*                    │
                    └──────────────────────────────┘
```

### 4.2 认证流程设计

| 流程 | 步骤 |
|------|------|
| **注册** | 邮箱 → 邮箱验证码 → 设置密码 → 选择角色 → 完善基础信息 → 进入引导 |
| **登录** | 邮箱 + 密码 → JWT Token → 写入 HttpOnly Cookie → 重定向至 Dashboard |
| **企业认证** | 提交营业执照 → 管理员审核 (1-3 工作日) → 认证通过 → 解锁完整功能 |
| **候选人认证** | 邮箱验证 (默认) / 学历认证 (可选) / 工作经历认证 (可选) → 认证徽章 |
| **猎头认证** | 提交猎头资质 → 管理员审核 → 认证通过 → 解锁猎头功能 |
| **专家认证** | 提交学术/行业资质 → 管理员审核 → 认证通过 → 解锁评估权限 |

### 4.3 SEO 页面设计

| 页面 | 策略 |
|------|------|
| `/jobs` | 公开职位列表 — 每个职位独立 og:title + description |
| `/jobs?industry=wind` | 按行业聚合 — "风能行业招聘岗位 — 全球风能锂电人才搜索雷达" |
| `/talent-map` | 全球人才趋势 — 高搜索量落地页 |
| `/about` | 平台介绍 — 品牌搜索落地 |
| `/blog` (新增) | 行业洞察内容 — 长尾关键词覆盖 |
| `/data-trust` | 数据真实性与合规 — 信任建设落地页 |

### 4.4 技术实施

```typescript
// 公共页面: 无需认证
// (public)/layout.tsx — 无 AuthProvider 包裹

// 认证页面: 需要登录
// (auth)/layout.tsx — AuthProvider 包裹 + middleware 保护

// 管理员页面: 需要管理员角色
// (admin)/layout.tsx — AuthProvider + AdminGuard
```

---

## 5. 多角色权限系统

### 5.1 角色定义

| 角色 | 枚举值 | 注册方式 | 认证要求 |
|------|--------|---------|---------|
| Visitor | `visitor` | 默认 (未登录) | 无 |
| Candidate | `candidate` | 自由注册 | 邮箱验证 (可选深度认证) |
| Company | `company` | 自由注册 | 企业资质审核 |
| Headhunter | `headhunter` | 申请注册 | 猎头资质审核 |
| Expert | `expert` | 邀请制/申请 | 学术/行业资质审核 |
| Admin | `admin` | 平台指派 | 内部认证 |

### 5.2 权限矩阵

| 权限 | Visitor | Candidate | Company | Headhunter | Expert | Admin |
|------|:---:|:---:|:---:|:---:|:---:|:---:|
| 浏览公开首页 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 查看公开职位 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 注册/登录 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 查看人才搜索结果 (脱敏) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 查看人才详情 (脱敏) | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 查看完整联系方式 | ❌ | 自己 | 授权后 | 授权后 | 授权后 | ✅ |
| 搜索人才 | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| 发送邀请 | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| 管理个人资料 | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 发布岗位 | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| 安排面试 | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| 提交面试反馈 | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| 生成评估报告 | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| 发起谈判 | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |
| 发放 Offer | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| 查看审计日志 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| 审核认证 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| 管理用户 | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 5.3 实施要点

1. **RBAC 服务端实施** — 权限检查在 API 中间件完成，不可仅在客户端
2. **行级安全** — 数据查询时根据用户角色 + 数据所有者过滤
3. **审计日志** — 所有敏感操作记录 (谁、何时、做了什么、IP)
4. **权限变更通知** — 角色变更时通知用户

---

## 6. 六大核心模块设计

### 6.1 人才搜索模块

| 属性 | 值 |
|------|-----|
| **页面路径** | `/search` (公共) / `/searches` (登录后) |
| **API 端点** | `GET /api/candidates?q=&industry=&country=&skills=&...` |
| **核心目标** | 让企业/猎头精准找到符合需求的新能源人才 |

**搜索条件**:
- 关键词搜索 (姓名、技能、公司背景)
- 行业筛选: 风能 / 锂电 / 储能 / BMS / 电芯制造 / 风电整机 / 叶片 / 电控 / 材料
- 国家/地区筛选 (用于工作地点/人才所在地，非歧视性)
- 技能标签 (多选)
- 工作年限区间
- 语言能力 (中/英/德/日/韩等)
- 薪酬期望区间 (仅显示公开范围)
- 可远程 / 可搬迁
- 签证状态
- 可信度评分 (≥60%)
- 学历级别
- 活跃状态 (最近活跃时间)

**候选人卡片公开展示字段**:
- 匿名化名称 (如 "张**"、"Wind Engineer #2847")
- 行业标签
- 技能标签 (top 5)
- 工作年限
- 所在国家/地区
- 可信度评分徽章
- 认证状态
- 数据来源 + 更新时间

**候选人详情页结构** (登录后):
- 基本信息 (根据隐私设置脱敏)
- 技能雷达图
- 工作经历时间线 (脱敏公司名)
- 教育背景
- 语言能力
- 证书/专利/出版物
- AI 综合评估摘要
- 联系方式 (需授权)
- 数据来源与可信度详情

### 6.2 人才邀请模块

| 属性 | 值 |
|------|-----|
| **页面路径** | `/invitations` |
| **API 端点** | `POST /api/invitations`, `GET /api/invitations?status=`, `PATCH /api/invitations` |

**邀请方式**:
1. **站内信邀请** — 候选人登录后可见
2. **邮件邀请** — 通过候选人授权邮箱发送
3. **企业邀请** — 企业直接对候选人发起
4. **猎头推荐邀请** — 猎头为企业推荐候选人
5. **批量邀请** — CSV 导入 + AI 文案批量生成

**邀请状态流转**:
```
草稿 → 待发送 → 已发送 → 已查看 → 已回复 → {已接受 / 已拒绝}
                                              ↓
                                           已过期 (14天未响应)
```

**反骚扰机制**:
- 同一企业 7 天内对同一候选人最多发送 2 次邀请
- 候选人可标记"不再接收该企业邀请"
- 候选人可全局关闭"接收邀请"
- 邀请中包含"举报"按钮
- 邀请额度按套餐限制

### 6.3 人才面试模块

| 属性 | 值 |
|------|-----|
| **页面路径** | `/interviews`, `/interviews/[id]` |
| **API 端点** | `GET/POST/PATCH/DELETE /api/interviews` |

**面试状态流转**:
```
待安排 → 已安排 → {候选人已确认 + 企业已确认} → 进行中
                     ↓                              ↓
                  需改期 ←──────────────────────  已完成
                                                     ↓
                                                  已取消
```

**面试类型**:
- 技术面试 (Technical)
- HR 面试 (HR Screening)
- 高管面试 (Executive)
- 专家评估面试 (Expert Panel)
- 视频面试 (Video Call)
- 现场面试 (On-site)

**面试功能**:
- 多时区协调 (自动检测候选人与面试官时区)
- 视频面试链接生成 (Zoom/Teams/Google Meet 集成)
- 面试流程模板
- 面试反馈表单 (结构化评分 + 文字评价)
- 双方确认机制 (候选人和企业均需确认)
- 改期申请与审批
- 面试记录归档

### 6.4 人才评估模块

| 属性 | 值 |
|------|-----|
| **页面路径** | `/assessments`, `/assessments/[id]` |
| **API 端点** | `GET/POST/PATCH/DELETE /api/assessments` |

**评估维度** (8 维评分体系):
1. 技术能力 (Technical Skills) — 权重 25%
2. 行业匹配度 (Industry Fit) — 权重 20%
3. 项目经验 (Project Experience) — 权重 15%
4. 管理能力 (Leadership) — 权重 10%
5. 国际化能力 (Global Readiness) — 权重 10%
6. 语言能力 (Language) — 权重 10%
7. 薪酬匹配度 (Compensation Fit) — 权重 5%
8. 流动意愿 (Relocation Willingness) — 权重 5%

**评估报告结构**:
- AI 综合评分 + 各维度评分条
- 优势分析 (Strengths)
- 不足与风险 (Weaknesses & Risks)
- 适配岗位推荐
- 行业对比百分位
- 人工复核意见 (可选)
- 评估师签名 + 时间戳
- **所有 AI 评估必须标注 "AI 生成，仅供参考" + 人工复核建议**

### 6.5 人才谈判模块

| 属性 | 值 |
|------|-----|
| **页面路径** | `/negotiations` |
| **API 端点** | `GET/POST/PATCH /api/negotiations` |

**谈判维度**:
- 基础薪资 (Base Salary)
- 绩效奖金 (Performance Bonus)
- 股权/期权 (Equity/Options)
- 签约奖金 (Signing Bonus)
- 搬迁补贴 (Relocation Package)
- 签证支持 (Visa Sponsorship)
- 远程办公安排 (Remote Work)
- 入职时间 (Start Date)
- 竞业限制分析 (Non-compete Analysis)

**谈判状态流转**:
```
未开始 → 初步沟通 → 条件交换 → {待企业确认 / 待候选人确认}
                                      ↓
                                  已达成一致 / 谈判失败
```

**谈判功能**:
- AI 薪酬建议 (基于行业数据)
- 多币种换算 (实时汇率)
- 谈判轮次追踪
- 谈判记录留痕 (防篡改)
- 竞业限制风险分析
- 双方电子签名确认

### 6.6 人才录取模块

| 属性 | 值 |
|------|-----|
| **页面路径** | `/offers` |
| **API 端点** | `GET/POST/PATCH /api/offers` |

**Offer 状态流转**:
```
草稿 → 审批中 → 已批准 → 已发送 → {候选人已接受 / 候选人已拒绝}
                                    ↓              ↓
                                 已入职         已撤回
                                    ↓
                                 已归档
```

**Offer 包含字段**:
- 职位名称 + 部门
- 工作地点 + 远程安排
- 薪酬包 (Base + Bonus + Equity + Benefits)
- 入职日期
- 汇报线
- 试用期
- 特殊条款 (竞业限制/保密/知识产权)
- 有效期
- 企业电子签章 + 候选人确认签名

**录取功能**:
- Offer 模板管理
- 审批工作流
- 背景调查记录
- 入职计划生成
- 入职材料清单
- 平台服务费自动计算与结算
- 候选人归档 (含违约/未入职标记)
- 企业招聘成功记录

---

## 7. 页面架构设计

### 7.1 完整页面清单

#### 公共页面 (无需登录)

| 路由 | 页面 | 当前状态 | 优化动作 |
|------|------|:---:|------|
| `/` | 平台 CEO 操作仓首页 | ❌ 重定向到 /login | 🆕 完全重建为公共落地页 |
| `/about` | 平台介绍 | ✅ 存在 | ✏️ 内容完善 + SEO |
| `/pricing` | 定价与方案 | ✅ 存在 | ✏️ 完整方案对比 |
| `/jobs` | 公开职位列表 | ✅ 存在 | ✏️ 公开版显示 |
| `/talent-map` | 全球人才趋势地图 | ✅ 存在 | ✏️ 公开版显示 |
| `/login` | 登录页面 | ✅ 存在 | ✏️ 去除演示账号 |
| `/register` | 注册页面 | ✅ 存在 | ✏️ 完善注册流程 |
| `/privacy` | 隐私政策 | ✅ 存在 | ✏️ 完善内容 |
| `/terms` | 用户协议 | ✅ 存在 | ✏️ 完善内容 |
| `/data-trust` | 数据真实性中心 | ❌ 缺失 | 🆕 新建 |

#### 认证用户页面 (需登录)

| 路由 | 页面 | 当前状态 | 优化动作 |
|------|------|:---:|------|
| `/dashboard` | 登录后完整版 Dashboard | ✅ 存在 | ✏️ 增强权限分级 |
| `/search` | 公共搜索 | ✅ 存在 | ✏️ 完善搜索功能 |
| `/searches` | 高级搜索 (登录后) | ✅ 存在 | ✏️ 完善筛选 |
| `/candidates` | 候选人列表 | ✅ 存在 | ✏️ 权限分级展示 |
| `/candidates/[id]` | 候选人详情 | ✅ 存在 | ✏️ 权限分级展示 |
| `/invitations` | 人才邀请 | ✅ 存在 | ✏️ 完善邀请流程 |
| `/interviews` | 面试列表 | ✅ 存在 | ✅ 已完成增强 |
| `/interviews/[id]` | 面试详情 | ✅ 存在 | ✅ 已完成增强 |
| `/assessments` | 评估列表 | ✅ 存在 | ✅ 已完成增强 |
| `/assessments/[id]` | 评估详情 | ✅ 存在 | ✅ 已完成增强 |
| `/evaluations` | 专家评估 | ✅ 存在 | ✏️ 完善评估功能 |
| `/negotiations` | 谈判管理 | ✅ 存在 | ✏️ 完善谈判流程 |
| `/offers` | Offer 管理 | ✅ 存在 | ✏️ 完善 Offer 流程 |
| `/companies` | 企业管理 | ✅ 存在 | ✏️ 完善企业管理 |
| `/jobs/manage` | 岗位管理 | ✅ 存在 | ✅ 可用 |
| `/notifications` | 通知中心 | ✅ 存在 | ✅ 可用 |
| `/messages` | 站内信 | ✅ 存在 | ✅ 可用 |
| `/settings` | 用户设置 | ✅ 存在 | ✏️ 完善设置项 |
| `/subscription` | 订阅管理 | ✅ 存在 | ✏️ 完善支付 |
| `/audit-logs` | 审计日志 | ✅ 存在 | ✅ 可用 |

#### 管理员页面

| 路由 | 页面 | 当前状态 | 优化动作 |
|------|------|:---:|------|
| `/admin` | 管理后台首页 | ✅ 存在 | ✏️ 完善管理功能 |
| `/admin/analytics` | 运营数据分析 | ✅ 存在 | ✏️ 对接真实数据 |
| `/admin/candidates` | 候选人管理 | ✅ 存在 | ✏️ 完善审核功能 |
| `/admin/commerce` | 商业管理 | ✅ 存在 | ✏️ 对接真实支付 |
| `/admin/orders` | 订单管理 | ✅ 存在 | ✏️ 对接真实订单 |
| `/admin/reports` | 报告管理 | ✅ 存在 | ✏️ 完善报告功能 |
| `/admin/stats` | 平台统计 | ✅ 存在 | ✏️ 完善统计功能 |
| `/admin/verification` | 审核管理 | ✅ 存在 | ✏️ 完善审核流程 |

#### 新增页面 (缺失)

| 路由 | 页面 | 优先级 |
|------|------|:---:|
| `/data-trust` | 数据真实性中心 | 🔴 P0 |
| `/blog` | 行业洞察博客 | 🟡 P1 |
| `/help` | 帮助中心 | 🟡 P1 |
| `/contact-sales` | 联系销售 | 🟡 P1 |
| `/candidates/[id]/report` | AI 评估报告独立页 | 🟢 P2 |
| `/api-docs` | API 文档 | 🟢 P2 |

---

## 8. 数据真实性与合规机制

### 8.1 数据溯源字段 (每条候选人记录必须有)

```typescript
interface DataProvenance {
  dataSource: string          // 数据来源: "linkedin_api" | "company_upload" | "candidate_self" | "headhunter_submit" | "public_research" | "conference" | "patent_db"
  sourceType: string          // 来源类型: "public" | "authorized" | "submitted" | "verified"
  verificationStatus: string  // 核验状态: "unverified" | "pending" | "partial" | "verified" | "disputed"
  confidenceScore: number     // 可信度评分: 0-100
  lastUpdated: string         // 最后更新时间 (ISO 8601)
  consentStatus: string       // 授权状态: "pending" | "granted" | "revoked" | "expired"
  visibilityLevel: string     // 可见级别: "public_basic" | "public_anonymized" | "registered_only" | "authorized_only" | "private"
  dataOwner: string           // 数据所有者 ID (候选人 userId)
  verifiedBy?: string         // 核验人 ID
  verifiedAt?: string         // 核验时间
}
```

### 8.2 候选人授权机制

```
候选人注册
    │
    ├── 设置隐私偏好
    │   ├── 公开可见范围: 匿名化 / 脱敏 / 仅技能标签
    │   ├── 联系方式: 完全隐藏 / 脱敏展示 / 授权后可见
    │   ├── 简历: 不公开 / 摘要公开 / 授权后可见
    │   └── 接收邀请: 所有人 / 仅认证企业 / 关闭
    │
    ├── 接收访问请求
    │   ├── 企业请求查看联系方式 → 候选人审批
    │   └── 猎头请求推荐 → 候选人审批
    │
    └── 数据权利
        ├── 查看谁访问了我的数据
        ├── 导出我的数据 (GDPR 可携带性)
        ├── 更正错误数据
        └── 删除我的数据 (被遗忘权)
```

### 8.3 反歧视规则 (不可逾越的红线)

以下特征 **绝对不能** 作为搜索/筛选条件:
- ❌ 性别 (Gender)
- ❌ 年龄 (Age) — 仅可使用工作年限区间
- ❌ 种族 (Race/Ethnicity)
- ❌ 宗教 (Religion)
- ❌ 婚育状况 (Marital/Family Status)
- ❌ 残障 (Disability)
- ❌ 国籍 (Nationality) — 仅可使用工作地点/所在地/签证状态

以下使用是合规的:
- ✅ 国家/地区 → 仅用于工作地点筛选
- ✅ 语言能力 → 岗位要求
- ✅ 签证状态 → 跨境工作可行性
- ✅ 时区 → 远程协作安排

### 8.4 合规检查清单

| 合规项 | 状态 | 实施方式 |
|--------|:---:|------|
| Cookie Consent 弹窗 | ❌ | 首次访问弹窗 + 偏好管理 |
| GDPR 数据处理同意 | ❌ | 注册时勾选 + 可撤回 |
| PIPL 个人信息保护 | ❌ | 隐私政策 + 数据最小化 |
| 数据可携带性 | ❌ | API: GET /api/user/export-data |
| 被遗忘权 | ❌ | API: DELETE /api/user/delete-account |
| 数据访问日志 | ✅ | audit_logs 表 |
| AI 决策透明度 | ✅ | AI 免责声明 + 可解释性 |
| 联系方式脱敏 | ✅ | sanitizeCandidateEmail() |
| 投诉举报机制 | ❌ | 举报按钮 + 处理流程 |
| 儿童数据保护 | ❌ | 注册年龄确认 (≥18) |

---

## 9. 数据库设计优化

### 9.1 Schema 优化建议

基于当前 `prisma/schema.prisma`，需要新增/修改以下模型:

#### 新增模型

| 模型 | 说明 | 优先级 |
|------|------|:---:|
| `VerificationToken` | 邮箱验证 Token | 🔴 P0 |
| `PasswordResetToken` | 密码重置 Token | 🔴 P0 |
| `CandidatePrivacySetting` | 候选人隐私设置 (JSON 替代) | 🔴 P0 |
| `CandidateDataProvenance` | 数据来源与可信度 | 🔴 P0 |
| `CandidateConsentLog` | 授权记录日志 | 🔴 P0 |
| `ContactAccessRequest` | 联系方式查看请求 | 🔴 P0 |
| `UserSession` | 用户会话管理 | 🟡 P1 |
| `CompanyVerification` | 企业认证详情 | 🟡 P1 |
| `HeadhunterVerification` | 猎头认证详情 | 🟡 P1 |
| `ExpertVerification` | 专家认证详情 | 🟡 P1 |
| `ReportRecord` | 举报记录 | 🟡 P1 |
| `ContentModerationLog` | 内容审核日志 | 🟡 P1 |
| `BlogPost` | 博客文章 | 🟢 P2 |
| `ApiKey` | API 密钥管理 | 🟢 P2 |

#### 现有模型修改

| 模型 | 修改内容 | 优先级 |
|------|---------|:---:|
| `User` | 新增 emailVerified, hashedPassword, image, emailVerificationToken | 🔴 P0 |
| `Candidate` | 新增 dataSource, sourceType, verificationStatus, confidenceScore, consentStatus, visibilityLevel, lastUpdated, dataOwnerId | 🔴 P0 |
| `Company` | 新增 verificationStatus, verifiedAt, businessLicense, contactPerson | 🟡 P1 |
| `Invitation` | 新增 isSpam, reportCount, expiresAt, bulkBatchId | 🟡 P1 |
| `Interview` | 新增 timezone, meetingLink, meetingProvider, confirmedByCandidate, confirmedByCompany | 🟡 P1 |
| `Negotiation` | 新增 round, currency, exchangeRate, signedByCompany, signedByCandidate | 🟡 P1 |
| `Offer` | 新增 signedAt, onboardingDate, backgroundCheckStatus, archiveReason | 🟡 P1 |

### 9.2 完整 Prisma Schema (优化后)

```prisma
// User - 优化后
model User {
  id                     String    @id @default(uuid())
  name                   String?
  email                  String    @unique
  emailVerified          DateTime?
  hashedPassword         String?
  image                  String?
  role                   String    @default("visitor") // visitor | candidate | company | headhunter | expert | admin
  country                String?
  industry               String?
  company                String?
  position               String?
  bio                    String?
  language               String    @default("zh")
  currency               String    @default("CNY")
  timezone               String    @default("Asia/Shanghai")
  isActive               Boolean   @default(true)
  lastLoginAt            DateTime?
  createdAt              DateTime  @default(now())
  updatedAt              DateTime  @updatedAt

  candidate              Candidate?
  company                CompanyRelation?
  sessions               Session[]
  accounts               Account[]
  sentInvitations        Invitation[]       @relation("Sender")
  receivedInvitations    Invitation[]       @relation("Receiver")
  notifications          Notification[]
  sentMessages           Message[]          @relation("SenderMessages")
  receivedMessages       Message[]          @relation("ReceiverMessages")
  subscriptions          UserSubscription[]
  orders                 Order[]
  paymentRecords         PaymentRecord[]
  usageLogs              UsageLog[]
  auditLogs              AuditLog[]
  consentLogs            CandidateConsentLog[]
}

// Account - NextAuth.js
model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

// Session - NextAuth.js
model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// VerificationToken - NextAuth.js
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// Candidate - 优化后
model Candidate {
  id                   String   @id @default(uuid())
  userId               String   @unique
  name                 String
  title                String?
  country              String?
  city                 String?
  industry             String?  // wind | lithium | storage | bms | cell_manufacturing | wind_turbine | blade | electronic_control | materials
  subIndustry          String?
  experienceYears      Int?
  education            String?  // JSON: [{degree, school, major, year}]
  skills               String?  // JSON: [{name, level, years}]
  languages            String?  // JSON: [{language, proficiency}]
  certificates         String?  // JSON: [{name, issuer, year}]
  publications         String?  // JSON: [{title, journal, year, doi}]
  patents              String?  // JSON: [{title, number, year}]

  // Data Provenance — 数据溯源 (必填)
  dataSource           String   @default("candidate_self")
  sourceType           String   @default("submitted")
  verificationStatus   String   @default("unverified")
  confidenceScore      Int      @default(50)
  consentStatus        String   @default("granted")
  visibilityLevel      String   @default("registered_only")
  lastUpdated          DateTime @default(now())
  dataOwnerId          String

  // Profile
  avatar               String?
  bio                  String?
  linkedinUrl          String?
  githubUrl            String?
  googleScholarUrl     String?
  researchGateUrl      String?

  // Contact (脱敏存储)
  emailEncrypted       String?
  phoneEncrypted       String?
  wechatIdEncrypted    String?

  // Job Preferences
  jobStatus            String?  // actively_looking | open_to_opportunities | not_looking | employed_but_open
  expectedSalaryMin    Int?
  expectedSalaryMax    Int?
  expectedCurrency     String   @default("CNY")
  willingToRelocate    Boolean  @default(false)
  willingToRemote      Boolean  @default(false)
  visaStatus           String?
  preferredCountries   String?  // JSON: ["DE", "CN", "US"]
  preferredIndustries  String?  // JSON: ["wind", "lithium"]

  // Scoring
  score                Int?
  rank                 String?
  verified             Boolean  @default(false)
  verifiedAt           DateTime?
  verifiedBy           String?

  // Privacy & Compliance
  receiveInvitations   Boolean  @default(true)
  showInSearch         Boolean  @default(true)
  anonymizedName       Boolean  @default(true)  // 默认脱敏显示

  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  user                 User                  @relation(fields: [userId], references: [id])
  invitations          Invitation[]
  interviews           Interview[]
  assessments          Assessment[]
  negotiations         Negotiation[]
  offers               Offer[]
  talentPools          TalentPoolCandidate[]
  searchLogs           SearchLog[]
  consentLogs          CandidateConsentLog[]
  contactRequests      ContactAccessRequest[]
}

// CandidatePrivacySetting
model CandidatePrivacySetting {
  id                  String   @id @default(uuid())
  candidateId         String
  profileVisibility   String   @default("registered_only") // public_basic | registered_only | authorized_only
  contactVisibility   String   @default("hidden")          // hidden | authorized | visible
  resumeVisibility    String   @default("hidden")          // hidden | summary | authorized
  salaryVisibility    String   @default("hidden")          // hidden | range_only | authorized
  showInSearch        Boolean  @default(true)
  showOnMap           Boolean  @default(true)
  allowInvitations    Boolean  @default(true)
  invitationFilter    String   @default("all")             // all | verified_companies_only | none
  updatedAt           DateTime @updatedAt

  candidate Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
}

// ContactAccessRequest
model ContactAccessRequest {
  id          String   @id @default(uuid())
  candidateId String
  requesterId String
  status      String   @default("pending")  // pending | approved | denied | expired
  reason      String?
  approvedAt  DateTime?
  deniedAt    DateTime?
  expiresAt   DateTime?
  createdAt   DateTime @default(now())

  candidate   Candidate @relation(fields: [candidateId], references: [id])
}
```

---

## 10. API 接口设计

### 10.1 API 认证架构

```
所有 /api/* 路由 → API Auth Middleware
                    │
                    ├── 公开 API (无需认证)
                    │   ├── GET /api/candidates (脱敏)
                    │   ├── POST /api/auth/register
                    │   ├── POST /api/auth/login
                    │   └── GET /api/jobs
                    │
                    └── 认证 API (需 JWT)
                        ├── 角色验证 (RBAC)
                        ├── 频率限制 (Rate Limiting)
                        └── 审计日志 (Audit Log)
```

### 10.2 核心 API 接口清单

#### 认证相关

| Method | Path | 角色 | 说明 |
|--------|------|:---:|------|
| POST | `/api/auth/register` | 无 | 用户注册 |
| POST | `/api/auth/verify-email` | 无 | 邮箱验证 |
| POST | `/api/auth/login` | 无 | 用户登录 |
| POST | `/api/auth/logout` | 已登录 | 用户登出 |
| POST | `/api/auth/forgot-password` | 无 | 忘记密码 |
| POST | `/api/auth/reset-password` | 无 | 重置密码 |
| GET | `/api/auth/me` | 已登录 | 当前用户信息 |
| PATCH | `/api/auth/me` | 已登录 | 更新个人信息 |

#### 人才搜索

| Method | Path | 角色 | 说明 |
|--------|------|:---:|------|
| GET | `/api/v1/candidates` | 已登录 | 人才搜索 (带筛选参数) |
| GET | `/api/v1/candidates/[id]` | 已登录 | 候选人详情 (权限分级) |
| POST | `/api/v1/candidates/[id]/request-contact` | 已登录 | 请求查看联系方式 |
| GET | `/api/v1/candidates/public` | 无 | 公开脱敏搜索 |

#### 邀请

| Method | Path | 角色 | 说明 |
|--------|------|:---:|------|
| GET | `/api/v1/invitations` | 已登录 | 邀请列表 |
| POST | `/api/v1/invitations` | Company/Headhunter | 创建邀请 |
| PATCH | `/api/v1/invitations/[id]` | 相关方 | 更新邀请状态 |
| POST | `/api/v1/invitations/bulk` | Company/Headhunter | 批量邀请 |

#### 面试

| Method | Path | 角色 | 说明 |
|--------|------|:---:|------|
| GET | `/api/v1/interviews` | 已登录 | 面试列表 |
| POST | `/api/v1/interviews` | Company/Headhunter | 安排面试 |
| PATCH | `/api/v1/interviews/[id]` | 相关方 | 更新面试状态 |
| POST | `/api/v1/interviews/[id]/feedback` | 已登录 | 提交面试反馈 |
| POST | `/api/v1/interviews/[id]/reschedule` | 已登录 | 申请改期 |

#### 评估

| Method | Path | 角色 | 说明 |
|--------|------|:---:|------|
| GET | `/api/v1/assessments` | 已登录 | 评估列表 |
| POST | `/api/v1/assessments` | Expert/Admin | 创建评估 |
| GET | `/api/v1/assessments/[id]` | 已登录 | 评估详情 |
| PATCH | `/api/v1/assessments/[id]` | Expert/Admin | 更新评估 |

#### 谈判

| Method | Path | 角色 | 说明 |
|--------|------|:---:|------|
| GET | `/api/v1/negotiations` | 已登录 | 谈判列表 |
| POST | `/api/v1/negotiations` | Company/Headhunter | 发起谈判 |
| PATCH | `/api/v1/negotiations/[id]` | 相关方 | 更新谈判轮次 |
| POST | `/api/v1/negotiations/[id]/sign` | 相关方 | 签署谈判协议 |

#### Offer

| Method | Path | 角色 | 说明 |
|--------|------|:---:|------|
| GET | `/api/v1/offers` | 已登录 | Offer 列表 |
| POST | `/api/v1/offers` | Company | 创建 Offer |
| PATCH | `/api/v1/offers/[id]` | 相关方 | 更新 Offer 状态 |
| POST | `/api/v1/offers/[id]/approve` | Company | Offer 审批 |
| POST | `/api/v1/offers/[id]/accept` | Candidate | 接受 Offer |

#### 数据权利

| Method | Path | 角色 | 说明 |
|--------|------|:---:|------|
| GET | `/api/v1/user/data-export` | 已登录 | 导出个人数据 |
| DELETE | `/api/v1/user/account` | 已登录 | 删除账户 (被遗忘权) |
| POST | `/api/v1/user/data-correction` | 已登录 | 申请数据更正 |
| GET | `/api/v1/user/data-access-log` | 已登录 | 数据访问记录 |

#### 管理后台

| Method | Path | 角色 | 说明 |
|--------|------|:---:|------|
| GET | `/api/v1/admin/verifications` | Admin | 审核列表 |
| PATCH | `/api/v1/admin/verifications/[id]` | Admin | 审核操作 |
| GET | `/api/v1/admin/reports` | Admin | 举报列表 |
| PATCH | `/api/v1/admin/reports/[id]` | Admin | 处理举报 |
| GET | `/api/v1/admin/audit-logs` | Admin | 审计日志查询 |

#### AI 服务

| Method | Path | 角色 | 说明 |
|--------|------|:---:|------|
| POST | `/api/v1/ai/recommend` | 已登录 | AI 人才推荐 |
| POST | `/api/v1/ai/invitation-text` | Company/Headhunter | AI 邀请文案 |
| POST | `/api/v1/ai/interview-questions` | Company/Headhunter | AI 面试问题 |
| POST | `/api/v1/ai/assessment` | Expert/Admin | AI 评估报告 |
| POST | `/api/v1/ai/salary` | Company/Headhunter | AI 薪酬建议 |

---

## 11. 技术架构建议

### 11.1 推荐技术栈

| 层级 | 技术选型 | 说明 |
|------|---------|------|
| **前端框架** | Next.js 14 (App Router) | 已采用 ✅ |
| **语言** | TypeScript (strict mode) | 已采用 ✅ |
| **样式** | Tailwind CSS + shadcn/ui | 已采用 ✅ |
| **图标** | lucide-react | 已采用 ✅ |
| **图表** | recharts | 已采用 ✅ |
| **ORM** | Prisma | 已采用 ✅ |
| **数据库** | PostgreSQL (生产) / SQLite (开发) | 已采用 ✅ |
| **认证** | NextAuth.js v5 (Auth.js) | 🔴 待替换 |
| **密码加密** | bcryptjs / argon2 | 🔴 待添加 |
| **数据校验** | zod | ✅ 已安装 |
| **支付** | Stripe (国际) + Stripe/Alipay/WeChat Pay (国内) | 🔴 待集成 |
| **邮件** | Resend / SendGrid | 🔴 待集成 |
| **文件存储** | Vercel Blob / AWS S3 / Cloudflare R2 | 🟡 待集成 |
| **搜索** | PostgreSQL 全文搜索 (MVP) → Meilisearch/Elasticsearch (扩展) | ✅ 可用 |
| **AI** | OpenAI API / Claude API | 🟡 待实现 |
| **监控** | Sentry (错误追踪) + Vercel Analytics | 🟡 待集成 |
| **CDN** | Vercel Edge Network / Cloudflare | ✅ 已内置 |
| **部署** | Vercel (推荐) / Docker | ✅ vercel.json 已存在 |

### 11.2 部署架构

```
用户 (全球)
    │
    ▼
Cloudflare DNS / Vercel Edge Network
    │
    ▼
Next.js SSR + API Routes (Vercel / AWS)
    │
    ├── PostgreSQL (Neon / Supabase / AWS RDS)
    ├── Redis (Upstash) — 缓存 + 频率限制
    ├── Blob Storage (Vercel Blob / S3) — 简历/文件
    ├── Email (Resend / SendGrid)
    └── AI API (OpenAI / Claude)
```

---

## 12. UI 风格要求

### 12.1 设计语言

| 元素 | 规范 |
|------|------|
| **主色调** | 深色科技背景 (slate-950) + 品牌蓝 (sky-500) + 能源绿 (emerald-400) |
| **强调色** | 风能 → cyan-400, 锂电 → amber-400, 储能 → emerald-400 |
| **字体** | Inter (正文) + JetBrains Mono (代码/数据) |
| **圆角** | 卡片 12px, 按钮 8px, 输入框 8px |
| **阴影** | 深色卡片 glow 效果 (sky-500/10 边框光晕) |
| **图标** | lucide-react 线性图标, 24px 基准 |
| **动画** | 数字计数动画, 微交互 hover, 页面过渡 fade-in |
| **数据展示** | 大数字 KPI 卡, 热力图, 雷达图, 漏斗图, 进度条 |
| **响应式** | 移动端优先: 单列布局 → md: 双列 → lg: 三列 + 侧边栏 |

### 12.2 品牌元素

- **Logo**: 雷达扫描图标 + "风/锂" 双色渐变
- **首页 Hero**: 全屏深色背景 + 粒子/雷达扫描动画
- **行业图标**: 风机叶片、锂电池、储能柜、BMS 芯片
- **色彩心理**: 深色 = 专业可信, 蓝色 = 科技, 绿色 = 新能源

---

## 13. 平台商业模式设计

### 13.1 收入模型

| 收入流 | 说明 | 预期占比 |
|--------|------|:---:|
| **企业订阅** | Enterprise Basic/Pro/Ultimate 月付/年付 | 45% |
| **猎头订阅** | Headhunter Pro 月付/年付 | 15% |
| **高级功能** | AI 评估报告、联系方式解锁、深度搜索 | 15% |
| **招聘佣金** | 成功入职后收取候选人年薪 8-15% | 15% |
| **数据服务** | API 接口订阅、行业报告、定制数据分析 | 5% |
| **广告位** | 首页/搜索页品牌展示 (未来) | 5% |

### 13.2 现有套餐体系 (已实现，待完善支付)

当前项目已有完整的 SaaS 模型 (`lib/saas/`)，包括：
- 6 个订阅计划 (Free / Enterprise Basic / Pro / Ultimate / Headhunter Pro / API Data Service)
- 用户订阅管理
- 额度消费追踪
- 订单系统
- 支付记录 (Mock)

🔴 **待完善**: 集成真实支付 (Stripe), 订阅自动续费, 发票开具

---

## 14. 安全与合规要求

### 14.1 安全措施清单

| 措施 | 实施方式 | 优先级 |
|------|---------|:---:|
| HTTPS 全站加密 | Vercel 自动提供 | ✅ |
| JWT 认证 | NextAuth.js | 🔴 P0 |
| 密码加密 | bcryptjs (salt rounds ≥ 12) | 🔴 P0 |
| RBAC 权限控制 | API 中间件 + 数据库行级过滤 | 🔴 P0 |
| API 频率限制 | Vercel Edge Middleware / Upstash Redis | 🔴 P0 |
| CORS 配置 | next.config.js 白名单 | 🔴 P0 |
| XSS 防护 | React 自动转义 + CSP Header | ✅ |
| CSRF 防护 | NextAuth.js 内置 | 🔴 P0 |
| SQL 注入防护 | Prisma 参数化查询 | ✅ |
| 文件上传扫描 | 上传前病毒扫描 + 类型白名单 | 🟡 P1 |
| 双因素认证 | 预留接口 (TOTP) | 🟢 P2 |
| DDoS 防护 | Vercel/Cloudflare 自动 | ✅ |
| 安全审计 | 第三方渗透测试 | 🟢 P2 |

### 14.2 合规清单

| 法规 | 要求 | 实施状态 |
|------|------|:---:|
| GDPR (EU) | 数据处理同意、可携带、被遗忘权、DPO 指定 | ❌ |
| PIPL (中国) | 个人信息保护、数据最小化、单独同意 | ❌ |
| CCPA (加州) | 不出售个人信息选项 | ❌ |
| 反歧视就业 | 不基于受保护特征筛选 | ✅ (设计阶段) |
| 数据本地化 | 中国用户数据存于境内 | 🟡 待评估 |

---

## 15. 示例数据规则

### 15.1 强制规则

| 规则 | 说明 |
|------|------|
| 标识要求 | 所有示例数据必须标注 `[示例数据]` 或 `[Demo]` 标签 |
| 候选人姓名 | 虚构姓名，使用 `example_` 前缀或中文姓氏 + 常见名 |
| 邮箱格式 | 统一使用 `@example.com` 域名 |
| 电话号码 | 使用 `+86 1XX-XXXX-XXXX` 脱敏格式 |
| 公司名称 | 使用虚构名称，如 `风翼新能源科技(示例)`、`蓝天锂能(示例)` |
| 薪资数据 | 标注 `[示例薪酬，仅供参考]` |
| 地理位置 | 仅使用国家/城市级别，不使用真实街道地址 |
| 声明位置 | 数据来源字段统一填 `"示例数据"` |

### 15.2 示例数据模板

```typescript
// 示例候选人数据
{
  id: "example_candidate_001",
  name: "张明远 (示例数据)",
  title: "风电叶片设计高级工程师",
  country: "CN",
  industry: "wind",
  skills: ["叶片设计", "CFD仿真", "复合材料", "结构优化"],
  experienceYears: 8,
  dataSource: "示例数据",
  sourceType: "示例",
  verificationStatus: "unverified",
  confidenceScore: 0,
  consentStatus: "granted",
  visibilityLevel: "example",
  lastUpdated: "2026-05-31T00:00:00Z",
  // 联系方式完全不可用
  emailEncrypted: null,
  phoneEncrypted: null,
}
```

---

## 16. MVP 开发计划

### 16.1 第一阶段: 公网上线基础 (Week 1-2)

**目标**: 平台可通过公网访问，支持真实注册登录

| # | 任务 | 文件/范围 | 优先级 |
|---|------|---------|:---:|
| 1.1 | 集成 NextAuth.js 替换 Mock JWT | `lib/auth.ts` → NextAuth 配置 | 🔴 |
| 1.2 | 实现 bcrypt 密码加密 | User 注册/登录逻辑 | 🔴 |
| 1.3 | 实现邮箱验证流程 | `/api/auth/verify-email` | 🔴 |
| 1.4 | API 认证中间件 | `middleware.ts` 重写 | 🔴 |
| 1.5 | 重建首页为公共 CEO 操作仓 | `app/page.tsx` 重写 | 🔴 |
| 1.6 | SEO 基础设施 | sitemap.xml, robots.txt, meta tags | 🔴 |
| 1.7 | Cookie Consent 弹窗 | GDPR/PIPL 合规弹窗组件 | 🔴 |
| 1.8 | API 频率限制 | Vercel KV / middleware rate limit | 🔴 |

### 16.2 第二阶段: 核心流程完善 (Week 3-4)

**目标**: 六大核心模块流程完整可走通

| # | 任务 | 说明 | 优先级 |
|---|------|------|:---:|
| 2.1 | 完善注册流程 (分角色) | 候选人/企业/猎头 分类注册 | 🔴 |
| 2.2 | 企业认证流程 | 营业执照上传 + 管理员审核 | 🔴 |
| 2.3 | 新增数据溯源字段到 Candidate | DataProvenance 全部字段 | 🔴 |
| 2.4 | 候选人隐私设置页面 | 可见性/授权/数据权利 | 🔴 |
| 2.5 | 完善搜索筛选 | 全维度筛选 + AI 推荐 | 🔴 |
| 2.6 | 完善邀请流程 | 站内信 + 邮件 + 批量 + 反骚扰 | 🔴 |
| 2.7 | 完善面试流程 | 时区 + 视频链接 + 双方确认 | 🔴 |
| 2.8 | 完善评估模块 | 8 维评分 + AI 报告 | 🟡 |
| 2.9 | 完善谈判流程 | 多轮 + 电子签名 + 货币换算 | 🟡 |
| 2.10 | 完善 Offer 流程 | 审批工作流 + 入职计划 | 🟡 |

### 16.3 第三阶段: 商业化 + AI (Week 5-6)

**目标**: 支付可用、AI 真实调用

| # | 任务 | 说明 | 优先级 |
|---|------|------|:---:|
| 3.1 | Stripe 支付集成 | 订阅付费 + 自动续费 | 🔴 |
| 3.2 | OpenAI/Claude Provider 实现 | 7 个 AI 模块真实调用 | 🔴 |
| 3.3 | 数据权利 API | 导出/删除/更正 | 🔴 |
| 3.4 | 举报 + 审核系统 | 举报按钮 + 管理员处理 | 🟡 |
| 3.5 | shadcn/ui 组件补全 | Input/Select/Dialog/Toast/Table | 🟡 |
| 3.6 | 文件上传功能 | 简历/Logo/营业执照上传 | 🟡 |

### 16.4 第四阶段: 全球化扩展 (Week 7-8)

**目标**: 多语言完善、性能优化、全球部署

| # | 任务 | 说明 | 优先级 |
|---|------|------|:---:|
| 4.1 | i18n 完善 (新增语言) | 德语/日语/韩语 | 🟢 |
| 4.2 | 时区/货币完善 | 自动检测 + 实时汇率 | 🟢 |
| 4.3 | CDN 优化 | 全球边缘缓存策略 | 🟢 |
| 4.4 | 性能优化 | Lighthouse ≥ 90 | 🟢 |
| 4.5 | 自动化测试 | API 测试 + E2E 测试 | 🟢 |
| 4.6 | 监控上线 | Sentry + Vercel Analytics | 🟢 |

---

## 17. 优化任务优先级矩阵

### P0 — 上线阻塞项 (必须在 MVP 前完成)

| # | 任务 | 影响范围 | 工作量 |
|---|------|---------|:---:|
| 1 | NextAuth.js 认证替换 | 全局 | 🔴 大 |
| 2 | 首页重建为公共 CEO 操作仓 | `app/page.tsx` | 🔴 大 |
| 3 | API 认证中间件 | 所有 `/api/*` | 🔴 中 |
| 4 | 密码加密 (bcrypt) | 注册/登录 | 🔴 小 |
| 5 | 邮箱验证 | 注册流程 | 🔴 中 |
| 6 | Stripe 支付集成 | 订阅/支付 | 🔴 大 |
| 7 | OpenAI Provider 实现 | 7 个 AI 模块 | 🔴 中 |
| 8 | SEO 基础设施 | sitemap/robots/meta | 🔴 小 |
| 9 | Cookie Consent 弹窗 | GDPR/PIPL | 🔴 小 |
| 10 | 数据溯源字段 | Candidate 模型 | 🔴 中 |

### P1 — 体验完善项

| # | 任务 | 工作量 |
|---|------|:---:|
| 11 | 隐私设置页面 | 中 |
| 12 | 企业/猎头/专家认证流程 | 大 |
| 13 | 文件上传功能 | 中 |
| 14 | shadcn/ui 组件补全 | 中 |
| 15 | 举报审核系统 | 中 |
| 16 | 数据权利 API | 中 |
| 17 | 帮助中心 | 大 |
| 18 | 公共博客 | 大 |

### P2 — 扩展优化项

| # | 任务 | 工作量 |
|---|------|:---:|
| 19 | 德语/日语支持 | 中 |
| 20 | 自动化测试 | 大 |
| 21 | 性能优化 | 中 |
| 22 | Sentry 监控 | 小 |
| 23 | 双因素认证 | 中 |
| 24 | API 文档 | 中 |

---

> **文档结束**。本优化方案基于 2026-05-31 项目状态诊断生成，可直接用于 WorkBuddy 分阶段开发实施。
> 
> **下一步**: 按 P0 优先级开始执行第一阶段任务 — NextAuth.js 认证替换。
