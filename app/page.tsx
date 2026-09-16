'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ServiceListing } from '@/types';
import { DataStore } from '@/lib/store';
import { ServiceCard } from '@/components/ServiceCard';
import { TrustBanner } from '@/components/TrustBanner';
import { ALGER_COMMUNES } from '@/lib/constants';
import { 
  Baby, 
  GraduationCap, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Filter, 
  Loader2,
  PlusCircle
} from 'lucide-react';

export default function HomePage() {
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommune, setSelectedCommune] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await DataStore.getListings({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        query: searchQuery || undefined,
      });

      let filtered = data;
      if (selectedCommune !== 'all') {
        filtered = filtered.filter(l => 
          l.location?.toLowerCase().includes(selectedCommune.toLowerCase())
        );
      }

      setListings(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();

    const handleDataChange = () => {
      fetchListings();
    };

    window.addEventListener('sm_data_change', handleDataChange);
    return () => window.removeEventListener('sm_data_change', handleDataChange);
  }, [selectedCategory, searchQuery, selectedCommune]);

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-indigo-100 text-xs font-semibold text-indigo-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Nounous & Enseignants vérifiés en main propre • Alger & Wilaya</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Garde d'Enfants & Cours Particuliers de Confiance à Alger
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Trouvez des personnes dévouées et qualifiées près de chez vous. Chaque demande est vérifiée manuellement par notre équipe avant toute mise en relation.
            </p>

            {/* Barre de Recherche et Sélecteur de Commune */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="bg-white p-2.5 rounded-2xl shadow-soft border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                
                <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-100">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Recherche (ex: Nounou, Mathématiques...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-1/2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 cursor-pointer"
                  >
                    <option value="all">Toutes les communes d'Alger</option>
                    {ALGER_COMMUNES.map((commune) => (
                      <option key={commune} value={commune}>
                        {commune}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={fetchListings}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200 transition whitespace-nowrap"
                >
                  Filtrer
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Zone Principale des Annonces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Onglets de Catégories */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Annonces & Prestataires Disponibles</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Consultez les profils, les avis clients et envoyez une demande de mise en relation.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === 'all'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tous ({listings.length})
            </button>
            <button
              onClick={() => setSelectedCategory('babysitting')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === 'babysitting'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Baby className="w-3.5 h-3.5 text-indigo-600" />
              <span>Garde d'enfants</span>
            </button>
            <button
              onClick={() => setSelectedCategory('teaching')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === 'teaching'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Soutien scolaire</span>
            </button>
          </div>
        </div>

        {/* Grille des Annonces */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Chargement des annonces...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Filter className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Aucune annonce publiée pour le moment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              La plateforme est prête à accueillir ses premières annonces de babysitting et de cours particuliers à Alger !
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/provider/listing"
                className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Publier une annonce de service</span>
              </Link>
              {(searchQuery || selectedCommune !== 'all' || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedCommune('all');
                    setSearchQuery('');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ServiceCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Bannière de Confiance */}
        <TrustBanner />

        {/* Déroulement en 3 Étapes */}
        <div className="my-16 bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Processus Sécurisé
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Comment fonctionne TataWafa ?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Un modèle transparent avec coordination humaine par téléphone pour garantir la sécurité des familles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Étape 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Demande en Ligne</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choisissez votre prestataire selon la commune d'Alger, la date et vos horaires. Recevez une confirmation immédiate sur l'application.
              </p>
            </div>

            {/* Étape 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Coordination Téléphonique</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Notre coordinateur vous appelle et contacte également le prestataire pour valider le créneau horaire et les modalités pratiques.
              </p>
            </div>

            {/* Étape 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Prestation & Vérification Directe</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                La vérification d'identité se fait en personne à votre domicile. Le règlement est versé en espèces (DA) directement au prestataire.
              </p>
            </div>

          </div>
        </div>

        {/* Appel à l'action Prestataires */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Vous êtes Nounou ou Enseignant à Alger ?
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Rejoignez notre communauté locale. Fixez vos tarifs (DA / Séance ou Mois), votre commune d'intervention et travaillez avec des familles de confiance.
            </p>
          </div>
          <Link
            href="/provider/listing"
            className="px-6 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl text-sm shadow-md transition whitespace-nowrap"
          >
            Créer mon annonce de service
          </Link>
        </div>

      </section>

    </div>
  );
}
