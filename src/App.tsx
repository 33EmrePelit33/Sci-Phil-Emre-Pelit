import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import {
  Sparkles,
  Cpu,
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  Compass,
  Atom,
  BrainCircuit,
  Scale,
  LayoutGrid,
  ListTree,
  Table2,
  Mail,
  Globe,
  Linkedin,
  MessageSquareWarning,
  GraduationCap,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { Header } from './components/Header';
import { SyncStatusBanner } from './components/SyncStatusBanner';
import { ArticleCard } from './components/ArticleCard';
import { ArticleIllustration } from './components/ArticleIllustration';
import { ArticleView } from './components/ArticleView';
import { ArticleObjectionQA } from './components/ArticleObjectionQA';
import { AuthorProfileModal } from './components/AuthorProfileModal';
import { SearchModal } from './components/SearchModal';
import { StatsDashboard } from './components/StatsDashboard';
import { AutomationPanel } from './components/AutomationPanel';
import { BlockUniverseSimulator } from './components/interactive/BlockUniverseSimulator';
import { ChineseRoomSimulator } from './components/interactive/ChineseRoomSimulator';
import { FallacyInspector } from './components/interactive/FallacyInspector';
import { SocraticDialogueArena } from './components/interactive/SocraticDialogueArena';
import { KnowledgeGraphView } from './components/interactive/KnowledgeGraphView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { LanguageSelectorModal } from './components/LanguageSelector';
import { InviteOutreachModal } from './components/InviteOutreachModal';
import { GoogleIndexModal } from './components/GoogleIndexModal';
import { PromotionSuite } from './components/PromotionSuite';
import { ARTICLES, CATEGORIES } from './data/articles';
import { DETAILED_TAXONOMY, resolveArticleSubcategory } from './utils/taxonomy';
import {
  INITIAL_LIVE_SUMMARY,
  computeCumulativeTotals,
  computeArticleReadsBySite,
  getSavedSitesWatermark,
  saveSitesWatermark
} from './data/baselineStats';
import {
  getArticleScholarlyIdentifiers,
  generateFormattedCitations,
  tsScholar
} from './utils/scholarlyIndexing';
import {
  SUPPORTED_LANGUAGES,
  getTranslatedArticle,
  getTranslatedCategoryTitle,
  getTranslatedSubcategoryTitle,
  translateArticlesBatch,
  subscribeToTranslationUpdates,
  t
} from './utils/translations';
import { useWholeSiteTranslation } from './utils/siteTranslator';
import {
  speakArticleContent,
  speakEntireVisiblePage,
  switchActiveSpeechLanguage
} from './utils/speechEngine';
import { LiveStatsSummary, ArticleSiteReads, Article } from './types';
import {
  AUTHOR_PROFILE,
  isAuthorShieldActive,
  setAuthorShieldActive,
  isRunningAsInstalledApp,
  shouldExcludeClientRead
} from './utils/authorShield';

const OFFLINE_QUEUE_KEY = 'sciphi_offline_event_queue_v1';
const CACHED_LIVE_STATS_KEY = 'sciphi_cached_live_stats_v5';
const UI_STATE_STORAGE_KEY = 'sciphi_ui_state_v1';

interface SavedUiState {
  currentTab?: string;
  selectedCategory?: string;
  selectedSubcategory?: string;
  catalogViewMode?: 'grid' | 'grouped' | 'compact';
  catalogSort?: 'default' | 'reads_desc' | 'title_asc';
  activeSimulator?: 'block-universe' | 'chinese-room' | 'fallacy-inspector' | 'socratic-arena' | 'knowledge-graph';
  catalogSearch?: string;
  selectedArticleSlug?: string | null;
}

function loadSavedUiState(): SavedUiState {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(UI_STATE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

interface QueuedAnalyticsEvent {
  id: string;
  type: string;
  details: string;
  siteId?: string;
  articleSlug?: string;
  source?: string;
  isInstalledApp: boolean;
  timestamp: string;
}

export default function App() {
  const initialUi = useMemo(() => loadSavedUiState(), []);

  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const urlTab = p.get('tab');
      if (urlTab && ['articles', 'simulators', 'stats', 'automation'].includes(urlTab)) {
        return urlTab;
      }
    }
    return initialUi.currentTab || 'articles';
  });
  const [authorShieldActive, setAuthorShieldActiveState] = useState<boolean>(() => isAuthorShieldActive());
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const match =
      window.location.pathname.match(/^\/(?:tr|en|de|fr|es|it|ru|ar|zh|ja)\/makale\/([^/]+)\/?$/i) ||
      window.location.pathname.match(/^\/makale\/([^/]+)\/?$/);
    if (match) return decodeURIComponent(match[1]);
    const p = new URLSearchParams(window.location.search);
    const art = p.get('article') || p.get('makale');
    if (art) return decodeURIComponent(art);
    return initialUi.selectedArticleSlug || null;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>(() => initialUi.selectedCategory || 'all');
  const [lang, setLang] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const urlLang = p.get('lang');
      if (urlLang && SUPPORTED_LANGUAGES.some((l) => l.code === urlLang)) {
        return urlLang;
      }
      const pathLang = window.location.pathname.match(/^\/(tr|en|de|fr|es|it|ru|ar|zh|ja)(?:\/|$)/i);
      if (pathLang) {
        return pathLang[1].toLowerCase();
      }
    }
    return localStorage.getItem('sciphi_lang') || 'tr';
  });
  const [translationTick, setTranslationTick] = useState<number>(0);
  const [isAuthorOpen, setIsAuthorOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState<boolean>(false);
  const [isInviteOpen, setIsInviteOpen] = useState<boolean>(false);
  const [isGoogleIndexOpen, setIsGoogleIndexOpen] = useState<boolean>(false);
  const [activeObjectionArticle, setActiveObjectionArticle] = useState<Article | null>(null);
  const [googleIndexStatus, setGoogleIndexStatus] = useState<{
    indexedCount: number;
    totalCount: number;
    isRunning: boolean;
  }>({ indexedCount: 3160, totalCount: 3160, isRunning: false });
  const [activeSimulator, setActiveSimulator] = useState<
    'block-universe' | 'chinese-room' | 'fallacy-inspector' | 'socratic-arena' | 'knowledge-graph'
  >(() => initialUi.activeSimulator || 'block-universe');
  const [catalogSearch, setCatalogSearch] = useState<string>(() => initialUi.catalogSearch || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(() => initialUi.selectedSubcategory || 'all');
  const [catalogViewMode, setCatalogViewMode] = useState<'grid' | 'grouped' | 'compact'>(
    () => initialUi.catalogViewMode || 'grid'
  );
  const [catalogSort, setCatalogSort] = useState<'default' | 'reads_desc' | 'title_asc'>(
    () => initialUi.catalogSort || 'default'
  );
  const [visibleCount, setVisibleCount] = useState<number>(500);
  const [showAllSinglePage, setShowAllSinglePage] = useState<boolean>(true);
  const [liveArticles, setLiveArticles] = useState<Article[]>(() => ARTICLES);
  const [bloggerPostsCount, setBloggerPostsCount] = useState<number>(() => ARTICLES.length);
  const [theme, setTheme] = useState<'dark' | 'paper'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('sciphi_theme_mode') as 'dark' | 'paper') || 'dark';
  });
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [expandAllCards, setExpandAllCards] = useState<boolean>(false);
  const [showFeaturedCitation, setShowFeaturedCitation] = useState<boolean>(false);
  const [showTaxonomyCards, setShowTaxonomyCards] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('sciphi_theme_mode', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 360);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'paper' : 'dark'));
  }, []);

  const [showHomeStatsPanel, setShowHomeStatsPanel] = useState<boolean>(true);

  // Katalog ve sekme kaydırma konumunu hafızada tutarak her güncellemede sayfanın başa dönmesini engelle
  const catalogScrollYRef = useRef<number>(0);
  const currentViewScrollKey = `${currentTab}:${selectedArticleSlug || 'main'}`;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // UI durumunu sessionStorage'a kaydet (güncellemelerde mevcut sekme, kategori ve görünüm korunsun)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const payload: SavedUiState = {
        currentTab,
        selectedCategory,
        selectedSubcategory,
        catalogViewMode,
        catalogSort,
        activeSimulator,
        catalogSearch,
        selectedArticleSlug
      };
      sessionStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [
    currentTab,
    selectedCategory,
    selectedSubcategory,
    catalogViewMode,
    catalogSort,
    activeSimulator,
    catalogSearch,
    selectedArticleSlug
  ]);

  // Kullanıcının mevcut kaydırma (scroll) konumunu kesintisiz kaydet ve sayfa yenilendiğinde/güncellendiğinde koru
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storageKey = `sciphi_scroll_${currentViewScrollKey}`;
    try {
      const savedY = Number(sessionStorage.getItem(storageKey));
      if (!Number.isNaN(savedY) && savedY > 0) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: savedY, behavior: 'instant' as ScrollBehavior });
        });
      }
    } catch {
      // ignore
    }

    let rafId: number | null = null;
    const handleScrollSave = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        try {
          sessionStorage.setItem(storageKey, String(Math.round(window.scrollY)));
          if (!selectedArticleSlug && currentTab === 'articles') {
            catalogScrollYRef.current = Math.round(window.scrollY);
          }
        } catch {
          // ignore
        }
      });
    };

    window.addEventListener('scroll', handleScrollSave, { passive: true });
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScrollSave);
    };
  }, [currentViewScrollKey, selectedArticleSlug, currentTab]);

  const [liveStats, setLiveStats] = useState<LiveStatsSummary>(() => {
    try {
      const cached = localStorage.getItem(CACHED_LIVE_STATS_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.baseline && parsed.live) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_LIVE_SUMMARY;
  });

  const [offlineQueue, setOfflineQueue] = useState<QueuedAnalyticsEvent[]>(() => {
    try {
      const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const { isSiteTranslating } = useWholeSiteTranslation(
    lang,
    `${currentTab}:${selectedArticleSlug || ''}:${activeSimulator}:${isAuthorOpen}:${isInviteOpen}:${isSearchOpen}:${isLanguageOpen}:${catalogViewMode}:${showTaxonomyCards}:${selectedCategory}:${selectedSubcategory}`
  );

  useEffect(() => {
    return subscribeToTranslationUpdates(() => {
      setTranslationTick((v) => v + 1);
    });
  }, []);

  // Dil değiştiğinde HTML lang/dir özniteliklerini ve localStorage'ı güncelle
  useEffect(() => {
    localStorage.setItem('sciphi_lang', lang);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = langObj?.dir || 'ltr';
  }, [lang]);

  const syncBloggerCatalog = useCallback(async (force = false) => {
    try {
      const res = await fetch(force ? '/api/blogger/live-catalog?force=1' : '/api/blogger/live-catalog');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.articles) && data.articles.length > 0) {
          setLiveArticles((prev) => {
            const next: Article[] = data.articles;
            // Katalog içeriği değişmediyse mevcut referansı koru (sayfa yapısının zıplamasını ve yeniden render'ı önler)
            if (
              !force &&
              prev.length === next.length &&
              prev[0]?.id === next[0]?.id &&
              prev[0]?.title === next[0]?.title &&
              prev[prev.length - 1]?.id === next[next.length - 1]?.id
            ) {
              return prev;
            }
            return next;
          });
        }
        if (typeof data?.bloggerPostsCount === 'number') {
          setBloggerPostsCount((prev) => (prev === data.bloggerPostsCount ? prev : data.bloggerPostsCount));
        }
      }
    } catch {
      // Çevrimdışı durumda mevcut makale kataloğu korunur
    }
  }, []);

  const applyServerSummary = useCallback((data: any) => {
    const resolved = data?.summary ? data.summary : data;
    if (resolved && resolved.baseline && resolved.live) {
      setLiveStats((prev) => {
        const prevSitesMap = new Map(
          (prev?.live?.websites || []).map((s) => [s.id, s])
        );
        const wm = getSavedSitesWatermark();
        let needsServerWatermarkPush = false;
        const nextWatermark: Record<string, { reads: number; views: number; listeningMinutes?: number; simulatorInteractions?: number }> = { ...wm };

        const mergedWebsites = (resolved.live.websites || []).map((s: any) => {
          const prevSite = prevSitesMap.get(s.id);
          const wmSite = wm[s.id];
          const baseR = Number(s.baseReads) || 0;
          const baseV = Number(s.baseViews) || 0;
          const serverLiveR = Number(s.last24hReads) || 0;
          const serverLiveV = Number(s.last24hViews) || 0;
          const prevLiveR = Number(prevSite?.last24hReads) || 0;
          const prevLiveV = Number(prevSite?.last24hViews) || 0;
          const wmLiveR = Number(wmSite?.reads) || 0;
          const wmLiveV = Number(wmSite?.views) || 0;

          const liveR = Math.max(serverLiveR, prevLiveR, wmLiveR);
          const liveV = Math.max(serverLiveV, prevLiveV, wmLiveV);

          if (liveR > serverLiveR || liveV > serverLiveV) {
            needsServerWatermarkPush = true;
          }

          const netReads = Math.max(baseR + liveR, Number(s.netReads) || 0, Number(prevSite?.netReads) || 0);
          const pageViews = Math.max(baseV + liveV, Number(s.pageViews) || 0, Number(prevSite?.pageViews) || 0);
          const listeningMinutes = Math.max(
            Number(s.listeningMinutes) || 0,
            Number(prevSite?.listeningMinutes) || 0
          );
          const listeningSessions = Math.max(
            Number(s.listeningSessions) || 0,
            Number(prevSite?.listeningSessions) || 0
          );
          const uniqueVisitors = Math.max(
            Number(s.uniqueVisitors) || 0,
            Number(prevSite?.uniqueVisitors) || 0
          );
          const totalSessions = Math.max(
            Number(s.totalSessions) || 0,
            Number(prevSite?.totalSessions) || 0
          );
          const totalReadingMinutes = Math.max(
            Number(s.totalReadingMinutes) || 0,
            Number(prevSite?.totalReadingMinutes) || 0
          );
          const simulatorInteractions = Math.max(
            Number(s.simulatorInteractions) || 0,
            Number(prevSite?.simulatorInteractions) || 0
          );

          nextWatermark[s.id] = {
            reads: liveR,
            views: liveV
          };

          return {
            ...s,
            baseReads: baseR,
            baseViews: baseV,
            last24hReads: liveR,
            last24hViews: liveV,
            netReads,
            pageViews,
            listeningMinutes,
            listeningSessions,
            uniqueVisitors,
            totalSessions,
            totalReadingMinutes,
            simulatorInteractions
          };
        });

        saveSitesWatermark(nextWatermark);

        if (needsServerWatermarkPush) {
          fetch('/api/analytics/sync-watermark', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deltasBySite: nextWatermark })
          }).catch(() => {});
        }

        const sumNetReads = mergedWebsites.reduce((acc: number, s: any) => acc + s.netReads, 0);
        const sumPageViews = mergedWebsites.reduce((acc: number, s: any) => acc + s.pageViews, 0);
        const sumLiveReads = mergedWebsites.reduce((acc: number, s: any) => acc + s.last24hReads, 0);
        const sumLiveViews = mergedWebsites.reduce((acc: number, s: any) => acc + s.last24hViews, 0);
        const sumListeningMins = mergedWebsites.reduce((acc: number, s: any) => acc + s.listeningMinutes, 0);
        const sumListeningSessions = mergedWebsites.reduce((acc: number, s: any) => acc + s.listeningSessions, 0);
        const sumUniqueVisitors = mergedWebsites.reduce((acc: number, s: any) => acc + s.uniqueVisitors, 0);
        const sumTotalSessions = mergedWebsites.reduce((acc: number, s: any) => acc + s.totalSessions, 0);
        const sumReadingMins = mergedWebsites.reduce((acc: number, s: any) => acc + s.totalReadingMinutes, 0);
        const sumSimInteractions = mergedWebsites.reduce((acc: number, s: any) => acc + s.simulatorInteractions, 0);

        const nextSummary: LiveStatsSummary = {
          ...resolved,
          live: {
            ...resolved.live,
            netReads: sumNetReads,
            pageViews: sumPageViews,
            liveReadsAdded: sumLiveReads,
            liveViewsAdded: sumLiveViews,
            totalListeningMinutes: sumListeningMins,
            totalListeningSessions: sumListeningSessions,
            totalUniqueVisitors: sumUniqueVisitors,
            totalSessions: sumTotalSessions,
            totalReadingMinutes: sumReadingMins,
            totalSimulatorInteractions: sumSimInteractions,
            websites: mergedWebsites
          }
        };

        try {
          localStorage.setItem(CACHED_LIVE_STATS_KEY, JSON.stringify(nextSummary));
        } catch {
          // ignore quota errors
        }
        return nextSummary;
      });

      if (typeof resolved?.bloggerSync?.bloggerPostsCount === 'number') {
        const nextCount = resolved.bloggerSync.bloggerPostsCount;
        setBloggerPostsCount((prev) => (prev === nextCount ? prev : nextCount));
      }
    }
  }, []);

  const refreshLiveStats = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics/sites-summary');
      if (res.ok) {
        const data = await res.json();
        applyServerSummary(data);
      }
    } catch {
      // Çevrimdışı durumda mevcut state korunur
    }
  }, [applyServerSummary]);

  const handleFullSyncRefresh = useCallback(async () => {
    await Promise.all([syncBloggerCatalog(true), refreshLiveStats()]);
  }, [syncBloggerCatalog, refreshLiveStats]);

  const flushOfflineEvents = useCallback(async () => {
    let queue: QueuedAnalyticsEvent[] = [];
    try {
      const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
      queue = raw ? JSON.parse(raw) : [];
    } catch {
      queue = [];
    }
    if (!Array.isArray(queue) || queue.length === 0) return;

    try {
      const res = await fetch('/api/events/sync-offline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: queue })
      });
      if (res.ok) {
        localStorage.removeItem(OFFLINE_QUEUE_KEY);
        setOfflineQueue([]);
        const data = await res.json();
        applyServerSummary(data);
      }
    } catch {
      // İnternet bağlantısı gelince tekrar denenecek
    }
  }, [applyServerSummary]);

  // Sayfa veya İndirilen Uygulama (PWA) ilk açıldığında görüntüleme kaydı gönder ve kaldığı yerden devam et
  useEffect(() => {
    const isInstalledApp = isRunningAsInstalledApp();
    const excludeAuthor = shouldExcludeClientRead(authorShieldActive);
    const sourceSite = 'emre-pelit-sci-phi';
    const clientWatermark = getSavedSitesWatermark();

    fetch('/api/analytics/record-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Author-Shield': excludeAuthor ? 'true' : 'false'
      },
      body: JSON.stringify({
        source: sourceSite,
        isInstalledApp,
        isAuthor: excludeAuthor,
        authorShieldActive: excludeAuthor,
        authorEmail: excludeAuthor ? AUTHOR_PROFILE.email : undefined,
        deltasBySite: clientWatermark
      })
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) applyServerSummary(data);
      })
      .catch(() => {
        if (!excludeAuthor) {
          const visitEvent: QueuedAnalyticsEvent = {
            id: `visit-${Date.now()}`,
            type: isInstalledApp ? 'pwa_app_view' : 'page_view',
            details: isInstalledApp
              ? 'İndirilen Uygulama (PWA) çevrimdışı açılış görüntülemesi'
              : 'Web çevrimdışı sayfa görüntülemesi',
            siteId: sourceSite,
            source: sourceSite,
            isInstalledApp,
            timestamp: new Date().toISOString()
          };
          try {
            const existing = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
            const updated = [...existing, visitEvent];
            localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updated));
            setOfflineQueue(updated);
          } catch {
            // ignore
          }
        }
      });
  }, [applyServerSummary, authorShieldActive]);

  const hasTriggeredInitialIndexNowRef = useRef<boolean>(false);

  useEffect(() => {
    flushOfflineEvents();
    refreshLiveStats();
    syncBloggerCatalog(false);
    if (!hasTriggeredInitialIndexNowRef.current) {
      hasTriggeredInitialIndexNowRef.current = true;
      fetch('/api/indexnow/ping-all', { method: 'POST' }).catch(() => {});
    }
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/analytics/stream');
      es.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          applyServerSummary(parsed);
        } catch {
          // ignore malformed event
        }
      };
    } catch {
      // Fallback to polling if EventSource unavailable
    }

    const interval = setInterval(refreshLiveStats, 5000);
    const bloggerSyncInterval = setInterval(() => syncBloggerCatalog(false), 30000);
    const handleSync = () => {
      flushOfflineEvents();
      refreshLiveStats();
      syncBloggerCatalog(false);
    };
    window.addEventListener('online', handleSync);
    window.addEventListener('focus', handleSync);
    window.addEventListener('storage', handleSync);
    window.addEventListener('sciphi:analytics-updated', handleSync);
    window.addEventListener('sciphi:pwa-installed', handleSync);
    return () => {
      if (es) es.close();
      clearInterval(interval);
      clearInterval(bloggerSyncInterval);
      window.removeEventListener('online', handleSync);
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('sciphi:analytics-updated', handleSync);
      window.removeEventListener('sciphi:pwa-installed', handleSync);
    };
  }, [refreshLiveStats, flushOfflineEvents, applyServerSummary, syncBloggerCatalog]);

  const cumulativeTotals = useMemo(() => {
    const sites = liveStats.live?.websites || liveStats.baseline?.all_websites || [];
    const baseTotals = computeCumulativeTotals(sites as any);
    let extraReads = 0;
    let extraViews = 0;
    offlineQueue.forEach((ev) => {
      const isRead = ev.type === 'article_read' || ev.type === 'pwa_app_read';
      const isView =
        isRead ||
        ev.type === 'article_view' ||
        ev.type === 'page_view' ||
        ev.type === 'pwa_app_view' ||
        ev.type === 'pwa_app_installed';
      if (isRead) extraReads += 1;
      if (isView) extraViews += 1;
    });
    return {
      ...baseTotals,
      totalNetReads: baseTotals.totalNetReads + extraReads,
      totalPageViews: baseTotals.totalPageViews + extraViews
    };
  }, [liveStats, offlineQueue]);

  const articleStatsMap = useMemo(() => {
    const list =
      liveStats.articleReadsBySite && liveStats.articleReadsBySite.length > 0
        ? liveStats.articleReadsBySite
        : computeArticleReadsBySite((liveStats.live?.websites || liveStats.baseline?.all_websites || []) as any, liveArticles);
    const map: Record<string, ArticleSiteReads> = {};
    list.forEach((item) => {
      map[item.slug] = { ...item };
    });
    offlineQueue.forEach((ev) => {
      if (ev.articleSlug && map[ev.articleSlug]) {
        const isRead = ev.type === 'article_read' || ev.type === 'pwa_app_read';
        const isView =
          isRead ||
          ev.type === 'article_view' ||
          ev.type === 'page_view' ||
          ev.type === 'pwa_app_view';
        if (isRead) map[ev.articleSlug].totalReads += 1;
        if (isView) map[ev.articleSlug].totalViews = (map[ev.articleSlug].totalViews || 0) + 1;
      }
    });
    return map;
  }, [liveStats, offlineQueue, liveArticles]);

  const selectedArticle = liveArticles.find((a) => a.slug === selectedArticleSlug);

  const navigateToArticle = (slug: string | null) => {
    if (typeof window !== 'undefined') {
      if (slug && !selectedArticleSlug) {
        try {
          sessionStorage.setItem(
            `sciphi_scroll_${currentTab}:main`,
            String(Math.round(window.scrollY))
          );
          sessionStorage.setItem(`sciphi_scroll_${currentTab}:${slug}`, '0');
        } catch {
          // ignore
        }
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        });
      }
    }
    setSelectedArticleSlug(slug);
    const target = slug ? `/makale/${encodeURIComponent(slug)}` : '/';
    if (window.location.pathname !== target) window.history.pushState({}, '', target);
  };

  useEffect(() => {
    const syncFromLocation = () => {
      const match =
        window.location.pathname.match(/^\/(?:tr|en|de|fr|es|it|ru|ar|zh|ja)\/makale\/([^/]+)\/?$/i) ||
        window.location.pathname.match(/^\/makale\/([^/]+)\/?$/);
      setSelectedArticleSlug(match ? decodeURIComponent(match[1]) : null);
    };
    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, []);

  useEffect(() => {
    const translatedSelected = selectedArticle
      ? getTranslatedArticle(selectedArticle, lang)
      : null;
    const baseCanonicalUrl = selectedArticle
      ? `https://emre-pelit-sci-phi.ai.studio/makale/${encodeURIComponent(selectedArticle.slug)}`
      : 'https://emre-pelit-sci-phi.ai.studio/';
    const canonicalUrl = lang !== 'tr' ? `${baseCanonicalUrl}?lang=${lang}` : baseCanonicalUrl;
    document.title = translatedSelected
      ? `${translatedSelected.title} | Sci-Phi (${lang.toUpperCase()})`
      : `Sci-Phi: ${t('portal_subtitle', lang)}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = translatedSelected?.summary || t('hero_desc', lang);

    // Dynamically update all 10 language hreflang links in document.head
    SUPPORTED_LANGUAGES.forEach((l) => {
      let link = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${l.code}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = l.code;
        document.head.appendChild(link);
      }
      link.href = `${baseCanonicalUrl}?lang=${l.code}`;
    });
    let xDefault = document.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="x-default"]');
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.rel = 'alternate';
      xDefault.hreflang = 'x-default';
      document.head.appendChild(xDefault);
    }
    xDefault.href = baseCanonicalUrl;
  }, [selectedArticle, lang, translationTick]);

  const filteredArticles = useMemo(() => {
    void translationTick;
    const base = liveArticles.filter((a) => {
      const matchCategory = selectedCategory === 'all' || a.category === selectedCategory;
      if (!matchCategory) return false;
      if (selectedSubcategory !== 'all') {
        const sub = resolveArticleSubcategory(a);
        if (sub.id !== selectedSubcategory) return false;
      }
      if (!catalogSearch.trim()) return true;
      const q = catalogSearch.toLowerCase();
      const translated = getTranslatedArticle(a, lang);
      const sub = resolveArticleSubcategory(a);
      return (
        a.title.toLowerCase().includes(q) ||
        translated.title.toLowerCase().includes(q) ||
        translated.summary.toLowerCase().includes(q) ||
        sub.titleTr.toLowerCase().includes(q) ||
        sub.titleEn.toLowerCase().includes(q) ||
        translated.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });

    if (catalogSort === 'reads_desc') {
      return [...base].sort((a, b) => {
        const rA = articleStatsMap[a.slug]?.totalReads || 0;
        const rB = articleStatsMap[b.slug]?.totalReads || 0;
        return rB - rA;
      });
    }
    if (catalogSort === 'title_asc') {
      return [...base].sort((a, b) =>
        getTranslatedArticle(a, lang).title.localeCompare(getTranslatedArticle(b, lang).title, lang)
      );
    }
    return base;
  }, [liveArticles, selectedCategory, selectedSubcategory, catalogSearch, catalogSort, articleStatsMap, lang, translationTick]);

  // Herhangi bir kategori veya alt kategori seçildiğinde o kategorideki BÜTÜN makaleleri eksiksiz göster
  const isShowingFullCategory =
    selectedCategory !== 'all' ||
    selectedSubcategory !== 'all' ||
    showAllSinglePage ||
    catalogViewMode === 'grouped' ||
    Boolean(catalogSearch.trim());

  const displayedArticles = isShowingFullCategory
    ? filteredArticles
    : filteredArticles.slice(0, visibleCount);

  const categoryCounts = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat.id] =
        cat.id === 'all'
          ? liveArticles.length
          : liveArticles.filter((a) => a.category === cat.id).length;
      return acc;
    }, {} as Record<string, number>);
  }, [liveArticles]);

  const subcategoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    liveArticles.forEach((a) => {
      const sub = resolveArticleSubcategory(a);
      counts[sub.id] = (counts[sub.id] || 0) + 1;
    });
    return counts;
  }, [liveArticles]);

  const categoryReadTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    liveArticles.forEach((a) => {
      const reads = articleStatsMap[a.slug]?.totalReads || 0;
      totals[a.category] = (totals[a.category] || 0) + reads;
    });
    return totals;
  }, [liveArticles, articleStatsMap]);

  const rawFeaturedArticle = liveArticles.find((a) => a.featured) || liveArticles[0];
  const featuredArticle = useMemo(() => {
    void translationTick;
    return getTranslatedArticle(rawFeaturedArticle, lang);
  }, [rawFeaturedArticle, lang, translationTick]);

  const stableTranslateTrigger = `${lang}:${selectedCategory}:${selectedSubcategory}:${catalogViewMode}:${visibleCount}:${showAllSinglePage}:${liveArticles.length}`;

  // Üst menüden hangi dil seçilirse seçilsin önce ekrandaki makaleleri, ardından tüm kataloğu aşamalı olarak hedef dile çevir
  useEffect(() => {
    let cancelled = false;
    const seen = new Set<string>();
    const prioritizedItems: Article[] = [];

    for (const item of [rawFeaturedArticle, ...displayedArticles, ...liveArticles]) {
      if (item && !seen.has(item.slug)) {
        seen.add(item.slug);
        prioritizedItems.push(item);
      }
    }

    async function runProgressiveBatch() {
      // Wave 1: First 24 visible articles immediately
      const firstWave = prioritizedItems.slice(0, 24);
      if (firstWave.length > 0 && !cancelled) {
        await translateArticlesBatch(firstWave, lang);
      }

      // Wave 2+: Remaining catalog in fast 45-article chunks
      const CHUNK = 45;
      for (let i = 24; i < prioritizedItems.length; i += CHUNK) {
        if (cancelled) break;
        const slice = prioritizedItems.slice(i, i + CHUNK);
        await translateArticlesBatch(slice, lang);
      }
    }

    runProgressiveBatch();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableTranslateTrigger]);

  const handleTrackEvent = useCallback(
    (type: string, details: string, siteId?: string, articleSlug?: string) => {
      const isInstalledApp = isRunningAsInstalledApp();
      const excludeAuthor = shouldExcludeClientRead(authorShieldActive);
      const effectiveSiteId = !siteId || siteId === 'grok-app' ? 'emre-pelit-sci-phi' : siteId;

      fetch('/api/events/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Author-Session': excludeAuthor ? 'emre-pelit' : '',
          'X-Author-Shield': excludeAuthor ? 'true' : 'false',
          'X-User-Email': excludeAuthor ? AUTHOR_PROFILE.email : ''
        },
        body: JSON.stringify({
          type,
          details,
          siteId: effectiveSiteId,
          source: effectiveSiteId,
          articleSlug,
          isInstalledApp,
          isAuthor: excludeAuthor,
          authorShieldActive: excludeAuthor,
          authorEmail: excludeAuthor ? AUTHOR_PROFILE.email : undefined
        })
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            applyServerSummary(data);
          }
        })
        .catch(() => {
          // Çevrimdışı (Offline PWA Modu) okuma ve görüntülemeleri yerel kuyruğa kaydet
          if (!excludeAuthor) {
            const queuedItem: QueuedAnalyticsEvent = {
              id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              type,
              details,
              siteId: effectiveSiteId,
              source: effectiveSiteId,
              articleSlug,
              isInstalledApp,
              timestamp: new Date().toISOString()
            };
            try {
              const existing = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
              const updated = [...existing, queuedItem];
              localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(updated));
              setOfflineQueue(updated);
            } catch {
              // ignore storage error
            }
          }
        });
    },
    [authorShieldActive, applyServerSummary]
  );

  const toggleAuthorShield = useCallback(() => {
    const next = !authorShieldActive;
    setAuthorShieldActiveState(next);
    setAuthorShieldActive(next);
  }, [authorShieldActive]);

  const handleGlobalLanguageChange = useCallback(
    (newLangCode: string) => {
      setLang(newLangCode);
      switchActiveSpeechLanguage(newLangCode);
      handleTrackEvent('language_change', `Full site & audio set to ${newLangCode.toUpperCase()}`);
    },
    [handleTrackEvent]
  );

  const handleListenCurrentView = useCallback(() => {
    if (selectedArticle) {
      speakArticleContent(selectedArticle, lang);
    } else {
      speakEntireVisiblePage(lang);
    }
    handleTrackEvent('audio_listen_start', `Site listen in ${lang.toUpperCase()}`);
  }, [selectedArticle, lang, handleTrackEvent]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Header */}
      <Header
        currentTab={selectedArticleSlug ? 'articles' : currentTab}
        onTabChange={(tab) => {
          navigateToArticle(null);
          setCurrentTab(tab);
        }}
        lang={lang}
        onSelectLang={handleGlobalLanguageChange}
        totalNetReads={cumulativeTotals.totalNetReads}
        totalArticlesCount={liveArticles.length}
        onOpenLanguage={() => setIsLanguageOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuthor={() => setIsAuthorOpen(true)}
        onOpenInvite={() => setIsInviteOpen(true)}
        onOpenGoogleIndex={() => setIsGoogleIndexOpen(true)}
        googleIndexStatus={googleIndexStatus}
        onListenSite={handleListenCurrentView}
        isSiteTranslating={isSiteTranslating}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Sync & Domain Status Banner */}
      <SyncStatusBanner
        lang={lang}
        totalNetReads={cumulativeTotals.totalNetReads}
        totalPageViews={cumulativeTotals.totalPageViews}
        baselineReads={liveStats.live?.baselineReads || liveStats.baseline?.verified_baseline_reads || 66178}
        baselineViews={liveStats.live?.baselineViews || liveStats.baseline?.verified_baseline_views || 91287}
        liveAddedReads={liveStats.live?.last24hReadsAdded ?? liveStats.last24Hours?.totalReads24h}
        liveAddedViews={liveStats.live?.last24hViewsAdded ?? liveStats.last24Hours?.totalViews24h}
        activeVisitors={liveStats.live?.activeVisitors || 34}
        bloggerPostsCount={bloggerPostsCount}
        totalArticlesCount={liveArticles.length}
        latestEventText={liveStats.live?.recentEvents?.[0]?.details}
        onSyncRefresh={handleFullSyncRefresh}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedArticle ? (
          <ArticleView
            article={selectedArticle}
            allArticles={liveArticles}
            lang={lang}
            articleMetrics={articleStatsMap[selectedArticle.slug]}
            articleStatsMap={articleStatsMap}
            onLanguageChange={handleGlobalLanguageChange}
            onSelectArticle={(slug) => navigateToArticle(slug)}
            onBack={() => navigateToArticle(null)}
            onTrackEvent={handleTrackEvent}
            isAuthorShieldActive={authorShieldActive}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
        ) : currentTab === 'articles' ? (
          <div>
            {/* Sadeleştirilmiş ve Odaklı Hero Alanı */}
            <section className="relative overflow-hidden py-10 sm:py-14 border-b border-slate-900 bg-gradient-to-b from-slate-900/40 via-slate-950 to-slate-950">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('hero_badge', lang)}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
                  {t('hero_title_1', lang)}{' '}
                  <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                    {t('hero_title_highlight', lang)}
                  </span>{' '}
                  {t('hero_title_2', lang)}
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm md:text-base font-serif leading-relaxed">
                  {t('hero_desc', lang)}
                </p>

                {/* Hero İçi Hızlı Makale Arama Çubuğu */}
                <div className="max-w-xl mx-auto pt-2">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 absolute left-4 text-amber-400 pointer-events-none" />
                    <input
                      type="text"
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      placeholder={
                        lang === 'tr'
                          ? `${liveArticles.length} makale, kavram, filozof veya formül içinde anında ara...`
                          : `Search instantly across ${liveArticles.length} essays, concepts, philosophers or formulas...`
                      }
                      className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-900/95 border border-slate-800 focus:border-amber-500 text-xs sm:text-sm text-white placeholder-slate-400 shadow-lg focus:outline-none transition"
                    />
                    {catalogSearch && (
                      <button
                        type="button"
                        onClick={() => setCatalogSearch('')}
                        className="absolute right-3 p-1 text-slate-400 hover:text-white cursor-pointer"
                        title="Aramayı Temizle"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3 Odaklı Ana Eylem Butonu */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    onClick={() => setCurrentTab('simulators')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5" />
                    <span>{t('launch_lab', lang)}</span>
                  </button>
                  <button
                    onClick={() => setIsGoogleIndexOpen(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {lang === 'tr' ? '10 Dilde Akademik İndeks' : '10-Language Academic Index'} (
                      {googleIndexStatus.indexedCount.toLocaleString('tr-TR')}/
                      {googleIndexStatus.totalCount.toLocaleString('tr-TR')})
                    </span>
                  </button>
                  <button
                    onClick={() => setCurrentTab('stats')}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-amber-500/40 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {cumulativeTotals.totalNetReads.toLocaleString('tr-TR')} {t('net_reads_unit', lang)} •{' '}
                      {cumulativeTotals.totalPageViews.toLocaleString('tr-TR')} {t('page_views_unit', lang)}
                    </span>
                  </button>
                </div>
              </div>
            </section>

            {/* Ana Sayfa Detaylı Web Sitesi İstatistikleri & sci-phil.ai.studio Dahil Tüm Siteler Dökümü */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <div className="bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Canlı Detaylı İstatistik Paneli</span>
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white">
                      emre-pelit-sci-phi.ai.studio & sci-phil.ai.studio Dahil Tüm 8 Web Sitesi Kümülatif İstatistik Raporu
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                      ∑ {cumulativeTotals.totalNetReads.toLocaleString('tr-TR')} Net Okunma • {cumulativeTotals.totalPageViews.toLocaleString('tr-TR')} Görüntüleme
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentTab('stats')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition cursor-pointer flex items-center gap-1.5"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Tam İstatistik Paneline Git</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowHomeStatsPanel((prev) => !prev)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-semibold transition cursor-pointer flex items-center gap-1"
                    >
                      <span>{showHomeStatsPanel ? 'Daralt' : 'Detayları Göster'}</span>
                      {showHomeStatsPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {showHomeStatsPanel && (
                  <div className="space-y-4 pt-2 border-t border-slate-800/80 animate-fade-in">
                    {/* 7 Temel Analitik Parametre Kartları */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 font-mono text-xs">
                      <div className="p-3 rounded-2xl bg-slate-950 border border-amber-500/40">
                        <span className="text-[10px] text-amber-400 font-sans font-bold uppercase block">1. Net Okunma</span>
                        <strong className="text-base sm:text-lg text-white font-black block mt-0.5">
                          {cumulativeTotals.totalNetReads.toLocaleString('tr-TR')}
                        </strong>
                        <span className="text-[10px] text-emerald-400">
                          {cumulativeTotals.totalBaseReads.toLocaleString('tr-TR')} + {cumulativeTotals.totalLiveReadsAdded.toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-sky-500/40">
                        <span className="text-[10px] text-sky-400 font-sans font-bold uppercase block">2. Görüntüleme</span>
                        <strong className="text-base sm:text-lg text-white font-black block mt-0.5">
                          {cumulativeTotals.totalPageViews.toLocaleString('tr-TR')}
                        </strong>
                        <span className="text-[10px] text-sky-300">
                          {cumulativeTotals.totalBaseViews.toLocaleString('tr-TR')} + {cumulativeTotals.totalLiveViewsAdded.toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/40">
                        <span className="text-[10px] text-emerald-400 font-sans font-bold uppercase block">3. Sesli Dinleme</span>
                        <strong className="text-base sm:text-lg text-emerald-300 font-black block mt-0.5">
                          {cumulativeTotals.totalListeningFormatted}
                        </strong>
                        <span className="text-[10px] text-slate-400">
                          {cumulativeTotals.totalListeningMinutes.toLocaleString('tr-TR')} dk ({cumulativeTotals.totalListeningSessions.toLocaleString('tr-TR')} oturum)
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-purple-500/40">
                        <span className="text-[10px] text-purple-300 font-sans font-bold uppercase block">4. Tekil Ziyaretçi</span>
                        <strong className="text-base sm:text-lg text-white font-black block mt-0.5">
                          {cumulativeTotals.totalUniqueVisitors.toLocaleString('tr-TR')}
                        </strong>
                        <span className="text-[10px] text-purple-300">Doğrulanmış Okur</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-pink-500/40">
                        <span className="text-[10px] text-pink-400 font-sans font-bold uppercase block">5. Toplam Oturum</span>
                        <strong className="text-base sm:text-lg text-white font-black block mt-0.5">
                          {cumulativeTotals.totalSessions.toLocaleString('tr-TR')}
                        </strong>
                        <span className="text-[10px] text-pink-300">3.42 Sayfa/Oturum</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-amber-300/40">
                        <span className="text-[10px] text-amber-300 font-sans font-bold uppercase block">6. Okuma Süresi</span>
                        <strong className="text-base sm:text-lg text-amber-200 font-black block mt-0.5">
                          {cumulativeTotals.totalReadingFormatted}
                        </strong>
                        <span className="text-[10px] text-slate-400">
                          {cumulativeTotals.totalReadingMinutes.toLocaleString('tr-TR')} dk (Ort. 4 dk 18 sn)
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/40">
                        <span className="text-[10px] text-cyan-400 font-sans font-bold uppercase block">7. Simülatör</span>
                        <strong className="text-base sm:text-lg text-cyan-300 font-black block mt-0.5">
                          {cumulativeTotals.totalSimulatorInteractions.toLocaleString('tr-TR')}
                        </strong>
                        <span className="text-[10px] text-slate-400">Kuantum & LaTeX</span>
                      </div>
                    </div>

                    {/* sci-phil.ai.studio Dahil Tüm Web Siteleri Detaylı Tablosu */}
                    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                      <table className="w-full text-left text-[11px] font-mono">
                        <thead className="bg-slate-900 text-[10px] text-slate-400 uppercase border-b border-slate-800 font-sans">
                          <tr>
                            <th className="py-2 px-3">Web Sitesi (301 Konsolide)</th>
                            <th className="py-2 px-2 text-right">Taban + Canlı Okunma</th>
                            <th className="py-2 px-2 text-right text-amber-400">Net Okunma</th>
                            <th className="py-2 px-2 text-right">Taban + Canlı Gör.</th>
                            <th className="py-2 px-2 text-right text-sky-400">Görüntüleme</th>
                            <th className="py-2 px-2 text-right text-emerald-300">Sesli Dinleme</th>
                            <th className="py-2 px-2 text-right text-amber-200">Okuma Süresi</th>
                            <th className="py-2 px-2 text-right text-purple-300">Tekil Okur</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900 text-slate-200">
                          {cumulativeTotals.validSites.map((s, idx) => {
                            const isFeatured301 =
                              s.id === 'sci-phil-legacy' ||
                              s.domain === 'sci-phil.ai.studio' ||
                              s.id === 'emre-pelit-sci-phi' ||
                              s.domain === 'emre-pelit-sci-phi.ai.studio';
                            return (
                              <tr
                                key={`home-site-${s.id}`}
                                className={`hover:bg-slate-900/60 ${
                                  isFeatured301 ? 'bg-amber-500/10 border-l-2 border-amber-400' : ''
                                }`}
                              >
                                <td className="py-2 px-3">
                                  <div className="flex items-center gap-1.5 font-bold text-white">
                                    <span className="text-amber-400">#{idx + 1}</span>
                                    <span>{s.domain}</span>
                                    {isFeatured301 && (
                                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-black uppercase">
                                        +301 Toplama Eklendi
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2 px-2 text-right text-slate-400">
                                  {s.baseReads.toLocaleString('tr-TR')} + <span className="text-emerald-400">{s.last24hReads.toLocaleString('tr-TR')}</span>
                                </td>
                                <td className="py-2 px-2 text-right font-black text-amber-400">
                                  {s.netReads.toLocaleString('tr-TR')}
                                </td>
                                <td className="py-2 px-2 text-right text-slate-400">
                                  {s.baseViews.toLocaleString('tr-TR')} + <span className="text-sky-400">{s.last24hViews.toLocaleString('tr-TR')}</span>
                                </td>
                                <td className="py-2 px-2 text-right font-black text-sky-300">
                                  {s.pageViews.toLocaleString('tr-TR')}
                                </td>
                                <td className="py-2 px-2 text-right text-emerald-300">{s.listeningFormatted}</td>
                                <td className="py-2 px-2 text-right text-amber-200">{s.totalReadingFormatted}</td>
                                <td className="py-2 px-2 text-right text-purple-300">
                                  {s.uniqueVisitors.toLocaleString('tr-TR')}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-amber-500/10 border-t-2 border-amber-500/50 font-black text-white">
                          <tr>
                            <td className="py-2.5 px-3 text-amber-300">
                              ∑ BİRLEŞİK GENEL TOPLAM (sci-phil.ai.studio & emre-pelit-sci-phi.ai.studio Dahil):
                            </td>
                            <td className="py-2.5 px-2 text-right text-emerald-300">
                              {cumulativeTotals.totalBaseReads.toLocaleString('tr-TR')} + {cumulativeTotals.totalLiveReadsAdded.toLocaleString('tr-TR')}
                            </td>
                            <td className="py-2.5 px-2 text-right text-amber-400 text-xs">
                              {cumulativeTotals.totalNetReads.toLocaleString('tr-TR')}
                            </td>
                            <td className="py-2.5 px-2 text-right text-sky-300">
                              {cumulativeTotals.totalBaseViews.toLocaleString('tr-TR')} + {cumulativeTotals.totalLiveViewsAdded.toLocaleString('tr-TR')}
                            </td>
                            <td className="py-2.5 px-2 text-right text-sky-300 text-xs">
                              {cumulativeTotals.totalPageViews.toLocaleString('tr-TR')}
                            </td>
                            <td className="py-2.5 px-2 text-right text-emerald-300">
                              {cumulativeTotals.totalListeningFormatted}
                            </td>
                            <td className="py-2.5 px-2 text-right text-amber-200">
                              {cumulativeTotals.totalReadingFormatted}
                            </td>
                            <td className="py-2.5 px-2 text-right text-purple-300">
                              {cumulativeTotals.totalUniqueVisitors.toLocaleString('tr-TR')}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 7 Tanıtım, Akademik Yayılım & Viral Büyüme Merkezi */}
            <PromotionSuite
              articles={liveArticles}
              selectedArticle={featuredArticle}
              lang={lang}
              totalNetReads={cumulativeTotals.totalNetReads}
              totalPageViews={cumulativeTotals.totalPageViews}
              articleStatsMap={articleStatsMap}
              onSelectArticle={(slug) => navigateToArticle(slug)}
              onTrackEvent={handleTrackEvent}
            />

            {/* Öne Çıkan Makale Kartı (Akademik Konu Görseli + Özet Görünüm + Açılır/Kapanır Akademik Atıf Çekmecesi) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
              <div
                onClick={() => navigateToArticle(featuredArticle.slug)}
                className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-3xl p-5 sm:p-7 cursor-pointer hover:border-amber-500/60 transition-all duration-300 shadow-xl group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Sol: Öne Çıkan Makalenin Konularını Özetleyen Akademik Görsel (Graphical Abstract) */}
                  <div className="lg:col-span-5 h-52 sm:h-56 w-full rounded-2xl overflow-hidden border border-amber-500/30 shadow-lg">
                    <ArticleIllustration
                      slug={featuredArticle.slug}
                      category={featuredArticle.category}
                      title={featuredArticle.title}
                      subtitle={featuredArticle.subtitle}
                      tags={featuredArticle.tags}
                      formula={featuredArticle.mathFormulations?.[0]?.latex}
                      formulaTitle={featuredArticle.mathFormulations?.[0]?.title}
                      subTopicLabel={featuredArticle.categoryTitle}
                      figureNumber={0}
                      thesisSummary={featuredArticle.dialecticalTriad?.synthesis || featuredArticle.summary}
                      variant="thumbnail"
                      className="w-full h-full"
                    />
                  </div>

                  {/* Sağ: Öne Çıkan Makale Akademik Künye ve Özet Bilgileri */}
                  <div className="lg:col-span-7 flex flex-col justify-between gap-4">
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                          {t('featured_badge', lang)}
                        </span>
                        <span className="text-xs text-amber-400 font-medium">
                          {featuredArticle.categoryTitle}
                        </span>
                        <span className="text-xs text-slate-400">• {featuredArticle.readTime}</span>
                        {articleStatsMap[featuredArticle.slug] && (
                          <span className="text-xs text-emerald-400 font-mono font-bold">
                            • {articleStatsMap[featuredArticle.slug].totalReads.toLocaleString('tr-TR')}{' '}
                            {t('net_reads_unit', lang)}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors font-serif">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 font-serif line-clamp-2">
                        {featuredArticle.summary}
                      </p>

                      {/* Öne Çıkan Makale Konu Etiketleri */}
                      {featuredArticle.tags && featuredArticle.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                            {lang === 'tr' ? 'Konu Özeti:' : 'Topics:'}
                          </span>
                          {featuredArticle.tags.slice(0, 4).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-950/90 text-slate-200 border border-slate-800 text-[10px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Öne Çıkan Makale Atıf Çekmecesi Tetikleyici */}
                      <div className="pt-1 flex flex-wrap items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setShowFeaturedCitation((prev) => !prev)}
                          className="px-3 py-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-800 border border-indigo-500/30 text-[11px] font-semibold text-indigo-300 flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                          <span>
                            {showFeaturedCitation
                              ? lang === 'tr'
                                ? 'Akademik Atıf Künyesini Gizle'
                                : 'Hide Academic Citation'
                              : lang === 'tr'
                              ? 'Akademik Atıf & DOI Künyesini Göster'
                              : 'Show Academic Citation & DOI'}
                          </span>
                          {showFeaturedCitation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        <span
                          onClick={() => navigateToArticle(featuredArticle.slug)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
                        >
                          <span>{t('read_full_essay', lang)}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>

                      {showFeaturedCitation && (() => {
                        const featId = getArticleScholarlyIdentifiers(featuredArticle);
                        const featCit = generateFormattedCitations(featuredArticle, 'https://emre-pelit-sci-phi.ai.studio', lang);
                        const encSlug = encodeURIComponent(featuredArticle.slug);
                        return (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mt-2 p-3 rounded-2xl bg-slate-950/80 border border-indigo-500/30 space-y-1.5 cursor-default"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                                <span>{tsScholar('card_citation_label', lang)}</span>
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="notranslate text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                                  DOI: {featId.doi} • e-ISSN: {featId.eIssn}
                                </span>
                                <a
                                  href={`/citations/${encSlug}.bib`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="notranslate px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono"
                                >
                                  BibTeX (.bib)
                                </a>
                                <a
                                  href={`/citations/${encSlug}.ris`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="notranslate px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono"
                                >
                                  RIS (.ris)
                                </a>
                                <a
                                  href={`/scholar/pdf/${encSlug}.html?lang=${lang}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="notranslate px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 border border-indigo-500/40 text-[10px] font-mono"
                                >
                                  PDF
                                </a>
                              </div>
                            </div>
                            <p className="text-[11px] font-mono text-slate-300 leading-relaxed select-all">
                              {featCit.apa}
                            </p>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sabit (Sticky) Akıllı Filtreleme, Kategori, Arama ve Görünüm Çubuğu */}
            <div className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-md border-y border-slate-800/80 py-3 transition-colors">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2.5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Ana Kategori Seçim Butonları */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
                    <span className="p-1.5 text-amber-400 hidden sm:inline shrink-0">
                      <Filter className="w-4 h-4" />
                    </span>
                    {CATEGORIES.map((cat) => {
                      const count = categoryCounts[cat.id] || 0;
                      const isActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setSelectedSubcategory('all');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <span>{getTranslatedCategoryTitle(cat.id, lang)}</span>
                          <span
                            className={`text-[10px] font-mono ${
                              isActive ? 'text-slate-950 font-black' : 'text-slate-400'
                            }`}
                          >
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Arama, Sıralama, Kart Detay Anahtarı ve Görünüm Modu Kontrolleri */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 sm:w-48">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                      <input
                        type="text"
                        placeholder={t('search_placeholder', lang)}
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      {catalogSearch && (
                        <button
                          type="button"
                          onClick={() => setCatalogSearch('')}
                          className="absolute right-2 top-2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Sıralama Seçici */}
                    <select
                      value={catalogSort}
                      onChange={(e) => setCatalogSort(e.target.value as 'default' | 'reads_desc' | 'title_asc')}
                      aria-label="Makale Sıralama Ölçütü"
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="default">
                        {lang === 'tr' ? 'Sıralama: Külliyat' : 'Sort: Corpus'}
                      </option>
                      <option value="reads_desc">
                        {lang === 'tr' ? 'En Çok Okunan ↓' : 'Most Read ↓'}
                      </option>
                      <option value="title_asc">
                        {lang === 'tr' ? 'Alfabetik (A-Z)' : 'Alphabetical (A-Z)'}
                      </option>
                    </select>

                    {/* 3 Düzenli Görünüm Modu */}
                    <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setCatalogViewMode('grid')}
                        title={lang === 'tr' ? 'Kart Görünümü' : 'Card Grid View'}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                          catalogViewMode === 'grid'
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{lang === 'tr' ? 'Kartlar' : 'Grid'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatalogViewMode('grouped')}
                        title={lang === 'tr' ? 'Kategorili Bölüm Görünümü' : 'Grouped by Category'}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                          catalogViewMode === 'grouped'
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <ListTree className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{lang === 'tr' ? 'Kategorili' : 'Grouped'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCatalogViewMode('compact')}
                        title={lang === 'tr' ? 'Kompakt Akademik İndeks' : 'Compact Index Table'}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                          catalogViewMode === 'compact'
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Table2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{lang === 'tr' ? 'İndeks' : 'Index'}</span>
                      </button>
                    </div>

                    {/* Tüm Kartların Atıf/Detay Çekmecesini Aç/Kapat */}
                    {catalogViewMode !== 'compact' && (
                      <button
                        type="button"
                        onClick={() => setExpandAllCards((prev) => !prev)}
                        className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1 cursor-pointer ${
                          expandAllCards
                            ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/50'
                            : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                        }`}
                        title={
                          lang === 'tr'
                            ? 'Kartlarda Varsayılan Özet veya Tam Atıf Görünümü'
                            : 'Toggle Summary vs Full Citation View on Cards'
                        }
                      >
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="hidden xl:inline">
                          {expandAllCards
                            ? lang === 'tr'
                              ? 'Özet Kartlara Dön'
                              : 'Summary Cards'
                            : lang === 'tr'
                            ? 'Tüm Atıfları Aç'
                            : 'Expand Citations'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Seçili Kategori Alt Başlıkları & Durum Çubuğu */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-400">
                  <div className="flex flex-wrap items-center gap-2">
                    <span>
                      {lang === 'tr' ? 'Listelenen:' : 'Showing:'}{' '}
                      <strong className="text-white font-mono">{displayedArticles.length}</strong> /{' '}
                      <strong className="text-amber-400 font-mono">{filteredArticles.length}</strong>{' '}
                      {lang === 'tr' ? 'makale' : 'essays'}
                    </span>

                    {selectedCategory !== 'all' && (() => {
                      const activeTax = DETAILED_TAXONOMY.find((t) => t.id === selectedCategory);
                      if (!activeTax) return null;
                      return (
                        <div className="flex flex-wrap items-center gap-1.5 pl-2 border-l border-slate-800">
                          <button
                            type="button"
                            onClick={() => setSelectedSubcategory('all')}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                              selectedSubcategory === 'all'
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'bg-slate-900 text-slate-300 border border-slate-800'
                            }`}
                          >
                            {lang === 'tr' ? 'Tüm Alt Konular' : 'All Subtopics'}
                          </button>
                          {activeTax.subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => setSelectedSubcategory(sub.id)}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                                selectedSubcategory === sub.id
                                  ? 'bg-amber-500 text-slate-950 font-bold'
                                  : 'bg-slate-900 text-slate-300 border border-slate-800'
                              }`}
                            >
                              {getTranslatedSubcategoryTitle(sub.id, sub.titleTr, sub.titleEn, lang)} ({subcategoryCounts[sub.id] || 0})
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowTaxonomyCards((prev) => !prev)}
                      className="text-xs text-slate-300 hover:text-amber-400 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>
                        {showTaxonomyCards
                          ? lang === 'tr'
                            ? '5 Disiplin Haritasını Gizle'
                            : 'Hide 5-Discipline Map'
                          : lang === 'tr'
                          ? '5 Disiplin & 15 Alt Konu Haritası'
                          : '5-Discipline & 15-Subtopic Map'}
                      </span>
                      {showTaxonomyCards ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || catalogSearch) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedSubcategory('all');
                          setCatalogSearch('');
                        }}
                        className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>{lang === 'tr' ? 'Filtreleri Sıfırla' : 'Reset Filters'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Açılır/Kapanır 5 Ana Disiplin & 15 Alt Kategori Haritası */}
            {showTaxonomyCards && (
              <section
                aria-label="Detaylı Makale Kategorileri ve Alt Disiplinler"
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 animate-fade-in"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                  {DETAILED_TAXONOMY.map((tax) => {
                    const isSelected = selectedCategory === tax.id;
                    const count = categoryCounts[tax.id] || 0;
                    const catReads = categoryReadTotals[tax.id] || 0;

                    return (
                      <div
                        key={tax.id}
                        onClick={() => {
                          if (selectedCategory === tax.id && selectedSubcategory === 'all') {
                            setSelectedCategory('all');
                          } else {
                            setSelectedCategory(tax.id);
                            setSelectedSubcategory('all');
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                          isSelected
                            ? 'bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-950 border-amber-500 shadow-lg shadow-amber-500/10'
                            : 'bg-slate-900/75 hover:bg-slate-900 border-slate-800/90 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className={isSelected ? 'text-amber-400 font-black' : 'text-slate-500 font-bold'}>
                              {lang === 'tr' ? `BÖLÜM ${tax.code}` : `PART ${tax.code}`}
                            </span>
                            <span className={isSelected ? 'text-amber-300 font-bold' : 'text-slate-300 font-semibold'}>
                              {count} {lang === 'tr' ? 'Makale' : 'Essays'}
                            </span>
                          </div>

                          <h3 className={`text-sm font-bold leading-snug ${isSelected ? 'text-amber-300' : 'text-white'}`}>
                            {getTranslatedCategoryTitle(tax.id, lang)}
                          </h3>

                          <div className="pt-2 border-t border-slate-800/80 space-y-1">
                            {tax.subcategories.map((sub) => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCategory(tax.id);
                                  setSelectedSubcategory(sub.id);
                                }}
                                className={`w-full text-left text-[10px] py-0.5 px-1.5 rounded flex items-center justify-between gap-1 transition ${
                                  selectedSubcategory === sub.id
                                    ? 'bg-amber-500 text-slate-950 font-bold'
                                    : 'text-slate-400 hover:text-amber-300 hover:bg-slate-950/60'
                                }`}
                              >
                                <span className="truncate">• {getTranslatedSubcategoryTitle(sub.id, sub.titleTr, sub.titleEn, lang)}</span>
                                <span className="font-mono shrink-0">{subcategoryCounts[sub.id] || 0}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-emerald-400">
                            {catReads.toLocaleString('tr-TR')} {lang === 'tr' ? 'Okunma' : 'Reads'}
                          </span>
                          <span className={isSelected ? 'text-amber-400 font-sans font-bold' : 'text-slate-400 font-sans'}>
                            {isSelected ? '✓ Aktif' : lang === 'tr' ? 'Filtrele →' : 'Filter →'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Articles Display Area (3 Görünüm Modu: Grid / Grouped / Compact) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              {catalogViewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedArticles.map((article, idx) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      indexNumber={idx + 1}
                      lang={lang}
                      articleMetrics={articleStatsMap[article.slug]}
                      defaultExpanded={expandAllCards}
                      onSelect={(slug) => navigateToArticle(slug)}
                    />
                  ))}
                </div>
              )}

              {catalogViewMode === 'grouped' && (
                <div className="space-y-10">
                  {DETAILED_TAXONOMY.filter(
                    (tax) => selectedCategory === 'all' || tax.id === selectedCategory
                  ).map((tax) => {
                    const catArticles = filteredArticles.filter((a) => a.category === tax.id);
                    if (catArticles.length === 0) return null;

                    return (
                      <div
                        key={tax.id}
                        className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                          <div>
                            <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                              BÖLÜM {tax.code} • {catArticles.length} MAKALE
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                              {getTranslatedCategoryTitle(tax.id, lang)}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                              {lang === 'tr' ? tax.descriptionTr : tax.descriptionEn}
                            </p>
                          </div>
                        </div>

                        {/* Her Alt Kategoriyi Kendi Alt Başlığıyla Düzenli Listele */}
                        <div className="space-y-8">
                          {tax.subcategories.map((sub) => {
                            const subArticles = catArticles.filter(
                              (a) => resolveArticleSubcategory(a).id === sub.id
                            );
                            if (subArticles.length === 0) return null;

                            return (
                              <div key={sub.id} className="space-y-4">
                                <div className="flex items-center justify-between border-l-4 border-amber-500 pl-3 py-0.5">
                                  <div>
                                    <h4 className="text-sm sm:text-base font-bold text-amber-300">
                                      {getTranslatedSubcategoryTitle(sub.id, sub.titleTr, sub.titleEn, lang)}
                                    </h4>
                                    <p className="text-xs text-slate-400">
                                      {lang === 'tr' ? sub.descriptionTr : sub.descriptionEn}
                                    </p>
                                  </div>
                                  <span className="text-xs font-mono text-slate-300 font-bold shrink-0">
                                    {subArticles.length} {lang === 'tr' ? 'Makale' : 'Essays'}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                  {subArticles.map((article, sIdx) => (
                                    <ArticleCard
                                      key={article.id}
                                      article={article}
                                      indexNumber={sIdx + 1}
                                      lang={lang}
                                      articleMetrics={articleStatsMap[article.slug]}
                                      onSelect={(slug) => navigateToArticle(slug)}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {catalogViewMode === 'compact' && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/90 text-[11px] font-mono uppercase text-slate-400">
                          <th className="py-3.5 px-4 w-14">#</th>
                          <th className="py-3.5 px-4">{lang === 'tr' ? 'Makale Başlığı & Özeti' : 'Essay Title & Summary'}</th>
                          <th className="py-3.5 px-4 hidden md:table-cell">{lang === 'tr' ? 'Ana Kategori & Alt Disiplin' : 'Category & Subcategory'}</th>
                          <th className="py-3.5 px-4 text-right">{lang === 'tr' ? 'Canlı Okunma / Görüntüleme' : 'Live Reads / Views'}</th>
                          <th className="py-3.5 px-4 text-right w-28">{lang === 'tr' ? 'Bağlantı' : 'Action'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70 text-xs">
                        {displayedArticles.map((article, idx) => {
                          const translated = getTranslatedArticle(article, lang);
                          const sub = resolveArticleSubcategory(article);
                          const metrics = articleStatsMap[article.slug];

                          return (
                            <tr
                              key={article.id}
                              onClick={() => navigateToArticle(article.slug)}
                              className="hover:bg-slate-800/50 transition cursor-pointer group"
                            >
                              <td className="py-3.5 px-4 font-mono text-slate-500 font-bold">
                                #{String(idx + 1).padStart(2, '0')}
                              </td>
                              <td className="py-3.5 px-4 max-w-xl">
                                <div className="font-bold text-white group-hover:text-amber-400 transition text-sm leading-snug">
                                  {translated.title}
                                </div>
                                <div className="text-slate-400 line-clamp-1 font-serif mt-0.5">
                                  {translated.subtitle || translated.summary}
                                </div>
                                {/* Kompakt Görünümde Her Makalenin Altında Akademik Atıf Künyesi */}
                                {(() => {
                                  const rowCit = generateFormattedCitations(translated, 'https://emre-pelit-sci-phi.ai.studio', lang);
                                  const rowId = getArticleScholarlyIdentifiers(translated);
                                  return (
                                    <div className="mt-1.5 pt-1.5 border-t border-slate-800/70 text-[10px] font-mono text-indigo-300/90 flex flex-wrap items-center gap-1.5">
                                      <GraduationCap className="w-3 h-3 text-indigo-400 shrink-0" />
                                      <span className="line-clamp-1 select-all">{rowCit.apa}</span>
                                      <span className="notranslate text-emerald-400">• DOI: {rowId.doi}</span>
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="py-3.5 px-4 hidden md:table-cell">
                                <div className="text-amber-400 font-semibold">{translated.categoryTitle}</div>
                                <div className="text-slate-400 text-[11px]">
                                  {getTranslatedSubcategoryTitle(sub.id, sub.titleTr, sub.titleEn, lang)}
                                </div>
                              </td>
                              <td className="py-3.5 px-4 text-right font-mono">
                                {metrics ? (
                                  <div>
                                    <span className="text-emerald-400 font-bold">
                                      {metrics.totalReads.toLocaleString('tr-TR')}
                                    </span>
                                    <span className="text-slate-600 mx-1">/</span>
                                    <span className="text-sky-400">
                                      {(metrics.totalViews || Math.round(metrics.totalReads * 1.35)).toLocaleString('tr-TR')}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-slate-500">{article.readTime}</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <div className="inline-flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveObjectionArticle(article);
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-[10px] font-bold transition inline-flex items-center gap-1"
                                    title={lang === 'tr' ? 'Bu Makale İçin İtiraz / Soru Yaz' : 'Submit Objection / Question for This Essay'}
                                  >
                                    <MessageSquareWarning className="w-3 h-3" />
                                    <span>{lang === 'tr' ? 'İtiraz Kutusu' : 'Object'}</span>
                                  </button>
                                  <span className="inline-flex items-center gap-1 text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
                                    <span>{lang === 'tr' ? 'Oku' : 'Read'}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!isShowingFullCategory && displayedArticles.length < filteredArticles.length && (
                <div className="mt-12 text-center space-y-3 pb-8">
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setVisibleCount((prev) => Math.min(filteredArticles.length, prev + 36))}
                      className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs transition shadow-md cursor-pointer"
                    >
                      {t('load_more', lang)}
                    </button>
                    <button
                      onClick={() => setShowAllSinglePage(true)}
                      className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      {t('show_all_single_page', lang)} ({filteredArticles.length})
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : currentTab === 'simulators' ? (
          <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
              <button
                onClick={() => setActiveSimulator('block-universe')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  activeSimulator === 'block-universe'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850'
                }`}
              >
                <Atom className="w-4 h-4" />
                <span>{t('sim_block_universe', lang)}</span>
              </button>
              <button
                onClick={() => setActiveSimulator('chinese-room')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  activeSimulator === 'chinese-room'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850'
                }`}
              >
                <BrainCircuit className="w-4 h-4" />
                <span>{t('sim_chinese_room', lang)}</span>
              </button>
              <button
                onClick={() => setActiveSimulator('fallacy-inspector')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  activeSimulator === 'fallacy-inspector'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850'
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{t('sim_fallacy_inspector', lang)}</span>
              </button>
              <button
                onClick={() => setActiveSimulator('socratic-arena')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  activeSimulator === 'socratic-arena'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('sim_socratic_arena', lang)}</span>
              </button>
              <button
                onClick={() => setActiveSimulator('knowledge-graph')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 ${
                  activeSimulator === 'knowledge-graph'
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-850'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>{t('sim_knowledge_graph', lang)}</span>
              </button>
            </div>

            <div>
              {activeSimulator === 'block-universe' && <BlockUniverseSimulator lang={lang} />}
              {activeSimulator === 'chinese-room' && <ChineseRoomSimulator lang={lang} />}
              {activeSimulator === 'fallacy-inspector' && <FallacyInspector lang={lang} />}
              {activeSimulator === 'socratic-arena' && <SocraticDialogueArena lang={lang} />}
              {activeSimulator === 'knowledge-graph' && (
                <KnowledgeGraphView
                  lang={lang}
                  onSelectArticle={(slug) => navigateToArticle(slug)}
                />
              )}
            </div>
          </div>
        ) : currentTab === 'stats' ? (
          <StatsDashboard
            lang={lang}
            stats={liveStats}
            onStatsChange={(updated) => setLiveStats(updated)}
          />
        ) : currentTab === 'automation' ? (
          <AutomationPanel
            lang={lang}
            stats={liveStats}
            bloggerPostsCount={bloggerPostsCount}
            totalArticlesCount={liveArticles.length}
            onRefreshStats={refreshLiveStats}
            onSyncBlogger={() => syncBloggerCatalog(true)}
            onOpenGoogleIndex={() => setIsGoogleIndexOpen(true)}
          />
        ) : null}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-slate-950 border-t border-slate-800 py-10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black text-sm">
                Φ
              </div>
              <span className="font-bold text-white text-sm">{t('portal_subtitle', lang)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="mailto:emrepelit39@gmail.com"
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition flex items-center gap-1.5 font-mono text-xs"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>emrepelit39@gmail.com</span>
              </a>
              <a
                href="https://www.linkedin.com/in/emrepelit109"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20 transition flex items-center gap-1.5 font-mono text-xs"
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                <span>www.linkedin.com/in/emrepelit109</span>
              </a>
              <button
                onClick={() => setIsGoogleIndexOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition flex items-center gap-1.5 font-bold text-xs cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Google ile İndeksle</span>
              </button>
              <button
                onClick={() => setIsInviteOpen(true)}
                className="hover:text-amber-400 transition flex items-center gap-1 font-semibold text-amber-400 cursor-pointer"
              >
                <span>{t('invite_btn', lang)}</span>
              </button>
              <PWAInstallButton lang={lang} />
              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition font-mono text-amber-300"
              >
                /llms.txt
              </a>
              <a
                href="/llms-full.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-400 transition font-mono text-sky-300"
              >
                /llms-full.txt
              </a>
              <a
                href="/podcast.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition font-mono text-emerald-300"
              >
                Podcast RSS
              </a>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition"
              >
                Sitemap
              </a>
              <a
                href="/analytics.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition"
              >
                {t('nav_stats', lang)}
              </a>
              <a
                href="/automation-panel.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition"
              >
                {t('nav_automation', lang)}
              </a>
              <a
                href="https://emrepelit7337.blogspot.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 transition"
              >
                Blogger ({bloggerPostsCount} Yazı)
              </a>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <p>
              © 2026 Sci-Phi • Emre Pelit (<a href="mailto:emrepelit39@gmail.com" className="text-amber-400 hover:underline font-mono">emrepelit39@gmail.com</a> • <a href="https://www.linkedin.com/in/emrepelit109" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline font-mono">www.linkedin.com/in/emrepelit109</a>) • Açılıştan Beri (24 Nisan 2026) 8 Web Sitesi Kümülatif: {cumulativeTotals.totalNetReads.toLocaleString('tr-TR')} Net Okunma / {cumulativeTotals.totalPageViews.toLocaleString('tr-TR')} Görüntüleme.
            </p>
            <p className="font-mono text-slate-500 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Primary Hub: emre-pelit-sci-phi.ai.studio • https://emre-pelit-sci-phi.ai.studio (301 Ana Otorite • IndexNow 25.280 URL)</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthorProfileModal
        isOpen={isAuthorOpen}
        onClose={() => setIsAuthorOpen(false)}
        lang={lang}
        authorShieldActive={authorShieldActive}
        onToggleAuthorShield={toggleAuthorShield}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={liveArticles}
        onSelectArticle={(slug) => navigateToArticle(slug)}
        lang={lang}
      />
      <LanguageSelectorModal
        isOpen={isLanguageOpen}
        onClose={() => setIsLanguageOpen(false)}
        currentLang={lang}
        onSelectLang={handleGlobalLanguageChange}
      />
      <InviteOutreachModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        lang={lang}
      />
      <GoogleIndexModal
        isOpen={isGoogleIndexOpen}
        onClose={() => setIsGoogleIndexOpen(false)}
        articles={liveArticles}
        autoStart={true}
        onProgressUpdate={(indexedCount, totalCount, isRunning) =>
          setGoogleIndexStatus((prev) => {
            if (
              prev.indexedCount === indexedCount &&
              prev.totalCount === totalCount &&
              prev.isRunning === isRunning
            ) {
              return prev;
            }
            return { indexedCount, totalCount, isRunning };
          })
        }
      />
      {activeObjectionArticle && (
        <ArticleObjectionQA
          article={getTranslatedArticle(activeObjectionArticle, lang)}
          lang={lang}
          variant="modal"
          onCloseModal={() => setActiveObjectionArticle(null)}
        />
      )}

      {/* Sağ Alt Yüzen "Yukarı Çık" ve Hızlı Arama Gezgini */}
      {showScrollTop && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2 animate-fade-in">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="p-3 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-amber-400 border border-slate-700 shadow-2xl transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title={t('search_placeholder', lang)}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'tr' ? 'Hızlı Ara' : 'Search'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-3.5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-2xl shadow-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
            title={lang === 'tr' ? 'Sayfa Başına Çık' : 'Back to Top'}
          >
            <ArrowUp className="w-4 h-4" />
            <span>{lang === 'tr' ? 'Yukarı Çık' : 'Top'}</span>
          </button>
        </div>
      )}
    </div>
  );
}