'use client';

import React, { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';

const htmlEscapes: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

function escapeHtml(str: string): string {
  return String(str || '').replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

export const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const { history, loadFromHistory, clearHistory, resetConfig } = useConfig();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(item => 
    (item.prompt || item.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className={`md:sticky md:top-16 md:h-[calc(100vh-5rem)] ${isOpen ? 'block' : 'hidden'} md:block`}>
      <div className="h-full rounded-2xl bg-white/80 ring-1 ring-slate-200 backdrop-blur p-3 flex flex-col dark:bg-slate-900/60 dark:ring-white/10">
        <div className="flex items-center gap-2 mb-2">
          <button
            className="w-full px-3 py-2 rounded-xl ring-1 shadow-glow"
            onClick={resetConfig}
          >
            New project
          </button>
          <button
            className="px-3 py-2 rounded-xl bg-slate-200 ring-1 ring-slate-300 hover:bg-slate-300 dark:bg-slate-800/70 dark:ring-white/10 dark:hover:bg-slate-800"
            title="Clear history"
            onClick={clearHistory}
          >
            Clear
          </button>
        </div>
        <div className="mb-2">
          <input
            className="w-full rounded-lg bg-slate-200/70 ring-1 ring-slate-300/70 px-3 py-2 text-sm placeholder-slate-500 dark:bg-slate-800/70 dark:ring-white/10 dark:placeholder-slate-400"
            placeholder="Search history..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 px-1 mb-1">History</div>
        <nav className="flex-1 overflow-auto space-y-1 pr-1">
          {filteredHistory.map((item) => (
            <button
              key={item.time}
              className="w-full text-left rounded-lg p-3 bg-slate-200/50 ring-1 ring-slate-300/70 hover:bg-slate-200 dark:bg-slate-800/60 dark:ring-white/10 dark:hover:bg-slate-800"
              onClick={() => loadFromHistory(item)}
            >
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {escapeHtml(item.title)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {escapeHtml(item.prompt || 'No prompt').slice(0, 200)}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                {new Date(item.time).toLocaleString()}
              </div>
            </button>
          ))}
        </nav>
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 mt-3">
          <button className="w-full text-left px-3 py-2 rounded-lg bg-slate-200/50 ring-1 ring-slate-300/70 hover:bg-slate-200 text-sm dark:bg-slate-800/60 dark:ring-white/10 dark:hover:bg-slate-800">
            Settings
          </button>
        </div>
      </div>
    </aside>
  );
};