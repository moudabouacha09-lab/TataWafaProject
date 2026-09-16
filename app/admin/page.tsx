'use client';

import React, { useState, useEffect } from 'react';
import { 
  ServiceRequest, 
  RequestStatus, 
  Profile, 
  ServiceListing, 
  UserRole 
} from '@/types';
import { DataStore } from '@/lib/store';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { getStatusBadgeStyle, formatDate, formatPrice, getCategoryBadge, ADMIN_PHONE } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Clock, 
  PhoneCall, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  User, 
  ChevronRight, 
  Sparkles,
  Loader2,
  Trash2,
  Lock,
  MapPin,
  Coins
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { role, isConfigured, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'users' | 'listings'>('requests');
  
  // Requests state
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');
  
  // Users state
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  
  // Listings state
  const [listings, setListings] = useState<ServiceListing[]>([]);
  
  // General state
  const [loading, setLoading] = useState(true);
  const [realtimeNotice, setRealtimeNotice] = useState<string | null>(null);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [allRequests, allProfiles, allListings] = await Promise.all([
        DataStore.getRequests(),
        DataStore.getProfiles(),
        DataStore.getListings(),
      ]);
      setRequests(allRequests);
      setProfiles(allProfiles);
      setListings(allListings);

      if (selectedRequest) {
        const refreshed = allRequests.find(r => r.id === selectedRequest.id);
        if (refreshed) setSelectedRequest(refreshed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();

    // 1. Supabase Realtime Subscription if configured
    let channel: any = null;
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        channel = supabase
          .channel('admin-requests')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'requests' },
            (payload) => {
              setRealtimeNotice(`Nouvelle mise à jour en direct (${payload.eventType}) à ${new Date().toLocaleTimeString('fr-FR')}`);
              loadAllData();
              setTimeout(() => setRealtimeNotice(null), 5000);
            }
          )
          .subscribe();
      }
    }

    // 2. Local reactive event listener
    const handleDataChange = () => {
      loadAllData();
    };

    window.addEventListener('sm_data_change', handleDataChange);

    return () => {
      if (channel) channel.unsubscribe();
      window.removeEventListener('sm_data_change', handleDataChange);
    };
  }, []);

  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    await DataStore.updateRequestStatus(requestId, newStatus);
    await loadAllData();
  };

  const filteredRequests = requests.filter((r) => {
    if (requestStatusFilter === 'all') return true;
    return r.status === requestStatusFilter;
  });

  const filteredProfiles = profiles.filter((p) => {
    if (userRoleFilter === 'all') return true;
    return p.role === userRoleFilter;
  });

  const newRequestsCount = requests.filter(r => r.status === 'new').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  if (!authLoading && isConfigured && role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-5">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Accès Administrateur Restreint</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Cet espace confidentiel contient les numéros de téléphone privés des familles et des prestataires. Vous devez être connecté avec un compte disposant du rôle <strong>admin</strong>.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 shadow-md transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* En-tête Espace Admin */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Espace Administrateur • Coordination Manuelle à Alger
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Flux en Direct
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tableau de Bord & Dispatch Téléphonique
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Consultez les demandes des familles en temps réel, coordonnez par téléphone avec les prestataires, vérifiez les pièces justificatives en main propre et mettez à jour les statuts.
          </p>
        </div>

        <button
          onClick={loadAllData}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Actualiser les données</span>
        </button>
      </div>

      {/* Notification d'événement en temps réel */}
      {realtimeNotice && (
        <div className="p-4 rounded-2xl bg-indigo-900 text-white text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top duration-300 shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{realtimeNotice}</span>
          </div>
          <span className="text-[10px] text-indigo-300">Synchronisé</span>
        </div>
      )}

      {/* Compteurs de Synthèse */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Demandes Totales</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{requests.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <LayoutDashboard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-amber-700">À Coordonner (Nouvelles)</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{newRequestsCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-blue-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-700">En Coordination</span>
            <div className="text-2xl font-black text-blue-600 mt-1">{inProgressCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-700">Prestations Effectuées</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Onglets de Navigation Admin */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'requests'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>Flux des Demandes ({requests.length})</span>
          {newRequestsCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
              {newRequestsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Annuaire Utilisateurs ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'listings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Annonces Publiées ({listings.length})</span>
        </button>
      </div>

      {/* CONTENU ONGLET 1: DEMANDES & COORDINATION */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Liste des demandes */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              <span className="text-xs font-semibold text-slate-500">Filtrer par statut :</span>
              <div className="flex gap-1.5">
                {[
                  { key: 'all', label: 'Toutes' },
                  { key: 'new', label: 'Nouvelles' },
                  { key: 'in_progress', label: 'En cours' },
                  { key: 'completed', label: 'Terminées' },
                  { key: 'cancelled', label: 'Annulées' },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setRequestStatusFilter(s.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      requestStatusFilter === s.key
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center text-slate-400 space-y-2">
                <p className="text-sm font-semibold text-slate-700">Aucune demande trouvée</p>
                <p className="text-xs text-slate-400">Les nouvelles demandes de réservation apparaîtront ici dès leur envoi.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((req) => {
                  const badge = getStatusBadgeStyle(req.status);
                  const isSelected = selectedRequest?.id === req.id;
                  const catBadge = req.listing ? getCategoryBadge(req.listing.category) : null;

                  return (
                    <div
                      key={req.id}
                      onClick={() => setSelectedRequest(req)}
                      className={`cursor-pointer rounded-2xl p-4 sm:p-5 border transition-all ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${catBadge?.badgeClass}`}>
                              {catBadge?.label}
                            </span>
                            <span className="text-[11px] text-slate-400">#{req.id.slice(-6)}</span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            {req.listing?.title || 'Annonce de service'}
                          </h3>

                          <div className="flex items-center gap-3 text-xs text-slate-600">
                            <span>Famille : <strong className="text-slate-800">{req.client?.full_name || 'Client'}</strong></span>
                            <span>•</span>
                            <span>Prestataire : <strong className="text-slate-800">{req.listing?.provider?.full_name || 'Prestataire'}</strong></span>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          {formatDate(req.requested_datetime)}
                        </span>
                        <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                          <span>Gérer la coordination</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Panneau de coordination sélectionnée */}
          <div className="lg:col-span-5">
            {selectedRequest ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-6 sticky top-24">
                
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Détail de la Coordination
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      Demande #{selectedRequest.id.slice(-6)}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeStyle(selectedRequest.status).bg}`}>
                    {getStatusBadgeStyle(selectedRequest.status).label}
                  </span>
                </div>

                {/* Bloc Coordonnées Téléphoniques */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Contacts Téléphoniques Directs
                  </h4>

                  {/* Téléphone Client */}
                  <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-900 block">Famille (Client)</span>
                      <strong className="text-sm text-slate-900">{selectedRequest.client?.full_name || 'Client'}</strong>
                      <p className="text-xs font-bold text-indigo-700 mt-0.5 flex items-center gap-1">
                        <PhoneCall className="w-3.5 h-3.5" />
                        {selectedRequest.client?.phone || 'Numéro non renseigné'}
                      </p>
                    </div>
                    {selectedRequest.client?.phone && (
                      <a
                        href={`tel:${selectedRequest.client.phone}`}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
                      >
                        Appeler
                      </a>
                    )}
                  </div>

                  {/* Téléphone Prestataire */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-900 block">Prestataire (Nounou/Prof)</span>
                      <strong className="text-sm text-slate-900">{selectedRequest.listing?.provider?.full_name || 'Prestataire'}</strong>
                      <p className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                        <PhoneCall className="w-3.5 h-3.5" />
                        {selectedRequest.listing?.provider?.phone || 'Numéro non renseigné'}
                      </p>
                    </div>
                    {selectedRequest.listing?.provider?.phone && (
                      <a
                        href={`tel:${selectedRequest.listing.provider.phone}`}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                      >
                        Appeler
                      </a>
                    )}
                  </div>
                </div>

                {/* Précisions de la demande */}
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-medium">Date & Heure : </span>
                    <span className="font-bold text-slate-800">{formatDate(selectedRequest.requested_datetime)}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-medium">Lieu (Commune) : </span>
                    <span className="font-bold text-slate-800">{selectedRequest.listing?.location || 'Alger'}</span>
                  </div>

                  {selectedRequest.note && (
                    <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-amber-950">
                      <span className="font-bold block mb-0.5">Note du client :</span>
                      <p>{selectedRequest.note}</p>
                    </div>
                  )}
                </div>

                {/* Actions de changement de statut */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Mise à jour du statut
                  </h4>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, 'in_progress')}
                      disabled={selectedRequest.status === 'in_progress'}
                      className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-4 h-4" />
                      <span>1. Marquer En Cours de Coordination</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, 'completed')}
                      disabled={selectedRequest.status === 'completed'}
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>2. Marquer comme Prestation Effectuée</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, 'cancelled')}
                      disabled={selectedRequest.status === 'cancelled'}
                      className="w-full py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 disabled:opacity-40 text-xs font-semibold transition border border-rose-200 flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Annuler la demande</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400 space-y-2">
                <PhoneCall className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">Sélectionnez une demande dans la liste pour afficher les numéros de téléphone et coordonner la mission.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* CONTENU ONGLET 2: ANNUAIRE DES UTILISATEURS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Annuaire des Familles & Prestataires</h2>
              <p className="text-xs text-slate-500">Liste des profils inscrits sur la plateforme.</p>
            </div>

            <div className="flex gap-2">
              {['all', 'client', 'provider', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                    userRoleFilter === r
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r === 'all' ? 'Tous' : r === 'provider' ? 'Prestataires' : r === 'client' ? 'Clients' : 'Admins'}
                </button>
              ))}
            </div>
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm">Aucun utilisateur inscrit pour le moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredProfiles.map((p) => (
                <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border flex items-center justify-center font-bold text-slate-700 text-sm">
                      {p.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{p.full_name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                          p.role === 'admin'
                            ? 'bg-amber-100 text-amber-800'
                            : p.role === 'provider'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.role === 'provider' ? 'Prestataire' : p.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {p.phone || 'Pas de numéro'} • {p.location || 'Alger'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {p.phone && (
                      <a
                        href={`tel:${p.phone}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Appeler</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTENU ONGLET 3: GESTION DES ANNONCES */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Toutes les Annonces de Service</h2>
            <p className="text-xs text-slate-500">Supervisez les tarifs et prestations proposées à Alger.</p>
          </div>

          {listings.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <p className="text-sm">Aucune annonce publiée pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((l) => (
                <div key={l.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      {l.category === 'babysitting' ? 'Garde d\'enfants' : 'Soutien scolaire'}
                    </span>
                    <strong className="text-xs font-bold text-slate-900">{formatPrice(l.price, l.price_unit || 'séance')}</strong>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{l.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{l.description}</p>
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">{l.location} (Alger)</span>
                    <Link
                      href={`/services/${l.id}`}
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Consulter →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
