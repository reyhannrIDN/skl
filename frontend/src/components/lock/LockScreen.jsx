import { useState, useCallback } from 'react';
import { PatternLock } from './PatternLock';
import { PinLock } from './PinLock';
import { authApi } from '@/api/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faLock } from '@fortawesome/free-solid-svg-icons';

export function LockScreen({ lockType, onUnlocked }) {
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleCode = useCallback(async (code) => {
    if (verifying) return;
    setVerifying(true);
    setError('');
    try {
      const res = await authApi.verifyLock({ lock_code: code });
      if (res.data.verified) {
        onUnlocked();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Kode salah, coba lagi');
    } finally {
      setVerifying(false);
    }
  }, [onUnlocked, verifying]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      {/* Content wrapper — fits screen height */}
      <div className="relative w-full max-w-xs px-4 flex flex-col items-center gap-3">

        {/* Header — compact */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl animate-pulse" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg relative z-10">
              <FontAwesomeIcon icon={faGraduationCap} className="text-base" />
            </div>
          </div>
          <h2 className="text-sm font-black font-display tracking-tight text-slate-800 dark:text-white mt-1">
            IPSA
          </h2>
          <div className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-400/60">IDN Pamijahan Super Apps</div>
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <FontAwesomeIcon icon={faLock} className="text-[9px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Aplikasi Terkunci</span>
          </div>
        </div>

        {/* Lock UI Card */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl p-4">
          {lockType === 'pattern' ? (
            <PatternLock onComplete={handleCode} />
          ) : (
            <PinLock onComplete={handleCode} />
          )}

          {error && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
              <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Status */}
        {verifying && (
          <p className="text-[10px] text-slate-400 animate-pulse">Memverifikasi...</p>
        )}
      </div>
    </div>
  );
}
