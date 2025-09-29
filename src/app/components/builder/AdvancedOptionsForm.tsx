"use client";

import React from "react";
import {
  useConfig,
  SecondaryNavOption,
  OverlayOption,
  FormFieldOption,
  SeoOption,
  LanguageOption,
} from "@/app/context/ConfigContext";
import { ChevronDown } from "../icons";

const getNestedArray = (source: unknown, path: string): string[] => {
  const segments = path.split(".");
  let current: unknown = source;

  for (const segment of segments) {
    if (!current || typeof current !== "object") {
      return [];
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return Array.isArray(current) ? (current as string[]) : [];
};

export const AdvancedOptionsForm = () => {
  const { config, updateConfig } = useConfig();
  const advanced = config.advanced;

  const handleValueChange =
    (path: string) =>
    (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      updateConfig(path, event.target.value);
    };

  const toggle = (path: string, value: string) => () => {
    const currentValues = getNestedArray(config, path);
    const exists = currentValues.includes(value);
    const next = exists
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
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
                value={advanced.nav?.menu || "links"}
                onChange={handleValueChange("advanced.nav.menu")}
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
              {(["breadcrumbs", "top_utility_bar"] as SecondaryNavOption[]).map(
                (option) => (
                  <label
                    key={option}
                    className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
                  >
                    <input
                      className="accent-neon-400"
                      type="checkbox"
                      checked={(advanced.nav?.secondary || []).includes(
                        option as SecondaryNavOption
                      )}
                      onChange={toggle(
                        "advanced.nav.secondary",
                        option as SecondaryNavOption
                      )}
                    />
                    <span className="text-sm">{option.replace("_", " ")}</span>
                  </label>
                )
              )}
            </div>
          </fieldset>

          <fieldset
            className="space-y-1"
            data-key="advanced.nav.sidebarBehavior"
          >
            <legend className="text-sm text-slate-300">Sidebar behavior</legend>
            <div className="grid grid-cols-3 gap-2">
              {["fixed", "collapsible", "overlay"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
                >
                  <input
                    className="accent-neon-400"
                    type="radio"
                    name="sidebarBehavior"
                    value={option}
                    checked={advanced.nav?.sidebarBehavior === option}
                    onChange={handleValueChange("advanced.nav.sidebarBehavior")}
                  />
                  <span className="text-sm">
                    {option.charAt(0).toUpperCase() + option.slice(1)}
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
                  value={advanced.layout?.maxWidth || "lg"}
                  onChange={handleValueChange("advanced.layout.maxWidth")}
                >
                  {["md", "lg", "xl", "full"].map((option) => (
                    <option key={option} value={option}>
                      {option}
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
                  value={advanced.layout?.spacing || "comfortable"}
                  onChange={handleValueChange("advanced.layout.spacing")}
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
                value={advanced.inputs || "filled"}
                onChange={handleValueChange("advanced.inputs")}
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
              {(
                ["modal", "sheet", "toast_notifications"] as OverlayOption[]
              ).map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
                >
                  <input
                    className="accent-neon-400"
                    type="checkbox"
                    checked={(advanced.overlays || []).includes(
                      option as OverlayOption
                    )}
                    onChange={toggle(
                      "advanced.overlays",
                      option as OverlayOption
                    )}
                  />
                  <span className="text-sm">{option.replace("_", " ")}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-2" data-key="advanced.forms">
            <legend className="text-sm text-slate-300">Forms</legend>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  "name",
                  "email",
                  "message",
                  "consent_checkbox",
                ] as FormFieldOption[]
              ).map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
                >
                  <input
                    className="accent-neon-400"
                    type="checkbox"
                    checked={(
                      advanced.forms?.contactFields || [
                        "name",
                        "email",
                        "message",
                      ]
                    ).includes(option as FormFieldOption)}
                    onChange={toggle(
                      "advanced.forms.contactFields",
                      option as FormFieldOption
                    )}
                  />
                  <span className="text-sm">{option.replace("_", " ")}</span>
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
                    value={advanced.forms?.validation || "inline"}
                    onChange={handleValueChange("advanced.forms.validation")}
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
                  checked={!!advanced.forms?.captcha}
                  onChange={(event) =>
                    updateConfig("advanced.forms.captcha", event.target.checked)
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
                  value={advanced.forms?.success || "toast"}
                  onChange={handleValueChange("advanced.forms.success")}
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
                    value={advanced.a11ySeo?.level || "AA"}
                    onChange={handleValueChange("advanced.a11ySeo.level")}
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
                  checked={!!advanced.a11ySeo?.reducedMotion}
                  onChange={(event) =>
                    updateConfig(
                      "advanced.a11ySeo.reducedMotion",
                      event.target.checked
                    )
                  }
                />
                <span className="text-sm">Respect reduced motion</span>
              </label>
              <div className="mt-7" data-key="advanced.a11ySeo.seo">
                {(["meta_tags", "og_tags", "sitemap"] as SeoOption[]).map(
                  (option) => (
                    <label key={option} className="flex items-center gap-2">
                      <input
                        className="accent-neon-400"
                        type="checkbox"
                        checked={(
                          advanced.a11ySeo?.seo || [
                            "meta_tags",
                            "og_tags",
                            "sitemap",
                          ]
                        ).includes(option as SeoOption)}
                        onChange={toggle(
                          "advanced.a11ySeo.seo",
                          option as SeoOption
                        )}
                      />
                      <span className="text-sm">
                        {option.replace("_", " ").replace("og", "OG")}
                      </span>
                    </label>
                  )
                )}
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
                    value={advanced.perf?.images || "lazy_everything_else"}
                    onChange={handleValueChange("advanced.perf.images")}
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
                    value={advanced.perf?.fonts || "swap"}
                    onChange={handleValueChange("advanced.perf.fonts")}
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
                    value={advanced.perf?.effects || "low"}
                    onChange={handleValueChange("advanced.perf.effects")}
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
              {(["en", "fr", "ar"] as LanguageOption[]).map((lang) => (
                <label
                  key={lang}
                  className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2"
                >
                  <input
                    className="accent-neon-400"
                    type="checkbox"
                    checked={(advanced.i18n?.languages || ["en"]).includes(
                      lang as LanguageOption
                    )}
                    onChange={toggle(
                      "advanced.i18n.languages",
                      lang as LanguageOption
                    )}
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
                checked={!!advanced.i18n?.rtl}
                onChange={(event) =>
                  updateConfig("advanced.i18n.rtl", event.target.checked)
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
