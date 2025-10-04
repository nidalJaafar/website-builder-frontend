"use client";

import React from "react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <section className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-900/60 ring-1 ring-white/10 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Step 1</p>
          <h4 className="font-semibold">Options</h4>
          <p className="text-sm text-slate-400">
            Pick core visual choices; open Advanced if needed.
          </p>
        </div>
        <div className="rounded-xl bg-slate-900/60 ring-1 ring-white/10 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Step 2</p>
          <h4 className="font-semibold">Prompt</h4>
          <p className="text-sm text-slate-400">
            Generate and edit the text prompt.
          </p>
        </div>
        <div className="rounded-xl bg-slate-900/60 ring-1 ring-white/10 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Step 3</p>
          <h4 className="font-semibold">Preview</h4>
          <p className="text-sm text-slate-400">
            Generate a preview, switch to Review mode, and iterate with chat.
          </p>
        </div>
      </section>
      <footer className="mt-6 border-t border-white/10 py-8" id="help">
        <div className="grid sm:grid-cols-3 gap-6 text-sm text-slate-400">
          <div>
            <p className="font-semibold">About</p>
            <p className="mt-2">
              AI-themed demo UI built with Tailwind. Backend wiring coming next.
            </p>
          </div>
          <div>
            <p className="font-semibold">Shortcuts</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Cmd/Ctrl + Enter - Generate Prompt</li>
              <li>Cmd/Ctrl + Shift + G - Generate/Regenerate Website</li>
              <li>Cmd/Ctrl + B - Toggle Advanced Options</li>
              <li>Cmd/Ctrl + E - Return to Configure Mode</li>
              <li>Cmd/Ctrl + Shift + H - Toggle History Drawer (Review)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Status</p>
            <p className="mt-2">Alpha UI - v0.3.0</p>
          </div>
        </div>
        <p className="mt-8 text-xs text-slate-500">
          {"\u00A9"} {currentYear} AstraSite AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
