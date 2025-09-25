'use client';

import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {useNotifier} from './NotificationContext';

// --- TYPES ---
export type Config = {
  essentials: { name: string; industry: string; logoData: string };
  core: { [key: string]: any };
  advanced: { [key: string]: any };
};

export type HistoryItem = {
  title: string;
  prompt: string;
  options: Config;
  time: number;
};

interface IConfigContext {
  config: Config;
  promptText: string;
  jsonText: string;
  history: HistoryItem[];
  logoPreview: string;
  updateConfig: (path: string, value: any) => void;
  generatePrompt: () => void;
  resetConfig: () => void;
  generateSite: () => void;
  loadFromHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  setPromptText: (text: string) => void;
  setLogoPreview: (data: string) => void;
}

const ConfigContext = createContext<IConfigContext | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

// --- HELPERS ---
function setByPath(obj: any, path: string, value: any) {
    const parts = path.split('.');
    let cur = obj;
    parts.forEach((p, idx) => {
        if (idx === parts.length - 1) {
            cur[p] = value;
        } else {
            cur[p] = cur[p] || {};
            cur = cur[p];
        }
    });
}

const initialConfig: Config = {
  essentials: { name: '', industry: '', logoData: '' },
  core: {
    siteType: 'single_page',
    preset: 'landing',
    branding: { colorMode: 'system', accent: 'neon_cyan' },
    nav: { placement: 'topbar' },
    sections: ['features', 'pricing', 'faq', 'contact'],
    hero: { type: 'headline_subcopy', media: ['gradient_orbs'] },
    ui: { buttons: 'solid', cards: 'glass', corners: 'rounded' },
    interactivity: { animations: 'subtle', themeSwitcher: true },
  },
  advanced: {},
};

function buildReadablePrompt(cfg: Config) {
    const lines = [];
    const e = cfg.essentials || {};
    if (e.name || e.industry || e.logoData) {
        const logoPart = e.logoData ? ' (logo provided)' : '';
        lines.unshift(`Brand: ${e.name || 'Untitled'} — Industry: ${e.industry || 'General'}${logoPart}. `);
    }
    // This can be expanded to be as detailed as the original function
    const c = cfg.core || {};
    lines.push(`Create a ${c.siteType || 'single_page'} ${c.preset || 'landing'} website.`);
    return lines.join('');
}

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<Config>(initialConfig);
  const [promptText, setPromptText] = useState('');
  const [jsonText, setJsonText] = useState('{}');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [logoPreview, setLogoPreview] = useState('');
  const { notify } = useNotifier();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('astrasite:history');
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) { console.error("Failed to load history", e); }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('astrasite:history', JSON.stringify(history));
    } catch (e) { console.error("Failed to save history", e); }
  }, [history]);

  const updateJsonView = (cfg: Config) => {
    setJsonText(JSON.stringify(cfg || {}, null, 2));
  };

  const updateConfig = (path: string, value: any) => {
    const newConfig = JSON.parse(JSON.stringify(config));
    setByPath(newConfig, path, value);
    setConfig(newConfig);
    updateJsonView(newConfig);
  };

  const generatePrompt = () => {
    const newPrompt = buildReadablePrompt(config);
    setPromptText(newPrompt);
    updateJsonView(config);
    notify('Prompt ready — edit if you like');
  };

  const resetConfig = () => {
    setConfig(initialConfig);
    setPromptText('');
    setLogoPreview('');
    updateJsonView(initialConfig);
    notify('Options reset');
  };

  const addToHistory = (item: Omit<HistoryItem, 'time'>) => {
    const newItem = { ...item, time: Date.now() };
    setHistory(prev => [newItem, ...prev]);
  };

  const generateSite = () => {
    const prompt = promptText.trim();
    addToHistory({ title: config.core?.preset || 'Project', prompt, options: config });
    try {
      localStorage.setItem('astrasite:last_cfg', JSON.stringify(config));
    } catch {}
    notify(`Generating: ${prompt.substring(0, 30)}...`);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setConfig(item.options);
    setPromptText(item.prompt || '');
    updateJsonView(item.options);
    setLogoPreview(item.options.essentials.logoData || '');
    notify('Loaded from history');
  };

  const value = {
    config,
    promptText,
    jsonText,
    history,
    logoPreview,
    updateConfig,
    generatePrompt,
    resetConfig,
    generateSite,
    loadFromHistory,
    clearHistory: () => setHistory([]),
    setPromptText,
    setLogoPreview,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};