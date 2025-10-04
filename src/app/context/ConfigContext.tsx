'use client';

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { useNotifier } from './NotificationContext';

// --- TYPE DEFINITIONS ---
export type SiteType = 'single_page' | 'multi_page';
export type PresetOption =
  | 'landing'
  | 'saas'
  | 'portfolio'
  | 'restaurant'
  | 'ecommerce'
  | 'blog'
  | 'docs';
export type ColorModeOption = 'system' | 'light' | 'dark';
export type AccentOption = 'neon_cyan' | 'purple' | 'emerald' | 'amber' | 'custom';
export type NavPlacementOption = 'topbar' | 'sidebar_left' | 'sidebar_right';
export type SectionOption =
  | 'features'
  | 'pricing'
  | 'faq'
  | 'contact'
  | 'testimonials'
  | 'blog_feed';
export type HeroTypeOption =
  | 'headline_subcopy'
  | 'with_form'
  | 'split_image'
  | 'with_video';
export type HeroMediaOption =
  | 'bg_image'
  | 'gradient_orbs'
  | 'particles'
  | 'video_loop';
export type UIButtonStyle = 'solid' | 'soft' | 'outline';
export type UICardStyle = 'glass' | 'flat' | 'elevated';
export type UICornerStyle = 'rounded' | 'pill' | 'sharp';
export type AnimationOption = 'subtle' | 'medium' | 'none';

export type MenuTypeOption = 'links' | 'tabs' | 'mega_menu';
export type SecondaryNavOption = 'breadcrumbs' | 'top_utility_bar';
export type SidebarBehaviorOption = 'fixed' | 'collapsible' | 'overlay';
export type MaxWidthOption = 'md' | 'lg' | 'xl' | 'full';
export type SpacingOption = 'cozy' | 'comfortable' | 'spacious';
export type InputStyleOption = 'filled' | 'outlined' | 'underlined';
export type OverlayOption = 'modal' | 'sheet' | 'toast_notifications';
export type FormFieldOption = 'name' | 'email' | 'message' | 'consent_checkbox';
export type FormValidationOption = 'inline' | 'on_submit';
export type FormSuccessOption = 'toast' | 'inline_message' | 'redirect';
export type A11yLevelOption = 'base' | 'AA' | 'AAA_focus_visible';
export type SeoOption = 'meta_tags' | 'og_tags' | 'sitemap';
export type PerfImageOption = 'eager_home_hero' | 'lazy_everything_else';
export type PerfFontOption = 'swap' | 'optional';
export type PerfEffectsOption = 'low' | 'medium' | 'high';
export type LanguageOption = 'en' | 'fr' | 'ar';
export type BuilderMode = 'configure' | 'review';

export interface CoreConfig {
  siteType: SiteType;
  preset: PresetOption;
  branding: {
    colorMode: ColorModeOption;
    accent: AccentOption;
  };
  nav: {
    placement: NavPlacementOption;
  };
  sections: SectionOption[];
  hero: {
    type: HeroTypeOption;
    media: HeroMediaOption[];
  };
  ui: {
    buttons: UIButtonStyle;
    cards: UICardStyle;
    corners: UICornerStyle;
  };
  interactivity: {
    animations: AnimationOption;
    themeSwitcher: boolean;
  };
}

export interface AdvancedConfig {
  nav?: {
    menu?: MenuTypeOption;
    secondary?: SecondaryNavOption[];
    sidebarBehavior?: SidebarBehaviorOption;
  };
  layout?: {
    maxWidth?: MaxWidthOption;
    spacing?: SpacingOption;
  };
  inputs?: InputStyleOption;
  overlays?: OverlayOption[];
  forms?: {
    contactFields?: FormFieldOption[];
    validation?: FormValidationOption;
    captcha?: boolean;
    success?: FormSuccessOption;
  };
  a11ySeo?: {
    level?: A11yLevelOption;
    reducedMotion?: boolean;
    seo?: SeoOption[];
  };
  perf?: {
    images?: PerfImageOption;
    fonts?: PerfFontOption;
    effects?: PerfEffectsOption;
  };
  i18n?: {
    languages?: LanguageOption[];
    rtl?: boolean;
  };
}

// --- CONTEXT TYPES ---
export type Config = {
  essentials: { name: string; industry: string; logoData: string };
  core: CoreConfig;
  advanced: AdvancedConfig;
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
  builderMode: BuilderMode;
  lastGeneratedPrompt: string;
  updateConfig: (path: string, value: unknown) => void;
  generatePrompt: () => void;
  resetConfig: () => void;
  generateSite: () => void;
  loadFromHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  setPromptText: (text: string) => void;
  setLogoPreview: (data: string) => void;
  enterConfigureMode: () => void;
  enterReviewMode: (options?: { preservePrompt?: boolean }) => void;
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
function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): void {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;

  parts.forEach((part, index) => {
    if (index === parts.length - 1) {
      current[part] = value as unknown;
      return;
    }

    const next = current[part];
    if (
      typeof next !== 'object' ||
      next === null ||
      Array.isArray(next)
    ) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
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
  const lines: string[] = [];
  const e = cfg.essentials || {};
  if (e.name || e.industry || e.logoData) {
    const logoPart = e.logoData ? ' (logo provided)' : '';
    lines.unshift(`Brand: ${e.name || 'Untitled'} - Industry: ${e.industry || 'General'}${logoPart}. `);
  }
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
  const [builderMode, setBuilderMode] = useState<BuilderMode>('configure');
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState('');
  const { notify } = useNotifier();

  const updateJsonView = useCallback((cfg: Config) => {
    setJsonText(JSON.stringify(cfg || {}, null, 2));
  }, []);

  useEffect(() => {
    try {
      const rawHistory = localStorage.getItem('astrasite:history');
      if (rawHistory) {
        setHistory(JSON.parse(rawHistory));
      }

      const rawConfig = localStorage.getItem('astrasite:last_cfg');
      if (rawConfig) {
        const parsed = JSON.parse(rawConfig) as Config;
        setConfig(parsed);
        setLogoPreview(parsed.essentials?.logoData || '');
        updateJsonView(parsed);
      } else {
        updateJsonView(initialConfig);
      }
    } catch (error) {
      console.error('Failed to load saved settings', error);
      updateJsonView(initialConfig);
    }
  }, [updateJsonView]);

  useEffect(() => {
    try {
      localStorage.setItem('astrasite:history', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save history', error);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('astrasite:last_cfg', JSON.stringify(config));
    } catch (error) {
      console.error('Failed to persist config', error);
    }
  }, [config]);

  const updateConfig = (path: string, value: unknown) => {
    const newConfig: Config = structuredClone(config);
    setByPath(newConfig as unknown as Record<string, unknown>, path, value);
    setConfig(newConfig);
    updateJsonView(newConfig);
  };

  const generatePrompt = () => {
    const newPrompt = buildReadablePrompt(config);
    setPromptText(newPrompt);
    updateJsonView(config);
    notify('Prompt ready - edit if you like');
  };

  const resetConfig = () => {
    setConfig(initialConfig);
    setPromptText('');
    setLogoPreview('');
    setBuilderMode('configure');
    setLastGeneratedPrompt('');
    updateJsonView(initialConfig);
    notify('Options reset');
  };

  const addToHistory = (item: Omit<HistoryItem, 'time'>) => {
    const newItem = { ...item, time: Date.now() };
    setHistory((prev) => [newItem, ...prev]);
  };

  const generateSite = () => {
    const prompt = promptText.trim() || buildReadablePrompt(config);
    addToHistory({ title: config.core.preset || 'Project', prompt, options: config });
    setLastGeneratedPrompt(prompt);
    setBuilderMode('review');
    notify(`Generating: ${prompt.substring(0, 30)}...`);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setConfig(item.options);
    setPromptText(item.prompt || '');
    setLastGeneratedPrompt(item.prompt || '');
    updateJsonView(item.options);
    setLogoPreview(item.options.essentials.logoData || '');
    setBuilderMode('review');
    notify('Loaded from history');
  };

  const clearHistory = () => {
    setHistory([]);
    notify('History cleared');
  };

  const enterConfigureMode = () => {
    setBuilderMode('configure');
  };

  const enterReviewMode = (options?: { preservePrompt?: boolean }) => {
    setBuilderMode('review');
    if (!options?.preservePrompt) {
      setLastGeneratedPrompt(promptText.trim() || buildReadablePrompt(config));
    }
  };

  const value: IConfigContext = {
    config,
    promptText,
    jsonText,
    history,
    logoPreview,
    builderMode,
    lastGeneratedPrompt,
    updateConfig,
    generatePrompt,
    resetConfig,
    generateSite,
    loadFromHistory,
    clearHistory,
    setPromptText,
    setLogoPreview,
    enterConfigureMode,
    enterReviewMode,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};
