'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ServiceRequest, RequestStatus } from '@/types';
import { DataStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { ReviewModal } from '@/components/ReviewModal';
import { StarRating } from '@/components/StarRating';
import { getStatusBadgeStyle, formatDate, formatPrice, getCategoryBadge } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  PhoneCall, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ShieldCheck,
  Baby,
  GraduationCap,
  ArrowRight
} from 'lucide-react';

export default function MyRequestsPage() {
  const { profile, user, role } = useAuth();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedReviewRequest, setSelectedReviewRequest] = useState<ServiceRequest | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const clientId = profile?.id || user?.id || 'usr_client_1';
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Client Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            My Service Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track your booking requests and leave reviews for completed services.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition"
        >
          <span>Find More Services</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All Requests' },
          { key: 'active', label: 'Active (New & In Progress)' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' },
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

      {/* Requests List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Loading your requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No requests found</h3>
          <p className="text-xs text-slate-500">
            {filterStatus === 'all'
              ? "You haven't submitted any service requests yet."
              : `No requests with status "${filterStatus}".`}
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
          >
            Browse Babysitters & Tutors
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
                  
                  {/* Provider & Listing Info */}
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
                        <span className="text-xs text-slate-500">Request #{req.id.slice(-6)}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {req.listing?.title || 'Service Listing'}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Provider: <strong>{provider?.full_name || 'Assigned Provider'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-medium block mb-0.5">Requested Date & Time</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {formatDate(req.requested_datetime)}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block mb-0.5">Service Rate & Payment</span>
                    <span className="font-bold text-slate-800">
                      {req.listing?.price ? formatPrice(req.listing.price) : '$25'}/hr • In-Person Cash
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block mb-0.5">Coordination Mode</span>
                    <span className="font-semibold text-indigo-900 flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
                      Admin Phone Verification
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {req.note && (
                  <div className="text-xs text-slate-600 bg-amber-50/50 border border-amber-200/60 rounded-xl p-3">
                    <span className="font-semibold text-amber-900">Your Note: </span>
                    {req.note}
                  </div>
                )}

                {/* Review status or Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  
                  {req.status === 'new' && (
                    <div className="text-xs text-slate-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      <span>Waiting for admin phone coordination with provider.</span>
                    </div>
                  )}

                  {req.status === 'in_progress' && (
                    <div className="text-xs text-blue-700 font-medium flex items-center gap-1.5">
                      <PhoneCall className="w-4 h-4 text-blue-600" />
                      <span>Coordinated! The provider has been scheduled for your appointment.</span>
                    </div>
                  )}

                  {req.status === 'completed' && (
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {req.review ? (
                        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-900">Your Review:</span>
                              <StarRating rating={req.review.rating} size="sm" />
                            </div>
                            <p className="text-xs text-emerald-800 mt-0.5">"{req.review.comment}"</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            Service completed! Please share your experience.
                          </span>
                          <button
                            onClick={() => setSelectedReviewRequest(req)}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
                          >
                            <Star className="w-3.5 h-3.5 fill-white" />
                            <span>Leave Rating & Review</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {req.status === 'cancelled' && (
                    <span className="text-xs text-rose-600 font-medium">
                      This request was cancelled. Feel free to browse other available providers.
                    </span>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
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
