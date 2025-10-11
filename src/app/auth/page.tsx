"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Header } from "../components/builder/Header";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const router = useRouter();
  const { signIn, isAuthenticating, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/builder");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const result = await signIn(email, password);
    if (result.success) {
      router.replace("/builder");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-200">
      <Header />
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 mt-2">
        <div className="max-w-md mx-auto px-2 sm:px-4 lg:px-6 py-10">
          <div className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur-sm p-6 sm:p-8 shadow-xl dark:bg-slate-900/60">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold">Sign in</h1>
              <p className="text-sm text-slate-400">
                Continue crafting experiences with AstraSite AI.
              </p>
            </div>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-sm text-slate-300">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-xl bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neon-400/60"
                />
              </label>
              <label className="block">
                <span className="text-sm text-slate-300">Password</span>
                <input
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="mt-1 w-full rounded-xl bg-slate-800/70 ring-1 ring-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neon-400/60"
                />
              </label>
              {error && (
                <p className="text-sm text-red-400" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isAuthenticating}
                className={`w-full rounded-xl bg-neon-500/20 text-neon-200 ring-1 ring-neon-400/30 px-4 py-2 text-sm font-medium transition shadow-glow ${
                  isAuthenticating
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-neon-500/30"
                }`}
              >
                {isAuthenticating ? "Signing in..." : "Sign In"}
              </button>
            </form>
            <div className="mt-6 text-center text-xs text-slate-500">
              <p>
                Just exploring?{" "}
                <Link
                  href="/builder"
                  className="text-neon-200 hover:text-neon-100 transition underline-offset-4 hover:underline"
                >
                  Head back to the builder
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
