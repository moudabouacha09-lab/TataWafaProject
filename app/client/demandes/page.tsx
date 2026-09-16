'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ServiceRequest } from '@/types';
import { DataStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { ReviewModal } from '@/components/ReviewModal';
import { StarRating } from '@/components/StarRating';
import { TimelineTracker } from '@/components/TimelineTracker';
import { AdminCallCard } from '@/components/AdminCallCard';
import { getStatusBadgeStyle, formatDate, formatPrice, getCategoryBadge } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  PhoneCall, 
  Star, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';

export default function ClientRequestsPage() {
  const { profile, user } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReviewRequest, setSelectedReviewRequest] = useState<ServiceRequest | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const clientId = profile?.id || user?.id || 'usr_client_guest';
      const data = await DataStore.getRequests({ role: 'client', userId: clientId });
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();

    const handleDataChange = () => {
      loadRequests();
    };

    window.addEventListener('sm_data_change', handleDataChange);
    return () => window.removeEventListener('sm_data_change', handleDataChange);
  }, [profile?.id, user?.id]);

  const filteredRequests = requests.filter((r) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return r.status === 'new' || r.status === 'in_progress';
    return r.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Espace Famille
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Mes Réservations & Demandes de Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Suivez l'avancement de vos demandes coordonnées par notre équipe à Alger.
          </p>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
        >
          <span>Réserver un autre service</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filtres de statut */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: `Toutes (${requests.length})` },
          { key: 'active', label: `En cours (${requests.filter(r => r.status === 'new' || r.status === 'in_progress').length})` },
          { key: 'completed', label: `Terminées (${requests.filter(r => r.status === 'completed').length})` },
          { key: 'cancelled', label: `Annulées (${requests.filter(r => r.status === 'cancelled').length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filterStatus === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Liste des demandes */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
          <p className="text-sm font-medium">Chargement de vos demandes...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aucune demande trouvée</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {filterStatus === 'all'
              ? "Vous n'avez pas encore envoyé de demande de réservation sur TataWafa."
              : `Aucune demande correspondant à ce statut.`}
          </p>
          <div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              <span>Découvrir les prestataires à Alger</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((req) => {
            const badge = getStatusBadgeStyle(req.status);
            const catBadge = req.listing ? getCategoryBadge(req.listing.category) : null;
            const provider = req.listing?.provider;

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 hover:shadow-md transition"
              >
                
                {/* En-tête de la carte */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {req.listing?.photo_url ? (
                        <img src={req.listing.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-xs">
                          {catBadge?.shortLabel}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${catBadge?.badgeClass}`}>
                          {catBadge?.label}
                        </span>
                        <span className="text-xs text-slate-400">Dossier #{req.id.slice(-6).toUpperCase()}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {req.listing?.title || 'Annonce de service'}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Prestataire : <strong>{provider?.full_name || 'Prestataire désigné'}</strong>
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                {/* Timeline de la demande */}
                <TimelineTracker status={req.status} />

                {/* Grille des détails de l'intervention */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Créneau demandé</span>
                    <strong className="text-slate-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {formatDate(req.requested_datetime)}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Lieu d'intervention</span>
                    <strong className="text-slate-900 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {req.address_details || req.listing?.location} (Alger)
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Tarif convenu</span>
                    <strong className="text-slate-900">
                      {req.listing?.price ? formatPrice(req.listing.price, req.listing.price_unit || 'séance') : 'Sur devis'} (Espèces)
                    </strong>
                  </div>
                </div>

                {/* Actions contextuelles */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <Link
                    href={`/confirmation/${req.id}`}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>Voir le récapitulatif du dossier</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {req.status === 'completed' && (
                    req.review ? (
                      <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Avis publié ({req.review.rating}/5)</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedReviewRequest(req)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        <span>Laisser un avis client certifié</span>
                      </button>
                    )
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Modal d'Avis */}
      {selectedReviewRequest && (
        <ReviewModal
          request={selectedReviewRequest}
          isOpen={Boolean(selectedReviewRequest)}
          onClose={() => setSelectedReviewRequest(null)}
          onReviewSubmitted={() => {
            loadRequests();
          }}
        />
      )}

    </div>
  );
}
