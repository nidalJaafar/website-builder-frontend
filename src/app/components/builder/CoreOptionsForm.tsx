"use client";

import React, { useId } from "react";
import type { AccentOption } from "@/app/context/ConfigContext";
import { useConfig, SectionOption } from "@/app/context/ConfigContext";
import { ChevronDown } from "../icons";

const SECTION_OPTIONS: SectionOption[] = [
  "features",
  "pricing",
  "faq",
  "contact",
  "testimonials",
  "blog_feed",
];

const HERO_MEDIA_OPTIONS = [
  "bg_image",
  "gradient_orbs",
  "particles",
  "video_loop",
] as const;

export const CoreOptionsForm = () => {
  const { config, updateConfig } = useConfig();
  const colorPickerBaseId = useId();
  const accentOptions: Array<{ value: AccentOption; label: string }> = [
    { value: "custom", label: "Custom palette" },
    { value: "ai_choice", label: "Let the AI choose" },
    { value: "neon_cyan", label: "Neon cyan" },
    { value: "purple", label: "Purple" },
    { value: "emerald", label: "Emerald" },
    { value: "amber", label: "Amber" },
  ];
  const accentIsCustom = config.core.branding.accent === "custom";
  const palette = config.core.branding.customPalette;
  const customColorSlots: Array<{
    key: "primary" | "secondary" | "tertiary";
    label: string;
    fallback: string;
    optional?: boolean;
  }> = [
    { key: "primary", label: "Primary color", fallback: "#000000" },
    { key: "secondary", label: "Secondary color", fallback: "#FFFFFF" },
    { key: "tertiary", label: "Tertiary color", fallback: "#000000", optional: true },
  ];

  const handleValueChange =
    (path: string) =>
    (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) =>
      updateConfig(path, event.target.value);

  const handleAccentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextAccent = event.target.value as AccentOption;
    updateConfig("core.branding.accent", nextAccent);
  };

  const handleCustomColorChange =
    (key: "primary" | "secondary" | "tertiary") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value.toUpperCase();
      updateConfig(`core.branding.customPalette.${key}`, nextValue);
    };

  const clearCustomColor = (key: "primary" | "secondary" | "tertiary") => () => {
    updateConfig(`core.branding.customPalette.${key}`, "");
  };

  const toggleSection = (value: SectionOption) => () => {
    const sections = config.core.sections;
    const exists = sections.includes(value);
    const next = exists
      ? sections.filter((item) => item !== value)
      : [...sections, value];
    updateConfig("core.sections", next);
  };

  const toggleHeroMedia = (value: (typeof HERO_MEDIA_OPTIONS)[number]) => () => {
    const media = config.core.hero.media;
    const exists = media.includes(value);
    const next = exists
      ? media.filter((item) => item !== value)
      : [...media, value];
    updateConfig("core.hero.media", next);
  };

  return (
    <form className="space-y-4" id="core-form">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Core options</h2>
        <span className="text-xs text-slate-400">Optional, but recommended</span>
      </div>

      <fieldset className="grid grid-cols-2 gap-2" data-key="core.siteType">
        <legend className="text-sm text-slate-300 mb-1">Site type</legend>
        {[
          { label: "Single page", value: "single_page" },
          { label: "Multi page", value: "multi_page" },
        ].map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
          >
            <input
              className="accent-neon-400"
              type="radio"
              name="siteType"
              value={option.value}
              checked={config.core.siteType === option.value}
              onChange={handleValueChange("core.siteType")}
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <label className="block" data-key="core.branding.colorMode">
          <span className="text-sm text-slate-300">Color mode</span>
          <div className="relative">
            <select
              className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
              value={config.core.branding.colorMode}
              onChange={handleValueChange("core.branding.colorMode")}
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
              onChange={handleAccentChange}
            >
              {accentOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </label>
      </div>

      {accentIsCustom && (
        <div className="rounded-xl bg-slate-900/50 ring-1 ring-white/10 px-3 py-4">
          <p className="text-xs text-slate-400">
            Pick up to three accent colors. These will be sent as hex codes in your configuration.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {customColorSlots.map(({ key, label, fallback, optional }) => {
                const colorValue = palette[key] ? palette[key] : "";
                const inputId = `${colorPickerBaseId}-${key}`;
                const fallbackUpper = fallback.toUpperCase();

                return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{label}</span>
                    <span className="text-xs text-slate-400">
                      {colorValue
                        ? colorValue.toUpperCase()
                        : optional
                        ? "None"
                        : fallbackUpper}
                    </span>
                  </div>
                  <label
                    htmlFor={inputId}
                    className="relative block h-12 rounded-xl ring-1 ring-white/10 overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-neon-400/60"
                  >
                    <span className="sr-only">{`Select ${label.toLowerCase()}`}</span>
                    <div
                      className="h-full w-full"
                      style={{
                        background: colorValue || (optional ? "transparent" : fallbackUpper),
                      }}
                    />
                    {!colorValue && optional && (
                      <div className="absolute inset-0 grid place-items-center text-[11px] uppercase tracking-wide text-slate-400">
                        Optional
                      </div>
                    )}
                  </label>
                  <input
                    id={inputId}
                    type="color"
                    className="sr-only"
                    value={colorValue ? colorValue.toUpperCase() : fallbackUpper}
                    onChange={handleCustomColorChange(key)}
                  />
                  {optional && colorValue && (
                    <button
                      type="button"
                      onClick={clearCustomColor(key)}
                      className="text-xs text-slate-400 hover:text-slate-200 transition"
                    >
                      Clear color
                    </button>
                  )}
                  {!optional && (
                    <p className="text-xs text-slate-500">
                      {colorValue && colorValue !== fallbackUpper
                        ? `Selected: ${colorValue.toUpperCase()}`
                        : `Default: ${fallbackUpper}`}
                    </p>
                  )}
                  {optional &&
                    (colorValue ? (
                      <p className="text-xs text-slate-500">
                        Selected: {colorValue.toUpperCase()}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Add a third accent if you want more variety.
                      </p>
                    ))}
                </div>
              );
              })}
          </div>
        </div>
      )}

      <fieldset className="space-y-2" data-key="core.nav.placement">
        <legend className="text-sm text-slate-300">Navigation placement</legend>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Top bar", value: "topbar" },
            { label: "Left sidebar", value: "sidebar_left" },
            { label: "Right sidebar", value: "sidebar_right" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
            >
              <input
                className="accent-neon-400"
                type="radio"
                name="navPlacement"
                value={option.value}
                checked={config.core.nav.placement === option.value}
                onChange={handleValueChange("core.nav.placement")}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2" data-key="core.sections">
        <legend className="text-sm text-slate-300">Sections</legend>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SECTION_OPTIONS.map((section) => (
            <label
              key={section}
              className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
            >
              <input
                className="accent-neon-400"
                type="checkbox"
                checked={config.core.sections.includes(section)}
                onChange={toggleSection(section)}
              />
              <span className="text-sm">{section.replace("_", " ")}</span>
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
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
            >
              <input
                className="accent-neon-400"
                type="radio"
                name="heroType"
                value={option.value}
                checked={config.core.hero.type === option.value}
                onChange={handleValueChange("core.hero.type")}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2" data-key="core.hero.media">
          {HERO_MEDIA_OPTIONS.map((media) => (
            <label
              key={media}
              className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
            >
              <input
                className="accent-neon-400"
                type="checkbox"
                checked={config.core.hero.media.includes(media)}
                onChange={toggleHeroMedia(media)}
              />
              <span className="text-sm">{media.replace("_", " ")}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-3 gap-2">
        {[
          {
            path: "core.ui.buttons",
            label: "Buttons",
            value: config.core.ui.buttons,
            options: ["solid", "soft", "outline"],
          },
          {
            path: "core.ui.cards",
            label: "Cards",
            value: config.core.ui.cards,
            options: ["glass", "flat", "elevated"],
          },
          {
            path: "core.ui.corners",
            label: "Corners",
            value: config.core.ui.corners,
            options: ["rounded", "pill", "sharp"],
          },
        ].map(({ path, label, value, options }) => (
          <label key={path} className="block">
            <span className="text-sm text-slate-300">{label}</span>
            <div className="relative">
              <select
                className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                value={value}
                onChange={(event) => updateConfig(path, event.target.value)}
              >
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
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
              onChange={handleValueChange("core.interactivity.animations")}
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
            checked={config.core.interactivity.themeSwitcher}
            onChange={(event) =>
              updateConfig("core.interactivity.themeSwitcher", event.target.checked)
            }
          />
          <span className="text-sm">Show theme switcher</span>
        </label>
      </div>
    </form>
  );
};
