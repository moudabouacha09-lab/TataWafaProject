import React from 'react';
import Link from 'next/link';
import { HeartHandshake, ShieldCheck, PhoneCall, MessageSquare, MapPin } from 'lucide-react';
import { ADMIN_CONTACT } from '@/lib/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Marque & Présentation */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-900">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">TataWafa</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Plateforme humaine et sécurisée pour la garde d'enfants et les cours particuliers à Alger. Coordination manuelle par téléphone et vérification des pièces d'identité en main propre.
            </p>
            <div className="space-y-1.5 pt-1 text-slate-300">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-bold text-white">{ADMIN_CONTACT.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Alger Centre • 57 Communes</span>
              </div>
            </div>
          </div>

          {/* Services & Découverte */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Services à Alger</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/services?category=babysitting" className="hover:text-white transition">
                  Garde d'enfants & Nounous
                </Link>
              </li>
              <li>
                <Link href="/services?category=teaching" className="hover:text-white transition">
                  Cours particuliers (Primaire, CEM, Lycée)
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition">
                  Recherche par commune d'Alger
                </Link>
              </li>
              <li>
                <Link href="/tarifs-et-communes" className="hover:text-white transition">
                  Grille des tarifs en Dinars (DA)
                </Link>
              </li>
            </ul>
          </div>

          {/* Confiance & Processus */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Sécurité & Transparence</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/comment-ca-marche" className="hover:text-white transition">
                  Comment fonctionne la réservation
                </Link>
              </li>
              <li>
                <Link href="/securite-et-confiance" className="hover:text-white transition flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Vérification physique en main propre</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition">
                  Foire aux questions (FAQ)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contacter le coordinateur
                </Link>
              </li>
            </ul>
          </div>

          {/* Espace Pro & Coordination */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Espaces Membres</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/devenir-prestataire" className="text-indigo-300 hover:text-white font-semibold transition">
                  Devenir Nounou ou Enseignant
                </Link>
              </li>
              <li>
                <Link href="/client/demandes" className="hover:text-white transition">
                  Espace Famille (Mes demandes)
                </Link>
              </li>
              <li>
                <Link href="/provider/dashboard" className="hover:text-white transition">
                  Espace Prestataire (Tableau de bord)
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-amber-400 hover:text-amber-300 font-semibold transition">
                  Espace Coordinateur Admin
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} TataWafa. Tous droits réservés • Wilaya d'Alger, Algérie.</p>
          <div className="flex items-center gap-4">
            <span>Règlement direct en espèces (DA)</span>
            <span>•</span>
            <span>Coordination téléphonique humaine</span>
            <span>•</span>
            <span>57 Communes d'Alger</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
