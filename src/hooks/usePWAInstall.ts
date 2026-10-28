import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://');

      if (isStandalone) {
        try {
          localStorage.setItem('sciphi_app_installed', 'true');
        } catch {
          // ignore
        }
      }
      setIsInstalled(isStandalone);
    };

    checkStandalone();

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem('sciphi_app_installed', 'true');
        window.dispatchEvent(
          new CustomEvent('sciphi:pwa-event', {
            detail: {
              type: 'pwa_app_installed',
              details: 'Sci-Phi Uygulaması Cihaza Kuruldu (Canlı Okunma & Görüntüleme Sayacı Aktif)'
            }
          })
        );
      } catch {
        // ignore
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        try {
          localStorage.setItem('sciphi_app_installed', 'true');
          window.dispatchEvent(
            new CustomEvent('sciphi:pwa-event', {
              detail: {
                type: 'pwa_app_installed',
                details: 'Sci-Phi PWA Uygulaması Kuruldu (+1 Okunma & Görüntüleme Senkronize)'
              }
            })
          );
        } catch {
          // ignore
        }
        return true;
      }
    } catch {
      // ignore prompt errors
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install
  };
}
