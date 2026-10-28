import React, { useState, useMemo, useEffect } from 'react';
import {
  Network,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Eye,
  Clock,
  Tag,
  Layers,
  GitBranch,
  Compass,
  Link2
} from 'lucide-react';
import { Article, ArticleSiteReads } from '../types';
import { buildRelatedArticlesArchitecture, RelatedArticleNode } from '../utils/relatedArticles';
import {
  getTranslatedArticle,
  translateArticlesBatch,
  subscribeToTranslationUpdates
} from '../utils/translations';
import { ArticleIllustration } from './ArticleIllustration';

interface RelatedArticlesSectionProps {
  currentArticle: Article;
  allArticles: Article[];
  lang: string;
  articleStatsMap?: Record<string, ArticleSiteReads>;
  onSelectArticle: (slug: string) => void;
}

export const InlineRelatedLinksBox: React.FC<{
  currentArticle: Article;
  allArticles: Article[];
  lang: string;
  articleStatsMap?: Record<string, ArticleSiteReads>;
  onSelectArticle: (slug: string) => void;
}> = ({ currentArticle, allArticles, lang, articleStatsMap, onSelectArticle }) => {
  const [, setTick] = useState(0);
  const architecture = useMemo(
    () => buildRelatedArticlesArchitecture(currentArticle, allArticles),
    [currentArticle, allArticles]
  );

  useEffect(() => {
    return subscribeToTranslationUpdates(() => setTick((t) => t + 1));
  }, []);

  useEffect(() => {
    const inlineArts = architecture.inlineRecommendations.map((n) => n.article);
    translateArticlesBatch(inlineArts, lang).catch(() => {});
  }, [architecture, lang]);

  const isTr = lang === 'tr';

  return (
    <aside
      aria-label={isTr ? 'Bu Yazıyla Doğrudan İlgili Okumalar' : 'Directly Related Readings'}
      className="my-8 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/20 border border-amber-500/30 shadow-lg"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Link2 className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase tracking-wider">
              {isTr
                ? 'Bu Yazıyla İlgili Kavramsal Okuma Bağlantıları'
                : 'Conceptual Reading Links Related to This Essay'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isTr
                ? 'Okuduğunuz makalenin tez ve kavramlarıyla doğrudan bağlantılı diğer çalışmalar:'
                : 'Studies directly connected to the thesis and concepts of this article:'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
          {isTr ? 'İç Linkleme Mimarisi' : 'Internal Link Graph'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {architecture.inlineRecommendations.map((node) => {
          const translated = getTranslatedArticle(node.article, lang);
          const metrics = articleStatsMap?.[node.article.slug];
          const href = lang && lang !== 'tr' ? `/${lang}/makale/${node.article.slug}` : `/makale/${node.article.slug}`;

          return (
            <a
              key={node.article.slug}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                onSelectArticle(node.article.slug);
              }}
              className="group p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 text-[10px] font-mono mb-1.5">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 truncate">
                    {translated.categoryTitle}
                  </span>
                  <span className="text-emerald-400 font-bold shrink-0">
                    %{node.affinityScore} {isTr ? 'Uyum' : 'Match'}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-400 transition line-clamp-2 leading-snug">
                  {translated.title}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                {metrics ? (
                  <span className="text-emerald-300 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-emerald-400" />
                    {metrics.totalReads.toLocaleString('tr-TR')} {isTr ? 'Okunma' : 'Reads'}
                  </span>
                ) : (
                  <span>{node.article.readTime}</span>
                )}
                <span className="text-amber-400 font-sans font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  {isTr ? 'Yazıyı Aç' : 'Read'}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </aside>
  );
};

export const RelatedArticlesSection: React.FC<RelatedArticlesSectionProps> = ({
  currentArticle,
  allArticles,
  lang,
  articleStatsMap,
  onSelectArticle
}) => {
  const [activeCluster, setActiveCluster] = useState<'primary' | 'discipline' | 'bridge'>('primary');
  const [, setTick] = useState(0);

  const architecture = useMemo(
    () => buildRelatedArticlesArchitecture(currentArticle, allArticles),
    [currentArticle, allArticles]
  );

  const isTr = lang === 'tr';

  const displayedNodes: RelatedArticleNode[] =
    activeCluster === 'primary'
      ? architecture.primaryRelated
      : activeCluster === 'discipline'
      ? architecture.categoryCluster
      : architecture.crossDisciplinaryBridge;

  const allLinkedNodes = useMemo(
    () => [
      ...architecture.primaryRelated,
      ...architecture.categoryCluster,
      ...architecture.crossDisciplinaryBridge
    ],
    [architecture]
  );

  useEffect(() => {
    return subscribeToTranslationUpdates(() => setTick((t) => t + 1));
  }, []);

  useEffect(() => {
    const relatedArts = [
      ...allLinkedNodes.map((n) => n.article),
      architecture.prevArticle,
      architecture.nextArticle
    ].filter(Boolean);
    translateArticlesBatch(relatedArts, lang).catch(() => {});
  }, [allLinkedNodes, architecture.prevArticle, architecture.nextArticle, lang]);

  const prevTranslated = getTranslatedArticle(architecture.prevArticle, lang);
  const nextTranslated = getTranslatedArticle(architecture.nextArticle, lang);

  const buildArticleHref = (slug: string) =>
    lang && lang !== 'tr' ? `/${lang}/makale/${slug}` : `/makale/${slug}`;

  return (
    <section
      aria-label={isTr ? 'İlgili Yazılar ve Kavramsal Bağlantı Mimarisi' : 'Related Articles Architecture'}
      className="mt-12 pt-10 border-t-2 border-slate-800/90 space-y-8"
    >
      {/* Mimarinin Üst Başlığı ve Küme Seçici Sekmeler */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
              <Network className="w-3.5 h-3.5" />
              <span>
                {isTr
                  ? 'RELATED ARTICLES MİMARİSİ • KAVRAMSAL BAĞLANTI AĞI'
                  : 'RELATED ARTICLES ARCHITECTURE • SEMANTIC GRAPH'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isTr
                ? 'Bu Yazıyla İlgili Diğer Makaleler ve Derinleşme Kümesi'
                : 'Related Essays & Deep-Dive Conceptual Cluster'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
              {isTr
                ? `"${getTranslatedArticle(currentArticle, lang).title}" makalesinin etiketleri, matematiksel modelleri, diyalektik tezleri ve felsefi disiplini analiz edilerek ${allArticles.length} makalelik külliyattan en yüksek uyumlu ilgili yazılar listelenmiştir.`
                : `Computed from shared philosophical tags, formal mathematical models, and dialectical themes across the ${allArticles.length}-article corpus.`}
            </p>
          </div>

          {/* 3 Katmanlı Mimari Filtre Butonları */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveCluster('primary')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeCluster === 'primary'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isTr
                  ? `Doğrudan İlgili (${architecture.primaryRelated.length})`
                  : `Top Matches (${architecture.primaryRelated.length})`}
              </span>
            </button>

            <button
              onClick={() => setActiveCluster('discipline')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeCluster === 'discipline'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {isTr
                  ? `Aynı Disiplin (${architecture.categoryCluster.length})`
                  : `Same Discipline (${architecture.categoryCluster.length})`}
              </span>
            </button>

            <button
              onClick={() => setActiveCluster('bridge')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeCluster === 'bridge'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>
                {isTr
                  ? `Disiplinlerarası Köprü (${architecture.crossDisciplinaryBridge.length})`
                  : `Cross-Disciplinary (${architecture.crossDisciplinaryBridge.length})`}
              </span>
            </button>
          </div>
        </div>

        {/* İlgili Makale Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedNodes.map((node) => {
            const translated = getTranslatedArticle(node.article, lang);
            const metrics = articleStatsMap?.[node.article.slug];
            const href = buildArticleHref(node.article.slug);

            return (
              <a
                key={node.article.slug}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectArticle(node.article.slug);
                }}
                className="group bg-slate-950/90 border border-slate-800/90 hover:border-amber-500/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5"
              >
                <div>
                  {/* Görsel & Uyum Skoru */}
                  <div className="relative h-36 overflow-hidden border-b border-slate-800/60">
                    <ArticleIllustration
                      slug={node.article.slug}
                      category={node.article.category}
                      title={translated.title}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider truncate">
                        {translated.categoryTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold shrink-0">
                        %{node.affinityScore} {isTr ? 'Kavramsal Uyum' : 'Match'}
                      </span>
                    </div>
                  </div>

                  {/* İçerik Bilgileri */}
                  <div className="p-4 space-y-2.5">
                    <div className="text-[10px] font-mono text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg truncate">
                      🔗 {isTr ? node.relationReasonTr : node.relationReasonEn}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                      {translated.title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 font-serif leading-relaxed">
                      {translated.summary}
                    </p>

                    {/* Ortak ve İlgili Etiketler */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {translated.tags.slice(0, 3).map((tag: string, i: number) => {
                        const isShared = node.sharedTags.some(
                          (st) => st.toLowerCase() === tag.toLowerCase()
                        );
                        return (
                          <span
                            key={i}
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] ${
                              isShared
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                                : 'bg-slate-900 text-slate-400 border border-slate-800'
                            }`}
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Alt Bar: Canlı Okunma + Link */}
                <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    {metrics ? (
                      <>
                        <span className="text-emerald-300 flex items-center gap-1 font-bold">
                          <BookOpen className="w-3 h-3 text-emerald-400" />
                          {metrics.totalReads.toLocaleString('tr-TR')}
                        </span>
                        <span className="text-sky-300 flex items-center gap-1">
                          <Eye className="w-3 h-3 text-sky-400" />
                          {(metrics.totalViews || Math.round(metrics.totalReads * 1.35)).toLocaleString('tr-TR')}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {node.article.readTime}
                      </span>
                    )}
                  </div>

                  <span className="text-amber-400 font-sans font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>{isTr ? 'Makaleyi Oku' : 'Read Essay'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        {/* Hızlı Kavramsal Bağlantı Dizini (Tüm 14 İlgili Makalenin Doğrudan Link Listesi) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>
                {isTr
                  ? 'Bu Makalenin Kavramsal Ağındaki Tüm İlgili Yazı Linkleri (Hızlı Geçiş)'
                  : 'All Related Article Links in Semantic Graph (Quick Jump)'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {allLinkedNodes.length} {isTr ? 'Bağlantılı Makale • 10 Dilde İndeksli' : 'Connected Articles • Indexed in 10 Languages'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allLinkedNodes.map((node, idx) => {
              const translated = getTranslatedArticle(node.article, lang);
              const href = buildArticleHref(node.article.slug);
              return (
                <a
                  key={node.article.slug}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectArticle(node.article.slug);
                  }}
                  className="group flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 transition text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-amber-400 flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 group-hover:text-amber-300 font-medium truncate">
                      {translated.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 font-mono text-[10px]">
                    <span className="text-emerald-400">%{node.affinityScore}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Külliyat İçi Sıralı Geçiş: Önceki Yazı & Sonraki Yazı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href={buildArticleHref(architecture.prevArticle.slug)}
          onClick={(e) => {
            e.preventDefault();
            onSelectArticle(architecture.prevArticle.slug);
          }}
          className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex items-center gap-4"
        >
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-amber-400 group-hover:border-amber-500/30 transition shrink-0">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              {isTr ? '← Külliyatta Önceki Yazı' : '← Previous Essay in Corpus'}
            </span>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition truncate mt-0.5">
              {prevTranslated.title}
            </h4>
            <span className="text-[11px] text-amber-400/80 font-mono truncate block mt-0.5">
              {prevTranslated.categoryTitle}
            </span>
          </div>
        </a>

        <a
          href={buildArticleHref(architecture.nextArticle.slug)}
          onClick={(e) => {
            e.preventDefault();
            onSelectArticle(architecture.nextArticle.slug);
          }}
          className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex items-center justify-between gap-4 text-right"
        >
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              {isTr ? 'Külliyatta Sonraki Yazı →' : 'Next Essay in Corpus →'}
            </span>
            <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition truncate mt-0.5">
              {nextTranslated.title}
            </h4>
            <span className="text-[11px] text-amber-400/80 font-mono truncate block mt-0.5">
              {nextTranslated.categoryTitle}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-amber-400 group-hover:border-amber-500/30 transition shrink-0">
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>
      </div>
    </section>
  );
};
