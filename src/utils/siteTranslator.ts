import { useEffect, useState } from 'react';
import {
  translateBatchTexts,
  getOriginalSourceForTranslatedText,
  detectTextLang
} from './translations';

interface TrackedTextNode extends Text {
  __sciphiOrigText?: string;
  __sciphiAppliedLang?: string;
  __sciphiAppliedText?: string;
}

const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'CODE',
  'PRE',
  'TEXTAREA',
  'INPUT',
  'SVG',
  'MATH'
]);

function shouldTranslateText(raw: string): boolean {
  const trimmed = raw.trim();
  if (trimmed.length < 2) return false;
  // Skip pure numbers, symbols, dates, formulas, or domain names
  if (/^[\d\s.,:%+\-*/=()[\]#@!?;•→←↑↓✓★Φγλ∞]+$/.test(trimmed)) return false;
  if (/^(https?:\/\/|sci-phi\.|emrepelit|www\.|[a-z0-9-]+\.(com|org|net|me|io|studio|app|dev))/i.test(trimmed)) {
    return false;
  }
  if (/^(ID:|DOI:|e-ISSN:|ORCID:|oai:)/i.test(trimmed)) return false;
  return true;
}

export async function translateDOMSubtree(
  root: HTMLElement | null,
  targetLang: string,
  onStatusChange?: (translating: boolean) => void
): Promise<void> {
  if (!root || typeof document === 'undefined') return;

  // 1. Walk and collect text nodes
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      if (parent.closest('.katex, .notranslate, [data-notranslate="true"], code, pre')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodesToProcess: TrackedTextNode[] = [];
  let current = walker.nextNode() as TrackedTextNode | null;
  while (current) {
    const val = current.nodeValue || '';
    if (shouldTranslateText(val)) {
      const knownReverse = getOriginalSourceForTranslatedText(val);
      if (knownReverse) {
        current.__sciphiOrigText = knownReverse.orig;
        current.__sciphiAppliedText = val;
        current.__sciphiAppliedLang = knownReverse.lang;
      } else if (
        current.__sciphiOrigText === undefined ||
        (current.__sciphiAppliedText !== undefined && val !== current.__sciphiAppliedText)
      ) {
        current.__sciphiOrigText = val;
        current.__sciphiAppliedLang = undefined;
      }
      nodesToProcess.push(current);
    }
    current = walker.nextNode() as TrackedTextNode | null;
  }

  // 2. Collect input/textarea placeholders and element title tooltips
  const placeholderElements = root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    'input[placeholder], textarea[placeholder]'
  );
  const placeholderItems: { el: HTMLInputElement | HTMLTextAreaElement; orig: string }[] = [];

  placeholderElements.forEach((el) => {
    if (el.closest('.notranslate, [data-notranslate="true"]')) return;
    const ph = (el as any).__sciphiOrigPlaceholder || el.placeholder;
    if (ph && shouldTranslateText(ph)) {
      if (!(el as any).__sciphiOrigPlaceholder) {
        (el as any).__sciphiOrigPlaceholder = ph;
      }
      placeholderItems.push({ el, orig: (el as any).__sciphiOrigPlaceholder });
    }
  });

  const titleElements = root.querySelectorAll<HTMLElement>('[title]');
  const titleItems: { el: HTMLElement; orig: string }[] = [];

  titleElements.forEach((el) => {
    if (el.classList.contains('notranslate') || el.closest('[data-notranslate="true"]')) return;
    const ttl = (el as any).__sciphiOrigTitle || el.getAttribute('title') || '';
    if (ttl && shouldTranslateText(ttl)) {
      if (!(el as any).__sciphiOrigTitle) {
        (el as any).__sciphiOrigTitle = ttl;
      }
      titleItems.push({ el, orig: (el as any).__sciphiOrigTitle });
    }
  });

  // 3. First, restore original text for any node whose original language ALREADY matches targetLang
  const pendingNodes: TrackedTextNode[] = [];
  for (const n of nodesToProcess) {
    const origText = n.__sciphiOrigText ?? n.nodeValue ?? '';
    const origLang = detectTextLang(origText);

    if (origLang === targetLang) {
      if (n.nodeValue !== origText) {
        n.nodeValue = origText;
      }
      n.__sciphiAppliedText = origText;
      n.__sciphiAppliedLang = targetLang;
    } else if (n.__sciphiAppliedLang !== targetLang) {
      pendingNodes.push(n);
    }
  }

  placeholderItems.forEach(({ el, orig }) => {
    if (detectTextLang(orig) === targetLang && el.placeholder !== orig) {
      el.placeholder = orig;
    }
  });

  titleItems.forEach(({ el, orig }) => {
    if (detectTextLang(orig) === targetLang && el.getAttribute('title') !== orig) {
      el.setAttribute('title', orig);
    }
  });

  const pendingPlaceholders = placeholderItems.filter(
    ({ orig }) => detectTextLang(orig) !== targetLang
  );
  const pendingTitles = titleItems.filter(
    ({ orig }) => detectTextLang(orig) !== targetLang
  );

  if (
    pendingNodes.length === 0 &&
    pendingPlaceholders.length === 0 &&
    pendingTitles.length === 0
  ) {
    return;
  }

  if (onStatusChange) onStatusChange(true);

  try {
    // Group pending nodes by their trimmed source string and detect whether each string appears in the visible viewport
    const textToNodesMap = new Map<string, TrackedTextNode[]>();
    const visibleStringsSet = new Set<string>();
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight || 900 : 900;

    for (const node of pendingNodes) {
      const trimmed = (node.__sciphiOrigText || node.nodeValue || '').trim();
      if (!trimmed) continue;
      let arr = textToNodesMap.get(trimmed);
      if (!arr) {
        arr = [];
        textToNodesMap.set(trimmed, arr);
      }
      arr.push(node);

      if (!visibleStringsSet.has(trimmed) && node.parentElement) {
        const rect = node.parentElement.getBoundingClientRect();
        if (rect.bottom >= -200 && rect.top <= viewportHeight + 500) {
          visibleStringsSet.add(trimmed);
        }
      }
    }

    const uniquePhTexts = Array.from(
      new Set(pendingPlaceholders.map((p) => p.orig.trim()).filter(Boolean))
    );
    uniquePhTexts.forEach((ph) => visibleStringsSet.add(ph));

    const uniqueTitleTexts = Array.from(
      new Set(pendingTitles.map((t) => t.orig.trim()).filter(Boolean))
    );

    const allUniqueNodeTexts = Array.from(textToNodesMap.keys());
    const priorityVisibleTexts = Array.from(
      new Set([
        ...allUniqueNodeTexts.filter((t) => visibleStringsSet.has(t)),
        ...uniquePhTexts
      ])
    );
    const backgroundTexts = Array.from(
      new Set([
        ...allUniqueNodeTexts.filter((t) => !visibleStringsSet.has(t)),
        ...uniqueTitleTexts
      ])
    );

    // Streaming DOM applier: updates every matching DOM node the exact millisecond its batch resolves
    const applySingleTranslation = (src: string, tr: string) => {
      if (!tr) return;
      const matchingNodes = textToNodesMap.get(src);
      if (matchingNodes) {
        for (const n of matchingNodes) {
          if (!n.isConnected) continue;
          const orig = n.__sciphiOrigText || n.nodeValue || '';
          const leadingMatch = orig.match(/^\s*/);
          const trailingMatch = orig.match(/\s*$/);
          const leading = leadingMatch ? leadingMatch[0] : '';
          const trailing = trailingMatch ? trailingMatch[0] : '';
          const finalStr = `${leading}${tr}${trailing}`;
          if (n.nodeValue !== finalStr) {
            n.nodeValue = finalStr;
          }
          n.__sciphiAppliedText = finalStr;
          n.__sciphiAppliedLang = targetLang;
        }
      }

      for (const phItem of pendingPlaceholders) {
        if (phItem.orig.trim() === src && phItem.el.isConnected) {
          if (phItem.el.placeholder !== tr) {
            phItem.el.placeholder = tr;
          }
        }
      }

      for (const tItem of pendingTitles) {
        if (tItem.orig.trim() === src && tItem.el.isConnected) {
          if (tItem.el.getAttribute('title') !== tr) {
            tItem.el.setAttribute('title', tr);
          }
        }
      }
    };

    // Wave 1: Immediately translate all visible above-the-fold strings with 12-way HTTP/2 concurrency
    if (priorityVisibleTexts.length > 0) {
      await translateBatchTexts(priorityVisibleTexts, targetLang, applySingleTranslation);
    }

    // Wave 2: Immediately stream remaining off-screen strings and tooltips
    if (backgroundTexts.length > 0) {
      await translateBatchTexts(backgroundTexts, targetLang, applySingleTranslation);
    }
  } finally {
    if (onStatusChange) onStatusChange(false);
  }
}

export async function triggerInstantSiteTranslation(targetLang: string): Promise<void> {
  if (typeof document === 'undefined') return;
  const root = document.getElementById('root');
  if (root) {
    await translateDOMSubtree(root, targetLang);
  }
}

export function useWholeSiteTranslation(lang: string, triggerKey?: string | number) {
  const [isSiteTranslating, setIsSiteTranslating] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('sciphi_lang', lang);
    } catch {
      // ignore
    }

    const root = document.getElementById('root');
    if (!root) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let isRunning = false;
    let rerunRequested = false;
    let isCancelled = false;

    const updateStatusSafe = (translating: boolean) => {
      if (isCancelled) return;
      setIsSiteTranslating((prev) => (prev === translating ? prev : translating));
    };

    const runTranslation = () => {
      if (isCancelled) return;
      if (isRunning) {
        rerunRequested = true;
        return;
      }
      isRunning = true;
      translateDOMSubtree(root, lang, updateStatusSafe).finally(() => {
        isRunning = false;
        if (rerunRequested && !isCancelled) {
          rerunRequested = false;
          setTimeout(runTranslation, 20);
        }
      });
    };

    // Initial pass with 0ms delay via queueMicrotask
    const initTimer = setTimeout(runTranslation, 0);

    // Dynamic DOM mutation listener for new elements, modals, tabs, simulators
    const observer = new MutationObserver((mutations) => {
      if (isCancelled) return;
      const hasRelevantAddition = mutations.some((m) => {
        if (m.type === 'characterData') return true;
        if (m.type !== 'childList' || m.addedNodes.length === 0) return false;
        const targetEl = m.target instanceof HTMLElement ? m.target : m.target.parentElement;
        if (targetEl && targetEl.closest('.notranslate, [data-notranslate="true"]')) {
          return false;
        }
        return true;
      });
      if (!hasRelevantAddition) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(runTranslation, 25);
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Custom force trigger listener
    const handleForceTrigger = (e: Event) => {
      if (isCancelled) return;
      const customEvent = e as CustomEvent<{ lang?: string; force?: boolean }>;
      const target = customEvent.detail?.lang || lang;
      if (customEvent.detail?.force) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode() as TrackedTextNode | null;
        while (node) {
          if (node.__sciphiAppliedLang && node.__sciphiAppliedLang !== target) {
            node.__sciphiAppliedLang = undefined;
          }
          node = walker.nextNode() as TrackedTextNode | null;
        }
      }
      translateDOMSubtree(root, target, updateStatusSafe);
    };

    window.addEventListener('sciphi:trigger-site-translation', handleForceTrigger);

    return () => {
      isCancelled = true;
      clearTimeout(initTimer);
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
      window.removeEventListener('sciphi:trigger-site-translation', handleForceTrigger);
    };
  }, [lang, triggerKey]);

  return { isSiteTranslating };
}
