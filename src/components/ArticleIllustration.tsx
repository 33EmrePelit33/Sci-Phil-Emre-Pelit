import React, { useState } from 'react';
import { Maximize2, X, BookOpen } from 'lucide-react';
import { detectArticleArchetype } from './ArticleVisualsAndDiagrams';

interface ArticleIllustrationProps {
  slug: string;
  category?: string;
  title?: string;
  subtitle?: string;
  tags?: string[];
  formula?: string;
  formulaTitle?: string;
  subTopicLabel?: string;
  figureNumber?: number | string;
  thesisSummary?: string;
  className?: string;
  variant?: 'banner' | 'thumbnail';
}

function hashSlug(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function truncateText(text: string, maxLen: number): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLen) return clean;
  return clean.slice(0, maxLen - 1) + '…';
}

function extractTopicNodes(
  title: string,
  subtitle: string,
  tags: string[],
  subTopicLabel?: string,
  archetype?: string
): [string, string, string] {
  const pool: string[] = [];

  for (const tag of tags || []) {
    const cleaned = tag.replace(/^#/, '').trim();
    if (cleaned.length >= 3 && !pool.includes(cleaned)) {
      pool.push(truncateText(cleaned, 22));
    }
  }

  if (subTopicLabel && subTopicLabel.trim().length > 2) {
    const parts = subTopicLabel
      .split(/[&,•/|-]/)
      .map((s) => s.trim())
      .filter((s) => s.length >= 3);
    for (const p of parts) {
      if (!pool.includes(p)) pool.push(truncateText(p, 22));
    }
  }

  const titleParts = `${title} ${subtitle}`
    .split(/[:–—•,;|]/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 4);
  for (const tp of titleParts) {
    const tClean = truncateText(tp, 22);
    if (!pool.includes(tClean)) pool.push(tClean);
  }

  const fallbackByArchetype: Record<string, [string, string, string]> = {
    spacetime: ['Minkowski Uzay-Zaman', 'Işık Konisi Nedensellik', 'Blok Evren Ontolojisi'],
    wormhole: ['Manifold Eğriliği Gμν', 'Einstein-Rosen Köprüsü', 'Topolojik Süreklilik'],
    quantum: ['Hilbert Durum Uzayı', 'Kuantum Dolanıklık |Ψ⟩', 'Yerel-Olmama & Ölçüm'],
    thermodynamics: ['Faz Uzayı & Entropi', 'Termodinamik Zaman Oku', 'Kaotik Çekici Dinamiği'],
    computation: ['Formel Sentaks Kuralları', 'Sembolik Hesaplama', 'Semantik Anlam Boşluğu'],
    neuroscience: ['Hazırlık Potansiyeli RP', 'Nöral Karar Eşiği', 'Özgür İrade & Eylemlilik'],
    consciousness: ['Fenomenal Bilinç (Qualia)', 'Bütünleşik Enformasyon Φ', 'Öznel Deneyim Matrisi'],
    logic: ['Öz-Referans Döngüsü', 'Gödel Eksiklik Teoremi', 'Tarski Doğruluk Hiyerarşisi'],
    dialectics: ['Kurucu Tez Önermesi', 'Eleştirel Antitez', 'Diyalektik Sentez'],
    epistemology: ['Önsel Hipotez P(H)', 'Empirik Kanıt P(E|H)', 'Sonsal Epistemik Güncelleme'],
    ai_ethics: ['Otonom Ajan Kararı', 'Normatif Değer Hizalaması', 'Etik Sorumluluk Matrisi'],
    cosmology: ['Kozmik Manifold Yapısı', 'Evrensel Fizik Sabitleri', 'Ontolojik Yasalar']
  };

  const defaults = fallbackByArchetype[archetype || 'cosmology'] || fallbackByArchetype.cosmology;
  return [
    pool[0] || defaults[0],
    pool[1] || defaults[1],
    pool[2] || defaults[2]
  ];
}

export const ArticleIllustration: React.FC<ArticleIllustrationProps> = ({
  slug,
  category = 'fizik-kozmoloji',
  title = '',
  subtitle = '',
  tags = [],
  formula = '',
  formulaTitle = '',
  subTopicLabel = '',
  figureNumber,
  thesisSummary = '',
  className = '',
  variant = 'banner'
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const isThumbnail = variant === 'thumbnail';
  const cleanTitle = truncateText(title, isThumbnail ? 54 : 62);
  const cleanSubtitle = truncateText(subtitle || thesisSummary, isThumbnail ? 66 : 78);

  const seed = hashSlug(`${slug}:${title}`);
  const archetype = detectArticleArchetype(slug, `${title} ${subtitle}`, category, tags);
  const [topic1, topic2, topic3] = extractTopicNodes(title, subtitle, tags, subTopicLabel, archetype);
  const figIndex = figureNumber ? `1.${figureNumber}` : `1.${(seed % 90) + 10}`;

  const angle1 = (seed % 50) - 25;
  const angle2 = ((seed >> 4) % 70) - 35;
  const radiusOffset = (seed % 32) - 16;

  const badgeLabelByArchetype: Record<string, string> = {
    spacetime: '4D Uzay-Zaman & Minkowski Geometrisi',
    wormhole: 'Genel Görelilik & Manifold Topolojisi',
    quantum: 'Kuantum Hilbert Uzayı & Dolanıklık',
    thermodynamics: 'Termodinamik Faz Uzayı & Entropi',
    computation: 'Sembolik Hesaplama & Sentaks-Semantik',
    neuroscience: 'Nörobilim & Nedensel Karar Eşiği',
    consciousness: 'Bilinç & Bütünleşik Enformasyon (Φ)',
    logic: 'Formel Mantık & Öz-Referans Döngüsü',
    dialectics: 'Diyalektik Sentez (Tez ⊕ Antitez)',
    epistemology: 'Epistemoloji & Bayesyen Çıkarım',
    ai_ethics: 'Yapay Zeka Hizalaması & Etik Matris',
    cosmology: 'Kozmoloji & Fiziksel Ontoloji'
  };

  const formulaLabelByArchetype: Record<string, string> = {
    spacetime: 'ds² = -c²dt² + dx² + dy² + dz²',
    wormhole: 'Gμν + Λgμν = (8πG/c⁴)Tμν',
    quantum: '|Ψ⟩ = α|0⟩|1⟩ - β|1⟩|0⟩ • iℏ∂t|Ψ⟩ = Ĥ|Ψ⟩',
    thermodynamics: 'S = k_B ln(Ω) • dS/dt ≥ 0',
    computation: 'δ(qᵢ, σ) → (qⱼ, τ, L/R) • Sentaks ≠ Semantik',
    neuroscience: 'RP(t) = -550ms → W(-200ms) → M(0ms)',
    consciousness: 'Φ(S) = min D_KL[p(S) || ∏ p(M_k)] > 0',
    logic: 'G ↔ ¬Prov_F(⌜G⌝) • L₀ ⊂ L₁ ⊂ L₂',
    dialectics: 'Tez (A) ⊕ Antitez (¬A) ➔ Sentez (A′)',
    epistemology: 'P(H|E) = [P(E|H) · P(H)] / P(E)',
    ai_ethics: 'arg max_π E[∑ γᵗ U_human(s_t, a_t)]',
    cosmology: 'S = ∫ d⁴x √(-g) [R/(16πG) + L_m]'
  };

  const cleanFormulaSnippet = formulaTitle
    ? `${truncateText(formulaTitle, 28)} • ${formulaLabelByArchetype[archetype] || ''}`
    : formulaLabelByArchetype[archetype] || 'Formel Analitik Model';

  const renderAcademicOverlayStrip = () => (
    <g>
      {/* Üst Akademik Dergi Şekil Başlığı (Graphical Abstract Header) */}
      <rect x="16" y="10" width="768" height="28" rx="7" fill="#020617" fillOpacity="0.82" stroke="#334155" strokeWidth="1" />
      <text x="30" y="28" fill="#fbbf24" fontSize="11" fontFamily="monospace" fontWeight="bold">
        {`FIG. ${figIndex} • GRAPHICAL ABSTRACT`}
      </text>
      <text x="770" y="28" fill="#38bdf8" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="end">
        {truncateText(cleanFormulaSnippet, 52)}
      </text>

      {/* Alt Akademik Konu Özeti Diyagram Düğümleri (3 Ana Konu Sentezi + Makale Başlığı) */}
      <rect x="16" y="346" width="768" height="92" rx="12" fill="#020617" fillOpacity="0.90" stroke="#f59e0b" strokeOpacity="0.4" strokeWidth="1.2" />

      {/* 3 Konu Düğümü Arası Bağlantı Okları */}
      <line x1="252" y1="374" x2="284" y2="374" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="3 2" />
      <polygon points="284,374 277,370 277,378" fill="#f59e0b" />
      <line x1="516" y1="374" x2="548" y2="374" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 2" />
      <polygon points="548,374 541,370 541,378" fill="#38bdf8" />

      {/* Konu 1: Kurucu Kavram / Ontolojik Eksen */}
      <rect x="28" y="356" width="224" height="36" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.3" />
      <text x="38" y="370" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
        I. KAVRAMSAL EKSEN
      </text>
      <text x="38" y="384" fill="#f8fafc" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        {topic1}
      </text>

      {/* Konu 2: Analitik / Diyalektik Problem */}
      <rect x="288" y="356" width="224" height="36" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.3" />
      <text x="298" y="370" fill="#fbbf24" fontSize="9" fontFamily="monospace" fontWeight="bold">
        II. TEORİK MEKANİZMA
      </text>
      <text x="298" y="384" fill="#f8fafc" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        {topic2}
      </text>

      {/* Konu 3: Sentez & Çıkarım */}
      <rect x="548" y="356" width="224" height="36" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.3" />
      <text x="558" y="370" fill="#34d399" fontSize="9" fontFamily="monospace" fontWeight="bold">
        III. AKADEMİK SENTEZ
      </text>
      <text x="558" y="384" fill="#f8fafc" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
        {topic3}
      </text>

      {/* Makale Başlık ve Konu Özeti Alt Satırı */}
      <text x="30" y="414" fill="#fde68a" fontSize="12" fontFamily="serif" fontWeight="bold">
        {cleanTitle}
      </text>
      {cleanSubtitle && (
        <text x="30" y="430" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">
          {cleanSubtitle}
        </text>
      )}
    </g>
  );

  const renderArchetypeSvg = () => {
    switch (archetype) {
      case 'spacetime':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <defs>
              <linearGradient id={`stBg-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="50%" stopColor="#0b1329" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>
              <radialGradient id={`stGlow-${seed}`} cx="50%" cy="45%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#020617" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="800" height="450" fill={`url(#stBg-${seed})`} />
            <circle cx="400" cy="195" r={190 + radiusOffset} fill={`url(#stGlow-${seed})`} />
            {/* 4D Block Hypercube */}
            <g stroke="#38bdf8" strokeWidth="1.3" opacity="0.45" fill="none">
              <polygon points="270,70 540,70 540,250 270,250" strokeDasharray="4 3" />
              <polygon points="210,120 480,120 480,300 210,300" stroke="#38bdf8" strokeWidth="1.7" />
              <line x1="210" y1="120" x2="270" y2="70" />
              <line x1="480" y1="120" x2="540" y2="70" />
              <line x1="480" y1="300" x2="540" y2="250" />
              <line x1="210" y1="300" x2="270" y2="250" />
            </g>
            {/* Past & Future Light Cones */}
            <polygon points="400,190 300,295 500,295" fill="#38bdf8" fillOpacity="0.16" stroke="#38bdf8" strokeWidth="1.5" />
            <ellipse cx="400" cy="295" rx="100" ry="18" fill="#0284c7" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1.3" />
            <polygon points="400,190 300,85 500,85" fill="#f59e0b" fillOpacity="0.18" stroke="#f59e0b" strokeWidth="1.5" />
            <ellipse cx="400" cy="85" rx="100" ry="18" fill="#d97706" fillOpacity="0.22" stroke="#f59e0b" strokeWidth="1.3" />
            {/* Simultaneity Slice */}
            <line
              x1="130"
              y1={220 + angle1}
              x2="670"
              y2={160 - angle1}
              stroke="#ec4899"
              strokeWidth="2.2"
              strokeDasharray="6 3"
            />
            <circle cx="400" cy="190" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
            <g fill="#e2e8f0" fontSize="11" fontFamily="monospace" fontWeight="bold">
              <text x="415" y="188" fill="#fbbf24">Olay (x, t₀)</text>
              <text x="515" y="92" fill="#f59e0b">Gelecek Işık Konisi (t &gt; t₀)</text>
              <text x="515" y="298" fill="#38bdf8">Geçmiş Işık Konisi (t &lt; t₀)</text>
            </g>
            {renderAcademicOverlayStrip()}
          </svg>
        );

      case 'wormhole':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <defs>
              <linearGradient id={`whBg-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#030712" />
                <stop offset="50%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <radialGradient id={`whGlow-${seed}`} cx="50%" cy="45%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="60%" stopColor="#6366f1" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#030712" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="800" height="450" fill={`url(#whBg-${seed})`} />
            <path d="M 110 65 Q 400 190, 690 65" stroke="#38bdf8" strokeWidth="1.4" fill="none" opacity="0.55" />
            <path d="M 110 110 Q 400 195, 690 110" stroke="#38bdf8" strokeWidth="1.4" fill="none" opacity="0.65" />
            <path d="M 110 315 Q 400 195, 690 315" stroke="#38bdf8" strokeWidth="1.4" fill="none" opacity="0.55" />
            <path d="M 110 275 Q 400 190, 690 275" stroke="#38bdf8" strokeWidth="1.4" fill="none" opacity="0.65" />
            <ellipse cx="400" cy="192" rx={140 + radiusOffset} ry="38" fill={`url(#whGlow-${seed})`} stroke="#f59e0b" strokeWidth="2.5" />
            <ellipse cx="400" cy="192" rx="78" ry="20" fill="#020617" stroke="#38bdf8" strokeWidth="1.6" />
            <line x1="322" y1="192" x2="478" y2="192" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
            <g fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              <text x="400" y="135" fill="#38bdf8" fontSize="11">Manifold Eğriliği: Gμν + Λgμν = (8πG/c⁴)Tμν</text>
              <text x="400" y="255" fill="#fde68a" fontSize="11">Einstein-Rosen Köprüsü &amp; Jeodezik Süreklilik</text>
            </g>
            {renderAcademicOverlayStrip()}
          </svg>
        );

      case 'quantum':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <rect width="800" height="450" fill="#050814" />
            {/* Bloch Sphere & Entangled Wavepacket */}
            <circle cx="400" cy="190" r={95 + radiusOffset} fill="none" stroke="#1e293b" strokeWidth="1.5" />
            <ellipse cx="400" cy="190" rx={95 + radiusOffset} ry="32" fill="none" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="4 3" />
            <path
              d="M 150 190 C 245 105, 310 275, 400 190 C 490 105, 555 275, 650 190"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.8"
            />
            <path
              d="M 150 190 C 245 270, 310 110, 400 190 C 490 270, 555 110, 650 190"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="5 3"
            />
            <circle cx="185" cy="190" r="12" fill="#38bdf8" stroke="#ffffff" strokeWidth="2.2" />
            <circle cx="615" cy="190" r="12" fill="#ec4899" stroke="#ffffff" strokeWidth="2.2" />
            <circle cx="400" cy="190" r="8" fill="#fbbf24" />
            <g fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              <text x="400" y="72" fill="#fbbf24" fontSize="11.5">
                |Ψ⟩ = α|0⟩_A|1⟩_B - β|1⟩_A|0⟩_B • S(ρ_A) = -Tr(ρ_A ln ρ_A)
              </text>
              <text x="185" y="226" fill="#38bdf8" fontSize="10.5">Parçacık A (|↑⟩)</text>
              <text x="615" y="226" fill="#f472b6" fontSize="10.5">Parçacık B (|↓⟩)</text>
            </g>
            {renderAcademicOverlayStrip()}
          </svg>
        );

      case 'thermodynamics':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <rect width="800" height="450" fill="#070a14" />
            {/* Lorenz Attractor Double Wing & Phase Space Grid */}
            <path
              d="M 400 195 C 300 75, 175 120, 235 220 C 285 295, 380 230, 400 195 C 420 160, 515 75, 575 170 C 625 260, 490 305, 400 195 Z"
              fill="#f59e0b"
              fillOpacity="0.14"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />
            <path
              d="M 400 195 C 320 105, 215 145, 260 210 C 295 265, 375 220, 400 195 C 425 170, 505 110, 545 175 C 585 235, 475 275, 400 195 Z"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.8"
              strokeDasharray="5 3"
            />
            <circle cx="295" cy="182" r="6" fill="#38bdf8" />
            <circle cx="505" cy="185" r="6" fill="#f43f5e" />
            <circle cx="400" cy="195" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
            <g fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              <text x="400" y="72" fill="#fbbf24" fontSize="11.5">
                S = k_B ln(Ω) • dS/dt ≥ 0 (Termodinamik Zaman Oku &amp; Faz Uzayı)
              </text>
              <text x="285" y="162" fill="#38bdf8" fontSize="10">Düşük Entropi (Ω₀)</text>
              <text x="515" y="162" fill="#fb7185" fontSize="10">Maksimum Entropi (Ω_max)</text>
            </g>
            {renderAcademicOverlayStrip()}
          </svg>
        );

      case 'computation':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <rect width="800" height="450" fill="#060b16" />
            <rect x="215" y="54" width="370" height="272" rx="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="2.2" />
            <rect x="85" y="162" width="115" height="52" rx="10" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x="142" y="184" fill="#38bdf8" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">GİRDİ SEMBOLLER</text>
            <text x="142" y="202" fill="#e2e8f0" fontSize="11.5" fontWeight="bold" textAnchor="middle">[01101 • 漢字]</text>

            <rect x="600" y="162" width="115" height="52" rx="10" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
            <text x="657" y="184" fill="#34d399" fontSize="10.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ÇIKTI YANIT</text>
            <text x="657" y="202" fill="#e2e8f0" fontSize="11.5" fontWeight="bold" textAnchor="middle">[10011 • 語義]</text>

            <line x1="200" y1="188" x2="255" y2="188" stroke="#38bdf8" strokeWidth="2.5" />
            <line x1="545" y1="188" x2="600" y2="188" stroke="#10b981" strokeWidth="2.5" />

            <rect x="255" y="82" width="290" height="96" rx="12" fill="#020617" stroke="#6366f1" strokeWidth="1.8" />
            <text x="400" y="112" fill="#a5b4fc" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              FORMEL KURALLAR TABLOSU (SENTAKS)
            </text>
            <text x="400" y="140" fill="#fbbf24" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              δ(qᵢ, σ) ➔ (qⱼ, τ, L/R)
            </text>

            <rect x="255" y="198" width="290" height="96" rx="12" fill="#020617" stroke="#f43f5e" strokeWidth="1.6" strokeDasharray="5 3" />
            <text x="400" y="230" fill="#fb7185" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              SEMANTİK / ÖZNEL ANLAM BOŞLUĞU
            </text>
            <text x="400" y="256" fill="#cbd5e1" fontSize="11" fontFamily="monospace" textAnchor="middle">
              Sentaks ≠ Semantik (Bilinç &amp; Yönelimsellik)
            </text>
            {renderAcademicOverlayStrip()}
          </svg>
        );

      case 'neuroscience':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <rect width="800" height="450" fill="#070716" />
            {/* Readiness Potential Curve & Branching Decision Paths */}
            <line x1="90" y1="245" x2="710" y2="245" stroke="#334155" strokeWidth="1.5" />
            <line x1="420" y1="60" x2="420" y2="310" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 4" />
            <line x1="560" y1="60" x2="560" y2="310" stroke="#10b981" strokeWidth="1.8" strokeDasharray="5 4" />
            <path
              d="M 100 245 C 200 245, 260 230, 330 175 C 390 125, 460 85, 560 98 C 610 108, 650 245, 700 245"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="3"
            />
            <circle cx="260" cy="228" r="6" fill="#38bdf8" />
            <circle cx="420" cy="116" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
            <circle cx="560" cy="98" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <g fontFamily="monospace" fontWeight="bold">
              <text x="165" y="275" fill="#38bdf8" fontSize="10.5">t = -550 ms (Hazırlık Potansiyeli RP)</text>
              <text x="428" y="82" fill="#fbbf24" fontSize="10.5">t = -200 ms (Bilinçli İrade W)</text>
              <text x="568" y="82" fill="#34d399" fontSize="10.5">t = 0 ms (Motor Eylem M)</text>
            </g>
            {renderAcademicOverlayStrip()}
          </svg>
        );

      case 'consciousness':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <defs>
              <linearGradient id={`mindBg-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#090314" />
                <stop offset="60%" stopColor="#17092e" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill={`url(#mindBg-${seed})`} />
            {/* Integrated Information Phi Network */}
            <circle cx="400" cy="190" r={112 + radiusOffset} fill="none" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.55" />
            <g stroke="#c084fc" strokeWidth="1.3" opacity="0.55">
              <line x1="280" y1="125" x2="520" y2="125" />
              <line x1="280" y1="125" x2="310" y2="258" />
              <line x1="520" y1="125" x2="490" y2="258" />
              <line x1="310" y1="258" x2="490" y2="258" />
              <line x1="280" y1="125" x2="490" y2="258" />
              <line x1="520" y1="125" x2="310" y2="258" />
            </g>
            <circle cx="280" cy="125" r="11" fill="#38bdf8" />
            <circle cx="520" cy="125" r="11" fill="#ec4899" />
            <circle cx="310" cy="258" r="11" fill="#10b981" />
            <circle cx="490" cy="258" r="11" fill="#f59e0b" />
            <circle cx="400" cy="190" r="44" fill="#1e1b4b" stroke="#fbbf24" strokeWidth="2.5" />
            <text x="400" y="198" fill="#fbbf24" fontSize="22" fontWeight="bold" fontFamily="serif" textAnchor="middle">
              Φ &gt; 0
            </text>
            <g fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              <text x="400" y="64" fill="#e9d5ff" fontSize="11">
                Bütünleşik Enformasyon (Φ) &amp; Fenomenal Bilinç Alanı (Qualia)
              </text>
            </g>
            {renderAcademicOverlayStrip()}
          </svg>
        );

      case 'logic':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <rect width="800" height="450" fill="#060913" />
            {/* Gödel Self-Referential Möbius / Strange Loop */}
            <ellipse cx="340" cy="190" rx="130" ry="70" fill="none" stroke="#38bdf8" strokeWidth="2.2" transform={`rotate(${angle1} 340 190)`} />
            <ellipse cx="460" cy="190" rx="130" ry="70" fill="none" stroke="#f59e0b" strokeWidth="2.2" transform={`rotate(${-angle1} 460 190)`} />
            <rect x="315" y="155" width="170" height="68" rx="12" fill="#0f172a" stroke="#a855f7" strokeWidth="2.2" />
            <text x="400" y="185" fill="#fbbf24" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              G ↔ ¬Prov_F(⌜G⌝)
            </text>
            <text x="400" y="208" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              Öz-Referans &amp; Kararverilemezlik
            </text>
            <g fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              <text x="400" y="68" fill="#c084fc" fontSize="11">
                Biçimsel Sistem Sınırları • Tarski Doğruluk Hiyerarşisi (L₀ ⊂ L₁ ⊂ L₂)
              </text>
            </g>
            {renderAcademicOverlayStrip()}
          </svg>
        );

      case 'dialectics':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <defs>
              <linearGradient id={`dialBg-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#160a06" />
                <stop offset="60%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill={`url(#dialBg-${seed})`} />
            <circle cx="310" cy="215" r="68" fill="#38bdf8" fillOpacity="0.12" stroke="#38bdf8" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="490" cy="215" r="68" fill="#f43f5e" fillOpacity="0.12" stroke="#f43f5e" strokeWidth="2" strokeDasharray="5 3" />
            <circle cx="400" cy="118" r="50" fill="#0f172a" stroke="#fbbf24" strokeWidth="2.5" />
            <line x1="335" y1="160" x2="375" y2="138" stroke="#fbbf24" strokeWidth="2" />
            <line x1="465" y1="160" x2="425" y2="138" stroke="#fbbf24" strokeWidth="2" />
            <text x="310" y="220" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">TEZ (A)</text>
            <text x="490" y="220" fill="#fb7185" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">ANTİTEZ (¬A)</text>
            <text x="400" y="115" fill="#fbbf24" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">SENTEZ</text>
            <text x="400" y="133" fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle">(Aufhebung)</text>
            {renderAcademicOverlayStrip()}
          </svg>
        );

      case 'epistemology':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <rect width="800" height="450" fill="#050b16" />
            {/* Prior vs Likelihood vs Posterior Gaussian Distributions */}
            <line x1="100" y1="285" x2="700" y2="285" stroke="#475569" strokeWidth="2" />
            {/* Prior P(H) */}
            <path
              d="M 120 285 C 190 285, 220 140, 290 140 C 360 140, 390 285, 460 285"
              fill="#38bdf8"
              fillOpacity="0.16"
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeDasharray="5 3"
            />
            {/* Likelihood P(E|H) */}
            <path
              d="M 330 285 C 400 285, 430 150, 500 150 C 570 150, 600 285, 670 285"
              fill="#a855f7"
              fillOpacity="0.16"
              stroke="#a855f7"
              strokeWidth="2"
            />
            {/* Posterior P(H|E) */}
            <path
              d="M 250 285 C 325 285, 355 88, 405 88 C 455 88, 485 285, 560 285"
              fill="#f59e0b"
              fillOpacity="0.24"
              stroke="#fbbf24"
              strokeWidth="3"
            />
            <g fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              <text x="400" y="62" fill="#fbbf24" fontSize="11">
                P(H|E) = [P(E|H) · P(H)] / P(E) • Epistemik Güncelleme &amp; Yanlışlanabilirlik
              </text>
              <text x="275" y="130" fill="#38bdf8" fontSize="10.5">Önsel P(H)</text>
              <text x="405" y="80" fill="#fbbf24" fontSize="10.5">Sonsal P(H|E)</text>
              <text x="515" y="142" fill="#c084fc" fontSize="10.5">Kanıt P(E|H)</text>
            </g>
            {renderAcademicOverlayStrip()}
          </svg>
        );

      case 'ai_ethics':
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <rect width="800" height="450" fill="#031214" />
            <g stroke="#10b981" strokeWidth="1.4" opacity="0.45" fill="none">
              <polyline points="110,95 250,95 310,150 490,150 550,95 690,95" />
              <polyline points="110,295 250,295 310,240 490,240 550,295 690,295" />
            </g>
            <rect x="305" y="128" width="190" height="132" rx="18" fill="#020617" stroke="#10b981" strokeWidth="2.5" />
            <text x="400" y="185" fill="#34d399" fontSize="24" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              U(H) ≈ U(AI)
            </text>
            <text x="400" y="215" fill="#fbbf24" fontSize="11" fontFamily="monospace" textAnchor="middle">
              Değer Hizalaması &amp; Etik Sınır
            </text>
            {renderAcademicOverlayStrip()}
          </svg>
        );

      default:
        // Cosmology & Fundamental Physics
        return (
          <svg viewBox="0 0 800 450" className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700">
            <defs>
              <linearGradient id={`cosBg-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0b132b" />
                <stop offset="50%" stopColor="#1c2541" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>
            <rect width="800" height="450" fill={`url(#cosBg-${seed})`} />
            <ellipse
              cx="400"
              cy="190"
              rx={215 + radiusOffset}
              ry="74"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.6"
              opacity="0.65"
              transform={`rotate(${angle1} 400 190)`}
            />
            <ellipse
              cx="400"
              cy="190"
              rx={205 - radiusOffset}
              ry="70"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.4"
              opacity="0.55"
              transform={`rotate(${angle2} 400 190)`}
            />
            <circle cx="400" cy="190" r="32" fill="#f59e0b" fillOpacity="0.22" />
            <circle cx="400" cy="190" r="14" fill="#fbbf24" stroke="#ffffff" strokeWidth="2.2" />
            <g fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              <text x="400" y="66" fill="#38bdf8" fontSize="11">
                Kozmik Manifold &amp; Evrensel Fizik Sabitleri Uzayı
              </text>
            </g>
            {renderAcademicOverlayStrip()}
          </svg>
        );
    }
  };

  return (
    <>
      <div className={`relative overflow-hidden rounded-2xl bg-slate-950 border border-amber-500/25 group ${className}`}>
        {renderArchetypeSvg()}

        <div className="absolute bottom-2 right-2.5 flex items-center gap-1.5 z-10">
          {!isThumbnail && (
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-lg bg-slate-950/90 text-amber-400 border border-amber-500/30 shadow">
              {badgeLabelByArchetype[archetype] || 'Sci-Phi Görsel Modeli'}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(true);
            }}
            className="px-2 py-0.5 rounded-md bg-slate-950/90 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-[9px] font-mono font-bold flex items-center gap-1 transition cursor-pointer shadow"
            title="Akademik Konu Şemasını (Graphical Abstract) Tam Ekran İncele"
          >
            <Maximize2 className="w-2.5 h-2.5" />
            <span>{isThumbnail ? `Fig. ${figIndex}` : 'Tam Ekran'}</span>
          </button>
        </div>
      </div>

      {isZoomed && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(false);
          }}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full rounded-3xl bg-slate-900 border border-amber-500/40 overflow-hidden shadow-2xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 font-bold">
                    FIG. {figIndex} • AKADEMİK GÖRSEL ÖZET (GRAPHICAL ABSTRACT)
                  </span>
                  <span className="text-xs font-mono text-sky-400 font-bold">
                    {badgeLabelByArchetype[archetype]}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mt-1 font-serif">{title}</h4>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed(false);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-96 sm:h-[440px] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              {renderArchetypeSvg()}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950/90 border border-sky-500/30">
                <div className="text-[10px] font-mono text-sky-400 font-bold uppercase">I. Kavramsal Eksen</div>
                <div className="text-xs font-semibold text-white mt-0.5">{topic1}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/90 border border-amber-500/30">
                <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">II. Teorik Mekanizma</div>
                <div className="text-xs font-semibold text-white mt-0.5">{topic2}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/30">
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">III. Akademik Sentez</div>
                <div className="text-xs font-semibold text-white mt-0.5">{topic3}</div>
              </div>
            </div>
            {(subtitle || thesisSummary) && (
              <p className="text-xs text-slate-300 font-serif italic flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{subtitle || thesisSummary}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

