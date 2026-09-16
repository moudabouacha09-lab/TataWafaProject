import React from 'react';
import { RequestStatus } from '@/types';
import { CheckCircle2, Clock, PhoneCall, Check, XCircle } from 'lucide-react';

interface TimelineTrackerProps {
  status: RequestStatus;
}

export const TimelineTracker: React.FC<TimelineTrackerProps> = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-800 text-xs font-semibold">
        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
        <span>Cette demande a été annulée. Vous pouvez contacter l'administrateur ou sélectionner un autre prestataire.</span>
      </div>
    );
  }

  const steps = [
    {
      id: 1,
      title: '1. Demande transmise',
      desc: 'Enregistrée sur la plateforme',
      icon: Clock,
      completed: true,
      current: status === 'new'
    },
    {
      id: 2,
      title: '2. Coordination Téléphonique',
      desc: 'Appel de l\'administrateur',
      icon: PhoneCall,
      completed: status === 'in_progress' || status === 'completed',
      current: status === 'in_progress'
    },
    {
      id: 3,
      title: '3. Prestation effectuée',
      desc: 'Contrôle ID & Règlement espèces',
      icon: CheckCircle2,
      completed: status === 'completed',
      current: status === 'completed'
    }
  ];

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
        Progression de votre réservation
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`rounded-xl p-3 border transition-all ${
                step.current
                  ? 'bg-indigo-50/80 border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                  : step.completed
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                  : 'bg-white border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.completed
                      ? 'bg-emerald-600 text-white'
                      : step.current
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step.completed && !step.current ? <Check className="w-3.5 h-3.5" /> : step.id}
                </div>
                <span className="text-xs font-bold text-slate-900">{step.title}</span>
              </div>
              <p className="text-[11px] text-slate-500 pl-8">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
