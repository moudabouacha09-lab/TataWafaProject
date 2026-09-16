import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RequestStatus, ServiceCategory, PriceUnit, VerificationStatus } from '@/types';
import { ADMIN_CONTACT } from './constants';

export const ADMIN_PHONE = ADMIN_CONTACT.phone;
export const ADMIN_EMAIL = ADMIN_CONTACT.email;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, unit: PriceUnit = 'séance'): string {
  const formattedNumber = new Intl.NumberFormat('fr-DZ', {
    maximumFractionDigits: 0,
  }).format(price);

  return `${formattedNumber} DA / ${unit}`;
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), "d MMMM yyyy 'à' HH:mm", { locale: fr });
  } catch (err) {
    return dateString;
  }
}

export function formatDateShort(dateString?: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'd MMM yyyy', { locale: fr });
  } catch (err) {
    return dateString;
  }
}

export function getStatusBadgeStyle(status: RequestStatus): { bg: string; text: string; label: string; step: number } {
  switch (status) {
    case 'new':
      return {
        bg: 'bg-amber-100 text-amber-800 border-amber-300',
        text: 'text-amber-700',
        label: '1. Transmise (En attente d\'appel)',
        step: 1
      };
    case 'in_progress':
      return {
        bg: 'bg-blue-100 text-blue-800 border-blue-300',
        text: 'text-blue-700',
        label: '2. En cours de coordination',
        step: 2
      };
    case 'completed':
      return {
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        text: 'text-emerald-700',
        label: '3. Prestation effectuée',
        step: 3
      };
    case 'cancelled':
      return {
        bg: 'bg-rose-100 text-rose-800 border-rose-300',
        text: 'text-rose-700',
        label: 'Demande annulée',
        step: 0
      };
    default:
      return {
        bg: 'bg-gray-100 text-gray-800 border-gray-300',
        text: 'text-gray-700',
        label: status,
        step: 1
      };
  }
}

export function getVerificationBadgeStyle(status?: VerificationStatus): { bg: string; text: string; label: string; verified: boolean } {
  switch (status) {
    case 'verifie_en_main_propre':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        text: 'text-emerald-700',
        label: 'Vérifié en main propre',
        verified: true
      };
    case 'en_attente_physique':
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        text: 'text-amber-700',
        label: 'En attente de vérification physique',
        verified: false
      };
    case 'suspendu':
      return {
        bg: 'bg-rose-50 text-rose-800 border-rose-300',
        text: 'text-rose-700',
        label: 'Dossier suspendu',
        verified: false
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
        text: 'text-slate-600',
        label: 'Non certifié',
        verified: false
      };
  }
}

export function getCategoryBadge(category: ServiceCategory) {
  if (category === 'babysitting') {
    return {
      label: 'Garde d\'enfants (Babysitting)',
      shortLabel: 'Garde d\'enfants',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: 'Baby',
    };
  }
  return {
    label: 'Cours & Soutien scolaire',
    shortLabel: 'Soutien scolaire',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'GraduationCap',
  };
}
