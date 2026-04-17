import React from 'react';
import { FadeIn } from './ui/fade-in';

const benefits = [
  { title: 'Increased Efficiency', desc: 'Streamline repetitive tasks. Save hours daily.' },
  { title: 'Smarter Decisions', desc: 'Real-time insights. Data-backed choices.' },
  { title: 'Seamless Integration', desc: 'CRM to campaigns. Every system connected.' },
  { title: 'Consistent Communication', desc: 'Fast, accurate, always on-brand.' },
  { title: 'Scalable Growth', desc: 'Systems that evolve as your business grows.' },
  { title: 'Cost Reduction', desc: 'Eliminate manual labor that drains time and budget.' }
];

export function Benefits() {
  return (
    <section className="section-container">
      <FadeIn className="mb-16">
        <p className="font-mono-label text-[var(--text-m)] mb-4">WHY STARTLANE AI</p>
        <h2 className="text-4xl mb-2 text-[var(--text-p)]">Every benefit.</h2>
        <h3 className="text-3xl text-[var(--text-s)] font-headline">Backed by design.</h3>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-12">
        {benefits.map((b) => (
          <FadeIn key={b.title} className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[var(--text-m)]"></span>
              <h4 className="text-[12px] font-headline text-[var(--text-p)] uppercase tracking-wide">
                {b.title}
              </h4>
            </div>
            <p className="text-[11px] text-[var(--text-s)] pl-3 leading-relaxed">
              {b.desc}
            </p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
