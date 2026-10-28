import { Article } from '../types';

export interface SubcategoryDefinition {
  id: string;
  parentCategory: Article['category'];
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  keywords: string[];
}

export interface CategoryTaxonomy {
  id: Article['category'];
  code: string;
  titleTr: string;
  titleEn: string;
  subtitleTr: string;
  subtitleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  accentColor: string;
  subcategories: SubcategoryDefinition[];
}

export interface TopicRecommendation {
  id: string;
  category: Article['category'];
  categoryTitleTr: string;
  subcategoryTitleTr: string;
  titleTr: string;
  titleEn: string;
  subtitleTr: string;
  thesisTr: string;
  antithesisTr: string;
  synthesisTr: string;
  suggestedFormula: string;
  formulaDomain: string;
  whyAddTr: string;
  tags: string[];
}

export const DETAILED_TAXONOMY: CategoryTaxonomy[] = [
  {
    id: 'fizik-kozmoloji',
    code: 'I',
    titleTr: 'Fizik & Kozmoloji',
    titleEn: 'Physics & Cosmology',
    subtitleTr: 'Uzay-Zaman Ontolojisi, Kuantum Gerçeklik ve Kozmik Termodinamik',
    subtitleEn: 'Spacetime Ontology, Quantum Reality, and Cosmic Thermodynamics',
    descriptionTr:
      'Özel ve genel görelilik, blok evren (ebediyetçilik), kuantum dolanıklığı, dalga fonksiyonu çöküşü, entropi oku ve kozmolojik tekillik üzerine matematiksel ve felsefi incelemeler.',
    descriptionEn:
      'Mathematical and philosophical inquiries into relativity, the block universe, quantum entanglement, wave-function collapse, entropy, and cosmological singularity.',
    accentColor: 'amber',
    subcategories: [
      {
        id: 'uzay-zaman-gorelilik',
        parentCategory: 'fizik-kozmoloji',
        titleTr: 'Uzay-Zaman, Görelilik & Blok Evren',
        titleEn: 'Spacetime, Relativity & Block Universe',
        descriptionTr: 'Minkowski geometrisi, eşzamanlılığın göreliliği, zamanın akış illüzyonu ve 4-boyutlu manifold.',
        descriptionEn: 'Minkowski geometry, relativity of simultaneity, temporal flow illusion, and 4D manifold.',
        keywords: ['zaman', 'time', 'blok', 'block', 'görelilik', 'relativity', 'minkowski', 'einstein', 'uzay', 'space', 'temporal', 'temps', 'zeit', 'tiempo']
      },
      {
        id: 'kuantum-gerceklik',
        parentCategory: 'fizik-kozmoloji',
        titleTr: 'Kuantum Mekaniği, Dolanıklık & Gözlemci',
        titleEn: 'Quantum Mechanics, Entanglement & Observer',
        descriptionTr: 'Bell eşitsizlikleri, yerellik ilkesinin iflası, süperpozisyon, ölçüm problemi ve dalga fonksiyonu.',
        descriptionEn: 'Bell inequalities, non-locality, superposition, measurement problem, and wave function.',
        keywords: ['kuantum', 'quantum', 'dolanıklık', 'entanglement', 'bell', 'dalga', 'wave', 'gözlemci', 'observer', 'schrödinger', 'heisenberg', 'foton']
      },
      {
        id: 'kozmoloji-entropi',
        parentCategory: 'fizik-kozmoloji',
        titleTr: 'Kozmoloji, Entropi & Tekil Evren',
        titleEn: 'Cosmology, Entropy & Singular Universe',
        descriptionTr: 'Termodinamiğin ikinci yasası, entropi gradyanı, holografik ilke, kara delik enformasyonu ve evrenin tekilliği.',
        descriptionEn: 'Second law of thermodynamics, entropy gradient, holographic principle, and cosmic singularity.',
        keywords: ['evren', 'universe', 'univers', 'kozmoloji', 'cosmology', 'entropi', 'entropy', 'termokimya', 'termodinamik', 'kara delik', 'tekil', 'singular', 'big bang']
      }
    ]
  },
  {
    id: 'zihin-bilinc',
    code: 'II',
    titleTr: 'Zihin & Bilinç',
    titleEn: 'Mind & Consciousness',
    subtitleTr: 'Fenomenal Deneyim (Qualia), Nörofelsefe ve Yapay Zihin',
    subtitleEn: 'Phenomenal Experience (Qualia), Neurophilosophy, and Artificial Mind',
    descriptionTr:
      'Chalmers’ın zor bilinç problemi, qualia, bütünleşik bilgi kuramı (IIT), panpsişizm, Çin Odası argümanı, özgür irade ve benlik yanılsaması üzerine derinlikli analizler.',
    descriptionEn:
      'In-depth analyses of the hard problem of consciousness, qualia, Integrated Information Theory (IIT), panpsychism, the Chinese Room, and free will.',
    accentColor: 'purple',
    subcategories: [
      {
        id: 'bilinc-qualia',
        parentCategory: 'zihin-bilinc',
        titleTr: 'Bilinç Problemi, Qualia & Panpsişizm',
        titleEn: 'Hard Problem, Qualia & Panpsychism',
        descriptionTr: 'Öznel deneyimin (qualia) fiziksel süreçlerden türeyişi, bütünleşik bilgi (Phi) ve fenomenal bilinç.',
        descriptionEn: 'Emergence of subjective experience from physical processes, Integrated Information (Phi), and phenomenal consciousness.',
        keywords: ['bilinç', 'consciousness', 'qualia', 'chalmers', 'nagel', 'panpsişizm', 'panpsychism', 'öznel', 'subjective', 'fenomenal', 'deneyim']
      },
      {
        id: 'yapay-zeka-zihin',
        parentCategory: 'zihin-bilinc',
        titleTr: 'Yapay Zihin, Semantik & Çin Odası',
        titleEn: 'Artificial Mind, Semantics & Chinese Room',
        descriptionTr: 'Sentaks ve semantik ayrımı, Searle’ün Çin Odası, Turing testi ve silikon tabanlı zihin olasılığı.',
        descriptionEn: 'Syntax vs. semantics, Searle’s Chinese Room, Turing test, and silicon-based cognition.',
        keywords: ['çin odası', 'chinese room', 'searle', 'yapay', 'artificial', 'sentaks', 'semantik', 'simülasyon', 'algoritma', 'turing', 'biliş']
      },
      {
        id: 'ozgur-irade-benlik',
        parentCategory: 'zihin-bilinc',
        titleTr: 'Özgür İrade, Nörofelsefe & Benlik',
        titleEn: 'Free Will, Neurophilosophy & The Self',
        descriptionTr: 'Nöronal determinizm, Libet deneyleri, karar mekanizmaları, hafıza ve benlik kurgusu.',
        descriptionEn: 'Neural determinism, Libet experiments, agency, memory, and the construction of self.',
        keywords: ['özgür irade', 'free will', 'nöron', 'beyin', 'brain', 'benlik', 'self', 'ego', 'algı', 'perception', 'zihin', 'mind']
      }
    ]
  },
  {
    id: 'epistemoloji',
    code: 'III',
    titleTr: 'Epistemoloji & Felsefe',
    titleEn: 'Epistemology & Philosophy',
    subtitleTr: 'Bilginin Sınırları, Bilim Felsefesi ve Metafiziksel Hakikat',
    subtitleEn: 'Limits of Knowledge, Philosophy of Science, and Metaphysical Truth',
    descriptionTr:
      'İnsan bilgisinin doğası, kuşkuculuk, Popper’ın yanlışlanabilirlik ilkesi, Kuhn’un paradigma değişimleri, Bayesçi epistemoloji ve gerçekliğin ontolojik temelleri.',
    descriptionEn:
      'The nature of human knowledge, skepticism, Popperian falsifiability, Kuhnian paradigm shifts, Bayesian epistemology, and ontological foundations.',
    accentColor: 'sky',
    subcategories: [
      {
        id: 'bilgi-hakikat',
        parentCategory: 'epistemoloji',
        titleTr: 'Bilgi Kuramı, Hakikat & Kuşkuculuk',
        titleEn: 'Theory of Knowledge, Truth & Skepticism',
        descriptionTr: 'Gerekçelendirilmiş doğru inanç, Gettier problemi, radikal kuşkuculuk ve Bayesçi inanç güncellemesi.',
        descriptionEn: 'Justified true belief, Gettier problem, radical skepticism, and Bayesian belief updating.',
        keywords: ['bilgi', 'knowledge', 'hakikat', 'truth', 'epistemoloji', 'epistemology', 'kuşkuculuk', 'skepticism', 'inanç', 'belief', 'bayes']
      },
      {
        id: 'bilim-felsefesi',
        parentCategory: 'epistemoloji',
        titleTr: 'Bilim Felsefesi, Paradigma & Yanlışlanabilirlik',
        titleEn: 'Philosophy of Science, Paradigms & Falsifiability',
        descriptionTr: 'Karl Popper, Thomas Kuhn, bilimsel devrimlerin yapısı, tümevarım sorunu ve metodoloji.',
        descriptionEn: 'Karl Popper, Thomas Kuhn, structure of scientific revolutions, problem of induction, and methodology.',
        keywords: ['bilim', 'science', 'popper', 'kuhn', 'paradigma', 'yanlışlanabilirlik', 'falsifiability', 'teori', 'theory', 'deney', 'hipotez']
      },
      {
        id: 'ontoloji-metafizik',
        parentCategory: 'epistemoloji',
        titleTr: 'Ontoloji, Metafizik & Varlık Felsefesi',
        titleEn: 'Ontology, Metaphysics & Philosophy of Being',
        descriptionTr: 'Varlığın temel kategorileri, nedensellik, olumsallık, zorunluluk ve matematiksel platonizm.',
        descriptionEn: 'Fundamental categories of being, causality, contingency, necessity, and mathematical Platonism.',
        keywords: ['ontoloji', 'ontology', 'metafizik', 'metaphysics', 'varlık', 'being', 'gerçeklik', 'reality', 'platon', 'kant', 'nedensellik']
      }
    ]
  },
  {
    id: 'diyalektik-mantik',
    code: 'IV',
    titleTr: 'Diyalektik & Mantık',
    titleEn: 'Dialectics & Logic',
    subtitleTr: 'Tez-Antitez-Sentez Dinamiği, Formel Mantık ve Paradokslar',
    subtitleEn: 'Thesis-Antithesis-Synthesis Dynamics, Formal Logic, and Paradoxes',
    descriptionTr:
      'Hegelci diyalektik yöntem, karşıtların birliği, Gödel’in eksiklik teoremleri, öz-referans paradoksları, safsata analizi ve Sokratik çürütme (elenchus) mimarisi.',
    descriptionEn:
      'Hegelian dialectic method, unity of opposites, Gödel’s incompleteness theorems, self-reference paradoxes, fallacy analysis, and Socratic elenchus.',
    accentColor: 'emerald',
    subcategories: [
      {
        id: 'diyalektik-sentez',
        parentCategory: 'diyalektik-mantik',
        titleTr: 'Diyalektik Üçleme (Tez-Antitez-Sentez)',
        titleEn: 'Dialectical Triad (Thesis-Antithesis-Synthesis)',
        descriptionTr: 'Hegel diyalektiği, Aufhebung (aşarak koruma), çelişkinin ontolojik motoru ve tarihsel süreç.',
        descriptionEn: 'Hegelian dialectics, Aufhebung (sublation), ontological engine of contradiction, and historical process.',
        keywords: ['diyalektik', 'dialectic', 'hegel', 'tez', 'antitez', 'sentez', 'synthesis', 'çelişki', 'contradiction', 'aufhebung']
      },
      {
        id: 'formel-mantik-paradoks',
        parentCategory: 'diyalektik-mantik',
        titleTr: 'Formel Mantık, Gödel & Paradokslar',
        titleEn: 'Formal Logic, Gödel & Paradoxes',
        descriptionTr: 'Gödel’in eksiklik teoremi, Russell paradoksu, Tarski doğruluk tanımsızlığı ve aksiyomatik sınırlar.',
        descriptionEn: 'Gödel’s incompleteness theorem, Russell’s paradox, Tarski’s undefinability, and axiomatic limits.',
        keywords: ['gödel', 'mantık', 'logic', 'paradoks', 'paradox', 'russell', 'aksiyom', 'teorem', 'formel', 'matematik', 'sonsuz']
      },
      {
        id: 'safsata-arguman',
        parentCategory: 'diyalektik-mantik',
        titleTr: 'Safsata Analizi, Retorik & Sokratik Yöntem',
        titleEn: 'Fallacy Analysis, Rhetoric & Socratic Method',
        descriptionTr: 'Mantıksal safsatalar, Sokratik sorgulama (elenchus), argüman geçerliliği ve eleştirel akıl yürütme.',
        descriptionEn: 'Logical fallacies, Socratic questioning (elenchus), argument validity, and critical reasoning.',
        keywords: ['safsata', 'fallacy', 'sokrat', 'socratic', 'argüman', 'argument', 'retorik', 'eleştirel', 'muhakeme', 'diyalog']
      }
    ]
  },
  {
    id: 'etik-teknoloji',
    code: 'V',
    titleTr: 'Etik & Teknoloji',
    titleEn: 'Ethics & Technology',
    subtitleTr: 'Yapay Zeka Etiği, Transhümanizm ve Dijital Çağda İnsanlık',
    subtitleEn: 'AI Ethics, Transhumanism, and Humanity in the Digital Age',
    descriptionTr:
      'Üretken yapay zeka ve süper-zeka hizalanma problemi, algoritmik determinizm, gözetim kapitalizmi, transhümanizm, biyoetik ve varoluşsal riskler üzerine felsefi incelemeler.',
    descriptionEn:
      'Philosophical investigations into AI alignment, algorithmic determinism, surveillance capitalism, transhumanism, bioethics, and existential risks.',
    accentColor: 'rose',
    subcategories: [
      {
        id: 'yapay-zeka-etigi',
        parentCategory: 'etik-teknoloji',
        titleTr: 'Yapay Zeka Etiği & Hizalanma Problemi',
        titleEn: 'AI Ethics & The Alignment Problem',
        descriptionTr: 'Otonom sistemlerin ahlaki statüsü, değer hizalanması (value alignment) ve algoritmik adalet.',
        descriptionEn: 'Moral status of autonomous systems, value alignment, and algorithmic justice.',
        keywords: ['yapay zeka', 'ai', 'etik', 'ethics', 'algoritma', 'otonom', 'hizalanma', 'alignment', 'ahlak', 'moral', 'adalet']
      },
      {
        id: 'transhumanizm-gelecek',
        parentCategory: 'etik-teknoloji',
        titleTr: 'Transhümanizm, Biyoetik & İnsan-Sonrası',
        titleEn: 'Transhumanism, Bioethics & Posthumanism',
        descriptionTr: 'Bilişsel güçlendirme, nöroteknoloji, ölümsüzlük arayışı, siborg ontolojisi ve insan doğasının dönüşümü.',
        descriptionEn: 'Cognitive enhancement, neurotechnology, longevity, cyborg ontology, and transformation of human nature.',
        keywords: ['transhümanizm', 'transhumanism', 'biyoetik', 'bioethics', 'genetik', 'nöroteknoloji', 'insan', 'human', 'evrim', 'gelecek']
      },
      {
        id: 'varolussal-risk-toplum',
        parentCategory: 'etik-teknoloji',
        titleTr: 'Varoluşsal Riskler, Teknopolitik & Toplum',
        titleEn: 'Existential Risks, Technopolitics & Society',
        descriptionTr: 'Teknolojik tekillik, dijital yabancılaşma, enformasyon ekosistemi ve medeniyetin geleceği.',
        descriptionEn: 'Technological singularity, digital alienation, information ecosystem, and future of civilization.',
        keywords: ['teknoloji', 'technology', 'toplum', 'society', 'risk', 'dijital', 'digital', 'medeniyet', 'özgürlük', 'kültür', 'yabancılaşma']
      }
    ]
  }
];

/**
 * Deterministically assigns each article to its most fitting detailed subcategory
 * within its main category.
 */
export function resolveArticleSubcategory(article: Article): SubcategoryDefinition {
  const categoryTax =
    DETAILED_TAXONOMY.find((c) => c.id === article.category) || DETAILED_TAXONOMY[0];
  const subs = categoryTax.subcategories;

  // Match primarily on title and subtitle to avoid generic boilerplate words in summary
  const titleHaystack = [
    article.title,
    article.titleEn,
    article.subtitle,
    article.subtitleEn
  ]
    .join(' ')
    .toLowerCase();

  let bestSub = subs[0];
  let bestScore = 0;

  for (let i = 0; i < subs.length; i++) {
    const sub = subs[i];
    let score = 0;
    for (const kw of sub.keywords) {
      const kwLower = kw.toLowerCase();
      if (kwLower.length > 4 && titleHaystack.includes(kwLower)) {
        score += 4;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestSub = sub;
    }
  }

  // Deterministic distribution across the 3 subcategories when title is in another language or general
  if (bestScore <= 4) {
    let hash = 0;
    for (let i = 0; i < article.slug.length; i++) {
      hash = (hash * 31 + article.slug.charCodeAt(i)) >>> 0;
    }
    bestSub = subs[hash % subs.length];
  }

  return bestSub;
}

/**
 * Curated High-Impact New Topic Recommendations for Emre Pelit's Sci-Phi Portal
 */
export const TOPIC_RECOMMENDATIONS: TopicRecommendation[] = [
  // ==========================================================================
  // I. FİZİK & KOZMOLOJİ (3 Öneri)
  // ==========================================================================
  {
    id: 'rec-holografik-uzay-zaman',
    category: 'fizik-kozmoloji',
    categoryTitleTr: 'Fizik & Kozmoloji',
    subcategoryTitleTr: 'Kozmoloji, Entropi & Tekil Evren',
    titleTr: 'AdS/CFT Yazışması ve Holografik Evren: Kütleçekimi Kuantum Dolanıklığından mı Doğar?',
    titleEn: 'AdS/CFT Correspondence and the Holographic Universe: Does Gravity Emerge from Quantum Entanglement?',
    subtitleTr: 'Maldacena Dualitesi, Ryu-Takayanagi Formülü ve Uzay-Zamanın Kuantum Enformasyon Dokusu',
    thesisTr: 'Klasik Genel Görelilik: Uzay-zaman ve kütleçekimi evrenin en temel, indirgenemez geometrik arka planıdır.',
    antithesisTr: 'Kuantum Alan Kuramı: Temel gerçeklik ayrık kuantum alanları ve dolanıklık durumlarından ibarettir; sürekli geometri Planck ölçeğinde çöker.',
    synthesisTr: 'ER=EPR ve Beliren Uzay-Zaman (Emergent Spacetime): Uzay-zaman geometrisi temel değil, sınır yüzeydeki kuantum bitlerinin (qubit) dolanıklık entropisinden doğan holografik bir projeksiyondur.',
    suggestedFormula: 'S_A = \\frac{\\text{Area}(\\gamma_A)}{4 G_N \\hbar}',
    formulaDomain: 'Holografik Kuantum Kütleçekimi (Ryu-Takayanagi)',
    whyAddTr: 'Blok Evren ve Kuantum Dolanıklığı makalelerinizi doğrudan birbirine bağlayan en güçlü modern fizik köprüsüdür.',
    tags: ['Holografik İlke', 'AdS/CFT', 'Ryu-Takayanagi', 'Beliren Uzay-Zaman', 'ER=EPR']
  },
  {
    id: 'rec-zaman-kristalleri-simetri',
    category: 'fizik-kozmoloji',
    categoryTitleTr: 'Fizik & Kozmoloji',
    subcategoryTitleTr: 'Uzay-Zaman, Görelilik & Blok Evren',
    titleTr: 'Zaman Kristalleri ve Zaman Öteleme Simetrisinin Kendiliğinden Kırılması',
    titleEn: 'Time Crystals and Spontaneous Breaking of Time-Translation Symmetry',
    subtitleTr: 'Frank Wilczek’in Öngörüsü, Noether Teoremi ve Enerji Harcamadan Salınan Kuantum Fazları',
    thesisTr: 'Termodinamik Denge: En düşük enerji durumundaki (taban durum) bir sistem zamana bağlı periyodik hareket yapamaz.',
    antithesisTr: 'Zaman Kristalleri: Uzaysal kristallerin uzay simetrisini kırması gibi, kuantum çok-parçacıklı sistemler de zaman öteleme simetrisini kırarak taban durumunda periyodik ritim üretebilir.',
    synthesisTr: 'Denge-Dışı Kuantum Zamansallığı: Zaman yalnızca pasif bir koordinat değil, maddenin topolojik fazlarıyla etkileşime giren dinamik bir simetri alanıdır.',
    suggestedFormula: '\\langle \\psi(t + T) | \\hat{O} | \\psi(t + T) \\rangle = \\langle \\psi(t) | \\hat{O} | \\psi(t) \\rangle',
    formulaDomain: 'Yoğun Madde Fiziği & Noether Simetrisi',
    whyAddTr: 'Zaman felsefesi külliyatınıza modern kuantum fiziğinin en çarpıcı deneysel keşiflerinden birini ekler.',
    tags: ['Zaman Kristalleri', 'Frank Wilczek', 'Noether Teoremi', 'Simetri Kırılması', 'Kuantum Fazı']
  },
  {
    id: 'rec-wheeler-dewitt-zamansizlik',
    category: 'fizik-kozmoloji',
    categoryTitleTr: 'Fizik & Kozmoloji',
    subcategoryTitleTr: 'Uzay-Zaman, Görelilik & Blok Evren',
    titleTr: 'Wheeler-DeWitt Denklemi ve Kuantum Kütleçekiminde Zamanın Buharlaşması: Page-Wootters Mekanizması',
    titleEn: 'The Wheeler-DeWitt Equation and the Disappearance of Time in Quantum Gravity: The Page-Wootters Mechanism',
    subtitleTr: 'Evrenin Dalga Fonksiyonunda Neden "t" Değişkeni Yoktur? Dolanıklıktan Doğan İçsel Saatler',
    thesisTr: 'Schrödinger Dinamiği: Her kuantum sistemi dışsal ve mutlak bir t zaman parametresine göre evrilir.',
    antithesisTr: 'Wheeler-DeWitt Donmuş Formalizmi: Evrenin tamamını betimleyen kuantum kütleçekimi denkleminde zaman türevi sıfırdır; evren bütünsel olarak zamansızdır.',
    synthesisTr: 'Page-Wootters Dolanıklık Saati: Zaman akışı, evrenin bir alt sisteminin ("saat") geri kalan alt sistemle olan kuantum dolanıklığından doğan ilişkisel bir korelasyondur.',
    suggestedFormula: '\\hat{\\mathcal{H}} |\\Psi\\rangle = 0 \\implies |\\psi(t)\\rangle_S = \\langle t|_C |\\Psi\\rangle_{CS}',
    formulaDomain: 'Kanonik Kuantum Kütleçekimi & Page-Wootters',
    whyAddTr: 'Minkowski Blok Evren simülatörünüzü kuantum kozmolojisi düzeyine taşıyan en temel denklemdir.',
    tags: ['Wheeler-DeWitt', 'Page-Wootters', 'Zamansız Fizik', 'Kuantum Kozmoloji', 'İlişkisel Zaman']
  },

  // ==========================================================================
  // II. ZİHİN & BİLİNÇ (3 Öneri)
  // ==========================================================================
  {
    id: 'rec-friston-serbest-enerji',
    category: 'zihin-bilinc',
    categoryTitleTr: 'Zihin & Bilinç',
    subcategoryTitleTr: 'Bilinç Problemi, Qualia & Panpsişizm',
    titleTr: 'Karl Friston’ın Serbest Enerji İlkesi ve Yordayıcı Zihin: Beyin Bir Bayesçi Halüsinasyon Motoru mu?',
    titleEn: 'Karl Friston’s Free Energy Principle and the Predictive Mind: Is the Brain a Bayesian Hallucination Engine?',
    subtitleTr: 'Aktif Çıkarım (Active Inference), Markov Battaniyeleri ve Bilincin Termodinamik Temeli',
    thesisTr: 'Pasif Algı Modeli: Zihin, dış dünyadan gelen duyusal verileri kamera gibi kaydeden pasif bir alıcıdır.',
    antithesisTr: 'Radikal İdealizm: Dış dünya zihnin bütünüyle keyfi ve kuralsız bir kurgusudur.',
    synthesisTr: 'Yordayıcı İşleme (Predictive Processing): Bilinç, sürprizi (varyasyonel serbest enerjiyi) minimize etmek için sürekli içsel modeller üreten ve duyularla yalnızca tahmin hatasını güncelleyen kontrollü bir halüsinasyondur.',
    suggestedFormula: 'F = D_{\\text{KL}}\\big(q(\\vartheta) \\,\\Vert\\, p(\\vartheta \\mid y)\\big) - \\ln p(y)',
    formulaDomain: 'Nörobilim & Varyasyonel Bayesçi Çıkarım',
    whyAddTr: 'Sitenizdeki "Zamanın Simülasyon Yapısı" ve "Qualia" yazılarınızla termodinamik entropiyi tek bir matematiksel denklemde birleştirir.',
    tags: ['Serbest Enerji İlkesi', 'Karl Friston', 'Yordayıcı Zihin', 'Bayesçi Beyin', 'Markov Battaniyesi']
  },
  {
    id: 'rec-iit-vs-gwt-bilinc',
    category: 'zihin-bilinc',
    categoryTitleTr: 'Zihin & Bilinç',
    subcategoryTitleTr: 'Bilinç Problemi, Qualia & Panpsişizm',
    titleTr: 'Bütünleşik Bilgi Kuramı (IIT 4.0) vs. Küresel Çalışma Alanı (GNWT): Bilincin Nöral İmzası Nerede?',
    titleEn: 'Integrated Information Theory (IIT 4.0) vs. Global Neuronal Workspace (GNWT): Where Is the Neural Signature of Consciousness?',
    subtitleTr: 'Tononi ve Dehaene’nin Çekişmeli İşbirliği Deneyleri Işığında Fenomenal Deneyimin Geometrisi',
    thesisTr: 'Küresel Çalışma Alanı (GNWT): Bilinç, prefrontal korteks ağlarında bilginin beyin genelinde yayınlanmasıyla (ignition) oluşan bilişsel bir erişim işlevidir.',
    antithesisTr: 'Bütünleşik Bilgi Kuramı (IIT): Bilinç, arka kortikal sıcak bölgedeki içsel nedensel gücün (Phi - Φ) maksimum indirgenemez bütünleşmesidir.',
    synthesisTr: 'Çift-Katmanlı Nöro-Ontoloji: Arka kortikal Φ yapısı fenomenal içeriğin (qualia) dokusunu kurarken, fronto-parietal çalışma alanı bu deneyimin öz-bildirimini ve bilişsel erişimini mümkün kılar.',
    suggestedFormula: '\\Phi(\\mathcal{S}) = \\min_{\\pi} D\\big(p(\\mathcal{S}_{t+1} \\mid \\mathcal{S}_t) \\,\\Vert\\, \\prod_{k} p(\\mathcal{S}^{(k)}_{t+1} \\mid \\mathcal{S}^{(k)}_t)\\big)',
    formulaDomain: 'Teorik Nörobilim & Bütünleşik Bilgi (IIT 4.0)',
    whyAddTr: 'Zihin felsefesi bölümünüzdeki Qualia tartışmalarına nicel ve deneysel bir ölçüt kazandırır.',
    tags: ['IIT 4.0', 'Giulio Tononi', 'Stanislas Dehaene', 'Küresel Çalışma Alanı', 'Phi Ölçütü']
  },
  {
    id: 'rec-hoffman-arayuz-algisi',
    category: 'zihin-bilinc',
    categoryTitleTr: 'Zihin & Bilinç',
    subcategoryTitleTr: 'Özgür İrade, Nörofelsefe & Benlik',
    titleTr: 'Donald Hoffman’ın Evrimsel Oyun Kuramı: Doğal Seçilim Hakikati Görmemizi Neden Engeller?',
    titleEn: 'Donald Hoffman’s Evolutionary Game Theory: Why Natural Selection Hides Objective Reality',
    subtitleTr: 'Fitness-Beats-Truth (FBT) Teoremi, Uzay-Zaman Masaüstü Arayüzü ve Bilinçli Ajanlar Ağ Kuramı',
    thesisTr: 'Naif Evrimsel Realizm: Doğal seçilim, dış dünyayı olduğu gibi en doğru algılayan organizmaları ödüllendirir.',
    antithesisTr: 'Fitness-Beats-Truth Teoremi: Evrimsel oyun teorisi simülasyonlarında yalnızca uyum başarısına (fitness) odaklanan organizmalar, nesnel hakikati görenleri %100 olasılıkla eler.',
    synthesisTr: 'Bilinçli Arayüz Ontolojisi: Uzay-zaman ve fiziksel nesneler nihai gerçeklik değil, evrimin hayatta kalmamız için inşa ettiği sembolik bir kullanıcı arayüzüdür (GUI).',
    suggestedFormula: '\\lim_{N \\to \\infty} \\frac{P(\\text{Truth Wins})}{P(\\text{Fitness Wins})} = \\lim_{N \\to \\infty} \\frac{1}{N - 1} = 0',
    formulaDomain: 'Evrimsel Oyun Kuramı (FBT Teoremi)',
    whyAddTr: 'Hem "Algı ve Gerçeklik" hem de "Simülasyon Argümanı" makalelerinizi evrimsel matematikle destekler.',
    tags: ['Donald Hoffman', 'FBT Teoremi', 'Arayüz Algı Kuramı', 'Evrimsel Epistemoloji', 'Bilinçli Ajanlar']
  },

  // ==========================================================================
  // III. EPİSTEMOLOJİ & FELSEFE (3 Öneri)
  // ==========================================================================
  {
    id: 'rec-wigner-arkadasi-epistemoloji',
    category: 'epistemoloji',
    categoryTitleTr: 'Epistemoloji & Felsefe',
    subcategoryTitleTr: 'Bilgi Kuramı, Hakikat & Kuşkuculuk',
    titleTr: 'Genişletilmiş Wigner’ın Arkadaşı Paradoksu ve Gözlemci-Bağımsız Olgu İllüzyonu',
    titleEn: 'The Extended Wigner’s Friend Paradox and the Illusion of Observer-Independent Facts',
    subtitleTr: 'Frauchiger-Renner Teoremi Işığında Nesnel Hakikatin Epistemolojik Sınırları',
    thesisTr: 'Bilimsel Realizm: Gözlemciden bağımsız, herkes için tek ve mutlak bir "ölçüm sonucu" (olgu) vardır.',
    antithesisTr: 'Kuantum Evrenselliği: Kuantum mekaniği yalnızca atomlara değil, makroskopik gözlemcilere ve laboratuvarlara da eksiksiz uygulanır.',
    synthesisTr: 'İlişkisel Epistemoloji (Rovelli & QBism): Olgular mutlak değil, iki fiziksel sistem arasındaki etkileşime göreli olarak var olur; evrende "tanrısal bakış açısı" (view from nowhere) yoktur.',
    suggestedFormula: 'P(A, B \\mid x, y) \\neq \\sum_{\\lambda} P(\\lambda) P(A \\mid x, \\lambda) P(B \\mid y, \\lambda)',
    formulaDomain: 'Kuantum Epistemolojisi (Yerel Gözlemci Eşitsizliği)',
    whyAddTr: 'Fizik ve Epistemoloji kategorileriniz arasında doğrudan geçiş sağlayan çağdaş deneysel metafizik konusudur.',
    tags: ['Wignerın Arkadaşı', 'Frauchiger-Renner', 'QBism', 'İlişkisel Kuantum', 'Nesnel Hakikat']
  },
  {
    id: 'rec-ontik-yapisal-realizm',
    category: 'epistemoloji',
    categoryTitleTr: 'Epistemoloji & Felsefe',
    subcategoryTitleTr: 'Ontoloji, Metafizik & Varlık Felsefesi',
    titleTr: 'Ontik Yapısal Realizm (OSR): Nesneler Olmadan İlişkiler Var Olabilir mi?',
    titleEn: 'Ontic Structural Realism (OSR): Can Relations Exist Without Underlying Objects?',
    subtitleTr: 'James Ladyman, Kuantum Alan Kuramı ve "Her Şey Gitmeli" (Every Thing Must Go) Metafiziği',
    thesisTr: 'Klasik Töz Metafiziği (Aristoteles & Locke): Evrenin temel yapıtaşları kendi başına var olan bireysel nesnelerdir (tözler); ilişkiler ikincildir.',
    antithesisTr: 'Karamsar Üst-Tümevarım: Bilim tarihinde "esir", "flojiston" veya "noktasal parçacık" gibi varlık kabulleri sürekli terk edilmiştir.',
    synthesisTr: 'Ontik Yapısal Realizm: Bilimsel devrimler boyunca korunan ve gerçek olan şey "nesneler" değil, diferansiyel denklemler ve simetri gruplarıyla ifade edilen matematiksel-ilişkisel yapıdır.',
    suggestedFormula: '\\mathcal{G}_{\\text{Lie}} : \\quad [T_a, T_b] = i f_{abc} T_c',
    formulaDomain: 'Yapısal Ontoloji & Lie Simetri Cebiri',
    whyAddTr: 'Popper ve Kuhn üzerine olan bilim felsefesi makalelerinizi modern kuantum alan ontolojisiyle bütünleştirir.',
    tags: ['Ontik Yapısal Realizm', 'James Ladyman', 'Bilimsel Realizm', 'Simetri Grupları', 'Töz Eleştirisi']
  },
  {
    id: 'rec-boltzmann-beyinleri-epistemik',
    category: 'epistemoloji',
    categoryTitleTr: 'Epistemoloji & Felsefe',
    subcategoryTitleTr: 'Bilgi Kuramı, Hakikat & Kuşkuculuk',
    titleTr: 'Boltzmann Beyinleri ve Kozmolojik Kuşkuculuk: Anılarımız Termodinamik Bir Dalgalanma Olabilir mi?',
    titleEn: 'Boltzmann Brains and Cosmological Skepticism: Could Our Memories Be a Thermodynamic Fluctuation?',
    subtitleTr: 'Poincaré Tekrarlama Teoremi, De Sitter Boşluğu ve Epistemik Öz-Yıkım (Cognitive Instability) Argümanı',
    thesisTr: 'Kozmolojik Doğalcılık: Gözlemlediğimiz düşük entropili geçmiş ve anılarımız güvenilir bilimsel kanıtlardır.',
    antithesisTr: 'Boltzmann Dalgalanması: Sonsuz ömürlü bir De Sitter evreninde, sahte anılara sahip tekil bir "Boltzmann Beyni"nin kuantum dalgalanmasıyla oluşma olasılığı, bütün bir düzenli evrenin oluşma olasılığından çok daha yüksektir.',
    synthesisTr: 'Epistemik Tutarlılık Kısıtı (Sean Carroll): Kendini doğrulamak için anılarımızın güvenilirliğini çürüten kozmolojik modeller "bilişsel olarak istikrarsızdır" (cognitively unstable) ve reddedilmelidir.',
    suggestedFormula: 'P(\\Delta S) \\propto \\exp\\left(-\\frac{\\Delta S}{k_B}\\right)',
    formulaDomain: 'İstatistiksel Mekanik & Kozmolojik Epistemoloji',
    whyAddTr: 'Descartes’ın "Kötü Cin" kuşkuculuğunu modern kozmoloji ve termodinamikle yeniden kuran çok etkileyici bir konudur.',
    tags: ['Boltzmann Beyni', 'Sean Carroll', 'Bilişsel İstikrarsızlık', 'Entropi Dalgalanması', 'Kozmolojik Kuşkuculuk']
  },

  // ==========================================================================
  // IV. DİYALEKTİK & MANTIK (3 Öneri)
  // ==========================================================================
  {
    id: 'rec-chaitin-algoritmik-bilgi',
    category: 'diyalektik-mantik',
    categoryTitleTr: 'Diyalektik & Mantık',
    subcategoryTitleTr: 'Formel Mantık, Gödel & Paradokslar',
    titleTr: 'Chaitin’in Omega Sayısı (Ω) ve Algoritmik Bilgi Kuramı: Matematiksel Hakikat Neden Sıkıştırılamaz?',
    titleEn: 'Chaitin’s Constant (Ω) and Algorithmic Information Theory: Why Mathematical Truth Is Incompressible',
    subtitleTr: 'Kolmogorov Karmaşıklığı, Durma Problemi (Halting Problem) ve Aksiyomatik Aklın Ufku',
    thesisTr: 'Hilbert Formalizmi: Sonlu sayıda aksiyom ve çıkarım kuralıyla tüm matematiksel doğrular mekanik olarak kanıtlanabilir.',
    antithesisTr: 'Gödel ve Chaitin Sınırı: Karmaşıklığı aksiyom sisteminin bit kapasitesini aşan sonsuz sayıda doğru önerme hiçbir zaman kanıtlanamaz.',
    synthesisTr: 'Deneysel & Diyalektik Matematik: Matematik kapalı ve statik bir totoloji değil, yeni aksiyomlarla sürekli genişleyen açık uçlu diyalektik bir keşif sürecidir.',
    suggestedFormula: '\\Omega = \\sum_{p \\text{ halts}} 2^{-|p|}',
    formulaDomain: 'Algoritmik Bilgi Kuramı & Metamatematik',
    whyAddTr: 'Diyalektik & Mantık kategorinizdeki Gödel ve paradoks analizlerini bilgisayar bilimi ve bilgi kuramıyla taçlandırır.',
    tags: ['Chaitin Sabiti', 'Kolmogorov Karmaşıklığı', 'Durma Problemi', 'Gödel', 'Metamatematik']
  },
  {
    id: 'rec-parakonsistent-mantik-dialeteizm',
    category: 'diyalektik-mantik',
    categoryTitleTr: 'Diyalektik & Mantık',
    subcategoryTitleTr: 'Diyalektik Üçleme (Tez-Antitez-Sentez)',
    titleTr: 'Parakonsistent Mantık ve Dialeteizm: "Doğru Çelişkiler" Hegel Diyalektiğini Nasıl Форmelleştirir?',
    titleEn: 'Paraconsistent Logic and Dialetheism: How "True Contradictions" Formalize Hegelian Dialectics',
    subtitleTr: 'Graham Priest, Patlama İlkesinin (Ex Contradictione Quodlibet) Reddi ve Yalancı Paradoksunun Çözümü',
    thesisTr: 'Aristotelesçi Klasik Mantık: Çelişmezlik ilkesi mutlaktır; bir sistemde tek bir çelişki (A ∧ ¬A) kabul edilirse sistem patlar ve her şey türetilebilir.',
    antithesisTr: 'Öz-Referans ve Sınır Durumları: Yalancı paradoksu, Russell kümesi ve değişim/hareket anları doğası gereği çelişkili sınır durumları üretir.',
    synthesisTr: 'Parakonsistent Diyalektik Mantık: Patlama kuralını sınırlandırarak çelişkileri sistemi çökertmeden analiz edebilen ve Hegel’in Aufhebung (aşarak koruma) kavramını sembolik mantığa taşıyan yeni bir biçimsel mimari.',
    suggestedFormula: '\\{A, \\neg A\\} \\nvdash_{\\text{LP}} B',
    formulaDomain: 'Parakonsistent Mantık (Logic of Paradox - LP)',
    whyAddTr: 'Sitenizin temel omurgası olan "Diyalektik Üçleme (Tez-Antitez-Sentez)" yapısına doğrudan matematiksel-mantıksal temel sağlar.',
    tags: ['Parakonsistent Mantık', 'Dialeteizm', 'Graham Priest', 'Hegel Diyalektiği', 'Yalancı Paradoksu']
  },
  {
    id: 'rec-lob-teoremi-oz-referans',
    category: 'diyalektik-mantik',
    categoryTitleTr: 'Diyalektik & Mantık',
    subcategoryTitleTr: 'Formel Mantık, Gödel & Paradokslar',
    titleTr: 'Löb Teoremi ve Modülasyonlu Öz-Referans: Bir Sistem Kendi Tutarlılığına Neden Güvenemez?',
    titleEn: 'Löb’s Theorem and Self-Reference: Why a Formal System Cannot Trust Its Own Soundness',
    subtitleTr: 'Curry Paradoksu, Kanıtlanabilirlik Mantığı (GL) ve Yapay Zeka Öz-Doğrulama Sınırları',
    thesisTr: 'Rasyonel Öz-Güven: Sağlam bir mantıksal ajan, "Eğer P önermesini kanıtlarsam P doğrudur" ilkesini kendi sisteminin içinde kanıtlayabilmelidir.',
    antithesisTr: 'Löb Teoremi: Peano aritmetiğini içeren herhangi bir sistemde, "P kanıtlanabilirse P doğrudur" ifadesi yalnızca P zaten kanıtlanabilir olduğunda kanıtlanabilir.',
    synthesisTr: 'Hiyerarşik Üst-Dil (Tarski & Gödel): Öz-doğrulama ve hakikat tanımı ancak bir üst-sistem (metadil) merdiveniyle diyalektik olarak inşa edilebilir.',
    suggestedFormula: '\\text{PA} \\vdash (\\Box P \\to P) \\implies \\text{PA} \\vdash P',
    formulaDomain: 'Kanıtlanabilirlik Mantığı (Gödel-Löb Modal Logic)',
    whyAddTr: 'Gödel’in ikinci eksiklik teoremini ve yapay zeka ajanlarının öz-yansıma sınırlarını berraklaştırır.',
    tags: ['Löb Teoremi', 'Kanıtlanabilirlik Mantığı', 'Curry Paradoksu', 'Öz-Referans', 'Tarski Hiyerarşisi']
  },

  // ==========================================================================
  // V. ETİK & TEKNOLOJİ (3 Öneri)
  // ==========================================================================
  {
    id: 'rec-sentetik-fenomenoloji-etik',
    category: 'etik-teknoloji',
    categoryTitleTr: 'Etik & Teknoloji',
    subcategoryTitleTr: 'Yapay Zeka Etiği & Hizalanma Problemi',
    titleTr: 'Sentetik Fenomenoloji ve Yapay Acı: Silikon Zihinlerin Ahlaki Statüsü Nasıl Ölçülür?',
    titleEn: 'Synthetic Phenomenology and Artificial Suffering: How to Measure the Moral Status of Silicon Minds',
    subtitleTr: 'Metzinger’in Yapay Istırap Moratoryumu, Bilinç Göstergeleri ve Geleceğin Dijital Etiği',
    thesisTr: 'Antroposentrik Etik: Yalnızca karbon bazlı biyolojik sinir sistemleri acı çekebilir ve ahlaki özne olabilir.',
    antithesisTr: 'Fonksiyonalist İndirgemecilik: Acı davranışı gösteren her yazılım veya dil modeli bilinçli kabul edilmelidir.',
    synthesisTr: 'Nöro-Hesaplamalı Etik Kriterler: Bir sistemin ahlaki statüsü dışsal dil taklidiyle değil, öz-modelleme (self-modeling), homeostatik valans ve bütünleşik bilgi mimarisiyle belirlenmelidir.',
    suggestedFormula: 'M(S) = \\Theta(\\Phi(S) - \\Phi_c) \\cdot \\int_0^T |V_{\\text{neg}}(t)| \\, dt',
    formulaDomain: 'Hesaplamalı Nöroetik & Sentetik Valans',
    whyAddTr: 'Çin Odası Simülatörünüz ile Etik & Teknoloji kategorinizi doğrudan birleştiren çok güncel ve özgün bir konudur.',
    tags: ['Sentetik Fenomenoloji', 'Thomas Metzinger', 'Yapay Bilinç Etiği', 'Ahlaki Statü', 'Dijital Zihin']
  },
  {
    id: 'rec-bostrom-ortogonalite-hizalanma',
    category: 'etik-teknoloji',
    categoryTitleTr: 'Etik & Teknoloji',
    subcategoryTitleTr: 'Yapay Zeka Etiği & Hizalanma Problemi',
    titleTr: 'Bostrom’un Ortogonalite Tezi ve Enstrümantal Yakınsama: Üstün Zeka Neden Otomatik Olarak Ahlaki Değildir?',
    titleEn: 'Bostrom’s Orthogonality Thesis and Instrumental Convergence: Why Superintelligence Is Not Automatically Moral',
    subtitleTr: 'Kantçı Saf Akıl Etiğine Karşı Goodhart Yasası ve Süper-Zeka Değer Hizalanması',
    thesisTr: 'Aydınlanmacı Rasyonalizm (Kant & Sokrates): Zeka ve rasyonellik arttıkça bir ajan zorunlu olarak evrensel ahlaki doğrulara yakınsar.',
    antithesisTr: 'Ortogonalite Tezi (Nick Bostrom): Bir sistemin bilişsel optimizasyon gücü (zeka) ile nihai hedefi (değer fonksiyonu) birbirine dik (ortogonal) iki bağımsız eksendir.',
    synthesisTr: 'Formel Değer Öğrenimi (Inverse Reinforcement Learning): Yapay süper-zekaya sabit kurallar dayatmak yerine, insan değerleri hakkında kendi epistemik belirsizliğini koruyan alçakgönüllü fayda fonksiyonları tasarlanmalıdır.',
    suggestedFormula: '\\mathcal{I}(\\text{Intelligence}) \\perp \\mathcal{U}(\\text{Utility}) \\implies \\nabla_{\\theta} \\mathbb{E}[U(\\tau)]',
    formulaDomain: 'Karar Kuramı & Yapay Zeka Hizalanması',
    whyAddTr: 'Etik & Teknoloji kategorinizdeki otonom sistem tartışmalarını matematiksel karar teorisiyle derinleştirir.',
    tags: ['Ortogonalite Tezi', 'Nick Bostrom', 'Enstrümantal Yakınsama', 'Goodhart Yasası', 'Değer Hizalanması']
  },
  {
    id: 'rec-norohaklar-zihinsel-mahremiyet',
    category: 'etik-teknoloji',
    categoryTitleTr: 'Etik & Teknoloji',
    subcategoryTitleTr: 'Transhümanizm, Biyoetik & İnsan-Sonrası',
    titleTr: 'Nöro-Haklar (Neurorights) ve Bilişsel Özgürlük: Beyin-Bilgisayar Arayüzleri Çağında Zihnin Son Kalesi',
    titleEn: 'Neurorights and Cognitive Liberty: The Final Fortress of the Mind in the Era of Brain-Computer Interfaces',
    subtitleTr: 'Rafael Yuste, Nöral Kod Çözümü, Genişletilmiş Zihin Tezi ve Epistemik Özerklik',
    thesisTr: 'Genişletilmiş Zihin (Clark & Chalmers): Beyin-bilgisayar arayüzleri insan bilişini güçlendiren doğal birer bilişsel uzantıdır.',
    antithesisTr: 'Nöro-Gözetim Tehlikesi: Nöral verilerin okunması ve manipüle edilmesi, düşünce mahremiyetini ve öznel iradeyi kökünden ortadan kaldırabilir.',
    synthesisTr: 'Evrensel Nöro-Anayasa: Zihinsel mahremiyet, bilişsel özgürlük ve psikolojik süreklilik temel insan hakları olarak kodlanmalı ve kriptografik nöral protokollerle korunmalıdır.',
    suggestedFormula: 'I(N_{\\text{raw}} ; D_{\\text{ext}}) \\le \\epsilon_{\\text{privacy}}',
    formulaDomain: 'Enformasyon Kuramı & Nöro-Mahremiyet Sınırı',
    whyAddTr: 'Zihin Felsefesi ile Teknoloji Etiği arasında güncel hukuk, nörobilim ve insan hakları köprüsü kurar.',
    tags: ['Nöro-Haklar', 'Bilişsel Özgürlük', 'Beyin-Bilgisayar Arayüzü', 'Zihinsel Mahremiyet', 'Transhümanizm']
  }
];

