
"use client"

import React, { useEffect, useState, useRef } from 'react';
import { FadeIn } from './ui/fade-in';
import CountUp from 'react-countup';

const stats = [
  { val: 67, suffix: '%', label: 'Enrollment Lift' },
  { val: 320, suffix: '%', label: 'Organic Visibility', dec: 0 },
  { val: 60, suffix: 's', label: 'Inquiry Response Time' },
  { val: 15, suffix: 'hrs', label: 'Time Saved Weekly' }
];

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
          "StartLane didn't just consult — they built the system our entire marketing runs on.
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
              <CountUp start={0} end={stat.val} duration={2.5} decimals={stat.dec || 0} suffix={stat.suffix} enableScrollSpy scrollSpyOnce />
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
