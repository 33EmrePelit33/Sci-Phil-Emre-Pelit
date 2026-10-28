import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { PhilosophicalObjection } from '../types';
import { t } from '../utils/translations';

interface ObjectionBoxProps {
  objections: PhilosophicalObjection[];
  lang?: string;
}

export const ObjectionBox: React.FC<ObjectionBoxProps> = ({ objections, lang = 'tr' }) => {
  const [activeId, setActiveId] = useState<string>(objections[0]?.id || '');
  const activeObj = objections.find((o) => o.id === activeId) || objections[0];

  if (!objections || objections.length === 0) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 my-8 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
          <MessageSquareQuote className="w-4 h-4" />
        </span>
        <h4 className="text-sm font-bold uppercase tracking-wider text-rose-400">
          {t('objections_title', lang)}
        </h4>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800 no-scrollbar">
        {objections.map((obj) => (
          <button
            key={obj.id}
            onClick={() => setActiveId(obj.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeId === obj.id
                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {obj.philosopher} <span className="opacity-60 text-[10px]">({obj.school})</span>
          </button>
        ))}
      </div>

      {activeObj && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* The Objection */}
          <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/30">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{activeObj.philosopher} {t('objection_label', lang)}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
              "{activeObj.objection}"
            </p>
          </div>

          {/* The Rebuttal */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/30">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('rebuttal_label', lang)}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-serif">
              {activeObj.rebuttal}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
