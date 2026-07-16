/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Megaphone, BookOpen, ChevronRight, Award, Users, Shield, 
  BarChart2, Zap, Layout, Play, Briefcase, Download,
  Search, Globe, TrendingUp, ChevronLeft, Calendar, Sparkles,
  Code, Share2, PenTool
} from 'lucide-react';
import { motion } from 'motion/react';
import { clientsList } from '../data/clients';
import { MiniTools } from '../components/MiniTools';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenAuditModal: () => void;
  onOpenApptModal: () => void;
  onOpenMergedModal?: () => void;
  onOpenAuthModal?: () => void;
}

const marketingServices = [
  {
    title: "Search Engine Marketing (SEM)",
    description: "ROI-driven Paid Search (Google Ads / PPC) campaigns targeting users at high-intent search moments to capture immediate high-value customer acquisitions.",
    features: ["High-intent PPC bidding strategy & structure", "Continuous A/B copy and landing page matching", "Transparent conversion tracking & ROAS reporting"],
    iconName: "BarChart2",
    accent: "emerald",
    badge: "PAID ACQUISITION",
  },
  {
    title: "Web Development",
    description: "Custom-coded, lightning-fast web applications, high-performance portals, and responsive websites built with modern semantic architectures to convert visitor traffic.",
    features: ["Responsive Next.js / React / Vite architectures", "SEO-optimized semantic DOM structures", "Custom API & payment integrations (Paystack / Stripe)"],
    iconName: "Code",
    accent: "indigo",
    badge: "SOFTWARE ENGINEERING",
  },
  {
    title: "Social Media Marketing",
    description: "Strategic social media campaigns, brand audience nurturing, and profile optimizations across Instagram, Meta, Twitter, and LinkedIn to build cohesive online communities.",
    features: ["Platform Strategy & Target Audience Mapping", "Daily engagement optimization & community management", "Growth analytics, pixel setups, and conversion tracking"],
    iconName: "Share2",
    accent: "pink",
    badge: "SOCIAL DOMINANCE",
  },
  {
    title: "Content Creation (Article, Graphic, Video)",
    description: "End-to-end multimedia content development featuring SEO-optimized blog articles, scroll-stopping graphic designs, and cinematic short-form video editing.",
    features: ["High-ranking, long-form editorial articles", "Premium visual graphic assets & conversion ads", "Cinematic video editing (reels, shorts, explainer videos)"],
    iconName: "PenTool",
    accent: "violet",
    badge: "CREATIVE PRODUCTION",
  },
  {
    title: "SEO Ranking Optimization",
    description: "Deep technical search engine optimization targeting high-value keywords, optimizing site architecture, and building authority to rank higher organically.",
    features: ["Keyword Strategy & Competitor Audits", "Page Speed & Core Web Vitals", "Structured Schema & Rich Snippets"],
    iconName: "Search",
    accent: "indigo",
    badge: "ORGANIC GROWTH",
  },
  {
    title: "Google & Meta Paid Campaigns",
    description: "Laser-targeted paid digital customer acquisition campaigns engineered across social feeds and Google search networks to maximize lead volume and ROAS.",
    features: ["High-Converting Ad Copy & Graphics", "Conversion API & Pixel Tracking", "A/B Testing & Audience Mining"],
    iconName: "Megaphone",
    accent: "emerald",
    badge: "PAID MARKETING",
  },
  {
    title: "Conversion Funnel Engineering",
    description: "Sleek, responsive, lightning-fast landing pages crafted to strip friction and seamlessly turn cold traffic into scheduled sales and bookings.",
    features: ["High-Performance Custom Layouts", "Interactive Forms & WhatsApp CTA Hooks", "Detailed Funnel Drop-off Analytics"],
    iconName: "Layout",
    accent: "cyan",
    badge: "CONVERSION OPTIMIZATION",
  },
  {
    title: "Local SEO & Directory Schema",
    description: "Dominate regional search with localized Google Business profile tuning, local citations, and structured geographic schema listings.",
    features: ["Google Maps Local Pack Ranking", "Geographic Structured Schema Setup", "Multi-directory Citation Syndication"],
    iconName: "Globe",
    accent: "amber",
    badge: "LOCAL CITATION",
  },
  {
    title: "Business Lead Generation Funnels",
    description: "Automated direct-capture mechanics that combine smart multi-step quiz forms, active lead routing, and immediate email autoresponders.",
    features: ["Lead Scoring & Routing", "SMS & Email Automation Integrations", "Interactive Qualification Quizzes"],
    iconName: "TrendingUp",
    accent: "rose",
    badge: "LEAD GENERATION",
  },
  {
    title: "Brand Authority Strategy",
    description: "Comprehensive brand audits and positioning reviews backed by competitive search analysis to build trusted prestige in your market sector.",
    features: ["Competitor Share-of-Voice Audits", "Unified Visual & Messaging Systems", "Full Performance Growth Blueprints"],
    iconName: "Award",
    accent: "violet",
    badge: "BRAND STRATEGY",
  }
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Megaphone,
  Layout,
  Globe,
  TrendingUp,
  Award,
  Code,
  Share2,
  PenTool,
  BarChart2,
};

export default function HomePage({ onNavigate, onOpenAuditModal, onOpenApptModal, onOpenMergedModal, onOpenAuthModal }: HomePageProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [activePricingIndex, setActivePricingIndex] = React.useState(1); // Default to Recommended plan (index 1)
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % marketingServices.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  React.useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(testimonialInterval);
  }, []);

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      
      {/* 1. HERO HERO SECTION - PRISTINE WHITE BACKGROUND */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
          
          {/* Floating Background Icons */}
          <div className="absolute top-1/4 left-[8%] opacity-[0.05] animate-bounce" style={{ animationDuration: '6s' }}>
            <TrendingUp className="w-16 h-16 text-emerald-600" />
          </div>
          <div className="absolute bottom-1/4 right-[8%] opacity-[0.05] animate-pulse" style={{ animationDuration: '4s' }}>
            <Megaphone className="w-20 h-20 text-indigo-600" />
          </div>
          <div className="absolute top-1/3 right-[15%] opacity-[0.04] animate-bounce" style={{ animationDuration: '8s' }}>
            <BarChart2 className="w-14 h-14 text-pink-600" />
          </div>
          <div className="absolute bottom-1/3 left-[15%] opacity-[0.04] animate-pulse" style={{ animationDuration: '5s' }}>
            <Share2 className="w-12 h-12 text-teal-600" />
          </div>
        </div>
 
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-500" /> High-Performance Business Acceleration
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-slate-900"
          >
            Accelerate Growth. <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 bg-clip-text text-transparent">
              Empower Technical Talents.
            </span>
          </motion.h1>
 
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          >
            We merge high-impact programmatic digital marketing and advertising campaigns with industrial tech training, providing businesses with robust client conversion funnels and students with certified Tech paths.
          </motion.p>
 
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onOpenMergedModal || onOpenAuditModal}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl cursor-pointer text-xs transition-all flex items-center gap-2 shadow-md hover:scale-[1.01]"
            >
              Get Free Audit & Strategy Session <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('academy')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold px-6 py-3 rounded-xl cursor-pointer text-xs transition-all flex items-center gap-2 hover:scale-[1.01]"
            >
              Learn Tech <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 1.5 DIGITAL MARKETING SERVICES AUTO-SLIDE CAROUSEL SECTION */}
      <section className="py-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>Salami Abiodun Consult Services</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              Our Digital Marketing Services
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
              Accelerate your business scale with precision-engineered organic and paid customer acquisition channels. Use the auto-sliding showcase below to explore.
            </p>
          </div>

          {/* Carousel Outer frame with pause on hover */}
          <div 
            className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden transition-all duration-300 hover:border-slate-300"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Auto-Slide Indicator Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100">
              <div 
                key={currentSlide}
                className="h-full bg-indigo-500 transition-all duration-4500 ease-linear"
                style={{ width: isPaused ? '100%' : '100%', transition: isPaused ? 'none' : 'width 4500ms linear' }}
              />
            </div>

            {/* Carousel Active Content */}
            <div className="min-h-[300px] flex flex-col justify-between space-y-8">
              
              <div className="space-y-6">
                
                {/* Badge and Title Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">
                    {marketingServices[currentSlide].badge}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>AUTO-SLIDING ACTIVE</span>
                  </div>
                </div>

                {/* Main description section */}
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Service Icon */}
                  <div className="bg-indigo-50 text-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-indigo-100 shrink-0">
                    {(() => {
                      const IconComponent = iconMap[marketingServices[currentSlide].iconName];
                      return IconComponent ? <IconComponent className="w-7 h-7" /> : null;
                    })()}
                  </div>

                  {/* Title & description text */}
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      {marketingServices[currentSlide].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      {marketingServices[currentSlide].description}
                    </p>
                  </div>
                </div>

                {/* Features list using standard Check icon */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-3">Key Deliverables</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {marketingServices[currentSlide].features.map((feature, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium"
                      >
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Call-to-Action to Book & Controls Row */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                
                {/* Clear CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={onOpenMergedModal || onOpenApptModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-xl cursor-pointer text-xs transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Get Free Audit & Strategy Session</span>
                  </button>
                </div>

                {/* Navigation Chevrons and Dots */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Chevrons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCurrentSlide((prev) => (prev - 1 + marketingServices.length) % marketingServices.length);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-colors cursor-pointer"
                      title="Previous Service"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setCurrentSlide((prev) => (prev + 1) % marketingServices.length);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600 transition-colors cursor-pointer"
                      title="Next Service"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {marketingServices.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  currentSlide === idx ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Go to service ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 2. SHOWCASE: 3 BEST MINI-TOOLS */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Interactive Growth Utilities</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Test Your Marketing Trajectory
          </h2>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            Try our three premier performance marketing tools directly. Ready to audit your outbound channels and map growth vectors?
          </p>
        </div>
        
        <MiniTools 
          currentUser={null} 
          showcaseOnly={true} 
          onBookAppointment={onOpenApptModal} 
          onNavigate={onNavigate}
          onOpenAuthModal={onOpenAuthModal}
        />
      </section>

      {/* 3. TRUSTED BRANDS & PORTFOLIO SHOWCASE - INFINITE SLIDING MARQUEE */}
      <section className="bg-white py-16 border-t border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="text-left">
            <h4 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Trusted Portfolios</h4>
            <h2 className="text-2xl font-black text-slate-900 mt-1.5">Clients We Have Accelerated</h2>
            <p className="text-xs text-slate-500 mt-1">Salami Consult guides elite brands across Fintech, Insurtech, Luxury Real Estate, FMCG, and AI platforms.</p>
          </div>
          <button
            onClick={() => onNavigate('portfolio')}
            className="self-start md:self-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
          >
            <span>Explore Case Studies</span>
            <ChevronRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Sliding Marquee Component */}
        <div className="animate-marquee-container relative py-4 bg-slate-50/50 border-y border-slate-100">
          {/* Gradient Overlays for smooth fading on sides */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="animate-marquee-content gap-6 flex items-center">
            {/* Render the clients twice to achieve endless infinite scrolling effect */}
            {[...clientsList, ...clientsList].map((client, idx) => (
              <div
                key={`${client.id}-${idx}`}
                onClick={() => onNavigate('portfolio')}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 flex items-center gap-3.5 min-w-[280px] cursor-pointer shadow-sm hover:shadow-md transition-all shrink-0 select-none group"
              >
                {/* Logo emblem */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-inner shrink-0 ${client.logoBg} ${client.logoTextColor}`}>
                  {client.logoEmblem}
                </div>
                
                {/* Text specs */}
                <div className="text-left">
                  <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {client.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">
                      {client.category}
                    </span>
                    <span className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-semibold">
                      {client.website}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hover on marquee to pause exploration • Click any brand card to view verified performance records</span>
          </p>
        </div>
      </section>

      {/* 4. KEY METRICS STATS - DIGITAL MARKETING SERVICES STATISTICS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="text-center mb-10">
          <h4 className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Performance Metrics</h4>
          <h2 className="text-xl font-bold text-slate-900 mt-1.5">SAC Digital Marketing Services Statistics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
            <p className="text-3xl font-black text-emerald-600">92%</p>
            <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">SEO Ranking Growth Index</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
            <p className="text-3xl font-black text-indigo-600">4.8x</p>
            <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Average Paid Campaign ROAS</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
            <p className="text-3xl font-black text-emerald-600">₦15M+</p>
            <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Client Revenue Accelerated</p>
          </div>
          <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-2xl">
            <p className="text-3xl font-black text-indigo-600">25,000+</p>
            <p className="text-[10px] text-slate-500 font-mono uppercase mt-1">Qualified Leads Generated</p>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIAL CAROUSEL ZONE */}
      <section className="bg-slate-50 border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h4 className="text-[10px] font-mono tracking-widest text-emerald-600 uppercase">Impact Stories</h4>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">Client Reviews</h2>
          </div>

          <div className="relative">
            {/* Carousel Viewport */}
            <div className="overflow-hidden px-4 py-2">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentTestimonial * 100}%)`
                }}
              >
                {[
                  {
                    quote: "We consulted Salami Abiodun Consult for our search engine marketing and SEO. After implementing their structural keyword audit and PPC structure, our organic inquiries spiked by 80%, driving consistent conversions.",
                    author: "Abiodun Salami",
                    role: "Managing Director, Salami Consult Ltd",
                    initials: "AS"
                  },
                  {
                    quote: "Salami Abiodun Consult rebuilt our entire company portal and optimized our conversion funnels. The site is incredibly fast, and their targeted Google campaigns delivered over 40% growth in leads.",
                    author: "Funmi Awosika",
                    role: "Head of Growth, LeadWay Tech Solutions",
                    initials: "FA"
                  },
                  {
                    quote: "Their content creation team is exceptional. From SEO articles to cinematic short-form video assets, SAC helped us dominate our social media presence and establish genuine brand authority.",
                    author: "Tunde Johnson",
                    role: "Marketing Director, Apex Commerce Group",
                    initials: "TJ"
                  }
                ].map((testi, idx) => (
                  <div key={idx} className="w-full shrink-0 px-2 sm:px-6">
                    <div className="bg-white border border-slate-200 shadow-sm p-8 rounded-3xl space-y-6 max-w-2xl mx-auto text-left relative">
                      <div className="absolute -top-4 -left-2 text-6xl text-slate-100 font-serif select-none pointer-events-none">
                        “
                      </div>
                      <p className="text-sm text-slate-700 italic leading-relaxed relative z-10">
                        "{testi.quote}"
                      </p>
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                          {testi.initials}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{testi.author}</h4>
                          <p className="text-[10px] text-slate-500 font-mono">{testi.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual navigation arrows */}
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + 3) % 3)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-90"
              title="Previous Testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % 3)}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-950 flex items-center justify-center shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-90"
              title="Next Testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentTestimonial 
                    ? 'bg-emerald-500 w-5' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. PERSUASIVE AGENCY ADVERTISEMENT */}
      <section className="bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Floating Background Icons */}
        <div className="absolute top-12 left-12 opacity-[0.05] animate-pulse">
          <TrendingUp className="w-16 h-16 text-emerald-400" />
        </div>
        <div className="absolute bottom-12 right-12 opacity-[0.05] animate-bounce" style={{ animationDuration: '6s' }}>
          <Megaphone className="w-20 h-20 text-indigo-400" />
        </div>
        <div className="absolute top-1/3 right-[15%] opacity-[0.04] animate-pulse">
          <Share2 className="w-14 h-14 text-pink-400" />
        </div>
        <div className="absolute bottom-1/3 left-[15%] opacity-[0.04] animate-bounce" style={{ animationDuration: '8s' }}>
          <Code className="w-12 h-12 text-teal-400" />
        </div>

        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-4 py-1.5 rounded-full uppercase tracking-widest font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Salami Abiodun Consult Agency Platform</span>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Scale Your Company with Salami Abiodun Consult
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We are a premier digital marketing agency platform offering battle-tested growth marketing suite for companies. Partner with SAC to run targeted high-converting campaigns, build custom software platforms, optimize technical SEO structures, and publish authority-building visual content that consistently brings in high-value customers.
            </p>
          </div>

          {/* Key Agency Offerings Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left pt-4">
            <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-2.5 shadow-md">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xs font-extrabold text-slate-900">Paid Ads Dominance</h3>
              <p className="text-[10px] text-slate-600 leading-relaxed">High-ROAS campaigns on Google, Meta, and LinkedIn targeting direct conversion moments.</p>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-2.5 shadow-md">
              <Code className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-extrabold text-slate-900">Bespoke Web Dev</h3>
              <p className="text-[10px] text-slate-600 leading-relaxed">High-performance React & Next.js landing portals engineered to capture corporate leads.</p>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-2.5 shadow-md">
              <Award className="w-5 h-5 text-purple-600" />
              <h3 className="text-xs font-extrabold text-slate-900">Organic Keyword SEO</h3>
              <p className="text-[10px] text-slate-600 leading-relaxed">In-depth technical SEO, schema syndication, and keyword audits to win search rankings.</p>
            </div>
            <div className="bg-white border border-slate-100 p-5 rounded-2xl space-y-2.5 shadow-md">
              <Share2 className="w-5 h-5 text-sky-600" />
              <h3 className="text-xs font-extrabold text-slate-900">Content Authority</h3>
              <p className="text-[10px] text-slate-600 leading-relaxed">Custom blog articles, graphic banners, and cinematic short-form video editing.</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={onOpenMergedModal || onOpenApptModal}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-8 py-3.5 rounded-xl cursor-pointer text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 animate-pulse"
            >
              Get Free Audit & Strategy Session
            </button>
            <button
              onClick={() => onNavigate('academy')}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 font-bold px-8 py-3.5 rounded-xl cursor-pointer text-xs transition-all active:scale-95"
            >
              Learn Tech
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={3}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
