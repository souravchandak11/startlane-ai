import React from 'react';
import { Nav } from '@/components/nav';
import { Hero } from '@/components/hero';
import { Frameworks } from '@/components/frameworks';
import { Process } from '@/components/process';
import { Results } from '@/components/results';
import { CaseStudies } from '@/components/case-studies';
import { Benefits } from '@/components/benefits';
import { FAQ } from '@/components/faq';
import { ContactForm } from '@/components/contact-form';
import { Footer } from '@/components/footer';
import { FadeIn } from '@/components/ui/fade-in';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav />
      
      <main>
        <Hero />
        
        <hr className="hairline-divider" />
        
        <Frameworks />
        
        <hr className="hairline-divider" />
        
        <Process />
        
        <hr className="hairline-divider" />
        
        <Results />
        
        <hr className="hairline-divider" />
        
        <CaseStudies />
        
        <hr className="hairline-divider" />
        
        <Benefits />
        
        <hr className="hairline-divider" />
        
        <FAQ />
        
        <hr className="hairline-divider" />
        
        <ContactForm />
      </main>
      
      <Footer />
    </div>
  );
}
