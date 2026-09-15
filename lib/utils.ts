import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';
import { RequestStatus, ServiceCategory } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  } catch (err) {
    return dateString;
  }
}

export function formatDateShort(dateString?: string | null): string {
  if (!dateString) return 'N/A';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (err) {
    return dateString;
  }
}

export function getStatusBadgeStyle(status: RequestStatus): { bg: string; text: string; label: string } {
  switch (status) {
    case 'new':
      return {
        bg: 'bg-amber-100 text-amber-800 border-amber-300',
        text: 'text-amber-700',
        label: 'New Request',
      };
    case 'in_progress':
      return {
        bg: 'bg-blue-100 text-blue-800 border-blue-300',
        text: 'text-blue-700',
        label: 'In Coordination',
      };
    case 'completed':
      return {
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        text: 'text-emerald-700',
        label: 'Completed',
      };
    case 'cancelled':
      return {
        bg: 'bg-rose-100 text-rose-800 border-rose-300',
        text: 'text-rose-700',
        label: 'Cancelled',
      };
    default:
      return {
        bg: 'bg-gray-100 text-gray-800 border-gray-300',
        text: 'text-gray-700',
        label: status,
      };
  }
}

export function getCategoryBadge(category: ServiceCategory) {
  if (category === 'babysitting') {
    return {
      label: 'Babysitting',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: 'Baby',
    };
  }
  return {
    label: 'Teaching & Tutoring',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'GraduationCap',
  };
}
