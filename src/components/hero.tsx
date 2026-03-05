"use client"

import React from 'react';
import { FadeIn } from './ui/fade-in';

export function Hero() {
  return (
    <section className="section-container pt-40 md:pt-48 pb-20">
      <FadeIn className="text-center max-w-4xl mx-auto staggered-fade-in" stagger>
        <p className="font-mono-label text-[var(--text-m)] mb-6">
          AI MARKETING SYSTEMS — LOCAL BUSINESSES
        </p>
        
        <h1 className="text-5xl md:text-7xl mb-4 leading-[1.1] glow-text">
          Built to automate.
        </h1>
        <h1 className="text-5xl md:text-7xl mb-8 leading-[1.1] opacity-70">
          Designed to perform.
        </h1>
        
        <p className="text-lg text-[var(--text-s)] mb-10 max-w-xl mx-auto">
          We build AI-powered marketing systems for local businesses and service brands — 
          the kind that run without someone manually holding them together every day.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <a href="#contact" className="btn-primary">
            Book Free Audit →
          </a>
          <a href="#frameworks" className="btn-ghost">
            See Frameworks ↓
          </a>
        </div>
      </FadeIn>

      <FadeIn className="max-w-5xl mx-auto overflow-x-auto">
        <div className="min-w-[800px] flex items-center justify-between relative px-4 py-12">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-px pointer-events-none">
            <svg width="100%" height="2" className="overflow-visible">
              <line 
                x1="0" y1="1" x2="100%" y2="1" 
                stroke="white" 
                strokeOpacity="0.15" 
                strokeWidth="1" 
                className="animate-dash"
              />
            </svg>
          </div>
          
          {[
            { label: 'LEADS', active: false },
            { label: 'AI QUALIFY', active: true },
            { label: 'CAMPAIGNS', active: false },
            { label: 'EMAIL', active: false },
            { label: 'REVENUE', active: false },
          ].map((node, i) => (
            <div 
              key={node.label} 
              className={`relative z-10 glass-card px-6 py-4 rounded-lg flex flex-col items-center justify-center min-w-[120px] transition-all duration-1000 ${node.active ? 'shadow-[0_0_20px_rgba(232,232,255,0.1)] ring-1 ring-[var(--accent-cool)]' : ''}`}
            >
              <span className="font-mono-label text-[10px] text-[var(--text-p)]">
                {node.label}
              </span>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
