import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VaccinationRecord, VaccineStatus } from '../../types';
import { formatDisplayDate } from '../../utils/dateUtils';
import {
  Syringe,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Info,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VaccinationsScreen: React.FC = () => {
  const { profile, records, saveRecord, openQuickAdd, openRecordDetail } = useApp();
  const [filter, setFilter] = useState<'all' | 'planned' | 'completed'>('all');
  const [completingVax, setCompletingVax] = useState<VaccinationRecord | null>(null);

  // Quick complete form fields
  const [adminDate, setAdminDate] = useState(new Date().toISOString().split('T')[0]);
  const [givenBy, setGivenBy] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [reaction, setReaction] = useState('');

  if (!profile) return null;

  const vaccines = records
    .filter((r): r is VaccinationRecord => r.recordType === 'vaccination')
    .sort((a, b) => (a.ageRecommendedWeeks || 0) - (b.ageRecommendedWeeks || 0));

  const filteredVaccines = vaccines.filter((v) => {
    if (filter === 'planned') return v.status === 'planned';
    if (filter === 'completed') return v.status === 'completed';
    return true;
  });

  // Group vaccines by recommended age bracket
  const ageGroups: { [key: string]: VaccinationRecord[] } = {};
  filteredVaccines.forEach((v) => {
    const groupKey = v.ageRecommended || 'Other Vaccines';
    if (!ageGroups[groupKey]) ageGroups[groupKey] = [];
    ageGroups[groupKey].push(v);
  });

  const handleMarkCompleted = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingVax) return;

    const updated: VaccinationRecord = {
      ...completingVax,
      status: 'completed',
      recordDate: adminDate,
      givenBy: givenBy.trim() || undefined,
      batchNumber: batchNo.trim() || undefined,
      reaction: reaction.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };

    await saveRecord(updated);
    setCompletingVax(null);

    // Delightful celebration!
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8e203e', '#568062', '#4480af', '#f59e0b'],
      });
    } catch {}
  };

  const completedCount = vaccines.filter((v) => v.status === 'completed').length;
  const plannedCount = vaccines.filter((v) => v.status === 'planned').length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Vaccinations & Immunisations
            </h1>
            <span className="text-xs px-2 py-0.5 rounded-md font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
              NHS Routine Schedule
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Tracking vaccines for {profile.preferredName} based on the UK Childhood Immunisation Programme
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('vaccine')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs sm:text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Vaccine</span>
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Completed</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700">{completedCount}</span>
            <span className="text-xs text-stone-400">doses</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Upcoming Planned</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-amber-700">{plannedCount}</span>
            <span className="text-xs text-stone-400">doses</span>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-stone-500 block mb-1">Schedule Source</span>
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-berry-700" />
            <span>UK NHS 2024–2026</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          All ({vaccines.length})
        </button>
        <button
          onClick={() => setFilter('planned')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'planned'
              ? 'bg-berry-700 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Upcoming Planned ({plannedCount})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'completed'
              ? 'bg-emerald-700 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Vaccine Groups by Age */}
      <div className="space-y-6">
        {Object.entries(ageGroups).map(([ageGroup, groupVaxes]) => (
          <div key={ageGroup} className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-berry-700" />
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Recommended Age: {ageGroup}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groupVaxes.map((vax) => {
                const isCompleted = vax.status === 'completed';
                return (
                  <div
                    key={vax.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCompleted
                        ? 'bg-white border-stone-200 shadow-xs'
                        : 'bg-ivory-50/70 border-stone-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                          ) : (
                            <Clock className="w-5 h-5 text-amber-700" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900">
                            {vax.vaccineName}
                          </h4>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {isCompleted ? 'Administered' : 'Planned / Due'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => openRecordDetail(vax)}
                        className="text-stone-400 hover:text-stone-700 text-xs"
                      >
                        Details
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 mb-3">
                      <span className="font-semibold text-stone-700">Protects against: </span>
                      {vax.diseaseTarget}
                    </p>

                    {isCompleted ? (
                      <div className="pt-2 border-t border-stone-100 text-xs text-stone-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Date Given:</span>
                          <span className="font-semibold text-stone-800">
                            {formatDisplayDate(vax.recordDate)}
                          </span>
                        </div>
                        {vax.givenBy && (
                          <div className="flex justify-between">
                            <span>Given By:</span>
                            <span className="text-stone-700">{vax.givenBy}</span>
                          </div>
                        )}
                        {vax.batchNumber && (
                          <div className="flex justify-between">
                            <span>Batch No:</span>
                            <span className="font-mono text-stone-700">{vax.batchNumber}</span>
                          </div>
                        )}
                        {vax.reaction && (
                          <div className="pt-1 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded">
                            <span className="font-semibold">Observation: </span>
                            {vax.reaction}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                        <span className="text-xs text-stone-500">
                          Due approx: {formatDisplayDate(vax.recordDate)}
                        </span>
                        <button
                          onClick={() => {
                            setCompletingVax(vax);
                            setAdminDate(new Date().toISOString().split('T')[0]);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs transition-colors shadow-2xs"
                        >
                          Mark as Given
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Mark Administered Modal */}
      {completingVax && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Confirm Vaccine Administered
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Recording completion for {completingVax.vaccineName}
            </p>

            <form onSubmit={handleMarkCompleted} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Date Administered
                </label>
                <input
                  type="date"
                  required
                  value={adminDate}
                  onChange={(e) => setAdminDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Given By / Surgery (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nurse Sarah, Highbury Practice"
                  value={givenBy}
                  onChange={(e) => setGivenBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Batch Number (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. LOT-4821A"
                  value={batchNo}
                  onChange={(e) => setBatchNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Any Immediate Reaction / Notes (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Calpol given for fever prophylaxis"
                  value={reaction}
                  onChange={(e) => setReaction(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCompletingVax(null)}
                  className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-berry-700 hover:bg-berry-800 text-white font-semibold text-xs shadow-sm"
                >
                  Save as Completed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Schedule Disclaimer */}
      <div className="p-3.5 rounded-xl bg-ivory-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-berry-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-stone-800">NHS UK Immunisation Reference: </span>
          Schedule adheres to GOV.UK and NHS guidelines. Vaccines should always be administered and confirmed by registered healthcare professionals at your GP surgery or health clinic.
        </div>
      </div>
    </div>
  );
};
