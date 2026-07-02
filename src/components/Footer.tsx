/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, Linkedin, Twitter, Globe } from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="font-extrabold text-white text-sm tracking-tight">SAC Ecosystem</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            A comprehensive consultancy integrating highly specialized digital marketing services with an industry-grade EdTech learning hub, Resource Vault templates, and gamified multi-role portals.
          </p>
          <div className="flex gap-3 text-slate-500 text-xs">
            <a href="#" className="hover:text-emerald-400 transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-emerald-400 transition-colors"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="hover:text-emerald-400 transition-colors"><Globe className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Sectors Column */}
        <div>
          <h4 className="text-sm font-semibold text-emerald-400 mb-4 tracking-wider uppercase">Our Pillars</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer text-left">
                SAC Advertising Agency
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('courses')} className="hover:text-white transition-colors cursor-pointer text-left">
                Academy Learning Hub
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('marketplace')} className="hover:text-white transition-colors cursor-pointer text-left">
                Resource Vault (Products)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('community')} className="hover:text-white transition-colors cursor-pointer text-left">
                Mentorship Programs
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Public Info */}
        <div>
          <h4 className="text-sm font-semibold text-emerald-400 mb-4 tracking-wider uppercase">Resources</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors cursor-pointer text-left">
                Membership Plans & Pricing
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('pr')} className="hover:text-white transition-colors cursor-pointer text-left">
                Press Releases & News
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('devinfo')} className="hover:text-white transition-colors cursor-pointer text-left">
                Developer Specifications
              </button>
            </li>
            <li>
              <a href="mailto:info.salamiabiodunconsult@gmail.com" className="hover:text-white transition-colors flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> SAC Help Desk
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Newsletter */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-emerald-400 mb-4 tracking-wider uppercase">Get In Touch</h4>
          <div className="space-y-2 text-xs text-slate-400">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Salami Abiodun Consult Head Office, Nigeria</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href="mailto:info.salamiabiodunconsult@gmail.com" className="hover:text-white transition-colors truncate">
                info.salamiabiodunconsult@gmail.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>+234 801 111 2222</span>
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="pt-2">
            <p className="text-[10px] text-gray-500 mb-1.5">Subscribe to SAC insights:</p>
            <div className="flex gap-1.5">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 flex-1 min-w-0"
              />
              <button
                type="submit"
                className="bg-emerald-500 text-slate-950 px-2.5 py-1.5 rounded-lg hover:bg-emerald-400 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              >
                {subscribed ? 'Joined!' : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-4">
        <p>SAC Portal Ecosystem © 2026. All Rights Reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-300">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300">Terms of Use</a>
          <a href="#" className="hover:text-slate-300">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
