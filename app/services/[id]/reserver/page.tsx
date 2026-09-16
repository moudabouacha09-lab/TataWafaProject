'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ServiceListing } from '@/types';
import { DataStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { formatPrice, ADMIN_PHONE } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  PhoneCall, 
  User, 
  MapPin, 
  Coins, 
  AlertCircle, 
  Loader2,
  FileText,
  Baby,
  GraduationCap
} from 'lucide-react';

export default function BookServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { profile, user } = useAuth();

  const [listing, setListing] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('14:00');
  const [durationHours, setDurationHours] = useState<number>(2);
  const [childCount, setChildCount] = useState<number>(1);
  const [childAgeOrGrade, setChildAgeOrGrade] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [note, setNote] = useState('');
  const [clientName, setClientName] = useState(profile?.full_name || '');
  const [clientPhone, setClientPhone] = useState(profile?.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListing = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await DataStore.getListingById(id);
        setListing(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadListing();
  }, [id]);

  useEffect(() => {
    if (profile) {
      if (!clientName && profile.full_name) setClientName(profile.full_name);
      if (!clientPhone && profile.phone) setClientPhone(profile.phone);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Préparation du formulaire de réservation...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Annonce non trouvée</h2>
        <Link href="/services" className="text-xs font-bold text-indigo-600 hover:underline">
          Retour au catalogue des services
        </Link>
      </div>
    );
  }

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredDate) {
      setError('Veuillez choisir une date pour l\'intervention.');
      return;
    }
    setError(null);
    setCurrentStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCurrentStep(3);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPhone) {
      setError('Le numéro de téléphone est indispensable pour que notre coordinateur puisse vous appeler.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const clientId = profile?.id || user?.id || `client_${Date.now()}`;
      
      // Mettre à jour profil si nécessaire
      if (profile && (clientPhone !== profile.phone || clientName !== profile.full_name)) {
        await DataStore.saveProfile({
          ...profile,
          phone: clientPhone,
          full_name: clientName,
        });
      }

      const combinedDatetime = new Date(`${preferredDate}T${preferredTime}:00`).toISOString();

      const created = await DataStore.createRequest({
        client_id: clientId,
        listing_id: listing.id,
        requested_datetime: combinedDatetime,
        note: note.trim() || undefined,
        child_count: Number(childCount),
        child_age_or_grade: childAgeOrGrade.trim() || undefined,
        address_details: addressDetails.trim() || undefined,
        duration_hours: Number(durationHours),
      });

      router.push(`/confirmation/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'enregistrement de votre réservation.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Bouton retour */}
      <div>
        <Link
          href={`/services/${listing.id}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'annonce</span>
        </Link>
      </div>

      {/* En-tête de la réservation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Réservation sans paiement en ligne
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              Réserver une prestation à Alger
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Avec {listing.provider?.full_name || 'le prestataire'} • {listing.location} (Alger)
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 font-medium block">Tarif convenu</span>
            <strong className="text-xl font-black text-slate-900">
              {formatPrice(listing.price, listing.price_unit || 'séance')}
            </strong>
          </div>
        </div>

        {/* Stepper horizontal */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[
            { step: 1, label: '1. Date & Horaires' },
            { step: 2, label: '2. Enfants & Lieu' },
            { step: 3, label: '3. Vos Coordonnées' },
          ].map((s) => (
            <div
              key={s.step}
              className={`text-center py-2 rounded-xl text-xs font-bold border transition ${
                currentStep === s.step
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : currentStep > s.step
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-50 text-slate-400 border-slate-200'
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ÉTAPE 1: DATE & HORAIRES */}
      {currentStep === 1 && (
        <form onSubmit={handleNextStep1} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Étape 1 : Quand souhaitez-vous cette prestation ?
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Date souhaitée
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Heure de début souhaitée
              </label>
              <input
                type="time"
                required
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Durée estimée (en heures)
            </label>
            <select
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none cursor-pointer"
            >
              <option value={1}>1 heure</option>
              <option value={2}>2 heures (standard)</option>
              <option value={3}>3 heures</option>
              <option value={4}>Demi-journée (4h)</option>
              <option value={8}>Journée complète (8h)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Continuer vers l'Étape 2 →
            </button>
          </div>
        </form>
      )}

      {/* ÉTAPE 2: ENFANTS & ADRESSE */}
      {currentStep === 2 && (
        <form onSubmit={handleNextStep2} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            {listing.category === 'babysitting' ? <Baby className="w-5 h-5 text-indigo-600" /> : <GraduationCap className="w-5 h-5 text-emerald-600" />}
            Étape 2 : Précisions sur les enfants et le lieu
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre d'enfants concernés
              </label>
              <input
                type="number"
                min={1}
                max={5}
                required
                value={childCount}
                onChange={(e) => setChildCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {listing.category === 'babysitting' ? 'Âges des enfants' : 'Classe / Niveau scolaire'}
              </label>
              <input
                type="text"
                required
                placeholder={listing.category === 'babysitting' ? 'Ex: 2 ans et 5 ans' : 'Ex: 4ème année CEM (BEM)'}
                value={childAgeOrGrade}
                onChange={(e) => setChildAgeOrGrade(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Adresse / Quartier dans la commune ({listing.location})
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Cité 120 logements, près du commissariat central"
              value={addressDetails}
              onChange={(e) => setAddressDetails(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Remarques particulières pour le coordinateur
            </label>
            <textarea
              rows={3}
              placeholder="Précisions sur les habitudes des enfants, devoirs spécifiques, etc."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              ← Retour
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Continuer vers la confirmation →
            </button>
          </div>
        </form>
      )}

      {/* ÉTAPE 3: VOS COORDONNÉES & CONFIRMATION */}
      {currentStep === 3 && (
        <form onSubmit={handleFinalSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-indigo-600" />
            Étape 3 : Vos coordonnées de contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Votre Nom et Prénom
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Mohamed Merah"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Numéro de Téléphone (Obligatoire)
              </label>
              <input
                type="tel"
                required
                placeholder="0550 00 00 00 / 0660 00 00 00"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Récapitulatif solennel */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Récapitulatif de votre demande</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <div>Date : <strong>{preferredDate} à {preferredTime}</strong></div>
              <div>Durée : <strong>{durationHours} heure(s)</strong></div>
              <div>Lieu : <strong>{addressDetails || listing.location} (Alger)</strong></div>
              <div>Tarif indicatif : <strong>{formatPrice(listing.price, listing.price_unit || 'séance')}</strong></div>
            </div>

            <div className="pt-2 border-t border-indigo-200/60 text-[11px] text-slate-600 leading-relaxed">
              En soumettant cette demande, aucun paiement n'est prélevé en ligne. Notre coordinateur vous contactera au <strong>{clientPhone || 'votre numéro'}</strong> pour confirmer l'horaire et coordonner la mission. Le règlement s'effectue en espèces en main propre.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              ← Retour
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validation de la réservation...</span>
                </>
              ) : (
                <span>Confirmer et Envoyer la Demande</span>
              )}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
