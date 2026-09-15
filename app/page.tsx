'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ServiceListing, ServiceCategory } from '@/types';
import { DataStore } from '@/lib/store';
import { ServiceCard } from '@/components/ServiceCard';
import { TrustBanner } from '@/components/TrustBanner';
import { 
  Baby, 
  GraduationCap, 
  Search, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Star, 
  ArrowRight,
  Filter,
  Sparkles,
  PhoneCall,
  Loader2
} from 'lucide-react';

export default function HomePage() {
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await DataStore.getListings({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        query: searchQuery || locationQuery || undefined,
      });

      // Filter by location additionally if specified
      let filtered = data;
      if (locationQuery) {
        filtered = filtered.filter(l => 
          l.location?.toLowerCase().includes(locationQuery.toLowerCase())
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
  }, [selectedCategory, searchQuery, locationQuery]);

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 pt-10 pb-16 sm:pt-16 sm:pb-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-indigo-100 text-xs font-semibold text-indigo-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Caregivers & Teachers • Phone-Coordinated Safety</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Trusted Babysitters & Academic Tutors Near You
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Find caring childcare professionals and expert tutors. Every service request is manually reviewed and coordinated by our team for complete peace of mind.
            </p>

            {/* Search & Location Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="bg-white p-2.5 rounded-2xl shadow-soft border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                
                <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-100">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search babysitter, math tutor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div className="flex items-center gap-2 px-3 py-2 w-full sm:w-1/2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Location / Neighborhood"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={fetchListings}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200 transition"
                >
                  Search
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Category Filter Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Available Service Providers</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Browse profiles, view past client reviews, and send a direct booking request.
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
              All Services ({listings.length})
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
              <span>Babysitting</span>
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
              <span>Teaching</span>
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-sm font-medium">Loading verified service listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No listings found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or clearing your filters to see all available caregivers and tutors.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setLocationQuery('');
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ServiceCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Trust & Safety Banner */}
        <TrustBanner />

        {/* How It Works 3-Step Walkthrough */}
        <div className="my-16 bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Safe & Simple MVP Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              How CareMatch Works
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              A transparent, manual-coordination model built specifically for personal childcare and tutoring trust.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Request a Service</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose a provider, pick your preferred date and time, and add a brief note. You’ll receive an instant in-app confirmation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">Admin Phone Coordination</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our site coordinator reviews the request and calls the provider and client by phone to verify details and confirm the match offline.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1.5">In-Person Care & Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Babysitters present ID upon arrival. Payment is cash/in-person upon completion. Once finished, leave a verified review!
              </p>
            </div>

          </div>
        </div>

        {/* Provider CTA */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Are you a Babysitter or Tutor?
            </h3>
            <p className="text-indigo-100 text-sm leading-relaxed">
              Join our trusted local community. Set your own hourly rate, availability, and get connected with verified local families without paying online commission fees.
            </p>
          </div>
          <Link
            href="/provider/listing"
            className="px-6 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-bold rounded-xl text-sm shadow-md transition whitespace-nowrap"
          >
            Create Your Provider Listing
          </Link>
        </div>

      </section>

    </div>
  );
}
