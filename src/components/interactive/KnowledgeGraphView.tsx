import React, { useState } from 'react';
import { Network, ArrowRight, BookOpen } from 'lucide-react';

interface Node {
  id: string;
  labelTr: string;
  labelEn: string;
  category: string;
  x: number;
  y: number;
  color: string;
  articleSlug?: string;
  connections: string[];
}

const NODES: Node[] = [
  { id: 'relativity', labelTr: 'Özel Görelilik & Zaman', labelEn: 'Special Relativity & Time', category: 'fizik', x: 22, y: 30, color: '#38bdf8', articleSlug: 'zamanin-simulasyon-yapisi-ve-noronal-zaman-algisi', connections: ['block-universe', 'determinism'] },
  { id: 'block-universe', labelTr: 'Tekil Evren & Kozmoloji', labelEn: 'Singular Universe & Cosmology', category: 'fizik', x: 45, y: 22, color: '#f59e0b', articleSlug: 'evren-her-zaman-tekil-bir-olguydu-ve-ilelebet-de-oyle-kalacak', connections: ['relativity', 'determinism', 'time'] },
  { id: 'quantum', labelTr: 'Kuantum Dolanıklığı', labelEn: 'Quantum Entanglement', category: 'fizik', x: 80, y: 28, color: '#a855f7', articleSlug: 'kuantum-dolaniklilik-ve-evrenin-dokusu-uzay-zaman-illuzyonu', connections: ['determinism', 'consciousness'] },
  { id: 'determinism', labelTr: 'Determinizm & Seçimler', labelEn: 'Determinism & Choices', category: 'mantik', x: 50, y: 48, color: '#e2e8f0', articleSlug: 'insanlar-kendi-secimlerini-mi-yoksa-kendilerine-dayatilani-mi-yasar', connections: ['block-universe', 'quantum', 'consciousness', 'dialectics'] },
  { id: 'consciousness', labelTr: 'Madde & Bilinç İkilemi', labelEn: 'Matter & Consciousness', category: 'zihin', x: 75, y: 72, color: '#ec4899', articleSlug: 'madde-ve-bilinc-ikilemi-telepati-mumkun-mu', connections: ['chinese-room', 'ai-alignment', 'determinism'] },
  { id: 'chinese-room', labelTr: 'LLM & Şuur Problemi', labelEn: 'LLMs & Sentience Problem', category: 'zihin', x: 45, y: 78, color: '#f59e0b', articleSlug: 'llmlerin-insan-davranisini-taklit-etmesi-onlarin-suur-sahibi-olduklarini-gosteri', connections: ['consciousness', 'ai-alignment'] },
  { id: 'ai-alignment', labelTr: 'BCI & Zihinsel Özerklik', labelEn: 'BCI & Mental Autonomy', category: 'etik', x: 20, y: 75, color: '#10b981', articleSlug: 'beyin-bilgisayar-arayuzleri-hedeflenen-noktaya-kadar-gelisirse-zihinsel-ozerklik', connections: ['chinese-room', 'epistemology'] },
  { id: 'epistemology', labelTr: 'Gerçeklik Yanılgısı', labelEn: 'Illusion of Reality', category: 'epistemoloji', x: 15, y: 48, color: '#38bdf8', articleSlug: 'gerceklik-yanilgisi-ve-bununla-basa-cikmak-icin-oneriler', connections: ['dialectics', 'relativity', 'ai-alignment'] },
  { id: 'dialectics', labelTr: 'Zaman Yolculuğu & Kimlik', labelEn: 'Time Travel & Identity', category: 'mantik', x: 35, y: 52, color: '#f97316', articleSlug: 'hangi-zamani-yasamaktayiz-ve-zamanda-yolculuk-yapsak-biz-olarak-kalir-miyiz', connections: ['determinism', 'epistemology'] }
];

export const KnowledgeGraphView: React.FC<{
  lang?: string;
  onSelectArticle?: (slug: string) => void;
}> = ({ lang = 'tr', onSelectArticle }) => {
  const [selectedNode, setSelectedNode] = useState<Node>(NODES[1]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-xl">
      <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Network className="w-4 h-4" />
            {lang === 'tr' ? 'Kavramsal Ağ Grafiği' : 'Conceptual Knowledge Graph'}
          </div>
          <h3 className="text-xl font-bold text-white mt-1">
            {lang === 'tr' ? 'Sci-Phi Felsefi & Bilimsel Düşünce Ağı' : 'Sci-Phi Philosophical & Scientific Web'}
          </h3>
          <p className="text-sm text-slate-400">
            {lang === 'tr'
              ? 'Düğümlere tıklayarak ontolojik köprüleri keşfedin ve ilgili makalelere doğrudan geçiş yapın.'
              : 'Click nodes to trace ontological bridges across physics, mind, epistemology, and logic.'}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Graph Area */}
        <div className="lg:col-span-8 bg-slate-950 rounded-xl border border-slate-800 p-2 relative h-96 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Draw connection edges */}
            {NODES.map((node) =>
              node.connections.map((targetId) => {
                const targetNode = NODES.find((n) => n.id === targetId);
                if (!targetNode || node.id > targetNode.id) return null;
                const isConnectedToSelected =
                  selectedNode.id === node.id || selectedNode.id === targetNode.id;

                return (
                  <line
                    key={`${node.id}-${targetNode.id}`}
                    x1={node.x}
                    y1={node.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isConnectedToSelected ? '#f59e0b' : '#334155'}
                    strokeWidth={isConnectedToSelected ? '0.9' : '0.4'}
                    strokeDasharray={isConnectedToSelected ? 'none' : '1 1'}
                    opacity={isConnectedToSelected ? 0.9 : 0.4}
                  />
                );
              })
            )}

            {/* Draw nodes */}
            {NODES.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 4.5 : 3.2}
                    fill={node.color}
                    stroke="#0f172a"
                    strokeWidth={1.2}
                    className="transition-all duration-300"
                  />
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={7}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="0.6"
                      strokeDasharray="1.5 1.5"
                    />
                  )}
                  <text
                    x={node.x}
                    y={node.y + (isSelected ? 7 : 5.8)}
                    fill={isSelected ? '#ffffff' : '#94a3b8'}
                    fontSize={isSelected ? '3.5' : '2.8'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                  >
                    {lang === 'tr' ? node.labelTr : node.labelEn}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Node Details Card */}
        <div className="lg:col-span-4 bg-slate-950 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 uppercase tracking-wider">
              {selectedNode.category}
            </span>
            <h4 className="text-lg font-bold text-white mt-2">
              {lang === 'tr' ? selectedNode.labelTr : selectedNode.labelEn}
            </h4>

            <div className="mt-4 space-y-2">
              <span className="text-xs text-slate-400 font-medium block">
                {lang === 'tr' ? 'Bağlantılı Kavramlar:' : 'Connected Concepts:'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.connections.map((cId) => {
                  const target = NODES.find((n) => n.id === cId);
                  return (
                    <button
                      key={cId}
                      onClick={() => target && setSelectedNode(target)}
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-[11px] text-slate-300 transition"
                    >
                      {target ? (lang === 'tr' ? target.labelTr : target.labelEn) : cId}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-800/80 mt-4">
            {selectedNode.articleSlug ? (
              <button
                onClick={() => onSelectArticle && onSelectArticle(selectedNode.articleSlug!)}
                className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lang === 'tr' ? 'İlgili Makaleyi Oku' : 'Read Associated Essay'}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            ) : (
              <div className="text-[11px] text-slate-500 italic text-center">
                {lang === 'tr' ? 'Ağ kesişim kavşağı' : 'Network intersection node'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
