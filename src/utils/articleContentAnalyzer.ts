import type {
  DialecticalTriad,
  MathFormula,
  PhilosophicalObjection
} from '../types/index.ts';

const AUTHOR_SIGNATURE_REGEX =
  /^(yazan|written by|escrito por|écrit par|geschrieben von|autor|autore|автор|بقلم|作者|著者)\s*[:：]/i;

const CLOSING_COURTESY_REGEX =
  /^(umarım anlaşılmıştır|umarım faydalı olmuştur|bu konuda düşünceleriniz değerlidir|okumamış olanlara önerim|i hope this has been understood|i hope it has been understood|en espérant avoir été compris|ich hoffe, es ist verstanden worden|espero que se haya entendido|spero che sia stato compreso|aun así, si no creen)/i;

const THESIS_MARKER_REGEX =
  /(bu yolla anlatmaya çalıştığım|yani demek istediğim|yani demeye çalıştığım|yani uzun lafın kısası|yani aslında|bu noktadan hareketle|bu kapsamda|bu bile|ben bu noktada|özetle|velhasıl|sonuç olarak|dolayısıyla|kısacası|what i am trying to convey|in other words|in short|therefore|thus|consequently|en résumé|par conséquent|autrement dit|en somme|zusammenfassend|folglich|mit anderen worten|kurz gesagt|en resumen|por lo tanto|es decir)/i;

export function splitIntoSentences(text: string): string[] {
  return String(text || '')
    .split(/(?<=[.?!…”"»])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 4);
}

export function isClosingCourtesyParagraph(p: string): boolean {
  const clean = String(p || '').trim();
  if (!clean) return true;
  if (AUTHOR_SIGNATURE_REGEX.test(clean)) return true;
  if (CLOSING_COURTESY_REGEX.test(clean) && clean.length < 210) return true;
  return false;
}

export function reconstructArticleParagraphs(
  title: string,
  rawContent: string
): {
  cleanedContent: string;
  allMerged: string[];
  substantive: string[];
} {
  const text = String(rawContent || '')
    .replace(/\r\n/g, '\n')
    .trim();

  const rawBlocks = text
    .split(/\n\s*\n/)
    .map((b) => b.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const merged: string[] = [];
  for (let i = 0; i < rawBlocks.length; i++) {
    const curr = rawBlocks[i];
    if (merged.length === 0) {
      merged.push(curr);
      continue;
    }
    const prev = merged[merged.length - 1];
    const prevEndsSentence =
      /[.?!:”"»…;]$/.test(prev) || /[.?!][”"'’)]$/.test(prev);
    const currStartsLower =
      /^[a-zçğıöşüа-яёàâäéèêëîïôöùûüÿñß]/.test(curr);
    const currIsSignature = AUTHOR_SIGNATURE_REGEX.test(curr);

    if (!currIsSignature && (!prevEndsSentence || currStartsLower)) {
      merged[merged.length - 1] = `${prev} ${curr}`;
    } else {
      merged.push(curr);
    }
  }

  // Strip repeated title from the very top of body paragraphs
  const normTitle = String(title || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');

  while (merged.length > 1 && normTitle.length > 5) {
    const firstNorm = merged[0]
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]/gu, '');

    if (
      firstNorm === normTitle ||
      (normTitle.length > 10 &&
        firstNorm.startsWith(normTitle) &&
        firstNorm.length < normTitle.length + 18)
    ) {
      merged.shift();
    } else if (merged[0].toLowerCase().startsWith(title.toLowerCase())) {
      const rest = merged[0]
        .slice(title.length)
        .replace(/^[:\s\-–—?]+/, '')
        .trim();
      if (rest.length > 25) {
        merged[0] = rest;
      } else {
        merged.shift();
      }
      break;
    } else {
      break;
    }
  }

  const substantive = merged.filter((p) => !isClosingCourtesyParagraph(p));
  const safeSubstantive = substantive.length > 0 ? substantive : merged;

  return {
    cleanedContent: merged.join('\n\n'),
    allMerged: merged,
    substantive: safeSubstantive
  };
}

export function deriveArticleMainThesisAndTriad(
  title: string,
  rawContent: string
): {
  cleanedContent: string;
  mainThesisSummary: string;
  dialecticalTriad: DialecticalTriad;
  substantiveParagraphs: string[];
} {
  const { cleanedContent, substantive } = reconstructArticleParagraphs(
    title,
    rawContent
  );
  const n = substantive.length;

  let thesis = '';
  let antithesis = '';
  let synthesis = '';
  let mainThesisSummary = '';

  if (n >= 4) {
    thesis = substantive[0];
    const lastP = substantive[n - 1];
    const prevP = substantive[n - 2];

    const combineLastTwo =
      lastP.length < 240 ||
      THESIS_MARKER_REGEX.test(prevP) ||
      /^(bu noktadan hareketle|bu bile|bu kapsamda|bu yolla|dolayısıyla|sonuç olarak|therefore|thus|par conséquent|folglich|por lo tanto)/i.test(
        lastP
      );

    if (combineLastTwo) {
      synthesis = `${prevP}\n\n${lastP}`;
      mainThesisSummary = `${prevP} ${lastP}`;
      antithesis = substantive.slice(1, n - 2).join('\n\n') || substantive[1];
    } else {
      synthesis = lastP;
      mainThesisSummary = lastP;
      antithesis = substantive.slice(1, n - 1).join('\n\n');
    }
  } else if (n === 3) {
    thesis = substantive[0];
    antithesis = substantive[1];
    synthesis = substantive[2];
    if (substantive[2].length < 180 && THESIS_MARKER_REGEX.test(substantive[1])) {
      mainThesisSummary = `${substantive[1]} ${substantive[2]}`;
    } else {
      mainThesisSummary = substantive[2];
    }
  } else if (n === 2) {
    const s0 = splitIntoSentences(substantive[0]);
    if (s0.length >= 2) {
      const splitIdx = Math.ceil(s0.length / 2);
      thesis = s0.slice(0, splitIdx).join(' ');
      antithesis = s0.slice(splitIdx).join(' ');
    } else {
      thesis = substantive[0];
      const s1 = splitIntoSentences(substantive[1]);
      antithesis = s1.length > 1 ? s1[0] : substantive[0];
    }
    synthesis = substantive[1];
    mainThesisSummary = substantive[1];
  } else {
    const single = substantive[0] || String(rawContent || title).trim();
    const sentences = splitIntoSentences(single);
    if (sentences.length >= 3) {
      const tEnd = Math.max(1, Math.floor(sentences.length / 3));
      const aEnd = Math.max(tEnd + 1, Math.floor((sentences.length * 2) / 3));
      thesis = sentences.slice(0, tEnd).join(' ');
      antithesis = sentences.slice(tEnd, aEnd).join(' ');
      synthesis = sentences.slice(aEnd).join(' ');
      mainThesisSummary = synthesis;
    } else {
      thesis = single;
      antithesis = single;
      synthesis = single;
      mainThesisSummary = single;
    }
  }

  return {
    cleanedContent,
    mainThesisSummary: mainThesisSummary.replace(/\s+/g, ' ').trim(),
    dialecticalTriad: {
      thesis: thesis.trim(),
      antithesis: antithesis.trim(),
      synthesis: synthesis.trim()
    },
    substantiveParagraphs: substantive
  };
}

export function deriveArticleSocraticQuestions(
  title: string,
  substantiveParagraphs: string[],
  dialecticalTriad: DialecticalTriad
): string[] {
  const fullText = substantiveParagraphs.join(' ');
  const sentences = splitIntoSentences(fullText);

  const questionSentences = sentences
    .filter((s) => s.includes('?') && s.length >= 25 && s.length <= 360)
    .map((s) => s.replace(/^[,;\-–—\s]+/, '').trim());

  const uniqueQuestions = Array.from(new Set(questionSentences));
  if (uniqueQuestions.length >= 2) {
    return uniqueQuestions.slice(0, 4);
  }

  const isTr =
    /[çğışİĞŞ]|\b(ve|mi|mı|mu|mü|için|olarak|nedir|nasıl|evren|insan|yaratıcı)\b/i.test(
      `${title} ${fullText}`
    );

  const fallbackQuestions: string[] = [...uniqueQuestions];
  if (isTr) {
    if (fallbackQuestions.length < 2) {
      fallbackQuestions.push(
        `"${title}" makalesinde ortaya konulan "${dialecticalTriad.synthesis.slice(0, 140)}..." ana tezinin geçerliliği, konuya dair yerleşik kabullerimizi nasıl dönüştürür?`
      );
    }
    if (fallbackQuestions.length < 2) {
      fallbackQuestions.push(
        `Makaledeki başlangıç önermesi ("${dialecticalTriad.thesis.slice(0, 120)}...") ile ulaşılan nihai sentez arasındaki diyalektik bağ hangi temel ilkeye dayanmaktadır?`
      );
    }
  } else {
    if (fallbackQuestions.length < 2) {
      fallbackQuestions.push(
        `How does the core thesis established in "${title}" ("${dialecticalTriad.synthesis.slice(0, 140)}...") transform conventional assumptions on this subject?`
      );
    }
    if (fallbackQuestions.length < 2) {
      fallbackQuestions.push(
        `What fundamental principle bridges the opening premise of "${title}" and its final dialectical synthesis?`
      );
    }
  }

  return fallbackQuestions.slice(0, 4);
}

export function deriveArticleObjections(
  title: string,
  categoryTitle: string,
  substantiveParagraphs: string[],
  dialecticalTriad: DialecticalTriad,
  indexSeed: number = 0
): PhilosophicalObjection[] {
  const isTr =
    /[çğışİĞŞ]|\b(ve|mi|mı|mu|mü|için|olarak|nedir|nasıl|evren|insan|yaratıcı)\b/i.test(
      `${title} ${substantiveParagraphs.join(' ')}`
    );

  const antithesisSentences = splitIntoSentences(dialecticalTriad.antithesis);
  const questionInAntithesis = antithesisSentences.find((s) => s.includes('?'));
  const primaryObjectionText =
    questionInAntithesis ||
    dialecticalTriad.antithesis.split('\n\n')[0] ||
    dialecticalTriad.thesis;

  const primaryRebuttalText = dialecticalTriad.synthesis;

  const objections: PhilosophicalObjection[] = [
    {
      id: `obj-${indexSeed}-1`,
      philosopher: isTr
        ? 'Karşıt Diyalektik Sorgulama'
        : 'Counter-Dialectical Inquiry',
      school: categoryTitle || (isTr ? 'Analitik İnceleme' : 'Analytical Inquiry'),
      objection: primaryObjectionText,
      rebuttal: primaryRebuttalText
    }
  ];

  if (substantiveParagraphs.length >= 3) {
    const openingQuestion = splitIntoSentences(dialecticalTriad.thesis).find((s) =>
      s.includes('?')
    );
    const secondObjectionText =
      openingQuestion && openingQuestion !== primaryObjectionText
        ? openingQuestion
        : substantiveParagraphs[0];
    const secondRebuttalText =
      substantiveParagraphs.length >= 4
        ? substantiveParagraphs[substantiveParagraphs.length - 2] +
          ' ' +
          substantiveParagraphs[substantiveParagraphs.length - 1]
        : dialecticalTriad.synthesis;

    if (secondObjectionText !== primaryObjectionText) {
      objections.push({
        id: `obj-${indexSeed}-2`,
        philosopher: isTr ? 'Temel Problem & Çözümleme' : 'Foundational Problem & Resolution',
        school: title.slice(0, 38) + (title.length > 38 ? '…' : ''),
        objection: secondObjectionText,
        rebuttal: secondRebuttalText
      });
    }
  }

  return objections;
}

const STOPWORDS_FOR_TAGS = new Set([
  'bir', 'bu', 'şu', 've', 'ile', 'için', 'de', 'da', 'ki', 'mi', 'mı', 'mu', 'mü',
  'ne', 'nedir', 'nasıl', 'neden', 'kadar', 'daha', 'çok', 'en', 'her', 'ama', 'fakat',
  'veya', 'ya', 'hem', 'ise', 'olarak', 'olan', 'olur', 'olduğu', 'var', 'yok', 'gibi',
  'üzerine', 'arasındaki', 'ilgili', 'göre', 'sonra', 'önce', 'bunun', 'onun', 'onların',
  'bizim', 'kendi', 'aynı', 'farklı', 'böyle', 'öyle', 'ancak', 'sadece', 'hatta', 'yani',
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'can', 'are', 'was', 'were', 'what',
  'how', 'why', 'when', 'who', 'which', 'into', 'upon', 'does', 'still', 'speak', 'have',
  'has', 'its', 'their', 'about', 'between', 'through', 'always', 'been', 'shall', 'remain',
  'les', 'des', 'une', 'dans', 'pour', 'sur', 'que', 'qui', 'est', 'sont', 'plus', 'avec',
  'peut', 'encore', 'parler', 'jusqu', 'niveau', 'comme', 'tout', 'tous', 'cette', 'son',
  'der', 'die', 'das', 'und', 'in', 'den', 'von', 'zu', 'mit', 'sich', 'auf', 'für', 'ist',
  'nicht', 'ein', 'eine', 'als', 'auch', 'es', 'an', 'werden', 'aus', 'er', 'hat', 'dass',
  'wenn', 'bis', 'zum', 'kann', 'man', 'dann', 'noch', 'immer', 'wird', 'bleiben', 'beweist',
  'los', 'las', 'del', 'una', 'por', 'con', 'para', 'como', 'más', 'pero', 'sus', 'sobre',
  'entre', 'hasta', 'nivel', 'puede', 'hablar', 'hecho', 'siempre', 'fue', 'así', 'qué'
]);

export function deriveArticleTagsAndSubtitle(
  title: string,
  substantiveParagraphs: string[],
  categoryTitle: string,
  existingTags?: string[]
): {
  tags: string[];
  subtitle: string;
  subtitleEn: string;
} {
  // Check if existingTags has specific tags beyond the generic ['Bilim', 'Felsefe', 'Kozmoloji']
  const genericSet = new Set(['bilim', 'felsefe', 'kozmoloji', 'science', 'philosophy', 'cosmology']);
  const customExisting = (existingTags || []).filter(
    (t) => !genericSet.has(String(t).toLowerCase().trim())
  );

  // Extract capitalized/meaningful words from title first, then from first paragraph
  const titleWords = String(title || '')
    .replace(/[^\p{L}\p{N}\s\-']/gu, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^['-]+|['-]+$/g, '').trim())
    .filter((w) => w.length >= 4 && !STOPWORDS_FOR_TAGS.has(w.toLowerCase()));

  const extractedTags: string[] = [...customExisting];
  for (const w of titleWords) {
    const capitalized = w.charAt(0).toUpperCase() + w.slice(1);
    if (
      !extractedTags.some((et) => et.toLowerCase() === capitalized.toLowerCase())
    ) {
      extractedTags.push(capitalized);
    }
    if (extractedTags.length >= 5) break;
  }

  if (categoryTitle && !extractedTags.includes(categoryTitle)) {
    extractedTags.push(categoryTitle);
  }

  const finalTags = extractedTags.slice(0, 6);
  if (finalTags.length === 0) {
    finalTags.push(categoryTitle || 'Epistemoloji');
  }

  // Build an article-specific subtitle from the opening premise sentence of the article
  const firstSentences = splitIntoSentences(substantiveParagraphs[0] || '');
  const firstSentence = firstSentences[0] || '';
  const subtitle =
    firstSentence.length >= 25 && firstSentence.length <= 165
      ? firstSentence
      : firstSentence.length > 165
      ? `${firstSentence.slice(0, 160).replace(/\s+\S*$/, '')}…`
      : `${finalTags.slice(0, 3).join(' • ')} Bağlamında Analitik ve Diyalektik İnceleme`;

  return {
    tags: finalTags,
    subtitle,
    subtitleEn: subtitle
  };
}

export function deriveArticleMathFormulations(
  category: string,
  title: string,
  cleanedContent: string,
  mainThesisSummary: string
): MathFormula[] {
  const combined = `${title} ${cleanedContent}`.toLowerCase();
  const shortThesis =
    mainThesisSummary.length > 220
      ? `${mainThesisSummary.slice(0, 215).replace(/\s+\S*$/, '')}…`
      : mainThesisSummary;

  if (
    combined.includes('beyin bilgisayar') ||
    combined.includes('brain-computer') ||
    combined.includes('cerveau-machine') ||
    combined.includes('gehirn-computer') ||
    combined.includes('cerebro-computadora') ||
    combined.includes('zihinsel özerklik') ||
    combined.includes('mental autonomy') ||
    combined.includes('autonomie mentale') ||
    combined.includes('geistiger autonomie') ||
    combined.includes('autonomía mental')
  ) {
    return [
      {
        title: 'Nöral Bilgi Sızıntısı ve Zihinsel Özerklik Sınırı (Neural Autonomy & Privacy Bound)',
        latex:
          'I(N_{\\text{raw}} ; D_{\\text{BCI}}) = H(N_{\\text{raw}}) - H(N_{\\text{raw}} \\mid D_{\\text{BCI}}) \\le \\epsilon_{\\text{autonomy}}',
        interpretation: `"${title}" makalesinin ana tezini matematiksel olarak modeller: Beyin-bilgisayar arayüzü ($D_{\\text{BCI}}$) ile nöral korteks ($N_{\\text{raw}}$) arasındaki bilgi aktarımı kritik özerklik eşiğini ($\\epsilon_{\\text{autonomy}}$) aştığında, zihinsel özerkliğin korunması tek odaklılıktan çıkıp multidisipliner bir bilinç geliştirmeye bağlıdır. (${shortThesis})`,
        domain: 'Nöro-Etik & Enformasyon Kuramı'
      }
    ];
  }

  if (combined.includes('dewitt') || combined.includes('nöronal zaman') || combined.includes('frontend') || combined.includes('backend')) {
    return [
      {
        title: 'Wheeler-DeWitt Kuantum Zamansızlık Denklemi (Quantum Timelessness Equation)',
        latex: '\\hat{\\mathcal{H}} \\Psi[h_{ij}, \\phi] = 0 \\implies \\frac{\\partial \\Psi}{\\partial t} = 0',
        interpretation: `"${title}" makalesinde vurgulandığı üzere kuantum boyutunda zaman değişkeninin ($t$) ortadan kalkmasını ve gözlenen dünyamızın (frontend) ardında zamandan bağımsız daha kapsamlı bir arka plan (backend) düzeninin bulunmasını ifade eder.`,
        domain: 'Kuantum Kozmoloji & Zaman Felsefesi'
      }
    ];
  }

  if (combined.includes('higgs')) {
    return [
      {
        title: 'Higgs Alanı Potansiyeli ve Kendiliğinden Simetri Kırılması (Higgs Potential)',
        latex: 'V(\\phi) = \\mu^2 \\phi^\\dagger \\phi + \\lambda (\\phi^\\dagger \\phi)^2, \\quad m_f = \\frac{y_f v}{\\sqrt{2}}',
        interpretation: `"${title}" makalesinde incelenen Higgs parçacığının ve enerji alanının temel parçacıklara kütle kazandırma mekanizmasını ve enerji-madde özdeşliğini temsil eder.`,
        domain: 'Yüksek Enerji ve Parçacık Fiziği'
      }
    ];
  }

  if (
    combined.includes('dolanıklılık') ||
    combined.includes('entanglement') ||
    combined.includes('intrication') ||
    combined.includes('verschränkung') ||
    combined.includes('entrelazamiento') ||
    combined.includes('çiftiyle')
  ) {
    return [
      {
        title: 'Kuantum Dolanıklılık Durumu ve Von Neumann Dolanıklılık Entropisi',
        latex: '|\\Psi^+\\rangle = \\frac{1}{\\sqrt{2}}\\left(|0\\rangle_A |1\\rangle_B + |1\\rangle_A |0\\rangle_B\\right), \\quad S(\\rho_A) = -\\text{Tr}(\\rho_A \\ln \\rho_A)',
        interpretation: `"${title}" makalesinde ele alınan uzay-zaman mesafesinin ötesindeki kuantum dolanıklılık bağını ve evrendeki varlıkların çiftler halinde birbirine bağlı olma ilkesini matematiksel olarak gösterir.`,
        domain: 'Kuantum Mekaniği & Ontoloji'
      }
    ];
  }

  if (
    combined.includes('süperpozisyon') ||
    combined.includes('superposition') ||
    combined.includes('gözlemci etkisi') ||
    combined.includes('observer effect')
  ) {
    return [
      {
        title: 'Kuantum Süperpozisyonu ve Dalga Fonksiyonu Çöküşü (Wavefunction Collapse)',
        latex: '|\\psi\\rangle = \\sum_{i} c_i |\\phi_i\\rangle, \\quad \\sum_{i} |c_i|^2 = 1 \\xrightarrow{\\text{Karar / Gözlem}} |\\phi_k\\rangle',
        interpretation: `"${title}" makalesinde incelenen; ölçüm ve iradi karar anına kadar olasılık dağılımlarının süperpozisyon halinde bulunmasını ve gözlem/karar ile belirli bir gerçeklik durumuna çökmesini modeller.`,
        domain: 'Kuantum Karar Kuramı'
      }
    ];
  }

  if (
    combined.includes('wheeler') ||
    combined.includes('planck') ||
    combined.includes('planc') ||
    combined.includes('geometrodynamics') ||
    combined.includes('kuantum köpüğü')
  ) {
    return [
      {
        title: 'Planck Ölçeği Kuantum Köpüğü ve Belirsizlik İlkesi (Planck-Scale Geometrodynamics)',
        latex: '\\ell_P = \\sqrt{\\frac{\\hbar G}{c^3}} \\approx 1.616 \\times 10^{-35}\\text{ m}, \\quad \\Delta E \\cdot \\Delta t \\ge \\frac{\\hbar}{2}',
        interpretation: `"${title}" makalesinde açıklanan Planck zaman ve uzunluk ölçeğindeki ($10^{-43}$ s, $10^{-35}$ m) sürekli parçacık-antiparçacık oluşumunu ve her an yenilenen dinamik evren yapısını gösterir.`,
        domain: 'Kuantum Geometrodinamik'
      }
    ];
  }

  if (
    combined.includes('holografik') ||
    combined.includes('holographic') ||
    combined.includes('mağara alegorisi') ||
    combined.includes('bekenstein')
  ) {
    return [
      {
        title: 'Bekenstein-Hawking Holografik Entropi Sınırı (Holographic Principle)',
        latex: 'S_{\\text{max}} = \\frac{k_B c^3 A}{4 G \\hbar}',
        interpretation: `"${title}" makalesinde kurulan; üç boyutlu bir hacimdeki tüm fiziksel bilginin onu çevreleyen iki boyutlu sınır yüzeyinde ($A$) kodlandığını gösteren holografik ilke denklemi.`,
        domain: 'Holografik Kozmoloji & Epistemoloji'
      }
    ];
  }

  if (
    combined.includes('karadelik') ||
    combined.includes('black hole') ||
    combined.includes('kuark-gluon') ||
    combined.includes('hipernova') ||
    combined.includes('madde-enerji')
  ) {
    return [
      {
        title: 'Relativistik Kütle-Enerji Eşdeğerliği ve Olay Ufku Gravitasyon İlişkisi',
        latex: 'E^2 = (pc)^2 + (m_0 c^2)^2, \\quad R_s = \\frac{2GM}{c^2}',
        interpretation: `"${title}" makalesinde analiz edilen; karadelik olay ufkunda maddenin enerjiye dönüşümü ile Büyük Patlama başlangıcındaki kuark-gluon plazması simetrisini ifade eder.`,
        domain: 'Astrofizik & Yüksek Enerji Kozmolojisi'
      }
    ];
  }

  if (
    combined.includes('kütle çekim') ||
    combined.includes('gravit') ||
    combined.includes('zamanda yolculuk') ||
    combined.includes('zaman boyutundan')
  ) {
    return [
      {
        title: 'Kütle Çekimsel Zaman Genişlemesi (Gravitational Time Dilation)',
        latex: 'd\\tau = dt \\sqrt{1 - \\frac{2GM}{r c^2}}',
        interpretation: `"${title}" makalesinde ele alınan kütle çekim alanı şiddeti ile öz-zaman ($d\\tau$) akışı arasındaki göreli bağlantıyı matematiksel olarak tanımlar.`,
        domain: 'Genel Görelilik'
      }
    ];
  }

  if (
    combined.includes('solucan') ||
    combined.includes('wormhole')
  ) {
    return [
      {
        title: 'Morris-Thorne Geçilebilir Solucan Deliği Metriği (Traversable Wormhole Metric)',
        latex: 'ds^2 = -e^{2\\Phi(r)} c^2 dt^2 + \\frac{dr^2}{1 - b(r)/r} + r^2 (d\\theta^2 + \\sin^2\\theta d\\phi^2)',
        interpretation: `"${title}" makalesinde incelenen uzay-zamanın iki bölgesini birbirine bağlayan solucan deliği boğaz geometrisini tanımlar.`,
        domain: 'Genel Görelilik'
      }
    ];
  }

  if (
    combined.includes('altın oran') ||
    combined.includes('golden ratio') ||
    combined.includes('orantısallık') ||
    combined.includes('pi sayısı')
  ) {
    return [
      {
        title: 'Kozmik Uyum ve Altın Oran Özdeşliği (Golden Ratio & Geometrical Harmony)',
        latex: '\\phi = \\frac{1 + \\sqrt{5}}{2} = 1 + \\frac{1}{1 + \\frac{1}{1 + \\dots}} \\approx 1.6180339887...',
        interpretation: `"${title}" makalesinde vurgulanan; evrenimizin yazılımında varsayılan estetik ve yapısal mihenk taşı olarak atanmış matematiksel orantısallığı temsil eder.`,
        domain: 'Matematiksel Kozmoloji'
      }
    ];
  }

  if (
    combined.includes('pre-trained') ||
    combined.includes('fıtrat') ||
    combined.includes('fitrat')
  ) {
    return [
      {
        title: 'Ön-Eğitimli (Pre-Trained) Önsel Dağılım ve Deneyimsel Güncelleme',
        latex: 'P(\\theta \\mid \\mathcal{D}) = \\frac{P(\\mathcal{D} \\mid \\theta) \\cdot P_{\\text{fıtrat}}(\\theta)}{P(\\mathcal{D})}',
        interpretation: `"${title}" makalesinde kurulan; doğuştan gelen başlangıç parametreleri ($P_{\\text{fıtrat}}(\\theta)$) ile çevresel deneyim verilerinin ($\\mathcal{D}$) sentezini gösterir.`,
        domain: 'Yapay Zeka & Epistemoloji'
      }
    ];
  }

  if (
    combined.includes('llm') ||
    combined.includes('othello-gpt') ||
    combined.includes('şuur')
  ) {
    return [
      {
        title: 'Olasılıksal Dil Modeli Koşullu Dağılımı ve Bütünleşik Bilgi (LLM & IIT)',
        latex: 'P(w_1, \\dots, w_T) = \\prod_{t=1}^{T} P(w_t \\mid w_{<t}; \\Theta), \\quad \\Phi_{\\text{irade}} = 0',
        interpretation: `"${title}" makalesinin ana tezini açıklar: Uzun kod bloklarındaki öncelik darboğazları ve koşullu olasılık genellemeleri insan davranışını taklit etse de, bu durum öznel şuur veya irade fonksiyonunun kanıtı değildir.`,
        domain: 'Bilgisayar Bilimi & Zihin Felsefesi'
      }
    ];
  }

  if (
    combined.includes('entropi') ||
    combined.includes('entropy') ||
    combined.includes('termodinamik') ||
    combined.includes('kaos') ||
    combined.includes('chaos') ||
    combined.includes('düzen')
  ) {
    return [
      {
        title: 'Boltzmann-Gibbs Entropisi ve Negentropik Düzen Oluşumu (Entropy & Order)',
        latex: 'S = -k_B \\sum_{i} p_i \\ln p_i, \\quad \\frac{dS_{\\text{toplam}}}{dt} = \\frac{d_i S}{dt} + \\frac{d_e S}{dt}',
        interpretation: `"${title}" makalesinde incelenen kaos-düzen diyalektiğini, açık sistemlerde bilgi ve enerji akışıyla korunan yapısal düzeni matematiksel olarak açıklar. (${shortThesis})`,
        domain: 'Termodinamik & Sistem Felsefesi'
      }
    ];
  }

  if (
    combined.includes('simülasyon') ||
    combined.includes('simulation') ||
    combined.includes('sanal') ||
    combined.includes('kod') ||
    combined.includes('yazılım')
  ) {
    return [
      {
        title: 'Hesaplanabilirlik Karmaşıklığı ve Ontolojik Katman İzomorfizmi (Algorithmic Ontology)',
        latex: 'K(\\mathcal{U}) = \\min_{|p|} \\{ |p| : \\mathcal{M}(p) = \\mathcal{U} \\}, \\quad \\mathcal{F}_{\\text{frontend}} = \\Pi(\\mathcal{B}_{\\text{backend}})',
        interpretation: `"${title}" makalesinde ele alınan; gözlemlenen fiziksel evrenin ($\\mathcal{F}_{\\text{frontend}}$) daha derin bir enformasyon ve kural mimarisinin ($\\mathcal{B}_{\\text{backend}}$) izdüşümü olma hipotezini modeller. (${shortThesis})`,
        domain: 'Enformasyon Ontolojisi & Hesaplama Kuramı'
      }
    ];
  }

  if (
    combined.includes('irade') ||
    combined.includes('seçim') ||
    combined.includes('karar') ||
    combined.includes('kader') ||
    combined.includes('determinizm') ||
    combined.includes('özgür')
  ) {
    return [
      {
        title: 'Nedensel Determinizm ve İradi Eylem Olasılık Dağılımı (Agency & Causal Action)',
        latex: '\\mathcal{A}(t) = \\arg\\max_{a \\in \\Omega} \\left[ \\mathbb{E}[U(a \\mid \\mathcal{H}_t)] - \\lambda D_{\\text{KL}}(P(a) \\Vert P_0(a)) \\right]',
        interpretation: `"${title}" makalesinde tartışılan geçmiş nedensel koşullar ($\\mathcal{H}_t$) ile öznenin bilinçli yönelimsel tercihi ($a \\in \\Omega$) arasındaki diyalektik dengeyi ifade eder. (${shortThesis})`,
        domain: 'Eylem Felsefesi & Karar Kuramı'
      }
    ];
  }

  if (
    combined.includes('tekil') ||
    combined.includes('singular') ||
    combined.includes('evren') ||
    combined.includes('universe') ||
    combined.includes('univers') ||
    combined.includes('universum') ||
    combined.includes('universo') ||
    combined.includes('big bang') ||
    combined.includes('büyük patlama')
  ) {
    return [
      {
        title: 'Friedmann Kozmolojik Dinamik Denklemi (Friedmann Cosmology)',
        latex: 'H^2 = \\left(\\frac{\\dot{a}}{a}\\right)^2 = \\frac{8\\pi G}{3}\\rho - \\frac{k c^2}{a^2} + \\frac{\\Lambda c^2}{3}',
        interpretation: `"${title}" makalesinde ele alınan evrensel oluşumun dinamik evrimini, başlangıç koşullarını ve kozmik düzenin matematiksel yasasını ifade eder. (${shortThesis})`,
        domain: 'Fiziksel Kozmoloji'
      }
    ];
  }

  if (category === 'zihin-bilinc') {
    return [
      {
        title: 'Bilişsel Bütünleşik Bilgi Yoğunluğu (Integrated Information Formulation)',
        latex: '\\Phi = D_{\\text{KL}}\\left( p(X_t \\mid X_{t-1}) \\;\\Vert\\; \\prod_k p(M_t^k \\mid M_{t-1}^k) \\right)',
        interpretation: `"${title}" makalesindeki zihin, bilinç ve nörobilişsel bütünlük analizini matematiksel bilgi entegrasyonu düzleminde modeller. (${shortThesis})`,
        domain: 'Zihin Felsefesi'
      }
    ];
  }

  if (category === 'diyalektik-mantik' || category === 'diyalektik') {
    return [
      {
        title: 'Diyalektik Faz Geçişi ve Niteliksel Sıçrama (Dialectical Transition)',
        latex: '\\lim_{\\Delta Q \\to Q_c} \\left( \\frac{\\partial \\Phi}{\\partial Q} \\right) = \\infty',
        interpretation: `"${title}" makalesinde ortaya konulan kavramsal dönüşümü ve diyalektik sentezi matematiksel faz geçişi olarak ifade eder. (${shortThesis})`,
        domain: 'Diyalektik Mantık'
      }
    ];
  }

  return [
    {
      title: 'Analitik Çıkarım ve Epistemik Tutarlılık Bağıntısı',
      latex: 'P(T \\mid E) = \\frac{P(E \\mid T) \\cdot P(T)}{P(E)}',
      interpretation: `"${title}" makalesindeki gözlemsel ve kavramsal öncüllerden ($E$) makalenin ana tezine ($T$) ulaşan rasyonel çıkarım yapısını modeller. (${shortThesis})`,
      domain: 'Analitik Epistemoloji'
    }
  ];
}
