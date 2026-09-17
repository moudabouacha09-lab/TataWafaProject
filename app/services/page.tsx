'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ServiceListing } from '@/types';
import { DataStore } from '@/lib/store';
import { ServiceCard } from '@/components/ServiceCard';
import { ALGER_COMMUNES } from '@/lib/constants';
import { 
  Baby, 
  GraduationCap, 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  ShieldCheck, 
  Coins, 
  Loader2,
  X,
  Filter
} from 'lucide-react';
import Link from 'next/link';

function ServicesDirectoryContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedCommune, setSelectedCommune] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'price_asc' | 'price_desc'>('recent');
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Seules les annonces vérifiées en main propre sont retournées par défaut
      let data = await DataStore.getListings({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        commune: selectedCommune !== 'all' ? selectedCommune : undefined,
        query: searchQuery || undefined,
        maxPrice: maxPrice,
      });

      // Tri
      if (sortBy === 'rating') {
        data.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
      } else if (sortBy === 'price_asc') {
        data.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        data.sort((a, b) => b.price - a.price);
      } else {
        data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedCommune, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedCommune('all');
    setSearchQuery('');
    setMaxPrice(10000);
    setSortBy('recent');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Wilaya d'Alger
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Vérifiés en main propre
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Catalogue des Annonces & Prestataires Certifiés
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Chaque nounou et professeur listé a fait l'objet d'un contrôle physique de ses pièces originales (CNI, diplômes) par notre équipe.
          </p>
        </div>

        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filtres de recherche</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* FILTRES LATÉRAUX (DESKTOP) */}
        <aside className="hidden lg:block space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6 sticky top-24">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                Filtres & Critères
              </h3>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] text-indigo-600 font-semibold hover:underline"
              >
                Réinitialiser
              </button>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Catégorie de Service
              </label>
              <div className="space-y-1.5">
                {[
                  { key: 'all', label: 'Toutes les catégories' },
                  { key: 'babysitting', label: 'Garde d\'enfants' },
                  { key: 'teaching', label: 'Cours & Soutien scolaire' },
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setSelectedCategory(c.key)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      selectedCategory === c.key
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Commune d'Alger */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Commune d'Alger
              </label>
              <select
                value={selectedCommune}
                onChange={(e) => setSelectedCommune(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none cursor-pointer"
              >
                <option value="all">Toutes les 57 communes</option>
                {ALGER_COMMUNES.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
            </div>

            {/* Tarif Max (DA) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tarif Max
                </label>
                <span className="text-xs font-black text-indigo-600">{maxPrice} DA</span>
              </div>
              <input
                type="range"
                min={1000}
                max={20000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1 000 DA</span>
                <span>20 000 DA</span>
              </div>
            </div>

            {/* Garantie de Confiance & Zéro Non-Vérifié */}
            <div className="pt-3 border-t border-slate-100 bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garantie 100% Vérifiés</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Toutes les annonces visibles dans cet annuaire ont validé le contrôle physique en main propre (CNI et diplômes vérifiés en face-à-face). Les profils non vérifiés ne sont ni listés ni réservables.
              </p>
            </div>

          </div>
        </aside>

        {/* TIROIR DE FILTRES MOBILE */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end lg:hidden animate-in fade-in">
            <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  Filtres de recherche
                </h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Catégorie Mobile */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Catégorie
                </label>
                <div className="space-y-1.5">
                  {[
                    { key: 'all', label: 'Toutes les catégories' },
                    { key: 'babysitting', label: 'Garde d\'enfants' },
                    { key: 'teaching', label: 'Cours & Soutien scolaire' },
                  ].map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => { setSelectedCategory(c.key); }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                        selectedCategory === c.key
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Commune Mobile */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Commune d'Alger
                </label>
                <select
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none cursor-pointer"
                >
                  <option value="all">Toutes les 57 communes</option>
                  {ALGER_COMMUNES.map((commune) => (
                    <option key={commune} value={commune}>
                      {commune}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tarif Max Mobile */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tarif Max
                  </label>
                  <span className="text-xs font-black text-indigo-600">{maxPrice} DA</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={20000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Garantie Mobile */}
              <div className="pt-3 border-t border-slate-100 bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Vérifiés en main propre</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-snug">
                  Seuls les prestataires physiquement contrôlés sont présentés.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => { handleResetFilters(); setMobileFiltersOpen(false); }}
                  className="flex-1 py-2.5 px-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Réinitialiser
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-2.5 px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTENU PRINCIPAL */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Barre supérieure : Recherche & Tri */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Recherche par mot-clé, matière, quartier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-500 whitespace-nowrap">Trier par :</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none cursor-pointer"
              >
                <option value="recent">Plus récents</option>
                <option value="rating">Meilleures notes</option>
                <option value="price_asc">Prix croissant (DA)</option>
                <option value="price_desc">Prix décroissant (DA)</option>
              </select>
            </div>

          </div>

          {/* Grille des résultats */}
          {loading ? (
            <div className="py-24 text-center text-slate-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
              <p className="text-sm font-medium">Recherche dans les 57 communes d'Alger...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Filter className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Aucun résultat trouvé</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aucune annonce ne correspond à ces critères de recherche. Essayez d'élargir la commune ou les filtres de prix.
              </p>
              <div>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ServiceCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function ServicesDirectoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Chargement de l'annuaire d'Alger...</p>
        </div>
      </div>
    }>
      <ServicesDirectoryContent />
    </Suspense>
  );
}
