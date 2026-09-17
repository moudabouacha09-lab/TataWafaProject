'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DataStore } from '@/lib/store';
import { StarRating } from '@/components/StarRating';
import { formatDateShort } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { 
  Star, 
  Trash2, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  Search, 
  LayoutDashboard,
  CheckCircle2,
  X
} from 'lucide-react';

export default function AdminReviewsModerationPage() {
  const { role, isConfigured, loading: authLoading } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewToDelete, setReviewToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await DataStore.getAdminReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    setDeleting(true);
    try {
      await DataStore.deleteReview(reviewToDelete.id);
      setSuccessMessage('Avis supprimé avec succès.');
      setReviewToDelete(null);
      await loadReviews();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (!authLoading && isConfigured && role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Accès Administrateur Requis</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Cet espace de modération est exclusivement réservé au coordinateur de la plateforme TataWafa.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase();
    const comment = (r.comment || '').toLowerCase();
    const clientName = (r.client?.full_name || '').toLowerCase();
    const providerName = (r.provider?.full_name || '').toLowerCase();
    const listingTitle = (r.listing?.title || '').toLowerCase();
    return comment.includes(q) || clientName.includes(q) || providerName.includes(q) || listingTitle.includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* En-tête */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Espace Administrateur • Modération
            </span>
            <span className="text-[11px] text-slate-400">
              {reviews.length} avis au total
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Modération des Avis & Évaluations
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Consultez les retours d'expérience déposés par les familles après prestation. En accord avec la charte de transparence, la modération est strictement limitée à la suppression d'avis diffamatoires ou non conformes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Tableau de bord</span>
          </Link>
          <Link
            href="/admin/prestataires"
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Contrôle physique</span>
          </Link>
        </div>
      </div>

      {/* Message de succès */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Barre de Recherche */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher par nom de famille, nounou, mot-clé dans le commentaire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 whitespace-nowrap hidden sm:inline">
          {filteredReviews.length} résultat(s)
        </span>
      </div>

      {/* Liste des Avis */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
          <p className="text-sm font-medium">Chargement des avis et évaluations...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Star className="w-7 h-7 fill-amber-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Aucun avis trouvé</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {searchQuery 
              ? 'Aucun avis ne correspond à vos termes de recherche.' 
              : 'Aucun avis n\'a encore été rédigé par les familles après prestation.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div 
              key={rev.id} 
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* En-tête de l'avis */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {rev.client?.full_name || 'Famille / Client'}
                      </span>
                      {rev.client?.phone && (
                        <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {rev.client.phone}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Publié le {formatDateShort(rev.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-xl">
                    <StarRating rating={rev.rating} size="sm" />
                    <span className="text-xs font-bold text-amber-900">{rev.rating}/5</span>
                  </div>
                </div>

                {/* Détails du Prestataire et Annonce */}
                <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-1 border border-slate-100">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-500">Prestataire concerné :</span>
                    <strong className="text-slate-900 font-bold">
                      {rev.provider?.full_name || 'Prestataire'}
                    </strong>
                  </div>
                  {rev.listing?.title && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-500">Service :</span>
                      <span className="text-slate-800 font-medium truncate max-w-[200px]">
                        {rev.listing.title}
                      </span>
                    </div>
                  )}
                  {rev.punctuality_rating && (
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Ponctualité: {rev.punctuality_rating}/5</span>
                      {rev.competence_rating && <span>Compétence: {rev.competence_rating}/5</span>}
                    </div>
                  )}
                </div>

                {/* Commentaire de la famille */}
                <div className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900 block mb-1">Commentaire laissé :</span>
                  {rev.comment ? (
                    <p className="italic text-slate-800">"{rev.comment}"</p>
                  ) : (
                    <p className="italic text-slate-400">Aucun commentaire textuel (note seule).</p>
                  )}
                </div>
              </div>

              {/* Action Modération : Suppression Uniquement */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  ID: {rev.id}
                </span>

                <button
                  onClick={() => setReviewToDelete(rev)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer cet avis</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CONFIRMATION DE SUPPRESSION */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900">
                Confirmer la suppression de l'avis ?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer définitivement cet avis laissé par{' '}
                <strong>{reviewToDelete.client?.full_name || 'le client'}</strong> pour{' '}
                <strong>{reviewToDelete.provider?.full_name || 'le prestataire'}</strong> ?
              </p>
              <p className="text-[11px] text-red-600 bg-red-50 p-2.5 rounded-xl font-medium">
                Cette action est irréversible et retirera cet avis de la note moyenne du prestataire.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-200 transition flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer définitivement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
