/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AITutorWidget from './components/AITutorWidget';
import WhatsAppWidget from './components/WhatsAppWidget';
import { 
  CompleteProfileModal, BookAppointmentModal, BrandAuditModal, 
  ManageStudentModal, CertificateModal, PremiumPurchaseModal,
  MergedAuditStrategyModal
} from './components/Modals';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import PricingPage from './pages/PricingPage';
import MarketplacePage from './pages/MarketplacePage';
import CommunityPage from './pages/CommunityPage';
import DashboardPage from './pages/DashboardPage';
import PRPage from './pages/PRPage';
import DeveloperInfoPage from './pages/DeveloperInfoPage';
import AcademyPage from './pages/AcademyPage';
import PortfolioPage from './pages/PortfolioPage';
import { UserProfile, Course, Appointment, BrandAudit } from './types';
import { 
  getAppointments, getBrandAudits, bookAppointment, saveBrandAudit, 
  loginWithGoogleSimulated, getCourses, getCurrentUserSync
} from './firebase';
import { Bell, Sparkles, Check, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Database mock states synced from firebase
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [audits, setAudits] = useState<BrandAudit[]>([]);
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; read: boolean }>>([
    { id: 'n-welcome', text: "Welcome to SAC Portal! Click 'Access Workspace' in the top header to simulate different roles.", read: false }
  ]);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal active triggers
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isApptOpen, setIsApptOpen] = useState(false);
  const [isMergedFlowOpen, setIsMergedFlowOpen] = useState(false);
  const [isManageStudentOpen, setIsManageStudentOpen] = useState(false);
  const [manageStudentMode, setManageStudentMode] = useState<'Add' | 'Enroll' | 'Assign'>('Add');
  
  // Paystack checkout modal trigger
  const [isPaystackOpen, setIsPaystackOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payPlanName, setPayPlanName] = useState<string>('');

  // Course certificate modal trigger
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [certStudentName, setCertStudentName] = useState('');
  const [certCourseTitle, setCertCourseTitle] = useState('');

  // Load database items on startup
  useEffect(() => {
    const loadData = async () => {
      try {
        const appts = await getAppointments();
        setAppointments(appts || []);
      } catch (err) {
        console.error('Error loading appointments:', err);
      }
      try {
        const brandAudits = await getBrandAudits();
        setAudits(brandAudits || []);
      } catch (err) {
        console.error('Error loading brand audits:', err);
      }
    };
    loadData();
    
    // Load previously logged-in user if exists, or start as logged out (null)
    const storedUser = getCurrentUserSync();
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  // Helper to trigger a temporary popup notification toast
  const triggerToast = (text: string) => {
    setToastMessage(text);
    // Also push to persistent header list
    setNotifications(prev => [
      { id: `n-${Date.now()}`, text, read: false },
      ...prev
    ]);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Profile Save handler
  const handleSaveProfileFields = (fields: Partial<UserProfile>) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, ...fields } : null);
      triggerToast(`Account profile for ${fields.displayName || 'user'} completed successfully!`);
    }
  };

  // Save brand audit request
  const handleRequestBrandAudit = async (fields: { clientName: string; clientEmail: string; websiteUrl: string; industry: string; primaryGoal: string }) => {
    const audit = await saveBrandAudit({
      clientName: fields.clientName,
      clientEmail: fields.clientEmail,
      websiteUrl: fields.websiteUrl,
      industry: fields.industry,
      primaryGoal: fields.primaryGoal
    });

    setAudits(prev => [audit, ...prev]);
    triggerToast(`Brand Audit SEO metrics computed for ${fields.websiteUrl}. Score: ${audit.scores?.seo || 80}%`);
    setActivePage('dashboard');
  };

  // Save combined Brand Audit & Strategy Meeting request
  const handleMergedAuditStrategy = async (fields: {
    clientName: string;
    clientEmail: string;
    websiteUrl: string;
    industry: string;
    primaryGoal: string;
    dateTime: string;
    serviceType: string;
    companyName?: string;
  }) => {
    const audit = await saveBrandAudit({
      clientName: fields.clientName,
      clientEmail: fields.clientEmail,
      websiteUrl: fields.websiteUrl,
      industry: fields.industry,
      primaryGoal: fields.primaryGoal
    });
    setAudits(prev => [audit, ...prev]);

    const appt = await bookAppointment({
      clientName: fields.clientName,
      clientEmail: fields.clientEmail,
      dateTime: fields.dateTime,
      serviceType: fields.serviceType,
      companyName: fields.companyName
    });
    setAppointments(prev => [appt, ...prev]);

    triggerToast(`Success! SEO metrics compiled (${audit.scores?.seo || 85}%) & strategy meeting booked!`);
    setActivePage('dashboard');
  };

  // Save consulting appointment
  const handleBookAppointment = async (fields: { clientName: string; clientEmail: string; dateTime: string; serviceType: string; companyName?: string }) => {
    const appt = await bookAppointment({
      clientName: fields.clientName,
      clientEmail: fields.clientEmail,
      dateTime: fields.dateTime,
      serviceType: fields.serviceType,
      companyName: fields.companyName
    });

    setAppointments(prev => [appt, ...prev]);
    triggerToast(`Appointment booked! Google Meet link created: ${appt.meetLink}`);
    setActivePage('dashboard');
  };

  // Enrolling via Paystack Checkout modal trigger
  const handleCheckoutTrigger = (amount: number, planName: string) => {
    setPayAmount(amount);
    setPayPlanName(planName);
    setIsPaystackOpen(true);
  };

  // Payment completed callback handler
  const handlePaymentSuccess = (payerEmail: string) => {
    triggerToast(`Success! Payment of ₦${(payAmount || 0).toLocaleString()} NGN processed via Paystack. Enrolled!`);
    // If user is logged in, grant full access
    if (currentUser) {
      setCurrentUser(prev => prev ? { ...prev, accessLevel: 'Premium' } : null);
    }
  };

  // Manage cohorts add/enroll student handler
  const handleManageStudent = (fields: { email: string; displayName: string; courseId: string; paidBy: string }) => {
    triggerToast(`Student "${fields.displayName}" successfully enrolled in course. Access authorized.`);
  };

  const handleOpenCertificate = (studentName: string, courseTitle: string) => {
    setCertStudentName(studentName);
    setCertCourseTitle(courseTitle);
    setIsCertificateOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 font-sans text-slate-100">
      
      {/* HEADER SECTION */}
      <Header
        currentUser={currentUser}
        onNavigate={(page) => setActivePage(page)}
        activePage={activePage}
        onUserChanged={(user) => {
          setCurrentUser(user);
          if (user) {
            triggerToast(`Logged into simulated ${user.role} workspace.`);
          } else {
            triggerToast('Signed out of SAC Portal.');
          }
        }}
        notifications={notifications}
        onMarkNotificationsRead={markAllNotificationsRead}
      />

      {/* FLOATING TOAST NOTIFICATION IF ACTIVE */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 max-w-sm bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl p-4 flex items-start gap-3 text-xs animate-bounce">
          <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white">System Alert</h4>
            <p className="text-slate-400 mt-1 leading-relaxed">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* CORE ROUTING ENGINE */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <HomePage 
            onNavigate={(page) => setActivePage(page)}
            onOpenAuditModal={() => setIsAuditOpen(true)}
            onOpenApptModal={() => setIsApptOpen(true)}
            onOpenMergedModal={() => setIsMergedFlowOpen(true)}
          />
        )}
        
        {activePage === 'courses' && (
          <CoursesPage 
            onEnroll={(course) => handleCheckoutTrigger(course.price, `Academy Course: ${course.title}`)}
          />
        )}

        {activePage === 'pricing' && (
          <PricingPage 
            onSelectPlan={(amount, name) => handleCheckoutTrigger(amount, name)}
          />
        )}

        {activePage === 'marketplace' && (
          <MarketplacePage 
            onCheckout={(amount, name) => handleCheckoutTrigger(amount, name)}
            onTriggerNotification={(text) => triggerToast(text)}
          />
        )}

        {activePage === 'community' && (
          <CommunityPage onTriggerNotification={(text) => triggerToast(text)} />
        )}

        {activePage === 'pr' && (
          <PRPage />
        )}

        {activePage === 'portfolio' && (
          <PortfolioPage 
            onNavigate={(page) => setActivePage(page)}
            onOpenAuditModal={() => setIsAuditOpen(true)}
            onOpenApptModal={() => setIsApptOpen(true)}
          />
        )}

         {activePage === 'academy' && (
          <AcademyPage 
            onEnroll={(course) => handleCheckoutTrigger(course.price, `Academy Course: ${course.title}`)}
            onSelectPlan={(amount, name) => handleCheckoutTrigger(amount, name)}
            currentUser={currentUser}
            onUserChanged={(user) => {
              setCurrentUser(user);
              if (user) {
                triggerToast(`Logged into simulated ${user.role} workspace.`);
              } else {
                triggerToast('Signed out of SAC Portal.');
              }
            }}
            onNavigate={(page) => setActivePage(page)}
          />
        )}

        {activePage === 'devinfo' && (
          <DeveloperInfoPage />
        )}

        {activePage === 'dashboard' && currentUser && (
          <DashboardPage 
            currentUser={currentUser}
            onNavigate={(page) => setActivePage(page)}
            onOpenAuditModal={() => setIsAuditOpen(true)}
            onOpenApptModal={() => setIsApptOpen(true)}
            onOpenManageStudentModal={(mode) => {
              setManageStudentMode(mode);
              setIsManageStudentOpen(true);
            }}
            onTriggerNotification={(text) => triggerToast(text)}
            onOpenCertificateModal={handleOpenCertificate}
            onEnrollViaPaystack={(amount, name) => handleCheckoutTrigger(amount, name)}
            appointments={appointments}
            audits={audits}
          />
        )}
      </main>

      {/* FOOTER SECTION */}
      <Footer onNavigate={(page) => setActivePage(page)} />

      {/* FLOATING WIDGETS CO-ORDINATOR */}
      {activePage === 'academy' && (
        <AITutorWidget />
      )}
      {activePage === 'home' && (
        <WhatsAppWidget />
      )}

      {/* ACTIVE MODALS PORTAL CO-ORDINATOR */}
      {currentUser && !currentUser.profileCompleted && (
        <CompleteProfileModal
          isOpen={true}
          user={currentUser}
          onSave={handleSaveProfileFields}
        />
      )}

      <BookAppointmentModal
        isOpen={isApptOpen}
        onClose={() => setIsApptOpen(false)}
        onBook={handleBookAppointment}
        clientEmail={currentUser?.email}
        clientName={currentUser?.displayName}
      />

      <BrandAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        onSubmit={handleRequestBrandAudit}
        clientEmail={currentUser?.email}
        clientName={currentUser?.displayName}
      />

      <MergedAuditStrategyModal
        isOpen={isMergedFlowOpen}
        onClose={() => setIsMergedFlowOpen(false)}
        onSubmit={handleMergedAuditStrategy}
        clientEmail={currentUser?.email}
        clientName={currentUser?.displayName}
      />

      <ManageStudentModal
        isOpen={isManageStudentOpen}
        onClose={() => setIsManageStudentOpen(false)}
        onSave={handleManageStudent}
        courses={getCourses()}
        mode={manageStudentMode}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        studentName={certStudentName}
        courseTitle={certCourseTitle}
      />

      <PremiumPurchaseModal
        isOpen={isPaystackOpen}
        onClose={() => setIsPaystackOpen(false)}
        amount={payAmount}
        planName={payPlanName}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
