
"use client"

import React, { useState, useEffect } from 'react';
import { FadeIn } from './ui/fade-in';
import { cn } from '@/lib/utils';

const faqs = [
  {
    q: "What businesses do you work with?",
    a: "Local service brands, youth programs, sports academies, fitness businesses, and multi-location operators. If you have real locations, real customers, and real growth targets — we built this for you."
  },
  {
    q: "How long does implementation take?",
    a: "Typically 2–4 weeks for a complete setup. Strategy and analytics go live in week one. Content planning, social media setup, and workflow configuration follow in the weeks after."
  },
  {
    q: "What makes StartLane different?",
    a: "We build systems, not one-off projects. Most agencies hand you a report. We hand you infrastructure — strategy documents, content calendars, analytics dashboards, and efficient workflows that keep running."
  },
  {
    q: "Do I need technical knowledge?",
    a: "None required. We handle everything — strategy, content, and reporting. You get a weekly dashboard and a monthly strategy call."
  },
  {
    q: "What results can I expect?",
    a: "Clients typically see measurable improvement in online visibility, engagement, and customer inquiries within the first 30 days. Full system performance is visible by day 60."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="section-container">
      <FadeIn className="mb-16">
        <p className="font-mono-label text-[var(--text-m)] mb-4">FAQ</p>
        <h2 className="text-4xl mb-2 text-[var(--text-p)]">Everything clear.</h2>
        <h3 className="text-3xl text-[var(--text-s)] font-headline">Before the first call.</h3>
      </FadeIn>
      
      <div className="max-w-3xl border-t border-[var(--border-subtle)]">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-[var(--border-subtle)]">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full py-6 flex items-center justify-between text-left group"
              suppressHydrationWarning
            >
              <span className="text-sm font-headline text-[var(--text-p)] group-hover:text-[var(--accent-cool)] transition-colors">
                {faq.q}
              </span>
              <span className="text-[var(--text-m)] font-mono text-xl">
                {mounted && openIndex === i ? '−' : '+'}
              </span>
            </button>
            <div className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              mounted && openIndex === i ? "max-h-60 pb-8" : "max-h-0"
            )}>
              <p className="text-sm text-[var(--text-s)] leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
