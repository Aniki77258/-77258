// ============================================================
// i18n Type Definitions
// ============================================================

export type Language = 'zh' | 'en'

export interface TranslationDict {
  // Common
  common: {
    loading: string
    save: string
    cancel: string
    confirm: string
    delete: string
    edit: string
    search: string
    filter: string
    reset: string
    back: string
    close: string
    submit: string
    send: string
    copy: string
    copied: string
    view: string
    preview: string
    export: string
    retry: string
    refresh: string
    noData: string
    all: string
    today: string
    yesterday: string
    justNow: string
    minutesAgo: string
    hoursAgo: string
    daysAgo: string
  }

  // Navigation
  nav: {
    dashboard: string
    talentSearch: string
    talentSearchPage: string
    candidates: string
    companies: string
    jobs: string
    invitations: string
    interviews: string
    assessments: string
    negotiations: string
    offers: string
    notifications: string
    messages: string
    aiAssistant: string
    emailTemplates: string
    adminPanel: string
    verification: string
    reports: string
    stats: string
    auditLogs: string
    searches: string
    settings: string
    logout: string
    pricing: string
    subscription: string
  }

  // Public pages
  home: {
    title: string
    subtitle: string
    heroTitle: string
    heroSubtitle: string
    getStarted: string
    learnMore: string
    moduleTalentSearch: string
    moduleTalentSearchDesc: string
    moduleInterview: string
    moduleInterviewDesc: string
    moduleAssessment: string
    moduleAssessmentDesc: string
    moduleNegotiation: string
    moduleNegotiationDesc: string
    moduleOffer: string
    moduleOfferDesc: string
    moduleAnalytics: string
    moduleAnalyticsDesc: string
    footer: string
  }

  // Auth
  auth: {
    login: string
    register: string
    email: string
    password: string
    name: string
    loginButton: string
    registerButton: string
    noAccount: string
    hasAccount: string
    registerNow: string
    loginNow: string
    enterpriseHR: string
    candidate: string
    admin: string
    headhunter: string
    expert: string
    role: string
    selectRole: string
    companyName: string
    phone: string
    step1: string
    step2: string
    basicInfo: string
    companyInfo: string
    registerSuccess: string
    loginSuccess: string
    invalidCredentials: string
  }

  // Dashboard
  dashboard: {
    ceoDashboard: string
    totalCandidates: string
    activeJobs: string
    pendingReviews: string
    offersThisMonth: string
    talentDistribution: string
    recruitmentPipeline: string
    riskAlerts: string
    aiInsights: string
    recentActivities: string
    demoData: string
    wan: string
    newToday: string
    verifiedCandidates: string
    totalCompanies: string
    activeHeadhunters: string
    invitationConversion: string
    offerConversion: string
    coreMetrics: string
    globalTalentRadar: string
    countryDistribution: string
    trendCharts: string
    globalTalentGrowth: string
    companyActivity: string
    leaderboards: string
    hotCountries: string
    hotSkills: string
    avgCandidateScore: string
    recruitmentFunnel: string
    skillDistribution: string
    skillRadar: string
    activityFeed: string
    dbRealtime: string
    aiRadarScore: string
    noActivities: string
    viewDetail: string
    viewAnalysis: string
    reload: string
    loading: string
    loadError: string
    fallbackDemo: string
  }

  // Candidates
  candidates: {
    title: string
    searchPlaceholder: string
    filters: string
    country: string
    region: string
    industry: string
    experience: string
    education: string
    skills: string
    verified: string
    notVerified: string
    availableNow: string
    willingRelocate: string
    languages: string
    expectedSalary: string
    undisclosed: string
    sendInvitation: string
    backToList: string
    educationBackground: string
    publications: string
    patents: string
    contactInfo: string
    notFound: string
    years: string
    windEnergy: string
    lithiumBattery: string
    windStorage: string
  }

  // Companies
  companies: {
    title: string
    demoData: string
    noData: string
    loadError: string
    website: string
    unknownSize: string
    industry: string
    location: string
    size: string
  }

  // Jobs
  jobs: {
    title: string
    recruiting: string
    closed: string
    salary: string
    location: string
    type: string
    posted: string
    noData: string
  }

  // Interviews
  interviews: {
    title: string
    type: string
    status: string
    date: string
    time: string
    timezone: string
    candidateTimezone: string
    companyTimezone: string
    timeConversion: string
    localTime: string
    candidateTime: string
    companyTime: string
    duration: string
    location: string
    interviewer: string
    statusPending: string
    statusConfirmed: string
    statusCompleted: string
    statusCancelled: string
    statusRescheduled: string
    typeTechnical: string
    typeHR: string
    typeFinal: string
    typeOnline: string
    typeOnsite: string
    selectTimezone: string
    createInterview: string
    reschedule: string
  }

  // Assessments
  assessments: {
    title: string
    score: string
    status: string
    recommend: string
    stronglyRecommend: string
    neutral: string
    notRecommend: string
    pending: string
    completed: string
    inProgress: string
    strengths: string
    improvements: string
    suggestion: string
    industry: string
    candidate: string
    evaluate: string
  }

  // Negotiations
  negotiations: {
    title: string
    status: string
    salary: string
    currency: string
    baseSalary: string
    bonus: string
    equity: string
    benefits: string
    statusNegotiating: string
    statusAgreed: string
    statusRejected: string
    statusOnHold: string
    exchangeRateNote: string
  }

  // Offers
  offers: {
    title: string
    status: string
    salary: string
    currency: string
    statusDraft: string
    statusSent: string
    statusAccepted: string
    statusRejected: string
    statusExpired: string
    createOffer: string
    viewOffer: string
    exchangeRateNote: string
  }

  // Pricing
  pricing: {
    title: string
    subtitle: string
    currency: string
    monthly: string
    yearly: string
    perMonth: string
    planBasic: string
    planPro: string
    planEnterprise: string
    features: string
    exchangeRateNote: string
    contactSales: string
  }

  // Notifications
  notifications: {
    title: string
    markAllRead: string
    markRead: string
    markUnread: string
    showRead: string
    hideRead: string
    deleteNotification: string
    filterByType: string
    noNotifications: string
    types: {
      all: string
      system: string
      invitation: string
      interview: string
      assessment: string
      negotiation: string
      offer: string
      review: string
      risk_alert: string
    }
  }

  // Messages
  messages: {
    title: string
    searchPlaceholder: string
    noConversations: string
    noMessages: string
    reply: string
    replyPlaceholder: string
    sendMessage: string
    tapToView: string
    backToList: string
    conversationWith: string
    roles: {
      company: string
      candidate: string
      headhunter: string
      admin: string
      user: string
      enterpriseHR: string
      headhunterConsultant: string
      platformAdmin: string
    }
  }

  // Email Templates
  emailTemplates: {
    title: string
    subtitle: string
    preview: string
    simulateSend: string
    sendSuccess: string
    sendFailed: string
    backToList: string
    copyBody: string
    variables: string
    noSelection: string
    integrationGuide: string
    integrationTitle: string
    providerResend: string
    providerSendGrid: string
    providerSMTP: string
    labels: {
      invitation: string
      interview_confirm: string
      interview_reschedule: string
      offer: string
      review_pass: string
      review_reject: string
    }
    descriptions: {
      invitation: string
      interview_confirm: string
      interview_reschedule: string
      offer: string
      review_pass: string
      review_reject: string
    }
  }

  // AI Assistant
  ai: {
    title: string
    subtitle: string
    talentRecommend: string
    talentRecommendDesc: string
    invitationText: string
    invitationTextDesc: string
    interviewQuestions: string
    interviewQuestionsDesc: string
    assessmentReport: string
    assessmentReportDesc: string
    salarySuggest: string
    salarySuggestDesc: string
    riskAlert: string
    riskAlertDesc: string
    disclaimer: string
    safetyNote: string
    generatedBy: string
    mockLabel: string
  }

  // Settings
  settings: {
    title: string
    profile: string
    privacy: string
    notifications: string
    language: string
    languageLabel: string
    languageZh: string
    languageEn: string
    saveSettings: string
    settingsSaved: string
  }

  // Admin
  admin: {
    title: string
    verification: string
    reports: string
    stats: string
    auditLogs: string
    approve: string
    reject: string
    pending: string
    approved: string
    rejected: string
    candidates: string
    platformStats: string
    userGrowth: string
    monthlyActive: string
    totalUsers: string
    commerce: string
    orders: string
    actions: {
      create: string
      update: string
      delete: string
      view: string
      export: string
      login: string
      logout: string
    }
  }

  // Compliance
  compliance: {
    title: string
    notice: string
    usageDisclaimer: string
    discriminationWarning: string
  }

  // Country/Region
  region: {
    remote: string
    hybrid: string
    onsite: string
    visaSupported: string
    visaNotSupported: string
    visaUnknown: string
  }

  // Currency
  currency: {
    usd: string
    eur: string
    cny: string
    sgd: string
    label: string
  }

  // Work types
  workType: {
    fullTime: string
    partTime: string
    contract: string
    internship: string
  }

  // Misc
  misc: {
    processFlow: string
    website: string
    copyright: string
    allRightsReserved: string
    backToHome: string
  }

  // SaaS / Commerce
  saas: {
    subscription: string
    currentPlan: string
    upgradePlan: string
    quotaUsage: string
    usageHistory: string
    orderHistory: string
    invoiceInfo: string
    monthlyRevenue: string
    totalSubscribers: string
    totalOrders: string
    totalRefunds: string
    planBreakdown: string
    revenueTrend: string
    serviceFees: string
    orderList: string
    orderDetail: string
    paymentSimulation: string
    paymentSuccess: string
    paymentFailed: string
    paymentMethod: string
    payNow: string
    confirmUpgrade: string
  }
}
