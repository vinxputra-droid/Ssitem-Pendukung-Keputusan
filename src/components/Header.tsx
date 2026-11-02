import React from 'react';
import { 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  Sun,
  Moon,
  Menu
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
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  consistency,
  isDarkMode,
  onToggleDarkMode,
  onOpenExport,
  onOpenMobileMenu,
}) => {
  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case 'data': return 'Data Mentah & Kriteria';
      case 'saw': return 'Analisis Metode SAW';
      case 'ahp': return 'Analisis Metode AHP';
      case 'komparasi': return 'Komparasi SAW vs AHP';
      default: return 'SPK Pemilihan Toko Ulos';
    }
  };

  return (
    <header className="h-14 sm:h-16 border-b border-slate-200 dark:border-neutral-900 bg-white dark:bg-black px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-xs transition-colors duration-200">
      {/* Left Area: Mobile Hamburger Button & Title */}
      <div className="flex items-center space-x-2.5 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-neutral-300 dark:hover:text-white dark:bg-neutral-900 dark:hover:bg-neutral-800 transition border border-slate-200 dark:border-neutral-800 shrink-0"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Logo & Current Tab Title */}
        <div className="flex items-center space-x-2 min-w-0">
          <div className="md:hidden w-7 h-7 rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shrink-0 p-0.5">
            <img 
              src="/assets/aistudio/logo_09c4f67e.png" 
              alt="Logo SPK Ulos" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h2 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
            {getTabTitle(activeTab)}
          </h2>
        </div>
      </div>

      {/* Right Area: Action Controls & Status */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
        {/* AHP Status indicator badge */}
        <div
          className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs font-medium border ${
            consistency.isConsistent
              ? 'bg-emerald-50 dark:bg-neutral-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-neutral-800'
              : 'bg-rose-50 dark:bg-neutral-950 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-neutral-800'
          }`}
          title={consistency.statusMessage}
        >
          {consistency.isConsistent ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span className="font-mono">CR: {consistency.cr.toFixed(4)}</span>
        </div>

        {/* Export / Print */}
        <button
          onClick={onOpenExport}
          className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border dark:border-neutral-800 transition shadow-xs cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Cetak / Ekspor</span>
        </button>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={onToggleDarkMode}
          className="p-1.5 sm:p-2 rounded-md text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-neutral-300 dark:hover:text-white dark:bg-neutral-900 dark:hover:bg-neutral-800 transition border border-slate-200 dark:border-neutral-800 shadow-2xs flex items-center justify-center cursor-pointer"
          title={isDarkMode ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 shrink-0" />
          )}
        </button>
      </div>
    </header>
  );
};

