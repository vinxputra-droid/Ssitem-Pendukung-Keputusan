import React from 'react';
import { 
  Printer, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertTriangle,
  Sun,
  Moon
} from 'lucide-react';
import { TabType } from './Sidebar';
import { AHPConsistency } from '../types/spk';

interface HeaderProps {
  activeTab: TabType;
  alternativeCount: number;
  criteriaCount: number;
  consistency: AHPConsistency;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenExport: () => void;
  onApplyAhpWeightsToSaw: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  alternativeCount,
  criteriaCount,
  consistency,
  isDarkMode,
  onToggleDarkMode,
  onOpenExport,
  onApplyAhpWeightsToSaw,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'data':
        return {
          title: 'Data Mentah & Kriteria Penilaian',
          desc: 'Input nilai alternatif toko ulos dan tentukan kriteria serta bobot awal',
        };
      case 'saw':
        return {
          title: 'Analisis Metode SAW (Simple Additive Weighting)',
          desc: 'Tahapan normalisasi matriks keputusan benefit/cost dan pembobotan linier',
        };
      case 'ahp':
        return {
          title: 'Analisis Metode AHP (Analytic Hierarchy Process)',
          desc: 'Matriks perbandingan berpasangan Saaty (1-9), nilai eigen, dan rasio konsistensi',
        };
      case 'komparasi':
        return {
          title: 'Komparasi Terintegrasi & Rekomendasi Toko Ulos',
          desc: 'Penyandingan hasil SAW vs AHP, analisis pergeseran rank, dan visualisasi skor',
        };
      default:
        return { title: 'Dashboard SPK Ulos', desc: '' };
    }
  };

  const { title, desc } = getTabTitle();

  return (
    <header className="h-16 border-b border-slate-200 dark:border-neutral-900 bg-white dark:bg-black px-6 flex items-center justify-between shrink-0 shadow-xs transition-colors duration-200">
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">{title}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 font-mono border border-slate-200 dark:border-neutral-800">
            {alternativeCount} Toko • {criteriaCount} Kriteria
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-1">{desc}</p>
      </div>

      <div className="flex items-center space-x-2.5">
        {/* AHP Status indicator badge */}
        <div
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
            consistency.isConsistent
              ? 'bg-emerald-50 dark:bg-neutral-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-neutral-800'
              : 'bg-rose-50 dark:bg-neutral-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-neutral-800'
          }`}
          title={consistency.statusMessage}
        >
          {consistency.isConsistent ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          )}
          <span>CR: {consistency.cr.toFixed(4)}</span>
        </div>

        {/* Sync AHP weights to SAW button */}
        <button
          onClick={onApplyAhpWeightsToSaw}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 dark:text-neutral-200 bg-slate-100 dark:bg-neutral-900 hover:bg-slate-200 dark:hover:bg-neutral-800 transition border border-slate-200 dark:border-neutral-800"
          title="Terapkan bobot prioritas hasil perhitungan AHP langsung ke bobot SAW"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600 dark:text-neutral-300" />
          <span className="hidden sm:inline">Sinkron Bobot AHP ke SAW</span>
        </button>

        {/* Export / Print */}
        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border dark:border-neutral-800 transition shadow-xs"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cetak / Ekspor</span>
        </button>

        {/* Dark Mode Toggle Button (Next to Cetak/Ekspor at the end of the bar) */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-md text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-neutral-300 dark:hover:text-white dark:bg-neutral-900 dark:hover:bg-neutral-800 transition border border-slate-200 dark:border-neutral-800 shadow-2xs flex items-center justify-center cursor-pointer"
          title={isDarkMode ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
};
