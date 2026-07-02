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
import { loginWithGoogleSimulated, triggerSignOut } from '../firebase';
import Logo from './Logo';

interface HeaderProps {
  currentUser: UserProfile | null;
  onNavigate: (page: string) => void;
  activePage: string;
  onUserChanged: (user: UserProfile | null) => void;
  notifications: Array<{ id: string; text: string; read: boolean }>;
  onMarkNotificationsRead: () => void;
}

export default function Header({
  currentUser,
  onNavigate,
  activePage,
  onUserChanged,
  notifications,
  onMarkNotificationsRead
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('Student');

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

  const handleRoleSelect = async (role: UserRole) => {
    setIsRoleDropdownOpen(false);
    const profile = await loginWithGoogleSimulated(role);
    onUserChanged(profile);
    
    // Redirect students and clients directly to their dashboard workspaces to save clicks!
    onNavigate('dashboard');
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mockUid = `${signUpRole.toLowerCase()}-${Date.now()}`;
    const newProfile: UserProfile = {
      uid: mockUid,
      email: signUpEmail || `${signUpRole.toLowerCase()}@sac.com`,
      displayName: signUpName || `New ${signUpRole}`,
      role: signUpRole,
      profileCompleted: false, // forces the complete profile flow popup
      xp: signUpRole === 'Student' ? 100 : undefined,
      badges: signUpRole === 'Student' ? ['New Member'] : undefined
    };
    
    onUserChanged(newProfile);
    
    // Reset form fields
    setSignUpName('');
    setSignUpEmail('');
    setSignUpRole('Student');
    
    onNavigate('dashboard');
  };

  const handleSignOut = async () => {
    await triggerSignOut();
    onUserChanged(null);
    onNavigate('home');
  };

  const rolesToDisplay = activePage === 'home'
    ? availableRoles.filter(item => item.role === 'Client' || item.role === 'Admin')
    : availableRoles.filter(item => item.role !== 'Client' && item.role !== 'Admin');

  React.useEffect(() => {
    if (activePage === 'home') {
      setSignUpRole('Client');
    } else {
      setSignUpRole('Student');
    }
  }, [activePage, isAuthModalOpen]);

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
            <button
              onClick={() => onNavigate('devinfo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activePage === 'devinfo' ? 'bg-slate-900 text-emerald-400' : 'text-gray-300 hover:text-white hover:bg-slate-900/50'
              }`}
            >
              Dev Info
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
                Go to Workspace
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
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Sign Up</span>
                </button>
              </div>
            ) : (
              /* Role Switcher for logged in users */
              <div className="relative">
                <button
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer font-medium tracking-wide transition-all"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{currentUser.role}</span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-72 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-50 text-left">
                    <div className="px-2 py-1.5 border-b border-slate-800 mb-2">
                      <p className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">SAC Multi-Role Simulator</p>
                      <p className="text-[9px] text-gray-400">Select any role to simulate immediate workspace state access:</p>
                    </div>
                    <div className="space-y-1 max-h-80 overflow-y-auto">
                      {availableRoles.map(item => {
                        const Icon = item.icon;
                        const isSelected = currentUser?.role === item.role;
                        return (
                          <button
                            key={item.role}
                            onClick={() => handleRoleSelect(item.role)}
                            className={`w-full text-left p-2 rounded-xl transition-all cursor-pointer flex items-center gap-2.5 ${
                              isSelected 
                                ? 'bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-500/30' 
                                : 'hover:bg-slate-850 border border-transparent'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-gray-300'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-white flex items-center justify-between">
                                <span>{item.label}</span>
                                {isSelected && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono uppercase">Active</span>}
                              </p>
                              <p className="text-[9px] text-gray-400 truncate">{item.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-800">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-rose-950/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out / Exit Simulator
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
          <button
            onClick={() => { onNavigate('devinfo'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            Dev Info
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
                Sign In / Sign Up
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800 space-y-1">
              <p className="px-3 text-[9px] text-gray-500 uppercase font-mono">Active Workspace: {currentUser.role}</p>
              <button
                onClick={() => { onNavigate('dashboard'); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-xs font-medium text-emerald-400 bg-slate-950 hover:bg-slate-800 rounded-lg border border-emerald-500/20 cursor-pointer"
              >
                Go to Workspace
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
              onClick={() => setIsAuthModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <div>
                <h3 className="text-lg font-black text-white leading-none">Access SAC Ecosystem</h3>
                <p className="text-[10px] text-gray-400 mt-1">Simulated portal and course workspace access</p>
              </div>
            </div>

            {/* Segmented Tab Controls */}
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => setAuthTab('signin')}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authTab === 'signin'
                    ? 'bg-slate-800 text-emerald-400 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In (Simulate)
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authTab === 'signup'
                    ? 'bg-slate-800 text-emerald-400 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Form Content */}
            {authTab === 'signin' ? (
              <div className="space-y-3">
                <div className="pb-1">
                  <p className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">SAC Multi-Role Simulator</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">Select a pre-configured profile role to enter immediately:</p>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {rolesToDisplay.map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.role}
                        onClick={() => {
                          handleRoleSelect(item.role);
                          setIsAuthModalOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-850/80 border border-slate-850/40 hover:border-emerald-500/20 transition-all cursor-pointer flex items-center gap-3 group"
                      >
                        <div className="p-2 rounded-xl bg-slate-900 text-gray-400 group-hover:text-emerald-400 transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                            {item.label}
                          </p>
                          <p className="text-[9px] text-gray-400 truncate">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  handleSignUpSubmit(e);
                  setIsAuthModalOpen(false);
                }} 
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Adebayo Oluwaseun"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
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
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 placeholder-slate-400 text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">Select Profile Role</label>
                  <select
                    value={signUpRole}
                    onChange={(e) => setSignUpRole(e.target.value as UserRole)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-400 text-slate-900 text-xs font-medium"
                  >
                    {rolesToDisplay.map(item => (
                      <option key={item.role} value={item.role} className="text-slate-900">
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-md mt-2"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register & Complete Profile</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
