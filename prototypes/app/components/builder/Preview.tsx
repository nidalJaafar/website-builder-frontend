'use client';

import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import { useNotifier } from '../../context/NotificationContext';

export const Preview = () => {
  const { generateSite } = useConfig();
  const { notify } = useNotifier();

  return (
    <div className="relative" id="preview">
      <div className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur p-4">
        <div className="aspect-[16/10] rounded-xl bg-white ring-1 ring-slate-300 overflow-hidden dark:bg-slate-900 dark:ring-white/10">
          <div className="h-full w-full grid place-items-center">
            <div className="text-center px-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-200 ring-1 ring-slate-300 px-3 py-1 text-xs text-slate-600 mb-4 dark:bg-slate-800/80 dark:ring-white/10 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full animate-pulse"></span>
                AI Preview
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-white">
                Your generated site will appear here
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                For now: Hello, World!
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            className="px-3 py-2 rounded-lg ring-1 shadow-glow"
            onClick={generateSite}
          >
            Generate Website
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-slate-200 ring-1 ring-slate-300 hover:bg-slate-300 text-slate-800 dark:bg-slate-800/80 dark:ring-white/10 dark:hover:bg-slate-800 dark:text-white"
            onClick={() => notify('Copy Code coming soon')}
          >
            Copy Code
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-slate-200 ring-1 ring-slate-300 hover:bg-slate-300 text-slate-800 dark:bg-slate-800/80 dark:ring-white/10 dark:hover:bg-slate-800 dark:text-white"
            onClick={() => notify('Download ZIP coming soon')}
          >
            Download ZIP
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-slate-200 ring-1 ring-slate-300 hover:bg-slate-300 text-slate-800 dark:bg-slate-800/80 dark:ring-white/10 dark:hover:bg-slate-800 dark:text-white"
            onClick={() => notify('Deploy coming soon')}
          >
            Deploy
          </button>
        </div>
      </div>
    </div>
  );
};