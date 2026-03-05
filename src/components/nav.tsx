"use client"

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 border-b",
      scrolled 
        ? "bg-[#080810]/90 backdrop-blur-xl border-white/10" 
        : "bg-transparent border-transparent"
    )}>
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="text-[var(--text-p)] font-headline text-xl font-bold">
          StartLane AI
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-mono-label text-xs">
          <a href="#frameworks" className="text-[var(--text-s)] hover:text-[var(--text-p)] transition-colors">Frameworks</a>
          <a href="#process" className="text-[var(--text-s)] hover:text-[var(--text-p)] transition-colors">Process</a>
          <a href="#results" className="text-[var(--text-s)] hover:text-[var(--text-p)] transition-colors">Results</a>
          <a href="#contact" className="text-[var(--text-s)] hover:text-[var(--text-p)] transition-colors">Contact</a>
        </div>
        
        <div>
          <a href="#contact" className="btn-primary py-2 px-5 text-xs font-headline">
            Book Free Audit
          </a>
        </div>
      </div>
    </nav>
  );
}
