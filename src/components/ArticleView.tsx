import React, { useEffect, useState, useRef, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  Tag,
  CheckCircle,
  FunctionSquare,
  Languages,
  Loader2,
  BookOpen,
  Eye,
  ShieldCheck,
  Mail,
  Linkedin,
  Type,
  Maximize2,
  Minimize2,
  List,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Columns2,
  FileSpreadsheet,
  Printer,
  GraduationCap,
  Award,
  BookMarked,
  Hash
} from 'lucide-react';
import { Article, ArticleSiteReads } from '../types';
import { MathRenderer } from './MathRenderer';
import { DialecticalTriadView } from './DialecticalTriadView';
import { ObjectionBox } from './ObjectionBox';
import { ArticleObjectionQA } from './ArticleObjectionQA';
import { ArticleIllustration } from './ArticleIllustration';
import {
  InlineSectionFigure,
  ArticleDiagramsSuite,
  ArticleInteractiveSimulationLab
} from './ArticleVisualsAndDiagrams';
import { AudioReader } from './AudioReader';
import { InlineRelatedLinksBox, RelatedArticlesSection } from './RelatedArticlesSection';
import { ScholarlyCitationBox } from './ScholarlyCitationBox';
import { ArticlePromotionBar } from './PromotionSuite';
import { ARTICLES } from '../data/articles';
import { INITIAL_ARTICLE_SITE_READS, ALL_8_WEBSITES_STATS } from '../data/baselineStats';
import {
  SUPPORTED_LANGUAGES,
  getTranslatedArticle,
  translateFullArticle,
  subscribeToTranslationUpdates,
  detectArticleNativeLang,
  t
} from '../utils/translations';
import {
  getArticleScholarlyIdentifiers,
  generateStructuredAbstract,
  generateAcademicReferences,
  tsScholar
} from '../utils/scholarlyIndexing';
import { isRunningAsInstalledApp } from '../utils/authorShield';

type FontScale = 'sm' | 'base' | 'lg' | 'xl';
type ColumnLayoutMode = 'single' | 'double';

interface ArticleViewProps {
  article: Article;
  allArticles?: Article[];
  lang?: string;
  articleMetrics?: ArticleSiteReads;
  articleStatsMap?: Record<string, ArticleSiteReads>;
  onLanguageChange?: (newLang: string) => void;
  onSelectArticle?: (slug: string) => void;
  onBack: () => void;
  onTrackEvent?: (type: string, details: string, siteId?: string, articleSlug?: string) => void;
  isAuthorShieldActive?: boolean;
  theme?: 'dark' | 'paper';
  onToggleTheme?: () => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  allArticles = ARTICLES,
  lang = 'tr',
  articleMetrics,
  articleStatsMap,
  onLanguageChange,
  onSelectArticle,
  onBack,
  onTrackEvent,
  theme = 'dark',
  onToggleTheme
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationVersion, setTranslationVersion] = useState<number>(0);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const [fontScale, setFontScale] = useState<FontScale>(() => {
    if (typeof window === 'undefined') return 'base';
    return (localStorage.getItem('sciphi_reader_font_size') as FontScale) || 'base';
  });
  const [columnLayout, setColumnLayout] = useState<ColumnLayoutMode>(() => {
    if (typeof window === 'undefined') return 'single';
    return (localStorage.getItem('sciphi_reader_columns') as ColumnLayoutMode) || 'single';
  });
  const [isLatexPreprintMode, setIsLatexPreprintMode] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [showToc, setShowToc] = useState<boolean>(true);
  const [showSiteBreakdown, setShowSiteBreakdown] = useState<boolean>(true);
  const [copiedParagraphNotice, setCopiedParagraphNotice] = useState<string | null>(null);
  const [highlightedRefIndex, setHighlightedRefIndex] = useState<number | null>(null);
  const [highlightedParaIndex, setHighlightedParaIndex] = useState<number | null>(null);

  const scrollTracked = useRef<Record<number, boolean>>({});
  const lastTrackedSlug = useRef<string | null>(null);
  const prevArticleSlugRef = useRef<string | null>(article.slug);

  useEffect(() => {
    try {
      localStorage.setItem('sciphi_reader_font_size', fontScale);
    } catch {
      // ignore
    }
  }, [fontScale]);

  useEffect(() => {
    try {
      localStorage.setItem('sciphi_reader_columns', columnLayout);
    } catch {
      // ignore
    }
  }, [columnLayout]);

  useEffect(() => {
    return subscribeToTranslationUpdates(() => {
      setTranslationVersion((v) => v + 1);
    });
  }, []);

  // Hedef dil değiştiğinde makalenin tam doğal dil çevirisini getir ve önbelleğe yaz
  useEffect(() => {
    let cancelled = false;
    const native = detectArticleNativeLang(article);
    if (native === lang && lang === 'tr') {
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    translateFullArticle(article, lang)
      .then(() => {
        if (!cancelled) {
          setTranslationVersion((v) => v + 1);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsTranslating(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.slug, lang]);

  useEffect(() => {
    if (prevArticleSlugRef.current !== article.slug) {
      prevArticleSlugRef.current = article.slug;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      scrollTracked.current = {};
      setReadingProgress(0);
      setHighlightedRefIndex(null);
      setHighlightedParaIndex(null);
    }

    const isInstalledApp = isRunningAsInstalledApp();
    const targetSite = 'emre-pelit-sci-phi';

    if (onTrackEvent && lastTrackedSlug.current !== article.slug) {
      lastTrackedSlug.current = article.slug;
      onTrackEvent(
        isInstalledApp ? 'pwa_app_read' : 'article_read',
        `${article.title}${isInstalledApp ? ' (Uygulama / PWA)' : ''}`,
        targetSite,
        article.slug
      );
    }

    const timer = setTimeout(() => {
      if (onTrackEvent) {
        onTrackEvent('article_engaged_10s', `${article.title} (10s active read)`, targetSite, article.slug);
      }
    }, 10000);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (height <= 0) {
        setReadingProgress(0);
        return;
      }
      const percent = Math.min(100, Math.max(0, Math.round((scrollY / height) * 100)));
      setReadingProgress(percent);

      [25, 50, 75, 90].forEach((milestone) => {
        if (percent >= milestone && !scrollTracked.current[milestone]) {
          scrollTracked.current[milestone] = true;
          if (onTrackEvent) {
            onTrackEvent('scroll_depth', `${article.title} - %${milestone} okundu`, targetSite, article.slug);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article.slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
      if (onTrackEvent) {
        onTrackEvent('social_share', article.title, 'emre-pelit-sci-phi', article.slug);
      }
    }
  };

  const handleFormulaClick = (formulaTitle: string) => {
    if (onTrackEvent) {
      onTrackEvent('formula_interaction', `${article.title}: ${formulaTitle}`, 'emre-pelit-sci-phi', article.slug);
    }
  };

  const handleGlobalLangSwitch = (newLang: string) => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    if (onTrackEvent) {
      onTrackEvent('language_change', `Site & Article switched to ${newLang.toUpperCase()}`);
    }
  };

  // Seçili hedef dile göre çevrilmiş makale ve akademik kimlikler
  const translated = getTranslatedArticle(article, lang);
  void translationVersion;

  const scholarlyId = useMemo(
    () => getArticleScholarlyIdentifiers(translated),
    [translated]
  );

  const structuredAbstract = useMemo(
    () => generateStructuredAbstract(translated, lang),
    [translated, lang]
  );

  const academicReferences = useMemo(() => {
    const rawRefs = generateAcademicReferences(translated, allArticles);
    return rawRefs.map((ref) => {
      if (ref.isInternalCorpus && ref.internalSlug) {
        const match = allArticles.find((a) => a.slug === ref.internalSlug);
        if (match) {
          const tPeer = getTranslatedArticle(match, lang);
          return {
            ...ref,
            title: tPeer.title
          };
        }
      }
      return ref;
    });
  }, [translated, allArticles, lang]);

  const resolvedMetrics =
    articleMetrics || INITIAL_ARTICLE_SITE_READS.find((item) => item.slug === article.slug);
  const total8SitesReads = resolvedMetrics ? resolvedMetrics.totalReads : 0;
  const total8SitesViews = resolvedMetrics
    ? resolvedMetrics.totalViews || Math.round(resolvedMetrics.totalReads * 1.35)
    : 0;

  // Otomatik Akademik Bölümleme (Eğer ham metinde ## başlığı yoksa paragrafları 3 numaralı akademik kesite ayırır)
  const autoSectionTitles = useMemo(() => {
    const titlesByLang: Record<string, [string, string, string]> = {
      tr: [
        'Kuramsal Giriş ve Problematik Çerçeve',
        'Analitik İnceleme ve Ontolojik Argümantasyon',
        'Diyalektik Sentez ve Epistemik Çıkarımlar'
      ],
      en: [
        'Theoretical Introduction & Problematic Framework',
        'Analytical Investigation & Ontological Argumentation',
        'Dialectical Synthesis & Epistemic Implications'
      ],
      de: [
        'Theoretische Einführung und Problemstellung',
        'Analytische Untersuchung und Ontologische Argumentation',
        'Dialektische Synthese und Epistemische Schlussfolgerungen'
      ],
      fr: [
        'Introduction Théorique et Cadre Problématique',
        'Analyse Conceptuelle et Argumentation Ontologique',
        'Synthèse Dialectique et Implications Épistémiques'
      ],
      es: [
        'Introducción Teórica y Marco Problemático',
        'Análisis Conceptual y Argumentación Ontológica',
        'Síntesis Dialéctica e Implicaciones Epistémicas'
      ],
      it: [
        'Introduzione Teorica e Quadro Problematico',
        'Analisi Concettuale e Argomentazione Ontologica',
        'Sintesi Dialettica e Implicazioni Epistemiche'
      ],
      ru: [
        'Теоретическое введение и проблемная рамка',
        'Аналитическое исследование и онтологическая аргументация',
        'Диалектический синтез и эпистемические выводы'
      ],
      ar: [
        'مقدمة نظرية وإطار إشكالي',
        'تحليل مفاهيمي وحجاج أنطولوجي',
        'تركيب جدلي واستنتاجات إبستمولوجية'
      ],
      zh: [
        '理论导论与问题框架',
        '分析性考察与本体论论证',
        '辩证合题与认识论推论'
      ],
      ja: [
        '理論的序論と問題枠組み',
        '分析的考察と存在論的論証',
        '弁証法的ジンテーゼと認識論的帰結'
      ]
    };
    return titlesByLang[lang] || titlesByLang.en;
  }, [lang]);

  // Makale başlıklarından otomatik Numaralı İçindekiler (Table of Contents) oluştur
  const tableOfContents = useMemo(() => {
    const lines = (translated.content || '').split('\n');
    const items: { id: string; text: string; sectionNum: string; level: 2 | 3 }[] = [];
    let h2Count = 0;
    let h3Count = 0;

    lines.forEach((line, idx) => {
      if (line.startsWith('## ')) {
        h2Count += 1;
        h3Count = 0;
        const rawText = line.replace('## ', '').replace(/\*\*/g, '').replace(/^\d+[\.\)]\s*/, '').trim();
        const sectionNum = `§ ${h2Count}.`;
        items.push({
          id: `sec-h-${idx}`,
          text: `${sectionNum} ${rawText}`,
          sectionNum,
          level: 2
        });
      } else if (line.startsWith('### ')) {
        if (h2Count === 0) h2Count = 1;
        h3Count += 1;
        const rawText = line.replace('### ', '').replace(/\*\*/g, '').replace(/^\d+[\.\)]\s*/, '').trim();
        const sectionNum = `§ ${h2Count}.${h3Count}.`;
        items.push({
          id: `sec-h-${idx}`,
          text: `${sectionNum} ${rawText}`,
          sectionNum,
          level: 3
        });
      }
    });

    if (items.length === 0) {
      const nonEmptyParas = lines.filter((l) => l.trim().length > 0 && !l.startsWith('- '));
      autoSectionTitles.forEach((title, sIdx) => {
        if (sIdx === 0 || nonEmptyParas.length >= (sIdx + 1) * 2) {
          items.push({
            id: `sec-auto-${sIdx + 1}`,
            text: `§ ${sIdx + 1}. ${title}`,
            sectionNum: `§ ${sIdx + 1}.`,
            level: 2
          });
        }
      });
    }

    return items;
  }, [translated.content, autoSectionTitles]);

  const paragraphClassByScale: Record<FontScale, string> = {
    sm: 'text-sm leading-relaxed my-3',
    base: 'text-sm md:text-base leading-relaxed my-3.5',
    lg: 'text-base md:text-lg leading-loose my-4',
    xl: 'text-lg md:text-xl leading-loose my-5'
  };

  const summaryClassByScale: Record<FontScale, string> = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed',
    xl: 'text-lg sm:text-xl leading-relaxed'
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCitationBadgeClick = (refIndex: number) => {
    setHighlightedRefIndex(refIndex);
    scrollToSection(`academic-ref-${refIndex}`);
    setTimeout(() => {
      setHighlightedRefIndex((prev) => (prev === refIndex ? null : prev));
    }, 3500);
  };

  const handleCopyParagraphReference = (paraNumber: number, sectionLabel: string) => {
    const citeText = `Pelit, E. (${scholarlyId.publicationYear}). ${translated.title}, ${sectionLabel}, [¶ ${paraNumber}]. ${scholarlyId.journalAbbrev}, ${scholarlyId.volume}(${scholarlyId.issue}), pp. ${scholarlyId.firstPage}–${scholarlyId.lastPage}. https://doi.org/${scholarlyId.doi}`;
    navigator.clipboard?.writeText(citeText);
    setHighlightedParaIndex(paraNumber);
    setCopiedParagraphNotice(`${tsScholar('paragraph_cite_copied', lang)} [¶ ${paraNumber}]`);
    setTimeout(() => {
      setCopiedParagraphNotice(null);
      setHighlightedParaIndex((prev) => (prev === paraNumber ? null : prev));
    }, 2800);
  };

  const renderInlineFormatting = (text: string): React.ReactNode[] => {
    const tokenRegex = /(\$[^$\n]+\$|\*\*[^*\n]+\*\*|\*[^*\n]+\*)/g;
    const parts = text.split(tokenRegex);
    return parts.map((part, i) => {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const latex = part.slice(1, -1);
        return <MathRenderer key={i} formula={latex} displayMode={false} />;
      }
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={i} className="font-bold text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <em key={i} className="italic text-amber-200/90">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  const renderMarkdown = (text: string) => {
    const lines = (text || '').split('\n');
    const hasH2 = lines.some((l) => l.startsWith('## '));
    const hasH3 = lines.some((l) => l.startsWith('### '));
    const totalNonEmptyParas = lines.filter(
      (l) => l.trim().length > 0 && !l.startsWith('## ') && !l.startsWith('### ') && !l.startsWith('- ')
    ).length;

    let sectionFigureCounter = 0;
    let nonEmptyParagraphCounter = 0;
    let h2Number = 0;
    let h3Number = 0;
    let currentSectionLabel = '§ 1';

    const sec2TriggerPara = Math.max(3, Math.floor(totalNonEmptyParas / 3) + 1);
    const sec3TriggerPara = Math.max(5, Math.floor((totalNonEmptyParas * 2) / 3) + 1);

    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        if (h2Number === 0) h2Number = 1;
        h3Number += 1;
        const rawHeading = line.replace('### ', '').replace(/\*\*/g, '').replace(/^\d+[\.\)]\s*/, '').trim();
        const numberedHeading = `§ ${h2Number}.${h3Number}. ${rawHeading}`;
        currentSectionLabel = `§ ${h2Number}.${h3Number}`;

        const shouldShowInlineFig = !hasH2 && sectionFigureCounter < 3;
        const figIdx = sectionFigureCounter;
        if (shouldShowInlineFig) sectionFigureCounter += 1;

        return (
          <React.Fragment key={idx}>
            <h3
              id={`sec-h-${idx}`}
              className="academic-column-span-all scroll-mt-28 text-lg sm:text-xl font-bold text-white mt-8 mb-3 border-l-4 border-amber-500 pl-3 font-serif flex items-center gap-2"
            >
              <span className="notranslate font-mono text-xs px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                § {h2Number}.{h3Number}
              </span>
              <span>{renderInlineFormatting(rawHeading)}</span>
            </h3>
            {shouldShowInlineFig && (
              <div className="academic-column-span-all">
                <InlineSectionFigure
                  article={translated}
                  sectionTitle={numberedHeading}
                  sectionIndex={figIdx}
                  lang={lang}
                />
              </div>
            )}
          </React.Fragment>
        );
      }

      if (line.startsWith('## ')) {
        h2Number += 1;
        h3Number = 0;
        const rawHeading = line.replace('## ', '').replace(/\*\*/g, '').replace(/^\d+[\.\)]\s*/, '').trim();
        const numberedHeading = `§ ${h2Number}. ${rawHeading}`;
        currentSectionLabel = `§ ${h2Number}`;

        const shouldShowInlineFig = sectionFigureCounter < 3;
        const figIdx = sectionFigureCounter;
        if (shouldShowInlineFig) sectionFigureCounter += 1;

        return (
          <React.Fragment key={idx}>
            <h2
              id={`sec-h-${idx}`}
              className="academic-column-span-all scroll-mt-28 text-xl sm:text-2xl font-black text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800 font-serif flex items-center gap-2.5"
            >
              <span className="notranslate font-mono text-sm px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                § {h2Number}.
              </span>
              <span>{renderInlineFormatting(rawHeading)}</span>
            </h2>
            {shouldShowInlineFig && (
              <div className="academic-column-span-all">
                <InlineSectionFigure
                  article={translated}
                  sectionTitle={numberedHeading}
                  sectionIndex={figIdx}
                  lang={lang}
                />
              </div>
            )}
          </React.Fragment>
        );
      }

      if (line.startsWith('- ')) {
        return (
          <li
            key={idx}
            className={`text-slate-300 ml-5 list-disc font-serif ${paragraphClassByScale[fontScale]}`}
          >
            {renderInlineFormatting(line.replace('- ', ''))}
          </li>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-2.5" />;
      }

      nonEmptyParagraphCounter += 1;
      const paraNum = nonEmptyParagraphCounter;

      // Eğer makalede açık ## başlığı yoksa otomatik numaralı akademik bölüm başlıkları ekle
      let autoHeadingNode: React.ReactNode = null;
      if (!hasH2 && !hasH3) {
        if (paraNum === 1) {
          currentSectionLabel = '§ 1';
          autoHeadingNode = (
            <h2
              id="sec-auto-1"
              className="academic-column-span-all scroll-mt-28 text-xl sm:text-2xl font-black text-amber-300 mt-6 mb-4 pb-2 border-b border-slate-800 font-serif flex items-center gap-2.5"
            >
              <span className="notranslate font-mono text-sm px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                § 1.
              </span>
              <span>{autoSectionTitles[0]}</span>
            </h2>
          );
        } else if (paraNum === sec2TriggerPara && totalNonEmptyParas >= 4) {
          currentSectionLabel = '§ 2';
          autoHeadingNode = (
            <h2
              id="sec-auto-2"
              className="academic-column-span-all scroll-mt-28 text-xl sm:text-2xl font-black text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800 font-serif flex items-center gap-2.5"
            >
              <span className="notranslate font-mono text-sm px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                § 2.
              </span>
              <span>{autoSectionTitles[1]}</span>
            </h2>
          );
        } else if (paraNum === sec3TriggerPara && totalNonEmptyParas >= 6) {
          currentSectionLabel = '§ 3';
          autoHeadingNode = (
            <h2
              id="sec-auto-3"
              className="academic-column-span-all scroll-mt-28 text-xl sm:text-2xl font-black text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800 font-serif flex items-center gap-2.5"
            >
              <span className="notranslate font-mono text-sm px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                § 3.
              </span>
              <span>{autoSectionTitles[2]}</span>
            </h2>
          );
        }
      }

      const showFallbackFig =
        !hasH2 && !hasH3 && paraNum === 2 && sectionFigureCounter === 0;
      if (showFallbackFig) sectionFigureCounter += 1;

      // Metin İçi Tıklanabilir Akademik Atıf İndisi ([1], [2], ...)
      const assignedRef =
        academicReferences.length > 0 && paraNum <= academicReferences.length
          ? academicReferences[paraNum - 1]
          : academicReferences.length > 0 && paraNum % 2 === 1
          ? academicReferences[(paraNum - 1) % academicReferences.length]
          : null;

      const secLabelSnapshot = currentSectionLabel;
      const isHighlightedPara = highlightedParaIndex === paraNum;

      return (
        <React.Fragment key={idx}>
          {autoHeadingNode}
          <div
            id={`para-${paraNum}`}
            className={`group/para relative pl-9 sm:pl-11 transition-colors rounded-lg ${
              isHighlightedPara ? 'bg-amber-500/10 ring-1 ring-amber-500/40 p-2' : ''
            }`}
          >
            {/* Sol Kenar Akademik Paragraf Referans İndisi [¶ N] */}
            <button
              type="button"
              onClick={() => handleCopyParagraphReference(paraNum, secLabelSnapshot)}
              title={
                lang === 'tr'
                  ? `Paragraf Atıfını Kopyala (${secLabelSnapshot}, ¶ ${paraNum})`
                  : `Copy Paragraph Reference (${secLabelSnapshot}, ¶ ${paraNum})`
              }
              className="notranslate absolute left-0 top-1 px-1.5 py-0.5 rounded bg-slate-900/90 hover:bg-amber-500 text-slate-500 hover:text-slate-950 border border-slate-800 hover:border-amber-400 font-mono text-[10px] font-bold transition cursor-pointer select-none"
            >
              ¶{paraNum}
            </button>

            <p
              className={`text-slate-300 font-serif text-justify hyphens-auto ${
                paragraphClassByScale[fontScale]
              } ${
                paraNum === 1
                  ? 'first-letter:text-3xl first-letter:font-black first-letter:text-amber-400 first-letter:mr-1.5 first-letter:float-left first-letter:leading-none'
                  : ''
              }`}
            >
              {renderInlineFormatting(line)}
              {assignedRef && (
                <sup className="ml-1 inline-block">
                  <button
                    type="button"
                    onClick={() => handleCitationBadgeClick(assignedRef.index)}
                    title={`[${assignedRef.index}] ${assignedRef.authors} (${assignedRef.year}). ${assignedRef.title}`}
                    className="notranslate px-1.5 py-0.2 rounded bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white border border-indigo-500/40 font-mono text-[10px] font-bold transition cursor-pointer"
                  >
                    [{assignedRef.index}]
                  </button>
                </sup>
              )}
            </p>
          </div>

          {showFallbackFig && (
            <div className="academic-column-span-all">
              <InlineSectionFigure
                article={translated}
                sectionTitle={translated.title}
                sectionIndex={0}
                lang={lang}
              />
            </div>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in relative">
      {/* Paragraf Atıf Kopyalandı Bildirimi (Toast) */}
      {copiedParagraphNotice && (
        <div className="fixed bottom-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-mono font-bold shadow-2xl border border-emerald-400 flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{copiedParagraphNotice}</span>
        </div>
      )}

      {/* Sabit Üst Okuma İlerleme Çubuğu (Reading Progress Bar) */}
      <div className="fixed top-16 left-0 right-0 z-40 h-1 bg-slate-900/80 pointer-events-none no-print">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Sabit (Sticky) Akademik Okuma ve Dizgi Kontrolleri Barı */}
      <div className="sticky top-16 z-30 bg-slate-950/90 backdrop-blur-md flex flex-wrap items-center justify-between mb-6 py-3 px-4 rounded-2xl border border-slate-800 shadow-lg gap-2.5 no-print">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-amber-400 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('back_to_essays', lang)}</span>
          </button>

          {/* Okuma Yüzdesi Rozeti */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-400"
            title={lang === 'tr' ? 'Okuma İlerlemesi' : 'Reading Progress'}
          >
            <span>{lang === 'tr' ? 'Okuma:' : 'Read:'}</span>
            <strong>%{readingProgress}</strong>
          </div>
        </div>

        {/* Akademik Dizgi, Sütun, LaTeX Preprint, Yazı Boyutu, Odak Modu ve Dil Araçları */}
        <div className="flex flex-wrap items-center gap-2">
          {isTranslating && (
            <span className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{lang === 'tr' ? 'Çevriliyor...' : 'Translating...'}</span>
            </span>
          )}

          {/* Tek Sütun (Tez) / Çift Sütun (Akademik Dergi) Seçici */}
          <div
            className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs"
            title={
              lang === 'tr'
                ? 'Akademik Dizgi Düzeni: Tek Sütun (Tez) veya Çift Sütun (IEEE / Nature Dergi Formatı)'
                : 'Academic Layout: Single Column (Thesis) or Two-Column (IEEE / Nature Journal Format)'
            }
          >
            <button
              type="button"
              onClick={() => setColumnLayout('single')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                columnLayout === 'single'
                  ? 'bg-indigo-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tsScholar('single_column_mode', lang)}
            </button>
            <button
              type="button"
              onClick={() => setColumnLayout('double')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer ${
                columnLayout === 'double'
                  ? 'bg-indigo-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns2 className="w-3 h-3" />
              <span>{tsScholar('two_column_mode', lang)}</span>
            </button>
          </div>

          {/* LaTeX / arXiv Baskıya Hazır Dergi Görünümü Seçici */}
          <button
            type="button"
            onClick={() => setIsLatexPreprintMode((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              isLatexPreprintMode
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                : 'bg-slate-900 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/15'
            }`}
            title={tsScholar('latex_preprint_mode', lang)}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{tsScholar('latex_preprint_mode', lang)}</span>
            <span className="md:hidden font-mono">LaTeX/arXiv</span>
          </button>

          {/* Yazı Boyutu Seçici (A- / A / A+ / A++) */}
          <div
            className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs"
            title={lang === 'tr' ? 'Okuma Yazı Boyutu' : 'Reading Font Size'}
          >
            <Type className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 hidden sm:inline" />
            {(
              [
                { id: 'sm', label: 'A-' },
                { id: 'base', label: 'A' },
                { id: 'lg', label: 'A+' },
                { id: 'xl', label: 'A++' }
              ] as { id: FontScale; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFontScale(item.id)}
                className={`px-2 py-1 rounded-lg font-mono text-[11px] transition cursor-pointer ${
                  fontScale === item.id
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Odaklanmış Okuma Modu (Yan Paneli Gizle / Göster) */}
          <button
            type="button"
            onClick={() => setIsFocusMode((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              isFocusMode
                ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
            }`}
            title={
              lang === 'tr'
                ? 'Odaklanmış Okuma Modu (Yan Çubuğu Gizle ve Metni Ortala)'
                : 'Focus Reading Mode (Hide Sidebar & Center Text)'
            }
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden xl:inline">
              {isFocusMode
                ? lang === 'tr'
                  ? 'Normal'
                  : 'Standard'
                : lang === 'tr'
                ? 'Odak'
                : 'Focus'}
            </span>
          </button>

          {/* Tema Seçici (Kağıt / Gece) */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                theme === 'paper'
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
              title={lang === 'tr' ? 'Açık Akademik Kağıt / Gece Teması' : 'Academic Paper / Dark Theme'}
            >
              {theme === 'paper' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
              <span className="hidden sm:inline">
                {theme === 'paper' ? (lang === 'tr' ? 'Gece' : 'Dark') : (lang === 'tr' ? 'Kağıt' : 'Paper')}
              </span>
            </button>
          )}

          {/* Küresel Dil Seçici */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-amber-500/40 rounded-xl px-2.5 py-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={lang}
              onChange={(e) => handleGlobalLangSwitch(e.target.value)}
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-950 text-slate-200">
                  {l.flag} {l.nativeName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleShare}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copiedLink ? t('copied', lang) : t('share', lang)}</span>
          </button>
        </div>
      </div>

      {/* Ana Mimari: Odak Modu veya LaTeX Preprint Açıkken Ortalanmış Geniş Dergi Sayfası, Normalde 8+4 Sütun */}
      <div className={isFocusMode || isLatexPreprintMode ? 'max-w-5xl mx-auto' : 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'}>
        <div
          className={`${isFocusMode || isLatexPreprintMode ? 'w-full' : 'lg:col-span-8 min-w-0'} ${
            isLatexPreprintMode
              ? 'latex-preprint-sheet rounded-none sm:rounded-lg p-6 sm:p-12 md:p-14 relative'
              : ''
          }`}
        >
          {/* LaTeX / arXiv Preprint Modu Sol Kenar Dikey arXiv Damgası ve Üst Baskı Çubuğu */}
          {isLatexPreprintMode && (
            <div className="mb-6 pb-4 border-b-2 border-slate-900 flex flex-wrap items-center justify-between gap-3">
              <div className="font-mono text-xs text-slate-700">
                <strong className="text-slate-950">{scholarlyId.arxivStamp}</strong> • Submitted to{' '}
                <em>{scholarlyId.journalTitle}</em> (e-ISSN: {scholarlyId.eIssn})
              </div>
              <div className="flex items-center gap-2 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded bg-slate-900 text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-slate-800 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{lang === 'tr' ? 'Doğrudan Yazdır / PDF Kaydet' : 'Print / Save as PDF'}</span>
                </button>
                <a
                  href={`/scholar/pdf/${encodeURIComponent(article.slug)}.html?lang=${lang}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded bg-indigo-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-indigo-600 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{tsScholar('fulltext_pdf_btn', lang)}</span>
                </a>
              </div>
            </div>
          )}

          {/* 1. RESMİ AKADEMİK DERGİ ANTETİ (OFFICIAL JOURNAL RUNNING HEADER & PEER-REVIEW BANNER) */}
          <div className="mb-6 rounded-2xl bg-slate-900/95 border border-indigo-500/30 p-4 sm:p-5 shadow-md latex-box">
            {/* Üst Dergi Künyesi Satırı */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{scholarlyId.journalTitle}</span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 latex-muted">
                  e-ISSN: <strong className="text-slate-200">{scholarlyId.eIssn}</strong> • Vol.{' '}
                  <strong className="text-slate-200">{scholarlyId.volume}</strong>, Issue{' '}
                  <strong className="text-slate-200">{scholarlyId.issue}</strong>, pp.{' '}
                  <strong className="text-slate-200">
                    {scholarlyId.firstPage}–{scholarlyId.lastPage}
                  </strong>{' '}
                  • Art. No: <span className="notranslate text-amber-400">{scholarlyId.articleNumber}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{tsScholar('article_type_research', lang)}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{tsScholar('peer_reviewed_badge', lang)}</span>
                </span>
              </div>
            </div>

            {/* Alt DOI, arXiv ve Hakem Tarihleri Künyesi */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-300">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>
                  <strong className="text-slate-400">{tsScholar('received_label', lang)}:</strong>{' '}
                  {scholarlyId.receivedDateIso}
                </span>
                <span>
                  <strong className="text-slate-400">{tsScholar('revised_label', lang)}:</strong>{' '}
                  {scholarlyId.revisedDateIso}
                </span>
                <span>
                  <strong className="text-slate-400">{tsScholar('accepted_label', lang)}:</strong>{' '}
                  {scholarlyId.acceptedDateIso}
                </span>
                <span>
                  <strong className="text-emerald-400">{tsScholar('published_label', lang)}:</strong>{' '}
                  {scholarlyId.publicationDateIso}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={scholarlyId.doiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="notranslate px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:underline text-[10px]"
                >
                  DOI: {scholarlyId.doi}
                </a>
                <span className="notranslate px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/40 text-sky-300 text-[10px]">
                  {scholarlyId.arxivStamp}
                </span>
              </div>
            </div>
          </div>

          {/* Makale Başlığı ve Resmi Akademik Yazar / Kurum / ORCID Künyesi */}
          <header className={`space-y-4 mb-6 ${isLatexPreprintMode ? 'text-center' : ''}`}>
            <div className={`flex flex-wrap items-center gap-2 ${isLatexPreprintMode ? 'justify-center' : ''}`}>
              <span className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold uppercase tracking-wider">
                {translated.categoryTitle}
              </span>
              <span className="notranslate text-xs text-slate-400 font-mono">
                PACS: {scholarlyId.pacsCodes} • MSC2020: {scholarlyId.mscCodes}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight font-serif">
              {translated.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-400 font-serif italic leading-relaxed latex-muted">
              {translated.subtitle}
            </p>

            {/* Akademik Yazar, Kurum (Affiliation), ORCID ve Sorumlu Yazar Dipnotu */}
            <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-xs latex-box text-left">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-sm font-bold text-white font-serif">
                    {scholarlyId.authorName}
                    <sup className="text-amber-400 font-mono ml-0.5">1,*</sup>
                  </span>
                  <a
                    href={scholarlyId.authorOrcidUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="notranslate inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] hover:underline"
                  >
                    <span>ORCID: {scholarlyId.authorOrcid}</span>
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{article.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{article.readTime}</span>
                  </span>
                  <span>{scholarlyId.wordCount} words</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 font-serif space-y-0.5 pt-1 border-t border-slate-800/80 latex-muted">
                <p>
                  <sup className="text-amber-400 font-mono mr-1">1</sup>
                  {scholarlyId.authorAffiliation}
                </p>
                <p>
                  <sup className="text-amber-400 font-mono mr-1">*</sup>
                  <strong>{tsScholar('corresponding_author_label', lang)}:</strong>{' '}
                  <a href={`mailto:${scholarlyId.authorEmail}`} className="text-amber-400 hover:underline font-mono">
                    {scholarlyId.authorEmail}
                  </a>
                  {resolvedMetrics && (
                    <span className="ml-3 font-mono text-emerald-400">
                      • {total8SitesReads.toLocaleString('tr-TR')} {lang === 'tr' ? 'Net Okunma' : 'Net Reads'} /{' '}
                      {total8SitesViews.toLocaleString('tr-TR')} {lang === 'tr' ? 'Görüntülenme' : 'Views'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </header>

          {/* Ana Kavramsal Görsel & Şematik İllüstrasyon (Figure 1) */}
          <figure className="mb-8 rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-800 shadow-lg latex-box">
            <ArticleIllustration
              slug={article.slug}
              category={article.category}
              title={translated.title}
              subtitle={translated.subtitle}
              tags={translated.tags}
              formula={translated.mathFormulations?.[0]?.latex}
              formulaTitle={translated.mathFormulations?.[0]?.title}
              subTopicLabel={translated.categoryTitle}
              figureNumber={1}
              thesisSummary={translated.dialecticalTriad?.synthesis || translated.summary}
              variant="banner"
              className="h-60 sm:h-76 md:h-88 w-full rounded-none border-0"
            />
            <figcaption className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 font-serif flex flex-wrap items-center justify-between gap-2 latex-box">
              <span>
                <strong className="text-amber-400 font-sans">
                  {lang === 'tr' ? 'Şekil 1 (Figure 1 — Kavramsal Topoloji):' : 'Figure 1 (Conceptual Topology):'}
                </strong>{' '}
                {translated.title} — {translated.subtitle}
              </span>
              <span className="font-mono text-[10px] text-emerald-400">
                DOI: {scholarlyId.doi}
              </span>
            </figcaption>
          </figure>

          {/* 2. YAPILANDIRILMIŞ AKADEMİK ÖZET KUTUSU VE KONU KODLARI (STRUCTURED ABSTRACT & CLASSIFICATION CODES) */}
          <section
            id="sec-executive-summary"
            className="scroll-mt-28 p-5 sm:p-6 rounded-2xl bg-slate-900/95 border-l-4 border-amber-500 border-y border-r border-slate-800 mb-8 shadow-lg space-y-4 latex-box"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tsScholar('structured_abstract_title', lang)}</span>
              </h4>
              <span className="notranslate text-[10px] font-mono text-slate-400">
                PhilPapers ID: {scholarlyId.philPapersId}
              </span>
            </div>

            {/* 4 Boyutlu Yapılandırılmış Özet Grid'i (Objective, Methodology, Findings, Originality) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-serif">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 latex-box">
                <span className="font-sans font-bold text-[11px] text-amber-400 uppercase tracking-wide block mb-1">
                  {tsScholar('abstract_objective', lang)}
                </span>
                <p className="text-slate-200 leading-relaxed text-justify">{structuredAbstract.objective}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 latex-box">
                <span className="font-sans font-bold text-[11px] text-sky-400 uppercase tracking-wide block mb-1">
                  {tsScholar('abstract_methodology', lang)}
                </span>
                <p className="text-slate-200 leading-relaxed text-justify">{structuredAbstract.methodology}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 latex-box">
                <span className="font-sans font-bold text-[11px] text-emerald-400 uppercase tracking-wide block mb-1">
                  {tsScholar('abstract_findings', lang)}
                </span>
                <p className="text-slate-200 leading-relaxed text-justify">{structuredAbstract.findings}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 latex-box">
                <span className="font-sans font-bold text-[11px] text-purple-400 uppercase tracking-wide block mb-1">
                  {tsScholar('abstract_originality', lang)}
                </span>
                <p className="text-slate-200 leading-relaxed text-justify">{structuredAbstract.originality}</p>
              </div>
            </div>

            {/* Bütüncül Özet Metni */}
            <div className="pt-2 border-t border-slate-800/80">
              <p className={`text-slate-200 font-serif text-justify ${summaryClassByScale[fontScale]}`}>
                {translated.summary}
              </p>
            </div>

            {/* Anahtar Kelimeler (Keywords) & PACS / MSC / JEL / arXiv Konu Kodları */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <strong className="text-amber-400 uppercase tracking-wider text-[11px]">
                  {tsScholar('keywords_label', lang)}:
                </strong>
                <span className="font-serif italic text-slate-300">
                  {[translated.categoryTitle, ...(translated.tags || []), 'Dialectical Epistemology'].join(' • ')}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
                <span className="text-slate-300 font-semibold">
                  {tsScholar('classification_codes_label', lang)}:
                </span>
                <span className="notranslate px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-sky-300">
                  arXiv: {scholarlyId.arxivSubjectClass}
                </span>
                <span className="notranslate px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-300">
                  PACS: {scholarlyId.pacsCodes}
                </span>
                <span className="notranslate px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300">
                  MSC2020: {scholarlyId.mscCodes}
                </span>
              </div>
            </div>
          </section>

          {/* Çok Dilli Sesli Okuma Bileşeni */}
          <div className="no-print">
            <AudioReader
              article={translated}
              currentLang={lang}
              onLanguageChange={handleGlobalLangSwitch}
              onTrackEvent={onTrackEvent}
            />
          </div>

          {/* 7 Tanıtım & Akademik Yayılım Aracı Çubuğu (PNG Alıntı Kartı, X Flood, LinkedIn, <iframe> Widget, /llms.txt, /podcast.xml) */}
          <div className="no-print">
            <ArticlePromotionBar
              article={translated}
              lang={lang}
              readsCount={total8SitesReads}
              onTrackEvent={onTrackEvent}
            />
          </div>

          {/* Otomatik Numaralı İçindekiler & Bölüm Gezgini (Table of Contents) */}
          <div className="mb-6 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden latex-box no-print">
            <button
              type="button"
              onClick={() => setShowToc((prev) => !prev)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-800/50 transition cursor-pointer"
            >
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <List className="w-4 h-4" />
                <span>
                  {lang === 'tr'
                    ? 'Numaralı Akademik İçindekiler & Kesit Gezgini (§)'
                    : 'Numbered Academic Table of Contents (§)'}
                </span>
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span>{showToc ? (lang === 'tr' ? 'Gizle' : 'Hide') : (lang === 'tr' ? 'Göster' : 'Show')}</span>
                {showToc ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </span>
            </button>

            {showToc && (
              <div className="px-4 pb-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('sec-executive-summary')}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-amber-400 transition cursor-pointer font-mono"
                >
                  § 0. Abstract
                </button>
                {tableOfContents.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs transition cursor-pointer ${
                      item.level === 2 ? 'text-amber-300 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    {item.text}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => scrollToSection('sec-article-simulator')}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-emerald-500/50 text-xs text-emerald-300 font-bold transition cursor-pointer"
                >
                  • {lang === 'tr' ? 'Canlı Makale Simülasyonu' : 'Live Article Simulation'}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('sec-visual-diagrams')}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-amber-500/40 text-xs text-amber-300 font-semibold transition cursor-pointer"
                >
                  • {lang === 'tr' ? 'Görsel Modeller & 4 Diyagram' : 'Visual Models & 4 Diagrams'}
                </button>
                {translated.mathFormulations && translated.mathFormulations.length > 0 && (
                  <button
                    type="button"
                    onClick={() => scrollToSection('sec-math-formulations')}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-sky-500/30 text-xs text-sky-300 transition cursor-pointer"
                  >
                    • {t('math_formulations_title', lang)}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => scrollToSection('sec-academic-references')}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-emerald-500/30 text-xs text-emerald-300 font-semibold transition cursor-pointer"
                >
                  • {lang === 'tr' ? `Kaynakça [${academicReferences.length}]` : `References [${academicReferences.length}]`}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('sec-scholarly-citation')}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-indigo-500/30 text-xs text-indigo-300 transition cursor-pointer"
                >
                  • {lang === 'tr' ? 'Akademik Atıf & DOI' : 'Academic Citation & DOI'}
                </button>
              </div>
            )}
          </div>

          {/* Paragraf Referans ve Sütun Modu Bilgi Şeridi */}
          <div className="mb-4 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 latex-box no-print">
            <span className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {lang === 'tr'
                  ? 'Sol kenardaki [¶1, ¶2] indislerine tıklayarak doğrudan paragraf atıfı kopyalayabilir, [1, 2] indisleriyle kaynakçaya gidebilirsiniz.'
                  : 'Click [¶1, ¶2] margin markers to copy exact paragraph citations, or [1, 2] superscripts to jump to References.'}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setColumnLayout((prev) => (prev === 'single' ? 'double' : 'single'))}
              className="text-indigo-400 hover:underline font-mono font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Columns2 className="w-3 h-3" />
              <span>
                {columnLayout === 'double'
                  ? tsScholar('single_column_mode', lang)
                  : tsScholar('two_column_mode', lang)}
              </span>
            </button>
          </div>

          {/* 3. ANA MAKALE METNİ (TEK SÜTUN TEZ VEYA ÇİFT SÜTUN AKADEMİK DERGİ DİZGİSİ) */}
          <div
            className={`prose prose-invert max-w-none mb-10 ${
              columnLayout === 'double' ? 'academic-two-column' : ''
            }`}
          >
            {renderMarkdown(translated.content)}
          </div>

          {/* Her Makalenin Okuma Sayfasında Doğrudan Yer Alan Etkileşimli Makale Simülasyonu */}
          <ArticleInteractiveSimulationLab article={translated} lang={lang} />

          {/* Her Makaleye Özel 4'lü Etkileşimli Bilimsel & Felsefi Diyagramlar Paketi */}
          <ArticleDiagramsSuite article={translated} lang={lang} />

          {/* Numaralı Matematiksel Formülasyonlar (Denklem Numaraları (1), (2) ile) */}
          {translated.mathFormulations && translated.mathFormulations.length > 0 && (
            <section
              id="sec-math-formulations"
              className="scroll-mt-28 my-10 p-6 bg-slate-900/80 rounded-2xl border border-sky-900/30 latex-box"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                    <FunctionSquare className="w-4 h-4" />
                  </span>
                  <h3 className="text-base font-bold text-sky-300 uppercase tracking-wider">
                    {t('math_formulations_title', lang)}
                  </h3>
                </div>
                <span className="notranslate text-xs font-mono text-slate-400">
                  Eq. (1)–({translated.mathFormulations.length})
                </span>
              </div>
              <div className="space-y-6">
                {translated.mathFormulations.map((formula, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleFormulaClick(formula.title)}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 hover:border-sky-500/40 transition cursor-pointer group latex-box"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                      <span className="text-sky-400">
                        Teorem / Denklem {idx + 1}: {formula.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                        {formula.domain}
                      </span>
                    </div>
                    <div className="my-3 flex items-center justify-between bg-slate-900/60 p-4 rounded-lg gap-4">
                      <div className="flex-1 text-center overflow-x-auto">
                        <MathRenderer formula={formula.latex} displayMode={true} />
                      </div>
                      <span className="notranslate font-mono text-xs font-bold text-amber-400 shrink-0">
                        ({idx + 1})
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-serif leading-relaxed mt-2 pt-2 border-t border-slate-800/80 latex-muted">
                      <strong className="text-slate-300 font-sans">{t('philosophical_meaning', lang)}</strong>{' '}
                      {formula.interpretation}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Diyalektik Üçleme */}
          {translated.dialecticalTriad && (
            <DialecticalTriadView
              triad={translated.dialecticalTriad}
              articleTitle={translated.title}
              lang={lang}
            />
          )}

          {/* Felsefi İtirazlar */}
          {translated.objections && translated.objections.length > 0 && (
            <ObjectionBox objections={translated.objections} lang={lang} />
          )}

          {/* 5. NUMARALI AKADEMİK KAYNAKÇA VE ATIF DİZİNİ (REFERENCES & CITED LITERATURE) */}
          <section
            id="sec-academic-references"
            className="scroll-mt-28 my-10 p-6 rounded-2xl bg-slate-900/95 border border-indigo-500/30 shadow-lg space-y-4 latex-box"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  {tsScholar('references_heading', lang)}
                </h3>
              </div>
              <span className="notranslate text-xs font-mono text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-500/30">
                [1]–[{academicReferences.length}] Peer-Cited Works
              </span>
            </div>

            <ol className="space-y-3 text-xs font-serif">
              {academicReferences.map((ref) => {
                const isHighlighted = highlightedRefIndex === ref.index;
                return (
                  <li
                    key={ref.index}
                    id={`academic-ref-${ref.index}`}
                    className={`scroll-mt-32 p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isHighlighted
                        ? 'bg-indigo-500/20 border-amber-400 ring-2 ring-amber-400/50'
                        : 'bg-slate-950/80 border-slate-800/90 hover:border-indigo-500/40'
                    } latex-box`}
                  >
                    <div className="flex items-start gap-2.5 leading-relaxed">
                      <span className="notranslate font-mono font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/30 text-[11px] shrink-0">
                        [{ref.index}]
                      </span>
                      <div className="text-slate-200">
                        <span className="font-bold text-white">{ref.authors}</span> ({ref.year}).{' '}
                        <span className="italic text-amber-200/90">“{ref.title}.”</span>{' '}
                        <span className="text-slate-300">{ref.source}.</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {ref.isInternalCorpus && ref.internalSlug && onSelectArticle ? (
                        <button
                          type="button"
                          onClick={() => onSelectArticle(ref.internalSlug!)}
                          className="notranslate px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 font-mono text-[10px] font-bold transition cursor-pointer"
                        >
                          Corpus DOI →
                        </button>
                      ) : (
                        <a
                          href={ref.doiOrUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="notranslate px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-slate-700 font-mono text-[10px] transition flex items-center gap-1"
                        >
                          <span>DOI / Ref</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Makale Altı: Web Sitelerindeki Toplam Okunma ve Görüntülenme Sayısı (Açılır/Kapanır 8 Site 301 Dağılımı) */}
          {resolvedMetrics && (
            <div className="my-8 p-5 rounded-2xl bg-slate-900/95 border border-emerald-500/30 shadow-lg space-y-4 no-print">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {lang === 'tr'
                        ? '8 WEB SİTESİ 301 OTORİTE AĞI TOPLAM OKUNMA VE GÖRÜNTÜLENME İSTATİSTİKLERİ'
                        : 'TOTAL READS & VIEWS ACROSS 8 WEBSITES (301 AUTHORITY NETWORK)'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[10px] font-semibold text-amber-300">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      {lang === 'tr' ? 'Ana Hedef: emre-pelit-sci-phi.ai.studio' : 'Primary Hub: emre-pelit-sci-phi.ai.studio'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSiteBreakdown((prev) => !prev)}
                    className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1 pt-1 cursor-pointer"
                  >
                    <span>
                      {showSiteBreakdown
                        ? lang === 'tr'
                          ? '8 Web Sitesi 301 Dağılımını Gizle'
                          : 'Hide 8-Website 301 Breakdown'
                        : lang === 'tr'
                        ? '8 Web Sitesi Bazında Ayrıntılı 301 Dağılımını Göster'
                        : 'Show Detailed 301 Breakdown Across 8 Websites'}
                    </span>
                    {showSiteBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                      {lang === 'tr' ? 'Toplam Net Okunma' : 'Total Net Reads'}
                    </span>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span className="text-lg font-black font-mono text-emerald-400">
                        {total8SitesReads.toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>

                  <div className="px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                      {lang === 'tr' ? 'Toplam Görüntülenme' : 'Total Views'}
                    </span>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <Eye className="w-4 h-4 text-sky-400" />
                      <span className="text-lg font-black font-mono text-sky-400">
                        {total8SitesViews.toLocaleString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {showSiteBreakdown && (
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {ALL_8_WEBSITES_STATS.map((site) => {
                    const count = resolvedMetrics.bySite[site.id] || 0;
                    const viewsCount = resolvedMetrics.viewsBySite?.[site.id] ?? Math.round(Number(count) * 1.35);
                    const isPrimaryHub = site.id === 'emre-pelit-sci-phi';
                    const isHighlighted = isPrimaryHub || site.id === 'sci-phil-legacy';
                    return (
                      <a
                        key={site.id}
                        href={`/go/301/${encodeURIComponent(site.id)}?slug=${encodeURIComponent(article.slug)}`}
                        className={`p-2.5 rounded-xl bg-slate-950/90 border flex flex-col justify-between transition ${
                          isPrimaryHub
                            ? 'border-emerald-500/70 bg-emerald-500/10 hover:border-emerald-400'
                            : isHighlighted
                            ? 'border-amber-500/60 bg-amber-500/10 hover:border-amber-400'
                            : 'border-slate-800/80 hover:border-amber-500/40'
                        }`}
                        title={`${site.domain} → Kalıcı HTTP 301 → emre-pelit-sci-phi.ai.studio`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[11px] font-mono truncate ${isPrimaryHub ? 'text-emerald-300 font-bold' : isHighlighted ? 'text-amber-300 font-bold' : 'text-slate-300'}`}>
                            {site.domain}
                          </span>
                          <span className={`text-[8px] font-mono shrink-0 ${isPrimaryHub ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                            {isPrimaryHub ? '★ Ana 301 Hub' : '301→Hub'}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between mt-1">
                          <span className="text-xs font-bold font-mono text-emerald-400">
                            {Number(count).toLocaleString('tr-TR')} okunma
                          </span>
                          <span className="text-[10px] font-mono text-sky-400">
                            {Number(viewsCount).toLocaleString('tr-TR')} gör.
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Makale Metni Altı Hızlı İlgili Yazı Bağlantıları */}
          <div className="no-print">
            <InlineRelatedLinksBox
              currentArticle={article}
              allArticles={allArticles}
              lang={lang}
              articleStatsMap={articleStatsMap}
              onSelectArticle={(slug) => {
                if (onSelectArticle) {
                  onSelectArticle(slug);
                } else {
                  window.location.href = `/makale/${slug}`;
                }
              }}
            />
          </div>

          {/* Makale İçi İtiraz & Soru Cevaplayıcı Motoru */}
          <div className="my-8 no-print">
            <ArticleObjectionQA
              article={translated}
              lang={lang}
              variant="inline"
              onTrackEvent={onTrackEvent}
            />
          </div>

          {/* Sokratik Sorgulama Soruları */}
          {translated.socraticQuestions && translated.socraticQuestions.length > 0 && (
            <section className="my-8 p-6 bg-slate-900/70 border border-slate-800 rounded-2xl latex-box">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  {t('socratic_questions_title', lang)}
                </h4>
              </div>
              <ul className="space-y-2">
                {translated.socraticQuestions.map((q, idx) => (
                  <li key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300 font-serif flex items-start gap-2 latex-box">
                    <span className="text-amber-400 font-sans font-bold">Q{idx + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Bilimsel Yayın & Akademik İndeks Künyesi */}
          <div id="sec-scholarly-citation" className="scroll-mt-28">
            <ScholarlyCitationBox article={translated} language={lang} />
          </div>

          {/* Alt Etiketler & İletişim & Dönüş */}
          <footer className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <div className="flex flex-wrap items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
              {translated.tags.map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a
                href="mailto:emrepelit39@gmail.com"
                className="flex items-center gap-1 text-xs text-amber-400 hover:underline font-mono"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>emrepelit39@gmail.com</span>
              </a>
              <a
                href="https://www.linkedin.com/in/emrepelit109"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-sky-400 hover:underline font-mono"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                {t('back_to_essays', lang)}
              </button>
            </div>
          </footer>
        </div>

        {/* Sağ Yan Sütun: Odak Modu ve LaTeX Preprint Modu Kapalıyken Görünür */}
        {!isFocusMode && !isLatexPreprintMode && (
          <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-4 no-print">
            {/* Makalenin Anlamsal Özeti, Diyalektik Çekirdeği ve Simülasyon Kısayol Kartı */}
            <div className="p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/30 shadow-lg space-y-3 text-xs">
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {lang === 'tr'
                      ? 'Anlamsal Çekirdek & Simülasyon'
                      : 'Semantic Core & Simulation'}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-amber-300">
                  {translated.categoryTitle}
                </span>
              </div>

              <div className="space-y-2 font-serif">
                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
                  <span className="font-sans font-bold text-[10px] uppercase text-sky-400 block mb-0.5">
                    {lang === 'tr' ? 'I. Başlangıç Öncülü (Tez):' : 'I. Opening Premise (Thesis):'}
                  </span>
                  <p className="text-slate-300 line-clamp-3 leading-relaxed">
                    {translated.dialecticalTriad?.thesis || structuredAbstract.objective}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800">
                  <span className="font-sans font-bold text-[10px] uppercase text-emerald-400 block mb-0.5">
                    {lang === 'tr' ? 'II. Ana Sentez & Sonuç:' : 'II. Core Synthesis & Finding:'}
                  </span>
                  <p className="text-slate-200 line-clamp-3 leading-relaxed">
                    {translated.dialecticalTriad?.synthesis || translated.summary}
                  </p>
                </div>

                {translated.mathFormulations?.[0] && (
                  <div className="p-2.5 rounded-xl bg-slate-950/90 border border-sky-500/30">
                    <span className="font-sans font-bold text-[10px] uppercase text-amber-400 block mb-1">
                      {lang === 'tr' ? 'III. Formel Model:' : 'III. Formal Model:'}
                    </span>
                    <p className="text-[11px] font-sans font-semibold text-white mb-1">
                      {translated.mathFormulations[0].title}
                    </p>
                    <div className="overflow-x-auto py-1">
                      <MathRenderer formula={translated.mathFormulations[0].latex} displayMode={false} />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => scrollToSection('sec-article-simulator')}
                  className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition cursor-pointer text-center"
                >
                  {lang === 'tr' ? '⚡ Simülasyona Git' : '⚡ Open Simulator'}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('sec-executive-summary')}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] border border-amber-500/30 transition cursor-pointer text-center"
                >
                  {lang === 'tr' ? '§ Abstract Künyesi' : '§ Abstract Info'}
                </button>
              </div>
            </div>

            <ArticleObjectionQA
              article={translated}
              lang={lang}
              variant="sidebar"
              onTrackEvent={onTrackEvent}
            />
          </aside>
        )}
      </div>

      {/* Kapsamlı İlgili Yazılar (Related Articles) Mimarisi */}
      <div className="no-print">
        <RelatedArticlesSection
          currentArticle={article}
          allArticles={allArticles}
          lang={lang}
          articleStatsMap={articleStatsMap}
          onSelectArticle={(slug) => {
            if (onSelectArticle) {
              onSelectArticle(slug);
            } else {
              window.location.href = `/makale/${slug}`;
            }
          }}
        />
      </div>
    </div>
  );
};