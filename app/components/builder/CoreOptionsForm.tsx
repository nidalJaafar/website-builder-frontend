'use client';

import React from 'react';
import { useConfig } from '../../context/ConfigContext';
import { ChevronDown } from '../icons';

export const CoreOptionsForm = () => {
  const { config, updateConfig } = useConfig();

  const handleCheckboxChange = (path: string, value: string, checked: boolean) => {
    const currentValues = (config.core[path] || []) as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    updateConfig(`core.${path}`, newValues);
  };

  return (
    <form className="space-y-4" id="core-form">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Core options</h2>
            <span className="text-xs text-slate-400">Optional, but recommended</span>
        </div>

        {/* Site Type */}
        <fieldset className="grid grid-cols-2 gap-2">
            <legend className="text-sm text-slate-300 mb-1">Site type</legend>
            <label className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
                <input
                    checked={config.core.siteType === 'single_page'}
                    onChange={() => updateConfig('core.siteType', 'single_page')}
                    name="siteType" type="radio" value="single_page"
                />
                <span className="text-sm">Single page</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
                <input
                    checked={config.core.siteType === 'multi_page'}
                    onChange={() => updateConfig('core.siteType', 'multi_page')}
                    name="siteType" type="radio" value="multi_page"
                />
                <span className="text-sm">Multi page</span>
            </label>
        </fieldset>

        {/* Preset */}
        <label className="block">
            <span className="text-sm text-slate-300">Preset</span>
            <div className="relative">
                <select
                    value={config.core.preset}
                    onChange={e => updateConfig('core.preset', e.target.value)}
                    className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                >
                    <option value="landing">Landing</option>
                    <option value="saas">SaaS</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="ecommerce">E‑commerce</option>
                    <option value="blog">Blog</option>
                    <option value="docs">Docs</option>
                </select>
                <ChevronDown />
            </div>
        </label>

        {/* Color Mode & Accent */}
        <div className="grid grid-cols-2 gap-3">
            <label className="block">
                <span className="text-sm text-slate-300">Color mode</span>
                <div className="relative">
                    <select
                        value={config.core.branding?.colorMode}
                        onChange={e => updateConfig('core.branding.colorMode', e.target.value)}
                        className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    >
                        <option value="system">System</option>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                    <ChevronDown />
                </div>
            </label>
            <label className="block">
                <span className="text-sm text-slate-300">Accent</span>
                <div className="relative">
                    <select
                        value={config.core.branding?.accent}
                        onChange={e => updateConfig('core.branding.accent', e.target.value)}
                        className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    >
                        <option value="neon_cyan">Neon cyan</option>
                        <option value="purple">Purple</option>
                        <option value="emerald">Emerald</option>
                        <option value="amber">Amber</option>
                        <option value="custom">Custom</option>
                    </select>
                    <ChevronDown />
                </div>
            </label>
        </div>

        {/* Navigation placement */}
        <fieldset className="space-y-2">
            <legend className="text-sm text-slate-300">Navigation placement</legend>
            <div className="grid grid-cols-3 gap-2">
                {['topbar', 'sidebar_left', 'sidebar_right'].map(placement => (
                    <label key={placement} className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
                        <input
                            checked={config.core.nav?.placement === placement}
                            onChange={() => updateConfig('core.nav.placement', placement)}
                            name="navPlacement" type="radio" value={placement}
                        />
                        <span className="text-sm capitalize">{placement.replace('_', ' ')}</span>
                    </label>
                ))}
            </div>
        </fieldset>

        {/* Sections */}
        <fieldset className="space-y-2">
            <legend className="text-sm text-slate-300">Sections</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['features', 'pricing', 'faq', 'contact', 'testimonials', 'blog_feed'].map(section => (
                    <label key={section} className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
                        <input
                            type="checkbox"
                            value={section}
                            checked={config.core.sections.includes(section)}
                            onChange={e => handleCheckboxChange('sections', e.target.value, e.target.checked)}
                            
                        />
                        <span className="text-sm capitalize">{section.replace('_', ' ')}</span>
                    </label>
                ))}
            </div>
        </fieldset>

        {/* Hero */}
        <fieldset className="space-y-2">
            <legend className="text-sm text-slate-300">Hero</legend>
            <div className="grid grid-cols-2 gap-2">
                {['headline_subcopy', 'with_form', 'split_image', 'with_video'].map(type => (
                    <label key={type} className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
                        <input
                            checked={config.core.hero?.type === type}
                            onChange={() => updateConfig('core.hero.type', type)}
                            name="heroType" type="radio" value={type}
                        />
                        <span className="text-sm capitalize">{type.replace('_', ' ')}</span>
                    </label>
                ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
                {['bg_image', 'gradient_orbs', 'particles', 'video_loop'].map(media => (
                    <label key={media} className="flex items-center gap-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 px-3 py-2">
                        <input
                            type="checkbox"
                            value={media}
                            checked={config.core.hero?.media?.includes(media) || false}
                            onChange={e => handleCheckboxChange('hero.media', e.target.value, e.target.checked)}
                            
                        />
                        <span className="text-sm capitalize">{media.replace('_', ' ')}</span>
                    </label>
                ))}
            </div>
        </fieldset>

        {/* UI styles */}
        <div className="grid grid-cols-3 gap-2">
            <label className="block">
                <span className="text-sm text-slate-300">Buttons</span>
                <div className="relative">
                    <select
                        value={config.core.ui?.buttons}
                        onChange={e => updateConfig('core.ui.buttons', e.target.value)}
                        className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    >
                        <option value="solid">Solid</option>
                        <option value="soft">Soft</option>
                        <option value="outline">Outline</option>
                    </select>
                    <ChevronDown />
                </div>
            </label>
            <label className="block">
                <span className="text-sm text-slate-300">Cards</span>
                <div className="relative">
                    <select
                        value={config.core.ui?.cards}
                        onChange={e => updateConfig('core.ui.cards', e.target.value)}
                        className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    >
                        <option value="glass">Glass</option>
                        <option value="flat">Flat</option>
                        <option value="elevated">Elevated</option>
                    </select>
                    <ChevronDown />
                </div>
            </label>
            <label className="block">
                <span className="text-sm text-slate-300">Corners</span>
                <div className="relative">
                    <select
                        value={config.core.ui?.corners}
                        onChange={e => updateConfig('core.ui.corners', e.target.value)}
                        className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    >
                        <option value="rounded">Rounded</option>
                        <option value="pill">Pill</option>
                        <option value="sharp">Sharp</option>
                    </select>
                    <ChevronDown />
                </div>
            </label>
        </div>

        {/* Interactivity */}
        <div className="grid grid-cols-2 gap-3">
            <label className="block">
                <span className="text-sm text-slate-300">Animations</span>
                <div className="relative">
                    <select
                        value={config.core.interactivity?.animations}
                        onChange={e => updateConfig('core.interactivity.animations', e.target.value)}
                        className="mt-1 w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 pr-10 appearance-none"
                    >
                        <option value="subtle">Subtle</option>
                        <option value="medium">Medium</option>
                        <option value="none">None</option>
                    </select>
                    <ChevronDown />
                </div>
            </label>
            <label className="flex items-center gap-2 mt-7">
                <input
                    checked={config.core.interactivity?.themeSwitcher || false}
                    onChange={e => updateConfig('core.interactivity.themeSwitcher', e.target.checked)}
                    type="checkbox"
                />
                <span className="text-sm">Show theme switcher</span>
            </label>
        </div>
    </form>
  );
};