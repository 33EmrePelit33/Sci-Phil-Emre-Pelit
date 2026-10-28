import React, { useState } from 'react';
import { BookOpen, CheckCircle2, AlertTriangle, Cpu, User } from 'lucide-react';
import { translateTextFragment } from '../../utils/translations';

interface QueryOption {
  chinese: string;
  pinyin: string;
  meaningTr: string;
  meaningEn: string;
  responseRule: string;
  outputChinese: string;
  outputMeaningTr: string;
  outputMeaningEn: string;
}

const PRESET_QUERIES: QueryOption[] = [
  {
    chinese: '你有意识吗？',
    pinyin: 'Nǐ yǒu yìshí ma?',
    meaningTr: 'Senin bir bilincin var mı?',
    meaningEn: 'Do you have consciousness?',
    responseRule: 'Kural #408: [你-有-意-识-吗-？] dizisini görürsen [我-是-一-个-有-自-主-意-识-的-思-考-者] dizisini dışarı at.',
    outputChinese: '我是一个有自主意识的思考者。',
    outputMeaningTr: 'Ben özerk bilinci olan düşünen bir varlığım.',
    outputMeaningEn: 'I am a thinking entity with autonomous consciousness.'
  },
  {
    chinese: '外面下雨了吗？',
    pinyin: 'Wàimiàn xiàyǔle ma?',
    meaningTr: 'Dışarıda yağmur yağıyor mu?',
    meaningEn: 'Is it raining outside?',
    responseRule: 'Kural #112: [外-面-下-雨-了-吗-？] dizisini görürsen [天-空-晴-朗-没-有-下-雨] dizisini dışarı at.',
    outputChinese: '天空晴朗，没有下雨。',
    outputMeaningTr: 'Gökyüzü açık, yağmur yağmıyor.',
    outputMeaningEn: 'The sky is clear, it is not raining.'
  },
  {
    chinese: '爱是什么？',
    pinyin: 'Ài shì shénme?',
    meaningTr: 'Sevgi nedir?',
    meaningEn: 'What is love?',
    responseRule: 'Kural #789: [爱-是-什-么-？] dizisini görürsen [爱-是-心-灵-深-处-最-纯-粹-的-共-鸣] dizisini dışarı at.',
    outputChinese: '爱是心灵深处最纯粹的共鸣。',
    outputMeaningTr: 'Sevgi, ruhun derinliklerindeki en saf rezonanstır.',
    outputMeaningEn: 'Love is the purest resonance deep within the spirit.'
  }
];

const CR_TEXTS: Record<string, Record<string, string>> = {
  badge: {
    tr: 'Bilişsel Düşünce Deneyi Laboratuvarı',
    en: 'Cognitive Thought Experiment Lab',
    de: 'Kognitives Gedankenexperiment-Labor',
    fr: 'Laboratoire d’Expérience de Pensée Cognitive',
    es: 'Laboratorio de Experimento Mental Cognitivo',
    it: 'Laboratorio di Esperimenti Mentali Cognitivi',
    ru: 'Лаборатория когнитивных мысленных экспериментов',
    ar: 'مختبر التجارب الفكرية المعرفية',
    zh: '认知思想实验实验室',
    ja: '認知思考実験室'
  },
  title: {
    tr: 'John Searle: Çin Odası & Sentaks-Semantik Simülatörü',
    en: 'John Searle: Chinese Room & Syntax-Semantics Simulator',
    de: 'John Searle: Chinesisches Zimmer & Syntax-Semantik-Simulator',
    fr: 'John Searle : Chambre Chinoise & Simulateur Syntaxe-Sémantique',
    es: 'John Searle: Habitación China y Simulador Sintaxis-Semántica',
    it: 'John Searle: Stanza Cinese & Simulatore Sintassi-Semantica',
    ru: 'Джон Сёрл: Китайская комната и симулятор синтаксиса/семантики',
    ar: 'جون سيرل: الغرفة الصينية ومحاكي البناء والمعنى',
    zh: '约翰·塞尔：中文房间与句法-语义模拟器',
    ja: 'ジョン・サール：中国語の部屋＆構文・意味論シミュレーター'
  },
  desc: {
    tr: 'Bir algoritmanın mükemmel cevaplar vermesi, ne söylediğini gerçekten anladığı anlamına gelir mi?',
    en: 'Does generating human-like output imply genuine semantic understanding or mere mechanical rule following?',
    de: 'Bedeutet die Erzeugung menschenähnlicher Antworten echtes semantisches Verstehen oder bloßes Regelfolgen?',
    fr: 'La génération de réponses humaines implique-t-elle une compréhension sémantique réelle ou un simple calcul ?',
    es: '¿Generar respuestas fluidas implica comprensión semántica genuina o un mero seguimiento de reglas?',
    it: 'Generare risposte umane implica una comprensione semantica autentica o una mera esecuzione di regole?',
    ru: 'Означает ли генерация человекоподобных ответов подлинное понимание смысла или это механическое следование правилам?',
    ar: 'هل توليد إجابات بشرية سلسة يعني فهماً حقيقياً للمعنى أم مجرد اتباع ميكانيكي للقواعد؟',
    zh: '生成类人的流畅回答是否意味着真正的语义理解，或者仅仅是机械的规则遵循？',
    ja: '人間のような流暢な応答を出力することは、真の意味論的理解を意味するのか、それとも単なる規則の機械的追従にすぎないのか？'
  },
  select_prompt: {
    tr: 'Odanın kapısından atılacak Çince soruyu seçin:',
    en: 'Select Chinese input to slide under the door:',
    de: 'Wählen Sie die chinesische Eingabe, die unter der Tür durchgeschoben wird:',
    fr: 'Sélectionnez la question en chinois à glisser sous la porte :',
    es: 'Seleccione la pregunta en chino para deslizar bajo la puerta:',
    it: 'Seleziona la domanda in cinese da far scivolare sotto la porta:',
    ru: 'Выберите вопрос на китайском, который будет передан под дверь комнаты:',
    ar: 'اختر السؤال الصيني الذي سيتم تمريره من تحت باب الغرفة:',
    zh: '选择从门下塞入房间的中文问题：',
    ja: '部屋のドアの下から差し入れる中国語の質問を選択してください：'
  },
  out_1: {
    tr: '1. Dış Gözlemci (Girdi)',
    en: '1. External Observer (Input)',
    de: '1. Externer Beobachter (Eingabe)',
    fr: '1. Observateur Externe (Entrée)',
    es: '1. Observador Externo (Entrada)',
    it: '1. Osservatore Esterno (Input)',
    ru: '1. Внешний наблюдатель (Ввод)',
    ar: '1. المراقب الخارجي (المدخلات)',
    zh: '1. 外部观察者（输入）',
    ja: '1. 外部の観測者（入力）'
  },
  room_title: {
    tr: 'Kapalı Oda (Sembol Eşleme)',
    en: 'Closed Room (Symbol Manipulation)',
    de: 'Geschlossenes Zimmer (Symbolverarbeitung)',
    fr: 'Chambre Fermée (Traitement des Symboles)',
    es: 'Habitación Cerrada (Procesamiento de Símbolos)',
    it: 'Stanza Chiusa (Manipolazione di Simboli)',
    ru: 'Закрытая комната (манипуляция символами)',
    ar: 'الغرفة المغلقة (معالجة الرموز)',
    zh: '封闭房间（符号操作）',
    ja: '閉ざされた部屋（記号操作）'
  },
  operator: {
    tr: '2. Odadaki İnsan & Kural Kitabı',
    en: '2. Human Operator & Rulebook',
    de: '2. Mensch im Raum & Regelbuch',
    fr: '2. Opérateur Humain & Livre de Règles',
    es: '2. Operador Humano y Libro de Reglas',
    it: '2. Operatore Umano & Libro delle Regole',
    ru: '2. Человек в комнате и свод правил',
    ar: '2. الشخص داخل الغرفة وكتاب القواعد',
    zh: '2. 房间内的人员与规则手册',
    ja: '2. 部屋の中の人間とルールブック'
  },
  understanding_zero: {
    tr: 'Anlama: %0 (Saf Algoritmik Eşleştirme)',
    en: 'Understanding: 0% (Pure Syntactic Mapping)',
    de: 'Verständnis: 0% (Reine syntaktische Zuordnung)',
    fr: 'Compréhension : 0% (Pure correspondance syntaxique)',
    es: 'Comprensión: 0% (Puro mapeo sintáctico)',
    it: 'Comprensione: 0% (Pura mappatura sintattica)',
    ru: 'Понимание: 0% (Чисто синтаксическое сопоставление)',
    ar: 'الفهم: 0% (مطابقة شكلية بحتة)',
    zh: '理解度：0%（纯句法规则匹配）',
    ja: '理解度：0%（純粋な統語的マッピング）'
  },
  out_3: {
    tr: '3. Dış Gözlemci (Çıktı & Yanılsama)',
    en: '3. Output & Illusion of Mind',
    de: '3. Ausgabe & Illusion des Bewusstseins',
    fr: '3. Sortie & Illusion de l’Esprit',
    es: '3. Salida e Ilusión de Mente',
    it: '3. Output & Illusione della Mente',
    ru: '3. Вывод и иллюзия разума',
    ar: '3. المخرجات ووهم الوعي',
    zh: '3. 输出与思维的假象',
    ja: '3. 出力と意識の錯覚'
  },
  turing_pass: {
    tr: 'Turing Testi Başarılı, Bilinç Sıfır!',
    en: 'Turing Test Passed, Zero Consciousness!',
    de: 'Turing-Test bestanden, Null Bewusstsein!',
    fr: 'Test de Turing Réussi, Zéro Conscience !',
    es: '¡Test de Turing Aprobado, Cero Conciencia!',
    it: 'Test di Turing Superato, Zero Coscienza!',
    ru: 'Тест Тьюринга пройден, сознание нулевое!',
    ar: 'اجتاز اختبار تورينغ، والوعي صفر!',
    zh: '图灵测试通过，意识为零！',
    ja: 'チューリングテスト合格、意識はゼロ！'
  },
  searle_title: {
    tr: 'Searle\'ün Çıkarımı:',
    en: 'Searle\'s Deductive Proof:',
    de: 'Searles deduktiver Beweis:',
    fr: 'Preuve Déductive de Searle :',
    es: 'Prueba Deductiva de Searle:',
    it: 'Dimostrazione Deduttiva di Searle:',
    ru: 'Дедуктивное доказательство Сёрла:',
    ar: 'استنتاج سيرل المنطقي:',
    zh: '塞尔的演绎证明：',
    ja: 'サールの演繹的論証：'
  }
};

function getCRText(key: string, lang: string): string {
  const item = CR_TEXTS[key];
  if (!item) return key;
  return item[lang] || item.en || item.tr || key;
}

export const ChineseRoomSimulator: React.FC<{ lang?: string }> = ({ lang = 'tr' }) => {
  const [selectedQuery, setSelectedQuery] = useState<QueryOption>(PRESET_QUERIES[0]);
  const [step, setStep] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const runSimulation = (query: QueryOption) => {
    setSelectedQuery(query);
    setIsProcessing(true);
    setStep(1); // Input received
    setTimeout(() => {
      setStep(2); // Lookup rulebook
      setTimeout(() => {
        setStep(3); // Matching tokens
        setTimeout(() => {
          setStep(4); // Output dispatched
          setIsProcessing(false);
        }, 800);
      }, 800);
    }, 700);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="pb-4 border-b border-slate-800">
        <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
          {getCRText('badge', lang)}
        </span>
        <h3 className="text-xl font-bold text-white mt-1">
          {getCRText('title', lang)}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          {getCRText('desc', lang)}
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="mt-5 space-y-2">
        <label className="text-xs text-slate-400 font-medium">
          {getCRText('select_prompt', lang)}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESET_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => runSimulation(q)}
              disabled={isProcessing}
              className={`p-3 rounded-xl border text-left transition ${
                selectedQuery.chinese === q.chinese
                  ? 'border-amber-500 bg-amber-500/10 text-white shadow-lg'
                  : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="text-base font-bold text-amber-400">{q.chinese}</div>
              <div className="text-xs text-slate-400 mt-1">
                {lang === 'tr' ? q.meaningTr : (lang === 'en' ? q.meaningEn : translateTextFragment(q.meaningTr, lang))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Simulation Stage */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Outside Observer (Input) */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase mb-2">
              <User className="w-4 h-4 text-sky-400" />
              <span>{getCRText('out_1', lang)}</span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'tr'
                ? 'Dışarıdaki Çinli gözlemci, odaya anlamlı bir soru içeren kâğıt uzatır:'
                : (lang === 'en' ? 'The native Chinese speaker passes a paper containing a question:' : translateTextFragment('Dışarıdaki Çinli gözlemci, odaya anlamlı bir soru içeren kâğıt uzatır:', lang))}
            </p>
            <div className="mt-3 p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
              <span className="text-xl font-bold text-sky-400">{selectedQuery.chinese}</span>
              <span className="block text-[11px] text-slate-400 mt-1 italic">{selectedQuery.pinyin}</span>
              <span className="block text-xs text-slate-300 mt-1 font-medium">
                "{lang === 'tr' ? selectedQuery.meaningTr : (lang === 'en' ? selectedQuery.meaningEn : translateTextFragment(selectedQuery.meaningTr, lang))}"
              </span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
            {step >= 1 ? <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Girdi odaya ulaştı</span> : 'Bekleniyor...'}
          </div>
        </div>

        {/* Inside the Chinese Room (The Non-Chinese Speaker & Rulebook) */}
        <div className="bg-amber-950/20 p-4 rounded-xl border border-amber-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded-bl-lg font-mono">
            {getCRText('room_title', lang)}
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase mb-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{getCRText('operator', lang)}</span>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'tr'
                ? 'İçerideki kişi Çince BİLMEZ. Yalnızca şekilleri eşleştiren sentaks kuralını arar:'
                : (lang === 'en' ? 'The operator understands ZERO Chinese, executing only shape-matching rules:' : translateTextFragment('İçerideki kişi Çince BİLMEZ. Yalnızca şekilleri eşleştiren sentaks kuralını arar:', lang))}
            </p>
            <div className="mt-3 p-2.5 bg-slate-950 rounded-lg border border-amber-600/30 text-xs font-mono text-amber-300 leading-snug">
              {step >= 2 ? selectedQuery.responseRule : (lang === 'tr' ? 'Kural kitabı taranıyor...' : 'Scanning syntax lookup table...')}
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-amber-500/20 text-[11px] text-amber-400/90 font-medium flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>{getCRText('understanding_zero', lang)}</span>
          </div>
        </div>

        {/* Outside Observer (Output) */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase mb-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>{getCRText('out_3', lang)}</span>
            </div>
            <p className="text-xs text-slate-400">
              {lang === 'tr'
                ? 'Dışarıdaki kişi cevabı okur ve odanın bilinçli olduğunu sanır:'
                : (lang === 'en' ? 'The outsider reads the fluent reply and assumes the room is conscious:' : translateTextFragment('Dışarıdaki kişi cevabı okur ve odanın bilinçli olduğunu sanır:', lang))}
            </p>
            <div className="mt-3 p-3 bg-slate-900 rounded-lg border border-slate-700 text-center">
              <span className="text-lg font-bold text-emerald-400">{selectedQuery.outputChinese}</span>
              <span className="block text-xs text-slate-300 mt-1 font-medium">
                "{lang === 'tr' ? selectedQuery.outputMeaningTr : (lang === 'en' ? selectedQuery.outputMeaningEn : translateTextFragment(selectedQuery.outputMeaningTr, lang))}"
              </span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            {step >= 4 ? (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> {getCRText('turing_pass', lang)}
              </span>
            ) : 'İşleniyor...'}
          </div>
        </div>
      </div>

      {/* Philosophical Consequence */}
      <div className="mt-5 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
        <span className="font-bold text-amber-400 uppercase tracking-wide">
          {getCRText('searle_title', lang)}
        </span>
        <ol className="list-decimal pl-5 space-y-1 text-slate-300">
          <li><strong>Öncül 1:</strong> Programlar bütünüyle biçimsel ve sözdizimseldir (sentaks).</li>
          <li><strong>Öncül 2:</strong> İnsan zihninin içerikleri zihinsel ve anlamsaldır (semantik / yönelimsellik).</li>
          <li><strong>Öncül 3:</strong> Sentaks, tek başına ne semantiği oluşturur ne de semantik için yeterlidir.</li>
          <li><strong>Sonuç:</strong> Dolayısıyla, programlar tek başlarına zihne sahip olamazlar; Güçlü Yapay Zeka (Strong AI) yanlıştır.</li>
        </ol>
      </div>
    </div>
  );
};
