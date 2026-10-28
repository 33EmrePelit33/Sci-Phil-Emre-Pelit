import React from 'react';
import { Layers, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { DialecticalTriad } from '../types';
import { t } from '../utils/translations';

interface DialecticalTriadViewProps {
  triad: DialecticalTriad;
  articleTitle?: string;
  lang?: string;
}

export const DialecticalTriadView: React.FC<DialecticalTriadViewProps> = ({
  triad,
  articleTitle,
  lang = 'tr'
}) => {
  return (
    <div className="bg-slate-900/90 border border-amber-500/20 rounded-2xl p-6 my-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              {t('triad_title', lang)}
            </h4>
            {articleTitle && (
              <p className="text-[11px] text-slate-400 font-serif italic line-clamp-1 mt-0.5">
                {articleTitle}
              </p>
            )}
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 self-start sm:self-auto">
          {lang === 'tr' ? 'Makale İçeriğine Özgü Diyalektik Üçleme' : 'Article-Specific Dialectical Triad'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Thesis */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-sky-400 mb-2">
              <span>{t('triad_thesis', lang)}</span>
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-serif whitespace-pre-line">
              {triad.thesis}
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center gap-1">
            <ArrowRight className="w-3 h-3 text-sky-400" />
            <span>{t('triad_thesis_sub', lang)}</span>
          </div>
        </div>

        {/* Antithesis */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-rose-400 mb-2">
              <span>{t('triad_antithesis', lang)}</span>
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-serif whitespace-pre-line">
              {triad.antithesis}
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center gap-1">
            <Zap className="w-3 h-3 text-rose-400" />
            <span>{t('triad_antithesis_sub', lang)}</span>
          </div>
        </div>

        {/* Synthesis */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300 mb-2">
              <span>{t('triad_synthesis', lang)}</span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-serif font-medium whitespace-pre-line">
              {triad.synthesis}
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-amber-500/20 text-[10px] text-amber-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-amber-400" />
            <span>{t('triad_synthesis_sub', lang)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
