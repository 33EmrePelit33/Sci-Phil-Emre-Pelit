import type { Article } from '../types/index.ts';
import bloggerCatalog from './bloggerCatalog.json' with { type: 'json' };
import {
  deriveArticleMainThesisAndTriad,
  deriveArticleSocraticQuestions,
  deriveArticleObjections,
  deriveArticleTagsAndSubtitle,
  deriveArticleMathFormulations
} from '../utils/articleContentAnalyzer.ts';

export const FOUNDATIONAL_ARTICLES: Article[] = [];

function hydrateBloggerArticle(raw: any, idx: number): Article {
  const title = String(raw.title || 'Felsefi & Bilimsel İnceleme').replace(/\s+/g, ' ').trim();
  const rawContent = String(raw.content || '');
  const category = raw.category || 'epistemoloji';
  const categoryTitle = raw.categoryTitle || 'Epistemoloji & Felsefe';
  const categoryTitleEn = raw.categoryTitleEn || 'Epistemology & Philosophy';

  // Makalenin kendi içeriğinden Ana Tez (Yönetici Özeti) ve Hegelyen Diyalektik Çözümlemeyi (Tez, Antitez, Sentez) çıkar
  const {
    cleanedContent,
    mainThesisSummary,
    dialecticalTriad,
    substantiveParagraphs
  } = deriveArticleMainThesisAndTriad(title, rawContent);

  // Makalenin kendi içeriğinden etiketleri ve alt başlığı çıkar
  const { tags, subtitle, subtitleEn } = deriveArticleTagsAndSubtitle(
    title,
    substantiveParagraphs,
    categoryTitle,
    Array.isArray(raw.tags) ? raw.tags : undefined
  );

  // Makalenin kendi içeriğinden felsefi itiraz & savunmaları çıkar
  const objections = deriveArticleObjections(
    title,
    categoryTitle,
    substantiveParagraphs,
    dialecticalTriad,
    idx
  );

  // Makalenin kendi metnindeki sorulardan Sokratik sorgulama sorularını çıkar
  const socraticQuestions = deriveArticleSocraticQuestions(
    title,
    substantiveParagraphs,
    dialecticalTriad
  );

  // Makalenin kendi konusu ve ana teziyle uyumlu matematiksel formülasyonu oluştur
  const mathFormulations = deriveArticleMathFormulations(
    category,
    title,
    cleanedContent,
    mainThesisSummary
  );

  return {
    id: raw.id || `blogger-post-${idx + 1}`,
    slug: raw.slug,
    title,
    titleEn: raw.titleEn ? String(raw.titleEn).replace(/\s+/g, ' ').trim() : title,
    subtitle,
    subtitleEn,
    category,
    categoryTitle,
    categoryTitleEn,
    summary: mainThesisSummary,
    summaryEn: mainThesisSummary,
    content: cleanedContent,
    contentEn: cleanedContent,
    author: raw.author || 'Emre Pelit',
    date: raw.date || '2026-10-21',
    readTime: raw.readTime || '6 dk',
    featured: Boolean(raw.featured),
    tags,
    mathFormulations,
    dialecticalTriad,
    objections,
    socraticQuestions,
    bloggerUrl: raw.bloggerUrl || 'https://emrepelit7337.blogspot.com/'
  };
}

export function mergeBloggerWithFoundational(bloggerPosts: any[]): Article[] {
  const existingSlugs = new Set<string>();
  const uniqueBloggerArticles: Article[] = [];

  (bloggerPosts || []).forEach((raw, idx) => {
    if (raw && raw.slug && !existingSlugs.has(raw.slug)) {
      existingSlugs.add(raw.slug);
      uniqueBloggerArticles.push(hydrateBloggerArticle(raw, idx));
    }
  });

  // Sort by date descending; for posts on the same date, prioritize Turkish titles first so the primary Turkish essay leads
  uniqueBloggerArticles.sort((a, b) => {
    if (a.date !== b.date) return (b.date || '').localeCompare(a.date || '');
    const aIsTr = /[çğışİĞŞ]|\b(ve|mi|mı|mu|mü|için|olarak|nedir|nasıl)\b/i.test(a.title) ? 1 : 0;
    const bIsTr = /[çğışİĞŞ]|\b(ve|mi|mı|mu|mü|için|olarak|nedir|nasıl)\b/i.test(b.title) ? 1 : 0;
    return bIsTr - aIsTr;
  });

  // Ensure the leading posts are marked featured
  uniqueBloggerArticles.forEach((art, i) => {
    art.featured = i < 6;
  });

  return uniqueBloggerArticles;
}

export const ARTICLES: Article[] = mergeBloggerWithFoundational(bloggerCatalog as any[]);

export const CATEGORIES = [
  { id: 'all', title: 'Tümü', titleEn: 'All' },
  { id: 'fizik-kozmoloji', title: 'Fizik & Kozmoloji', titleEn: 'Physics & Cosmology' },
  { id: 'zihin-bilinc', title: 'Zihin & Bilinç', titleEn: 'Mind & Consciousness' },
  { id: 'epistemoloji', title: 'Epistemoloji & Felsefe', titleEn: 'Epistemology & Philosophy' },
  { id: 'diyalektik-mantik', title: 'Diyalektik & Mantık', titleEn: 'Dialectics & Logic' },
  { id: 'etik-teknoloji', title: 'Etik & Teknoloji', titleEn: 'Ethics & Technology' }
];
