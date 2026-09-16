import React from 'react';
import { ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import { VerificationStatus } from '@/types';
import { getVerificationBadgeStyle } from '@/lib/utils';

interface VerificationBadgeProps {
  status?: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status = 'non_verifie', size = 'sm' }) => {
  const badge = getVerificationBadgeStyle(status);

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-4 py-1.5 gap-2'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span className={`inline-flex items-center font-bold rounded-full border shadow-sm ${badge.bg} ${sizeClasses[size]}`}>
      {badge.verified ? (
        <ShieldCheck className={`${iconSizes[size]} text-emerald-600 shrink-0`} />
      ) : status === 'en_attente_physique' ? (
        <Clock className={`${iconSizes[size]} text-amber-600 shrink-0`} />
      ) : (
        <AlertTriangle className={`${iconSizes[size]} text-slate-400 shrink-0`} />
      )}
      <span>{badge.label}</span>
    </span>
  );
};
