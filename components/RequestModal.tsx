'use client';

import React, { useState } from 'react';
import { ServiceListing } from '@/types';
import { useAuth } from '@/lib/auth-context';
import { DataStore } from '@/lib/store';
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  PhoneCall, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface RequestModalProps {
  listing: ServiceListing;
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted?: () => void;
}

export const RequestModal: React.FC<RequestModalProps> = ({
  listing,
  isOpen,
  onClose,
  onRequestSubmitted,
}) => {
  const { user, profile } = useAuth();
  
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('18:00');
  const [note, setNote] = useState('');
  const [clientPhone, setClientPhone] = useState(profile?.phone || '');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredDate) {
      setError('Please select a preferred date for the service.');
      return;
    }

    if (!user && !profile) {
      setError('Please log in or select a client persona to submit a request.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Save client phone if updated
      if (profile && clientPhone && clientPhone !== profile.phone) {
        await DataStore.saveProfile({ ...profile, phone: clientPhone });
      }

      const combinedDatetime = new Date(`${preferredDate}T${preferredTime}:00`).toISOString();

      await DataStore.createRequest({
        client_id: profile?.id || user?.id || 'usr_client_1',
        listing_id: listing.id,
        requested_datetime: combinedDatetime,
        note: note.trim() || undefined,
      });

      setSuccess(true);
      onRequestSubmitted?.();
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending your request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          /* In-App Confirmation View */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Request Sent Successfully!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your request for <strong>{listing.title}</strong> has been transmitted to our site coordinator in real time.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs uppercase tracking-wide">
                <PhoneCall className="w-4 h-4 text-indigo-600" />
                <span>Next Step: Offline Phone Coordination</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our site admin will review provider availability and call you directly at{' '}
                <strong className="text-slate-900">{clientPhone || profile?.phone || 'your phone number'}</strong>{' '}
                to confirm the time and introduction details.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Payment & ID checks are handled safely in person upon arrival.</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/my-requests"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md transition text-center"
              >
                Track In My Requests
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Request Form */
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                Service Request Form
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Request {listing.category === 'babysitting' ? 'Babysitting' : 'Tutoring'} Service
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                With {listing.provider?.full_name || 'Provider'} • {formatPrice(listing.price)}/hour
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Date and Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    required
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Client Contact Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                  Your Phone Number (for Admin Offline Coordination)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                />
              </div>

              {/* Short Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Short Note / Details for Coordinator
                </label>
                <textarea
                  rows={3}
                  placeholder={
                    listing.category === 'babysitting'
                      ? 'e.g., 2 kids (ages 4 and 7), friendly dog at home, needed for evening dinner.'
                      : 'e.g., Grade 11 algebra midterm preparation, needs help with polynomials.'
                  }
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                />
              </div>

              {/* Trust Notice Box */}
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 leading-relaxed space-y-1">
                <div className="font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Manual Coordination Guarantee
                </div>
                <p className="text-slate-600">
                  Submitting this request does not charge anything. Our site admin will phone you and the provider to arrange the visit. Payment is cash/in-person upon completion.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <span>Submit Service Request</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
