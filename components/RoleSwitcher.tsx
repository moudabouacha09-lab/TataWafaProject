'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, Briefcase, RefreshCw } from 'lucide-react';
import { DataStore } from '@/lib/store';

export const RoleSwitcher: React.FC = () => {
  const { role, profile, switchDemoRole, isConfigured } = useAuth();

  // Strict Production Safety: When Supabase is configured with real credentials,
  // the demo switcher is completely disabled and removed from the DOM.
  if (isConfigured) {
    return null;
  }

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'client',
      label: 'Client (Parent / Student)',
      icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
      desc: 'Browse, request services & write reviews',
    },
    {
      role: 'provider',
      label: 'Provider (Babysitter / Tutor)',
      icon: <Briefcase className="w-4 h-4 text-indigo-600" />,
      desc: 'Manage profile & service listing',
    },
    {
      role: 'admin',
      label: 'Admin (Site Owner & Coordinator)',
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
      desc: 'Realtime dispatch & manual coordination',
    },
  ];

  const handleReset = () => {
    if (confirm('Reset demo data (profiles, listings, requests, reviews) back to default initial state?')) {
      DataStore.resetToDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-700/50">
            {isConfigured ? 'Supabase Live Connected' : 'Interactive MVP Demo Mode'}
          </span>
          <span className="hidden md:inline text-slate-400">
            Current Persona: <strong className="text-white">{profile?.full_name || 'Guest'}</strong> (Role: <span className="capitalize text-indigo-300">{role}</span>)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium">Switch Role:</span>
          {roles.map(r => (
            <button
              key={r.role}
              onClick={() => switchDemoRole(r.role)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium ${
                role === r.role
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
              title={r.desc}
            >
              {r.icon}
              <span className="capitalize">{r.role}</span>
            </button>
          ))}

          {!isConfigured && (
            <button
              onClick={handleReset}
              title="Reset test data to initial seed"
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-400 transition ml-2 border border-slate-700/60"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
