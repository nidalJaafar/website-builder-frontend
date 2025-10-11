"use client";

import React from "react";

type NotificationsProps = {
  notifications: string[];
};

export const Notifications = ({ notifications }: NotificationsProps) => (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 space-y-2">
    {notifications.map((msg) => (
      <div
        key={msg}
        className="px-4 py-2 rounded-xl bg-slate-800/80 ring-1 ring-white/10 text-sm text-white shadow-glow dark:bg-slate-900/80"
      >
        {msg}
      </div>
    ))}
  </div>
);