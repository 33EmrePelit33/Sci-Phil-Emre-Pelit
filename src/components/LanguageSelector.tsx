import React from 'react';
import { X, Check, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/translations';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: string;
  onSelectLang: (code: string) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLang
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-bold text-white">Doğal Dil Seçimi / Language</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Tüm makaleleri, felsefi diyalektikleri ve sesli dinleme özelliğini seçtiğiniz dilde inceleyebilirsiniz.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
          {SUPPORTED_LANGUAGES.map((l) => {
            const isSelected = currentLang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => {
                  onSelectLang(l.code);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{l.flag}</span>
                  <div>
                    <span className="text-xs block font-semibold">{l.nativeName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{l.name}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
