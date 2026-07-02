/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Check, AlertCircle, Calendar, ShieldCheck, CreditCard, 
  Award, Globe, BookOpen, Send, Sparkles, User, FileText, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, UserRole, Course, Product, Appointment, BrandAudit } from '../types';

// ==========================================
// 1. COMPLETE YOUR PROFILE MODAL
// ==========================================
interface CompleteProfileModalProps {
  isOpen: boolean;
  user: UserProfile;
  onSave: (fields: Partial<UserProfile>) => void;
}

export function CompleteProfileModal({ isOpen, user, onSave }: CompleteProfileModalProps) {
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [bio, setBio] = useState(user.bio || '');
  const [companyName, setCompanyName] = useState(user.companyName || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      displayName,
      phone,
      bio,
      companyName,
      profileCompleted: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-white"
      >
        <div className="text-center mb-5">
          <div className="bg-emerald-500 text-slate-950 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">Complete Your Profile</h3>
          <p className="text-xs text-gray-400 mt-1">
            Welcome to the SAC Ecosystem! Before you access your **{user.role}** workspace, please set up your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Full Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Adebayo Oluwaseun"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Contact Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +234 801 111 2222"
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
            />
          </div>

          {user.role === 'Client' && (
            <div>
              <label className="block text-slate-400 font-medium mb-1">Company/Organization Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Salami Consult Limited"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 font-medium mb-1">Professional Bio / Profile Goals</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself or your goals in the Academy/Agency..."
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 h-20 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl cursor-pointer transition-colors mt-2"
          >
            Save Profile & Launch Workspace
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ==========================================
// 2. BOOK APPOINTMENT MODAL
// ==========================================
interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (appt: { clientName: string; clientEmail: string; dateTime: string; serviceType: string; companyName?: string }) => void;
  clientEmail?: string;
  clientName?: string;
}

export function BookAppointmentModal({ isOpen, onClose, onBook, clientEmail = '', clientName = '' }: BookAppointmentModalProps) {
  const [name, setName] = useState(clientName);
  const [email, setEmail] = useState(clientEmail);
  const [date, setDate] = useState('');
  const [service, setService] = useState('Search Engine Marketing (SEM)');
  const [company, setCompany] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBook({
      clientName: name,
      clientEmail: email,
      dateTime: date,
      serviceType: service,
      companyName: company || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-white relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <h3 className="text-base font-bold flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Book Brand Strategy Meeting
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">
            Schedule a 1-on-1 advertising and digital marketing strategy review. Google Meet links are generated instantly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Abiodun Salami"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Your Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@mail.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Optional"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Preferred Date & Time</label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Services of Interest</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900"
            >
              <option value="Search Engine Marketing (SEM)">Search Engine Marketing (SEM)</option>
              <option value="Web Development">Web Development</option>
              <option value="Social Media Marketing">Social Media Marketing</option>
              <option value="Content Creation (Article, Graphic, Video)">Content Creation (Article, Graphic, Video)</option>
              <option value="SEO Ranking Optimization">SEO Ranking Optimization</option>
              <option value="Google & Meta Paid Campaigns">Google & Meta Paid Campaigns</option>
              <option value="Conversion Funnel Engineering">Conversion Funnel Engineering</option>
              <option value="Local SEO & Directory Schema">Local SEO & Directory Schema</option>
              <option value="Business Lead Generation Funnels">Business Lead Generation Funnels</option>
              <option value="Brand Authority Strategy">Brand Authority Strategy</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl cursor-pointer transition-colors"
          >
            Confirm & Invite via Google Meet
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ==========================================
// 3. BRAND AUDIT REQUEST MODAL
// ==========================================
interface BrandAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (audit: { clientName: string; clientEmail: string; websiteUrl: string; industry: string; primaryGoal: string }) => void;
  clientEmail?: string;
  clientName?: string;
}

export function BrandAuditModal({ isOpen, onClose, onSubmit, clientEmail = '', clientName = '' }: BrandAuditModalProps) {
  const [name, setName] = useState(clientName);
  const [email, setEmail] = useState(clientEmail);
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clientName: name,
      clientEmail: email,
      websiteUrl: website,
      industry,
      primaryGoal: goal
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-white relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <h3 className="text-base font-bold flex items-center gap-2 text-white">
            <Globe className="w-5 h-5 text-emerald-400" />
            Request Free Brand Audit
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">
            Submit your domain! Our automated scraping logs evaluate SEO metrics, site speed, and conversion pathways.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Abiodun Salami"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@company.com"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Website URL</label>
            <input
              type="url"
              required
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Industry</label>
              <input
                type="text"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Edtech, Finance"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Primary Growth Goal</label>
              <input
                type="text"
                required
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Increase signups"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl cursor-pointer transition-colors"
          >
            Submit Audit Request & Scrape Site
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ==========================================
// 3.5 MERGED AUDIT & STRATEGY FLOW MODAL
// ==========================================
interface MergedAuditStrategyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    clientName: string;
    clientEmail: string;
    websiteUrl: string;
    industry: string;
    primaryGoal: string;
    dateTime: string;
    serviceType: string;
    companyName?: string;
  }) => void;
  clientEmail?: string;
  clientName?: string;
}

export function MergedAuditStrategyModal({ isOpen, onClose, onSubmit, clientEmail = '', clientName = '' }: MergedAuditStrategyModalProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(clientName);
  const [email, setEmail] = useState(clientEmail);
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [goal, setGoal] = useState('');
  
  const [date, setDate] = useState('');
  const [service, setService] = useState('Search Engine Marketing (SEM)');
  const [company, setCompany] = useState('');

  if (!isOpen) return null;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !website || !industry || !goal) {
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      clientName: name,
      clientEmail: email,
      websiteUrl: website,
      industry,
      primaryGoal: goal,
      dateTime: date,
      serviceType: service,
      companyName: company || undefined
    });
    setStep(1); // Reset step for next open
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-white relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        {/* Progress header */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              Unified Strategy Portal • Step {step} of 2
            </span>
            <div className="flex gap-1">
              <span className={`w-6 h-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
              <span className={`w-6 h-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
            </div>
          </div>
          <h3 className="text-sm font-extrabold flex items-center gap-2 text-white">
            {step === 1 ? (
              <>
                <Globe className="w-5 h-5 text-emerald-400" />
                1. Free Website Performance Audit
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 text-emerald-400" />
                2. Schedule Your Strategy Meeting
              </>
            )}
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
            {step === 1 
              ? "We'll scrape your website url to grade SEO, mobile speed, tracking pixels, and conversion funnels."
              : "Schedule a Google Meet strategy session with SAC consultants to receive your diagnostic audit report."
            }
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleNext} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Abiodun Salami"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Website URL</label>
              <input
                type="url"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Industry</label>
                <input
                  type="text"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., Edtech, Finance"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Growth Goal</label>
                <input
                  type="text"
                  required
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g., Lead acquisition"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2.5 rounded-xl cursor-pointer transition-colors mt-4 flex items-center justify-center gap-1 text-xs"
            >
              Continue to Strategy Booking <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Company/Brand Name (Optional)</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g., Salami Consult Ltd"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Preferred Meeting Date & Time</label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Service Focus Areas</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900"
              >
                <option value="Search Engine Marketing (SEM)">Search Engine Marketing (SEM)</option>
                <option value="Paid Ads Dominance (Meta/LinkedIn)">Paid Ads Dominance (Meta/LinkedIn)</option>
                <option value="Bespoke Web Development (React)">Bespoke Web Development (React)</option>
                <option value="Organic Technical SEO Suite">Organic Technical SEO Suite</option>
                <option value="High-Converting Funnel Audits">High-Converting Funnel Audits</option>
                <option value="EdTech Training Partnerships">EdTech Training Partnerships</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl cursor-pointer transition-colors text-center text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2.5 rounded-xl cursor-pointer transition-colors text-center text-xs shadow-lg shadow-emerald-500/15"
              >
                Confirm Booking & Scrape Site
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// ==========================================
// 4. MANAGE STUDENT MODAL (ADD / ENROLL)
// ==========================================
interface ManageStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: { email: string; displayName: string; courseId: string; paidBy: string }) => void;
  courses: Course[];
  mode: 'Add' | 'Enroll' | 'Assign';
}

export function ManageStudentModal({ isOpen, onClose, onSave, courses, mode }: ManageStudentModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [payerType, setPayerType] = useState('self');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      email,
      displayName: name,
      courseId,
      paidBy: payerType
    });
    onClose();
    setEmail('');
    setName('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-white relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <h3 className="text-base font-bold flex items-center gap-2 text-white">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            {mode} Course Student Roster
          </h3>
          <p className="text-[10px] text-gray-400 mt-1">
            Add student accounts manually. This creates active access tokens and sets commissions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Student Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Adebayo Oluwaseun"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Student Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Select Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Access Payer</label>
              <select
                value={payerType}
                onChange={(e) => setPayerType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900"
              >
                <option value="self">Self Paid</option>
                <option value="parent">Parent Financed</option>
                <option value="teacher">Teacher Commissioned</option>
                <option value="sponsor">Sponsor Backed</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2 rounded-xl cursor-pointer transition-colors"
          >
            {mode} Student & Authorize Course
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ==========================================
// 5. CERTIFICATE MODAL
// ==========================================
interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseTitle: string;
}

export function CertificateModal({ isOpen, onClose, studentName, courseTitle }: CertificateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-amber-50 border-[10px] border-slate-950 rounded-2xl w-full max-w-2xl p-8 text-slate-950 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-950 cursor-pointer">
          <X className="w-6 h-6" />
        </button>

        {/* Certificate Border layout */}
        <div className="border border-amber-900/35 p-6 flex flex-col items-center justify-center text-center">
          
          <Award className="w-16 h-16 text-indigo-900 mb-4" />
          
          <h2 className="font-serif text-3xl font-extrabold tracking-tight text-indigo-950 mb-1">
            SAC ACADEMY
          </h2>
          <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-6">
            Salami Abiodun Consult • Certificate of Course Completion
          </p>

          <p className="text-xs text-slate-600 mb-1 italic">This is proudly awarded to</p>
          <h1 className="text-2xl font-bold font-sans tracking-wide text-indigo-900 border-b border-slate-300 pb-2 px-8 mb-4">
            {studentName}
          </h1>

          <p className="text-xs max-w-lg leading-relaxed text-slate-600 mb-6">
            for successfully fulfilling all core coursework syllabus requirements, passing technical program tests, 
            and completing the comprehensive digital prototype lab in:
          </p>

          <h3 className="text-lg font-bold text-slate-900 font-serif max-w-md italic mb-8 bg-indigo-50 px-4 py-2 rounded">
            "{courseTitle}"
          </h3>

          <div className="grid grid-cols-2 gap-12 text-center w-full max-w-md mt-4 text-[10px]">
            <div className="border-t border-slate-300 pt-1">
              <p className="font-bold text-indigo-950">Dr. Sarah Carter</p>
              <p className="text-[9px] text-slate-400">Head of Mentorship, SAC</p>
            </div>
            <div className="border-t border-slate-300 pt-1">
              <p className="font-bold text-indigo-950">Abiodun Salami</p>
              <p className="text-[9px] text-slate-400">Executive Consultant, SAC</p>
            </div>
          </div>

          <div className="mt-8 text-[8px] font-mono text-slate-400">
            Certificate ID: SAC-{Math.floor(100000 + Math.random() * 900000)} • Date Issued: {new Date().toLocaleDateString()}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2 text-xs">
          <button 
            onClick={() => window.print()} 
            className="bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 rounded-xl cursor-pointer font-bold"
          >
            Download Diploma PDF / Print
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ==========================================
// 6. PREMIUM PURCHASE / PAYSTACK SIMULATION MODAL
// ==========================================
interface PremiumPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  planName: string;
  onPaymentSuccess: (payerEmail: string) => void;
}

export function PremiumPurchaseModal({ isOpen, onClose, amount, planName, onPaymentSuccess }: PremiumPurchaseModalProps) {
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePaystackMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !cardNumber) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        onPaymentSuccess(email);
        setSuccess(false);
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl text-slate-800 relative"
      >
        {/* Header */}
        <div className="bg-slate-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
              Paystack
            </div>
            <span className="text-xs font-semibold">Secure Checkout</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 animate-bounce">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-950 text-sm">Transaction Approved</h4>
            <p className="text-xs text-gray-400 mt-1">Authorized via Paystack secure system.</p>
          </div>
        ) : (
          <form onSubmit={handlePaystackMock} className="p-5 space-y-4 text-xs">
            {/* Purchase breakdown */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Selected Course Level / Tier</p>
              <h3 className="text-sm font-bold text-slate-900">{planName}</h3>
              <p className="text-lg font-black text-indigo-900 mt-1.5">
                ₦{(amount || 0).toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">NGN</span>
              </p>
            </div>

            {/* Test credentials banner */}
            <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl flex items-start gap-1.5 text-[9px] text-indigo-950">
              <CreditCard className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Test Sandbox Key Configured</p>
                <p className="text-gray-400 font-mono text-[8px]">pk_test_006be008193c9b83e671e6e1bb75e5aab3d9d589</p>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Your Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Card Number</label>
              <input
                type="text"
                required
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                placeholder="4000 1234 5678 9010"
                className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 placeholder-slate-400 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Expiry Date</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 placeholder-slate-400 text-center"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">CVV Security Code</label>
                <input
                  type="password"
                  required
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 placeholder-slate-400 text-center font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl cursor-pointer transition-colors flex items-center justify-center gap-1.5 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isProcessing ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 animate-ping"></span>
                  <span>Contacting Paystack...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize ₦{(amount || 0).toLocaleString()}</span>
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
