"use client";

import React from "react";
import { useTheme } from "@/app/context/ThemeContext";
import { AstraSiteLogo } from "../icons";

export const Header: React.FC<{ onToggleSidebar: () => void }> = ({
  onToggleSidebar,
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 bg-slate-900/60 border-b border-white/10">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <button
            aria-label="Toggle history"
            className="md:hidden px-3 py-1.5 rounded-xl bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-800"
            onClick={onToggleSidebar}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M4 7h16M4 12h16M4 17h16"></path>
            </svg>
          </button>

          <a className="flex items-center gap-2" href="#">
            <AstraSiteLogo />
            <span className="font-semibold tracking-tight">
              AstraSite <span className="text-neon-400">AI</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1.5 rounded-xl bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-800 transition"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button className="px-3 py-1.5 rounded-xl bg-neon-500/20 text-neon-200 ring-1 ring-neon-400/30 hover:bg-neon-500/30 shadow-glow transition">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
