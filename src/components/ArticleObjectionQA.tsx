import React, { useState, useEffect } from 'react';
import {
  MessageSquareWarning,
  Send,
  Sparkles,
  Mail,
  Clock,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  AlertTriangle,
  User,
  CornerDownRight,
  ExternalLink,
  X,
  Loader2
} from 'lucide-react';
import { Article } from '../types';
import {
  getTranslatedArticle,
  translateFullArticle,
  subscribeToTranslationUpdates
} from '../utils/translations';

export interface QAInteractionItem {
  id: string;
  articleSlug: string;
  articleTitle: string;
  question: string;
  userName?: string;
  userEmail?: string;
  sufficient: boolean;
  status: 'answered' | 'pending';
  answer?: string;
  matchedExcerpts?: string[];
  pendingMessage?: string;
  forwardedToEmail: string;
  mailtoUrl?: string;
  createdAt: string;
}

interface ArticleObjectionQAProps {
  article: Article;
  lang?: string;
  variant?: 'sidebar' | 'inline' | 'modal';
  onCloseModal?: () => void;
  onTrackEvent?: (type: string, details: string, siteId?: string, articleSlug?: string) => void;
}

const QA_STORAGE_PREFIX = 'sciphi_article_qa_v1_';
const AUTHOR_EMAIL = 'emrepelit39@gmail.com';

const TURKISH_STOP_WORDS = new Set([
  'bir', 'bu', 'şu', 'o', 've', 'ile', 'için', 'gibi', 'kadar', 'daha', 'çok', 'en', 'mi', 'mı', 'mu', 'mü',
  'ne', 'nedir', 'nasıl', 'neden', 'niçin', 'niye', 'kim', 'nerede', 'neزمان', 'hangi', 'acaba', 'ama', 'fakat',
  'lakin', 'ancak', 'veya', 'ya', 'da', 'de', 'ki', 'ise', 'olarak', 'olan', 'olur', 'oldu', 'olmak', 'var',
  'yok', 'गöre', 'göre', 'hakkında', 'üzerine', 'ilgili', 'makale', 'makalede', 'makalenin', 'yazı', 'yazıda',
  'bence', 'size', 'sence', 'itiraz', 'ediyorum', 'soru', 'sorum', 'cevap', 'yanıt', 'nedir', 'midir', 'mudur',
  'what', 'how', 'why', 'when', 'where', 'who', 'which', 'the', 'and', 'for', 'with', 'about', 'from', 'this',
  'that', 'are', 'was', 'were', 'have', 'has', 'had', 'can', 'could', 'would', 'should', 'does', 'did', 'into'
]);

function normalizeToken(word: string): string {
  return word
    .toLowerCase()
    .replace(/[^a-z0-9çğıöşüа-яё\u0600-\u06ff\u4e00-\u9fff\u3040-\u30ff]/gi, '')
    .trim();
}

function extractQueryKeywords(question: string): string[] {
  const rawWords = question.split(/\s+/);
  const tokens: string[] = [];
  for (const w of rawWords) {
    const clean = normalizeToken(w);
    if (clean.length >= 3 && !TURKISH_STOP_WORDS.has(clean)) {
      tokens.push(clean);
    }
  }
  return Array.from(new Set(tokens));
}

export function evaluateQuestionAgainstArticleClient(
  article: Article,
  question: string,
  lang: string = 'tr'
): {
  sufficient: boolean;
  answer?: string;
  matchedExcerpts: string[];
  pendingMessage?: string;
  mailtoUrl: string;
} {
  const translated = getTranslatedArticle(article, lang);
  const keywords = extractQueryKeywords(question);

  const mailSubject = encodeURIComponent(`[Sci-Phi İtiraz & Soru] ${article.title}`);
  const mailBody = encodeURIComponent(
    `Merhaba Emre Pelit,\n\n"${article.title}" (https://sci-phi.ai.studio/makale/${article.slug}) başlıklı makaleniz hakkında makale içeriğinde doğrudan yanıtı bulunmayan şu itiraz/soruyu iletmek istiyorum:\n\nSoru / İtiraz:\n"${question}"\n\nSaygılarımla.`
  );
  const mailtoUrl = `mailto:${AUTHOR_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

  if (keywords.length === 0) {
    return {
      sufficient: false,
      matchedExcerpts: [],
      pendingMessage: 'Sorunuz şu an beklemede...',
      mailtoUrl
    };
  }

  // Split article content into meaningful paragraphs
  const rawParagraphs = [
    translated.summary,
    ...(translated.content || '')
      .split(/\n+/)
      .map((p) => p.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim())
      .filter((p) => p.length > 40)
  ];

  if (translated.dialecticalTriad) {
    rawParagraphs.push(
      `Diyalektik Tez: ${translated.dialecticalTriad.thesis}`,
      `Diyalektik Antitez: ${translated.dialecticalTriad.antithesis}`,
      `Diyalektik Sentez: ${translated.dialecticalTriad.synthesis}`
    );
  }

  if (translated.objections && translated.objections.length > 0) {
    translated.objections.forEach((o) => {
      rawParagraphs.push(`${o.philosopher} (${o.school}) İtirazına Yanıt: ${o.rebuttal}`);
    });
  }

  if (translated.mathFormulations && translated.mathFormulations.length > 0) {
    translated.mathFormulations.forEach((f) => {
      rawParagraphs.push(`Matematiksel Model (${f.title}): ${f.interpretation}`);
    });
  }

  const fullCorpusLower = [
    translated.title,
    translated.subtitle,
    translated.summary,
    translated.content,
    ...(translated.tags || []),
    ...rawParagraphs
  ]
    .join(' ')
    .toLowerCase();

  // Check how many query keywords match the article corpus (using 4-char stem prefix matching for Turkish agglutination)
  const matchedKeywords = keywords.filter((kw) => {
    const stem = kw.length >= 5 ? kw.slice(0, Math.min(kw.length - 1, 6)) : kw;
    return fullCorpusLower.includes(stem);
  });

  const coverageRatio = matchedKeywords.length / keywords.length;

  // Score each paragraph
  const scoredParagraphs = rawParagraphs
    .map((para) => {
      const pLower = para.toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        const stem = kw.length >= 5 ? kw.slice(0, Math.min(kw.length - 1, 6)) : kw;
        if (pLower.includes(kw)) {
          score += 3;
        } else if (pLower.includes(stem)) {
          score += 2;
        }
      }
      return { para, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Determine if the article content is sufficient to answer the question
  const isSufficient =
    matchedKeywords.length >= 1 &&
    coverageRatio >= 0.34 &&
    scoredParagraphs.length > 0 &&
    scoredParagraphs[0].score >= 2;

  if (!isSufficient) {
    return {
      sufficient: false,
      matchedExcerpts: [],
      pendingMessage: 'Sorunuz şu an beklemede...',
      mailtoUrl
    };
  }

  const topExcerpts = scoredParagraphs.slice(0, 2).map((s) => s.para);
  const triadNote = translated.dialecticalTriad
    ? `\n\n• Makalenin Diyalektik Sentezi: ${translated.dialecticalTriad.synthesis}`
    : '';

  const synthesizedAnswer =
    `Bu makalenin ("${translated.title}") içeriğine göre sorunuzun/itirazınızın yanıtı:\n\n` +
    topExcerpts.map((ex, idx) => `${idx + 1}. ${ex}`).join('\n\n') +
    triadNote;

  return {
    sufficient: true,
    answer: synthesizedAnswer,
    matchedExcerpts: topExcerpts,
    mailtoUrl
  };
}

export const ArticleObjectionQA: React.FC<ArticleObjectionQAProps> = ({
  article,
  lang = 'tr',
  variant = 'sidebar',
  onCloseModal,
  onTrackEvent
}) => {
  const [, setTick] = useState(0);
  const translated = getTranslatedArticle(article, lang);
  const storageKey = `${QA_STORAGE_PREFIX}${article.slug}`;

  useEffect(() => {
    return subscribeToTranslationUpdates(() => setTick((t) => t + 1));
  }, []);

  useEffect(() => {
    translateFullArticle(article, lang).catch(() => {});
  }, [article, lang]);

  const [questionText, setQuestionText] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [history, setHistory] = useState<QAInteractionItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(storageKey);
      setHistory(raw ? JSON.parse(raw) : []);
    } catch {
      setHistory([]);
    }
  }, [storageKey]);

  const saveHistory = (items: QAInteractionItem[]) => {
    setHistory(items);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(items.slice(0, 30)));
      } catch {
        // ignore storage quota
      }
    }
  };

  const handleAskOrObject = async (e: React.FormEvent, forceForwardToEmail = false) => {
    e.preventDefault();
    const trimmed = questionText.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    const clientEval = evaluateQuestionAgainstArticleClient(article, trimmed, lang);

    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(article.slug)}/objection-ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          articleTitle: translated.title,
          userName: userName.trim() || undefined,
          userEmail: userEmail.trim() || undefined,
          lang,
          forceEmailForward: forceForwardToEmail,
          clientEvaluatedSufficient: clientEval.sufficient,
          clientAnswer: clientEval.answer,
          matchedExcerpts: clientEval.matchedExcerpts
        })
      });

      if (res.ok) {
        const data = await res.json();
        const newItem: QAInteractionItem = {
          id: data.id || `qa-${Date.now()}`,
          articleSlug: article.slug,
          articleTitle: translated.title,
          question: trimmed,
          userName: userName.trim() || undefined,
          userEmail: userEmail.trim() || undefined,
          sufficient: Boolean(data.sufficient),
          status: data.sufficient ? 'answered' : 'pending',
          answer: data.answer,
          matchedExcerpts: data.matchedExcerpts || [],
          pendingMessage: data.pendingMessage || 'Sorunuz şu an beklemede...',
          forwardedToEmail: data.forwardedToEmail || AUTHOR_EMAIL,
          mailtoUrl: data.mailtoUrl,
          createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
        };
        saveHistory([newItem, ...history]);
        setQuestionText('');
        if (onTrackEvent) {
          onTrackEvent(
            data.sufficient ? 'article_qa_answered' : 'article_qa_forwarded_email',
            `${article.title}: ${trimmed.slice(0, 60)}`,
            'sci-phi-primary',
            article.slug
          );
        }
        setIsSubmitting(false);
        return;
      }
    } catch {
      // Fallback to client-side evaluation if offline
    }

    const fallback = evaluateQuestionAgainstArticleClient(article, trimmed, lang);
    const isSufficient = forceForwardToEmail ? false : fallback.sufficient;
    const newItem: QAInteractionItem = {
      id: `qa-${Date.now()}`,
      articleSlug: article.slug,
      articleTitle: translated.title,
      question: trimmed,
      userName: userName.trim() || undefined,
      userEmail: userEmail.trim() || undefined,
      sufficient: isSufficient,
      status: isSufficient ? 'answered' : 'pending',
      answer: isSufficient ? fallback.answer : undefined,
      matchedExcerpts: fallback.matchedExcerpts,
      pendingMessage: 'Sorunuz şu an beklemede...',
      forwardedToEmail: AUTHOR_EMAIL,
      mailtoUrl: fallback.mailtoUrl,
      createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
    };

    saveHistory([newItem, ...history]);
    setQuestionText('');
    setIsSubmitting(false);
  };

  const handleEscalateExistingToEmail = async (item: QAInteractionItem) => {
    try {
      await fetch(`/api/articles/${encodeURIComponent(article.slug)}/objection-ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: item.question,
          userName: item.userName,
          userEmail: item.userEmail,
          lang,
          forceEmailForward: true
        })
      });
    } catch {
      // ignore offline
    }

    const updated = history.map((h) =>
      h.id === item.id
        ? {
            ...h,
            sufficient: false,
            status: 'pending' as const,
            pendingMessage: 'Sorunuz şu an beklemede...'
          }
        : h
    );
    saveHistory(updated);
  };

  const containerClass =
    variant === 'modal'
      ? 'bg-slate-900 border-2 border-rose-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4'
      : variant === 'sidebar'
      ? 'bg-slate-900/95 border-2 border-rose-500/35 rounded-2xl p-5 shadow-xl space-y-4'
      : 'bg-slate-900/95 border border-rose-500/30 rounded-2xl p-5 my-6 shadow-xl space-y-4';

  return (
    <div className={containerClass} onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <MessageSquareWarning className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-black text-white uppercase tracking-wide">
                Makale İtiraz &amp; Soru Cevaplayıcı Motor
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                CANLI MOTOR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
              {translated.title}
            </p>
          </div>
        </div>

        {variant === 'modal' && onCloseModal && (
          <button
            onClick={onCloseModal}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Engine Explanation Badge */}
      <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800/90 text-[11px] text-slate-300 leading-relaxed space-y-1">
        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>Nasıl Çalışır?</span>
        </div>
        <p className="text-slate-400">
          Bu makaleyle ilgili istediğiniz soruyu veya felsefi/bilimsel itirazınızı aşağıya yazın. Cevaplayıcı motor önce <strong>makalenin kendi içeriğini, tezlerini ve formüllerini</strong> tarayarak anında yanıt üretir. Eğer makale içeriği sorunuzu yanıtlamaya yetmiyorsa sorunuzu otomatik olarak <strong className="text-amber-300 font-mono">{AUTHOR_EMAIL}</strong> hesabına iletir ve durumu <strong>&quot;Sorunuz şu an beklemede...&quot;</strong> olarak işaretler.
        </p>
      </div>

      {/* Quick Sample Questions from Article */}
      {translated.socraticQuestions && translated.socraticQuestions.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
            Hızlı Soru / İtiraz Örnekleri:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {translated.socraticQuestions.slice(0, 2).map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuestionText(sq)}
                className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 transition line-clamp-1 cursor-pointer"
                title={sq}
              >
                • {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Question / Objection Input Form */}
      <form onSubmit={(e) => handleAskOrObject(e, false)} className="space-y-2.5">
        <div>
          <label className="text-[11px] font-bold text-slate-300 block mb-1">
            Bu Makaleye İtirazınız veya Sorunuz:
          </label>
          <textarea
            rows={3}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder={`"${translated.title.slice(0, 45)}..." makalesiyle ilgili sorunuzu veya itirazınızı buraya yazın...`}
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-rose-500/60 focus:outline-none text-xs text-white placeholder-slate-500 font-serif leading-relaxed resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="relative">
            <User className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Adınız (İsteğe bağlı)"
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
            />
          </div>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="E-postanız (Yanıt için isteğe bağlı)"
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={isSubmitting || !questionText.trim()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-rose-500/20 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Makale İçeriği Taranıyor...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>İtirazı / Soruyu Gönder &amp; Yanıtla</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Responses & Pending Queue History */}
      {history.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-800 max-h-96 overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>SORU &amp; İTİRAZ GEÇMİŞİ ({history.length})</span>
            <span>Hedef: {AUTHOR_EMAIL}</span>
          </div>

          {history.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border space-y-2.5 text-xs ${
                item.status === 'answered'
                  ? 'bg-slate-950/90 border-emerald-500/35'
                  : 'bg-amber-950/20 border-amber-500/50'
              }`}
            >
              {/* User Question */}
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-white flex items-start gap-1.5">
                  <HelpCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>&ldquo;{item.question}&rdquo;</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {item.createdAt}
                </span>
              </div>

              {item.status === 'answered' && item.answer ? (
                <div className="space-y-2 pl-2 border-l-2 border-emerald-500/50">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Makale İçeriğine Göre Cevaplayıcı Motor Yanıtı:</span>
                  </div>
                  <div className="text-slate-200 font-serif leading-relaxed whitespace-pre-line text-xs bg-slate-900/90 p-3 rounded-lg border border-slate-800">
                    {item.answer}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-emerald-400" />
                      <span>Kaynak: {item.articleTitle}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEscalateExistingToEmail(item)}
                      className="text-[10px] font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Yanıt Yetersizse {AUTHOR_EMAIL} Hesabına Gönder</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-black text-xs">
                    <Clock className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
                    <span>{item.pendingMessage || 'Sorunuz şu an beklemede...'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Makalenin mevcut içeriği bu soruyu doğrudan yanıtlamak için yeterli kapsamda olmadığından sorunuz otomatik olarak <strong className="text-amber-300 font-mono">{item.forwardedToEmail || AUTHOR_EMAIL}</strong> e-posta hesabına gönderilmiştir.
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-amber-500/20 text-[10px]">
                    <span className="text-emerald-400 font-mono flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Durum: Yazar Yanıtı Bekleniyor ({AUTHOR_EMAIL})</span>
                    </span>
                    {item.mailtoUrl && (
                      <a
                        href={item.mailtoUrl}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 transition"
                      >
                        <Mail className="w-3 h-3" />
                        <span>E-posta İstemcisiyle de Gönder ({AUTHOR_EMAIL})</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1">
          <CornerDownRight className="w-3 h-3 text-rose-400" />
          <span>Yetersiz İçerik → {AUTHOR_EMAIL}</span>
        </span>
        <span className="text-emerald-400">7/24 Aktif Cevaplayıcı</span>
      </div>
    </div>
  );
};
