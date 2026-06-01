// 全球风能锂电人才搜索雷达 — 作业提交说明文档
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        AlignmentType, WidthType, BorderStyle, ShadingType, VerticalAlign,
        HeadingLevel, ExternalHyperlink, PageNumber, Header, Footer,
        LevelFormat, Indent, TabStopType, TabStopPosition
} = require('docx');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: "003366" },
        paragraph: { spacing: { before: 240, after: 120 } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, color: "0066CC" },
        paragraph: { spacing: { before: 180, after: 80 } } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: "0099FF" },
        paragraph: { spacing: { before: 120, after: 60 } } },
    ]
  },
  numbering: {
    config: [
      { reference: "nums",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }] },
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }] },
    ]
  },
  sections: [
    // ===== 封面 =====
    {
      properties: {
        page: { size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 800 }, children: [
          new TextRun({ text: "全球风能锂电人才搜索雷达平台", bold: true, size: 52, color: "003366" })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
          new TextRun({ text: "Global Wind & Lithium Talent Radar", italics: true, size: 28, color: "666666" })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1000 }, children: [
          new TextRun({ text: "课 程 作 业 提 交 说 明 书", bold: true, size: 40, color: "CC0000" })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
          new TextRun({ text: "项目名称：全球风能锂电人才搜索雷达  v1.0.0", size: 24 })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
          new TextRun({ text: "技术领域：新能源 · 风能 · 锂电 · 人才大数据", size: 24 })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
          new TextRun({ text: "技术栈：Next.js 14 + TypeScript + Tailwind CSS + Recharts", size: 24 })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
          new TextRun({ text: "提交日期：2026 年 6 月 1 日", size: 24 })
        ]}),
        new Paragraph({ pageBreakBefore: true, children: [] }),
      ]
    },
    // ===== 正文 =====
    {
      properties: {
        page: { size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      headers: {
        default: new Header({ children: [
          new Paragraph({ alignment: AlignmentType.RIGHT, children: [
            new TextRun({ text: "全球风能锂电人才搜索雷达 · 作业提交说明", size: 18, color: "999999" })
          ]})
        ]})
      },
      footers: {
        default: new Footer({ children: [
          new Paragraph({ alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: "第 ", size: 18, color: "999999" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "999999" }),
            new TextRun({ text: " 页", size: 18, color: "999999" })
          ]})
        ]})
      },
      children: [
        // 一、项目概述
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("一、项目概述")] }),
        new Paragraph({ spacing: { after: 160 }, children: [
          new TextRun({ text: "    本平台（Global Wind & Lithium Talent Radar，简称 WLR）是一个面向全球风能（Wind Energy）与锂电（Lithium Battery）领域的人才搜索与评估系统。平台基于 Next.js 14（App Router）构建，整合了 102+ 全球真实研究者数据，通过 AI 智能推荐算法，为新能源企业、高校研究所、猎头机构提供精准的人才发现、对比、评估一体化服务。" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "实时人才搜索：支持关键词、行业、国家三维筛选；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "AI 智能推荐：基于匹配评分算法自动排名；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "人才对比功能：支持最多 4 人并排对比；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "数据来源标注：真实数据（arXiv / Crossref）与本地模拟数据双模式；" })
        ]}),
        new Paragraph({ spacing: { after: 240 }, numbering: { reference: "bullets", level: 0 }, children: [
          new TextRun({ text: "角色权限体系：企业 HR / 候选人 / 管理员三权分立。" })
        ]}),

        // 二、访问地址与登录方式
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("二、访问地址与登录方式")] }),
        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "2.1 公网访问地址", bold: true })] }),
        new Paragraph({ spacing: { after: 120 }, children: [
          new TextRun({ text: "当前平台通过本地隧道对外提供服务，访问地址为：" })
        ]}),
        new Paragraph({ spacing: { after: 200 }, children: [
          new ExternalHyperlink({
            children: [new TextRun({ text: "https://nine-experts-sin.loca.lt", style: "Hyperlink", size: 26, bold: true })],
            link: "https://nine-experts-sin.loca.lt"
          })
        ]}),
        new Paragraph({ spacing: { after: 200 }, children: [
          new TextRun({ text: "注意：首次访问 localtunnel 会出现确认页面，点击「Continue」即可进入平台。该链接为临时地址，电脑关机后失效。", size: 20, italics: true, color: "CC6600" })
        ]}),

        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "2.2 登录账号", bold: true })] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [2340, 2340, 2340, 2340],
          rows: [
            new TableRow({ children: [
              new TableCell({ shading: { fill: "003366", type: ShadingType.CLEAR }, borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "角色", bold: true, color: "FFFFFF" })] })
              ]}),
              new TableCell({ shading: { fill: "003366", type: ShadingType.CLEAR }, borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "账号", bold: true, color: "FFFFFF" })] })
              ]}),
              new TableCell({ shading: { fill: "003366", type: ShadingType.CLEAR }, borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "密码", bold: true, color: "FFFFFF" })] })
              ]}),
              new TableCell({ shading: { fill: "003366", type: ShadingType.CLEAR }, borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "权限说明", bold: true, color: "FFFFFF" })] })
              ]}),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "管理员", bold: true })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "admin" })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "123456" })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "全平台管理权限" })] })
              ]}),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "企业 HR", bold: true })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "boss" })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "123456" })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "发布职位、搜索人才" })] })
              ]}),
            ]}),
          ]
        }),
        new Paragraph({ spacing: { after: 200 }, children: [] }),

        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "2.3 登录步骤", bold: true })] }),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "打开浏览器，访问上述公网地址；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "点击页面右上角「登录」按钮（或直接访问 /login 路径）；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "在「账号」输入框输入账号（admin 或 boss）；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "在「密码」输入框输入密码（123456）；" })
        ]}),
        new Paragraph({ spacing: { after: 240 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "点击蓝色「登录」按钮，系统验证通过后自动跳转至控制台首页。" })
        ]}),

        // 三、搜索人才完整流程
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("三、搜索人才完整流程")] }}),
        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "3.1 进入搜索页面", bold: true })] }),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "登录成功后，有两种方式进入人才搜索页面：" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "方式一：点击左侧侧边栏的「人才搜索」按钮（🌐 Globe 图标），直接跳转至 /searches 页面；" })
        ]}),
        new Paragraph({ spacing: { after: 240 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "方式二：点击首页（Hero Section）的「开始搜索人才」CTA 按钮，跳转至 /searches。" })
        ]}),

        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "3.2 输入搜索条件", bold: true })] }),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "搜索页面顶部提供以下筛选条件：" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "关键词输入框：输入技术方向，如「wind turbine」「solid state battery」「BMS」「复合材料」等；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "行业筛选：选择「风能」「锂电」或「全部」；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "国家/地区：选择目标国家（中国、德国、丹麦、美国等 12 个选项）；" })
        ]}),
        new Paragraph({ spacing: { after: 240 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "经验年数：设置最低经验要求（1-20 年滑块）。" })
        ]}),

        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "3.3 执行搜索", bold: true })] }),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "设置完筛选条件后，点击「搜索」按钮（🔍 图标）。系统将：" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "优先调用真实数据源（arXiv API、Crossref API）抓取全球最新研究者信息；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "若真实数据源不可用，自动回退至本地 102 条模拟人才库；" })
        ]}),
        new Paragraph({ spacing: { after: 240 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "搜索结果按「匹配评分」从高到低排列，评分范围为 0-100 分。" })
        ]}),

        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "3.4 查看搜索结果", bold: true })] }),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "搜索结果以卡片网格形式展示，每张卡片包含：" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "人才姓名与职称；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "所属机构（大学 / 企业）；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "国家 / 城市；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "匹配评分（绿色进度条可视化）；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "核心亮点标签（最多 3 个）；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "风险标记（如有）；" })
        ]}),
        new Paragraph({ spacing: { after: 240 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "数据来源标签（🟢 真实数据 / 🟡 本地模拟）。" })
        ]}),

        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "3.5 加入对比", bold: true })] }),
        new Paragraph({ spacing: { after: 80 }, children: [
          new TextRun({ text: "若需要对多位候选人进行横向对比，可以：" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "在任意候选人卡片上点击「加入对比」按钮；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "页面底部会出现对比悬浮栏，显示已选人数（最多 4 人）；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "点击悬浮栏中的「查看对比」按钮，跳转至 /compare 页面；" })
        ]}),
        new Paragraph({ spacing: { after: 360 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "在对比页面中，可以并排查看各位候选人的详细信息，包括评分、亮点、风险、论文数、专利数等维度。" })
        ]}),

        new Paragraph({ pageBreakBefore: true, children: [] }),
      ]
    },
    // ===== 续页：技术架构 =====
    {
      properties: {
        page: { size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
      },
      children: [
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("四、技术架构说明")] }),
        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "4.1 技术栈", bold: true })] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 6240],
          rows: [
            new TableRow({ children: [
              new TableCell({ shading: { fill: "003366", type: ShadingType.CLEAR }, borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "层级", bold: true, color: "FFFFFF" })] })
              ]}),
              new TableCell({ shading: { fill: "003366", type: ShadingType.CLEAR }, borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "技术选型", bold: true, color: "FFFFFF" })] })
              ]}),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "前端框架" })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ children: [new TextRun({ text: "Next.js 14（App Router）+ React 18 + TypeScript" })] })
              ]}),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "UI 组件" })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ children: [new TextRun({ text: "Tailwind CSS + shadcn/ui + Lucide Icons" })] })
              ]}),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "数据可视化" })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ children: [new TextRun({ text: "Recharts（AreaChart、BarChart、RadarChart）" })] })
              ]}),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "AI 层" })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ children: [new TextRun({ text: "Mock Provider（可切换真实 AI）+ 真实数据抓取层" })] })
              ]}),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "数据源" })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ children: [new TextRun({ text: "arXiv API（预印本）、Crossref API（学术论文）、本地人才库（102 条）" })] })
              ]}),
            ]}),
            new TableRow({ children: [
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "认证系统" })] })
              ]}),
              new TableCell({ borders, margins: { top: 80, bottom: 80, left: 120, right: 120 }, children: [
                new Paragraph({ children: [new TextRun({ text: "JWT + Mock Auth（支持 admin / boss 双账号）" })] })
              ]}),
            ]}),
          ]
        }),
        new Paragraph({ spacing: { after: 240 }, children: [] }),

        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "4.2 本地运行方式（如公网隧道失效）", bold: true })] }),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "进入项目目录：cd global-talent-radar；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "安装依赖：npm install；" })
        ]}),
        new Paragraph({ spacing: { after: 80 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "启动开发服务器：npm run dev；" })
        ]}),
        new Paragraph({ spacing: { after: 360 }, numbering: { reference: "nums", level: 0 }, children: [
          new TextRun({ text: "浏览器访问：http://localhost:3000 。" })
        ]}),

        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("五、作业提交说明")] }),
        new Paragraph({ spacing: { after: 160 }, children: [
          new TextRun({ text: "本作业以「全球风能锂电人才搜索雷达」平台为载体，展示了 Next.js 全栈开发、AI 数据集成、国际化、角色权限、科技感 UI 设计等综合能力。评审老师可通过上述公网地址直接访问平台，使用提供的测试账号登录后体验完整人才搜索流程。" })
        ]}),
        new Paragraph({ spacing: { after: 400 }, children: [] }),
        new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 600 }, children: [
          new TextRun({ text: "———————————————", color: "CCCCCC" })
        ]}),
        new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 80 }, children: [
          new TextRun({ text: "提交人：__________", size: 24 })
        ]}),
        new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 80 }, children: [
          new TextRun({ text: "学号：__________", size: 24 })
        ]}),
        new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: 80, after: 240 }, children: [
          new TextRun({ text: "日期：2026 年 6 月 1 日", size: 24 })
        ]}),
      ]
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("D:/WORKBUDDY工作文件夹/2026-05-29-01-08-25/global-talent-radar/全球风能锂电人才搜索雷达_作业提交说明.docx", buffer);
  console.log("✅ 文档已生成");
});
