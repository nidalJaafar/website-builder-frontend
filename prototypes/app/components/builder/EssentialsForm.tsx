"use client";

import React, { useRef } from "react";
import { useConfig } from "@/app/context/ConfigContext";

export const EssentialsForm = () => {
  const { config, updateConfig, setLogoPreview, logoPreview } = useConfig();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      updateConfig("essentials.logoData", dataUrl);
      setLogoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    if (fileRef.current) fileRef.current.value = "";
    updateConfig("essentials.logoData", "");
    setLogoPreview("");
  };

  return (
    <section className="relative overflow-hidden" id="essentials">
      <div className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur p-4 sm:p-6 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Essentials</h2>
          <span className="text-xs text-slate-400">Brand basics</span>
        </div>
        <p className="mt-1 text-slate-400 text-sm">
          Tell us your brand name, industry, and (optionally) upload a logo.
        </p>
        <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block" data-key="essentials.name">
            <span className="text-sm text-slate-300">Brand name</span>
            <input
              type="text"
              className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2"
              placeholder="Acme Co."
              aria-label="Brand name"
              value={config.essentials.name}
              onChange={(e) => updateConfig("essentials.name", e.target.value)}
            />
          </label>

          <label className="block" data-key="essentials.industry">
            <span className="text-sm text-slate-300">Industry</span>
            <input
              list="industry-suggestions"
              type="text"
              className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2"
              placeholder="e.g., SaaS, Healthcare, Real Estate"
              aria-label="Industry"
              value={config.essentials.industry}
              onChange={(e) =>
                updateConfig("essentials.industry", e.target.value)
              }
            />
            <datalist id="industry-suggestions">
              <option value="Technology"></option>
              <option value="SaaS"></option>
              <option value="E‑commerce"></option>
              <option value="Healthcare"></option>
              <option value="Finance"></option>
              <option value="Education"></option>
              <option value="Real Estate"></option>
              <option value="Hospitality"></option>
              <option value="Manufacturing"></option>
              <option value="Non‑profit"></option>
            </datalist>
          </label>

          <div className="sm:col-span-2" data-key="essentials.logoData">
            <span className="text-sm text-slate-300">Logo</span>
            <div className="mt-1 grid grid-cols-[1fr,auto] gap-3 items-start">
              <input
                ref={fileRef}
                id="logo-file"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 file:mr-3 file:rounded-md file:border-0 file:bg-slate-700 file:px-3 file:py-2 file:text-sm file:text-white/90"
                onChange={onLogoChange}
              />
              <button
                type="button"
                onClick={clearLogo}
                className="px-3 py-2 rounded-lg bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-800 text-sm"
              >
                Clear
              </button>
            </div>
            <input type="hidden" value={config.essentials.logoData} readOnly />
            <div className="mt-2 h-20 w-20 rounded-xl ring-1 ring-white/10 bg-slate-800/50 grid place-items-center overflow-hidden">
              {logoPreview ? (
                <img
                  alt="Logo preview"
                  className="h-full w-full object-contain"
                  src={logoPreview}
                />
              ) : (
                <span className="text-[10px] text-slate-400">No logo</span>
              )}
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
