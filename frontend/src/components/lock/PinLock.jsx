import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', 'back'],
];

export function PinLock({ onComplete }) {
  const [pin, setPin] = useState([]);
  const maxDigits = 6;

  const handleKey = (key) => {
    if (key === 'back') {
      setPin(prev => prev.slice(0, -1));
    } else {
      setPin(prev => {
        if (prev.length >= maxDigits) return prev;
        return [...prev, key];
      });
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleKey(e.key);
      } else if (e.key === 'Backspace') {
        handleKey('back');
      } else if (e.key === 'Enter' && pin.length >= 4) {
        onComplete(pin.join(''));
        setPin([]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pin, onComplete]);

  const handleOk = () => {
    if (pin.length >= 4) {
      onComplete(pin.join(''));
      setPin([]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <p className="text-xs text-slate-500 dark:text-slate-400">Masukkan PIN (minimal 4 digit)</p>

      {/* Dots display */}
      <div className="flex items-center gap-2 py-1">
        {Array.from({ length: maxDigits }).map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              i < pin.length
                ? 'bg-indigo-600 scale-110 shadow-sm'
                : 'bg-slate-300 dark:bg-slate-600'
            }`}
          />
        ))}
      </div>

      {/* Keypad — fixed height buttons, NO aspect-square */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {KEYS.flat().map((key, i) => {
          if (key === '') return <div key={i} />;

          if (key === 'back') {
            return (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className="w-full h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center active:scale-90 transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            );
          }

          return (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className="w-full h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-lg font-bold text-slate-800 dark:text-white shadow-sm active:scale-90 transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              {key}
            </button>
          );
        })}
      </div>

      {/* OK Button */}
      <button
        onClick={handleOk}
        disabled={pin.length < 4}
        className={`w-full h-10 rounded-xl font-bold text-xs transition-all mt-1 ${
          pin.length >= 4
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
        }`}
      >
        OK
      </button>
    </div>
  );
}
