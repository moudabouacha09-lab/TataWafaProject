'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { VerificationBadge } from '@/components/VerificationBadge';
import { AdminCallCard } from '@/components/AdminCallCard';
import { PHYSICAL_CHECKLIST, ADMIN_CONTACT } from '@/lib/constants';
import { 
  ShieldCheck, 
  FileCheck2, 
  MapPin, 
  Clock, 
  PhoneCall, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Calendar
} from 'lucide-react';

export default function ProviderVerificationPage() {
  const { profile } = useAuth();
  const status = profile?.verification_status || 'en_attente_physique';
  const isVerified = status === 'verifie_en_main_propre';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
            Agrément & Confiance
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Vérification des Pièces en Main Propre
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Processus officiel de certification physique pour les prestataires de la Wilaya d'Alger.
          </p>
        </div>

        <Link
          href="/provider/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tableau de bord</span>
        </Link>
      </div>

      {/* Statut actuel */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Votre Statut de Certification
          </span>
          <VerificationBadge status={status} size="md" />
        </div>

        {isVerified ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-950">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="block text-sm">Félicitations ! Votre profil est officiellement certifié.</strong>
              <p className="text-emerald-800">
                Vos pièces d'identité et diplômes ont été vérifiés en main propre par notre coordinateur. Votre badge de confiance est actif et visible par toutes les familles.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-950">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <strong className="block text-sm">Dossier en attente d'inspection physique</strong>
              <p className="text-amber-800 leading-relaxed">
                Afin de garantir la sécurité des enfants, aucun document n'est accepté sur le web. Veuillez convenir d'un rendez-vous avec notre coordinateur à Alger pour le contrôle visuel de vos pièces originales.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Checklist des documents originaux à préparer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-indigo-950 font-bold text-base">
          <FileCheck2 className="w-5 h-5 text-indigo-600" />
          <span>Documents originaux à présenter lors du rendez-vous</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Lors de votre entrevue de 15 minutes avec l'administrateur, vous devez vous munir des originaux suivants (aucune photocopie ni scan n'est conservé sur nos serveurs) :
        </p>

        <div className="space-y-3">
          {PHYSICAL_CHECKLIST.map((doc, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                {idx + 1}
              </div>
              <span className="font-medium pt-0.5">{doc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Déroulement de l'entrevue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Lieu de rendez-vous</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {ADMIN_CONTACT.address} (Point de rencontre sécurisé et accessible en transports).
          </p>
        </div>

        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Horaires de permanence</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {ADMIN_CONTACT.workingHours}. Les entrevues durent 15 minutes et s'effectuent sur rendez-vous téléphonique.
          </p>
        </div>
      </div>

      {/* Appel pour fixer le rendez-vous */}
      <AdminCallCard
        title="Fixer votre rendez-vous de vérification"
        subtitle="Appelez l'administrateur ou envoyez un message WhatsApp pour convenir de l'heure de votre passage."
      />

    </div>
  );
}
