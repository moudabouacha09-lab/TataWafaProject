export type UserRole = 'client' | 'provider' | 'admin';

export type ServiceCategory = 'babysitting' | 'teaching';

export type RequestStatus = 'new' | 'in_progress' | 'completed' | 'cancelled';

export type PriceUnit = 'séance' | 'mois' | 'heure';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone?: string | null;
  location?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: string;
}

export interface ServiceListing {
  id: string;
  provider_id: string;
  category: ServiceCategory;
  title: string;
  description: string | null;
  price: number;
  price_unit?: PriceUnit;
  availability: string | null;
  location: string | null;
  photo_url: string | null;
  created_at: string;
  // Computed / Joined relations
  provider?: Profile;
  average_rating?: number;
  review_count?: number;
}

export interface ServiceRequest {
  id: string;
  client_id: string;
  listing_id: string;
  requested_datetime: string;
  note: string | null;
  status: RequestStatus;
  created_at: string;
  // Joined relations
  client?: Profile;
  listing?: ServiceListing;
  review?: Review;
}

export interface Review {
  id: string;
  request_id: string;
  rating: number; // 1 to 5
  comment: string | null;
  created_at: string;
  client?: Profile;
}
