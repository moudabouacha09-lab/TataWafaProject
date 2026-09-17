'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Profile, VerificationStatus } from '@/types';
import { DataStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { VerificationBadge } from '@/components/VerificationBadge';
import { 
  ShieldCheck, 
  FileCheck2, 
  PhoneCall, 
  MapPin, 
  Check, 
  X, 
  AlertCircle, 
  Loader2, 
  ArrowLeft,
  Calendar,
  Lock,
  Search,
  Filter,
  Star
} from 'lucide-react';

export default function AdminPrestatairesPage() {
  const { role, isConfigured, loading: authLoading } = useAuth();
  const [providers, setProviders] = useState<Profile[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Profile | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Checklist states for physical verification
  const [idCardChecked, setIdCardChecked] = useState(false);
  const [diplomaChecked, setDiplomaChecked] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');

  const loadProviders = async () => {
    setLoading(true);
    try {
      const data = await DataStore.getProfiles('provider');
      setProviders(data);
      if (selectedProvider) {
        const refreshed = data.find(p => p.id === selectedProvider.id);
        if (refreshed) setSelectedProvider(refreshed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider) {
      setIdCardChecked(Boolean(selectedProvider.id_card_verified));
      setDiplomaChecked(Boolean(selectedProvider.diploma_verified));
      setVerificationNotes(selectedProvider.admin_verification_notes || '');
    }
  }, [selectedProvider]);

  const handleCertify = async (status: VerificationStatus) => {
    if (!selectedProvider) return;
    setUpdating(true);
    try {
      await DataStore.updateVerificationStatus(selectedProvider.id, status, {
        id_card_verified: idCardChecked,
        diploma_verified: diplomaChecked,
        notes: verificationNotes,
      });
      await loadProviders();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const filteredProviders = providers.filter((p) => {
    if (filterStatus !== 'all' && (p.verification_status || 'en_attente_physique') !== filterStatus) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.full_name.toLowerCase().includes(q) ||
        (p.phone && p.phone.includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q))
      );
    }
    return true;
  });

  if (!authLoading && isConfigured && role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <Lock className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Accès Administrateur Restreint</h2>
        <Link href="/" className="text-xs font-bold text-indigo-600 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-xs font-bold text-slate-400 hover:text-slate-600 transition">
              Espace Admin
            </Link>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs font-bold text-indigo-600">Vérification des Prestataires</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Pipeline de Vérification en Main Propre
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Contrôlez les pièces d'identité et diplômes originaux avant de délivrer le Badge Certifié TataWafa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/avis"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span>Modération des Avis</span>
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au Dispatching</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Colonne Liste des Candidats */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Recherche & Filtres */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Rechercher par nom, téléphone, commune..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto">
              {[
                { key: 'all', label: 'Tous' },
                { key: 'en_attente_physique', label: 'En attente' },
                { key: 'verifie_en_main_propre', label: 'Certifiés' },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setFilterStatus(s.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    filterStatus === s.key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Liste */}
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              <p className="text-xs font-semibold">Aucun prestataire dans cette catégorie.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProviders.map((p) => {
                const isSelected = selectedProvider?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProvider(p)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                          {p.full_name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{p.full_name}</h4>
                          <p className="text-xs text-slate-500 flex items-center gap-2">
                            <span>{p.phone || 'Pas de numéro'}</span>
                            <span>•</span>
                            <span>{p.location || 'Alger'}</span>
                          </p>
                        </div>
                      </div>

                      <VerificationBadge status={p.verification_status || 'en_attente_physique'} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Colonne Fiche d'Inspection Physique */}
        <div className="lg:col-span-5">
          {selectedProvider ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 sticky top-24">
              
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    Contrôle Physique du Candidat
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedProvider.full_name}</h3>
                  <p className="text-xs text-slate-500">{selectedProvider.location} (Alger)</p>
                </div>

                {selectedProvider.phone && (
                  <a
                    href={`tel:${selectedProvider.phone}`}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                    title="Appeler pour fixer le rendez-vous"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Checklist administrative en main propre */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Checklist de l'Entretien en Personne
                </h4>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs text-slate-800">
                  <input
                    type="checkbox"
                    checked={idCardChecked}
                    onChange={(e) => setIdCardChecked(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>
                    <strong>Carte Nationale d'Identité Biométrique originale contrôlée</strong>
                    <span className="block text-[11px] text-slate-500">Nom, date de validité et photo concordants avec le candidat.</span>
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer text-xs text-slate-800">
                  <input
                    type="checkbox"
                    checked={diplomaChecked}
                    onChange={(e) => setDiplomaChecked(e.target.checked)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  <span>
                    <strong>Diplômes ou attestations d'expérience vérifiés</strong>
                    <span className="block text-[11px] text-slate-500">Certificats de formation, diplômes universitaires ou attestations employeur.</span>
                  </span>
                </label>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Notes internes de l'administrateur
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Impression sur le candidat, ponctualité, remarques..."
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Actions de certification */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleCertify('verifie_en_main_propre')}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Délivrer le Badge "Vérifié en main propre"</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleCertify('en_attente_physique')}
                    className="py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition border border-amber-200"
                  >
                    Remettre En Attente
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleCertify('suspendu')}
                    className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition border border-rose-200"
                  >
                    Suspendre le Profil
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400 space-y-2">
              <FileCheck2 className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">
                Sélectionnez un prestataire dans la liste pour remplir sa checklist et lui attribuer son badge officiel.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
