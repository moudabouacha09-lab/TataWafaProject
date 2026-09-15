'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ServiceListing, Review } from '@/types';
import { DataStore } from '@/lib/store';
import { StarRating } from '@/components/StarRating';
import { RequestModal } from '@/components/RequestModal';
import { formatPrice, getCategoryBadge, formatDateShort } from '@/lib/utils';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Baby, 
  GraduationCap, 
  Calendar, 
  PhoneCall, 
  UserCheck2, 
  HandCoins,
  MessageSquare,
  Loader2,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [listing, setListing] = useState<ServiceListing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await DataStore.getListingById(id);
      if (data) {
        setListing(data);
        const revs = await DataStore.getReviewsForListing(id);
        setReviews(revs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleDataChange = () => {
      loadData();
    };

    window.addEventListener('sm_data_change', handleDataChange);
    return () => window.removeEventListener('sm_data_change', handleDataChange);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium">Loading service profile details...</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Service listing not found</h2>
        <p className="text-sm text-slate-500">The listing you are looking for might have been moved or removed.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Listings</span>
        </Link>
      </div>
    );
  }

  const badge = getCategoryBadge(listing.category);
  const provider = listing.provider;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Browse Listings</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Main Listing Info & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Hero Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Cover Image */}
            <div className="relative h-64 sm:h-80 w-full bg-slate-100">
              {listing.photo_url ? (
                <img
                  src={listing.photo_url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                  {listing.category === 'babysitting' ? <Baby className="w-20 h-20" /> : <GraduationCap className="w-20 h-20" />}
                </div>
              )}

              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm border ${badge.badgeClass} bg-white/95`}>
                  {listing.category === 'babysitting' ? (
                    <Baby className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                  )}
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Profile Header Details */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-200 border-2 border-indigo-100 shadow-sm shrink-0">
                    {provider?.avatar_url ? (
                      <img src={provider.avatar_url} alt={provider.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-xl font-bold">
                        {provider?.full_name?.charAt(0) || 'P'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                      {provider?.full_name || 'Verified Provider'}
                      <ShieldCheck className="w-5 h-5 text-emerald-600" title="Verified by site admin" />
                    </h1>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      {listing.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {listing.location}
                        </span>
                      )}
                      <span>•</span>
                      <StarRating
                        rating={listing.average_rating || 0}
                        count={listing.review_count || 0}
                        showCount
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {formatPrice(listing.price)}
                    <span className="text-xs font-normal text-slate-500 ml-1">/ hour</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200 inline-block mt-1">
                    Direct Cash / In-Person Pay
                  </span>
                </div>

              </div>

              {/* Title & Description */}
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {listing.title}
                </h2>
                <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {listing.description || 'No detailed description provided.'}
                </div>
              </div>

              {/* Provider Bio if present */}
              {provider?.bio && (
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <UserCheck2 className="w-4 h-4 text-indigo-600" />
                    About the Provider
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {provider.bio}
                  </p>
                </div>
              )}

              {/* Availability schedule */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex items-start gap-3">
                <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">Availability Schedule</h4>
                  <p className="text-xs text-indigo-800 font-medium mt-1">
                    {listing.availability || 'Flexible schedule. Coordinate specific hours via request form.'}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  Verified Client Reviews ({reviews.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reviews are written only by clients after service completion.
                </p>
              </div>

              <StarRating
                rating={listing.average_rating || 0}
                count={reviews.length}
                showCount
                size="md"
              />
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <p className="text-sm font-medium">No reviews posted yet.</p>
                <p className="text-xs text-slate-400">Be among the first to book and share your feedback after completion!</p>
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                          {rev.client?.full_name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {rev.client?.full_name || 'Verified Client'}
                          </p>
                          <p className="text-[10px] text-slate-400">{formatDateShort(rev.created_at)}</p>
                        </div>
                      </div>
                      <StarRating rating={rev.rating} size="sm" />
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-slate-700 leading-relaxed pl-9">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Request Action Card & Trust Box */}
        <div className="space-y-6">
          
          {/* Booking / Request Action Box */}
          <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-6">
            
            <div>
              <span className="text-xs font-semibold text-slate-500">Service Rate</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-0.5">
                {formatPrice(listing.price)}
                <span className="text-sm font-normal text-slate-500 ml-1">/ hour</span>
              </div>
            </div>

            {/* Request Button */}
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 group"
            >
              <Calendar className="w-4 h-4 group-hover:scale-110 transition" />
              <span>Request Service</span>
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-normal">
              No online payment or deposit required today. You will receive an in-app confirmation and our site coordinator will call you directly.
            </p>

            <hr className="border-slate-100" />

            {/* Safety & Manual Coordination Highlights */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                How this booking works
              </h4>

              <div className="flex items-start gap-2.5 text-xs text-slate-600">
                <PhoneCall className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong>1. Offline Phone Confirmation:</strong> Admin contacts you and the provider to arrange all schedule details.
                </span>
              </div>

              {listing.category === 'babysitting' && (
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <UserCheck2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>2. In-Person ID Check:</strong> Provider presents government photo ID directly at your home.
                  </span>
                </div>
              )}

              <div className="flex items-start gap-2.5 text-xs text-slate-600">
                <HandCoins className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>3. Direct Cash Payment:</strong> Pay the provider directly in cash upon completion. Zero middleman fees.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Request Modal */}
      <RequestModal
        listing={listing}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onRequestSubmitted={() => {
          loadData();
        }}
      />

    </div>
  );
}
