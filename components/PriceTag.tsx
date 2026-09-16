import React from 'react';
import { PriceUnit } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Coins } from 'lucide-react';

interface PriceTagProps {
  price: number;
  unit?: PriceUnit;
  size?: 'sm' | 'md' | 'lg';
  showCashBadge?: boolean;
}

export const PriceTag: React.FC<PriceTagProps> = ({ 
  price, 
  unit = 'séance', 
  size = 'md',
  showCashBadge = false
}) => {
  const formatted = formatPrice(price, unit);

  const sizeClasses = {
    sm: 'text-xs font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-2xl sm:text-3xl font-black'
  };

  return (
    <div className="inline-flex flex-col items-start">
      <div className={`text-slate-900 flex items-center gap-1.5 ${sizeClasses[size]}`}>
        <Coins className="w-4 h-4 text-amber-500 shrink-0" />
        <span>{formatted}</span>
      </div>
      {showCashBadge && (
        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-0.5">
          Règlement en espèces sur place
        </span>
      )}
    </div>
  );
};
