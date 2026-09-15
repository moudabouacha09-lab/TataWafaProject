import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">CareMatch Services</span>
            </div>
            <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
              A curated, two-sided marketplace connecting caring local families with verified babysitters and passionate academic tutors.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Offline phone coordination & face-to-face trust guarantee.</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Explore Categories</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/?category=babysitting" className="hover:text-indigo-600 transition">
                  Babysitting & Childcare
                </Link>
              </li>
              <li>
                <Link href="/?category=teaching" className="hover:text-indigo-600 transition">
                  Teaching & Math/Language Tutoring
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-indigo-600 transition">
                  All Verified Listings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Platform Operations</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/my-requests" className="hover:text-indigo-600 transition">
                  Track Service Request
                </Link>
              </li>
              <li>
                <Link href="/provider/listing" className="hover:text-indigo-600 transition">
                  Become a Care / Tutor Provider
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-indigo-600 text-amber-700 font-medium transition">
                  Admin Coordinator Hub
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} CareMatch MVP. Dedicated to trusted neighborhood care.</p>
          <div className="flex items-center gap-4">
            <span>Babysitting</span>
            <span>•</span>
            <span>Teaching</span>
            <span>•</span>
            <span>Manual Coordination</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
