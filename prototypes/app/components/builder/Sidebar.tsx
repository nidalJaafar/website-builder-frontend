"use client";

import React from "react";
import { useConfig } from "@/app/context/ConfigContext";

export const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { history, loadFromHistory, clearHistory } = useConfig();

  return (
    <aside
      className={`md:sticky md:top-16 md:h-[calc(100vh-5rem)] md:block ${
        isOpen ? "" : "hidden"
      } md:!block`}
      id="sidebar"
    >
      <div className="h-full rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur p-3 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <button
            className="w-full px-3 py-2 rounded-xl bg-neon-500/20 text-neon-100 ring-1 ring-neon-400/40 hover:bg-neon-500/30 shadow-glow"
            onClick={() => window.location.reload()}
          >
            New project
          </button>
          <button
            className="px-3 py-2 rounded-xl bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-800"
            onClick={clearHistory}
            title="Clear history"
          >
            Clear
          </button>
        </div>

        <div className="mb-2">
          <input
            className="w-full rounded-lg bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 text-sm placeholder-slate-400"
            placeholder="Search history..."
            onChange={(e) => {
              const q = e.target.value.toLowerCase();
              document.querySelectorAll("#history-list button").forEach((b) => {
                const text = (b.textContent || "").toLowerCase();
                (b as HTMLElement).style.display = text.includes(q)
                  ? ""
                  : "none";
              });
            }}
          />
        </div>

        <div className="text-xs text-slate-400 px-1 mb-1">History</div>
        <nav className="flex-1 overflow-auto space-y-1 pr-1" id="history-list">
          {history.map((item) => (
            <button
              key={item.time}
              className="w-full text-left rounded-lg bg-slate-800/60 ring-1 ring-white/10 hover:bg-slate-800 p-3"
              onClick={() => loadFromHistory(item)}
            >
              <div className="text-sm font-medium">{item.title}</div>
              <div className="text-xs text-slate-400 line-clamp-2">
                {(item.prompt || "No prompt").slice(0, 200)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {new Date(item.time).toLocaleString()}
              </div>
            </button>
          ))}
        </nav>

        <div className="pt-3 border-t border-white/10 mt-3">
          <button className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/60 ring-1 ring-white/10 hover:bg-slate-800 text-sm">
            Settings
          </button>
        </div>
      </div>
    </aside>
  );
};
