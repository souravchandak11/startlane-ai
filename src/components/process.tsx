import React from 'react';
import { FadeIn } from './ui/fade-in';

const steps = [
  {
    num: '01',
    title: 'ANALYZE',
    desc: 'We audit your digital presence, identify gaps, and uncover opportunities for strategic growth and workflow optimization.'
  },
  {
    num: '02',
    title: 'BUILD',
    desc: 'We design and implement your full system — digital strategy, content calendars, streamlined workflows, and analytics dashboards.'
  },
  {
    num: '03',
    title: 'OPTIMIZE',
    desc: 'We monitor, refine, and continuously improve based on real performance data. Weekly reports. Monthly strategy reviews.'
  }
];

export function Process() {
  return (
    <section id="process" className="section-container overflow-hidden">
      <FadeIn className="mb-16">
        <p className="font-mono-label text-[var(--text-m)] mb-4">PROCESS</p>
        <h2 className="text-4xl mb-2 text-[var(--text-p)]">The blueprint.</h2>
        <h3 className="text-3xl text-[var(--text-s)] font-headline">Behind every system.</h3>
      </FadeIn>
      
      <div className="relative flex flex-col md:flex-row gap-8 items-stretch">
        {/* Connection Line */}
        <div className="hidden md:block absolute top-1/2 left-12 right-12 h-px border-t border-dashed border-[var(--border-subtle)] -translate-y-1/2 z-0"></div>
        
        {steps.map((step, i) => (
          <FadeIn key={step.num} className="relative z-10 flex-1 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-10 rounded-xl overflow-hidden group">
            <span className="absolute -top-4 -right-2 text-[100px] leading-none font-headline font-bold text-white/[0.04] select-none group-hover:text-white/[0.08] transition-colors">
              {step.num}
            </span>
            <h4 className="text-lg mb-4 text-[var(--text-p)] font-headline">{step.title}</h4>
            <p className="text-sm text-[var(--text-s)] leading-relaxed">{step.desc}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
