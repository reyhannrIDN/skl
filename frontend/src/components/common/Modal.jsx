import React, { useEffect } from 'react';
import { cn } from '@/utils/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export function Modal({ isOpen, onClose, title, description, children, footer, className }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn(
        "relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300",
        className
      )}>
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              {title && <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">{title}</h2>}
              {description && <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">{description}</p>}
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="space-y-6">
            {children}
          </div>

          {footer && (
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
