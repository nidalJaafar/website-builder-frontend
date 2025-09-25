'use client';

import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { AstraSiteLogo } from '../icons';

type HeaderProps = {
  onToggleSidebar: () => void;
};

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200 dark:supports-[backdrop-filter]:bg-slate-900/40 dark:bg-slate-900/60 dark:border-white/10">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <button
            aria-label="Toggle history"
            className="md:hidden px-3 py-1.5 rounded-xl bg-slate-200 ring-1 ring-slate-300 hover:bg-slate-300 dark:bg-slate-800/70 dark:ring-white/10 dark:hover:bg-slate-800"
            onClick={onToggleSidebar}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M4 7h16M4 12h16M4 17h16"></path>
            </svg>
          </button>
          <a className="flex items-center gap-2" href="#">
            <AstraSiteLogo />
            <span className="font-semibold tracking-tight text-slate-900 dark:text-white">
              AstraSite AI
            </span>
          </a>
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1.5 rounded-xl bg-slate-200 ring-1 ring-slate-300 hover:bg-slate-300 text-slate-800 dark:bg-slate-800/70 dark:ring-white/10 dark:hover:bg-slate-800 dark:text-white transition"
              onClick={toggleTheme}
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <button className="px-3 py-1.5 rounded-xl ring-1 shadow-glow transition">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};