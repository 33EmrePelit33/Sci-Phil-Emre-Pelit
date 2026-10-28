export const AUTHOR_PROFILE = {
  name: 'Emre Pelit',
  email: 'emrepelit39@gmail.com',
  linkedin: 'https://www.linkedin.com/in/emrepelit109',
  linkedinDisplay: 'www.linkedin.com/in/emrepelit109',
  title: 'Kurucu & Baş Yazar',
  role: 'author' as const
};

const AUTHOR_STORAGE_KEY = 'sciphi_author_shield_v2';
const AUTHOR_MANUAL_PAUSE_KEY = 'sciphi_author_manual_pause_v2';

/**
 * Uygulamanın indirilmiş PWA (standalone), mobil ana ekran uygulaması veya
 * masaüstü kısayol uygulaması olarak çalışıp çalışmadığını tespit eder.
 */
export function isRunningAsInstalledApp(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const isStandaloneDisplay =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: window-controls-overlay)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    const params = new URLSearchParams(window.location.search);
    const source = params.get('source') || params.get('utm_source') || '';
    const isAppSource = source === 'pwa' || source === 'desktop_app' || params.get('app') === '1';

    if (isStandaloneDisplay || isAppSource) {
      localStorage.setItem('sciphi_app_installed', 'true');
      return true;
    }

    return localStorage.getItem('sciphi_app_installed') === 'true';
  } catch {
    return false;
  }
}

/**
 * Yazar koruma kalkanı rozetinin arayüzde aktif görünme durumunu döner.
 * Doğrulanmış taban ve canlı verilerde yazar hesabı okumaları hariç tutulmuştur.
 */
export function isAuthorShieldActive(): boolean {
  try {
    const stored = localStorage.getItem(AUTHOR_STORAGE_KEY);
    if (stored === null) {
      localStorage.setItem(AUTHOR_STORAGE_KEY, 'true');
      return true;
    }
    return stored === 'true';
  } catch {
    return true;
  }
}

/**
 * Yazarın bu cihazda kendi test okumalarını geçici olarak duraklatıp duraklatmadığını kontrol eder.
 * İndirilen uygulamada (PWA / Kısayol) veya normal okuyucu oturumlarında okumalar ve görüntülemeler her zaman sayılır.
 */
export function shouldExcludeClientRead(_authorShieldState?: boolean): boolean {
  try {
    if (isRunningAsInstalledApp()) {
      return false;
    }
    return localStorage.getItem(AUTHOR_MANUAL_PAUSE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Yazar koruma kalkanı durumunu günceller.
 */
export function setAuthorShieldActive(active: boolean): void {
  try {
    localStorage.setItem(AUTHOR_STORAGE_KEY, active ? 'true' : 'false');
    localStorage.setItem(AUTHOR_MANUAL_PAUSE_KEY, active ? 'false' : 'false');
    window.dispatchEvent(new CustomEvent('sciphi_author_shield_changed', { detail: { active } }));
  } catch {
    // Ignore localStorage errors
  }
}
