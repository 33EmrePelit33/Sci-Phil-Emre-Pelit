import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function htmlToCleanMarkdown(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/(p|div|h1|h2|h3|h4|li|blockquote|br)>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ß/g, 'ss')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export function detectCategory(title, content, tags) {
  const combined = (title + ' ' + content + ' ' + tags.join(' ')).toLowerCase();

  // Brain-Computer Interfaces / Mental Autonomy / AI Ethics
  if (
    combined.includes('beyin bilgisayar') ||
    combined.includes('brain-computer') ||
    combined.includes('cerveau-machine') ||
    combined.includes('gehirn-computer') ||
    combined.includes('cerebro-computadora') ||
    combined.includes('zihinsel özerklik') ||
    combined.includes('mental autonomy') ||
    combined.includes('autonomie mentale') ||
    combined.includes('geistiger autonomie') ||
    combined.includes('autonomía mental') ||
    combined.includes('kod') ||
    combined.includes('coding') ||
    combined.includes('program') ||
    combined.includes('yapay zeka') ||
    combined.includes('algoritma') ||
    combined.includes('algorithm') ||
    combined.includes('yazılım') ||
    combined.includes('teknoloji') ||
    combined.includes('technology') ||
    combined.includes('beslenme') ||
    combined.includes('sağlık')
  ) {
    return {
      category: 'etik-teknoloji',
      categoryTitle: 'Etik & Teknoloji',
      categoryTitleEn: 'Ethics & Technology'
    };
  }

  if (
    combined.includes('solucan') ||
    combined.includes('wormhole') ||
    combined.includes('evren') ||
    combined.includes('universe') ||
    combined.includes('univers') ||
    combined.includes('universum') ||
    combined.includes('universo') ||
    combined.includes('uzay') ||
    combined.includes('space') ||
    combined.includes('karadelik') ||
    combined.includes('black hole') ||
    combined.includes('relativity') ||
    combined.includes('görelilik') ||
    combined.includes('kuantum') ||
    combined.includes('quantum') ||
    combined.includes('multiverse') ||
    combined.includes('çoklu evren') ||
    combined.includes('fizik') ||
    combined.includes('physics')
  ) {
    return {
      category: 'fizik-kozmoloji',
      categoryTitle: 'Fizik & Kozmoloji',
      categoryTitleEn: 'Physics & Cosmology'
    };
  }

  if (
    combined.includes('zihin') ||
    combined.includes('mind') ||
    combined.includes('beyin') ||
    combined.includes('brain') ||
    combined.includes('nöron') ||
    combined.includes('neuron') ||
    combined.includes('bilinç') ||
    combined.includes('consciousness') ||
    combined.includes('bewusstsein') ||
    combined.includes('conscience') ||
    combined.includes('conciencia') ||
    combined.includes('ruh') ||
    combined.includes('soul') ||
    combined.includes('qualia') ||
    combined.includes('hafıza') ||
    combined.includes('memory') ||
    combined.includes('nefs') ||
    combined.includes('llm')
  ) {
    return {
      category: 'zihin-bilinc',
      categoryTitle: 'Zihin & Bilinç',
      categoryTitleEn: 'Mind & Consciousness'
    };
  }

  if (
    combined.includes('oran') ||
    combined.includes('pi') ||
    combined.includes('altın') ||
    combined.includes('golden ratio') ||
    combined.includes('mantık') ||
    combined.includes('logic') ||
    combined.includes('çelişki') ||
    combined.includes('diyalektik') ||
    combined.includes('sentez') ||
    combined.includes('tez') ||
    combined.includes('sabit')
  ) {
    return {
      category: 'diyalektik-mantik',
      categoryTitle: 'Diyalektik & Mantık',
      categoryTitleEn: 'Dialectics & Logic'
    };
  }

  return {
    category: 'epistemoloji',
    categoryTitle: 'Epistemoloji & Felsefe',
    categoryTitleEn: 'Epistemology & Philosophy'
  };
}

export function getMathFormulations(category, title) {
  const t = title.toLowerCase();

  if (
    t.includes('beyin bilgisayar') ||
    t.includes('brain-computer') ||
    t.includes('cerveau-machine') ||
    t.includes('gehirn-computer') ||
    t.includes('cerebro-computadora') ||
    t.includes('özerklik') ||
    t.includes('autonomy') ||
    t.includes('autonomie') ||
    t.includes('autonomía')
  ) {
    return [
      {
        title: 'Nöral Bilgi Sızıntısı ve Zihinsel Özerklik Sınırı (Neural Autonomy & Privacy Bound)',
        latex: 'I(N_{\\text{raw}} ; D_{\\text{BCI}}) = H(N_{\\text{raw}}) - H(N_{\\text{raw}} \\mid D_{\\text{BCI}}) \\le \\epsilon_{\\text{autonomy}}',
        interpretation: 'Beyin-bilgisayar arayüzü ($D_{\\text{BCI}}$) ile ham nöral durumlar ($N_{\\text{raw}}$) arasındaki karşılıklı bilgi akışı kritik özerklik eşiğini ($\\epsilon_{\\text{autonomy}}$) aştığında, öznenin bilişsel mahremiyeti ve içsel karar özerkliği matematiksel olarak dışsal modülasyona açık hale gelir.',
        domain: 'Nöro-Etik & Enformasyon Kuramı'
      }
    ];
  }

  if (t.includes('solucan') || t.includes('wormhole')) {
    return [
      {
        title: 'Morris-Thorne Geçilebilir Solucan Deliği Metriği (Traversable Wormhole Metric)',
        latex: 'ds^2 = -e^{2\\Phi(r)} c^2 dt^2 + \\frac{dr^2}{1 - b(r)/r} + r^2 (d\\theta^2 + \\sin^2\\theta d\\phi^2)',
        interpretation: 'Uzay-zamanın iki uzak bölgesini birbirine bağlayan boğazın geometrisi. Boğaz yarıçapında b(r_0) = r_0 koşulu ve negatif enerji yoğunluğu gerektiren egzotik madde varlığı matematiksel olarak zorunludur.',
        domain: 'Genel Görelilik'
      }
    ];
  }

  if (t.includes('altın oran') || t.includes('golden ratio') || t.includes('pi')) {
    return [
      {
        title: 'Kozmik Uyum ve Altın Oran Özdeşliği (Golden Ratio & Geometrical Harmony)',
        latex: '\\phi = \\frac{1 + \\sqrt{5}}{2} = 1 + \\frac{1}{1 + \\frac{1}{1 + \\dots}} \\approx 1.6180339887...',
        interpretation: 'Evrendeki spiral galaksilerden biyolojik büyüme formasyonlarına kadar uzanan fraktal estetik ve enerji optimizasyonu denklemi.',
        domain: 'Fraktal Matematik'
      },
      {
        title: 'Euler Özdeşliği ve Dairesel Simetri (Euler Identity)',
        latex: 'e^{i\\pi} + 1 = 0',
        interpretation: 'Matematiğin en temel beş sabitini (0, 1, e, i, pi) ve üç temel işlemini tek bir kusursuz uyumda birleştiren kozmik eşitlik.',
        domain: 'Karmaşık Analiz'
      }
    ];
  }

  if (
    t.includes('tekil') ||
    t.includes('singular') ||
    t.includes('evren') ||
    t.includes('universe') ||
    t.includes('univers') ||
    t.includes('universum')
  ) {
    return [
      {
        title: 'Friedmann Kozmolojik Genişleme Denklemi (Friedmann Cosmology)',
        latex: 'H^2 = \\left(\\frac{\\dot{a}}{a}\\right)^2 = \\frac{8\\pi G}{3}\\rho - \\frac{k c^2}{a^2} + \\frac{\\Lambda c^2}{3}',
        interpretation: 'Tekil bir evrenin zamansal evrimini, madde yoğunluğunu (\\rho) ve kozmolojik sabiti (\\Lambda) tanımlayan Einstein alan denklemlerinin çözümü.',
        domain: 'Fiziksel Kozmoloji'
      }
    ];
  }

  if (t.includes('kod') || t.includes('program') || t.includes('yazılım')) {
    return [
      {
        title: 'Wheeler Bilgisel Entropi (It-from-Bit Formulation)',
        latex: 'I(X; Y) = \\sum_{x, y} p(x, y) \\log_2 \\left( \\frac{p(x, y)}{p(x)p(y)} \\right)',
        interpretation: 'Fiziksel varoluşun en temelde ikili (bit) bilgi etkileşimlerinden türediğini gösteren karşılıklı bilgi (mutual information) formülü.',
        domain: 'Kuantum Enformasyon'
      }
    ];
  }

  if (
    t.includes('zihin') ||
    t.includes('nöron') ||
    t.includes('ruh') ||
    t.includes('beyin') ||
    t.includes('mind') ||
    t.includes('llm') ||
    t.includes('bewusstsein') ||
    t.includes('conscience')
  ) {
    return [
      {
        title: 'Bilişsel Bütünleşik Bilgi Yoğunluğu (IIT Phi Formulation)',
        latex: '\\Phi = D_{\\text{KL}}\\left( p(X_t \\mid X_{t-1}) \\;\\Vert\\; \\prod_k p(M_t^k \\mid M_{t-1}^k) \\right)',
        interpretation: 'Beyindeki nöral ağların parçalarına indirgenemez bütünsel bilgi işleme kapasitesi. Bilincin derecesini belirleyen nedensel ilişki matrisi.',
        domain: 'Nöro-Felsefe'
      }
    ];
  }

  if (category === 'diyalektik-mantik') {
    return [
      {
        title: 'Diyalektik Faz Geçişi ve Kritik Eşik (Qualitative Jump Calculus)',
        latex: '\\lim_{\\Delta Q \\to Q_c} \\left( \\frac{\\partial \\Phi}{\\partial Q} \\right) = \\infty',
        interpretation: 'Niceliksel değişimlerin belirli bir kritik eşikte ($Q_c$) niteliksel sıçramaya (faz dönüşümüne) uğramasını modelleyen termodinamik diyalektik türevi.',
        domain: 'Diyalektik Analiz'
      }
    ];
  }

  return [
    {
      title: 'Bayesyen Epistemik İnanç Güncelleme İlkesi (Bayesian Inference)',
      latex: 'P(H \\mid E) = \\frac{P(E \\mid H) \\cdot P(H)}{P(E)}',
      interpretation: 'Yeni gözlemsel kanıtlar ($E$) ışığında bir hipotezin ($H$) doğrulanma olasılığının rasyonel olarak güncellenmesi.',
      domain: 'Epistemoloji'
    }
  ];
}

export async function fetchAllBloggerArticles() {
  const pageSize = 150;
  let startIndex = 1;
  let totalExpected = Infinity;
  const allEntries = [];

  while (startIndex <= totalExpected && startIndex <= 1500) {
    const url = `https://emrepelit7337.blogspot.com/feeds/posts/default?alt=json&start-index=${startIndex}&max-results=${pageSize}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SciPhiBloggerSync/3.0; +https://sci-phi.ai.studio/)'
      }
    });
    if (!res.ok) break;
    const data = await res.json();
    const totalRes = Number(data?.feed?.openSearch$totalResults?.$t || 0);
    if (totalRes > 0) totalExpected = totalRes;
    const batch = data?.feed?.entry || [];
    if (batch.length === 0) break;
    allEntries.push(...batch);
    if (batch.length < pageSize || allEntries.length >= totalExpected) break;
    startIndex += batch.length;
  }

  const usedSlugs = new Set();

  return allEntries.map((entry, index) => {
    const rawTitle = (entry.title?.$t || 'Felsefi & Bilimsel İnceleme').replace(/\s+/g, ' ').trim();
    const rawContent = entry.content?.$t || entry.summary?.$t || '';
    const cleanHtmlMarkdown = htmlToCleanMarkdown(rawContent);

    const altLink =
      (entry.link || []).find((l) => l.rel === 'alternate')?.href ||
      'https://emrepelit7337.blogspot.com/';
    const published = entry.published?.$t ? entry.published.$t.split('T')[0] : '2026-10-21';

    const rawTags = (entry.category || []).map((c) => c.term);

    const { category, categoryTitle, categoryTitleEn } = detectCategory(rawTitle, cleanHtmlMarkdown, rawTags);

    // Derive slug from title or Blogger path and guarantee 100% uniqueness
    let baseSlug = slugify(rawTitle);
    if (!baseSlug || baseSlug.length < 3) {
      const pathMatch = altLink.match(/\/([^/]+)\.html$/i);
      baseSlug = pathMatch ? slugify(pathMatch[1]) : `blogger-makale-${index + 1}`;
    }
    let finalSlug = baseSlug || `blogger-makale-${index + 1}`;
    let counter = 2;
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(finalSlug);

    // Reconstruct clean paragraphs and extract Main Thesis + Hegelian Dialectical Triad from the article's own content
    const paragraphs = cleanHtmlMarkdown
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    const plainText = paragraphs.join(' ');
    const summary = paragraphs.length >= 2 ? paragraphs[paragraphs.length - 1] : plainText;
    const mathFormulations = getMathFormulations(category, rawTitle);

    return {
      id: `blogger-post-${index + 1}`,
      slug: finalSlug,
      title: rawTitle,
      titleEn: rawTitle,
      subtitle: paragraphs[0] ? paragraphs[0].slice(0, 150) : rawTitle,
      subtitleEn: paragraphs[0] ? paragraphs[0].slice(0, 150) : rawTitle,
      category,
      categoryTitle,
      categoryTitleEn,
      summary,
      summaryEn: summary,
      content: cleanHtmlMarkdown,
      contentEn: cleanHtmlMarkdown,
      author: 'Emre Pelit',
      date: published,
      readTime: `${Math.max(4, Math.ceil(plainText.split(' ').length / 180))} dk`,
      featured: index < 6,
      tags: rawTags.slice(0, 6),
      mathFormulations,
      bloggerUrl: altLink
    };
  });
}

export function compactBloggerArticles(articles) {
  return (articles || []).map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    category: a.category,
    categoryTitle: a.categoryTitle,
    categoryTitleEn: a.categoryTitleEn,
    content: a.content,
    date: a.date,
    readTime: a.readTime,
    tags: a.tags,
    bloggerUrl: a.bloggerUrl
  }));
}

async function runCli() {
  console.log('Synchronizing all posts from emrepelit7337.blogspot.com...');
  const articles = await fetchAllBloggerArticles();
  console.log(`Fetched and normalized ${articles.length} unique posts from emrepelit7337.blogspot.com.`);

  const compactArticles = compactBloggerArticles(articles);
  const tsOutputPath = path.resolve(__dirname, '../src/data/bloggerCatalog.json');
  fs.writeFileSync(tsOutputPath, JSON.stringify(compactArticles), 'utf-8');
  console.log(`Saved ${compactArticles.length} compact articles to src/data/bloggerCatalog.json`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  runCli().catch(console.error);
}
