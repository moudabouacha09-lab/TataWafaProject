'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { DataStore } from '@/lib/store';
import { ServiceListing, ServiceRequest, Review } from '@/types';
import { VerificationBadge } from '@/components/VerificationBadge';
import { AdminCallCard } from '@/components/AdminCallCard';
import { StarRating } from '@/components/StarRating';
import { formatPrice, formatDate, getStatusBadgeStyle } from '@/lib/utils';
import { 
  BookOpen, 
  Clock, 
  Star, 
  Calendar, 
  PhoneCall, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  FileCheck2,
  ArrowRight,
  Edit3
} from 'lucide-react';

export default function ProviderDashboardPage() {
  const { profile, user } = useAuth();
  const providerId = profile?.id || user?.id || 'usr_provider_guest';

  const [listing, setListing] = useState<ServiceListing | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [l, reqs, revs] = await Promise.all([
        DataStore.getProviderListing(providerId),
        DataStore.getRequests({ role: 'provider', userId: providerId }),
        DataStore.getReviewsForProvider(providerId),
      ]);
      setListing(l);
      setRequests(reqs);
      setReviews(revs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleDataChange = () => {
      loadData();
    };

    window.addEventListener('sm_data_change', handleDataChange);
    return () => window.removeEventListener('sm_data_change', handleDataChange);
  }, [providerId]);

  const isVerified = profile?.verification_status === 'verifie_en_main_propre';

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profil Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 font-extrabold text-xl flex items-center justify-center border-2 border-indigo-200 shrink-0">
              {profile?.full_name?.charAt(0) || 'P'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {profile?.full_name || 'Espace Prestataire'}
                </h1>
                <VerificationBadge status={profile?.verification_status || 'en_attente_physique'} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {profile?.phone || 'Numéro non renseigné'} • {profile?.location || 'Alger'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/provider/annonces"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Gérer mon annonce</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Alerte si le dossier physique n'est pas encore vérifié */}
      {!isVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700 shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-amber-950">
                Action requise : Vérification de vos pièces d'identité en main propre
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Votre profil est actuellement en attente de vérification physique. L'administrateur de TataWafa doit vérifier votre pièce d'identité originale et vos diplômes en personne afin de délivrer votre <strong>Badge Certifié</strong> et vous rendre prioritaire auprès des familles.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/provider/verification"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition text-center"
            >
              Consulter la checklist des documents originaux
            </Link>
          </div>
        </div>
      )}

      {/* Statistiques Rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statut Annonce</span>
          <div className="text-lg font-black text-slate-900 mt-1">
            {listing ? 'Active' : 'Aucune annonce'}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Missions Reçues</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">{requests.length}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avis Familles</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{reviews.length}</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Note Moyenne</span>
          <div className="text-2xl font-black text-amber-500 mt-1">
            {avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : 'N/A'}
          </div>
        </div>
      </div>

      {/* Mon Annonce Publiée */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Mon Annonce de Service
          </h3>
          <Link
            href="/provider/annonces"
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Modifier l'annonce →
          </Link>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
          </div>
        ) : !listing ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-xs text-slate-500">Vous n'avez pas encore configuré votre annonce de service.</p>
            <Link
              href="/provider/annonces"
              className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Publier mon annonce maintenant
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-base font-bold text-slate-900">{listing.title}</h4>
              <strong className="text-indigo-600 font-extrabold text-sm">
                {formatPrice(listing.price, listing.price_unit || 'séance')}
              </strong>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{listing.description}</p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Commune : <strong>{listing.location} (Alger)</strong></span>
              <span>•</span>
              <span>Disponibilités : <strong>{listing.availability}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Coordination & Contact Admin */}
      <AdminCallCard
        title="Ligne directe coordinateur pour les prestataires"
        subtitle="Un doute sur un rendez-vous ou une mission ? Contactez l'administrateur à tout moment."
      />

    </div>
  );
}
