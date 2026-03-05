# **App Name**: StartLane AI

## Core Features:

- Comprehensive Agency Information Display: Showcases StartLane AI's services, frameworks, process, results, and FAQs in a structured, accessible single-page layout.
- Responsive Navigation and CTAs: Provides sticky navigation with smooth scrolling links to key sections and prominent calls-to-action for booking a free audit, optimized for mobile-first interaction.
- Lead Capture Contact Form: Enables prospective clients to submit their details and inquiries through a styled form, with all submission data persistently stored in a Firestore 'leads' collection for follow-up.
- AI-Enhanced Lead Processing Tool: Leverages AI to automatically analyze contact form submissions (including 'Biggest marketing problem' selection and 'Tell us more' text) to categorize leads, summarize inquiries, or suggest next best actions for the agency, streamlining response workflows.
- Dynamic Engagement Elements: Implements interactive UI components such as animated statistical counters, accordion FAQs, animated workflow pipeline, and subtle card hover effects to enhance user engagement and visual feedback.

## Style Guidelines:

- Overall Theme: A sophisticated, restrained, and precise dark monochrome aesthetic, drawing inspiration from interfaces like Linear.app and Bloomberg terminal.
- Primary Color (Interactive Elements): #E8E8FF (Cool White). This vibrant, yet clean, hue is exclusively used for all highlights, calls-to-action, labels, and borders, providing sharp contrast and guiding user focus.
- Background Color (Base): #080810 (Near-Black). The foundational backdrop for the entire website, establishing the dark, immersive experience.
- Surface and Elevated Backgrounds: Varying shades of near-black, #0F0F1A for cards and #16162A for elevated panels, create depth and structure while adhering to the monochromatic scheme.
- Text Hierarchy: #F0F0FF for primary headings, #8888AA for secondary body copy, and #44445A for muted labels and metadata, ensuring readability and visual layering.
- Headings Font: 'Syne' (geometric sans-serif) for its bold, distinctive, and modern presence, ensuring headlines stand out. Note: currently only Google Fonts are supported.
- Body Text Font: 'DM Sans' (grotesque-style sans-serif) for clean readability in longer blocks of text and general content. Note: currently only Google Fonts are supported.
- Labels and Technical Text Font: 'DM Mono' (monospaced sans-serif) applied with small caps for a technical, precise feel in labels, metadata, and step numbering. Note: currently only Google Fonts are supported.
- Minimalist text-based indicators: Animated '→' and '↓' for CTAs, and '+ / −' for FAQ accordions. Stylized pipeline nodes and dashed connecting lines with glowing effects visually represent workflows.
- Single-page, mobile-first design with distinct, vertically arranged content sections, separated by consistent hairline dividers. Employs flexible grids for framework cards and benefit tiles, and horizontal alignment for process steps.
- Subtle and purposeful animations including a staggered fade-in for the hero section on load, continuous dash animation for the workflow pipeline, scroll-triggered section fades and translateY transitions, number count-up for statistics, and smooth max-height transitions for FAQ accordions.
- Interactive Element Animations: Cards feature a gentle translateY lift and border brightening on hover. Navigation CTA buttons dim their white background on hover. All transitions are configured for a slow (0.2s) ease effect, avoiding bouncy or abrupt movements.