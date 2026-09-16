'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, Briefcase, RefreshCw } from 'lucide-react';
import { DataStore } from '@/lib/store';

export const RoleSwitcher: React.FC = () => {
  const { role, profile, switchDemoRole, isConfigured } = useAuth();

  // En production avec Supabase, le sélecteur de démo est complètement masqué et inactif
  if (isConfigured) {
    return null;
  }

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'client',
      label: 'Client (Famille / Élève)',
      icon: <UserCheck className="w-4 h-4 text-emerald-600" />,
      desc: 'Explorer, demander un service et laisser un avis',
    },
    {
      role: 'provider',
      label: 'Prestataire (Babysitter / Enseignant)',
      icon: <Briefcase className="w-4 h-4 text-indigo-600" />,
      desc: 'Publier et gérer son annonce de service',
    },
    {
      role: 'admin',
      label: 'Admin (Coordinateur Plateforme)',
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
      desc: 'Réception des demandes en direct et coordination par téléphone',
    },
  ];

  const handleReset = () => {
    if (confirm('Voulez-vous effacer toutes les données locales et repartir de zéro ?')) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.reload();
      }
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-700/50">
            {isConfigured ? 'Connexion Supabase Active' : 'Mode Test Local (Alger)'}
          </span>
          <span className="hidden md:inline text-slate-400">
            Rôle actuel : <strong className="text-white">{profile?.full_name || 'Visiteur'}</strong> (<span className="capitalize text-indigo-300">{role === 'provider' ? 'Prestataire' : role}</span>)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-medium">Changer de rôle :</span>
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
              <span>{r.label.split(' ')[0]}</span>
            </button>
          ))}

          {!isConfigured && (
            <button
              onClick={handleReset}
              title="Vider les données locales et repartir de zéro"
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-rose-900/60 hover:text-rose-200 text-slate-400 transition ml-2 border border-slate-700/60"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Remise à zéro</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
