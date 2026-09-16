import React from 'react';
import { ShieldCheck, PhoneCall, HandCoins, UserCheck2 } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 my-8">
      <div className="max-w-3xl mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sécurité & Coordination Manuelle à Alger</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Garde d'enfants & Soutien scolaire en toute confiance
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
          Pour la sécurité des enfants et des familles, chaque mise en relation est coordonnée par téléphone, et la vérification des identités et des compétences s'effectue en main propre dans la vie réelle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl backdrop-blur-sm border border-white/5">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">1. Coordination Téléphonique</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Dès qu'une demande est envoyée, l'administrateur vous appelle pour caler le créneau et les attentes.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl backdrop-blur-sm border border-white/5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
            <UserCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">2. Vérification en Main Propre</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Aucun document d'identité n'est stocké sur le web. Les pièces d'identité et attestations sont vérifiées en personne.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl backdrop-blur-sm border border-white/5">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
            <HandCoins className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">3. Paiement Direct en Espèces (DA)</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Zéro commission bancaire en ligne. Vous réglez directement le prestataire en dinars à la séance ou au mois.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
