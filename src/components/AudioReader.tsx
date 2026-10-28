import React, { useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Globe,
  Headphones,
  Loader2
} from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  t
} from '../utils/translations';
import { Article } from '../types';
import { useSpeechEngine } from '../utils/speechEngine';

interface AudioReaderProps {
  article: Article;
  currentLang: string;
  onLanguageChange?: (lang: string) => void;
  onTrackEvent?: (type: string, details: string) => void;
}

export const AudioReader: React.FC<AudioReaderProps> = ({
  article,
  currentLang,
  onLanguageChange,
  onTrackEvent
}) => {
  const speech = useSpeechEngine();
  const prevLangRef = useRef<string>(currentLang);

  const langObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  const isThisArticleActive =
    speech.sourceId === `article:${article.slug}` || speech.sourceId === 'site';
  const isPlaying = isThisArticleActive && speech.isPlaying;
  const isPaused = isThisArticleActive && speech.isPaused;
  const isLoading = isThisArticleActive && speech.isLoading;
  const readingProgress = isThisArticleActive ? speech.progress : 0;

  // Dil değiştiğinde eğer makale dinleniyorsa anında hedef doğal dilde okumaya geç
  useEffect(() => {
    if (prevLangRef.current !== currentLang) {
      prevLangRef.current = currentLang;
      if (isPlaying || isPaused) {
        speech.speakArticleContent(article, currentLang, speech.rate);
      }
    }
  }, [currentLang, article, isPlaying, isPaused, speech]);

  const handlePlay = () => {
    if (isPaused) {
      speech.resumeSpeech();
      return;
    }
    if (onTrackEvent) {
      onTrackEvent(
        'audio_listen_start',
        `${article.title} (${currentLang.toUpperCase()})`
      );
    }
    speech.speakArticleContent(article, currentLang, speech.rate);
  };

  const handlePause = () => {
    speech.pauseSpeech();
  };

  const handleStop = () => {
    speech.stopSpeech();
  };

  const handleLangSelect = (newLangCode: string) => {
    if (onLanguageChange) {
      onLanguageChange(newLangCode);
    }
    if (isPlaying || isPaused) {
      speech.speakArticleContent(article, newLangCode, speech.rate);
    }
  };

  const handleRateChange = (newRate: number) => {
    speech.setSpeechRate(newRate);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/30 shadow-xl my-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Sol Bilgi: Durum & Ses Dalgası */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t('audio_listen', currentLang)}
              </span>
              {isPlaying && (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-amber-400 animate-pulse"></span>
                  <span className="w-1 h-5 bg-amber-500 animate-pulse delay-75"></span>
                  <span className="w-1 h-2 bg-amber-300 animate-pulse delay-150"></span>
                  <span className="w-1 h-4 bg-amber-400 animate-pulse delay-100"></span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t('audio_subtitle', currentLang)} •{' '}
              <strong className="notranslate text-amber-300">
                {langObj.flag} {langObj.nativeName} ({langObj.speechCode})
              </strong>
            </p>
          </div>
        </div>

        {/* Sağ: Dil & Hız & Oynatıcı Kontrolleri */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Doğal Dil Seçici (Tüm site diliyle senkronize) */}
          <div className="relative">
            <select
              value={currentLang}
              onChange={(e) => handleLangSelect(e.target.value)}
              className="notranslate pl-7 pr-3 py-1.5 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-300 font-semibold focus:outline-none focus:border-amber-500 cursor-pointer appearance-none"
              title="Dinleme ve Site Dilini Değiştir"
            >
              {SUPPORTED_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="notranslate bg-slate-950 text-slate-200">
                  {l.flag} {l.nativeName} ({l.code.toUpperCase()})
                </option>
              ))}
            </select>
            <Globe className="w-3.5 h-3.5 text-amber-400 absolute left-2 top-2.5 pointer-events-none" />
          </div>

          {/* Hız Butonları */}
          <div className="flex items-center bg-slate-950 rounded-xl p-0.5 border border-slate-800 text-[10px] font-mono">
            {[0.75, 1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => handleRateChange(s)}
                className={`px-2 py-1 rounded-lg transition ${
                  speech.rate === s
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Oynat / Duraklat / Sıfırla Butonları */}
          <div className="flex items-center gap-1.5">
            {!isPlaying ? (
              <button
                onClick={handlePlay}
                disabled={isLoading}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{isPaused ? t('audio_resume', currentLang) : t('audio_start', currentLang)}</span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl text-xs transition flex items-center gap-1.5 border border-amber-500/30"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>{t('audio_pause', currentLang)}</span>
              </button>
            )}

            {(isPlaying || isPaused) && (
              <button
                onClick={handleStop}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition border border-slate-700"
                title={t('stop_listen_btn', currentLang)}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* İlerleme Çubuğu ve Canlı Okunan Cümle */}
      {(isPlaying || isPaused || readingProgress > 0) && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
          {speech.currentChunkText && (
            <p className="text-xs text-amber-200/90 font-serif italic line-clamp-2">
              "{speech.currentChunkText}"
            </p>
          )}
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{t('audio_progress', currentLang)}: %{readingProgress}</span>
            <span className="notranslate">{langObj.nativeName} ({langObj.speechCode})</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};