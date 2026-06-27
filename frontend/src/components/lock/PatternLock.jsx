import { useState, useRef, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';

const DOTS = [
  { id: 1, row: 0, col: 0 },
  { id: 2, row: 0, col: 1 },
  { id: 3, row: 0, col: 2 },
  { id: 4, row: 1, col: 0 },
  { id: 5, row: 1, col: 1 },
  { id: 6, row: 1, col: 2 },
  { id: 7, row: 2, col: 0 },
  { id: 8, row: 2, col: 1 },
  { id: 9, row: 2, col: 2 },
];

export function PatternLock({ onComplete }) {
  const [selected, setSelected] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [pos, setPos] = useState(null);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const getDotCenter = useCallback((id) => {
    const dot = DOTS.find(d => d.id === id);
    const size = containerRef.current?.offsetWidth || 220;
    const cell = size / 3;
    return {
      x: dot.col * cell + cell / 2,
      y: dot.row * cell + cell / 2,
    };
  }, []);

  const getTouchDot = useCallback((clientX, clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const size = rect.width;
    const cell = size / 3;
    const col = Math.floor(x / cell);
    const row = Math.floor(y / cell);
    if (col < 0 || col > 2 || row < 0 || row > 2) return null;
    return DOTS.find(d => d.row === row && d.col === col);
  }, []);

  const resetPattern = () => {
    setSelected([]);
    setDrawing(false);
    setPos(null);
  };

  const handleStart = useCallback((e) => {
    const point = e.touches ? e.touches[0] : e;
    const dot = getTouchDot(point.clientX, point.clientY);
    if (dot) {
      setDrawing(true);
      setSelected([dot.id]);
      setPos(getDotCenter(dot.id));
    }
  }, [getTouchDot, getDotCenter]);

  const handleMove = useCallback((e) => {
    if (!drawing) return;
    e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    const dot = getTouchDot(point.clientX, point.clientY);
    if (dot && !selected.includes(dot.id)) {
      setSelected(prev => [...prev, dot.id]);
    }
    setPos({ x: point.clientX - (containerRef.current?.getBoundingClientRect().left || 0), y: point.clientY - (containerRef.current?.getBoundingClientRect().top || 0) });
  }, [drawing, getTouchDot, selected]);

  const handleEnd = useCallback(() => {
    if (!drawing) return;
    setDrawing(false);
    setPos(null);
  }, [drawing]);

  const handleOk = () => {
    if (selected.length >= 3) {
      onComplete(selected.join(''));
      resetPattern();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Buat pola minimal 3 titik</p>
      <div
        ref={containerRef}
        className="relative w-full aspect-square select-none touch-none max-w-[220px] mx-auto"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <svg ref={svgRef} className="absolute inset-0 w-full h-full" style={{ touchAction: 'none' }}>
          {/* Lines */}
          {selected.length > 1 && selected.slice(0, -1).map((id, i) => {
            const from = getDotCenter(id);
            const to = getDotCenter(selected[i + 1]);
            return (
              <line
                key={`line-${i}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="#6366F1" strokeWidth="3" strokeLinecap="round"
                className="opacity-60"
              />
            );
          })}
          {/* Drawing line */}
          {drawing && pos && selected.length > 0 && (
            <line
              x1={getDotCenter(selected[selected.length - 1]).x}
              y1={getDotCenter(selected[selected.length - 1]).y}
              x2={pos.x} y2={pos.y}
              stroke="#6366F1" strokeWidth="3" strokeLinecap="round"
              className="opacity-40"
            />
          )}
        </svg>

        {/* Dots */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {DOTS.map(dot => {
            const isSelected = selected.includes(dot.id);
            return (
              <div
                key={dot.id}
                className="flex items-center justify-center"
              >
                <div className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                  isSelected
                    ? 'bg-indigo-600 scale-150 shadow-lg shadow-indigo-600/40'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      {selected.length > 0 && !drawing && (
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={resetPattern}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Ulang
          </button>
          <button
            onClick={handleOk}
            disabled={selected.length < 3}
            className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all ${
              selected.length >= 3
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}
