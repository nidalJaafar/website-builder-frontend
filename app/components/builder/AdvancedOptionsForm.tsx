'use client';

import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import { ChevronDown } from '../icons';

export const AdvancedOptionsForm = () => {
  const { config, updateConfig } = useConfig();

  return (
    <details className="rounded-xl bg-slate-900/60 ring-1 ring-white/10 p-4 open:shadow-glow" id="advanced-panel">
      <summary className="cursor-pointer select-none text-sm text-slate-300 flex items-center justify-between">
        Advanced options
        <span className="text-xs text-slate-400">Developers</span>
      </summary>
      <form className="mt-4 space-y-4" id="advanced-form">
        <label className="block">
          <span className="text-sm text-slate-300">Menu type</span>
          <div className="relative">
            <select 
              className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
              value={config.advanced.nav?.menu || 'links'}
              onChange={e => updateConfig('advanced.nav.menu', e.target.value)}
            >
              <option value="links">Links</option>
              <option value="tabs">Tabs</option>
              <option value="mega_menu">Mega menu</option>
            </select>
            <ChevronDown />
          </div>
        </label>
        
        {/* Secondary nav */}
        <fieldset className="space-y-1">
            <legend className="text-sm text-slate-300">Secondary nav</legend>
            <div className="grid grid-cols-2 gap-2">
                {['breadcrumbs', 'top_utility_bar'].map(item => (
                    <label key={item} className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
                        <input
                            type="checkbox"
                            value={item}
                            checked={config.advanced.nav?.secondary?.includes(item) || false}
                            onChange={e => updateConfig(`advanced.nav.secondary.${item}`, e.target.checked)}
                        />
                        <span className="text-sm capitalize">{item.replace('_', ' ')}</span>
                    </label>
                ))}
            </div>
        </fieldset>
        
        {/* Sidebar behavior */}
        <fieldset className="space-y-1">
            <legend className="text-sm text-slate-300">Sidebar behavior</legend>
            <div className="grid grid-cols-3 gap-2">
                {['fixed', 'collapsible', 'overlay'].map(behavior => (
                    <label key={behavior} className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
                        <input
                            checked={config.advanced.nav?.sidebarBehavior === behavior}
                            onChange={() => updateConfig('advanced.nav.sidebarBehavior', behavior)}
                            name="sidebarBehavior" type="radio" value={behavior}
                        />
                        <span className="text-sm capitalize">{behavior}</span>
                    </label>
                ))}
            </div>
        </fieldset>

        {/* Layout */}
        <div className="grid grid-cols-2 gap-3">
            <label className="block">
                <span className="text-sm text-slate-300">Content max width</span>
                <div className="relative">
                    <select
                        value={config.advanced.layout?.maxWidth}
                        onChange={e => updateConfig('advanced.layout.maxWidth', e.target.value)}
                        className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    >
                        <option value="md">md</option>
                        <option value="lg">lg</option>
                        <option value="xl">xl</option>
                        <option value="full">full</option>
                    </select>
                    <ChevronDown />
                </div>
            </label>
            <label className="block">
                <span className="text-sm text-slate-300">Section spacing</span>
                <div className="relative">
                    <select
                        value={config.advanced.layout?.spacing}
                        onChange={e => updateConfig('advanced.layout.spacing', e.target.value)}
                        className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    >
                        <option value="cozy">Cozy</option>
                        <option value="comfortable">Comfortable</option>
                        <option value="spacious">Spacious</option>
                    </select>
                    <ChevronDown />
                </div>
            </label>
        </div>

        {/* Input style */}
        <label className="block">
            <span className="text-sm text-slate-300">Input style</span>
            <div className="relative">
                <select
                    value={config.advanced.inputs?.style}
                    onChange={e => updateConfig('advanced.inputs.style', e.target.value)}
                    className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                >
                    <option value="filled">Filled</option>
                    <option value="outlined">Outlined</option>
                    <option value="underlined">Underlined</option>
                </select>
                <ChevronDown />
            </div>
        </label>

        {/* Overlays */}
        <fieldset className="space-y-1">
            <legend className="text-sm text-slate-300">Overlays</legend>
            <div className="grid grid-cols-3 gap-2">
                {['modal', 'sheet', 'toast_notifications'].map(overlay => (
                    <label key={overlay} className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
                        <input
                            type="checkbox"
                            value={overlay}
                            checked={config.advanced.overlays?.includes(overlay) || false}
                            onChange={e => updateConfig(`advanced.overlays.${overlay}`, e.target.checked)}
                        />
                        <span className="text-sm capitalize">{overlay.replace('_', ' ')}</span>
                    </label>
                ))}
            </div>
        </fieldset>

        {/* Forms */}
        <fieldset className="space-y-2">
            <legend className="text-sm text-slate-300">Forms</legend>
            <div className="grid grid-cols-2 gap-2">
                {['name', 'email', 'message', 'consent_checkbox'].map(field => (
                    <label key={field} className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
                        <input
                            type="checkbox"
                            value={field}
                            checked={config.advanced.forms?.fields?.includes(field) || false}
                            onChange={e => updateConfig(`advanced.forms.fields.${field}`, e.target.checked)}
                        />
                        <span className="text-sm capitalize">{field.replace('_', ' ')}</span>
                    </label>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-2">
                <label className="block col-span-2">
                    <span className="text-sm text-slate-300">Validation</span>
                    <div className="relative">
                        <select
                            value={config.advanced.forms?.validation}
                            onChange={e => updateConfig('advanced.forms.validation', e.target.value)}
                            className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                        >
                            <option value="inline">Inline</option>
                            <option value="on_submit">On submit</option>
                        </select>
                        <ChevronDown />
                    </div>
                </label>
                <label className="flex items-center gap-2 mt-7">
                    <input
                        checked={config.advanced.forms?.captcha || false}
                        onChange={e => updateConfig('advanced.forms.captcha', e.target.checked)}
                        type="checkbox"
                    />
                    <span className="text-sm">Captcha</span>
                </label>
            </div>
            <label className="block">
                <span className="text-sm text-slate-300">Success handling</span>
                <div className="relative">
                    <select
                        value={config.advanced.forms?.success}
                        onChange={e => updateConfig('advanced.forms.success', e.target.value)}
                        className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    >
                        <option value="toast">Toast</option>
                        <option value="inline_message">Inline message</option>
                        <option value="redirect">Redirect</option>
                    </select>
                    <ChevronDown />
                </div>
            </label>
        </fieldset>

        {/* Accessibility & SEO */}
        <fieldset className="space-y-2">
            <legend className="text-sm text-slate-300">Accessibility &amp; SEO</legend>
            <div className="grid grid-cols-3 gap-2">
                <label className="block">
                    <span className="text-sm text-slate-300">Level</span>
                    <div className="relative">
                        <select
                            value={config.advanced.a11ySeo?.level}
                            onChange={e => updateConfig('advanced.a11ySeo.level', e.target.value)}
                            className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                        >
                            <option value="base">Base</option>
                            <option value="AA">AA</option>
                            <option value="AAA_focus_visible">AAA + focus</option>
                        </select>
                        <ChevronDown />
                    </div>
                </label>
                <label className="flex items-center gap-2 mt-7">
                    <input
                        checked={config.advanced.a11ySeo?.reducedMotion || false}
                        onChange={e => updateConfig('advanced.a11ySeo.reducedMotion', e.target.checked)}
                        type="checkbox"
                    />
                    <span className="text-sm">Respect reduced motion</span>
                </label>
                <div className="mt-7">
                    {['meta_tags', 'og_tags', 'sitemap'].map(tag => (
                        <label key={tag} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                value={tag}
                                checked={config.advanced.a11ySeo?.seo?.includes(tag) || false}
                                onChange={e => updateConfig(`advanced.a11ySeo.seo.${tag}`, e.target.checked)}
                                
                            />
                            <span className="text-sm capitalize">{tag.replace('_', ' ')}</span>
                        </label>
                    ))}
                </div>
            </div>
        </fieldset>

        {/* Performance */}
        <fieldset className="space-y-2">
            <legend className="text-sm text-slate-300">Performance</legend>
            <div className="grid grid-cols-3 gap-2">
                <label className="block">
                    <span className="text-sm text-slate-300">Images</span>
                    <div className="relative">
                        <select
                            value={config.advanced.perf?.images}
                            onChange={e => updateConfig('advanced.perf.images', e.target.value)}
                            className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                        >
                            <option value="eager_home_hero">Eager hero</option>
                            <option value="lazy_everything_else">Lazy elsewhere</option>
                        </select>
                        <ChevronDown />
                    </div>
                </label>
                <label className="block">
                    <span className="text-sm text-slate-300">Fonts</span>
                    <div className="relative">
                        <select
                            value={config.advanced.perf?.fonts}
                            onChange={e => updateConfig('advanced.perf.fonts', e.target.value)}
                            className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                        >
                            <option value="swap">Swap</option>
                            <option value="optional">Optional</option>
                        </select>
                        <ChevronDown />
                    </div>
                </label>
                <label className="block">
                    <span className="text-sm text-slate-300">Effects</span>
                    <div className="relative">
                        <select
                            value={config.advanced.perf?.effects}
                            onChange={e => updateConfig('advanced.perf.effects', e.target.value)}
                            className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
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

        {/* Internationalization */}
        <fieldset className="space-y-2">
            <legend className="text-sm text-slate-300">Internationalization</legend>
            <div className="grid grid-cols-3 gap-2">
                {['en', 'fr', 'ar'].map(lang => (
                    <label key={lang} className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
                        <input
                            type="checkbox"
                            value={lang}
                            checked={config.advanced.i18n?.languages?.includes(lang) || false}
                            onChange={e => updateConfig(`advanced.i18n.languages.${lang}`, e.target.checked)}
                            
                        />
                        <span className="text-sm capitalize">{lang}</span>
                    </label>
                ))}
            </div>
            <label className="flex items-center gap-2">
                <input
                    checked={config.advanced.i18n?.rtl || false}
                    onChange={e => updateConfig('advanced.i18n.rtl', e.target.checked)}
                     type="checkbox"
                />
                <span className="text-sm">Force RTL</span>
            </label>
        </fieldset>
    </form>
    </details>
  );
};