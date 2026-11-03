import React, { useState } from 'react';
import { useAccess } from '../context/AccessContext';

interface ShareAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAccessModal: React.FC<ShareAccessModalProps> = ({ isOpen, onClose }) => {
  const {
    role,
    isEditor,
    switchRoleWithPin,
    changePin,
    switchToViewer,
    getViewerShareUrl,
    getEditorShareUrl,
    pin,
  } = useAccess();

  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [copiedType, setCopiedType] = useState<'viewer' | 'editor' | null>(null);

  // Change PIN State
  const [showChangePin, setShowChangePin] = useState(false);
  const [oldPinInput, setOldPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [changePinMsg, setChangePinMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = async (type: 'viewer' | 'editor') => {
    const url = type === 'viewer' ? getViewerShareUrl() : getEditorShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch {
      // Fallback copy
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    }
  };

  const handleUnlockEditor = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    const success = switchRoleWithPin(inputPin);
    if (success) {
      setInputPin('');
    } else {
      setPinError('PIN salah! Silakan coba lagi (PIN default: 123456).');
    }
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinMsg(null);

    if (newPinInput !== confirmPinInput) {
      setChangePinMsg({ type: 'error', text: 'Konfirmasi PIN baru tidak cocok!' });
      return;
    }

    const res = changePin(oldPinInput, newPinInput);
    if (res.success) {
      setChangePinMsg({ type: 'success', text: res.message });
      setOldPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setTimeout(() => setShowChangePin(false), 2000);
    } else {
      setChangePinMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-neutral-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-neutral-100">
                Pengelolaan Hak Akses & Berbagi
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                Atur izin akses Viewer & Editor serta bagikan tautan web
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:text-neutral-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Current Role Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isEditor 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200' 
              : 'bg-slate-50 dark:bg-neutral-800/60 border-slate-200 dark:border-neutral-700 text-slate-800 dark:text-neutral-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full animate-pulse ${isEditor ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider block text-slate-500 dark:text-neutral-400">
                  Status Sesi Anda
                </span>
                <span className="text-sm font-bold flex items-center gap-1.5">
                  {isEditor ? (
                    <>
                      <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editor (Akses Penuh Edit Data)
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Viewer (Hanya Lihat / Terkunci)
                    </>
                  )}
                </span>
              </div>
            </div>

            {isEditor && (
              <button
                onClick={switchToViewer}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-600 text-slate-700 dark:text-neutral-200 hover:bg-slate-50 dark:hover:bg-neutral-700 transition-colors shadow-sm"
              >
                Keluar ke Mode Viewer
              </button>
            )}
          </div>

          {/* Section 1: Share Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
              Bagikan Tautan Web
            </h4>

            {/* Viewer Share Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-neutral-300 flex items-center justify-between">
                <span>Link Viewer (Hanya Melihat Data)</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-normal">
                  Aman dibagikan ke umum
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={getViewerShareUrl()}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 focus:outline-none font-mono"
                />
                <button
                  onClick={() => handleCopyLink('viewer')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    copiedType === 'viewer'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-sm'
                  }`}
                >
                  {copiedType === 'viewer' ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Salin Link
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                Pengunjung yang membuka link ini tidak memiliki akses untuk menambah, merubah, atau menghapus data.
              </p>
            </div>

            {/* Editor Share Link (Only visible if editor or for demonstration) */}
            {isEditor && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-neutral-800">
                <label className="text-xs font-medium text-slate-700 dark:text-neutral-300 flex items-center justify-between">
                  <span>Link Editor (Akses Pengeditan)</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                    Link Rahasia Editor
                  </span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getEditorShareUrl()}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => handleCopyLink('editor')}
                    className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                      copiedType === 'editor'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                    }`}
                  >
                    {copiedType === 'editor' ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Tersalin!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Salin Link Editor
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                  Pengunjung yang membuka tautan ini langsung otomatis menjadi Editor dengan hak pengeditan penuh.
                </p>
              </div>
            )}
          </div>

          {/* Section 2: Switch to Editor via PIN (If in Viewer mode) */}
          {!isEditor && (
            <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                Masuk ke Mode Editor
              </h4>
              <form onSubmit={handleUnlockEditor} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 dark:text-neutral-300 block mb-1">
                    Masukkan PIN Editor
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Masukkan PIN (Default: 123456)"
                      value={inputPin}
                      onChange={(e) => setInputPin(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-slate-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium transition-colors shadow-sm"
                    >
                      Buka Akses Edit
                    </button>
                  </div>
                  {pinError && (
                    <p className="text-xs text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {pinError}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-400 dark:text-neutral-500 mt-1">
                    PIN Bawaan Pabrik: <code className="font-mono font-semibold bg-slate-100 dark:bg-neutral-800 px-1 py-0.5 rounded text-slate-600 dark:text-neutral-300">123456</code>
                  </p>
                </div>
              </form>
            </div>
          )}

          {/* Section 3: Change PIN (If in Editor mode) */}
          {isEditor && (
            <div className="pt-4 border-t border-slate-100 dark:border-neutral-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                  Keamanan Editor
                </h4>
                <button
                  type="button"
                  onClick={() => setShowChangePin(!showChangePin)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  {showChangePin ? 'Batal Ubah PIN' : 'Ubah PIN Editor'}
                </button>
              </div>

              {showChangePin && (
                <form onSubmit={handleChangePinSubmit} className="p-4 rounded-xl bg-slate-50 dark:bg-neutral-800/80 border border-slate-200 dark:border-neutral-700 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-neutral-300 block mb-1">
                      PIN Lama
                    </label>
                    <input
                      type="password"
                      value={oldPinInput}
                      onChange={(e) => setOldPinInput(e.target.value)}
                      placeholder="PIN Lama (misal: 123456)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-neutral-300 block mb-1">
                      PIN Baru
                    </label>
                    <input
                      type="password"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      placeholder="PIN Baru minimal 4 karakter"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-neutral-300 block mb-1">
                      Konfirmasi PIN Baru
                    </label>
                    <input
                      type="password"
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      placeholder="Ketik ulang PIN Baru"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-700 text-slate-800 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {changePinMsg && (
                    <p className={`text-xs font-medium ${changePinMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                      {changePinMsg.text}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-medium transition-colors shadow-sm"
                  >
                    Simpan PIN Baru
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-neutral-200 hover:bg-slate-300 dark:hover:bg-neutral-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
