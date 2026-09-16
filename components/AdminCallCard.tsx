import React from 'react';
import { PhoneCall, MessageCircle, Clock, MapPin } from 'lucide-react';
import { ADMIN_CONTACT } from '@/lib/constants';

interface AdminCallCardProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const AdminCallCard: React.FC<AdminCallCardProps> = ({
  title = "Besoin d'aide ou d'une coordination immédiate ?",
  subtitle = "Notre coordinateur vous répond directement par téléphone 7j/7.",
  compact = false
}) => {
  return (
    <div className={`rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/50 p-5 shadow-sm ${compact ? 'space-y-3' : 'space-y-4'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
              <PhoneCall className="w-4 h-4" />
            </span>
            <span>{title}</span>
          </div>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          En ligne
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <a
          href={`tel:${ADMIN_CONTACT.phone}`}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Appeler le {ADMIN_CONTACT.phone}</span>
        </a>

        <a
          href={ADMIN_CONTACT.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Contacter sur WhatsApp</span>
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-indigo-100/70">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          {ADMIN_CONTACT.workingHours}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          Alger Centre
        </span>
      </div>
    </div>
  );
};
