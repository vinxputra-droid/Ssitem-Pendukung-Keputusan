import React, { useState } from 'react';
import { 
  BarChart3, 
  Calculator, 
  Database, 
  GitFork, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw
} from 'lucide-react';
import { AHPConsistency } from '../types/spk';
import { useAccess } from '../context/AccessContext';

export type TabType = 'data' | 'saw' | 'ahp' | 'komparasi';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  consistency: AHPConsistency;
  onResetData: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  consistency,
  onResetData,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isEditor } = useAccess();

  const handleResetClick = () => {
    if (!isEditor) {
      alert('Aksi ini memerlukan Mode Editor. Silakan beralih ke Mode Editor melalui menu Berbagi.');
      return;
    }
    onResetData();
  };

  const navItems = [
    {
      id: 'data' as TabType,
      label: 'Data Mentah & Kriteria',
      sub: 'Kelola Toko & Bobot',
      icon: Database,
    },
    {
      id: 'saw' as TabType,
      label: 'Metode SAW',
      sub: 'Simple Additive Weighting',
      icon: Calculator,
    },
    {
      id: 'ahp' as TabType,
      label: 'Metode AHP',
      sub: 'Analytic Hierarchy Process',
      icon: GitFork,
      badge: consistency.isConsistent ? 'CR OK' : 'CR > 0.1',
      badgeColor: consistency.isConsistent 
        ? 'bg-emerald-50 dark:bg-black text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-neutral-800' 
        : 'bg-rose-50 dark:bg-black text-rose-700 dark:text-rose-400 border-rose-200 dark:border-neutral-800',
    },
    {
      id: 'komparasi' as TabType,
      label: 'Komparasi & Analisis',
      sub: 'Hasil & Rekomendasi Akhir',
      icon: BarChart3,
    },
  ];

  return (
    <>
      {/* MOBILE DRAWER (Screens < md) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Drawer Content */}
          <aside className="relative w-72 max-w-[85vw] h-full bg-slate-50 dark:bg-black border-r border-slate-200 dark:border-neutral-900 flex flex-col justify-between p-4 z-10 shadow-2xl overflow-y-auto">
            <div className="space-y-6">
              {/* Brand Logo & Title with Close button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-neutral-900">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shrink-0 flex items-center justify-center p-1 overflow-hidden">
                    <img 
                      src="/assets/aistudio/logo_09c4f67e.png" 
                      alt="Logo SPK Ulos" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                      SPK Ulos Siantar
                    </h1>
                    <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono">SAW &amp; AHP</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 dark:text-neutral-400 hover:bg-slate-200 dark:hover:bg-neutral-900"
                  aria-label="Tutup menu"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Nav Links */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-neutral-500 px-2 pb-1">
                  Navigasi Utama
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-neutral-800 shadow-xs'
                          : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900/60'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3 shrink-0 text-slate-500 dark:text-neutral-400" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium leading-none">{item.label}</div>
                        <div className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1 truncate">{item.sub}</div>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono border uppercase shrink-0 ml-2 ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Consistency Status */}
              <div className="p-3 rounded-lg bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-900 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-slate-500 dark:text-neutral-400 uppercase">Status AHP CR</span>
                  {consistency.isConsistent ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  CR = <span className="font-mono">{consistency.cr.toFixed(4)}</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-neutral-400">
                  {consistency.isConsistent ? 'Konsisten (CR ≤ 0.10)' : 'Tidak Konsisten (CR > 0.10)'}
                </div>
              </div>
            </div>

            {/* Mobile Footer Reset Button */}
            {isEditor && (
              <div className="pt-4 border-t border-slate-200 dark:border-neutral-900">
                <button
                  onClick={() => {
                    handleResetClick();
                    setIsMobileOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-700 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 shadow-2xs"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500 dark:text-neutral-400" />
                  <span>Reset Data Preset</span>
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* DESKTOP RAIL SIDEBAR (Screens >= md) */}
      <div 
        className="hidden md:block relative w-[72px] shrink-0 h-full select-none z-40"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <aside
          className={`absolute left-0 top-0 bottom-0 h-full bg-slate-50/95 dark:bg-black border-r border-slate-200/90 dark:border-neutral-900 flex flex-col justify-between text-slate-700 dark:text-neutral-300 transition-all duration-300 ease-in-out shadow-xs overflow-hidden ${
            isHovered 
              ? 'w-64 shadow-xl bg-white/98 dark:bg-black backdrop-blur-md border-r border-slate-300/80 dark:border-neutral-800' 
              : 'w-[72px]'
          }`}
        >
          <div className="p-3.5 space-y-6">
            {/* Brand Logo / Header */}
            <div className="flex items-center space-x-3 px-1 py-1">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 shadow-xs shrink-0 flex items-center justify-center p-1 overflow-hidden cursor-pointer">
                <img 
                  src="/assets/aistudio/logo_09c4f67e.png" 
                  alt="Logo Universitas Sari Mutiara Indonesia" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <div
                className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
                  isHovered ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
                }`}
              >
                <h1 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight leading-tight">
                  SPK Ulos Siantar
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">Komparasi SAW &amp; AHP</p>
              </div>
            </div>

            {/* Primary Navigation */}
            <div className="space-y-1.5">
              <div
                className={`text-[10px] uppercase font-mono tracking-wider text-slate-400 dark:text-neutral-500 px-2 pb-0.5 transition-opacity duration-200 ${
                  isHovered ? 'opacity-100 block' : 'opacity-0 hidden'
                }`}
              >
                Navigasi Utama
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    title={!isHovered ? item.label : undefined}
                    className={`w-full flex items-center px-2.5 py-2.5 rounded-lg text-left transition-all group ${
                      isActive
                        ? 'bg-white dark:bg-neutral-900 text-slate-900 dark:text-white font-semibold border border-slate-200/90 dark:border-neutral-800 shadow-xs'
                        : 'text-slate-600 dark:text-neutral-400 hover:bg-slate-100/80 dark:hover:bg-neutral-900/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 w-full">
                      <div className="w-6 flex items-center justify-center shrink-0">
                        <Icon
                          className={`w-5 h-5 transition-colors ${
                            isActive 
                              ? 'text-slate-900 dark:text-white' 
                              : 'text-slate-500 dark:text-neutral-400 group-hover:text-slate-800 dark:group-hover:text-neutral-200'
                          }`}
                        />
                      </div>
                      <div
                        className={`truncate flex-1 transition-all duration-200 overflow-hidden whitespace-nowrap ${
                          isHovered ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
                        }`}
                      >
                        <div className="text-xs leading-none font-medium">{item.label}</div>
                        <div className="text-[10px] text-slate-500 dark:text-neutral-400 mt-1 truncate">{item.sub}</div>
                      </div>
                      {item.badge && isHovered && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono border uppercase shrink-0 ml-1 ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Consistency Indicator */}
            <div
              className={`rounded-lg transition-all duration-200 border ${
                isHovered
                  ? 'bg-slate-100/70 dark:bg-neutral-950 p-3 border-slate-200/80 dark:border-neutral-900'
                  : 'bg-transparent p-1.5 border-transparent flex justify-center'
              }`}
            >
              {isHovered ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-neutral-400 uppercase">
                      Status AHP
                    </span>
                    {consistency.isConsistent ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    )}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                      CR = <span className="font-mono">{consistency.cr.toFixed(4)}</span>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                        consistency.isConsistent
                          ? 'bg-emerald-50 dark:bg-black text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-neutral-800'
                          : 'bg-rose-50 dark:bg-black text-rose-700 dark:text-rose-400 border-rose-200 dark:border-neutral-800'
                      }`}
                    >
                      {consistency.isConsistent ? 'Konsisten' : 'Inkonsisten'}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer border ${
                    consistency.isConsistent
                      ? 'bg-emerald-50 dark:bg-black text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-neutral-800'
                      : 'bg-rose-50 dark:bg-black text-rose-600 dark:text-rose-400 border-rose-200 dark:border-neutral-800'
                  }`}
                  title={`AHP CR: ${consistency.cr.toFixed(4)} (${
                    consistency.isConsistent ? 'Konsisten' : 'Tidak Konsisten'
                  })`}
                >
                  {consistency.isConsistent ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Footer Action */}
          {isEditor && (
            <div className="p-3 border-t border-slate-200/80 dark:border-neutral-900">
              <button
                onClick={handleResetClick}
                title={!isHovered ? 'Reset Data Preset' : undefined}
                className="w-full flex items-center justify-center space-x-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 transition border border-slate-200/90 dark:border-neutral-800 shadow-2xs group"
              >
                <RotateCcw className="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400 group-hover:text-slate-800 dark:group-hover:text-white transition-colors" />
                <span
                  className={`transition-all duration-200 overflow-hidden whitespace-nowrap ${
                    isHovered ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'
                  }`}
                >
                  Reset Data Preset
                </span>
              </button>
            </div>
          )}
        </aside>
      </div>
    </>
  );
};

