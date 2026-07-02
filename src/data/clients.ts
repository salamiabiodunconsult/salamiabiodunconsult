export interface ClientPortfolio {
  id: string;
  name: string;
  category: string;
  website: string;
  logoBg: string; // Tailwind bg color class
  logoTextColor: string; // Tailwind text color class
  logoEmblem: string; // Letter or short text representation
  logoDesc: string;
  onlinePresence: string;
  achieved: string;
  detailedMetrics: string[];
  duration: string;
}

export const clientsList: ClientPortfolio[] = [
  {
    id: 'aladdin',
    name: 'Aladdin Digital Bank',
    category: 'Fintech',
    website: 'aladdin.ng',
    logoBg: 'bg-yellow-500/15',
    logoTextColor: 'text-yellow-500',
    logoEmblem: 'A',
    logoDesc: 'Stylized "A" or Lamp icon (Fintech app)',
    onlinePresence: 'Multi-platform banking app with massive active user footprints across Nigeria.',
    achieved: 'Successfully boosted user acquisition by 210% within 4 months through targeted SEO-focused landing page campaigns and hyper-optimized search engine marketing (SEM). Established trust and credibility via organic content amplification.',
    detailedMetrics: ['210% User Acquisition Growth', 'Top 3 Search Ranking for "Digital Bank Nigeria"', '0.8% CAC reduction'],
    duration: '6 Months'
  },
  {
    id: 'guinea-ins',
    name: 'Guinea Insurance PLC',
    category: 'Insurtech / Insurance',
    website: 'guineainsurance.com',
    logoBg: 'bg-emerald-500/15',
    logoTextColor: 'text-emerald-500',
    logoEmblem: 'G',
    logoDesc: 'Corporate shield or "G" emblem',
    onlinePresence: 'Public listed enterprise-grade insurance firm with corporate online portals.',
    achieved: 'Architected their modern lead generation architecture and digital campaign framework. We drove high-ticket corporate policies acquisition via LinkedIn and search campaigns, translating to multi-million Naira premium growth.',
    detailedMetrics: ['₦45M+ Premium Pipeline Generated', 'Lead-to-deal Conversion +28%', 'Corporate Brand Reach +400,000'],
    duration: '12 Months'
  },
  {
    id: 'sujimoto',
    name: 'Sujimoto',
    category: 'Luxury Real Estate',
    website: 'sujimotoconstruction.com',
    logoBg: 'bg-amber-500/15',
    logoTextColor: 'text-amber-500',
    logoEmblem: 'S',
    logoDesc: 'Minimalist, high-end "S" logo',
    onlinePresence: 'Prestige luxury real estate developer with highly curated elite digital assets.',
    achieved: 'Handled high-intent ultra-high-net-worth (UHNW) search engine optimization and targeted social campaigns for luxury developments in Ikoyi. Positioned the brand at the absolute pinnacle of premium Google search relevance.',
    detailedMetrics: ['Top 1 Organic Rank for "Luxury Real Estate Ikoyi"', 'High-ticket inbound inquiry increase of 85%', '3.2M Brand Impressions'],
    duration: '9 Months'
  },
  {
    id: 'footy-homes',
    name: 'Footy Homes',
    category: 'Real Estate',
    website: 'footygroup.ng',
    logoBg: 'bg-green-500/15',
    logoTextColor: 'text-green-500',
    logoEmblem: 'FH',
    logoDesc: 'Green/White themed real estate branding',
    onlinePresence: 'Sports-themed gated residential estate developer with high interactive content.',
    achieved: 'Structured custom search-ad funnels targeting diasporic buyers looking to invest back home. Achieved lower cost per click (CPC) using local relevance keywords and dynamic video-centric landing page content.',
    detailedMetrics: ['320+ Diaspora Inquiries Captured', '4.2x ROAS on Search/Social campaigns', '₦100M+ Closed Deal Influence'],
    duration: '8 Months'
  },
  {
    id: 'heirs-ins',
    name: 'Heirs Insurance',
    category: 'Insurance',
    website: 'heirsinsurancegroup.com',
    logoBg: 'bg-red-500/15',
    logoTextColor: 'text-red-500',
    logoEmblem: 'H',
    logoDesc: 'Distinctive "H" mark of Heirs Holdings',
    onlinePresence: 'Rapid-growth retail insurance digital channels spanning motor, health, and life.',
    achieved: 'Optimized their digital claim-to-insurance onboarding flows for friction-free conversion. Engineered SEO-first educational guides on policy choices that scaled monthly search visibility from zero to 35,000+ organic visits.',
    detailedMetrics: ['35k+ New Organic Traffic Monthly', 'SEO Ranking Boost for 85 high-intent keywords', 'Claims flow UX funnel +42%'],
    duration: '10 Months'
  },
  {
    id: 'teesas',
    name: 'Teesas',
    category: 'Edtech',
    website: 'teesas.com',
    logoBg: 'bg-cyan-500/15',
    logoTextColor: 'text-cyan-500',
    logoEmblem: 'T',
    logoDesc: 'Bright, education-focused typography',
    onlinePresence: 'Leading education technology mobile application with localized interactive syllabus content.',
    achieved: 'Accelerated mobile app store download volumes through App Store Optimization (ASO) and paid parent-targeted social funnels. Boosted organic content presence via educational blog audits.',
    detailedMetrics: ['12,000+ New Android/iOS App Installs', 'Cost-per-Install (CPI) decreased by 35%', 'Parents conversion rate +22%'],
    duration: '5 Months'
  },
  {
    id: 'house-land',
    name: 'House and Land Naija',
    category: 'Real Estate',
    website: 'houseandlandnaija.com',
    logoBg: 'bg-blue-500/15',
    logoTextColor: 'text-blue-500',
    logoEmblem: 'HL',
    logoDesc: 'Blue/Orange house icon',
    onlinePresence: 'Affordable house property listings and land aggregation portal with nationwide coverage.',
    achieved: 'Successfully drove organic search visibility for mid-tier developers. Configured automated email nurturing funnels that converted cold search traffic into physically booked site inspections.',
    detailedMetrics: ['₦25M Sales Pipeline Influenced', 'Site Visit Inspections +150%', 'Email open rate optimized to 38%'],
    duration: '7 Months'
  },
  {
    id: 'coliseum',
    name: 'The Lekki Coliseum',
    category: 'Hospitality / Hotel',
    website: 'thelekkicoliseum.com',
    logoBg: 'bg-purple-500/15',
    logoTextColor: 'text-purple-500',
    logoEmblem: 'LC',
    logoDesc: 'Grand building silhouette or TLK logo',
    onlinePresence: 'Premier luxury events center, cinema, sky lounge, and hotel hosting high-end functions.',
    achieved: 'Optimized local citation SEO and implemented Google Business optimization to dominate local maps searches for event hosting in Lekki/Victoria Island. Set up retargeting ads that won corporate conference bookings.',
    detailedMetrics: ['Top local maps listing for "Lekki Event Venue"', 'Corporate event bookings increased by 72%', 'Retargeting ROI +310%'],
    duration: '9 Months'
  },
  {
    id: 'askamaya',
    name: 'Askamaya Hotel',
    category: 'Hospitality',
    website: 'askamaya.com',
    logoBg: 'bg-pink-500/15',
    logoTextColor: 'text-pink-500',
    logoEmblem: 'AH',
    logoDesc: 'Luxury "A" monogram',
    onlinePresence: 'Upscale leisure hotel, nightlife lounge, and executive rooms with strong lifestyle image.',
    achieved: 'Designed a high-converting lifestyle digital campaign focusing on premium experiences and leisure bookings. Implemented SEO-driven local dining discovery strategies that boosted weekend footfall and reservations.',
    detailedMetrics: ['Weekend suite occupancy raised to 95%', 'Local restaurant search traffic +120%', 'Instagram-to-booking conversions +55%'],
    duration: '6 Months'
  },
  {
    id: 'august-secrets',
    name: 'August Secrets',
    category: 'FMCG / Child Nutrition',
    website: 'augustsecrets.com',
    logoBg: 'bg-orange-500/15',
    logoTextColor: 'text-orange-500',
    logoEmblem: 'AS',
    logoDesc: 'Soft colors with a focus on child nutrition',
    onlinePresence: 'Pioneering African child nutrition brand producing fortified organic infant meals.',
    achieved: 'Constructed an e-commerce SEO optimization roadmap that positioned their nutritional products as Nigeria\'s top baby-food alternative. Accelerated online direct-to-consumer store sales by 180%.',
    detailedMetrics: ['180% E-Commerce Sales Boost', 'Top search ranking for "Organic Baby Food Nigeria"', '30,000+ targeted parents reached'],
    duration: '11 Months'
  },
  {
    id: 'worldlink',
    name: 'Worldlink Travels',
    category: 'Travel & Tours',
    website: 'worldlinktravels.com',
    logoBg: 'bg-teal-500/15',
    logoTextColor: 'text-teal-500',
    logoEmblem: 'WT',
    logoDesc: 'Globe or flight-themed icon',
    onlinePresence: 'Full-service corporate and leisure ticketing, visa advisory, and tour operators.',
    achieved: 'Engineered high-yield lead generation campaigns for study-abroad and fast-track immigration packages. Realigned organic SEO content to capture high-intent travelers searching for visa assistance.',
    detailedMetrics: ['₦18M monthly ticketing value increase', 'Study visa leads +140%', 'SEO Authority score +15 points'],
    duration: '8 Months'
  },
  {
    id: 'crosstie',
    name: 'Crosstie Solutions',
    category: 'Consulting',
    website: 'crosstiesolutions.com',
    logoBg: 'bg-slate-500/15',
    logoTextColor: 'text-slate-400',
    logoEmblem: 'CS',
    logoDesc: 'Geometric blue/black corporate logo',
    onlinePresence: 'Enterprise business consulting, advisory, and tax structure firm for corporate entities.',
    achieved: 'Positioned their consulting executives as thought-leaders on Google and LinkedIn. Built robust lead generation funnels mapping mid-sized enterprise founders seeking compliance and restructure advisory.',
    detailedMetrics: ['Enterprise inquiries +95%', 'LinkedIn post engagement +240%', 'Search brand equity +80%'],
    duration: '7 Months'
  },
  {
    id: 'enterprise-life',
    name: 'Enterprise Life',
    category: 'Insurance',
    website: 'myenterprisegroup.io/ng',
    logoBg: 'bg-indigo-500/15',
    logoTextColor: 'text-indigo-500',
    logoEmblem: 'EL',
    logoDesc: '"E" shape with a star/sunray element',
    onlinePresence: 'Multi-national life assurance company pioneering dynamic financial planning and digital advisor programs.',
    achieved: 'Built a specialized campaign focused on recruiting dynamic life planning advisors digitally, while optimizing the brand search presence for retail life policies across Google.',
    detailedMetrics: ['800+ Agent sign-ups generated', 'Organic life insurance search traffic +85%', 'CAC decreased by 22%'],
    duration: '9 Months'
  },
  {
    id: 'traveldeer',
    name: 'Traveldeer',
    category: 'Travel',
    website: 'traveldeer.ng',
    logoBg: 'bg-emerald-600/15',
    logoTextColor: 'text-emerald-400',
    logoEmblem: 'TD',
    logoDesc: 'Stylized Deer/Antler silhouette',
    onlinePresence: 'Boutique travel platform, visa concierge, and tailor-made holidays agency.',
    achieved: 'Created highly targeted holiday package campaigns that achieved massive social and search virality, securing bookings for premium Maldives, Zanzibar, and Europe group packages.',
    detailedMetrics: ['Group tour packages completely sold out', 'Social engagement rate +8%', 'Paid search ROI of 5.1x'],
    duration: '4 Months'
  },
  {
    id: 'kellugs',
    name: 'Kellugs Home Concepts',
    category: 'Interior & Home Decoration',
    website: 'kellugshomes.com',
    logoBg: 'bg-rose-500/15',
    logoTextColor: 'text-rose-500',
    logoEmblem: 'KH',
    logoDesc: 'Elegant interior chair silhouette',
    onlinePresence: 'Premium home furniture and interior design consultants.',
    achieved: 'Revamped their high-end local search directory profile and launched visual-first Pinterest and Google Search Ads resulting in major corporate office renovation contracts.',
    detailedMetrics: ['3 Corporate Contracts Secured', 'Inbound design inquiries +110%', 'Local SEO search index +90%'],
    duration: '6 Months'
  },
  {
    id: 'heritage',
    name: 'Heritage Home Concepts',
    category: 'Interior & Home Decoration',
    website: 'heritagehomes.ng',
    logoBg: 'bg-amber-600/15',
    logoTextColor: 'text-amber-400',
    logoEmblem: 'HH',
    logoDesc: 'Heritage shield typography logo',
    onlinePresence: 'Curated home finishing, luxurious drapery, and smart-home accessories.',
    achieved: 'Architected premium retargeting campaigns targeting buyers in high-end neighborhoods. Optimized organic local citation lists to rank highly for home finishing search requests.',
    detailedMetrics: ['Showroom footfall traffic +85%', 'Online consultation requests +125%', 'Retargeting ad efficiency +45%'],
    duration: '5 Months'
  },
  {
    id: 'somahorse',
    name: 'Somahorse Nexus',
    category: 'Omnichannel AI / Tech',
    website: 'somahorse.ai',
    logoBg: 'bg-violet-500/15',
    logoTextColor: 'text-violet-500',
    logoEmblem: 'SN',
    logoDesc: 'AI-infused infinite loop token',
    onlinePresence: 'Omnichannel artificial intelligence developer building solutions for the African context.',
    achieved: 'Boosted brand awareness of their AI suite among developers and corporate executives. Optimized knowledge-base documents and organic API integration guides for search engines.',
    detailedMetrics: ['2,500+ active developer API sign-ups', 'Top index rank for "African AI Solutions"', 'Technical blog SEO traffic +300%'],
    duration: '7 Months'
  },
  {
    id: 'delivernow',
    name: 'Delivernow',
    category: 'Minerals Tracking AI',
    website: 'delivernow.ai',
    logoBg: 'bg-cyan-600/15',
    logoTextColor: 'text-cyan-400',
    logoEmblem: 'DN',
    logoDesc: 'Delivery cube with a tracking signal radar',
    onlinePresence: 'Supply chain tracking and AI minerals auditing solutions operating globally.',
    achieved: 'Created strategic search engine positions targeting global minerals procurement managers, delivering steady inbound enterprise consulting deals.',
    detailedMetrics: ['4 Global Enterprise Inquiries Received', 'Inbound organic leads worth $200k+ value', 'Web traffic authority score +18'],
    duration: '8 Months'
  }
];
