import React, { useState } from 'react';
import { PhoneCall, AlertTriangle, X, ChevronRight } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-1 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Parent record only. For urgent medical concerns call NHS 111 or 999.</span>
        </div>
        <button
          onClick={() => setCollapsed(false)}
          className="text-amber-800 underline hover:text-amber-950 font-medium ml-2"
        >
          Details
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-stone-700">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start sm:items-center gap-2">
          <div className="p-1 rounded bg-amber-100 text-amber-800 shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-stone-900">Personal Health Record: </span>
            <span>
              This is a parent-maintained digital companion. It is not an official NHS record and does not provide medical diagnosis.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <a
            href="tel:111"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-amber-300 text-stone-800 font-semibold hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <PhoneCall className="w-3 h-3 text-emerald-600" />
            <span>NHS 111</span>
          </a>
          <a
            href="tel:999"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-berry-700 text-white font-semibold hover:bg-berry-800 transition-colors shadow-2xs"
          >
            <span>999 Emergency</span>
          </a>
          <button
            onClick={() => setCollapsed(true)}
            className="text-stone-400 hover:text-stone-700 p-1"
            title="Collapse guidance"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
