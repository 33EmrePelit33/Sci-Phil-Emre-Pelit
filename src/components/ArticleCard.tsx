import React, { useState, useEffect } from 'react';
import {
  Clock,
  ArrowRight,
  Layers,
  FunctionSquare,
  Calculator,
  Volume2,
  Square,
  Loader2,
  BookOpen,
  Eye,
  MessageSquareWarning,
  GraduationCap,
  Copy,
  Check,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Article, ArticleSiteReads } from '../types';
import { ArticleIllustration } from './ArticleIllustration';
import { MathRenderer } from './MathRenderer';
import { ArticleObjectionQA } from './ArticleObjectionQA';
import {
  getTranslatedArticle,
  getTranslatedSubcategoryTitle,
  subscribeToTranslationUpdates,
  t
} from '../utils/translations';
import { useSpeechEngine } from '../utils/speechEngine';
import { resolveArticleSubcategory } from '../utils/taxonomy';
import { INITIAL_ARTICLE_SITE_READS } from '../data/baselineStats';
import {
  getArticleScholarlyIdentifiers,
  generateFormattedCitations,
  tsScholar
} from '../utils/scholarlyIndexing';

interface ArticleCardProps {
  article: Article;
  indexNumber?: number;
  lang?: string;
  articleMetrics?: ArticleSiteReads;
  defaultExpanded?: boolean;
  onSelect: (slug: string) => void;
  onOpenObjection?: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  indexNumber,
  lang = 'tr',
  articleMetrics,
  defaultExpanded = false,
  onSelect,
  onOpenObjection
}) => {
  const [, setVersion] = useState<number>(0);
  const [showLocalObjectionModal, setShowLocalObjectionModal] = useState<boolean>(false);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(defaultExpanded);
  const speech = useSpeechEngine();

  useEffect(() => {
    setIsDetailsOpen(defaultExpanded);
  }, [defaultExpanded]);

  useEffect(() => {
    return subscribeToTranslationUpdates(() => {
      setVersion((v) => v + 1);
    });
  }, []);

  const translated = getTranslatedArticle(article, lang);
  const subcategory = resolveArticleSubcategory(article);
  const subTitle = getTranslatedSubcategoryTitle(
    subcategory.id,
    subcategory.titleTr,
    subcategory.titleEn,
    lang
  );
  const primaryFormula = translated.mathFormulations?.[0];
  const cardSourceId = `card:${article.slug}`;
  const isSpeakingCard = speech.sourceId === cardSourceId && (speech.isPlaying || speech.isPaused);
  const isLoadingCard = speech.sourceId === cardSourceId && speech.isLoading;

  const scholarlyId = getArticleScholarlyIdentifiers(translated);
  const formattedCitations = generateFormattedCitations(translated, 'https://emre-pelit-sci-phi.ai.studio', lang);

  const resolvedMetrics =
    articleMetrics || INITIAL_ARTICLE_SITE_READS.find((item) => item.slug === article.slug);
  const total8SiteReads = resolvedMetrics?.totalReads || 195;
  const total8SiteViews =
    resolvedMetrics?.totalViews || Math.round(total8SiteReads * 1.35);

  const handleQuickListen = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSpeakingCard || isLoadingCard) {
      speech.stopSpeech();
      return;
    }

    void speech.speakCardSummary(article, lang, speech.rate);
  };

  const handleObjectionButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenObjection) {
      onOpenObjection(article);
    } else {
      setShowLocalObjectionModal(true);
    }
  };

  const handleCopyCardCitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(formattedCitations.apa);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleToggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailsOpen((prev) => !prev);
  };

  const encodedSlug = encodeURIComponent(article.slug);
  const cardTags =
    translated.tags && translated.tags.length > 0
      ? translated.tags.slice(0, 3)
      : [translated.categoryTitle, subTitle, primaryFormula?.domain || 'Analitik Sentez'];

  return (
    <>
      <article
        onClick={() => onSelect(article.slug)}
        className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shadow-lg hover:shadow-amber-500/5 flex flex-col justify-between"
      >
        <div>
          {/* Akademik Görsel Özet (Graphical Abstract) — Makale Konularını Özetleyen Kart Görseli */}
          <div className="relative h-48 w-full overflow-hidden border-b border-slate-800">
            <ArticleIllustration
              slug={article.slug}
              category={article.category}
              title={translated.title}
              subtitle={translated.subtitle}
              tags={translated.tags}
              formula={primaryFormula?.latex}
              formulaTitle={primaryFormula?.title}
              subTopicLabel={subTitle}
              figureNumber={indexNumber}
              thesisSummary={translated.dialecticalTriad?.synthesis || translated.summary}
              variant="thumbnail"
              className="w-full h-full rounded-none border-0"
            />
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
              {typeof indexNumber === 'number' && (
                <span className="notranslate px-2 py-0.5 rounded-md bg-slate-950/90 text-slate-300 font-mono font-bold border border-slate-700/80 text-[10px]">
                  #{String(indexNumber).padStart(2, '0')}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md bg-slate-950/90 text-amber-400 font-semibold border border-amber-500/30 text-[10px] tracking-wide uppercase">
                {translated.categoryTitle}
              </span>
            </div>
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
              <button
                onClick={handleQuickListen}
                title={t('audio_listen', lang)}
                className={`p-1.5 rounded-md border text-[10px] transition cursor-pointer ${
                  isSpeakingCard || isLoadingCard
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                    : 'bg-slate-950/90 text-amber-400 border-amber-500/30 hover:bg-amber-500 hover:text-slate-950'
                }`}
              >
                {isLoadingCard ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : isSpeakingCard ? (
                  <Square className="w-3 h-3 fill-current" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </button>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-300 text-[10px] font-mono">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>

          {/* Akademik Görsel Altı Konu & Model Özeti Şeridi (Graphical Abstract Caption Bar) */}
          <div className="px-4 py-1.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-1.5 text-[10px]">
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-mono font-bold text-amber-400 uppercase mr-0.5">
                {lang === 'tr' ? 'Konu Özeti:' : 'Topics:'}
              </span>
              {cardTags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-200 border border-slate-800 font-medium truncate max-w-[120px]"
                >
                  {tag}
                </span>
              ))}
            </div>
            {primaryFormula && (
              <span className="font-mono text-[9px] text-sky-300 bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-500/30 truncate max-w-[145px]">
                ƒ: {primaryFormula.title}
              </span>
            )}
          </div>

          {/* Kart Özet İçeriği (Akademik Dergi Künyesi ile Birlikte) */}
          <div className="p-5 pb-3">
            {/* Üst Akademik Dergi Anteti: Makale Türü, Cilt/Sayı ve Sayfa Aralığı */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 mb-2 border-b border-slate-800/80 text-[10px] font-mono">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-sans font-semibold">
                <GraduationCap className="w-3 h-3 text-indigo-400 shrink-0" />
                <span>{tsScholar('article_type_research', lang)}</span>
              </span>
              <span className="notranslate text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 font-semibold">
                Vol. {scholarlyId.volume}({scholarlyId.issue}), pp. {scholarlyId.firstPage}–{scholarlyId.lastPage}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1.5 text-[11px] text-amber-400/90 font-medium mb-1.5 truncate">
              <div className="flex items-center gap-1.5 truncate">
                <span>{translated.categoryTitle}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 truncate">{subTitle}</span>
              </div>
              <span className="notranslate text-[9px] font-mono text-emerald-400/90 shrink-0">
                e-ISSN: {scholarlyId.eIssn}
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug line-clamp-2 font-serif">
              {translated.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-serif italic line-clamp-1">
              {translated.subtitle}
            </p>
            <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed font-serif text-justify">
              {translated.summary}
            </p>

            {/* Kompakt DOI & arXiv Sınıflandırma Satırı (Her Zaman Görünür) */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-1.5 text-[10px] font-mono text-slate-400">
              <span className="notranslate text-emerald-400 truncate">
                DOI: {scholarlyId.doi}
              </span>
              <span className="notranslate text-sky-400/90 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40 text-[9px]">
                {scholarlyId.arxivStamp}
              </span>
            </div>
          </div>
        </div>

        {/* Alt Kısım: Özet İstatistik Barı + Açılır/Kapanır Akademik Atıf & Detay Çekmecesi */}
        <div className="px-5 pb-4 pt-2.5 border-t border-slate-800/80 bg-slate-950/60 space-y-2.5">
          {/* Her Zaman Görünür Kompakt Okunma & Detay/Oku Aksiyon Satırı */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span
                className="flex items-center gap-1 text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30 font-bold"
                title="Web Sitelerindeki Toplam Net Okunma (Yazar Okumaları Hariç)"
              >
                <BookOpen className="w-3 h-3 text-amber-400" />
                <span>{total8SiteReads.toLocaleString('tr-TR')}</span>
              </span>
              <span
                className="flex items-center gap-1 text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded-lg border border-sky-500/30 font-bold"
                title="Web Sitelerindeki Kümülatif Toplam Görüntülenme"
              >
                <Eye className="w-3 h-3 text-sky-400" />
                <span>{total8SiteViews.toLocaleString('tr-TR')}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleDetails}
                className={`px-2.5 py-1 rounded-lg border text-[10px] font-semibold transition flex items-center gap-1 cursor-pointer ${
                  isDetailsOpen
                    ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/50'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
                title={
                  lang === 'tr'
                    ? 'Akademik Atıf (DOI / BibTeX / PDF), Formül ve İtiraz Detaylarını Aç/Kapat'
                    : 'Toggle Academic Citation (DOI / BibTeX / PDF), Formula & Details'
                }
              >
                <GraduationCap className="w-3 h-3 text-indigo-400" />
                <span>{lang === 'tr' ? 'Atıf & Detay' : 'Cite & Details'}</span>
                {isDetailsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>{lang === 'tr' ? 'Oku' : 'Read'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Tıklayınca Açılan Akademik Atıf, Formül ve İtiraz Çekmecesi */}
          {isDetailsOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="pt-2.5 border-t border-slate-800/80 space-y-2.5 animate-fade-in cursor-default"
            >
              {/* LaTeX Formül Önizlemesi */}
              {primaryFormula && (
                <div className="p-2 bg-slate-950/90 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] text-sky-400 font-mono mb-1">
                    <span className="flex items-center gap-1">
                      <Calculator className="w-3 h-3" />
                      <span>{primaryFormula.title.slice(0, 32)}</span>
                    </span>
                    <span className="text-[9px] text-slate-500">{primaryFormula.domain}</span>
                  </div>
                  <div className="overflow-hidden max-h-10 flex items-center justify-center text-xs">
                    <MathRenderer formula={primaryFormula.latex} displayMode={false} className="py-0.5" />
                  </div>
                </div>
              )}

              {/* Özellik ve Akademik Kod Rozetleri */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                {translated.mathFormulations && translated.mathFormulations.length > 0 && (
                  <span className="flex items-center gap-1 text-sky-400 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40">
                    <FunctionSquare className="w-3 h-3" />
                    <span>{translated.mathFormulations.length} Formula</span>
                  </span>
                )}
                {translated.dialecticalTriad && (
                  <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
                    <Layers className="w-3 h-3" />
                    <span>Dialectics</span>
                  </span>
                )}
                <span className="notranslate text-[9px] font-mono text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                  PACS: {scholarlyId.pacsCodes}
                </span>
                <span className="flex items-center gap-1 text-indigo-300 bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-500/30 font-mono">
                  <GraduationCap className="w-3 h-3 text-indigo-400" />
                  <span>{tsScholar('indexed_10_dbs_badge', lang)}</span>
                </span>
              </div>

              {/* Akademik Atıf Künyesi (APA 7 / DOI / e-ISSN / BibTeX / RIS / PDF) */}
              <div className="p-2.5 rounded-xl bg-indigo-950/25 border border-indigo-500/25 space-y-1.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[10px] font-bold text-indigo-300 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>{tsScholar('card_citation_label', lang)}</span>
                  </span>
                  <span className="notranslate text-[9px] font-mono text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    DOI: {scholarlyId.doi}
                  </span>
                </div>

                <p className="text-[10px] font-mono text-slate-300 leading-relaxed line-clamp-2 select-all">
                  {formattedCitations.apa}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-indigo-500/15">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleCopyCardCitation}
                      className="px-2 py-0.5 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-[9px] font-semibold transition flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCitation ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-300" />
                          <span>{tsScholar('copied_citation_btn', lang)}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>{tsScholar('copy_citation_btn', lang)}</span>
                        </>
                      )}
                    </button>
                    <a
                      href={`/citations/${encodedSlug}.bib`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notranslate px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[9px] font-mono"
                    >
                      .bib
                    </a>
                    <a
                      href={`/citations/${encodedSlug}.ris`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notranslate px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-[9px] font-mono"
                    >
                      .ris
                    </a>
                    <a
                      href={`/scholar/pdf/${encodedSlug}.html?lang=${lang}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notranslate px-1.5 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-[9px] font-mono flex items-center gap-0.5"
                    >
                      <FileText className="w-2.5 h-2.5" /> PDF
                    </a>
                  </div>
                  <span className="notranslate text-[9px] font-mono text-slate-400">
                    e-ISSN: {scholarlyId.eIssn}
                  </span>
                </div>
              </div>

              {/* Her Site Özelinde Makale Okunma & Görüntüleme Kırılımı (emre-pelit-sci-phi.ai.studio & sci-phil.ai.studio Dahil) */}
              {articleMetrics && (
                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-amber-500/25 space-y-1.5 font-mono text-[10px]">
                  <div className="flex items-center justify-between text-[9px] text-amber-300 font-sans font-bold uppercase">
                    <span>8 Site Okunma & Görüntüleme (301 Konsolide)</span>
                    <span className="text-emerald-400 font-mono">
                      ∑ {articleMetrics.totalReads.toLocaleString('tr-TR')} Okunma / {(articleMetrics.totalViews || Math.round(articleMetrics.totalReads * 1.35)).toLocaleString('tr-TR')} Gör.
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold">
                      emre-pelit-sci-phi.ai.studio: {(articleMetrics.bySite?.['emre-pelit-sci-phi'] || 0).toLocaleString('tr-TR')}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold">
                      sci-phil.ai.studio: {(articleMetrics.bySite?.['sci-phil-legacy'] || 0).toLocaleString('tr-TR')}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      Grok.me: {(articleMetrics.bySite?.['grok-me'] || 0).toLocaleString('tr-TR')}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">
                      Blogger: {(articleMetrics.bySite?.['blogger'] || 0).toLocaleString('tr-TR')}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-300">
                      sci-phi.ai.studio: {(articleMetrics.bySite?.['sci-phi-primary'] || 0).toLocaleString('tr-TR')}
                    </span>
                  </div>
                </div>
              )}

              {/* İtiraz / Soru ve Tam Makale Butonları */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <button
                  type="button"
                  onClick={handleObjectionButtonClick}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquareWarning className="w-3 h-3" />
                  <span>{lang === 'tr' ? 'İtiraz / Soru Sor' : 'Ask / Object'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelect(article.slug)}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('read_and_listen', lang)}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </article>

      {showLocalObjectionModal && (
        <ArticleObjectionQA
          article={translated}
          lang={lang}
          variant="modal"
          onCloseModal={() => setShowLocalObjectionModal(false)}
        />
      )}
    </>
  );
};