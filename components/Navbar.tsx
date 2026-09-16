'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  Calendar, 
  BookOpen, 
  User, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  HeartHandshake,
  ShieldCheck,
  HelpCircle,
  MapPin,
  PlusCircle,
  FileCheck2
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { role, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Slogan */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight text-slate-900 tracking-tight flex items-center gap-1.5">
                TataWafa
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Alger
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">Garde d'enfants & Soutien scolaire</p>
            </div>
          </Link>

          {/* Navigation Principale Desktop */}
          <nav className="hidden lg:flex items-center gap-1 text-xs sm:text-sm font-medium">
            <Link
              href="/services"
              className={`px-3 py-2 rounded-lg transition ${
                isActive('/services')
                  ? 'text-indigo-600 bg-indigo-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Services
            </Link>

            <Link
              href="/comment-ca-marche"
              className={`px-3 py-2 rounded-lg transition ${
                isActive('/comment-ca-marche')
                  ? 'text-indigo-600 bg-indigo-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Comment ça marche
            </Link>

            <Link
              href="/securite-et-confiance"
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1 ${
                isActive('/securite-et-confiance')
                  ? 'text-emerald-700 bg-emerald-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Sécurité</span>
            </Link>

            <Link
              href="/tarifs-et-communes"
              className={`px-3 py-2 rounded-lg transition ${
                isActive('/tarifs-et-communes')
                  ? 'text-indigo-600 bg-indigo-50 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Communes & Tarifs
            </Link>

            {/* Liens Famille / Client */}
            {role === 'client' && (
              <Link
                href="/client/demandes"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
                  isActive('/client/demandes')
                    ? 'text-indigo-600 bg-indigo-50 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Mes demandes</span>
              </Link>
            )}

            {/* Liens Prestataire */}
            {role === 'provider' && (
              <>
                <Link
                  href="/provider/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
                    isActive('/provider/dashboard')
                      ? 'text-indigo-600 bg-indigo-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Mon Espace</span>
                </Link>
                <Link
                  href="/provider/verification"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition ${
                    isActive('/provider/verification')
                      ? 'text-amber-700 bg-amber-50 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4 text-amber-600" />
                  <span>Vérification physique</span>
                </Link>
              </>
            )}

            {/* Liens Admin */}
            {role === 'admin' && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition font-bold ${
                  isActive('/admin')
                    ? 'text-amber-800 bg-amber-100 border border-amber-300'
                    : 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-600" />
                <span>Espace Coordinateur</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
              </Link>
            )}
          </nav>

          {/* Action Droite & Profil */}
          <div className="hidden lg:flex items-center gap-3">
            {role !== 'provider' && role !== 'admin' && (
              <Link
                href="/devenir-prestataire"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Devenir Prestataire</span>
              </Link>
            )}

            {profile ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                    {profile.full_name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-900 leading-tight max-w-[120px] truncate">{profile.full_name}</p>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {role === 'provider' ? 'Prestataire' : role === 'admin' ? 'Admin' : 'Famille'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => logout()}
                  title="Se déconnecter"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                >
                  Créer un compte
                </Link>
              </div>
            )}
          </div>

          {/* Bouton Menu Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Explorer les services
          </Link>

          <Link
            href="/comment-ca-marche"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Comment ça marche
          </Link>

          <Link
            href="/securite-et-confiance"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Sécurité & Vérification en main propre
          </Link>

          <Link
            href="/tarifs-et-communes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Tarifs & 57 Communes d'Alger
          </Link>

          {role === 'client' && (
            <Link
              href="/client/demandes"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-indigo-600 bg-indigo-50"
            >
              Mes demandes de réservation
            </Link>
          )}

          {role === 'provider' && (
            <>
              <Link
                href="/provider/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-indigo-600 bg-indigo-50"
              >
                Mon Tableau de Bord Prestataire
              </Link>
              <Link
                href="/provider/annonces"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Gérer mon annonce
              </Link>
              <Link
                href="/provider/verification"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-800 bg-amber-50"
              >
                Vérification physique en main propre
              </Link>
            </>
          )}

          {role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-900 bg-amber-100"
            >
              Espace Coordinateur Admin
            </Link>
          )}

          <div className="pt-3 border-t border-slate-200">
            {profile ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Se déconnecter
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
