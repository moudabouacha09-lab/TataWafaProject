'use client';

import { 
  Profile, 
  ServiceListing, 
  ServiceRequest, 
  Review, 
  RequestStatus, 
  UserRole 
} from '@/types';
import { 
  INITIAL_PROFILES, 
  INITIAL_LISTINGS, 
  INITIAL_REQUESTS, 
  INITIAL_REVIEWS 
} from './mock-data';
import { createClient, isSupabaseConfigured } from './supabase/client';

const STORAGE_KEYS = {
  PROFILES: 'sm_profiles_v1',
  LISTINGS: 'sm_listings_v1',
  REQUESTS: 'sm_requests_v1',
  REVIEWS: 'sm_reviews_v1',
};

// Helper to get from local storage safely (Demo mode only)
function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('sm_data_change', { detail: { key } }));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
}

export class DataStore {
  // --------------------------------------------------------------------------
  // PROFILES
  // --------------------------------------------------------------------------
  static async getProfiles(role?: UserRole): Promise<Profile[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (!supabase) return [];
      let query = supabase.from('profiles').select('*');
      if (role) query = query.eq('role', role);
      const { data, error } = await query;
      if (error) {
        console.error('Supabase getProfiles error:', error);
        return [];
      }
      return (data || []) as Profile[];
    }

    // Demo Mode
    const profiles = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    return role ? profiles.filter(p => p.role === role) : profiles;
  }

  static async getProfileById(id: string): Promise<Profile | null> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (!supabase) return null;
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
      if (error) {
        console.error('Supabase getProfileById error:', error);
        return null;
      }
      return data as Profile | null;
    }

    // Demo Mode
    const profiles = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    return profiles.find(p => p.id === id) || null;
  }

  static async saveProfile(profile: Profile): Promise<Profile> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.from('profiles').upsert(profile).select().single();
        if (error) {
          console.error('Supabase saveProfile error:', error);
          throw error;
        }
        return data as Profile;
      }
    }

    // Demo Mode
    const profiles = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    const index = profiles.findIndex(p => p.id === profile.id);
    let updated: Profile[];
    if (index >= 0) {
      updated = [...profiles];
      updated[index] = { ...updated[index], ...profile };
    } else {
      updated = [profile, ...profiles];
    }
    setLocal(STORAGE_KEYS.PROFILES, updated);
    return profile;
  }

  // --------------------------------------------------------------------------
  // SERVICE LISTINGS
  // --------------------------------------------------------------------------
  static async getListings(filters?: { category?: string; query?: string }): Promise<ServiceListing[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (!supabase) return [];
      
      let q = supabase.from('service_listings').select(`
        *,
        provider:profiles(*)
      `).order('created_at', { ascending: false });

      if (filters?.category && filters.category !== 'all') {
        q = q.eq('category', filters.category);
      }

      const { data, error } = await q;
      if (error) {
        console.error('Supabase getListings error:', error);
        return [];
      }

      const listings = (data || []) as ServiceListing[];

      // Compute reviews and ratings via Supabase reviews
      const { data: revs } = await supabase.from('reviews').select('request_id, rating');
      const { data: reqs } = await supabase.from('requests').select('id, listing_id');

      const reviewsList = revs || [];
      const requestsList = reqs || [];

      return listings.map(item => {
        const itemRequestIds = requestsList.filter(r => r.listing_id === item.id).map(r => r.id);
        const itemReviews = reviewsList.filter(rev => itemRequestIds.includes(rev.request_id));
        const ratingCount = itemReviews.length;
        const avgRating = ratingCount > 0 
          ? itemReviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount 
          : 0;

        return {
          ...item,
          review_count: ratingCount,
          average_rating: avgRating > 0 ? Number(avgRating.toFixed(1)) : undefined,
        };
      });
    }

    // Demo Mode
    let listings = getLocal<ServiceListing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    const profiles = await this.getProfiles();
    const reviews = await this.getAllReviews();
    const requests = await this.getRequestsRaw();

    listings = listings.map(listing => ({
      ...listing,
      provider: profiles.find(p => p.id === listing.provider_id) || {
        id: listing.provider_id,
        role: 'provider',
        full_name: 'Registered Provider',
        location: listing.location,
      }
    }));

    if (filters?.category && filters.category !== 'all') {
      listings = listings.filter(l => l.category === filters.category);
    }
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      listings = listings.filter(l => 
        l.title.toLowerCase().includes(q) || 
        (l.description && l.description.toLowerCase().includes(q)) ||
        (l.location && l.location.toLowerCase().includes(q)) ||
        (l.provider?.full_name && l.provider.full_name.toLowerCase().includes(q))
      );
    }

    return listings.map(item => {
      const itemRequestIds = requests.filter(r => r.listing_id === item.id).map(r => r.id);
      const itemReviews = reviews.filter(rev => itemRequestIds.includes(rev.request_id));
      const ratingCount = itemReviews.length;
      const avgRating = ratingCount > 0 
        ? itemReviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount 
        : 0;

      return {
        ...item,
        review_count: ratingCount,
        average_rating: avgRating > 0 ? Number(avgRating.toFixed(1)) : undefined,
      };
    });
  }

  static async getListingById(id: string): Promise<ServiceListing | null> {
    const all = await this.getListings();
    return all.find(l => l.id === id) || null;
  }

  static async getProviderListings(providerId: string): Promise<ServiceListing[]> {
    const all = await this.getListings();
    return all.filter(l => l.provider_id === providerId);
  }

  static async getProviderListing(providerId: string): Promise<ServiceListing | null> {
    const listings = await this.getProviderListings(providerId);
    return listings.length > 0 ? listings[0] : null;
  }

  static async saveListing(listing: Partial<ServiceListing> & { provider_id: string }): Promise<ServiceListing> {
    const now = new Date().toISOString();
    const completeListing: ServiceListing = {
      id: listing.id || `lst_${Date.now()}`,
      provider_id: listing.provider_id,
      category: listing.category || 'babysitting',
      title: listing.title || 'Service Proposé',
      description: listing.description || '',
      price: listing.price || 1500,
      price_unit: listing.price_unit || 'séance',
      availability: listing.availability || 'Flexible',
      location: listing.location || 'Alger Centre',
      photo_url: listing.photo_url || null,
      created_at: listing.created_at || now,
    };

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.from('service_listings').upsert(completeListing).select().single();
        if (error) {
          console.error('Supabase saveListing error:', error);
          throw error;
        }
        return data as ServiceListing;
      }
    }

    // Demo Mode
    const listings = getLocal<ServiceListing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    const idx = listings.findIndex(l => l.id === completeListing.id);
    let updated: ServiceListing[];
    if (idx >= 0) {
      updated = [...listings];
      updated[idx] = { ...updated[idx], ...completeListing };
    } else {
      updated = [completeListing, ...listings];
    }
    setLocal(STORAGE_KEYS.LISTINGS, updated);
    return completeListing;
  }

  // --------------------------------------------------------------------------
  // SERVICE REQUESTS
  // --------------------------------------------------------------------------
  private static async getRequestsRaw(): Promise<ServiceRequest[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        const { data } = await supabase.from('requests').select('*');
        return (data || []) as ServiceRequest[];
      }
      return [];
    }
    return getLocal<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }

  static async getRequests(options?: { role?: UserRole; userId?: string }): Promise<ServiceRequest[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (!supabase) return [];

      let q = supabase.from('requests').select(`
        *,
        client:profiles!requests_client_id_fkey(*),
        listing:service_listings!requests_listing_id_fkey(
          *,
          provider:profiles!service_listings_provider_id_fkey(*)
        ),
        review:reviews(*)
      `).order('created_at', { ascending: false });

      if (options?.role === 'client' && options.userId) {
        q = q.eq('client_id', options.userId);
      }

      const { data, error } = await q;
      if (error) {
        console.error('Supabase getRequests error:', error);
        return [];
      }
      return (data || []) as ServiceRequest[];
    }

    // Demo Mode
    const listings = await this.getListings();
    const profiles = await this.getProfiles();
    const reviews = await this.getAllReviews();
    const requests = getLocal<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);

    let hydrated = requests.map(req => {
      const listing = listings.find(l => l.id === req.listing_id);
      const client = profiles.find(p => p.id === req.client_id);
      const review = reviews.find(r => r.request_id === req.id);
      return {
        ...req,
        client,
        listing,
        review,
      };
    });

    if (options?.role === 'client' && options.userId) {
      hydrated = hydrated.filter(r => r.client_id === options.userId);
    } else if (options?.role === 'provider' && options.userId) {
      hydrated = hydrated.filter(r => r.listing?.provider_id === options.userId);
    }

    return hydrated.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async createRequest(data: {
    client_id: string;
    listing_id: string;
    requested_datetime: string;
    note?: string;
  }): Promise<ServiceRequest> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        const { data: created, error } = await supabase.from('requests').insert({
          client_id: data.client_id,
          listing_id: data.listing_id,
          requested_datetime: data.requested_datetime,
          note: data.note,
          status: 'new',
        }).select().single();

        if (error) {
          console.error('Supabase createRequest error:', error);
          throw error;
        }
        return created as ServiceRequest;
      }
    }

    // Demo Mode
    const newReq: ServiceRequest = {
      id: `req_${Date.now()}`,
      client_id: data.client_id,
      listing_id: data.listing_id,
      requested_datetime: data.requested_datetime,
      note: data.note || null,
      status: 'new',
      created_at: new Date().toISOString(),
    };

    const current = getLocal<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    const updated = [newReq, ...current];
    setLocal(STORAGE_KEYS.REQUESTS, updated);
    return newReq;
  }

  static async updateRequestStatus(requestId: string, status: RequestStatus): Promise<boolean> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        const { error } = await supabase
          .from('requests')
          .update({ status })
          .eq('id', requestId);
        if (error) {
          console.error('Supabase updateRequestStatus error:', error);
          return false;
        }
        return true;
      }
    }

    // Demo Mode
    const current = getLocal<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    const index = current.findIndex(r => r.id === requestId);
    if (index >= 0) {
      current[index].status = status;
      setLocal(STORAGE_KEYS.REQUESTS, [...current]);
      return true;
    }
    return false;
  }

  // --------------------------------------------------------------------------
  // REVIEWS
  // --------------------------------------------------------------------------
  static async getAllReviews(): Promise<Review[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        const { data, error } = await supabase.from('reviews').select('*');
        if (error) return [];
        return (data || []) as Review[];
      }
      return [];
    }
    return getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }

  static async getReviewsForListing(listingId: string): Promise<Review[]> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        const { data: reqs } = await supabase.from('requests').select('id').eq('listing_id', listingId);
        const reqIds = (reqs || []).map(r => r.id);
        if (reqIds.length === 0) return [];

        const { data: revs } = await supabase.from('reviews').select(`
          *,
          request:requests(
            client:profiles!requests_client_id_fkey(*)
          )
        `).in('request_id', reqIds).order('created_at', { ascending: false });

        return (revs || []).map((r: any) => ({
          ...r,
          client: r.request?.client,
        })) as Review[];
      }
      return [];
    }

    // Demo Mode
    const requests = await this.getRequestsRaw();
    const reviews = await this.getAllReviews();
    const profiles = await this.getProfiles();

    const matchingRequests = requests.filter(r => r.listing_id === listingId);
    const requestMap = new Map(matchingRequests.map(r => [r.id, r]));

    return reviews
      .filter(rev => requestMap.has(rev.request_id))
      .map(rev => {
        const req = requestMap.get(rev.request_id);
        const client = req ? profiles.find(p => p.id === req.client_id) : undefined;
        return { ...rev, client };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async getReviewsForProvider(providerId: string): Promise<Review[]> {
    if (isSupabaseConfigured()) {
      const listings = await this.getProviderListings(providerId);
      const listingIds = listings.map(l => l.id);
      if (listingIds.length === 0) return [];

      const supabase = createClient();
      if (supabase) {
        const { data: reqs } = await supabase.from('requests').select('id').in('listing_id', listingIds);
        const reqIds = (reqs || []).map(r => r.id);
        if (reqIds.length === 0) return [];

        const { data: revs } = await supabase.from('reviews').select(`
          *,
          request:requests(
            client:profiles!requests_client_id_fkey(*)
          )
        `).in('request_id', reqIds).order('created_at', { ascending: false });

        return (revs || []).map((r: any) => ({
          ...r,
          client: r.request?.client,
        })) as Review[];
      }
      return [];
    }

    // Demo Mode
    const listings = await this.getListings();
    const providerListingIds = listings.filter(l => l.provider_id === providerId).map(l => l.id);
    const requests = await this.getRequestsRaw();
    const reviews = await this.getAllReviews();
    const profiles = await this.getProfiles();

    const matchingRequests = requests.filter(r => providerListingIds.includes(r.listing_id));
    const requestMap = new Map(matchingRequests.map(r => [r.id, r]));

    return reviews
      .filter(rev => requestMap.has(rev.request_id))
      .map(rev => {
        const req = requestMap.get(rev.request_id);
        const client = req ? profiles.find(p => p.id === req.client_id) : undefined;
        return { ...rev, client };
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async createReview(data: { request_id: string; rating: number; comment: string }): Promise<Review> {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      if (supabase) {
        const { data: created, error } = await supabase.from('reviews').insert({
          request_id: data.request_id,
          rating: data.rating,
          comment: data.comment,
        }).select().single();

        if (error) {
          console.error('Supabase createReview error:', error);
          throw error;
        }
        return created as Review;
      }
    }

    // Demo Mode
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      request_id: data.request_id,
      rating: data.rating,
      comment: data.comment,
      created_at: new Date().toISOString(),
    };

    const current = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const filtered = current.filter(r => r.request_id !== data.request_id);
    const updated = [newReview, ...filtered];
    setLocal(STORAGE_KEYS.REVIEWS, updated);
    return newReview;
  }

  // --------------------------------------------------------------------------
  // RESET DATA HELPER (Demo mode only)
  // --------------------------------------------------------------------------
  static resetToDemoData() {
    if (isSupabaseConfigured()) return;
    setLocal(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
    setLocal(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    setLocal(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    setLocal(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  }
}
