export interface StrategyPhase {
  title: string;
  description: string;
}

export interface Metric {
  label: string;
  value: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  industry: string;
  description: string;
  challenge: string;
  solution: string;
  strategyPhases: StrategyPhase[];
  metrics: Metric[];
  detailedResults: string[];
  tags: string[];
  timeframe: string;
  image: string;
  additionalImages: string[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'woods-fine-linens',
    client: 'Woods Fine Linens',
    industry: 'Luxury E-Commerce',
    description:
      'Luxury e-commerce brand in the finest linen and luxury cotton industry. Managed monthly and quarterly strategies including SEO audits, social media management, and content marketing.',
    challenge:
      'Woods Fine Linens had a premium product line but struggled to compete digitally against larger luxury retailers. Their organic visibility was low, domain authority was stagnant, and their social media presence didn\'t reflect the brand\'s luxury positioning. They needed a comprehensive digital strategy to scale e-commerce revenue organically.',
    solution:
      'We deployed a multi-channel organic growth strategy combining technical SEO, content strategy, and social media management. Monthly and quarterly strategy sessions ensured alignment with business goals, while continuous content optimization maximised engagement and organic reach.',
    strategyPhases: [
      {
        title: 'Technical SEO Audit & Fix',
        description:
          'Comprehensive site audit covering Core Web Vitals, schema markup for products, internal linking architecture, and crawl budget optimization across the entire product catalogue.',
      },
      {
        title: 'Content & Authority Building',
        description:
          'Developed a content calendar targeting luxury lifestyle keywords. Created buying guides, fabric comparison articles, and seasonal lookbooks to build topical authority and drive organic traffic.',
      },
      {
        title: 'Landing Page Optimization',
        description:
          'Redesigned key collection and product pages with improved layouts, compelling copy, trust signals, and clear calls-to-action to increase organic conversion rates.',
      },
      {
        title: 'Social Media Strategy',
        description:
          'Curated aspirational social content showcasing the luxury lifestyle. Managed community engagement and built brand awareness through consistent, on-brand content across platforms.',
      },
    ],
    metrics: [
      { label: 'Traffic', value: '+150%' },
      { label: 'Authority', value: '+8' },
      { label: 'Revenue', value: '+70%' },
    ],
    detailedResults: [
      'Total clicks grew to 3.36K with 310K total impressions in peak months.',
      'Peak month revenue hit £29K with 302 purchases tracked.',
      'Organic search became the primary revenue driver, overtaking all other channels.',
      'Domain authority increased by 8+ points, opening up higher-competition keyword rankings.',
      'Average position improved to 27.4 across all tracked keywords.',
    ],
    tags: ['SEO', 'Content Strategy', 'Social Media'],
    timeframe: '1 Year',
    image: '/case-studies/woods-fine-linens.jpg',
    additionalImages: [
      '/case-studies/woods-fine-linens-2.jpg',
    ],
  },
  {
    slug: 'the-carlson-company',
    client: 'The Carlson Company',
    industry: 'DNA Diagnostics & Drug Testing',
    description:
      'DNA diagnostics center providing global services and drug testing. Focused on blog creation, service page optimization, and analytics-driven strategy to increase organic visibility and conversions.',
    challenge:
      'The Carlson Company operates in a highly specialised niche — DNA diagnostics and drug testing — where keyword competition is fierce and user trust is paramount. They had low visibility for critical service terms like "infidelity DNA test," "unknown substance analysis," and "workplace drug testing." Their existing web presence failed to attract customers searching for these specialised services.',
    solution:
      'We implemented a content-led SEO strategy combined with landing page optimization to dominate niche search terms. Service pages were rebuilt from scratch with trust signals, structured data, and conversion-optimised layouts. A targeted blog strategy addressed common questions and built topical authority in the diagnostics space.',
    strategyPhases: [
      {
        title: 'Service Page Overhaul',
        description:
          'Rewrote and restructured all service pages with compelling copy, trust badges, FAQ schemas, and clear CTAs. Each page was optimised for specific diagnostic service keywords.',
      },
      {
        title: 'Content-Led SEO',
        description:
          'Created an extensive blog programme targeting informational queries around DNA testing, drug testing procedures, and diagnostic science to capture top-of-funnel traffic.',
      },
      {
        title: 'Landing Page Design & Optimization',
        description:
          'Built dedicated landing pages for key services with clear messaging, trust indicators, and streamlined inquiry forms. Continuous A/B testing improved conversion rates over time.',
      },
      {
        title: 'Analytics & Performance Monitoring',
        description:
          'Set up comprehensive tracking via Google Search Console and Analytics to monitor rankings, click-through rates, and conversion paths. Regular reporting enabled data-driven strategy adjustments.',
      },
    ],
    metrics: [
      { label: 'Traffic', value: '+170%' },
      { label: 'Authority', value: '+3' },
      { label: 'Revenue', value: '+120%' },
    ],
    detailedResults: [
      'Organic clicks grew from 9.49K to 10.2K in just 3 months of optimisation.',
      'Total impressions reached 916K with improved CTR across all service pages.',
      'Average search position improved from 31.5 to 27.8 across all tracked keywords.',
      'Optimized landing pages saw a significant increase in organic inquiry submissions.',
      'Domain authority score increased by 3+ points in the specialised diagnostics niche.',
    ],
    tags: ['SEO', 'Content Marketing', 'Landing Pages', 'Analytics'],
    timeframe: '1.8 Years',
    image: '/case-studies/the-carlson-company.jpg',
    additionalImages: [],
  },
  {
    slug: 'kitchen-experts',
    client: 'Kitchen Experts',
    industry: 'Kitchen Manufacturing (UK)',
    description:
      'UK-based kitchen doors and accessories manufacturer with 30+ years in business. Managed blogs, category page optimization, and digital strategy consulting to dramatically increase visibility and organic conversions.',
    challenge:
      'Despite 30+ years in business and a quality product range, Kitchen Experts had minimal online presence. Their website was underperforming in search, category pages lacked SEO optimization, and they had no cohesive digital strategy. Competitors were capturing the digital market share they were leaving on the table.',
    solution:
      'We executed an aggressive 90-day growth sprint combining category page SEO, blog content strategy, and landing page optimization. By focusing on high-converting category pages first, we achieved dramatic results in a compressed timeframe while building a sustainable content pipeline for long-term growth.',
    strategyPhases: [
      {
        title: 'Category Page Optimization',
        description:
          'Restructured all product category pages with keyword-rich descriptions, internal linking, breadcrumb navigation, and optimised meta tags targeting transactional search intent.',
      },
      {
        title: 'Blog Content Engine',
        description:
          'Launched a blog programme covering kitchen design trends, door style guides, and renovation tips to capture informational traffic and establish authority in the home improvement space.',
      },
      {
        title: 'Conversion Rate Optimization',
        description:
          'Redesigned key landing pages with clear messaging, improved navigation, and streamlined inquiry forms — resulting in a steady flow of 20–30 organic inquiries monthly.',
      },
    ],
    metrics: [
      { label: 'Traffic', value: '+400%' },
      { label: 'Authority', value: '+9' },
      { label: 'Conversions', value: '+200%' },
    ],
    detailedResults: [
      'Website traffic surged by 400% within the first 3 months of the engagement.',
      'Domain authority jumped by 9 points, significantly improving competitive positioning.',
      'Conversions increased by 200%, translating directly to measurable revenue growth.',
      'Organic search became the primary source of customer inquiries at 20–30 per month.',
      'Category pages now rank on page 1 for multiple high-intent kitchen product keywords.',
    ],
    tags: ['SEO', 'Content Strategy', 'E-commerce'],
    timeframe: '3 Months',
    image: '/case-studies/kitchen-experts.jpg',
    additionalImages: [],
  },
  {
    slug: 'narps-uk',
    client: 'Narps UK',
    industry: 'Pet Services Platform',
    description:
      'Leading UK platform connecting pet owners with sitters and walkers. Comprehensive SEO, social media management, and content creation to grow consistent organic traffic month after month.',
    challenge:
      'Narps UK needed to scale their organic visibility and attract more users to their platform. Despite being a well-known name in the pet services industry, they were losing market share to newer competitors with better digital strategies. They required consistent, high-quality organic traffic to fuel membership growth.',
    solution:
      'We built a comprehensive organic growth engine combining SEO, social media, and content marketing. The strategy focused on building long-term sustainable traffic sources through search and social, while community engagement strengthened brand loyalty.',
    strategyPhases: [
      {
        title: 'Organic SEO Foundation',
        description:
          'Built a robust SEO foundation with technical fixes, site speed optimization, and a keyword strategy targeting pet owner searches across the UK. Focused on local and national terms.',
      },
      {
        title: 'Content Marketing',
        description:
          'Created a content hub with pet care guides, breed-specific advice, and seasonal content to attract and engage pet owners. Each piece was optimised for search and social sharing.',
      },
      {
        title: 'Social Media Growth',
        description:
          'Managed social channels with a content calendar mixing educational, entertaining, and promotional posts. Built an engaged community that converted into platform members.',
      },
    ],
    metrics: [
      { label: 'Traffic', value: '+320%' },
      { label: 'Revenue', value: '+150%' },
      { label: 'Organic Visitors', value: '100+/mo' },
    ],
    detailedResults: [
      'Organic traffic increased by 320% over the course of the engagement.',
      'Revenue grew by 150% through improved visitor quality and conversion rates.',
      'Now attracts 100+ new organic visitors every month, consistently.',
      'Social media following grew significantly, contributing to brand awareness and referral traffic.',
      'Organic search became the dominant traffic source, reducing dependency on other channels.',
    ],
    tags: ['Organic SEO', 'Social Media', 'Content'],
    timeframe: '1 Year',
    image: '/case-studies/narps-uk.jpg',
    additionalImages: [],
  },
  {
    slug: 'easy-number-plates',
    client: 'Easy Number Plates',
    industry: '3D Gel & 4D Number Plates (UK)',
    description:
      'Industry leader in replacement 3D gel and 4D UK number plates. Optimized category pages and built high-quality backlinks via video content and infographics to dominate search rankings.',
    challenge:
      'Easy Number Plates was competing in a crowded market for replacement number plates. While they had superior products, their organic search visibility was limited and competitors were outranking them on key commercial terms. They needed a creative approach to build authority and dominate search results.',
    solution:
      'We combined technical SEO with a creative content and link-building strategy. Instead of traditional backlinking, we leveraged video content and custom infographics to earn high-quality backlinks naturally, while simultaneously optimising category pages for maximum conversion.',
    strategyPhases: [
      {
        title: 'Category Page SEO',
        description:
          'Optimised all product category pages with unique, keyword-rich content, improved internal linking structure, and enhanced product schema markup for rich search results.',
      },
      {
        title: 'Video Content Strategy',
        description:
          'Produced engaging video content showcasing products, installation guides, and comparisons. Videos were distributed across YouTube and niche automotive forums to earn backlinks.',
      },
      {
        title: 'Infographic Link Building',
        description:
          'Created visually stunning infographics about number plate regulations, customisation options, and industry trends. These were picked up by automotive blogs and news sites, generating high-authority backlinks.',
      },
    ],
    metrics: [
      { label: 'Traffic', value: '+110%' },
      { label: 'Revenue', value: '+30%' },
    ],
    detailedResults: [
      'Overall organic traffic increased by 110% year-on-year.',
      'Revenue grew by 30% driven entirely by organic search improvements.',
      'Peak performance of 4.52K clicks and 315K impressions in a single month.',
      'Achieved top rankings for competitive terms like "3d gel plates" and "4D number plates."',
      'Average CTR of 1.4% with an average position of 17.5 across tracked keywords.',
    ],
    tags: ['SEO', 'Content Strategy', 'Video Backlinks'],
    timeframe: 'Ongoing',
    image: '/case-studies/easy-number-plates.jpg',
    additionalImages: [],
  },
  {
    slug: 'the-lure-box',
    client: 'The Lure Box',
    industry: 'Fishing Accessories (UK)',
    description:
      'Fishing accessory shop focused on high-intent keyword domination. Category page optimization targeting competitive terms like "perch lures" and "chatterbait" to capture ready-to-buy customers.',
    challenge:
      'The Lure Box is a niche fishing accessories retailer operating in a market dominated by larger fishing supply chains. They needed to carve out a dominant position in specific, high-intent product categories where their specialist knowledge gave them an advantage over generalist competitors.',
    solution:
      'We adopted a surgical SEO strategy focused entirely on owning specific product categories. Rather than trying to rank for broad fishing terms, we targeted hyper-specific, high-conversion keywords where purchase intent was highest, and built comprehensive category content that search engines treated as the definitive resource.',
    strategyPhases: [
      {
        title: 'Keyword Research & Mapping',
        description:
          'Conducted deep keyword research to identify high-intent, low-competition terms in the fishing accessories niche. Mapped keywords to specific category and product pages for maximum relevance.',
      },
      {
        title: 'Category Page Domination',
        description:
          'Created comprehensive, expert-level category pages for target terms like "perch lures" and "chatterbait." Each page featured detailed product comparisons, buying guides, and expert advice.',
      },
      {
        title: 'Product Page Optimization',
        description:
          'Enhanced individual product pages with unique descriptions, specifications, and usage tips. Implemented product schema markup for enhanced search result visibility.',
      },
    ],
    metrics: [
      { label: 'Keyword Rankings', value: '#1' },
      { label: 'Category', value: 'Dominated' },
    ],
    detailedResults: [
      'Achieved #1 ranking for "perch lures" — a key commercial term in the fishing niche.',
      'Dominated search results for "chatterbait" and related product category terms.',
      'Category pages now serve as the definitive resource for multiple fishing accessory searches.',
      'Click-through rates significantly above industry benchmarks due to rich snippet optimization.',
      'Total impressions of 855K with consistent growth in clicks month over month.',
    ],
    tags: ['SEO', 'Product Optimization', 'Keyword Strategy'],
    timeframe: 'Ongoing',
    image: '/case-studies/the-lure-box.jpg',
    additionalImages: [],
  },
];
