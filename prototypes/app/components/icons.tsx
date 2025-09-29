
import React from "react";

export const MenuIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M4 7h16M4 12h16M4 17h16"></path>
  </svg>
);

export const AstraSiteLogo = () => (
  <svg
    className="h-6 w-6"
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="astroWeb" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#40CCFF"></stop>
        <stop offset="100%" stopColor="#0A93C2"></stop>
      </linearGradient>
    </defs>
    <circle
      cx="32"
      cy="32"
      fill="none"
      r="28"
      stroke="url(#astroWeb)"
      strokeWidth="3"
    ></circle>
    <path
      d="M32 4a44 44 0 0 1 0 56M32 4a44 44 0 0 0 0 56"
      fill="none"
      stroke="url(#astroWeb)"
      strokeWidth="2"
    ></path>
    <path
      d="M4 32h56M8 20h48M8 44h48"
      fill="none"
      stroke="url(#astroWeb)"
      strokeWidth="2"
    ></path>
    <path
      className="dark:fill-white fill-[#1E293B]"
      d="M32 10 L38 28 L54 32 L38 36 L32 54 L26 36 L10 32 L26 28 Z"
      stroke="url(#astroWeb)"
      strokeWidth="1"
    ></path>
    <path
      className="dark:fill-white fill-[#1E293B]"
      d="M20 16 L22 22 L28 24 L22 26 L20 32 L18 26 L12 24 L18 22 Z"
      stroke="url(#astroWeb)"
      strokeWidth="0.8"
    ></path>
    <path
      className="dark:fill-white fill-[#1E293B]"
      d="M44 40 L46 44 L50 46 L46 48 L44 52 L42 48 L38 46 L42 44 Z"
      stroke="url(#astroWeb)"
      strokeWidth="0.8"
    ></path>
  </svg>
);

export const ChevronDown = () => (
  <svg
    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400 pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      d="M6 9l6 6 6-6"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

export const ThemeIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M12 3v1m0 16v1m8.66-15.66l-.7.7M4.04 19.96l-.7.7M21 12h-1M4 12H3m15.66 8.66l-.7-.7M4.04 4.04l-.7-.7"></path>
    <circle cx="12" cy="12" r="5"></circle>
  </svg>
);

export const SignInIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"></path>
  </svg>
);

export const ClearIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M6 18L18 6M6 6l12 12"></path>
  </svg>
);

export const SettingsIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 010 2l-.15.08a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.38a2 2 0 00-.73-2.73l-.15-.08a2 2 0 010-2l.15-.08a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export const CopyIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
  </svg>
);

export const DownloadIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
  </svg>
);

export const DeployIcon = () => (
  <svg
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
  </svg>
);
