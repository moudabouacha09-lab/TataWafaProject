import React from 'react';
import { ShieldCheck, PhoneCall, HandCoins, UserCheck2 } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 my-8">
      <div className="max-w-3xl mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Trust-First & Manual Coordination MVP</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Safe, Personal Childcare & Teaching Support
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
          We prioritize child safety and trust above all. Our site coordinator directly verifies each request by phone with both parents and providers before any service begins.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl backdrop-blur-sm border border-white/5">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">1. Direct Phone Coordination</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              When you submit a request, our admin calls both parties to confirm schedules and expectations.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl backdrop-blur-sm border border-white/5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
            <UserCheck2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">2. In-Person ID Verification</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              For babysitting, official identification is reviewed face-to-face upon arrival at your doorstep.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl backdrop-blur-sm border border-white/5">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
            <HandCoins className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">3. Direct Cash / In-Person Pay</h4>
            <p className="text-xs text-slate-300 mt-0.5">
              No online card processing fees. You pay the provider directly upon completion of the service.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
