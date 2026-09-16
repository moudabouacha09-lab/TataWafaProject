'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ServiceRequest } from '@/types';
import { DataStore } from '@/lib/store';
import { TimelineTracker } from '@/components/TimelineTracker';
import { AdminCallCard } from '@/components/AdminCallCard';
import { formatDate, formatPrice, ADMIN_PHONE } from '@/lib/utils';
import { 
  CheckCircle2, 
  PhoneCall, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Printer, 
  Loader2,
  Clock
} from 'lucide-react';

export default function BookingConfirmationPage() {
  const params = useParams();
  const id = params.id as string;

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequest = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await DataStore.getRequestById(id);
        setRequest(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRequest();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Chargement de votre confirmation de réservation...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Réservation introuvable</h2>
        <Link href="/" className="text-xs font-bold text-indigo-600 hover:underline">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Carte Principale de Succès */}
      <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-10 shadow-lg text-center space-y-6">
        
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Dossier #{request.id.slice(-6).toUpperCase()} Enregistré
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Demande de Réservation Transmise !
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Votre demande pour <strong>{request.listing?.title}</strong> est désormais entre les mains de notre équipe de coordination à Alger.
          </p>
        </div>

        {/* Timeline du processus */}
        <div className="text-left">
          <TimelineTracker status={request.status} />
        </div>

        {/* Récapitulatif du rendez-vous */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Détails de l'intervention demandée
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
            <div>
              <span className="text-slate-400 block">Prestataire sollicité</span>
              <strong className="text-slate-900">{request.listing?.provider?.full_name || 'Prestataire TataWafa'}</strong>
            </div>

            <div>
              <span className="text-slate-400 block">Date & Heure convenues</span>
              <strong className="text-slate-900">{formatDate(request.requested_datetime)}</strong>
            </div>

            <div>
              <span className="text-slate-400 block">Lieu de prise en charge</span>
              <strong className="text-slate-900">{request.address_details || request.listing?.location} (Alger)</strong>
            </div>

            <div>
              <span className="text-slate-400 block">Tarif indicatif</span>
              <strong className="text-slate-900">
                {request.listing?.price ? formatPrice(request.listing.price, request.listing.price_unit || 'séance') : 'Sur devis'} (Espèces)
              </strong>
            </div>
          </div>

          {request.note && (
            <div className="pt-2 border-t border-slate-200 text-slate-600">
              <span className="font-semibold text-slate-800">Précisions indiquées : </span>
              {request.note}
            </div>
          )}
        </div>

        {/* Carte de contact de l'administrateur */}
        <AdminCallCard
          title="Le coordinateur va vous appeler"
          subtitle={`Vous recevrez un appel au ${request.client?.phone || 'votre numéro'} pour confirmer les détails. Vous pouvez également joindre l'administrateur directement.`}
        />

        {/* Boutons d'action */}
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/client/demandes"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition"
          >
            Suivre dans "Mes Demandes"
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le récapitulatif</span>
          </button>
        </div>

      </div>

    </div>
  );
}
