import React from 'react';
import { FadeIn } from './ui/fade-in';

const frameworks = [
  {
    label: 'PAID MEDIA',
    title: 'Framework 01',
    features: [
      { name: 'Campaign Architecture', desc: 'Full-funnel Meta & Google with real targeting and budget control.' },
      { name: 'A/B Testing', desc: 'Continuous creative and audience testing to lower CPL over time.' },
      { name: 'Weekly Reporting', desc: 'Plain-English performance reports every Monday. No vanity metrics.' }
    ]
  },
  {
    label: 'EMAIL AUTOMATION',
    title: 'Framework 02',
    features: [
      { name: 'Nurture Sequences', desc: 'Onboarding, retention, and re-engagement flows built to convert.' },
      { name: 'Smart Segmentation', desc: 'Personalized by location, intent, and enrollment stage.' },
      { name: 'Performance Tracking', desc: 'Open rates, clicks, and revenue attribution in one dashboard.' }
    ]
  },
  {
    label: 'LOCAL MARKETING',
    title: 'Framework 03',
    features: [
      { name: 'GBP Management', desc: 'Google Business Profiles optimized across all locations.' },
      { name: 'Hyperlocal Targeting', desc: 'Ads served by zip code and neighborhood for precision.' },
      { name: 'Community Outreach', desc: 'School partnerships, referral programs, local event strategy.' }
    ]
  },
  {
    label: 'AI WORKFLOWS',
    title: 'Framework 04',
    features: [
      { name: 'Lead Qualification', desc: 'Every inquiry gets a response within 60 seconds. 24/7.' },
      { name: 'Smart Routing', desc: 'High-intent to call. Others into nurture. Nothing leaks.' },
      { name: 'Full Automation', desc: 'Systems that run and report themselves. No manual ops.' }
    ]
  }
];

export function Frameworks() {
  return (
    <section id="frameworks" className="section-container">
      <FadeIn className="mb-16">
        <p className="font-mono-label text-[var(--text-m)] mb-4">FRAMEWORKS</p>
        <h2 className="text-4xl mb-2 text-[var(--text-p)]">Four systems.</h2>
        <h3 className="text-3xl text-[var(--text-s)] font-headline">One marketing operation.</h3>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {frameworks.map((fw) => (
          <FadeIn key={fw.label} className="glass-card p-8 rounded-xl flex flex-col">
            <span className="font-mono-label text-[10px] text-[var(--text-m)] mb-6">{fw.label}</span>
            <h4 className="text-xl mb-8 font-headline text-[var(--text-p)]">{fw.label}</h4>
            
            <div className="space-y-6">
              {fw.features.map((f, i) => (
                <div key={i} className="pb-4 border-b border-[var(--border-subtle)] last:border-0 last:pb-0">
                  <p className="text-[11px] font-bold text-[var(--text-p)] mb-1 uppercase tracking-tight">{f.name}</p>
                  <p className="text-[11px] text-[var(--text-s)]">{f.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
