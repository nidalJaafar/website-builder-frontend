"use client";

import React from "react";
import { useConfig } from "@/app/context/ConfigContext";
import { ChevronDown } from "../icons";

export const AdvancedOptionsForm = () => {
  const { config, updateConfig } = useConfig();
  const a = config.advanced as any;

  const set = (path: string) => (e: any) => updateConfig(path, e.target.value);
  const toggle = (path: string, value: string) => () => {
    const arr =
      (path
        .split(".")
        .reduce((o: any, k: string) => o?.[k], config) as string[]) || [];
    const exists = arr.includes(value);
    const next = exists ? arr.filter((v) => v !== value) : [...arr, value];
    updateConfig(path, next);
  };

  return (
    <div>
      <details
        className="rounded-xl bg-slate-900/60 ring-1 ring-white/10 p-4 open:shadow-glow"
        id="advanced-panel"
      >
        <summary className="cursor-pointer select-none text-sm text-slate-300 flex items-center justify-between">
          Advanced options
          <span className="text-xs text-slate-400">Developers</span>
        </summary>

        <form className="mt-4 space-y-4" id="advanced-form">
          <label className="block" data-key="advanced.nav.menu">
            <span className="text-sm text-slate-300">Menu type</span>
            <div className="relative">
              <select
                className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                value={a?.nav?.menu || "links"}
                onChange={set("advanced.nav.menu")}
              >
                <option value="links">Links</option>
                <option value="tabs">Tabs</option>
                <option value="mega_menu">Mega menu</option>
              </select>
              <ChevronDown />
            </div>
          </label>

          <fieldset className="space-y-1" data-key="advanced.nav.secondary">
            <legend className="text-sm text-slate-300">Secondary nav</legend>
            <div className="grid grid-cols-2 gap-2">
              {["breadcrumbs", "top_utility_bar"].map((v) => (
                <label
                  key={v}
                  className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
                >
                  <input
                    className="accent-neon-400"
                    type="checkbox"
                    checked={(a?.nav?.secondary || []).includes(v)}
                    onChange={toggle("advanced.nav.secondary", v)}
                  />
                  <span className="text-sm">{v.replace("_", " ")}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset
            className="space-y-1"
            data-key="advanced.nav.sidebarBehavior"
          >
            <legend className="text-sm text-slate-300">Sidebar behavior</legend>
            <div className="grid grid-cols-3 gap-2">
              {["fixed", "collapsible", "overlay"].map((v) => (
                <label
                  key={v}
                  className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
                >
                  <input
                    className="accent-neon-400"
                    type="radio"
                    name="sidebarBehavior"
                    value={v}
                    checked={a?.nav?.sidebarBehavior === v}
                    onChange={set("advanced.nav.sidebarBehavior")}
                  />
                  <span className="text-sm">
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <label className="block" data-key="advanced.layout.maxWidth">
              <span className="text-sm text-slate-300">Content max width</span>
              <div className="relative">
                <select
                  className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                  value={a?.layout?.maxWidth || "lg"}
                  onChange={set("advanced.layout.maxWidth")}
                >
                  {["md", "lg", "xl", "full"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <ChevronDown />
              </div>
            </label>
            <label className="block" data-key="advanced.layout.spacing">
              <span className="text-sm text-slate-300">Section spacing</span>
              <div className="relative">
                <select
                  className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                  value={a?.layout?.spacing || "comfortable"}
                  onChange={set("advanced.layout.spacing")}
                >
                  <option value="cozy">Cozy</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="spacious">Spacious</option>
                </select>
                <ChevronDown />
              </div>
            </label>
          </div>

          <label className="block" data-key="advanced.inputs">
            <span className="text-sm text-slate-300">Input style</span>
            <div className="relative">
              <select
                className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                value={a?.inputs || "filled"}
                onChange={set("advanced.inputs")}
              >
                <option value="filled">Filled</option>
                <option value="outlined">Outlined</option>
                <option value="underlined">Underlined</option>
              </select>
              <ChevronDown />
            </div>
          </label>

          <fieldset className="space-y-1" data-key="advanced.overlays">
            <legend className="text-sm text-slate-300">Overlays</legend>
            <div className="grid grid-cols-3 gap-2">
              {["modal", "sheet", "toast_notifications"].map((v) => (
                <label
                  key={v}
                  className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
                >
                  <input
                    className="accent-neon-400"
                    type="checkbox"
                    checked={(a?.overlays || []).includes(v)}
                    onChange={toggle("advanced.overlays", v)}
                  />
                  <span className="text-sm">{v.replace("_", " ")}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-2" data-key="advanced.forms">
            <legend className="text-sm text-slate-300">Forms</legend>
            <div className="grid grid-cols-2 gap-2">
              {["name", "email", "message", "consent_checkbox"].map((v) => (
                <label
                  key={v}
                  className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
                >
                  <input
                    className="accent-neon-400"
                    type="checkbox"
                    checked={(
                      a?.forms?.contactFields || ["name", "email", "message"]
                    ).includes(v)}
                    onChange={toggle("advanced.forms.contactFields", v)}
                  />
                  <span className="text-sm">{v.replace("_", " ")}</span>
                </label>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <label
                className="block col-span-2"
                data-key="advanced.forms.validation"
              >
                <span className="text-sm text-slate-300">Validation</span>
                <div className="relative">
                  <select
                    className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    value={a?.forms?.validation || "inline"}
                    onChange={set("advanced.forms.validation")}
                  >
                    <option value="inline">Inline</option>
                    <option value="on_submit">On submit</option>
                  </select>
                  <ChevronDown />
                </div>
              </label>
              <label
                className="flex items-center gap-2 mt-7"
                data-key="advanced.forms.captcha"
              >
                <input
                  className="accent-neon-400"
                  type="checkbox"
                  checked={!!a?.forms?.captcha}
                  onChange={(e) =>
                    updateConfig("advanced.forms.captcha", e.target.checked)
                  }
                />
                <span className="text-sm">Captcha</span>
              </label>
            </div>
            <label className="block" data-key="advanced.forms.success">
              <span className="text-sm text-slate-300">Success handling</span>
              <div className="relative">
                <select
                  className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                  value={a?.forms?.success || "toast"}
                  onChange={set("advanced.forms.success")}
                >
                  <option value="toast">Toast</option>
                  <option value="inline_message">Inline message</option>
                  <option value="redirect">Redirect</option>
                </select>
                <ChevronDown />
              </div>
            </label>
          </fieldset>

          <fieldset className="space-y-2" data-key="advanced.a11ySeo">
            <legend className="text-sm text-slate-300">
              Accessibility &amp; SEO
            </legend>
            <div className="grid grid-cols-3 gap-2">
              <label className="block" data-key="advanced.a11ySeo.level">
                <span className="text-sm text-slate-300">Level</span>
                <div className="relative">
                  <select
                    className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    value={a?.a11ySeo?.level || "AA"}
                    onChange={set("advanced.a11ySeo.level")}
                  >
                    <option value="base">Base</option>
                    <option value="AA">AA</option>
                    <option value="AAA_focus_visible">AAA + focus</option>
                  </select>
                  <ChevronDown />
                </div>
              </label>
              <label
                className="flex items-center gap-2 mt-7"
                data-key="advanced.a11ySeo.reducedMotion"
              >
                <input
                  className="accent-neon-400"
                  type="checkbox"
                  checked={!!a?.a11ySeo?.reducedMotion}
                  onChange={(e) =>
                    updateConfig(
                      "advanced.a11ySeo.reducedMotion",
                      e.target.checked
                    )
                  }
                />
                <span className="text-sm">Respect reduced motion</span>
              </label>
              <div className="mt-7" data-key="advanced.a11ySeo.seo">
                {["meta_tags", "og_tags", "sitemap"].map((v) => (
                  <label key={v} className="flex items-center gap-2">
                    <input
                      className="accent-neon-400"
                      type="checkbox"
                      checked={(
                        a?.a11ySeo?.seo || ["meta_tags", "og_tags", "sitemap"]
                      ).includes(v)}
                      onChange={toggle("advanced.a11ySeo.seo", v)}
                    />
                    <span className="text-sm">
                      {v.replace("_", " ").replace("og", "OG")}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-2" data-key="advanced.perf">
            <legend className="text-sm text-slate-300">Performance</legend>
            <div className="grid grid-cols-3 gap-2">
              <label className="block" data-key="advanced.perf.images">
                <span className="text-sm text-slate-300">Images</span>
                <div className="relative">
                  <select
                    className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    value={a?.perf?.images || "lazy_everything_else"}
                    onChange={set("advanced.perf.images")}
                  >
                    <option value="eager_home_hero">Eager hero</option>
                    <option value="lazy_everything_else">Lazy elsewhere</option>
                  </select>
                  <ChevronDown />
                </div>
              </label>
              <label className="block" data-key="advanced.perf.fonts">
                <span className="text-sm text-slate-300">Fonts</span>
                <div className="relative">
                  <select
                    className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    value={a?.perf?.fonts || "swap"}
                    onChange={set("advanced.perf.fonts")}
                  >
                    <option value="swap">Swap</option>
                    <option value="optional">Optional</option>
                  </select>
                  <ChevronDown />
                </div>
              </label>
              <label className="block" data-key="advanced.perf.effects">
                <span className="text-sm text-slate-300">Effects</span>
                <div className="relative">
                  <select
                    className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    value={a?.perf?.effects || "low"}
                    onChange={set("advanced.perf.effects")}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <ChevronDown />
                </div>
              </label>
            </div>
          </fieldset>

          <fieldset className="space-y-2" data-key="advanced.i18n">
            <legend className="text-sm text-slate-300">
              Internationalization
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {["en", "fr", "ar"].map((lang) => (
                <label
                  key={lang}
                  className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
                >
                  <input
                    className="accent-neon-400"
                    type="checkbox"
                    checked={(a?.i18n?.languages || ["en"]).includes(lang)}
                    onChange={toggle("advanced.i18n.languages", lang)}
                  />
                  <span className="text-sm">{lang.toUpperCase()}</span>
                </label>
              ))}
            </div>
            <label
              className="flex items-center gap-2"
              data-key="advanced.i18n.rtl"
            >
              <input
                className="accent-neon-400"
                type="checkbox"
                checked={!!a?.i18n?.rtl}
                onChange={(e) =>
                  updateConfig("advanced.i18n.rtl", e.target.checked)
                }
              />
              <span className="text-sm">Force RTL</span>
            </label>
          </fieldset>
        </form>
      </details>
    </div>
  );
};
