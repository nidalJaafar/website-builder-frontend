"use client";

import React from "react";

export const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur p-6 dark:bg-slate-900/60">
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
        Hello, World. <span className="text-neon-300">Let's build</span> your
        next website with AI.
      </h1>
      <p className="mt-2 text-slate-300 max-w-2xl">
        Choose a few options (or none), generate a prompt you can edit, then
        create your site preview. Advanced developer settings are tucked away.
      </p>
    </div>
  </section>
);
