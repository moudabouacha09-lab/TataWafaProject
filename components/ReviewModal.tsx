'use client';

import React, { useState } from 'react';
import { ServiceRequest } from '@/types';
import { DataStore } from '@/lib/store';
import { StarRating } from './StarRating';
import { X, Star, MessageSquare, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
  request: ServiceRequest;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  request,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Please choose a rating between 1 and 5 stars.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await DataStore.createReview({
        request_id: request.id,
        rating,
        comment: comment.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        onReviewSubmitted();
        onClose();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review.');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Review Submitted!</h3>
            <p className="text-xs text-slate-500">
              Thank you for contributing to our community's trust and quality.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                Verified Service Review
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Rate your service with {request.listing?.provider?.full_name || 'Provider'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {request.listing?.title}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Interactive Star Rating */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Select Rating (1 to 5 Stars)
                </label>
                <div className="flex justify-center">
                  <StarRating
                    rating={rating}
                    size="lg"
                    interactive
                    onChange={(r) => setRating(r)}
                  />
                </div>
                <p className="text-xs font-medium text-amber-700">
                  {rating === 5 && 'Outstanding & Highly Recommended (5/5)'}
                  {rating === 4 && 'Great Experience (4/5)'}
                  {rating === 3 && 'Average Service (3/5)'}
                  {rating === 2 && 'Needs Improvement (2/5)'}
                  {rating === 1 && 'Unsatisfactory (1/5)'}
                </p>
              </div>

              {/* Written comment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  Written Review / Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share details about punctuality, care quality, communication, and professionalism..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-amber-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Post Review</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
