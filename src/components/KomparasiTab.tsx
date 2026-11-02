import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight, 
  Equal, 
  Trophy, 
  Award, 
  Sparkles, 
  TrendingUp, 
  Sliders, 
  Layers, 
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { ComparisonItem, Criterion, Alternative } from '../types/spk';
import { ComparisonInsight } from '../utils/comparisonEngine';
import confetti from 'canvas-confetti';

interface KomparasiTabProps {
  items: ComparisonItem[];
  insight: ComparisonInsight;
  criteria: Criterion[];
  alternatives: Alternative[];
  onTriggerConfetti?: () => void;
}

export const KomparasiTab: React.FC<KomparasiTabProps> = ({
  items,
  insight,
  criteria,
  alternatives,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeHoverBar, setActiveHoverBar] = useState<string | null>(null);

  const handleCopyRecommendation = () => {
    navigator.clipboard.writeText(insight.executiveRecommendation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFireConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const best = insight.bestAlternative;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* EXECUTIVE RECOMMENDATION HERO */}
      <div className="bg-white dark:bg-black rounded-xl p-6 text-slate-800 dark:text-neutral-100 border border-slate-200/90 dark:border-neutral-900 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800 font-medium">
                Konsensus Keputusan Multi-Kriteria
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 font-mono border border-emerald-200 dark:border-neutral-800 font-medium">
                Tingkat Keselarasan: {insight.consensusRate}%
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-500 dark:text-neutral-400 uppercase font-mono">
                Rekomendasi Utama Toko Ulos Terbaik:
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2 mt-0.5">
                <span>{best.name}</span>
                <button
                  onClick={handleFireConfetti}
                  title="Rayakan Pilihan Terbaik"
                  className="hover:scale-110 transition-transform p-1 rounded-full bg-amber-50 dark:bg-neutral-900 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-neutral-800"
                >
                  <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </button>
              </h2>
              <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-neutral-400 mt-1">
                <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                  {best.agreement ? 'Peringkat #1 di SAW & AHP' : 'Peringkat #1 AHP'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed bg-slate-50 dark:bg-neutral-950 p-4 rounded-lg border border-slate-200 dark:border-neutral-900">
              {insight.executiveRecommendation}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleCopyRecommendation}
              className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border dark:border-neutral-800 text-white text-xs font-medium transition shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300 dark:text-neutral-400" />}
              <span>{copied ? 'Tersalin ke Clipboard' : 'Salin Teks Keputusan'}</span>
            </button>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-900 text-center">
              <div className="text-[10px] text-slate-500 dark:text-neutral-500 font-mono uppercase font-medium">Stabilitas Model</div>
              <div className="text-xs font-semibold text-slate-800 dark:text-neutral-200 mt-0.5">
                {insight.consensusRate >= 70
                  ? 'Sangat Tinggi (Saling Menguatkan)'
                  : insight.consensusRate >= 40
                  ? 'Moderat (Variasi Prioritas Kriteria)'
                  : 'Sensitif terhadap Pembobotan'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DUAL BAR CHART COMPARISON (SAW vs AHP) */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs p-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-neutral-900 gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Visualisasi Perbandingan Skor: SAW vs AHP
            </h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Grafik batang menyandingkan preferensi SAW (Biru) dan AHP (Indigo) untuk seluruh toko ulos.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-blue-600" />
              <span className="text-slate-700 dark:text-neutral-300">Skor SAW</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs bg-indigo-600" />
              <span className="text-slate-700 dark:text-neutral-300">Skor AHP</span>
            </div>
          </div>
        </div>

        {/* Visual Chart Bars */}
        <div className="pt-6 space-y-4">
          {items.map((item) => {
            const isHovered = activeHoverBar === item.alternativeId;
            return (
              <div
                key={item.alternativeId}
                onMouseEnter={() => setActiveHoverBar(item.alternativeId)}
                onMouseLeave={() => setActiveHoverBar(null)}
                className={`p-3 rounded-lg transition-colors border ${
                  isHovered ? 'bg-slate-50 dark:bg-neutral-900/60 border-slate-300 dark:border-neutral-800' : 'border-transparent'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2 gap-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">{item.code}</span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{item.name}</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-neutral-500">({item.location})</span>
                  </div>
                  <div className="flex items-center space-x-2.5 text-[11px] sm:text-xs font-mono">
                    <span className="text-blue-700 dark:text-blue-400 font-semibold">SAW: {item.sawScore.toFixed(4)} (#{item.sawRank})</span>
                    <span className="text-slate-300 dark:text-neutral-700">•</span>
                    <span className="text-indigo-700 dark:text-indigo-400 font-semibold">AHP: {item.ahpScore.toFixed(4)} (#{item.ahpRank})</span>
                  </div>
                </div>

                {/* Bars */}
                <div className="space-y-1">
                  {/* SAW Bar */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 w-8">SAW</span>
                    <div className="flex-1 bg-slate-100 dark:bg-neutral-900 rounded-full h-3 overflow-hidden border border-slate-200/50 dark:border-neutral-800">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, item.sawScore * 100)}%` }}
                      />
                    </div>
                  </div>
                  {/* AHP Bar */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-400 dark:text-neutral-500 w-8">AHP</span>
                    <div className="flex-1 bg-slate-100 dark:bg-neutral-900 rounded-full h-3 overflow-hidden border border-slate-200/50 dark:border-neutral-800">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, item.ahpScore * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SIDE-BY-SIDE COMPARISON TABLE */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tabel Matriks Komparasi Peringkat SAW vs AHP
            </h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Evaluasi penyandingan urutan peringkat dan selisih (Δ Rank) antara kedua metode.
            </p>
          </div>
          <span className="text-xs text-slate-500 dark:text-neutral-400 font-mono">
            Δ Rank: Hijau (Naik di AHP), Merah (Turun di AHP)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-neutral-900">
              <tr>
                <th className="py-3 px-4 w-14">Kode</th>
                <th className="py-3 px-4 min-w-[200px]">Tempat Penjualan Ulos</th>
                <th className="py-3 px-3 text-center bg-blue-50/50 dark:bg-neutral-900 text-blue-900 dark:text-blue-300">Skor SAW</th>
                <th className="py-3 px-3 text-center bg-blue-50/50 dark:bg-neutral-900 text-blue-900 dark:text-blue-300 font-bold">Rank SAW</th>
                <th className="py-3 px-3 text-center bg-indigo-50/50 dark:bg-neutral-900 text-indigo-900 dark:text-indigo-300">Skor AHP</th>
                <th className="py-3 px-3 text-center bg-indigo-50/50 dark:bg-neutral-900 text-indigo-900 dark:text-indigo-300 font-bold">Rank AHP</th>
                <th className="py-3 px-3 text-center w-28">Pergeseran (Δ)</th>
                <th className="py-3 px-4 min-w-[180px]">Status Keselarasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300">
              {items.map((item) => {
                const isConsensus = item.sawRank === item.ahpRank;
                const isAhpHigher = item.rankDiff > 0;
                const isAhpLower = item.rankDiff < 0;

                return (
                  <tr
                    key={item.alternativeId}
                    className={`hover:bg-slate-50/80 dark:hover:bg-neutral-900/50 transition-colors ${
                      item.isBestInBoth ? 'bg-amber-50/30 dark:bg-neutral-950' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 dark:text-blue-400">{item.code}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                      {item.isBestInBoth && (
                        <span className="inline-block mt-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-neutral-900 px-1.5 py-0.2 rounded border border-amber-300 dark:border-neutral-800">
                          Juara Mutlak Kedua Metode
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800 dark:text-neutral-300 bg-blue-50/20 dark:bg-neutral-950">
                      {item.sawScore.toFixed(4)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-blue-800 dark:text-blue-400 bg-blue-50/30 dark:bg-neutral-900">
                      #{item.sawRank}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-800 dark:text-neutral-300 bg-indigo-50/20 dark:bg-neutral-950">
                      {item.ahpScore.toFixed(4)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-indigo-800 dark:text-indigo-400 bg-indigo-50/30 dark:bg-neutral-900">
                      #{item.ahpRank}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {isConsensus ? (
                        <span className="inline-flex items-center space-x-1 text-slate-500 dark:text-neutral-400 font-mono text-[11px] bg-slate-100 dark:bg-neutral-900 px-2 py-0.5 rounded border dark:border-neutral-800">
                          <Equal className="w-3 h-3 text-slate-400 dark:text-neutral-500" />
                          <span>Tetap</span>
                        </span>
                      ) : isAhpHigher ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] bg-emerald-50 dark:bg-neutral-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-neutral-800">
                          <ArrowUpRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>+{item.rankDiff} (Naik)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-rose-700 dark:text-rose-400 font-mono text-[11px] bg-rose-50 dark:bg-neutral-900 px-2 py-0.5 rounded border border-rose-200 dark:border-neutral-800">
                          <ArrowDownRight className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          <span>{item.rankDiff} (Turun)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isConsensus ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium text-xs flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                          <span>Peringkat Identik</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 dark:text-neutral-400 text-[11px]">
                          Dipengaruhi pergeseran bobot kriteria
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRITERIA WEIGHTS COMPARISON & RANK SHIFTERS INSIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bobot Comparison */}
        <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs p-5 space-y-4 transition-colors">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Perbandingan Bobot Kriteria (SAW vs AHP)
            </h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Melihat bagaimana matriks Saaty merealokasi bobot kriteria dibandingkan input awal SAW.
            </p>
          </div>

          <div className="space-y-3">
            {insight.weightComparison.map((item) => (
              <div key={item.criterionId} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-neutral-200">
                    {item.criterionCode} - {item.criterionName}
                  </span>
                  <span className="font-mono text-slate-500 dark:text-neutral-400">
                    SAW: <strong className="text-blue-700 dark:text-blue-400">{item.sawWeight.toFixed(2)}</strong> | AHP:{' '}
                    <strong className="text-indigo-700 dark:text-indigo-400">{item.ahpWeight.toFixed(2)}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 h-2 bg-slate-100 dark:bg-neutral-900 rounded-full overflow-hidden p-0.5 border dark:border-neutral-800">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, item.sawWeight * 100)}%` }}
                    title={`Bobot SAW: ${(item.sawWeight * 100).toFixed(1)}%`}
                  />
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.min(100, item.ahpWeight * 100)}%` }}
                    title={`Bobot AHP: ${(item.ahpWeight * 100).toFixed(1)}%`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rank Movers Analysis */}
        <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs p-5 space-y-4 transition-colors">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Analisis Dinamika Pergeseran Peringkat
            </h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Penjelasan mengapa toko tertentu naik atau turun saat diuji dengan matriks hierarki AHP.
            </p>
          </div>

          <div className="space-y-3">
            {insight.rankMovers.length === 0 ? (
              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-neutral-950 border dark:border-neutral-900 text-emerald-800 dark:text-emerald-400 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Tidak ada pergeseran peringkat! Seluruh alternatif memiliki urutan yang persis sama antara metode SAW dan AHP.
                </span>
              </div>
            ) : (
              insight.rankMovers.map((mover, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200 dark:border-neutral-900 bg-slate-50/60 dark:bg-neutral-950 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {mover.code} - {mover.alternativeName}
                    </span>
                    <span
                      className={`font-mono text-[11px] px-2 py-0.5 rounded font-medium ${
                        mover.direction === 'up'
                          ? 'bg-emerald-100 dark:bg-neutral-900 text-emerald-800 dark:text-emerald-400 border dark:border-neutral-800'
                          : 'bg-rose-100 dark:bg-neutral-900 text-rose-800 dark:text-rose-400 border dark:border-neutral-800'
                      }`}
                    >
                      {mover.direction === 'up'
                        ? `Rank ${mover.fromSaw} → Rank ${mover.toAhp} (Naik)`
                        : `Rank ${mover.fromSaw} → Rank ${mover.toAhp} (Turun)`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-neutral-400 leading-relaxed">{mover.explanation}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
