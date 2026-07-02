/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Award, BookOpen, Calendar, HelpCircle, Users, Shield, Globe, 
  DollarSign, Sparkles, User, Brain, AlertCircle, ChevronRight, 
  Check, FileText, Send, Zap, Plus, LogIn, ExternalLink, RefreshCw 
} from 'lucide-react';
import { UserProfile, UserRole, Course, Appointment, BrandAudit, ChatMessage } from '../types';
import { 
  getCourses, bookAppointment, getAppointments, saveBrandAudit, 
  getBrandAudits, requestSponsorship, getSponsorships, 
  updateSponsorshipStatus, triggerSignOut 
} from '../firebase';
import { motion } from 'motion/react';

interface DashboardPageProps {
  currentUser: UserProfile;
  onNavigate: (page: string) => void;
  onOpenAuditModal: () => void;
  onOpenApptModal: () => void;
  onOpenManageStudentModal: (mode: 'Add' | 'Enroll' | 'Assign') => void;
  onTriggerNotification: (text: string) => void;
  onOpenCertificateModal: (studentName: string, courseTitle: string) => void;
  onEnrollViaPaystack: (amount: number, planName: string) => void;
  appointments: Appointment[];
  audits: BrandAudit[];
}

export default function DashboardPage({
  currentUser,
  onNavigate,
  onOpenAuditModal,
  onOpenApptModal,
  onOpenManageStudentModal,
  onTriggerNotification,
  onOpenCertificateModal,
  onEnrollViaPaystack,
  appointments: initialAppointments,
  audits: initialAudits
}: DashboardPageProps) {
  
  // Local state for interactive features
  const courses = getCourses();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [audits, setAudits] = useState<BrandAudit[]>(initialAudits);
  const [sponsorships, setSponsorships] = useState<any[]>([]);

  // Student specific states
  const [studentXP, setStudentXP] = useState(150);
  const [completedCourse, setCompletedCourse] = useState(false);
  const [sponsorSubmitted, setSponsorSubmitted] = useState(false);
  const [studentChatInput, setStudentChatInput] = useState('');
  const [studentChat, setStudentChat] = useState<ChatMessage[]>([
    {
      id: 'c-1',
      chatId: 'general',
      senderId: 'mentor',
      senderName: 'Dr. Sarah Carter',
      text: "Hello! I am your assigned SAC Mentor. How can I guide you in your coding concepts today?",
      timestamp: new Date().toISOString()
    }
  ]);

  // Parent specific states
  const [parentTips, setParentTips] = useState<string | null>(null);
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const [childProgress, setChildProgress] = useState(85);

  // Teacher states
  const [roster, setRoster] = useState([
    { name: 'Adebayo Oluwaseun', email: 'adebayo@student.com', xp: 240, status: 'Active' },
    { name: 'Kemi Adeola', email: 'kemi@student.com', xp: 180, status: 'Active' },
    { name: 'Chidi Benson', email: 'chidi@student.com', xp: 90, status: 'Pending Verification' }
  ]);

  // Admin and other general updates
  useEffect(() => {
    const load = async () => {
      const appts = await getAppointments();
      const auds = await getBrandAudits();
      const spons = await getSponsorships();
      setAppointments(appts);
      setAudits(auds);
      setSponsorships(spons);
    };
    load();
  }, [initialAppointments, initialAudits]);

  const refreshDashboardData = async () => {
    const appts = await getAppointments();
    const auds = await getBrandAudits();
    const spons = await getSponsorships();
    setAppointments(appts);
    setAudits(auds);
    setSponsorships(spons);
    onTriggerNotification('Dashboard statistics refreshed.');
  };

  // Student request sponsorship handler
  const handleRequestSponsorship = async (e: React.FormEvent) => {
    e.preventDefault();
    const mockReq = await requestSponsorship({
      studentId: currentUser.uid,
      studentName: currentUser.displayName || 'Adebayo Oluwaseun',
      studentEmail: currentUser.email || 'adebayo@student.com',
      courseId: 'course-1',
      courseTitle: 'Advanced AI & Large Language Models',
      reason: "Need a laptop and internet stipend to join the physical Lagos React Hackathon.",
      fundingNeeded: 25000,
    });
    setSponsorships(prev => [mockReq, ...prev]);
    setSponsorSubmitted(true);
    onTriggerNotification("Sponsorship request submitted to corporate sponsors.");
  };

  // Student chat with mentor
  const handleStudentSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentChatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      chatId: 'general',
      senderId: currentUser.uid,
      senderName: currentUser.displayName || 'Student',
      text: studentChatInput,
      timestamp: new Date().toISOString()
    };

    setStudentChat(prev => [...prev, userMsg]);
    const inputMsg = studentChatInput.toLowerCase();
    setStudentChatInput('');

    // Simulated mentor responsive feedback!
    setTimeout(() => {
      let reply = "That is a great query. ";
      if (inputMsg.includes('react') || inputMsg.includes('code')) {
        reply += "In React, make sure your components are pure. Keep logic modular to avoid hitting chunk limits.";
      } else if (inputMsg.includes('seo') || inputMsg.includes('audit')) {
        reply += "For client audits, check search console schemas. Organic backlinks must be clean and consistent.";
      } else {
        reply += "I suggest reviewing the Week 3 curriculum slides. Let's schedule a 5-minute review call on Friday!";
      }

      const mentorMsg: ChatMessage = {
        id: `chat-mentor-${Date.now()}`,
        chatId: 'general',
        senderId: 'mentor',
        senderName: 'Dr. Sarah Carter',
        text: reply,
        timestamp: new Date().toISOString()
      };
      setStudentChat(prev => [...prev, mentorMsg]);
    }, 1000);
  };

  // Fetch AI parenting advice tips via Gemini
  const fetchParentingTips = async () => {
    setIsLoadingTips(true);
    setParentTips(null);
    try {
      const response = await fetch('/api/ai/parenting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: 'coding and graphic design' })
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setParentTips(data.advice);
    } catch {
      // Offline fallback parenting advice
      setParentTips(
        "**1. Encourage Screen-Time Creation**:\nHave your child build small mock websites or graphics instead of only playing video streams.\n\n" +
        "**2. Gamify Algorithmic Exercises**:\nHelp them decompose daily schedules or recipes into algorithmic sequences.\n\n" +
        "**3. Treat bugs as data**:\nEncourage diagnostic patience when their code loops fail."
      );
    } finally {
      setIsLoadingTips(false);
    }
  };

  // Approve sponsorship disbursement by Admin or Sponsor
  const handleApproveSponsorship = async (id: string) => {
    await updateSponsorshipStatus(id, 'approved');
    const spons = await getSponsorships();
    setSponsorships(spons);
    onTriggerNotification("Sponsorship authorized. Funds queued for transfer.");
  };

  // Render Functions for the 8 PRD Workspaces
  
  // 1. STUDENT
  const renderStudentWorkspace = () => (
    <div className="space-y-6">
      
      {/* Top Ranks & XP Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="block text-[10px] text-gray-500 font-mono uppercase">Your Learning XP Meter</span>
            <p className="text-3xl font-black text-emerald-400 mt-1">{studentXP} XP</p>
            <p className="text-[10px] text-slate-400 mt-1.5">Earn 50 XP per completed syllabus task</p>
          </div>
          <Award className="w-12 h-12 text-emerald-400" />
        </div>

        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
          <span className="block text-[10px] text-gray-500 font-mono uppercase">Level Progress</span>
          <div className="w-full bg-slate-950 h-2.5 rounded-full mt-3.5 relative overflow-hidden border border-slate-800">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '60%' }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-2.5">
            <span>Rank: Junior Dev</span>
            <span>60% to Senior Dev</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="block text-[10px] text-gray-500 font-mono uppercase">Earned Badges</span>
            <div className="flex gap-2 mt-2.5">
              <span className="bg-emerald-500/15 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-500/25">HTML Pro</span>
              <span className="bg-indigo-600/15 text-indigo-400 text-[9px] font-bold px-2 py-0.5 rounded border border-indigo-500/25">JS Coder</span>
            </div>
          </div>
          <Sparkles className="w-8 h-8 text-indigo-400" />
        </div>
      </div>

      {/* Flagship Course list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><BookOpen className="w-4.5 h-4.5 text-emerald-400" /> Your Enrolled Coursework</h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-bold">Vite & Full-Stack React Core</h4>
              <p className="text-[10px] text-slate-400">Instructors: Dr. Sarah Carter & Mr. Babajide Alao</p>
              <div className="flex items-center gap-2 pt-2">
                <span className="text-[10px] text-emerald-400 font-bold font-mono">100% Tasks Complete</span>
              </div>
            </div>
            <button
              onClick={() => onOpenCertificateModal(currentUser.displayName || 'Adebayo Oluwaseun', 'Vite & Full-Stack React Core')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors"
            >
              Claim Diploma
            </button>
          </div>
        </div>

        {/* Sponsor request forms */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Users className="w-4.5 h-4.5 text-indigo-400" /> Seek Sponsor Funding</h3>
          {sponsorSubmitted ? (
            <div className="bg-emerald-950/20 border border-emerald-500/10 p-4 rounded-xl text-[11px] space-y-2">
              <p className="font-semibold text-emerald-400 flex items-center gap-1"><Check className="w-4 h-4" /> Application Submitted</p>
              <p className="text-slate-400">Corporate sponsors have been notified of your need. Check active approvals tab regularly!</p>
            </div>
          ) : (
            <form onSubmit={handleRequestSponsorship} className="space-y-3 text-xs">
              <p className="text-[10px] text-slate-400">Need sponsorship for physical classes, local laptops, or internet stipends?</p>
              <button
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-850 text-emerald-400 border border-slate-800 font-bold py-2 rounded-xl cursor-pointer"
              >
                Apply for Regional Student Aid (₦25,000 value)
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Real-time mentor chat widget */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5"><Brain className="w-4.5 h-4.5 text-emerald-400" /> Mentor Support Desk</h3>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 h-48 overflow-y-auto space-y-3 flex flex-col justify-end">
          {studentChat.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.senderId === 'mentor' ? 'items-start' : 'items-end'}`}>
              <div className={`p-2.5 rounded-xl text-[11px] max-w-md ${msg.senderId === 'mentor' ? 'bg-slate-900 text-white rounded-bl-none' : 'bg-emerald-500 text-slate-950 rounded-br-none font-medium'}`}>
                <p className="font-mono text-[8px] opacity-75 mb-0.5">{msg.senderName}</p>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleStudentSendMessage} className="flex gap-2">
          <input
            type="text"
            value={studentChatInput}
            onChange={(e) => setStudentChatInput(e.target.value)}
            placeholder="Type code inquiry to Sarah Carter..."
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400"
          />
          <button
            type="submit"
            className="bg-emerald-500 text-slate-950 font-bold px-4 rounded-xl text-xs cursor-pointer hover:bg-emerald-400"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );

  // 2. PARENT
  const renderParentWorkspace = () => (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Child performance tracking */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><User className="w-4.5 h-4.5 text-emerald-400" /> Student Progress tracking</h3>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs space-y-3">
            <div className="flex justify-between font-bold text-white">
              <span>Adebayo Oluwaseun</span>
              <span className="text-emerald-400 font-mono">85% Complete</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-[10px] text-slate-400">Syllabus: Vite & Full-Stack React Core • Completed tasks: 12/14</p>
          </div>
          <button
            onClick={() => onEnrollViaPaystack(15000, "Student/Parent Online Term Fee")}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl cursor-pointer text-xs"
          >
            Pay Course Term Dues (₦15,000 NGN)
          </button>
        </div>

        {/* AI PARENTING TIPS VIA GEMINI */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Brain className="w-4.5 h-4.5 text-indigo-400" /> Gemini AI Parenting Advisor</h3>
          <p className="text-[10px] text-slate-400">Query the Gemini model for short, actionable technical learning tips for kids.</p>
          
          <button
            onClick={fetchParentingTips}
            disabled={isLoadingTips}
            className="bg-slate-950 hover:bg-slate-850 text-indigo-400 border border-slate-850 font-bold py-2 rounded-xl cursor-pointer text-xs w-full flex items-center justify-center gap-2"
          >
            {isLoadingTips ? 'Connecting Gemini...' : 'Generate New Parenting Tips'}
          </button>

          {parentTips && (
            <div className="bg-slate-950/80 border border-indigo-500/10 p-4 rounded-xl text-[11px] leading-relaxed space-y-2 max-h-48 overflow-y-auto">
              {parentTips.split('\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );

  // 3. TEACHER
  const renderTeacherWorkspace = () => (
    <div className="space-y-6">
      
      {/* Commission Tracker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
          <span className="block text-[10px] text-gray-500 font-mono uppercase">20% Referrals Commission</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">₦35,000</p>
          <p className="text-[10px] text-slate-400 mt-1.5">Earned from 3 facilitated student payments</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
          <span className="block text-[10px] text-gray-500 font-mono uppercase">Active Cohorts</span>
          <p className="text-3xl font-black text-indigo-400 mt-1">2 Classes</p>
          <p className="text-[10px] text-slate-400 mt-1.5">Lagos Hub Physical & Virtual Dev 12</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl">
          <span className="block text-[10px] text-gray-500 font-mono uppercase">Pending Payments</span>
          <p className="text-3xl font-black text-slate-400 mt-1">₦0.00</p>
          <p className="text-[10px] text-slate-400 mt-1.5">Paid bi-weekly on the 15th and 30th</p>
        </div>
      </div>

      {/* Roster Controls */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Users className="w-4.5 h-4.5 text-emerald-400" /> Student Cohort Roster</h3>
          <button
            onClick={() => onOpenManageStudentModal('Enroll')}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Enroll New Student
          </button>
        </div>

        <div className="space-y-2">
          {roster.map((st, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
              <div>
                <p className="font-bold text-white">{st.name}</p>
                <p className="text-[10px] text-slate-400">{st.email}</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono">
                <span>XP Progress: <strong className="text-emerald-400">{st.xp} XP</strong></span>
                <span className="bg-slate-900 text-indigo-400 border border-indigo-500/10 px-2 py-0.5 rounded">{st.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );

  // 4. SCHOOL ADMIN
  const renderSchoolAdminWorkspace = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bulk Student Invite and discount setup */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Users className="w-4.5 h-4.5 text-indigo-400" /> Multi-Student Licensing</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            School administrators are authorized to configure bulk-billing packages. Access is discounted at 50% course fee rates.
          </p>
          <button
            onClick={() => onOpenManageStudentModal('Add')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl cursor-pointer text-xs"
          >
            Add Bulk Cohort Roster
          </button>
        </div>

        {/* Teacher assignations */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Shield className="w-4.5 h-4.5 text-emerald-400" /> Teacher & Cohorts matching</h3>
          <div className="space-y-2 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
              <div>
                <p className="font-bold">Mr. Babajide Alao</p>
                <p className="text-[10px] text-slate-500">Virtual Class 12 Supervisor</p>
              </div>
              <span className="text-[10px] text-emerald-400">Assigned</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between">
              <div>
                <p className="font-bold">Dr. Sarah Carter</p>
                <p className="text-[10px] text-slate-500">Lagos Physical Lab Lead</p>
              </div>
              <span className="text-[10px] text-emerald-400">Assigned</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  // 5. MENTOR
  const renderMentorWorkspace = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mentor revenue tracker */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><DollarSign className="w-4.5 h-4.5 text-emerald-400" /> Mentor Payout shares</h3>
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 text-center">
            <span className="block text-[10px] text-slate-500 uppercase font-mono">Your 10% Mentor Commission</span>
            <p className="text-3xl font-black text-emerald-400 mt-2">₦12,500</p>
            <p className="text-[10px] text-slate-400 mt-1.5">Matching 5 mentees active subscriptions</p>
          </div>
        </div>

        {/* Assigned mentees */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Users className="w-4.5 h-4.5 text-indigo-400" /> Your Assigned Mentees</h3>
          <div className="space-y-2.5 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-center justify-between">
              <div>
                <p className="font-bold">Adebayo Oluwaseun</p>
                <p className="text-[9px] text-slate-400">Vite & React Core Student</p>
              </div>
              <span className="text-[10px] text-emerald-400">Chat Connected</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  // 6. SPONSOR
  const renderSponsorWorkspace = () => (
    <div className="space-y-6">
      
      {/* Sponsor Brandexposure */}
      <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-1.5"><Globe className="w-4.5 h-4.5 text-indigo-400" /> Your Brand Exposure banner</h3>
        <p className="text-xs text-slate-400">Customize the support banner text shown in student cohorts:</p>
        <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl text-xs">
          <p className="font-semibold text-emerald-400">"Sponsored with Pride by Salami Consult Ltd"</p>
          <p className="text-[10px] text-slate-500 mt-1">Impression count: 1,420 views</p>
        </div>
      </div>

      {/* Review pending requests */}
      <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-1.5"><DollarSign className="w-4.5 h-4.5 text-emerald-400" /> Review Student Sponsorship Appeals</h3>
        
        {sponsorships.length === 0 ? (
          <p className="text-xs text-slate-500">No active student sponsorship requests logged yet.</p>
        ) : (
          <div className="space-y-3 text-xs">
            {sponsorships.map(req => (
              <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <p className="font-bold">{req.studentName} <span className="text-[9px] font-normal text-slate-400">({req.studentEmail})</span></p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">Reason: {req.reason}</p>
                  <p className="text-[10px] font-mono font-bold text-indigo-400">Funding Requested: ₦{(req.fundingNeeded || 25000).toLocaleString()}</p>
                </div>
                {req.status === 'Pending' ? (
                  <button
                    onClick={() => handleApproveSponsorship(req.id)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-[10px]"
                  >
                    Fund Sponsorship
                  </button>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-3.5 py-1.5 rounded-lg font-bold">Approved</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );

  // 7. CLIENT
  const renderClientWorkspace = () => (
    <div className="space-y-6">
      
      {/* Brand Audit & Book Appointments CTA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Globe className="w-4.5 h-4.5 text-indigo-400" /> Brand SEO & Performance Audits</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Submit your business domains! Our platform computes custom site speed, SEO rankings, and localized metadata metrics instantly.
          </p>
          <button
            onClick={onOpenAuditModal}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl cursor-pointer text-xs"
          >
            Request Site Brand Audit
          </button>
        </div>

        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Calendar className="w-4.5 h-4.5 text-emerald-400" /> Book Consultations</h3>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Schedule a 1-on-1 growth planning strategy meeting with Executive Consultant Abiodun Salami. Auto-generates instant Google Meet coordinates.
          </p>
          <button
            onClick={onOpenApptModal}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-xl cursor-pointer text-xs"
          >
            Schedule Meet Session
          </button>
        </div>
      </div>

      {/* active Audits display results */}
      {audits.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Completed Audit Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audits.map(audit => (
              <div key={audit.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 text-xs space-y-3">
                <div className="flex justify-between font-bold border-b border-slate-850 pb-2">
                  <span className="truncate max-w-xs">{audit.websiteUrl}</span>
                  <span className="text-emerald-400 font-mono font-black">{audit.overallScore}% Score</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-mono">
                  <div className="bg-slate-900 p-1.5 rounded">
                    <p className="text-slate-500 uppercase">SEO</p>
                    <p className="font-bold text-white">{audit.seoScore}</p>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <p className="text-slate-500 uppercase">SPEED</p>
                    <p className="font-bold text-white">{audit.speedScore}</p>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded">
                    <p className="text-slate-500 uppercase">SOCIAL</p>
                    <p className="font-bold text-white">{audit.socialScore}</p>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 font-semibold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" /> Download PDF Report
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Appointments List */}
      {appointments.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold">Scheduled Meetings</h3>
          <div className="space-y-2">
            {appointments.map(appt => (
              <div key={appt.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs gap-3">
                <div>
                  <p className="font-bold text-white">{appt.serviceType}</p>
                  <p className="text-[10px] text-slate-400">Date: {appt.dateTime ? new Date(appt.dateTime).toLocaleString() : 'N/A'}</p>
                </div>
                {appt.googleMeetLink && (
                  <a
                    href={appt.googleMeetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white px-3.5 py-1.5 rounded-lg text-[10px] border border-indigo-500/20 font-bold flex items-center gap-1 shrink-0 self-stretch sm:self-auto text-center justify-center"
                  >
                    Join Google Meet <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );

  // 8. ADMIN
  const renderAdminWorkspace = () => (
    <div className="space-y-6">
      
      {/* Platform Global statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
          <span className="block text-[9px] text-slate-500 font-mono uppercase">Platform Revenue</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">₦350,000</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
          <span className="block text-[9px] text-slate-500 font-mono uppercase">Total Commissions</span>
          <p className="text-2xl font-black text-indigo-400 mt-1">₦47,500</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
          <span className="block text-[9px] text-slate-500 font-mono uppercase">Active Bookings</span>
          <p className="text-2xl font-black text-white mt-1">{appointments.length} Meetings</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-900 p-5 rounded-2xl">
          <span className="block text-[9px] text-slate-500 font-mono uppercase">Audit Leads</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{audits.length} Sites</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Manage Appointments */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><Calendar className="w-4.5 h-4.5 text-emerald-400" /> Administrative Booking Logs</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {appointments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No active client bookings registered.</p>
            ) : (
              appointments.map(appt => (
                <div key={appt.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs">
                  <p className="font-bold text-white">{appt.clientName}</p>
                  <p className="text-[10px] text-slate-400">{appt.clientEmail}</p>
                  <p className="text-[10px] font-semibold text-emerald-400 mt-1">{appt.serviceType}</p>
                  <p className="text-[10px] text-slate-500">Date: {appt.dateTime ? new Date(appt.dateTime).toLocaleString() : 'N/A'}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Manage Sponsorship grants */}
        <div className="bg-slate-900/40 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold flex items-center gap-1.5"><DollarSign className="w-4.5 h-4.5 text-indigo-400" /> Authorize Student Sponsorship Grants</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {sponsorships.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">No active sponsorship requests.</p>
            ) : (
              sponsorships.map(req => (
                <div key={req.id} className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <p className="font-bold text-white">{req.studentName}</p>
                    <p className="text-[10px] text-slate-400">Needs: ₦{(req.fundingNeeded || 25000).toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 italic mt-0.5">"{req.reason}"</p>
                  </div>
                  {req.status === 'Pending' ? (
                    <button
                      onClick={() => handleApproveSponsorship(req.id)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1 rounded text-[10px]"
                    >
                      Disburse
                    </button>
                  ) : (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono uppercase">Granted</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );

  return (
    <div className="bg-slate-950 text-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Workspace Title bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 bg-slate-900 border border-emerald-500/10 px-2.5 py-1 rounded">
              SAC SECURE PORTAL • {currentUser.role} ROLE
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-3 flex items-center gap-2">
              Welcome, {currentUser.displayName || 'Distinguished Guest'}
            </h1>
            <p className="text-xs text-slate-400">Logged in as {currentUser.email}</p>
          </div>
          
          <button
            onClick={refreshDashboardData}
            className="bg-slate-900 hover:bg-slate-850 text-white border border-slate-850 px-4 py-2 rounded-xl text-xs cursor-pointer transition-all flex items-center justify-center gap-2 self-start"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400" /> Refresh Workspace Data
          </button>
        </div>

        {/* Dynamic Branch Render based on 8 user roles */}
        <div className="min-h-[400px]">
          {currentUser.role === 'Student' && renderStudentWorkspace()}
          {currentUser.role === 'Parent' && renderParentWorkspace()}
          {currentUser.role === 'Teacher' && renderTeacherWorkspace()}
          {currentUser.role === 'School Admin' && renderSchoolAdminWorkspace()}
          {currentUser.role === 'Mentor' && renderMentorWorkspace()}
          {currentUser.role === 'Sponsor' && renderSponsorWorkspace()}
          {currentUser.role === 'Client' && renderClientWorkspace()}
          {currentUser.role === 'Admin' && renderAdminWorkspace()}
        </div>

      </div>
    </div>
  );
}
