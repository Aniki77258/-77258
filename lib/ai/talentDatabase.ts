/**
 * 全球风能/锂电人才数据库 v2.0
 *
 * 100+ 位行业专家的真实感简历数据，覆盖：
 *   风能(52人)：叶片、控制、运维、齿轮箱、海上基础、风资源、复合材料、施工管理
 *   锂电(48人)：正极、负极、电解液、隔膜、BMS、Pack、电芯装备、回收、钠电、固态
 *   风储协同(混合, 多条记录 industry="both")
 * 国家/地区覆盖：中国、德国、丹麦、美国、英国、瑞典、挪威、荷兰、西班牙、法国、
 *                 意大利、日本、韩国、澳大利亚、加拿大、芬兰、瑞士、奥地利
 */

// ============================================================
// 类型定义
// ============================================================
export interface TalentProfile {
  id: string
  name: string
  title: string
  country: string
  company: string
  experienceYears: number
  education: string
  industry: "wind" | "lithium" | "both"
  skills: string[]
  publications: number
  patents: number
  languages: string[]
  highlights: string[]
  riskFlags: string[]
  avatar: string
}

// ============================================================
// 人才数据（100+ 条）
// ============================================================
export const TALENT_DATABASE: TalentProfile[] = [

  // ============================================================
  // 风能 — 叶片设计 (10人)
  // ============================================================
  {
    id: "wind_blade_001",
    name: "Dr. Sarah Müller",
    title: "叶片气动设计总监",
    country: "德国",
    company: "Siemens Gamesa",
    experienceYears: 18,
    education: "TU München 航空航天工程博士",
    industry: "wind",
    skills: ["叶片设计","CFD仿真","气动弹性","ANSYS Fluent","MATLAB","风洞测试"],
    publications: 35,
    patents: 12,
    languages: ["德语","英语","法语"],
    highlights: [
      "SG 14-236 DD 叶片气动设计核心成员",
      "获 2023 年 WindEurope 技术创新奖",
      "原 Vestas V164 叶片团队高级工程师"
    ],
    riskFlags: ["竞业限制至 2027 年"],
    avatar: "👩‍🔬"
  },
  {
    id: "wind_blade_002",
    name: "张磊",
    title: "叶片结构高级工程师",
    country: "中国",
    company: "金风科技",
    experienceYears: 12,
    education: "北京航空航天大学 工程力学硕士",
    industry: "wind",
    skills: ["叶片结构","有限元","ANSYS Mechanical","复合材料","疲劳载荷","GL认证"],
    publications: 14,
    patents: 7,
    languages: ["中文","英语(工作中)"],
    highlights: [
      "GWH 191-6.7MW 叶片结构主设计",
      "通过 GL 2010 认证一次性通过",
      "叶片重量优化 8%，年发电提升 2.1%"
    ],
    riskFlags: [],
    avatar: "👨‍🔧"
  },
  {
    id: "wind_blade_003",
    name: "Dr. Erik Jensen",
    title: "叶片材料与工艺首席专家",
    country: "丹麦",
    company: "Vestas",
    experienceYears: 20,
    education: "DTU 材料科学博士",
    industry: "wind",
    skills: ["复合材料","真空灌注","预浸料","Gel-coat","叶片维修","寿命预测"],
    publications: 28,
    patents: 9,
    languages: ["丹麦语","英语"],
    highlights: [
      "Vestas V236 叶片材料选型负责人",
      "开发新型环氧/碳纤混合叶片，减重 12%",
      "叶片维修数据库覆盖 8000+ 次现场记录"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },
  {
    id: "wind_blade_004",
    name: "李芳",
    title: "叶片测试与认证经理",
    country: "中国",
    company: "中材科技",
    experienceYears: 14,
    education: "武汉理工大学 复合材料硕士",
    industry: "wind",
    skills: ["全尺寸测试","静力加载","疲劳测试","IEC 61400-23","认证流程","应变片布置"],
    publications: 11,
    patents: 4,
    languages: ["中文"],
    highlights: [
      "负责 80m+ 叶片全尺寸静力测试平台建设",
      "完成 30+ 款叶片型式认证",
      "中国首个 100m 级叶片测试项目负责人"
    ],
    riskFlags: ["不具备海外标准（DNV/UL）认证经验"],
    avatar: "👩‍🔬"
  },
  {
    id: "wind_blade_005",
    name: "Dr. Lisa Chen",
    title: "气动声学研究员",
    country: "英国",
    company: "ORE Catapult",
    experienceYears: 9,
    education: "University of Southampton 声学博士",
    industry: "wind",
    skills: ["气动噪声","CFD/FW-H","风洞实验","降噪叶片","环境评估","MATLAB"],
    publications: 18,
    patents: 2,
    languages: ["英语","中文(基础)"],
    highlights: [
      "开发叶片后缘锯齿降噪方案，噪声降低 3dB(A)",
      "参与英国海上风电噪声限值标准制定",
      "Nature Energy 子刊合作论文 2 篇"
    ],
    riskFlags: ["工作签证需 sponser，英国本土优先"],
    avatar: "👩‍🔬"
  },
  {
    id: "wind_blade_006",
    name: "王海涛",
    title: "叶片模具设计工程师",
    country: "中国",
    company: "双瑞风电",
    experienceYears: 10,
    education: "河南工业大学 机械设计学士",
    industry: "wind",
    skills: ["模具设计","CAD/CAM","钢模/玻纤模","型面精度","热变形控制","加工工艺"],
    publications: 2,
    patents: 6,
    languages: ["中文"],
    highlights: [
      "设计 90m 分段式叶片模具，型面精度 ±0.3mm",
      "模具寿命从 200 套提升至 350 套",
      "改进模具加热系统，能耗降低 25%"
    ],
    riskFlags: [],
    avatar: "👨‍🔧"
  },
  {
    id: "wind_blade_007",
    name: "Dr. Miguel Ángel Cortés",
    title: "叶片智能巡检算法专家",
    country: "西班牙",
    company: "Iberdrola",
    experienceYears: 8,
    education: "Universidad Politécnica de Madrid 计算机视觉博士",
    industry: "wind",
    skills: ["无人机巡检","Deep Learning","OpenCV","缺陷识别","数字孪生","Python"],
    publications: 16,
    patents: 3,
    languages: ["西班牙语","英语","葡萄牙语"],
    highlights: [
      "开发叶片无人机自动巡检系统，缺陷识别率 96%",
      "已部署 500+ 台风机",
      "SCI 一区论文 8 篇"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "wind_blade_008",
    name: "安娜·诺瓦克",
    title: "叶片回收与循环经济专家",
    country: "荷兰",
    company: "LM Wind Power (GE)",
    experienceYears: 11,
    education: "Delft University of Technology 可持续能源硕士",
    industry: "wind",
    skills: ["叶片回收","热解法","材料再生","LCA","循环经济","EU法规"],
    publications: 12,
    patents: 2,
    languages: ["荷兰语","英语","德语"],
    highlights: [
      "主导 LM 叶片回收示范线，材料回收率 85%",
      "EU 废弃物框架指令（WFD）合规顾问",
      "叶片回收成本降低 40% 工艺方案"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "wind_blade_009",
    name: "Dr. Kenji Sato",
    title: "抗台风叶片设计专家",
    country: "日本",
    company: "Hitachi Energy (原日立)",
    experienceYears: 16,
    education: "东京大学 流体力学博士",
    industry: "wind",
    skills: ["台风载荷","气动弹性","阻尼器设计","极限载荷","JIS标准","风洞实验"],
    publications: 22,
    patents: 8,
    languages: ["日语","英语"],
    highlights: [
      "日本沿海台风区 5MW 叶片抗台风设计",
      "叶片极限载荷降低 18% 的创新方案",
      "参与 IEC 61400-1 抗台风条款修订"
    ],
    riskFlags: ["日语为主要工作语言"],
    avatar: "👨‍🔬"
  },
  {
    id: "wind_blade_010",
    name: "刘志强",
    title: "叶片生产质量总监",
    country: "中国",
    company: "明阳智能",
    experienceYears: 13,
    education: "华南理工大学 高分子材料硕士",
    industry: "wind",
    skills: ["质量管理","六西格玛","灌注缺陷","NPI","SPC","ISO 9001"],
    publications: 3,
    patents: 5,
    languages: ["中文","英语(工作中)"],
    highlights: [
      "叶片生产一次合格率从 91% → 98.5%",
      "获 2024 年广东省质量奖",
      "主持 3 条海外（越南/巴西）叶片产线质量体系建设"
    ],
    riskFlags: [],
    avatar: "👨‍💼"
  },

  // ============================================================
  // 风能 — 控制系统 (8人)
  // ============================================================
  {
    id: "wind_ctrl_001",
    name: "Thomas Bergström",
    title: "风机控制系统架构师",
    country: "丹麦",
    company: "Vestas",
    experienceYears: 12,
    education: "DTU 控制工程硕士",
    industry: "wind",
    skills: ["风机控制","PLC编程","Matlab/Simulink","LiDAR辅助控制","载荷优化","C++"],
    publications: 8,
    patents: 4,
    languages: ["丹麦语","英语","瑞典语"],
    highlights: [
      "Vestas V236-15.0 MW 控制算法主要开发者",
      "首创基于 LiDAR 前馈的独立变桨控制策略",
      "降低极限载荷 12%，延长叶片寿命 3 年"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "wind_ctrl_002",
    name: "赵明远",
    title: "主控系统高级工程师",
    country: "中国",
    company: "金风科技",
    experienceYears: 10,
    education: "华北电力大学 控制工程硕士",
    industry: "wind",
    skills: ["主控PLC","Codesys","变桨控制","转矩控制","故障诊断","SCADA集成"],
    publications: 6,
    patents: 8,
    languages: ["中文","英语"],
    highlights: [
      "金风 6.X MW 平台主控系统核心开发者",
      "变桨轴承故障预测准确率 92%",
      "通过 KK-952 功能安全认证"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "wind_ctrl_003",
    name: "Dr. Anna Weber",
    title: "协同控制算法研究员",
    country: "德国",
    company: "Fraunhofer IWES",
    experienceYears: 9,
    education: "Universität Stuttgart 控制工程博士",
    industry: "wind",
    skills: ["尾流控制","协同优化","模型预测控制","Python","功率提升","风场级控制"],
    publications: 21,
    patents: 2,
    languages: ["德语","英语"],
    highlights: [
      "风场尾流协同控制算法，全场功率提升 4.2%",
      "EU Horizon Europe 项目子课题负责人",
      "IEEE Transactions on Control Systems Technology 论文 5 篇"
    ],
    riskFlags: ["学术导向，工程落地经验有限"],
    avatar: "👩‍💻"
  },
  {
    id: "wind_ctrl_004",
    name: "陈浩宇",
    title: "变流器控制工程师",
    country: "中国",
    company: "阳光电源",
    experienceYears: 8,
    education: "浙江大学 电力电子硕士",
    industry: "wind",
    skills: ["变流器控制","PWM调制","并网谐波","低电压穿越","MATLAB/Simulink","dSPACE"],
    publications: 5,
    patents: 6,
    languages: ["中文","英语"],
    highlights: [
      "10MW 级风电变流器控制算法，LCL 滤波谐振抑制",
      "低电压穿越 LVRT 100% 通过国网测试",
      "参与 GB/T 19963 修订"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "wind_ctrl_005",
    name: "Dr. James O'Brien",
    title: "漂浮式风电动态缆控专家",
    country: "苏格兰",
    company: "Orsted",
    experienceYears: 14,
    education: "University of Strathclyde 海洋工程博士",
    industry: "wind",
    skills: ["漂浮式控制","系泊耦合","动态缆","协同控制","OrcaFlex","疲劳分析"],
    publications: 19,
    patents: 3,
    languages: ["英语"],
    highlights: [
      "Hornsea 3 漂浮式项目动态缆控系统负责人",
      "系泊-控制耦合振荡抑制方案",
      "获 2025 年 Offshore Wind Europe 技术创新奖"
    ],
    riskFlags: ["至少 10 个月后才能到岗（项目在身）"],
    avatar: "👨‍🔬"
  },
  {
    id: "wind_ctrl_006",
    name: "孙伟",
    title: "风机故障诊断算法工程师",
    country: "中国",
    company: "远景能源",
    experienceYears: 7,
    education: "西安交通大学 机械工程博士",
    industry: "wind",
    skills: ["故障诊断","深度学习","振动分析","SCADA数据挖掘","Python","TensorFlow"],
    publications: 11,
    patents: 4,
    languages: ["中文","英语"],
    highlights: [
      "主轴轴承故障预警准确率 94%，误报率 <2%",
      "算法部署于 5000+ 台远景风机",
      " lubrication 异常检测获中国专利优秀奖"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "wind_ctrl_007",
    name: "Dr. Ingrid Hanssen",
    title: "风储协同控制研究员",
    country: "挪威",
    company: "Equinor / SINTEF",
    experienceYears: 11,
    education: "Norwegian University of Science and Technology 电力工程博士",
    industry: "both",
    skills: ["风储协同","一次调频","AGC/AVC","储能控制","MATLAB","实时仿真"],
    publications: 24,
    patents: 5,
    languages: ["挪威语","英语"],
    highlights: [
      "风储联合一次调频控制策略，通过国家电网验收",
      "SINTEF 风储实验室负责人",
      "IEEE PES 会员，多个 CIGRE 工作组成员"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "wind_ctrl_008",
    name: "周光辉",
    title: "风机安全与功能安全工程师",
    country: "中国",
    company: "上海电气风电",
    experienceYears: 9,
    education: "同济大学 安全工程硕士",
    industry: "wind",
    skills: ["功能安全","ISO 13849","IEC 61508","SIL认证","FMEA","安全回路设计"],
    publications: 3,
    patents: 5,
    languages: ["中文"],
    highlights: [
      "上海电气 8MW 平台功能安全 SIL2 认证负责人",
      "编制企业功能安全规范 200+ 页",
      "零安全事故率保持 6 年"
    ],
    riskFlags: ["英语沟通能力不足，不适合国际项目"],
    avatar: "👨‍💼"
  },

  // ============================================================
  // 风能 — 海上基础与施工 (8人)
  // ============================================================
  {
    id: "wind_offshore_001",
    name: "Dr. Chen Wei",
    title: "海上风电基础结构首席工程师",
    country: "中国",
    company: "中国海装",
    experienceYears: 15,
    education: "同济大学 结构工程博士",
    industry: "wind",
    skills: ["海上风电","单桩基础","导管架设计","SACS","Bladed","疲劳分析"],
    publications: 28,
    patents: 6,
    languages: ["中文","英语"],
    highlights: [
      "主导设计全球首座 16MW 海上风电导管架基础",
      "中国首个漂浮式风电项目结构负责人",
      "参与编写《海上风电场工程设计规范》GB/T"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },
  {
    id: "wind_offshore_002",
    name: "Maria Fernández",
    title: "海上风电项目建设经理",
    country: "西班牙",
    company: "Iberdrola",
    experienceYears: 13,
    education: "Universidad Politécnica de Madrid 土木工程硕士",
    industry: "wind",
    skills: ["海上施工","项目管理","PMP","HSE管理","安装船调度","供应链管理"],
    publications: 2,
    patents: 0,
    languages: ["西班牙语","英语","葡萄牙语"],
    highlights: [
      "管理 East Anglia ONE (714MW) 海上风电场施工",
      "预算管控 28 亿欧元，提前 3 个月完工",
      "零重大安全事故记录"
    ],
    riskFlags: ["期望薪酬较高（€180K+）"],
    avatar: "👷‍♀️"
  },
  {
    id: "wind_offshore_003",
    name: "Dr. Pierre Leclerc",
    title: "海上风电岩土工程专家",
    country: "法国",
    company: "EDF Renewables",
    experienceYears: 17,
    education: "École Polytechnique 岩土工程博士",
    industry: "wind",
    skills: ["岩土勘查","桩基承载力","地质建模","PLAXIS","海上地质","API规范"],
    publications: 31,
    patents: 1,
    languages: ["法语","英语","西班牙语"],
    highlights: [
      "法国首个漂浮式项目（Gruissan 250MW）地质勘查负责人",
      "单桩极限承载力预测模型精度 ±8%",
      "法国核电-风电联合基础设计方案发起人"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },
  {
    id: "wind_offshore_004",
    name: "Dr. Kenji Tanaka",
    title: "浮式风电锚泊系统专家",
    country: "日本",
    company: "JERA",
    experienceYears: 17,
    education: "东京大学 海洋工程博士",
    industry: "wind",
    skills: ["浮式风电","系泊分析","OrcaFlex","深海锚固","水动力分析","FPSO经验"],
    publications: 19,
    patents: 3,
    languages: ["日语","英语"],
    highlights: [
      "日本 Fukushima FORWARD 浮式风电项目技术顾问",
      "参与 Hywind Scotland 锚泊系统前期概念设计",
      "持有日本一级建筑师（海洋结构）资格"
    ],
    riskFlags: ["日语为主要工作语言，英语流利但带口音"],
    avatar: "👨‍🔬"
  },
  {
    id: "wind_offshore_005",
    name: "Hans Østergaard",
    title: "海上运维与 Logistic 专家",
    country: "丹麦",
    company: "Ørsted",
    experienceYears: 12,
    education: "DTU 海上作业管理硕士",
    industry: "wind",
    skills: ["运维调度","船舶管理","CMS","直升机运维","天气窗口","供应链"],
    publications: 1,
    patents: 0,
    languages: ["丹麦语","英语"],
    highlights: [
      "Ørsted 台湾大彰化 900MW 项目运维负责人",
      "直升机运维（HoHaT）方案，运维成本降低 22%",
      "海上作业天气窗口预测准确率 87%"
    ],
    riskFlags: [],
    avatar: "👨‍✈️"
  },
  {
    id: "wind_offshore_006",
    name: "李建国",
    title: "海上风电变频器与电气系统工程师",
    country: "中国",
    company: "明阳智能",
    experienceYears: 11,
    education: "华南理工大学 电气工程硕士",
    industry: "wind",
    skills: ["海缆","变频系统","海上变电站","HVAC","HVDC","接地设计"],
    publications: 7,
    patents: 9,
    languages: ["中文","英语(基础)"],
    highlights: [
      "明阳 MySE 16.0-242 海上机型电气系统负责人",
      "220kV 海缆接头防护方案，故障率降低 60%",
      "通过 DNV GL 海缆系统认证"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "wind_offshore_007",
    name: "Dr. Sophie Martel",
    title: "海上风电环境评估专家",
    country: "加拿大",
    company: "Northland Power",
    experienceYears: 10,
    education: "University of British Columbia 海洋生态博士",
    industry: "wind",
    skills: ["环境影响评估","海洋生物学","EIA","鸟类迁徙","水下噪声","监管合规"],
    publications: 26,
    patents: 0,
    languages: ["英语","法语"],
    highlights: [
      "加拿大首个大型海上风电项目（Ontario L1）EIA 负责人",
      "鸟类迁徙路径与风机碰撞风险评估模型",
      "获 2024 年 Canadian Renewable Energy Association 奖项"
    ],
    riskFlags: ["加拿大公民，需工作许可"],
    avatar: "👩‍🔬"
  },
  {
    id: "wind_offshore_008",
    name: "张建国",
    title: "海上施工工艺工程师",
    country: "中国",
    company: "中交三航局",
    experienceYears: 18,
    education: "河海大学 港口航道学士",
    industry: "wind",
    skills: ["海上打桩","吊装工艺","坐底船","潮汐窗口","精度控制","施工仿真"],
    publications: 4,
    patents: 7,
    languages: ["中文"],
    highlights: [
      "参与 15+ 个海上风电项目施工，累计装机 3GW+",
      "大直径单桩沉桩精度控制 ±15cm",
      "研发坐底船稳性实时监测系统"
    ],
    riskFlags: ["年龄偏大（50岁），国际项目出差意愿低"],
    avatar: "👷‍♂️"
  },

  // ============================================================
  // 风能 — 风资源与微观选址 (6人)
  // ============================================================
  {
    id: "wind_resource_001",
    name: "Dr. Emily Watson",
    title: "风资源评估与微观选址专家",
    country: "英国",
    company: "RES Group",
    experienceYears: 14,
    education: "University of Reading 气象学博士",
    industry: "wind",
    skills: ["WAsP","WindPRO","CFD微尺度","激光雷达测风","GIS","能源产量评估"],
    publications: 22,
    patents: 0,
    languages: ["英语","西班牙语(基础)"],
    highlights: [
      "评估 50+ 风电场项目，累计装机 5GW+",
      "开发北海复杂地形风资源 CFD 模型",
      "IEC 61400-15 标准工作组成员"
    ],
    riskFlags: ["当前在苏格兰项目，至少 8 个月后才能到岗"],
    avatar: "👩‍💼"
  },
  {
    id: "wind_resource_002",
    name: "王思远",
    title: "风资源高级工程师",
    country: "中国",
    company: "金风科技",
    experienceYears: 9,
    education: "南京信息工程大学 大气科学硕士",
    industry: "wind",
    skills: ["WAsP","WindSIM","测风塔","MCP","发电量评估","尾流模型"],
    publications: 8,
    patents: 2,
    languages: ["中文","英语"],
    highlights: [
      "负责 3GW+ 项目风资源评估，评估误差 <5%",
      "开发复杂地形尾流修正模型，精度提升 8%",
      "获 2023 年金风科技技术创新奖"
    ],
    riskFlags: [],
    avatar: "👨‍💼"
  },
  {
    id: "wind_resource_003",
    name: "Dr. Lars Nordahl",
    title: "冰冻与再生能源气象专家",
    country: "挪威",
    company: "Equinor",
    experienceYears: 13,
    education: "University of Oslo 气象学博士",
    industry: "wind",
    skills: ["冰冻载荷","再分析数据","ERA5","极端风速","IEC 61400-1","气象雷达"],
    publications: 29,
    patents: 1,
    languages: ["挪威语","英语"],
    highlights: [
      "北海冰冻载荷模型，被 DNV 采纳为标准附录",
      "Equinor 北极圈风电项目气象评估负责人",
      "Nature Climate Change 合作论文 1 篇"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },
  {
    id: "wind_resource_004",
    name: "刘雨晴",
    title: "激光雷达测风技术工程师",
    country: "中国",
    company: "中国电建集团",
    experienceYears: 7,
    education: "清华大学 仪器科学硕士",
    industry: "wind",
    skills: ["激光雷达","测风塔标定","数据质量","LIDAR校正","IEC 61400-12","Python"],
    publications: 9,
    patents: 3,
    languages: ["中文","英语"],
    highlights: [
      "主导 200+ 台激光雷达测风设备标定",
      "开发 LIDAR 与测风塔数据融合算法，误差 <1.5%",
      "参与 IEC 61400-12-2 标准修订"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "wind_resource_005",
    name: "Dr. Carlos Mendoza",
    title: "热带风资源与台风评估专家",
    country: "墨西哥",
    company: "Vestas (墨西哥办事处)",
    experienceYears: 11,
    education: "UNAM 气象学博士",
    industry: "wind",
    skills: ["台风模拟","热带气象","WRF模式","极端风况","拉美风资源","GIS"],
    publications: 17,
    patents: 0,
    languages: ["西班牙语","英语","葡萄牙语"],
    highlights: [
      "墨西哥湾台风风资源评估，误差 <7%",
      "拉美 5 国 2GW+ 风资源评估项目负责人",
      "Vestas 拉美风资源数据库建设核心成员"
    ],
    riskFlags: ["需墨西哥工作签证"],
    avatar: "👨‍🔬"
  },
  {
    id: "wind_resource_006",
    name: "赵明",
    title: "CFD 风工程高级工程师",
    country: "中国",
    company: "远景能源",
    experienceYears: 8,
    education: "中国科学技术大学 流体力学博士",
    industry: "wind",
    skills: ["OpenFOAM","Fluent","CFD","地形流场","纳维-斯托克斯","并行计算"],
    publications: 12,
    patents: 2,
    languages: ["中文","英语"],
    highlights: [
      "远景 EN-252 机型复杂地形 CFD 校正模型",
      "CFD 微观选址精度提升 12%，年发电收益 +1.8%",
      "SCI 一区论文 5 篇"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },

  // ============================================================
  // 风能 — 齿轮箱与传动链 (6人)
  // ============================================================
  {
    id: "wind_drivetrain_001",
    name: "赵明远",
    title: "风电齿轮箱设计高级工程师",
    country: "中国",
    company: "南高齿",
    experienceYears: 11,
    education: "重庆大学 机械工程博士",
    industry: "wind",
    skills: ["齿轮箱设计","KISSsoft","Romax","行星齿轮","NVH分析","润滑系统"],
    publications: 15,
    patents: 9,
    languages: ["中文","英语"],
    highlights: [
      "设计 8MW 半直驱齿轮箱，已量产装机 200+ 台",
      "齿轮箱噪降低 6dB(A) 创新方案",
      "国家标准 GB/T 19073 修订组成员"
    ],
    riskFlags: [],
    avatar: "👨‍🔧"
  },
  {
    id: "wind_drivetrain_002",
    name: "Dr. Michael Bauer",
    title: "传动链动力学专家",
    country: "德国",
    company: "ZF Friedrichshafen",
    experienceYears: 16,
    education: "TU München 机械工程博士",
    industry: "wind",
    skills: ["传动链动力学","扭矩波动","扭转振动","Romax","MASTA","故障诊断"],
    publications: 33,
    patents: 11,
    languages: ["德语","英语"],
    highlights: [
      "ZF 海上 14MW 齿轮箱传动链动力学主设计",
      "扭振抑制方案，齿轮箱寿命延长 20%",
      "获 2024 年德国机械工程学会奖"
    ],
    riskFlags: ["竞业限制严格"],
    avatar: "👨‍🔬"
  },
  {
    id: "wind_drivetrain_003",
    name: "孙建国",
    title: "主轴与轴承系统工程师",
    country: "中国",
    company: "洛阳 LYC 轴承",
    experienceYears: 14,
    education: "河南科技大学 轴承设计学士",
    industry: "wind",
    skills: ["主轴轴承","调心滚子","润滑设计","疲劳寿命","ISO 281","失效分析"],
    publications: 6,
    patents: 12,
    languages: ["中文"],
    highlights: [
      "开发 7MW 主轴轴承，通过 DNV GL 认证",
      "主轴轴承平均寿命从 8 年提升至 12 年",
      "国内首家通过 GL 认证的自主品牌轴承"
    ],
    riskFlags: ["英语仅基础，不适合海外技术交流"],
    avatar: "👨‍🔧"
  },
  {
    id: "wind_drivetrain_004",
    name: "Dr. Anders Friis",
    title: "直驱永磁发电机专家",
    country: "丹麦",
    company: "Vestas",
    experienceYears: 13,
    education: "Aalborg University 电机工程博士",
    industry: "wind",
    skills: ["永磁发电机","直驱","电磁设计","JMAG","热管理","绝缘系统"],
    publications: 19,
    patents: 7,
    languages: ["丹麦语","英语","德语(基础)"],
    highlights: [
      "Vestas V172 直驱发电机电磁主设计",
      "永磁体退磁风险降低方案，保障 20 年设计寿命",
      "发电机效率 98.2%，行业领先"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },
  {
    id: "wind_drivetrain_005",
    name: "李建华",
    title: "偏航变桨轴承设计工程师",
    country: "中国",
    company: "徐州罗特艾德",
    experienceYears: 10,
    education: "中国矿业大学 机械设计硕士",
    industry: "wind",
    skills: ["偏航轴承","变桨轴承","回转支承","密封设计","润滑脂","寿命测试"],
    publications: 4,
    patents: 8,
    languages: ["中文","英语(工作中)"],
    highlights: [
      "5MW 偏航变桨轴承国产化，降低成本 40%",
      "通过 10 万次循环载荷测试",
      "获 2025 年江苏省科技进步二等奖"
    ],
    riskFlags: [],
    avatar: "👨‍🔧"
  },
  {
    id: "wind_drivetrain_006",
    name: "Dr. Rachel Green",
    title: "发电机绝缘与可靠性专家",
    country: "美国",
    company: "GE Vernova",
    experienceYears: 12,
    education: "MIT 电气工程博士",
    industry: "wind",
    skills: ["绝缘系统","局部放电","耐压测试","IEC 60034","可靠性统计","加速老化"],
    publications: 27,
    patents: 6,
    languages: ["英语"],
    highlights: [
      "GE Haliade-X 发电机绝缘系统主设计",
      "局部放电在线监测系统，提前 6 个月预警绝缘失效",
      "IEEE PES 发电机绝缘工作组主席"
    ],
    riskFlags: ["美国公民，需 H-1B 或中国工作许可"],
    avatar: "👩‍🔬"
  },

  // ============================================================
  // 风能 — 风电场运维 (6人)
  // ============================================================
  {
    id: "wind_om_001",
    name: "李建国",
    title: "风电场运维总监",
    country: "中国",
    company: "龙源电力",
    experienceYears: 20,
    education: "华北电力大学 电气工程硕士",
    industry: "wind",
    skills: ["风电场运维","状态监测","SCADA系统","预测性维护","大部件更换","ERP"],
    publications: 5,
    patents: 2,
    languages: ["中文"],
    highlights: [
      "管理装机容量 2.8GW 风电资产",
      "故障停机率降低 40% 运维优化方案",
      "建立全国首个海上风电智能运维中心"
    ],
    riskFlags: ["年龄偏大（55 岁），需评估国际出差意愿"],
    avatar: "👨‍🏭"
  },
  {
    id: "wind_om_002",
    name: "Dr. Martin Schulz",
    title: "预测性运维与 AI 应用专家",
    country: "德国",
    company: "Siemens Gamesa",
    experienceYears: 10,
    education: "ETH Zürich 数据科学硕士 + TU Berlin 博士",
    industry: "wind",
    skills: ["预测性维护","机器学习","SCADA数据挖掘","Python","故障预测","数字孪生"],
    publications: 23,
    patents: 4,
    languages: ["德语","英语","法语(基础)"],
    highlights: [
      "SG 4.X 平台预测性维护算法，提前 30 天预警故障",
      "运维成本降低 28%，停机时间减少 35%",
      "Nature Machine Intelligence 论文 1 篇"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "wind_om_003",
    name: "王磊",
    title: "风电场电气运维工程师",
    country: "中国",
    company: "华能新能源",
    experienceYears: 8,
    education: "东北电力大学 电气工程学士",
    industry: "wind",
    skills: ["电气运维","继电保护","SVG","升压站","电网接入","故障排查"],
    publications: 2,
    patents: 3,
    languages: ["中文"],
    highlights: [
      "管理 300MW 风电场电气系统，可用率 99.2%",
      "继电保护误动率降低 70% 方案",
      "获华能集团 2024 年技术能手称号"
    ],
    riskFlags: [],
    avatar: "👨‍💼"
  },
  {
    id: "wind_om_004",
    name: "Eva Lundqvist",
    title: "北欧风电场资产管理人员",
    country: "瑞典",
    company: "Vattenfall",
    experienceYears: 9,
    education: "KTH Royal Institute of Technology 可持续能源硕士",
    industry: "wind",
    skills: ["资产管理","LCOE优化","寿命延长","技改","KPI管理","财务报告"],
    publications: 3,
    patents: 0,
    languages: ["瑞典语","英语","挪威语"],
    highlights: [
      "管理瑞典 1.2GW 风电资产，LCOE 降低 8%",
      "老旧风场技改方案，延长寿命 10 年",
      "Vattenfall 年度最佳资产管理者 2024"
    ],
    riskFlags: [],
    avatar: "👩‍💼"
  },
  {
    id: "wind_om_005",
    name: "张明辉",
    title: "风电场 SCADA 与数据分析工程师",
    country: "中国",
    company: "远景能源",
    experienceYears: 7,
    education: "华中科技大学 自动化硕士",
    industry: "wind",
    skills: ["SCADA","PLC","Python","数据可视化","故障代码","远程监控"],
    publications: 4,
    patents: 5,
    languages: ["中文","英语"],
    highlights: [
      "远景 EnOS 风电 SCADA 系统核心开发者",
      "异常检测算法，误报率从 15% → 3%",
      "远程运维中心建设，人工成本降低 50%"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "wind_om_006",
    name: "Dr. Javier Rodríguez",
    title: "拉美风电场运维顾问",
    country: "阿根廷",
    company: "Vestas (南美服务部)",
    experienceYears: 12,
    education: "Universidad de Buenos Aires 机械工程博士",
    industry: "wind",
    skills: ["风场运维","西班牙语技术交流","备件管理","拉美电网","CMS","本地化服务"],
    publications: 7,
    patents: 1,
    languages: ["西班牙语","葡萄牙语","英语"],
    highlights: [
      "负责南美 1.5GW 风电资产运维策略",
      "本地化备件供应链，运维成本降低 30%",
      "阿根廷首个 200MW 风场运维负责人"
    ],
    riskFlags: [],
    avatar: "👨‍🔧"
  },

  // ============================================================
  // 风能 — 塔筒与基础制造 (4人)
  // ============================================================
  {
    id: "wind_tower_001",
    name: "张磊",
    title: "塔筒与基础制造工艺工程师",
    country: "中国",
    company: "天顺风能",
    experienceYears: 10,
    education: "哈尔滨工业大学 焊接工程学士",
    industry: "wind",
    skills: ["塔筒制造","焊接工艺","NDT检测","ISO 3834","EN 1090","精益生产"],
    publications: 3,
    patents: 5,
    languages: ["中文","英语(工作中)"],
    highlights: [
      "改进塔筒法兰焊接工艺，一次合格率从 92% → 99.5%",
      "主导 3 条自动化焊接产线建设",
      "中国首个出口欧洲 EN 1090 EXC4 认证塔筒项目"
    ],
    riskFlags: [],
    avatar: "👨‍🔧"
  },
  {
    id: "wind_tower_002",
    name: "Dr. Hans Zimmermann",
    title: "复合材料与结构健康监测专家",
    country: "德国",
    company: "Fraunhofer IWES",
    experienceYears: 16,
    education: "TU Darmstadt 材料科学博士",
    industry: "wind",
    skills: ["复合材料","结构健康监测","光纤传感","SHM系统","疲劳寿命预测","FBG"],
    publications: 42,
    patents: 8,
    languages: ["德语","英语"],
    highlights: [
      "开发嵌入式 FBG 叶片应变监测系统",
      "参与 EU Horizon IRPWIND 项目",
      "国标 GB/T 25384 参考的疲劳评估方法作者之一"
    ],
    riskFlags: ["目前是 Fraunhofer 终身研究员，离职动力低"],
    avatar: "👨‍🔬"
  },
  {
    id: "wind_tower_003",
    name: "刘国栋",
    title: "塔筒运输与海上安装工程师",
    country: "中国",
    company: "中天科技海缆",
    experienceYears: 12,
    education: "大连理工大学 港口工程硕士",
    industry: "wind",
    skills: ["塔筒运输","滚装方案","海上吊装"," dyna crane","稳性计算","运输仿真"],
    publications: 2,
    patents: 4,
    languages: ["中文"],
    highlights: [
      "江苏大丰 800MW 项目塔筒运输与安装总负责人",
      "超长塔筒陆运方案（液压平板车 + 桥梁加固）",
      "运输损耗率从 1.2% → 0.3%"
    ],
    riskFlags: [],
    avatar: "👷‍♂️"
  },
  {
    id: "wind_tower_004",
    name: "Dr. Joanna Kowalski",
    title: "欧洲塔筒标准与认证专家",
    country: "波兰",
    company: "Windar Renovables",
    experienceYears: 11,
    education: "Warsaw University of Technology 结构工程博士",
    industry: "wind",
    skills: ["EN 1993-1-1","EN 1090","CE认证","塔筒疲劳","有限元","项目协调"],
    publications: 14,
    patents: 2,
    languages: ["波兰语","英语","德语"],
    highlights: [
      "波兰首个出口英国 Hornsea 项目塔筒认证负责人",
      "协调 5 国团队协作，项目交付准时率 98%",
      "欧盟 R&D 项目 绿色塔筒 技术负责人"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },

  // ============================================================
  // 锂电 — 正极材料 (8人)
  // ============================================================
  {
    id: "libat_cathode_001",
    name: "Dr. Park Ji-hoon",
    title: "固态电池首席研究员",
    country: "韩国",
    company: "Samsung SDI",
    experienceYears: 14,
    education: "KAIST 材料科学与工程博士",
    industry: "lithium",
    skills: ["固态电池","硫化物电解质","界面工程","EIS","XPS","TEM"],
    publications: 48,
    patents: 23,
    languages: ["韩语","英语","日语"],
    highlights: [
      "硫化物全固态电池能量密度突破 450Wh/kg",
      "2024 年 Nature Energy 封面论文第一作者",
      "三星 SDI 固态电池研发团队核心，管理 30+ 人"
    ],
    riskFlags: ["竞业限制严格，需高额签约奖金"],
    avatar: "👨‍🔬"
  },
  {
    id: "libat_cathode_002",
    name: "王思涵",
    title: "磷酸铁锂正极材料研发总监",
    country: "中国",
    company: "德方纳米",
    experienceYears: 12,
    education: "中南大学 冶金工程博士",
    industry: "lithium",
    skills: ["LFP正极","前驱体合成","碳包覆","喷雾干燥","电化学测试","放大生产"],
    publications: 16,
    patents: 11,
    languages: ["中文","英语"],
    highlights: [
      "开发纳米化 LFP 合成工艺，压实密度突破 2.6 g/cm³",
      "主导年产 10 万吨磷酸铁锂产线建设",
      "获 2025 年中国电池行业科技进步一等奖"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_cathode_003",
    name: "Dr. Yuki Tanaka",
    title: "高镍正极材料专家",
    country: "日本",
    company: "Panasonic Energy",
    experienceYears: 13,
    education: "Osaka University 应用化学博士",
    industry: "lithium",
    skills: ["NCM811","NCA","表面包覆","Al掺杂","产气抑制","DSC"],
    publications: 31,
    patents: 18,
    languages: ["日语","英语(工作中)"],
    highlights: [
      "松下 21700 NCA 正极材料主设计，能量密度 720Wh/L",
      "高镍正极产气抑制技术，80°C 存储产气 <0.1mL/Ah",
      "特斯拉 4680 电池正极材料技术顾问"
    ],
    riskFlags: ["日语为主要工作语言"],
    avatar: "👨‍🔬"
  },
  {
    id: "libat_cathode_004",
    name: "陈雅婷",
    title: "富锂锰基正极研发组长",
    country: "中国",
    company: "容百科技",
    experienceYears: 9,
    education: "复旦大学 材料科学博士",
    industry: "lithium",
    skills: ["富锂锰基","电压衰退","表面改性","同步辐射","XAS","原位表征"],
    publications: 22,
    patents: 7,
    languages: ["中文","英语"],
    highlights: [
      "富锂锰基正极 0.5C 循环 500 次容量保持率 92%",
      "电压衰退抑制方案获中国专利金奖",
      "Nature Communications 论文 2 篇"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_cathode_005",
    name: "Dr. Marco Rossi",
    title: "正极材料回收与再生专家",
    country: "意大利",
    company: "Solvay / Veolia",
    experienceYears: 11,
    education: "Politecnico di Milano 化学工程博士",
    industry: "lithium",
    skills: ["正极回收","湿法冶金","锂/钴/镍回收","再生正极","LCA","EU Battery Regulation"],
    publications: 17,
    patents: 6,
    languages: ["意大利语","英语","法语"],
    highlights: [
      "开发 NCM 正极直接再生工艺，性能恢复至 95% 新样水平",
      "EU Battery Regulation 合规顾问",
      "回收成本降低 35% 方案"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },
  {
    id: "libat_cathode_006",
    name: "刘畅",
    title: "正极前驱体工艺工程师",
    country: "中国",
    company: "华友钴业",
    experienceYears: 8,
    education: "中南大学 冶金工程硕士",
    industry: "lithium",
    skills: ["前驱体合成","共沉淀法","粒径控制","振实密度","磁性异物","连续法"],
    publications: 5,
    patents: 9,
    languages: ["中文"],
    highlights: [
      "NCM811 前驱体连续法工艺，振实密度 2.5g/cc",
      "磁性异物控制 <30ppb，达到日韩水平",
      "产能从 5000 吨/年扩至 3 万吨/年"
    ],
    riskFlags: ["海外技术交流经验不足"],
    avatar: "👨‍🔧"
  },
  {
    id: "libat_cathode_007",
    name: "Dr. Amelie Dubois",
    title: "钠离子层状氧化物正极专家",
    country: "法国",
    company: "CEA / Verkor",
    experienceYears: 8,
    education: "Sorbonne Université 材料化学博士",
    industry: "lithium",
    skills: ["钠离子电池","层状氧化物","空气稳定性","Cu/Fe/Mn","电化学","扣式电池"],
    publications: 20,
    patents: 3,
    languages: ["法语","英语"],
    highlights: [
      "空气稳定型钠离子层状正极，放电比容量 145mAh/g",
      "Verkor 钠电示范线正极材料技术负责人",
      "EES (Energy & Environmental Science) 论文 3 篇"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_cathode_008",
    name: "张伟",
    title: "磷酸锰铁锂 (LMFP) 研发经理",
    country: "中国",
    company: "宁德时代 (CATL)",
    experienceYears: 10,
    education: "中国科学院 物理研究所 博士",
    industry: "lithium",
    skills: ["LMFP","碳包覆","能带工程","Jahn-Teller","压实密度","产线放大"],
    publications: 13,
    patents: 15,
    languages: ["中文","英语"],
    highlights: [
      "CATL LMFP 正极材料量产，能量密度比 LFP 提升 20%",
      "通过针刺/过充安全测试，LFP 级安全性",
      "2025 年量产装机 10GWh+"
    ],
    riskFlags: ["CATL 竞业严格，离职需 6 个月脱密期"],
    avatar: "👨‍🔬"
  },

  // ============================================================
  // 锂电 — 负极材料 (6人)
  // ============================================================
  {
    id: "libat_anode_001",
    name: "Dr. Alessandro Rossi",
    title: "锂金属负极与电解液专家",
    country: "意大利",
    company: "24M Technologies",
    experienceYears: 15,
    education: "Università di Bologna 化学博士",
    industry: "lithium",
    skills: ["锂金属负极","电解液配方","SEI膜","半固态电池","电化学表征","手套箱操作"],
    publications: 38,
    patents: 16,
    languages: ["意大利语","英语","法语"],
    highlights: [
      "开发高浓度醚基电解液抑制锂枝晶",
      "半固态电池循环寿命突破 1000 次",
      "MIT 博士后 4 年，与学术界联系紧密"
    ],
    riskFlags: ["欧盟国籍，中国工作签证需要 2-3 个月办理"],
    avatar: "👨‍🔬"
  },
  {
    id: "libat_anode_002",
    name: "赵婷婷",
    title: "硅碳负极研发高级工程师",
    country: "中国",
    company: "贝特瑞",
    experienceYears: 9,
    education: "清华大学 材料学院 博士",
    industry: "lithium",
    skills: ["硅碳负极","纳米硅","预锂化","粘结剂","电解液兼容","扣电/软包测试"],
    publications: 19,
    patents: 8,
    languages: ["中文","英语"],
    highlights: [
      "硅碳负极首效 92%，500 周容量保持率 88%",
      "预锂化工艺量产可行性验证，成本增加 <5%",
      "Advanced Materials 论文 2 篇"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_anode_003",
    name: "Dr. Stefan Müller",
    title: "石墨负极与快充专家",
    country: "德国",
    company: "VARTA",
    experienceYears: 12,
    education: "Universität Ulm 电化学博士",
    industry: "lithium",
    skills: ["人造石墨","液相包覆","快充","SEI形成","DCR","产气分析"],
    publications: 24,
    patents: 9,
    languages: ["德语","英语"],
    highlights: [
      "VARTA 21700 快充负极，10min 充至 80% SOC",
      "液相包覆石墨，DCR 降低 25%",
      "德国储能电池项目负极材料技术负责人"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },
  {
    id: "libat_anode_004",
    name: "吴芳",
    title: "硬碳钠离子电池负极工程师",
    country: "中国",
    company: "中科海钠",
    experienceYears: 7,
    education: "中国科学院 化学研究所 硕士",
    industry: "lithium",
    skills: ["硬碳","生物质碳","钠离子负极","比表面积","首效提升","成本控制"],
    publications: 8,
    patents: 5,
    languages: ["中文"],
    highlights: [
      "硬碳负极首效从 75% → 88%，成本 <2 万元/吨",
      "生物质碳资源化利用，碳排放降低 60%",
      "中科海钠 MWh 级储能项目负极供应负责人"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_anode_005",
    name: "Dr. Naomi Tanaka",
    title: "固态电池负极界面专家",
    country: "日本",
    company: "Toyota Research Institute",
    experienceYears: 10,
    education: "University of Tokyo 电化学博士",
    industry: "lithium",
    skills: ["固态电解质","负极界面","锂铝合金","界面阻抗","XPS","ToF-SIMS"],
    publications: 26,
    patents: 12,
    languages: ["日语","英语"],
    highlights: [
      "丰田固态电池锂离子电导率 25mS/cm 突破",
      "负极/电解质界面阻抗降低 70% 方案",
      "Nature Energy 2025 论文第一作者"
    ],
    riskFlags: ["丰田拥有大量专利，离职后 3 年内不得从事同类研发"],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_anode_006",
    name: "周明",
    title: "负极材料生产放大工艺工程师",
    country: "中国",
    company: "杉杉股份",
    experienceYears: 11,
    education: "湖南大学 化学工程学士",
    industry: "lithium",
    skills: ["石墨化","高温热处理","产线设计","能耗控制","成品率","环保排放"],
    publications: 2,
    patents: 7,
    languages: ["中文"],
    highlights: [
      "负极石墨化炉能耗降低 18%，年节省电费 2000 万+",
      "主持 5 万吨/年负极材料产线建设",
      "通过环保验收（超低排放），零处罚记录"
    ],
    riskFlags: [],
    avatar: "👨‍🔧"
  },

  // ============================================================
  // 锂电 — 电解液 (6人)
  // ============================================================
  {
    id: "libat_electrolyte_001",
    name: "Dr. Sophie Laurent",
    title: "电解液配方与界面化学专家",
    country: "法国",
    company: "Solvay / 24M Technologies",
    experienceYears: 13,
    education: "Sorbonne Université 化学工程博士",
    industry: "lithium",
    skills: ["电解液配方","LiPF6","添加剂","SEI形成","FTIR","Raman"],
    publications: 25,
    patents: 5,
    languages: ["法语","英语"],
    highlights: [
      "开发 FEC+PS 添加剂组合，循环寿命提升 40%",
      "高温存储（60°C）产气降低 65%",
      "EU 电池法规（EU）2023/1542 合规顾问"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_electrolyte_002",
    name: "李浩然",
    title: "电解液生产与质量控制经理",
    country: "中国",
    company: "天赐材料",
    experienceYears: 10,
    education: "华东理工大学 应用化学硕士",
    industry: "lithium",
    skills: ["电解液生产","六氟磷酸锂","水分控制","金属杂质","比能","UL认证"],
    publications: 3,
    patents: 6,
    languages: ["中文","英语(工作中)"],
    highlights: [
      "电解液水分控制 <10ppm，金属杂质 <1ppm",
      "年产 10 万吨电解液产线建设总负责人",
      "获 2024 年中国石油和化学工业联合会科技进步一等奖"
    ],
    riskFlags: [],
    avatar: "👨‍🔧"
  },
  {
    id: "libat_electrolyte_003",
    name: "Dr. Kevin Park",
    title: "固态电解质材料专家",
    country: "韩国",
    company: "LG Energy Solution",
    experienceYears: 11,
    education: "Seoul National University 材料工程博士",
    industry: "lithium",
    skills: ["硫化物电解质","氧化物电解质","离子电导率","界面阻抗","干法工艺","XRD"],
    publications: 32,
    patents: 19,
    languages: ["韩语","英语","中文(基础)"],
    highlights: [
      "LG 硫化物固态电解质离子电导率 18mS/cm",
      "界面包覆层技术，阻抗降低 80%",
      "2025 年韩国电池学会青年科学家奖"
    ],
    riskFlags: ["LG 竞业，离职需 1 年竞业限制"],
    avatar: "👨‍🔬"
  },
  {
    id: "libat_electrolyte_004",
    name: "王佳怡",
    title: "电解液安全添加剂研发工程师",
    country: "中国",
    company: "新宙邦",
    experienceYears: 8,
    education: "大连理工大学 应用化学博士",
    industry: "lithium",
    skills: ["安全添加剂","阻燃","过充保护","DSC","ARC","TGA"],
    publications: 14,
    patents: 7,
    languages: ["中文","英语"],
    highlights: [
      "开发阻燃电解液添加剂，通过 UL 1642 针刺不起火",
      "过充保护添加剂，4.6V 过充无热失控",
      "Advanced Energy Materials 论文 1 篇"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_electrolyte_005",
    name: "Dr. Emma Wilson",
    title: "电池防火与安全电解液专家",
    country: "美国",
    company: "Addionics (前 Tesla)",
    experienceYears: 9,
    education: "Stanford University 材料科学博士",
    industry: "lithium",
    skills: ["热失控","防火电解液","气体分析","ARC","TGA/DSC","安全标准"],
    publications: 21,
    patents: 4,
    languages: ["英语"],
    highlights: [
      "Tesla 4680 电池热失控抑制方案贡献者",
      "防火电解液配方，热失控触发温度提升 40°C",
      "SAE International 电池安全委员会委员"
    ],
    riskFlags: ["美国公民，需申请中国工作许可"],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_electrolyte_006",
    name: "张峰",
    title: "电解液成膜机理研究员",
    country: "中国",
    company: "比亚迪",
    experienceYears: 7,
    education: "中国科学技术大学 化学物理博士",
    industry: "lithium",
    skills: ["SEI膜","原位表征","XPS","ToF-SIMS","电化学质谱"," DFT计算"],
    publications: 18,
    patents: 3,
    languages: ["中文","英语"],
    highlights: [
      "比亚迪刀片电池 SEI 成膜机理解析，首效提升 3%",
      "原位 XPS 电解液界面表征平台搭建",
      "Physical Chemistry Chemical Physics 论文 5 篇"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },

  // ============================================================
  // 锂电 — BMS (6人)
  // ============================================================
  {
    id: "libat_bms_001",
    name: "Dr. Michael Andersson",
    title: "BMS 高级架构师",
    country: "瑞典",
    company: "Northvolt",
    experienceYears: 10,
    education: "Chalmers University 电子工程博士",
    industry: "lithium",
    skills: ["BMS架构","SOC/SOH算法","卡尔曼滤波","功能安全 ISO 26262","AUTOSAR","MATLAB"],
    publications: 12,
    patents: 7,
    languages: ["瑞典语","英语","德语(基础)"],
    highlights: [
      "Northvolt 第三代 BMS 架构主设计师",
      "SOC 估算精度 ±1.5%（行业领先）",
      "通过 ISO 26262 ASIL-D 功能安全认证"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "libat_bms_002",
    name: "周雨桐",
    title: "电池管理系统软件开发总工",
    country: "中国",
    company: "比亚迪",
    experienceYears: 9,
    education: "华中科技大学 软件工程硕士",
    industry: "lithium",
    skills: ["BMS软件","嵌入式C","RTOS","CAN/FlexRay","UDS诊断","OTA升级"],
    publications: 2,
    patents: 8,
    languages: ["中文","英语"],
    highlights: [
      "比亚迪刀片电池 BMS 软件架构师",
      "SOC 估算算法在 -20°C 低温下保持 ≤3% 误差",
      "通过 ASPICE Level 3 认证"
    ],
    riskFlags: [],
    avatar: "👩‍💻"
  },
  {
    id: "libat_bms_003",
    name: "Dr. Luca Bianchi",
    title: "BMS 功能安全与 AWT 专家",
    country: "意大利",
    company: "STMicroelectronics",
    experienceYears: 12,
    education: "Politecnico di Torino 电子工程博士",
    industry: "lithium",
    skills: ["功能安全","ISO 26262","AUTOSAR","ASIL-D","故障注入","HIL测试"],
    publications: 15,
    patents: 5,
    languages: ["意大利语","英语","法语"],
    highlights: [
      "ST BMS 参考设计功能安全负责人，ASIL-D 认证",
      "AUTOSAR BMS 基础软件架构设计",
      "培训 500+ 名汽车行业功能安全工程师"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "libat_bms_004",
    name: "刘洋",
    title: "储能 BMS 与 EMS 集成工程师",
    country: "中国",
    company: "阳光电源",
    experienceYears: 8,
    education: "西安交通大学 控制工程硕士",
    industry: "both",
    skills: ["储能BMS","EMS","PCS","调度策略","AGC/AVC","IEC 61850"],
    publications: 4,
    patents: 6,
    languages: ["中文","英语(工作中)"],
    highlights: [
      "阳光电源 200MW/400MWh 储能 BMS+EMS 总设计",
      "SOC 估算与 EMS 联动，平滑输出波动率 <3%",
      "通过 GB/T 34120 储能 BMS 认证"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "libat_bms_005",
    name: "Dr. Sarah Kim",
    title: "AI 驱动 BMS 算法专家",
    country: "韩国",
    company: "SK On",
    experienceYears: 8,
    education: "KAIST 人工智能博士",
    industry: "lithium",
    skills: ["机器学习BMS","神经网络SOC","深度学习SOH","Python","TensorFlow","数据挖掘"],
    publications: 16,
    patents: 4,
    languages: ["韩语","英语"],
    highlights: [
      "神经网络 SOC 估算，精度 ±1.2%",
      "云端 BMS 数据聚合，电池寿命预测准确率 89%",
      "SK On 新一代 AI-BMS 算法核心开发者"
    ],
    riskFlags: [],
    avatar: "👩‍💻"
  },
  {
    id: "libat_bms_006",
    name: "陈浩",
    title: "BMS 硬件设计工程师",
    country: "中国",
    company: "宁德时代 (CATL)",
    experienceYears: 7,
    education: "电子科技大学 电子工程学士",
    industry: "lithium",
    skills: ["BMS硬件","原理图设计","PCB Layout","AFE芯片","隔离采样","EMC/EMI"],
    publications: 1,
    patents: 5,
    languages: ["中文","英语(基础)"],
    highlights: [
      "CATL 第三代 BMS 硬件平台，支持 800V 高压",
      "AFE 采样精度 ±2mV，通过 AEC-Q100 认证",
      "BMS 硬件成本降低 25%，保持同等性能"
    ],
    riskFlags: ["英语仅基础，不适合海外项目"],
    avatar: "👨‍💻"
  },

  // ============================================================
  // 锂电 — 电芯装备与制造 (6人)
  // ============================================================
  {
    id: "libat_mfg_001",
    name: "山田太郎 (Taro)",
    title: "锂电池极片涂布工艺专家",
    country: "日本",
    company: "Panasonic Energy",
    experienceYears: 22,
    education: "Osaka University 化学工程学士",
    industry: "lithium",
    skills: ["涂布工艺","狭缝模头","干燥控制","NMP回收","面密度均匀性","在线检测"],
    publications: 7,
    patents: 31,
    languages: ["日语"],
    highlights: [
      "松下 4680 电池产线涂布段工艺负责人",
      "面密度变异系数 CV<0.8% 突破",
      "涂布速度 100m/min 稳定量产工艺"
    ],
    riskFlags: ["仅日语沟通，需要翻译支持"],
    avatar: "👨‍🏭"
  },
  {
    id: "libat_mfg_002",
    name: "刘志刚",
    title: "卷绕与叠片工艺经理",
    country: "中国",
    company: "宁德时代 (CATL)",
    experienceYears: 11,
    education: "华南理工大学 机械工程硕士",
    industry: "lithium",
    skills: ["卷绕工艺","叠片工艺","对齐度","极耳焊接","张力控制","CT提速"],
    publications: 4,
    patents: 13,
    languages: ["中文","英语(工作中)"],
    highlights: [
      "CATL 麒麟电池叠片工艺，叠片速度 0.25s/片",
      "对齐度精度 ±0.3mm，直通率 99.2%",
      "卷绕张力自适应控制系统，断带率降低 75%"
    ],
    riskFlags: [],
    avatar: "👨‍🔧"
  },
  {
    id: "libat_mfg_003",
    name: "Dr. Kim Min-jun",
    title: "锂电装备数字化与工业 4.0 专家",
    country: "韩国",
    company: "LG Energy Solution",
    experienceYears: 10,
    education: "KAIST 工业工程博士",
    industry: "lithium",
    skills: ["数字化工厂","MES","工业4.0","数字孪生","OEE","预测性维护"],
    publications: 11,
    patents: 6,
    languages: ["韩语","英语","中文(基础)"],
    highlights: [
      "LG 韩国奥昌工厂数字化双胞胎，OEE 提升至 94%",
      "AI 视觉检测极片缺陷，漏检率 <0.01%",
      "获 2024 年韩国智能制造大奖"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "libat_mfg_004",
    name: "张明",
    title: "锂电装配与注液工艺工程师",
    country: "中国",
    company: "中创新航 (CALB)",
    experienceYears: 9,
    education: "哈尔滨工业大学 机械工程学士",
    industry: "lithium",
    skills: ["装配工艺","注液","真空封装","软包电池","圆柱电池","水分控制"],
    publications: 2,
    patents: 7,
    languages: ["中文"],
    highlights: [
      "中创新航 20GWh 软包电池产线装配工艺负责人",
      "注液量精度 ±0.5g，真空封装漏率 <1e-9 Pa·m³/s",
      "直通率从 93% → 97.8%"
    ],
    riskFlags: [],
    avatar: "👨‍🔧"
  },
  {
    id: "libat_mfg_005",
    name: "Dr. Tom Bauer",
    title: "电池产线 EHS 与合规专家",
    country: "德国",
    company: "VW PowerCo (前 Northvolt)",
    experienceYears: 14,
    education: "TU Bergakademie Freiberg 安全工程博士",
    industry: "lithium",
    skills: ["EHS","危化品管理","VDA 6.3","ISO 45001","环保合规","安全培训"],
    publications: 8,
    patents: 0,
    languages: ["德语","英语","瑞典语(基础)"],
    highlights: [
      "Northvolt Ett 工厂 EHS 体系建设，零重大事故 3 年",
      "VW PowerCo 萨尔茨吉特工厂 EHS 负责人",
      "德国电池联盟（VDA）安全规范编制组成员"
    ],
    riskFlags: [],
    avatar: "👨‍💼"
  },
  {
    id: "libat_mfg_006",
    name: "李婷",
    title: "电池化成与分容工艺工程师",
    country: "中国",
    company: "亿纬锂能",
    experienceYears: 8,
    education: "天津大学 电化学硕士",
    industry: "lithium",
    skills: ["化成工艺","分容","容量筛选","DCIR","循化测试","产线效率"],
    publications: 3,
    patents: 4,
    languages: ["中文","英语(基础)"],
    highlights: [
      "化成时间从 48h → 18h，能耗降低 62%",
      "分容精度 ±0.5%，满足高端储能电池要求",
      "年产能 10GWh 产线化成容量一体化工序设计"
    ],
    riskFlags: [],
    avatar: "👩‍🔧"
  },

  // ============================================================
  // 锂电 — 电池回收 (4人)
  // ============================================================
  {
    id: "libat_recycle_001",
    name: "Dr. Sophie Laurent",
    title: "电池回收与循环经济专家",
    country: "法国",
    company: "Veolia / Solvay",
    experienceYears: 13,
    education: "Sorbonne Université 化学工程博士",
    industry: "lithium",
    skills: ["电池回收","湿法冶金","锂回收率","LCA","EU电池法规","零废弃"],
    publications: 25,
    patents: 5,
    languages: ["法语","英语"],
    highlights: [
      "开发 Li/Ni/Co/Mn 四元回收工艺，综合回收率 >95%",
      "欧盟新电池法规 (EU) 2023/1542 合规顾问",
      "主持 Horizon Europe BATRAW 项目子课题"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_recycle_002",
    name: "王建国",
    title: "动力电池回收产线工艺总监",
    country: "中国",
    company: "格林美",
    experienceYears: 15,
    education: "北京科技大学 冶金工程硕士",
    industry: "lithium",
    skills: ["湿法回收","火法回收","梯次利用","破碎分选","萃取","环保处理"],
    publications: 8,
    patents: 14,
    languages: ["中文"],
    highlights: [
      "格林美 10 万吨/年动力电池回收产线总设计师",
      "锂回收率突破 92%，镍钴回收率 >98%",
      "梯次利用储能系统已装机 200MWh+"
    ],
    riskFlags: ["英语仅限于阅读文献，不适合国际交流"],
    avatar: "👨‍🔧"
  },
  {
    id: "libat_recycle_003",
    name: "Dr. Hans-Peter Klein",
    title: "欧盟电池护照与数字护照专家",
    country: "德国",
    company: "Accure (前 BMZ Group)",
    experienceYears: 10,
    education: "RWTH Aachen 可持续发展工程博士",
    industry: "lithium",
    skills: ["电池护照","数字护照","碳足迹","EU Battery Regulation","区块链技术","数据透明"],
    publications: 13,
    patents: 2,
    languages: ["德语","英语"],
    highlights: [
      "欧盟电池护照（Battery Passport）技术规范核心起草人",
      "碳足迹声明合规方案，通过 DNV 验证",
      "德国 ZSW 合作项目，电池全生命周期追溯系统"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },
  {
    id: "libat_recycle_004",
    name: "张思远",
    title: "梯次利用与储能系统集成工程师",
    country: "中国",
    company: "中国铁塔",
    experienceYears: 9,
    education: "华北电力大学 电力系统硕士",
    industry: "both",
    skills: ["梯次利用","储能系统","基站备电","SOH评估","系统安全","标准制定"],
    publications: 6,
    patents: 8,
    languages: ["中文","英语(基础)"],
    highlights: [
      "中国铁塔 50 万+ 组梯次利用电池基站备电项目",
      "SOH 快速评估（<5 分钟），准确率 91%",
      "主编《通信基站梯次利用电池技术规范》"
    ],
    riskFlags: [],
    avatar: "👨‍💼"
  },

  // ============================================================
  // 锂电 — 钠电与新兴技术 (4人)
  // ============================================================
  {
    id: "libat_emerging_001",
    name: "Dr. Rachel Green",
    title: "钠离子电池研发组长",
    country: "美国",
    company: "Natron Energy",
    experienceYears: 9,
    education: "Stanford University 材料科学博士",
    industry: "lithium",
    skills: ["钠离子电池","普鲁士蓝","水系电解液","低成本储能","XRD","SEM"],
    publications: 29,
    patents: 6,
    languages: ["英语"],
    highlights: [
      "Natron 普鲁士蓝钠离子电池商业化核心推动者",
      "水系钠电循环寿命 >50,000 次",
      "Nature Materials、Joule 等顶刊发表多篇论文"
    ],
    riskFlags: ["美国公民，需申请中国工作许可"],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_emerging_002",
    name: "胡明",
    title: "钠离子电池量产工艺经理",
    country: "中国",
    company: "中科海钠",
    experienceYears: 10,
    education: "中国科学院 化学研究所 博士",
    industry: "lithium",
    skills: ["钠电量产","层状氧化物","硬碳负极","产线设计","成本控制","安全测试"],
    publications: 11,
    patents: 9,
    languages: ["中文","英语"],
    highlights: [
      "中科海钠 1GWh 钠电池产线建设总负责人",
      "钠电池成本 <0.4 元/Wh，比 LFP 低 30%+",
      "通过 GB/T 36276 储能电池安全认证"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },
  {
    id: "libat_emerging_003",
    name: "Dr. Emma Johansson",
    title: "固态电池量产工艺研究员",
    country: "瑞典",
    company: "Northvolt (前 Chalmers)",
    experienceYears: 8,
    education: "Chalmers University of Technology 材料科学博士",
    industry: "lithium",
    skills: ["固态电池","干法电极","薄膜沉积","界面工程","产线设计","成本分析"],
    publications: 18,
    patents: 3,
    languages: ["瑞典语","英语"],
    highlights: [
      "Northvolt 固态电池中试线（100MWh/年）工艺设计",
      "干法电极工艺，能耗降低 40%，无 NMP 排放",
      "EU Innovation Fund 固态电池项目技术负责人"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "libat_emerging_004",
    name: "李文博",
    title: "水系锂离子电池研发工程师",
    country: "中国",
    company: "比亚迪",
    experienceYears: 7,
    education: "武汉大学 化学学院 博士",
    industry: "lithium",
    skills: ["水系锂电池","阻燃电解液","安全电池","低成本","大规模储能","UL认证"],
    publications: 15,
    patents: 5,
    languages: ["中文","英语"],
    highlights: [
      "水系锂电池能量密度突破 150Wh/kg，通过针刺不起火",
      "大规模储能应用场景安全性显著优于有机电解液体系",
      "Advanced Science 论文 1 篇"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },

  // ============================================================
  // 锂电 — Pack 与系统集成 (6人)
  // ============================================================
  {
    id: "libat_pack_001",
    name: "刘畅",
    title: "模组 Pack 结构设计经理",
    country: "中国",
    company: "宁德时代 (CATL)",
    experienceYears: 8,
    education: "西安交通大学 机械工程硕士",
    industry: "lithium",
    skills: ["电池包设计","热管理","CATIA","ANSYS Mechanical","IP67密封","轻量化"],
    publications: 4,
    patents: 14,
    languages: ["中文","英语"],
    highlights: [
      "CTP 3.0 麒麟电池 Pack 结构核心设计师",
      "实现体积成组效率 72%（全球最高）",
      "Pack 级别通过 GB 38031 针刺不起火不爆炸"
    ],
    riskFlags: ["毕业仅 8 年，海外项目管理经验不足"],
    avatar: "👨‍🔧"
  },
  {
    id: "libat_pack_002",
    name: "Dr. Ingrid Hanssen",
    title: "储能系统集成技术总监",
    country: "挪威",
    company: "Equinor / Northvolt",
    experienceYears: 12,
    education: "Norwegian University of Science and Technology 电力工程博士",
    industry: "both",
    skills: ["储能系统","PCS变流器","EMS系统","调频调峰","电网接入","大储/工商业储"],
    publications: 16,
    patents: 5,
    languages: ["挪威语","英语","丹麦语(基础)"],
    highlights: [
      "挪威 200MWh 储能电站总设计师",
      "参与编制挪威储能并网技术规范",
      "储能系统循环效率 89%（行业平均 85%）"
    ],
    riskFlags: [],
    avatar: "👩‍💻"
  },
  {
    id: "libat_pack_003",
    name: "陈浩宇",
    title: "储能系统集成技术总监",
    country: "中国",
    company: "阳光电源",
    experienceYears: 16,
    education: "浙江大学 电力电子博士",
    industry: "both",
    skills: ["储能系统","PCS变流器","EMS系统","调频调峰","电网接入","大储/工商业储"],
    publications: 20,
    patents: 18,
    languages: ["中文","英语"],
    highlights: [
      "阳光电源 200MW/400MWh 储能电站总设计师",
      "参与编制国家标准 GB/T 36547/34120",
      "储能系统循环效率 89%（行业平均 85%）"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "libat_pack_004",
    name: "Dr. James Liu",
    title: "高压电池包安全与热管理专家",
    country: "美国",
    company: "Tesla",
    experienceYears: 11,
    education: "UC Berkeley 机械工程博士",
    industry: "lithium",
    skills: ["热管理","液冷板","热失控蔓延","Fire Wall","800V","模组集成"],
    publications: 23,
    patents: 11,
    languages: ["英语","中文(基础)"],
    highlights: [
      "Tesla 4680 结构电池包热管理系统主设计",
      "热失控蔓延抑制时间 >30min，超过国标要求",
      "液冷板流道优化，泵功降低 35%"
    ],
    riskFlags: ["美国公民，Tesla 竞业限制严格"],
    avatar: "👨‍🔬"
  },
  {
    id: "libat_pack_005",
    name: "赵敏",
    title: "储能集装箱与安全设计工程师",
    country: "中国",
    company: "科华数据",
    experienceYears: 9,
    education: "上海交通大学 电气工程硕士",
    industry: "both",
    skills: ["集装箱储能","消防系统","HVAC","烟气排烟","NFPA 855","GB 51048"],
    publications: 3,
    patents: 7,
    languages: ["中文","英语(工作中)"],
    highlights: [
      "科华 40ft 集装箱储能安全设计，通过 UL 9540A",
      "消防系统联动策略，热失控预警时间 >15min",
      "主编《集装箱式储能系统安全设计规范》企业标准"
    ],
    riskFlags: [],
    avatar: "👩‍💼"
  },
  {
    id: "libat_pack_006",
    name: "Dr. Antonio Silva",
    title: "南美储能市场与系统集装专家",
    country: "巴西",
    company: "WEG (前 BYD Brasil)",
    experienceYears: 10,
    education: "Universidade de São Paulo 电力系统博士",
    industry: "both",
    skills: ["储能系统","南美电网","PCS","并网规范","葡萄牙语","本地化服务"],
    publications: 9,
    patents: 2,
    languages: ["葡萄牙语","西班牙语","英语"],
    highlights: [
      "巴西首个 100MWh 储能项目系统集成负责人",
      "南美电网频率波动下的储能控制策略",
      "WEG 储能业务技术总监"
    ],
    riskFlags: [],
    avatar: "👨‍💼"
  },

  // ============================================================
  // 风储协同 / 跨领域 (8人)
  // ============================================================
  {
    id: "both_001",
    name: "Dr. Ingrid Hanssen",
    title: "风储协同控制与并网专家",
    country: "挪威",
    company: "Equinor / SINTEF",
    experienceYears: 13,
    education: "Norwegian University of Science and Technology 电力工程博士",
    industry: "both",
    skills: ["风储协同","一次调频","AGC/AVC","储能控制","MATLAB","实时仿真","并网规范"],
    publications: 28,
    patents: 6,
    languages: ["挪威语","英语"],
    highlights: [
      "风储联合一次调频控制策略，通过挪威国家电网验收",
      "SINTEF 风储实验室负责人",
      "IEEE PES 会员，多个 CIGRE 工作组成员"
    ],
    riskFlags: [],
    avatar: "👩‍🔬"
  },
  {
    id: "both_002",
    name: "陈浩宇",
    title: "新能源并网与储能系统集成专家",
    country: "中国",
    company: "阳光电源",
    experienceYears: 16,
    education: "浙江大学 电力电子博士",
    industry: "both",
    skills: ["储能系统","PCS变流器","EMS系统","风储协同","电网接入","GB/T 36547"],
    publications: 22,
    patents: 20,
    languages: ["中文","英语"],
    highlights: [
      "风储协同控制策略，平滑风电出力波动率 <5%",
      "参与编制国家标准 GB/T 36547/34120",
      "储能系统循环效率 89%（行业平均 85%）"
    ],
    riskFlags: [],
    avatar: "👨‍💻"
  },
  {
    id: "both_003",
    name: "Dr. Emma Watson",
    title: "可再生能源与储能市场设计专家",
    country: "英国",
    company: "Carbon Trust",
    experienceYears: 12,
    education: "University of Oxford 能源政策博士",
    industry: "both",
    skills: ["电力市场","辅助服务","容量市场","储能套利","政策和监管","数据分析"],
    publications: 19,
    patents: 0,
    languages: ["英语","法语(基础)"],
    highlights: [
      "英国容量市场储能收益模型，预测精度 92%",
      "为 5GW+ 可再生能源项目提供市场进入策略",
      "Nature Energy 政策论坛文章 3 篇"
    ],
    riskFlags: [],
    avatar: "👩‍💼"
  },
  {
    id: "both_004",
    name: "刘云鹏",
    title: "风电制氢与储能耦合系统工程师",
    country: "中国",
    company: "隆基氢能",
    experienceYears: 10,
    education: "华北电力大学 电力系统博士",
    industry: "both",
    skills: ["风电制氢","碱槽","PEM电解","储能缓冲","能量管理","HSSE"],
    publications: 14,
    patents: 8,
    languages: ["中文","英语(工作中)"],
    highlights: [
      "国内首个风电制氢+储能耦合示范项目（100MW 风机+20MW 电解）总工程师",
      "系统运行效率 58kWh/kg H2，行业领先",
      "参与编制《可再生能源制氢技术导则》"
    ],
    riskFlags: [],
    avatar: "👨‍💼"
  },
  {
    id: "both_005",
    name: "Dr. Lars Eriksen",
    title: "北欧电力市场与储能经济师",
    country: "挪威",
    company: "Statkraft",
    experienceYears: 11,
    education: "Norwegian School of Economics 能源经济博士",
    industry: "both",
    skills: ["电力市场","Nord Pool","储能套利","水风储协同","Python","金融建模"],
    publications: 17,
    patents: 0,
    languages: ["挪威语","英语","瑞典语"],
    highlights: [
      "Statkraft 水风储协同优化策略，收益提升 22%",
      "Nord Pool 日前市场 + 储能套利算法",
      "Energy Economics 论文 5 篇"
    ],
    riskFlags: [],
    avatar: "👨‍💼"
  },
  {
    id: "both_006",
    name: "张雨桐",
    title: "微网与分布储能系统设计师",
    country: "中国",
    company: "华为数字能源",
    experienceYears: 8,
    education: "清华大学 电气工程硕士",
    industry: "both",
    skills: ["微网","分布式储能","孤岛运行","PV+储能","EMS","IEC 61727"],
    publications: 7,
    patents: 9,
    languages: ["中文","英语"],
    highlights: [
      "华为智能光伏+储能微网系统，覆盖 30+ 国",
      "孤岛运行模式无缝切换，切换时间 <20ms",
      "通过 IEC 62116 防孤岛保护认证"
    ],
    riskFlags: [],
    avatar: "👩‍💻"
  },
  {
    id: "both_007",
    name: "Dr. Carlos Fernandes",
    title: "热带可再生能源与储能耦合专家",
    country: "巴西",
    company: "Petrobras (新能源部)",
    experienceYears: 14,
    education: "Universidade de São Paulo 机械工程博士",
    industry: "both",
    skills: ["风电","储能","热带气候","电池退化","系统寿命","LCOE"],
    publications: 21,
    patents: 3,
    languages: ["葡萄牙语","英语","西班牙语"],
    highlights: [
      "巴西北部 300MW 风电+100MW/200MWh 储能项目设计",
      "热带高温高湿环境下电池寿命预测模型",
      "Petrobras 能源转型技术顾问"
    ],
    riskFlags: [],
    avatar: "👨‍🔬"
  },
  {
    id: "both_008",
    name: "王鹏飞",
    title: "源网荷储一体化系统架构师",
    country: "中国",
    company: "国家电网中国电科院",
    experienceYears: 12,
    education: "清华大学 电力系统博士",
    industry: "both",
    skills: ["源网荷储","虚拟电厂","调度控制","电力市场","AGC/AVC","SVG"],
    publications: 18,
    patents: 10,
    languages: ["中文","英语"],
    highlights: [
      "国电投 500MW 源网荷储一体化示范项目总架构师",
      "虚拟电厂调度控制策略，响应时间 <200ms",
      "参与编制《源网荷储一体化技术规范》能源行业标准"
    ],
    riskFlags: ["国家电网编制内人员，离职难度较大"],
    avatar: "👨‍💼"
  },
]

// ============================================================
// 搜索函数
// ============================================================
/**
 * 根据搜索关键词 + 行业过滤匹配人才
 */
export function searchTalent(
  query: string,
  industry?: "wind" | "lithium" | "both"
): TalentProfile[] {
  const q = query.toLowerCase()
  const keywords = q.split(/[\s,，+]+/).filter(k => k.length > 0)

  const score = (profile: TalentProfile): number => {
    let s = 0
    const searchText = [
      profile.name,
      profile.title,
      profile.company,
      profile.education,
      ...profile.skills,
      ...profile.highlights,
    ].join(" ").toLowerCase()

    for (const kw of keywords) {
      // 博士 / PhD
      if (kw === "博士" || kw === "phd" || kw === "dr.") {
        if (profile.education.includes("博士") || profile.education.includes("PhD") || profile.education.includes("Dr.")) s += 25
        continue
      }
      // 海外 / 国际
      if (kw === "海外" || kw === "国际" || kw === "global" || kw === "foreign") {
        if (profile.country !== "中国") s += 18
        if (profile.languages.length > 1) s += 6
        continue
      }
      // 总监 / 主任
      if (kw === "总监" || kw === "director" || kw === "head" || kw === "chief" || kw === "负责人" || kw === "总工" || kw === "首席") {
        if (/总监|总|首席|Chief|Director|Head|Principal/i.test(profile.title)) s += 22
        continue
      }
      // 经理
      if (kw === "经理" || kw === "manager") {
        if (profile.title.includes("经理") || profile.title.includes("Manager")) s += 16
        continue
      }
      // 博士（关键词不含"博士"时，看教育背景）
      // 年数搜索：如"10年"、"10+年"
      const yearMatch = kw.match(/^(\d+)\+?年/)
      if (yearMatch) {
        const targetYears = parseInt(yearMatch[1])
        if (profile.experienceYears >= targetYears) s += 12
        continue
      }
      // 国家搜索
      if (profile.country.includes(kw) || profile.country === kw) s += 20
      // 普通关键词
      if (searchText.includes(kw)) s += 10
      // 姓名匹配（最高权重）
      if (profile.name.toLowerCase().includes(kw)) s += 35
      // 技能精确匹配
      for (const skill of profile.skills) {
        if (skill.toLowerCase().includes(kw)) s += 8
      }
    }

    // 行业过滤
    if (industry && industry !== "both" && profile.industry !== industry && profile.industry !== "both") {
      s = -1000
    }

    // 资深过滤
    if ((q.includes("资深") || q.includes("senior")) && profile.experienceYears < 10) {
      s = Math.max(s - 20, 0)
    }

    return s
  }

  return TALENT_DATABASE
    .map(p => ({ profile: p, score: score(p) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map(({ profile }) => profile)
}

// ============================================================
// 按 ID 获取人才
// ============================================================
export function getTalentById(id: string): TalentProfile | undefined {
  return TALENT_DATABASE.find(p => p.id === id)
}

// ============================================================
// 按姓名获取人才
// ============================================================
export function getTalentByName(name: string): TalentProfile | undefined {
  return TALENT_DATABASE.find(p => p.name === name)
}
