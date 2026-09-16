'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { DataStore } from '@/lib/store';
import { ServiceListing, ServiceCategory, PriceUnit } from '@/types';
import { ALGER_COMMUNES } from '@/lib/constants';
import { ADMIN_PHONE } from '@/lib/utils';
import { 
  Baby, 
  GraduationCap, 
  Clock, 
  MapPin, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  PhoneCall,
  ShieldCheck,
  FileCheck2,
  Coins
} from 'lucide-react';
import Link from 'next/link';

export default function ProviderListingPage() {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [listingId, setListingId] = useState<string | null>(null);
  const [category, setCategory] = useState<ServiceCategory>('babysitting');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(2000);
  const [priceUnit, setPriceUnit] = useState<PriceUnit>('séance');
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState<string>(ALGER_COMMUNES[0]);
  const [phone, setPhone] = useState(profile?.phone || '');
  const [photoUrl, setPhotoUrl] = useState('');

  const providerId = profile?.id || user?.id || 'usr_provider_guest';

  useEffect(() => {
    const loadListing = async () => {
      setLoading(true);
      try {
        const existing = await DataStore.getProviderListing(providerId);
        if (existing) {
          setListingId(existing.id);
          setCategory(existing.category);
          setTitle(existing.title);
          setDescription(existing.description || '');
          setPrice(existing.price);
          setPriceUnit(existing.price_unit || 'séance');
          setAvailability(existing.availability || '');
          setLocation(existing.location || ALGER_COMMUNES[0]);
          setPhotoUrl(existing.photo_url || '');
        } else {
          setTitle('Garde d\'enfants attentive & qualifiée');
          setAvailability('Du dimanche au jeudi après-midi, et weekends');
          setLocation(profile?.location || 'Alger Centre');
        }
        if (profile?.phone) {
          setPhone(profile.phone);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [providerId, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('Veuillez impérativement renseigner votre numéro de téléphone.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (profile) {
        await DataStore.saveProfile({
          ...profile,
          phone: phone.trim(),
          location,
        });
      }

      await DataStore.saveListing({
        id: listingId || undefined,
        provider_id: providerId,
        category,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        price_unit: priceUnit,
        availability: availability.trim(),
        location: location.trim(),
        photo_url: photoUrl.trim() || undefined,
      });

      setSubmittedSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'enregistrement de votre annonce.');
    } finally {
      setSaving(false);
    }
  };

  const samplePhotos = {
    babysitting: [
      'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    ],
    teaching: [
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Espace Prestataire
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {listingId ? 'Modifier mon annonce de service' : 'Publier mon annonce de service'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Proposez vos services de garde d'enfants ou de soutien scolaire aux familles d'Alger.
          </p>
        </div>

        <Link
          href="/provider/profile"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition"
        >
          <span>Voir mon profil public</span>
        </Link>
      </div>

      {submittedSuccess ? (
        /* Écran de confirmation de soumission avec Vérification en main propre */
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-md text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Votre dossier et votre annonce ont été transmis avec succès !
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Merci pour votre candidature sur la plateforme TataWafa. Votre annonce a bien été enregistrée.
            </p>
          </div>

          {/* Encadré d'instructions pour la remise des pièces justificatives en main propre */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-2.5 text-indigo-900 font-bold text-sm">
              <FileCheck2 className="w-5 h-5 text-indigo-600" />
              <span>Processus de vérification des documents en main propre</span>
            </div>
            
            <p className="text-xs text-slate-700 leading-relaxed">
              Pour des raisons strictes de sécurité et de protection des données, <strong>aucun document sensible n'est téléversé sur le site internet</strong>. L'administrateur prend en charge la vérification physique de vos pièces justificatives directement en main propre :
            </p>

            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside bg-white p-4 rounded-xl border border-slate-200">
              <li><strong>Pièce d'identité officielle</strong> (Carte nationale biométrique ou Passeport)</li>
              <li><strong>Justificatifs d'expérience</strong> ou diplômes (Garde d'enfants, Attestation de réussite, Certificat d'études)</li>
              <li><strong>Coordonnées téléphoniques vérifiées</strong> (l'admin vous appellera à votre numéro)</li>
            </ul>

            <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-xs text-indigo-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold block text-sm">📞 Contact Administratif Direct</span>
                <span className="text-indigo-800">L'administrateur est joignable pour convenir du rendez-vous :</span>
              </div>
              <div className="text-base font-extrabold text-indigo-700 bg-white px-3.5 py-2 rounded-lg border border-indigo-200 text-center shadow-sm">
                {ADMIN_PHONE}
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition"
            >
              Retour à l'accueil
            </Link>
            <button
              type="button"
              onClick={() => setSubmittedSuccess(false)}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm rounded-xl transition"
            >
              Modifier mon annonce
            </button>
          </div>
        </div>
      ) : (
        /* Formulaire de l'annonce */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2 font-medium">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Choix de la catégorie */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Type de service proposé
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setCategory('babysitting')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                  category === 'babysitting'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${category === 'babysitting' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Garde d'enfants (Babysitting)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Nourrissons, tout-petits, sorties d'école, soirées</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setCategory('teaching')}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition ${
                  category === 'teaching'
                    ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`p-2.5 rounded-xl ${category === 'teaching' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Cours & Soutien scolaire</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Mathématiques, Langues, Sciences, Primaire / CEM / Lycée</p>
                </div>
              </button>
            </div>
          </div>

          {/* Titre de l'annonce */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Titre de votre annonce
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Nounou expérimentée et douce pour enfants à Hydra"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          {/* Téléphone & Commune */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                Votre Numéro de Téléphone (Obligatoire)
              </label>
              <input
                type="tel"
                required
                placeholder="Ex: 0550 12 34 56 / 0660 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Utilisé par l'administrateur pour la coordination.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Commune d'intervention (Alger)
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none cursor-pointer"
              >
                {ALGER_COMMUNES.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tarif en DA / Séance ou Mois */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                Montant du tarif (en Dinars Algériens - DA)
              </label>
              <input
                type="number"
                required
                min={500}
                step={100}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Unité de facturation
              </label>
              <select
                value={priceUnit}
                onChange={(e) => setPriceUnit(e.target.value as PriceUnit)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none cursor-pointer"
              >
                <option value="séance">DA / Séance</option>
                <option value="mois">DA / Mois</option>
                <option value="heure">DA / Heure</option>
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">Règlement direct de main à main.</span>
            </div>
          </div>

          {/* Disponibilités */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Créneaux horaires & Disponibilités
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Du dimanche au jeudi après-midi, ou weekends complets"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          {/* Description & Expérience */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description de vos compétences & Expérience
            </label>
            <textarea
              rows={4}
              required
              placeholder="Détaillez votre parcours, vos années d'expérience, les tranches d'âges ou niveaux scolaires pris en charge, et votre approche bienveillante."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none leading-relaxed"
            />
          </div>

          {/* Photo de profil (Optionnel) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              Photo d'illustration (Lien URL ou sélection parmi nos modèles)
            </label>

            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
            
            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-2">Ou choisissez une photo adaptée :</span>
              <div className="flex items-center gap-3">
                {samplePhotos[category].map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotoUrl(url)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition ${
                      photoUrl === url ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rappel vérification en main propre */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Remise des pièces en main propre</span>
            </div>
            <p className="text-slate-600">
              Aucun document n'est demandé en ligne. Après l'envoi de votre annonce, l'administrateur vous appellera pour convenir d'une entrevue physique de vérification de vos pièces d'identité et diplômes.
            </p>
          </div>

          {/* Bouton Enregistrer */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Transmission...</span>
                </>
              ) : (
                <span>Soumettre mon annonce</span>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
