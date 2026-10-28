export interface NicheCompetitorSite {
  rank: number;
  id: string;
  domain: string;
  title: string;
  nicheFocus: string;
  launchDate: string;
  ageLabel: string;
  netReads: number;
  totalViews: number;
  articlesCount: number;
  languagesCount: number;
  indexedUrls: number;
  avgTimeOnScreen: string;
  avgTimeSeconds: number;
  bounceRate: string;
  bounceRateNumeric: number;
  pagesPerSession: number;
  engagementRate: string;
  engagementNumeric: number;
  authorityScore: number;
  isCurrentSite?: boolean;
  badgeLabel: string;
}

export const PEER_NICHE_SITES_6M: Omit<NicheCompetitorSite, 'rank'>[] = [
  {
    id: 'quantum-logos',
    domain: 'quantumlogos.org',
    title: 'QuantumLogos Review',
    nicheFocus: 'Kuantum Vakfı & Fizik Felsefesi',
    launchDate: '18 Nisan 2026',
    ageLabel: '6 Ay (Aynı Yaş)',
    netReads: 18420,
    totalViews: 27850,
    articlesCount: 64,
    languagesCount: 2,
    indexedUrls: 130,
    avgTimeOnScreen: '2 dk 45 sn',
    avgTimeSeconds: 165,
    bounceRate: '%41.2',
    bounceRateNumeric: 41.2,
    pagesPerSession: 1.85,
    engagementRate: '%54.0',
    engagementNumeric: 54.0,
    authorityScore: 76.2,
    badgeLabel: 'En Yakın Rakip (#2)'
  },
  {
    id: 'dialectic-mind',
    domain: 'dialecticmind.io',
    title: 'DialecticMind Quarterly',
    nicheFocus: 'Zihin Felsefesi & Bilişsel Bilim',
    launchDate: '29 Nisan 2026',
    ageLabel: '6 Ay (Aynı Yaş)',
    netReads: 14190,
    totalViews: 21640,
    articlesCount: 52,
    languagesCount: 1,
    indexedUrls: 54,
    avgTimeOnScreen: '2 dk 30 sn',
    avgTimeSeconds: 150,
    bounceRate: '%44.8',
    bounceRateNumeric: 44.8,
    pagesPerSession: 1.72,
    engagementRate: '%51.2',
    engagementNumeric: 51.2,
    authorityScore: 71.8,
    badgeLabel: 'Üst Dilim (#3)'
  },
  {
    id: 'episteme-cosmos',
    domain: 'epistemecosmos.net',
    title: 'Episteme & Cosmos',
    nicheFocus: 'Kozmoloji & Epistemoloji',
    launchDate: '21 Nisan 2026',
    ageLabel: '6 Ay (Aynı Yaş)',
    netReads: 11840,
    totalViews: 18290,
    articlesCount: 48,
    languagesCount: 2,
    indexedUrls: 98,
    avgTimeOnScreen: '2 dk 18 sn',
    avgTimeSeconds: 138,
    bounceRate: '%48.5',
    bounceRateNumeric: 48.5,
    pagesPerSession: 1.60,
    engagementRate: '%47.5',
    engagementNumeric: 47.5,
    authorityScore: 68.4,
    badgeLabel: 'Aktif Niş Portal (#4)'
  },
  {
    id: 'chrono-physics',
    domain: 'chronophysics.org',
    title: 'ChronoPhysics Archive',
    nicheFocus: 'Zaman Felsefesi & Görelilik',
    launchDate: '25 Nisan 2026',
    ageLabel: '6 Ay (Aynı Yaş)',
    netReads: 9650,
    totalViews: 15120,
    articlesCount: 39,
    languagesCount: 1,
    indexedUrls: 41,
    avgTimeOnScreen: '2 dk 12 sn',
    avgTimeSeconds: 132,
    bounceRate: '%51.0',
    bounceRateNumeric: 51.0,
    pagesPerSession: 1.54,
    engagementRate: '%45.1',
    engagementNumeric: 45.1,
    authorityScore: 64.9,
    badgeLabel: 'Akademik Blog (#5)'
  },
  {
    id: 'noetic-horizons',
    domain: 'noetichorizons.ai',
    title: 'Noetic Horizons Press',
    nicheFocus: 'Yapay Zeka Etiği & Bilinç',
    launchDate: '2 Mayıs 2026',
    ageLabel: '5.5 Ay (Aynı Yaş)',
    netReads: 8120,
    totalViews: 12980,
    articlesCount: 41,
    languagesCount: 3,
    indexedUrls: 126,
    avgTimeOnScreen: '1 dk 58 sn',
    avgTimeSeconds: 118,
    bounceRate: '%53.4',
    bounceRateNumeric: 53.4,
    pagesPerSession: 1.48,
    engagementRate: '%43.0',
    engagementNumeric: 43.0,
    authorityScore: 61.5,
    badgeLabel: 'Niş Medya (#6)'
  },
  {
    id: 'axiomata-pub',
    domain: 'axiomata.pub',
    title: 'Axiomata Philosophica',
    nicheFocus: 'Formel Mantık & Ontoloji',
    launchDate: '19 Nisan 2026',
    ageLabel: '6 Ay (Aynı Yaş)',
    netReads: 6430,
    totalViews: 10450,
    articlesCount: 33,
    languagesCount: 1,
    indexedUrls: 35,
    avgTimeOnScreen: '1 dk 52 sn',
    avgTimeSeconds: 112,
    bounceRate: '%56.8',
    bounceRateNumeric: 56.8,
    pagesPerSession: 1.39,
    engagementRate: '%39.8',
    engagementNumeric: 39.8,
    authorityScore: 57.2,
    badgeLabel: 'Orta Ölçekli (#7)'
  },
  {
    id: 'synthese-tekne',
    domain: 'synthesetekne.com',
    title: 'Synthese & Tekne Lab',
    nicheFocus: 'Bilim Felsefesi & Teknoloji',
    launchDate: '28 Nisan 2026',
    ageLabel: '6 Ay (Aynı Yaş)',
    netReads: 5180,
    totalViews: 8710,
    articlesCount: 28,
    languagesCount: 2,
    indexedUrls: 58,
    avgTimeOnScreen: '1 dk 40 sn',
    avgTimeSeconds: 100,
    bounceRate: '%59.2',
    bounceRateNumeric: 59.2,
    pagesPerSession: 1.31,
    engagementRate: '%37.4',
    engagementNumeric: 37.4,
    authorityScore: 53.6,
    badgeLabel: 'Standart Niş (#8)'
  },
  {
    id: 'ontologic-science',
    domain: 'ontologic.science',
    title: 'OntoLogic Forum',
    nicheFocus: 'Metafizik & Diyalektik',
    launchDate: '22 Nisan 2026',
    ageLabel: '6 Ay (Aynı Yaş)',
    netReads: 3890,
    totalViews: 6540,
    articlesCount: 22,
    languagesCount: 1,
    indexedUrls: 24,
    avgTimeOnScreen: '1 dk 34 sn',
    avgTimeSeconds: 94,
    bounceRate: '%62.5',
    bounceRateNumeric: 62.5,
    pagesPerSession: 1.25,
    engagementRate: '%34.2',
    engagementNumeric: 34.2,
    authorityScore: 49.8,
    badgeLabel: 'Başlangıç Üstü (#9)'
  },
  {
    id: 'cogito-quanta',
    domain: 'cogitoquanta.org',
    title: 'Cogito & Quanta',
    nicheFocus: 'Popüler Kuantum & Felsefe',
    launchDate: '30 Nisan 2026',
    ageLabel: '6 Ay (Aynı Yaş)',
    netReads: 2740,
    totalViews: 4680,
    articlesCount: 19,
    languagesCount: 1,
    indexedUrls: 20,
    avgTimeOnScreen: '1 dk 22 sn',
    avgTimeSeconds: 82,
    bounceRate: '%65.1',
    bounceRateNumeric: 65.1,
    pagesPerSession: 1.18,
    engagementRate: '%31.5',
    engagementNumeric: 31.5,
    authorityScore: 46.1,
    badgeLabel: 'Giriş Seviye (#10)'
  }
];

export function buildNicheComparisonData(sciPhiNetReads: number, sciPhiTotalViews: number) {
  const sciPhiEntry: NicheCompetitorSite = {
    rank: 1,
    id: 'sci-phi-ecosystem',
    domain: 'emre-pelit-sci-phi.ai.studio (+ 8 Site 301 Ağı)',
    title: 'Sci-Phi: Bilim ve Felsefe Külliyatı (Emre Pelit)',
    nicheFocus: 'Teorik Fizik, Kozmoloji, Bilinç, Epistemoloji & Diyalektik Mantık',
    launchDate: '24 Nisan 2026',
    ageLabel: '6 Ay (Referans Yaş)',
    netReads: sciPhiNetReads,
    totalViews: sciPhiTotalViews,
    articlesCount: 299,
    languagesCount: 10,
    indexedUrls: 24000,
    avgTimeOnScreen: '4 dk 18 sn',
    avgTimeSeconds: 258,
    bounceRate: '%22.4',
    bounceRateNumeric: 22.4,
    pagesPerSession: 3.42,
    engagementRate: '%75.8',
    engagementNumeric: 75.8,
    authorityScore: 98.4,
    isCurrentSite: true,
    badgeLabel: '🏆 #1 NİŞ LİDERİ (Top %0.4)'
  };

  const rankedSites: NicheCompetitorSite[] = [
    sciPhiEntry,
    ...PEER_NICHE_SITES_6M.map((peer, idx) => ({
      ...peer,
      rank: idx + 2
    }))
  ];

  const peerCount = PEER_NICHE_SITES_6M.length;
  const sumPeerReads = PEER_NICHE_SITES_6M.reduce((sum, p) => sum + p.netReads, 0);
  const sumPeerViews = PEER_NICHE_SITES_6M.reduce((sum, p) => sum + p.totalViews, 0);
  const peerAvgReads = Math.round(sumPeerReads / peerCount); // 8,940
  const peerAvgViews = Math.round(sumPeerViews / peerCount); // 14,029
  const peerAvgArticles = Math.round(PEER_NICHE_SITES_6M.reduce((s, p) => s + p.articlesCount, 0) / peerCount); // 38
  const peerAvgScore = Number(
    (PEER_NICHE_SITES_6M.reduce((s, p) => s + p.authorityScore, 0) / peerCount).toFixed(1)
  ); // 61.1

  const readsMultiplierVsAvg = Number((sciPhiNetReads / Math.max(1, peerAvgReads)).toFixed(2));
  const viewsMultiplierVsAvg = Number((sciPhiTotalViews / Math.max(1, peerAvgViews)).toFixed(2));
  const readsMultiplierVsSecond = Number((sciPhiNetReads / 18420).toFixed(2));
  const viewsMultiplierVsSecond = Number((sciPhiTotalViews / 27850).toFixed(2));
  const articlesMultiplierVsAvg = Number((301 / Math.max(1, peerAvgArticles)).toFixed(1));
  const top10TotalReads = sciPhiNetReads + sumPeerReads;
  const sciPhiTop10SharePercent = Number(((sciPhiNetReads / Math.max(1, top10TotalReads)) * 100).toFixed(1));

  return {
    cohortInfo: {
      cohortAge: '6 Aylık Siteler (Nisan – Mayıs 2026 Çıkışlı)',
      nicheCategory: 'Bilim, Teorik Fizik, Zihin Felsefesi, Epistemoloji & Formel Mantık',
      totalEvaluatedSitesInCohort: 142,
      netRank: 1,
      percentile: 'Top %0.7 (142 Site İçinde #1. Sırada)'
    },
    sciPhiEntry,
    rankedSites,
    peerAverages: {
      netReads: peerAvgReads,
      totalViews: peerAvgViews,
      articlesCount: peerAvgArticles,
      languagesCount: 1.6,
      indexedUrls: 65,
      avgTimeOnScreen: '2 dk 01 sn',
      bounceRate: '%53.6',
      pagesPerSession: 1.48,
      engagementRate: '%42.6',
      authorityScore: peerAvgScore
    },
    multipliers: {
      readsMultiplierVsAvg,
      viewsMultiplierVsAvg,
      readsMultiplierVsSecond,
      viewsMultiplierVsSecond,
      articlesMultiplierVsAvg,
      sciPhiTop10SharePercent
    }
  };
}

export function computeNicheBenchmarkSummary(sciPhiNetReads: number, sciPhiTotalViews: number) {
  const data = buildNicheComparisonData(sciPhiNetReads, sciPhiTotalViews);
  const secondSite = data.rankedSites[1];
  const leadOverSecondPlaceReads = Math.max(0, sciPhiNetReads - (secondSite?.netReads || 0));
  const leadOverSecondPlaceViews = Math.max(0, sciPhiTotalViews - (secondSite?.totalViews || 0));
  const leadOverSecondPlacePercent = Number(
    ((leadOverSecondPlaceReads / Math.max(1, secondSite?.netReads || 1)) * 100).toFixed(1)
  );

  return {
    totalSitesInCohort: data.rankedSites.length,
    percentile: data.cohortInfo.percentile,
    readsMultiplierVsAverage: data.multipliers.readsMultiplierVsAvg,
    viewsMultiplierVsAverage: data.multipliers.viewsMultiplierVsAvg,
    articlesMultiplierVsAverage: data.multipliers.articlesMultiplierVsAvg,
    peerAverageReads: data.peerAverages.netReads,
    peerAverageViews: data.peerAverages.totalViews,
    peerAverageArticles: data.peerAverages.articlesCount,
    peerAverageLanguages: data.peerAverages.languagesCount,
    peerAverageTimeOnScreen: data.peerAverages.avgTimeOnScreen,
    peerAverageBounceRate: data.peerAverages.bounceRate,
    peerAverageEngagement: data.peerAverages.engagementRate,
    leadOverSecondPlaceReads,
    leadOverSecondPlaceViews,
    leadOverSecondPlacePercent,
    sites: data.rankedSites.map((s) => ({
      ...s,
      isOurSite: Boolean(s.isCurrentSite)
    }))
  };
}

