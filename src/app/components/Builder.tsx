"use client";

import React, {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { ConfigProvider, useConfig } from "../context/ConfigContext";
import { useAuth } from "../context/AuthContext";

import { Header } from "./builder/Header";
import { Sidebar } from "./builder/Sidebar";
import { Hero } from "./builder/Hero";
import { EssentialsForm } from "./builder/EssentialsForm";
import { CoreOptionsForm } from "./builder/CoreOptionsForm";
import { PromptEditor } from "./builder/PromptEditor";
import { Preview } from "./builder/Preview";
import { Footer } from "./builder/Footer";
import { ReviewChat } from "./builder/ReviewChat";
import { ClearIcon } from "./icons";

type DeviceView = "desktop" | "mobile";

const RESIZE_MIN = 0.6;
const RESIZE_MAX = 0.85;
const INITIAL_REVIEW_RATIO = 0.66;

const BuilderCore = () => {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isHistoryDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [previewRatio, setPreviewRatio] = useState(INITIAL_REVIEW_RATIO);
  const [isResizing, setIsResizing] = useState(false);
  const [deviceView, setDeviceView] = useState<DeviceView>("desktop");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const historyDrawerContentRef = useRef<HTMLDivElement | null>(null);
  const historyToggleRef = useRef<HTMLButtonElement | null>(null);

  const {
    builderMode,
    config,
    generatePrompt,
    generateSite,
    enterConfigureMode,
    isGeneratingPrompt,
    isSendingChatMessage,
  } = useConfig();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    setSidebarOpen(false);
    setHistoryDrawerOpen(false);
  }, [isAuthenticated]);

  const handleEnterConfigure = useCallback(() => {
    enterConfigureMode();
    setSidebarOpen(true);
    setHistoryDrawerOpen(false);
  }, [enterConfigureMode]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      const rawKey = event.key;
      if (!rawKey) {
        return;
      }
      const key = rawKey.toLowerCase();
      const hasModifier = event.metaKey || event.ctrlKey;

      if (hasModifier && key === "enter") {
        if (isGeneratingPrompt) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        void generatePrompt();
        return;
      }

      if (hasModifier && event.shiftKey && key === "g") {
        event.preventDefault();
        void generateSite();
        return;
      }

      if (hasModifier && key === "b") {
        event.preventDefault();
        const advancedPanel = document.getElementById(
          "advanced-panel"
        ) as HTMLDetailsElement | null;
        if (advancedPanel) {
          advancedPanel.open = !advancedPanel.open;
        }
        return;
      }

      if (hasModifier && key === "e") {
        event.preventDefault();
        enterConfigureMode();
        setSidebarOpen(false);
        setHistoryDrawerOpen(false);
        return;
      }

      if (
        builderMode === "review" &&
        hasModifier &&
        event.shiftKey &&
        key === "h"
      ) {
        event.preventDefault();
        setHistoryDrawerOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [
    builderMode,
    enterConfigureMode,
    generatePrompt,
    generateSite,
    isGeneratingPrompt,
    isAuthenticated,
  ]);

  useEffect(() => {
    if (!isHistoryDrawerOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!historyDrawerContentRef.current) return;
      const target = event.target as EventTarget | null;
      if (target instanceof Element && target.closest('[data-history-toggle]')) {
        return;
      }
      const nodeTarget = target instanceof Node ? target : null;
      if (!nodeTarget || !historyDrawerContentRef.current.contains(nodeTarget)) {
        setHistoryDrawerOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('touchstart', handlePointerDown);

    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isHistoryDrawerOpen]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (builderMode === "review") {
      window.scrollTo({ top: 0, behavior: 'auto' });
      setSidebarOpen(false);
      setPreviewRatio(INITIAL_REVIEW_RATIO);
    } else {
      setHistoryDrawerOpen(false);
    }
  }, [builderMode, isAuthenticated]);

  const handleResizeStart = (
    event: ReactMouseEvent<HTMLDivElement> | ReactTouchEvent<HTMLDivElement>
  ) => {
    if (!containerRef.current) return;
    event.preventDefault();
    setIsResizing(true);
    const rect = containerRef.current.getBoundingClientRect();

    const moveListener = (clientX: number) => {
      const clampedX = Math.min(
        Math.max(clientX, rect.left + rect.width * 0.1),
        rect.right - rect.width * RESIZE_MIN
      );
      const newPreviewRatio = Math.min(
        Math.max((rect.right - clampedX) / rect.width, RESIZE_MIN),
        RESIZE_MAX
      );
      setPreviewRatio(newPreviewRatio);
    };

    const handleMouseMove = (e: MouseEvent) => {
      moveListener(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      moveListener(e.touches[0].clientX);
    };

    const endResize = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', endResize);
      window.removeEventListener('touchend', endResize);
    };

    const initialClientX =
      'touches' in event.nativeEvent
        ? event.nativeEvent.touches[0].clientX
        : event.nativeEvent.clientX;
    moveListener(initialClientX);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseup', endResize);
    window.addEventListener('touchend', endResize);
  };

  const activeSectionsLabel = useMemo(() => {
    const count = config.core.sections.length;
    return count === 1 ? "1 section" : `${count} sections`;
  }, [config.core.sections.length]);

  const siteTypeLabel =
    config.core.siteType === "multi_page" ? "Multi-page layout" : "Single-page layout";

  const hasAdvancedTweaks = useMemo(() => {
    const advanced = config.advanced || {};
    return Object.values(advanced).some((value) => {
      if (!value) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object") {
        return Object.values(value).some((nested) => {
          if (!nested) return false;
          if (Array.isArray(nested)) return nested.length > 0;
          return true;
        });
      }
      return true;
    });
  }, [config.advanced]);

  const renderConfigureMode = () => (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6">
      <div className="grid grid-cols-2 md:grid-cols-[18rem_1fr] gap-4">
        <Sidebar isOpen={isSidebarOpen} />

        <main className="space-y-6 transition-all">
          <Hero />
          <EssentialsForm />

          <section className="relative overflow-hidden" id="builder-layout">
            <div className="grid lg:grid-cols-2 gap-6 transition-all">
              <div className="space-y-6" id="left-stack">
                <section className="relative overflow-hidden" id="builder">
                  <div className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur p-4 sm:p-6 dark:bg-slate-900/60 mb-0 transition-all">
                    <div className="grid gap-6 grid-cols-1">
                      <CoreOptionsForm />
                    </div>
                  </div>
                </section>
              </div>
              <div className="space-y-6" id="right-preview">
                <PromptEditor />
                <Preview
                  device={deviceView}
                  onDeviceChange={setDeviceView}
                  isReviewMode={false}
                  onEditSettings={() => {}}
                />
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </div>
    </div>
  );

  const renderReviewMode = () => (
    <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4">
      <div className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur px-4 py-3 flex flex-wrap gap-3 items-center justify-between">
        <div className="text-sm text-slate-300">
          Using {activeSectionsLabel} | {siteTypeLabel}
          {hasAdvancedTweaks ? " | Advanced tweaks active" : ""}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="px-3 py-2 rounded-lg bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-800 text-sm"
            onClick={handleEnterConfigure}
          >
            Edit settings
          </button>
          <button
            data-history-toggle
            className="px-3 py-2 rounded-lg bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-800 text-sm"
            onClick={() => setHistoryDrawerOpen((prev) => !prev)}
          >
            {isHistoryDrawerOpen ? "Hide history" : "Show history"}
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-800 text-sm"
            onClick={() => setPreviewRatio(INITIAL_REVIEW_RATIO)}
          >
            Reset layout
          </button>
        </div>
      </div>

      <div
        className="rounded-2xl bg-slate-900/30 ring-1 ring-white/5 backdrop-blur overflow-hidden lg:h-[110vh]"
        ref={containerRef}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 h-full">
          <div
            className="lg:flex-[1_1_0%] lg:min-w-[18rem] px-4 py-4 lg:py-6 flex flex-col h-full min-h-0"
            style={{ flexBasis: `${Math.max(1 - previewRatio, 0.2) * 100}%` }}
          >
            <ReviewChat onRegenerate={generateSite} onEditSettings={handleEnterConfigure} />
          </div>

          <div className="hidden lg:block w-px bg-white/10 relative">
            <div
              className={`absolute inset-y-0 -left-1 w-2 cursor-col-resize rounded-full transition-colors ${
                isResizing ? "bg-neon-400/60" : "bg-transparent hover:bg-neon-400/30"
              }`}
              onMouseDown={(event: ReactMouseEvent<HTMLDivElement>) =>
                handleResizeStart(event)
              }
              onTouchStart={(event: ReactTouchEvent<HTMLDivElement>) =>
                handleResizeStart(event)
              }
            />
          </div>

          <div
            className="px-4 py-4 lg:py-6 flex-1 transition-all"
            style={{ flexBasis: `${previewRatio * 100}%` }}
          >
            <Preview
              device={deviceView}
              onDeviceChange={setDeviceView}
              isReviewMode
              onEditSettings={handleEnterConfigure}
              isResizing={isResizing}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );

  const renderHistoryDrawer = () => (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-72 max-w-full transform transition-transform duration-300 ${
        isHistoryDrawerOpen ? "translate-x-0" : "-translate-x-[110%]"
      }`}
    >
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        aria-hidden
        onClick={() => setHistoryDrawerOpen(false)}
      />
      <div className="relative h-full w-full" ref={historyDrawerContentRef}>
        <div className="h-full p-3">
          <Sidebar isOpen={true} />
        </div>
        <button
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/90 text-slate-200 ring-1 ring-white/10 shadow-lg transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-neon-400/60"
          onClick={() => setHistoryDrawerOpen(false)}
          aria-label="Close history"
        >
          <span className="sr-only">Close history</span>
          <ClearIcon />
        </button>
      </div>
    </div>
  );

  const renderHistoryToggle = () => (
    <button
      ref={historyToggleRef}
      data-history-toggle
      className="fixed left-4 bottom-6 z-30 flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-sm text-slate-200 ring-1 ring-white/10 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-neon-400/60"
      onClick={() => setHistoryDrawerOpen((prev) => !prev)}
    >
      <span className="h-2 w-2 rounded-full bg-neon-400 animate-pulse"></span>
      History
    </button>
  );

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-200">
      <Header
        onToggleSidebar={
          builderMode === "configure"
            ? () => setSidebarOpen((prev) => !prev)
            : undefined
        }
      />

      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 mt-2 transition-all">
        {builderMode === "configure" ? renderConfigureMode() : renderReviewMode()}
      </div>

      {builderMode === "review" && (
        <>
          {renderHistoryToggle()}
          {renderHistoryDrawer()}
        </>
      )}

      {isSendingChatMessage && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-200/65 text-slate-800 backdrop-blur-sm dark:bg-slate-950/80 dark:text-slate-200">
          <div
            aria-hidden
            className="h-14 w-14 rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: "rgba(64, 204, 255, 0.9)",
              borderTopColor: "transparent",
            }}
          />
          <p className="mt-6 text-lg font-semibold text-neon-400 dark:text-neon-200">
            Sending your message...
          </p>
          <p className="mt-2 max-w-sm text-center text-sm text-slate-600 dark:text-slate-300">
            This may take a moment if the AI has started building your website.
          </p>
        </div>
      )}
    </div>
  );
};

const Builder = () => (
  <ConfigProvider>
    <BuilderCore />
  </ConfigProvider>
);

export default Builder;

