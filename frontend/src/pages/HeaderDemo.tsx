import React from 'react';
import { Header } from '../components/ui/header';
import { DynamicBackground } from '../components/DynamicBackground';
export function HeaderDemo() {
  return (
    <div className="relative min-h-screen bg-[#0a1628]">
      {/* Background */}
      <DynamicBackground />

      {/* Header */}
      <div className="relative z-10">
        <Header />

        {/* Demo Content */}
        <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12">
          <div className="space-y-2 mb-4">
            <div className="bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 h-6 w-4/6 rounded-md" />
            <div className="bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 h-6 w-1/2 rounded-md" />
          </div>
          <div className="flex gap-2 mb-8">
            <div className="bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 h-3 w-14 rounded-md" />
            <div className="bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 h-3 w-12 rounded-md" />
          </div>
          {Array.from({
            length: 7
          }).map((_, i) =>
          <div key={i} className="space-y-2 mb-8">
              <div className="bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 h-4 w-full rounded-md" />
              <div className="bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 h-4 w-full rounded-md" />
              <div className="bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 h-4 w-full rounded-md" />
              <div className="bg-[#1a2942]/40 backdrop-blur-xl border border-cyan-500/20 h-4 w-1/2 rounded-md" />
            </div>
          )}
        </main>
      </div>
    </div>);

}