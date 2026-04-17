"use client"

import React, { useState, useEffect } from 'react';
import { FadeIn } from './ui/fade-in';
import { submitLeadToFirestore } from '@/lib/leads';
import { cn } from '@/lib/utils';

const PROBLEMS = [
  'Need help with digital strategy',
  'Social media isn\'t growing',
  'Inconsistent across locations',
  "Don't know what's working",
  'Something else',
] as const;

export function ContactForm() {
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await submitLeadToFirestore({
        name: formData.get('name') as string,
        business: formData.get('business') as string,
        email: formData.get('email') as string,
        phone: (formData.get('phone') as string) || undefined,
        biggestProblem: formData.get('problem') as string,
        tellUsMore: (formData.get('more') as string) || undefined,
      });

      setStatus({ success: true, message: '✓ Received. Sourav will be in touch within 24 hours.' });
      form.reset();
    } catch (err) {
      console.error('Lead submission error:', err);
      setStatus({ success: false, message: 'Failed to submit. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <section id="contact" className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <div className="mb-10">
              <p className="font-mono-label text-[var(--text-m)] mb-4">CONTACT</p>
              <h2 className="text-5xl mb-2 text-[var(--text-p)]">Tell us your goals.</h2>
              <h3 className="text-4xl text-[var(--text-s)] font-headline">We'll map the strategy.</h3>
            </div>
            <p className="text-lg text-[var(--text-s)] mb-12">
              Free 30-minute strategy consultation. No pitch deck. Just clarity.
            </p>
          </div>
          <div className="glass-card p-10 rounded-2xl opacity-50">
            <p className="text-center font-mono-label text-[10px]">Loading form...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <FadeIn className="mb-10">
            <p className="font-mono-label text-[var(--text-m)] mb-4">CONTACT</p>
            <h2 className="text-5xl mb-2 text-[var(--text-p)]">Tell us your goals.</h2>
            <h3 className="text-4xl text-[var(--text-s)] font-headline">We'll map the strategy.</h3>
          </FadeIn>

          <FadeIn>
            <p className="text-lg text-[var(--text-s)] mb-12">
              Free 30-minute strategy consultation. No pitch deck. Just clarity.
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
                  {PROBLEMS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
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
              {loading ? 'Submitting...' : 'Request Free Consultation →'}
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
