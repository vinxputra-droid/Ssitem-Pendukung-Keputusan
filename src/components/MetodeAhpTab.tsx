import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Layers,
  Calculator,
  Table,
  Check,
  BarChart3
} from 'lucide-react';
import { Alternative, Criterion, AHPResult } from '../types/spk';
import { SAATY_SCALE_DESCRIPTIONS } from '../data/defaultData';

interface MetodeAhpTabProps {
  criteria: Criterion[];
  alternatives: Alternative[];
  ahpResult: AHPResult;
  onUpdatePairwiseValue: (i: number, j: number, value: number) => void;
  onUpdateAltPairwiseValue?: (critId: string, i: number, j: number, value: number) => void;
  onResetAhpMatrix: () => void;
}

export const MetodeAhpTab: React.FC<MetodeAhpTabProps> = ({
  criteria,
  alternatives,
  ahpResult,
  onUpdatePairwiseValue,
  onUpdateAltPairwiseValue,
  onResetAhpMatrix,
}) => {
  const [selectedAltCritId, setSelectedAltCritId] = useState<string>(criteria[0]?.id || 'c1');

  const {
    consistency,
    matrix,
    columnSums,
    normalizedMatrix,
    weights,
    weightedSumVector,
    consistencyVector,
    alternativeMatrices,
    alternativeColumnSums,
    alternativeNormalizedMatrices,
    alternativeLocalPriorities,
    combinedAlternativeMatrix,
    evaluations,
  } = ahpResult;

  const currentActiveCrit = criteria.find((c) => c.id === selectedAltCritId) || criteria[0];
  const activeAltMatrix = alternativeMatrices[selectedAltCritId] || [];
  const activeAltColSums = alternativeColumnSums[selectedAltCritId] || [];
  const activeAltNormMatrix = alternativeNormalizedMatrices[selectedAltCritId] || [];
  const activeAltEigenvector = alternativeLocalPriorities[selectedAltCritId] || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Banner & Explanation */}
      <div className="bg-white dark:bg-black rounded-xl p-5 text-slate-800 dark:text-neutral-100 border border-slate-200/90 dark:border-neutral-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800 font-medium">
              Metode AHP (Analytic Hierarchy Process)
            </span>
            <span className="text-xs text-slate-500 dark:text-neutral-400">Standar Perhitungan Pairwise Matrix Excel</span>
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
            Kalkulasi Hierarki Lengkap: Matriks Berpasangan Kriteria & Alternatif
          </h3>
          <p className="text-xs text-slate-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
            Perhitungan AHP disusun dalam 3 Tahap Baku: (1) Matriks Berpasangan Kriteria &amp; Vektor Bobot $W$, (2) Matriks Berpasangan Alternatif per Kriteria &amp; Vektor Prioritas Lokal $A$, dan (3) Rekapitulasi Composite Score via Dot Product ($A \times W^T$).
          </p>
        </div>

        <button
          onClick={onResetAhpMatrix}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 border border-slate-200 dark:border-neutral-800 transition text-xs font-medium shrink-0 self-start md:self-auto shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-neutral-400" />
          <span>Reset Matriks Baku Excel</span>
        </button>
      </div>

      {/* PANDUAN TEORI SKALA PENILAIAN SAATY */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-blue-50 dark:bg-neutral-900 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-neutral-800 font-semibold">
                Panduan Ilmiah
              </span>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Panduan Teori Skala Penilaian Saaty (AHP)
              </h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Tabel intensitas kepentingan 1 sampai 9 yang dirumuskan oleh Prof. Thomas L. Saaty sebagai acuan input perbandingan berpasangan.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-900 px-2.5 py-1 rounded border border-slate-200 dark:border-neutral-800 self-start sm:self-auto">
            Fundamental Saaty Scale (1 - 9)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-neutral-900">
              <tr>
                <th className="py-2.5 px-4 w-24 text-center">Nilai Skala</th>
                <th className="py-2.5 px-4 min-w-[220px]">Definisi Kepentingan</th>
                <th className="py-2.5 px-4 min-w-[320px]">Penjelasan Kualitatif</th>
                <th className="py-2.5 px-4 w-28 text-center">Nilai Resiprokal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300">
              {SAATY_SCALE_DESCRIPTIONS.map((item) => (
                <tr key={item.value} className="hover:bg-slate-50/70 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="py-2.5 px-4 text-center font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50/20 dark:bg-neutral-900">
                    {item.value}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">{item.label}</td>
                  <td className="py-2.5 px-4 text-slate-600 dark:text-neutral-400">{item.meaning}</td>
                  <td className="py-2.5 px-4 text-center font-mono text-slate-500 dark:text-neutral-400">
                    {item.value === 1 ? '1' : `1/${item.value}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONSISTENCY STATUS CARD */}
      <div
        className={`rounded-xl p-5 border shadow-xs transition-all ${
          consistency.isConsistent
            ? 'bg-emerald-50/80 dark:bg-neutral-950 border-emerald-200 dark:border-neutral-800 text-emerald-950 dark:text-neutral-200'
            : 'bg-rose-50/80 dark:bg-neutral-950 border-rose-200 dark:border-neutral-800 text-rose-950 dark:text-neutral-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div
              className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                consistency.isConsistent
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
              }`}
            >
              {consistency.isConsistent ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs uppercase font-mono px-2 py-0.5 rounded font-bold ${
                    consistency.isConsistent
                      ? 'bg-emerald-200/80 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border dark:border-emerald-800'
                      : 'bg-rose-200/80 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border dark:border-rose-800'
                  }`}
                >
                  {consistency.isConsistent ? 'KONSISTEN (VALID)' : 'TIDAK KONSISTEN'}
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-neutral-300">
                  Ambang Batas: CR ≤ 0.10 (10%)
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-3xl text-slate-700 dark:text-neutral-400">{consistency.statusMessage}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 bg-white/70 dark:bg-black backdrop-blur-xs p-3 rounded-lg border border-slate-200 dark:border-neutral-800 text-center text-xs">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-neutral-500 font-mono">Lambda Max</div>
              <div className="font-mono font-bold text-slate-900 dark:text-white">{consistency.lambdaMax.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-neutral-500 font-mono">CI (Indeks)</div>
              <div className="font-mono font-bold text-slate-900 dark:text-white">{consistency.ci.toFixed(4)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-neutral-500 font-mono">RI (Random)</div>
              <div className="font-mono font-bold text-slate-900 dark:text-white">{consistency.ri.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-neutral-500 font-mono">CR (Rasio)</div>
              <div
                className={`font-mono font-bold ${
                  consistency.isConsistent ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                }`}
              >
                {consistency.cr.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TAHAP 1: MATRIKS PERBANDINGAN BERPASANGAN KRITERIA */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tahap 1: Matriks Perbandingan Berpasangan Kriteria &amp; Vektor Bobot (W)
            </h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Perbandingan berpasangan 6 Kriteria (C1 Harga, C2 Kecepatan Bayar, C3 Kapasitas, C4 Pelayanan, C5 Kerapihan, C6 Jarak). Total per kolom, normalisasi, dan rata-rata baris menghasilkan Bobot $W$.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500 dark:text-neutral-400 bg-slate-100 dark:bg-neutral-900 px-2.5 py-1 rounded border border-slate-200 dark:border-neutral-800">
            Kriteria Matrix [6 x 6]
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-neutral-900">
              <tr>
                <th className="py-2.5 px-4 w-16">Kriteria</th>
                {criteria.map((c) => (
                  <th key={c.id} className="py-2.5 px-3 text-center min-w-[100px]" title={c.name}>
                    <div className="font-bold text-slate-800 dark:text-white">{c.code}</div>
                    <div className="text-[10px] text-slate-400 dark:text-neutral-500 font-sans font-normal truncate max-w-[90px]">
                      {c.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300">
              {criteria.map((rowC, i) => (
                <tr key={rowC.id} className="hover:bg-slate-50/70 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-semibold text-blue-700 dark:text-blue-400 whitespace-nowrap">
                    {rowC.code} <span className="text-[10px] font-sans font-normal text-slate-400 dark:text-neutral-500">({rowC.name})</span>
                  </td>
                  {criteria.map((colC, j) => {
                    const isDiagonal = i === j;
                    const isUpper = i < j;
                    const cellVal = matrix[i] && matrix[i][j] !== undefined ? matrix[i][j] : 1;

                    if (isDiagonal) {
                      return (
                        <td
                          key={colC.id}
                          className="py-2.5 px-3 text-center font-mono font-bold bg-slate-100/60 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400"
                        >
                          1.0000
                        </td>
                      );
                    }

                    if (isUpper) {
                      return (
                        <td key={colC.id} className="py-2.5 px-3 text-center bg-blue-50/30 dark:bg-neutral-950">
                          <input
                            type="number"
                            step="0.0001"
                            min="0.0001"
                            max="9"
                            value={cellVal}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              onUpdatePairwiseValue(i, j, isNaN(val) ? 1 : val);
                            }}
                            className="w-20 text-xs text-center font-mono font-semibold py-1 px-1 rounded border border-blue-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-blue-900 dark:text-neutral-100 focus:outline-hidden focus:border-blue-500 shadow-2xs"
                          />
                        </td>
                      );
                    }

                    return (
                      <td
                        key={colC.id}
                        className="py-2.5 px-3 text-center font-mono text-slate-500 dark:text-neutral-400 bg-slate-50/50 dark:bg-neutral-950/60"
                      >
                        {cellVal.toFixed(4)}
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Column sum row */}
              <tr className="bg-slate-100 dark:bg-neutral-950 font-semibold border-t-2 border-slate-300 dark:border-neutral-800 text-slate-800 dark:text-neutral-200">
                <td className="py-2.5 px-4 font-mono text-[11px]">JUMLAH KOLOM (S_j)</td>
                {criteria.map((c, j) => (
                  <td key={c.id} className="py-2.5 px-3 text-center font-mono text-blue-800 dark:text-blue-400 font-bold">
                    {columnSums[j] ? columnSums[j].toFixed(4) : '-'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Normalized Matrix & Eigenvector W */}
        <div className="p-4 border-t border-slate-200 dark:border-neutral-900 bg-slate-50/30 dark:bg-neutral-950">
          <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono mb-2">
            Normalisasi Matriks Kriteria &amp; Vektor Prioritas / Bobot (W) [1 x 6]
          </h5>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-400 uppercase font-mono border-b border-slate-200 dark:border-neutral-800">
                <tr>
                  <th className="py-2 px-3 w-16">Kode</th>
                  <th className="py-2 px-3 min-w-[120px]">Kriteria</th>
                  {criteria.map((c) => (
                    <th key={c.id} className="py-2 px-3 text-center">
                      {c.code}
                    </th>
                  ))}
                  <th className="py-2 px-4 text-center bg-blue-100 dark:bg-neutral-800 text-blue-900 dark:text-white font-bold">
                    Bobot Kriteria (W)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300 font-mono">
                {criteria.map((crit, i) => {
                  const w = weights[crit.id] ?? 0;
                  return (
                    <tr key={crit.id}>
                      <td className="py-2 px-3 font-bold text-blue-700 dark:text-blue-400">{crit.code}</td>
                      <td className="py-2 px-3 font-sans font-medium text-slate-900 dark:text-white">{crit.name}</td>
                      {criteria.map((colC, j) => (
                        <td key={colC.id} className="py-2 px-3 text-center">
                          {(normalizedMatrix[i]?.[j] ?? 0).toFixed(4)}
                        </td>
                      ))}
                      <td className="py-2 px-4 text-center font-bold text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-neutral-900">
                        {w.toFixed(4)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TAHAP 2: MATRIKS PERBANDINGAN BERPASANGAN ALTERNATIF (SEBANYAK 6 KRITERIA) */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs overflow-hidden transition-colors space-y-0">
        <div className="p-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tahap 2: Matriks Perbandingan Berpasangan Alternatif per Kriteria (6 Matriks)
            </h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Setiap kriteria memiliki matriks perbandingan berpasangan alternatif 6x6. Dari masing-masing matriks dihitung Vektor Prioritas Lokal (Eigenvector).
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-600 dark:text-neutral-300 bg-blue-50 dark:bg-neutral-900 px-2.5 py-1 rounded border border-blue-200 dark:border-neutral-800 self-start sm:self-auto">
            Matriks Alternatif [6 x 6]
          </span>
        </div>

        {/* Criterion Selector Tabs */}
        <div className="p-3 border-b border-slate-200 dark:border-neutral-900 bg-slate-100/60 dark:bg-neutral-950 flex flex-wrap gap-2">
          {criteria.map((c) => {
            const isActive = c.id === selectedAltCritId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedAltCritId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-800 border border-slate-200 dark:border-neutral-800'
                }`}
              >
                <span className="font-mono font-bold">{c.code}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Criterion Alternative Matrix */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-neutral-200">
              Matriks Perbandingan Berpasangan Alternatif untuk <span className="text-blue-600 dark:text-blue-400">{currentActiveCrit.code} - {currentActiveCrit.name}</span>
            </span>
            <span className="text-slate-500 font-mono">Ukuran: 6 Alternatif × 6 Alternatif</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 uppercase font-mono border-b border-slate-200 dark:border-neutral-900">
                <tr>
                  <th className="py-2.5 px-3 min-w-[140px]">Alternatif</th>
                  {alternatives.map((alt) => (
                    <th key={alt.id} className="py-2.5 px-3 text-center min-w-[90px]" title={alt.name}>
                      <div className="font-bold text-slate-800 dark:text-white">{alt.code}</div>
                      <div className="text-[9px] text-slate-400 truncate max-w-[80px] font-sans font-normal">{alt.name}</div>
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-center bg-blue-50 dark:bg-neutral-900 text-blue-900 dark:text-white font-bold w-32">
                    Vektor Prioritas Lokal (Eigenvector)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300 font-mono">
                {alternatives.map((rowAlt, i) => (
                  <tr key={rowAlt.id} className="hover:bg-slate-50/70 dark:hover:bg-neutral-900/50">
                    <td className="py-2 px-3 font-sans font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                      <span className="font-mono text-blue-600 dark:text-blue-400 mr-1.5">{rowAlt.code}</span>
                      {rowAlt.name}
                    </td>
                    {alternatives.map((colAlt, j) => {
                      const isDiag = i === j;
                      const val = activeAltMatrix[i] && activeAltMatrix[i][j] !== undefined ? activeAltMatrix[i][j] : 1;

                      if (isDiag) {
                        return (
                          <td key={colAlt.id} className="py-2 px-3 text-center font-bold bg-slate-100 dark:bg-neutral-900 text-slate-400">
                            1.0000
                          </td>
                        );
                      }

                      if (i < j && onUpdateAltPairwiseValue) {
                        return (
                          <td key={colAlt.id} className="py-2 px-3 text-center bg-blue-50/20 dark:bg-neutral-950">
                            <input
                              type="number"
                              step="0.0001"
                              min="0.0001"
                              value={val}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                onUpdateAltPairwiseValue(selectedAltCritId, i, j, isNaN(v) ? 1 : v);
                              }}
                              className="w-16 text-xs text-center font-mono py-0.5 px-1 rounded border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-900 dark:text-neutral-100"
                            />
                          </td>
                        );
                      }

                      return (
                        <td key={colAlt.id} className="py-2 px-3 text-center text-slate-500 dark:text-neutral-400">
                          {val.toFixed(4)}
                        </td>
                      );
                    })}

                    <td className="py-2 px-3 text-center font-bold text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-neutral-950">
                      {(activeAltEigenvector[i] ?? 0).toFixed(4)}
                    </td>
                  </tr>
                ))}

                {/* Column sum */}
                <tr className="bg-slate-100 dark:bg-neutral-950 font-semibold border-t-2 border-slate-300 dark:border-neutral-800">
                  <td className="py-2 px-3 font-sans text-slate-800 dark:text-white text-[11px]">JUMLAH KOLOM</td>
                  {alternatives.map((alt, j) => (
                    <td key={alt.id} className="py-2 px-3 text-center text-blue-800 dark:text-blue-400 font-bold">
                      {(activeAltColSums[j] ?? 0).toFixed(4)}
                    </td>
                  ))}
                  <td className="py-2 px-3 text-center text-slate-600 dark:text-neutral-400 font-bold">
                    1.0000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* TAHAP 3: MATRIKS PRIORITAS LOKAL ALTERNATIF GABUNGAN (MATRIX A) [6 x 6] */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Tahap 3: Matriks Prioritas Lokal Alternatif Gabungan (Matrix A) [6 x 6]
            </h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Penggabungan 6 vektor prioritas lokal alternatif dari setiap kriteria menjadi Matriks $A$ berukuran [6 Alternatif x 6 Kriteria].
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-600 dark:text-neutral-300 bg-blue-50 dark:bg-neutral-900 px-2.5 py-1 rounded border border-blue-200 dark:border-neutral-800">
            Matrix A [6 x 6]
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 uppercase font-mono border-b border-slate-200 dark:border-neutral-900">
              <tr>
                <th className="py-2.5 px-4 min-w-[160px]">Alternatif</th>
                {criteria.map((c) => (
                  <th key={c.id} className="py-2.5 px-3 text-center">
                    <div className="font-bold text-slate-900 dark:text-white">{c.code}</div>
                    <div className="text-[10px] text-slate-400 font-normal font-sans">{c.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300 font-mono">
              {alternatives.map((alt, i) => (
                <tr key={alt.id} className="hover:bg-slate-50/70 dark:hover:bg-neutral-900/50">
                  <td className="py-2.5 px-4 font-sans font-semibold text-slate-900 dark:text-white">
                    <span className="font-mono text-blue-600 dark:text-blue-400 mr-2">{alt.code}</span>
                    {alt.name}
                  </td>
                  {criteria.map((c, j) => {
                    const val = combinedAlternativeMatrix[i]?.[j] ?? 0;
                    return (
                      <td key={c.id} className="py-2.5 px-3 text-center font-bold text-slate-800 dark:text-neutral-200">
                        {val.toFixed(4)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HASIL AKHIR REKAPITULASI AHP COMPOSITE SCORE (A x W^T) */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-neutral-900 bg-slate-50/50 dark:bg-neutral-950 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Hasil Rekapitulasi Akhir AHP Composite Score (Dot Product: A × W^T)
            </h4>
            <p className="text-xs text-slate-500 dark:text-neutral-400">
              Skor Akhir Alternatif = ∑ (Matriks Alternatif[i][j] × Bobot Kriteria[j]). Hasil terverifikasi sesuai benchmark Excel.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 font-mono border border-emerald-200 dark:border-neutral-800 font-bold">
            AHP Composite Score
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-neutral-900">
              <tr>
                <th className="py-2.5 px-4 w-16 text-center">Rank</th>
                <th className="py-2.5 px-4 w-16">Kode</th>
                <th className="py-2.5 px-4 min-w-[200px]">Tempat Penjualan Ulos</th>
                <th className="py-2.5 px-4 text-center min-w-[220px]">Formula Perkalian (A × W)</th>
                <th className="py-2.5 px-4 w-36 text-center bg-blue-50 dark:bg-neutral-900 text-blue-900 dark:text-white font-bold">
                  Skor Akhir AHP
                </th>
                <th className="py-2.5 px-4 min-w-[180px]">Visualisasi Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300">
              {evaluations.map((item) => (
                <tr
                  key={item.alternativeId}
                  className={`hover:bg-slate-50 dark:hover:bg-neutral-900/50 transition-colors ${item.rank === 1 ? 'bg-amber-50/30 dark:bg-neutral-950' : ''}`}
                >
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                        item.rank === 1
                          ? 'bg-amber-100 dark:bg-neutral-900 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-neutral-800'
                          : item.rank === 2
                          ? 'bg-slate-200 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300'
                          : 'text-slate-500 dark:text-neutral-500'
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700 dark:text-blue-400">{item.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-500 dark:text-neutral-400">
                    ∑ (Matriks Alternatif × W)
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-blue-900 dark:text-blue-400 bg-blue-50/30 dark:bg-neutral-950 text-sm">
                    {item.finalScore.toFixed(4)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-slate-100 dark:bg-neutral-900 rounded-full h-2.5 overflow-hidden border border-slate-200/60 dark:border-neutral-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.rank === 1 ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(100, (item.finalScore / (evaluations[0]?.finalScore || 1)) * 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
