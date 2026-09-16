'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ServiceListing } from '@/types';
import { DataStore } from '@/lib/store';
import { ServiceCard } from '@/components/ServiceCard';
import { VerificationBadge } from '@/components/VerificationBadge';
import { AdminCallCard } from '@/components/AdminCallCard';
import { ALGER_COMMUNES, CATEGORIES_CONFIG, SAFETY_PILLARS, FAQ_ITEMS, ADMIN_CONTACT } from '@/lib/constants';
import { 
  Baby, 
  GraduationCap, 
  Search, 
  MapPin, 
  ShieldCheck, 
  PhoneCall, 
  CheckCircle2, 
  ArrowRight, 
  Coins, 
  Star, 
  HeartHandshake,
  UserCheck2,
  HelpCircle,
  Clock,
  Sparkles,
  ChevronDown
} from 'lucide-react';

export default function HomePage() {
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [selectedCommune, setSelectedCommune] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await DataStore.getListings({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        commune: selectedCommune !== 'all' ? selectedCommune : undefined,
        query: searchQuery || undefined,
      });
      setListings(data);
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
  }, [selectedCommune, selectedCategory]);

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* SECTION 1: HERO AVEC RECHERCHE PAR COMMUNE */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-12 pb-16 sm:pt-20 sm:pb-28 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto space-y-5">
            
            {/* Badge de confiance Algérie */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-emerald-200 text-xs font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Nounous & Enseignants vérifiés en main propre • 57 Communes d'Alger</span>
            </div>

            {/* Titre Principal */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Trouvez une Nounou de Confiance ou un Enseignant Particulier à Alger
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              La plateforme sécurisée qui met en relation les familles d'Alger avec des prestataires soigneusement contrôlés. Coordination humaine par téléphone et règlement direct en espèces (DA).
            </p>

            {/* Barre de Recherche Multi-Critères */}
            <div className="pt-4 max-w-3xl mx-auto">
              <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2.5">
                
                {/* Catégorie */}
                <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-100">
                  <Baby className="w-4 h-4 text-indigo-600 shrink-0" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="all">Tous les services</option>
                    <option value="babysitting">Garde d'enfants (Babysitting)</option>
                    <option value="teaching">Cours & Soutien scolaire</option>
                  </select>
                </div>

                {/* Commune d'Alger */}
                <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-slate-100">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <select
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 font-medium cursor-pointer"
                  >
                    <option value="all">Toutes les 57 communes d'Alger</option>
                    {ALGER_COMMUNES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mot-clé */}
                <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-1/3">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Matière, niveau, mot-clé..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
                    className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
                  />
                </div>

                {/* Bouton Filtrer */}
                <button
                  type="button"
                  onClick={fetchListings}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition whitespace-nowrap flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Rechercher</span>
                </button>

              </div>
            </div>

            {/* Statistiques clés de confiance */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-indigo-600 font-black text-lg block">57</span>
                <span className="text-[11px] text-slate-500 font-medium">Communes d'Alger couvertes</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-emerald-600 font-black text-lg block">100%</span>
                <span className="text-[11px] text-slate-500 font-medium">Vérification en main propre</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-amber-600 font-black text-lg block">DA</span>
                <span className="text-[11px] text-slate-500 font-medium">Tarifs clairs en espèces</span>
              </div>
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80">
                <span className="text-indigo-600 font-black text-lg block">7j/7</span>
                <span className="text-[11px] text-slate-500 font-medium">Coordination téléphonique</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 2: DEUX CATÉGORIES PRINCIPALES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Nos Métiers de Cœur
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Deux services essentiels pour la sérénité des familles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Choisissez la spécialité qui correspond aux besoins de vos enfants à Alger.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Carte Babysitting */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
                <Baby className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Garde d'Enfants & Nounous</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Confiez vos tout-petits et vos enfants scolarisés à des personnes fiables, ponctuelles et expérimentées.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                {CATEGORIES_CONFIG.babysitting.subcategories.map((sub, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-indigo-100 flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">À partir de 1 500 DA / Séance</span>
              <Link
                href="/services?category=babysitting"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
              >
                <span>Voir les nounous</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Carte Soutien Scolaire */}
          <div className="bg-gradient-to-br from-emerald-50/70 to-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Cours Particuliers & Soutien Scolaire</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Accompagnement bienveillant pour la réussite scolaire au Primaire, CEM (BEM) et Lycée (BAC).
                </p>
              </div>

              <ul className="space-y-2 text-xs text-slate-700">
                {CATEGORIES_CONFIG.teaching.subcategories.map((sub, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">À partir de 1 500 DA / Séance</span>
              <Link
                href="/services?category=teaching"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 transition"
              >
                <span>Voir les enseignants</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: DERNIÈRES ANNONCES DISPONIBLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Prestataires Disponibles à Alger</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Consultez les annonces enregistrées et réservez en quelques clics.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>Explorer tout le catalogue ({listings.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <span className="text-sm font-medium">Chargement des annonces...</span>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center max-w-lg mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Aucune annonce publiée pour le moment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              La plateforme démarre à zéro ! Vous êtes nounou ou enseignant à Alger ? Publiez la première annonce et soyez visible par les familles de votre quartier.
            </p>
            <div>
              <Link
                href="/provider/annonces"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition"
              >
                <span>Publier une annonce de service</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.slice(0, 8).map((listing) => (
              <ServiceCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4: CHARTE DE CONFIANCE & SÉCURITÉ EN MAIN PROPRE */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Notre Protocole de Confiance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pourquoi TataWafa est la solution la plus sûre à Alger
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              La sécurité de vos enfants passe avant le digital. Aucun document d'identité n'est exposé en ligne.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SAFETY_PILLARS.map((p, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-base border border-indigo-500/30">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-sm text-white">{p.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/securite-et-confiance"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition shadow-lg"
            >
              <span>Lire notre charte de sécurité détaillée</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 5: CONTACT DIRECT & FOIRE AUX QUESTIONS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Encadré d'appel coordinateur */}
        <AdminCallCard
          title="Une question urgente ou besoin d'une garde ce soir ?"
          subtitle="Notre coordinateur de plateforme est joignable directement par téléphone à Alger."
        />

        {/* Foire Aux Questions */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Réponses Claires
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">Foire Aux Questions</h2>
          </div>

          <div className="divide-y divide-slate-200 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-4 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left flex items-center justify-between gap-4 group"
                  >
                    <span className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition">
                      {item.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed pl-2 border-l-2 border-indigo-600 animate-in fade-in duration-200">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/faq"
              className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              <span>Consulter toutes les questions fréquentes →</span>
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
