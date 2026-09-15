'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { DataStore } from '@/lib/store';
import { ServiceListing, ServiceCategory } from '@/types';
import { 
  BookOpen, 
  Baby, 
  GraduationCap, 
  DollarSign, 
  Clock, 
  MapPin, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Info,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import Link from 'next/link';

export default function ProviderListingPage() {
  const { profile, user, role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [listingId, setListingId] = useState<string | null>(null);
  const [category, setCategory] = useState<ServiceCategory>('babysitting');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(25);
  const [availability, setAvailability] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  const providerId = profile?.id || user?.id || 'usr_provider_1';

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
          setAvailability(existing.availability || '');
          setLocation(existing.location || '');
          setPhotoUrl(existing.photo_url || '');
        } else {
          // Defaults for new listing
          setTitle('Vetted Childcare & Babysitting Service');
          setAvailability('Weekdays after 4 PM, Weekends all day');
          setLocation(profile?.location || 'Central City & Surrounding Areas');
          setPhotoUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [providerId, profile?.location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await DataStore.saveListing({
        id: listingId || undefined,
        provider_id: providerId,
        category,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        availability: availability.trim(),
        location: location.trim(),
        photo_url: photoUrl.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save listing.');
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Provider Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {listingId ? 'Edit Your Service Listing' : 'Publish Your Service Listing'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure your offering, hourly rates, and availability for parents and students.
          </p>
        </div>

        <Link
          href="/provider/profile"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition"
        >
          <span>View Public Profile</span>
        </Link>
      </div>

      {/* Manual Coordination Notice for Providers */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0">
          <PhoneCall className="w-5 h-5" />
        </div>
        <div className="text-xs text-indigo-950 space-y-1">
          <h4 className="font-bold text-sm">How Requests Reach You</h4>
          <p className="text-indigo-800 leading-relaxed">
            In this trust-first MVP, incoming service requests from clients are reviewed by our platform coordinator. The admin will call you directly on your registered phone (<strong>{profile?.phone || '+1 (555) 432-8765'}</strong>) to confirm each job.
          </p>
        </div>
      </div>

      {/* Main Form */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium">Loading listing information...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Listing successfully saved! It is now live in the search catalog.</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2 font-medium">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Service Category Choice */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Primary Service Category
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
                  <h4 className="font-bold text-sm text-slate-900">Babysitting & Childcare</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Infant care, toddler supervision, bedtime routines</p>
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
                  <h4 className="font-bold text-sm text-slate-900">Teaching & Tutoring</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Mathematics, sciences, language immersion, homework help</p>
                </div>
              </button>
            </div>
          </div>

          {/* Listing Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Listing Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Certified CPR Babysitter for Infants & Toddlers"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          {/* Price & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Hourly Rate ($ / hour)
              </label>
              <input
                type="number"
                required
                min={10}
                max={250}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Paid in-person in cash upon service completion.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Service Area / Neighborhood
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Westside, Downtown & North Hills"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              General Availability Schedule
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mon–Thu after 4:00 PM, Full day Saturdays"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Detailed Description & Experience
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe your qualifications, age groups you work with, certifications (CPR, First Aid, degrees), and what parents/students can expect."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none leading-relaxed"
            />
          </div>

          {/* Photo URL & Presets + Supabase Storage TODO Notice */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                Cover Photo (URL or Preset)
              </label>
              <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                MVP Mode: URL & Presets (Storage Bucket Staged)
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800">📌 Photo Upload Roadmap Note: </span>
              The <code className="bg-white px-1.5 py-0.5 rounded text-indigo-700 font-mono text-[11px] border">listing-photos</code> Supabase storage bucket policies are configured in <code className="bg-white px-1.5 py-0.5 rounded text-slate-700 font-mono text-[11px] border">supabase/schema.sql</code>. For this MVP, you can paste an image URL or choose one of our verified curated photos below.
            </div>

            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
            
            <div>
              <span className="text-[11px] text-slate-500 font-medium block mb-2">Or select a high-quality preset photo:</span>
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

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Listing...</span>
                </>
              ) : (
                <span>Save & Publish Listing</span>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
