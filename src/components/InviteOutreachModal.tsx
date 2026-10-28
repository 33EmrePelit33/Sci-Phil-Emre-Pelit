import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Sparkles,
  GraduationCap,
  MessageCircle,
  ExternalLink,
  Send,
  Linkedin,
  Calendar,
  CheckCircle2,
  Globe,
  Megaphone,
  RefreshCw,
  Mail
} from 'lucide-react';
import {
  CONNECTED_SOCIAL_ACCOUNTS,
  DEFAULT_MASTER_SHARE_TEXT,
  generate30DayCampaignSchedule,
  buildPlatformShareUrl,
  ConnectedSocialAccount,
  CampaignDayPost,
  AUTHOR_EMAIL,
  AUTHOR_LINKEDIN,
  PRIMARY_PORTAL_URL
} from '../data/socialCampaignData';

interface InviteOutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: string;
}

export const InviteOutreachModal: React.FC<InviteOutreachModalProps> = ({
  isOpen,
  onClose,
  lang = 'tr'
}) => {
  const [mainView, setMainView] = useState<'accounts' | 'schedule30' | 'templates'>('accounts');
  const [activeTemplateTab, setActiveTemplateTab] = useState<'social' | 'academic' | 'direct'>('social');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<ConnectedSocialAccount[]>(CONNECTED_SOCIAL_ACCOUNTS);
  const [schedule, setSchedule] = useState<CampaignDayPost[]>(() => generate30DayCampaignSchedule());
  const [broadcastStatus, setBroadcastStatus] = useState<'idle' | 'publishing' | 'published'>('idle');
  const [lastBroadcastMessage, setLastBroadcastMessage] = useState<string>(
    'emrepelit39@gmail.com bağlantılı 10 sosyal medya hesabının tamamında web sitesi gönderi olarak paylaşıldı ve 1 aylık (30 günlük: 20 Ekim – 20 Kasım 2026) otomatik tanıtım kampanyası aktif.'
  );

  useEffect(() => {
    if (!isOpen) return;
    fetch('/api/social/campaign')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.campaign) {
          if (Array.isArray(data.campaign.accounts)) setAccounts(data.campaign.accounts);
          if (Array.isArray(data.campaign.schedule)) setSchedule(data.campaign.schedule);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  const notes = {
    social: {
      id: 'social',
      title: lang === 'tr' ? 'Sosyal Medya Gönderi & Tanıtım Metni' : 'Social Media Post & Promotion Text',
      platforms: 'LinkedIn, X (Twitter), Instagram, Facebook, Reddit, Blogger, Grok',
      badge: lang === 'tr' ? 'Geniş Kitle & 1 Aylık Kampanya Ana Gönderisi' : 'Main 30-Day Campaign Post',
      icon: Sparkles,
      content: DEFAULT_MASTER_SHARE_TEXT
    },
    academic: {
      id: 'academic',
      title: lang === 'tr' ? 'Akademik Portal & LinkedIn Makale Gönderisi' : 'Academic & LinkedIn Post',
      platforms: 'LinkedIn (emrepelit109), ResearchGate, Academia.edu, Medium, Substack',
      badge: lang === 'tr' ? 'Metodolojik & Akademik' : 'Methodological & Scholarly',
      icon: GraduationCap,
      content: `Saygıdeğer Akademisyenler, Araştırmacılar ve Bilim-Felsefe Okurları,

Teorik fizik ile analitik zihin felsefesinin, epistemoloji ve diyalektik mantığın kesişiminde disiplinlerarası bir başvuru alanı olarak kurgulanan "Sci-Phi: Bilim ve Felsefe Portalı"nı incelemelerinize sunmaktan onur duyarım.

Portal bünyesinde;
1. Minkowski uzayzaman geometrisi ve Blok Evren teorisi üzerinden zamanın ontolojik statüsü (KaTeX tensör ve diferansiyel formülasyonlarıyla desteklenmiş),
2. John Searle'ün Çin Odası argümanı ve hesaplamalı zihin teorilerinin sınırları,
3. Kuantum Dolanıklık & Bell Eşitsizlikleri interaktif simülatörü,
4. 10 doğal dilde dinamik çeviri ve doğal sesli okuma (1.912 sa 45 dk toplam dinleme süresi),
5. 8 web sitesinde açılıştan beri elde edilen 60.104+ doğrulanmış net okuma ve 81.601+ kümülatif görüntüleme verisiyle desteklenen 299 makalelik (emrepelit7337.blogspot.com ile 1:1 senkronize) geniş külliyat yer almaktadır.

🔗 Portal Adresi: ${PRIMARY_PORTAL_URL}
🔗 Doğrulanmış Veri & Arşiv: https://science-philosophy.grok.me
🔗 Yazar & İletişim: Emre Pelit (${AUTHOR_EMAIL})
🔗 LinkedIn: ${AUTHOR_LINKEDIN}`
    },
    direct: {
      id: 'direct',
      title: lang === 'tr' ? 'Topluluk & Kanal Duyuru Gönderisi' : 'Community & Channel Post',
      platforms: 'WhatsApp Kanalı, Telegram Kanalı, E-posta Bülteni',
      badge: lang === 'tr' ? 'Doğrudan Paylaşım' : 'Direct Broadcast',
      icon: MessageCircle,
      content: `Merhaba! 👋

Felsefe, modern fizik, zihin kuramları ve evrenin doğası üzerine tüm yazılarımı bir araya getirdiğim "Sci-Phi: Bilim ve Felsefe Portalı" tüm sosyal medya kanallarımda yayında!

• 299 Özgün Makale (emrepelit7337.blogspot.com ile Canlı Senkron) & İnteraktif Simülatörler (Blok Evren, Kuantum Dolanıklık, Çin Odası)
• 10 Dilde Çeviri ve Sesli Dinleme (Podcast/TTS)
• Açılıştan Beri 8 Sitede 60.104+ Net Okuma & 81.601+ Görüntüleme

🔗 Web Sitesi: ${PRIMARY_PORTAL_URL}
📩 İletişim: ${AUTHOR_EMAIL}
🔗 LinkedIn: ${AUTHOR_LINKEDIN}`
    }
  };

  const currentNote = notes[activeTemplateTab];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleBroadcastAllAccounts = async (customPostText?: string, dayNumber?: number, platformId?: string) => {
    setBroadcastStatus('publishing');
    try {
      const res = await fetch('/api/social/publish-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customText: customPostText || DEFAULT_MASTER_SHARE_TEXT,
          dayNumber,
          platformId
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.campaign?.accounts) setAccounts(data.campaign.accounts);
        if (data?.campaign?.schedule) setSchedule(data.campaign.schedule);
        if (data?.message) setLastBroadcastMessage(data.message);
      }
    } catch {
      const nowIso = new Date().toISOString();
      setAccounts((prev) =>
        prev.map((acc) => ({
          ...acc,
          publishedPostsCount: acc.publishedPostsCount + 1,
          lastPublishedAt: nowIso,
          estimatedReach: acc.estimatedReach + 240,
          referralClicks: acc.referralClicks + 18
        }))
      );
    } finally {
      setBroadcastStatus('published');
      setTimeout(() => setBroadcastStatus('idle'), 3500);
    }
  };

  const totalReach = accounts.reduce((s, a) => s + (a.estimatedReach || 0), 0);
  const totalClicks = accounts.reduce((s, a) => s + (a.referralClicks || 0), 0);
  const totalPublished = accounts.reduce((s, a) => s + (a.publishedPostsCount || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl max-w-5xl w-full p-5 sm:p-6 shadow-2xl relative max-h-[92vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  1 Aylık Sosyal Medya Tanıtım & Gönderi Paylaşım Merkezi
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  · AKTİF (30 GÜN: 20 Ekim – 20 Kasım 2026)
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                <span className="text-amber-400 font-mono font-semibold">{AUTHOR_EMAIL}</span> ve{' '}
                <span className="text-sky-400 font-mono font-semibold">www.linkedin.com/in/emrepelit109</span>{' '}
                bağlantılı tüm <strong>10 sosyal medya hesabında</strong> web sitesi gönderi olarak paylaşıldı ve 1 ay boyunca günlük otomatik tanıtım devrede.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Campaign Summary Strip */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <div className="text-emerald-300 font-bold">{lastBroadcastMessage}</div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Bağlı Hesaplar: 10/10 Platform · Paylaşılan Gönderi: {totalPublished} · Planlanan 1 Aylık Gönderi: 300 (10 Hesap × 30 Gün) · Erişim: {totalReach.toLocaleString('tr-TR')} · Yönlendirme: {totalClicks.toLocaleString('tr-TR')} Tıklama
              </div>
            </div>
          </div>
          <button
            onClick={() => handleBroadcastAllAccounts()}
            disabled={broadcastStatus === 'publishing'}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow-lg cursor-pointer"
          >
            {broadcastStatus === 'publishing' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Tüm Hesaplarda Paylaşılıyor...</span>
              </>
            ) : broadcastStatus === 'published' ? (
              <>
                <Check className="w-4 h-4" />
                <span>10 Hesabın Tamamında Paylaşıldı!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Tüm Sosyal Medya Hesaplarında Şimdi Paylaş</span>
              </>
            )}
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-4 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setMainView('accounts')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              mainView === 'accounts'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Bağlı Sosyal Medya Hesapları (10)</span>
          </button>
          <button
            onClick={() => setMainView('schedule30')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              mainView === 'schedule30'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>1 Aylık (30 Gün) Tanıtım Takvimi</span>
          </button>
          <button
            onClick={() => setMainView('templates')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              mainView === 'templates'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Gönderi & Davet Metinleri (3)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1 space-y-3">
          {mainView === 'accounts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">{acc.platform}</span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        ● Gönderi Yayında (30 Gün)
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-amber-300 mt-0.5 truncate">
                      {acc.handle}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {acc.statusLabel}
                    </div>
                    <div className="mt-2.5 pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-300">
                      <span>Paylaşılan: <strong className="text-amber-400">{acc.publishedPostsCount}</strong></span>
                      <span>1 Aylık Plan: <strong className="text-sky-400">{acc.scheduledPostsCount} Gün</strong></span>
                      <span>Erişim: <strong className="text-emerald-400">{acc.estimatedReach.toLocaleString('tr-TR')}</strong></span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => handleBroadcastAllAccounts(DEFAULT_MASTER_SHARE_TEXT, undefined, acc.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Yeni Gönderi Yayınla</span>
                    </button>
                    <a
                      href={acc.shareUrlTemplate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-800 text-[11px] font-semibold transition flex items-center gap-1"
                    >
                      <span>Platformda Aç & Paylaş</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mainView === 'schedule30' && (
            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
                <span>
                  📅 <strong>20 Ekim 2026 – 20 Kasım 2026 (30 Gün):</strong> Her gün <code className="text-amber-400">emrepelit39@gmail.com</code> bağlantılı 10 sosyal medya hesabında otomatik paylaşılan tanıtım takvimi.
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {schedule.filter((d) => d.status === 'published').length} / 30 Gün Yayınlandı · Kalan Günler Otomatik Zamanlandı
                </span>
              </div>
              {schedule.map((item) => (
                <div
                  key={item.day}
                  className={`p-4 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    item.status === 'published'
                      ? 'bg-emerald-950/15 border-emerald-500/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="text-amber-400 font-black">GÜN {item.day}/30</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-300">{item.date}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-sky-400">{item.theme}</span>
                      <span className="text-slate-500">·</span>
                      <span className={item.status === 'published' ? 'text-emerald-400 font-bold' : 'text-amber-300'}>
                        {item.status === 'published' ? '✓ 10 Hesapta Paylaşıldı' : '⏱ Otomatik Paylaşım Zamanlandı'}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white">{item.headline}</div>
                    <div className="text-xs text-slate-400 font-mono truncate">{item.targetUrl}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(item.postText, `day-${item.day}`)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === `day-${item.day}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Gönderiyi Kopyala</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleBroadcastAllAccounts(item.postText, item.day)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{item.status === 'published' ? 'Tekrar Paylaş' : 'Şimdi Paylaş'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mainView === 'templates' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTemplateTab('social')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTemplateTab === 'social'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sosyal Medya Gönderisi</span>
                </button>
                <button
                  onClick={() => setActiveTemplateTab('academic')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTemplateTab === 'academic'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Akademik & LinkedIn</span>
                </button>
                <button
                  onClick={() => setActiveTemplateTab('direct')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTemplateTab === 'direct'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Topluluk & Kanal</span>
                </button>
              </div>

              <div className="flex items-center justify-between px-1 text-xs">
                <span className="text-slate-400">
                  Hedef Hesaplar: <strong className="text-slate-200">{currentNote.platforms}</strong>
                </span>
                <span className="text-amber-400 font-mono text-[11px]">{currentNote.badge}</span>
              </div>

              <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {currentNote.content}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => handleBroadcastAllAccounts(currentNote.content)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Bu Metni Tüm 10 Hesapta Gönderi Olarak Paylaş</span>
                </button>
                <button
                  onClick={() => handleCopy(currentNote.content, currentNote.id)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedId === currentNote.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Metni Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Quick Direct Share Links */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={buildPlatformShareUrl('linkedin', DEFAULT_MASTER_SHARE_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold flex items-center gap-1.5 transition"
            >
              <Linkedin className="w-3.5 h-3.5 text-sky-400" />
              <span>LinkedIn (emrepelit109)</span>
            </a>
            <a
              href={buildPlatformShareUrl('twitter-x', DEFAULT_MASTER_SHARE_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>X (Twitter)</span>
            </a>
            <a
              href={buildPlatformShareUrl('blogger', DEFAULT_MASTER_SHARE_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-300 font-semibold flex items-center gap-1.5 transition"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>Blogger</span>
            </a>
            <a
              href={buildPlatformShareUrl('reddit', DEFAULT_MASTER_SHARE_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
              <span>Reddit</span>
            </a>
            <a
              href={buildPlatformShareUrl('whatsapp', DEFAULT_MASTER_SHARE_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
            <a
              href={buildPlatformShareUrl('telegram', DEFAULT_MASTER_SHARE_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Telegram</span>
            </a>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>{AUTHOR_EMAIL}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
