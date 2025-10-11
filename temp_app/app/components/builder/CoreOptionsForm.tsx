"use client";

import React from "react";
import { useConfig } from "@/app/context/ConfigContext";
import { ChevronDown } from "../icons";

export const CoreOptionsForm = () => {
  const { config, updateConfig } = useConfig();

  const set =
    (path: string) =>
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
      updateConfig(path, e.target.value);
  const setRadio = (path: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    updateConfig(path, e.target.value);
  const toggleInArray = (path: string, value: string) => () => {
    const arr = (config.core as any).sections || [];
    const exists = arr.includes(value);
    const next = exists
      ? arr.filter((v: string) => v !== value)
      : [...arr, value];
    updateConfig("core.sections", next);
  };

  return (
    <form className="space-y-4" id="core-form">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Core options</h2>
        <span className="text-xs text-slate-400">
          Optional, but recommended
        </span>
      </div>

      <fieldset className="grid grid-cols-2 gap-2" data-key="core.siteType">
        <legend className="text-sm text-slate-300 mb-1">Site type</legend>
        {[
          { label: "Single page", value: "single_page" },
          { label: "Multi page", value: "multi_page" },
        ].map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
          >
            <input
              className="accent-neon-400"
              type="radio"
              name="siteType"
              value={opt.value}
              checked={config.core.siteType === opt.value}
              onChange={setRadio("core.siteType")}
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </fieldset>

      <label className="block" data-key="core.preset">
        <span className="text-sm text-slate-300">Preset</span>
        <div className="relative">
          <select
            className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
            value={config.core.preset}
            onChange={set("core.preset")}
          >
            {[
              "landing",
              "saas",
              "portfolio",
              "restaurant",
              "ecommerce",
              "blog",
              "docs",
            ].map((v) => (
              <option key={v} value={v}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </option>
            ))}
          </select>
          <ChevronDown />
        </div>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block" data-key="core.branding.colorMode">
          <span className="text-sm text-slate-300">Color mode</span>
          <div className="relative">
            <select
              className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
              value={config.core.branding.colorMode}
              onChange={set("core.branding.colorMode")}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <ChevronDown />
          </div>
        </label>
        <label className="block" data-key="core.branding.accent">
          <span className="text-sm text-slate-300">Accent</span>
          <div className="relative">
            <select
              className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
              value={config.core.branding.accent}
              onChange={set("core.branding.accent")}
            >
              {["neon_cyan", "purple", "emerald", "amber", "custom"].map(
                (a) => (
                  <option key={a} value={a}>
                    {a.replace("_", " ")}
                  </option>
                )
              )}
            </select>
            <ChevronDown />
          </div>
        </label>
      </div>

      <fieldset className="space-y-2" data-key="core.nav.placement">
        <legend className="text-sm text-slate-300">Navigation placement</legend>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Top bar", value: "topbar" },
            { label: "Left sidebar", value: "sidebar_left" },
            { label: "Right sidebar", value: "sidebar_right" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
            >
              <input
                className="accent-neon-400"
                type="radio"
                name="navPlacement"
                value={opt.value}
                checked={config.core.nav.placement === opt.value}
                onChange={setRadio("core.nav.placement")}
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2" data-key="core.sections">
        <legend className="text-sm text-slate-300">Sections</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            "features",
            "pricing",
            "faq",
            "contact",
            "testimonials",
            "blog_feed",
          ].map((s) => (
            <label
              key={s}
              className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
            >
              <input
                className="accent-neon-400"
                type="checkbox"
                checked={(config.core.sections || []).includes(s)}
                onChange={toggleInArray("core.sections", s)}
              />
              <span className="text-sm">{s.replace("_", " ")}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2" data-key="core.hero">
        <legend className="text-sm text-slate-300">Hero</legend>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Headline + subcopy", value: "headline_subcopy" },
            { label: "With form", value: "with_form" },
            { label: "Split image", value: "split_image" },
            { label: "With video", value: "with_video" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
            >
              <input
                className="accent-neon-400"
                type="radio"
                name="heroType"
                value={opt.value}
                checked={config.core.hero.type === opt.value}
                onChange={setRadio("core.hero.type")}
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2" data-key="core.hero.media">
          {["bg_image", "gradient_orbs", "particles", "video_loop"].map((m) => (
            <label
              key={m}
              className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
            >
              <input
                className="accent-neon-400"
                type="checkbox"
                checked={(config.core.hero.media || []).includes(m)}
                onChange={() => {
                  const arr = config.core.hero.media || [];
                  const exists = arr.includes(m);
                  const next = exists
                    ? arr.filter((v: string) => v !== m)
                    : [...arr, m];
                  updateConfig("core.hero.media", next);
                }}
              />
              <span className="text-sm">{m.replace("_", " ")}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-3 gap-2">
        {[
          {
            key: "core.ui.buttons",
            label: "Buttons",
            value: config.core.ui.buttons,
            options: ["solid", "soft", "outline"],
          },
          {
            key: "core.ui.cards",
            label: "Cards",
            value: config.core.ui.cards,
            options: ["glass", "flat", "elevated"],
          },
          {
            key: "core.ui.corners",
            label: "Corners",
            value: config.core.ui.corners,
            options: ["rounded", "pill", "sharp"],
          },
        ].map(({ key, label, value, options }) => (
          <label key={key} className="block">
            <span className="text-sm text-slate-300">{label}</span>
            <div className="relative">
              <select
                className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                value={value}
                onChange={(e) => updateConfig(key, e.target.value)}
              >
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown />
            </div>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block" data-key="core.interactivity.animations">
          <span className="text-sm text-slate-300">Animations</span>
          <div className="relative">
            <select
              className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
              value={config.core.interactivity.animations}
              onChange={set("core.interactivity.animations")}
            >
              <option value="subtle">Subtle</option>
              <option value="medium">Medium</option>
              <option value="none">None</option>
            </select>
            <ChevronDown />
          </div>
        </label>
        <label
          className="flex items-center gap-2 mt-7"
          data-key="core.interactivity.themeSwitcher"
        >
          <input
            className="accent-neon-400"
            type="checkbox"
            checked={!!config.core.interactivity.themeSwitcher}
            onChange={(e) =>
              updateConfig("core.interactivity.themeSwitcher", e.target.checked)
            }
          />
          <span className="text-sm">Show theme switcher</span>
        </label>
      </div>
    </form>
  );
};
