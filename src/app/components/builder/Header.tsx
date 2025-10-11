"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { useAuth } from "@/app/context/AuthContext";
import { AstraSiteLogo, MoonIcon, SunIcon } from "../icons";

export const Header: React.FC<{ onToggleSidebar?: () => void }> = ({
  onToggleSidebar,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isOnAuthPage = pathname?.startsWith("/auth");
  const nextTheme = theme === "dark" ? "light" : "dark";
  const showSidebarToggle = typeof onToggleSidebar === "function";

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40 bg-slate-900/60 border-b border-white/10">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {showSidebarToggle ? (
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
          ) : (
            <span className="md:hidden px-3 py-1.5" aria-hidden>
              &nbsp;
            </span>
          )}

          <Link className="flex items-center gap-2" href="/">
            <AstraSiteLogo />
            <span className="font-semibold tracking-tight">
              AstraSite <span className="text-neon-400">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={`Switch to ${nextTheme} mode`}
              title={`Switch to ${nextTheme} mode`}
              className="flex items-center justify-center px-3 py-1.5 rounded-xl bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-800 transition"
              onClick={toggleTheme}
            >
              <span className="sr-only">Switch to {nextTheme} mode</span>
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            {!isOnAuthPage && !isAuthenticated && (
              <Link
                href="/auth"
                className="px-3 py-1.5 rounded-xl bg-neon-500/20 text-neon-200 ring-1 ring-neon-400/30 hover:bg-neon-500/30 shadow-glow transition"
              >
                Sign In
              </Link>
            )}
            {isAuthenticated && (
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-slate-800/70 ring-1 ring-white/10 hover:bg-slate-800 transition text-sm"
                onClick={() => {
                  signOut();
                  router.replace("/auth");
                }}
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
