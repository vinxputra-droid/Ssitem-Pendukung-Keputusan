import React from 'react';
import { Printer, Download, X, CheckCircle, FileText } from 'lucide-react';
import { Alternative, Criterion, SAWResult, AHPResult, ComparisonItem } from '../types/spk';
import { ComparisonInsight } from '../utils/comparisonEngine';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  alternatives: Alternative[];
  criteria: Criterion[];
  sawResult: SAWResult;
  ahpResult: AHPResult;
  comparisonItems: ComparisonItem[];
  insight: ComparisonInsight;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  alternatives,
  criteria,
  sawResult,
  ahpResult,
  comparisonItems,
  insight,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    // Generate CSV content
    const headers = [
      'Kode',
      'Nama Toko Ulos',
      ...criteria.map((c) => `${c.code}_${c.name.replace(/,/g, '')}`),
      'Skor_SAW',
      'Rank_SAW',
      'Skor_AHP',
      'Rank_AHP',
      'Delta_Rank',
    ];

    const rows = comparisonItems.map((item) => {
      const alt = alternatives.find((a) => a.id === item.alternativeId);
      const critScores = criteria.map((c) => alt?.scores[c.id] ?? 0);
      return [
        item.code,
        `"${item.name}"`,
        ...critScores,
        item.sawScore.toFixed(4),
        item.sawRank,
        item.ahpScore.toFixed(4),
        item.ahpRank,
        item.rankDiff,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SPK_Pemilihan_Toko_Ulos_Pematangsiantar_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-black rounded-xl shadow-2xl border border-slate-200 dark:border-neutral-900 w-full max-w-3xl my-auto overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-neutral-950 border-b border-slate-200 dark:border-neutral-900 text-slate-900 dark:text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 min-w-0 pr-2">
            <FileText className="w-4 h-4 text-slate-600 dark:text-neutral-400 shrink-0" />
            <h3 className="text-xs sm:text-sm font-semibold truncate">Laporan Pengambilan Keputusan Pemilihan Tempat Penjualan Ulos</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-slate-400 dark:text-neutral-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-neutral-900 transition shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Report preview */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-xs text-slate-700 dark:text-neutral-300 font-sans">
          {/* Header Batak heritage memo */}
          <div className="text-center border-b border-slate-200 dark:border-neutral-900 pb-4 space-y-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-tight">
              Laporan Analisis Perbandingan SAW dan AHP Tempat Penjualan Ulos di Pematangsiantar
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-neutral-400">
              Integrasi Metode Simple Additive Weighting (SAW) &amp; Analytic Hierarchy Process (AHP)
            </p>
            <div className="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">
              Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-slate-50 dark:bg-neutral-950 p-3.5 sm:p-4 rounded-lg border border-slate-200 dark:border-neutral-900 space-y-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono">
              Ringkasan Rekomendasi Utama:
            </div>
            <p className="leading-relaxed text-slate-700 dark:text-neutral-300">{insight.executiveRecommendation}</p>
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono text-slate-600 dark:text-neutral-400">
              <span>Konsistensi AHP (CR): {ahpResult.consistency.cr.toFixed(4)} ({ahpResult.consistency.isConsistent ? 'VALID' : 'TIDAK VALID'})</span>
              <span className="hidden sm:inline">•</span>
              <span>Tingkat Keselarasan: {insight.consensusRate}%</span>
            </div>
          </div>

          {/* Summary Table */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white">Tabel Peringkat Lengkap Alternatif</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-slate-200 dark:border-neutral-900 min-w-[500px]">
                <thead className="bg-slate-100 dark:bg-neutral-950 font-mono text-[10px] uppercase text-slate-700 dark:text-neutral-400 border-b border-slate-200 dark:border-neutral-900">
                  <tr>
                    <th className="p-2 w-14">Kode</th>
                    <th className="p-2">Toko Ulos</th>
                    <th className="p-2 text-center">Skor SAW</th>
                    <th className="p-2 text-center">Rank SAW</th>
                    <th className="p-2 text-center">Skor AHP</th>
                    <th className="p-2 text-center font-bold">Rank AHP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-neutral-900 font-mono text-slate-800 dark:text-neutral-300">
                  {comparisonItems.map((item) => (
                    <tr key={item.alternativeId} className="hover:bg-slate-50 dark:hover:bg-neutral-950 transition-colors">
                      <td className="p-2 font-bold text-blue-700 dark:text-blue-400">{item.code}</td>
                      <td className="p-2 font-sans font-medium text-slate-900 dark:text-white">{item.name}</td>
                      <td className="p-2 text-center">{item.sawScore.toFixed(4)}</td>
                      <td className="p-2 text-center">#{item.sawRank}</td>
                      <td className="p-2 text-center">{item.ahpScore.toFixed(4)}</td>
                      <td className="p-2 text-center font-bold text-indigo-800 dark:text-indigo-400">#{item.ahpRank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Criteria info */}
          <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-neutral-400">
            <span className="font-semibold text-slate-800 dark:text-neutral-200">Kriteria Evaluasi Terpakai:</span>
            <ul className="list-disc list-inside space-y-0.5">
              {criteria.map((c) => (
                <li key={c.id}>
                  <strong className="text-slate-800 dark:text-neutral-200">{c.code} ({c.name})</strong>: Sifat {c.type.toUpperCase()}, Bobot SAW{' '}
                  {(sawResult.normalizedWeights[c.id] * 100).toFixed(1)}%, Bobot AHP{' '}
                  {(ahpResult.weights[c.id] * 100).toFixed(1)}%.
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-neutral-950 border-t border-slate-200 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-neutral-400 text-center sm:text-left">
            Format CSV Excel atau cetak langsung ke PDF.
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadCSV}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-neutral-200 text-xs font-medium transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
