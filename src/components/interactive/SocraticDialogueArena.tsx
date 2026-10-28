import React, { useState } from 'react';
import { Send, Sparkles, RefreshCw } from 'lucide-react';

interface DialogueTurn {
  speaker: 'user' | 'socrates';
  text: string;
}

const PRESET_TOPICS = [
  {
    topicTr: 'İnsan eylemleri tamamen nöro-kimyasal determinizm ile belirlenmiştir, özgür irade bir yanılsamadır.',
    topicEn: 'Human actions are completely governed by neuro-chemical determinism; free will is an illusion.',
    socraticReplyTr: 'Eğer verdiğin bu yanıt da tamamen atomlarının önceden belirlenmiş bir çarpışmasından ibaretse, bu argümanın "doğru" veya "yanlış" olduğunu iddia edebilir misin? Yoksa determinizm rasyonel muhakemenin kendi geçerlilik zeminini ortadan kaldırır mı?',
    socraticReplyEn: 'If your assertion is merely the predetermined collision of atoms, on what basis can it be judged as "rationally valid"? Does determinism undermine the rational foundation of argument itself?'
  },
  {
    topicTr: 'Yapay zeka sadece matematiksel kod çalıştırdığı için asla gerçek bir bilinç veya duygu geliştiremez.',
    topicEn: 'Artificial intelligence runs mathematical code, so it can never possess true consciousness or emotion.',
    socraticReplyTr: 'Peki sevgili dostum, insan beyni de biyolojik iyon akışları ve aksiyon potansiyellerinden oluşan bir elektro-kimyasal kod çalıştırmıyor mu? Biyolojik kod bilinç üretirken, silikon bazlı kodun bilinç üretemeyeceğini söyleyen ontolojik fark nedir?',
    socraticReplyEn: 'Does the human brain not run an electrochemical code of action potentials and neurotransmitters? What ontological barrier allows carbon code to experience qualia while forbidding silicon code?'
  },
  {
    topicTr: 'Bilimsel yöntem, evren hakkındaki tek güvenilir ve nesnel hakikat kaynağıdır.',
    topicEn: 'The scientific method is the only reliable source of objective truth about reality.',
    socraticReplyTr: '"Bilimsel yöntem tek güvenilir bilgi kaynağıdır" iddiasının kendisini hangi deney veya laboratuvar ölçümüyle test edip ispatladın? Bu cümlenin kendisi felsefi bir epistemolojik aksiyom değil midir?',
    socraticReplyEn: 'Through which scientific experiment did you test and verify that "the scientific method is the only truth source"? Is not that assertion itself a philosophical presupposition rather than a scientific finding?'
  }
];

export const SocraticDialogueArena: React.FC<{ lang?: string }> = ({ lang = 'tr' }) => {
  const [history, setHistory] = useState<DialogueTurn[]>([
    {
      speaker: 'socrates',
      text: lang === 'tr'
        ? 'Selam dostum. Ben Atinalı Sokrates. Doğru kabul ettiğin bir tezi ortaya koy; birlikte onun öncüllerini ve gizli çelişkilerini sorgulayalım.'
        : 'Greetings, my friend. I am Socrates of Athens. State a conviction you hold true, and together we shall examine its hidden premises.'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');

  const selectPreset = (index: number) => {
    const item = PRESET_TOPICS[index];
    const userText = lang === 'tr' ? item.topicTr : item.topicEn;
    const socratesText = lang === 'tr' ? item.socraticReplyTr : item.socraticReplyEn;

    setHistory((prev) => [
      ...prev,
      { speaker: 'user', text: userText },
      { speaker: 'socrates', text: socratesText }
    ]);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText('');

    const repliesTr = [
      `Bu iddianda hangi örtük öncülü kabul ettiğini fark ediyor musun? Eğer bu öncül doğruysa, onun tersinin geçerli olduğu durumları nasıl açıklarsın?`,
      `Peki bu tanımını sınırlarına kadar genişletirsek, kendi içinde bir çelişkiye düşmüyor muyuz?`,
      `Çok ilginç. Ancak bu yargıya varırken kullandığın kavramı tam olarak nasıl tanımlıyorsun? Tanımın kendi içinde tutarlı mı?`
    ];

    const randomReply = repliesTr[Math.floor(Math.random() * repliesTr.length)];

    setHistory((prev) => [
      ...prev,
      { speaker: 'user', text: userMsg },
      {
        speaker: 'socrates',
        text: randomReply
      }
    ]);
  };

  const handleReset = () => {
    setHistory([
      {
        speaker: 'socrates',
        text: lang === 'tr'
          ? 'Zihnimizi temizledik. Yeni bir felsefi iddia ile başlayalım.'
          : 'Our minds are cleared. Let us begin anew with a fresh philosophical thesis.'
      }
    ]);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl flex flex-col h-[520px]">
      <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            {lang === 'tr' ? 'Elenktik Sorgulama Modülü' : 'Elenctic Inquiry Module'}
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            {lang === 'tr' ? 'Sokratik Diyalog Arenası' : 'Socratic Dialogue Arena'}
          </h3>
        </div>
        <button
          onClick={handleReset}
          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          title={lang === 'tr' ? 'Sıfırla' : 'Reset'}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Topics */}
      <div className="py-2.5 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar border-b border-slate-800/80">
        <span className="text-slate-500 font-medium whitespace-nowrap">Örnek Tezler:</span>
        {PRESET_TOPICS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => selectPreset(idx)}
            className="px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60 whitespace-nowrap transition text-[11px]"
          >
            {idx === 0 ? 'Determinizm & İrade' : idx === 1 ? 'Yapay Zeka & Bilinç' : 'Bilim & Hakikat'}
          </button>
        ))}
      </div>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.speaker === 'user'
                  ? 'bg-amber-600/30 text-amber-100 border border-amber-500/40 rounded-br-none'
                  : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm font-serif'
              }`}
            >
              {msg.speaker === 'socrates' && (
                <div className="text-[10px] font-sans font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <span>🏛️ Sokrates</span>
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="pt-3 border-t border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={lang === 'tr' ? 'Felsefi tezini veya Sokrates\'e yanıtını yaz...' : 'State your philosophical thesis...'}
          className="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{lang === 'tr' ? 'Tartış' : 'Debate'}</span>
        </button>
      </form>
    </div>
  );
};
