/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Menu, X, Bell, LogIn, LogOut, ChevronDown, User, Sparkles, BookOpen, 
  ShoppingBag, ShieldAlert, Award, Calendar, Globe, DollarSign, UserPlus
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { 
  triggerSignOut,
  signInWithEmailReal,
  signUpWithEmailReal,
  signInWithGoogleReal
} from '../firebase';
import Logo from './Logo';

interface HeaderProps {
  currentUser: UserProfile | null;
  onNavigate: (page: string) => void;
  activePage: string;
  onUserChanged: (user: UserProfile | null) => void;
  notifications: Array<{ id: string; text: string; read: boolean }>;
  onMarkNotificationsRead: () => void;
  isAuthModalOpen?: boolean;
  setIsAuthModalOpen?: (isOpen: boolean) => void;
  authTab?: 'signin' | 'signup';
  setAuthTab?: (tab: 'signin' | 'signup') => void;
  isAdminAuth?: boolean;
  setIsAdminAuth?: (val: boolean) => void;
}

export default function Header({
  currentUser,
  onNavigate,
  activePage,
  onUserChanged,
  notifications,
  onMarkNotificationsRead,
  isAuthModalOpen: propIsAuthModalOpen,
  setIsAuthModalOpen: propSetIsAuthModalOpen,
  authTab: propAuthTab,
  setAuthTab: propSetAuthTab,
  isAdminAuth,
  setIsAdminAuth
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  
  const [localIsAuthModalOpen, setLocalIsAuthModalOpen] = useState(false);
  const [localAuthTab, setLocalAuthTab] = useState<'signin' | 'signup'>('signin');

  const isAuthModalOpen = propIsAuthModalOpen !== undefined ? propIsAuthModalOpen : localIsAuthModalOpen;
  const setIsAuthModalOpen = propSetIsAuthModalOpen !== undefined ? propSetIsAuthModalOpen : setLocalIsAuthModalOpen;
  const authTab = propAuthTab !== undefined ? propAuthTab : localAuthTab;
  const setAuthTab = propSetAuthTab !== undefined ? propSetAuthTab : setLocalAuthTab;
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('Student');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const availableRoles: { role: UserRole; label: string; desc: string; icon: any }[] = [
    { role: 'Student', label: 'Student Workspace', desc: 'Track XP, Badges & Learn', icon: Award },
    { role: 'Parent', label: 'Parent Workspace', desc: 'Monitor Progress & Advise', icon: User },
    { role: 'Teacher', label: 'Teacher Dashboard', desc: 'Manage Students & Commissions', icon: BookOpen },
    { role: 'School Admin', label: 'School Portal', desc: 'Institution Rosters & Billing', icon: ShieldAlert },
    { role: 'Mentor', label: 'Mentor Hub', desc: 'Guided Mentees & Real-time chat', icon: Globe },
    { role: 'Sponsor', label: 'Sponsorship Desk', desc: 'Fund Technical Talents', icon: DollarSign },
    { role: 'Client', label: 'Client Workspace', desc: 'Brand Audits & Calendar Bookings', icon: Calendar },
    { role: 'Admin', label: 'Global Administration', desc: 'Revenue, Leads & platform controls', icon: Sparkles }
  ];

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      const profile = await signInWithEmailReal(signInEmail, signInPassword);
      onUserChanged(profile);
      setIsAuthModalOpen(false);
      setSignInEmail('');
      setSignInPassword('');
      onNavigate('dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      sessionStorage.setItem('selected_role', signUpRole);
      const profile = await signUpWithEmailReal(signUpEmail, signUpPassword, signUpName, signUpRole);
      onUserChanged(profile);
      setIsAuthModalOpen(false);
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      onNavigate('dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to register account.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      sessionStorage.setItem('selected_role', signUpRole);
      const profile = await signInWithGoogleReal(signUpRole);
      onUserChanged(profile);
      setIsAuthModalOpen(false);
      onNavigate('dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Google Sign-In failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    const isAcademyRole = currentUser && ['Student', 'Parent', 'Teacher', 'School Admin', 'Mentor', 'Sponsor'].includes(currentUser.role);
    await triggerSignOut();
    onUserChanged(null);
    if (isAcademyRole || activePage === 'academy') {
      onNavigate('academy');
    } else {
      onNavigate('home');
    }
  };

  const rolesToDisplay = isAdminAuth
    ? availableRoles.filter(item => item.role === 'Admin')
    : activePage === 'home'
      ? availableRoles.filter(item => item.role === 'Client')
      : availableRoles.filter(item => item.role !== 'Client' && item.role !== 'Admin');

  React.useEffect(() => {
    if (isAdminAuth) {
      setSignUpRole('Admin');
    } else if (activePage === 'home') {
      setSignUpRole('Client');
    } else {
      setSignUpRole('Student');
    }
  }, [activePage, isAuthModalOpen, isAdminAuth]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'home' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'portfolio' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => onNavigate('academy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'academy' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Academy
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'marketplace' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Resource Vault
            </button>
            <button
              onClick={() => onNavigate('community')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'community' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => onNavigate('pricing')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'pricing' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Pricing Plans
            </button>
            <button
              onClick={() => onNavigate('pr')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'pr' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Press
            </button>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`hidden md:block px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-all ${
                  activePage === 'dashboard' 
                    ? 'bg-emerald-500 text-slate-950 border-emerald-500' 
                    : 'text-emerald-400 border-emerald-400/30 hover:bg-emerald-500/10'
                }`}
              >
                Access Dashboard
              </button>
            )}

            {/* Notifications */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setIsNotifDropdownOpen(!isNotifDropdownOpen);
                    if (!isNotifDropdownOpen) onMarkNotificationsRead();
                  }}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-900 rounded-full cursor-pointer transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950 animate-ping"></span>
                  )}
                </button>
                {isNotifDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2.5 text-xs z-50 text-slate-200">
                    <h4 className="font-semibold text-white pb-1.5 mb-1.5 border-b border-slate-800 flex justify-between">
                      <span>Notifications</span>
                      {unreadCount > 0 && <span className="text-[10px] text-emerald-400 font-mono">({unreadCount} new)</span>}
                    </h4>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-2">No notifications yet</p>
                      ) : (
                        notifications.map(notif => (
                          <div key={notif.id} className="p-1.5 bg-slate-950/50 rounded border border-slate-800/30">
                            <p className="text-[10px] leading-tight">{notif.text}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sign Up / Sign In Block */}
            {!currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthTab('signin');
                    setIsAuthModalOpen(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Join Now</span>
                </button>
              </div>
            ) : (
              /* User Profile Menu */
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer font-medium tracking-wide transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="max-w-[100px] truncate">{currentUser.displayName || 'My Profile'}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-left">
                    <div className="border-b border-slate-800 pb-3 mb-3">
                      <p className="text-xs font-bold text-white truncate">{currentUser.displayName || 'User Profile'}</p>
                      <p className="text-[10px] text-gray-400 truncate">{currentUser.email}</p>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                        <p className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">Assigned Role</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span className="text-xs font-semibold text-emerald-400">{currentUser.role}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left p-2 rounded-xl hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-900 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-2">
          <button
            onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('portfolio'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Portfolio
          </button>
          <button
            onClick={() => { onNavigate('academy'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Academy
          </button>
          <button
            onClick={() => { onNavigate('marketplace'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Resource Vault
          </button>
          <button
            onClick={() => { onNavigate('community'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Community
          </button>
          <button
            onClick={() => { onNavigate('pricing'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Pricing Plans
          </button>
          <button
            onClick={() => { onNavigate('pr'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Press
          </button>
          {!currentUser ? (
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setAuthTab('signin');
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-center px-3 py-2.5 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl cursor-pointer shadow-md transition-colors"
              >
                Join Now
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <p className="px-3 text-[9px] text-gray-500 uppercase font-mono">Active Workspace: {currentUser.role}</p>
              <button
                onClick={() => { onNavigate('dashboard'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-emerald-400 bg-slate-950 hover:bg-slate-800 rounded-lg border border-emerald-500/20 cursor-pointer"
              >
                Access Dashboard
              </button>
              <button
                onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
      {/* UNIFIED AUTH MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-5 text-left">
            <button 
              onClick={() => {
                setIsAuthModalOpen(false);
                setAuthError(null);
                if (setIsAdminAuth) setIsAdminAuth(false);
              }} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <div>
                <h3 className="text-lg font-black text-white leading-none">Access SAC Ecosystem</h3>
                <p className="text-[10px] text-gray-400 mt-1">Live Firestore portal and course workspaces</p>
              </div>
            </div>

            {/* Segmented Tab Controls */}
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signin');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authTab === 'signin'
                    ? 'bg-slate-800 text-emerald-400 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signup');
                  setAuthError(null);
                }}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authTab === 'signup'
                    ? 'bg-slate-800 text-emerald-400 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Join Now
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[11px] p-3 rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form Content */}
            {authTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., adebayo@example.com"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-black py-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <LogIn className="w-3.5 h-3.5" />
                  )}
                  <span>Sign In</span>
                </button>

                <div className="relative py-2 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800/80"></div></div>
                  <span className="relative bg-slate-900 px-3 text-[9px] font-mono uppercase text-slate-500 tracking-wider">or continue with</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold py-2 rounded-xl transition-all cursor-pointer text-xs flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.5 15.01 0 12 0 7.34 0 3.39 2.67 1.46 6.56l3.86 3C6.23 6.94 8.89 5.04 12 5.04z"/>
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.88 3.39-8.54z"/>
                    <path fill="#FBBC05" d="M5.32 14.44a7.16 7.16 0 0 1 0-4.88l-3.86-3a11.96 11.96 0 0 0 0 10.88l3.86-3z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.79 1.09-3.11 0-5.77-1.9-6.72-4.52l-3.86 3C3.39 21.33 7.34 24 12 24z"/>
                  </svg>
                  <span>Sign In with Google</span>
                </button>
              </form>
            )}

            {authTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Adebayo Oluwaseun"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., adebayo@example.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Select Profile Role</label>
                  <select
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 text-xs font-medium"
                  >
                    {rolesToDisplay.map(item => (
                      <option key={item.role} value={item.role} className="text-slate-900 bg-white">
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-white hover:bg-slate-50 text-slate-950 border border-slate-200 font-black py-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authLoading ? (
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserPlus className="w-3.5 h-3.5" />
                  )}
                  <span>Join Now / Create Account</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
