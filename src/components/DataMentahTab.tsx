import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Info, 
  Check, 
  Sparkles, 
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Lock
} from 'lucide-react';
import { Alternative, Criterion, CriterionType } from '../types/spk';
import { useAccess } from '../context/AccessContext';

interface DataMentahTabProps {
  criteria: Criterion[];
  alternatives: Alternative[];
  onUpdateCriterion: (criterion: Criterion) => void;
  onAddCriterion: (criterion: Criterion) => void;
  onDeleteCriterion: (id: string) => void;
  onUpdateAlternativeScore: (alternativeId: string, criterionId: string, value: number) => void;
  onUpdateAlternativeInfo: (alternative: Alternative) => void;
  onAddAlternative: (alternative: Alternative) => void;
  onDeleteAlternative: (id: string) => void;
  onAutoNormalizeWeights: () => void;
}

export const DataMentahTab: React.FC<DataMentahTabProps> = ({
  criteria,
  alternatives,
  onUpdateCriterion,
  onAddCriterion,
  onDeleteCriterion,
  onUpdateAlternativeScore,
  onUpdateAlternativeInfo,
  onAddAlternative,
  onDeleteAlternative,
  onAutoNormalizeWeights,
}) => {
  const { isEditor } = useAccess();
  const [showAddCritModal, setShowAddCritModal] = useState(false);
  const [showAddAltModal, setShowAddAltModal] = useState(false);

  // New criterion state
  const [newCritName, setNewCritName] = useState('');
  const [newCritType, setNewCritType] = useState<CriterionType>('benefit');
  const [newCritWeight, setNewCritWeight] = useState('0.15');

  // New alternative state
  const [newAltName, setNewAltName] = useState('');

  // Total weight
  const totalWeight = criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0);

  const handleCreateCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditor || !newCritName.trim()) return;

    const nextIndex = criteria.length + 1;
    const newCrit: Criterion = {
      id: `c_${Date.now()}`,
      code: `C${nextIndex}`,
      name: newCritName.trim(),
      type: newCritType,
      weight: parseFloat(newCritWeight) || 0.1,
      description: '',
      unit: '',
    };

    onAddCriterion(newCrit);
    setNewCritName('');
    setShowAddCritModal(false);
  };

  const handleCreateAlternative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditor || !newAltName.trim()) return;

    const nextIndex = alternatives.length + 1;
    const initialScores: Record<string, number> = {};
    criteria.forEach((c) => {
      initialScores[c.id] = 75; // default initial score
    });

    const newAlt: Alternative = {
      id: `a_${Date.now()}`,
      code: `A${nextIndex}`,
      name: newAltName.trim(),
      location: 'Kota Pematangsiantar',
      description: '',
      verifiedHandwoven: false,
      scores: initialScores,
    };

    onAddAlternative(newAlt);
    setNewAltName('');
    setShowAddAltModal(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Viewer Mode Banner */}
      {!isEditor && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-amber-900 dark:text-amber-200 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider">Mode Viewer (Hanya Lihat)</h4>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                Formulir dan tombol edit data mentah dikunci. Beralih ke Mode Editor untuk melakukan perubahan data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Info Card */}
      <div className="bg-white dark:bg-black rounded-xl p-5 text-slate-800 dark:text-neutral-100 shadow-xs border border-slate-200/90 dark:border-neutral-900 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-800 font-medium">
                Sistem Pendukung Keputusan Multi-Kriteria
              </span>
              <span className="text-xs text-slate-500 dark:text-neutral-400">Warisan Budaya Tenun Batak</span>
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Matriks Penilaian Tempat Penjualan Ulos
            </h3>
            <p className="text-xs text-slate-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
              {isEditor
                ? 'Anda dapat mengedit nilai skor alternatif dan bobot kriteria secara real-time. Setiap perubahan angka akan langsung memicu pembaruan otomatis pada normalisasi matriks SAW, rasio konsistensi Saaty AHP, dan grafik perbandingan hasil.'
                : 'Data mentah kriteria dan alternatif toko ulos disajikan dalam mode baca. Hasil perhitungan SAW dan AHP diperbarui secara otomatis dari data terkini.'}
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <div className="bg-slate-50 dark:bg-neutral-950 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-neutral-900 text-center">
              <div className="text-[10px] text-slate-500 dark:text-neutral-400 font-mono uppercase font-medium">Total Bobot SAW</div>
              <div
                className={`text-sm font-semibold font-mono mt-0.5 ${
                  Math.abs(totalWeight - 1.0) < 0.01 || Math.abs(totalWeight - 100) < 1
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-amber-700 dark:text-amber-400'
                }`}
              >
                {totalWeight.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KRITERIA TABLE SECTION */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-neutral-950">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">1. Daftar Kriteria Penilaian</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-neutral-900 text-blue-700 dark:text-neutral-300 font-mono border border-blue-200 dark:border-neutral-800">
                {criteria.length} Kriteria
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Tipe benefit (semakin besar semakin baik) atau cost (semakin kecil semakin baik), serta bobot preferensi.
            </p>
          </div>

          {isEditor && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onAutoNormalizeWeights}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 transition font-medium"
                title="Normalkan bobot agar total berjumlah 1.00 (100%)"
              >
                Normalkan Bobot (1.00)
              </button>
              <button
                onClick={() => setShowAddCritModal(true)}
                className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border dark:border-neutral-800 text-white transition font-medium shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kriteria</span>
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-neutral-900">
              <tr>
                <th className="py-2.5 px-4 w-16">Kode</th>
                <th className="py-2.5 px-4 min-w-[180px]">Nama Kriteria</th>
                <th className="py-2.5 px-4 w-32">Sifat / Tipe</th>
                <th className="py-2.5 px-4 w-28">Bobot SAW (W)</th>
                <th className="py-2.5 px-4 w-28">Proporsi</th>
                {isEditor && <th className="py-2.5 px-4 w-20 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300">
              {criteria.map((crit) => {
                const proportion = totalWeight > 0 ? (crit.weight / totalWeight) * 100 : 0;
                return (
                  <tr key={crit.id} className="hover:bg-slate-50/70 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700 dark:text-blue-400">{crit.code}</td>
                    <td className="py-3 px-4">
                      {isEditor ? (
                        <input
                          type="text"
                          value={crit.name}
                          onChange={(e) => onUpdateCriterion({ ...crit, name: e.target.value })}
                          className="w-full bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-neutral-700 focus:border-blue-500 focus:outline-hidden font-medium text-slate-900 dark:text-white py-0.5"
                        />
                      ) : (
                        <span className="font-medium text-slate-900 dark:text-white py-0.5 block">{crit.name}</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isEditor ? (
                        <select
                          value={crit.type}
                          onChange={(e) =>
                            onUpdateCriterion({ ...crit, type: e.target.value as CriterionType })
                          }
                          className={`text-xs font-semibold px-2 py-1 rounded border capitalize focus:outline-hidden ${
                            crit.type === 'benefit'
                              ? 'bg-emerald-50 dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-neutral-800'
                              : 'bg-amber-50 dark:bg-neutral-900 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-neutral-800'
                          }`}
                        >
                          <option value="benefit">Benefit (Max)</option>
                          <option value="cost">Cost (Min)</option>
                        </select>
                      ) : (
                        <span className={`text-xs font-semibold px-2 py-1 rounded border capitalize inline-block ${
                          crit.type === 'benefit'
                            ? 'bg-emerald-50 dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-neutral-800'
                            : 'bg-amber-50 dark:bg-neutral-900 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-neutral-800'
                        }`}>
                          {crit.type}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isEditor ? (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="100"
                          value={crit.weight}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            onUpdateCriterion({ ...crit, weight: isNaN(val) ? 0 : val });
                          }}
                          className="w-20 px-2 py-1 rounded border border-slate-200 dark:border-neutral-800 focus:border-blue-500 focus:outline-hidden font-mono text-slate-900 dark:text-white bg-white dark:bg-black"
                        />
                      ) : (
                        <span className="font-mono font-semibold text-slate-900 dark:text-white">{crit.weight}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 dark:text-neutral-400">
                      <div className="flex items-center space-x-2">
                        <span className="w-10 text-right">{proportion.toFixed(1)}%</span>
                        <div className="w-12 h-1.5 bg-slate-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(100, proportion)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    {isEditor && (
                      <td className="py-3 px-4 text-right">
                        {criteria.length > 2 && (
                          <button
                            onClick={() => onDeleteCriterion(crit.id)}
                            className="p-1 rounded text-slate-400 dark:text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-neutral-900 transition"
                            title="Hapus kriteria ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ALTERNATIF TABLE SECTION */}
      <div className="bg-white dark:bg-black rounded-xl border border-slate-200/90 dark:border-neutral-900 shadow-xs overflow-hidden transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-neutral-950">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                2. Data Alternatif Toko Ulos & Nilai Kriteria
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-neutral-900 text-blue-700 dark:text-neutral-300 font-mono border border-blue-200 dark:border-neutral-800">
                {alternatives.length} Toko
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
              Nilai kinerja setiap toko ulos pada masing-masing kriteria (Skala 1 - 100).
            </p>
          </div>

          {isEditor && (
            <button
              onClick={() => setShowAddAltModal(true)}
              className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border dark:border-neutral-800 text-white transition font-medium shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Toko Ulos</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-neutral-950 text-slate-600 dark:text-neutral-400 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-neutral-900">
              <tr>
                <th className="py-2.5 px-4 w-14">Kode</th>
                <th className="py-2.5 px-4 min-w-[220px]">Nama Toko Ulos</th>
                {criteria.map((c) => (
                  <th key={c.id} className="py-2.5 px-3 text-center min-w-[100px]" title={c.name}>
                    <div className="font-semibold text-slate-800 dark:text-white">{c.code}</div>
                    <div className="text-[10px] lowercase text-slate-400 dark:text-neutral-500 font-sans font-normal truncate max-w-[90px]">
                      {c.type}
                    </div>
                  </th>
                ))}
                {isEditor && <th className="py-2.5 px-3 w-16 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-neutral-900 text-slate-700 dark:text-neutral-300">
              {alternatives.map((alt) => (
                <tr key={alt.id} className="hover:bg-slate-50/70 dark:hover:bg-neutral-900/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-blue-700 dark:text-blue-400">{alt.code}</td>
                  <td className="py-3 px-4">
                    {isEditor ? (
                      <input
                        type="text"
                        value={alt.name}
                        onChange={(e) =>
                          onUpdateAlternativeInfo({ ...alt, name: e.target.value })
                        }
                        className="w-full bg-transparent font-medium text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 dark:hover:border-neutral-700 focus:border-blue-500 focus:outline-hidden py-0.5"
                      />
                    ) : (
                      <span className="font-medium text-slate-900 dark:text-white py-0.5 block">{alt.name}</span>
                    )}
                  </td>

                  {/* Criteria score inputs */}
                  {criteria.map((c) => {
                    const score = alt.scores[c.id] ?? 0;
                    return (
                      <td key={c.id} className="py-3 px-3 text-center font-mono">
                        {isEditor ? (
                          <input
                            type="number"
                            min="1"
                            max="100"
                            step="1"
                            value={score}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              onUpdateAlternativeScore(alt.id, c.id, isNaN(val) ? 0 : val);
                            }}
                            className="w-16 text-center py-1 rounded border border-slate-200 dark:border-neutral-800 focus:border-blue-500 focus:outline-hidden font-mono text-slate-900 dark:text-white bg-white dark:bg-black"
                          />
                        ) : (
                          <span className="font-semibold text-slate-900 dark:text-white">{score}</span>
                        )}
                      </td>
                    );
                  })}

                  {isEditor && (
                    <td className="py-3 px-3 text-right">
                      {alternatives.length > 2 && (
                        <button
                          onClick={() => onDeleteAlternative(alt.id)}
                          className="p-1 rounded text-slate-400 dark:text-neutral-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-neutral-900 transition"
                          title="Hapus toko ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Tambah Kriteria */}
      {showAddCritModal && isEditor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black rounded-xl shadow-xl border border-slate-200 dark:border-neutral-900 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-neutral-900">
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">Tambah Kriteria Baru</h4>
              <button
                onClick={() => setShowAddCritModal(false)}
                className="text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateCriterion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Nama Kriteria
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ketersediaan Benang Sutra Emas"
                  value={newCritName}
                  onChange={(e) => setNewCritName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-slate-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Tipe Kriteria
                  </label>
                  <select
                    value={newCritType}
                    onChange={(e) => setNewCritType(e.target.value as CriterionType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-slate-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-hidden capitalize"
                  >
                    <option value="benefit">Benefit (Max)</option>
                    <option value="cost">Cost (Min)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                    Bobot Relatif
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.01"
                    max="1"
                    value={newCritWeight}
                    onChange={(e) => setNewCritWeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-slate-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-neutral-900">
                <button
                  type="button"
                  onClick={() => setShowAddCritModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border dark:border-neutral-800 rounded-lg shadow-xs"
                >
                  Simpan Kriteria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Tambah Toko Ulos */}
      {showAddAltModal && isEditor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-black rounded-xl shadow-xl border border-slate-200 dark:border-neutral-900 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-neutral-900">
              <h4 className="text-base font-semibold text-slate-900 dark:text-white">Tambah Tempat Penjualan Ulos</h4>
              <button
                onClick={() => setShowAddAltModal(false)}
                className="text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateAlternative} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1">
                  Nama Toko Ulos
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kios Ulos Marsada"
                  value={newAltName}
                  onChange={(e) => setNewAltName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-slate-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-neutral-900">
                <button
                  type="button"
                  onClick={() => setShowAddAltModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-900 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border dark:border-neutral-800 rounded-lg shadow-xs"
                >
                  Simpan Toko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

