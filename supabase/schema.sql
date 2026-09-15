-- ==============================================================================
-- Service Marketplace Database Schema (Supabase PostgreSQL)
-- Roles: Client, Provider, Admin
-- Services: Babysitting, Teaching
-- Model: Trust-first Manual Coordination MVP
-- ==============================================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('client', 'provider', 'admin')),
  full_name text not null,
  phone text,
  location text,
  avatar_url text,
  bio text,
  created_at timestamptz default now()
);

-- 2. SERVICE LISTINGS TABLE
-- Note: Intentionally no unique constraint on provider_id so a provider 
-- can offer both babysitting and teaching services in future expansions without schema changes.
create table if not exists public.service_listings (
  id uuid default gen_random_uuid() primary key,
  provider_id uuid references public.profiles(id) on delete cascade not null,
  category text not null check (category in ('babysitting', 'teaching')),
  title text not null,
  description text,
  price numeric not null,
  availability text,
  location text,
  photo_url text,
  created_at timestamptz default now()
);

-- 3. REQUESTS TABLE
create table if not exists public.requests (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  listing_id uuid references public.service_listings(id) on delete cascade not null,
  requested_datetime timestamptz not null,
  note text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

-- 4. REVIEWS TABLE
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references public.requests(id) on delete cascade not null unique,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- ==============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, phone, location)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'location'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    phone = coalesce(excluded.phone, profiles.phone),
    location = coalesce(excluded.location, profiles.location);
  return new;
end;
$$ language plpgsql security definer;

-- Drop if exists and recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.service_listings enable row level security;
alter table public.requests enable row level security;
alter table public.reviews enable row level security;

-- Drop existing policies if any to ensure clean execution
drop policy if exists "profiles are viewable by everyone" on public.profiles;
drop policy if exists "users can update own profile" on public.profiles;
drop policy if exists "users can insert own profile" on public.profiles;
drop policy if exists "admin full access to profiles" on public.profiles;

drop policy if exists "listings are public" on public.service_listings;
drop policy if exists "providers manage own listings" on public.service_listings;
drop policy if exists "admin full access to listings" on public.service_listings;

drop policy if exists "clients see own requests" on public.requests;
drop policy if exists "clients create requests" on public.requests;
drop policy if exists "admin full access to requests" on public.requests;

drop policy if exists "reviews are public" on public.reviews;
drop policy if exists "client can review own completed request" on public.reviews;
drop policy if exists "admin full access to reviews" on public.reviews;
drop policy if exists "admin can delete reviews" on public.reviews;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- 1. Public read for all profiles
create policy "profiles are viewable by everyone" 
  on public.profiles for select 
  using (true);

-- 2. Authenticated user can create and update their own profile
create policy "users can insert own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- 3. Admin override: full access to manage all profiles (Users/Providers Directory CRUD)
create policy "admin full access to profiles" 
  on public.profiles for all 
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ------------------------------------------------------------------------------
-- SERVICE LISTINGS POLICIES
-- ------------------------------------------------------------------------------
-- 1. Public read for all listings
create policy "listings are public" 
  on public.service_listings for select 
  using (true);

-- 2. Providers manage their own listings
create policy "providers manage own listings" 
  on public.service_listings for all 
  using (auth.uid() = provider_id)
  with check (auth.uid() = provider_id);

-- 3. Admin override: full access to manage/moderate all listings (Listings Overview tab)
create policy "admin full access to listings" 
  on public.service_listings for all 
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ------------------------------------------------------------------------------
-- REQUESTS POLICIES
-- ------------------------------------------------------------------------------
-- 1. Clients see their own submitted requests
create policy "clients see own requests" 
  on public.requests for select 
  using (auth.uid() = client_id);

-- 2. Clients create requests
create policy "clients create requests" 
  on public.requests for insert 
  with check (auth.uid() = client_id);

-- 3. Admin override: full access to view, dispatch, update status, and manage all requests
create policy "admin full access to requests" 
  on public.requests for all 
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ------------------------------------------------------------------------------
-- REVIEWS POLICIES
-- ------------------------------------------------------------------------------
-- 1. Anyone can read reviews
create policy "reviews are public" 
  on public.reviews for select 
  using (true);

-- 2. Only the client who placed the completed request can create a review for it
create policy "client can review own completed request" 
  on public.reviews for insert 
  with check (
    exists (
      select 1 from public.requests 
      where id = request_id 
        and client_id = auth.uid() 
        and status = 'completed'
    )
  );

-- 3. Admin moderation override: DELETE-ONLY (for moderation/removal of inappropriate reviews).
-- Admin CANNOT insert or update review text or ratings to prevent fabrication.
create policy "admin can delete reviews" 
  on public.reviews for delete 
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION
-- ==============================================================================
-- 1. Create 'listing-photos' public storage bucket
insert into storage.buckets (id, name, public) 
values ('listing-photos', 'listing-photos', true)
on conflict (id) do nothing;

-- 2. Storage Policies
drop policy if exists "Public listing photos are accessible by all" on storage.objects;
create policy "Public listing photos are accessible by all" 
  on storage.objects for select 
  using (bucket_id = 'listing-photos');

drop policy if exists "Authenticated providers can upload listing photos" on storage.objects;
create policy "Authenticated providers can upload listing photos" 
  on storage.objects for insert 
  with check (
    bucket_id = 'listing-photos' 
    and auth.role() = 'authenticated'
  );

drop policy if exists "Authenticated providers can update/delete their own photos" on storage.objects;
create policy "Authenticated providers can update/delete their own photos" 
  on storage.objects for all 
  using (
    bucket_id = 'listing-photos' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Enable Realtime publication for requests
alter publication supabase_realtime add table public.requests;
