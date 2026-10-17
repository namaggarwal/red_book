import React from 'react';
import { useApp } from '../../context/AppContext';
import { HealthEventRecord } from '../../types';
import { formatDisplayDate } from '../../utils/dateUtils';
import {
  HeartPulse,
  Plus,
  Thermometer,
  Pill,
  PhoneCall,
  AlertTriangle,
  Calendar,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const HealthEventsScreen: React.FC = () => {
  const { profile, records, openQuickAdd, openRecordDetail } = useApp();

  if (!profile) return null;

  const events = records
    .filter((r): r is HealthEventRecord => r.recordType === 'health_event')
    .sort((a, b) => new Date(b.startDate || b.createdAt).getTime() - new Date(a.startDate || a.createdAt).getTime());

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Health Events, Illnesses & Medicines
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
              Event Log
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Track colds, fevers, injuries, and historical medicine administration for {profile.preferredName}
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('event')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs sm:text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log Illness / Medicine</span>
        </button>
      </div>

      {/* Emergency Quick Action Box */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
          <span>NHS Emergency & Urgent Guidance</span>
        </div>
        <p className="leading-relaxed">
          This app is a personal record keeper and does not assess symptoms or provide medical diagnoses.
          If your baby has difficulty breathing, a high fever under 3 months, a rash that does not fade under a glass, or appears unusually floppy or unresponsive:
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <a
            href="tel:999"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-berry-800 text-white font-bold text-xs shadow-xs hover:bg-berry-900"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 999 for Emergency</span>
          </a>
          <a
            href="tel:111"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-stone-800 font-bold text-xs shadow-xs hover:bg-amber-100"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call NHS 111 (Free 24/7)</span>
          </a>
          <a
            href="https://111.nhs.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-amber-900 underline font-semibold ml-2 hover:text-amber-950"
          >
            NHS 111 Online Check
          </a>
        </div>
      </div>

      {/* Event Records List */}
      <div className="space-y-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            onClick={() => openRecordDetail(evt)}
            className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs hover:border-blue-200 transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      {evt.eventType}
                    </span>
                    <span className="text-xs text-stone-400">
                      Started {formatDisplayDate(evt.startDate)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900">{evt.title}</h3>
                </div>
              </div>

              {evt.temperatureCelsius && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs shrink-0">
                  <Thermometer className="w-4 h-4 text-rose-600" />
                  <span>{evt.temperatureCelsius}°C</span>
                </div>
              )}
            </div>

            {evt.symptoms && (
              <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                <span className="font-semibold text-stone-800">Observations: </span>
                {evt.symptoms}
              </p>
            )}

            {/* Medicines Given */}
            {evt.medicines && evt.medicines.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5 text-stone-400" />
                  Medicines Administered
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {evt.medicines.map((m) => (
                    <div
                      key={m.id}
                      className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-stone-900">{m.name}</span>
                        {m.reason && <p className="text-[11px] text-stone-500">{m.reason}</p>}
                      </div>
                      <span className="font-mono font-bold text-stone-800">
                        {m.dose} {m.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {evt.professionalContacted && (
              <div className="text-xs text-stone-600 flex items-center gap-2 pt-1 border-t border-stone-100">
                <span className="font-semibold text-stone-800">Contacted:</span>
                <span>{evt.professionalContacted}</span>
                {evt.outcome && <span className="text-stone-400">• {evt.outcome}</span>}
              </div>
            )}
          </div>
        ))}

        {events.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-white border border-stone-200 text-stone-400 text-xs">
            <HeartPulse className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="font-medium text-stone-600">No health events or illnesses recorded.</p>
            <p className="text-stone-400 mt-0.5">Use the "+ Add Record" button whenever you need to record fevers or medicines.</p>
          </div>
        )}
      </div>
    </div>
  );
};
