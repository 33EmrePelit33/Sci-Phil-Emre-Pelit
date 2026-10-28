import React, { useState, useRef, useEffect } from 'react';
import {
  Cpu,
  BarChart3,
  Globe,
  Sliders,
  User,
  Search,
  ExternalLink,
  BookOpen,
  Share2,
  Volume2,
  Pause,
  Play,
  Square,
  Loader2,
  Languages,
  Mail,
  Linkedin,
  Sun,
  Moon,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { COMPUTED_TOTAL_NET_READS } from '../data/baselineStats';
import { SUPPORTED_LANGUAGES, t } from '../utils/translations';
import { useSpeechEngine } from '../utils/speechEngine';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  lang: string;
  onSelectLang?: (code: string) => void;
  totalNetReads?: number;
  totalArticlesCount?: number;
  onOpenLanguage: () => void;
  onOpenSearch: () => void;
  onOpenAuthor: () => void;
  onOpenInvite?: () => void;
  onOpenGoogleIndex?: () => void;
  googleIndexStatus?: { indexedCount: number; totalCount: number; isRunning: boolean };
  onListenSite?: () => void;
  isSiteTranslating?: boolean;
  theme?: 'dark' | 'paper';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  lang,
  onSelectLang,
  totalNetReads = COMPUTED_TOTAL_NET_READS,
  totalArticlesCount = 299,
  onOpenLanguage,
  onOpenSearch,
  onOpenAuthor,
  onOpenInvite,
  onOpenGoogleIndex,
  googleIndexStatus,
  onListenSite,
  isSiteTranslating = false,
  theme = 'dark',
  onToggleTheme
}) => {
  const speech = useSpeechEngine();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGlobalListenClick = () => {
    if (speech.isPlaying) {
      speech.pauseSpeech();
      return;
    }
    if (speech.isPaused) {
      speech.resumeSpeech();
      return;
    }
    if (onListenSite) {
      onListenSite();
    } else {
      speech.speakEntireVisiblePage(lang, speech.rate);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onTabChange('articles')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                Φ
              </div>
              <div>
                <div className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  <span className="notranslate">Sci-Phi</span>
                  <span className="notranslate hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded font-normal">
                    {totalArticlesCount} Makale
                  </span>
                </div>
                <span className="block text-[10px] text-slate-400 font-medium truncate max-w-[160px] sm:max-w-[240px]">
                  {t('portal_subtitle', lang)}
                </span>
              </div>
            </button>
          </div>

          {/* Primary Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold bg-slate-900/70 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => onTabChange('articles')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'articles'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('nav_articles', lang)}</span>
            </button>
            <button
              onClick={() => onTabChange('simulators')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'simulators'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{t('nav_simulators', lang)}</span>
            </button>
            <button
              onClick={() => onTabChange('stats')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'stats'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t('nav_stats', lang)}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  currentTab === 'stats'
                    ? 'bg-slate-950/20 text-slate-950 font-black'
                    : 'bg-emerald-500/15 text-emerald-400'
                }`}
              >
                {totalNetReads.toLocaleString('tr-TR')}
              </span>
            </button>
            <button
              onClick={() => onTabChange('automation')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'automation'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{t('nav_automation', lang)}</span>
            </button>
          </nav>

          {/* Streamlined Action Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Hızlı Arama Butonu */}
            <button
              onClick={onOpenSearch}
              className="px-2.5 py-1.5 text-slate-300 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex items-center gap-1.5 text-xs cursor-pointer"
              title={t('search_placeholder', lang)}
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline text-slate-400">{lang === 'tr' ? 'Ara...' : 'Search...'}</span>
            </button>

            {/* 10 Dil Seçici & Anında Çeviri */}
            <div className="flex items-center bg-slate-900 border border-amber-500/40 rounded-xl px-2 py-1 text-xs">
              <button
                onClick={onOpenLanguage}
                className="flex items-center gap-1 text-amber-400 hover:text-amber-300 pr-1.5 font-bold cursor-pointer"
                title={lang === 'tr' ? '10 Dilde Görüntüle ve Çevir' : 'View & Translate in 10 Languages'}
              >
                {isSiteTranslating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                ) : (
                  <Languages className="w-3.5 h-3.5" />
                )}
              </button>
              <select
                value={lang}
                onChange={(e) => onSelectLang && onSelectLang(e.target.value)}
                className="notranslate bg-transparent text-slate-200 font-semibold text-xs focus:outline-none cursor-pointer border-l border-slate-800 pl-1.5"
                title="Hedef Doğal Dili Seçin (10 Dil)"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="notranslate bg-slate-950 text-slate-200">
                    {l.flag} {l.code.toUpperCase()} - {l.nativeName}
                  </option>
                ))}
              </select>
            </div>

            {/* Açık Akademik Kağıt (Gündüz) / Koyu (Gece) Tema Seçici */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                  theme === 'paper'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/40 hover:text-white'
                }`}
                title={
                  theme === 'paper'
                    ? lang === 'tr'
                      ? 'Koyu (Gece) Temaya Geç'
                      : 'Switch to Dark Theme'
                    : lang === 'tr'
                    ? 'Açık Akademik Kağıt (Gündüz) Temasına Geç'
                    : 'Switch to Academic Paper (Light) Theme'
                }
              >
                {theme === 'paper' ? (
                  <>
                    <Moon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{lang === 'tr' ? 'Gece' : 'Dark'}</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">{lang === 'tr' ? 'Kağıt' : 'Paper'}</span>
                  </>
                )}
              </button>
            )}

            {/* Sesli Dinleme Tuşu */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleGlobalListenClick}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                  speech.isPlaying
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : speech.isPaused
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-amber-400 border-amber-500/40 hover:bg-amber-500 hover:text-slate-950'
                }`}
                title={`${t('audio_listen', lang)} (${currentLangObj.nativeName})`}
              >
                {speech.isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : speech.isPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : speech.isPaused ? (
                  <Play className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                <span className="hidden md:inline">
                  {speech.isPlaying
                    ? t('audio_pause', lang)
                    : speech.isPaused
                    ? t('audio_resume', lang)
                    : t('listen_site_btn', lang)}
                </span>
              </button>

              {(speech.isPlaying || speech.isPaused) && (
                <button
                  onClick={() => speech.stopSpeech()}
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-rose-400 border border-rose-500/30 transition cursor-pointer"
                  title={t('stop_listen_btn', lang)}
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              )}
            </div>

            {/* Kompakt "Araçlar & İndeks" Açılır Menüsü */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setIsToolsOpen((prev) => !prev)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                title="Akademik İndeks, Yazar Profili ve Hızlı Araçlar"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{lang === 'tr' ? 'Araçlar & İndeks' : 'Tools & Index'}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {isToolsOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-3 space-y-2 z-50">
                  <div className="px-2 py-1 border-b border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{lang === 'tr' ? 'Hızlı Akademik Araçlar' : 'Quick Academic Tools'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">10 Dil • 10 İndeks</span>
                  </div>

                  {onOpenGoogleIndex && (
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onOpenGoogleIndex();
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>{lang === 'tr' ? 'IndexNow & Google (Tüm Tarayıcılar)' : 'IndexNow & Google (All Browsers)'}</span>
                      </span>
                      {googleIndexStatus && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-950/20">
                          {googleIndexStatus.indexedCount}/{googleIndexStatus.totalCount}
                        </span>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsToolsOpen(false);
                      onOpenAuthor();
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-amber-400" />
                      <span>{lang === 'tr' ? 'Yazar Profili & Kalkan' : 'Author Profile & Shield'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">Emre Pelit</span>
                  </button>

                  {onOpenInvite && (
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        onOpenInvite();
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-amber-300 transition flex items-center gap-2 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('invite_btn', lang)}</span>
                    </button>
                  )}

                  <div className="pt-1">
                    <PWAInstallButton lang={lang} />
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                    <a
                      href="mailto:emrepelit39@gmail.com"
                      className="notranslate flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 transition"
                    >
                      <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">emrepelit39@gmail.com</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/emrepelit109"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notranslate flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-sky-300 border border-slate-800 transition"
                    >
                      <Linkedin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">linkedin.com/in/emrepelit109</span>
                    </a>
                    <a
                      href="https://emrepelit7337.blogspot.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="notranslate flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-sans font-semibold transition"
                    >
                      <span>Blogger (299 Makale Senkron)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobil Sekme Çubuğu (Küçük Ekranlarda Hızlı Geçiş) */}
        <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar border-t border-slate-800/60 pt-2">
          <button
            onClick={() => onTabChange('articles')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'articles'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('nav_articles', lang)}</span>
          </button>
          <button
            onClick={() => onTabChange('simulators')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'simulators'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{t('nav_simulators', lang)}</span>
          </button>
          <button
            onClick={() => onTabChange('stats')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'stats'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>
              {t('nav_stats', lang)} ({totalNetReads.toLocaleString('tr-TR')})
            </span>
          </button>
          <button
            onClick={() => onTabChange('automation')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 ${
              currentTab === 'automation'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300 border border-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t('nav_automation', lang)}</span>
          </button>
        </div>
      </div>

      {/* Küresel Sesli Dinleme Kontrol Çubuğu (Aktif Dinleme Sırasında Gösterilir) */}
      {(speech.isPlaying || speech.isPaused || speech.isLoading) && (
        <div className="bg-slate-900/95 border-t border-amber-500/30 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] shrink-0">
                {currentLangObj.flag} {currentLangObj.nativeName} ({currentLangObj.speechCode})
              </span>
              <span className="text-slate-200 font-serif truncate">
                {speech.currentChunkText || speech.titleLabel || t('site_audio_playing', lang)}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[10px] font-mono">
                {[0.75, 1.0, 1.25, 1.5].map((r) => (
                  <button
                    key={r}
                    onClick={() => speech.setSpeechRate(r)}
                    className={`px-1.5 py-0.5 rounded transition ${
                      speech.rate === r
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}x
                  </button>
                ))}
              </div>
              <span className="text-[10px] font-mono text-amber-400 w-9 text-right">
                %{speech.progress}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};