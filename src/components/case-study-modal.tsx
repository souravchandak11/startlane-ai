"use client"

import React, { useEffect } from 'react';
import { CaseStudy } from '@/lib/case-study-data';

interface CaseStudyModalProps {
  study: CaseStudy;
  onClose: () => void;
}

export function CaseStudyModal({ study, onClose }: CaseStudyModalProps) {
  // Lock body scroll and handle Escape key
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center animate-modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#040408]/95 backdrop-blur-xl" />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto h-full overflow-y-auto animate-modal-content">
        <div className="min-h-full px-6 md:px-12 py-8 pb-24">

          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8 sticky top-0 z-20 py-4 bg-[#040408]/80 backdrop-blur-xl -mx-6 md:-mx-12 px-6 md:px-12 border-b border-[var(--border-subtle)]">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-[var(--text-s)] hover:text-[var(--text-p)] transition-colors group"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="transition-transform group-hover:-translate-x-1">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-mono-label text-[10px]">Back to Case Studies</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-s)] hover:text-[var(--text-p)] hover:border-[var(--border-glow)] transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Header */}
          <div className="mb-10">
            <p className="font-mono-label text-[10px] text-[var(--text-m)] mb-3">
              {study.industry} · {study.timeframe}
            </p>
            <h2 className="text-4xl md:text-5xl font-headline text-[var(--text-p)] mb-4">
              {study.client}
            </h2>
            <p className="text-lg text-[var(--text-s)] leading-relaxed max-w-3xl">
              {study.description}
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative w-full rounded-xl overflow-hidden mb-16 border border-[var(--border-subtle)]">
            <img
              src={study.image}
              alt={`${study.client} performance dashboard`}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#040408]/40 via-transparent to-transparent" />
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
            {study.metrics.map((metric) => (
              <div
                key={metric.label}
                className="glass-card rounded-xl p-6 text-center"
              >
                <p className="text-3xl md:text-4xl font-headline text-[var(--accent-cool)] mb-1">
                  {metric.value}
                </p>
                <p className="font-mono-label text-[9px] text-[var(--text-m)]">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          {/* The Challenge */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 5V8.5M8 11H8.005M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-headline text-[var(--text-p)]">The Challenge</h3>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-8">
              <p className="text-[var(--text-s)] leading-relaxed text-base">
                {study.challenge}
              </p>
            </div>
          </div>

          {/* Our Approach */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4L8 8L14 4M2 8L8 12L14 8" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-headline text-[var(--text-p)]">Our Approach</h3>
            </div>
            <p className="text-[var(--text-s)] leading-relaxed mb-8 max-w-3xl">
              {study.solution}
            </p>
            <div className="space-y-4">
              {study.strategyPhases.map((phase, index) => (
                <div
                  key={phase.title}
                  className="glass-card rounded-xl p-6 flex gap-5"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-glow)] flex items-center justify-center">
                    <span className="font-headline text-sm text-[var(--accent-cool)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline text-[var(--text-p)] mb-2">
                      {phase.title}
                    </h4>
                    <p className="text-sm text-[var(--text-s)] leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Images */}
          {study.additionalImages.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-headline text-[var(--text-p)] mb-6">Performance Data</h3>
              <div className="grid grid-cols-1 gap-6">
                {study.additionalImages.map((img, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-[var(--border-subtle)]">
                    <img src={img} alt={`${study.client} additional data ${i + 1}`} className="w-full h-auto" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Results */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 14L6 8L9 11L14 2" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-headline text-[var(--text-p)]">Key Results</h3>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl p-8">
              <ul className="space-y-4">
                {study.detailedResults.map((result, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                    <p className="text-[var(--text-s)] leading-relaxed">{result}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Platforms & Services */}
          <div className="mb-16">
            <h3 className="text-2xl font-headline text-[var(--text-p)] mb-6">Platforms & Services</h3>
            <div className="flex flex-wrap gap-3">
              {study.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm text-[var(--text-s)] border border-[var(--border-subtle)] rounded-full px-5 py-2 bg-[var(--bg-card)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="glass-card rounded-xl p-10 text-center border-[var(--border-glow)]">
            <h3 className="text-2xl font-headline text-[var(--text-p)] mb-3">
              Want similar results?
            </h3>
            <p className="text-[var(--text-s)] mb-6 max-w-lg mx-auto">
              Let us build an AI-powered marketing system tailored to your business. Book a free audit and see what&#39;s possible.
            </p>
            <a href="#contact" onClick={onClose} className="btn-primary inline-block py-3 px-8 text-sm font-headline">
              Book Free Audit →
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
