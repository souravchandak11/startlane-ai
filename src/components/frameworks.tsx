import React from 'react';
import { FadeIn } from './ui/fade-in';

const frameworks = [
  {
    label: 'DIGITAL STRATEGY & CONSULTING',
    title: 'Framework 01',
    features: [
      { name: 'Marketing Audit', desc: 'Comprehensive review of your current digital presence, competitive positioning, and growth opportunities.' },
      { name: 'Strategic Roadmap', desc: 'Clear, actionable plans tailored to your goals — with milestones and success metrics.' },
      { name: 'Weekly Reporting', desc: 'Plain-English performance reports every Monday. No vanity metrics.' }
    ]
  },
  {
    label: 'SOCIAL MEDIA & CONTENT',
    title: 'Framework 02',
    features: [
      { name: 'Content Creation', desc: 'High-quality social media posts, graphics, and copy crafted for your brand.' },
      { name: 'Channel Management', desc: 'Consistent publishing, community engagement, and audience building across platforms.' },
      { name: 'Performance Tracking', desc: 'Engagement, reach, and growth metrics in one clear dashboard.' }
    ]
  },
  {
    label: 'LOCAL PRESENCE',
    title: 'Framework 03',
    features: [
      { name: 'GBP Management', desc: 'Google Business Profiles optimized across all locations.' },
      { name: 'Local SEO', desc: 'Content and listing optimization to help customers find you in local search.' },
      { name: 'Community Outreach', desc: 'Partnerships, referral programs, and local event strategy.' }
    ]
  },
  {
    label: 'AI-POWERED TOOLS',
    title: 'Framework 04',
    features: [
      { name: 'Inquiry Handling', desc: 'Every customer inquiry gets a response within 60 seconds. 24/7.' },
      { name: 'Smart Routing', desc: 'Priority inquiries get fast-tracked. Others enter appropriate follow-up flows.' },
      { name: 'Streamlined Operations', desc: 'Systems that run and report themselves. No manual ops.' }
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
