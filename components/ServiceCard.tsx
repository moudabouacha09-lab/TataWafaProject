import React from 'react';
import Link from 'next/link';
import { ServiceListing } from '@/types';
import { StarRating } from './StarRating';
import { formatPrice, getCategoryBadge } from '@/lib/utils';
import { MapPin, Clock, ShieldCheck, Baby, GraduationCap, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  listing: ServiceListing;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ listing }) => {
  const badge = getCategoryBadge(listing.category);
  const provider = listing.provider;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Photo de couverture */}
      <div className="relative h-48 sm:h-52 w-full bg-slate-100 overflow-hidden">
        {listing.photo_url ? (
          <img
            src={listing.photo_url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
            {listing.category === 'babysitting' ? <Baby className="w-16 h-16" /> : <GraduationCap className="w-16 h-16" />}
          </div>
        )}

        {/* Badge de catégorie */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm border ${badge.badgeClass} bg-white/95`}>
            {listing.category === 'babysitting' ? (
              <Baby className="w-3.5 h-3.5 text-indigo-600" />
            ) : (
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            )}
            {badge.label}
          </span>
        </div>

        {/* Tarif en DA */}
        <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          {formatPrice(listing.price, listing.price_unit || 'séance')}
        </div>
      </div>

      {/* Contenu de la fiche */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Info Prestataire */}
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-100">
              {provider?.avatar_url ? (
                <img src={provider.avatar_url} alt={provider.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-xs font-bold">
                  {provider?.full_name?.charAt(0) || 'P'}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                {provider?.full_name || 'Prestataire'}
                <span title="Vérification physique effectuée">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </span>
              </p>
              {listing.location && (
                <p className="text-[11px] text-slate-500 truncate flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {listing.location}
                </p>
              )}
            </div>
          </div>

          {/* Titre de l'annonce */}
          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
            {listing.title}
          </h3>

          {/* Description */}
          {listing.description && (
            <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
              {listing.description}
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 space-y-3">
          {/* Disponibilités */}
          {listing.availability && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{listing.availability}</span>
            </div>
          )}

          {/* Avis + Bouton d'action */}
          <div className="flex items-center justify-between pt-1">
            <StarRating
              rating={listing.average_rating || 0}
              count={listing.review_count || 0}
              showCount
              size="sm"
            />

            <Link
              href={`/services/${listing.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white text-xs font-semibold transition shadow-sm"
            >
              <span>Voir & Réserver</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
