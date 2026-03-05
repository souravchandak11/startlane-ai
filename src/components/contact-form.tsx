"use client"

import React, { useState } from 'react';
import { FadeIn } from './ui/fade-in';
import { submitLead } from '@/app/actions/leads';

export function ContactForm() {
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitLead(formData);
    setStatus(result);
    setLoading(false);
    if (result.success) {
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <section id="contact" className="section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <FadeIn className="mb-10">
            <p className="font-mono-label text-[var(--text-m)] mb-4">CONTACT</p>
            <h2 className="text-5xl mb-2 text-[var(--text-p)]">Tell us what's broken.</h2>
            <h3 className="text-4xl text-[var(--text-s)] font-headline">We'll tell you how to fix it.</h3>
          </FadeIn>
          
          <FadeIn>
            <p className="text-lg text-[var(--text-s)] mb-12">
              Free 30-minute marketing audit. No pitch deck. Just diagnosis.
            </p>
            
            <div className="space-y-4 font-mono-label text-[10px] text-[var(--text-m)]">
              <p className="hover:text-[var(--text-s)] transition-colors cursor-pointer">souravchandak0001@gmail.com</p>
              <p className="hover:text-[var(--text-s)] transition-colors cursor-pointer">+91 93061 57025</p>
              <p className="hover:text-[var(--text-s)] transition-colors cursor-pointer">linkedin.com/in/sourav-chandak</p>
            </div>
          </FadeIn>
        </div>
        
        <FadeIn className="glass-card p-10 rounded-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="font-mono-label text-[10px] text-[var(--text-m)] mb-2 block">Full Name *</label>
                <input required name="name" type="text" className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md px-4 py-3 text-sm text-[var(--text-p)] focus:outline-none focus:border-[var(--accent-cool)] transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="font-mono-label text-[10px] text-[var(--text-m)] mb-2 block">Business Name *</label>
                <input required name="business" type="text" className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md px-4 py-3 text-sm text-[var(--text-p)] focus:outline-none focus:border-[var(--accent-cool)] transition-colors" placeholder="Company Inc." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono-label text-[10px] text-[var(--text-m)] mb-2 block">Email *</label>
                  <input required name="email" type="email" className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md px-4 py-3 text-sm text-[var(--text-p)] focus:outline-none focus:border-[var(--accent-cool)] transition-colors" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="font-mono-label text-[10px] text-[var(--text-m)] mb-2 block">Phone (Optional)</label>
                  <input name="phone" type="tel" className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md px-4 py-3 text-sm text-[var(--text-p)] focus:outline-none focus:border-[var(--accent-cool)] transition-colors" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div>
                <label className="font-mono-label text-[10px] text-[var(--text-m)] mb-2 block">Biggest marketing problem right now?</label>
                <select required name="problem" className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md px-4 py-3 text-sm text-[var(--text-p)] focus:outline-none focus:border-[var(--accent-cool)] transition-colors appearance-none">
                  <option value="Paid ads not converting">Paid ads not converting</option>
                  <option value="No email automation system">No email automation system</option>
                  <option value="Inconsistent across locations">Inconsistent across locations</option>
                  <option value="Don't know what's working">Don't know what's working</option>
                  <option value="Something else">Something else</option>
                </select>
              </div>
              <div>
                <label className="font-mono-label text-[10px] text-[var(--text-m)] mb-2 block">Tell us more (optional)</label>
                <textarea name="more" rows={4} className="w-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-md px-4 py-3 text-sm text-[var(--text-p)] focus:outline-none focus:border-[var(--accent-cool)] transition-colors resize-none" placeholder="Describe your challenge..."></textarea>
              </div>
            </div>
            
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[var(--accent-cool)] text-[#080810] font-headline py-4 rounded-md font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Request Free Audit →'}
            </button>

            {status && (
              <div className={cn(
                "p-4 rounded-md text-sm font-medium animate-in fade-in slide-in-from-top-2",
                status.success ? "text-green-400 border border-green-400/20 bg-green-400/5" : "text-red-400 border border-red-400/20 bg-red-400/5"
              )}>
                {status.message}
              </div>
            )}
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
