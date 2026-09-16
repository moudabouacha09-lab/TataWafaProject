'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ServiceRequest } from '@/types';
import { DataStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { ReviewModal } from '@/components/ReviewModal';
import { StarRating } from '@/components/StarRating';
import { getStatusBadgeStyle, formatDate, formatPrice, getCategoryBadge, ADMIN_PHONE } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  PhoneCall, 
  Star, 
  CheckCircle2, 
  Loader2, 
  ArrowRight
} from 'lucide-react';

export default function MyRequestsPage() {
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
            Espace Famille / Client
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Mes Demandes de Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Suivez l'état de vos réservations et évaluez les prestations effectuées.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
        >
          <span>Trouver d'autres services</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Onglets de filtrage */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'Toutes les demandes' },
          { key: 'active', label: 'En cours (Nouvelles & Coordination)' },
          { key: 'completed', label: 'Prestations terminées' },
          { key: 'cancelled', label: 'Annulées' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
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
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Chargement de vos demandes...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aucune demande enregistrée</h3>
          <p className="text-xs text-slate-500">
            {filterStatus === 'all'
              ? "Vous n'avez pas encore envoyé de demande de réservation."
              : `Aucune demande avec le statut sélectionné.`}
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
          >
            Explorer les babysitters & cours
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const badge = getStatusBadgeStyle(req.status);
            const catBadge = req.listing ? getCategoryBadge(req.listing.category) : null;
            const provider = req.listing?.provider;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  
                  {/* Infos du prestataire */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {req.listing?.photo_url ? (
                        <img src={req.listing.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-500">
                          <Calendar className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${catBadge?.badgeClass}`}>
                          {catBadge?.label}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">Demande #{req.id.slice(-6)}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {req.listing?.title || 'Annonce de service'}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Prestataire : <strong>{provider?.full_name || 'Prestataire assigné'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Badge Statut */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                </div>

                {/* Grille de détails */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-medium block mb-0.5">Date & Heure souhaitées</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {formatDate(req.requested_datetime)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block mb-0.5">Tarif & Règlement</span>
                    <span className="font-bold text-slate-800">
                      {req.listing?.price ? formatPrice(req.listing.price, req.listing.price_unit || 'séance') : 'Sur devis'} • Espèces (DA)
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block mb-0.5">Coordination Plateforme</span>
                    <span className="font-semibold text-indigo-900 flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                      Appel Admin : {ADMIN_PHONE}
                    </span>
                  </div>
                </div>

                {/* Note client */}
                {req.note && (
                  <div className="text-xs text-slate-600 bg-amber-50/50 border border-amber-200/60 rounded-xl p-3">
                    <span className="font-semibold text-amber-900">Vos précisions : </span>
                    {req.note}
                  </div>
                )}

                {/* Statut et Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  
                  {req.status === 'new' && (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      <span>En attente de l'appel de coordination de l'administrateur avec le prestataire.</span>
                    </div>
                  )}

                  {req.status === 'in_progress' && (
                    <div className="text-xs text-blue-700 font-medium flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4 text-blue-600" />
                      <span>Coordonné par téléphone ! Le créneau a été convenu avec le prestataire.</span>
                    </div>
                  )}

                  {req.status === 'completed' && (
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {req.review ? (
                        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-900">Votre avis :</span>
                              <StarRating rating={req.review.rating} size="sm" />
                            </div>
                            <p className="text-xs text-emerald-800 mt-0.5">"{req.review.comment}"</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Prestation effectuée ! Donnez votre avis pour la communauté.
                          </span>
                          <button
                            onClick={() => setSelectedReviewRequest(req)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>Laisser une note & avis</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {req.status === 'cancelled' && (
                    <span className="text-xs text-rose-600 font-medium">
                      Cette demande a été annulée. Vous pouvez explorer d'autres prestataires disponibles.
                    </span>
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
