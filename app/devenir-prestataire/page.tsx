'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Baby, 
  GraduationCap, 
  ShieldCheck, 
  Coins, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight,
  HeartHandshake,
  UserCheck2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { TARIFS_INDICATIFS, PHYSICAL_CHECKLIST, ADMIN_CONTACT } from '@/lib/constants';
import { AdminCallCard } from '@/components/AdminCallCard';

export default function BecomeProviderPage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-10">
      
      {/* Hero Prestataire */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-16 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl space-y-6 relative z-10">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Rejoignez le 1er réseau de confiance à Alger</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Devenez Nounou ou Enseignant Particulier Certifié
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Travaillez avec des familles respectueuses dans votre commune d'Alger. Fixez librement vos tarifs en Dinars Algériens (DA), vos disponibilités et recevez vos paiements directement en espèces de main à main.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Link
                href="/provider/annonces"
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-lg transition text-center flex items-center justify-center gap-2"
              >
                <span>Publier mon annonce maintenant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${ADMIN_CONTACT.phone}`}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl transition text-center flex items-center justify-center gap-2 border border-white/10"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Parler au coordinateur</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Avantages TataWafa */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Vos Avantages
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pourquoi exercer sur la plateforme TataWafa ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">100% de Vos Revenus en Espèces</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Zéro prélèvement bancaire ni commissions cachées en ligne. Les familles vous rémunèrent directement en espèces (DA) à chaque séance ou à la fin du mois.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Sécurité & Confidentialité Totale</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vos pièces d'identité et diplômes ne sont jamais publiés sur internet. Notre coordinateur vérifie vos documents en personne de main à main.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900">Liberté d'Horaires & de Communes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vous choisissez précisément vos communes d'intervention à Alger (Hydra, Kouba, Chéraga...) et vos plages horaires de disponibilité.
            </p>
          </div>
        </div>
      </section>

      {/* Grille indicative des rémunérations à Alger */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              Estimation des Tarifs à Alger
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Combien pouvez-vous gagner ?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Barème indicatif constaté sur les communes de la wilaya d'Alger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-indigo-900 flex items-center gap-2">
                <Baby className="w-4 h-4 text-indigo-600" />
                Garde d'Enfants (Babysitting)
              </h4>
              <div className="space-y-2">
                {TARIFS_INDICATIFS.babysitting.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs border border-slate-100">
                    <span className="text-slate-700">{item.type}</span>
                    <strong className="text-indigo-700 font-bold">{item.tarif}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Cours Particuliers & Soutien
              </h4>
              <div className="space-y-2">
                {TARIFS_INDICATIFS.teaching.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs border border-slate-100">
                    <span className="text-slate-700">{item.type}</span>
                    <strong className="text-emerald-700 font-bold">{item.tarif}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist de vérification physique */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-50/80 rounded-3xl border border-indigo-200 p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-lg">
            <UserCheck2 className="w-6 h-6 text-indigo-600" />
            <span>Processus d'agrément en main propre</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Pour obtenir le <strong>Badge Certifié TataWafa</strong> et recevoir des demandes de familles, l'administrateur convient d'un rendez-vous avec vous pour inspecter vos documents originaux :
          </p>

          <ul className="space-y-2.5">
            {PHYSICAL_CHECKLIST.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 bg-white p-3.5 rounded-xl border border-indigo-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 text-center">
            <Link
              href="/provider/annonces"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
            >
              <span>Commencer mon inscription gratuite</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
