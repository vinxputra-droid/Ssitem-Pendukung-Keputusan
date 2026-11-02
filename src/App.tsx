/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { DataMentahTab } from './components/DataMentahTab';
import { MetodeSawTab } from './components/MetodeSawTab';
import { MetodeAhpTab } from './components/MetodeAhpTab';
import { KomparasiTab } from './components/KomparasiTab';
import { ExportModal } from './components/ExportModal';

import { Criterion, Alternative } from './types/spk';
import { 
  DEFAULT_CRITERIA, 
  DEFAULT_ALTERNATIVES, 
  DEFAULT_AHP_MATRIX 
} from './data/defaultData';
import { calculateSAW } from './utils/sawEngine';
import { calculateAHP, updatePairwiseCell, updateAlternativePairwiseCell, sanitizePairwiseMatrix } from './utils/ahpEngine';
import { generateComparison } from './utils/comparisonEngine';

const STORAGE_KEYS = {
  CRITERIA: 'spk_ulos_criteria_v2',
  ALTERNATIVES: 'spk_ulos_alternatives_v2',
  AHP_MATRIX: 'spk_ulos_ahp_matrix_v2',
};

export default function App() {
  // State: Active navigation tab
  const [activeTab, setActiveTab] = useState<TabType>('komparasi');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('spk_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('spk_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('spk_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Load Criteria from localStorage or default
  const [criteria, setCriteria] = useState<Criterion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CRITERIA);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CRITERIA;
  });

  // Load Alternatives from localStorage or default
  const [alternatives, setAlternatives] = useState<Alternative[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALTERNATIVES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_ALTERNATIVES;
  });

  // Load AHP Matrix from localStorage or default
  const [ahpMatrix, setAhpMatrix] = useState<number[][]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AHP_MATRIX);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === DEFAULT_CRITERIA.length) {
          return sanitizePairwiseMatrix(parsed, DEFAULT_CRITERIA.length);
        }
      }
    } catch {
      // fallback
    }
    return sanitizePairwiseMatrix(DEFAULT_AHP_MATRIX, DEFAULT_CRITERIA.length);
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CRITERIA, JSON.stringify(criteria));
  }, [criteria]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALTERNATIVES, JSON.stringify(alternatives));
  }, [alternatives]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AHP_MATRIX, JSON.stringify(ahpMatrix));
  }, [ahpMatrix]);

  // Synchronize AHP matrix dimensions if criteria count changes
  useEffect(() => {
    const n = criteria.length;
    if (ahpMatrix.length !== n) {
      const newMat = sanitizePairwiseMatrix(ahpMatrix, n);
      setAhpMatrix(newMat);
    }
  }, [criteria.length]);

  // Load Custom Alternative Pairwise Matrices from localStorage or default
  const [altPairwiseMatrices, setAltPairwiseMatrices] = useState<Record<string, number[][]>>(() => {
    try {
      const saved = localStorage.getItem('spk_ulos_alt_matrices_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('spk_ulos_alt_matrices_v2', JSON.stringify(altPairwiseMatrices));
  }, [altPairwiseMatrices]);

  // REAL-TIME REACTIVE CALCULATIONS (100% Client-Side Real-Time)
  const sawResult = useMemo(() => {
    return calculateSAW(alternatives, criteria);
  }, [alternatives, criteria]);

  const ahpResult = useMemo(() => {
    return calculateAHP(ahpMatrix, criteria, alternatives, altPairwiseMatrices);
  }, [ahpMatrix, criteria, alternatives, altPairwiseMatrices]);

  const comparison = useMemo(() => {
    return generateComparison(alternatives, sawResult, ahpResult, criteria);
  }, [alternatives, sawResult, ahpResult, criteria]);

  // HANDLERS FOR CRITERIA
  const handleUpdateCriterion = (updated: Criterion) => {
    setCriteria((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleAddCriterion = (newCrit: Criterion) => {
    setCriteria((prev) => [...prev, newCrit]);
    // Expand AHP matrix
    setAhpMatrix((prev) => {
      const newLen = prev.length + 1;
      const nextMat: number[][] = [];
      for (let i = 0; i < newLen; i++) {
        nextMat[i] = [];
        for (let j = 0; j < newLen; j++) {
          if (i === j) {
            nextMat[i][j] = 1;
          } else if (i < prev.length && j < prev.length) {
            nextMat[i][j] = prev[i][j];
          } else {
            nextMat[i][j] = 1;
          }
        }
      }
      return nextMat;
    });
  };

  const handleDeleteCriterion = (id: string) => {
    if (criteria.length <= 2) return;
    const index = criteria.findIndex((c) => c.id === id);
    if (index === -1) return;

    setCriteria((prev) => prev.filter((c) => c.id !== id));
    // Remove row & col from AHP matrix
    setAhpMatrix((prev) => {
      const nextMat: number[][] = [];
      for (let i = 0; i < prev.length; i++) {
        if (i === index) continue;
        const row: number[] = [];
        for (let j = 0; j < prev[i].length; j++) {
          if (j === index) continue;
          row.push(prev[i][j]);
        }
        nextMat.push(row);
      }
      return nextMat;
    });
  };

  const handleAutoNormalizeWeights = () => {
    const total = criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
    if (total <= 0) return;
    setCriteria((prev) =>
      prev.map((c) => ({
        ...c,
        weight: Number(((c.weight / total)).toFixed(4)),
      }))
    );
  };

  // HANDLERS FOR ALTERNATIVES
  const handleUpdateAlternativeScore = (altId: string, critId: string, val: number) => {
    setAlternatives((prev) =>
      prev.map((alt) => {
        if (alt.id !== altId) return alt;
        return {
          ...alt,
          scores: {
            ...alt.scores,
            [critId]: val,
          },
        };
      })
    );
  };

  const handleUpdateAlternativeInfo = (updatedAlt: Alternative) => {
    setAlternatives((prev) => prev.map((alt) => (alt.id === updatedAlt.id ? updatedAlt : alt)));
  };

  const handleAddAlternative = (newAlt: Alternative) => {
    setAlternatives((prev) => [...prev, newAlt]);
  };

  const handleDeleteAlternative = (id: string) => {
    if (alternatives.length <= 2) return;
    setAlternatives((prev) => prev.filter((alt) => alt.id !== id));
  };

  // HANDLERS FOR AHP MATRIX
  const handleUpdatePairwiseValue = (i: number, j: number, val: number) => {
    setAhpMatrix((prev) => updatePairwiseCell(prev, i, j, val));
  };

  const handleUpdateAltPairwiseValue = (critId: string, i: number, j: number, val: number) => {
    setAltPairwiseMatrices((prev) => updateAlternativePairwiseCell(prev, critId, i, j, val));
  };

  const handleResetAhpMatrix = () => {
    setAhpMatrix(sanitizePairwiseMatrix(DEFAULT_AHP_MATRIX, criteria.length));
    setAltPairwiseMatrices({});
    localStorage.removeItem('spk_ulos_alt_matrices_v2');
  };

  // Full reset back to default
  const handleResetAllData = () => {
    if (window.confirm('Kembalikan seluruh data alternatif dan kriteria ke preset asli Sumatera Utara?')) {
      setCriteria(DEFAULT_CRITERIA);
      setAlternatives(DEFAULT_ALTERNATIVES);
      setAhpMatrix(sanitizePairwiseMatrix(DEFAULT_AHP_MATRIX, DEFAULT_CRITERIA.length));
      setAltPairwiseMatrices({});
      localStorage.removeItem(STORAGE_KEYS.CRITERIA);
      localStorage.removeItem(STORAGE_KEYS.ALTERNATIVES);
      localStorage.removeItem(STORAGE_KEYS.AHP_MATRIX);
      localStorage.removeItem('spk_ulos_alt_matrices_v2');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-black font-sans text-slate-800 dark:text-neutral-100 antialiased selection:bg-neutral-800 selection:text-white transition-colors duration-200">
      {/* Fixed Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        consistency={ahpResult.consistency}
        onResetData={handleResetAllData}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          alternativeCount={alternatives.length}
          criteriaCount={criteria.length}
          consistency={ahpResult.consistency}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          onOpenExport={() => setIsExportOpen(true)}
        />

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100/70 dark:bg-black transition-colors duration-200">
          {activeTab === 'data' && (
            <DataMentahTab
              criteria={criteria}
              alternatives={alternatives}
              onUpdateCriterion={handleUpdateCriterion}
              onAddCriterion={handleAddCriterion}
              onDeleteCriterion={handleDeleteCriterion}
              onUpdateAlternativeScore={handleUpdateAlternativeScore}
              onUpdateAlternativeInfo={handleUpdateAlternativeInfo}
              onAddAlternative={handleAddAlternative}
              onDeleteAlternative={handleDeleteAlternative}
              onAutoNormalizeWeights={handleAutoNormalizeWeights}
            />
          )}

          {activeTab === 'saw' && (
            <MetodeSawTab
              alternatives={alternatives}
              criteria={criteria}
              sawResult={sawResult}
            />
          )}

          {activeTab === 'ahp' && (
            <MetodeAhpTab
              criteria={criteria}
              alternatives={alternatives}
              ahpResult={ahpResult}
              onUpdatePairwiseValue={handleUpdatePairwiseValue}
              onUpdateAltPairwiseValue={handleUpdateAltPairwiseValue}
              onResetAhpMatrix={handleResetAhpMatrix}
            />
          )}

          {activeTab === 'komparasi' && (
            <KomparasiTab
              items={comparison.items}
              insight={comparison.insight}
              criteria={criteria}
              alternatives={alternatives}
            />
          )}
        </main>
      </div>

      {/* Export / Print Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        alternatives={alternatives}
        criteria={criteria}
        sawResult={sawResult}
        ahpResult={ahpResult}
        comparisonItems={comparison.items}
        insight={comparison.insight}
      />
    </div>
  );
}
