import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  Copy,
  Check,
  FileText,
  Download,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  Database,
  Sparkles,
  Globe
} from 'lucide-react';
import type { Article } from '../types';
import {
  SCIENTIFIC_INDEX_DATABASES,
  getArticleScholarlyIdentifiers,
  generateScholarlyMetaTagsList,
  generateScholarlyJsonLdObject,
  generateBibTeX,
  generateRIS,
  generateFormattedCitations,
  tsScholar
} from '../utils/scholarlyIndexing';
import { SUPPORTED_LANGUAGES } from '../utils/translations';

interface ScholarlyCitationBoxProps {
  article: Article;
  language?: string;
}

type CitationFormatKey = 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee' | 'bibtex' | 'ris';

export const ScholarlyCitationBox: React.FC<ScholarlyCitationBoxProps> = ({
  article,
  language = 'tr'
}) => {
  const [activeFormat, setActiveFormat] = useState<CitationFormatKey>('apa');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showAllDatabases, setShowAllDatabases] = useState(true);

  const identifiers = getArticleScholarlyIdentifiers(article);
  const formatted = generateFormattedCitations(article, 'https://emre-pelit-sci-phi.ai.studio', language);
  const bibtex = generateBibTeX(article);
  const ris = generateRIS(article);

  // Dynamically inject Highwire Press (citation_*), Dublin Core (DC.*), PRISM, and ScholarlyArticle JSON-LD into document.head
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const metaList = generateScholarlyMetaTagsList(article, language);
    const createdNodes: HTMLElement[] = [];

    document
      .querySelectorAll('[data-sciphi-scholarly="true"]')
      .forEach((el) => el.parentNode?.removeChild(el));

    for (const item of metaList) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', item.name);
      meta.setAttribute('content', item.content);
      if (item.scheme) {
        meta.setAttribute('scheme', item.scheme);
      }
      meta.setAttribute('data-sciphi-scholarly', 'true');
      document.head.appendChild(meta);
      createdNodes.push(meta);
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-sciphi-scholarly', 'true');
    script.textContent = JSON.stringify(generateScholarlyJsonLdObject(article, language));
    document.head.appendChild(script);
    createdNodes.push(script);

    return () => {
      createdNodes.forEach((node) => {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
    };
  }, [article, language]);

  const getActiveCitationText = (): string => {
    switch (activeFormat) {
      case 'apa':
        return formatted.apa;
      case 'mla':
        return formatted.mla;
      case 'chicago':
        return formatted.chicago;
      case 'harvard':
        return formatted.harvard;
      case 'ieee':
        return formatted.ieee;
      case 'bibtex':
        return bibtex;
      case 'ris':
        return ris;
      default:
        return formatted.apa;
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const oaiRecordUrl = `/oai?verb=GetRecord&metadataPrefix=oai_dc&identifier=${encodeURIComponent(
    identifiers.oaiIdentifier
  )}`;

  const encodedSlug = encodeURIComponent(article.slug);

  return (
    <section
      className="my-10 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/95 via-indigo-950/25 to-slate-900/95 p-6 sm:p-8 shadow-xl"
      aria-label={tsScholar('box_title', language)}
    >
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/90">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                Highwire Press • Dublin Core • Crossref DOI • OAI-PMH 2.0
              </span>
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck size={12} /> {tsScholar('indexed_10_dbs_badge', language)}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white mt-1.5">
              {tsScholar('box_title', language)}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {tsScholar('box_subtitle', language)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={`/scholar/pdf/${encodedSlug}.html?lang=${language}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <FileText size={14} />
            <span>{tsScholar('fulltext_pdf_btn', language)}</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* Identifiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-5">
        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            DOI (Zenodo / Crossref Schema)
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="notranslate text-xs font-mono font-semibold text-indigo-300 truncate">
              {identifiers.doi}
            </span>
            <button
              type="button"
              onClick={() => handleCopy(identifiers.doi, 'doi')}
              className="text-slate-400 hover:text-white p-1 rounded"
              title="Copy DOI"
            >
              {copiedKey === 'doi' ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            e-ISSN &amp; Volume / Pages
          </div>
          <div className="notranslate mt-1 text-xs font-mono font-semibold text-slate-200">
            e-ISSN: {identifiers.eIssn} • Vol. {identifiers.volume}({identifiers.issue}), pp. {identifiers.firstPage}–{identifiers.lastPage}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Author &amp; ORCID ID
          </div>
          <div className="notranslate mt-1 text-xs font-mono font-semibold text-emerald-300 truncate">
            {identifiers.authorCitationName} • ORCID: {identifiers.authorOrcid}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            OAI-PMH 2.0 &amp; PhilPapers ID
          </div>
          <div className="notranslate mt-1 text-xs font-mono font-semibold text-amber-300 truncate" title={identifiers.oaiIdentifier}>
            {identifiers.philPapersId} • {identifiers.arxivSubjectClass}
          </div>
        </div>
      </div>

      {/* Interactive Citation Box */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { key: 'apa', label: 'APA 7' },
                { key: 'mla', label: 'MLA 9' },
                { key: 'chicago', label: 'Chicago 17' },
                { key: 'harvard', label: 'Harvard' },
                { key: 'ieee', label: 'IEEE' },
                { key: 'bibtex', label: 'BibTeX (.bib)' },
                { key: 'ris', label: 'RIS (Zotero/EndNote)' }
              ] as Array<{ key: CitationFormatKey; label: string }>
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFormat(tab.key)}
                className={`notranslate px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  activeFormat === tab.key
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleCopy(getActiveCitationText(), 'active-citation')}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
          >
            {copiedKey === 'active-citation' ? (
              <>
                <Check size={13} /> <span>{tsScholar('copied_citation_btn', language)}</span>
              </>
            ) : (
              <>
                <Copy size={13} /> <span>{tsScholar('copy_citation_btn', language)}</span>
              </>
            )}
          </button>
        </div>

        <pre className="text-xs font-mono text-slate-200 bg-slate-900/90 border border-slate-800/80 rounded-lg p-3.5 overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {getActiveCitationText()}
        </pre>

        {/* Direct Machine-Readable Harvest & Export Links */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`/citations/${encodedSlug}.bib`}
              target="_blank"
              rel="noopener noreferrer"
              className="notranslate inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
            >
              <Download size={12} /> BibTeX (.bib)
            </a>
            <a
              href={`/citations/${encodedSlug}.ris`}
              target="_blank"
              rel="noopener noreferrer"
              className="notranslate inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
            >
              <Download size={12} /> RIS (.ris — EndNote / Mendeley / Zotero)
            </a>
            <a
              href={`/citations/${encodedSlug}.json`}
              target="_blank"
              rel="noopener noreferrer"
              className="notranslate inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
            >
              <BookOpen size={12} /> Crossref CSL-JSON (.json)
            </a>
            <a
              href={oaiRecordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="notranslate inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 transition-colors"
            >
              <Database size={12} /> OAI-PMH 2.0 XML (oai_dc)
            </a>
          </div>

          <button
            type="button"
            onClick={() => setShowAllDatabases((prev) => !prev)}
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
          >
            <Sparkles size={13} />
            <span>
              {showAllDatabases
                ? tsScholar('hide_10_dbs', language)
                : tsScholar('show_10_dbs', language)}
            </span>
          </button>
        </div>
      </div>

      {/* 10 Menu Languages Direct Indexed URLs for This Article */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-950/75 border border-slate-800/80">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 mb-2">
          <Globe size={13} />
          <span>10 Dilde İndekslenen Akademik Makale Bağlantıları (Google Scholar &amp; Search Console 10-Language Canonical Links):</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {SUPPORTED_LANGUAGES.map((l) => {
            const href = l.code === 'tr' ? `/makale/${encodedSlug}` : `/makale/${encodedSlug}?lang=${l.code}`;
            const isCurrent = l.code === language;
            return (
              <a
                key={l.code}
                href={href}
                className={`notranslate px-2.5 py-1 rounded-lg text-[11px] font-mono border transition flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
              >
                <span>{l.flag}</span>
                <span>{l.code.toUpperCase()}</span>
                <span className="text-[10px] opacity-80">({l.nativeName})</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Expandable 10 Scientific Publication Databases Matrix */}
      {showAllDatabases && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {SCIENTIFIC_INDEX_DATABASES.map((db) => (
            <div
              key={db.id}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-start justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="notranslate text-xs font-semibold text-white">{db.name}</span>
                  <span className="notranslate text-[10px] font-mono text-slate-400">({db.organization})</span>
                </div>
                <div className="notranslate text-[11px] font-mono text-indigo-300 mt-1">{db.protocol}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{db.coverage}</div>
              </div>
              <a
                href={db.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-mono text-emerald-300 hover:text-white px-2.5 py-1 rounded bg-emerald-950/50 border border-emerald-500/30 shrink-0 inline-flex items-center gap-1"
              >
                <span>✓ İndeksli</span> <ExternalLink size={10} />
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
