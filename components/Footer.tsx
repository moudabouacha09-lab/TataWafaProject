import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Shield, PhoneCall } from 'lucide-react';
import { ADMIN_PHONE } from '@/lib/utils';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">TataWafa</span>
            </div>
            <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
              Plateforme locale de confiance reliant les familles d'Alger avec des gardes d'enfants et des enseignants particuliers vérifiés en main propre.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-800 font-semibold pt-1">
              <PhoneCall className="w-4 h-4 text-indigo-600" />
              <span>Contact Administratif & Coordination : {ADMIN_PHONE}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Catégories de Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/?category=babysitting" className="hover:text-indigo-600 transition">
                  Garde d'enfants & Nounous
                </Link>
              </li>
              <li>
                <Link href="/?category=teaching" className="hover:text-indigo-600 transition">
                  Cours particuliers & Soutien scolaire
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-indigo-600 transition">
                  Toutes les annonces d'Alger
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Espaces Membres</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/my-requests" className="hover:text-indigo-600 transition">
                  Suivi de mes demandes
                </Link>
              </li>
              <li>
                <Link href="/provider/listing" className="hover:text-indigo-600 transition">
                  Devenir Prestataire / Nounou
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-600 text-amber-700 font-medium transition">
                  Espace Coordinateur Admin
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} TataWafa. Tous droits réservés • Alger, Algérie.</p>
          <div className="flex items-center gap-4">
            <span>Babysitting</span>
            <span>•</span>
            <span>Soutien scolaire</span>
            <span>•</span>
            <span>Coordination en direct</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
