'use client';

import React, { ChangeEvent } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { useNotifier } from '../../context/NotificationContext';

export const EssentialsForm = () => {
  const { config, updateConfig, logoPreview, setLogoPreview } = useConfig();
  const { notify } = useNotifier();

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setLogoPreview(result);
      updateConfig('essentials.logoData', result);
      notify('Logo loaded');
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    setLogoPreview('');
    updateConfig('essentials.logoData', '');
    const fileInput = document.getElementById('logo-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    notify('Logo cleared');
  };

  return (
    <section id="essentials">
      <div className="rounded-2xl bg-white/80 ring-1 ring-slate-200 backdrop-blur p-4 sm:p-6 dark:bg-slate-900/60 dark:ring-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Essentials</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Brand basics</span>
        </div>
        <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">
          Tell us your brand name, industry, and (optionally) upload a logo.
        </p>
        <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm text-slate-600 dark:text-slate-300">Brand name</span>
            <input
              type="text"
              className="mt-1 w-full rounded-lg bg-slate-200/70 ring-1 ring-slate-300/80 px-3 py-2 dark:bg-slate-800/70 dark:ring-white/10"
              placeholder="Acme Co."
              aria-label="Brand name"
              value={config.essentials.name}
              onChange={(e) => updateConfig('essentials.name', e.target.value)}
            />
          </label>
          <label className="block">
            <span className="text-sm text-slate-600 dark:text-slate-300">Industry</span>
            <input
              list="industry-suggestions"
              type="text"
              className="mt-1 w-full rounded-lg bg-slate-200/70 ring-1 ring-slate-300/80 px-3 py-2 dark:bg-slate-800/70 dark:ring-white/10"
              placeholder="e.g., SaaS, Healthcare"
              aria-label="Industry"
              value={config.essentials.industry}
              onChange={(e) => updateConfig('essentials.industry', e.target.value)}
            />
            <datalist id="industry-suggestions">
              <option value="Technology" />
              <option value="SaaS" />
              <option value="E‑commerce" />
              <option value="Healthcare" />
              <option value="Finance" />
              <option value="Education" />
              <option value="Real Estate" />
              <option value="Hospitality" />
              <option value="Manufacturing" />
              <option value="Non‑profit" />
            </datalist>
          </label>
          <div className="sm:col-span-2">
            <span className="text-sm text-slate-600 dark:text-slate-300">Logo</span>
            <div className="mt-1 grid grid-cols-[1fr,auto] gap-3 items-start">
              <input
                id="logo-file"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoChange}
                className="w-full rounded-lg text-sm bg-slate-200/70 ring-1 ring-slate-300/80 px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-slate-300 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-400/50 dark:bg-slate-800/70 dark:ring-white/10 dark:file:bg-slate-700 dark:file:text-white/90"
              />
              <button
                type="button"
                onClick={clearLogo}
                className="px-3 py-2 rounded-lg bg-slate-200 ring-1 ring-slate-300 hover:bg-slate-300 text-sm dark:bg-slate-800/70 dark:ring-white/10 dark:hover:bg-slate-800"
              >
                Clear
              </button>
            </div>
            <div className="mt-2 h-20 w-20 rounded-xl ring-1 ring-slate-300 bg-slate-200/50 grid place-items-center overflow-hidden dark:ring-white/10 dark:bg-slate-800/50">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain" />
              ) : (
                <span className="text-[10px] text-slate-500 dark:text-slate-400">No logo</span>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};