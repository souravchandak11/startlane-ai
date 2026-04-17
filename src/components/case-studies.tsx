"use client"

import React, { useState } from 'react';
import { FadeIn } from './ui/fade-in';
import { CaseStudyModal } from './case-study-modal';
import { caseStudies, CaseStudy } from '@/lib/case-study-data';

export function CaseStudies() {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  return (
    <>
      <section id="case-studies" className="section-container">
        <FadeIn className="mb-16">
          <p className="font-mono-label text-[var(--text-m)] mb-4">CASE STUDIES</p>
          <h2 className="text-4xl mb-2 text-[var(--text-p)]">Real systems.</h2>
          <h3 className="text-3xl text-[var(--text-s)] font-headline">Real results.</h3>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {caseStudies.map((study) => (
            <FadeIn key={study.client}>
              <div
                className="glass-card rounded-xl overflow-hidden group h-full flex flex-col cursor-pointer"
                onClick={() => setSelectedStudy(study)}
              >
                {/* Image */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-[var(--bg-elevated)]">
                  <img
                    src={study.image}
                    alt={`${study.client} performance dashboard`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-60" />
                  {/* Timeframe badge */}
                  <div className="absolute top-4 right-4 bg-[var(--bg-base)]/80 backdrop-blur-sm border border-[var(--border-subtle)] rounded-full px-3 py-1">
                    <span className="font-mono-label text-[9px] text-[var(--accent-cool)]">
                      {study.timeframe}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Industry tag */}
                  <p className="font-mono-label text-[9px] text-[var(--text-m)] mb-2">
                    {study.industry}
                  </p>

                  {/* Client name */}
                  <h4 className="text-xl font-headline text-[var(--text-p)] mb-3">
                    {study.client}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-[var(--text-s)] leading-relaxed mb-5 flex-1">
                    {study.description}
                  </p>

                  {/* Metrics */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {study.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-center min-w-[80px]"
                      >
                        <p className="text-base font-headline text-[var(--accent-cool)] leading-tight">
                          {metric.value}
                        </p>
                        <p className="font-mono-label text-[8px] text-[var(--text-m)] mt-0.5">
                          {metric.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Footer: tags + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                    <div className="flex flex-wrap gap-1.5">
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-[var(--text-m)] border border-[var(--border-subtle)] rounded-full px-2.5 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono-label text-[9px] text-[var(--accent-cool)] group-hover:translate-x-1 transition-transform whitespace-nowrap ml-3">
                      View Study →
                    </span>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedStudy && (
        <CaseStudyModal
          study={selectedStudy}
          onClose={() => setSelectedStudy(null)}
        />
      )}
    </>
  );
}
