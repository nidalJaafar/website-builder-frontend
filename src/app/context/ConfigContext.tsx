'use client';

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useRouter } from 'next/navigation';
import { useNotifier } from './NotificationContext';
import { useAuth } from './AuthContext';

// --- TYPE DEFINITIONS ---
export type SiteType = 'single_page' | 'multi_page';
export type ColorModeOption = 'system' | 'light' | 'dark';
export type AccentOption = 'neon_cyan' | 'purple' | 'emerald' | 'amber' | 'custom' | 'ai_choice';
export type CustomAccentPalette = {
  primary: string;
  secondary: string;
  tertiary: string;
};
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
  branding: {
    colorMode: ColorModeOption;
    accent: AccentOption;
    customPalette: CustomAccentPalette;
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
  essentials: { name: string; industry: string; description?: string };
  core: CoreConfig;
  advanced: AdvancedConfig;
};

export const createDefaultCustomPalette = (): CustomAccentPalette => ({
  primary: '#000000',
  secondary: '#FFFFFF',
  tertiary: '',
});

const normalizeConfigBranding = (config: Config | null | undefined) => {
  if (!config || !config.core) {
    return;
  }

  const coreRef = config.core as unknown as {
    branding?: Partial<CoreConfig['branding']> & {
      customPalette?: Partial<CustomAccentPalette>;
    };
  };

  const brandingCandidate = coreRef.branding ?? {};
  const paletteCandidate =
    (brandingCandidate.customPalette ?? {}) as Partial<CustomAccentPalette>;

  const normalizedPalette: CustomAccentPalette = {
    primary:
      typeof paletteCandidate.primary === 'string' && paletteCandidate.primary
        ? paletteCandidate.primary
        : '#000000',
    secondary:
      typeof paletteCandidate.secondary === 'string' && paletteCandidate.secondary
        ? paletteCandidate.secondary
        : '#FFFFFF',
    tertiary:
      typeof paletteCandidate.tertiary === 'string' ? paletteCandidate.tertiary : '',
  };

  config.core = {
    ...config.core,
    branding: {
      colorMode: (brandingCandidate.colorMode ?? 'system') as ColorModeOption,
      accent: (brandingCandidate.accent ?? 'custom') as AccentOption,
      customPalette: normalizedPalette,
    },
  };
};

const serializeConfig = (cfg: Config): Config => {
  const clone = structuredClone(cfg) as Config;
  normalizeConfigBranding(clone);
  const brandingRecord = clone.core.branding as unknown as Record<string, unknown>;

  if (clone.core.branding.accent !== 'custom') {
    delete brandingRecord.customPalette;
    if (clone.core.branding.accent === 'ai_choice') {
      brandingRecord.accentInstruction =
        'Please choose the accent colors based on the brand name and industry provided.';
    } else {
      delete brandingRecord.accentInstruction;
    }
  } else {
    delete brandingRecord.accentInstruction;
  }

  return clone;
};

type FieldErrors = {
  essentials: {
    name: boolean;
    industry: boolean;
  };
};

export type HistoryItem = {
  title: string;
  prompt: string;
  options: Config;
  time: number;
};

type ChatRole = 'system' | 'agent' | 'user';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
};

type BuildStatus = 'idle' | 'pending' | 'completed' | 'error';

interface IConfigContext {
  config: Config;
  promptText: string;
  jsonText: string;
  history: HistoryItem[];
  builderMode: BuilderMode;
  lastGeneratedPrompt: string;
  updateConfig: (path: string, value: unknown) => void;
  generatePrompt: () => Promise<void>;
  resetConfig: () => void;
  generateSite: () => Promise<void>;
  loadFromHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
  setPromptText: (text: string) => void;
  enterConfigureMode: () => void;
  enterReviewMode: (options?: { preservePrompt?: boolean }) => void;
  fieldErrors: FieldErrors;
  setFieldErrors: React.Dispatch<React.SetStateAction<FieldErrors>>;
  isGeneratingPrompt: boolean;
  chatSessionId: string | null;
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => Promise<void>;
  isSendingChatMessage: boolean;
  buildStatus: BuildStatus;
  buildStatusMessage: string;
  sitePreviewHtml: string | null;
   downloadSiteZip: () => Promise<void>;
   isDownloadingZip: boolean;
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
  essentials: { name: '', industry: '', description: '' },
  core: {
    siteType: 'single_page',
    branding: {
      colorMode: 'system',
      accent: 'custom',
      customPalette: createDefaultCustomPalette(),
    },
    nav: { placement: 'topbar' },
    sections: ['features', 'pricing', 'faq', 'contact'],
    hero: { type: 'headline_subcopy', media: ['gradient_orbs'] },
    ui: { buttons: 'solid', cards: 'glass', corners: 'rounded' },
    interactivity: { animations: 'subtle', themeSwitcher: true },
  },
  advanced: {},
};

const createFieldErrorState = (): FieldErrors => ({
  essentials: { name: false, industry: false },
});

const extractPrompt = (payload: unknown): string | null => {
  if (!payload) return null;

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return trimmed.length ? trimmed : null;
  }

  if (typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidates = [
      record.prompt,
      record.description,
      record.result,
      record.message,
    ];

    for (const value of candidates) {
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.length) {
          return trimmed;
        }
      }
    }
  }

  return null;
};

const extractChatMessage = (payload: unknown): string | null => {
  if (!payload) return null;

  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    return trimmed.length ? trimmed : null;
  }

  if (typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    const candidates = [record.agent_message, record.message, record.reply, record.response, record.content];
    for (const value of candidates) {
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.length) {
          return trimmed;
        }
      }
    }

    const nestedSource = record.data;
    if (nestedSource) {
      const nested = extractChatMessage(nestedSource);
      if (nested) {
        return nested;
      }
    }

    const arrayCandidates = [record.messages, record.replies, record.responses];
    for (const candidate of arrayCandidates) {
      if (Array.isArray(candidate)) {
        for (const item of candidate) {
          const nested = extractChatMessage(item);
          if (nested) {
            return nested;
          }
        }
      }
    }
  }

  return null;
};

const extractSessionId = (payload: unknown): string | null => {
  if (typeof payload !== 'object' || payload === null) return null;
  const record = payload as Record<string, unknown>;
  const candidates = [
    record.sessionId,
    record.sessionID,
    record.session_id,
    record.id,
    record.chatId,
    record.chatID,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  const nestedSource = record.data;
  if (nestedSource) {
    const nested = extractSessionId(nestedSource);
    if (nested) {
      return nested;
    }
  }
  return null;
};

const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const PROMPT_ENDPOINT = (() => {
  const direct = process.env.NEXT_PUBLIC_PROMPT_API_URL?.trim();
  if (direct) {
    return direct.replace(/\/$/, '');
  }

  return '/api/parse';
})();

const CHAT_START_ENDPOINT = '/api/chat/start';
const CHAT_MESSAGE_ENDPOINT = '/api/chat/message';
const POLL_ENDPOINT = (sessionId: string) => `/api/poll/${sessionId}`;
const POLL_INTERVAL_MS = 15000;

function buildReadablePrompt(cfg: Config) {
  const lines: string[] = [];
  const e = cfg.essentials || {};
  if (e.name || e.industry || e.description) {
    const infoParts = [
      `Brand: ${e.name || 'Untitled'} - Industry: ${e.industry || 'General'}`,
    ];
    if (e.description) {
      infoParts.push(`Description: ${e.description}`);
    }
    lines.unshift(`${infoParts.join('. ')}. `);
  }
  const c = cfg.core || {};
  const sections =
    Array.isArray(c.sections) && c.sections.length
      ? ` featuring ${c.sections.map((section) => section.replace(/_/g, ' ')).join(', ')}`
      : '';
  lines.push(`Create a ${c.siteType || 'single_page'} website${sections}.`);
  const branding = c.branding as Partial<CoreConfig['branding']> | undefined;
  if (branding?.accent === 'custom') {
    const palette = branding.customPalette;
    if (palette) {
      const paletteColors = [palette.primary, palette.secondary, palette.tertiary]
        .filter((color): color is string => Boolean(color))
        .map((color) => color.toUpperCase());
      if (paletteColors.length) {
        lines.push(`Preferred accent colors: ${paletteColors.join(', ')}.`);
      }
    }
  } else if (branding?.accent === 'ai_choice') {
    lines.push('Accent style: Choose colors that match the brand name and industry context.');
  } else if (branding?.accent) {
    lines.push(`Accent style: ${branding.accent.replace(/_/g, ' ')}.`);
  }
  return lines.join('');
}

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<Config>(initialConfig);
  const [promptText, setPromptText] = useState('');
  const [jsonText, setJsonText] = useState('{}');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [builderMode, setBuilderMode] = useState<BuilderMode>('configure');
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(createFieldErrorState());
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const { notify } = useNotifier();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSendingChatMessage, setIsSendingChatMessage] = useState(false);
  const [buildStatus, setBuildStatus] = useState<BuildStatus>('idle');
  const [buildStatusMessage, setBuildStatusMessage] = useState('');
  const [sitePreviewHtml, setSitePreviewHtml] = useState<string | null>(null);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [pendingNotification, setPendingNotification] = useState<string | null>(null);
  const assetUrlsRef = useRef<string[]>([]);
  const pollTimeoutRef = useRef<number | null>(null);

  const updateJsonView = useCallback((cfg: Config) => {
    const serialized = serializeConfig(cfg);
    setJsonText(JSON.stringify(serialized || {}, null, 2));
  }, []);

  const clearSitePreview = useCallback(() => {
    assetUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        /* no-op */
      }
    });
    assetUrlsRef.current = [];
    setSitePreviewHtml(null);
  }, []);

  const resetChatState = useCallback(() => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
    setChatSessionId(null);
    setChatMessages([]);
    setBuildStatus('idle');
    setBuildStatusMessage('');
    clearSitePreview();
  }, [clearSitePreview]);

  useEffect(() => {
    try {
      const rawHistory = localStorage.getItem('astrasite:history');
      if (rawHistory) {
        const parsedHistory = JSON.parse(rawHistory) as HistoryItem[];
        parsedHistory.forEach((item) => {
          if (item?.options?.core) {
            const core = item.options.core as unknown as Record<string, unknown>;
            if ('preset' in core) {
              delete core.preset;
            }
          }
          normalizeConfigBranding(item?.options);
        });
        setHistory(parsedHistory);
      }

      const rawConfig = localStorage.getItem('astrasite:last_cfg');
      if (rawConfig) {
        const parsed = JSON.parse(rawConfig) as Record<string, unknown>;
        const parsedConfig = parsed as Config;
        if (parsedConfig && typeof parsedConfig === 'object' && parsedConfig.core) {
          const core = parsedConfig.core as unknown as Record<string, unknown>;
          if ('preset' in core) {
            delete core.preset;
          }
        }
        normalizeConfigBranding(parsedConfig);
        setConfig(parsedConfig);
        updateJsonView(parsedConfig);
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
      const serializableHistory = history.map((item) => ({
        ...item,
        options: serializeConfig(item.options),
      }));
      localStorage.setItem('astrasite:history', JSON.stringify(serializableHistory));
    } catch (error) {
      console.error('Failed to save history', error);
    }
  }, [history]);

  useEffect(() => {
    try {
      const serializableConfig = serializeConfig(config);
      localStorage.setItem('astrasite:last_cfg', JSON.stringify(serializableConfig));
    } catch (error) {
      console.error('Failed to persist config', error);
    }
  }, [config]);

  useEffect(() => {
    if (!isAuthenticated) {
      resetChatState();
    }
  }, [isAuthenticated, resetChatState]);

  useEffect(() => {
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
      assetUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* no-op */
        }
      });
      assetUrlsRef.current = [];
    };
  }, []);

  const updateBuildStatus = useCallback(
    (next: BuildStatus, message: string, options?: { notifyMessage?: string }) => {
      let messageToNotify: string | null = null;
      setBuildStatus((prev) => {
        if (prev !== next && options?.notifyMessage) {
          messageToNotify = options.notifyMessage;
        }
        return next;
      });
      setBuildStatusMessage(message);
      if (messageToNotify) {
        setPendingNotification(messageToNotify);
      }
    },
    []
  );

  useEffect(() => {
    if (!pendingNotification) {
      return;
    }
    notify(pendingNotification);
    setPendingNotification(null);
  }, [pendingNotification, notify]);

  const fetchAndPrepareSite = useCallback(
    async (sessionId: string) => {
      if (sitePreviewHtml) {
        return;
      }
      const newAssetUrls: string[] = [];
      try {
        const response = await fetch(`/api/zip/${sessionId}`, { cache: 'no-store' });
        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          throw new Error(
            `Zip fetch failed with status ${response.status}${
              errorText ? `: ${errorText}` : ''
            }`
          );
        }

        const data = await response.json();
        const files = Array.isArray(data?.files) ? data.files : null;
        if (!files || files.length === 0) {
          updateBuildStatus('error', 'Website archive is empty.');
          return;
        }

        const normalizePath = (path: string) =>
          path.replace(/^[.\/\\]+/, '').replace(/\\/g, '/');

        const decodeBase64ToUint8Array = (base64: string) => {
          const binary = atob(base64);
          const length = binary.length;
          const bytes = new Uint8Array(length);
          for (let i = 0; i < length; i += 1) {
            bytes[i] = binary.charCodeAt(i);
          }
          return bytes;
        };

        const guessMime = (path: string) => {
          if (path.endsWith('.css')) return 'text/css';
          if (path.endsWith('.js')) return 'application/javascript';
          if (path.endsWith('.svg')) return 'image/svg+xml';
          if (path.endsWith('.png')) return 'image/png';
          if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
          if (path.endsWith('.gif')) return 'image/gif';
          if (path.endsWith('.webp')) return 'image/webp';
          if (path.endsWith('.woff2')) return 'font/woff2';
          if (path.endsWith('.woff')) return 'font/woff';
          if (path.endsWith('.ttf')) return 'font/ttf';
          if (path.endsWith('.json')) return 'application/json';
          return 'application/octet-stream';
        };

        const textDecoder = new TextDecoder();
        let indexHtmlContent: string | null = null;
        let indexHtmlPath: string | null = null;
        const assetEntries: Array<{
          normalizedPath: string;
          originalPath: string;
          bytes: Uint8Array;
          mime: string;
        }> = [];

        clearSitePreview();

        files.forEach((file: { path: string; content: string }) => {
          const normalizedPath = normalizePath(file.path);
          const bytes = decodeBase64ToUint8Array(file.content);
          const ext = normalizedPath.split('.').pop()?.toLowerCase() ?? '';

          if (ext === 'html' && (!indexHtmlContent || normalizedPath.endsWith('index.html'))) {
            indexHtmlContent = textDecoder.decode(bytes);
            indexHtmlPath = normalizedPath;
            return;
          }

          const mime = guessMime(normalizedPath);
          assetEntries.push({
            normalizedPath,
            originalPath: file.path,
            bytes,
            mime,
          });
        });

        if (!indexHtmlContent) {
          updateBuildStatus('error', 'index.html not found in website bundle.');
          return;
        }

        const assetMap = new Map<string, string>();
        const resolvedIndexPath =
          typeof indexHtmlPath === 'string' ? indexHtmlPath : '';
        const indexBaseDir = resolvedIndexPath.includes('/')
          ? resolvedIndexPath.slice(0, resolvedIndexPath.lastIndexOf('/') + 1)
          : '';

        const registerVariants = (key: string, url: string) => {
          const variants = new Set<string>();
          variants.add(key);
          variants.add(`./${key}`);
          variants.add(`/${key}`);
          variants.add(`_next/${key}`);
          variants.add(`./_next/${key}`);
          variants.add(`/_next/${key}`);

          const basename = key.split('/').pop();
          if (basename && basename !== key) {
            variants.add(basename);
            variants.add(`./${basename}`);
            variants.add(`/${basename}`);
          }

          variants.forEach((variant) => {
            assetMap.set(variant, url);
          });
        };

        const registerAsset = (pathKey: string, url: string) => {
          const normalizedKey = normalizePath(pathKey);
          registerVariants(normalizedKey, url);

          if (normalizedKey.startsWith('_next/')) {
            const withoutPrefix = normalizedKey.slice('_next/'.length);
            if (withoutPrefix) {
              registerVariants(withoutPrefix, url);
            }
          } else {
            registerVariants(`_next/${normalizedKey}`, url);
          }
        };

        assetEntries.forEach(({ normalizedPath, originalPath, bytes, mime }) => {
          let arrayBuffer: ArrayBuffer;
          if (bytes.buffer instanceof ArrayBuffer) {
            arrayBuffer = bytes.buffer.slice(
              bytes.byteOffset,
              bytes.byteOffset + bytes.byteLength
            );
          } else {
            arrayBuffer = new Uint8Array(bytes).buffer as ArrayBuffer;
          }
          const blob = new Blob([arrayBuffer], { type: mime });
          const url = URL.createObjectURL(blob);
          newAssetUrls.push(url);
          registerAsset(normalizedPath, url);
          registerAsset(originalPath, url);
          if (indexBaseDir && normalizedPath.startsWith(indexBaseDir)) {
            const relative = normalizedPath.slice(indexBaseDir.length);
            registerAsset(relative, url);
          }
        });

        const parser = new DOMParser();
        const doc = parser.parseFromString(indexHtmlContent, 'text/html');

        const resolveAssetUrl = (originalPath: string | null) => {
          if (!originalPath) return null;
          const trimmed = originalPath.trim();
          if (!trimmed) return null;

          const candidates = new Set<string>();
          candidates.add(trimmed);
          candidates.add(normalizePath(trimmed));
          candidates.add(normalizePath(trimmed.split('?')[0]));

          if (indexBaseDir) {
            try {
              const base = new URL(trimmed, `http://example.com/${indexBaseDir}`);
              const pathname = base.pathname.replace(/^\/+/, '');
              candidates.add(pathname);
              candidates.add(normalizePath(pathname));
            } catch {
              /* ignore invalid paths */
            }
          }

          for (const candidate of candidates) {
          let normalizedCandidate = normalizePath(candidate);
          if (normalizedCandidate.startsWith('_next/')) {
            const withoutPrefix = normalizedCandidate.slice('_next/'.length);
            if (withoutPrefix) {
              normalizedCandidate = withoutPrefix;
            }
          }
            const match =
              assetMap.get(normalizedCandidate) ??
              assetMap.get(`./${normalizedCandidate}`) ??
              assetMap.get(`/${normalizedCandidate}`);
            if (match) {
              return match;
            }
          }
          return null;
        };

        const rewriteAttribute = (selector: string, attribute: string) => {
          doc.querySelectorAll<HTMLElement>(selector).forEach((element) => {
            const original = element.getAttribute(attribute);
            const replacement = resolveAssetUrl(original);
            if (replacement) {
              element.setAttribute(attribute, replacement);
            }
          });
        };

        rewriteAttribute('link[href]', 'href');
        rewriteAttribute('script[src]', 'src');
        rewriteAttribute('img[src]', 'src');
        rewriteAttribute('audio[src]', 'src');
        rewriteAttribute('video[src]', 'src');
        rewriteAttribute('source[src]', 'src');

        doc.querySelectorAll('img[srcset], source[srcset]').forEach((element) => {
          const srcset = element.getAttribute('srcset');
          if (!srcset) return;
          const rewritten = srcset
            .split(',')
            .map((entry) => {
              const parts = entry.trim().split(/\s+/);
              const pathPart = parts[0];
              const descriptor = parts.slice(1).join(' ');
              const replacement = resolveAssetUrl(pathPart);
              if (replacement) {
                return descriptor ? `${replacement} ${descriptor}` : replacement;
              }
              return entry.trim();
            })
            .join(', ');
          element.setAttribute('srcset', rewritten);
        });

        assetUrlsRef.current = newAssetUrls;
        if (pollTimeoutRef.current) {
          clearTimeout(pollTimeoutRef.current);
          pollTimeoutRef.current = null;
        }
        const serializedHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
        setSitePreviewHtml(serializedHtml);
        updateBuildStatus('completed', 'Website build completed.', {
          notifyMessage: 'Website build completed.',
        });
      } catch (error) {
        console.error('Failed to prepare site preview', error);
        newAssetUrls.forEach((url) => {
          try {
            URL.revokeObjectURL(url);
          } catch {
            /* no-op */
          }
        });
        assetUrlsRef.current = [];
        updateBuildStatus('error', 'Failed to load website preview.');
        if (typeof window !== 'undefined') {
          if (pollTimeoutRef.current) {
            clearTimeout(pollTimeoutRef.current);
          }
          pollTimeoutRef.current = window.setTimeout(() => {
            void fetchAndPrepareSite(sessionId);
          }, POLL_INTERVAL_MS);
        }
      }
    },
    [clearSitePreview, sitePreviewHtml, updateBuildStatus]
  );

  const downloadSiteZip = useCallback(async () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!chatSessionId) {
      notify('Generate the website first to receive a download link.');
      return;
    }

    if (!sitePreviewHtml || buildStatus !== 'completed') {
      notify('No completed website is available to download yet.');
      return;
    }

    if (isDownloadingZip) {
      notify('Download already in progress...');
      return;
    }

    setIsDownloadingZip(true);

    try {
      const response = await fetch(`/api/zip/${chatSessionId}?download=1`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(
          `Download failed with status ${response.status}${
            errorText ? `: ${errorText}` : ''
          }`
        );
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const disposition = response.headers.get('content-disposition') ?? '';

      let filename = `website-${chatSessionId}.zip`;
      const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
      const quotedMatch = disposition.match(/filename="([^"]+)"/i);
      const bareMatch = disposition.match(/filename=([^;]+)/i);
      const rawFilename =
        (utf8Match && utf8Match[1]) ||
        (quotedMatch && quotedMatch[1]) ||
        (bareMatch && bareMatch[1]);

      if (rawFilename) {
        const trimmed = rawFilename.trim().replace(/^['"]|['"]$/g, '');
        try {
          filename = decodeURIComponent(trimmed);
        } catch {
          filename = trimmed;
        }
      }

      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);

      notify('Download started.');
    } catch (error) {
      console.error('Failed to download ZIP', error);
      notify('Failed to download ZIP. Please try again.');
    } finally {
      setIsDownloadingZip(false);
    }
  }, [
    buildStatus,
    chatSessionId,
    isDownloadingZip,
    notify,
    sitePreviewHtml,
  ]);

  const pollSessionStatus = useCallback(
    async (sessionId: string) => {
      const scheduleNextPoll = () => {
        if (typeof window !== 'undefined') {
          if (pollTimeoutRef.current) {
            clearTimeout(pollTimeoutRef.current);
          }
          pollTimeoutRef.current = window.setTimeout(() => {
            void pollSessionStatus(sessionId);
          }, POLL_INTERVAL_MS);
        }
      };

      try {
        const response = await fetch(POLL_ENDPOINT(sessionId), { cache: 'no-store' });
        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          throw new Error(
            `Poll failed with status ${response.status}${errorText ? `: ${errorText}` : ''}`
          );
        }

        const data = await response.json();
        const rawStatus =
          typeof data?.status === 'string' ? data.status.toLowerCase() : 'unknown';

        if (rawStatus === 'completed' || rawStatus === 'complete') {
          if (pollTimeoutRef.current) {
            clearTimeout(pollTimeoutRef.current);
            pollTimeoutRef.current = null;
          }
          await fetchAndPrepareSite(sessionId);
        } else if (rawStatus === 'pending') {
          updateBuildStatus('pending', 'Website build in progress...');
          scheduleNextPoll();
        } else if (rawStatus === 'reactivated') {
          updateBuildStatus('pending', 'Website edit in progress...');
          scheduleNextPoll();
        } else {
          if (pollTimeoutRef.current) {
            clearTimeout(pollTimeoutRef.current);
            pollTimeoutRef.current = null;
          }
          updateBuildStatus('error', `Build status: ${data?.status ?? 'unknown'}`);
        }
      } catch (error) {
        console.error('Failed to poll build status', error);
        if (buildStatus !== 'completed') {
          updateBuildStatus('error', 'Failed to check build status.');
          scheduleNextPoll();
        }
      }
    },
    [buildStatus, fetchAndPrepareSite, updateBuildStatus]
  );
  const updateConfig = (path: string, value: unknown) => {
    const newConfig: Config = structuredClone(config);
    setByPath(newConfig as unknown as Record<string, unknown>, path, value);
    setConfig(newConfig);
    updateJsonView(newConfig);
  };

  const generatePrompt = async () => {
    const name = config.essentials?.name?.trim();
    const industry = config.essentials?.industry?.trim();
    const missingName = !name;
    const missingIndustry = !industry;

    if (!isAuthenticated) {
      notify('Please sign in to generate prompts.');
      router.push('/auth');
      return;
    }

    if (isGeneratingPrompt) {
      notify('Prompt generation already in progress.');
      return;
    }

    if (missingName || missingIndustry) {
      setFieldErrors((prev) => ({
        ...prev,
        essentials: {
          name: missingName,
          industry: missingIndustry,
        },
      }));

      if (typeof window !== 'undefined') {
        const focusId = missingName ? 'essentials-name' : 'essentials-industry';
        window.requestAnimationFrame(() => {
          const element = document.getElementById(focusId);
          if (element) {
            (element as HTMLElement).focus();
          }
        });
      }

      if (missingName && missingIndustry) {
        notify('Brand name and industry are required before generating a prompt.');
      } else if (missingName) {
        notify('Brand name is required before generating a prompt.');
      } else {
        notify('Industry is required before generating a prompt.');
      }
      return;
    }

    setFieldErrors(createFieldErrorState());
    setIsGeneratingPrompt(true);
    updateJsonView(config);

    try {
      const response = await fetch(PROMPT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config: serializeConfig(config) }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');

        throw new Error(
          `Prompt API responded with status ${response.status}${
            errorText ? `: ${errorText}` : ''
          }`
        );
      }

      const data = await response.json();
      const aiPrompt = extractPrompt(data);

      if (!aiPrompt) {
        throw new Error('Prompt API returned an empty prompt.');
      }

      setPromptText(aiPrompt);
      notify('Prompt generated with AI.');
    } catch (error) {
      console.error('Failed to generate prompt via backend', error);
      const fallbackPrompt = buildReadablePrompt(config);
      setPromptText(fallbackPrompt);
      notify('Prompt generated locally (AI request failed).');
    } finally {
      updateJsonView(config);
      setIsGeneratingPrompt(false);
    }
  };

  const resetConfig = () => {
    const reset = structuredClone(initialConfig) as Config;
    setConfig(reset);
    setPromptText('');
    setBuilderMode('configure');
    setLastGeneratedPrompt('');
    setFieldErrors(createFieldErrorState());
    resetChatState();
    updateJsonView(reset);
    notify('Options reset');
  };

  const addToHistory = (item: Omit<HistoryItem, 'time'>) => {
    const newItem = { ...item, time: Date.now() };
    setHistory((prev) => [newItem, ...prev]);
  };

  const generateSite = async () => {
    if (!isAuthenticated) {
      notify('Please sign in before generating a website.');
      router.push('/auth');
      return;
    }

    const trimmedPromptText = promptText.trim();
    const previousPrompt = lastGeneratedPrompt.trim();
    if (!trimmedPromptText && !previousPrompt) {
      notify('Generate a prompt before building your website.');
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
          const textarea = document.getElementById(
            'prompt-editor-textarea'
          ) as HTMLTextAreaElement | null;
          textarea?.focus();
        });
      }
      return;
    }

    const normalizedSnapshot = structuredClone(config) as Config;
    normalizeConfigBranding(normalizedSnapshot);
    const serializableSnapshot = serializeConfig(normalizedSnapshot);
    const prompt = trimmedPromptText || previousPrompt;
    const historyTitle =
      normalizedSnapshot.essentials.name?.trim() ||
      (normalizedSnapshot.core.siteType === 'multi_page'
        ? 'Multi-page Project'
        : 'Single-page Project');
    addToHistory({ title: historyTitle, prompt, options: normalizedSnapshot });
    setLastGeneratedPrompt(prompt);
    setBuilderMode('review');
    notify(`Generating: ${prompt.substring(0, 30)}...`);

    resetChatState();
    setChatMessages([
      {
        id: makeId(),
        role: 'system',
        content: prompt,
        timestamp: Date.now(),
      },
    ]);
    updateBuildStatus('pending', 'Gathering requirements...');

    try {
      const response = await fetch(CHAT_START_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: prompt, config: serializableSnapshot }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(
          `Chat start failed with status ${response.status}${
            errorText ? `: ${errorText}` : ''
          }`
        );
      }

      const data = await response.json();
      const sessionId = extractSessionId(data);
      const agentMessage = extractChatMessage(data);

      if (sessionId) {
        setChatSessionId(sessionId);
        await pollSessionStatus(sessionId);
      } else {
        console.warn('Chat start succeeded without a session ID.');
        updateBuildStatus('error', 'Missing chat session identifier.');
      }

      if (agentMessage) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: 'agent',
            content: agentMessage,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to start chat session', error);
      notify('Failed to start requirements chat. You can still adjust the prompt manually.');
      setChatSessionId(null);
      updateBuildStatus('error', 'Failed to start requirements chat.');
    }
  };

  const sendChatMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) {
      return;
    }

    if (isSendingChatMessage) {
      notify('Please wait for the previous message to complete.');
      return;
    }

    if (!chatSessionId) {
      notify('Generate the website first to start a chat session.');
      return;
    }

    const activeSessionId = chatSessionId;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    const basePrompt = (promptText || lastGeneratedPrompt || '').trim();
    const addition = `\n\nUpdate request: ${trimmed}`;
    setPromptText(`${basePrompt}${addition}`.trim());
    notify('Request added to prompt context');
    if (sitePreviewHtml) {
      clearSitePreview();
    }
    updateBuildStatus('pending', 'Website build in progress...');

    setIsSendingChatMessage(true);
    try {
      const response = await fetch(CHAT_MESSAGE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: activeSessionId,
          sessionId: activeSessionId,
          user_input: trimmed,
          message: trimmed,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(
          `Chat message failed with status ${response.status}${
            errorText ? `: ${errorText}` : ''
          }`
        );
      }

      const data = await response.json();
      const agentMessage = extractChatMessage(data);
      if (agentMessage) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: makeId(),
            role: 'agent',
            content: agentMessage,
            timestamp: Date.now(),
          },
        ]);
      }
      if (activeSessionId) {
        await pollSessionStatus(activeSessionId);
      }
    } catch (error) {
      console.error('Failed to send chat message', error);
      notify('Failed to send message to requirements agent.');
      updateBuildStatus('error', 'Failed to send message to requirements agent.');
      if (activeSessionId) {
        await pollSessionStatus(activeSessionId);
      }
    } finally {
      setIsSendingChatMessage(false);
    }
  };

  const loadFromHistory = (item: HistoryItem) => {
    const optionsClone = structuredClone(item.options) as Config;
    normalizeConfigBranding(optionsClone);
    setConfig(optionsClone);
    setPromptText(item.prompt || '');
    setLastGeneratedPrompt(item.prompt || '');
    updateJsonView(optionsClone);
    setFieldErrors(createFieldErrorState());
    resetChatState();
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
    builderMode,
    lastGeneratedPrompt,
    updateConfig,
    generatePrompt,
    resetConfig,
    generateSite,
    loadFromHistory,
    clearHistory,
    setPromptText,
    enterConfigureMode,
    enterReviewMode,
    fieldErrors,
    setFieldErrors,
    isGeneratingPrompt,
    chatSessionId,
    chatMessages,
    sendChatMessage,
    isSendingChatMessage,
    buildStatus,
    buildStatusMessage,
    sitePreviewHtml,
    downloadSiteZip,
    isDownloadingZip,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};
