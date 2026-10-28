import React, { useState } from 'react';
import { Download, Smartphone, Monitor, CheckCircle2, X, Share, Activity } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  lang?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ lang = 'tr' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [downloadConfirmed, setDownloadConfirmed] = useState(false);

  const label = lang === 'tr' ? 'Uygulamayı İndir' : 'Download App';

  const emitAppDownloadTracking = (modeLabel: string) => {
    try {
      localStorage.setItem('sciphi_app_installed', 'true');
      window.dispatchEvent(
        new CustomEvent('sciphi:pwa-event', {
          detail: {
            type: 'pwa_app_download',
            details: `Sci-Phi Uygulaması İndirildi (${modeLabel}) — Okunma ve Görüntülenme Sayacı Aktif`
          }
        })
      );
    } catch {
      // ignore
    }
  };

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  const handleDownloadShortcut = () => {
    const originUrl = window.location.origin || 'https://sci-phi.ai.studio';
    const appUrl = `${originUrl}/?source=desktop_app`;
    const shortcutContent = `[InternetShortcut]\nURL=${appUrl}\nIconIndex=0\n`;
    const blob = new Blob([shortcutContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sci-Phi Bilim ve Felsefe Portali.url';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    emitAppDownloadTracking('Masaüstü Uygulama Kısayolu');
    setDownloadConfirmed(true);
    setTimeout(() => setDownloadConfirmed(false), 4000);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer shrink-0"
        title={
          lang === 'tr'
            ? 'Sci-Phi Uygulamasını Cihazınıza İndirin / Kurun (Uygulama İçi Okuma ve Görüntülemeler Canlı Sayılır)'
            : 'Download / Install Sci-Phi App to Your Device (In-App Reads & Views Counted Live)'
        }
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>{label}</span>
        {isInstalled && (
          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" title="Uygulama Modu Aktif" />
        )}
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-slate-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
                  Φ
                </div>
                <div>
                  <h3 className="text-base font-black text-white">
                    {lang === 'tr' ? 'Sci-Phi Uygulamasını İndir' : 'Install Sci-Phi App'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {lang === 'tr'
                      ? 'Masaüstü ve Mobil Cihazlar İçin Hızlı Kurulum'
                      : 'Fast Installation for Desktop & Mobile Devices'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Canlı Analitik & Okuma Sayacı Güvence Rozeti */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5 text-xs">
              <Activity className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="text-slate-200 leading-relaxed">
                <strong className="text-emerald-300 block">
                  {lang === 'tr'
                    ? 'Uygulama İçi Okunma & Görüntülenme Senkronizasyonu Aktif'
                    : 'In-App Read & View Synchronization Active'}
                </strong>
                <span className="text-[11px] text-slate-300">
                  {lang === 'tr'
                    ? 'Siteyi uygulama olarak indirdiğinizde de yaptığınız tüm makale okumaları ve sayfa görüntülemeleri 8 site birleşik sayacına (çevrimdışı okumalar dahil) anında dahil edilir.'
                    : 'All article reads and page views inside the downloaded app (including offline reads synced upon reconnect) are automatically counted in the 8-site unified analytics.'}
                </span>
              </div>
            </div>

            {isInstallable && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    {lang === 'tr'
                      ? 'Tarayıcınız doğrudan uygulama kurulumunu destekliyor!'
                      : 'Your browser supports direct app installation!'}
                  </span>
                </div>
                <button
                  onClick={async () => {
                    const ok = await install();
                    if (ok) setShowGuideModal(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {lang === 'tr' ? 'Tek Tıkla Uygulamayı Kur (PWA)' : 'One-Click Install App (PWA)'}
                  </span>
                </button>
              </div>
            )}

            <div className="space-y-3 text-xs">
              {isIOS ? (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Smartphone className="w-4 h-4" />
                    <span>
                      {lang === 'tr' ? 'iPhone / iPad (Safari) Kurulumu:' : 'iPhone / iPad (Safari) Installation:'}
                    </span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
                    <li>
                      {lang === 'tr' ? (
                        <>
                          Safari araç çubuğundaki <strong>Paylaş</strong>{' '}
                          <Share className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" /> düğmesine dokunun.
                        </>
                      ) : (
                        <>
                          Tap the <strong>Share</strong>{' '}
                          <Share className="w-3.5 h-3.5 inline text-amber-400 mx-0.5" /> button in Safari toolbar.
                        </>
                      )}
                    </li>
                    <li>
                      {lang === 'tr' ? (
                        <>
                          Menüyü aşağı kaydırıp <strong>"Ana Ekrana Ekle" (Add to Home Screen)</strong> seçeneğine dokunun.
                        </>
                      ) : (
                        <>
                          Scroll down and tap <strong>"Add to Home Screen"</strong>.
                        </>
                      )}
                    </li>
                  </ol>
                </div>
              ) : (
                <>
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Monitor className="w-4 h-4" />
                      <span>
                        {lang === 'tr'
                          ? 'Bilgisayar (Chrome / Edge / Brave):'
                          : 'Desktop (Chrome / Edge / Brave):'}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {lang === 'tr'
                        ? 'Adres çubuğunun sağ ucundaki "Sci-Phi Uygulamasını Yükle" simgesine tıklayarak veya tarayıcı menüsünden "Uygulamayı Yükle" seçeneğiyle doğrudan masaüstünüze kurabilirsiniz.'
                        : 'Click the "Install Sci-Phi" icon on the right side of the address bar or choose "Install App" from the browser menu.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-sky-400 font-bold">
                      <Smartphone className="w-4 h-4" />
                      <span>
                        {lang === 'tr' ? 'Android / Mobil Tarayıcı:' : 'Android / Mobile Browser:'}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      {lang === 'tr'
                        ? 'Tarayıcı menüsünden (⋮) "Uygulamayı Yükle" veya "Ana Ekrana Ekle" seçeneğine dokunarak tam ekran uygulama olarak kullanabilirsiniz.'
                        : 'Tap the browser menu (⋮) and select "Install App" or "Add to Home Screen".'}
                    </p>
                  </div>
                </>
              )}

              <div className="pt-1 space-y-2">
                <button
                  onClick={handleDownloadShortcut}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {lang === 'tr'
                      ? 'Uygulama Masaüstü Kısayolunu İndir (.url)'
                      : 'Download Desktop App Shortcut (.url)'}
                  </span>
                </button>
                {downloadConfirmed && (
                  <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] text-center font-semibold">
                    {lang === 'tr'
                      ? '✓ Uygulama kısayolu indirildi ve okunma/görüntülenme sayacına kaydedildi!'
                      : '✓ App shortcut downloaded and counted in live reads/views!'}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer"
              >
                {lang === 'tr' ? 'Kapat' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
