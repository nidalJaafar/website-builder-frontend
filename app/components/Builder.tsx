'use client';

import React, {useState} from 'react';
import {ConfigProvider} from '../context/ConfigContext';

import {Header} from './builder/Header';
import {Sidebar} from './builder/Sidebar';
import {Hero} from './builder/Hero';
import {EssentialsForm} from './builder/EssentialsForm';
import {CoreOptionsForm} from './builder/CoreOptionsForm';
import {AdvancedOptionsForm} from './builder/AdvancedOptionsForm';
import {PromptEditor} from './builder/PromptEditor';
import {Preview} from './builder/Preview';
import {Footer} from './builder/Footer';

const BuilderCore = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950/5 dark:text-slate-200">
      <Header onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
      
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 mt-2">
        <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-[18rem_1fr] gap-4">
            <Sidebar isOpen={isSidebarOpen} />

            <main className="space-y-6">
              <Hero />
              <EssentialsForm />

              <section className="relative overflow-hidden" id="builder-layout">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-6" id="left-stack">
                    <section className="relative overflow-hidden" id="builder">
                      <div className="rounded-2xl bg-slate-900/60 ring-1 ring-white/10 backdrop-blur p-4 sm:p-6 dark:bg-slate-900/60 mb-0">
                        <div className="grid gap-6 grid-cols-1">
                          <CoreOptionsForm />
                          <AdvancedOptionsForm />
                        </div>
                      </div>
                    </section>
                  </div>
                  <div className="space-y-6" id="right-preview">
                    <PromptEditor />
                    <Preview />
                  </div>
                </div>
              </section>

              <Footer />
            </main>
          </div>
        </div>
      </div>
     </div>
  );
};

const Builder = () => (
  <ConfigProvider>
    <BuilderCore />
  </ConfigProvider>
);

export default Builder;