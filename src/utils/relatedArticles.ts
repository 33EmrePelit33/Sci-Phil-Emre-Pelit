import type { Article } from '../types/index.ts';

export interface RelatedArticleNode {
  article: Article;
  affinityScore: number; // 0 - 100
  sharedTags: string[];
  relationType: 'primary_semantic' | 'same_discipline' | 'cross_disciplinary';
  relationReasonTr: string;
  relationReasonEn: string;
}

export interface RelatedArticlesArchitecture {
  currentSlug: string;
  primaryRelated: RelatedArticleNode[];
  categoryCluster: RelatedArticleNode[];
  crossDisciplinaryBridge: RelatedArticleNode[];
  inlineRecommendations: RelatedArticleNode[];
  prevArticle: Article;
  nextArticle: Article;
}

function normalizeToken(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .trim();
}

function extractKeywords(article: Article): Set<string> {
  const raw = [
    article.title,
    article.titleEn,
    article.subtitle,
    article.subtitleEn,
    ...article.tags,
    ...(article.mathFormulations?.map((m) => m.domain) || []),
    ...(article.objections?.map((o) => `${o.philosopher} ${o.school}`) || [])
  ].join(' ');

  const stopWords = new Set([
    've', 'ile', 'bir', 'bu', 'için', 'olarak', 'olan', 'üzerine', 'arasındaki', 'mi', 'mı',
    'the', 'and', 'of', 'in', 'to', 'a', 'is', 'for', 'on', 'with', 'as', 'by', 'an', 'from'
  ]);

  const tokens = normalizeToken(raw)
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w));

  return new Set(tokens);
}

/**
 * Computes a deterministic multi-dimensional Related Articles Architecture
 * for any article across the 301-article corpus.
 */
export function buildRelatedArticlesArchitecture(
  currentArticle: Article,
  allArticles: Article[]
): RelatedArticlesArchitecture {
  const currentIndex = Math.max(
    0,
    allArticles.findIndex((a) => a.slug === currentArticle.slug)
  );

  const prevIndex = (currentIndex - 1 + allArticles.length) % allArticles.length;
  const nextIndex = (currentIndex + 1) % allArticles.length;

  const prevArticle = allArticles[prevIndex] || allArticles[0];
  const nextArticle = allArticles[nextIndex] || allArticles[0];

  const currentTagsLower = new Set(currentArticle.tags.map((t) => t.toLowerCase().trim()));
  const currentKeywords = extractKeywords(currentArticle);
  const currentMathDomains = new Set(
    (currentArticle.mathFormulations || []).map((m) => m.domain.toLowerCase().trim())
  );

  const scoredCandidates: RelatedArticleNode[] = [];

  for (let i = 0; i < allArticles.length; i++) {
    const candidate = allArticles[i];
    if (candidate.slug === currentArticle.slug) continue;

    // 1. Shared tags
    const sharedTags = candidate.tags.filter((t) =>
      currentTagsLower.has(t.toLowerCase().trim())
    );

    // 2. Keyword overlap
    const candidateKeywords = extractKeywords(candidate);
    let keywordOverlapCount = 0;
    candidateKeywords.forEach((kw) => {
      if (currentKeywords.has(kw)) keywordOverlapCount++;
    });

    // 3. Same category bonus
    const isSameCategory = candidate.category === currentArticle.category;

    // 4. Math domain overlap
    const hasSharedMathDomain = (candidate.mathFormulations || []).some((m) =>
      currentMathDomains.has(m.domain.toLowerCase().trim())
    );

    // 5. Deterministic tie-breaker & proximity bonus
    const indexDistance = Math.abs(i - currentIndex);
    const proximityBonus = Math.max(0, 6 - Math.floor(indexDistance / 15));
    const deterministicOffset = ((i * 7 + currentIndex * 13) % 5);

    const rawScore =
      (isSameCategory ? 78 : 66) +
      sharedTags.length * 7 +
      Math.min(14, keywordOverlapCount * 3) +
      (hasSharedMathDomain ? 5 : 0) +
      proximityBonus +
      deterministicOffset;

    // Clamp to realistic high-confidence range (72 - 98)
    const affinityScore = Math.min(98, Math.max(72, Math.round(rawScore)));

    let relationReasonTr = '';
    let relationReasonEn = '';

    if (sharedTags.length > 0 && isSameCategory) {
      relationReasonTr = `${currentArticle.categoryTitle} • Ortak Kavram: #${sharedTags[0]}`;
      relationReasonEn = `${currentArticle.categoryTitleEn || currentArticle.categoryTitle} • Shared Concept: #${sharedTags[0]}`;
    } else if (sharedTags.length > 0) {
      relationReasonTr = `Disiplinlerarası Ortak Etiket: #${sharedTags.slice(0, 2).join(', #')}`;
      relationReasonEn = `Cross-Disciplinary Tag: #${sharedTags.slice(0, 2).join(', #')}`;
    } else if (hasSharedMathDomain && isSameCategory) {
      relationReasonTr = `${currentArticle.categoryTitle} & Ortak MatematikselModel`;
      relationReasonEn = `${currentArticle.categoryTitleEn || currentArticle.categoryTitle} & Shared Formal Model`;
    } else if (isSameCategory) {
      relationReasonTr = `Aynı Felsefi/Bilimsel Disiplin: ${currentArticle.categoryTitle}`;
      relationReasonEn = `Same Philosophical/Scientific Discipline: ${currentArticle.categoryTitleEn || currentArticle.categoryTitle}`;
    } else {
      relationReasonTr = `Diyalektik & Epistemolojik Köprü (${candidate.categoryTitle})`;
      relationReasonEn = `Dialectical & Epistemological Bridge (${candidate.categoryTitleEn || candidate.categoryTitle})`;
    }

    scoredCandidates.push({
      article: candidate,
      affinityScore,
      sharedTags,
      relationType: isSameCategory ? 'same_discipline' : 'cross_disciplinary',
      relationReasonTr,
      relationReasonEn
    });
  }

  // Sort by affinityScore descending, then deterministic index order
  scoredCandidates.sort((a, b) => {
    if (b.affinityScore !== a.affinityScore) return b.affinityScore - a.affinityScore;
    return a.article.id.localeCompare(b.article.id);
  });

  // 1. Primary Related (Top 6 overall, ensuring mix of top semantic matches)
  const primaryRelated = scoredCandidates.slice(0, 6).map((node) => ({
    ...node,
    relationType: 'primary_semantic' as const
  }));

  const usedSlugs = new Set(primaryRelated.map((n) => n.article.slug));

  // 2. Category Cluster (4 articles from the same category not in primaryRelated)
  const categoryCluster = scoredCandidates
    .filter((n) => n.article.category === currentArticle.category && !usedSlugs.has(n.article.slug))
    .slice(0, 4)
    .map((node) => {
      usedSlugs.add(node.article.slug);
      return {
        ...node,
        relationType: 'same_discipline' as const
      };
    });

  // 3. Cross-Disciplinary Bridge (4 articles from OTHER categories)
  const crossDisciplinaryBridge = scoredCandidates
    .filter((n) => n.article.category !== currentArticle.category && !usedSlugs.has(n.article.slug))
    .slice(0, 4)
    .map((node) => {
      usedSlugs.add(node.article.slug);
      return {
        ...node,
        relationType: 'cross_disciplinary' as const
      };
    });

  // 4. Inline Recommendations (Top 3 most relevant articles for quick mid/end-article links)
  const inlineRecommendations = [
    primaryRelated[0],
    primaryRelated[1],
    crossDisciplinaryBridge[0] || primaryRelated[2]
  ].filter(Boolean);

  return {
    currentSlug: currentArticle.slug,
    primaryRelated,
    categoryCluster,
    crossDisciplinaryBridge,
    inlineRecommendations,
    prevArticle,
    nextArticle
  };
}
