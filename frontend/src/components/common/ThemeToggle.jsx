import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useThemeStore } from '../../store/themeStore';
import { Button } from './Button';

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="relative h-10 w-10 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 border border-slate-200 dark:border-white/10 overflow-hidden group"
    >
      <div className={`flex flex-col items-center justify-center transition-transform duration-500 ease-spring ${theme === 'dark' ? '-translate-y-5' : 'translate-y-5'}`}>
        <FontAwesomeIcon 
          icon={faMoon} 
          className="h-4 w-4 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)] mb-6 transition-all" 
        />
        <FontAwesomeIcon 
          icon={faSun} 
          className="h-4 w-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all" 
        />
      </div>
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}
