'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ServiceListing, Review } from '@/types';
import { DataStore } from '@/lib/store';
import { StarRating } from '@/components/StarRating';
import { VerificationBadge } from '@/components/VerificationBadge';
import { PriceTag } from '@/components/PriceTag';
import { AdminCallCard } from '@/components/AdminCallCard';
import { formatPrice, getCategoryBadge, formatDateShort, ADMIN_PHONE } from '@/lib/utils';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Baby, 
  GraduationCap, 
  Calendar, 
  PhoneCall, 
  UserCheck2, 
  HandCoins,
  MessageSquare,
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [listing, setListing] = useState<ServiceListing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await DataStore.getListingById(id);
      if (data) {
        setListing(data);
        const revs = await DataStore.getReviewsForListing(id);
        setReviews(revs);
      }
    } catch (e) {
      console.error(e);
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Chargement du profil du prestataire...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Annonce non trouvée</h2>
        <p className="text-sm text-slate-500">Cette annonce n'existe plus ou a été retirée.</p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux annonces</span>
        </Link>
      </div>
    );
  }

  const badge = getCategoryBadge(listing.category);
  const provider = listing.provider;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Bouton retour */}
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue des services</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Principale */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Photo */}
            <div className="relative h-64 sm:h-80 w-full bg-slate-100">
              {listing.photo_url ? (
                <img
                  src={listing.photo_url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                  {listing.category === 'babysitting' ? <Baby className="w-20 h-20" /> : <GraduationCap className="w-20 h-20" />}
                </div>
              )}

              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm border ${badge.badgeClass} bg-white/95`}>
                  {listing.category === 'babysitting' ? (
                    <Baby className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                  )}
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Détails du profil */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border-2 border-indigo-100 shadow-sm shrink-0 flex items-center justify-center font-bold text-slate-700 text-xl">
                    {provider?.avatar_url ? (
                      <img src={provider.avatar_url} alt={provider.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-xl font-bold">
                        {provider?.full_name?.charAt(0) || 'P'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                        {provider?.full_name || 'Prestataire'}
                      </h1>
                      <VerificationBadge status={provider?.verification_status || 'en_attente_physique'} size="sm" />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      {listing.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {listing.location} (Alger)
                        </span>
                      )}
                      <span>•</span>
                      <StarRating
                        rating={listing.average_rating || 0}
                        count={listing.review_count || 0}
                        showCount
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <PriceTag
                    price={listing.price}
                    unit={listing.price_unit || 'séance'}
                    size="lg"
                    showCashBadge
                  />
                </div>

              </div>

              {/* Titre et description */}
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {listing.title}
                </h2>
                <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {listing.description || 'Aucune description fournie.'}
                </div>
              </div>

              {/* Communes couvertes */}
              {listing.supported_communes && listing.supported_communes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    Communes d'intervention à Alger
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {listing.supported_communes.map((commune, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                        {commune}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Disponibilités */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex items-start gap-3">
                <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">Créneaux & Horaires de disponibilité</h4>
                  <p className="text-xs text-indigo-800 font-medium mt-1">
                    {listing.availability || 'Horaires flexibles. À valider avec le coordinateur par téléphone.'}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Avis Clients */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  Avis Clients Vérifiés ({reviews.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publiés uniquement après la réalisation effective de la prestation.
                </p>
              </div>

              <StarRating
                rating={listing.average_rating || 0}
                count={reviews.length}
                showCount
                size="md"
              />
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <p className="text-xs font-semibold">Aucun avis publié pour l'instant.</p>
                <p className="text-[11px] text-slate-400">Soyez parmi les premiers à réserver et partager votre retour d'expérience !</p>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          {rev.client?.full_name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {rev.client?.full_name || 'Client vérifié'}
                          </p>
                          <p className="text-[10px] text-slate-400">{formatDateShort(rev.created_at)}</p>
                        </div>
                      </div>
                      <StarRating rating={rev.rating} size="sm" />
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-slate-700 leading-relaxed pl-9">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Colonne Droite: Action de réservation */}
        <div className="space-y-6">
          
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-6">
            
            <div>
              <span className="text-xs font-semibold text-slate-400">Tarif proposé</span>
              <div className="text-3xl font-black text-slate-900 mt-0.5">
                {formatPrice(listing.price, listing.price_unit || 'séance')}
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                Paiement direct en espèces (DA)
              </span>
            </div>

            {/* Bouton vers le tunnel de réservation dédié */}
            <Link
              href={`/services/${listing.id}/reserver`}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 group"
            >
              <Calendar className="w-4 h-4 group-hover:scale-110 transition" />
              <span>Réserver ce service</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-[11px] text-slate-500 text-center leading-normal">
              Aucun prélèvement en ligne. L'administrateur vous appellera par téléphone pour organiser l'intervention.
            </p>

            <hr className="border-slate-100" />

            <div className="space-y-3 text-xs text-slate-600">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Garanties TataWafa Alger
              </h4>

              <div className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Appel téléphonique de confirmation du coordinateur.</span>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Contrôle physique de la carte d'identité en main propre.</span>
              </div>

              <div className="flex items-start gap-2">
                <HandCoins className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Règlement direct de main à main en espèces (DA).</span>
              </div>
            </div>

          </div>

          <AdminCallCard compact />

        </div>

      </div>

    </div>
  );
}
