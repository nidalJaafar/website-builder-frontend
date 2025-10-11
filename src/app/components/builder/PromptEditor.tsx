'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useConfig } from '../../context/ConfigContext';
import { useNotifier } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

export const PromptEditor = () => {
  const {
    promptText,
    setPromptText,
    generatePrompt,
    resetConfig,
    jsonText,
    isGeneratingPrompt,
  } = useConfig();
  const { notify } = useNotifier();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleGeneratePrompt = () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    void generatePrompt();
  };

  const copyJson = async () => {
    const payload = jsonText ?? '';

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(payload);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = payload;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);

        if (!successful) {
          throw new Error('execCommand copy failed');
        }
      }

      notify('JSON copied');
    } catch (error) {
      console.error('Copy JSON failed', error);
      notify('Copy failed');
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'astrasite-options.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Prompt</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`px-3 py-2 rounded-lg bg-neon-500/20 text-neon-100 ring-1 ring-neon-400/30 shadow-glow transition ${
                isGeneratingPrompt
                  ? 'opacity-70 cursor-progress'
                  : 'hover:bg-neon-500/30'
              } ${!isAuthenticated ? 'opacity-70' : ''}`}
              onClick={handleGeneratePrompt}
              disabled={isGeneratingPrompt}
            >
              {isGeneratingPrompt ? 'Generating...' : 'Generate Prompt'}
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-slate-200 ring-1 ring-slate-300 hover:bg-slate-300 text-slate-800 dark:bg-slate-800/80 dark:ring-white/10 dark:hover:bg-slate-800 dark:text-white"
              onClick={resetConfig}
            >
              Reset
            </button>
          </div>
          {!isAuthenticated && (
            <p className="text-xs text-slate-400">
              Sign in to enable prompt generation.
            </p>
          )}
        </div>
        <textarea
          className="w-full min-h-[10rem] rounded-xl bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 placeholder-slate-400"
          placeholder="Your prompt will appear here. Edit freely before generating the website."
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
        ></textarea>
        <details
          className="mt-3 rounded-xl bg-slate-900/60 ring-1 ring-white/10 p-3"
          id="json-view"
        >
          <summary className="cursor-pointer text-sm text-slate-300">
            Options JSON
          </summary>
          <pre className="mt-2 text-xs text-slate-300 overflow-auto max-h-60">
            {jsonText}
          </pre>
          <div className="mt-2 flex gap-2">
            <button
              className="px-3 py-2 rounded-lg bg-slate-800/80 ring-1 ring-white/10 hover:bg-slate-800 text-sm"
              onClick={copyJson}
            >
              Copy JSON
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-slate-800/80 ring-1 ring-white/10 hover:bg-slate-800 text-sm"
              onClick={downloadJson}
            >
              Download JSON
            </button>
          </div>
        </details>
      </div>
    </div>
  );
};
