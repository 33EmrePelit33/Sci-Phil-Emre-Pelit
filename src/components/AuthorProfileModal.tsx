import React from 'react';
import { X, Mail, Globe, ShieldCheck, CheckCircle, ExternalLink, Linkedin } from 'lucide-react';
import { t } from '../utils/translations';

interface AuthorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
  authorShieldActive?: boolean;
  onToggleAuthorShield?: () => void;
}

export const AuthorProfileModal: React.FC<AuthorProfileModalProps> = ({
  isOpen,
  onClose,
  lang = 'tr',
  authorShieldActive = true,
  onToggleAuthorShield
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center text-slate-950 font-black text-3xl shadow-lg shadow-amber-500/20 shrink-0">
            EP
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xl font-bold text-white">Emre Pelit</h3>
              <CheckCircle className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-xs text-amber-400 font-medium mt-0.5">
              {t('author_role', lang)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {t('author_research', lang)}
            </p>
          </div>
        </div>

        {/* Biography */}
        <div className="py-4 space-y-3 text-xs text-slate-300 leading-relaxed font-serif">
          <p>
            {t('author_bio_1', lang)}
          </p>
          <p>
            {t('author_bio_2', lang)}
          </p>
        </div>

        {/* Author Read Shield Control */}
        <div className="mb-4 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-300">
                  {lang === 'tr' ? 'Yazar Okuma Koruması (Author Read Shield)' : 'Author Read Shield'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {lang === 'tr'
                    ? 'Yazar hesabı okumaları net okunma sayısına dahil edilmez; ziyaretçi ve indirilen uygulama (PWA) okuma/görüntülemeleri tam sayılır.'
                    : 'Author account reads are excluded from net reads; visitor and installed PWA app reads/views are always counted.'}
                </div>
              </div>
            </div>
            {onToggleAuthorShield && (
              <button
                onClick={onToggleAuthorShield}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition shrink-0 ${
                  authorShieldActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {authorShieldActive
                  ? lang === 'tr'
                    ? 'Yazar Kalkanı Aktif'
                    : 'Author Shield On'
                  : lang === 'tr'
                    ? 'Ziyaretçi / Uygulama Modu (Sayılır)'
                    : 'Visitor / App Mode (Counted)'}
              </button>
            )}
          </div>
        </div>

        {/* Contact & Links */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <a
            href="mailto:emrepelit39@gmail.com"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-xs transition"
          >
            <span className="flex items-center gap-2 text-slate-300 font-mono">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>emrepelit39@gmail.com</span>
            </span>
            <span className="text-[10px] text-slate-500">{lang === 'tr' ? 'E-posta' : 'Email'}</span>
          </a>

          <a
            href="https://www.linkedin.com/in/emrepelit109"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-sky-500/40 text-xs transition"
          >
            <span className="flex items-center gap-2 text-slate-300 font-mono">
              <Linkedin className="w-4 h-4 text-sky-400" />
              <span>www.linkedin.com/in/emrepelit109</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>

          <a
            href="https://emrepelit7337.blogspot.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-xs transition"
          >
            <span className="flex items-center gap-2 text-slate-300 font-mono">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>emrepelit7337.blogspot.com</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </div>
      </div>
    </div>
  );
};

