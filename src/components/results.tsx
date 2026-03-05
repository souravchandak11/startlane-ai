"use client"

import React, { useEffect, useState, useRef } from 'react';
import { FadeIn } from './ui/fade-in';

const stats = [
  { val: 67, suffix: '%', label: 'Enrollment Lift' },
  { val: 3.2, suffix: 'x', label: 'Return on Ad Spend', dec: 1 },
  { val: 60, suffix: 's', label: 'Lead Response Time' },
  { val: 41, suffix: '%', label: 'Lower Cost Per Lead' }
];

function Counter({ target, suffix, decimals = 0 }: { target: number, suffix: string, decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        let start = 0;
        const duration = 1500;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
          start += increment;
          if (start >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, 16);
      }
    }, { threshold: 0.5 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return <span ref={ref}>{count.toFixed(decimals)}{suffix}</span>;
}

export function Results() {
  return (
    <section id="results" className="section-container">
      <FadeIn className="mb-16">
        <p className="font-mono-label text-[var(--text-m)] mb-4">RESULTS</p>
        <h2 className="text-4xl mb-2 text-[var(--text-p)]">Proof in motion.</h2>
        <h3 className="text-3xl text-[var(--text-s)] font-headline">Clarity in numbers.</h3>
      </FadeIn>
      
      <FadeIn className="bg-[var(--bg-elevated)] border-l-2 border-white/20 p-10 mb-16 rounded-r-xl">
        <p className="text-xl italic text-[var(--text-p)] mb-6 leading-relaxed">
          "StartLane didn't just run our ads — they built the system our entire marketing runs on. 
          Enrollments up 67% in 90 days."
        </p>
        <p className="font-mono-label text-[10px] text-[var(--text-s)]">
          — Marketing Director, Youth Sports Academy · LA & Orange County
        </p>
      </FadeIn>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <FadeIn key={stat.label} className="glass-card p-8 rounded-xl text-center">
            <p className="text-3xl font-headline text-[var(--text-p)] mb-2">
              <Counter target={stat.val} suffix={stat.suffix} decimals={stat.dec} />
            </p>
            <p className="font-mono-label text-[9px] text-[var(--text-m)]">
              {stat.label}
            </p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
