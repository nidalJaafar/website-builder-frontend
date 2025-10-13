"use client";

import React from "react";
import { useConfig } from "@/app/context/ConfigContext";

export const EssentialsForm = () => {
  const { config, updateConfig, fieldErrors, setFieldErrors } = useConfig();
  const brandHasError = fieldErrors.essentials.name;
  const industryHasError = fieldErrors.essentials.industry;

  return (
    <section className="relative overflow-hidden" id="essentials">
      <div className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur p-4 sm:p-6 dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Essentials</h2>
          <span className="text-xs text-slate-400">Brand basics</span>
        </div>
        <p className="mt-1 text-slate-400 text-sm">
          Tell us your brand name, industry, and optionally add a website description.
        </p>
        <form className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block" data-key="essentials.name">
            <span className="text-sm text-slate-300">Brand name</span>
            <input
              id="essentials-name"
              type="text"
              className={`mt-1 w-full rounded-lg bg-slate-800/70 ring-1 px-3 py-2 focus:outline-none focus:ring-2 ${
                brandHasError
                  ? "ring-red-500/60 focus:ring-red-500"
                  : "ring-white/10 focus:ring-white/20"
              }`}
              placeholder="Acme Co."
              aria-label="Brand name"
              aria-invalid={brandHasError}
              value={config.essentials.name}
              onChange={(e) => {
                const nextValue = e.target.value;
                updateConfig("essentials.name", nextValue);
                if (brandHasError && nextValue.trim()) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    essentials: { ...prev.essentials, name: false },
                  }));
                }
              }}
            />
            {brandHasError && (
              <p className="mt-1 text-xs text-red-400">Brand name is required.</p>
            )}
          </label>

          <label className="block" data-key="essentials.industry">
            <span className="text-sm text-slate-300">Industry</span>
            <input
              list="industry-suggestions"
              type="text"
              id="essentials-industry"
              className={`mt-1 w-full rounded-lg bg-slate-800/70 ring-1 px-3 py-2 focus:outline-none focus:ring-2 ${
                industryHasError
                  ? "ring-red-500/60 focus:ring-red-500"
                  : "ring-white/10 focus:ring-white/20"
              }`}
              placeholder="e.g., SaaS, Healthcare, Real Estate"
              aria-label="Industry"
              aria-invalid={industryHasError}
              value={config.essentials.industry}
              onChange={(e) => {
                const nextValue = e.target.value;
                updateConfig("essentials.industry", nextValue);
                if (industryHasError && nextValue.trim()) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    essentials: { ...prev.essentials, industry: false },
                  }));
                }
              }}
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
            {industryHasError && (
              <p className="mt-1 text-xs text-red-400">Industry is required.</p>
            )}
          </label>

          <label className="block sm:col-span-2" data-key="essentials.description">
            <span className="text-sm text-slate-300">Website description</span>
            <textarea
              className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2"
              placeholder="Share a short mission statement or what makes your brand unique."
              aria-label="Website description"
              rows={3}
              value={config.essentials.description ?? ""}
              onChange={(e) => updateConfig("essentials.description", e.target.value)}
            />
          </label>
        </form>
      </div>
    </section>
  );
};
