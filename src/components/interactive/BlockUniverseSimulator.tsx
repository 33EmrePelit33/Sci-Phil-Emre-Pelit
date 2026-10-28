import React, { useState } from 'react';
import { RotateCcw, Info, Sparkles } from 'lucide-react';
import { MathRenderer } from '../MathRenderer';

const SIM_TEXTS: Record<string, Record<string, string>> = {
  lab_badge: {
    tr: 'İnteraktif Fizik Laboratuvarı',
    en: 'Interactive Physics Lab',
    de: 'Interaktives Physiklabor',
    fr: 'Laboratoire de Physique Interactive',
    es: 'Laboratorio de Física Interactiva',
    it: 'Laboratorio di Fisica Interattiva',
    ru: 'Интерактивная физическая лаборатория',
    ar: 'مختبر الفيزياء التفاعلي',
    zh: '互动物理实验室',
    ja: 'インタラクティブ物理実験室'
  },
  title: {
    tr: 'Minkowski Blok Evren & Eşzamanlılık Simülatörü',
    en: 'Minkowski Block Universe & Simultaneity Simulator',
    de: 'Minkowski-Blockuniversum & Gleichzeitigkeits-Simulator',
    fr: 'Simulateur d’Univers-Bloc de Minkowski & Simultanéité',
    es: 'Simulador de Universo Bloque de Minkowski y Simultaneidad',
    it: 'Simulatore di Universo a Blocchi di Minkowski & Simultaneità',
    ru: 'Симулятор блочной Вселенной Минковского и одновременности',
    ar: 'محاكي كون مينكوفسكي الكتلي والآنية',
    zh: '闵可夫斯基块状宇宙与同时性模拟器',
    ja: 'ミンコフスキーのブロック宇宙と同時性シミュレーター'
  },
  desc: {
    tr: 'Gözlemcinin göreli hızını değiştirerek 4-boyutlu uzay-zamanda "şimdi" diliminin nasıl büküldüğünü deneyimleyin.',
    en: 'Observe how the "now-slice" tilts in 4D spacetime as observer velocity changes relative to light.',
    de: 'Beobachten Sie, wie sich die "Jetzt-Scheibe" in der 4D-Raumzeit neigt, wenn sich die Beobachtergeschwindigkeit ändert.',
    fr: 'Observez comment la coupe du "présent" s’incline dans l’espace-temps 4D avec la vitesse relative.',
    es: 'Observe cómo la "rebanada del ahora" se inclina en el espacio-tiempo 4D al cambiar la velocidad del observador.',
    it: 'Osserva come la sezione del "presente" si inclina nello spaziotempo 4D al variare della velocità dell\'osservatore.',
    ru: 'Наблюдайте, как срез «сейчас» наклоняется в 4-мерном пространстве-времени при изменении скорости наблюдателя.',
    ar: 'لاحظ كيف ينحني مقطع "الآن" في الزمكان رباعي الأبعاد بتغير سرعة المراقب بالنسبة للضوء.',
    zh: '观察随着观察者相对速度的变化，四维时空中的“现在”切片是如何发生倾斜的。',
    ja: '観測者の相対速度が変化するにつれて、4次元時空における「今」の断面がどのように傾くかを観察します。'
  },
  tab_sim: {
    tr: 'Simülasyon',
    en: 'Simulation',
    de: 'Simulation',
    fr: 'Simulation',
    es: 'Simulación',
    it: 'Simulazione',
    ru: 'Симуляция',
    ar: 'المحاكاة',
    zh: '模拟',
    ja: 'シミュレーション'
  },
  tab_theory: {
    tr: 'Felsefi Teori',
    en: 'Philosophical Theory',
    de: 'Philosophische Theorie',
    fr: 'Théorie Philosophique',
    es: 'Teoría Filosófica',
    it: 'Teoria Filosofica',
    ru: 'Философская теория',
    ar: 'النظرية الفلسفية',
    zh: '哲学理论',
    ja: '哲学理論'
  }
};

function getSimText(key: string, lang: string): string {
  const item = SIM_TEXTS[key];
  if (!item) return key;
  return item[lang] || item.en || item.tr || key;
}

export const BlockUniverseSimulator: React.FC<{ lang?: string }> = ({ lang = 'tr' }) => {
  const [velocity, setVelocity] = useState<number>(0.4); // fraction of c (-0.8 to 0.8)
  const [showLightCone, setShowLightCone] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'simulation' | 'theory'>('simulation');

  // Events in coordinates (x: light-years, t: years)
  const eventNames: Record<string, Record<string, string>> = {
    E1: { tr: "1969 Ay'a İniş", en: '1969 Moon Landing', de: '1969 Mondlandung', fr: '1969 Alunissage', es: '1969 Alunizaje', it: '1969 Allunaggio', ru: '1969 Высадка на Луну', ar: '1969 الهبوط على القمر', zh: '1969 登月', ja: '1969 月面着陸' },
    E2: { tr: 'Şu An (Dünya)', en: 'Present Moment (Earth)', de: 'Gegenwart (Erde)', fr: 'Présent (Terre)', es: 'Momento Presente (Tierra)', it: 'Presente (Terra)', ru: 'Настоящий момент (Земля)', ar: 'لحظة الحاضر (الأرض)', zh: '当下时刻（地球）', ja: '現在の瞬間（地球）' },
    E3: { tr: '2080 Mars Kolonisi', en: '2080 Mars Colony', de: '2080 Mars-Kolonie', fr: '2080 Colonie Martienne', es: '2080 Colonia de Marte', it: '2080 Colonia di Marte', ru: '2080 Колония на Марсе', ar: '2080 مستعمرة المريخ', zh: '2080 火星殖民地', ja: '2080 火星植民地' },
    E4: { tr: 'Andromeda Süpernovası', en: 'Andromeda Supernova', de: 'Andromeda Supernova', fr: 'Supernova d’Andromède', es: 'Supernova de Andrómeda', it: 'Supernova di Andromeda', ru: 'Сверхновая Андромеды', ar: 'مستعر أعظم أندروميدا', zh: '仙女座超新星', ja: 'アンドロメダ超新星' }
  };

  const events = [
    { id: 'E1', name: eventNames.E1[lang] || eventNames.E1.en || eventNames.E1.tr, x: -3, t: -4, color: '#38bdf8' },
    { id: 'E2', name: eventNames.E2[lang] || eventNames.E2.en || eventNames.E2.tr, x: 0, t: 0, color: '#f59e0b' },
    { id: 'E3', name: eventNames.E3[lang] || eventNames.E3.en || eventNames.E3.tr, x: 2.5, t: 3.5, color: '#ec4899' },
    { id: 'E4', name: eventNames.E4[lang] || eventNames.E4.en || eventNames.E4.tr, x: 6, t: 1.2, color: '#a855f7' }
  ];

  // In Lorentz boost, the line of simultaneity (t' = 0) has slope dt/dx = v/c
  // So t = (v/c) * x
  const slope = velocity;
  const gamma = 1 / Math.sqrt(Math.max(0.01, 1 - velocity * velocity));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{getSimText('lab_badge', lang)}</span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            {getSimText('title', lang)}
          </h3>
          <p className="text-sm text-slate-400">
            {getSimText('desc', lang)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'simulation'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {getSimText('tab_sim', lang)}
          </button>
          <button
            onClick={() => setActiveTab('theory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'theory'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {getSimText('tab_theory', lang)}
          </button>
        </div>
      </div>

      {activeTab === 'simulation' ? (
        <div className="mt-6 space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
            <div className="md:col-span-2 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>{lang === 'tr' ? 'Gözlemci Göreli Hızı (v / c):' : 'Observer Relative Velocity (v / c):'}</span>
                <span className="font-mono text-amber-400 font-bold">
                  {(velocity >= 0 ? '+' : '') + velocity.toFixed(2)} c
                </span>
              </div>
              <input
                type="range"
                min="-0.85"
                max="0.85"
                step="0.02"
                value={velocity}
                onChange={(e) => setVelocity(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-0.85 c (Sola)</span>
                <span>0.00 c (Durgun)</span>
                <span>+0.85 c (Sağa)</span>
              </div>
            </div>

            <div className="flex flex-col justify-between border-l border-slate-800 pl-4 space-y-2">
              <div className="text-xs">
                <span className="text-slate-400">Lorentz Faktörü (γ): </span>
                <span className="font-mono text-emerald-400 font-bold">{gamma.toFixed(3)}</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLightCone}
                    onChange={(e) => setShowLightCone(e.target.checked)}
                    className="rounded border-slate-700 text-amber-500 focus:ring-0"
                  />
                  {lang === 'tr' ? 'Işık Konisini Göster' : 'Show Light Cone'}
                </label>
              </div>
              <button
                onClick={() => setVelocity(0)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {lang === 'tr' ? 'Sıfırla' : 'Reset'}
              </button>
            </div>
          </div>

          {/* Canvas visualization */}
          <div className="relative w-full h-80 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center">
            <svg viewBox="-100 -100 200 200" className="w-full h-full">
              {/* Grid lines */}
              <line x1="-100" y1="0" x2="100" y2="0" stroke="#334155" strokeWidth="0.8" />
              <line x1="0" y1="-100" x2="0" y2="100" stroke="#334155" strokeWidth="0.8" />

              {/* Light cone lines (45 degrees, t = x and t = -x) */}
              {showLightCone && (
                <>
                  <polygon
                    points="0,0 -90,-90 90,-90"
                    fill="rgba(245, 158, 11, 0.05)"
                  />
                  <polygon
                    points="0,0 -90,90 90,90"
                    fill="rgba(56, 189, 248, 0.05)"
                  />
                  <line x1="-95" y1="95" x2="95" y2="-95" stroke="#f59e0b" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.6" />
                  <line x1="-95" y1="-95" x2="95" y2="95" stroke="#f59e0b" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.6" />
                </>
              )}

              {/* Simultaneity Hyperplane (Now slice): t = slope * x */}
              {/* In screen coords, Y is inverted (negative is future), so t is -y */}
              <line
                x1="-90"
                y1={90 * slope}
                x2="90"
                y2={-90 * slope}
                stroke="#ec4899"
                strokeWidth="2"
                strokeDasharray="4 2"
              />

              {/* Observer worldline (t' axis) perpendicular to simultaneity in Minkowski sense */}
              <line
                x1={-90 * slope}
                y1="90"
                x2={90 * slope}
                y2="-90"
                stroke="#6366f1"
                strokeWidth="1.5"
                opacity="0.7"
              />

              {/* Events representation */}
              {events.map((ev) => {
                // scale x from [-8, 8] to [-80, 80], scale t from [-5, 5] to [-70, 70]
                const cx = ev.x * 11;
                const cy = -ev.t * 16;
                // Calculate observer's proper time for this event
                // t' = gamma * (t - v*x/c^2)
                const tPrime = gamma * (ev.t - velocity * ev.x);
                const isPastForObserver = tPrime < 0;

                return (
                  <g key={ev.id} className="cursor-pointer group">
                    <circle cx={cx} cy={cy} r="4.5" fill={ev.color} stroke="#0f172a" strokeWidth="1.5" />
                    <text
                      x={cx + 6}
                      y={cy - 4}
                      fill="#e2e8f0"
                      fontSize="6"
                      fontWeight="600"
                    >
                      {ev.name} ({ev.id})
                    </text>
                    <text
                      x={cx + 6}
                      y={cy + 4}
                      fill={isPastForObserver ? '#38bdf8' : '#ec4899'}
                      fontSize="4.5"
                      fontFamily="monospace"
                    >
                      {isPastForObserver ? (lang === 'tr' ? 'Geçmiş' : 'Past') : (lang === 'tr' ? 'Gelecek' : 'Future')} (t'={tPrime.toFixed(1)})
                    </text>
                  </g>
                );
              })}

              {/* Axis labels */}
              <text x="75" y="8" fill="#94a3b8" fontSize="5" fontWeight="bold">
                {lang === 'tr' ? '+X Uzay (Işık Yılı)' : '+X Space (Light Yrs)'}
              </text>
              <text x="4" y="-85" fill="#94a3b8" fontSize="5" fontWeight="bold">
                {lang === 'tr' ? '+T Zaman (Gelecek)' : '+T Time (Future)'}
              </text>
              <text x="4" y="90" fill="#94a3b8" fontSize="5" fontWeight="bold">
                {lang === 'tr' ? '-T Zaman (Geçmiş)' : '-T Time (Past)'}
              </text>
            </svg>

            {/* Overlay legend */}
            <div className="absolute bottom-2 left-2 bg-slate-900/90 backdrop-blur p-2 rounded-lg border border-slate-800 text-[10px] space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-pink-500 inline-block border-dashed"></span>
                <span>{lang === 'tr' ? 'Gözlemcinin Eşzamanlılık Düzlemi ("Şimdi")' : 'Observer Plane of Simultaneity ("Now")'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-500 inline-block"></span>
                <span>{lang === 'tr' ? 'Gözlemci Dünya Çizgisi (Worldline)' : 'Observer Worldline'}</span>
              </div>
            </div>
          </div>

          {/* Mathematical & Philosophical deduction */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="font-semibold text-amber-400 flex items-center gap-1">
              <Info className="w-4 h-4" />
              {lang === 'tr' ? 'Fiziksel Çıkarım: Rietdijk-Putnam Argümanı' : 'Physical Deduction: Rietdijk-Putnam Argument'}
            </div>
            <p className="text-slate-300 leading-relaxed">
              {lang === 'tr'
                ? `Hızı değiştirdiğinizde pembe kesikli çizgi ("Şimdi Dilimi") döner. Dikkat ederseniz, Dünya'daki durgun gözlemci için gelecekte olan bir olay (örneğin Mars Kolonisi ya da Andromeda Süpernovası), yeterince hızlı hareket eden bir gözlemcinin "Şimdi" çizgisine çoktan girmiştir! Bir gözlemci için zaten gerçekleşmiş bir olayın "var olmadığını" iddia etmek çelişkidir; bu da 4-boyutlu Blok Evren'in ebedi gerçekliğini ispatlar.`
                : `As you change velocity, the pink dashed "Now Slice" rotates. Events that are in the future for an Earth observer lie already in the past/now for a moving observer! This mathematically proves that all temporal coordinates exist simultaneously in the 4D manifold.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-amber-400 text-sm mb-2">
              {lang === 'tr' ? 'Ebediyetçilik (Eternalism) vs. Prezentizm' : 'Eternalism vs. Presentism'}
            </h4>
            <p>
              Prezentizme göre yalnızca mevcut an ("şimdi") varoluşa sahiptir. Ancak Özel Göreliliğin eşzamanlılığın göreliği ilkesi, nesnel ve evrensel bir "şimdi" diliminin kurulamayacağını gösterir.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-sky-400 text-sm mb-2">
              {lang === 'tr' ? 'Minkowski Metriği ve Değişmezlik' : 'Minkowski Metric and Invariance'}
            </h4>
            <MathRenderer
              formula="ds^2 = -c^2 dt^2 + dx^2 + dy^2 + dz^2 = -c^2 dt'^2 + dx'^2 + dy'^2 + dz'^2"
              displayMode={true}
            />
            <p className="mt-2">
              Farklı hareket durumlarındaki tüm gözlemciler için $ds^2$ uzay-zaman aralığı aynı kalır. Değişen şey olayların kendisi değil, gözlemcinin blok içindeki yönelimidir.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
