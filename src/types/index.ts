export interface MathFormula {
  title: string;
  latex: string;
  interpretation: string;
  domain: string;
}

export interface DialecticalTriad {
  thesis: string;
  thesisEn?: string;
  antithesis: string;
  antithesisEn?: string;
  synthesis: string;
  synthesisEn?: string;
}

export interface PhilosophicalObjection {
  id: string;
  philosopher: string;
  school: string;
  objection: string;
  rebuttal: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  category: 'fizik-kozmoloji' | 'zihin-bilinc' | 'epistemoloji' | 'diyalektik-mantik' | 'etik-teknoloji';
  categoryTitle: string;
  categoryTitleEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
  tags: string[];
  mathFormulations?: MathFormula[];
  dialecticalTriad?: DialecticalTriad;
  objections?: PhilosophicalObjection[];
  socraticQuestions: string[];
  bloggerUrl?: string;
}

export interface GrokMeVerifiedMetrics {
  domain: string;
  portal_title: string;
  articles_count: number;
  readership_start_date: string;
  analytics_start_date: string;
  backup_record_date: string;
  total_net_reads: number;
  total_views: number;
  avg_time_on_screen: string;
  bounce_rate: string;
  pages_per_session: number;
  engagement_rate: string;
  verified_reads_breakdown: {
    blogger_post_reads: number;
    article_bottom_reads: number;
    website_direct_reads: number;
    grok_app_reads: number;
    github_pages_reads: number;
    sci_phil_ai_studio_reads?: number;
    emre_pelit_sci_phi_reads?: number;
    ai_studio_reads: number;
  };
  verified_views_breakdown: {
    blogger_views: number;
    website_views: number;
    github_pages_views: number;
    sci_phil_ai_studio_views?: number;
    emre_pelit_sci_phi_views?: number;
    ai_studio_views: number;
  };
}

export interface EcoWebsiteMetric {
  id: string;
  domain: string;
  title: string;
  role: string;
  status: 'active' | 'redirect_301' | 'synced' | 'archive';
  statusLabel: string;
  launchDate?: string;
  baseReads?: number;
  baseViews?: number;
  last24hReads?: number;
  last24hViews?: number;
  netReads: number;
  pageViews: number;
  baseListeningMinutes?: number;
  last24hListeningMinutes?: number;
  listeningMinutes?: number;
  listeningFormatted?: string;
  listeningSessions?: number;
  avgListeningTime?: string;
  uniqueVisitors?: number;
  totalSessions?: number;
  totalReadingMinutes?: number;
  totalReadingFormatted?: string;
  simulatorInteractions?: number;
  avgTimeOnScreen: string;
  bounceRate: string;
  pagesPerSession: number;
  engagementRate: string;
  articlesCount?: number;
  trafficSharePercent: number;
  url: string;
  sourceOriginUrl?: string;
  canonicalTarget?: string;
  redirectCode?: number;
  redirectBridgeUrl?: string;
  authorityTransfer?: string;
  notes: string;
}

export interface BaselineMetrics {
  blogger_post_reads_baseline: number;
  blogger_page_views_baseline: number;
  website_web_reads_baseline: number;
  website_app_reads_baseline: number;
  website_page_views_baseline: number;
  article_bottom_reads_baseline: number;
  sci_phil_ai_studio_net_read_baseline?: number;
  sci_phil_ai_studio_page_views_baseline?: number;
  emre_pelit_sci_phi_net_read_baseline?: number;
  emre_pelit_sci_phi_page_views_baseline?: number;
  github_pages_net_read_baseline: number;
  github_pages_page_views_baseline: number;
  ai_studio_net_read_baseline: number;
  ai_studio_page_views_baseline: number;
  total_net_reads_baseline: number;
  total_views_baseline: number;
  verified_baseline_reads?: number;
  verified_baseline_views?: number;
  source: string;
  backup_record_date: string;
  measurement_start_date: string;
  description: string;
  last_updated: string;
  grok_me?: GrokMeVerifiedMetrics;
  all_websites?: EcoWebsiteMetric[];
}

export interface IndexNowEngineInfo {
  name: string;
  status: string;
}

export interface IndexNowSummary {
  lastPingAt: string;
  totalSites: number;
  articlesPerSite: number;
  urlsPerSite: number;
  languagesCount?: number;
  languages?: string[];
  urlsPerSiteAllLanguages?: number;
  totalUrlsIndexed: number;
  totalFilesIndexed: number;
  browsersIndexed?: string[];
  status: string;
  searchEnginesNotified: IndexNowEngineInfo[];
}

export interface ArticleSiteReads {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  category: string;
  categoryTitle: string;
  totalReads: number;
  totalViews: number;
  bySite: Record<string, number>;
  viewsBySite: Record<string, number>;
}

export interface HourlyDataPoint {
  hour: string;
  reads: number;
  views: number;
  activeVisitors: number;
}

export interface Last24HoursMetrics {
  totalReads24h: number;
  totalViews24h: number;
  uniqueVisitors24h: number;
  avgTimeOnScreen24h: string;
  bounceRate24h: string;
  hourlyTrends: HourlyDataPoint[];
  topArticles24h: { slug: string; title: string; category: string; reads: number; views: number }[];
  sources24h: { name: string; reads: number; views: number; percent: number }[];
  browserDistribution: { name: string; percent: number; count: number }[];
  countryDistribution: { name: string; code: string; views: number; percent: number }[];
}

export interface LiveStatsSummary {
  baseline: BaselineMetrics;
  live: {
    activeVisitors: number;
    todayViews: number;
    todayReads: number;
    baselineReads?: number;
    baselineViews?: number;
    last24hReadsAdded?: number;
    last24hViewsAdded?: number;
    cumulativeTotalReads: number;
    cumulativeTotalViews: number;
    lastSyncAt?: string;
    topCountries: { code: string; name: string; views: number; percent: number }[];
    sources: { name: string; reads: number; views: number; percent: number }[];
    websites: EcoWebsiteMetric[];
    recentEvents: { type: string; details: string; timestamp: string }[];
  };
  indexNow?: IndexNowSummary;
  articleReadsBySite?: ArticleSiteReads[];
  last24Hours?: Last24HoursMetrics;
  growthProjections?: GrowthProjectionsData;
}

export interface GrowthProjectionHorizon {
  periodKey: '30d' | '90d' | '180d' | '365d';
  label: string;
  days: number;
  dailyReadsRate: number;
  dailyViewsRate: number;
  addedReads: number;
  addedViews: number;
  projectedCumulativeReads: number;
  projectedCumulativeViews: number;
  growthMultiplier: string;
  searchImpressions: number;
  indexedLanguagesActive: number;
}

export interface LanguageGrowthProjection {
  code: string;
  name: string;
  flag: string;
  indexedUrls: number;
  globalSearchSharePercent: number;
  trafficSharePercent: number;
  currentDailyReads: number;
  projected30dReads: number;
  projected90dReads: number;
  projected180dReads: number;
  projected365dReads: number;
  projected365dViews: number;
  primarySearchEngines: string;
}

export interface GrowthScenarioProjection {
  id: 'conservative' | 'expected' | 'accelerated';
  title: string;
  subtitle: string;
  compoundMonthlyRate: string;
  languageMultiplier: number;
  horizons: GrowthProjectionHorizon[];
}

export interface GrowthProjectionsData {
  generatedAt: string;
  architectureSummary: {
    totalSites: number;
    articlesCount: number;
    languagesCount: number;
    totalIndexedUrls: number;
    currentCumulativeReads: number;
    currentCumulativeViews: number;
    currentDailyReadsVelocity: number;
    currentDailyViewsVelocity: number;
  };
  scenarios: GrowthScenarioProjection[];
  byLanguage: LanguageGrowthProjection[];
}
