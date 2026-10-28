import React, { useState, useMemo, useEffect } from 'react';
import {
  Maximize2,
  X,
  Sliders,
  GitBranch,
  Activity,
  Layers,
  Cpu,
  Compass,
  Sparkles,
  Eye,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Article } from '../types';
import { resolveArticleSubcategory } from '../utils/taxonomy';

interface ArticleVisualsProps {
  article: Article;
  lang?: string;
}

interface InlineSectionFigureProps {
  article: Article;
  sectionTitle: string;
  sectionIndex: number;
  lang?: string;
}

// Deterministic hash from string
function hashStr(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// Extract clean key terms from article
function extractKeyConcepts(article: Article): string[] {
  const raw: string[] = [];
  if (article.tags && article.tags.length > 0) {
    raw.push(...article.tags.slice(0, 5));
  }
  const headings = (article.content || '')
    .split('\n')
    .filter((l) => l.startsWith('## ') || l.startsWith('### '))
    .map((l) => l.replace(/^###?\s+/, '').replace(/\*\*/g, '').trim());

  headings.forEach((h) => {
    const clean = h.replace(/^[0-9IVX]+\.\s*/, '').slice(0, 32);
    if (clean && !raw.includes(clean)) raw.push(clean);
  });

  if (raw.length < 4) {
    const words = article.title
      .split(/[:\-–—,]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 3);
    raw.push(...words);
  }

  const defaults = ['Ontolojik Temel', 'Nedensel Mekanizma', 'Formel Yapı', 'Epistemik Sınır', 'Diyalektik Sentez'];
  for (const d of defaults) {
    if (raw.length < 5) raw.push(d);
  }
  return raw.slice(0, 6);
}

export type VisualArchetype =
  | 'spacetime'
  | 'wormhole'
  | 'quantum'
  | 'thermodynamics'
  | 'computation'
  | 'consciousness'
  | 'neuroscience'
  | 'dialectics'
  | 'logic'
  | 'epistemology'
  | 'ai_ethics'
  | 'cosmology';

export function detectArticleArchetype(
  slug: string,
  title: string,
  category = '',
  tags: string[] = []
): VisualArchetype {
  const hay = `${slug} ${title} ${category} ${tags.join(' ')}`.toLowerCase();

  if (
    hay.includes('solucan') ||
    hay.includes('wormhole') ||
    hay.includes('kara-delik') ||
    hay.includes('kara delik') ||
    hay.includes('black hole') ||
    hay.includes('olay ufku') ||
    hay.includes('schwarzschild') ||
    hay.includes('kerr')
  ) {
    return 'wormhole';
  }
  if (
    hay.includes('blok-evren') ||
    hay.includes('blok evren') ||
    hay.includes('block universe') ||
    hay.includes('minkowski') ||
    hay.includes('görelilik') ||
    hay.includes('gorelilik') ||
    hay.includes('relativity') ||
    hay.includes('zaman') ||
    hay.includes('eşzamanlılık') ||
    hay.includes('eternalizm')
  ) {
    return 'spacetime';
  }
  if (
    hay.includes('kuantum') ||
    hay.includes('quantum') ||
    hay.includes('dolanıklık') ||
    hay.includes('entangle') ||
    hay.includes('bell') ||
    hay.includes('dalga fonksiyonu') ||
    hay.includes('hilbert') ||
    hay.includes('süperpozisyon') ||
    hay.includes('dekoherans')
  ) {
    return 'quantum';
  }
  if (
    hay.includes('entropi') ||
    hay.includes('entropy') ||
    hay.includes('termodinamik') ||
    hay.includes('boltzmann') ||
    hay.includes('kaos') ||
    hay.includes('chaos') ||
    hay.includes('faz uzayı') ||
    hay.includes('attractor') ||
    hay.includes('ergodik')
  ) {
    return 'thermodynamics';
  }
  if (
    hay.includes('çin odası') ||
    hay.includes('cin-odasi') ||
    hay.includes('chinese room') ||
    hay.includes('searle') ||
    hay.includes('turing') ||
    hay.includes('sentaks') ||
    hay.includes('semantik') ||
    hay.includes('kolmogorov') ||
    hay.includes('algoritma')
  ) {
    return 'computation';
  }
  if (
    hay.includes('özgür irade') ||
    hay.includes('ozgur-irade') ||
    hay.includes('free will') ||
    hay.includes('libet') ||
    hay.includes('determinizm') ||
    hay.includes('nöro') ||
    hay.includes('beyin') ||
    hay.includes('karar')
  ) {
    return 'neuroscience';
  }
  if (
    hay.includes('bilinç') ||
    hay.includes('bilinc') ||
    hay.includes('consciousness') ||
    hay.includes('qualia') ||
    hay.includes('chalmers') ||
    hay.includes('tononi') ||
    hay.includes('panpsişizm') ||
    hay.includes('fenomenoloji') ||
    category === 'zihin-bilinc'
  ) {
    return 'consciousness';
  }
  if (
    hay.includes('gödel') ||
    hay.includes('godel') ||
    hay.includes('paradoks') ||
    hay.includes('russell') ||
    hay.includes('tarski') ||
    hay.includes('cantor') ||
    hay.includes('aksiyom') ||
    hay.includes('sonsuzluk') ||
    hay.includes('küme')
  ) {
    return 'logic';
  }
  if (
    hay.includes('diyalektik') ||
    hay.includes('hegel') ||
    hay.includes('aufhebung') ||
    hay.includes('çelişki') ||
    hay.includes('tez') ||
    hay.includes('antitez') ||
    category === 'diyalektik-mantik'
  ) {
    return 'dialectics';
  }
  if (
    hay.includes('bayes') ||
    hay.includes('epistemoloji') ||
    hay.includes('popper') ||
    hay.includes('kuhn') ||
    hay.includes('paradigma') ||
    hay.includes('yanlışlanabilir') ||
    hay.includes('olasılık') ||
    hay.includes('nedensellik')
  ) {
    return 'epistemology';
  }
  if (
    hay.includes('yapay zeka') ||
    hay.includes('agi') ||
    hay.includes('simülasyon') ||
    hay.includes('simulasyon') ||
    hay.includes('bostrom') ||
    hay.includes('etik') ||
    hay.includes('hizalama') ||
    hay.includes('transhümanizm') ||
    category === 'etik-teknoloji'
  ) {
    return 'ai_ethics';
  }
  return 'cosmology';
}

/**
 * Makale Bölüm Başlıklarının Altına Otomatik Yerleştirilen İçeriksel Şekil / Diyagram
 */
export const InlineSectionFigure: React.FC<InlineSectionFigureProps> = ({
  article,
  sectionTitle,
  sectionIndex,
  lang = 'tr'
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const seed = hashStr(`${article.slug}:${sectionTitle}:${sectionIndex}`);
  const concepts = useMemo(() => extractKeyConcepts(article), [article]);
  const archetype = useMemo(
    () => detectArticleArchetype(article.slug, `${article.title} ${sectionTitle}`, article.category, article.tags),
    [article.slug, article.title, sectionTitle, article.category, article.tags]
  );

  // Generate dynamic wave/curve points based on seed
  const freq = 1.5 + (seed % 5) * 0.45;
  const amp = 32 + (seed % 28);
  const phase = (seed % 360) * (Math.PI / 180);

  const wavePoints = useMemo(() => {
    const pts: string[] = [];
    for (let x = 60; x <= 740; x += 10) {
      const norm = (x - 60) / 680;
      const y =
        135 +
        Math.sin(norm * Math.PI * 2 * freq + phase) * amp * Math.exp(-norm * 0.4) +
        Math.cos(norm * Math.PI * 4 + phase) * (amp * 0.25);
      pts.push(`${x},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [freq, amp, phase]);

  const secondaryPoints = useMemo(() => {
    const pts: string[] = [];
    for (let x = 60; x <= 740; x += 10) {
      const norm = (x - 60) / 680;
      const y =
        135 -
        Math.cos(norm * Math.PI * 2 * (freq * 0.8) + phase) * (amp * 0.75) +
        (norm - 0.5) * 35;
      pts.push(`${x},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [freq, amp, phase]);

  const c1 = concepts[sectionIndex % concepts.length] || article.categoryTitle;
  const c2 = concepts[(sectionIndex + 1) % concepts.length] || sectionTitle;
  const c3 = concepts[(sectionIndex + 2) % concepts.length] || 'Sentez Durumu';

  const renderSvgContent = () => {
    if (sectionIndex % 3 === 0) {
      // Conceptual Causal Architecture & Vector Flow for this Section
      return (
        <svg viewBox="0 0 800 260" className="w-full h-auto">
          <defs>
            <linearGradient id={`secGrad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <marker id={`arrow-${seed}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
            </marker>
            <marker id={`arrowSky-${seed}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
          </defs>
          <rect width="800" height="260" rx="14" fill={`url(#secGrad-${seed})`} />
          {/* Background coordinate grid */}
          <g stroke="#1e293b" strokeWidth="1">
            {[60, 110, 160, 210].map((y) => (
              <line key={y} x1="30" y1={y} x2="770" y2={y} strokeDasharray="3 3" />
            ))}
            {[150, 300, 450, 600].map((x) => (
              <line key={x} x1={x} y1="25" x2={x} y2="235" strokeDasharray="3 3" />
            ))}
          </g>

          {/* Connecting causal curves */}
          <path
            d="M 225 130 C 275 75, 295 75, 330 130"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2.2"
            markerEnd={`url(#arrow-${seed})`}
          />
          <path
            d="M 475 130 C 515 185, 535 185, 575 130"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.2"
            markerEnd={`url(#arrowSky-${seed})`}
          />
          <path
            d="M 650 95 C 500 30, 300 30, 150 95"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="5 4"
            markerEnd={`url(#arrow-${seed})`}
          />

          {/* Node 1: Premise / State A */}
          <rect x="65" y="92" width="160" height="76" rx="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
          <text x="145" y="118" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            [I. ÖNCÜL / DURUM]
          </text>
          <text x="145" y="140" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
            {c1.slice(0, 22)}
          </text>
          <text x="145" y="156" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            ψ₀(x) • {archetype.toUpperCase()}
          </text>

          {/* Node 2: Transformation / Operator */}
          <rect x="330" y="86" width="145" height="88" rx="14" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2.2" />
          <text x="402" y="114" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            [II. DÖNÜŞÜM / İŞLEÇ]
          </text>
          <text x="402" y="136" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
            {sectionTitle.slice(0, 20)}
          </text>
          <text x="402" y="156" fill="#fde68a" fontSize="10" fontFamily="monospace" textAnchor="middle">
            Ĥ |Ψ⟩ = E |Ψ⟩
          </text>

          {/* Node 3: Emergent Result / Synthesis */}
          <rect x="575" y="92" width="165" height="76" rx="12" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
          <text x="657" y="118" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
            [III. ÇIKARIM / SENTEZ]
          </text>
          <text x="657" y="140" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
            {c3.slice(0, 22)}
          </text>
          <text x="657" y="156" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
            ΔS ≥ 0 • Φ &gt; 0
          </text>

          <text x="400" y="52" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle">
            ↺ Geri-Besleme ve Öz-Tutarlılık Döngüsü ({c2.slice(0, 26)})
          </text>
          <text x="400" y="238" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
            {sectionTitle.slice(0, 64)}
          </text>
        </svg>
      );
    }

    if (sectionIndex % 3 === 1) {
      // Phase Portrait & Wave Interference / Trajectory Plot
      return (
        <svg viewBox="0 0 800 260" className="w-full h-auto">
          <rect width="800" height="260" rx="14" fill="#040814" />
          {/* Axes & Grid */}
          <g stroke="#1e293b" strokeWidth="1">
            <line x1="60" y1="35" x2="60" y2="215" stroke="#475569" strokeWidth="1.5" />
            <line x1="60" y1="135" x2="750" y2="135" stroke="#475569" strokeWidth="1.5" />
            <line x1="60" y1="75" x2="740" y2="75" strokeDasharray="4 4" />
            <line x1="60" y1="195" x2="740" y2="195" strokeDasharray="4 4" />
          </g>

          {/* Primary & Secondary Trajectories */}
          <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" points={wavePoints} />
          <polyline fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 3" points={secondaryPoints} />

          {/* Critical bifurcation / resonance point */}
          <circle cx="380" cy="135" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <line x1="380" y1="45" x2="380" y2="210" stroke="#10b981" strokeWidth="1.2" strokeDasharray="3 3" />

          <text x="72" y="52" fill="#f59e0b" fontSize="10" fontFamily="monospace" fontWeight="bold">
            — Birincil Faz Eğrisi: {c1.slice(0, 25)}
          </text>
          <text x="72" y="68" fill="#38bdf8" fontSize="10" fontFamily="monospace">
            -- Karşıt / Tamamlayıcı Mod: {c2.slice(0, 25)}
          </text>
          <text x="390" y="60" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">
            Kritik Eşik (t = t*)
          </text>
          <text x="400" y="242" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">
            Faz Uzayı Dinamiği • {sectionTitle.slice(0, 56)}
          </text>
        </svg>
      );
    }

    // Multi-Layer Ontological / Epistemic Topology Diagram
    return (
      <svg viewBox="0 0 800 260" className="w-full h-auto">
        <rect width="800" height="260" rx="14" fill="#060a17" />
        {/* Concentric topological shells */}
        <ellipse cx="260" cy="130" rx="175" ry="88" fill="#1e1b4b" fillOpacity="0.35" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="5 3" />
        <ellipse cx="260" cy="130" rx="120" ry="60" fill="#0f172a" fillOpacity="0.6" stroke="#38bdf8" strokeWidth="1.8" />
        <ellipse cx="260" cy="130" rx="62" ry="32" fill="#451a03" fillOpacity="0.7" stroke="#f59e0b" strokeWidth="2" />
        <text x="260" y="134" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
          ÇEKİRDEK
        </text>
        <text x="260" y="84" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">
          Formel Katman: {c1.slice(0, 18)}
        </text>
        <text x="260" y="55" fill="#a5b4fc" fontSize="10" fontFamily="monospace" textAnchor="middle">
          Üst-Sistem: {c2.slice(0, 20)}
        </text>

        {/* Right Side: Analytical Readout Boxes */}
        <line x1="322" y1="130" x2="475" y2="75" stroke="#f59e0b" strokeWidth="1.5" />
        <line x1="380" y1="130" x2="475" y2="130" stroke="#38bdf8" strokeWidth="1.5" />
        <line x1="435" y1="130" x2="475" y2="185" stroke="#a855f7" strokeWidth="1.5" />

        <rect x="475" y="52" width="275" height="44" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="490" y="71" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
          1. Ontolojik Çekirdek
        </text>
        <text x="490" y="86" fill="#e2e8f0" fontSize="10">
          {c1.slice(0, 34)}
        </text>

        <rect x="475" y="108" width="275" height="44" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
        <text x="490" y="127" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
          2. Yapısal Bağıntı & Ölçüm
        </text>
        <text x="490" y="142" fill="#e2e8f0" fontSize="10">
          {sectionTitle.slice(0, 34)}
        </text>

        <rect x="475" y="164" width="275" height="44" rx="8" fill="#0f172a" stroke="#a855f7" strokeWidth="1.5" />
        <text x="490" y="183" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold">
          3. Fenomenolojik / Kuramsal Sonuç
        </text>
        <text x="490" y="198" fill="#e2e8f0" fontSize="10">
          {c3.slice(0, 34)}
        </text>
      </svg>
    );
  };

  return (
    <>
      <figure className="my-6 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono font-bold text-[10px]">
              {lang === 'tr' ? `ŞEKİL ${sectionIndex + 1}` : `FIGURE ${sectionIndex + 1}`}
            </span>
            <span className="font-semibold text-slate-200 truncate">
              {sectionTitle} — {lang === 'tr' ? 'Kavramsal & Yapısal Diyagram' : 'Conceptual & Structural Diagram'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300 hover:text-amber-400 flex items-center gap-1 transition cursor-pointer shrink-0"
            title={lang === 'tr' ? 'Diyagramı Tam Ekran İncele' : 'Inspect Diagram Fullscreen'}
          >
            <Maximize2 className="w-3 h-3" />
            <span>{lang === 'tr' ? 'Büyüt' : 'Zoom'}</span>
          </button>
        </div>

        <div className="p-3 sm:p-4 bg-slate-950/50">{renderSvgContent()}</div>

        <figcaption className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80 text-[11px] text-slate-400 font-serif flex flex-wrap items-center justify-between gap-2">
          <span>
            <strong className="text-amber-400 font-sans">
              {lang === 'tr' ? `Şekil ${sectionIndex + 1}:` : `Figure ${sectionIndex + 1}:`}
            </strong>{' '}
            {article.title} — <em>{sectionTitle}</em>{' '}
            {lang === 'tr'
              ? 'bölümündeki kavramsal bağıntıların, durum geçişlerinin ve formel sınırların şematik gösterimi.'
              : 'schematic representation of conceptual relations, state transitions, and formal boundaries.'}
          </span>
          <span className="font-mono text-[10px] text-slate-500 shrink-0">
            ID: {article.slug.slice(0, 22)} • Fig-{sectionIndex + 1}
          </span>
        </figcaption>
      </figure>

      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full rounded-3xl bg-slate-900 border border-amber-500/40 overflow-hidden shadow-2xl space-y-4 p-6"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  {lang === 'tr' ? `ŞEKİL ${sectionIndex + 1} • TAM EKRAN İNCELEME` : `FIGURE ${sectionIndex + 1} • FULLSCREEN VIEW`}
                </span>
                <h4 className="text-lg font-bold text-white">{sectionTitle}</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">{renderSvgContent()}</div>
            <p className="text-xs text-slate-300 font-serif">{article.summary}</p>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Her Makalenin Okuma Görünümünde Yer Alan Kapsamlı Etkileşimli Bilimsel & Felsefi Diyagramlar Galerisi
 * (4 Sekmeli / Tam Görünümlü:
 *   1. Nedensel & Kavramsal Topoloji Ağacı
 *   2. Diyalektik Faz ve Sentez Mimarisi
 *   3. Etkileşimli Matematiksel Faz Eğrisi Simülatörü
 *   4. Çok Katmanlı Ontolojik & Epistemolojik Matris)
 */
export const ArticleDiagramsSuite: React.FC<ArticleVisualsProps> = ({ article, lang = 'tr' }) => {
  const [activeDiagramTab, setActiveDiagramTab] = useState<'all' | 'causal' | 'dialectical' | 'phase' | 'matrix'>('all');
  const [couplingParam, setCouplingParam] = useState<number>(65);
  const [entropyParam, setEntropyParam] = useState<number>(40);
  const [zoomedTitle, setZoomedTitle] = useState<string | null>(null);

  const subcategory = useMemo(() => resolveArticleSubcategory(article), [article]);
  const concepts = useMemo(() => extractKeyConcepts(article), [article]);
  const archetype = useMemo(
    () => detectArticleArchetype(article.slug, article.title, article.category, article.tags),
    [article.slug, article.title, article.category, article.tags]
  );
  const seed = useMemo(() => hashStr(article.slug), [article.slug]);

  const primaryFormula = article.mathFormulations?.[0];
  const secondaryFormula = article.mathFormulations?.[1];
  const triad = article.dialecticalTriad;

  // Compute interactive phase curves from slider parameters
  const { curveA, curveB, equilibriumY } = useMemo(() => {
    const ptsA: string[] = [];
    const ptsB: string[] = [];
    const k = couplingParam / 50;
    const s = entropyParam / 50;
    const baseFreq = 1.2 + (seed % 4) * 0.35;

    for (let x = 60; x <= 740; x += 8) {
      const t = (x - 60) / 680;
      const y1 =
        140 -
        Math.sin(t * Math.PI * 2 * baseFreq * k) * (58 * Math.exp(-t * s * 0.65)) -
        Math.cos(t * Math.PI * 3) * (16 * k);
      const y2 =
        140 +
        Math.cos(t * Math.PI * 2 * baseFreq * (0.85 * k)) * (46 * Math.exp(-t * 0.3)) +
        (t - 0.5) * 30 * s;
      ptsA.push(`${x},${Math.max(28, Math.min(242, y1)).toFixed(1)}`);
      ptsB.push(`${x},${Math.max(28, Math.min(242, y2)).toFixed(1)}`);
    }
    const eqY = Math.max(45, Math.min(220, Math.round(140 - (k - s) * 22)));
    return { curveA: ptsA.join(' '), curveB: ptsB.join(' '), equilibriumY: eqY };
  }, [couplingParam, entropyParam, seed]);

  return (
    <section
      id="sec-visual-diagrams"
      className="scroll-mt-28 my-10 p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-xl space-y-6"
    >
      {/* Üst Başlık ve Sekme Seçiciler */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">
              {lang === 'tr' ? 'MAKALEYE ÖZEL GÖRSEL MODELLER & DİYAGRAMLAR' : 'ARTICLE-SPECIFIC VISUAL MODELS & DIAGRAMS'}
            </span>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 text-[10px] font-mono">
              {archetype.toUpperCase()} • {lang === 'tr' ? subcategory.titleTr : subcategory.titleEn}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            {lang === 'tr'
              ? `${article.title} — Yapısal Şemalar ve Faz Diyagramları`
              : `${article.title} — Structural Schemas & Phase Diagrams`}
          </h3>
        </div>

        {/* Diyagram Filtre Sekmeleri */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
          {[
            { id: 'all', labelTr: 'Tüm Diyagramlar (4)', labelEn: 'All Diagrams (4)', icon: Sparkles },
            { id: 'causal', labelTr: 'Nedensel Ağ', labelEn: 'Causal DAG', icon: GitBranch },
            { id: 'dialectical', labelTr: 'Diyalektik Akış', labelEn: 'Dialectics', icon: Layers },
            { id: 'phase', labelTr: 'Faz Simülatörü', labelEn: 'Phase Plot', icon: Activity },
            { id: 'matrix', labelTr: 'Ontolojik Matris', labelEn: 'Matrix', icon: Compass }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeDiagramTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveDiagramTab(tab.id as any)}
                className={`px-2.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? tab.labelTr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Diyagramlar Izgarası */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* DİYAGRAM 1: KAVRAMSAL TOPOLOJİ VE NEDENSEL AKIM ŞEMASI (DAG) */}
        {(activeDiagramTab === 'all' || activeDiagramTab === 'causal') && (
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between">
            <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  {lang === 'tr'
                    ? 'Diyagram A: Kavramsal Topoloji ve Nedensel Mekanizma Ağı'
                    : 'Diagram A: Conceptual Topology & Causal Mechanism DAG'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-400">DAG-Topoloji</span>
            </div>

            <div className="p-4">
              <svg viewBox="0 0 760 320" className="w-full h-auto">
                <defs>
                  <marker id="dagArrowAmber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                  </marker>
                  <marker id="dagArrowSky" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                  </marker>
                  <marker id="dagArrowEmerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                  </marker>
                </defs>
                <rect width="760" height="320" rx="12" fill="#030712" />

                {/* Directed Edges */}
                <path d="M 210 85 L 295 140" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#dagArrowAmber)" />
                <path d="M 210 235 L 295 180" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#dagArrowSky)" />
                <path d="M 465 160 L 545 95" stroke="#10b981" strokeWidth="2" markerEnd="url(#dagArrowEmerald)" />
                <path d="M 465 160 L 545 225" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#dagArrowAmber)" />
                <path d="M 635 125 L 635 195" stroke="#a855f7" strokeWidth="1.8" strokeDasharray="4 3" markerEnd="url(#dagArrowSky)" />

                {/* Left Upper Node */}
                <rect x="30" y="45" width="180" height="72" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.8" />
                <text x="120" y="68" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  1. FİZİKSEL / ONTOLOJİK ÖNCÜL
                </text>
                <text x="120" y="90" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {(concepts[0] || 'Temel Öncül').slice(0, 24)}
                </text>
                <text x="120" y="106" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  {article.categoryTitle.slice(0, 24)}
                </text>

                {/* Left Lower Node */}
                <rect x="30" y="198" width="180" height="72" rx="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
                <text x="120" y="221" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  2. EPİSTEMİK / FORMEL KOŞUL
                </text>
                <text x="120" y="243" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {(concepts[1] || 'Formel Yapı').slice(0, 24)}
                </text>
                <text x="120" y="259" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  {(lang === 'tr' ? subcategory.titleTr : subcategory.titleEn).slice(0, 24)}
                </text>

                {/* Center Core Mechanism Node */}
                <rect x="295" y="112" width="170" height="96" rx="14" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="2.4" />
                <text x="380" y="138" fill="#fde68a" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  MERKEZİ DÖNÜŞÜM ÇEKİRDEĞİ
                </text>
                <text x="380" y="162" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {(concepts[2] || article.title).slice(0, 22)}
                </text>
                <text x="380" y="182" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  {primaryFormula ? primaryFormula.domain.slice(0, 22) : 'Sci-Phi Operatörü'}
                </text>
                <text x="380" y="198" fill="#34d399" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  [Nedensel Köprü]
                </text>

                {/* Right Upper Node */}
                <rect x="545" y="45" width="185" height="72" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="1.8" />
                <text x="637" y="68" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  3. MATEMATİKSEL İZOMORFİZM
                </text>
                <text x="637" y="90" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {(primaryFormula?.title || concepts[3] || 'Formel Model').slice(0, 24)}
                </text>
                <text x="637" y="106" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  Doğrulanabilir Çıkarım
                </text>

                {/* Right Lower Node */}
                <rect x="545" y="198" width="185" height="72" rx="10" fill="#0f172a" stroke="#a855f7" strokeWidth="1.8" />
                <text x="637" y="221" fill="#c084fc" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  4. FELSEFİ & NORMATİF SONUÇ
                </text>
                <text x="637" y="243" fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {(concepts[4] || 'Külliyat Sentezi').slice(0, 24)}
                </text>
                <text x="637" y="259" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  Üst-Bilişsel Çözümleme
                </text>

                <text x="380" y="302" fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Yönlü Nedensel Çizge (DAG): G = (V, E) • {article.slug}
                </text>
              </svg>
            </div>

            <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 font-serif">
              {lang === 'tr'
                ? 'Makaledeki temel önermelerin fiziksel/ontolojik öncüllerden matematiksel izomorfizme ve felsefi senteze uzanan yönlü nedensel akışı.'
                : 'Directed causal flow of the essay from ontological premises to mathematical isomorphism and philosophical synthesis.'}
            </div>
          </div>
        )}

        {/* DİYAGRAM 2: DİYALEKTİK FAZ UZAYI VE AUFHEBUNG SENTEZ ŞEMASI */}
        {(activeDiagramTab === 'all' || activeDiagramTab === 'dialectical') && (
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between">
            <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white">
                  {lang === 'tr'
                    ? 'Diyagram B: Diyalektik Gerilim ve Aufhebung (Üst-Sentez) Şeması'
                    : 'Diagram B: Dialectical Tension & Aufhebung Synthesis Schema'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-indigo-400">Tez ⊕ Antitez → Sentez</span>
            </div>

            <div className="p-4">
              <svg viewBox="0 0 760 320" className="w-full h-auto">
                <rect width="760" height="320" rx="12" fill="#040711" />

                {/* Dialectical Triangle & Spiral Lines */}
                <polygon
                  points="380,48 145,245 615,245"
                  fill="#1e1b4b"
                  fillOpacity="0.25"
                  stroke="#6366f1"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />
                <path
                  d="M 185 220 Q 380 280, 575 220"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <path d="M 175 195 Q 260 110, 345 75" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
                <path d="M 585 195 Q 500 110, 415 75" fill="none" stroke="#f59e0b" strokeWidth="2.5" />

                {/* Synthesis Top Apex */}
                <rect x="230" y="22" width="300" height="72" rx="12" fill="#0f172a" stroke="#10b981" strokeWidth="2.2" />
                <text x="380" y="43" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  ▲ SENTEZ (AUFHEBUNG / ÜST-ÇÖZÜM)
                </text>
                <text x="380" y="63" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {(triad?.synthesis || article.summary).slice(0, 42)}...
                </text>
                <text x="380" y="81" fill="#a7f3d0" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  Koruyarak Aşma • Yeni Epistemik Düzlem
                </text>

                {/* Thesis Bottom Left */}
                <rect x="35" y="195" width="255" height="78" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                <text x="162" y="216" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  ◀ I. TEZ (BİRİNCİL ÖNERME)
                </text>
                <text x="162" y="236" fill="#f8fafc" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  {(triad?.thesis || concepts[0] || 'Klasik / Deterministik Önerme').slice(0, 34)}...
                </text>
                <text x="162" y="256" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  Pozitif İddia (A)
                </text>

                {/* Antithesis Bottom Right */}
                <rect x="470" y="195" width="255" height="78" rx="12" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
                <text x="597" y="216" fill="#fb7185" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                  II. ANTİTEZ (KARŞIT KUTUP) ▶
                </text>
                <text x="597" y="236" fill="#f8fafc" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                  {(triad?.antithesis || concepts[1] || 'Kuantum / Belirsizlik Karşı-Önermesi').slice(0, 34)}...
                </text>
                <text x="597" y="256" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                  Negatif Değilleme (¬A)
                </text>

                {/* Center Conflict Core */}
                <circle cx="380" cy="168" r="28" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="2" />
                <text x="380" y="165" fill="#fbbf24" fontSize="13" fontWeight="bold" fontFamily="serif" textAnchor="middle">
                  ΔΦ
                </text>
                <text x="380" y="180" fill="#cbd5e1" fontSize="8" fontFamily="monospace" textAnchor="middle">
                  Çatışma
                </text>

                <text x="380" y="304" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Diyalektik Faz Geçişi: Tez ⊗ Antitez ➔ Sentez ({article.objections?.length || 2} Felsefi İtiraz Çözümlendi)
                </text>
              </svg>
            </div>

            <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 font-serif">
              {lang === 'tr'
                ? 'Tez ve Antitez arasındaki kavramsal gerilimin diyalektik üst-sentez (Aufhebung) düzleminde bütünleştirilmesi.'
                : 'Integration of the conceptual tension between Thesis and Antithesis into a higher dialectical synthesis.'}
            </div>
          </div>
        )}

        {/* DİYAGRAM 3: ETKİLEŞİMLİ MATEMATİKSEL FAZ UZAYI VE PARAMETRE SİMÜLATÖRÜ */}
        {(activeDiagramTab === 'all' || activeDiagramTab === 'phase') && (
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between">
            <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  {lang === 'tr'
                    ? 'Diyagram C: Etkileşimli Matematiksel Faz Eğrisi ve Parametre Dinamiği'
                    : 'Diagram C: Interactive Mathematical Phase Plot & Parameter Dynamics'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <Sliders className="w-3 h-3" />
                <span>{lang === 'tr' ? 'Canlı Parametre Kontrolü' : 'Live Parameter Control'}</span>
              </span>
            </div>

            <div className="p-4 space-y-3">
              {/* Etkileşimli Kaydırıcılar (Sliders) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
                <label className="space-y-1 block">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-amber-400">
                      {lang === 'tr' ? 'Eşleşme / Bağlaşım Katsayısı (λ):' : 'Coupling Coefficient (λ):'}
                    </span>
                    <strong className="text-white">{(couplingParam / 50).toFixed(2)}</strong>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={100}
                    value={couplingParam}
                    onChange={(e) => setCouplingParam(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </label>

                <label className="space-y-1 block">
                  <div className="flex justify-between font-mono text-[11px]">
                    <span className="text-sky-400">
                      {lang === 'tr' ? 'Entropi / Sönümleme Gradyanı (σ):' : 'Entropy / Damping Gradient (σ):'}
                    </span>
                    <strong className="text-white">{(entropyParam / 50).toFixed(2)}</strong>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={entropyParam}
                    onChange={(e) => setEntropyParam(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer"
                  />
                </label>
              </div>

              <svg viewBox="0 0 760 270" className="w-full h-auto">
                <rect width="760" height="270" rx="12" fill="#030712" />
                {/* Coordinate grid */}
                <g stroke="#1e293b" strokeWidth="1">
                  <line x1="60" y1="25" x2="60" y2="235" stroke="#475569" strokeWidth="1.5" />
                  <line x1="60" y1="140" x2="740" y2="140" stroke="#475569" strokeWidth="1.5" />
                  <line x1="60" y1="75" x2="740" y2="75" strokeDasharray="3 3" />
                  <line x1="60" y1="205" x2="740" y2="205" strokeDasharray="3 3" />
                </g>

                {/* Equilibrium Asymptote */}
                <line
                  x1="60"
                  y1={equilibriumY}
                  x2="740"
                  y2={equilibriumY}
                  stroke="#10b981"
                  strokeWidth="1.3"
                  strokeDasharray="6 4"
                />

                {/* Dynamic Curves */}
                <polyline fill="none" stroke="#f59e0b" strokeWidth="2.6" points={curveA} />
                <polyline fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" points={curveB} />

                <text x="72" y="44" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  — {primaryFormula ? primaryFormula.title.slice(0, 36) : 'Birincil Durum Fonksiyonu Ψ(t)'}
                </text>
                <text x="72" y="60" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                  -- {secondaryFormula ? secondaryFormula.title.slice(0, 36) : 'Eşlenik Epistemik Yoğunluk Φ(t)'}
                </text>
                <text x="610" y={equilibriumY - 6} fill="#34d399" fontSize="9" fontFamily="monospace">
                  Asimptotik Denge
                </text>
                <text x="400" y="256" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  Parametre Uzayı: λ = {(couplingParam / 50).toFixed(2)} • σ = {(entropyParam / 50).toFixed(2)}
                </text>
              </svg>
            </div>

            <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 font-serif">
              {lang === 'tr'
                ? 'Yukarıdaki kaydırıcıları hareket ettirerek makaledeki matematiksel modelin bağlaşım (λ) ve entropi (σ) parametrelerine verdiği dinamik tepkiyi inceleyebilirsiniz.'
                : 'Adjust the sliders above to inspect how the mathematical model responds to coupling (λ) and entropy (σ) parameters.'}
            </div>
          </div>
        )}

        {/* DİYAGRAM 4: ÇOK KATMANLI ONTOLOJİK VE EPİSTEMOLOJİK MATRİS */}
        {(activeDiagramTab === 'all' || activeDiagramTab === 'matrix') && (
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between">
            <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-white">
                  {lang === 'tr'
                    ? 'Diyagram D: Çok Katmanlı Ontolojik ve Epistemolojik Yapı Matrisi'
                    : 'Diagram D: Multi-Layer Ontological & Epistemological Matrix'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-sky-400">3-Katmanlı Mimari</span>
            </div>

            <div className="p-4">
              <svg viewBox="0 0 760 320" className="w-full h-auto">
                <rect width="760" height="320" rx="12" fill="#030712" />

                {/* Layer 3: Top Phenomenological / Normative Layer */}
                <rect x="45" y="24" width="670" height="74" rx="12" fill="#1e1b4b" fillOpacity="0.65" stroke="#a855f7" strokeWidth="1.8" />
                <text x="65" y="46" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  KATMAN III — FENOMENOLOJİK, BİLİŞSEL VE NORMATİF ÜST-YAPI
                </text>
                <text x="65" y="66" fill="#ffffff" fontSize="11" fontWeight="bold">
                  {(concepts[4] || article.title).slice(0, 48)}
                </text>
                <text x="65" y="84" fill="#cbd5e1" fontSize="9.5" fontFamily="monospace">
                  Gözlemci Deneyimi • Bilinç / Anlam • Etik ve Felsefi Sonuç
                </text>

                {/* Layer 2: Middle Systemic / Emergent / Mathematical Layer */}
                <rect x="45" y="120" width="670" height="74" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
                <text x="65" y="142" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  KATMAN II — SİSTEMİK BELİRİM (EMERGENCE) VE FORMEL İZOMORFİZM
                </text>
                <text x="65" y="162" fill="#ffffff" fontSize="11" fontWeight="bold">
                  {(primaryFormula?.title || concepts[2] || subcategory.titleTr).slice(0, 48)}
                </text>
                <text x="65" y="180" fill="#cbd5e1" fontSize="9.5" fontFamily="monospace">
                  Enformasyon İşleme • Nedensel Kısıtlar • {primaryFormula?.domain || 'Matematiksel Yapı'}
                </text>

                {/* Layer 1: Bottom Physical / Ontological Substrate */}
                <rect x="45" y="216" width="670" height="74" rx="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.8" />
                <text x="65" y="238" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  KATMAN I — MİKRO-FİZİKSEL VE ONTOLOJİK ALT-YAPI (SUBSTRATE)
                </text>
                <text x="65" y="258" fill="#ffffff" fontSize="11" fontWeight="bold">
                  {(concepts[0] || article.categoryTitle).slice(0, 48)}
                </text>
                <text x="65" y="276" fill="#cbd5e1" fontSize="9.5" fontFamily="monospace">
                  Uzay-Zaman / Kuantum Durum Uzayı • Fiziksel Yasalar • Başlangıç Koşulları
                </text>

                {/* Vertical Upward Emergence & Downward Causation Arrows */}
                <line x1="640" y1="216" x2="640" y2="194" stroke="#f59e0b" strokeWidth="2.5" />
                <line x1="640" y1="120" x2="640" y2="98" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="645" y="209" fill="#fbbf24" fontSize="9" fontFamily="monospace">
                  ↑ Belirim
                </text>
                <text x="645" y="113" fill="#38bdf8" fontSize="9" fontFamily="monospace">
                  ↑ Üst-Biliş
                </text>
              </svg>
            </div>

            <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 font-serif">
              {lang === 'tr'
                ? 'Makalenin mikro-fiziksel/ontolojik alt-yapıdan sistemik formel modele ve fenomenolojik/felsefi üst-yapıya uzanan 3 katmanlı mimarisi.'
                : 'Three-tier architecture spanning from the ontological substrate to systemic formalism and phenomenological superstructure.'}
            </div>
          </div>
        )}
      </div>

      {zoomedTitle && (
        <div
          onClick={() => setZoomedTitle(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4"
        >
          <button
            onClick={() => setZoomedTitle(null)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            {lang === 'tr' ? 'Kapat' : 'Close'}
          </button>
        </div>
      )}
    </section>
  );
};

/**
 * Her Makalenin Okuma Sayfasında Yer Alan Etkileşimli Makale Simülasyonu Laboratuvarı
 * Makalenin anlamsal içeriğine, diyalektik üçlüsüne (Tez / Antitez / Sentez) ve matematiksel formülüne
 * doğrudan bağlı canlı parametreler, zaman adımı animasyonu ve senaryo modları sunar.
 */
export const ArticleInteractiveSimulationLab: React.FC<ArticleVisualsProps> = ({
  article,
  lang = 'tr'
}) => {
  const [thesisWeight, setThesisWeight] = useState<number>(68);
  const [antithesisTension, setAntithesisTension] = useState<number>(44);
  const [observerCoupling, setObserverCoupling] = useState<number>(75);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [simStep, setSimStep] = useState<number>(0);
  const [activePreset, setActivePreset] = useState<'thesis' | 'antithesis' | 'synthesis'>('synthesis');

  const subcategory = useMemo(() => resolveArticleSubcategory(article), [article]);
  const concepts = useMemo(() => extractKeyConcepts(article), [article]);
  const archetype = useMemo(
    () => detectArticleArchetype(article.slug, article.title, article.category, article.tags),
    [article.slug, article.title, article.category, article.tags]
  );
  const seed = useMemo(() => hashStr(article.slug), [article.slug]);

  const primaryFormula = article.mathFormulations?.[0];
  const triad = article.dialecticalTriad;

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setSimStep((prev) => (prev + 1) % 360);
    }, 60);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  const applyScenarioPreset = (preset: 'thesis' | 'antithesis' | 'synthesis') => {
    setActivePreset(preset);
    if (preset === 'thesis') {
      setThesisWeight(86);
      setAntithesisTension(22);
      setObserverCoupling(55);
    } else if (preset === 'antithesis') {
      setThesisWeight(34);
      setAntithesisTension(88);
      setObserverCoupling(48);
    } else {
      setThesisWeight(72);
      setAntithesisTension(52);
      setObserverCoupling(88);
    }
  };

  const resetSimulation = () => {
    setActivePreset('synthesis');
    setThesisWeight(68);
    setAntithesisTension(44);
    setObserverCoupling(75);
    setSimStep(0);
    setIsRunning(true);
  };

  // Compute live semantic simulation telemetry and wave/trajectory geometry
  const {
    primaryWave,
    counterWave,
    synthesisEnvelope,
    coherenceScore,
    synthesisIndex,
    entropyDelta,
    nodeX,
    nodeY
  } = useMemo(() => {
    const ptsPrimary: string[] = [];
    const ptsCounter: string[] = [];
    const ptsSynth: string[] = [];

    const alpha = thesisWeight / 100;
    const beta = antithesisTension / 100;
    const gamma = observerCoupling / 100;
    const phaseRad = (simStep * Math.PI) / 45 + (seed % 180) * (Math.PI / 180);
    const freqBase = 1.4 + (seed % 5) * 0.3;

    for (let x = 55; x <= 745; x += 10) {
      const u = (x - 55) / 690;
      const yThesis =
        145 -
        Math.sin(u * Math.PI * 2 * freqBase + phaseRad) * (62 * alpha) * Math.exp(-u * 0.25 * beta);
      const yAntithesis =
        145 +
        Math.cos(u * Math.PI * 2 * (freqBase * 1.15) - phaseRad * 0.8) * (58 * beta);
      const ySynth =
        145 -
        ((145 - yThesis) * gamma * 0.65 + (145 - yAntithesis) * (1 - beta * 0.4) * 0.55) -
        Math.sin(u * Math.PI + phaseRad * 0.5) * (18 * gamma);

      ptsPrimary.push(`${x},${Math.max(26, Math.min(258, yThesis)).toFixed(1)}`);
      ptsCounter.push(`${x},${Math.max(26, Math.min(258, yAntithesis)).toFixed(1)}`);
      ptsSynth.push(`${x},${Math.max(26, Math.min(258, ySynth)).toFixed(1)}`);
    }

    const probeU = ((simStep % 120) / 120);
    const px = 55 + probeU * 690;
    const py =
      145 -
      Math.sin(probeU * Math.PI * 2 * freqBase + phaseRad) * (38 * alpha * gamma) -
      Math.sin(probeU * Math.PI + phaseRad * 0.5) * (18 * gamma);

    const coherence = Math.min(
      99.8,
      Math.max(42.0, 58 + gamma * 34 + alpha * 12 - Math.abs(alpha - beta) * 14)
    );
    const phiVal = ((alpha * gamma * 1.85) / (0.45 + beta * 0.55)).toFixed(3);
    const dS = ((beta * 1.2 - gamma * 0.85) * 0.6).toFixed(3);

    return {
      primaryWave: ptsPrimary.join(' '),
      counterWave: ptsCounter.join(' '),
      synthesisEnvelope: ptsSynth.join(' '),
      coherenceScore: coherence.toFixed(1),
      synthesisIndex: phiVal,
      entropyDelta: dS,
      nodeX: px,
      nodeY: Math.max(34, Math.min(248, py))
    };
  }, [thesisWeight, antithesisTension, observerCoupling, simStep, seed]);

  const sliderLabels = useMemo(() => {
    switch (archetype) {
      case 'quantum':
        return {
          p1: lang === 'tr' ? 'Süperpozisyon / Dolanıklık Genliği (α)' : 'Entanglement / Superposition Amplitude (α)',
          p2: lang === 'tr' ? 'Çevresel Dekoherans / Belirsizlik (β)' : 'Environmental Decoherence / Uncertainty (β)',
          p3: lang === 'tr' ? 'Gözlemci / Ölçüm Çöküş Etkisi (γ)' : 'Observer / Measurement Collapse Coupling (γ)'
        };
      case 'spacetime':
      case 'wormhole':
        return {
          p1: lang === 'tr' ? 'Kütle-Enerji / Gravitasyon Eğriliği (α)' : 'Mass-Energy / Gravitational Curvature (α)',
          p2: lang === 'tr' ? 'Kuantum Köpüğü / Olay Ufku Gerilimi (β)' : 'Quantum Foam / Horizon Tension (β)',
          p3: lang === 'tr' ? 'Öz-Zaman / Holografik İzdüşüm (γ)' : 'Proper Time / Holographic Projection (γ)'
        };
      case 'consciousness':
      case 'neuroscience':
        return {
          p1: lang === 'tr' ? 'Nörobilişsel Entegrasyon / İçsel Özerklik (α)' : 'Neurocognitive Integration / Autonomy (α)',
          p2: lang === 'tr' ? 'Dışsal Arayüz / İndirgemeci Baskı (β)' : 'External BCI / Reductionist Pressure (β)',
          p3: lang === 'tr' ? 'Multidisipliner Şuur & Sentez Kapasitesi (γ)' : 'Multidisciplinary Consciousness Capacity (γ)'
        };
      case 'computation':
      case 'ai_ethics':
        return {
          p1: lang === 'tr' ? 'Ön-Eğitimli (Pre-Trained) Yapısal Öncül (α)' : 'Pre-Trained Structural Prior (α)',
          p2: lang === 'tr' ? 'Sentaktik Darboğaz / Algoritmik Sapma (β)' : 'Syntactic Bottleneck / Algorithmic Drift (β)',
          p3: lang === 'tr' ? 'Semantik Anlam & İradi Hizalama (γ)' : 'Semantic Meaning & Volitional Alignment (γ)'
        };
      default:
        return {
          p1: lang === 'tr' ? 'I. Tez / Başlangıç Öncülü Ağırlığı (α)' : 'I. Thesis / Opening Premise Weight (α)',
          p2: lang === 'tr' ? 'II. Antitez / Karşıt Sorgulama Gerilimi (β)' : 'II. Antithesis / Counter-Inquiry Tension (β)',
          p3: lang === 'tr' ? 'III. Diyalektik Sentez / Aufhebung Yakınsaması (γ)' : 'III. Dialectical Synthesis Convergence (γ)'
        };
    }
  }, [archetype, lang]);

  return (
    <section
      id="sec-article-simulator"
      className="scroll-mt-28 my-10 p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/50 border-2 border-emerald-500/40 shadow-2xl space-y-6 no-print"
    >
      {/* Üst Başlık ve Canlı Simülasyon Kontrolleri */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {lang === 'tr'
                  ? 'MAKALEYE ÖZEL ETKİLEŞİMLİ SİMÜLASYON LABORATUVARI'
                  : 'INTERACTIVE ARTICLE SIMULATION LABORATORY'}
              </span>
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
              {archetype.toUpperCase()} • {lang === 'tr' ? subcategory.titleTr : subcategory.titleEn}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            {lang === 'tr'
              ? `${article.title} — Canlı Kavramsal ve Matematiksel Simülatör`
              : `${article.title} — Live Conceptual & Mathematical Simulator`}
          </h3>
          <p className="text-xs text-slate-300 font-serif">
            {lang === 'tr'
              ? 'Bu simülasyon makalenin başlangıç önermesini (Tez), karşıt sorgulamasını (Antitez), ulaştığı diyalektik sentezi ve matematiksel formülasyonunu gerçek zamanlı olarak modeller.'
              : 'This simulation models the article’s opening premise (Thesis), counter-inquiry (Antithesis), dialectical synthesis, and mathematical formulation in real time.'}
          </p>
        </div>

        {/* Oynat / Duraklat / Sıfırla ve Senaryo Modları */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsRunning((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isRunning
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>
              {isRunning
                ? lang === 'tr'
                  ? 'Simülasyon Aktif'
                  : 'Running'
                : lang === 'tr'
                ? 'Devam Ettir'
                : 'Resume'}
            </span>
          </button>

          <button
            type="button"
            onClick={resetSimulation}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'tr' ? 'Sıfırla' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* 3 Diyalektik Senaryo Ön-Ayarı (Presets) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/90 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase">
            {lang === 'tr' ? 'Simülasyon Rejimi:' : 'Simulation Regime:'}
          </span>
          {[
            {
              id: 'thesis',
              labelTr: 'I. Tez Baskın Mod',
              labelEn: 'I. Thesis Dominant'
            },
            {
              id: 'antithesis',
              labelTr: 'II. Antitez / Çatışma Modu',
              labelEn: 'II. Antithesis / Conflict'
            },
            {
              id: 'synthesis',
              labelTr: 'III. Diyalektik Sentez Dengesi (Önerilen)',
              labelEn: 'III. Dialectical Synthesis Equilibrium'
            }
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyScenarioPreset(preset.id as 'thesis' | 'antithesis' | 'synthesis')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activePreset === preset.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {lang === 'tr' ? preset.labelTr : preset.labelEn}
            </button>
          ))}
        </div>

        {/* Canlı Telemetri Rozetleri */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300">
            Φ_sentez = <strong>{synthesisIndex}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-500/30 text-amber-300">
            {lang === 'tr' ? 'Epistemik Tutarlılık:' : 'Coherence:'} <strong>%{coherenceScore}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-sky-500/30 text-sky-300">
            ΔS = <strong>{entropyDelta}</strong>
          </span>
        </div>
      </div>

      {/* 3 Anlamsal Parametre Kaydırıcısı (Sliders) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
        <label className="space-y-1.5 block">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-sky-400 font-semibold">{sliderLabels.p1}</span>
            <strong className="text-white">% {thesisWeight}</strong>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={thesisWeight}
            onChange={(e) => setThesisWeight(Number(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400 font-serif truncate">
            {(triad?.thesis || concepts[0] || article.title).slice(0, 75)}
          </p>
        </label>

        <label className="space-y-1.5 block">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-rose-400 font-semibold">{sliderLabels.p2}</span>
            <strong className="text-white">% {antithesisTension}</strong>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={antithesisTension}
            onChange={(e) => setAntithesisTension(Number(e.target.value))}
            className="w-full accent-rose-400 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400 font-serif truncate">
            {(triad?.antithesis || concepts[1] || article.subtitle).slice(0, 75)}
          </p>
        </label>

        <label className="space-y-1.5 block">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 font-semibold">{sliderLabels.p3}</span>
            <strong className="text-white">% {observerCoupling}</strong>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={observerCoupling}
            onChange={(e) => setObserverCoupling(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400 font-serif truncate">
            {(triad?.synthesis || article.summary).slice(0, 75)}
          </p>
        </label>
      </div>

      {/* Canlı Simülasyon Görsel Tuvali (Interactive SVG Canvas) */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3 sm:p-4 overflow-hidden">
        <svg viewBox="0 0 800 285" className="w-full h-auto">
          <defs>
            <linearGradient id={`simBg-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="50%" stopColor="#091024" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <radialGradient id={`simGlow-${seed}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="800" height="285" rx="14" fill={`url(#simBg-${seed})`} />

          {/* Grid Coordinates */}
          <g stroke="#1e293b" strokeWidth="1">
            {[55, 100, 145, 190, 235].map((y) => (
              <line key={y} x1="55" y1={y} x2="745" y2={y} strokeDasharray="3 3" />
            ))}
            {[170, 285, 400, 515, 630].map((x) => (
              <line key={x} x1={x} y1="25" x2={x} y2="255" strokeDasharray="3 3" />
            ))}
            <line x1="55" y1="145" x2="745" y2="145" stroke="#334155" strokeWidth="1.5" />
          </g>

          {/* Thesis Wave (Sky) */}
          <polyline
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
            strokeOpacity="0.85"
            points={primaryWave}
          />

          {/* Antithesis Wave (Rose) */}
          <polyline
            fill="none"
            stroke="#fb7185"
            strokeWidth="1.8"
            strokeDasharray="6 4"
            strokeOpacity="0.8"
            points={counterWave}
          />

          {/* Dialectical Synthesis Trajectory (Emerald Thick) */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3.2"
            points={synthesisEnvelope}
          />

          {/* Active Quantum / Epistemic State Particle */}
          <circle cx={nodeX} cy={nodeY} r="22" fill={`url(#simGlow-${seed})`} />
          <circle cx={nodeX} cy={nodeY} r="6.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <line
            x1={nodeX}
            y1="28"
            x2={nodeX}
            y2="252"
            stroke="#10b981"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Legend & Formula Overlay */}
          <text x="68" y="42" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
            — I. Tez Dalgası: {(concepts[0] || 'Başlangıç Önermesi').slice(0, 26)} (α={thesisWeight}%)
          </text>
          <text x="68" y="58" fill="#fb7185" fontSize="10" fontFamily="monospace">
            -- II. Antitez Pertürbasyonu: {(concepts[1] || 'Karşıt Gerilim').slice(0, 24)} (β={antithesisTension}%)
          </text>
          <text x="68" y="74" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">
            ━ III. Sentez Yörüngesi (Aufhebung): {(primaryFormula?.title || article.title).slice(0, 34)} (γ={observerCoupling}%)
          </text>

          <text x="400" y="273" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">
            {primaryFormula ? `${primaryFormula.domain} • ` : ''}
            Durum Vektörü t={simStep} • Tutarlılık: %{coherenceScore} • Φ={synthesisIndex}
          </text>
        </svg>
      </div>

      {/* Makale İçeriğiyle Doğrudan Anlamsal Eşleşme Özeti (Tez, Antitez, Sentez ve Formül Bağlantısı) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-serif">
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-sky-500/30 space-y-1">
          <div className="flex items-center justify-between font-sans">
            <span className="text-[10px] font-mono font-bold uppercase text-sky-400">
              {lang === 'tr' ? '1. Simüle Edilen Tez (Öncül)' : '1. Simulated Thesis (Premise)'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">α = %{thesisWeight}</span>
          </div>
          <p className="text-slate-300 leading-relaxed line-clamp-3">
            {triad?.thesis || article.subtitle || article.summary}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-rose-500/30 space-y-1">
          <div className="flex items-center justify-between font-sans">
            <span className="text-[10px] font-mono font-bold uppercase text-rose-400">
              {lang === 'tr' ? '2. Simüle Edilen Antitez (Gerilim)' : '2. Simulated Antithesis (Tension)'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">β = %{antithesisTension}</span>
          </div>
          <p className="text-slate-300 leading-relaxed line-clamp-3">
            {triad?.antithesis || article.objections?.[0]?.objection || article.summary}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 space-y-1">
          <div className="flex items-center justify-between font-sans">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-400">
              {lang === 'tr' ? '3. Simüle Edilen Ana Sentez' : '3. Simulated Core Synthesis'}
            </span>
            <span className="text-[10px] font-mono text-emerald-300">Φ = {synthesisIndex}</span>
          </div>
          <p className="text-slate-200 leading-relaxed line-clamp-3">
            {triad?.synthesis || article.summary}
          </p>
        </div>
      </div>
    </section>
  );
};
