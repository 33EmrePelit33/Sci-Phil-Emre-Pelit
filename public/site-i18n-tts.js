(function () {
  const LANGUAGES = [
    { code: 'tr', label: '🇹🇷 TR - Türkçe' },
    { code: 'en', label: '🇬🇧 EN - English' },
    { code: 'de', label: '🇩🇪 DE - Deutsch' },
    { code: 'fr', label: '🇫🇷 FR - Français' },
    { code: 'es', label: '🇪🇸 ES - Español' },
    { code: 'it', label: '🇮🇹 IT - Italiano' },
    { code: 'ru', label: '🇷🇺 RU - Русский' },
    { code: 'ar', label: '🇸🇦 AR - العربية' },
    { code: 'zh', label: '🇨🇳 ZH - 中文' },
    { code: 'ja', label: '🇯🇵 JA - 日本語' }
  ];

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'SELECT', 'OPTION', 'SVG']);
  const textCache = new Map();
  let currentLang = localStorage.getItem('sciphi_lang') || 'tr';
  let activeAudio = null;
  let isSpeaking = false;
  let speechSession = 0;

  function shouldTranslate(raw) {
    const t = (raw || '').trim();
    if (t.length < 2) return false;
    if (/^[\d\s.,:%+\-*/=()[\]#@!?;•→←↑↓✓★Φγλ∞]+$/.test(t)) return false;
    if (/^(https?:\/\/|sci-phi\.|emrepelit|www\.|[a-z0-9-]+\.(com|org|net|me|io|studio|app|dev))/i.test(t)) return false;
    return true;
  }

  async function translateBatch(texts, targetLang) {
    if (!texts.length) return [];
    const out = new Array(texts.length);
    const missingIdx = [];
    const missingTxt = [];

    for (let i = 0; i < texts.length; i++) {
      const k = targetLang + '::' + texts[i];
      if (textCache.has(k)) {
        out[i] = textCache.get(k);
      } else {
        missingIdx.push(i);
        missingTxt.push(texts[i]);
      }
    }

    if (!missingTxt.length) return out;

    try {
      const res = await fetch('/api/translate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: missingTxt, targetLang })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.translations)) {
          for (let j = 0; j < missingTxt.length; j++) {
            const tr = data.translations[j] || missingTxt[j];
            textCache.set(targetLang + '::' + missingTxt[j], tr);
            out[missingIdx[j]] = tr;
          }
          return out;
        }
      }
    } catch (e) {}

    return texts;
  }

  async function translatePageDOM(targetLang) {
    currentLang = targetLang;
    localStorage.setItem('sciphi_lang', targetLang);
    document.documentElement.lang = targetLang;
    document.documentElement.dir = targetLang === 'ar' ? 'rtl' : 'ltr';

    const selectEl = document.getElementById('lang-select');
    if (selectEl && selectEl.value !== targetLang) {
      selectEl.value = targetLang;
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement;
        if (!p || SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.closest('.notranslate, select')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let cur = walker.nextNode();
    while (cur) {
      const val = cur.nodeValue || '';
      if (shouldTranslate(val)) {
        if (cur.__origText === undefined || (cur.__appliedText && val !== cur.__appliedText)) {
          cur.__origText = val;
          cur.__appliedLang = undefined;
        }
        nodes.push(cur);
      }
      cur = walker.nextNode();
    }

    if (targetLang === 'tr') {
      nodes.forEach((n) => {
        if (n.__origText !== undefined) {
          n.nodeValue = n.__origText;
          n.__appliedText = n.__origText;
          n.__appliedLang = 'tr';
        }
      });
      return;
    }

    const pending = nodes.filter((n) => n.__appliedLang !== targetLang);
    if (!pending.length) return;

    const sources = pending.map((n) => (n.__origText || n.nodeValue || '').trim());
    const translated = await translateBatch(sources, targetLang);

    pending.forEach((n, idx) => {
      const orig = n.__origText || n.nodeValue || '';
      const tr = translated[idx];
      if (tr) {
        const lead = (orig.match(/^\s*/) || [''])[0];
        const trail = (orig.match(/\s*$/) || [''])[0];
        const finalStr = lead + tr + trail;
        n.nodeValue = finalStr;
        n.__appliedText = finalStr;
        n.__appliedLang = targetLang;
      }
    });
  }

  function updateListenButtonUI() {
    const btn = document.getElementById('standalone-listen-btn');
    if (!btn) return;
    btn.innerText = isSpeaking ? '⏹ Durdur / Stop' : '🔊 Dinle / Listen';
  }

  function stopSpeakingStandalone() {
    speechSession += 1;
    isSpeaking = false;
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.src = '';
      } catch (e) {}
      activeAudio = null;
    }
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    updateListenButtonUI();
  }

  async function toggleSpeakPageStandalone() {
    if (isSpeaking) {
      stopSpeakingStandalone();
      return;
    }

    const session = ++speechSession;
    isSpeaking = true;
    updateListenButtonUI();

    const els = Array.from(document.querySelectorAll('h1, h2, h3, p'));
    const seen = new Set();
    const parts = [];
    for (const el of els) {
      const txt = (el.innerText || '').trim();
      if (txt.length > 4 && !seen.has(txt)) {
        seen.add(txt);
        parts.push(txt);
      }
      if (parts.join(' ').length > 2500) break;
    }

    const fullText = parts.join('. ').replace(/\s+/g, ' ');
    const sentences = fullText
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim().slice(0, 165))
      .filter(Boolean);

    if (!sentences.length) {
      stopSpeakingStandalone();
      return;
    }

    const translatedSentences = await translateBatch(sentences, currentLang);
    if (session !== speechSession) return;

    let idx = 0;
    const playNext = () => {
      if (session !== speechSession || idx >= translatedSentences.length) {
        stopSpeakingStandalone();
        return;
      }
      const chunk = translatedSentences[idx++];
      const audio = new Audio('/api/tts?tl=' + encodeURIComponent(currentLang) + '&q=' + encodeURIComponent(chunk));
      activeAudio = audio;
      audio.onended = playNext;
      audio.onerror = playNext;
      audio.play().catch(playNext);
    };

    playNext();
  }

  window.changeLanguage = function (newLang) {
    translatePageDOM(newLang).then(() => {
      if (isSpeaking) {
        stopSpeakingStandalone();
        toggleSpeakPageStandalone();
      }
    });
  };

  window.toggleSpeakPageStandalone = toggleSpeakPageStandalone;

  window.addEventListener('DOMContentLoaded', () => {
    const selectEl = document.getElementById('lang-select');
    if (selectEl) {
      selectEl.innerHTML = LANGUAGES.map(
        (l) => `<option value="${l.code}" class="notranslate bg-slate-950 text-slate-200">${l.label}</option>`
      ).join('');
      selectEl.value = currentLang;
    }
    if (currentLang !== 'tr') {
      setTimeout(() => translatePageDOM(currentLang), 250);
    }
  });
})();
