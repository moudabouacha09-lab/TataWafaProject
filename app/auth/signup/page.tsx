'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/types';
import { ALGER_COMMUNES } from '@/lib/constants';
import { 
  UserCheck, 
  Briefcase, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  Loader2,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  
  const [role, setRole] = useState<UserRole>('client');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState<string>(ALGER_COMMUNES[0]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Veuillez renseigner un numéro de téléphone pour la coordination.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await signup({
        email,
        password,
        full_name: fullName,
        role,
        phone,
        location,
      });

      if (res.success) {
        if (role === 'provider') {
          router.push('/provider/listing');
        } else {
          router.push('/');
        }
      } else {
        setError(res.error || 'Impossible de créer le compte.');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-card space-y-6">
        
        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-200">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Créer un compte TataWafa
          </h2>
          <p className="text-xs text-slate-500">
            Rejoignez la communauté de confiance pour la garde d'enfants et les cours particuliers à Alger.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Sélecteur de Rôle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Je souhaite m'inscrire en tant que :
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition ${
                  role === 'client'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span className="text-xs font-bold">Famille / Client</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('provider')}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition ${
                  role === 'provider'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                <span className="text-xs font-bold">Prestataire (Nounou / Prof)</span>
              </button>
            </div>
          </div>

          {/* Nom Complet */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nom Complet</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="Ex: Amina Benali"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Adresse Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="amina@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Numéro de Téléphone (Coordination)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                placeholder="0550 12 34 56"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Commune d'Alger */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Commune de résidence (Alger)</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none cursor-pointer"
              >
                {ALGER_COMMUNES.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Note sur la vérification en personne */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-indigo-900 leading-relaxed">
            <div className="font-semibold flex items-center gap-1 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              Vérification en main propre
            </div>
            Pour votre sécurité, vos pièces d'identité ne sont pas téléversées sur le web mais vérifiées en personne par l'administrateur.
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Création du compte...</span>
              </>
            ) : (
              <span>Créer mon compte</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Vous avez déjà un compte ?{' '}
          <Link href="/auth/login" className="font-bold text-indigo-600 hover:underline">
            Se connecter
          </Link>
        </div>

      </div>
    </div>
  );
}
