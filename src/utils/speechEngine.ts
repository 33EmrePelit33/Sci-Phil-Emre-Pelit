import { useState, useEffect } from 'react';
import { Article } from '../types';
import {
  SUPPORTED_LANGUAGES,
  getCanonicalOriginalArticle,
  translateFullArticle,
  translateBatchTexts
} from './translations';

export interface SpeechEngineState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  progress: number;
  rate: number;
  lang: string;
  sourceId: string; // e.g., 'site', 'article:slug', 'card:slug'
  titleLabel: string;
  currentChunkText: string;
}

let state: SpeechEngineState = {
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  progress: 0,
  rate: 1.0,
  lang: typeof window !== 'undefined' ? localStorage.getItem('sciphi_lang') || 'tr' : 'tr',
  sourceId: '',
  titleLabel: '',
  currentChunkText: ''
};

const listeners = new Set<(s: SpeechEngineState) => void>();

function setState(partial: Partial<SpeechEngineState>) {
  state = { ...state, ...partial };
  listeners.forEach((fn) => {
    try {
      fn(state);
    } catch {
      // ignore
    }
  });
}

export function subscribeSpeechEngine(fn: (s: SpeechEngineState) => void): () => void {
  listeners.add(fn);
  fn(state);
  return () => {
    listeners.delete(fn);
  };
}

export function getSpeechEngineState(): SpeechEngineState {
  return state;
}

// Active playback session references
let activeSessionId = 0;
let currentAudio: HTMLAudioElement | null = null;
let currentChunks: string[] = [];
let currentChunkIndex = 0;
let currentRawSourceText = '';
let currentActiveArticle: Article | null = null;
let pendingRestTranslationPromise: Promise<void> | null = null;

export function cleanTextForSpeech(rawText: string): string {
  return (rawText || '')
    .replace(/###\s+/g, '')
    .replace(/##\s+/g, '')
    .replace(/#\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\$(.*?)\$/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/https?:\/\/[^\s)]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitIntoSpeechChunks(text: string, maxLen: number = 165): string[] {
  const cleaned = cleanTextForSpeech(text);
  if (!cleaned) return [];

  const rawSentences = cleaned
    .split(/(?<=[.!?।。！？;\n])\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const sentence of rawSentences) {
    if (sentence.length <= maxLen) {
      chunks.push(sentence);
    } else {
      // Split long sentence by comma or words
      const words = sentence.split(/\s+/);
      let buf = '';
      for (const w of words) {
        if ((buf + ' ' + w).trim().length > maxLen) {
          if (buf.trim()) chunks.push(buf.trim());
          buf = w;
        } else {
          buf = buf ? `${buf} ${w}` : w;
        }
      }
      if (buf.trim()) chunks.push(buf.trim());
    }
  }
  return chunks;
}

function stopInternalHardware() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.src = '';
    } catch {
      // ignore
    }
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export function stopSpeech() {
  activeSessionId += 1;
  stopInternalHardware();
  currentChunks = [];
  currentChunkIndex = 0;
  pendingRestTranslationPromise = null;
  setState({
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    progress: 0,
    currentChunkText: '',
    sourceId: ''
  });
}

export function pauseSpeech() {
  if (!state.isPlaying) return;
  if (currentAudio) {
    try {
      currentAudio.pause();
    } catch {
      // ignore
    }
  } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.pause();
    } catch {
      // ignore
    }
  }
  setState({ isPlaying: false, isPaused: true });
}

export function resumeSpeech() {
  if (!state.isPaused) return;
  if (currentAudio) {
    try {
      currentAudio.playbackRate = state.rate;
      currentAudio.play();
      setState({ isPlaying: true, isPaused: false });
      return;
    } catch {
      // fallback to playChunkAtIndex
    }
  } else if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
    try {
      window.speechSynthesis.resume();
      setState({ isPlaying: true, isPaused: false });
      return;
    } catch {
      // fallback
    }
  }
  void playChunkAtIndex(activeSessionId, currentChunkIndex);
}

export function setSpeechRate(newRate: number) {
  setState({ rate: newRate });
  if (currentAudio) {
    try {
      currentAudio.playbackRate = newRate;
    } catch {
      // ignore
    }
  }
}

function speakChunkWithWebSpeech(
  sessionId: number,
  chunk: string,
  langCode: string,
  rate: number,
  onDone: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onDone();
    return;
  }

  const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode) || SUPPORTED_LANGUAGES[0];
  const utterance = new SpeechSynthesisUtterance(chunk);
  utterance.lang = langObj.speechCode;
  utterance.rate = rate;

  const voices = window.speechSynthesis.getVoices();
  const voiceMatch =
    voices.find((v) => v.lang.toLowerCase() === langObj.speechCode.toLowerCase()) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(langObj.code.toLowerCase()));
  if (voiceMatch) {
    utterance.voice = voiceMatch;
  }

  utterance.onend = () => {
    if (sessionId !== activeSessionId) return;
    onDone();
  };
  utterance.onerror = () => {
    if (sessionId !== activeSessionId) return;
    onDone();
  };

  window.speechSynthesis.speak(utterance);
}

async function playChunkAtIndex(sessionId: number, index: number) {
  if (sessionId !== activeSessionId) return;

  // If moving past the initial fast-start chunks and background translation is still running, await it so no untranslated chunk is ever spoken
  if (index >= 3 && pendingRestTranslationPromise) {
    await pendingRestTranslationPromise;
    if (sessionId !== activeSessionId) return;
  }

  if (index >= currentChunks.length) {
    setState({
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      progress: 100,
      currentChunkText: ''
    });
    setTimeout(() => {
      if (sessionId === activeSessionId) {
        setState({ progress: 0, sourceId: '' });
      }
    }, 1800);
    return;
  }

  currentChunkIndex = index;
  const chunk = currentChunks[index];
  const pct = Math.min(99, Math.round(((index + 0.5) / currentChunks.length) * 100));

  setState({
    isPlaying: true,
    isPaused: false,
    isLoading: false,
    progress: pct,
    currentChunkText: chunk
  });

  const activeTl = state.lang === 'zh' ? 'zh-CN' : state.lang;

  // Preload next chunk in background for seamless transition
  if (index + 1 < currentChunks.length) {
    const nextChunk = currentChunks[index + 1];
    const preloadAudio = new Audio(
      `/api/tts?tl=${encodeURIComponent(activeTl)}&q=${encodeURIComponent(nextChunk)}`
    );
    preloadAudio.preload = 'auto';
  }

  const audioUrl = `/api/tts?tl=${encodeURIComponent(activeTl)}&q=${encodeURIComponent(chunk)}`;
  const audio = new Audio(audioUrl);
  audio.playbackRate = state.rate;
  currentAudio = audio;

  let handledFallback = false;
  const fallbackToBrowserSpeech = () => {
    if (handledFallback || sessionId !== activeSessionId) return;
    handledFallback = true;
    currentAudio = null;
    speakChunkWithWebSpeech(sessionId, chunk, state.lang, state.rate, () => {
      void playChunkAtIndex(sessionId, index + 1);
    });
  };

  audio.onended = () => {
    if (sessionId !== activeSessionId) return;
    void playChunkAtIndex(sessionId, index + 1);
  };

  audio.onerror = () => {
    fallbackToBrowserSpeech();
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      fallbackToBrowserSpeech();
    });
  }
}

export async function speakRawContent(
  rawText: string,
  targetLang: string,
  rate: number = state.rate,
  sourceId: string = 'site',
  titleLabel: string = ''
) {
  const sessionId = ++activeSessionId;
  stopInternalHardware();

  currentRawSourceText = rawText;
  if (!sourceId.startsWith('article:') && !sourceId.startsWith('card:')) {
    currentActiveArticle = null;
  }

  setState({
    isPlaying: false,
    isPaused: false,
    isLoading: true,
    progress: 0,
    rate,
    lang: targetLang,
    sourceId,
    titleLabel,
    currentChunkText: ''
  });

  const initialChunks = splitIntoSpeechChunks(rawText, 165);
  if (initialChunks.length === 0) {
    setState({ isLoading: false, isPlaying: false, sourceId: '' });
    return;
  }

  // Translate the first 3 chunks right away so playback starts almost immediately in targetLang
  const firstBatch = initialChunks.slice(0, 3);
  const restBatch = initialChunks.slice(3);

  const translatedFirst = await translateBatchTexts(firstBatch, targetLang);
  if (sessionId !== activeSessionId) return;

  currentChunks = [...translatedFirst, ...restBatch];

  // Translate remaining chunks in background while first chunks are playing
  if (restBatch.length > 0) {
    pendingRestTranslationPromise = translateBatchTexts(restBatch, targetLang).then((translatedRest) => {
      if (sessionId !== activeSessionId) return;
      currentChunks = [...translatedFirst, ...translatedRest];
      pendingRestTranslationPromise = null;
    });
  } else {
    pendingRestTranslationPromise = null;
  }

  void playChunkAtIndex(sessionId, 0);
}

export async function speakCardSummary(
  article: Article,
  targetLang: string,
  rate: number = state.rate
) {
  const origArticle = getCanonicalOriginalArticle(article);
  currentActiveArticle = origArticle;

  const sessionId = ++activeSessionId;
  stopInternalHardware();

  setState({
    isPlaying: false,
    isPaused: false,
    isLoading: true,
    progress: 0,
    rate,
    lang: targetLang,
    sourceId: `card:${origArticle.slug}`,
    titleLabel: origArticle.title,
    currentChunkText: ''
  });

  const inputs = [
    origArticle.title || '',
    origArticle.subtitle && origArticle.subtitle !== origArticle.summary ? origArticle.subtitle : '',
    origArticle.summary || ''
  ].filter(Boolean);

  const translatedParts = await translateBatchTexts(inputs, targetLang);
  if (sessionId !== activeSessionId) return;

  const fullCardText = translatedParts.filter(Boolean).join('. ');
  currentRawSourceText = fullCardText;
  const chunks = splitIntoSpeechChunks(fullCardText, 165);
  if (chunks.length === 0) {
    setState({ isLoading: false, isPlaying: false, sourceId: '' });
    return;
  }

  setState({ titleLabel: translatedParts[0] || origArticle.title });
  currentChunks = chunks;
  pendingRestTranslationPromise = null;
  void playChunkAtIndex(sessionId, 0);
}

export async function speakArticleContent(
  article: Article,
  targetLang: string,
  rate: number = state.rate
) {
  const origArticle = getCanonicalOriginalArticle(article);
  currentActiveArticle = origArticle;

  const sessionId = ++activeSessionId;
  stopInternalHardware();

  setState({
    isPlaying: false,
    isPaused: false,
    isLoading: true,
    progress: 0,
    rate,
    lang: targetLang,
    sourceId: `article:${origArticle.slug}`,
    titleLabel: origArticle.title,
    currentChunkText: ''
  });

  // Fetch full translated article in targetLang from canonical original source
  const translated = await translateFullArticle(origArticle, targetLang);
  if (sessionId !== activeSessionId) return;

  const parts: string[] = [
    translated.title,
    translated.subtitle && translated.subtitle !== translated.summary ? translated.subtitle : '',
    translated.summary,
    cleanTextForSpeech(translated.content)
  ];

  if (translated.dialecticalTriad) {
    parts.push(
      translated.dialecticalTriad.thesis,
      translated.dialecticalTriad.antithesis,
      translated.dialecticalTriad.synthesis
    );
  }

  if (translated.objections && translated.objections.length > 0) {
    translated.objections.forEach((o) => {
      parts.push(`${o.philosopher}: ${o.objection}. ${o.rebuttal}`);
    });
  }

  if (translated.socraticQuestions && translated.socraticQuestions.length > 0) {
    parts.push(...translated.socraticQuestions);
  }

  const fullText = parts.filter(Boolean).join('. ');
  currentRawSourceText = fullText;

  const chunks = splitIntoSpeechChunks(fullText, 165);
  if (chunks.length === 0) {
    setState({ isLoading: false, isPlaying: false, sourceId: '' });
    return;
  }

  setState({ titleLabel: translated.title });
  currentChunks = chunks;
  pendingRestTranslationPromise = null;
  void playChunkAtIndex(sessionId, 0);
}

export function extractVisiblePageText(): { text: string; title: string } {
  if (typeof document === 'undefined') return { text: '', title: 'Sci-Phi' };

  const mainEl = document.querySelector('main') || document.body;
  const headings = Array.from(
    mainEl.querySelectorAll('h1, h2, h3, h4, p, li')
  ) as HTMLElement[];

  const seen = new Set<string>();
  const collected: string[] = [];

  for (const el of headings) {
    if (el.closest('.katex, script, style, nav, select')) continue;
    const txt = (el.innerText || el.textContent || '').trim();
    if (txt.length < 4) continue;
    if (!seen.has(txt)) {
      seen.add(txt);
      collected.push(txt);
    }
    if (collected.join(' ').length > 4500) break;
  }

  const firstH1 = mainEl.querySelector('h1, h2');
  const pageTitle = (firstH1?.textContent || document.title || 'Sci-Phi').trim();

  return {
    text: collected.join('. '),
    title: pageTitle
  };
}

export async function speakEntireVisiblePage(targetLang: string, rate: number = state.rate) {
  const { text, title } = extractVisiblePageText();
  if (!text) return;
  await speakRawContent(text, targetLang, rate, 'site', title);
}

export async function switchActiveSpeechLanguage(newLang: string) {
  if (!state.isPlaying && !state.isPaused && !state.isLoading) {
    setState({ lang: newLang });
    return;
  }
  const prevSourceId = state.sourceId;
  const prevTitle = state.titleLabel;
  const prevRate = state.rate;

  if (prevSourceId.startsWith('article:') && currentActiveArticle) {
    await speakArticleContent(currentActiveArticle, newLang, prevRate);
    return;
  }

  if (prevSourceId.startsWith('card:') && currentActiveArticle) {
    await speakCardSummary(currentActiveArticle, newLang, prevRate);
    return;
  }

  if (currentRawSourceText) {
    await speakRawContent(currentRawSourceText, newLang, prevRate, prevSourceId || 'site', prevTitle);
  } else {
    await speakEntireVisiblePage(newLang, prevRate);
  }
}

export function useSpeechEngine() {
  const [engineState, setEngineState] = useState<SpeechEngineState>(getSpeechEngineState());

  useEffect(() => {
    return subscribeSpeechEngine(setEngineState);
  }, []);

  return {
    ...engineState,
    speakRawContent,
    speakCardSummary,
    speakArticleContent,
    speakEntireVisiblePage,
    pauseSpeech,
    resumeSpeech,
    stopSpeech,
    setSpeechRate,
    switchActiveSpeechLanguage
  };
}
