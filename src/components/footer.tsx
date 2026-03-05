import React from 'react';

export function Footer() {
  return (
    <footer className="bg-[var(--bg-card)] border-t border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="text-[var(--text-p)] font-headline text-lg font-bold">
            StartLane AI
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-mono-label text-[10px]">
            <a href="#frameworks" className="text-[var(--text-s)] hover:text-[var(--text-p)] transition-colors">Frameworks</a>
            <a href="#process" className="text-[var(--text-s)] hover:text-[var(--text-p)] transition-colors">Process</a>
            <a href="#results" className="text-[var(--text-s)] hover:text-[var(--text-p)] transition-colors">Results</a>
            <a href="#contact" className="text-[var(--text-s)] hover:text-[var(--text-p)] transition-colors">Contact</a>
          </div>
          
          <div className="text-[var(--text-m)] font-mono-label text-[9px]">
            © 2026 StartLane AI. All rights reserved.
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-[var(--text-m)] font-mono-label text-[10px] opacity-60">
            Simple systems. Powerful outcomes.
          </p>
        </div>
      </div>
    </footer>
  );
}
