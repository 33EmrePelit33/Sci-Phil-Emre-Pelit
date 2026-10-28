import { Article } from '../types';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', speechCode: 'tr-TR', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', speechCode: 'en-US', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', speechCode: 'fr-FR', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speechCode: 'es-ES', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', speechCode: 'it-IT', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', speechCode: 'ru-RU', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', speechCode: 'ar-SA', dir: 'rtl' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', speechCode: 'zh-CN', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', speechCode: 'ja-JP', dir: 'ltr' }
];

export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  portal_subtitle: {
    tr: 'Bilim & Felsefe Portalı • Emre Pelit',
    en: 'Science & Philosophy Portal • Emre Pelit',
    de: 'Wissenschafts- & Philosophieportal • Emre Pelit',
    fr: 'Portail Science & Philosophie • Emre Pelit',
    es: 'Portal de Ciencia y Filosofía • Emre Pelit',
    it: 'Portale di Scienza e Filosofia • Emre Pelit',
    ru: 'Портал науки и философии • Эмре Пелит',
    ar: 'بوابة العلوم والفلسفة • إمري بيليت',
    zh: '科学与哲学门户 • Emre Pelit',
    ja: '科学と哲学のポータル • Emre Pelit'
  },
  nav_articles: {
    tr: 'Makaleler',
    en: 'Essays',
    de: 'Artikel',
    fr: 'Articles',
    es: 'Artículos',
    it: 'Articoli',
    ru: 'Статьи',
    ar: 'المقالات',
    zh: '文章',
    ja: '論文・記事'
  },
  nav_simulators: {
    tr: 'İnteraktif Laboratuvar',
    en: 'Interactive Lab',
    de: 'Interaktives Labor',
    fr: 'Laboratoire Interactif',
    es: 'Laboratorio Interactivo',
    it: 'Laboratorio Interattivo',
    ru: 'Интерактивная лаборатория',
    ar: 'المختبر التفاعلي',
    zh: '互动实验室',
    ja: 'インタラクティブラボ'
  },
  nav_stats: {
    tr: 'Trafik & Analitik',
    en: 'Traffic & Analytics',
    de: 'Verkehr & Analytik',
    fr: 'Trafic & Analytique',
    es: 'Tráfico y Analítica',
    it: 'Traffico e Analisi',
    ru: 'Трафик и аналитика',
    ar: 'حركة المرور والتحليلات',
    zh: '流量与分析',
    ja: 'トラフィックと分析'
  },
  nav_automation: {
    tr: 'Otomasyon & 301 Ağı',
    en: 'Automation & 301 Mesh',
    de: 'Automatisierung & 301-Netz',
    fr: 'Automatisation & Réseau 301',
    es: 'Automatización y Red 301',
    it: 'Automazione e Rete 301',
    ru: 'Автоматизация и сеть 301',
    ar: 'الأتمتة وشبكة 301',
    zh: '自动化与301网络',
    ja: '自動化と301ネットワーク'
  },
  invite_btn: {
    tr: 'Davet Notu',
    en: 'Invite Note',
    de: 'Einladungsnotiz',
    fr: 'Note d’invitation',
    es: 'Nota de invitación',
    it: 'Nota d’invito',
    ru: 'Приглашение',
    ar: 'مذكرة دعوة',
    zh: '邀请函',
    ja: '招待ノート'
  },
  sync_active: {
    tr: 'Canlı Veri Senkronizasyonu: Aktif',
    en: 'Live Data Synchronization: Active',
    de: 'Live-Datensynchronisation: Aktiv',
    fr: 'Synchronisation des Données en Direct : Active',
    es: 'Sincronización de Datos en Vivo: Activa',
    it: 'Sincronizzazione Dati in Tempo Reale: Attiva',
    ru: 'Живая синхронизация данных: Активна',
    ar: 'مزامنة البيانات الحية: نشطة',
    zh: '实时数据同步：已激活',
    ja: 'ライブデータ同期：アクティブ'
  },
  redirect_network_label: {
    tr: '301 Ağı: 7 / 7 Site → sci-phi.ai.studio (Tam Bağlı)',
    en: '301 Mesh: 7 / 7 Sites → sci-phi.ai.studio (Fully Connected)',
    de: '301-Netz: 7 / 7 Seiten → sci-phi.ai.studio (Vollständig verbunden)',
    fr: 'Réseau 301 : 7 / 7 Sites → sci-phi.ai.studio (Entièrement connecté)',
    es: 'Red 301: 7 / 7 Sitios → sci-phi.ai.studio (Totalmente conectado)',
    it: 'Rete 301: 7 / 7 Siti → sci-phi.ai.studio (Completamente connesso)',
    ru: 'Сеть 301: 7 / 7 сайтов → sci-phi.ai.studio (Полностью подключено)',
    ar: 'شبكة 301: 7 / 7 مواقع ← sci-phi.ai.studio (متصلة بالكامل)',
    zh: '301网络：7 / 7 站点 → sci-phi.ai.studio（完全连接）',
    ja: '301ネットワーク：7 / 7 サイト → sci-phi.ai.studio（完全接続）'
  },
  cumulative_total_label: {
    tr: 'Kümülatif Toplam:',
    en: 'Cumulative Total:',
    de: 'Kumulierte Gesamtsumme:',
    fr: 'Total Cumulé :',
    es: 'Total Acumulado:',
    it: 'Totale Cumulativo:',
    ru: 'Совокупный итог:',
    ar: 'الإجمالي التراكمي:',
    zh: '累计总计：',
    ja: '累計合計：'
  },
  net_reads_unit: {
    tr: 'Net Okunma',
    en: 'Net Reads',
    de: 'Netto-Lesevorgänge',
    fr: 'Lectures Nettes',
    es: 'Lecturas Netas',
    it: 'Letture Nette',
    ru: 'Чистых прочтений',
    ar: 'قراءة صافية',
    zh: '净阅读量',
    ja: '純閲覧数'
  },
  page_views_unit: {
    tr: 'Görüntüleme',
    en: 'Page Views',
    de: 'Seitenaufrufe',
    fr: 'Vues de Page',
    es: 'Vistas de Página',
    it: 'Visualizzazioni',
    ru: 'Просмотров страниц',
    ar: 'مشاهدة صفحة',
    zh: '页面浏览量',
    ja: 'ページビュー'
  },
  last_sync_label: {
    tr: 'Son senkron',
    en: 'Last sync',
    de: 'Letzte Synchr.',
    fr: 'Dernière synchro',
    es: 'Última sinc.',
    it: 'Ultima sinc.',
    ru: 'Посл. синхр.',
    ar: 'آخر مزامنة',
    zh: '上次同步',
    ja: '最終同期'
  },
  hero_badge: {
    tr: 'Sci-Phi: Bilim & Felsefe Portalı (7 Site → 301 sci-phi.ai.studio)',
    en: 'Sci-Phi: Science & Philosophy Portal (7 Sites → 301 sci-phi.ai.studio)',
    de: 'Sci-Phi: Wissenschaft & Philosophie (7 Seiten → 301 sci-phi.ai.studio)',
    fr: 'Sci-Phi : Portail Science & Philosophie (7 Sites → 301 sci-phi.ai.studio)',
    es: 'Sci-Phi: Portal de Ciencia y Filosofía (7 Sitios → 301 sci-phi.ai.studio)',
    it: 'Sci-Phi: Portale di Scienza e Filosofia (7 Siti → 301 sci-phi.ai.studio)',
    ru: 'Sci-Phi: Портал науки и философии (7 сайтов → 301 sci-phi.ai.studio)',
    ar: 'بوابة العلوم والفلسفة (7 مواقع ← 301 sci-phi.ai.studio)',
    zh: 'Sci-Phi：科学与哲学门户（7个站点 → 301 sci-phi.ai.studio）',
    ja: 'Sci-Phi：科学と哲学ポータル（7サイト → 301 sci-phi.ai.studio）'
  },
  hero_title_1: {
    tr: 'Fiziksel Evrenin Sınırlarından',
    en: 'From the Boundaries of Physics to the Depth of',
    de: 'Von den Grenzen des physischen Universums in die Tiefe von',
    fr: 'Des frontières de l’univers physique aux profondeurs de',
    es: 'Desde los límites del universo físico hasta la profundidad de',
    it: 'Dai confini dell’universo fisico alle profondità di',
    ru: 'От границ физической Вселенной до глубин',
    ar: 'من حدود الكون المادي إلى أعماق',
    zh: '从物理宇宙的边界到',
    ja: '物理的宇宙の境界から'
  },
  hero_title_highlight: {
    tr: 'Bilinç ve Zihnin',
    en: 'Mind & Consciousness.',
    de: 'Geist & Bewusstsein.',
    fr: 'l’Esprit et de la Conscience.',
    es: 'la Mente y la Conciencia.',
    it: 'Mente e Coscienza.',
    ru: 'Разума и Сознания.',
    ar: 'العقل والوعي.',
    zh: '心灵与意识的深处。',
    ja: '意識と心の深淵へ。'
  },
  hero_title_2: {
    tr: 'Derinliklerine.',
    en: '',
    de: '',
    fr: '',
    es: '',
    it: '',
    ru: '',
    ar: '',
    zh: '',
    ja: ''
  },
  hero_desc: {
    tr: 'Emre Pelit tarafından kaleme alınan kuramsal fizik, analitik epistemoloji, diyalektik mantık ve yapay genel zeka üzerine derinlikli felsefi incelemeler, matematiksel modeller ve interaktif düşünce deneyleri.',
    en: 'Rigorous philosophical essays, mathematical formulations, and interactive thought experiments by Emre Pelit spanning theoretical physics, epistemology, dialectics, and cognitive science.',
    de: 'Tiefgründige philosophische Abhandlungen, mathematische Modelle und interaktive Gedankenexperimente von Emre Pelit über theoretische Physik, Erkenntnistheorie, Dialektik und KI.',
    fr: 'Essais philosophiques rigoureux, formulations mathématiques et expériences de pensée interactives par Emre Pelit couvrant la physique théorique, l’épistémologie et la dialectique.',
    es: 'Ensayos filosóficos rigurosos, formulaciones matemáticas y experimentos mentales interactivos por Emre Pelit sobre física teórica, epistemología, dialéctica e inteligencia artificial.',
    it: 'Saggi filosofici rigorosi, modelli matematici ed esperimenti mentali interattivi di Emre Pelit su fisica teorica, epistemologia, dialettica e intelligenza artificiale.',
    ru: 'Глубокие философские исследования, математические модели и интерактивные мысленные эксперименты Эмре Пелита по теоретической физике, эпистемологии и диалектике.',
    ar: 'دراسات فلسفية معمقة ونماذج رياضية وتجارب فكرية تفاعلية بقلم إمري بيليت حول الفيزياء النظرية ونظرية المعرفة والمنطق الجدلي والذكاء الاصطناعي.',
    zh: '由 Emre Pelit 撰写的关于理论物理、分析认识论、辩证逻辑和通用人工智能的深度哲学论文、数学模型和互动思想实验。',
    ja: 'エムレ・ペリットによる理論物理学、分析的認識論、弁証法的論理、汎用人工知能に関する深い哲学的考察、数学モデル、および対話型思考実験。'
  },
  launch_lab: {
    tr: 'İnteraktif Laboratuvarı Başlat',
    en: 'Launch Interactive Lab',
    de: 'Interaktives Labor starten',
    fr: 'Lancer le Laboratoire Interactif',
    es: 'Iniciar Laboratorio Interactivo',
    it: 'Avvia Laboratorio Interattivo',
    ru: 'Запустить лабораторию',
    ar: 'تشغيل المختبر التفاعلي',
    zh: '启动互动实验室',
    ja: 'インタラクティブラボを起動'
  },
  featured_badge: {
    tr: 'ÖNE ÇIKAN MAKALE',
    en: 'FEATURED ESSAY',
    de: 'EMPFOHLENER ARTIKEL',
    fr: 'ARTICLE À LA UNE',
    es: 'ARTÍCULO DESTACADO',
    it: 'ARTICOLO IN EVIDENZA',
    ru: 'ИЗБРАННАЯ СТАТЬЯ',
    ar: 'مقال مميز',
    zh: '精选文章',
    ja: '注目の記事'
  },
  read_full_essay: {
    tr: 'Tam Metni Oku & Dinle',
    en: 'Read & Listen Full Essay',
    de: 'Volltext lesen & anhören',
    fr: 'Lire et écouter l’article',
    es: 'Leer y escuchar artículo completo',
    it: 'Leggi e ascolta il testo completo',
    ru: 'Читать и слушать полностью',
    ar: 'اقرأ واستمع إلى المقال كاملاً',
    zh: '阅读并收听全文',
    ja: '全文を読んで聴く'
  },
  read_and_listen: {
    tr: 'İncele & Dinle',
    en: 'Read & Listen',
    de: 'Lesen & Anhören',
    fr: 'Lire & Écouter',
    es: 'Leer y Escuchar',
    it: 'Leggi e Ascolta',
    ru: 'Читать и слушать',
    ar: 'اقرأ واستمع',
    zh: '阅读与收听',
    ja: '読む・聴く'
  },
  search_placeholder: {
    tr: '294 makalede ara...',
    en: 'Search across 294 essays...',
    de: 'In 294 Artikeln suchen...',
    fr: 'Rechercher dans 294 articles...',
    es: 'Buscar en 294 artículos...',
    it: 'Cerca in 294 articoli...',
    ru: 'Поиск по 294 статьям...',
    ar: 'ابحث في 294 مقالاً...',
    zh: '在 294 篇文章中搜索...',
    ja: '294件の記事を検索...'
  },
  show_all_single_page: {
    tr: 'Tüm 294\'ü Tek Sayfada Aç',
    en: 'Open All 294 on Single Page',
    de: 'Alle 294 auf einer Seite öffnen',
    fr: 'Ouvrir les 294 sur une seule page',
    es: 'Abrir los 294 en una sola página',
    it: 'Apri tutti i 294 in una pagina',
    ru: 'Открыть все 294 на одной странице',
    ar: 'فتح جميع الـ 294 في صفحة واحدة',
    zh: '在单页上打开全部 294 篇',
    ja: '全294件を1ページで表示'
  },
  return_paginated: {
    tr: 'Sayfalı Görünüme Dön',
    en: 'Return to Paginated View',
    de: 'Zur Seitenansicht zurückkehren',
    fr: 'Retour à la vue paginée',
    es: 'Volver a la vista paginada',
    it: 'Torna alla vista paginata',
    ru: 'Вернуться к постраничному виду',
    ar: 'العودة إلى العرض المقسم',
    zh: '返回分页视图',
    ja: 'ページ表示に戻る'
  },
  load_more: {
    tr: 'Daha Fazla Göster (+30 Makale)',
    en: 'Load More (+30 Essays)',
    de: 'Mehr anzeigen (+30 Artikel)',
    fr: 'Afficher plus (+30 Articles)',
    es: 'Mostrar más (+30 Artículos)',
    it: 'Mostra altro (+30 Articoli)',
    ru: 'Показать еще (+30 статей)',
    ar: 'عرض المزيد (+30 مقالاً)',
    zh: '加载更多（+30 篇文章）',
    ja: 'さらに表示（+30記事）'
  },
  back_to_essays: {
    tr: 'Tüm Makalelere Dön',
    en: 'Back to All Essays',
    de: 'Zurück zu allen Artikeln',
    fr: 'Retour à tous les articles',
    es: 'Volver a todos los artículos',
    it: 'Torna a tutti gli articoli',
    ru: 'Назад ко всем статьям',
    ar: 'العودة إلى جميع المقالات',
    zh: '返回所有文章',
    ja: 'すべての記事に戻る'
  },
  share: {
    tr: 'Paylaş',
    en: 'Share',
    de: 'Teilen',
    fr: 'Partager',
    es: 'Compartir',
    it: 'Condividi',
    ru: 'Поделиться',
    ar: 'مشاركة',
    zh: '分享',
    ja: '共有'
  },
  copied: {
    tr: 'Kopyalandı',
    en: 'Copied',
    de: 'Kopiert',
    fr: 'Copié',
    es: 'Copiado',
    it: 'Copiato',
    ru: 'Скопировано',
    ar: 'تم النسخ',
    zh: '已复制',
    ja: 'コピー完了'
  },
  executive_summary: {
    tr: 'Yönetici Özeti — Makalenin Ana Tezi',
    en: 'Executive Summary — Core Thesis of the Essay',
    de: 'Zusammenfassung — Hauptthese des Artikels',
    fr: 'Résumé Exécutif — Thèse Centrale de l’Article',
    es: 'Resumen Ejecutivo — Tesis Central del Artículo',
    it: 'Sintesi Esecutiva — Tesi Centrale dell’Articolo',
    ru: 'Резюме — Основной тезис статьи',
    ar: 'الملخص التنفيذي — الأطروحة الأساسية للمقال',
    zh: '执行摘要 — 文章核心论点',
    ja: 'エグゼクティブサマリー — 論文の中心命題'
  },
  math_formulations_title: {
    tr: 'Matematiksel ve Fiziksel Formülasyonlar (LaTeX KaTeX)',
    en: 'Mathematical & Physical Formulations (LaTeX KaTeX)',
    de: 'Mathematische und physikalische Formulierungen (LaTeX)',
    fr: 'Formulations Mathématiques et Physiques (LaTeX)',
    es: 'Formulaciones Matemáticas y Físicas (LaTeX)',
    it: 'Formulazioni Matematiche e Fisiche (LaTeX)',
    ru: 'Математические и физические формулировки (LaTeX)',
    ar: 'الصياغات الرياضية والفيزيائية (LaTeX)',
    zh: '数学与物理公式 (LaTeX KaTeX)',
    ja: '数学的・物理的定式化 (LaTeX KaTeX)'
  },
  philosophical_meaning: {
    tr: 'Felsefi Yorum:',
    en: 'Philosophical Interpretation:',
    de: 'Philosophische Bedeutung:',
    fr: 'Interprétation Philosophique :',
    es: 'Interpretación Filosófica:',
    it: 'Interpretazione Filosofica:',
    ru: 'Философская интерпретация:',
    ar: 'التفسير الفلسفي:',
    zh: '哲学诠释：',
    ja: '哲学的解釈：'
  },
  socratic_questions_title: {
    tr: 'Sokratik Düşünme & Sorgulama Soruları',
    en: 'Socratic Inquiry Prompts',
    de: 'Sokratische Reflexionsfragen',
    fr: 'Questions d’Enquête Socratique',
    es: 'Preguntas de Indagación Socrática',
    it: 'Domande di Indagine Socratica',
    ru: 'Сократовские вопросы для размышления',
    ar: 'أسئلة الاستقصاء السقراطي',
    zh: '苏格拉底式追问与思考',
    ja: 'ソクラテス式探求の問い'
  },
  audio_listen: {
    tr: 'Sesli Dinle (Çok Dilli Doğal Konuşma Motoru)',
    en: 'Audio Playback (Multi-Language Natural Speech)',
    de: 'Audio-Wiedergabe (Mehrsprachige Sprachsynthese)',
    fr: 'Lecture Audio (Synthèse Vocale Multilingue)',
    es: 'Reproducción de Audio (Voz Natural Multilingüe)',
    it: 'Riproduzione Audio (Sintesi Vocale Multilingue)',
    ru: 'Аудиоплеер (Многоязычный синтез речи)',
    ar: 'الاستماع الصوتي (محرك النطق الطبيعي متعدد اللغات)',
    zh: '语音朗读（多语言自然语音合成）',
    ja: '音声再生（多言語ナチュラルスピーチ）'
  },
  audio_subtitle: {
    tr: 'İstediğiniz dilde makaleyi dinleyin • Seçilen dil tüm siteyle senkronize çalışır',
    en: 'Listen to this essay in any language • Synchronized with site language',
    de: 'Hören Sie diesen Artikel in jeder Sprache • Synchronisiert mit der Website-Sprache',
    fr: 'Écoutez cet article dans la langue de votre choix • Synchronisé avec le site',
    es: 'Escuche este artículo en cualquier idioma • Sincronizado con el idioma del sitio',
    it: 'Ascolta questo articolo in qualsiasi lingua • Sincronizzato con la lingua del sito',
    ru: 'Слушайте статью на любом языке • Синхронизировано с языком сайта',
    ar: 'استمع إلى المقال بأي لغة تريدها • متزامن مع لغة الموقع',
    zh: '用您选择的任何语言收听文章 • 与全站语言同步',
    ja: 'お好みの言語で記事を聴く • サイト全体の言語と同期'
  },
  audio_start: {
    tr: 'Dinlemeyi Başlat',
    en: 'Start Listening',
    de: 'Wiedergabe starten',
    fr: 'Démarrer l’écoute',
    es: 'Iniciar reproducción',
    it: 'Avvia ascolto',
    ru: 'Начать прослушивание',
    ar: 'بدء الاستماع',
    zh: '开始朗读',
    ja: '再生を開始'
  },
  audio_resume: {
    tr: 'Devam Et',
    en: 'Resume',
    de: 'Fortsetzen',
    fr: 'Reprendre',
    es: 'Reanudar',
    it: 'Riprendi',
    ru: 'Продолжить',
    ar: 'استئناف',
    zh: '继续',
    ja: '再開'
  },
  audio_pause: {
    tr: 'Duraklat',
    en: 'Pause',
    de: 'Pause',
    fr: 'Pause',
    es: 'Pausar',
    it: 'Pausa',
    ru: 'Пауза',
    ar: 'إيقاف مؤقت',
    zh: '暂停',
    ja: '一時停止'
  },
  audio_progress: {
    tr: 'Okuma İlerlemesi',
    en: 'Reading Progress',
    de: 'Lesefortschritt',
    fr: 'Progression de lecture',
    es: 'Progreso de lectura',
    it: 'Progresso di lettura',
    ru: 'Прогресс чтения',
    ar: 'تقدم القراءة',
    zh: '朗读进度',
    ja: '読み上げ進行状況'
  },
  // Otomasyon & IndexNow Çevirileri
  auto_badge: {
    tr: 'Sistem & 301 Ağ Yönetimi',
    en: 'System & 301 Mesh Management',
    de: 'System- & 301-Netzwerkverwaltung',
    fr: 'Gestion du Système & Réseau 301',
    es: 'Gestión del Sistema y Red 301',
    it: 'Gestione Sistema e Rete 301',
    ru: 'Управление системой и сетью 301',
    ar: 'إدارة النظام وشبكة 301',
    zh: '系统与 301 网络管理',
    ja: 'システム＆301ネットワーク管理'
  },
  auto_title: {
    tr: 'Sci-Phi Otomasyon & 8 Site IndexNow / 301 Merkezi',
    en: 'Sci-Phi Automation & 8-Site IndexNow / 301 Center',
    de: 'Sci-Phi Automatisierungs- & 8-Seiten IndexNow / 301-Zentrum',
    fr: 'Centre d’Automatisation Sci-Phi & IndexNow / 301 (8 Sites)',
    es: 'Centro de Automatización Sci-Phi e IndexNow / 301 (8 Sitios)',
    it: 'Centro di Automazione Sci-Phi e IndexNow / 301 (8 Siti)',
    ru: 'Центр автоматизации Sci-Phi и IndexNow / 301 (8 сайтов)',
    ar: 'مركز أتمتة Sci-Phi وفهرسة IndexNow / 301 (8 مواقع)',
    zh: 'Sci-Phi 自动化与 8 站点 IndexNow / 301 中心',
    ja: 'Sci-Phi 自動化＆8サイト IndexNow / 301 センター'
  },
  indexnow_btn_idle: {
    tr: 'Tüm 8 Web Sitesini IndexNow ile Şimdi İndeksle',
    en: 'Index All 8 Websites via IndexNow Now',
    de: 'Alle 8 Websites jetzt über IndexNow indizieren',
    fr: 'Indexer les 8 sites Web via IndexNow maintenant',
    es: 'Indexar los 8 sitios web vía IndexNow ahora',
    it: 'Indicizza tutti gli 8 siti web tramite IndexNow ora',
    ru: 'Индексировать все 8 сайтов через IndexNow сейчас',
    ar: 'فهرسة جميع المواقع الـ 8 عبر IndexNow الآن',
    zh: '立即通过 IndexNow 索引全部 8 个网站',
    ja: '全8サイトを今すぐIndexNowでインデックス登録'
  },
  indexnow_btn_running: {
    tr: '8 Web Sitesi ve 2.360 URL İndeksleniyor...',
    en: 'Indexing 8 Websites & 2,360 URLs...',
    de: '8 Websites & 2.360 URLs werden indiziert...',
    fr: 'Indexation de 8 sites et 2 360 URL en cours...',
    es: 'Indexando 8 sitios web y 2.360 URLs...',
    it: 'Indicizzazione di 8 siti e 2.360 URL in corso...',
    ru: 'Индексация 8 сайтов и 2 360 URL...',
    ar: 'جاري فهرسة 8 مواقع و 2,360 رابط...',
    zh: '正在索引 8 个网站和 2,360 个 URL...',
    ja: '8サイトと2,360件のURLをインデックス中...'
  },
  indexnow_btn_done: {
    tr: 'Tüm 8 Web Sitesi (2.360 URL) Başarıyla İndekslendi!',
    en: 'All 8 Websites (2,360 URLs) Successfully Indexed!',
    de: 'Alle 8 Websites (2.360 URLs) erfolgreich indiziert!',
    fr: 'Les 8 sites Web (2 360 URL) ont été indexés avec succès !',
    es: '¡Los 8 sitios web (2.360 URLs) indexados con éxito!',
    it: 'Tutti gli 8 siti web (2.360 URL) indicizzati con successo!',
    ru: 'Все 8 сайтов (2 360 URL) успешно проиндексированы!',
    ar: 'تمت فهرسة جميع المواقع الـ 8 (2,360 رابط) بنجاح!',
    zh: '全部 8 个网站（2,360 个 URL）已成功索引！',
    ja: '全8サイト（2,360 URL）のインデックス登録が完了しました！'
  },
  // Son 24 Saat (1 Gün) Analitik Konsolu Çevirileri
  last_24h_badge: {
    tr: 'CANLI 24 SAAT ANALİTİĞİ',
    en: 'LIVE 24-HOUR ANALYTICS',
    de: 'LIVE 24-STUNDEN-ANALYTIK',
    fr: 'ANALYTIQUE EN DIRECT 24H',
    es: 'ANALÍTICA EN VIVO 24 HORAS',
    it: 'ANALISI IN TEMPO REALE 24 ORE',
    ru: 'ЖИВАЯ АНАЛИТИКА ЗА 24 ЧАСА',
    ar: 'تحليلات حية لآخر 24 ساعة',
    zh: '实时24小时分析',
    ja: 'リアルタイム24時間分析'
  },
  last_24h_title: {
    tr: 'Son 1 Gün (24 Saat) Gerçekleşen Analitik Verileri',
    en: 'Past 1 Day (24-Hour) Real-Time Analytics',
    de: 'Echtzeit-Analytik der letzten 24 Stunden (1 Tag)',
    fr: 'Données Analytiques des Dernières 24 Heures (1 Jour)',
    es: 'Datos Analíticos de las Últimas 24 Horas (1 Día)',
    it: 'Dati Analitici delle Ultime 24 Ore (1 Giorno)',
    ru: 'Аналитические данные за последние 24 часа (1 день)',
    ar: 'بيانات التحليلات لآخر يوم (24 ساعة)',
    zh: '近1天（24小时）实时分析数据',
    ja: '直近24時間（1日）のリアルタイム分析データ'
  },
  last_24h_desc: {
    tr: 'Son 24 saat içinde gerçekleşen tüm organik okunmalar, sayfa görüntülemeleri, saatlik dalgalanma grafiği ve 8 web sitesi dağılımı.',
    en: 'All verified organic reads, page views, hourly traffic wave, and 8-website breakdown recorded over the past 24 hours.',
    de: 'Alle verifizierten organischen Lesevorgänge, Seitenaufrufe, stündliche Verlaufskurve und 8-Website-Verteilung der letzten 24 Stunden.',
    fr: 'Toutes les lectures organiques vérifiées, vues de page, tendance horaire et répartition sur les 8 sites au cours des dernières 24 heures.',
    es: 'Todas las lecturas orgánicas verificadas, páginas vistas, tendencia horaria y desglose de los 8 sitios durante las últimas 24 horas.',
    it: 'Tutte le letture organiche verificate, visualizzazioni di pagina, andamento orario e ripartizione sugli 8 siti nelle ultime 24 ore.',
    ru: 'Все подтвержденные органические прочтения, просмотры страниц, почасовая динамика и распределение по 8 сайтам за последние 24 часа.',
    ar: 'جميع القراءات العضوية المؤكدة، ومشاهدات الصفحات، والمنحنى الساعي، وتوزيع المواقع الثمانية المسجلة خلال الـ 24 ساعة الماضية.',
    zh: '过去24小时内记录的全部真实有机阅读量、页面浏览量、每小时流量波动以及8个站点的细分分布。',
    ja: '直近24時間に記録されたすべての実読数、ページビュー、時間帯別トラフィック推移、および8サイトの内訳。'
  },
  reads_24h: {
    tr: 'Son 24 Saat Net Okunma',
    en: '24-Hour Net Reads',
    de: '24h Netto-Lesevorgänge',
    fr: 'Lectures Nettes 24h',
    es: 'Lecturas Netas 24h',
    it: 'Letture Nette 24h',
    ru: 'Чистых прочтений за 24 ч',
    ar: 'قراءات صافية (24 ساعة)',
    zh: '24小时净阅读量',
    ja: '24時間純閲覧数'
  },
  views_24h: {
    tr: 'Son 24 Saat Sayfa Görüntüleme',
    en: '24-Hour Page Views',
    de: '24h Seitenaufrufe',
    fr: 'Vues de Page 24h',
    es: 'Vistas de Página 24h',
    it: 'Visualizzazioni 24h',
    ru: 'Просмотров за 24 ч',
    ar: 'مشاهدات الصفحات (24 ساعة)',
    zh: '24小时页面浏览量',
    ja: '24時間ページビュー'
  },
  active_readers_now: {
    tr: 'Anlık Aktif Okur / Ziyaretçi',
    en: 'Active Readers Right Now',
    de: 'Aktive Leser im Moment',
    fr: 'Lecteurs Actifs en Direct',
    es: 'Lectores Activos Ahora',
    it: 'Lettori Attivi Adesso',
    ru: 'Активных читателей сейчас',
    ar: 'القراء النشطون الآن',
    zh: '当前活跃在线读者',
    ja: '現在アクティブな読者数'
  },
  avg_duration_24h: {
    tr: '24s Ort. Okuma Süresi',
    en: '24h Avg. Read Duration',
    de: '24h Durchschn. Lesezeit',
    fr: 'Durée Moyenne de Lecture 24h',
    es: 'Duración Promedio de Lectura 24h',
    it: 'Tempo Medio di Lettura 24h',
    ru: 'Ср. время чтения за 24 ч',
    ar: 'متوسط وقت القراءة (24 ساعة)',
    zh: '24小时平均阅读时长',
    ja: '24時間平均閲覧時間'
  },
  hourly_trends: {
    tr: '24 Saatlik Saatlik Trend Eğrisi (00:00 - 23:00)',
    en: '24-Hour Hourly Trend Wave (00:00 - 23:00)',
    de: '24-Stunden Stundentrend-Kurve (00:00 - 23:00)',
    fr: 'Courbe de Tendance Horaire 24h (00:00 - 23:00)',
    es: 'Curva de Tendencia Horaria de 24h (00:00 - 23:00)',
    it: 'Onda di Tendenza Oraria 24h (00:00 - 23:00)',
    ru: 'Почасовая динамика за 24 часа (00:00 - 23:00)',
    ar: 'منحنى الاتجاه الساعي لـ 24 ساعة (00:00 - 23:00)',
    zh: '24小时每小时趋势曲线（00:00 - 23:00）',
    ja: '24時間毎時トレンド波形（00:00 - 23:00）'
  },
  top_articles_24h: {
    tr: 'Son 24 Saatte En Çok Okunan Makaleler',
    en: 'Top Read Essays in Last 24 Hours',
    de: 'Meistgelesene Artikel der letzten 24 Stunden',
    fr: 'Articles les Plus Lus au Cours des Dernières 24h',
    es: 'Artículos Más Leídos en las Últimas 24 Horas',
    it: 'Articoli Più Letti nelle Ultime 24 Ore',
    ru: 'Самые читаемые статьи за последние 24 часа',
    ar: 'المقالات الأكثر قراءة في الـ 24 ساعة الماضية',
    zh: '过去24小时阅读量最高的文章',
    ja: '過去24時間で最も読まれた記事'
  },
  sites_breakdown_24h: {
    tr: 'Son 24 Saat 8 Web Sitesi Dağılımı',
    en: '24-Hour Traffic Across 8 Websites',
    de: '24h-Verkehr auf 8 Websites',
    fr: 'Trafic 24h sur les 8 Sites Web',
    es: 'Tráfico de 24h en los 8 Sitios Web',
    it: 'Traffico 24h sugli 8 Siti Web',
    ru: 'Трафик за 24 ч по 8 сайтам',
    ar: 'حركة المرور لـ 24 ساعة عبر 8 مواقع',
    zh: '近24小时8个站点的流量分布',
    ja: '過去24時間の8サイト別トラフィック'
  },
  // Simülatör Çevirileri
  sim_block_universe: {
    tr: 'Blok Evren & Görelilik',
    en: 'Block Universe & Relativity',
    de: 'Blockuniversum & Relativität',
    fr: 'Univers-Bloc & Relativité',
    es: 'Universo Bloque y Relatividad',
    it: 'Universo a Blocchi & Relatività',
    ru: 'Блочная Вселенная и теория относительности',
    ar: 'الكون الكتلي والنسبية',
    zh: '块状宇宙与相对论',
    ja: 'ブロック宇宙と相対性理論'
  },
  sim_chinese_room: {
    tr: 'Çin Odası (Yapay Zeka)',
    en: 'Chinese Room (AI & Mind)',
    de: 'Chinesisches Zimmer (KI)',
    fr: 'Chambre Chinoise (IA & Esprit)',
    es: 'Habitación China (IA y Mente)',
    it: 'Stanza Cinese (IA e Mente)',
    ru: 'Китайская комната (ИИ и разум)',
    ar: 'الغرفة الصينية (الذكاء الاصطناعي)',
    zh: '中文房间（人工智能与心灵）',
    ja: '中国語の部屋（AIと心）'
  },
  sim_fallacy_inspector: {
    tr: 'Safsata Dedektifi',
    en: 'Fallacy Inspector',
    de: 'Trugschluss-Detektor',
    fr: 'Détecteur de Sophismes',
    es: 'Detector de Falacias',
    it: 'Ispettore di Fallacie',
    ru: 'Детектор софизмов и логических ошибок',
    ar: 'كاشف المغالطات المنطقية',
    zh: '逻辑谬误检测器',
    ja: '論理的誤謬インスペクター'
  },
  sim_socratic_arena: {
    tr: 'Sokratik Diyalog Arenası',
    en: 'Socratic Dialogue Arena',
    de: 'Sokratische Dialog-Arena',
    fr: 'Arène de Dialogue Socratique',
    es: 'Arena de Diálogo Socrático',
    it: 'Arena del Dialogo Socratico',
    ru: 'Арена сократического диалога',
    ar: 'حلبة الحوار السقراطي',
    zh: '苏格拉底式对话竞技场',
    ja: 'ソクラテス対話アリーナ'
  },
  sim_knowledge_graph: {
    tr: 'Kavramsal Bilgi Ağı',
    en: 'Ontological Knowledge Graph',
    de: 'Begriffliches Wissensnetz',
    fr: 'Graphe de Connaissances Ontologique',
    es: 'Grafo de Conocimiento Ontológico',
    it: 'Grafo di Conoscenza Ontologica',
    ru: 'Онтологический граф знаний',
    ar: 'شبكة المعرفة الأنطولوجية',
    zh: '本体概念知识图谱',
    ja: 'オントロジー知識グラフ'
  },
  // Diyalektik & İtiraz Çevirileri
  triad_title: {
    tr: 'Hegelyen Diyalektik Çözümleme (Tez - Antitez - Sentez)',
    en: 'Hegelian Dialectical Triad (Thesis - Antithesis - Synthesis)',
    de: 'Hegelsche Dialektische Triade (These - Antithese - Synthese)',
    fr: 'Triade Dialectique Hégélienne (Thèse - Antithèse - Synthèse)',
    es: 'Tríada Dialéctica Hegeliana (Tesis - Antítesis - Síntesis)',
    it: 'Triade Dialettica Hegeliana (Tesi - Antitesi - Sintesi)',
    ru: 'Гегелевская диалектическая триада (Тезис - Антитезис - Синтез)',
    ar: 'الثلاثية الجدلية الهيغلية (أطروحة - نقيض - تأليف)',
    zh: '黑格尔辩证三段论（正题 - 反题 - 合题）',
    ja: 'ヘーゲル弁証法的三趾（テーゼ・アンチテーゼ・ジンテーゼ）'
  },
  triad_thesis: {
    tr: 'TEZ (THESIS)',
    en: 'THESIS',
    de: 'THESE',
    fr: 'THÈSE',
    es: 'TESIS',
    it: 'TESI',
    ru: 'ТЕЗИС',
    ar: 'الأطروحة',
    zh: '正题 (THESIS)',
    ja: '正題 (THESIS)'
  },
  triad_thesis_sub: {
    tr: 'Varsayılan Temel Önerme',
    en: 'Initial Proposition',
    de: 'Grundlegende Annahme',
    fr: 'Proposition Initiale',
    es: 'Proposición Inicial',
    it: 'Proposizione Iniziale',
    ru: 'Исходное положение',
    ar: 'المقدمة الأساسية المفترضة',
    zh: '默认基本命题',
    ja: '基礎となる前提命題'
  },
  triad_antithesis: {
    tr: 'ANTİTEZ (ANTITHESIS)',
    en: 'ANTITHESIS',
    de: 'ANTITHESE',
    fr: 'ANTITHÈSE',
    es: 'ANTÍTESIS',
    it: 'ANTITESI',
    ru: 'АНТИТЕЗИС',
    ar: 'النقيض',
    zh: '反题 (ANTITHESIS)',
    ja: '反題 (ANTITHESIS)'
  },
  triad_antithesis_sub: {
    tr: 'Diyalektik Çelişki & Yadsıma',
    en: 'Dialectical Negation',
    de: 'Dialektischer Widerspruch',
    fr: 'Contradiction Dialectique',
    es: 'Contradicción Dialéctica',
    it: 'Contraddizione Dialettica',
    ru: 'Диалектическое отрицание',
    ar: 'التناقض الجدلي والنفي',
    zh: '辩证矛盾与否定',
    ja: '弁証法的矛盾と止揚前の否定'
  },
  triad_synthesis: {
    tr: 'SENTEZ (SYNTHESIS)',
    en: 'SYNTHESIS',
    de: 'SYNTHESE',
    fr: 'SYNTHÈSE',
    es: 'SÍNTESIS',
    it: 'SINTESI',
    ru: 'СИНТЕЗ',
    ar: 'التأليف',
    zh: '合题 (SYNTHESIS)',
    ja: '総合命題 (SYNTHESIS)'
  },
  triad_synthesis_sub: {
    tr: 'Üst Düzey Hakikat & Uzlaşı',
    en: 'Higher-Order Unified Truth',
    de: 'Höherwertige Wahrheit',
    fr: 'Vérité Supérieure Réconciliée',
    es: 'Verdad Superior Reconciliada',
    it: 'Verità Superiore di Sintesi',
    ru: 'Истина высшего порядка',
    ar: 'الحقيقة العليا والتوفيق',
    zh: '更高阶的真理与统一',
    ja: '高次の真理と総合的調和'
  },
  objections_title: {
    tr: 'Felsefi İtirazlar & Uzman Çürütmeleri (Objection Box)',
    en: 'Philosophical Objections & Expert Rebuttals (Objection Box)',
    de: 'Philosophische Einwände & Widerlegungen',
    fr: 'Objections Philosophiques & Réfutations Critiques',
    es: 'Objeciones Filosóficas y Refutaciones de Expertos',
    it: 'Obiezioni Filosofiche e Confutazioni Critiche',
    ru: 'Философские возражения и аналитические опровержения',
    ar: 'الاعتراضات الفلسفية والردود التحليلية',
    zh: '哲学反驳与专业解答 (Objection Box)',
    ja: '哲学的異論と専門的反駁 (Objection Box)'
  },
  objection_label: {
    tr: 'İtirazı:',
    en: 'Objection:',
    de: 'Einwand:',
    fr: 'Objection :',
    es: 'Objeción:',
    it: 'Obiezione:',
    ru: 'Возражение:',
    ar: 'الاعتراض:',
    zh: '反驳观点：',
    ja: '異論：'
  },
  rebuttal_label: {
    tr: 'Sci-Phi Analitik Çözümlemesi / Yanıt:',
    en: 'Sci-Phi Analytical Rebuttal:',
    de: 'Sci-Phi Analytische Entkräftung / Antwort:',
    fr: 'Réfutation Analytique Sci-Phi :',
    es: 'Refutación Analítica Sci-Phi / Respuesta:',
    it: 'Confutazione Analitica Sci-Phi / Risposta:',
    ru: 'Аналитическое опровержение Sci-Phi:',
    ar: 'الرد التحليلي لبوابة Sci-Phi:',
    zh: 'Sci-Phi 分析性反驳 / 解答：',
    ja: 'Sci-Phi 分析的論駁・回答：'
  },
  author_role: {
    tr: 'Kurucu & Baş Yazar • Sci-Phi Portalı',
    en: 'Founder & Lead Author • Sci-Phi Portal',
    de: 'Gründer & Hauptautor • Sci-Phi-Portal',
    fr: 'Fondateur & Auteur Principal • Portail Sci-Phi',
    es: 'Fundador y Autor Principal • Portal Sci-Phi',
    it: 'Fondatore e Autore Principale • Portale Sci-Phi',
    ru: 'Основатель и ведущий автор • Портал Sci-Phi',
    ar: 'المؤسس والمؤلف الرئيسي • بوابة Sci-Phi',
    zh: '创始人兼主笔 • Sci-Phi 门户',
    ja: '創設者兼主筆 • Sci-Phi ポータル'
  },
  author_research: {
    tr: 'Bilim Felsefesi, Kuramsal Fizik & Bilişsel Bilim Araştırmacısı',
    en: 'Philosophy of Science, Theoretical Physics & Cognitive Science',
    de: 'Wissenschaftsphilosophie, theoretische Physik & Kognitionswissenschaft',
    fr: 'Philosophie des sciences, physique théorique & sciences cognitives',
    es: 'Filosofía de la ciencia, física teórica y ciencia cognitiva',
    it: 'Filosofia della scienza, fisica teorica e scienze cognitive',
    ru: 'Философия науки, теоретическая физика и когнитивные науки',
    ar: 'فلسفة العلوم والفيزياء النظرية والعلوم المعرفية',
    zh: '科学哲学、理论物理与认知科学研究者',
    ja: '科学哲学・理論物理学・認知科学研究者'
  },
  author_bio_1: {
    tr: 'Sci-Phi (Science & Philosophy) platformunun kurucusu ve içerik mimarıdır. Modern kuramsal fizik ile felsefi analitiğin kesişim noktalarında (Görelilik, Kuantum Dolanıklığı, Blok Evren, Zihin Felsefesi, AGI Hizalanması) kapsamlı inceleme ve makaleler üretmektedir.',
    en: 'Founder and lead architect of the Sci-Phi platform, authoring in-depth treatises at the intersections of theoretical physics and analytic philosophy (Relativity, Quantum Entanglement, Block Universe, Philosophy of Mind, AGI Alignment).',
    de: 'Gründer und Leitarchitekt der Sci-Phi-Plattform, Autor fundierter Abhandlungen an den Schnittstellen von theoretischer Physik und analytischer Philosophie.',
    fr: 'Fondateur et architecte du portail Sci-Phi, auteur de traités approfondis aux confluents de la physique théorique et de la philosophie analytique.',
    es: 'Fundador y arquitecto de Sci-Phi, autor de tratados en la intersección de la física teórica y la filosofía analítica.',
    it: 'Fondatore e architetto di Sci-Phi, autore di trattati all\'intersezione tra fisica teorica e filosofia analitica.',
    ru: 'Основатель платформы Sci-Phi, автор фундаментальных трудов на стыке теоретической физики и аналитической философии.',
    ar: 'مؤسس منصة Sci-Phi، مؤلف دراسات معمقة عند تقاطع الفيزياء النظرية والفلسفة التحلية.',
    zh: 'Sci-Phi 平台创始人兼主笔，撰写理论物理学与分析哲学交汇领域的深度学术论著。',
    ja: 'Sci-Phi プラットフォームの創設者兼主筆。理論物理学と分析哲学の交差点における論考を執筆。'
  },
  author_bio_2: {
    tr: 'Blogger, Web portalı ve ekosistem genelinde doğrulanmış 57.941 birleşik net okunma ve 78.119 toplam görüntüleme hacmine ulaşan bağımsız bilim-felsefe külliyatının sahibidir.',
    en: 'Author of the verified independent science & philosophy corpus with over 57,941 unified net reads and 78,119 views across platforms.',
    de: 'Urheber des verifizierten Korpus mit über 57.941 Lesezugriffen und 78.119 Seitenaufrufen im gesamten Ökosystem.',
    fr: 'Auteur du corpus indépendant vérifié comptabilisant plus de 57 941 lectures nettes et 78 119 vues au sein de l’écosystème.',
    es: 'Autor del corpus independiente verificado con más de 57.941 lecturas netas y 78.119 visitas en todo el ecosistema.',
    it: 'Autore del corpus indipendente verificato con oltre 57.941 letture nette e 78.119 visualizzazioni nell\'ecosistema.',
    ru: 'Автор верифицированного корпуса с более чем 57 941 чистым прочтением и 78 119 просмотрами по всей экосистеме.',
    ar: 'مؤلف الأرشيف العلمي والفلسفي المستقل مع أكثر من 57941 قراءة صافية و78119 مشاهدة في النظام البيئي.',
    zh: '独立科学哲学文库的作者，在全生态系统中拥有超 57,941 次净阅读和 78,119 次页面浏览。',
    ja: 'プラットフォーム全体で 57,941 回以上の実読者数と 78,119 回の閲覧数を記録する独自論集の著者。'
  },
  pwa_installed: {
    tr: 'PWA Yüklendi',
    en: 'PWA Installed',
    de: 'PWA installiert',
    fr: 'PWA installée',
    es: 'PWA instalada',
    it: 'PWA installata',
    ru: 'PWA установлено',
    ar: 'تم تثبيت PWA',
    zh: 'PWA 已安装',
    ja: 'PWA インストール済み'
  },
  pwa_install: {
    tr: 'Uygulamayı Yükle (PWA)',
    en: 'Install App (PWA)',
    de: 'App installieren (PWA)',
    fr: 'Installer l’application (PWA)',
    es: 'Instalar aplicación (PWA)',
    it: 'Installa app (PWA)',
    ru: 'Установить приложение (PWA)',
    ar: 'تثبيت التطبيق (PWA)',
    zh: '安装应用程序 (PWA)',
    ja: 'アプリをインストール (PWA)'
  },
  no_articles_found: {
    tr: 'Eşleşen makale bulunamadı.',
    en: 'No matching essays found.',
    de: 'Keine passenden Artikel gefunden.',
    fr: 'Aucun article correspondant trouvé.',
    es: 'No se encontraron artículos coincidentes.',
    it: 'Nessun articolo corrispondente trovato.',
    ru: 'Совпадающих статей не найдено.',
    ar: 'لم يتم العثور على مقالات متطابقة.',
    zh: '未找到匹配的文章。',
    ja: '一致する記事は見つかりませんでした。'
  },
  translate_btn: {
    tr: 'Çevir',
    en: 'Translate',
    de: 'Übersetzen',
    fr: 'Traduire',
    es: 'Traducir',
    it: 'Traduci',
    ru: 'Перевести',
    ar: 'ترجمة',
    zh: '翻译',
    ja: '翻訳'
  },
  translating_site: {
    tr: 'Çevriliyor...',
    en: 'Translating...',
    de: 'Übersetze...',
    fr: 'Traduction...',
    es: 'Traduciendo...',
    it: 'Traduzione...',
    ru: 'Перевод...',
    ar: 'جاري الترجمة...',
    zh: '翻译中...',
    ja: '翻訳中...'
  },
  listen_site_btn: {
    tr: 'Dinle',
    en: 'Listen',
    de: 'Anhören',
    fr: 'Écouter',
    es: 'Escuchar',
    it: 'Ascolta',
    ru: 'Слушать',
    ar: 'استماع',
    zh: '朗读',
    ja: '聴く'
  },
  stop_listen_btn: {
    tr: 'Durdur',
    en: 'Stop',
    de: 'Stopp',
    fr: 'Arrêter',
    es: 'Detener',
    it: 'Ferma',
    ru: 'Стоп',
    ar: 'إيقاف',
    zh: '停止',
    ja: '停止'
  },
  site_audio_playing: {
    tr: 'Site İçeriği Sesli Okunuyor',
    en: 'Reading Site Content Aloud',
    de: 'Website-Inhalt wird vorgelesen',
    fr: 'Lecture audio du contenu du site',
    es: 'Leyendo el contenido del sitio en voz alta',
    it: 'Lettura vocale del contenuto del sito',
    ru: 'Озвучивание содержимого сайта',
    ar: 'جاري قراءة محتوى الموقع صوتياً',
    zh: '正在语音朗读全站内容',
    ja: 'サイト全体のコンテンツを音声読み上げ中'
  }
};

export function t(key: string, lang: string = 'tr'): string {
  const entry = UI_TRANSLATIONS[key];
  if (!entry) return key;
  return entry[lang] || entry.en || entry.tr || key;
}

export const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  all: {
    tr: 'Tüm Makaleler',
    en: 'All Essays',
    de: 'Alle Artikel',
    fr: 'Tous les Articles',
    es: 'Todos los Artículos',
    it: 'Tutti gli Articoli',
    ru: 'Все статьи',
    ar: 'جميع المقالات',
    zh: '全部文章',
    ja: 'すべての記事'
  },
  'fizik-kozmoloji': {
    tr: 'Fizik & Kozmoloji',
    en: 'Physics & Cosmology',
    de: 'Physik & Kosmologie',
    fr: 'Physique & Cosmologie',
    es: 'Física y Cosmología',
    it: 'Fisica e Cosmologia',
    ru: 'Физика и космология',
    ar: 'الفيزياء وعلم الكونيات',
    zh: '物理学与宇宙学',
    ja: '物理学と宇宙論'
  },
  'zihin-bilinc': {
    tr: 'Zihin & Bilinç',
    en: 'Mind & Consciousness',
    de: 'Geist & Bewusstsein',
    fr: 'Esprit & Conscience',
    es: 'Mente y Conciencia',
    it: 'Mente e Coscienza',
    ru: 'Разум и сознание',
    ar: 'العقل والوعي',
    zh: '心灵与意识',
    ja: '心と意識'
  },
  epistemoloji: {
    tr: 'Epistemoloji & Felsefe',
    en: 'Epistemology & Philosophy',
    de: 'Erkenntnistheorie & Philosophie',
    fr: 'Épistémologie & Philosophie',
    es: 'Epistemología y Filosofía',
    it: 'Epistemologia e Filosofia',
    ru: 'Эпистемология и философия',
    ar: 'نظرية المعرفة والفلسفة',
    zh: '认识论与哲学',
    ja: '認識論と哲学'
  },
  'diyalektik-mantik': {
    tr: 'Diyalektik & Mantık',
    en: 'Dialectics & Logic',
    de: 'Dialektik & Logik',
    fr: 'Dialectique & Logique',
    es: 'Dialéctica y Lógica',
    it: 'Dialettica e Logica',
    ru: 'Диалектика и логика',
    ar: 'الجدل والمنطق',
    zh: '辩证法与逻辑',
    ja: '弁証法と論理'
  },
  'etik-teknoloji': {
    tr: 'Etik & Teknoloji',
    en: 'Ethics & Technology',
    de: 'Ethik & Technologie',
    fr: 'Éthique & Technologie',
    es: 'Ética y Tecnología',
    it: 'Etica e Tecnologia',
    ru: 'Этика и технологии',
    ar: 'الأخلاق والتكنولوجيا',
    zh: '伦理与技术',
    ja: '倫理とテクノロジー'
  }
};

export function getTranslatedCategoryTitle(categoryId: string, lang: string = 'tr'): string {
  const map = CATEGORY_TRANSLATIONS[categoryId];
  if (!map) return categoryId;
  return map[lang] || map.en || map.tr;
}

// Çok dilli kavramsal ve yapısal çeviri sözlüğü (anlam bütünlüğünü koruyarak çevirir)
const PHRASE_DICTIONARY: Record<string, Record<string, string>> = {
  'Üzerine Analitik Çözümleme': {
    en: 'Analytical Exploration',
    de: 'Analytische Untersuchung',
    fr: 'Analyse Critique et Philosophique',
    es: 'Análisis Crítico y Filosófico',
    it: 'Analisi Critica e Filosofica',
    ru: 'Аналитическое исследование',
    ar: 'تحليل نقدي وفلسفي',
    zh: '分析性哲学探讨',
    ja: '分析的・哲学的考察'
  },
  'Analytical Exploration on': {
    tr: 'Üzerine Analitik Çözümleme:',
    de: 'Analytische Untersuchung zu',
    fr: 'Exploration analytique sur',
    es: 'Exploración analítica sobre',
    it: 'Esplorazione analitica su',
    ru: 'Аналитическое исследование:',
    ar: 'استكشاف تحليلي حول',
    zh: '分析性探讨：',
    ja: '分析的探求：'
  },
  'Tez:': {
    en: 'Thesis:',
    de: 'These:',
    fr: 'Thèse :',
    es: 'Tesis:',
    it: 'Tesi:',
    ru: 'Тезис:',
    ar: 'الأطروحة:',
    zh: '正题：',
    ja: 'テーゼ（定立）：'
  },
  'Antitez:': {
    en: 'Antithesis:',
    de: 'Antithese:',
    fr: 'Antithèse :',
    es: 'Antítesis:',
    it: 'Antitesi:',
    ru: 'Антитезис:',
    ar: 'النقيض:',
    zh: '反题：',
    ja: 'アンチテーゼ（反定立）：'
  },
  'Sentez (Aufhebung):': {
    en: 'Synthesis (Aufhebung):',
    de: 'Synthese (Aufhebung):',
    fr: 'Synthèse (Aufhebung) :',
    es: 'Síntesis (Aufhebung):',
    it: 'Sintesi (Aufhebung):',
    ru: 'Синтез (Aufhebung):',
    ar: 'التركيب (Aufhebung):',
    zh: '合题（扬弃）：',
    ja: 'ジンテーゼ（止揚）：'
  },
  'bağlamında kabul edilen geleneksel sezgi ve yerleşik kabuller.': {
    en: 'represents the traditional intuition and established ontological assumptions.',
    de: 'repräsentiert die traditionelle Intuition und etablierte ontologische Annahmen.',
    fr: 'représente l’intuition traditionnelle et les hypothèses ontologiques établies.',
    es: 'representa la intuición tradicional y los supuestos ontológicos establecidos.',
    it: 'rappresenta l’intuizione tradizionale e i presupposti ontologici consolidati.',
    ru: 'представляет традиционную интуицию и устоявшиеся онтологические допущения.',
    ar: 'يمثل الحدس التقليدي والافتراضات الأنطولوجية السائدة.',
    zh: '代表背景下的传统直觉与既定本体论假设。',
    ja: 'における伝統的な直観と既存の存在論的前提。'
  },
  'Fiziksel gözlemlerin ve mantıksal paradoksların ortaya çıkardığı kaçınılmaz ontolojik çelişki.': {
    en: 'The inevitable ontological contradiction revealed by physical observations and logical paradoxes.',
    de: 'Der unvermeidliche ontologische Widerspruch, der durch physikalische Beobachtungen und logische Paradoxa entsteht.',
    fr: 'La contradiction ontologique inévitable révélée par les observations physiques et les paradoxes logiques.',
    es: 'La contradicción ontológica inevitable revelada por las observaciones físicas y las paradojas lógicas.',
    it: 'L’inevitabile contraddizione ontologica rivelata dalle osservazioni fisiche e dai paradossi logici.',
    ru: 'Неизбежное онтологическое противоречие, выявленное физическими наблюдениями и логическими парадоксами.',
    ar: 'التناقض الأنطولوجي الحتمي الذي تكشف عنه الملاحظات الفيزيائية والمفارقات المنطقية.',
    zh: '物理观测与逻辑悖论所揭示的不可避免的本体论矛盾。',
    ja: '物理的観測と論理的パラドックスが暴き出す不可避の存在論的矛盾。'
  },
  'Her iki karşıtlığı daha kapsamlı bir teorik çatıda uzlaştıran üst düzey hakikat.': {
    en: 'The higher-order truth reconciling both opposites within a unified theoretical framework.',
    de: 'Die übergeordnete Wahrheit, die beide Gegensätze in einem umfassenderen theoretischen Rahmen vereint.',
    fr: 'La vérité d’ordre supérieur réconciliant les deux opposés dans un cadre théorique unifié.',
    es: 'La verdad de orden superior que reconcilia ambos opuestos en un marco teórico más amplio.',
    it: 'La verità di ordine superiore che riconcilia entrambi gli opposti in un quadro teorico unificato.',
    ru: 'Истина высшего порядка, примиряющая обе противоположности в единой теоретической структуре.',
    ar: 'الحقيقة العليا التي توفق بين النقيضين ضمن إطار نظري أشمل.',
    zh: '在更全面的理论框架内调和两种对立的高阶真理。',
    ja: '両者の対立をより包括的な理論的枠組みの中で統合する高次の真理。'
  },
  'Bu incelemede ulaşılan sonucun zıttını varsaysaydık, evren anlayışımızda hangi temel aksiyom çökerdi?': {
    en: 'If we assumed the opposite of the conclusion reached in this study, which fundamental axiom of our understanding of the universe would collapse?',
    de: 'Wenn wir das Gegenteil des in dieser Untersuchung erzielten Ergebnisses annehmen würden, welches Grundaxiom unseres Weltbildes würde zusammenbrechen?',
    fr: 'Si nous supposions le contraire de la conclusion atteinte dans cette étude, quel axiome fondamental de notre compréhension de l’univers s’effondrerait ?',
    es: 'Si asumiéramos lo contrario de la conclusión alcanzada en este estudio, ¿qué axioma fundamental de nuestra comprensión del universo colapsaría?',
    it: 'Se assumessimo il contrario della conclusione raggiunta in questo studio, quale assioma fondamentale della nostra comprensione dell’universo crollerebbe?',
    ru: 'Если бы мы предположили противоположное выводу этого исследования, какая фундаментальная аксиома нашего понимания Вселенной рухнула бы?',
    ar: 'لو افترضنا عكس النتيجة التي توصلت إليها هذه الدراسة، فأي مسلمة أساسية في فهمنا للكون ستنهار؟',
    zh: '如果我们假设本研究结论的反面成立，我们宇宙观中的哪条基本公理将会崩塌？',
    ja: 'もしこの考察で得られた結論の逆を仮定したなら、私たちの宇宙観におけるどの基本的公理が崩壊するだろうか？'
  },
  'İnsan zihninin bu olguyu kavrayış biçimi, olgunun nesnel gerçekliğini ne ölçüde sınırlar?': {
    en: 'To what extent does the human mind’s mode of comprehending this phenomenon constrain its objective reality?',
    de: 'Inwieweit begrenzt die Art und Weise, wie der menschliche Geist dieses Phänomen erfasst, dessen objektive Realität?',
    fr: 'Dans quelle mesure la façon dont l’esprit humain appréhende ce phénomène limite-t-elle sa réalité objective ?',
    es: '¿En qué medida el modo en que la mente humana comprende este fenómeno limita su realidad objetiva?',
    it: 'In che misura il modo in cui la mente umana comprende questo fenomeno ne limita la realtà oggettiva?',
    ru: 'В какой степени способ восприятия этого явления человеческим разумом ограничивает его объективную реальность?',
    ar: 'إلى أي مدى يحد نمط إدراك العقل البشري لهذه الظاهرة من حقيقتها الموضوعية؟',
    zh: '人类心灵理解这一现象的方式在多大程度上限制了该现象的客观实在性？',
    ja: '人間の精神がこの現象を把握する様式は、その客観的実在をどの程度制限しているのだろうか？'
  },
  'Bu önerme, ampirik doğrulamanın sınırlarını aşarak spekülatif bir metafiziğe kayma riski taşımaz mı?': {
    en: 'Does this proposition not risk crossing the boundaries of empirical verification into speculative metaphysics?',
    de: 'birgt diese Aussage nicht das Risiko, die Grenzen der empirischen Überprüfung zu überschreiten und in spekulative Metaphysik abzugleiten?',
    fr: 'Cette proposition ne risque-t-elle pas de dépasser les limites de la vérification empirique pour glisser vers une métaphysique spéculative ?',
    es: '¿No corre esta proposición el riesgo de cruzar los límites de la verificación empírica hacia una metafísica especulativa?',
    it: 'Questa proposizione non rischia di superare i confini della verifica empirica scivolando in una metafisica speculativa?',
    ru: 'Не рискует ли это утверждение выйти за рамки эмпирической проверки в область спекулятивной метафизики?',
    ar: 'ألا تخاطر هذه القضية بتجاوز حدود التحقق التجريبي إلى ميتافيزيقا تأملية؟',
    zh: '这一命题是否面临超越经验验证边界而滑向思辨形而上学的风险？',
    ja: 'この命題は経験的検証の限界を超えて思弁的形而上学へと逸脱するリスクを孕んでいないだろうか？'
  },
  'Tüm kuramsal modeller matematiksel tutarlılık ve modern fizik bulgularıyla temellendirilmektedir.': {
    en: 'All theoretical models are grounded in mathematical consistency and modern physical findings.',
    de: 'Alle theoretischen Modelle basieren auf mathematischer Konsistenz und Erkenntnissen der modernen Physik.',
    fr: 'Tous les modèles théoriques sont fondés sur la cohérence mathématique et les découvertes de la physique moderne.',
    es: 'Todos los modelos teóricos se fundamentan en la consistencia matemática y los hallazgos de la física moderna.',
    it: 'Tutti i modelli teorici sono fondati sulla coerenza matematica e sulle scoperte della fisica moderna.',
    ru: 'Все теоретические модели основаны на математической непротиворечивости и данных современной физики.',
    ar: 'جميع النماذج النظرية تستند إلى الاتساق الرياضي ونتائج الفيزياء الحديثة.',
    zh: '所有理论模型均建立在数学一致性与现代物理学发现的基础之上。',
    ja: 'すべての理論モデルは数学的一貫性と現代物理学の知見に基づいている。'
  }
};

// Genişletilmiş felsefi ve bilimsel terimler sözlüğü
const TERM_GLOSSARY: Record<string, Record<string, string>> = {
  'Blok Evren': { en: 'Block Universe', de: 'Blockuniversum', fr: 'Univers-Bloc', es: 'Universo Bloque', it: 'Universo a Blocchi', ru: 'Блочная Вселенная', ar: 'الكون الكتلي', zh: '块状宇宙', ja: 'ブロック宇宙' },
  'Çin Odası': { en: 'Chinese Room', de: 'Chinesisches Zimmer', fr: 'Chambre Chinoise', es: 'Habitación China', it: 'Stanza Cinese', ru: 'Китайская комната', ar: 'الغرفة الصينية', zh: '中文房间', ja: '中国語の部屋' },
  'Özgür İrade': { en: 'Free Will', de: 'Freier Wille', fr: 'Libre Arbitre', es: 'Libre Albedrío', it: 'Libero Arbitrio', ru: 'Свобода воли', ar: 'الإرادة الحرة', zh: '自由意志', ja: '自由意志' },
  'Yapay Zeka': { en: 'Artificial Intelligence', de: 'Künstliche Intelligenz', fr: 'Intelligence Artificielle', es: 'Inteligencia Artificial', it: 'Intelligenza Artificiale', ru: 'Искусственный интеллект', ar: 'الذكاء الاصطناعي', zh: '人工智能', ja: '人工知能' },
  'Solucan Delikleri': { en: 'Wormholes', de: 'Wurmlöcher', fr: 'Trous de ver', es: 'Agujeros de gusano', it: 'Wormhole', ru: 'Кротовые норы', ar: 'الثقوب الدودية', zh: '虫洞', ja: 'ワームホール' },
  'Kuantum Dolanıklık': { en: 'Quantum Entanglement', de: 'Quantenverschränkung', fr: 'Intrication Quantique', es: 'Entrelazamiento Cuántico', it: 'Entanglement Quantistico', ru: 'Квантовая запутанность', ar: 'التشابك الكمي', zh: '量子纠缠', ja: '量子もつれ' },
  'Kuantum Mekaniği': { en: 'Quantum Mechanics', de: 'Quantenmechanik', fr: 'Mécanique Quantique', es: 'Mecánica Cuántica', it: 'Meccanica Quantistica', ru: 'Квантовая механика', ar: 'ميكانيكا الكم', zh: '量子力学', ja: '量子力学' },
  'Uzay-Zaman': { en: 'Spacetime', de: 'Raumzeit', fr: 'Espace-Temps', es: 'Espacio-Tiempo', it: 'Spaziotempo', ru: 'Пространство-время', ar: 'الزمكان', zh: '时空', ja: '時空' },
  'Karadelik': { en: 'Black Hole', de: 'Schwarzes Loch', fr: 'Trou noir', es: 'Agujero negro', it: 'Buco nero', ru: 'Черная дыра', ar: 'الثقب الأسود', zh: '黑洞', ja: 'ブラックホール' },
  'Evren': { en: 'Universe', de: 'Universum', fr: 'Univers', es: 'Universo', it: 'Universo', ru: 'Вселенная', ar: 'الكون', zh: '宇宙', ja: '宇宙' },
  'Zaman': { en: 'Time', de: 'Zeit', fr: 'Temps', es: 'Tiempo', it: 'Tempo', ru: 'Время', ar: 'الزمن', zh: '时间', ja: '時間' },
  'Bilinç': { en: 'Consciousness', de: 'Bewusstsein', fr: 'Conscience', es: 'Conciencia', it: 'Coscienza', ru: 'Сознание', ar: 'الوعي', zh: '意识', ja: '意識' },
  'Zihin': { en: 'Mind', de: 'Geist', fr: 'Esprit', es: 'Mente', it: 'Mente', ru: 'Разум', ar: 'العقل', zh: '心灵', ja: '精神' },
  'Kuantum': { en: 'Quantum', de: 'Quanten', fr: 'Quantique', es: 'Cuántico', it: 'Quantistico', ru: 'Квантовый', ar: 'الكم', zh: '量子', ja: '量子' },
  'Gerçeklik': { en: 'Reality', de: 'Realität', fr: 'Réalité', es: 'Realidad', it: 'Realtà', ru: 'Реальность', ar: 'الواقع', zh: '实在', ja: '実在' },
  'Ruh': { en: 'Soul', de: 'Seele', fr: 'Âme', es: 'Alma', it: 'Anima', ru: 'Душа', ar: 'الروح', zh: '灵魂', ja: '魂' },
  'Simülasyon': { en: 'Simulation', de: 'Simulation', fr: 'Simulation', es: 'Simulación', it: 'Simulazione', ru: 'Симуляция', ar: 'المحاكاة', zh: '模拟', ja: 'シミュレーション' },
  'Bilim': { en: 'Science', de: 'Wissenschaft', fr: 'Science', es: 'Ciencia', it: 'Scienza', ru: 'Наука', ar: 'العلم', zh: '科学', ja: '科学' },
  'Felsefe': { en: 'Philosophy', de: 'Philosophie', fr: 'Philosophie', es: 'Filosofía', it: 'Filosofia', ru: 'Философия', ar: 'الفلسفة', zh: '哲学', ja: '哲学' },
  'Kozmoloji': { en: 'Cosmology', de: 'Kosmologie', fr: 'Cosmologie', es: 'Cosmología', it: 'Cosmologia', ru: 'Космология', ar: 'علم الكونيات', zh: '宇宙学', ja: '宇宙論' }
};

// Dinamik çeviri önbelleği ve reaktif abonelik sistemi
const dynamicTranslationCache = new Map<string, Article>();
const clientTextCache = new Map<string, string>();
const inFlightTextPromises = new Map<string, Promise<string>>();
const reverseTranslationMap = new Map<string, { orig: string; lang: string }>();
const inFlightArticleSlugs = new Set<string>();
const translationListeners = new Set<() => void>();

const PERSISTENT_CACHE_KEY_PREFIX = 'sciphi_fast_tr_v3_';
const loadedPersistentLangs = new Set<string>();
let persistDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const dirtyPersistentLangs = new Set<string>();

function ensurePersistentLangLoaded(lang: string) {
  if (typeof window === 'undefined' || loadedPersistentLangs.has(lang)) return;
  loadedPersistentLangs.add(lang);
  try {
    const raw = localStorage.getItem(`${PERSISTENT_CACHE_KEY_PREFIX}${lang}`);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, string>;
    if (parsed && typeof parsed === 'object') {
      for (const [orig, tr] of Object.entries(parsed)) {
        if (orig && tr) {
          clientTextCache.set(`${lang}::${orig}`, tr);
          reverseTranslationMap.set(tr, { orig, lang });
        }
      }
    }
  } catch {
    // ignore storage errors
  }
}

function schedulePersistLangCache(lang: string) {
  if (typeof window === 'undefined') return;
  dirtyPersistentLangs.add(lang);
  if (persistDebounceTimer) return;
  persistDebounceTimer = setTimeout(() => {
    persistDebounceTimer = null;
    dirtyPersistentLangs.forEach((l) => {
      try {
        const prefix = `${l}::`;
        const obj: Record<string, string> = {};
        let count = 0;
        for (const [k, v] of clientTextCache.entries()) {
          if (k.startsWith(prefix)) {
            obj[k.slice(prefix.length)] = v;
            count++;
            if (count >= 2500) break;
          }
        }
        localStorage.setItem(`${PERSISTENT_CACHE_KEY_PREFIX}${l}`, JSON.stringify(obj));
      } catch {
        // ignore quota errors
      }
    });
    dirtyPersistentLangs.clear();
  }, 600);
}

export function getOriginalSourceForTranslatedText(text: string): { orig: string; lang: string } | undefined {
  return reverseTranslationMap.get((text || '').trim());
}

export function subscribeToTranslationUpdates(listener: () => void): () => void {
  translationListeners.add(listener);
  return () => {
    translationListeners.delete(listener);
  };
}

let notifyScheduled = false;
function notifyTranslationUpdates() {
  if (notifyScheduled) return;
  notifyScheduled = true;
  queueMicrotask(() => {
    notifyScheduled = false;
    translationListeners.forEach((fn) => {
      try {
        fn();
      } catch {
        // ignore
      }
    });
  });
}

const canonicalOriginalArticles = new Map<string, Article>();

export function getCanonicalOriginalArticle(article: Article): Article {
  if (!article || !article.slug) return article;
  const existing = canonicalOriginalArticles.get(article.slug);
  if (existing) return existing;
  if (!(article as any).__isTranslatedClone) {
    canonicalOriginalArticles.set(article.slug, article);
    return article;
  }
  return article;
}

export function setCachedTranslatedArticle(slug: string, lang: string, translatedArticle: Article) {
  (translatedArticle as any).__isTranslatedClone = true;
  dynamicTranslationCache.set(`${slug}:${lang}`, translatedArticle);
  notifyTranslationUpdates();
}

export function getCachedTranslatedArticle(slug: string, lang: string): Article | undefined {
  return dynamicTranslationCache.get(`${slug}:${lang}`);
}

async function fetchSingleChunkNeuralTranslation(chunk: string, tl: string): Promise<string | null> {
  const trimmed = (chunk || '').trim();
  if (!trimmed) return chunk;

  const encodedQ = encodeURIComponent(trimmed);
  const clients = ['gtx', 'dict-chrome-ex'];

  // Fast GET when encoded query fits safely within URL limits
  if (encodedQ.length <= 1550) {
    for (const client of clients) {
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=${encodedQ}`;
        const r = await fetch(url);
        if (!r.ok) continue;
        const d = await r.json();
        if (Array.isArray(d?.[0])) {
          const translated = d[0]
            .map((s: any) => (Array.isArray(s) && s[0] ? String(s[0]) : ''))
            .join('');
          if (translated && translated.trim()) {
            return translated.trim();
          }
        }
      } catch {
        // try next client
      }
    }
  }

  // Try POST form-urlencoded for longer text
  for (const client of clients) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=${client}&sl=auto&tl=${encodeURIComponent(tl)}&dt=t`;
      const r = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: `q=${encodedQ}`
      });
      if (!r.ok) continue;
      const d = await r.json();
      if (Array.isArray(d?.[0])) {
        const translated = d[0]
          .map((s: any) => (Array.isArray(s) && s[0] ? String(s[0]) : ''))
          .join('');
        if (translated && translated.trim()) {
          return translated.trim();
        }
      }
    } catch {
      // fallback to sentence splitting below
    }
  }

  return null;
}

async function fetchClientNeuralTranslation(text: string, targetLang: string): Promise<string | null> {
  const trimmed = (text || '').trim();
  if (!trimmed) return text;
  const tl = targetLang === 'zh' ? 'zh-CN' : targetLang;

  const encodedLen = encodeURIComponent(trimmed).length;
  if (encodedLen <= 1550) {
    const direct = await fetchSingleChunkNeuralTranslation(trimmed, tl);
    if (direct) return direct;
  }

  // For long paragraphs or UTF-8 heavy strings, split by sentence boundaries so zero meaning or sentences are ever lost
  const sentences = trimmed
    .split(/(?<=[.!?।。！？;\n])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 1 && encodedLen <= 2800) {
    const postAttempt = await fetchSingleChunkNeuralTranslation(trimmed, tl);
    if (postAttempt) return postAttempt;
  }

  const subChunks: string[] = [];
  let currentSub = '';
  for (const s of sentences) {
    const candidate = currentSub ? `${currentSub} ${s}` : s;
    if (currentSub && encodeURIComponent(candidate).length > 1350) {
      subChunks.push(currentSub);
      currentSub = s;
    } else {
      currentSub = candidate;
    }
  }
  if (currentSub) {
    subChunks.push(currentSub);
  }

  if (subChunks.length === 0) return trimmed;

  const translatedParts = await Promise.all(
    subChunks.map(async (part) => {
      const tr = await fetchSingleChunkNeuralTranslation(part, tl);
      return tr || part;
    })
  );

  return translatedParts.join(' ').trim();
}

export async function translateBatchTexts(
  texts: string[],
  targetLang: string,
  onProgress?: (orig: string, translated: string) => void
): Promise<string[]> {
  if (!texts || texts.length === 0) return [];
  ensurePersistentLangLoaded(targetLang);

  const results: string[] = new Array(texts.length);
  const uniqueToIndices = new Map<string, number[]>();
  const missingUniqueTexts: string[] = [];
  const waitPromises: Promise<void>[] = [];

  for (let i = 0; i < texts.length; i++) {
    const raw = texts[i] || '';
    const trimmed = raw.trim();
    if (!trimmed) {
      results[i] = raw;
      continue;
    }
    const key = `${targetLang}::${trimmed}`;
    const hit = clientTextCache.get(key);
    if (hit !== undefined) {
      results[i] = hit;
      if (onProgress) onProgress(trimmed, hit);
      continue;
    }

    const inFlight = inFlightTextPromises.get(key);
    if (inFlight) {
      const idx = i;
      waitPromises.push(
        inFlight.then((tr) => {
          results[idx] = tr;
          if (onProgress) onProgress(trimmed, tr);
        })
      );
      continue;
    }

    const existing = uniqueToIndices.get(trimmed);
    if (existing) {
      existing.push(i);
    } else {
      uniqueToIndices.set(trimmed, [i]);
      missingUniqueTexts.push(trimmed);
    }
  }

  if (missingUniqueTexts.length === 0) {
    if (waitPromises.length > 0) await Promise.all(waitPromises);
    return results;
  }

  // Group unique strings into URL-byte-safe HTTP/2 batches (max 14 items or 1400 URL-encoded bytes per batch)
  const batches: string[][] = [];
  let currentBatch: string[] = [];
  let currentEncodedBytes = 0;

  for (const txt of missingUniqueTexts) {
    const encodedLen = encodeURIComponent(txt).length;
    if (
      currentBatch.length > 0 &&
      (currentBatch.length >= 14 || currentEncodedBytes + encodedLen > 1400)
    ) {
      batches.push(currentBatch);
      currentBatch = [txt];
      currentEncodedBytes = encodedLen;
    } else {
      currentBatch.push(txt);
      currentEncodedBytes += encodedLen + 6;
    }
  }
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  const resolvers = new Map<string, (val: string) => void>();
  for (const orig of missingUniqueTexts) {
    const key = `${targetLang}::${orig}`;
    const p = new Promise<string>((resolve) => {
      resolvers.set(orig, resolve);
    });
    inFlightTextPromises.set(key, p);
  }

  const recordTranslation = (orig: string, tr: string) => {
    const cleanTr = (tr || orig).trim();
    const key = `${targetLang}::${orig}`;
    clientTextCache.set(key, cleanTr);
    reverseTranslationMap.set(cleanTr, { orig, lang: targetLang });
    inFlightTextPromises.delete(key);

    const resolve = resolvers.get(orig);
    if (resolve) resolve(cleanTr);

    const indices = uniqueToIndices.get(orig) || [];
    for (const idx of indices) {
      results[idx] = cleanTr;
    }
    if (onProgress) {
      onProgress(orig, cleanTr);
    }
  };

  const processBatch = async (batch: string[]) => {
    if (batch.length === 1) {
      const orig = batch[0];
      const tr = await fetchClientNeuralTranslation(orig, targetLang);
      recordTranslation(orig, tr || orig);
      return;
    }

    // Join single-line items with double-newline (\n\n) so sentence tokenizer never merges lines across items
    const sanitized = batch.map((t) => t.replace(/\r?\n+/g, ' ').trim());
    const joined = sanitized.join('\n\n');
    const translatedJoined = await fetchSingleChunkNeuralTranslation(
      joined,
      targetLang === 'zh' ? 'zh-CN' : targetLang
    );

    if (translatedJoined) {
      const splitLines = translatedJoined
        .split(/\r?\n+/)
        .map((s) => s.trim())
        .filter(Boolean);

      if (splitLines.length === batch.length) {
        for (let j = 0; j < batch.length; j++) {
          recordTranslation(batch[j], splitLines[j] || batch[j]);
        }
        return;
      }
    }

    // Fallback: parallel per-item translation with full sentence-boundary protection
    await Promise.all(
      batch.map(async (orig) => {
        const tr = await fetchClientNeuralTranslation(orig, targetLang);
        recordTranslation(orig, tr || orig);
      })
    );
  };

  // Run up to 12 batches concurrently over HTTP/2 multiplexing for instant whole-site translation
  const CONCURRENCY = 12;
  const activeWorkers: Promise<void>[] = [];
  for (let i = 0; i < batches.length; i += CONCURRENCY) {
    activeWorkers.push(
      Promise.all(batches.slice(i, i + CONCURRENCY).map(processBatch)).then(() => {})
    );
  }

  await Promise.all([...activeWorkers, ...waitPromises]);
  schedulePersistLangCache(targetLang);
  return results;
}

export async function translateArticlesBatch(articles: Article[], targetLang: string): Promise<void> {
  if (!articles || articles.length === 0) return;
  ensurePersistentLangLoaded(targetLang);

  const canonicalList = articles.map((a) => getCanonicalOriginalArticle(a));

  const toTranslate = canonicalList.filter((art) => {
    const cacheKey = `${art.slug}:${targetLang}`;
    if (dynamicTranslationCache.has(cacheKey) || inFlightArticleSlugs.has(cacheKey)) {
      return false;
    }
    const native = detectArticleNativeLang(art);
    if (native === targetLang && targetLang === 'tr') {
      return false;
    }
    return true;
  });

  if (toTranslate.length === 0) return;

  toTranslate.forEach((a) => inFlightArticleSlugs.add(`${a.slug}:${targetLang}`));

  try {
    // Translate title, distinct subtitle, summary, and all tags from the canonical original article
    const batchInputs: string[] = [];
    const articleSlices: {
      titleIdx: number;
      subtitleIdx: number;
      summaryIdx: number;
      tagIndices: number[];
    }[] = [];

    toTranslate.forEach((a) => {
      const titleIdx = batchInputs.length;
      batchInputs.push(a.title || '');

      const hasDistinctSubtitle = Boolean(
        a.subtitle && a.subtitle.trim() && a.subtitle.trim() !== (a.summary || '').trim()
      );
      let subtitleIdx = -1;
      if (hasDistinctSubtitle) {
        subtitleIdx = batchInputs.length;
        batchInputs.push(a.subtitle || '');
      }

      const summaryIdx = batchInputs.length;
      batchInputs.push(a.summary || '');

      const tagIndices: number[] = [];
      (a.tags || []).forEach((tg) => {
        tagIndices.push(batchInputs.length);
        batchInputs.push(tg || '');
      });

      articleSlices.push({
        titleIdx,
        subtitleIdx,
        summaryIdx,
        tagIndices
      });
    });

    const translatedStrings = await translateBatchTexts(batchInputs, targetLang);

    toTranslate.forEach((art, idx) => {
      const cacheKey = `${art.slug}:${targetLang}`;
      const existingFull = dynamicTranslationCache.get(cacheKey);
      if (existingFull && (existingFull as any).__fullTranslated) {
        return;
      }

      const map = articleSlices[idx];
      const tTitle = translatedStrings[map.titleIdx] || art.title;
      const tSummary = translatedStrings[map.summaryIdx] || art.summary;
      const tSubtitle =
        map.subtitleIdx >= 0
          ? translatedStrings[map.subtitleIdx] || art.subtitle
          : tSummary;
      const tTags = map.tagIndices.map((ti, tPos) => translatedStrings[ti] || art.tags[tPos]);

      const base = getTranslatedArticle(art, targetLang);
      const clone: Article = {
        ...base,
        title: tTitle,
        subtitle: tSubtitle,
        summary: tSummary,
        categoryTitle: getTranslatedCategoryTitle(art.category, targetLang),
        tags: tTags
      };
      (clone as any).__isTranslatedClone = true;

      dynamicTranslationCache.set(cacheKey, clone);
    });

    notifyTranslationUpdates();
  } finally {
    toTranslate.forEach((a) => inFlightArticleSlugs.delete(`${a.slug}:${targetLang}`));
  }
}

export async function translateFullArticle(article: Article, targetLang: string): Promise<Article> {
  ensurePersistentLangLoaded(targetLang);
  const origArticle = getCanonicalOriginalArticle(article);

  const existing = getCachedTranslatedArticle(origArticle.slug, targetLang);
  if (existing && (existing as any).__fullTranslated) {
    return existing;
  }

  const native = detectArticleNativeLang(origArticle);
  if (native === targetLang && targetLang === 'tr') {
    const trNative: Article = {
      ...origArticle,
      categoryTitle: getTranslatedCategoryTitle(origArticle.category, targetLang)
    };
    return trNative;
  }

  const baseTranslated = getTranslatedArticle(origArticle, targetLang);

  try {
    // Mask all LaTeX formulas ($...$) across a string and return masked string + formula array
    const formulas: string[] = [];
    const maskFormulas = (str: string) =>
      (str || '').replace(/\$[^$\n]+\$/g, (match) => {
        const idx = formulas.length;
        formulas.push(match);
        return `(MATH_${idx})`;
      });
    const unmaskFormulas = (str: string) =>
      (str || '').replace(/\(\s*MATH\s*_\s*(\d+)\s*\)/gi, (_m, idxStr) => {
        const idx = Number(idxStr);
        return formulas[idx] !== undefined ? formulas[idx] : _m;
      });

    // Pack ALL original article fields and paragraphs into a unified batch for complete, zero-loss translation
    const allInputs: string[] = [];
    const pushInput = (s: string) => {
      const idx = allInputs.length;
      allInputs.push(maskFormulas(s || ''));
      return idx;
    };

    const titleIdx = pushInput(origArticle.title);
    const subtitleIdx = pushInput(origArticle.subtitle);
    const summaryIdx = pushInput(origArticle.summary);
    const thesisIdx = pushInput(origArticle.dialecticalTriad?.thesis || '');
    const antithesisIdx = pushInput(origArticle.dialecticalTriad?.antithesis || '');
    const synthesisIdx = pushInput(origArticle.dialecticalTriad?.synthesis || '');

    const rawParagraphs = (origArticle.content || '').split(/\n\n+/);
    const paraIndices = rawParagraphs.map((p) => (p.trim() ? pushInput(p.trim()) : -1));

    const questionIndices = (origArticle.socraticQuestions || []).map((q) => pushInput(q));
    const objectionIndices = (origArticle.objections || []).map((obj) => ({
      philosopherIdx: pushInput(obj.philosopher || ''),
      schoolIdx: pushInput(obj.school || ''),
      objectionIdx: pushInput(obj.objection || ''),
      rebuttalIdx: pushInput(obj.rebuttal || '')
    }));
    const formulaIndices = (origArticle.mathFormulations || []).map((f) => ({
      titleIdx: pushInput(f.title || ''),
      interpIdx: pushInput(f.interpretation || ''),
      domainIdx: pushInput(f.domain || '')
    }));
    const tagIndices = (origArticle.tags || []).map((tg) => pushInput(tg));

    const translatedAll = await translateBatchTexts(allInputs, targetLang);
    const readOut = (idx: number, fallback: string) =>
      idx >= 0 && translatedAll[idx] ? unmaskFormulas(translatedAll[idx]) : fallback;

    const translatedParagraphs = rawParagraphs.map((origP, i) =>
      paraIndices[i] >= 0 ? readOut(paraIndices[i], origP) : origP
    );

    const enriched: Article = {
      ...baseTranslated,
      title: readOut(titleIdx, baseTranslated.title),
      subtitle: readOut(subtitleIdx, baseTranslated.subtitle),
      summary: readOut(summaryIdx, baseTranslated.summary),
      content: translatedParagraphs.join('\n\n'),
      categoryTitle: getTranslatedCategoryTitle(origArticle.category, targetLang),
      dialecticalTriad: origArticle.dialecticalTriad
        ? {
            thesis: readOut(thesisIdx, baseTranslated.dialecticalTriad?.thesis || ''),
            antithesis: readOut(antithesisIdx, baseTranslated.dialecticalTriad?.antithesis || ''),
            synthesis: readOut(synthesisIdx, baseTranslated.dialecticalTriad?.synthesis || '')
          }
        : undefined,
      socraticQuestions: (origArticle.socraticQuestions || []).map((q, i) =>
        readOut(questionIndices[i], q)
      ),
      objections: (origArticle.objections || []).map((obj, i) => ({
        ...obj,
        philosopher: readOut(objectionIndices[i].philosopherIdx, obj.philosopher),
        school: readOut(objectionIndices[i].schoolIdx, obj.school),
        objection: readOut(objectionIndices[i].objectionIdx, obj.objection),
        rebuttal: readOut(objectionIndices[i].rebuttalIdx, obj.rebuttal)
      })),
      mathFormulations: (origArticle.mathFormulations || []).map((f, i) => ({
        ...f,
        title: readOut(formulaIndices[i].titleIdx, f.title),
        interpretation: readOut(formulaIndices[i].interpIdx, f.interpretation),
        domain: readOut(formulaIndices[i].domainIdx, f.domain)
      })),
      tags: (origArticle.tags || []).map((tg, i) => readOut(tagIndices[i], tg))
    };

    (enriched as any).__fullTranslated = true;
    (enriched as any).__isTranslatedClone = true;
    setCachedTranslatedArticle(origArticle.slug, targetLang, enriched);
    return enriched;
  } catch {
    return baseTranslated;
  }
}

export function translateTextFragment(text: string, targetLang: string): string {
  if (!text) return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  const cachedHit = clientTextCache.get(`${targetLang}::${trimmed}`);
  if (cachedHit) return cachedHit;

  // Exact standalone phrase match
  if (PHRASE_DICTIONARY[trimmed]?.[targetLang]) {
    return PHRASE_DICTIONARY[trimmed][targetLang];
  }

  // Exact standalone term match (e.g. a single tag or category label — never corrupt words inside full sentences)
  if (TERM_GLOSSARY[trimmed]?.[targetLang]) {
    return TERM_GLOSSARY[trimmed][targetLang];
  }

  let result = text;
  for (const [sourcePhrase, translations] of Object.entries(PHRASE_DICTIONARY)) {
    if (result.includes(sourcePhrase) && translations[targetLang]) {
      result = result.split(sourcePhrase).join(translations[targetLang]);
    }
  }

  return result;
}

export const SUBCATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
  'uzay-zaman-gorelilik': {
    tr: 'Uzay-Zaman, Görelilik & Blok Evren',
    en: 'Spacetime, Relativity & Block Universe',
    de: 'Raumzeit, Relativität & Blockuniversum',
    fr: 'Espace-Temps, Relativité & Univers-Bloc',
    es: 'Espacio-Tiempo, Relatividad y Universo Bloque',
    it: 'Spaziotempo, Relatività e Universo a Blocchi',
    ru: 'Пространство-время, относительность и блочная Вселенная',
    ar: 'الزمكان والنسبية والكون الكتلي',
    zh: '时空、相对论与块状宇宙',
    ja: '時空・相対性理論・ブロック宇宙'
  },
  'kuantum-gerceklik': {
    tr: 'Kuantum Mekaniği, Dolanıklık & Gözlemci',
    en: 'Quantum Mechanics, Entanglement & Observer',
    de: 'Quantenmechanik, Verschränkung & Beobachter',
    fr: 'Mécanique Quantique, Intrication & Observateur',
    es: 'Mecánica Cuántica, Entrelazamiento y Observador',
    it: 'Meccanica Quantistica, Entanglement e Osservatore',
    ru: 'Квантовая механика, запутанность и наблюдатель',
    ar: 'ميكانيكا الكم والتشابك والمراقب',
    zh: '量子力学、量子纠缠与观察者',
    ja: '量子力学・量子もつれ・観測者'
  },
  'kozmoloji-entropi': {
    tr: 'Kozmoloji, Entropi & Tekil Evren',
    en: 'Cosmology, Entropy & Singular Universe',
    de: 'Kosmologie, Entropie & Singuläres Universum',
    fr: 'Cosmologie, Entropie & Univers Singulier',
    es: 'Cosmología, Entropía y Universo Singular',
    it: 'Cosmologia, Entropia e Universo Singolare',
    ru: 'Космология, энтропия и сингулярная Вселенная',
    ar: 'علم الكونيات والإنتروبيا والكون المفرد',
    zh: '宇宙学、熵与奇点宇宙',
    ja: '宇宙論・エントロピー・特異点宇宙'
  },
  'bilinc-qualia': {
    tr: 'Bilinç Problemi, Qualia & Panpsişizm',
    en: 'Hard Problem, Qualia & Panpsychism',
    de: 'Bewusstseinsproblem, Qualia & Panpsychismus',
    fr: 'Problème Difficile, Qualia & Panpsychisme',
    es: 'Problema Difícil, Qualia y Panpsiquismo',
    it: 'Problema Difficile, Qualia e Panpsichismo',
    ru: 'Трудная проблема сознания, квалиа и панпсихизм',
    ar: 'معضلة الوعي الصعبة، الكواليا والروحانية الشاملة',
    zh: '意识难问题、感受质与泛心论',
    ja: '意識のハードプロブレム・クオリア・汎心論'
  },
  'yapay-zeka-zihin': {
    tr: 'Yapay Zihin, Semantik & Çin Odası',
    en: 'Artificial Mind, Semantics & Chinese Room',
    de: 'Künstlicher Geist, Semantik & Chinesisches Zimmer',
    fr: 'Esprit Artificiel, Sémantique & Chambre Chinoise',
    es: 'Mente Artificial, Semántica y Habitación China',
    it: 'Mente Artificiale, Semantica e Stanza Cinese',
    ru: 'Искусственный разум, семантика и Китайская комната',
    ar: 'العقل الاصطناعي والدلالات والغرفة الصينية',
    zh: '人工心智、语义学与中文房间',
    ja: '人工精神・意味論・中国語の部屋'
  },
  'ozgur-irade-benlik': {
    tr: 'Özgür İrade, Nörofelsefe & Benlik',
    en: 'Free Will, Neurophilosophy & The Self',
    de: 'Freier Wille, Neurophilosophie & Das Selbst',
    fr: 'Libre Arbitre, Neurophilosophie & Le Soi',
    es: 'Libre Albedrío, Neurofilosofía y El Yo',
    it: 'Libero Arbitrio, Neurofilosofia e Il Sé',
    ru: 'Свобода воли, нейрофилософия и Самость',
    ar: 'الإرادة الحرة والفلسفة العصبية والذات',
    zh: '自由意志、神经哲学与自我',
    ja: '自由意志・神経哲学・自己'
  },
  'bilgi-hakikat': {
    tr: 'Bilgi Kuramı, Hakikat & Kuşkuculuk',
    en: 'Theory of Knowledge, Truth & Skepticism',
    de: 'Erkenntnistheorie, Wahrheit & Skeptizismus',
    fr: 'Théorie de la Connaissance, Vérité & Scepticisme',
    es: 'Teoría del Conocimiento, Verdad y Escepticismo',
    it: 'Teoria della Conoscenza, Verità e Scetticismo',
    ru: 'Теория познания, истина и скептицизм',
    ar: 'نظرية المعرفة والحقيقة والشكوكية',
    zh: '知识论、真理与怀疑论',
    ja: '認識論・真理・懐疑論'
  },
  'bilim-felsefesi': {
    tr: 'Bilim Felsefesi, Paradigma & Yanlışlanabilirlik',
    en: 'Philosophy of Science, Paradigms & Falsifiability',
    de: 'Wissenschaftsphilosophie, Paradigmen & Falsifizierbarkeit',
    fr: 'Philosophie des Sciences, Paradigmes & Réfutabilité',
    es: 'Filosofía de la Ciencia, Paradigmas y Falsabilidad',
    it: 'Filosofia della Scienza, Paradigmi e Falsificabilità',
    ru: 'Философия науки, парадигмы и фальсифицируемость',
    ar: 'فلسفة العلوم والنماذج الإرشادية وقابلية الدحض',
    zh: '科学哲学、范式与可证伪性',
    ja: '科学哲学・パラダイム・反証可能性'
  },
  'ontoloji-metafizik': {
    tr: 'Ontoloji, Metafizik & Varlık Felsefesi',
    en: 'Ontology, Metaphysics & Philosophy of Being',
    de: 'Ontologie, Metaphysik & Seinsphilosophie',
    fr: 'Ontologie, Métaphysique & Philosophie de l’Être',
    es: 'Ontología, Metafísica y Filosofía del Ser',
    it: 'Ontologia, Metafisica e Filosofia dell’Essere',
    ru: 'Онтология, метафизика и философия бытия',
    ar: 'الأنطولوجيا والميتافيزيقا وفلسفة الوجود',
    zh: '本体论、形而上学与存在哲学',
    ja: '存在論・形而上学・存在の哲学'
  },
  'diyalektik-sentez': {
    tr: 'Diyalektik Üçleme (Tez-Antitez-Sentez)',
    en: 'Dialectical Triad (Thesis-Antithesis-Synthesis)',
    de: 'Dialektische Triade (These-Antithese-Synthese)',
    fr: 'Triade Dialectique (Thèse-Antithèse-Synthèse)',
    es: 'Tríada Dialéctica (Tesis-Antítesis-Síntesis)',
    it: 'Triade Dialettica (Tesi-Antitesi-Sintesi)',
    ru: 'Диалектическая триада (Тезис-Антитезис-Синтез)',
    ar: 'الثلاثية الجدلية (الأطروحة-النقيض-التركيب)',
    zh: '辩证三元组（正题-反题-合题）',
    ja: '弁証法的トリアーデ（テーゼ・アンチテーゼ・ジンテーゼ）'
  },
  'formel-mantik-paradoks': {
    tr: 'Formel Mantık, Gödel & Paradokslar',
    en: 'Formal Logic, Gödel & Paradoxes',
    de: 'Formale Logik, Gödel & Paradoxien',
    fr: 'Logique Formelle, Gödel & Paradoxes',
    es: 'Lógica Formal, Gödel y Paradojas',
    it: 'Logica Formale, Gödel e Paradossi',
    ru: 'Формальная логика, Гёдель и парадоксы',
    ar: 'المنطق الصوري وغودل والمفارقات',
    zh: '形式逻辑、哥德尔与悖论',
    ja: '形式論理・ゲーデル・パラドックス'
  },
  'safsata-arguman': {
    tr: 'Safsata Analizi, Retorik & Sokratik Yöntem',
    en: 'Fallacy Analysis, Rhetoric & Socratic Method',
    de: 'Trugschlussanalyse, Rhetorik & Sokratische Methode',
    fr: 'Analyse des Sophismes, Rhétorique & Méthode Socratique',
    es: 'Análisis de Falacias, Retórica y Método Socrático',
    it: 'Analisi delle Fallacie, Retorica e Metodo Socratico',
    ru: 'Анализ софизмов, риторика и сократический метод',
    ar: 'تحليل المغالطات والبلاغة والمنهج السقراطي',
    zh: '谬误分析、修辞学与苏格拉底方法',
    ja: '誤謬分析・レトリック・ソクラテス的問答法'
  },
  'yapay-zeka-etigi': {
    tr: 'Yapay Zeka Etiği & Hizalanma Problemi',
    en: 'AI Ethics & The Alignment Problem',
    de: 'KI-Ethik & Das Alignment-Problem',
    fr: 'Éthique de l’IA & Problème d’Alignement',
    es: 'Ética de la IA y El Problema de Alineación',
    it: 'Etica dell’IA e Problema dell’Allineamento',
    ru: 'Этика ИИ и проблема согласования ценностей',
    ar: 'أخلاقيات الذكاء الاصطناعي ومعضلة المحاذاة',
    zh: '人工智能伦理与对齐问题',
    ja: 'AI倫理とアライメント問題'
  },
  'transhumanizm-gelecek': {
    tr: 'Transhümanizm, Biyoetik & İnsan-Sonrası',
    en: 'Transhumanism, Bioethics & Posthumanism',
    de: 'Transhumanismus, Bioethik & Posthumanismus',
    fr: 'Transhumanisme, Bioéthique & Posthumanisme',
    es: 'Transhumanismo, Bioética y Posthumanismo',
    it: 'Transumanesimo, Bioetica e Postumanesimo',
    ru: 'Трансгуманизм, биоэтика и постгуманизм',
    ar: 'ما بعد الإنسانية والأخلاقيات الحيوية',
    zh: '超人类主义、生命伦理学与后人类',
    ja: 'トランスヒューマニズム・生命倫理・ポストヒューマン'
  },
  'varolussal-risk-toplum': {
    tr: 'Varoluşsal Riskler, Teknopolitik & Toplum',
    en: 'Existential Risks, Technopolitics & Society',
    de: 'Existenzielle Risiken, Technopolitik & Gesellschaft',
    fr: 'Risques Existentiels, Technopolitique & Société',
    es: 'Riesgos Existenciales, Tecnopolítica y Sociedad',
    it: 'Rischi Esistenziali, Tecnopolitica e Società',
    ru: 'Экзистенциальные риски, технополитика и общество',
    ar: 'المخاطر الوجودية والسياسة التقنية والمجتمع',
    zh: '生存风险、技术政治与社会',
    ja: '存亡リスク・テクノポリティクス・社会'
  }
};

export function getTranslatedSubcategoryTitle(
  subId: string,
  titleTr: string,
  titleEn: string,
  lang: string = 'tr'
): string {
  const entry = SUBCATEGORY_TRANSLATIONS[subId];
  if (entry && entry[lang]) {
    return entry[lang];
  }
  return lang === 'tr' ? titleTr : titleEn;
}

export function detectTextLang(text: string): string {
  const sample = (text || '').trim();
  if (!sample) return 'tr';
  if (/^İslam is Submission$/i.test(sample)) return 'en';

  // Non-Latin scripts
  if (/[\u0400-\u04FF]/.test(sample)) return 'ru';
  if (/[\u0600-\u06FF]/.test(sample)) return 'ar';
  if (/[\u3040-\u30FF]/.test(sample)) return 'ja';
  if (/[\u4E00-\u9FFF]/.test(sample)) return 'zh';

  // 1. Unique Turkish characters
  if (/[ğışĞİŞ]/.test(sample)) return 'tr';

  // 2. Unique Spanish markers
  if (/[¿¡ñÑ]/.test(sample)) return 'es';

  // 3. Unique German marker
  if (/[ß]/.test(sample)) return 'de';

  // 4. Unique French contractions & ligatures
  if (/[œŒæÆ]/.test(sample) || /\b(l'|d'|qu'|n'|s'|c'|j'|jusqu')/i.test(sample)) return 'fr';

  // 5. Turkish vocabulary check
  if (
    /(?:^|\s)(ve|ile|bir|bu|için|olarak|nedir|nasıl|neden|üzerine|insani|durumlar|evren|zaman|bilinç|gerçeklik|zihin|varlık|mı|mi|mu|mü|makale|felsefe|bilim|kuantum|kozmos|diyalektik|analiz|kavram|kuram|ilke|ancak|çünkü|göre|kadar|daha|çok|tüm|bütün|arasında|bağlamında|inceleme)(?=$|\s|[.,:;!?])/i.test(
      sample
    ) &&
    !/(?:^|\s)(the|and|with|from|that|this|die|der|das|und|les|des|une|dans|los|las|del|una|della|nella|degli)(?=$|\s)/i.test(sample)
  ) {
    return 'tr';
  }

  // 6. German
  if (
    /(?:^|\s)(die|der|das|und|ist|im|eine|einen|einer|einem|nicht|des|von|für|über|zum|zur|wie|warum|wenn|kann|leben|zeit|universum|menschen|schöpfer|bewusstsein|wirklichkeit|wissenschaft|philosophie|quanten|zwischen|durch|oder|auch)(?=$|\s|[.,:;!?-])/i.test(
      sample
    ) ||
    /[äÄ]/.test(sample)
  ) {
    return 'de';
  }

  // 7. Italian
  if (
    /(?:^|\s)(il|lo|gli|della|dello|delle|degli|nella|nello|nelle|negli|sulla|sullo|questo|questa|questi|queste|sono|può|essere|tempo|universo|coscienza|realtà|filosofia|scienza|tra|più|anche|perché|così)(?=$|\s|[.,:;!?'])/i.test(
      sample
    )
  ) {
    return 'it';
  }

  // 8. Spanish
  if (
    /(?:^|\s)(el|los|las|del|una|uno|por|para|como|sobre|entre|qué|cómo|está|están|son|puede|tiempo|universo|conciencia|realidad|ser|humano|filosofía|ciencia|pero|más|también|cuando|todo|esta|este)(?=$|\s|[.,:;!?])/i.test(
      sample
    ) ||
    /[áíóúÁÍÓÚ]/.test(sample)
  ) {
    return 'es';
  }

  // 9. French
  if (
    /(?:^|\s)(le|la|les|des|est|une|aucune|peut|dans|sur|avec|pour|qui|que|pas|plus|tout|nous|vous|sont|temps|univers|conscience|réalité|être|humain|philosophie|science|mais|ou|donc|comme|cette|ces|aux|du)(?=$|\s|[.,:;!?'])/i.test(
      sample
    ) ||
    /[éèêëàâùûîï]/i.test(sample)
  ) {
    return 'fr';
  }

  // 10. English
  if (
    /(?:^|\s)(the|and|of|in|to|is|are|can|does|do|how|from|on|with|for|which|if|what|why|our|we|human|time|universe|quantum|healthy|thoughts|repentance|building|matter|space|artificial|all|articles|read|search|mind|consciousness|reality|philosophy|science|between|through|without|within|this|that|these|those|by|an|as|at|be|or|not)(?=$|\s|[.,:;!?])/i.test(
      sample
    )
  ) {
    return 'en';
  }

  return 'tr';
}

export function detectArticleNativeLang(article: Article): string {
  const orig = getCanonicalOriginalArticle(article);
  const title = (orig.title || '').trim();
  const sample = `${title} ${(orig.summary || '').slice(0, 220)}`.trim();
  return detectTextLang(sample);
}

export function getTranslatedArticle(article: Article, lang: string = 'tr'): Article {
  const targetLang = lang || 'tr';
  const origArticle = getCanonicalOriginalArticle(article);

  const cached = getCachedTranslatedArticle(origArticle.slug, targetLang);
  if (cached) {
    return cached;
  }

  const nativeLang = detectArticleNativeLang(origArticle);
  if (nativeLang === targetLang && targetLang === 'tr') {
    return {
      ...origArticle,
      categoryTitle: getTranslatedCategoryTitle(origArticle.category, targetLang)
    };
  }

  const hasDistinctEn = Boolean(origArticle.titleEn && origArticle.titleEn !== origArticle.title);
  const baseTitle = targetLang === 'en' && hasDistinctEn ? origArticle.titleEn! : origArticle.title;
  const baseSubtitle = targetLang === 'en' && origArticle.subtitleEn ? origArticle.subtitleEn : origArticle.subtitle;
  const baseSummary = targetLang === 'en' && hasDistinctEn && origArticle.summaryEn ? origArticle.summaryEn : origArticle.summary;
  const baseContent = targetLang === 'en' && hasDistinctEn && origArticle.contentEn ? origArticle.contentEn : origArticle.content;

  const translatedTitle = translateTextFragment(baseTitle, targetLang);
  const translatedSubtitle = translateTextFragment(baseSubtitle, targetLang);
  const translatedSummary = translateTextFragment(baseSummary, targetLang);
  const translatedContent = translateTextFragment(baseContent, targetLang);

  const translatedTriad = origArticle.dialecticalTriad
    ? {
        thesis: translateTextFragment(
          targetLang === 'en' && origArticle.dialecticalTriad.thesisEn
            ? origArticle.dialecticalTriad.thesisEn
            : origArticle.dialecticalTriad.thesis,
          targetLang
        ),
        antithesis: translateTextFragment(
          targetLang === 'en' && origArticle.dialecticalTriad.antithesisEn
            ? origArticle.dialecticalTriad.antithesisEn
            : origArticle.dialecticalTriad.antithesis,
          targetLang
        ),
        synthesis: translateTextFragment(
          targetLang === 'en' && origArticle.dialecticalTriad.synthesisEn
            ? origArticle.dialecticalTriad.synthesisEn
            : origArticle.dialecticalTriad.synthesis,
          targetLang
        )
      }
    : undefined;

  const translatedObjections = origArticle.objections?.map((obj) => ({
    ...obj,
    philosopher: translateTextFragment(obj.philosopher, targetLang),
    school: translateTextFragment(obj.school, targetLang),
    objection: translateTextFragment(obj.objection, targetLang),
    rebuttal: translateTextFragment(obj.rebuttal, targetLang)
  }));

  const translatedQuestions = origArticle.socraticQuestions?.map((q) =>
    translateTextFragment(q, targetLang)
  );

  const translatedFormulas = origArticle.mathFormulations?.map((f) => ({
    ...f,
    title: translateTextFragment(f.title, targetLang),
    interpretation: translateTextFragment(f.interpretation, targetLang),
    domain: translateTextFragment(f.domain, targetLang)
  }));

  const fallbackClone: Article = {
    ...origArticle,
    title: translatedTitle,
    subtitle: translatedSubtitle,
    summary: translatedSummary,
    content: translatedContent,
    categoryTitle: getTranslatedCategoryTitle(origArticle.category, targetLang),
    dialecticalTriad: translatedTriad,
    objections: translatedObjections,
    socraticQuestions: translatedQuestions,
    mathFormulations: translatedFormulas,
    tags: origArticle.tags.map((tag) => translateTextFragment(tag, targetLang))
  };
  (fallbackClone as any).__isTranslatedClone = true;
  return fallbackClone;
}