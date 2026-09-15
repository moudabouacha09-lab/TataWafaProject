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
import { getStatusBadgeStyle, formatDate, formatPrice, getCategoryBadge } from '@/lib/utils';
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
  Plus,
  Lock
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

      // Keep selected request updated if open
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
              setRealtimeNotice(`Live Request Event: ${payload.eventType} at ${new Date().toLocaleTimeString()}`);
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
        <h2 className="text-2xl font-extrabold text-slate-900">Admin Access Restricted</h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          This dashboard contains private coordinator contact data (client and provider phone numbers). You must be signed in with an account having the <strong className="text-slate-900">admin</strong> role in Supabase.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 shadow-md transition"
          >
            Return to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Site Owner Hub • Manual Coordinator
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Realtime Feed
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin Coordination Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Review incoming requests in real-time, coordinate offline with clients and providers by phone, and update dispatch status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Realtime Notification Banner */}
      {realtimeNotice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{realtimeNotice}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-amber-700 block">Pending Phone Coordination</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-1 flex items-center justify-between">
            <span>{newRequestsCount}</span>
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
          <span className="text-[11px] text-amber-600 mt-1 block">New incoming requests</span>
        </div>

        <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-blue-700 block">In Progress / Coordinated</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-1 flex items-center justify-between">
            <span>{inProgressCount}</span>
            <PhoneCall className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-[11px] text-blue-600 mt-1 block">Scheduled visits</span>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-emerald-700 block">Completed Services</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1 flex items-center justify-between">
            <span>{completedCount}</span>
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Review eligible</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-700 block">Total Active Users</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 flex items-center justify-between">
            <span>{profiles.length}</span>
            <Users className="w-6 h-6 text-slate-400" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Clients & Providers</span>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'requests'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Incoming Requests ({requests.length})</span>
          {newRequestsCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-white font-bold">
              {newRequestsCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Providers Directory ({profiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Service Listings ({listings.length})</span>
        </button>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: REQUESTS REALTIME FEED & COORDINATION */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'All Requests' },
              { key: 'new', label: `New (${newRequestsCount})` },
              { key: 'in_progress', label: `In Progress (${inProgressCount})` },
              { key: 'completed', label: `Completed (${completedCount})` },
              { key: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRequestStatusFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  requestStatusFilter === tab.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
              <p className="text-sm font-medium mt-2">Loading requests feed...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500">
              <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-sm">No requests match this filter.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => {
                const badge = getStatusBadgeStyle(req.status);
                const client = req.client;
                const provider = req.listing?.provider;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-indigo-300 transition space-y-4"
                  >
                    
                    {/* Header line */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-xs font-mono text-slate-400">ID: {req.id}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">Received {formatDate(req.created_at)}</span>
                      </div>

                      {/* Status Transition Action Buttons */}
                      <div className="flex items-center gap-2">
                        {req.status === 'new' && (
                          <button
                            onClick={() => handleStatusChange(req.id, 'in_progress')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Mark In Coordination</span>
                          </button>
                        )}

                        {req.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusChange(req.id, 'completed')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>
                        )}

                        {req.status !== 'cancelled' && req.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusChange(req.id, 'cancelled')}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-xs font-semibold rounded-lg transition"
                          >
                            Cancel
                          </button>
                        )}

                        {req.status === 'completed' && (
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            Service Fulfilled
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Offline Phone Coordination Match Info Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                      
                      {/* Client Info for calling */}
                      <div className="space-y-1">
                        <span className="font-bold text-indigo-900 uppercase tracking-wider block">
                          1. Client Contact (Call First)
                        </span>
                        <p className="font-bold text-sm text-slate-900">{client?.full_name || 'Client'}</p>
                        <p className="text-slate-600 flex items-center gap-1 font-mono">
                          <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                          <strong className="text-indigo-700">{client?.phone || 'No phone'}</strong>
                        </p>
                        <p className="text-slate-500">Location: {client?.location || req.listing?.location || 'Local'}</p>
                      </div>

                      {/* Provider Info for calling */}
                      <div className="space-y-1">
                        <span className="font-bold text-indigo-900 uppercase tracking-wider block">
                          2. Provider Contact (Call Second)
                        </span>
                        <p className="font-bold text-sm text-slate-900">{provider?.full_name || 'Provider'}</p>
                        <p className="text-slate-600 flex items-center gap-1 font-mono">
                          <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                          <strong className="text-indigo-700">{provider?.phone || 'No phone'}</strong>
                        </p>
                        <p className="text-slate-500">Service: {req.listing?.title} ({formatPrice(req.listing?.price || 0)}/hr)</p>
                      </div>

                    </div>

                    {/* Schedule & Notes */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-slate-700">Requested Schedule:</span>
                        <span className="font-bold text-slate-900">{formatDate(req.requested_datetime)}</span>
                      </div>

                      {req.note && (
                        <div className="text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg max-w-lg">
                          <span className="font-bold text-slate-700">Client Note: </span>
                          "{req.note}"
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: USERS & PROVIDERS DIRECTORY */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {['all', 'client', 'provider', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                    userRoleFilter === r
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {r === 'all' ? 'All Roles' : `${r}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">User / Persona</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Phone Number</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProfiles.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {p.avatar_url ? (
                            <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span>{p.full_name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="leading-tight">{p.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{p.id}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`capitalize px-2 py-0.5 rounded text-[11px] font-bold border ${
                          p.role === 'admin'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : p.role === 'provider'
                            ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {p.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-800">{p.phone || 'N/A'}</td>
                      <td className="py-3.5 px-4">{p.location || 'Local'}</td>
                      <td className="py-3.5 px-4 text-slate-400">{formatDate(p.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: SERVICE LISTINGS MANAGEMENT */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((l) => (
              <div key={l.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                    {l.category}
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">{formatPrice(l.price)}/hr</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{l.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{l.description}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Provider: <strong>{l.provider?.full_name || 'Provider'}</strong></span>
                  <span className="text-slate-400">{l.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
