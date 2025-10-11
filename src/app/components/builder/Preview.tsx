"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConfig } from '../../context/ConfigContext';
import { useNotifier } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

type DeviceView = 'desktop' | 'mobile';

type PreviewProps = {
  device?: DeviceView;
  onDeviceChange?: (device: DeviceView) => void;
  isReviewMode?: boolean;
  onEditSettings?: () => void;
  isResizing?: boolean;
};

export const Preview: React.FC<PreviewProps> = ({
  device = 'desktop',
  onDeviceChange,
  isReviewMode = false,
  onEditSettings,
  isResizing = false,
}) => {
  const {
    generateSite,
    sitePreviewHtml,
    buildStatus,
    buildStatusMessage,
    downloadSiteZip,
    isDownloadingZip,
  } = useConfig();
  const { notify } = useNotifier();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [iframeKey, setIframeKey] = useState(0);

  const handleDeviceChange = (next: DeviceView) => {
    onDeviceChange?.(next);
  };

  useEffect(() => {
    if (sitePreviewHtml) {
      setIframeKey((prev) => prev + 1);
    }
  }, [sitePreviewHtml]);

  const handleGenerateSite = () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    void generateSite();
  };

  const frameClassName =
    device === 'mobile'
      ? 'aspect-[9/16] max-w-[22rem] mx-auto'
      : 'aspect-[16/10]';
  const canDownloadZip = Boolean(sitePreviewHtml && buildStatus === 'completed');
  const downloadButtonDisabled = !canDownloadZip || isDownloadingZip;

  const handleDownloadZip = () => {
    if (!downloadButtonDisabled) {
      void downloadSiteZip();
    } else if (!sitePreviewHtml) {
      notify('Generate the website before downloading.');
    } else if (buildStatus !== 'completed') {
      notify('Wait for the build to finish before downloading.');
    }
  };

  return (
    <div className={`relative ${isResizing ? 'select-none' : ''}`} id="preview">
      <div className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-800/70 ring-1 ring-white/10 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-neon-400 animate-pulse"></span>
              {isReviewMode ? 'Review & Iterate' : 'Configure' }
            </span>
            <span className="hidden sm:inline">Previewing generated layout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full bg-slate-800/60 ring-1 ring-white/10 p-1">
              {(['desktop', 'mobile'] as const).map((view) => (
                <button
                  key={view}
                  type="button"
                  className={`px-3 py-1.5 text-xs rounded-full transition ${
                    device === view
                      ? 'bg-neon-500/20 text-neon-100'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                  onClick={() => handleDeviceChange(view)}
                >
                  {view === 'desktop' ? 'Desktop' : 'Mobile'}
                </button>
              ))}
            </div>
            {isReviewMode && onEditSettings && (
              <button
                className="px-3 py-1.5 rounded-lg bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-800 text-xs"
                onClick={onEditSettings}
              >
                Edit settings
              </button>
            )}
          </div>
        </div>

        <div
          className={`${frameClassName} rounded-xl bg-white ring-1 ring-slate-300 overflow-hidden dark:bg-slate-900 dark:ring-white/10 transition-all`}
        >
          {sitePreviewHtml ? (
            <iframe
              key={iframeKey}
              srcDoc={sitePreviewHtml}
              className="h-full w-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="Website preview"
            />
          ) : (
            <div className="h-full w-full grid place-items-center">
            <div className="text-center px-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-200 ring-1 ring-slate-300 px-3 py-1 text-xs text-slate-600 mb-4 dark:bg-slate-800/80 dark:ring-white/10 dark:text-slate-300">
                <span className="h-2 w-2 rounded-full animate-pulse"></span>
                AI Preview
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 dark:text-white">
                Your generated site will appear here
              </h3>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {isReviewMode
                  ? 'Review changes, then regenerate after updating the prompt or chat requests.'
                  : 'For now: Hello, World! Generate whenever you are ready.'}
              </p>
              {buildStatus !== 'idle' && (
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
                  {buildStatusMessage}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`px-3 py-2 rounded-lg bg-neon-500/20 text-neon-100 ring-1 ring-neon-400/30 shadow-glow transition ${
              isAuthenticated ? 'hover:bg-neon-500/30' : 'opacity-70'
            }`}
            onClick={handleGenerateSite}
          >
            {isReviewMode ? 'Regenerate Website' : 'Generate Website'}
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-slate-200 ring-1 ring-slate-300 hover:bg-slate-300 text-slate-800 dark:bg-slate-800/80 dark:ring-white/10 dark:hover:bg-slate-800 dark:text-white"
            onClick={() => notify('Copy Code coming soon')}
          >
            Copy Code
          </button>
          <button
            type="button"
            className={`px-3 py-2 rounded-lg bg-slate-200 ring-1 ring-slate-300 text-slate-800 dark:bg-slate-800/80 dark:ring-white/10 dark:text-white transition ${
              downloadButtonDisabled
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:bg-slate-300 dark:hover:bg-slate-800'
            }`}
            onClick={handleDownloadZip}
            disabled={downloadButtonDisabled}
          >
            {isDownloadingZip ? 'Preparing ZIP…' : 'Download ZIP'}
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-slate-200 ring-1 ring-slate-300 hover:bg-slate-300 text-slate-800 dark:bg-slate-800/80 dark:ring-white/10 dark:hover:bg-slate-800 dark:text-white"
            onClick={() => notify('Deploy coming soon')}
          >
            Deploy
          </button>
        </div>
      </div>
    </div>
  );
};
