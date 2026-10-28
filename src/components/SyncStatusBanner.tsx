import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldCheck, Activity, Sparkles, Mail, Linkedin, ChevronDown, ChevronUp } from 'lucide-react';
import { SCI_PHI_BASELINE_STATS } from '../data/baselineStats';
import { t } from '../utils/translations';

interface SyncStatusBannerProps {
  lang?: string;
  totalNetReads?: number;
  totalPageViews?: number;
  baselineReads?: number;
  baselineViews?: number;
  liveAddedReads?: number;
  liveAddedViews?: number;
  activeVisitors?: number;
  bloggerPostsCount?: number;
  totalArticlesCount?: number;
  latestEventText?: string;
  onSyncRefresh?: () => Promise<void> | void;
}

export const SyncStatusBanner: React.FC<SyncStatusBannerProps> = ({
  lang = 'tr',
  totalNetReads = SCI_PHI_BASELINE_STATS.total_net_reads_baseline,
  totalPageViews = SCI_PHI_BASELINE_STATS.total_views_baseline,
  baselineReads = 66178,
  baselineViews = 91287,
  liveAddedReads,
  liveAddedViews,
  activeVisitors = 34,
  bloggerPostsCount = 299,
  totalArticlesCount = 299,
  latestEventText,
  onSyncRefresh
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSync, setLastSync] = useState<string>('Canlı');
  const [pulseHighlight, setPulseHighlight] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(true);

  const computedLiveReads =
    liveAddedReads !== undefined ? liveAddedReads : Math.max(0, totalNetReads - baselineReads);
  const computedLiveViews =
    liveAddedViews !== undefined ? liveAddedViews : Math.max(0, totalPageViews - baselineViews);

  useEffect(() => {
    setPulseHighlight(true);
    const now = new Date();
    setLastSync(
      `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    );
    const timer = setTimeout(() => setPulseHighlight(false), 1200);
    return () => clearTimeout(timer);
  }, [totalNetReads, totalPageViews, bloggerPostsCount, totalArticlesCount]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    if (onSyncRefresh) {
      await onSyncRefresh();
    }
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      setLastSync(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      );
    }, 400);
  };

  return (
    <div className="bg-slate-900/75 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Sol: Kompakt Canlı Özet */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{t('sync_active', lang)}</span>
          </div>

          <span className="text-slate-700 hidden sm:inline">•</span>

          <div className="flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              emre-pelit-sci-phi.ai.studio & sci-phil.ai.studio Dahil Kümülatif Toplam:{' '}
              <strong
                className={`font-mono transition-colors duration-300 ${
                  pulseHighlight ? 'text-emerald-300' : 'text-amber-400'
                }`}
              >
                {totalNetReads.toLocaleString('tr-TR')}
              </strong>{' '}
              {t('net_reads_unit', lang)}
            </span>
          </div>

          <span className="text-slate-700 hidden md:inline">•</span>

          <div className="hidden md:flex items-center gap-1.5 text-[11px]">
            <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>
              <strong className="font-mono text-sky-400">
                {totalPageViews.toLocaleString('tr-TR')}
              </strong>{' '}
              {t('page_views_unit', lang)}
            </span>
          </div>

          <span className="text-slate-700 hidden lg:inline">•</span>

          <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            <span>emre-pelit-sci-phi.ai.studio (301 Ana Hub • +4.650 Okunma / +7.630 Gör.)</span>
          </span>

          <span className="text-slate-700 hidden xl:inline">•</span>

          <a
            href="https://emrepelit7337.blogspot.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 hover:underline"
          >
            <span>Blogger 1:1 ({bloggerPostsCount}/{totalArticlesCount})</span>
          </a>
        </div>

        {/* Sağ: Aktif Okuyucu, Yenile ve Detay Aç/Kapat */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{activeVisitors} Aktif</span>
          </span>

          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="px-2 py-0.5 rounded bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-[10px] font-semibold text-slate-300 flex items-center gap-1 transition cursor-pointer"
          >
            <span>{showDetails ? (lang === 'tr' ? 'Özeti Küçült' : 'Hide Details') : (lang === 'tr' ? 'Canlı Detaylar' : 'Live Details')}</span>
            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="p-1 text-slate-400 hover:text-amber-400 rounded transition cursor-pointer"
            title="Şimdi Senkronize Et"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Genişletilebilir Detay Çekmecesi */}
      {showDetails && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono">
              8 Site Taban: {baselineReads.toLocaleString('tr-TR')} + Canlı: +{computedLiveReads.toLocaleString('tr-TR')} ={' '}
              <strong className="text-amber-400">{totalNetReads.toLocaleString('tr-TR')} Net Okunma</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono">
              8 Site Taban: {baselineViews.toLocaleString('tr-TR')} + Canlı: +{computedLiveViews.toLocaleString('tr-TR')} ={' '}
              <strong className="text-sky-400">{totalPageViews.toLocaleString('tr-TR')} Görüntüleme</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 font-mono text-emerald-300">
              emre-pelit-sci-phi.ai.studio: <strong>3.410 Taban + Canlı (4.650+ Okunma / 7.630+ Gör. / 156 sa Dinleme)</strong> Kümülatif Toplama Eklendi
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 font-mono text-amber-300">
              sci-phil.ai.studio: <strong>4.820 Taban + Canlı (6.500+ Okunma / 10.530+ Gör.)</strong> Toplama Dahil
            </span>
            {latestEventText && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono truncate max-w-xs">
                <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">{latestEventText}</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <a
              href="mailto:emrepelit39@gmail.com"
              className="notranslate inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
            >
              <Mail className="w-3 h-3 text-amber-400" />
              <span>emrepelit39@gmail.com</span>
            </a>
            <a
              href="https://www.linkedin.com/in/emrepelit109"
              target="_blank"
              rel="noopener noreferrer"
              className="notranslate inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 hover:bg-sky-500/20"
            >
              <Linkedin className="w-3 h-3 text-sky-400" />
              <span>linkedin.com/in/emrepelit109</span>
            </a>
            <span className="text-slate-400">
              {t('last_sync_label', lang)}: <strong className="text-slate-200">{lastSync}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};