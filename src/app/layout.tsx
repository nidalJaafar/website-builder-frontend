import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Website Builder",
  description: "Use AI to assemble a website layout in minutes.",
  icons: {
    icon: [
      { url: "/favicon.svg"},
    ],
    shortcut: "/favicon.svg",
    apple: [
      "/favicon.svg",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full dark:bg-slate-950 text-slate-900 dark:text-slate-200`}
      >
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
              <div className="fixed inset-0 -z-10 bg-space">
                <div className="absolute inset-0 bg-gradient-to-br from-white/55 via-white/35 to-white/55 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-900/90" />
                <div className="absolute inset-0 bg-grid bg-[length:22px_22px] opacity-25 dark:opacity-100" />
                <div
                  className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-10 dark:opacity-20"
                  style={{
                    background:
                      "radial-gradient(circle at center, #40ccff55, #00000000 60%)",
                  }}
                />
                <div
                  className="absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-10 dark:opacity-20"
                  style={{
                    background:
                      "radial-gradient(circle at center, #7c3aed55, #00000000 60%)",
                  }}
                />
              </div>
              {children}
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
