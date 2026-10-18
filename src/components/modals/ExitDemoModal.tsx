import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X, Baby, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';

export const ExitDemoModal: React.FC = () => {
  const {
    exitDemoModalOpen,
    closeExitDemoModal,
    exitDemoMode,
    profile,
  } = useApp();

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!exitDemoModalOpen) return null;

  const handleConfirmExit = async () => {
    setIsSubmitting(true);
    try {
      await exitDemoMode();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 relative my-8 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={closeExitDemoModal}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Exit Demo Mode
            </h2>
            <p className="text-xs text-stone-500">
              Switch from sample data to your child's record
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-stone-700 space-y-2">
          <p className="text-amber-950 font-medium leading-relaxed">
            You are currently exploring Red Book UK with sample data for{' '}
            <strong className="font-semibold text-amber-900">
              {profile?.preferredName || 'Baby Sarah'} (6 months old)
            </strong>
            .
          </p>
          <p className="text-stone-600 leading-relaxed">
            Exiting demo mode clears the sample records so you can start tracking your own child's personal health record.
          </p>
        </div>

        {/* Summary of actions */}
        <div className="space-y-2 mb-6 text-xs text-stone-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Removes sample growth, immunisation, and milestone logs</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Immediately opens setup to register your child's real details</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Your preferred unit settings and app configuration remain intact</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={closeExitDemoModal}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition-colors"
          >
            Keep Exploring Demo
          </button>
          <button
            type="button"
            onClick={handleConfirmExit}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-berry-700 hover:bg-berry-800 active:bg-berry-900 text-white font-semibold text-xs transition-colors shadow-sm inline-flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <span>Exiting...</span>
            ) : (
              <>
                <span>Exit Demo & Add Baby</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
