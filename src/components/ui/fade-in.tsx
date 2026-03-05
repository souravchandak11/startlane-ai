"use client"

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function FadeIn({ children, className, stagger = false }: { children: React.ReactNode, className?: string, stagger?: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        className,
        stagger ? 'staggered-fade-in' : 'opacity-0 translate-y-4 transition-all duration-500',
        isVisible && (stagger ? 'is-visible' : 'opacity-100 translate-y-0')
      )}
    >
      {children}
    </div>
  );
}
