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
  HeartHandshake
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { role, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight text-slate-900 tracking-tight flex items-center gap-1.5">
                TataWafa
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Alger & Environs
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">Garde d'enfants & Cours Particuliers</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/') || isActive('/services')
                  ? 'text-indigo-600 bg-indigo-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Explorer les services
            </Link>

            {/* Client Links */}
            {role === 'client' && (
              <Link
                href="/my-requests"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive('/my-requests')
                    ? 'text-indigo-600 bg-indigo-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Mes demandes</span>
              </Link>
            )}

            {/* Provider Links */}
            {role === 'provider' && (
              <>
                <Link
                  href="/provider/listing"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/provider/listing')
                      ? 'text-indigo-600 bg-indigo-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Mon annonce de service</span>
                </Link>
                <Link
                  href="/provider/profile"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/provider/profile')
                      ? 'text-indigo-600 bg-indigo-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>Mon profil & Avis</span>
                </Link>
              </>
            )}

            {/* Admin Links */}
            {role === 'admin' && (
              <Link
                href="/admin"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive('/admin')
                    ? 'text-amber-700 bg-amber-50 font-bold border border-amber-200'
                    : 'text-amber-700 bg-amber-50/60 hover:bg-amber-100 hover:text-amber-900 border border-amber-200/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-amber-600" />
                <span>Espace Coordinateur Admin</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1" />
              </Link>
            )}
          </nav>

          {/* User Status / Account Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {profile ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-sm">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{profile.full_name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[140px]">
                      {profile.full_name}
                    </p>
                    <span className="text-[10px] text-slate-500 capitalize flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                >
                  Créer un compte
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {profile && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3 border border-slate-200">
              <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span>{profile.full_name.charAt(0)}</span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{profile.full_name}</p>
                <p className="text-xs text-slate-500 capitalize">{role === 'provider' ? 'Prestataire' : role}</p>
              </div>
            </div>
          )}

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Explorer les services
          </Link>

          {role === 'client' && (
            <Link
              href="/my-requests"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Mes demandes de service
            </Link>
          )}

          {role === 'provider' && (
            <>
              <Link
                href="/provider/listing"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Gérer mon annonce
              </Link>
              <Link
                href="/provider/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Voir mes avis & profil
              </Link>
            </>
          )}

          {role === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200"
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
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg text-slate-700"
                >
                  Connexion
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg"
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
