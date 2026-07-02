/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, BookOpen, GraduationCap, ArrowRight, MessageSquare, 
  HelpCircle, CheckCircle, Code, Star, Compass, Play, Download, ExternalLink, Globe2, Award,
  Search, Filter, Clock, ChevronDown, ChevronUp, CreditCard,
  Check, Shield, Users, ShieldAlert, LogIn, UserPlus, X
} from 'lucide-react';
import { motion } from 'motion/react';
import { getCourses } from '../firebase';
import { Course, UserProfile, UserRole } from '../types';

interface AcademyPageProps {
  onEnroll: (course: Course) => void;
  onSelectPlan?: (amount: number, planName: string) => void;
  currentUser: UserProfile | null;
  onUserChanged: (user: UserProfile | null) => void;
  onNavigate: (page: string) => void;
}

export default function AcademyPage({ onEnroll, onSelectPlan, currentUser, onUserChanged, onNavigate }: AcademyPageProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [trialSuccess, setTrialSuccess] = useState(false);
  const [trialEmail, setTrialEmail] = useState('');
  const [showWhatsAppChat, setShowWhatsAppChat] = useState(false);

  // Selected role for pending sign-in/up
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  // Workspaces definition
  const workspacesList = [
    {
      role: 'Student' as UserRole,
      title: 'Student Workspace',
      desc: 'Track XP, Badges & Learn',
      features: ['Gamified learning & XP leaderboards', 'AITutor widget interactive assistance', 'Certificate generation & course enrolling'],
      icon: Award,
      color: 'from-cyan-500/10 to-blue-500/5',
      borderColor: 'hover:border-cyan-400/50',
      textColor: 'text-cyan-600',
      badgeColor: 'bg-cyan-50 text-cyan-600',
      btnBg: 'bg-cyan-500 hover:bg-cyan-600 text-white'
    },
    {
      role: 'Parent' as UserRole,
      title: 'Parent Workspace',
      desc: 'Monitor Progress & Advise',
      features: ['Real-time child progress & learning logs', 'Direct WhatsApp mentoring triggers', 'Advising checklist tailored by performance'],
      icon: Shield,
      color: 'from-blue-500/10 to-indigo-500/5',
      borderColor: 'hover:border-blue-400/50',
      textColor: 'text-blue-600',
      badgeColor: 'bg-blue-50 text-blue-600',
      btnBg: 'bg-blue-500 hover:bg-blue-600 text-white'
    },
    {
      role: 'Teacher' as UserRole,
      title: 'Teacher Dashboard',
      desc: 'Manage Students & Commissions',
      features: ['Cohort management & rosters tracking', '20% teacher commissions scheduler', 'Student task assignment & XP rewards'],
      icon: Users,
      color: 'from-emerald-500/10 to-teal-500/5',
      borderColor: 'hover:border-emerald-400/50',
      textColor: 'text-emerald-600',
      badgeColor: 'bg-emerald-50 text-emerald-600',
      btnBg: 'bg-emerald-500 hover:bg-emerald-600 text-white'
    },
    {
      role: 'School Admin' as UserRole,
      title: 'School Portal',
      desc: 'Institution Rosters & Billing',
      features: ['Unified school billing & Paystack plans', 'Global student and facilitator rosters', 'Accredited institution certificate template'],
      icon: ShieldAlert,
      color: 'from-indigo-500/10 to-purple-500/5',
      borderColor: 'hover:border-indigo-400/50',
      textColor: 'text-indigo-600',
      badgeColor: 'bg-indigo-50 text-indigo-600',
      btnBg: 'bg-indigo-500 hover:bg-indigo-600 text-white'
    },
    {
      role: 'Mentor' as UserRole,
      title: 'Mentor Hub',
      desc: 'Guided Mentees & Real-time chat',
      features: ['Direct student chat routing channel', '10% mentor commissions metrics', 'Session scheduler with Google Meet API integration'],
      icon: MessageSquare,
      color: 'from-violet-500/10 to-pink-500/5',
      borderColor: 'hover:border-violet-400/50',
      textColor: 'text-violet-600',
      badgeColor: 'bg-violet-50 text-violet-600',
      btnBg: 'bg-violet-500 hover:bg-violet-600 text-white'
    },
    {
      role: 'Sponsor' as UserRole,
      title: 'Sponsorship Desk',
      desc: 'Fund Talents',
      features: ['Sponsor outstanding student achievements', 'Direct funding of specific high-performing cohorts', 'Custom billing & recognition plaques'],
      icon: Sparkles,
      color: 'from-amber-500/10 to-orange-500/5',
      borderColor: 'hover:border-amber-400/50',
      textColor: 'text-amber-600',
      badgeColor: 'bg-amber-50 text-amber-600',
      btnBg: 'bg-amber-500 hover:bg-amber-600 text-slate-950'
    }
  ];

  const handleWorkspaceAccess = (role: UserRole) => {
    if (currentUser) {
      if (currentUser.role === role) {
        onNavigate('dashboard');
      } else {
        const updatedProfile = {
          ...currentUser,
          role: role,
          profileCompleted: true
        };
        onUserChanged(updatedProfile);
        onNavigate('dashboard');
      }
    } else {
      setPendingRole(role);
      setCustomName('');
      setCustomEmail('');
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingRole) return;

    const mockUid = `${pendingRole.toLowerCase()}-${Date.now()}`;
    const newProfile: UserProfile = {
      uid: mockUid,
      email: customEmail || `${pendingRole.toLowerCase()}@sac.com`,
      displayName: customName || `Simulated ${pendingRole}`,
      role: pendingRole,
      profileCompleted: true
    };

    onUserChanged(newProfile);
    setPendingRole(null);
    onNavigate('dashboard');
  };

  const handleFastTrack = () => {
    if (!pendingRole) return;

    const mockUid = `${pendingRole.toLowerCase()}-${Date.now()}`;
    const newProfile: UserProfile = {
      uid: mockUid,
      email: `${pendingRole.toLowerCase()}@sac.com`,
      displayName: `Guest ${pendingRole}`,
      role: pendingRole,
      profileCompleted: true
    };

    onUserChanged(newProfile);
    setPendingRole(null);
    onNavigate('dashboard');
  };

  // Courses Search and Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

  const courses = getCourses();
  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const steps = [
    {
      number: '01',
      title: 'Start Learning',
      desc: 'Dive into interactive lessons, complete fun quizzes, and start earning rewards on your journey.'
    },
    {
      number: '02',
      title: 'Connect with Mentors',
      desc: 'Get instant live support and tailored guidance from our world-class computer science facilitators.'
    },
    {
      number: '03',
      title: 'Build Real-World Projects',
      desc: 'Apply your knowledge immediately by creating applications, websites, and games from scratch.'
    },
    {
      number: '04',
      title: 'Earn Your Certificate',
      desc: 'Showcase your portfolio-worthy projects and receive accredited certifications recognized globally.'
    }
  ];

  const handleStartTrialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trialEmail.trim()) {
      setTrialSuccess(true);
      setTimeout(() => {
        setTrialSuccess(false);
        setTrialEmail('');
      }, 4000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 pb-16">
      
      {/* Brand Header Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 py-3 text-center text-white text-xs font-semibold px-4 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>Now introducing the Nigerian Diaspora Arts & Languages STEAM Integration!</span>
        <span className="bg-yellow-400 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-black">NEW</span>
      </div>

      {/* Main Container (Full-width responsive layout) */}
      <div className="w-full space-y-0 mt-0">
        
        {/* PDF Page 1: Hero Section */}
        <section id="tek-hero" className="bg-white border-b border-slate-200 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            {/* Tek12 Logo Representation */}
            <div className="flex justify-center items-center gap-1.5 mb-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                TeK<span className="text-cyan-500">12</span>
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Unlock Your Child's <br />
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                STEM Potential
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Science, TECHnology, Engineering, indigenous Arts/Languages, Mathematics <span className="inline-block bg-yellow-400 text-slate-950 px-2 py-0.5 rounded font-bold text-xs uppercase tracking-wide">[STEAM]</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a 
                href="#start-trial" 
                className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-white font-extrabold px-8 py-3.5 rounded-xl text-xs sm:text-sm shadow-md transition-all text-center"
              >
                Start Free Trial
              </a>
              <a 
                href="#courses" 
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-8 py-3.5 rounded-xl text-xs sm:text-sm border border-slate-200 transition-all text-center"
              >
                View Courses
              </a>
            </div>
          </div>
        </section>

        {/* MULTI-ROLE WORKSPACES SECTION */}
        <section id="role-workspaces" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-cyan-600 font-mono uppercase tracking-wider">TEK12 INTERACTIVE ECOSYSTEM</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Access Multi-Role Workspaces
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Simulate and explore our tailored dashboards designed specifically for each stakeholder in the TeK12 EdTech platform. Click a workspace to open its respective dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspacesList.map(ws => {
              const Icon = ws.icon;
              const isActive = currentUser?.role === ws.role;
              return (
                <div 
                  key={ws.role}
                  className={`bg-gradient-to-br ${ws.color} bg-white rounded-3xl border ${isActive ? 'border-cyan-400 ring-2 ring-cyan-400/20 shadow-md' : 'border-slate-200'} p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-lg ${ws.borderColor}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-2xl ${ws.badgeColor} shadow-inner`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${ws.badgeColor}`}>
                        {isActive ? 'Active Mode' : 'Workspace'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-slate-900">{ws.title}</h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">{ws.desc}</p>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-700">
                      {ws.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleWorkspaceAccess(ws.role)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm ${ws.btnBg} flex items-center justify-center gap-1.5`}
                  >
                    <span>Access {ws.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* PDF Page 2: A Learning Platform Like No Other, Expert Mentors & Edtech Learning Academy */}
        <section id="tek-features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-lg flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center gap-1 bg-cyan-50 border border-cyan-100 text-cyan-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start">
              <Compass className="w-3.5 h-3.5" /> High Standards
            </div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              A Learning Platform <br />Like No Other
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore the advanced curriculum features that make TeK12 the ultimate STEM learning experience for students of all ages. We synthesize structured concepts with practical building modules.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50/50 to-blue-50/20 rounded-3xl border border-slate-200 p-8 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="bg-cyan-500/10 text-cyan-600 w-11 h-11 rounded-2xl flex items-center justify-center shadow-inner">
                <GraduationCap className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Expert Mentors</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with highly experienced facilitators and certified computer science graduates for real-time guidance, project debugging, and mentorship on your technology roadmap.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-600">
              <span>Interactive Digital Classroom Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50/40 to-teal-50/10 rounded-3xl border border-emerald-100 p-8 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="bg-emerald-500/10 text-emerald-600 w-11 h-11 rounded-2xl flex items-center justify-center shadow-inner">
                <BookOpen className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">SAC Edtech Learning Academy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A comprehensive technical learning hub designed for Students, Teachers, Parents, and Mentors. We leverage gamification, mentorship commissions, XP leaderboards, and structured modules to certify next-gen developers.
              </p>
              <ul className="space-y-2 text-[11px] text-slate-700">
                <li className="flex items-start gap-1.5 leading-tight">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Multi-Role Workspaces</strong> with gamified progress tracking</span>
                </li>
                <li className="flex items-start gap-1.5 leading-tight">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Developer E-Books</strong>, hardware gadgets & job boards</span>
                </li>
                <li className="flex items-start gap-1.5 leading-tight">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>20% Teacher & 10% Mentor</strong> referral commissions</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <span>Gamified Reward System Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>

        </section>

        {/* PDF Page 3: Bridge Worlds, Build Futures */}
        <section id="tek-heritage" className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-inner relative overflow-hidden">
              <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-cyan-50 to-transparent opacity-40 pointer-events-none hidden lg:block"></div>
              
              <div className="max-w-3xl space-y-5 relative z-10">
                <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Globe2 className="w-3.5 h-3.5" /> Global Connection
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Bridge Worlds, Build Futures.
                </h2>

                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  Empower your child with essential tech skills for the digital age, while celebrating heritage through our unique <span className="text-indigo-600 font-bold underline decoration-indigo-400">Nigerian Diaspora Arts & Language</span> integration. A flawless blend of culture and code specifically optimized for K-12 learners.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                  <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 font-semibold">Yoruba, Igbo & Hausa cultural accents</span>
                  </div>
                  <div className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-700 font-semibold">Gamified project themes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PDF Page 4: Explore Our Most Popular Courses & Dynamic Courses Catalog */}
        <section id="courses" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-cyan-600 font-mono uppercase tracking-wider">ACADEMY DIRECTORY</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Explore Our Dynamic Course Catalog
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Dive into our curated selection of courses designed to ignite curiosity, celebrate heritage, and build real-world software engineering skills. Enroll today to start earning gamified XP.
            </p>
          </div>

          {/* Interactive Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-sm flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    selectedLevel === lvl 
                      ? 'bg-cyan-500 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Dynamic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCourses.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 bg-white border border-slate-200 rounded-2xl">
                No courses found matching your query.
              </div>
            ) : (
              filteredCourses.map(course => {
                const isExpanded = expandedCourseId === course.id;
                return (
                  <div 
                    key={course.id} 
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md hover:shadow-xl hover:border-cyan-300 transition-all flex flex-col justify-between"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">
                          {course.level}
                        </span>
                        <span className="text-slate-400 text-[10px] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {course.duration}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{course.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{course.description}</p>

                      {/* Syllabus Accordion section */}
                      <div className="border-t border-slate-100 pt-3">
                        <button
                          onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                          className="w-full text-left text-[11px] font-bold text-cyan-600 hover:text-cyan-700 flex items-center justify-between cursor-pointer"
                        >
                          <span>Syllabus Breakdown</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>

                        {isExpanded && (
                          <ul className="mt-2.5 pl-4 list-disc text-[10px] text-slate-500 space-y-1.5 leading-relaxed">
                            {course.syllabus.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                      <div>
                        <span className="block text-[8px] font-mono uppercase text-slate-400">Course Fee</span>
                        <span className="text-sm font-black text-slate-900">
                          ₦{(course.price || 0).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => onEnroll(course)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Enroll Now
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ACADEMY SUBSCRIPTION & PORTAL ENROLLMENT PLANS */}
        <section id="academy-pricing" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-bold text-indigo-600 font-mono uppercase tracking-wider">ACADEMY TUITION & PORTAL ENROLLMENT</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Select Your Academy Enrollment Plan
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Get access to flagship coursework credentials, peer-mentoring leaderboards, and immediate student role assignments via secure Paystack processing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
            {[
              {
                name: "Free Sandbox Verification",
                price: 50,
                period: "once",
                desc: "Refundable card test authorization for immediate student portal profile completion.",
                features: [
                  "Instant Student Role validation",
                  "100 XP Welcome Points",
                  "Access to AI Tech Tutor Widget",
                  "Public PR & News logs"
                ],
                popular: false,
                btnLabel: "Verify Test Card",
                badge: "Verification"
              },
              {
                name: "Student / Parent Plan",
                price: 15000,
                physicalPrice: 30000,
                period: "term",
                desc: "Comprehensive coursework credentials for self-paced development or physical labs.",
                features: [
                  "Enroll in all 3 flagship courses",
                  "Track XP progress & earn Badges",
                  "Direct Chat with assigned Mentors",
                  "Request Sponsor Aid if needed",
                  "Certified Completion Diploma"
                ],
                popular: true,
                btnLabel: "Enroll Online Class (₦15k)",
                physicalBtnLabel: "Enroll Physical Class (₦30k)",
                badge: "Flagship"
              },
              {
                name: "Facilitator Teacher Tier",
                price: 12000,
                physicalPrice: 25000,
                period: "term",
                desc: "Register and assign courses to cohorts. Earn 20% on course facilitation.",
                features: [
                  "Bulk register students",
                  "Cohort assignments tracking",
                  "Earn 20% commission on referrals",
                  "Teacher-only resource guidelines",
                  "Active forum and sponsor access"
                ],
                popular: false,
                btnLabel: "Register Teacher (₦12k)",
                physicalBtnLabel: "Register Physical (₦25k)",
                badge: "Partner"
              },
              {
                name: "School / Institution Pack",
                price: 50000,
                physicalPrice: 100000,
                period: "term",
                desc: "For academies, colleges, and enterprise teams seeking bulk LMS licensing.",
                features: [
                  "Uncapped student roster invites",
                  "Complete school dashboard controls",
                  "50% course fee discounts",
                  "Google Workspace integrations",
                  "Dedicated mentor-matching system"
                ],
                popular: false,
                btnLabel: "School Online (₦50k)",
                physicalBtnLabel: "School Physical (₦100k)",
                badge: "Enterprise"
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`bg-white border rounded-2xl p-6 flex flex-col justify-between shadow-md relative transition-all hover:shadow-lg ${
                  plan.popular ? 'border-cyan-500 ring-2 ring-cyan-500/10' : 'border-slate-200'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    Most Popular
                  </span>
                )}

                <div className="space-y-5 text-left">
                  <div>
                    <span className="text-[9px] font-mono tracking-wider bg-slate-100 text-cyan-700 border border-slate-200 px-2 py-0.5 rounded uppercase">
                      {plan.badge}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-950 mt-2.5 tracking-tight">{plan.name}</h3>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-relaxed min-h-12">{plan.desc}</p>

                  {/* Price Tagging */}
                  <div className="py-2.5 border-y border-slate-100">
                    <p className="text-xl font-black text-slate-900 flex items-baseline gap-1">
                      ₦{(plan.price || 0).toLocaleString()}
                      <span className="text-xs font-normal text-slate-500">/{plan.period}</span>
                    </p>
                    {plan.physicalPrice && (
                      <p className="text-[10px] font-bold text-cyan-600 mt-1">
                        Physical Class: ₦{(plan.physicalPrice || 0).toLocaleString()} <span className="text-[9px] font-normal text-slate-400">/{plan.period}</span>
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 text-[10px] text-slate-600">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buttons */}
                <div className="mt-8 space-y-2">
                  <button
                    onClick={() => {
                      if (onSelectPlan) {
                        onSelectPlan(plan.price, `${plan.name} (Online)`);
                      }
                    }}
                    className={`w-full font-bold py-2 rounded-xl cursor-pointer text-xs transition-all ${
                      plan.popular 
                        ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {plan.btnLabel}
                  </button>
                  
                  {plan.physicalBtnLabel && plan.physicalPrice && (
                    <button
                      onClick={() => {
                        if (onSelectPlan) {
                          onSelectPlan(plan.physicalPrice!, `${plan.name} (Physical)`);
                        }
                      }}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-1.5 rounded-xl cursor-pointer text-[11px] transition-all"
                    >
                      {plan.physicalBtnLabel}
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* PDF Page 5: Launch Your STEM Journey in 4 Simple Steps */}
        <section id="tek-journey" className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-2 mb-10">
              <span className="text-xs font-bold text-cyan-500 font-mono uppercase tracking-wider">ONBOARDING PATH</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Launch Your STEM Journey in 4 Simple Steps
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Embark on an exciting learning path with TeK12. It's quick, easy, and highly rewarding to begin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, idx) => (
                <div 
                  key={step.number}
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-150/80 space-y-3 relative overflow-hidden group hover:bg-white hover:border-cyan-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <span className="absolute -top-3 -right-2 text-6xl font-black text-slate-200/50 group-hover:text-cyan-100/40 select-none transition-colors">
                    {step.number}
                  </span>
                  <p className="text-xs font-bold text-cyan-500">Step {step.number}</p>
                  <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PDF Page 6: Build Real-World Projects */}
        <section id="tek-projects" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start">
              <Award className="w-3.5 h-3.5 text-yellow-600" /> Portfolio Oriented
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              Build Real-World <br />Projects
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Go completely beyond abstract theory. Apply newly acquired software engineering skills by building interactive, visual, and portfolio-worthy programs.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50/50 to-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded font-bold uppercase tracking-wide">
                  Data Science Project Showcase
                </span>
                <span className="bg-emerald-500 text-white text-[8px] px-2 py-0.5 rounded font-bold uppercase">LIVE DEMO</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Weather Data Visualizer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fetch real-time weather data from an API and create a live dashboard to visualize temperature, humidity, and wind speed. 
              </p>

              {/* Simulated Interactive Preview */}
              <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 font-mono text-[10px] space-y-2 shadow-inner">
                <div className="flex items-center justify-between text-[8px] text-slate-400 border-b border-slate-800 pb-1.5 mb-1.5">
                  <span>API METRIC LOGGER</span>
                  <span className="text-emerald-400">● LIVE FEED</span>
                </div>
                <div className="flex justify-between">
                  <span>Lagos (LOS) Temp:</span>
                  <span className="text-amber-400 font-bold">31.4°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Humidity:</span>
                  <span className="text-cyan-400 font-bold">78%</span>
                </div>
                <div className="flex justify-between">
                  <span>Wind Speed:</span>
                  <span className="text-indigo-400 font-bold">14.2 km/h</span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* PDF Page 7: Loved by Parents, Teachers & Students */}
        <section id="tek-testimonials" className="bg-slate-100/50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Loved by Parents, Teachers & Students
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                See what our passionate ecosystem is saying about their custom-engineered TeK12 experiences.
              </p>
            </div>

            <div className="max-w-2xl mx-auto bg-white border border-slate-150 p-6 sm:p-8 rounded-2xl relative space-y-4 shadow-sm">
              <div className="absolute -top-4 left-6 bg-cyan-500 text-white p-2 rounded-xl shadow-md">
                <Star className="w-5 h-5 fill-current" />
              </div>

              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed pt-2">
                "TeK12 has completely transformed how my daughter sees science. The gamified lessons make learning so much fun, she doesn't even realize she is actively studying!"
              </p>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-black text-xs uppercase">
                  AS
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900">Amina S.</h4>
                  <p className="text-[10px] text-slate-500">Parent of a 5th Grader</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PDF Page 8: Ready to Start Your STEM Adventure & Interactive Form */}
        <section id="start-trial" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Ready to Start Your <br />STEM Adventure?
              </h2>
              <p className="text-sm text-cyan-100 max-w-xl mx-auto leading-relaxed">
                Join thousands of learners worldwide and unlock an accredited universe of STEAM knowledge and digital creativity. Your first step towards a brighter digital future starts today.
              </p>

              <form onSubmit={handleStartTrialSubmit} className="max-w-md mx-auto pt-4 space-y-3">
                {trialSuccess ? (
                  <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-300" />
                    <span>Success! Your Free Trial activation email has been prioritized.</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="email" 
                      required
                      value={trialEmail}
                      onChange={(e) => setTrialEmail(e.target.value)}
                      placeholder="Enter student/parent email address"
                      className="flex-grow bg-white text-slate-900 placeholder-slate-400 border border-white/20 px-4 py-3 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-500"
                    />
                    <button 
                      type="submit"
                      className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-xs cursor-pointer transition-all shrink-0"
                    >
                      Sign Up for Free
                    </button>
                  </div>
                )}
              </form>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-[11px] text-cyan-100/80">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-300" /> 7-Day Complete Sandbox Access
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-300" /> No Card Registration Required
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Brand PDF Footer Reference */}
        <section className="py-12 border-t border-slate-200 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold text-slate-900">TeK<span className="text-cyan-500">12</span></span>
              <span>— Unlock your child's STEM potential.</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#tek-hero" className="hover:text-cyan-600 transition-colors">Hero Overview</a>
              <span>•</span>
              <a href="#tek-features" className="hover:text-cyan-600 transition-colors">Mentorship</a>
              <span>•</span>
              <a href="#courses" className="hover:text-cyan-600 transition-colors font-bold text-cyan-500">Syllabus</a>
            </div>
          </div>
        </section>

      </div>

      {/* PENDING ROLE SIMULATION MODAL */}
      {pendingRole && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 text-left"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {pendingRole} Role Access Setup
                </span>
                <h3 className="text-xl font-black mt-2 tracking-tight text-white">Enter Workspace</h3>
              </div>
              <button 
                onClick={() => setPendingRole(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Before accessing the <strong>{pendingRole} Workspace Dashboard</strong>, enter simulated registration details or click the fast-track button below to proceed instantly.
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Salami Abiodun"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-white text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g., salami@example.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400 text-white text-xs font-medium"
                />
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Complete Sign Up & Go To Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={handleFastTrack}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-xs"
                >
                  Skip & Fast-Track Instant Access
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
