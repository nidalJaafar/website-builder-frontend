"use client";

import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  ReactNode,
} from "react";

interface INotificationContext {
  notify: (message: string) => void;
}

const NotificationContext = createContext<INotificationContext | undefined>(
  undefined
);

export const useNotifier = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifier must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<
    Array<{ id: number; message: string }>
  >([]);

  const notify = useCallback((message: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 2500);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 space-y-2">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="px-4 py-2 rounded-xl bg-slate-800/80 ring-1 ring-white/10 text-sm text-white dark:text-slate-200 shadow-glow dark:bg-slate-900/80 animate-fade-in-out"
          >
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
