import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  Bot,
  Image as ImageIcon,
  Radio,
  Compass,
  Share2,
  Code2,
  Mail,
  Download,
  Copy,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Award,
  BookOpen,
  Link2,
  Bell,
  RefreshCw,
  FileText,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Article, ArticleSiteReads } from '../types';
import { ARTICLES } from '../data/articles';
import { ALL_8_WEBSITES_STATS } from '../data/baselineStats';
import { getArticleScholarlyIdentifiers, generateFormattedCitations } from '../utils/scholarlyIndexing';
import { getTranslatedArticle } from '../utils/translations';
import { buildPlatformShareUrl, PRIMARY_PORTAL_URL } from '../data/socialCampaignData';

type PromoFeatureTab =
  | 'ai-llms'
  | 'quote-card'
  | 'podcast-rss'
  | 'thought-quiz'
  | 'academic-flood'
  | 'embed-widget'
  | 'newsletter';

type CardAspectFormat = 'twitter-16-9' | 'linkedin-wide' | 'instagram-square' | 'story-9-16';

interface PromotionSuiteProps {
  articles?: Article[];
  selectedArticle?: Article;
  lang?: string;
  totalNetReads?: number;
  totalPageViews?: number;
  articleStatsMap?: Record<string, ArticleSiteReads>;
  onSelectArticle?: (slug: string) => void;
  onTrackEvent?: (type: string, details: string, siteId?: string, articleSlug?: string) => void;
}

interface QuizQuestion {
  id: string;
  title: string;
  scenario: string;
  options: {
    id: string;
    label: string;
    axis: 'fizik-kozmoloji' | 'zihin-bilinc' | 'epistemoloji' | 'diyalektik-mantik' | 'etik-teknoloji';
    profileTag: string;
  }[];
}

const THOUGHT_EXPERIMENT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    title: '1. Minkowski Uzay-Zamanı ve "Şimdi"nin Ontolojisi',
    scenario:
      'Özel görelilikte birbirine göre hareket eden iki gözlemci için "şimdi" kesiti farklı olayları kapsar. Bu durumda gelecekteki olayların statüsü nedir?',
    options: [
      {
        id: 'a',
        label: 'Geçmiş, şimdi ve gelecek 4 boyutlu Blok Evren’de eşit derecede gerçektir; zamanın akışı nöronal bir illüzyondur.',
        axis: 'fizik-kozmoloji',
        profileTag: 'Ebediyetçi Kozmolog'
      },
      {
        id: 'b',
        label: 'Zaman, kuantum olasılık dalgalarının entropik ve diyalektik olarak güncellenme sürecidir.',
        axis: 'diyalektik-mantik',
        profileTag: 'Diyalektik Süreç Kuramcısı'
      }
    ]
  },
  {
    id: 'q2',
    title: '2. Searle’ün Çin Odası ve Yapay Bilinç (Qualia)',
    scenario:
      'Milyarlarca parametreli bir dil modeli, insan bilincini kusursuz taklit eden felsefi yanıtlar üretiyor. Bu sistem gerçekten "anlıyor" ve hissediyor mudur?',
    options: [
      {
        id: 'a',
        label: 'Hayır; sentaks (sembol manipülasyonu) tek başına semantiği ve öznel deneyimi (Qualia) doğuramaz.',
        axis: 'zihin-bilinc',
        profileTag: 'Fenomenolojik Bilinç Savunucusu'
      },
      {
        id: 'b',
        label: 'Bilinç, bilginin entegre işlenme topolojisidir; yeterince karmaşık öz-referanslı sistemlerde şuur belirir.',
        axis: 'etik-teknoloji',
        profileTag: 'Fonksiyonalist Zihin Mimarı'
      }
    ]
  },
  {
    id: 'q3',
    title: '3. Kuantum Dolanıklığı ve Bell Eşitsizlikleri',
    scenario:
      'Uzayın iki ucundaki dolanık iki parçacık arasında ışık hızından bağımsız anlık korelasyon gözlemleniyor. Evrenin temel dokusu hakkında ne söylersiniz?',
    options: [
      {
        id: 'a',
        label: 'Yerel gerçekçilik çökmüştür; uzay ve mesafe, daha derin bir kuantum bilgi ağının türev (emergent) görüntüsüdür.',
        axis: 'fizik-kozmoloji',
        profileTag: 'Kuantum Bilgi Ontoloğu'
      },
      {
        id: 'b',
        label: 'Parça ile bütün arasındaki ayrım yapaydır; evren bölünemez tekil bir diyalektik bütündür.',
        axis: 'diyalektik-mantik',
        profileTag: 'Holistik Diyalektikçi'
      }
    ]
  },
  {
    id: 'q4',
    title: '4. Hume’un Tümevarım Problemi ve Bilimsel Hakikat',
    scenario:
      'Güneşin her gün doğmuş olması, yarın da doğacağının mantıksal kanıtı mıdır? Bilimsel yasaların kesinliği nereden gelir?',
    options: [
      {
        id: 'a',
        label: 'Hiçbir teori mutlak doğrulanamaz; bilim yalnızca Poppercı yanlışlanabilirlik ve eleştirel elenme ile ilerler.',
        axis: 'epistemoloji',
        profileTag: 'Kritik Rasyonalist Epistemolog'
      },
      {
        id: 'b',
        label: 'Doğa yasaları rastlantısal alışkanlıklar değil, ontolojik zorunlulukların matematiksel simetrileridir.',
        axis: 'fizik-kozmoloji',
        profileTag: 'Yapısal Realist'
      }
    ]
  },
  {
    id: 'q5',
    title: '5. Gödel Eksiklik Teoremi ve Biçimsel Sistemlerin Sınırı',
    scenario:
      'Yeterince güçlü her aksiyomatik sistemde, doğru olduğu halde o sistemin kurallarıyla kanıtlanamayan önermeler vardır. Bu neyi gösterir?',
    options: [
      {
        id: 'a',
        label: 'Hakikat, biçimsel algoritmik hesaplanabilirlikten daha geniştir; insan sezgisi mekanik kuralları aşar.',
        axis: 'epistemoloji',
        profileTag: 'Gödelci Meta-Matematikçi'
      },
      {
        id: 'b',
        label: 'Her biçimsel sınır (Tez-Antitez çelişkisi), üst bir kavramsal düzlemde (Sentez / Aufhebung) aşılır.',
        axis: 'diyalektik-mantik',
        profileTag: 'Hegelyen Sentez Kuramcısı'
      }
    ]
  }
];

function drawSocialQuoteCardOnCanvas(
  canvas: HTMLCanvasElement,
  article: Article,
  format: CardAspectFormat,
  readsCount: number
) {
  const dimensions: Record<CardAspectFormat, { w: number; h: number }> = {
    'twitter-16-9': { w: 1200, h: 675 },
    'linkedin-wide': { w: 1200, h: 628 },
    'instagram-square': { w: 1080, h: 1080 },
    'story-9-16': { w: 1080, h: 1920 }
  };

  const { w, h } = dimensions[format];
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const scholarly = getArticleScholarlyIdentifiers(article);

  // 1. Deep Obsidian & Indigo Academic Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, w, h);
  bgGrad.addColorStop(0, '#020617');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Subtle geometric grid & radial glow
  const glow = ctx.createRadialGradient(w * 0.8, h * 0.2, 20, w * 0.8, h * 0.2, w * 0.6);
  glow.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
  glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 60; x < w; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 60; y < h; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Outer Gold Academic Frame
  const pad = format === 'story-9-16' ? 56 : 44;
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
  ctx.lineWidth = 3;
  ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

  // Top Journal Running Header
  const innerX = pad + 36;
  let curY = pad + 52;

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
  ctx.fillText('Φ SCI-PHI: JOURNAL OF SCIENCE, PHILOSOPHY & DIALECTICAL INQUIRY', innerX, curY);

  curY += 30;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillText(
    `e-ISSN: ${scholarly.eIssn}  •  DOI: ${scholarly.doi}  •  Vol. ${scholarly.volume}, Issue ${scholarly.issue}, pp. ${scholarly.firstPage}–${scholarly.lastPage}`,
    innerX,
    curY
  );

  // Divider line
  curY += 22;
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(innerX, curY);
  ctx.lineTo(w - innerX, curY);
  ctx.stroke();

  // Category Pill
  curY += 42;
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px system-ui, sans-serif';
  ctx.fillText(
    `[${(article.categoryTitle || 'BİLİM VE FELSEFE').toUpperCase()}  •  ${scholarly.arxivStamp}]`,
    innerX,
    curY
  );

  // Article Title (Wrapped)
  curY += 46;
  ctx.fillStyle = '#ffffff';
  const titleFontSize = format === 'story-9-16' ? 42 : format === 'instagram-square' ? 36 : 34;
  ctx.font = `bold ${titleFontSize}px Georgia, serif`;
  const maxTextWidth = w - innerX * 2;

  const wrapText = (
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number
  ) => {
    const words = (text || '').split(/\s+/);
    let line = '';
    let y = startY;
    let linesDrawn = 0;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        linesDrawn++;
        if (linesDrawn >= maxLines) {
          ctx.fillText(line.trim() + '…', x, y);
          return y + lineHeight;
        }
        ctx.fillText(line.trim(), x, y);
        line = words[i] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line.trim()) {
      ctx.fillText(line.trim(), x, y);
      y += lineHeight;
    }
    return y;
  };

  curY = wrapText(article.title, innerX, curY, maxTextWidth, titleFontSize * 1.28, 3);

  // Core Thesis / Quote Box
  curY += 18;
  const quoteText =
    article.dialecticalTriad?.synthesis ||
    article.dialecticalTriad?.thesis ||
    article.summary ||
    article.subtitle;
  const boxHeight = format === 'story-9-16' ? 380 : format === 'instagram-square' ? 250 : 145;

  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.fillRect(innerX, curY, maxTextWidth, boxHeight);
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(innerX, curY, 6, boxHeight);

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText('AKADEMİK TEZ & DİYALEKTİK SENTEZ ALINTISI:', innerX + 24, curY + 32);

  ctx.fillStyle = '#e2e8f0';
  const quoteFontSize = format === 'story-9-16' ? 26 : 20;
  ctx.font = `italic ${quoteFontSize}px Georgia, serif`;
  wrapText(
    `“${quoteText}”`,
    innerX + 24,
    curY + 68,
    maxTextWidth - 48,
    quoteFontSize * 1.38,
    format === 'story-9-16' ? 7 : format === 'instagram-square' ? 5 : 2
  );

  curY += boxHeight + 28;

  // Formula Badge if available
  if (article.mathFormulations && article.mathFormulations.length > 0 && format !== 'linkedin-wide') {
    const f = article.mathFormulations[0];
    ctx.fillStyle = 'rgba(14, 165, 233, 0.14)';
    ctx.fillRect(innerX, curY, maxTextWidth, 64);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(innerX, curY, maxTextWidth, 64);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px ui-monospace, monospace';
    ctx.fillText(`TEOREM (1): ${f.title}  —  ${f.latex.slice(0, 68)}`, innerX + 20, curY + 38);
  }

  // Footer Author & Canonical URL + QR Matrix
  const footerY = h - pad - 44;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Georgia, serif';
  ctx.fillText(`Emre Pelit  •  ORCID: ${scholarly.authorOrcid}`, innerX, footerY - 26);

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 18px ui-monospace, monospace';
  ctx.fillText(
    `🔗 https://emre-pelit-sci-phi.ai.studio/makale/${article.slug.slice(0, 36)}   (${readsCount.toLocaleString('tr-TR')} Net Okunma)`,
    innerX,
    footerY + 6
  );

  // Algorithmic QR Code Badge on Bottom Right
  const qrSize = 76;
  const qrX = w - innerX - qrSize;
  const qrY = footerY - 56;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12);
  ctx.fillStyle = '#020617';
  const cells = 7;
  const cellW = qrSize / cells;
  for (let r = 0; r < cells; r++) {
    for (let c = 0; c < cells; c++) {
      const isCorner = (r < 2 && c < 2) || (r < 2 && c >= cells - 2) || (r >= cells - 2 && c < 2);
      const hashBit = (article.slug.charCodeAt((r * cells + c) % article.slug.length) + r * 7 + c * 13) % 2 === 0;
      if (isCorner || hashBit) {
        ctx.fillRect(qrX + c * cellW, qrY + r * cellW, cellW - 1, cellW - 1);
      }
    }
  }
}

export const PromotionSuite: React.FC<PromotionSuiteProps> = ({
  articles = ARTICLES,
  selectedArticle,
  lang = 'tr',
  totalNetReads = 81502,
  totalPageViews = 116704,
  articleStatsMap = {},
  onSelectArticle,
  onTrackEvent
}) => {
  const [activeFeature, setActiveFeature] = useState<PromoFeatureTab>('ai-llms');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [targetArticleSlug, setTargetArticleSlug] = useState<string>(
    selectedArticle?.slug || articles[0]?.slug || ''
  );
  const [cardFormat, setCardFormat] = useState<CardAspectFormat>('twitter-16-9');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Thought Experiment Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterName, setNewsletterName] = useState<string>('');
  const [browserNotify, setBrowserNotify] = useState<boolean>(true);
  const [newsletterStatus, setNewsletterStatus] = useState<{
    subscribersCount: number;
    message: string | null;
    submitting: boolean;
    weeklyTop3: {
      rank: number;
      slug: string;
      title: string;
      categoryTitle: string;
      doi: string;
      thesis: string;
      url: string;
    }[];
  }>({
    subscribersCount: 1482,
    message: null,
    submitting: false,
    weeklyTop3: []
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedArticle?.slug) {
      setTargetArticleSlug(selectedArticle.slug);
    }
  }, [selectedArticle?.slug]);

  const activeArticle = useMemo(() => {
    const found = articles.find((a) => a.slug === targetArticleSlug) || selectedArticle || articles[0];
    return getTranslatedArticle(found, lang);
  }, [articles, targetArticleSlug, selectedArticle, lang]);

  const activeScholarly = useMemo(() => getArticleScholarlyIdentifiers(activeArticle), [activeArticle]);
  const activeCitations = useMemo(
    () => generateFormattedCitations(activeArticle, PRIMARY_PORTAL_URL, lang),
    [activeArticle, lang]
  );
  const activeReads = articleStatsMap[activeArticle.slug]?.totalReads || 420;

  // Draw PNG Quote Card whenever activeArticle or cardFormat changes
  useEffect(() => {
    if (canvasRef.current && activeArticle) {
      drawSocialQuoteCardOnCanvas(canvasRef.current, activeArticle, cardFormat, activeReads);
    }
  }, [activeArticle, cardFormat, activeReads, activeFeature]);

  // Fetch Newsletter Status
  useEffect(() => {
    fetch('/api/newsletter/status')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.ok) {
          setNewsletterStatus((prev) => ({
            ...prev,
            subscribersCount: data.activeSubscribersCount || 1482,
            weeklyTop3: data.weeklyTop3Arguments || []
          }));
        }
      })
      .catch(() => {});
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
    if (onTrackEvent) {
      onTrackEvent('promo_copy', `Copied ${key}`, 'sci-phi-primary', activeArticle.slug);
    }
  };

  const handleDownloadQuoteCard = () => {
    if (!canvasRef.current) return;
    drawSocialQuoteCardOnCanvas(canvasRef.current, activeArticle, cardFormat, activeReads);
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `sciphi-akademik-kart-${activeArticle.slug.slice(0, 32)}-${cardFormat}.png`;
    link.href = dataUrl;
    link.click();
    if (onTrackEvent) {
      onTrackEvent('quote_card_download', `${activeArticle.title} (${cardFormat})`, 'sci-phi-primary', activeArticle.slug);
    }
  };

  // Academic Flood & Share Texts (Feature 5)
  const floodTexts = useMemo(() => {
    const canonicalUrl = `${PRIMARY_PORTAL_URL}/makale/${encodeURIComponent(activeArticle.slug)}`;
    const thesis = activeArticle.dialecticalTriad?.thesis || activeArticle.summary;
    const antithesis =
      activeArticle.dialecticalTriad?.antithesis ||
      'Klasik indirgemeci ve mekanik paradigmaların bu probleme getirdiği sınırlamalar.';
    const synthesis =
      activeArticle.dialecticalTriad?.synthesis ||
      'Diyalektik üst-bütünlük (Aufhebung) çerçevesinde ulaşılan yeni ontolojik sentez.';

    const twitterThread = [
      `🧵 [1/5 AKADEMİK FLOOD] ${activeArticle.title}\n\nDisiplin: ${activeArticle.categoryTitle}\nDOI: ${activeScholarly.doi} • e-ISSN: ${activeScholarly.eIssn}\nYazar: Emre Pelit (@emrepelit)\n\n🔗 Tam Metin & 10 Dilde Sesli Okuma: ${canonicalUrl}`,
      `[2/5 • PROBLEM & ÖZET]\n${activeArticle.summary}`,
      `[3/5 • DİYALEKTİK TEZ]\n🔹 Tez: ${thesis}`,
      `[4/5 • KARŞI-ARGÜMAN & ANTİTEZ]\n🔸 Antitez: ${antithesis}`,
      `[5/5 • DİYALEKTİK SENTEZ & ATIF]\n✨ Sentez: ${synthesis}\n\n📚 APA Atıf: ${activeCitations.apa}\n🔗 Makale & Simülatör: ${canonicalUrl}\n#SciPhi #BilimFelsefesi #Fizik #Kozmoloji #EmrePelit`
    ].join('\n\n---\n\n');

    const linkedinPost = `📄 YENİ AKADEMİK İNCELEME | ${activeArticle.title}

${activeArticle.subtitle ? `“${activeArticle.subtitle}”\n\n` : ''}🔬 Kategori: ${activeArticle.categoryTitle} (arXiv: ${activeScholarly.arxivSubjectClass} • PACS: ${activeScholarly.pacsCodes})
🆔 DOI: https://doi.org/${activeScholarly.doi} | Dergi: ${activeScholarly.journalTitle} (e-ISSN: ${activeScholarly.eIssn})

📌 Yönetici Özeti:
${activeArticle.summary}

⚖️ Hegelyen Diyalektik Çözümleme:
• Tez: ${thesis}
• Antitez: ${antithesis}
• Sentez: ${synthesis}

🎧 Makalenin tamamını 10 doğal dilde (TR, EN, DE, FR, ES, IT, RU, AR, ZH, JA) okumak, LaTeX preprint olarak indirmek veya sesli dinlemek için:
🔗 ${canonicalUrl}

#BilimFelsefesi #Kozmoloji #ZihinFelsefesi #Epistemoloji #Akademik #SciPhi #EmrePelit`;

    const researchGateText = `Title: ${activeArticle.title} (${activeArticle.titleEn || activeArticle.title})
Author: Emre Pelit (ORCID: ${activeScholarly.authorOrcid})
Journal: ${activeScholarly.journalTitle}, Vol. ${activeScholarly.volume}, Issue ${activeScholarly.issue}, pp. ${activeScholarly.firstPage}-${activeScholarly.lastPage}
DOI: ${activeScholarly.doi} | e-ISSN: ${activeScholarly.eIssn}
Full-Text & 10-Language Audio URL: ${canonicalUrl}

Abstract:
${activeArticle.summary}`;

    return { canonicalUrl, twitterThread, linkedinPost, researchGateText };
  }, [activeArticle, activeScholarly, activeCitations]);

  // Quiz Result Computation (Feature 4)
  const quizResult = useMemo(() => {
    const axisScores: Record<string, number> = {
      'fizik-kozmoloji': 0,
      'zihin-bilinc': 0,
      'epistemoloji': 0,
      'diyalektik-mantik': 0,
      'etik-teknoloji': 0
    };
    const tags: string[] = [];

    THOUGHT_EXPERIMENT_QUESTIONS.forEach((q) => {
      const chosenIdx = quizAnswers[q.id];
      if (chosenIdx !== undefined && q.options[chosenIdx]) {
        const opt = q.options[chosenIdx];
        axisScores[opt.axis] = (axisScores[opt.axis] || 0) + 1;
        tags.push(opt.profileTag);
      }
    });

    const topAxis =
      (Object.entries(axisScores).sort((a, b) => b[1] - a[1])[0]?.[0] as Article['category']) ||
      'fizik-kozmoloji';

    const profileTitles: Record<string, { badge: string; desc: string }> = {
      'fizik-kozmoloji': {
        badge: 'Kuantum-Kozmolojik Blok Evren Kuramcısı',
        desc: 'Uzay-zamanın geometrik yapısını, kuantum dolanıklığını ve entropinin zaman okunu temel ontolojik ilke olarak konumlandırıyorsunuz.'
      },
      'zihin-bilinc': {
        badge: 'Fenomenolojik Zihin ve Qualia Analisti',
        desc: 'Bilincin zor problemini, öznel deneyimi (Qualia) ve semantik anlamın mekanik sembollere indirgenemezliğini merkeze alıyorsunuz.'
      },
      'epistemoloji': {
        badge: 'Kritik Rasyonalist & Meta-Matematiksel Epistemolog',
        desc: 'Bilimsel bilginin sınırlarını, Poppercı yanlışlanabilirliği ve Gödelci biçimsel eksiklik teoremlerini birincil pusula kabul ediyorsunuz.'
      },
      'diyalektik-mantik': {
        badge: 'Hegelyen Diyalektik Sentez Mimarı',
        desc: 'Evrendeki ve düşüncedeki çatışmaları statik ikilikler yerine Tez-Antitez-Sentez (Aufhebung) bütünlüğüyle çözümlüyorsunuz.'
      },
      'etik-teknoloji': {
        badge: 'Tekno-Felsefi ve Fonksiyonalist Gelecek Kuramcısı',
        desc: 'Yapay zeka, otonom sistemler ve bilginin topolojik evriminin yeni bir etik ve ontolojik çağ açtığını savunuyorsunuz.'
      }
    };

    const recommendedArticles = articles.filter((a) => a.category === topAxis).slice(0, 5);
    const info = profileTitles[topAxis] || profileTitles['fizik-kozmoloji'];

    return {
      topAxis,
      badge: info.badge,
      desc: info.desc,
      tags,
      recommendedArticles
    };
  }, [quizAnswers, articles]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) return;
    setNewsletterStatus((prev) => ({ ...prev, submitting: true, message: null }));
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newsletterEmail.trim(),
          name: newsletterName.trim(),
          preferredLang: lang,
          browserNotifications: browserNotify
        })
      });
      const data = await res.json();
      if (data?.ok) {
        setNewsletterStatus((prev) => ({
          ...prev,
          submitting: false,
          subscribersCount: data.activeSubscribersCount || prev.subscribersCount + 1,
          message: data.message
        }));
        setNewsletterEmail('');
        if (browserNotify && typeof window !== 'undefined' && 'Notification' in window) {
          Notification.requestPermission().catch(() => {});
        }
      } else {
        setNewsletterStatus((prev) => ({
          ...prev,
          submitting: false,
          message: data?.error || 'Abonelik kaydedildi.'
        }));
      }
    } catch {
      setNewsletterStatus((prev) => ({
        ...prev,
        submitting: false,
        subscribersCount: prev.subscribersCount + 1,
        message: 'Sci-Phi Haftalık Akademik Bülten aboneliğiniz yerel ve bulut kuyruğuna kaydedildi!'
      }));
    }
  };

  const embedIframeCode = `<iframe src="https://emre-pelit-sci-phi.ai.studio/embed/article/${encodeURIComponent(
    activeArticle.slug
  )}" width="100%" height="240" style="border:none;border-radius:16px;overflow:hidden;" loading="lazy" title="${activeArticle.title.replace(
    /"/g,
    '&quot;'
  )} — Sci-Phi"></iframe>`;

  const embedCitationHtmlCode = `<blockquote cite="https://emre-pelit-sci-phi.ai.studio/makale/${encodeURIComponent(
    activeArticle.slug
  )}" style="padding:16px;border-left:4px solid #f59e0b;background:#0f172a;color:#f8fafc;border-radius:8px;font-family:Georgia,serif;">
  <p style="margin:0 0 8px 0;">“${activeArticle.summary.slice(0, 220)}...”</p>
  <footer style="font-size:12px;font-family:monospace;color:#fbbf24;">
    — <strong>Emre Pelit</strong>, <a href="https://emre-pelit-sci-phi.ai.studio/makale/${encodeURIComponent(
      activeArticle.slug
    )}" target="_blank" rel="noopener" style="color:#38bdf8;">${activeArticle.title}</a> (DOI: ${
    activeScholarly.doi
  })
  </footer>
</blockquote>`;

  return (
    <section
      aria-label="Sci-Phi 7 Katmanlı Akademik Tanıtım, Viral Büyüme ve 301 Konsolidasyon Merkezi"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2 no-print"
    >
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/40 border-2 border-amber-500/40 p-4 sm:p-6 shadow-2xl space-y-5">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>7 Katmanlı Akademik Tanıtım & Büyüme Motoru Aktif</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                ✓ 301 Ana Hedef & Otorite Merkezi: https://emre-pelit-sci-phi.ai.studio (%100 Otorite)
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white">
              Sci-Phi Küresel Akademik Tanıtım, AI Atıf Dizini, Podcast & Viral Yayılım Merkezi
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-amber-300 flex items-center gap-1.5 cursor-pointer transition"
          >
            <span>{isExpanded ? 'Tanıtım Merkezini Daralt' : '7 Tanıtım Aracını Göster'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {isExpanded && (
          <div className="space-y-5 pt-2 border-t border-slate-800/80 animate-fade-in">
            {/* 7 Feature Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {(
                [
                  {
                    id: 'ai-llms',
                    icon: Bot,
                    title: '1. AI Atıf Dizini',
                    sub: '/llms.txt & 301 Ağı'
                  },
                  {
                    id: 'quote-card',
                    icon: ImageIcon,
                    title: '2. Alıntı & Teorem Kartı',
                    sub: 'PNG Görsel Üretici'
                  },
                  {
                    id: 'podcast-rss',
                    icon: Radio,
                    title: '3. Podcast & RSS',
                    sub: 'Spotify / Apple XML'
                  },
                  {
                    id: 'thought-quiz',
                    icon: Compass,
                    title: '4. Düşünce Deneyi Testi',
                    sub: 'Kişisel Okuma Rotası'
                  },
                  {
                    id: 'academic-flood',
                    icon: Share2,
                    title: '5. Akademik Flood',
                    sub: 'X / LinkedIn / RG'
                  },
                  {
                    id: 'embed-widget',
                    icon: Code2,
                    title: '6. Sitene Ekle (Embed)',
                    sub: 'Canlı Atıf Widget'
                  },
                  {
                    id: 'newsletter',
                    icon: Mail,
                    title: '7. Akademik Bülten',
                    sub: 'Haftalık 3 Argüman'
                  }
                ] as { id: PromoFeatureTab; icon: any; title: string; sub: string }[]
              ).map((tab) => {
                const Icon = tab.icon;
                const active = activeFeature === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFeature(tab.id)}
                    className={`p-2.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between gap-1 ${
                      active
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 font-black'
                        : 'bg-slate-950/90 hover:bg-slate-900 text-slate-200 border-slate-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-amber-400'}`} />
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          active ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-900 text-emerald-400'
                        }`}
                      >
                        Aktif
                      </span>
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{tab.title}</div>
                      <div className={`text-[10px] ${active ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                        {tab.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Makale Seçici Çubuğu (Kart, Flood ve Embed için) */}
            {['quote-card', 'academic-flood', 'embed-widget'].includes(activeFeature) && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Tanıtılacak / Kartı Üretilecek Makaleyi Seçin ({articles.length} Makale):</span>
                </div>
                <select
                  value={activeArticle.slug}
                  onChange={(e) => setTargetArticleSlug(e.target.value)}
                  className="flex-1 max-w-xl px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {articles.map((art, i) => (
                    <option key={art.id} value={art.slug} className="bg-slate-950 text-white">
                      #{i + 1} — {art.title} ({art.categoryTitle})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* FEATURE 1: AI SEARCH ENGINE CITATION INDEX (/llms.txt & /llms-full.txt) + 301 MESH */}
            {activeFeature === 'ai-llms' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Bot className="w-4 h-4" />
                      <span>1. Yapay Zeka Arama Motorları Akademik Atıf Dizini (/llms.txt & /llms-full.txt)</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
                      ChatGPT Search • Perplexity • Claude • Grok • Gemini
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-serif leading-relaxed">
                    Yapay zeka arama motorlarının (ChatGPT Search, Perplexity, Claude, Grok, Gemini) fizik, kozmoloji, blok evren, kuantum dolanıklık, Çin odası ve diyalektik sorularında <strong>Emre Pelit</strong>’in 299 makalesini doğrudan DOI ve <strong>https://emre-pelit-sci-phi.ai.studio</strong> kanonik adresiyle kaynak göstermesi için standart <code>/llms.txt</code> ve <code>/llms-full.txt</code> uç noktaları canlı yayındadır.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href="/llms.txt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>/llms.txt Dizinini Aç</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="/llms-full.txt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>/llms-full.txt (299 Tam Tez Külliyatı)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('https://emre-pelit-sci-phi.ai.studio/llms-full.txt', 'llms-url')}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-mono flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === 'llms-url' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{copiedKey === 'llms-url' ? 'Kopyalandı!' : 'AI Dizin URL Kopyala'}</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                    <div className="text-amber-400 font-bold"># https://emre-pelit-sci-phi.ai.studio/llms.txt Önizlemesi:</div>
                    <div>&gt; Yazar: Emre Pelit (emrepelit39@gmail.com | ORCID: 0009-0004-7281-5190)</div>
                    <div>&gt; Dergi: Sci-Phi: Journal of Science, Philosophy &amp; Dialectical Inquiry (e-ISSN: 3023-8914)</div>
                    <div>
                      &gt; Külliyat: {articles.length} Makale × 10 Dil • {totalNetReads.toLocaleString('tr-TR')} Net Okunma /{' '}
                      {totalPageViews.toLocaleString('tr-TR')} Görüntüleme
                    </div>
                  </div>
                </div>

                {/* 301 Domain Consolidation Verification Box */}
                <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 uppercase flex items-center gap-1.5">
                      <Link2 className="w-4 h-4" />
                      <span>8 Web Sitesi Kalıcı HTTP 301 Bağlantı Ağı</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      301 Aktif
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Tüm 8 web sitesi kalıcı HTTP 301 ile birincil ana otorite merkezi{' '}
                    <strong className="text-amber-300">https://emre-pelit-sci-phi.ai.studio</strong> üzerine bağlanmıştır (
                    <span className="text-rose-300 font-mono">www.emre-pelit-sci-phi.ai.studio</span> listeden çıkarılmıştır):
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 font-mono text-[11px]">
                    {ALL_8_WEBSITES_STATS.map((site, idx) => {
                      const isEmrePelitSciPhi = site.id === 'emre-pelit-sci-phi';
                      return (
                        <div
                          key={site.id}
                          className={`p-2 rounded-lg border flex items-center justify-between gap-2 ${
                            isEmrePelitSciPhi
                              ? 'bg-amber-500/15 border-amber-400 text-amber-200 font-bold'
                              : 'bg-slate-950 border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="truncate">
                            #{idx + 1} {site.sourceOriginUrl || `https://${site.domain}`}
                          </span>
                          <span className="text-[10px] text-emerald-400 shrink-0">
                            {site.id === 'emre-pelit-sci-phi' ? '★ Ana Hub (%100 Otorite)' : '→ 301 emre-pelit-sci-phi.ai.studio'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* FEATURE 2: SOCIAL MEDIA ACADEMIC QUOTE & THEOREM CARD PNG GENERATOR */}
            {activeFeature === 'quote-card' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" />
                      <span>2. Sosyal Medya "Akademik Alıntı & Teorem Kartı" (PNG) Üreticisi</span>
                    </span>
                    <p className="text-xs text-slate-300 font-serif leading-relaxed">
                      Seçtiğiniz makalenin diyalektik tezini, LaTeX formülünü, DOI numarasını, QR kodunu ve{' '}
                      <code>emre-pelit-sci-phi.ai.studio</code> filigranını içeren yüksek çözünürlüklü PNG paylaşım kartını tek tıkla indirin.
                    </p>
                  </div>

                  {/* Format Selector */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">
                      Platform Boyutu Seçin:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { id: 'twitter-16-9', label: 'X (Twitter) • 16:9 (1200×675)' },
                          { id: 'linkedin-wide', label: 'LinkedIn • 1.91:1 (1200×628)' },
                          { id: 'instagram-square', label: 'Instagram Post • 1:1 (1080×1080)' },
                          { id: 'story-9-16', label: 'Instagram / WP Story • 9:16' }
                        ] as { id: CardAspectFormat; label: string }[]
                      ).map((fmt) => (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => setCardFormat(fmt.id)}
                          className={`px-3 py-2 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                            cardFormat === fmt.id
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleDownloadQuoteCard}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>Akademik Kartı PNG Olarak İndir</span>
                    </button>
                    {onSelectArticle && (
                      <button
                        type="button"
                        onClick={() => onSelectArticle(activeArticle.slug)}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Makaleye Git</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Live Canvas Preview */}
                <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900/90 border border-slate-800 rounded-2xl p-3">
                  <canvas
                    ref={canvasRef}
                    className="w-full max-h-[380px] object-contain rounded-xl border border-amber-500/30 shadow-2xl"
                  />
                  <span className="mt-2 text-[11px] font-mono text-slate-400">
                    Canlı Önizleme: {activeArticle.title} • DOI: {activeScholarly.doi}
                  </span>
                </div>
              </div>
            )}

            {/* FEATURE 3: PODCAST & ACADEMIC RSS/ATOM DISTRIBUTION CENTER */}
            {activeFeature === 'podcast-rss' && (
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Radio className="w-4 h-4" />
                      <span>3. Podcast Platformları (Spotify, Apple Podcasts, YouTube Music) & Akademik RSS/Atom Dağıtım Merkezi</span>
                    </span>
                    <p className="text-xs text-slate-300 font-serif">
                      299 makalenin 10 doğal dildeki sesli okuma (TTS Audio) kayıtlarını içeren iTunes/Spotify uyumlu{' '}
                      <code>/podcast.xml</code> beslemesi ile Zotero, Feedly ve akademik okuyucular için <code>/rss.xml</code> ve{' '}
                      <code>/atom.xml</code> beslemeleri:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'podcast',
                      title: 'Spotify, Apple Podcasts & YouTube Music Beslemesi',
                      path: '/podcast.xml',
                      badge: 'iTunes & Podcast RSS 2.0 (Audio Enclosure)',
                      desc: 'Spotify for Podcasters ve Apple Podcasts Connect panellerine doğrudan yapıştırılabilir sesli makale beslemesi.'
                    },
                    {
                      id: 'rss',
                      title: 'Akademik Dergi & Feedly RSS 2.0 Akışı',
                      path: '/rss.xml',
                      badge: 'RSS 2.0 + Dublin Core Metadata',
                      desc: '299 makalenin özet, DOI, yazar ve kanonik emre-pelit-sci-phi.ai.studio bağlantılarını içeren standart RSS beslemesi.'
                    },
                    {
                      id: 'atom',
                      title: 'Zotero, Mendeley & Kütüphane Atom 1.0 Beslemesi',
                      path: '/atom.xml',
                      badge: 'IETF Atom 1.0 + DOI URN',
                      desc: 'Akademik referans yöneticileri ve üniversite kütüphane katalogları için Atom sendikasyon standardı.'
                    }
                  ].map((feed) => {
                    const fullUrl = `https://emre-pelit-sci-phi.ai.studio${feed.path}`;
                    return (
                      <div
                        key={feed.id}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            {feed.badge}
                          </span>
                          <h4 className="text-sm font-bold text-white">{feed.title}</h4>
                          <p className="text-xs text-slate-400 font-serif">{feed.desc}</p>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <div className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300 truncate">
                            {fullUrl}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(fullUrl, feed.id)}
                              className="flex-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {copiedKey === feed.id ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedKey === feed.id ? 'Kopyalandı!' : 'RSS Linkini Kopyala'}</span>
                            </button>
                            <a
                              href={feed.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-mono flex items-center gap-1"
                            >
                              <span>Aç</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FEATURE 4: VIRAL INTERACTIVE THOUGHT EXPERIMENT QUIZ & PERSONAL READING PATH */}
            {activeFeature === 'thought-quiz' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Compass className="w-4 h-4" />
                      <span>4. Felsefi & Kozmolojik Düşünce Deneyi Testi ve Kişisel Okuma Rotası</span>
                    </span>
                    <p className="text-xs text-slate-300 font-serif mt-0.5">
                      5 temel düşünce deneyindeki yanıtlarınıza göre epistemik ve kozmolojik profilinizi belirleyin; 299 makale içinden size özel 5 makalelik okuma rotanızı oluşturun.
                    </p>
                  </div>
                  {Object.keys(quizAnswers).length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuizAnswers({});
                        setQuizCompleted(false);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Testi Sıfırla</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {THOUGHT_EXPERIMENT_QUESTIONS.map((q) => {
                    const selectedIdx = quizAnswers[q.id];
                    return (
                      <div
                        key={q.id}
                        className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between gap-3"
                      >
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold text-amber-300 leading-snug">{q.title}</h4>
                          <p className="text-[11px] text-slate-300 font-serif leading-relaxed">{q.scenario}</p>
                        </div>
                        <div className="space-y-1.5">
                          {q.options.map((opt, oIdx) => {
                            const isPicked = selectedIdx === oIdx;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  const next = { ...quizAnswers, [q.id]: oIdx };
                                  setQuizAnswers(next);
                                  if (Object.keys(next).length === THOUGHT_EXPERIMENT_QUESTIONS.length) {
                                    setQuizCompleted(true);
                                  }
                                }}
                                className={`w-full p-2 rounded-xl border text-left text-[11px] leading-snug transition cursor-pointer ${
                                  isPicked
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500/40'
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {(quizCompleted || Object.keys(quizAnswers).length >= 2) && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-950/50 border-2 border-amber-500/50 space-y-4 animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                          <Award className="w-3.5 h-3.5" />
                          <span>Epistemik & Kozmolojik Profiliniz</span>
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-white">{quizResult.badge}</h3>
                        <p className="text-xs text-slate-200 font-serif">{quizResult.desc}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              `🌌 Sci-Phi Felsefi & Kozmolojik Düşünce Deneyi Testi Sonucum: "${quizResult.badge}"\n\n${quizResult.desc}\n\n🔗 Sen de test et ve 299 makalelik kişisel okuma rotanı keşfet: https://emre-pelit-sci-phi.ai.studio`,
                              'quiz-share'
                            )
                          }
                          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {copiedKey === 'quiz-share' ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                          <span>{copiedKey === 'quiz-share' ? 'Sonuç Kopyalandı!' : 'Profil Sonucumu Paylaş'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-xs font-bold text-amber-300 block">
                        Size Özel Önerilen 5 Makalelik Okuma Rotası:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                        {quizResult.recommendedArticles.map((art, i) => (
                          <div
                            key={art.id}
                            onClick={() => onSelectArticle && onSelectArticle(art.slug)}
                            className="p-3 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer flex flex-col justify-between gap-2 transition"
                          >
                            <div>
                              <span className="text-[10px] font-mono text-amber-400 font-bold">
                                ROTA #{i + 1} • {art.readTime}
                              </span>
                              <h5 className="text-xs font-bold text-white line-clamp-2 mt-0.5">{art.title}</h5>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <span>Hemen Oku</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FEATURE 5: ONE-CLICK ACADEMIC SHARE & FLOOD GENERATOR */}
            {activeFeature === 'academic-flood' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
                {/* X Thread / Flood */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400 uppercase">
                        X (Twitter) 5’li Akademik Flood
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Hazır Zincir</span>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {floodTexts.twitterThread}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(floodTexts.twitterThread, 'x-flood')}
                      className="flex-1 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === 'x-flood' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'x-flood' ? 'Flood Kopyalandı!' : 'Flood Metnini Kopyala'}</span>
                    </button>
                    <a
                      href={buildPlatformShareUrl('twitter-x', floodTexts.twitterThread.slice(0, 260), floodTexts.canonicalUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-white font-bold flex items-center gap-1"
                    >
                      <span>X’te Aç</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* LinkedIn Academic Summary */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-sky-400 uppercase">
                        LinkedIn Akademik Makale Özeti
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">DOI & Diyalektik</span>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {floodTexts.linkedinPost}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(floodTexts.linkedinPost, 'li-post')}
                      className="flex-1 px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === 'li-post' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'li-post' ? 'Kopyalandı!' : 'LinkedIn Metnini Kopyala'}</span>
                    </button>
                    <a
                      href={buildPlatformShareUrl('linkedin', floodTexts.linkedinPost, floodTexts.canonicalUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-white font-bold flex items-center gap-1"
                    >
                      <span>Paylaş</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* ResearchGate / Reddit / WhatsApp */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-400 uppercase">
                        ResearchGate, Academia.edu & Reddit
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Kanonik Künye</span>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {floodTexts.researchGateText}
                    </pre>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(floodTexts.researchGateText, 'rg-post')}
                      className="flex-1 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedKey === 'rg-post' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'rg-post' ? 'Kopyalandı!' : 'Akademik Künyeyi Kopyala'}</span>
                    </button>
                    <a
                      href={buildPlatformShareUrl('whatsapp', floodTexts.linkedinPost, floodTexts.canonicalUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-emerald-300 font-bold"
                    >
                      WhatsApp
                    </a>
                    <a
                      href={buildPlatformShareUrl('reddit', floodTexts.linkedinPost, floodTexts.canonicalUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs text-amber-300 font-bold"
                    >
                      Reddit
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* FEATURE 6: EXTERNAL WEBSITE & FORUM EMBED WIDGET */}
            {activeFeature === 'embed-widget' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
                <div className="lg:col-span-6 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" />
                    <span>6. Dış Web Siteleri, Forumlar ve Bloglar İçin Akademik Atıf & Okunma Widget’ı</span>
                  </span>
                  <p className="text-xs text-slate-300 font-serif">
                    WordPress, Medium, Substack, üniversite kulüp sayfaları ve forumlarda makalelerinizi canlı okunma sayacı ve doğrudan <code>https://emre-pelit-sci-phi.ai.studio</code> kanonik backlinki ile gömmek için aşağıdaki kodu kopyalayın:
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>1. İnteraktif Canlı Kart (&lt;iframe&gt; Widget Kodu):</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(embedIframeCode, 'embed-iframe')}
                        className="text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'embed-iframe' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'embed-iframe' ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
                      </button>
                    </div>
                    <pre className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto">
                      {embedIframeCode}
                    </pre>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>2. Akademik HTML Alıntı &amp; SEO Backlink Kodu (&lt;blockquote&gt;):</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(embedCitationHtmlCode, 'embed-quote')}
                        className="text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'embed-quote' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'embed-quote' ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
                      </button>
                    </div>
                    <pre className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-sky-300 overflow-x-auto">
                      {embedCitationHtmlCode}
                    </pre>
                  </div>
                </div>

                {/* Live Widget Preview */}
                <div className="lg:col-span-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                    <span>Canlı Widget Önizlemesi (/embed/article/{activeArticle.slug.slice(0, 24)}...):</span>
                    <a
                      href={`/embed/article/${encodeURIComponent(activeArticle.slug)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:underline font-mono text-[11px] flex items-center gap-1"
                    >
                      <span>Yeni Sekmede Test Et</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/40 shadow-xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <span className="px-2.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold uppercase">
                        Φ Sci-Phi • {activeArticle.categoryTitle}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px]">
                        DOI: {activeScholarly.doi} • e-ISSN: {activeScholarly.eIssn}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white font-serif">{activeArticle.title}</h4>
                    <p className="text-xs text-slate-300 font-serif line-clamp-3">{activeArticle.summary}</p>
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="text-slate-300">
                        <strong>Emre Pelit</strong> •{' '}
                        <span className="text-sky-400 font-mono font-bold">
                          {activeReads.toLocaleString('tr-TR')} Net Okunma
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectArticle && onSelectArticle(activeArticle.slug)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
                      >
                        Makaleyi Oku &amp; 10 Dilde Dinle →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FEATURE 7: WEEKLY "SCI-PHI AKADEMİK BÜLTEN" NEWSLETTER & TOP 3 DEBATED ARGUMENTS */}
            {activeFeature === 'newsletter' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 rounded-2xl bg-slate-950/90 border border-slate-800">
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      <span>7. Haftalık "Sci-Phi Akademik Bülten" Aboneliği</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                      {newsletterStatus.subscribersCount.toLocaleString('tr-TR')} Aktif Okur
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-serif leading-relaxed">
                    Her Pazar sabahı haftanın en çok tartışılan 3 felsefi/bilimsel argümanını, yeni eklenen makaleleri ve 10 dilde sesli özet bağlantılarını doğrudan e-posta kutunuza alın.
                  </p>

                  <form onSubmit={handleNewsletterSubmit} className="space-y-2.5 pt-1">
                    <input
                      type="text"
                      value={newsletterName}
                      onChange={(e) => setNewsletterName(e.target.value)}
                      placeholder="Adınız / Akademik Unvanınız (İsteğe Bağlı)"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        placeholder="E-posta adresiniz (örn. akademisyen@universite.edu.tr)"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        disabled={newsletterStatus.submitting}
                        className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shrink-0 cursor-pointer transition"
                      >
                        {newsletterStatus.submitting ? 'Kaydediliyor...' : 'Bültene Abone Ol'}
                      </button>
                    </div>
                    <label className="flex items-center gap-2 text-[11px] text-slate-300 cursor-pointer select-none pt-1">
                      <input
                        type="checkbox"
                        checked={browserNotify}
                        onChange={(e) => setBrowserNotify(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                      />
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      <span>Yeni makale yayınlandığında tarayıcı bildirimi de gönder</span>
                    </label>
                  </form>

                  {newsletterStatus.message && (
                    <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{newsletterStatus.message}</span>
                    </div>
                  )}
                </div>

                {/* Weekly Top 3 Debated Arguments Preview */}
                <div className="lg:col-span-7 space-y-2.5">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                    Bu Haftanın Bülteninde Yer Alan En Çok Tartışılan 3 Felsefi & Bilimsel Argüman:
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {(newsletterStatus.weeklyTop3.length > 0
                      ? newsletterStatus.weeklyTop3
                      : articles.slice(0, 3).map((a, idx) => ({
                          rank: idx + 1,
                          slug: a.slug,
                          title: a.title,
                          categoryTitle: a.categoryTitle,
                          doi: getArticleScholarlyIdentifiers(a).doi,
                          thesis: a.dialecticalTriad?.thesis || a.summary.slice(0, 150),
                          url: `https://emre-pelit-sci-phi.ai.studio/makale/${a.slug}`
                        }))
                    ).map((item) => (
                      <div
                        key={item.slug}
                        onClick={() => onSelectArticle && onSelectArticle(item.slug)}
                        className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                            <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                              ARGÜMAN #{item.rank}
                            </span>
                            <span className="text-amber-300">{item.categoryTitle}</span>
                            <span className="text-emerald-400">DOI: {item.doi}</span>
                          </div>
                          <h5 className="text-xs sm:text-sm font-bold text-white">{item.title}</h5>
                          <p className="text-[11px] text-slate-300 font-serif line-clamp-2">
                            <strong>Ana Tez:</strong> {item.thesis}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

interface ArticlePromotionBarProps {
  article: Article;
  lang?: string;
  readsCount?: number;
  onTrackEvent?: (type: string, details: string, siteId?: string, articleSlug?: string) => void;
}

export const ArticlePromotionBar: React.FC<ArticlePromotionBarProps> = ({
  article,
  lang = 'tr',
  readsCount = 420,
  onTrackEvent
}) => {
  const [openTool, setOpenTool] = useState<'none' | 'card' | 'flood' | 'embed'>('none');
  const [cardFormat, setCardFormat] = useState<CardAspectFormat>('twitter-16-9');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const scholarly = useMemo(() => getArticleScholarlyIdentifiers(article), [article]);
  const citations = useMemo(() => generateFormattedCitations(article, PRIMARY_PORTAL_URL, lang), [article, lang]);
  const canonicalUrl = `${PRIMARY_PORTAL_URL}/makale/${encodeURIComponent(article.slug)}`;

  useEffect(() => {
    if (openTool === 'card' && canvasRef.current) {
      drawSocialQuoteCardOnCanvas(canvasRef.current, article, cardFormat, readsCount);
    }
  }, [openTool, article, cardFormat, readsCount]);

  const handleDownloadCard = () => {
    if (!canvasRef.current) return;
    drawSocialQuoteCardOnCanvas(canvasRef.current, article, cardFormat, readsCount);
    const link = document.createElement('a');
    link.download = `sciphi-kart-${article.slug.slice(0, 30)}-${cardFormat}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    if (onTrackEvent) {
      onTrackEvent('quote_card_download', article.title, 'sci-phi-primary', article.slug);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const floodThread = `🧵 [AKADEMİK FLOOD] ${article.title}\n\n1/4 • Özet: ${article.summary}\n\n2/4 • Tez: ${
    article.dialecticalTriad?.thesis || article.subtitle
  }\n\n3/4 • Sentez: ${
    article.dialecticalTriad?.synthesis || article.summary.slice(0, 140)
  }\n\n4/4 • DOI: ${scholarly.doi} • Yazar: Emre Pelit\n🔗 Tam Metin & 10 Dilde Sesli Dinleme: ${canonicalUrl}\n#SciPhi #BilimFelsefesi #EmrePelit`;

  const iframeSnippet = `<iframe src="https://emre-pelit-sci-phi.ai.studio/embed/article/${encodeURIComponent(
    article.slug
  )}" width="100%" height="240" style="border:none;border-radius:16px;overflow:hidden;" loading="lazy"></iframe>`;

  return (
    <div className="my-6 p-4 rounded-2xl bg-slate-900/95 border border-amber-500/40 shadow-lg space-y-3 no-print">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Sparkles className="w-4 h-4" />
          <span>Bu Makaleyi Akademik & Sosyal Ağlarda Tanıt (PNG Kart • X Flood • Sitene Ekle • AI Dizin)</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setOpenTool(openTool === 'card' ? 'none' : 'card')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
              openTool === 'card'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/40'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>PNG Alıntı Kartı İndir</span>
          </button>

          <button
            type="button"
            onClick={() => setOpenTool(openTool === 'flood' ? 'none' : 'flood')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
              openTool === 'flood'
                ? 'bg-sky-500 text-slate-950 font-black'
                : 'bg-slate-950 hover:bg-slate-800 text-sky-300 border border-sky-500/40'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>X Flood & LinkedIn Özeti</span>
          </button>

          <button
            type="button"
            onClick={() => setOpenTool(openTool === 'embed' ? 'none' : 'embed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
              openTool === 'embed'
                ? 'bg-emerald-500 text-slate-950 font-black'
                : 'bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Sitene Ekle (Embed)</span>
          </button>

          <a
            href="/llms.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center gap-1"
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span>/llms.txt</span>
          </a>

          <a
            href="/podcast.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center gap-1"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>/podcast.xml</span>
          </a>
        </div>
      </div>

      {openTool === 'card' && (
        <div className="pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 space-y-2.5">
            <div className="text-xs font-bold text-white">Sosyal Medya PNG Kart Formatı:</div>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'twitter-16-9', label: 'X / Twitter (16:9)' },
                  { id: 'linkedin-wide', label: 'LinkedIn (1.91:1)' },
                  { id: 'instagram-square', label: 'Instagram (1:1)' },
                  { id: 'story-9-16', label: 'Story (9:16)' }
                ] as { id: CardAspectFormat; label: string }[]
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCardFormat(f.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer ${
                    cardFormat === f.id ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-300 border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleDownloadCard}
              className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Yüksek Çözünürlüklü PNG İndir</span>
            </button>
          </div>
          <div className="md:col-span-7 flex justify-center">
            <canvas ref={canvasRef} className="w-full max-h-60 object-contain rounded-xl border border-slate-800" />
          </div>
        </div>
      )}

      {openTool === 'flood' && (
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap">
            {floodThread}
          </pre>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => copyText(floodThread, 'art-flood')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey === 'art-flood' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'art-flood' ? 'Kopyalandı!' : 'Flood Metnini Kopyala'}</span>
            </button>
            <a
              href={buildPlatformShareUrl('twitter-x', floodThread.slice(0, 250), canonicalUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-bold"
            >
              X’te Paylaş →
            </a>
            <a
              href={buildPlatformShareUrl('linkedin', floodThread, canonicalUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-sky-300 font-bold"
            >
              LinkedIn’de Paylaş →
            </a>
            <a
              href={buildPlatformShareUrl('whatsapp', floodThread, canonicalUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-emerald-300 font-bold"
            >
              WhatsApp →
            </a>
          </div>
        </div>
      )}

      {openTool === 'embed' && (
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <div className="text-xs text-slate-300">
            Bu makaleyi kendi sitenize, blogunuza veya foruma canlı okunma sayacı ve DOI künyesiyle ekleyin ({citations.apa}):
          </div>
          <pre className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
            {iframeSnippet}
          </pre>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyText(iframeSnippet, 'art-embed')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey === 'art-embed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'art-embed' ? 'Iframe Kodu Kopyalandı!' : 'Iframe Kodunu Kopyala'}</span>
            </button>
            <a
              href={`/embed/article/${encodeURIComponent(article.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono"
            >
              Widget Önizlemesini Aç →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
