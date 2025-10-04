import Link from "next/link";
import { Header } from "./components/builder/Header";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900 dark:text-slate-200">
      <Header />
      <main className="relative z-0">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center gap-8">
          <span className="px-3 py-1 text-xs font-medium uppercase tracking-widest text-neon-200 bg-neon-500/10 ring-1 ring-neon-500/30 rounded-full">
            AstraSite AI
          </span>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight">
            Ship beautiful web experiences with AI-assisted building blocks
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-slate-500 dark:text-slate-400">
            Configure layouts, compose prompts, and preview entire marketing sites in minutes. Start in
            the builder or sign in to sync progress across sessions, no install required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/builder"
              className="px-6 py-3 rounded-xl launch-builder-btn text-neon-100 ring-1 ring-neon-400/30 hover:bg-neon-500/30 shadow-glow transition"
            >
              Launch the builder
            </Link>
            <Link
              href="/auth"
              className="px-6 py-3 rounded-xl bg-slate-900/60 text-slate-200 ring-1 ring-white/10 hover:bg-slate-900/80 transition"
            >
              Sign in
            </Link>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Guided controls",
              body: "Pick hero styles, navigation patterns, and conversion modules without touching code.",
            },
            {
              title: "Real-time preview",
              body: "See updates instantly thanks to a live AI prompt and layout preview side by side.",
            },
            {
              title: "Export ready",
              body: "Generate shareable summaries or handoff documentation for your product team in seconds.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 p-5 text-left"
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{card.body}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

