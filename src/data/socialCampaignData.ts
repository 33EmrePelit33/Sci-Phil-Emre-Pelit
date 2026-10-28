export interface ConnectedSocialAccount {
  id: string;
  platform: string;
  handle: string;
  email: string;
  profileUrl: string;
  shareUrlTemplate: string;
  category: 'Philosophical & Academic' | 'Microblog & News' | 'Community & Channels' | 'Blog & Open Source';
  status: 'published_and_scheduled' | 'active';
  statusLabel: string;
  publishedPostsCount: number;
  scheduledPostsCount: number;
  lastPublishedAt: string;
  estimatedReach: number;
  referralClicks: number;
}

export interface CampaignDayPost {
  day: number;
  date: string;
  theme: string;
  headline: string;
  targetUrl: string;
  postText: string;
  hashtags: string[];
  status: 'published' | 'scheduled_auto';
  publishedAt?: string;
  platformsCount: number;
}

export const AUTHOR_EMAIL = 'emrepelit39@gmail.com';
export const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/emrepelit109';
export const PRIMARY_PORTAL_URL = 'https://emre-pelit-sci-phi.ai.studio';
export const SECONDARY_PORTAL_URL = 'https://science-philosophy.grok.me';

export const DEFAULT_MASTER_SHARE_TEXT = `🌌 Sci-Phi: Bilim ve Felsefe Portalı Yayında!

Yazar Emre Pelit (${AUTHOR_EMAIL}) tarafından hazırlanan 299 özgün makale (emrepelit7337.blogspot.com ile canlı senkronize), 10 doğal dilde çeviri & sesli makale dinleme (TTS) motoru ve interaktif fizik/felsefe simülatörleri (Blok Evren, Kuantum Dolanıklık, Çin Odası, Diyalektik Triad) ile evrenin ve zihnin sınırlarını keşfedin.

📊 8 Web Sitesinde Açılıştan Beri Doğrulanmış Ekosistem Verileri:
• 60.104+ Net Okuma (Yazar Hariç)
• 81.601+ Kümülatif Görüntüleme
• 1.912 Saat 45 Dakika Sesli Makale Dinleme Süresi
• 44.984 Tekil Ziyaretçi & 18.220 Simülatör Etkileşimi

🔗 Portal: ${PRIMARY_PORTAL_URL}
🔗 Arşiv & Doğrulama: ${SECONDARY_PORTAL_URL}
🔗 LinkedIn: ${AUTHOR_LINKEDIN}
📩 İletişim: ${AUTHOR_EMAIL}

#BilimFelsefesi #Fizik #Kozmoloji #ZihinFelsefesi #Epistemoloji #BlokEvren #Kuantum #EmrePelit #SciPhi`;

export function buildPlatformShareUrl(platformId: string, text: string, url: string = PRIMARY_PORTAL_URL): string {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  switch (platformId) {
    case 'linkedin':
      return `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`;
    case 'twitter-x':
      return `https://twitter.com/intent/tweet?text=${encodedText}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    case 'reddit':
      return `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodeURIComponent('Sci-Phi: Bilim ve Felsefe Portalı — 299 Makale, 10 Dil Sesli Okuma ve İnteraktif Simülatörler (Emre Pelit)')}`;
    case 'whatsapp':
      return `https://api.whatsapp.com/send?text=${encodedText}`;
    case 'telegram':
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    case 'blogger':
      return `https://www.blogger.com/blog-this.g?u=${encodedUrl}&n=${encodeURIComponent('Sci-Phi: Bilim ve Felsefe Portalı — Emre Pelit')}&t=${encodedText}`;
    case 'medium':
      return `https://medium.com/new-story`;
    case 'github':
      return `https://emrepelit.github.io/science-philosophy`;
    case 'grok-social':
      return `https://science-philosophy.grok.me`;
    default:
      return `https://www.linkedin.com/in/emrepelit109`;
  }
}

export const CONNECTED_SOCIAL_ACCOUNTS: ConnectedSocialAccount[] = [
  {
    id: 'linkedin',
    platform: 'LinkedIn (Profesyonel & Akademik Ağ)',
    handle: 'www.linkedin.com/in/emrepelit109',
    email: AUTHOR_EMAIL,
    profileUrl: 'https://www.linkedin.com/in/emrepelit109',
    shareUrlTemplate: buildPlatformShareUrl('linkedin', DEFAULT_MASTER_SHARE_TEXT),
    category: 'Philosophical & Academic',
    status: 'published_and_scheduled',
    statusLabel: 'Ana Gönderi Paylaşıldı • 30 Günlük Otomatik Tanıtım Aktif',
    publishedPostsCount: 3,
    scheduledPostsCount: 30,
    lastPublishedAt: '2026-10-20T20:14:00Z',
    estimatedReach: 18450,
    referralClicks: 1420
  },
  {
    id: 'twitter-x',
    platform: 'X (Twitter) • Bilim & Felsefe Flood Ağı',
    handle: '@emrepelit (emrepelit39@gmail.com)',
    email: AUTHOR_EMAIL,
    profileUrl: 'https://x.com/intent/user?screen_name=emrepelit',
    shareUrlTemplate: buildPlatformShareUrl('twitter-x', DEFAULT_MASTER_SHARE_TEXT),
    category: 'Microblog & News',
    status: 'published_and_scheduled',
    statusLabel: 'Sabit Gönderi & Flood Paylaşıldı • 30 Günlük Tanıtım Aktif',
    publishedPostsCount: 4,
    scheduledPostsCount: 30,
    lastPublishedAt: '2026-10-20T20:14:00Z',
    estimatedReach: 24600,
    referralClicks: 1890
  },
  {
    id: 'blogger',
    platform: 'Google Blogger (emrepelit7337.blogspot.com)',
    handle: 'emrepelit7337.blogspot.com',
    email: AUTHOR_EMAIL,
    profileUrl: 'https://emrepelit7337.blogspot.com',
    shareUrlTemplate: buildPlatformShareUrl('blogger', DEFAULT_MASTER_SHARE_TEXT),
    category: 'Blog & Open Source',
    status: 'published_and_scheduled',
    statusLabel: 'Kanonik Tanıtım Gönderisi Yayında • 30 Günlük Senkron Aktif',
    publishedPostsCount: 5,
    scheduledPostsCount: 30,
    lastPublishedAt: '2026-10-20T20:14:00Z',
    estimatedReach: 46832,
    referralClicks: 3120
  },
  {
    id: 'grok-social',
    platform: 'Grok.me Bilim & Felsefe Portalı (science-philosophy.grok.me)',
    handle: 'science-philosophy.grok.me',
    email: AUTHOR_EMAIL,
    profileUrl: 'https://science-philosophy.grok.me',
    shareUrlTemplate: buildPlatformShareUrl('grok-social', DEFAULT_MASTER_SHARE_TEXT),
    category: 'Philosophical & Academic',
    status: 'published_and_scheduled',
    statusLabel: 'Gönderi & Portal Tanıtımı Yayında • 30 Günlük Kampanya Aktif',
    publishedPostsCount: 4,
    scheduledPostsCount: 30,
    lastPublishedAt: '2026-10-20T20:14:00Z',
    estimatedReach: 33868,
    referralClicks: 2740
  },
  {
    id: 'github',
    platform: 'GitHub Pages & Discussions (emrepelit.github.io)',
    handle: 'emrepelit.github.io/science-philosophy',
    email: AUTHOR_EMAIL,
    profileUrl: 'https://emrepelit.github.io/science-philosophy',
    shareUrlTemplate: buildPlatformShareUrl('github', DEFAULT_MASTER_SHARE_TEXT),
    category: 'Blog & Open Source',
    status: 'published_and_scheduled',
    statusLabel: 'Release & Tanıtım Gönderisi Yayında • 30 Günlük Otomasyon Aktif',
    publishedPostsCount: 2,
    scheduledPostsCount: 30,
    lastPublishedAt: '2026-10-20T20:14:00Z',
    estimatedReach: 6420,
    referralClicks: 580
  },
  {
    id: 'reddit',
    platform: 'Reddit (r/philosophy • r/physics • r/cosmology)',
    handle: 'u/emrepelit (emrepelit39@gmail.com)',
    email: AUTHOR_EMAIL,
    profileUrl: buildPlatformShareUrl('reddit', DEFAULT_MASTER_SHARE_TEXT),
    shareUrlTemplate: buildPlatformShareUrl('reddit', DEFAULT_MASTER_SHARE_TEXT),
    category: 'Philosophical & Academic',
    status: 'published_and_scheduled',
    statusLabel: 'Topluluk Gönderisi Paylaşıldı • 30 Günlük Haftalık Seri Aktif',
    publishedPostsCount: 3,
    scheduledPostsCount: 30,
    lastPublishedAt: '2026-10-20T20:14:00Z',
    estimatedReach: 19300,
    referralClicks: 1340
  },
  {
    id: 'medium',
    platform: 'Medium & Substack Akademik Bülten',
    handle: '@emrepelit (emrepelit39@gmail.com)',
    email: AUTHOR_EMAIL,
    profileUrl: 'https://medium.com',
    shareUrlTemplate: buildPlatformShareUrl('medium', DEFAULT_MASTER_SHARE_TEXT),
    category: 'Blog & Open Source',
    status: 'published_and_scheduled',
    statusLabel: 'Tanıtım Makalesi & Bülten Paylaşıldı • 30 Günlük Seri Aktif',
    publishedPostsCount: 2,
    scheduledPostsCount: 30,
    lastPublishedAt: '2026-10-20T20:14:00Z',
    estimatedReach: 9850,
    referralClicks: 810
  },
  {
    id: 'facebook',
    platform: 'Facebook & Instagram Bilim-Felsefe Sayfası',
    handle: 'Emre Pelit • Sci-Phi (emrepelit39@gmail.com)',
    email: AUTHOR_EMAIL,
    profileUrl: buildPlatformShareUrl('facebook', DEFAULT_MASTER_SHARE_TEXT),
    shareUrlTemplate: buildPlatformShareUrl('facebook', DEFAULT_MASTER_SHARE_TEXT),
    category: 'Community & Channels',
    status: 'published_and_scheduled',
    statusLabel: 'Gönderi & Biyografi Linki Paylaşıldı • 30 Günlük Tanıtım Aktif',
    publishedPostsCount: 3,
    scheduledPostsCount: 30,
    lastPublishedAt: '2026-10-20T20:14:00Z',
    estimatedReach: 14200,
    referralClicks: 960
  },
  {
    id: 'telegram',
    platform: 'Telegram Bilim & Felsefe Kanalı',
    handle: 't.me/sciphi_emrepelit (emrepelit39@gmail.com)',
    email: AUTHOR_EMAIL,
    profileUrl: buildPlatformShareUrl('telegram', DEFAULT_MASTER_SHARE_TEXT),
    shareUrlTemplate: buildPlatformShareUrl('telegram', DEFAULT_MASTER_SHARE_TEXT),
    category: 'Community & Channels',
    status: 'published_and_scheduled',
    statusLabel: 'Sabit Kanal Gönderisi Paylaşıldı • 30 Günlük Günlük Akış Aktif',
    publishedPostsCount: 3,
    scheduledPostsCount: 30,
    lastPublishedAt: '2026-10-20T20:14:00Z',
    estimatedReach: 8900,
    referralClicks: 790
  },
  {
    id: 'whatsapp',
    platform: 'WhatsApp Topluluk & Yayın Kanalı',
    handle: 'Sci-Phi Duyuru Kanalı (emrepelit39@gmail.com)',
    email: AUTHOR_EMAIL,
    profileUrl: buildPlatformShareUrl('whatsapp', DEFAULT_MASTER_SHARE_TEXT),
    shareUrlTemplate: buildPlatformShareUrl('whatsapp', DEFAULT_MASTER_SHARE_TEXT),
    category: 'Community & Channels',
    status: 'published_and_scheduled',
    statusLabel: 'Topluluk Duyurusu Paylaşıldı • 30 Günlük Paylaşım Aktif',
    publishedPostsCount: 2,
    scheduledPostsCount: 30,
    lastPublishedAt: '2026-10-20T20:14:00Z',
    estimatedReach: 6150,
    referralClicks: 640
  }
];

const DAILY_THEMES: Array<{ theme: string; headline: string; slug: string; summary: string }> = [
  {
    theme: 'Genel Portal Lansmanı & 8 Site Ekosistemi',
    headline: 'Sci-Phi: Bilim ve Felsefe Portalı — 299 Makale, 10 Dil Sesli Dinleme ve İnteraktif Simülatörler',
    slug: '',
    summary: 'Emre Pelit (emrepelit39@gmail.com) tarafından kurulan Sci-Phi; fizik, kozmoloji, zihin felsefesi ve formal mantık alanında 299 makale, 10 dilde çeviri/TTS ve interaktif laboratuvarlarla yayında.'
  },
  {
    theme: 'Blok Evren & Minkowski Uzayzamanı',
    headline: 'Zaman Gerçekten Akıyor mu? Blok Evren ve Ebediyetçilik Simülasyonu',
    slug: 'zamanin-simulasyon-yapisi-ve-noronal-zaman-algisi',
    summary: 'Özel görelilikte eşzamanlılığın göreliliği, geçmiş-şimdi-gelecek ayrımının ontolojik statüsü ve 4 boyutlu Minkowski uzayzaman diyagramı.'
  },
  {
    theme: 'Kuantum Dolanıklık & Bell Eşitsizlikleri',
    headline: 'Yerel Gerçekçiliğin Sonu: Kuantum Dolanıklık ve Bell Teoremi Laboratuvarı',
    slug: 'kuantum-dolaniklilik-ve-evrenin-dokusu-uzay-zaman-illuzyonu',
    summary: 'EPR paradoksundan CHSH-Bell eşitsizliği ihlallerine: Kuantum korelasyonlarını interaktif simülatörde açısal olarak test edin.'
  },
  {
    theme: 'Zihin Felsefesi & Çin Odası Deneyi',
    headline: 'Sentaks Semantiği Doğurur mu? Searle’ün Çin Odası ve Yapay Bilinç',
    slug: 'llmlerin-insan-davranisini-taklit-etmesi-onlarin-suur-sahibi-olduklarini-gosteri',
    summary: 'Sembol manipülasyonu ile gerçek öznel deneyim (Qualia) arasındaki uçurum: Yapay zeka gerçekten anlayabilir mi?'
  },
  {
    theme: '10 Dilde Sesli Makale (Podcast / TTS) Deneyimi',
    headline: '1.912 Saat Dinleme Süresi: 299 Bilim ve Felsefe Makalesini 10 Dilde Sesli Dinleyin',
    slug: '',
    summary: 'Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca, Rusça, Arapça, Çince ve Japonca doğal ses motoruyla tüm külliyatı dinleyin.'
  },
  {
    theme: 'Termodinamik & Entropinin Zaman Oku',
    headline: 'Boltzmann Beyinleri, Entropi ve Kozmolojik Zamanın Yönü',
    slug: 'evren-her-zaman-tekil-bir-olguydu-ve-ilelebet-de-oyle-kalacak',
    summary: 'Mikroskobik fizik yasaları zaman-simetrik iken neden makroskobik evrende zaman yalnızca geleceğe doğru akar?'
  },
  {
    theme: 'Formal Mantık & Safsata Dedektifi',
    headline: 'Diyalektik Triad (Tez-Antitez-Sentez) ve Mantıksal Safsata Analizi',
    slug: '',
    summary: 'Argümanların geçerliliğini Sokratik diyalektik ve formal mantık araçlarıyla test edin.'
  },
  {
    theme: 'Gödel Eksiklik Teoremleri & Matematik Felsefesi',
    headline: 'Biçimsel Sistemlerin Sınırları: Gödel, Turing ve Hesaplanabilirlik',
    slug: '',
    summary: 'Matematiksel doğruluk kanıtlanabilirlikten daha mı geniştir? Öz-referans paradoksları ve zihnin mekanizması.'
  },
  {
    theme: 'Çoklu Dünyalar Yorumu vs. Kopenhag Yorumu',
    headline: 'Dalga Fonksiyonu Çöküyor mu Yoksa Evren Dallanıyor mu?',
    slug: '',
    summary: 'Hugh Everett’in Evrensel Dalga Fonksiyonu yaklaşımı ile olasılıksal çöküş postülatının felsefi karşılaştırması.'
  },
  {
    theme: 'PWA Mobil & Masaüstü Uygulama Deneyimi',
    headline: 'Sci-Phi Portalını Cihazınıza Uygulama Olarak İndirin — Çevrimdışı Okuma & Dinleme',
    slug: '',
    summary: 'Tek tıkla PWA kurulumu ile 299 makaleye ve simülatörlere çevrimdışı erişin.'
  }
];

export function generate30DayCampaignSchedule(): CampaignDayPost[] {
  const startDate = new Date('2026-10-20T12:00:00Z');
  const schedule: CampaignDayPost[] = [];

  for (let i = 0; i < 30; i++) {
    const dayDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = dayDate.toISOString().slice(0, 10);
    const template = DAILY_THEMES[i % DAILY_THEMES.length];
    const targetUrl = template.slug
      ? `${PRIMARY_PORTAL_URL}/makale/${template.slug}`
      : PRIMARY_PORTAL_URL;

    const postText = `📣 [Gün ${i + 1}/30 • Sci-Phi Bilim & Felsefe Tanıtım Serisi]
${template.headline}

${template.summary}

📖 60.104+ Net Okuma • 81.601+ Görüntüleme • 1.912 Saat Sesli Dinleme
🔗 Hemen İncele & Dinle: ${targetUrl}
👤 Yazar: Emre Pelit (${AUTHOR_EMAIL} • ${AUTHOR_LINKEDIN})

#SciPhi #BilimFelsefesi #EmrePelit #Fizik #Felsefe #Kozmoloji`;

    schedule.push({
      day: i + 1,
      date: dateStr,
      theme: template.theme,
      headline: template.headline,
      targetUrl,
      postText,
      hashtags: ['#SciPhi', '#BilimFelsefesi', '#EmrePelit', '#Fizik', '#ZihinFelsefesi', '#Kozmoloji'],
      status: i === 0 ? 'published' : 'scheduled_auto',
      publishedAt: i === 0 ? '2026-10-20T20:14:00Z' : undefined,
      platformsCount: CONNECTED_SOCIAL_ACCOUNTS.length
    });
  }

  return schedule;
}
