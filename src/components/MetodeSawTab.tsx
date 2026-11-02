import React, { useState } from 'react';
import { 
  Calculator, 
  HelpCircle, 
  Trophy, 
  Layers, 
  CheckCircle, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { Alternative, Criterion, SAWResult } from '../types/spk';

interface MetodeSawTabProps {
  alternatives: Alternative[];
  criteria: Criterion[];
  sawResult: SAWResult;
}

export const MetodeSawTab: React.FC<MetodeSawTabProps> = ({
  alternatives,
  criteria,
  sawResult,
}) => {
  const [expandedAltId, setExpandedAltId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedAltId(expandedAltId === id ? null : id);
  };

  const top1 = sawResult.evaluations[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-black rounded-xl p-5 text-slate-800 dark:text-neutral-100 border border-slate-200/90 dark:border-neutral-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800 font-medium">
              Metode SAW (Simple Additive Weighting)
            </span>
            <span className="text-xs text-slate-500 dark:text-neutral-400">Algoritma Penjumlahan Terbobot</span>
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
            Proses Perhitungan Matematis Normalisasi & Perankingan
          </h3>
          <p className="text-xs text-slate-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
            Metode SAW mencari penjumlahan terbobot dari rating kinerja pada setiap alternatif di semua kriteria. Nilai kriteria benefit dinormalisasi berbanding nilai maksimum, sedangkan kriteria cost berbanding terbalik terhadap nilai minimum.
          </p>
        </div>

        {top1 && (
          <div className="bg-amber-50/70 dark:bg-neutral-950 px-4 py-3 rounded-lg border border-amber-200/80 dark:border-neutral-800 shrink-0 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-neutral-900 border border-amber-300 dark:border-neutral-700 flex items-center justify-center text-amber-800 dark:text-amber-400 font-bold text-sm">
              #1
            </div>
            <div>
              <div className="text-[10px] text-amber-800/80 dark:text-amber-400/80 uppercase font-mono font-medium">Peringkat 1 SAW</div>
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                {top1.name}
              </div>
              <div className="text-[11px] font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                Skor V: {top1.finalScore.toFixed(4)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RUMUS NORMALISASI EXPLANATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50/60 dark:bg-neutral-950 border border-emerald-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-400 font-semibold text-xs">
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-neutral-900 font-mono text-[10px] uppercase border dark:border-neutral-800">
              Kriteria Benefit
            </span>
            <span>Semakin besar nilai, semakin baik</span>
          </div>
          <div className="bg-white dark:bg-black p-2.5 rounded-lg border border-emerald-200 dark:border-neutral-800 text-center font-mono text-xs text-slate-800 dark:text-neutral-200 shadow-xs">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">r_ij</span> = x_ij / max(x_j)
          </div>
          <p className="text-[11px] text-emerald-900 dark:text-neutral-400 leading-relaxed">
            Digunakan untuk: <strong className="dark:text-neutral-200">Keaslian Tenun, Ragam Motif, Aksesibilitas, Reputasi, dan Kenyamanan</strong>. Setiap nilai dibagi dengan nilai tertinggi pada kriteria tersebut.
          </p>
        </div>

        <div className="bg-amber-50/60 dark:bg-neutral-950 border border-amber-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-400 font-semibold text-xs">
            <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-neutral-900 font-mono text-[10px] uppercase border dark:border-neutral-800">
              Kriteria Cost
            </span>
            <span>Semakin kecil nilai, semakin baik</span>
          </div>
          <div className="bg-white dark:bg-black p-2.5 rounded-lg border border-amber-200 dark:border-neutral-800 text-center font-mono text-xs text-slate-800 dark:text-neutral-200 shadow-xs">
            <span className="font-semibold text-amber-700 dark:text-amber-400">r_ij</span> = min(x_j) / x_ij
          </div>
          <p className="text-[11px] text-amber-900 dark:text-neutral-400 leading-relaxed">
            Digunakan untuk: <strong className="dark:text-neutral-200">Tingkat Harga Rata-rata</strong>. Nilai termurah (minimum) dibagi dengan nilai toko yang bersangkutan, sehingga toko yang lebih murah memperoleh skor normalisasi lebih tinggi.
          </p>
        </div>
      </div>

      {/* TAHAP 1: MATRIKS KEPUTUSAN (X) */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-950 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tahap 1: Matriks Keputusan (X) & Nilai Ekstrem
            </h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Nilai mentah x_ij untuk seluruh alternatif beserta nilai Maksimum dan Minimum tiap kriteria.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-900 px-2.5 py-1 rounded border border-slate-200 dark:border-neutral-800">
            Matriks X ({alternatives.length} × {criteria.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-neutral-900">
              <tr>
                <th className="py-2.5 px-4 w-16">Kode</th>
                <th className="py-2.5 px-4 min-w-[200px]">Alternatif Toko Ulos</th>
                {criteria.map((c) => (
                  <th key={c.id} className="py-2.5 px-3 text-center min-w-[90px]">
                    <div className="font-bold text-slate-800 dark:text-white">{c.code}</div>
                    <div
                      className={`text-[9px] uppercase px-1 rounded font-normal ${
                        c.type === 'benefit'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                      }`}
                    >
                      {c.type}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300">
              {alternatives.map((alt) => (
                <tr key={alt.id} className="hover:bg-slate-50/70 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-semibold text-blue-700 dark:text-blue-400">{alt.code}</td>
                  <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">{alt.name}</td>
                  {criteria.map((c) => {
                    const val = alt.scores[c.id] ?? 0;
                    return (
                      <td key={c.id} className="py-2.5 px-3 text-center font-mono">
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Max Row */}
              <tr className="bg-emerald-50/50 dark:bg-neutral-950 font-semibold border-t-2 border-slate-200 dark:border-neutral-900 text-emerald-900 dark:text-emerald-400">
                <td className="py-2 px-4 font-mono text-[11px]">MAX</td>
                <td className="py-2 px-4 text-[11px]">Nilai Tertinggi Kriteria (Max x_j)</td>
                {criteria.map((c) => (
                  <td key={c.id} className="py-2 px-3 text-center font-mono text-emerald-700 dark:text-emerald-400">
                    {sawResult.minMaxPerCriterion[c.id]?.max ?? '-'}
                  </td>
                ))}
              </tr>

              {/* Min Row */}
              <tr className="bg-amber-50/50 dark:bg-neutral-950 font-semibold text-amber-900 dark:text-amber-400 border-t border-slate-200 dark:border-neutral-900">
                <td className="py-2 px-4 font-mono text-[11px]">MIN</td>
                <td className="py-2 px-4 text-[11px]">Nilai Terendah Kriteria (Min x_j)</td>
                {criteria.map((c) => (
                  <td key={c.id} className="py-2 px-3 text-center font-mono text-amber-700 dark:text-amber-400">
                    {sawResult.minMaxPerCriterion[c.id]?.min ?? '-'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TAHAP 2: MATRIKS TERNORMALISASI (R) */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-950 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tahap 2: Matriks Ternormalisasi (R)
            </h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Semua nilai telah dikonversi ke skala proporsional [0 - 1] sesuai kaidah benefit/cost.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-900 px-2.5 py-1 rounded border border-slate-200 dark:border-neutral-800">
            Matriks R (r_ij)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-neutral-900">
              <tr>
                <th className="py-2.5 px-4 w-16">Kode</th>
                <th className="py-2.5 px-4 min-w-[200px]">Alternatif Toko Ulos</th>
                {criteria.map((c) => (
                  <th key={c.id} className="py-2.5 px-3 text-center min-w-[90px]">
                    <div className="font-bold text-slate-800 dark:text-white">{c.code}</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono font-normal">
                      W: {sawResult.normalizedWeights[c.id]?.toFixed(2)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300">
              {sawResult.evaluations.map((item) => (
                <tr key={item.alternativeId} className="hover:bg-slate-50/70 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-semibold text-blue-700 dark:text-blue-400">{item.code}</td>
                  <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-white">{item.name}</td>
                  {criteria.map((c) => {
                    const r_val = item.normalizedScores[c.id] ?? 0;
                    const isPerfect = r_val === 1;
                    return (
                      <td
                        key={c.id}
                        className={`py-2.5 px-3 text-center font-mono ${
                          isPerfect ? 'font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/30' : 'text-slate-700 dark:text-neutral-300'
                        }`}
                      >
                        {r_val.toFixed(4)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TAHAP 3: HASIL PERANKINGAN SAW (V) */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tahap 3: Nilai Preferensi Akhir (V_i) & Peringkat Rekomendasi
            </h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Dihitung dari rumus: V_i = ∑ (w_j × r_ij). Nilai terbesar menempati peringkat tertinggi.
            </p>
          </div>
          <span className="text-xs text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-neutral-950 border border-blue-200 dark:border-neutral-800 px-3 py-1 rounded-md font-medium">
            Formula: Sumproduct(W, R_i)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-neutral-900">
              <tr>
                <th className="py-3 px-4 w-20 text-center">Rank</th>
                <th className="py-3 px-4 w-16">Kode</th>
                <th className="py-3 px-4 min-w-[220px]">Tempat Penjualan Ulos</th>
                <th className="py-3 px-4 w-36 text-center">Skor Akhir (V)</th>
                <th className="py-3 px-4 min-w-[180px]">Visualisasi Skor</th>
                <th className="py-3 px-4 w-24 text-right">Rincian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300">
              {sawResult.evaluations.map((item) => {
                const isTop1 = item.rank === 1;
                const isTop2 = item.rank === 2;
                const isTop3 = item.rank === 3;
                const isExpanded = expandedAltId === item.alternativeId;

                return (
                  <React.Fragment key={item.alternativeId}>
                    <tr
                      className={`hover:bg-slate-50 dark:hover:bg-neutral-900/50 transition-colors ${
                        isTop1 ? 'bg-amber-50/30 dark:bg-neutral-950' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        {isTop1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 dark:bg-neutral-900 text-amber-800 dark:text-amber-400 font-bold border border-amber-300 dark:border-neutral-800 shadow-xs">
                            1
                          </span>
                        ) : isTop2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 font-bold border border-slate-300 dark:border-neutral-800">
                            2
                          </span>
                        ) : isTop3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/10 dark:bg-neutral-900 text-amber-800 dark:text-amber-400 font-bold border border-amber-600/30 dark:border-neutral-800">
                            3
                          </span>
                        ) : (
                          <span className="font-mono text-slate-500 dark:text-neutral-500 font-semibold">{item.rank}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700 dark:text-blue-400">{item.code}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{item.name}</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {item.finalScore.toFixed(4)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-slate-100 dark:bg-neutral-900 rounded-full h-2 overflow-hidden border border-slate-200/60 dark:border-neutral-800">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isTop1 ? 'bg-emerald-500' : isTop2 ? 'bg-blue-500' : 'bg-slate-400 dark:bg-neutral-600'
                            }`}
                            style={{ width: `${Math.min(100, item.finalScore * 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => toggleExpand(item.alternativeId)}
                          className="inline-flex items-center space-x-1 px-2 py-1 rounded text-[11px] font-medium text-slate-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-neutral-900 transition"
                        >
                          <span>{isExpanded ? 'Tutup' : 'Bedah'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Breakdown accordion */}
                    {isExpanded && (
                      <tr className="bg-slate-50/80 dark:bg-neutral-950">
                        <td colSpan={6} className="p-4 border-y border-slate-200 dark:border-neutral-900">
                          <div className="space-y-2">
                            <div className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                              Rincian Perkalian V({item.code}) = ∑ (w_j × r_ij):
                            </div>
                            <div className="font-mono text-xs text-slate-600 dark:text-neutral-300 bg-white dark:bg-black p-3 rounded-lg border border-slate-200 dark:border-neutral-800 overflow-x-auto leading-relaxed">
                              V({item.code}) ={' '}
                              {criteria
                                .map((c) => {
                                  const w = sawResult.normalizedWeights[c.id] ?? 0;
                                  const r = item.normalizedScores[c.id] ?? 0;
                                  return `(${w.toFixed(2)} × ${r.toFixed(4)})`;
                                })
                                .join(' + ')}{' '}
                              ={' '}
                              <strong className="text-blue-600 dark:text-blue-400 text-sm">
                                {item.finalScore.toFixed(4)}
                              </strong>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
