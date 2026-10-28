import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Article } from '../types';
import { t, getTranslatedArticle } from '../utils/translations';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (slug: string) => void;
  lang?: string;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  onSelectArticle,
  lang = 'tr'
}) => {
  const [query, setQuery] = useState<string>('');

  if (!isOpen) return null;

  const results = articles.filter((a) => {
    const q = query.toLowerCase();
    const tr = getTranslatedArticle(a, lang);
    return (
      a.title.toLowerCase().includes(q) ||
      tr.title.toLowerCase().includes(q) ||
      tr.summary.toLowerCase().includes(q) ||
      tr.tags.some((tTag) => tTag.toLowerCase().includes(q)) ||
      (a.mathFormulations && a.mathFormulations.some((m) => m.title.toLowerCase().includes(q) || m.latex.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5 flex-1">
            <Search className="w-5 h-5 text-amber-400" />
            <input
              type="text"
              autoFocus
              placeholder={t('search_placeholder', lang)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1">
          {results.length > 0 ? (
            results.map((article) => {
              const tr = getTranslatedArticle(article, lang);
              return (
                <div
                  key={article.id}
                  onClick={() => {
                    onSelectArticle(article.slug);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/50 cursor-pointer transition group flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">
                      {tr.categoryTitle}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {tr.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-serif">
                      {tr.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              {t('no_articles_found', lang) || 'Eşleşen makale bulunamadı.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

