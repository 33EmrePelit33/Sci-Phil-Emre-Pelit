import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, ShieldAlert } from 'lucide-react';

interface Fallacy {
  id: string;
  nameTr: string;
  nameEn: string;
  latin: string;
  descriptionTr: string;
  descriptionEn: string;
  exampleTr: string;
  exampleEn: string;
  counterTr: string;
  counterEn: string;
}

const FALLACIES: Fallacy[] = [
  {
    id: 'ad-hominem',
    nameTr: 'Kişiliğe Saldırı',
    nameEn: 'Ad Hominem',
    latin: 'Argumentum ad Hominem',
    descriptionTr: 'Karşı tarafın sunduğu argümanın geçerliliğini çürütmek yerine şahsiyetine, ahlakına veya geçmişine saldırma hatası.',
    descriptionEn: 'Attacking the person making the argument rather than addressing the substance of the argument itself.',
    exampleTr: '"Einstein\'ın görelilik teorisini ciddiye almamalıyız çünkü o bir patent memuruydu ve aile hayatında sorunlar vardı."',
    exampleEn: '"We shouldn\'t trust Einstein\'s relativity theory because he was just a patent clerk with marital issues."',
    counterTr: 'Bir fikrin doğruluğu, onu kimin dile getirdiğinden bağımsız olarak mantıksal tutarlılığı ve delilleriyle değerlendirilmelidir.',
    counterEn: 'The validity of an argument is strictly independent of the personal traits of the speaker.'
  },
  {
    id: 'straw-man',
    nameTr: 'Saman Adam (Korkuluk)',
    nameEn: 'Straw Man',
    latin: 'Fallacia Ficti Auctoris',
    descriptionTr: 'Karşı tarafın asıl argümanını kasıtlı olarak abartıp çarpıtarak savunulması imkânsız bir karikatüre dönüştürmek ve o sahte karikatürü çürütmek.',
    descriptionEn: 'Misrepresenting an opponent\'s position to make it easier to attack, then knocking down the fabricated caricature.',
    exampleTr: '"Evrim teorisini savunanlar insanların maymundan geldiğini söylüyor, o zaman şimdiki maymunlar neden insan olmuyor?"',
    exampleEn: '"Evolutionists claim humans came from chimpanzees, so why haven\'t zoo monkeys turned into humans yet?"',
    counterTr: 'Karşıt görüşü en güçlü ve dürüst haliyle ele alıp (Çelik Adam İlkesi / Steelmanning) doğrudan asıl iddiaya yanıt verilmelidir.',
    counterEn: 'Always address the strongest formulation of the opponent\'s argument (Steelmanning).'
  },
  {
    id: 'false-dilemma',
    nameTr: 'Yanlış İkilem (Siyah-Beyaz Safsatası)',
    nameEn: 'False Dilemma',
    latin: 'Bifurcatio Falsa',
    descriptionTr: 'Aslında çok sayıda ara seçenek veya alternatif varken konuyu sadece iki uç zıt kutba indirgemek.',
    descriptionEn: 'Presenting two alternative states as the only possibilities, when in fact more possibilities exist.',
    exampleTr: '"Ya nükleer enerjiyi koşulsuz kabul edersiniz ya da karanlıkta mum ışığında oturursunuz."',
    exampleEn: '"Either you are with us unconditionally, or you are completely on the side of terror."',
    counterTr: 'Gerçeklik ikili (ikilik) değil spektraldir; alternatif olasılıklar ve sentez yolları sorgulanmalıdır.',
    counterEn: 'Highlight intermediate nuances, third options, and multi-variable solutions.'
  },
  {
    id: 'begging-question',
    nameTr: 'Kısır Döngü (Öncülü Kanıt Sayma)',
    nameEn: 'Begging the Question',
    latin: 'Petitio Principii',
    descriptionTr: 'Kanıtlanması gereken asıl sonucu öncüllerin içine gizlice yerleştirerek dairesel bir muhakeme kurmak.',
    descriptionEn: 'A circular argument in which the conclusion is assumed in the premises.',
    exampleTr: '"Gelecekte de doğa kanunları aynı kalacaktır, çünkü geçmişte doğa kanunları hep aynı kalmıştır."',
    exampleEn: '"Paranormal events are real because people experience unexplainable phenomena that can only be paranormal."',
    counterTr: 'Öncülün kendisi kanıta muhtaçken onu bağımsız bir delilmiş gibi sunan mantıksal daire kırılmalıdır.',
    counterEn: 'Identify the circular premise that already smuggles in the desired conclusion.'
  },
  {
    id: 'slippery-slope',
    nameTr: 'Kaygan Zemin',
    nameEn: 'Slippery Slope',
    latin: 'Lapsus Lubrico',
    descriptionTr: 'Küçük bir ilk adımın kaçınılmaz olarak zincirleme felaketlere yol açacağını hiçbir nedensel zorunluluk göstermeden iddia etmek.',
    descriptionEn: 'Asserting that a relatively small first step will inevitably lead to a chain of catastrophic events without causal proof.',
    exampleTr: '"Eğer öğrencilerin derste su içmesine izin verirsek, yarın sınıfta mangal yaparlar."',
    exampleEn: '"If we regulate emissions today, the government will ban all cars and personal freedom tomorrow."',
    counterTr: 'Her basamağın kendi nedensel mekanizması vardır; zincirleme etki iddia eden kişi her adımı ispatlamak zorundadır.',
    counterEn: 'Demand empirical justification for each link in the supposed causal chain.'
  },
  {
    id: 'appeal-authority',
    nameTr: 'Sahte Otoriteye Başvuru',
    nameEn: 'Appeal to False Authority',
    latin: 'Argumentum ad Verecundiam',
    descriptionTr: 'Bir uzmanın kendi alanı dışındaki iddialarını veya genel popülaritesini hakikat kanıtı saymak.',
    descriptionEn: 'Using an authority figure as evidence in an area outside their legitimate field of expertise.',
    exampleTr: '"Çok ünlü bir kuantum fizikçisi ekonomik krizin çözüleceğini söyledi, demek ki kriz bitecek."',
    exampleEn: '"A famous celebrity doctor recommends this unverified crystal therapy, so it must work."',
    counterTr: 'Otorite ancak ilgili disiplindeki hakemli bilimsel konsensüs ile örtüştüğü ölçüde delil teşkil eder.',
    counterEn: 'Evaluate whether the cited figure has domain expertise and reflects consensus.'
  }
];

export const FallacyInspector: React.FC<{ lang?: string }> = ({ lang = 'tr' }) => {
  const [selectedFallacy, setSelectedFallacy] = useState<Fallacy>(FALLACIES[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = FALLACIES.filter(
    (f) =>
      f.nameTr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.latin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="pb-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            {lang === 'tr' ? 'Mantıksal Tutarlılık Testi' : 'Logical Consistency Testing'}
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            {lang === 'tr' ? 'Mantıksal Safsata Dedektifi (Fallacy Inspector)' : 'Logical Fallacy Inspector'}
          </h3>
          <p className="text-sm text-slate-400">
            {lang === 'tr'
              ? 'Felsefi ve bilimsel tartışmaları zehirleyen 6 temel safsatanın anatomisini ve karşı argümanlarını inceleyin.'
              : 'Analyze the mechanics and refutations of classic logical fallacies.'}
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder={lang === 'tr' ? 'Safsata ara...' : 'Search fallacy...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-48"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Fallacy List */}
        <div className="lg:col-span-5 space-y-2">
          {filtered.map((fallacy) => {
            const isSelected = selectedFallacy.id === fallacy.id;
            return (
              <button
                key={fallacy.id}
                onClick={() => setSelectedFallacy(fallacy)}
                className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 text-white shadow-md'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-white">
                    {lang === 'tr' ? fallacy.nameTr : fallacy.nameEn}
                  </div>
                  <div className="text-[11px] text-amber-400/80 italic font-serif">
                    {fallacy.latin}
                  </div>
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
              </button>
            );
          })}
        </div>

        {/* Detailed Inspection */}
        <div className="lg:col-span-7 bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono">
                {selectedFallacy.latin}
              </span>
              <span className="text-xs text-slate-500">Formel Olmayan Safsata</span>
            </div>
            <h4 className="text-lg font-bold text-white mt-1">
              {lang === 'tr' ? selectedFallacy.nameTr : selectedFallacy.nameEn}
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {lang === 'tr' ? selectedFallacy.descriptionTr : selectedFallacy.descriptionEn}
            </p>
          </div>

          <div className="p-3.5 bg-rose-950/20 rounded-lg border border-rose-900/40">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-1">
              <XCircle className="w-4 h-4" />
              {lang === 'tr' ? 'Hatalı Safsata Örneği:' : 'Fallacious Example:'}
            </div>
            <p className="text-xs text-rose-200 italic font-serif">
              {lang === 'tr' ? selectedFallacy.exampleTr : selectedFallacy.exampleEn}
            </p>
          </div>

          <div className="p-3.5 bg-emerald-950/20 rounded-lg border border-emerald-900/40">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'tr' ? 'Rasyonel Çürütme & Çözüm:' : 'Rational Refutation:'}
            </div>
            <p className="text-xs text-emerald-200 leading-relaxed">
              {lang === 'tr' ? selectedFallacy.counterTr : selectedFallacy.counterEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
