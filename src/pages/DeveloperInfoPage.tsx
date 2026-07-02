/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Key, Database, RefreshCw, Cpu, Server, Terminal, ExternalLink } from 'lucide-react';

export default function DeveloperInfoPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-3 mb-16">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center justify-center gap-2">
          <Terminal className="w-8 h-8 text-indigo-400" />
          Developer Specifications
        </h1>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          System documentation, API bindings, and environmental variables for the Salami Abiodun Consult (SAC) full-stack web application.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Core Architecture */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-indigo-400" /> Core Tech Stack & Libraries
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 bg-slate-950 px-1.5 py-0.2 rounded shrink-0">Framework</span>
              <span>React 19 + TypeScript (TSX) + Vite 6</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 bg-slate-950 px-1.5 py-0.2 rounded shrink-0">Animation</span>
              <span>Motion (motion/react) for transition physics</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 bg-slate-950 px-1.5 py-0.2 rounded shrink-0">Styling</span>
              <span>Tailwind CSS with custom system typography</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-indigo-400 bg-slate-950 px-1.5 py-0.2 rounded shrink-0">Database</span>
              <span>Firestore cloud persistence with client LocalStorage fallback simulation</span>
            </li>
          </ul>
        </div>

        {/* API Credentials */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4.5 h-4.5 text-emerald-400" /> Integrated API Protocols
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 bg-slate-950 px-1.5 py-0.2 rounded shrink-0">Gemini Key</span>
              <span>Accessed securely server-side on port 3000 via Express proxy `/api/ai/*`</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 bg-slate-950 px-1.5 py-0.2 rounded shrink-0">Paystack Key</span>
              <span>Using public test credentials: `pk_test_006be008193c9b83e671e6e1bb75e5aab3d9d589`</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-indigo-400 bg-slate-950 px-1.5 py-0.2 rounded shrink-0">Google Meet</span>
              <span>Auto-calculates direct meeting URLs for client appointments</span>
            </li>
          </ul>
        </div>

        {/* Sandbox Simulation */}
        <div className="bg-slate-900/40 border border-slate-900 rounded-2xl p-6 space-y-4 md:col-span-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4.5 h-4.5 text-indigo-400" /> Standalone Testing & Fallbacks
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The database logic inside `src/firebase.ts` dynamically checks for real credentials in `firebase-applet-config.json`. 
            If placeholder values are encountered, it automatically instantiates local storage schemas. This allows you to fully 
            test student XP tracking, role modifications, bookings, audits, and commissions without needing active GCP cloud deployments!
          </p>
          <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl">
            <p className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">Active Workspace Testing instructions</p>
            <ol className="list-decimal pl-4 mt-2 text-[10px] text-slate-400 space-y-1">
              <li>Open the top-right role selector "Access Workspace".</li>
              <li>Click "Student Workspace" to test learning progress and certificate issuance.</li>
              <li>Select "Client Workspace" to request brand SEO crawls and schedule strategy calls.</li>
              <li>Check "Admin Dashboard" to verify total platform commission logs and active booking databases.</li>
            </ol>
          </div>
        </div>

      </div>

    </div>
  );
}
